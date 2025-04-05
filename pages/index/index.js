// pages/index/index.js
Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    role: null,
    isLogin: false,
    canIUseGetUserProfile: false
  },

  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    
    // 检查登录状态
    this.checkLoginStatus()
  },

  onShow: function () {
    // 每次显示页面时检查登录状态
    this.checkLoginStatus()
  },

  // 检查登录状态
  checkLoginStatus: function() {
    const app = getApp()
    const isLogin = app.checkLoginStatus()
    
    if (isLogin) {
      // 获取用户信息
      app.getUserInfo().then(userInfo => {
        this.setData({
          userInfo: userInfo,
          hasUserInfo: true,
          isLogin: true,
          role: userInfo.role
        })
        
        // 如果已登录且有角色，跳转到对应的首页
        if (userInfo.role) {
          this.navigateToRolePage(userInfo.role)
        }
      }).catch(err => {
        console.error('获取用户信息失败', err)
        this.setData({
          isLogin: false,
          hasUserInfo: false
        })
      })
    } else {
      this.setData({
        isLogin: false,
        hasUserInfo: false
      })
    }
  },

  // 跳转到登录页
  goToLogin: function() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },

  // 跳转到注册页
  goToRegister: function() {
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },

  // 根据角色跳转到对应的首页
  navigateToRolePage: function(role) {
    switch(role) {
      case 'studio':
        wx.redirectTo({
          url: '/pages/studio/index/index',
        })
        break
      case 'model':
        wx.redirectTo({
          url: '/pages/model/index/index',
        })
        break
      case 'customer':
        wx.redirectTo({
          url: '/pages/customer/index/index',
        })
        break
      default:
        // 如果没有角色，留在当前页面
        break
    }
  }
})