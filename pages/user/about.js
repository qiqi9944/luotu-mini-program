// pages/user/about.js
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		content:"",
	},
	getcon:function(){
		let that = this
		wx.request({
			url: app.globalData.siteUrl + 'Wxapi/getgylt',
			success: function (res) {
				console.log(res);
				if(res.data.status==1){
					that.setData({
						content:res.data.data.v,
					})
					WxParse.wxParse('content', 'html', res.data.data.v, that, 5);
				}else{
					wx.showToast({
						title: res.data.msg,
						icon: 'none',
						duration: 2000
					})
				}
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

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		// app.gethistory('个人中心-关于我们','/pages/user/about',1)
		// this.getcon()
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