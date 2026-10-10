// pages/user/myinfo.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		user: {}
	},
	getPhoneNumber(e) {
		let that = this
		console.log(e)
		wx.request({
			url: app.globalData.siteUrl + '/Wxapi/test',
			data: {
				code: e.detail.code,
			},
			success: function (res) {
				console.log(res.data)
				const phoneInfo = res.data && res.data.phone_info
				if (!phoneInfo || !phoneInfo.phoneNumber) {
					wx.showToast({ title: '获取手机号失败，请重试', icon: 'none', duration: 2000 })
					return
				}
				let tel = phoneInfo.phoneNumber
				that.setData({
					['user.phone']: tel
				})
			},
			fail: function () {
				wx.showToast({ title: '网络请求失败', icon: 'none', duration: 2000 })
			}
		})
	},
	getUserProfile: function () {
		let that = this
		wx.getUserProfile({
			desc: '用于获取默认资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
			success: (res) => {
				console.log(res.userInfo);
				that.setData({
					['user.tx']:res.userInfo.avatarUrl,
					['user.username']:res.userInfo.nickName,
				})
			}
		})
	},
	getuser() {
		let that = this
		const userData = wx.getStorageSync('userData')
		if (userData) {
			var id = userData.id
		} else { //没有id就清除本地数据 并回到个人中心
			var id = 0
			wx.clearStorage({
				success: (res) => {
					console.log(res)
				},
			})
			wx.showToast({
				title: '请登录账号',
				icon: 'none',
				duration: 2000
			})
			setTimeout(function () {
				wx.switchTab({
					url: '/pages/user/user',
				})
			}, 2000)
		}
		if (id) {
			wx.request({
				url: app.globalData.siteUrl + '/Wxapi/getuser',
				data: {
					id: id,
				},
				success(res) {
					console.log(res)
					if (res.data.status == 1) {
						that.setData({
							user: res.data.userdata,
						})
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
					}
				}
			})
		}

	},
	doedit() {
		let that = this
		wx.request({
			url: app.globalData.siteUrl + '/Wxapi/updateuser',
			data: that.data.user,
			success(res) {
				console.log(res)
				if (res.data.status == 1) {
					var userData = res.data.userdata;
					wx.setStorage({
						key: 'userData',
						data: userData
					})
					app.globalData.userData = userData;
					setTimeout(function () {
						wx.switchTab({
							url: '/pages/user/user',
						})
					}, 1000)
				}
				wx.showToast({
					title: res.data.msg,
					icon: 'none',
					duration: 1000
				})
			}
		})
	},
	inputchange: function (e) {
		let that = this
		console.log(e)
		let name = e.currentTarget.dataset.name
		let val = e.detail.value
		console.log(val)
		that.setData({
			['user.' + name]: val
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
		// app.gethistory('个人中心-我的信息','/pages/user/myinfo',1)
		this.getuser()
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
		this.getuser()
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

})