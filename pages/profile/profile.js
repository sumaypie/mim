// pages/profile/profile.js
Page({
  data: {
    isLoading: false,
    userInfo: {
      avatar: '',
      nickname: '',
      gender: 'male',
      age: '',
      phone: '',
      introduction: ''
    }
  },

  onLoad: function(options) {
    // 获取用户信息
    const app = getApp()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
  },

  // 选择头像
  chooseAvatar: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // 这里可以上传图片到服务器，暂时只做本地展示
        this.setData({
          'userInfo.avatar': res.tempFilePaths[0]
        })
      }
    })
  },

  // 输入事件处理函数
  onNicknameInput: function(e) {
    this.setData({
      'userInfo.nickname': e.detail.value
    })
  },

  onGenderChange: function(e) {
    this.setData({
      'userInfo.gender': e.detail.value
    })
  },

  onAgeInput: function(e) {
    this.setData({
      'userInfo.age': e.detail.value
    })
  },

  onPhoneInput: function(e) {
    this.setData({
      'userInfo.phone': e.detail.value
    })
  },

  onIntroInput: function(e) {
    this.setData({
      'userInfo.introduction': e.detail.value
    })
  },

  // 保存个人资料
  saveProfile: function() {
    if (!this.data.userInfo.nickname) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
      return
    }

    this.setData({ isLoading: true })

    // 这里应该调用API保存用户信息，暂时只做本地保存
    const app = getApp()
    app.globalData.userInfo = {...this.data.userInfo}

    setTimeout(() => {
      this.setData({ isLoading: false })
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
    }, 1000)
  }
})