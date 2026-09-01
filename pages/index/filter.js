// pages/index/filter.js
const app = getApp()
import * as echarts from '../../ec-canvas/echarts';

Page({
  data: {
    // 搜索
    keywords: '',
    // 筛选条件
    marketList: [{ id: '', name: '不限' }, { id: '中国', name: '中国' }, { id: '全球', name: '全球' }],
    lxList: [{ id: '', name: '不限' }, { id: '零售', name: '零售' }, { id: '出货', name: '出货' }],
    xlList: [{ id: '1', name: '销量' }, { id: '2', name: '销额' }],
    periodList: [{ id: '1', name: '月度' }, { id: '2', name: '季度' }],
    ytdList: [{ id: '0', name: '当期' }, { id: '1', name: '年累计' }],
    // 顶层品类(组) 下拉：由后台首页菜单绑定读入，替代硬编码
    typeList: [],
    // 时间选项(月度/季度平铺)
    timeList: [],
    // 选中值
    selMarket: '',
    selLx: '',
    selXl: '1',
    selXlName: '销量',
    selType: '',
    selTypeName: '',
    selGroup: '',
    selPeriod: '1',
    selYear: '',
    selMonth: '',
    selQuarter: '',
    timeIdx: 0,
    selTimeName: '',
    ytd: 0,
    needSnap: false,
    ver: '1.4.2',
    marketIdx: 0,
    lxIdx: 0,
    typeIdx: 0,
    xlIdx: 0,
    ytdIdx: 0,
    marketDisp: '不限',
    lxDisp: '不限',
    typeDisp: '请选择',
    xlDisp: '销量',
    timeDisp: '',

    empty: false,
    xqData: [],
    subRows: [],
    tvsGroups: [],
    subMode: 'yoy',
    tvsYears: {},    // { 'sub_group_key': [期数列表] } e.g. '9-m', '9-q'
    tvsSelYear: {},  // { 'sub_group_key': 选中期数 }
    tvsSelYearIdx: {}, // { 'sub_group_key': 选中索引 }
    ec: { lazyLoad: true },
    ec2: { lazyLoad: true },
    ec3: { lazyLoad: true },
    ec4: { lazyLoad: true },
    chart1x: [],
    chart1y: [],
    chart2x: [],
    chart2y: [],
    chart3: [],
    chart4: [],
    arr_sj2_dw: '万台',
    tips: ''
  },

  onLoad(options) {
    // 可带初始品类
    if (options && options.type) {
      this.setData({ selType: options.type })
      const q = ['5', '6', '7', '8', '18']
      if (q.indexOf(options.type) >= 0) {
        this.setData({ selPeriod: '2' })
      }
    }
    // 时间下拉按当前月/季构建；首次加载自动吸附到最新有数据时间
    this.buildTimeList(this.data.selPeriod)
    this.setData({ needSnap: true })
  },

  buildTimeList(period) {
    const now = new Date().getFullYear()
    const timeList = []
    let curIdx = 0
    let curMonth = String(new Date().getMonth() + 1)
    let curQuarter = '1'
    for (let y = now; y >= now - 4; y--) {
      const yr = String(y)
      if (period === '2') {
        for (let q = 1; q <= 4; q++) {
          const item = { id: yr + 'Q' + q, name: y + '年 Q' + q, year: yr, period: '2', quarter: String(q) }
          timeList.push(item)
        }
      } else {
        for (let m = 12; m >= 1; m--) {
          const item = { id: yr + '.' + m, name: y + '年' + m + '月', year: yr, period: '1', month: String(m) }
          timeList.push(item)
        }
      }
    }
    // 默认定位当前日历月/季
    const nowY = String(now)
    timeList.forEach((it, i) => {
      if (period === '2' && it.year === nowY && it.quarter === curQuarter) curIdx = i
      if (period !== '2' && it.year === nowY && it.month === curMonth) curIdx = i
    })
    this.setData({
      timeList,
      timeIdx: curIdx,
      selTimeName: timeList[curIdx] ? timeList[curIdx].name : '',
      selYear: nowY,
      selMonth: curMonth,
      selQuarter: curQuarter
    })
  },

  onShow() {
    app.checkws()
    this.initData()
  },

  onReady() {
    this.barComp = this.selectComponent('#mychart-dom-bar')
    this.barComp2 = this.selectComponent('#mychart-dom-bar2')
    this.barComp3 = this.selectComponent('#mychart-dom-bar3')
  },

    // 初始化品类组 + 加载数据
  initData() {
    const that = this
    app.checkws()
    const userData = wx.getStorageSync('userData')
    if (!userData || !userData.id) {
      wx.showModal({
        title: '提示',
        content: '请先登录',
        showCancel: false,
        success() {
          wx.switchTab({ url: '/pages/user/user' })
        }
      })
      return
    }
    // 品类组下拉读后台 getindexmenu（含每个菜单绑定的品类），前端不写死
    wx.request({
      url: app.globalData.siteUrl + '/Wxapi/getindexmenu',
      success(res) {
        const dl = (res.data && res.data.datalist) || []
        const tl = dl.map(m => ({ mid: m.id, id: m.type, name: m.name || ('组'+m.id), types: m.types || [] }))
        // 若已带初始品类(从首页菜单来)，回填映射到的组
        let selTypeName = ''
        let typeIdx = 0
        let selGroup = ''
        // 优先：菜单主品类即当前品类（如商务办公→智能音箱）
        tl.forEach((t, i) => {
            if (selGroup) return
            if (t.id === String(that.data.selType)) {
                selTypeName = t.name
                typeIdx = i
                selGroup = String(t.mid)
            }
        })
        // 其次：绑定品类含当前品类（如回音壁→影音娱乐）
        if (!selGroup) {
            tl.forEach((t, i) => {
                if (selGroup) return
                const ids = (t.types || []).map(x => String(x.id))
                if (ids.indexOf(String(that.data.selType)) >= 0) {
                    selTypeName = t.name
                    typeIdx = i
                    selGroup = String(t.mid)
                }
            })
        }
        that.setData({ typeList: tl, selTypeName, typeIdx, selGroup });
        that.refreshDisp()
        that.loadData()
      },
      fail() {
        wx.showToast({ title: '品类组加载失败，请重试', icon: 'none' })
      }
    })
  },

  // 筛选变化（下拉）
  onPickerMarket(e) {
    const i = e.detail.value
    this.setData({ selMarket: this.data.marketList[i].id, marketIdx: i, needSnap: false }); this.refreshDisp()
    this.loadData()
  },
  onPickerLx(e) {
    const i = e.detail.value
    this.setData({ selLx: this.data.lxList[i].id, lxIdx: i, needSnap: false }); this.refreshDisp()
    this.loadData()
  },
  onPickerType(e) {
    const i = e.detail.value
    const g = this.data.typeList[i]
    if (!g) return
    const t = (g.types && g.types[0]) || { id: g.id, name: g.name }
    const q = ['5', '6', '7', '8', '18']
    const period = q.indexOf(String(t.id)) >= 0 ? '2' : '1'
    const patch = { selType: String(t.id), selGroup: String(g.mid), selTypeName: g.name, typeIdx: i }
    if (period !== this.data.selPeriod) {
      this.buildTimeList(period)
      patch.selPeriod = period
      patch.needSnap = true
    }
    this.setData(patch); this.refreshDisp()
    this.loadData()
  },
  onPickerXl(e) {
    const i = e.detail.value
    const x = this.data.xlList[i]
    this.setData({ selXl: x.id, selXlName: x.name, xlIdx: i, needSnap: false }); this.refreshDisp()
    this.loadData()
  },
  onPickerTime(e) {
    const t = this.data.timeList[e.detail.value]
    if (!t) return
    this.setData({
      timeIdx: e.detail.value,
      selTimeName: t.name,
      selPeriod: t.period,
      selYear: t.year,
      selQuarter: t.quarter || '',
      selMonth: t.month || '',
      needSnap: false
    }); this.refreshDisp()
    this.loadData()
  },
  onPickerYtd(e) {
    const i = e.detail.value
    const y = this.data.ytdList[i]
    this.setData({ ytd: y.id, ytdIdx: i, needSnap: false }); this.refreshDisp()
    this.loadData()
  },
  setTypeSelection(typeId, typeName) {
    const q = ['5', '6', '7', '8', '18']
    const period = q.indexOf(String(typeId)) >= 0 ? '2' : '1'
    const patch = {
      selType: String(typeId),
      selTypeName: typeName || '',
      typeIdx: -1,
      needSnap: false
    }
    // 定位所在品类组（typeId 可能命中组主 type 或组内某绑定品类）
    // 优先匹配当前已选的组，其次取第一个匹配的组
    let found = false
    // 先试当前品类组
    this.data.typeList.forEach((x, idx) => {
      if (found) return
      if (String(x.mid) === String(this.data.selGroup)) {
        const ids = (x.types || []).map(y => String(y.id))
        if (x.id === String(typeId) || ids.indexOf(String(typeId)) >= 0) {
          patch.typeIdx = idx
          patch.selGroup = String(x.mid)
          if (!typeName) patch.selTypeName = x.name
          found = true
        }
      }
    })
    // 当前组未命中时，取第一个匹配的组
    if (!found) {
      this.data.typeList.forEach((x, idx) => {
        if (found) return
        const ids = (x.types || []).map(y => String(y.id))
        if (x.id === String(typeId) || ids.indexOf(String(typeId)) >= 0) {
          patch.typeIdx = idx
          patch.selGroup = String(x.mid)
          if (!typeName) patch.selTypeName = x.name
          found = true
        }
      })
    }
    if (period !== this.data.selPeriod) {
      this.buildTimeList(period)
      patch.selPeriod = period
      patch.needSnap = true
    }
    this.setData(patch)
    this.refreshDisp()
    this.loadData()
  },
  onTypeTapForMenu(e) {
    const t = e.currentTarget.dataset.v
    let name = ''
    this.data.typeList.forEach(x => { if (x.id === String(t)) name = x.name })
    this.setTypeSelection(t, name)
  },
  onSubTypeTap(e) {
    // tvs 模式点击明细行，直接回到旧版电视供应链页面
    if (this.data.subMode === 'tvs') {
      wx.navigateTo({
        url: '/pages/index/next?type=9',
      })
      return
    }
    // qty 模式（商用显示）仍保持不切换品类，避免联动筛选框
    if (this.data.subMode === 'qty') return
    const t = e.currentTarget.dataset.v
    let name = ''
    this.data.subRows.forEach(x => { if (x.id === String(t)) name = x.name })
    // 品类明细行点击跳转到对应品类的数据界面（对齐核心器件/供应链明细行的跳转方式）
    wx.navigateTo({
      url: '/pages/index/next?type=' + t + '&typename=' + encodeURIComponent(name || ''),
    })
  },
  onSearchInput(e) { this.setData({ keywords: e.detail.value }) },
  onSearch() {
    this.loadData()
  },

  // 请求数据
  loadData() {
    const that = this
    const userData = wx.getStorageSync('userData')
    if (!userData || !userData.id) return
    wx.request({
      url: app.globalData.siteUrl + '/Wxapi/getfilterdata',
      data: (() => {
        const base = {
          type: that.data.selType,
          group: that.data.selGroup,
          market: that.data.selMarket,
          lx: that.data.selLx,
          xl: that.data.selXl,
          jd: that.data.selPeriod,
          year: that.data.selYear,
          month: that.data.selMonth,
          quarter: that.data.selQuarter,
          ytd: that.data.ytd,
          uid: userData.id
        }
        // 追加各维度分组自选期数（key = tvs_period_<sub_group 中 - 换成 _>）
        const sy = that.data.tvsSelYear || {}
        Object.keys(sy).forEach(sgKey => {
          if (sy[sgKey]) {
            // sgKey 如 '9-m' → 参数名 tvs_period_9_m
            base['tvs_period_' + sgKey.replace(/-/g, '_')] = sy[sgKey]
          }
        })
        return base
      })(),
      success(res) {
        const d = res.data || {}
        console.log('getfilterdata', d)
        if (d.status != 1) {
          that.setData({ empty: true, xqData: [], subRows: [] })
          return
        }
        // 首次/换品类：吸附到最新有数据的时间，避免默认当前月无数据而空白
        if (that.data.needSnap && (d.latest_year)) {
          const ly = String(d.latest_year)
          const period = that.data.selPeriod === '2' ? '2' : '1'
          let target = -1
          const tl = that.data.timeList
          tl.forEach((it, i) => {
            if (period === '2' && it.year === ly && it.quarter === String(d.latest_quarter || 1)) target = i
            if (period !== '2' && it.year === ly && it.month === String(d.latest_month || 1)) target = i
          })
          that.setData({ needSnap: false })
          if (target >= 0 && target !== that.data.timeIdx) {
            const t = tl[target]
            that.setData({ timeIdx: target, selTimeName: t.name, selYear: t.year, selMonth: t.month || '', selQuarter: t.quarter || '' })
            that.loadData()
            return
          }
        }
        const arr1 = d.arr_sj1 || []
        const s2 = d.arr_sj2 || []
        const s3 = d.arr_sj3 || {}
        const s6 = d.arr_sj6 || {}
        // 有实际数值才算有数据
        const hasNum = (arr1.some(it => Number(it.t2) !== 0)) || (Array.isArray(s2) && s2.some(r => Number(r.num) !== 0))
        that.setData({
          xqData: arr1,
          subRows: d.arr_sub || [],
          tvsGroups: that.buildTvsGroups(d.arr_sub || []),
          subMode: d.sub_mode || 'yoy',
          tvsYears: (() => {
            // 按 sub_group 聚合期数列表（同一 sub_group 里第一行的 avail_periods 代表该组）
            const m = {}
            ;(d.arr_sub || []).forEach(row => {
              if (row.sub_group && row.avail_periods && !m[row.sub_group]) {
                m[row.sub_group] = row.avail_periods
              }
            })
            return m
          })(),
          tvsSelYearIdx: (() => {
            const idx = {}
            const seen = {}
            ;(d.arr_sub || []).forEach(row => {
              if (!row.sub_group || seen[row.sub_group]) return
              seen[row.sub_group] = true
              const periods = row.avail_periods || []
              const sel = that.data.tvsSelYear[row.sub_group]
              const pos = sel ? periods.indexOf(sel) : -1
              idx[row.sub_group] = pos >= 0 ? pos : 0
            })
            return idx
          })(),
          empty: !hasNum,
          chart1x: s2.x ? s2.x : (Array.isArray(s2) ? s2.map(r => r.id) : []),
          chart1y: s2.x ? s2.y : (Array.isArray(s2) ? s2.map(r => r.num) : []),
          chart2x: s3.x || [],
          chart2y: s3.y || [],
          chart3: d.arr_sj3 && d.arr_sj3.data ? Object.keys(d.arr_sj3.data).map(k => ({ name: k, value: d.arr_sj3.data[k] })) : [],
          chart4: s6.data ? Object.keys(s6.data).map(k => ({ name: k, value: s6.data[k] })) : [],
          arr_sj2_dw: d.arr_sj2_dw || '万台',
          tips: d.arr_sj ? d.arr_sj : ''
        })
        that.refreshDisp();
        that.setTimeout(() => {
          that.renderCharts()
        }, 100)
      }
    })
  },
  setTimeout(fn, ms) { setTimeout(fn, ms) },

  // 同步下拉框直接显示的名称
  refreshDisp() {
    this.setData({
      marketDisp: this.data.selMarket || '不限',
      lxDisp: this.data.selLx || '不限',
      typeDisp: this.data.selTypeName || '请选择',
      xlDisp: this.data.selXlName,
      timeDisp: this.data.selTimeName
    })
  },

  stopProp(e) {},  // picker 阻止行 tap 冒泡用

  // 把供应链明细行按 sub_group 归组成卡片（对齐数据页 显示供应链DSC 的分组卡片）
  // 季度组标题用「统计周期」，月度组沿用供应链名
  buildTvsGroups(rows) {
    const groups = []
    let cur = null
    ;(rows || []).forEach(row => {
      if (!cur || cur.sub_group !== row.sub_group) {
        cur = {
          sub_group: row.sub_group,
          groupTitle: row.group || '',
          period: row.period,
          rows: []
        }
        groups.push(cur)
      }
      cur.rows.push(row)
    })
    return groups
  },

  // 每组（维度分组）的时间 picker 切换，data-sid = sub_group key，如 "9-m"
  onTvsYearPicker(e) {
    const sgKey = String(e.currentTarget.dataset.sid)
    const idx = Number(e.detail.value)
    const period = (this.data.tvsYears[sgKey] || [])[idx]
    if (!period) return
    const patch = {}
    patch['tvsSelYear.' + sgKey] = period
    patch['tvsSelYearIdx.' + sgKey] = idx
    this.setData(patch)
    this.loadData()
  },

  renderCharts() {
    // 图1 市场规模（柱状）— 实例只建一次，之后 setOption 更新
    this.ensureChart('bar1', this.barComp, this.optionBar())
    // 图2 品牌份额（饼图）
    if (this.data.chart3.length) this.ensureChart('bar2', this.barComp2, this.optionPie(this.data.chart3))
    // 图3 产品结构（饼图）
    if (this.data.chart4.length) this.ensureChart('bar3', this.barComp3, this.optionPie(this.data.chart4))
  },
  ensureChart(key, comp, option) {
    if (!comp) return
    const that = this
    if (that[key]) {
      try { that[key].resize && that[key].resize() } catch (e) {}
      that[key].setOption(option, true)
      return
    }
    comp.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, { width, height })
      canvas.setChart(chart)
      chart.setOption(option)
      that[key] = chart
      return chart
    })
  },
  optionBar() {
    return {
      grid: { left: 10, right: 10, top: 20, bottom: 20, containLabel: true },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: this.data.chart1y.length ? this.data.chart1x : [], axisLabel: { fontSize: 10 } },
      yAxis: { type: 'value', axisLabel: { fontSize: 10 } },
      series: [{
        type: 'bar',
        data: this.data.chart1y,
        itemStyle: { color: '#1a9fe8' },
        barWidth: '40%'
      }]
    }
  },
  optionPie(data) {
    return {
      tooltip: { trigger: 'item' },
      legend: { orient: 'vertical', left: 'left', textStyle: { fontSize: 11 } },
      series: [{
        type: 'pie', radius: '60%', center: ['60%', '50%'],
        data: data,
        label: { fontSize: 11 }
      }]
    }
  }
})
