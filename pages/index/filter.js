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
    // 品类
    typeList: [],
    // 时间(月/季度)
    yrList: [],
    monthList: [
      { id: '1', name: '1月' }, { id: '2', name: '2月' }, { id: '3', name: '3月' },
      { id: '4', name: '4月' }, { id: '5', name: '5月' }, { id: '6', name: '6月' },
      { id: '7', name: '7月' }, { id: '8', name: '8月' }, { id: '9', name: '9月' },
      { id: '10', name: '10月' }, { id: '11', name: '11月' }, { id: '12', name: '12月' }
    ],
    quarterList: [{ id: '1', name: 'Q1' }, { id: '2', name: 'Q2' }, { id: '3', name: 'Q3' }, { id: '4', name: 'Q4' }],
    // 选中值
    selMarket: '',
    selLx: '',
    selXl: '1',
    selType: '',
    selPeriod: '1',
    selYear: '',
    selMonth: '',
    selQuarter: '',
    ytd: 0,

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
    // 年份列表（近5年）
    const now = new Date().getFullYear()
    const yrList = []
    for (let i = now; i >= now - 4; i--) {
      yrList.push({ id: String(i), name: i + '年' })
    }
    this.setData({
      yrList,
      selYear: String(now)
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
    const now = new Date().getFullYear()
    Object.keys(cate2).forEach(g => {
      Object.keys(cate2[g]).forEach(k => {
        // 影音娱乐=1 电子教育=14 商务办公=2 ... 保持各品类可筛
        tl.push({ id: k, name: cate2[g][k] })
      })
    })
    this.setData({ typeList: tl })
    this.loadData()
  },

  // 筛选变化
  onMarketTap(e) { this.setData({ selMarket: e.currentTarget.dataset.v }) },
  onLxTap(e) { this.setData({ selLx: e.currentTarget.dataset.v }) },
  onXlTap(e) { this.setData({ selXl: e.currentTarget.dataset.v }); this.loadData() },
  onPeriodTap(e) { this.setData({ selPeriod: e.currentTarget.dataset.v, selMonth: '', selQuarter: '' }); this.loadData() },
  onYearTap(e) {
    const i = Number(e.detail.value)
    const yr = this.data.yrList[i]
    this.setData({ selYear: yr ? yr.id : '' })
    this.loadData()
  },
  onMonthTap(e) {
    const i = Number(e.detail.value)
    const m = this.data.monthList[i]
    this.setData({ selMonth: m ? m.id : '' })
    this.loadData()
  },
  onQuarterTap(e) {
    const i = Number(e.detail.value)
    const q = this.data.quarterList[i]
    this.setData({ selQuarter: q ? q.id : '' })
    this.loadData()
  },
  onYtdTap(e) { this.setData({ ytd: e.currentTarget.dataset.v }); this.loadData() },
  onTypeTap(e) {
    const t = e.currentTarget.dataset.v
    // 若为季度类(5,6,7,8,18)自动切季度
    const q = ['5', '6', '7', '8', '18']
    const period = q.indexOf(t) >= 0 ? '2' : this.data.selPeriod
    this.setData({ selType: t, selPeriod: period })
    this.loadData()
  },
  onSearchInput(e) { this.setData({ keywords: e.detail.value }) },
  onSearch() {
    // 搜索关键词：用于品牌/名称过滤展示提示（数据列表当前无独立列表，先搜索品牌份额）
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
