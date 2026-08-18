// pages/yanbao/yanbao.js
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
		// wx.hideHomeButton({
		// 	success(res){
		// 		console.log(res)
		// 	}
		//   })
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
		// this.getTabBar()
		console.log(this.getTabBar())
		app.gethistory('研报-研报')
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
	getnews: function(){
		let that = this;
		wx.request({
		  url: app.globalData.siteUrl + '/Wxapi/getybnews',
		  success:function(res){
				that.setData({
					yuebao:res.data.datalist.yuebao,
					jibao:res.data.datalist.jibao,
					nianbao:res.data.datalist.nianbao,
				})
			}
		})
	  },
	nextpage: function(e){
		let type = e.currentTarget.dataset.type
		console.log(type)
		if (type == 1) {
			var url = '/pages/yanbao/redian'
			wx.switchTab({
				url: url,
				success: (result) => { },
				fail: (res) => { },
				complete: (res) => { },
			})
		} else if (type == 2) {
			var url = '/pages/yanbao/yanbao'
			wx.redirectTo({
				url: url,
				success: (result) => { },
				fail: (res) => { },
				complete: (res) => { },
			})
		} else if (type == 3) {
			wx.redirectTo({
				url: url,
				success: (result) => { },
				fail: (res) => { },
				complete: (res) => { },
			})
		} else {
			var url = '/pages/yanbao/redian'
			wx.switchTab({
				url: url,
				success: (result) => { },
				fail: (res) => { },
				complete: (res) => { },
			})
		}
	},
})