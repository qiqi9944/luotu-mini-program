// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    keywords: '',
    banner: {
      indicatorDots: true,
      indicatorColor: '#747d94',
      indicatorActiveColor: '#fff',
      vertical: false,
      autoplay: true,
      circular: true,
      interval: 5000,
      duration: 500,
      previousMargin: 0,
      nextMargin: 0,
      itemnum: 1,
    },
    lunbo: [
      { id: 1, url: '', picurl: '/pages/images/ad.jpg' },
      { id: 2, url: '', picurl: '/pages/images/ad.jpg' },
    ],
    menulist: [],
    newslist: []
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  onShow: function () {
    this.getnews();
    this.getbanner();
    this.getmenu();
    // app.gethistory('首页','/pages/index/index',2)
  },
  onPullDownRefresh: function () {
    this.getbanner()
    this.getnews()
    this.getmenu()
    wx.stopPullDownRefresh();
  },
  /**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		
  },
  onShareTimeline: function () {

  },
  getnews: function () {
    let that = this;
    wx.request({
      url: app.globalData.siteUrl + '/Wxapi/getindexnews',
      success: function (res) {
        console.log(res);
        that.setData({
          newslist: res.data.datalist
        })
      }
    })
  },
  getbanner: function () {
    let that = this;
    wx.request({
      url: app.globalData.siteUrl + '/Wxapi/getbanner',
      data: { 'wz': 1 },
      success: function (res) {
        console.log(res);
        that.setData({
          lunbo: res.data.datalist
        })
      }
    })
  },
  getmenu: function () {
    let that = this;
    wx.request({
      url: app.globalData.siteUrl + '/Wxapi/getindexmenu',
      success: function (res) {
        console.log(res);
        if (res.data.status == 1 && res.data.datalist) {
          that.setData({
            menulist: res.data.datalist
          })
        }
      }
    })
  },
  toNews: function (e) {
    console.log(e)
    wx.setStorageSync('pagetype', 3)
    wx.switchTab({
      url: '/pages/yanbao/redian',
      success: (result) => {

      },
      fail: (res) => { },
      complete: (res) => { },
    })
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
            url: '/pages/index/filter?type=' + type,
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
  more: function (e) {
    wx.navigateTo({
      url: '/pages/index/more',
    })
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
                content: '查看详细数据请微信授权登录',
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
  inputchange: function (e) {
    let that = this
    let name = e.currentTarget.dataset.name
    let val = e.detail.value
    that.setData({
      [name]: val
    })
  },
  search: function () {
    let that = this
    let keywords = that.data.keywords
    console.log(keywords)
    if (keywords) {
      wx.navigateTo({
        url: '/pages/index/search?keywords=' + keywords,
      })
    } else {
      wx.showToast({
        title: '请输入关键字',
        icon: 'none'
      })
    }
  }
})
