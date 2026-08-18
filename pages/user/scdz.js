// pages/user/scdz.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		type:1,
		p1:1,
		datalist1:[],
		p2:1,
		datalist2:[],
	},
	selchange:function(e){
		let that = this
		console.log(e)
		let type = e.currentTarget.dataset.type
		that.setData({
			type
		})
	},
	getdata: function(type){
		let that = this
		let userData = wx.getStorageSync('userData')
		console.log(type)
		if(type==1){
			var p = that.data.p1;
		}
		if(type==2){
			var p = that.data.p2;
		}
		wx.request({
			url: app.globalData.siteUrl + '/Wxapi/getscdzlist',
			data:{type:type,uid:userData.id,p:p},
			success:function(res){
			  console.log(res);
			  if(type==1){
				let oldData = that.data.datalist1;
				if(res.data.datalist.length>0){
					p = p + 1;
				}
				that.setData({
					p1:p,
					datalist1:oldData.concat(res.data.datalist),
					lastpage1:res.data.lastpage
				})
			  }
			  if(type==2){
				let oldData = that.data.datalist2;
				if(res.data.datalist.length>0){
					p = p + 1;
				}
				that.setData({
					p2:p,
					datalist2:oldData.concat(res.data.datalist),
					lastpage2:res.data.lastpage
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
		app.gethistory('个人中心-收藏点赞','/pages/user/scdz',1)
		let that = this
		this.getdata(1)
		this.getdata(2)
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
		let that = this
		let type = that.data.type
		if(type==1){
			that.setData({
				p1:1,
				datalist1:[],
			})
		}
		if(type==2){
			that.setData({
				p2:1,
				datalist2:[],
			})
		}
		that.getdata(type)
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		let that = this
		let type = that.data.type
		that.getdata(type)
	},

})