// pages/user/history.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		p:1,
		hislist:[],
		lastpage:0
	},
	getnews: function(){
		let that = this;
		let p = that.data.p;
		let userData = wx.getStorageSync('userData')
		wx.request({
		  url: app.globalData.siteUrl + 'Wxapi/getliulanlist',
		  data:{p:p,uid:userData.id},
		  success:function(res){
			console.log(res);
			let oldData = that.data.hislist;
			if(res.data.datalist.length>0){
				p = p + 1;
			}
			that.setData({
				p:p,
				hislist:oldData.concat(res.data.datalist),
				lastpage:res.data.lastpage
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
		// app.gethistory('个人中心-浏览记录','/pages/user/history',1)
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
		this.setData({
			p:1,
			hislist:[],
		})
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
	clickpage: function(e){
		let that = this
		let url = e.currentTarget.dataset.url
		let type = e.currentTarget.dataset.type
		
		if(type==1){
			wx.navigateTo({
			  url: url,
			})
		}else if(type==2){
			let arr = url.split('?')
			console.log(arr[1])
			let canshu = arr[1].split('##')
			let sjtype = canshu[0].split('=')[1]
			let sjsel = canshu[1].split('=')[1]
			wx.setStorageSync('sjtype', sjtype)
			wx.setStorageSync('sjsel', sjsel)
			wx.switchTab({
			  url: url,
			})
		}
	}
})