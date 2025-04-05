// pages/post-job/post-job.js
Page({
  data: {
    formData: {
      title: '',
      salary: '',
      duration: '',
      date: '',
      time: '',
      location: '',
      latitude: '',
      longitude: '',
      requirements: '',
      description: ''
    },
    minDate: new Date().toISOString().split('T')[0]
  },

  onLoad() {
    // 检查用户是否已登录且是画室角色
    this.checkUserRole()
  },

  // 检查用户角色
  checkUserRole() {
    // TODO: 获取用户信息，验证是否为画室角色
    // const userInfo = wx.getStorageSync('userInfo')
    // if (!userInfo || userInfo.role !== 'studio') {
    //   wx.showToast({
    //     title: '只有画室可以发布招聘',
    //     icon: 'none'
    //   })
    //   setTimeout(() => {
    //     wx.navigateBack()
    //   }, 1500)
    // }
  },

  // 输入框变化
  onInputChange(e) {
    const { field } = e.currentTarget.dataset
    const { value } = e.detail
    this.setData({
      [`formData.${field}`]: value
    })
  },

  // 日期选择
  onDateChange(e) {
    this.setData({
      'formData.date': e.detail.value
    })
  },

  // 时间选择
  onTimeChange(e) {
    this.setData({
      'formData.time': e.detail.value
    })
  },

  // 选择地点
  onChooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          'formData.location': res.name || res.address,
          'formData.latitude': res.latitude,
          'formData.longitude': res.longitude
        })
      },
      fail: () => {
        wx.showToast({
          title: '请授权位置信息',
          icon: 'none'
        })
      }
    })
  },

  // 表单验证
  validateForm() {
    const { title, salary, duration, date, time, location, requirements } = this.data.formData
    if (!title) return '请输入招聘标题'
    if (!salary) return '请输入薪资待遇'
    if (!duration) return '请输入工作时长'
    if (!date) return '请选择工作日期'
    if (!time) return '请选择工作时间'
    if (!location) return '请选择工作地点'
    if (!requirements) return '请输入工作要求'
    return ''
  },

  // 提交表单
  onSubmit() {
    const error = this.validateForm()
    if (error) {
      wx.showToast({
        title: error,
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '提交中...'
    })

    // TODO: 调用后端API提交招聘信息
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }, 1000)
  },

  // 返回上一页
  onBack() {
    wx.navigateBack()
  }
})