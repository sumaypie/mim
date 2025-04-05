// pages/login/login.js
Page({
  data: {
    isLoading: false,
    loginType: 'phone', // 默认使用手机号登录
    phone: '18511256591', // 默认手机号
    verifyCode: '123456', // 默认验证码
    countDown: 0 // 验证码倒计时
  },

  onLoad: function (options) {
    // 直接显示手机号登录界面
  },

  // 获取用户信息
  // 切换登录方式
  switchLoginType: function() {
    this.setData({
      loginType: this.data.loginType === 'wechat' ? 'phone' : 'wechat'
    })
  },

  // 输入手机号
  inputPhone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 输入验证码
  inputVerifyCode: function(e) {
    this.setData({
      verifyCode: e.detail.value
    })
  },

  // 获取验证码
  getVerifyCode: function() {
    if (this.data.countDown > 0) return

    const phoneReg = /^1[3-9]\d{9}$/
    if (!phoneReg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    // 开始倒计时
    this.setData({ countDown: 60 })
    const timer = setInterval(() => {
      if (this.data.countDown <= 1) {
        clearInterval(timer)
      }
      this.setData({
        countDown: this.data.countDown - 1
      })
    }, 1000)

    // TODO: 这里暂时不发送验证码，使用固定验证码123456
    wx.showToast({
      title: '验证码已发送',
      icon: 'success'
    })
  },

  // 手机号登录
  loginByPhone: function() {
    if (!this.data.phone || !this.data.verifyCode) {
      wx.showToast({
        title: '请输入手机号和验证码',
        icon: 'none'
      })
      return
    }

    const app = getApp()
    this.setData({ isLoading: true })

    app.loginByPhone(this.data.phone, this.data.verifyCode)
      .then(loginRes => {
        // 检查是否已选择角色
        if (app.globalData.userInfo.role) {
          this.navigateToRolePage(app.globalData.userInfo.role)
        } else {
          wx.redirectTo({
            url: '/pages/register/register'
          })
        }
      })
      .catch(err => {
        console.error('手机号登录失败', err)
      })
      .finally(() => {
        this.setData({ isLoading: false })
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
    const { isSuperAdmin } = require('../../utils/auth');
    const app = getApp();
    
    // 超级管理员跳转到管理页面
    if (isSuperAdmin(app.globalData.userInfo)) {
      wx.redirectTo({
        url: '/pages/admin/index'
      });
      return;
    }

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
        // 如果没有角色，跳转到注册页面
        wx.redirectTo({
          url: '/pages/register/register',
        })
        break
    }
  }
})