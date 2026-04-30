// pages/yanbao/redian.js
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
		indicatorColor: 'rgba(255, 255, 255, .3)',
		indicatorActiveColor: 'rgba(255, 255, 255, 1)',
		pagetype: 1,
		p: 1,
		newslist: [],
		lastpage: 0,
		yuebao: [],
		jibao: [],
		nianbao: [],
		p2: 1,
		newslist2: [],
		lastpage2: 0,
	},
	getbanner: function () {
		let that = this;
		wx.request({
			url: app.globalData.siteUrl + 'Wxapi/getbanner',
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
		wx.request({
			url: app.globalData.siteUrl + 'Wxapi/getnews',
			data: { type: 2, p: p },
			success: function (res) {
				console.log(res);
				let oldData = that.data.newslist;
				if (res.data.datalist.length > 0) {
					p = p + 1;
				}
				that.setData({
					p: p,
					newslist: oldData.concat(res.data.datalist),
					lastpage: res.data.lastpage
				})
			}
		})
	},
	getnews2: function () {
		let that = this;
		wx.request({
			url: app.globalData.siteUrl + 'Wxapi/getybnews',
			success: function (res) {
				that.setData({
					yuebao: res.data.datalist.yuebao,
					jibao: res.data.datalist.jibao,
					nianbao: res.data.datalist.nianbao,
				})
			}
		})
	},
	getnews3: function () {
		let that = this;
		let p = that.data.p2;
		wx.request({
			url: app.globalData.siteUrl + 'Wxapi/getnews',
			data: { type: 1, p: p },
			success: function (res) {
				console.log(res);
				let oldData = that.data.newslist2;
				if (res.data.datalist.length > 0) {
					p = p + 1;
				}
				that.setData({
					p2: p,
					newslist2: oldData.concat(res.data.datalist),
					lastpage2: res.data.lastpage
				})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let that = this
		
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		var pagetype = wx.getStorageSync('pagetype')
		console.log(pagetype)
		if(pagetype){
			this.setData({
				pagetype
			})
		}else{
			pagetype = this.data.pagetype
		}
		wx.setStorageSync('pagetype', null)
		if(pagetype==1){
			var pagename = '热点'
		}else if(pagetype==2){
			var pagename = '报告'
		}else if(pagetype==3){
			var pagename = '活动'
		}
		// app.gethistory('观研','/pages/yanbao/redian',2)
		this.getbanner()
		this.getnews()
		this.getnews2()
		this.getnews3()
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
		let pagetype = this.data.pagetype
		this.getbanner()
		if(pagetype==1){
			this.setData({
				p: 1,
				newslist: [],
			})
			this.getnews()
		}
		if(pagetype==2){
			this.getnews2()
		}
		if(pagetype==3){
			this.setData({
				p2: 1,
				newslist2: [],
			})
			this.getnews3()
		}
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
	nextpage: function (e) {
		let type = e.currentTarget.dataset.type
		console.log(type)
		if (type) {
			this.setData({
				pagetype:type
			})
		} else {
			return false
		}
	},
})