// pages/user/user.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: {},
    islogin: false
  },
  // PrefixInteger: function(num, n) {
  // 	return (Array(n).join(0) + num).slice(-n);
  // },
  // suiji: function(num, n) {
  // 	let arr = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
  // 	var str = ''
  // 	for (let i = 0; i <4; i++) {
  // 		str += arr[Math.round(Math.random()*25)];
  // 	}
  // 	return str
  // },
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
    // app.gethistory('个人中心','/pages/user/user',2)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let that = this
    return {
      title: '洛图科技',
      path: '/pages/index/index',//用户点开后的默认页面，我默认为首页
      imageUrl: "/pages/images/share.jpg",//自定义图片的地址
      // success (res) {
      //   console.log(res)
      // },
      // fail (res){
      //   console.log(res)
      // },
      // complete (res){
      //   console.log(res)
      // }
    }
  },
  onShareTimeline: function () {

  },
  getuser() {
    let that = this
    const userData = wx.getStorageSync('userData')
    if (userData) {
      var id = userData.id
      // let linshi = '游客'+that.suiji()
      // that.setData({
      // 	linshi
      // })
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
              islogin: true
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
            that.setData({
              user: {},
              islogin: false
            })
          }
        }
      })
    } else {
      var id = 0
      wx.clearStorage({
        success: (res) => {
          console.log(res)
        },
      })
      that.setData({
        user: {},
        islogin: false
      })
    }

  },
  getUserProfile: function () {
    let that = this
    wx.showModal({
      title: '提示',
      content: '登录将会获取您的昵称和头像用于默认账号信息',
      cancelText: '暂不登录',
      confirmText: '确认登录',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.getUserProfile({
            desc: '用于获取默认资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              console.log(res.userInfo);
              that.dologin(res.userInfo)
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
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
        that.dologin(phoneInfo)
      },
      fail: function () {
        wx.showToast({ title: '网络请求失败', icon: 'none', duration: 2000 })
      }
    })
  },
  dologin(arr) {
    let that = this
    wx.login({
      success(res) {
        if (res.code) {
          console.log(res);
          // 发起网络请求
          wx.request({
            url: app.globalData.siteUrl + '/Wxapi/dowxlogin',
            data: {
              code: res.code,
              // nickName: arr.nickName,
              // avatarUrl: arr.avatarUrl,
              phone: arr.phoneNumber,
            },
            fail(res) {
              console.log(res);
            },
            success(res) {
              console.log(res)
              if (res.data.status == 1) {
                var userData = res.data.userdata;
                wx.setStorage({
                  key: 'userData',
                  data: userData
                })
                app.globalData.userData = userData;
                // let linshi = '游客'+that.suiji()
                // that.setData({
                // 	linshi
                // })
                that.setData({
                  user: userData,
                  islogin: true
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }

            }
          })
        } else {
          console.log('网络错误！' + res.errMsg)
        }
      }
    })
  },
  nextpage: function (e) {
    let that = this
    let url = e.currentTarget.dataset.url
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
          } else {
            wx.showModal({
              title: '提示',
              content: '请先微信授权登录，完善个人信息',
              showCancel: false,
            })
            return
          }
          wx.navigateTo({
            url: url,
            success: (result) => { },
            fail: (res) => { },
            complete: (res) => { },
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请先微信授权登录，完善个人信息',
        showCancel: false,
      })
    }
  },
  logout() {
    let that = this
    // wx.setStorageSync('userData', {})
    wx.clearStorageSync()
    wx.showToast({
      title: '退出登录中...',
      icon: 'loading',
      success(res) {
        setTimeout(() => {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }, 1500)

      }
    })
  }
})