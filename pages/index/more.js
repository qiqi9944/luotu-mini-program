// pages/index/more.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

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
	nextpage: function (e) {
		let that = this
		let type = e.currentTarget.dataset.type
		console.log(type)
		const userData = wx.getStorageSync('userData')
		if (userData) {
		  let uid = userData.id
		  wx.request({
			url: app.globalData.siteUrl + '/Wxapi/getuser',
			data: {
			  id: uid,
			},
			success: function (res) {
			  if (res.data.status == 1) {
				if (res.data.userdata.is_xx == 0) {
					wx.showModal({
					  title: '提示',
					  content: '查看详细数据请先完善我的信息',
					  showCancel: false,
					  success(res) {
						if (res.confirm) {
						  wx.redirectTo({
							url: '/pages/user/myinfo',
						  })
						}
					  }
					})
					return
				  }
			  } else {
				wx.showToast({
				  title: res.data.msg,
				  icon: 'none',
				  duration: 2000
				})
				wx.clearStorage({
				  success: (res) => {
					console.log(res)
				  },
				})
				setTimeout(function () {
				  wx.switchTab({
					url: '/pages/user/user',
				  })
				}, 2000)
				return
			  }
			  wx.navigateTo({
				url: '/pages/index/next?type=' + type,
				success: (result) => { },
				fail: (res) => { },
				complete: (res) => { },
			  })
			}
		  })
		} else {
		  wx.showModal({
			title: '提示',
			content: '查看详细数据请微信授权登录',
			showCancel: false,
			success(res) {
			  if (res.confirm) {
				wx.switchTab({
				  url: '/pages/user/user',
				})
			  }
			}
		  })
		  return
		}
	  },
	error: function (e) {
		const userData = wx.getStorageSync('userData')
		if (userData) {
		  let uid = userData.id
		  wx.request({
			url: app.globalData.siteUrl + '/Wxapi/getuser',
			data: {
			  id: uid,
			},
			success: function (res) {
			  if (res.data.status == 1) {
				if (res.data.userdata.is_xx == 0) {
				  wx.showModal({
					title: '提示',
					content: '查看详细数据请先完善我的信息',
					showCancel: false,
					success(res) {
					  if (res.confirm) {
						wx.redirectTo({
						  url: '/pages/user/myinfo',
						})
					  }
					}
				  })
				  return
				}
			  } else {
				wx.showToast({
				  title: res.data.msg,
				  icon: 'none',
				  duration: 2000
				})
				wx.clearStorage({
				  success: (res) => {
					console.log(res)
				  },
				})
				setTimeout(function () {
				  wx.switchTab({
					url: '/pages/user/user',
				  })
				}, 2000)
				return
			  }
			  wx.navigateTo({
				url: '/pages/error/error',
			  })
			}
		  })
		} else {
		  wx.showModal({
			title: '提示',
			content: '查看详细数据请微信授权登录',
			showCancel: false,
			success(res) {
			  if (res.confirm) {
				wx.switchTab({
				  url: '/pages/user/user',
				})
			  }
			}
		  })
		  return
		}
		
	  },
})
