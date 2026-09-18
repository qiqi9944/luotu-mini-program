// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    keywords: '',
    catSuggest: [],
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
    menuGroups: [],
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
          // 分类 type → 图标 class（首页 9 个品类使用彩色分类图标，配色/图形见 index.wxss 的 .svg-* 与 .icon-*）
          const iconClassMap = {
            1: 'ent',         // 影音娱乐
            14: 'edu',        // 电子教育
            2: 'work',        // 商务办公
            3: 'wear',        // 智能穿戴
            5: 'secure',      // 安防监控
            6: 'sport',       // 运动户外
            7: 'screen',      // 商用显示
            18: 'life',       // 品质生活
            9: 'core',        // 核心器件
            // 以下为其余 type 的兜底，沿用原单色线性图标
            10: 'phone',      // 手机供应链
            11: 'display',    // 商用显示供应链
            12: 'paper',      // 电子纸供应链
            13: 'camera',     // 摄像头
            15: 'ar',         // AR 设备
            16: 'speaker',    // 回音壁
            17: 'display',    // 显示器供应链
            19: 'vr',         // VR 设备
            20: 'speaker',    // 无线蓝牙音箱
            21: 'laptop'      // 笔记本电脑供应链
          }
          const menulist = res.data.datalist.map(function (item) {
            return Object.assign({}, item, {
              iconClass: iconClassMap[item.type] || 'more'
            })
          })
          // 每 3 个一组，拆成独立卡片（首页金刚区分组卡片布局）
          const menuGroups = []
          for (let i = 0; i < menulist.length; i += 3) {
            menuGroups.push(menulist.slice(i, i + 3))
          }
          that.setData({
            menulist: menulist,
            menuGroups: menuGroups
          })
        }
      }
    })
  },
  toNews: function (e) {
    console.log(e)
    wx.setStorageSync('pagetype', 1)
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
    // 输入过程中不再实时展示相关品类；品类只在点击确认(回车)进入搜索结果页后展示
    if (name == 'keywords' && that.data.catSuggest.length) {
      that.setData({ catSuggest: [] })
    }
  },
  // 搜索联动：按关键字请求后端品类搜索（含设备级品类），供用户直接跳转到该品类数据
  updateCatSuggest: function (val) {
    let that = this
    let kw = (val || '').trim()
    if (!kw) {
      that.setData({ catSuggest: [] })
      return
    }
    if (that._sugTimer) {
      clearTimeout(that._sugTimer)
    }
    that._sugTimer = setTimeout(function () {
      wx.request({
        url: app.globalData.siteUrl + '/Wxapi/searchcategory',
        data: { keywords: kw },
        success: function (res) {
          // 仅在关键字未变时更新，避免请求乱序覆盖
          if (that.data.keywords.trim() === kw && res.data && res.data.status == 1) {
            that.setData({ catSuggest: res.data.datalist || [] })
          }
        }
      })
    }, 250)
  },
  // 点击品类联想项：清空联想并复用 nextpage 的登录校验 + 跳转品类数据
  gotoCat: function (e) {
    this.setData({ catSuggest: [] })
    this.nextpage(e)
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
