// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const userData = wx.getStorageSync('userData')
    if (userData) {
      this.globalData.userData = userData;
    }
    // 获取用户信息
    let that = this
    wx.getSetting({
      // withSubscriptions:true,
      success: res => {
        // console.log(res)
        if (res.authSetting['scope.userInfo']) {

          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // console.log(res);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  gethistory(name,url,type) {
    let that = this
    console.log(name,url,type)
    wx.getStorage({
      key: 'userData',
      success(res) {
        console.log(res)
        let uid = res.data.id
        wx.request({
          url: that.globalData.siteUrl + '/Wxapi/getliulan',
          data: {
            uid: uid,
            name: name,
            url: url,
            type: type,
          },
          success(res) {
            console.log(res)
          }
        })
      },
      fail(res) {
        console.log(res)
      }
    })
  },
  //查看数据需要完善个人信息
  checkws() {
    console.log('查看数据需要完善个人信息')
    let that = this
    wx.getStorage({
      key: 'userData',
      success(res) {
        console.log(res)
        let id = res.data.id
        wx.request({
          url: that.globalData.siteUrl + '/Wxapi/getuser',
          data: {
            id: id,
          },
          success(res) {
            console.log(res)
            if (res.data.status == 1) {
              if (res.data.userdata.is_xx == 0) {
                wx.showModal({
                  title: '提示',
                  content: '请完善信息后查看',
                  showCancel: false,
                  success(res) {
                    if (res.confirm) {
                      wx.redirectTo({
                        url: '/pages/user/myinfo',
                      })
                    }
                  }
                })

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
            }
          }
        })
      },
      fail(res) {
        console.log(res)
        chk = 0
        wx.showModal({
          title: '提示',
          content: '请完善信息后查看',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/user/user',
              })
            }
          }
        })

      }
    })
  },
  
  globalData: {
    userData: null,//用户数据库信息
    userInfo: null,//用户微信信息
    siteUrl: 'https://api.runtotech.com',
    sitePath: 'https://api.runtotech.com',
    // siteUrl:'http://www.luotu.com/',
    // sitePath:'http://www.luotu.com',
  }
})
