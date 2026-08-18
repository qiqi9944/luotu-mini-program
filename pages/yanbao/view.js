// pages/yanbao/view.js
const app = getApp()
var WxParse = require('../../wxParse/wxParse.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		content:"",
		sc:0,
		dz:0,
		scnum:0,
		dznum:0,
	},
	getview:function(){
		let that = this
		let id = that.options.id
		let userData = wx.getStorageSync('userData')
		console.log(id)
		wx.request({
			url: app.globalData.siteUrl + '/Wxapi/getnewscon',
			data: {id: id,uid:userData.id },
			success: function (res) {
				console.log(res);
				if(res.data.status==1){
					that.setData({
						name:res.data.data.name,
						addtime:res.data.data.addtime,
						click:res.data.data.click,
						content:res.data.data.content,
						url:res.data.data.url,
						sc:res.data.scdz.sc,
						dz:res.data.scdz.dz,
						scnum:res.data.scdz.scnum,
						dznum:res.data.scdz.dznum,
						pic:res.data.data.pic,
					})
					app.gethistory(res.data.data.name,'/pages/yanbao/view?id='+that.options.id,1)
					WxParse.wxParse('content', 'html', res.data.data.content, that, 5);
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
	getscdz:function(e){
		let that = this
		let id = that.options.id
		let userData = wx.getStorageSync('userData')
		let type = e.currentTarget.dataset.type
		console.log(id,userData.id,type)
		wx.request({
			url: app.globalData.siteUrl + '/Wxapi/getscdz',
			data: {nid: id,uid:userData.id,type:type },
			success: function (res) {
				console.log(res);
				that.setData({
					sc:res.data.scdz.sc,
					dz:res.data.scdz.dz,
					scnum:res.data.scdz.scnum,
					dznum:res.data.scdz.dznum,
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

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.getview()
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
		let that = this
		return {
			title: that.data.name,
			// path: '/pages/index/index',//用户点开后的默认页面，我默认为首页
			imageUrl: that.data.pic?that.data.pic:'/pages/images/sharepic.jpg',//自定义图片的地址
		}
	},
	onShareTimeline: function () {
    
	},
})