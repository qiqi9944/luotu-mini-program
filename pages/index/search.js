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
		cats: [],
	},
	// 搜索联动：按关键字取品类，展示在结果页顶部
	getcats: function () {
		let that = this;
		let keywords = that.options.keywords;
		if (!keywords) return;
		wx.request({
			url: app.globalData.siteUrl + '/Wxapi/searchcategory',
			data: { keywords: keywords },
			success: function (res) {
				if (res.data && res.data.status == 1) {
					that.setData({ cats: res.data.datalist || [] })
				}
			}
		})
	},
	// 点击品类 → 跳该品类数据页（未登录先提示授权）
	gotoCat: function (e) {
		let type = e.currentTarget.dataset.type;
		const userData = wx.getStorageSync('userData');
		if (!userData) {
			wx.showModal({
				title: '提示',
				content: '查看详细数据请微信授权登录',
				showCancel: false,
				success(r) { if (r.confirm) { wx.switchTab({ url: '/pages/user/user' }) } }
			})
			return
		}
		wx.navigateTo({ url: '/pages/index/filter?type=' + type })
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
		this.getcats()
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
