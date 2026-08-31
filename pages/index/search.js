// pages/index/search.js
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
		p: 1,
		list: [],
		lastpage: 0,
	},
	getnews: function () {
		let that = this;
		let p = that.data.p;
		let keywords = that.options.keywords;
		wx.request({
			url: app.globalData.siteUrl + '/Wxapi/getsearch',
			data: { keywords: keywords, p: p },
			success: function (res) {
				console.log(res);
				let oldData = that.data.list;
				if (res.data.datalist.length > 0) {
					p = p + 1;
				}
				that.setData({
					p: p,
					list: oldData.concat(res.data.datalist),
					lastpage: res.data.lastpage
				})
			}
		})
	},
	getbanner: function(){
		let that = this;
		wx.request({
		  url: app.globalData.siteUrl + '/Wxapi/getbanner',
		  data:{'wz':2},
		  success:function(res){
			console.log(res);
			that.setData({
			  banner:res.data.datalist
			})
			}
		})
	},
	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.options = options || {}
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
})
