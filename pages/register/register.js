// pages/register/register.js
Page({
  data: {
    role: '',
    name: '',
    phone: '',
    gender: '1', // 默认男性
    isSubmitting: false,
    showRoleSelection: true,
    showProfileForm: false
  },

  onLoad: function (options) {
    // 检查是否已登录
    const app = getApp()
    const isLogin = app.checkLoginStatus()
    
    if (!isLogin) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
      return
    }
    
    // 如果已有角色，直接跳转到对应页面
    if (app.globalData.role) {
      this.navigateToRolePage(app.globalData.role)
      return
    }
  },

  // 选择角色
  selectRole: function(e) {
    const role = e.currentTarget.dataset.role
    this.setData({
      role: role,
      showRoleSelection: false,
      showProfileForm: true
    })
  },

  // 返回角色选择
  backToRoleSelection: function() {
    this.setData({
      showRoleSelection: true,
      showProfileForm: false
    })
  },

  // 输入姓名
  inputName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

  // 输入手机号
  inputPhone: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 选择性别
  radioChange: function(e) {
    this.setData({
      gender: e.detail.value
    })
  },

  // 提交注册信息
  submitProfile: function() {
    // 表单验证
    if (!this.data.name) {
      wx.showToast({
        title: '请输入姓名',
        icon: 'none'
      })
      return
    }
    
    if (!this.data.phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    
    // 手机号格式验证
    const phoneReg = /^1[3-9]\d{9}$/
    if (!phoneReg.test(this.data.phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return
    }
    
    this.setData({ isSubmitting: true })
    
    const app = getApp()
    // 提交用户信息到服务器
    wx.request({
      url: `${app.globalData.baseUrl}/api/user/register`,
      method: 'POST',
      header: {
        'Authorization': `Bearer ${wx.getStorageSync('token')}`
      },
      data: {
        role: this.data.role,
        name: this.data.name,
        phone: this.data.phone,
        gender: this.data.gender
      },
      success: res => {
        if (res.data.success) {
          // 更新全局用户信息
          app.globalData.userInfo = res.data.userInfo
          app.globalData.role = res.data.userInfo.role
          
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              // 跳转到对应角色的首页
              setTimeout(() => {
                this.navigateToRolePage(this.data.role)
              }, 2000)
            }
          })
        } else {
          wx.showToast({
            title: res.data.message || '注册失败',
            icon: 'none'
          })
        }
      },
      fail: err => {
        console.error('注册失败', err)
        wx.showToast({
          title: '注册失败，请重试',
          icon: 'none'
        })
      },
      complete: () => {
        this.setData({ isSubmitting: false })
      }
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