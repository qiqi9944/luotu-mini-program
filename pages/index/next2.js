// pages/index/next2.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		banner: [],
		indicatorDots: true,
		vertical: false,
		autoplay: false,
		interval: 2000,
		duration: 500,
		indicatorColor:'rgba(255, 255, 255, .3)',
		indicatorActiveColor:'rgba(255, 255, 255, 1)',
		yuebao:[],
		jibao:[],
		nianbao:[],
		sjtype:0,
	},
	getbanner: function () {
		let that = this;
		wx.request({
			url: app.globalData.siteUrl + '/Wxapi/getbanner',
			data: { 'wz': 2 },
			success: function (res) {
				console.log(res);
				that.setData({
					banner: res.data.datalist
				})
			}
		})
	},
	getnews: function () {
		let that = this;
		let p = that.data.p;
		let sjtype = that.options.type
		
		wx.request({
			url: app.globalData.siteUrl + '/Wxapi/getybnews',
			data: { sjtype: sjtype },
			success: function (res) {
				console.log(res);
				that.setData({
					yuebao:res.data.datalist.yuebao,
					jibao:res.data.datalist.jibao,
					nianbao:res.data.datalist.nianbao,
				})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		wx.setNavigationBarTitle({
			title: this.options.typename
		})
		
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		app.checkws()
		app.gethistory('首页-'+this.options.typename+'-研报','/pages/index/next2?type='+this.options.type+'&typename='+this.options.typename,1)
		this.setData({
			typename:this.options.typename,
			sjtype:this.options.type
		})
		this.getbanner()
		this.getnews()
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		this.getbanner()
		this.getnews()
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		
	},
	onShareTimeline: function () {
    
	},
	nextpage: function(e){
		let type = this.options.type
		let typename = this.options.typename
		console.log(type)
		wx.redirectTo({
		  url: '/pages/index/next?type='+type+'&typename='+typename,
		  success: (result) => {},
		  fail: (res) => {},
		  complete: (res) => {},
		})
	},
	nextpage1: function(e){
		let type = this.options.type
		let typename = this.options.typename
		console.log(type)
		wx.redirectTo({
		  url: '/pages/index/next1?type='+type+'&typename='+typename,
		  success: (result) => {},
		  fail: (res) => {},
		  complete: (res) => {},
		})
	},
})