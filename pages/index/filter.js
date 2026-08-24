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
    // 品类
    typeList: [],
    // 时间选项(月度/季度平铺)
    timeList: [],
    // 选中值（默认对齐存量口径：中国市场·线上零售）
    selMarket: '中国',
    selLx: '零售',
    selXl: '1',
    selXlName: '销量',
    selType: '',
    selTypeName: '',
    selPeriod: '1',
    selYear: '',
    selMonth: '',
    selQuarter: '',
    timeIdx: 0,
    selTimeName: '',
    ytd: 0,
    needSnap: false,

    empty: false,
    xqData: [],
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

  // 初始化品类 + 加载数据
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
    // 品类下拉
    const cate2 = {
      '1': { '1': '智能投影', '2': '智能音箱', '14': '智能平板', '3': '智能门锁', '13': '摄像头', '15': 'AR设备', '19': 'VR设备', '16': '回音壁', '20': '无线蓝牙音箱' },
      '2': { '5': '交互平板', '6': '数字标牌', '7': '商用激光投影', '18': '小间距LED' },
      '3': { '9': '电视供应链', '17': '显示器供应链', '21': '笔记本电脑供应链', '11': '商用显示供应链', '12': '电子纸供应链', '10': '手机供应链' }
    }
    const tl = []
    Object.keys(cate2).forEach(g => {
      Object.keys(cate2[g]).forEach(k => {
        tl.push({ id: k, name: cate2[g][k] })
      })
    })
    // 若已带初始品类(从首页菜单来)，回填名称
    let selTypeName = ''
    tl.forEach(t => { if (t.id === String(this.data.selType)) selTypeName = t.name })
    this.setData({ typeList: tl, selTypeName })
    this.loadData()
  },

  // 筛选变化（下拉）
  onPickerMarket(e) { this.setData({ selMarket: this.data.marketList[e.detail.value].id }); this.loadData() },
  onPickerLx(e) { this.setData({ selLx: this.data.lxList[e.detail.value].id }); this.loadData() },
  onPickerType(e) {
    const t = this.data.typeList[e.detail.value]
    const q = ['5', '6', '7', '8', '18']
    const period = q.indexOf(t.id) >= 0 ? '2' : '1'
    const patch = { selType: t.id, selTypeName: t.name }
    if (period !== this.data.selPeriod) {
      this.buildTimeList(period)
      patch.selPeriod = period
      patch.needSnap = true
    }
    this.setData(patch)
    this.loadData()
  },
  onPickerXl(e) {
    const x = this.data.xlList[e.detail.value]
    this.setData({ selXl: x.id, selXlName: x.name })
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
      selMonth: t.month || ''
    })
    this.loadData()
  },
  onPickerYtd(e) {
    const y = this.data.ytdList[e.detail.value]
    this.setData({ ytd: y.id })
    this.loadData()
  },
  onTypeTapForMenu(e) {
    const t = e.currentTarget.dataset.v
    const q = ['5', '6', '7', '8', '18']
    const period = q.indexOf(t) >= 0 ? '2' : this.data.selPeriod
    let name = ''
    this.data.typeList.forEach(x => { if (x.id === String(t)) name = x.name })
    this.setData({ selType: String(t), selTypeName: name, selPeriod: period })
    this.loadData()
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
      data: {
        type: that.data.selType,
        market: that.data.selMarket,
        lx: that.data.selLx,
        xl: that.data.selXl,
        jd: that.data.selPeriod,
        year: that.data.selYear,
        month: that.data.selMonth,
        quarter: that.data.selQuarter,
        ytd: that.data.ytd,
        uid: userData.id
      },
      success(res) {
        const d = res.data || {}
        console.log('getfilterdata', d)
        if (d.status != 1) {
          that.setData({ empty: true, xqData: [] })
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
        that.setData({
          xqData: arr1,
          empty: arr1.length === 0,
          chart1x: s2.x ? s2.x : (Array.isArray(s2) ? s2.map(r => r.id) : []),
          chart1y: s2.x ? s2.y : (Array.isArray(s2) ? s2.map(r => r.num) : []),
          chart2x: s3.x || [],
          chart2y: s3.y || [],
          chart3: d.arr_sj3 && d.arr_sj3.data ? Object.keys(d.arr_sj3.data).map(k => ({ name: k, value: d.arr_sj3.data[k] })) : [],
          chart4: s6.data ? Object.keys(s6.data).map(k => ({ name: k, value: s6.data[k] })) : [],
          arr_sj2_dw: d.arr_sj2_dw || '万台',
          tips: d.arr_sj ? d.arr_sj : ''
        })
        that.setTimeout(() => {
          that.renderCharts()
        }, 100)
      }
    })
  },
  setTimeout(fn, ms) { setTimeout(fn, ms) },

  renderCharts() {
    // 图1 市场规模（柱状）
    if (this.barComp) {
      this.barComp.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, { width, height })
        canvas.setChart(chart)
        chart.setOption({
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
        })
        return chart
      })
    }
    // 图2 品牌份额（饼图）
    if (this.barComp2 && this.data.chart3.length) {
      this.barComp2.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, { width, height })
        canvas.setChart(chart)
        chart.setOption({
          tooltip: { trigger: 'item' },
          legend: { orient: 'vertical', left: 'left', textStyle: { fontSize: 11 } },
          series: [{
            type: 'pie', radius: '60%', center: ['60%', '50%'],
            data: this.data.chart3,
            label: { fontSize: 11 }
          }]
        })
        return chart
      })
    }
    // 图3 产品结构（饼图）
    if (this.barComp3 && this.data.chart4.length) {
      this.barComp3.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, { width, height })
        canvas.setChart(chart)
        chart.setOption({
          tooltip: { trigger: 'item' },
          legend: { orient: 'vertical', left: 'left', textStyle: { fontSize: 11 } },
          series: [{
            type: 'pie', radius: '60%', center: ['60%', '50%'],
            data: this.data.chart4,
            label: { fontSize: 11 }
          }]
        })
        return chart
      })
    }
  }
})
