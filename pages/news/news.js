// pages/news/news.js
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
		p:1,
		newslist:[],
		lastpage:0
	},
	getbanner: function(){
		let that = this;
		wx.request({
		  url: app.globalData.siteUrl + 'Wxapi/getbanner',
		  data:{'wz':2},
		  success:function(res){
			console.log(res);
			that.setData({
			  banner:res.data.datalist
			})
			}
		})
	  },
	  getnews: function(){
		let that = this;
		let p = that.data.p;
		wx.request({
		  url: app.globalData.siteUrl + 'Wxapi/getnews',
		  data:{type:1,p:p},
		  success:function(res){
			console.log(res);
			let oldData = that.data.newslist;
			if(res.data.datalist.length>0){
				p = p + 1;
			}
			that.setData({
				p:p,
				newslist:oldData.concat(res.data.datalist),
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
		this.getbanner()
		this.getnews()
		app.gethistory('行业洞察')
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
			newslist:[],
		})
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
})