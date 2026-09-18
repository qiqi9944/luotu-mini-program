// pages/user/member.js
const app = getApp()
Page({

  data: {
    islogin: false,
    user: {},
    isMember: false,
    plan: {
      tiers: [
        { name: '大师会员', price: '3999' },
        { name: '行家会员', price: '2399' },
        { name: '新手会员', price: '799' }
      ],
      benefits: [
        { name: '行业规模', marks: [true, true, true] },
        { name: '品牌竞争', marks: [true, true, true] },
        { name: '价格分布', marks: [true, true, false] },
        { name: '产品结构', marks: [true, false, false] },
        { name: 'AI说', marks: [true, true, true] }
      ]
    }
  },

  onShow: function () {
    this.getUser()
  },

  getUser: function () {
    const that = this
    const userData = wx.getStorageSync('userData')
    if (!userData || !userData.id) {
      that.setData({ islogin: false, user: {}, isMember: false })
      return
    }
    wx.request({
      url: app.globalData.siteUrl + '/Wxapi/getuser',
      data: {
        id: userData.id,
      },
      success(res) {
        if (res.data.status == 1) {
          const u = res.data.userdata || {}
          that.setData({
            islogin: true,
            user: u,
            isMember: Number(u.huiyuan) === 1
          })
        } else {
          that.setData({ islogin: false, user: {}, isMember: false })
        }
      }
    })
  },

  goLogin: function () {
    wx.switchTab({
      url: '/pages/user/user'
    })
  },

  contact: function () {
    wx.showModal({
      title: '开通会员',
      content: '请联系洛图科技商务团队开通会员账号，解锁完整产业数据权益。',
      showCancel: true,
      confirmText: '加入交流群',
      cancelText: '知道了',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/user/join'
          })
        }
      }
    })
  }
})