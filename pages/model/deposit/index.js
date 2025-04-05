// pages/model/deposit/index.js
Page({
  data: {
    depositInfo: null,
    depositAmount: 200, // 默认押金金额
    depositStatus: '', // 'paid' | 'pending' | 'refunded'
    jobInfo: null
  },

  onLoad(options) {
    const { jobId } = options
    this.getJobInfo(jobId)
    this.getDepositInfo(jobId)
  },

  // 获取工作信息
  getJobInfo(jobId) {
    // TODO: 调用后端API获取工作信息
    const mockJobInfo = {
      id: jobId,
      title: '人物速写模特',
      studio: '艺术工作室',
      date: '2024-01-20',
      startTime: '09:00',
      endTime: '12:00'
    }
    this.setData({ jobInfo: mockJobInfo })
  },

  // 获取押金信息
  getDepositInfo(jobId) {
    // TODO: 调用后端API获取押金信息
    const mockDepositInfo = {
      jobId,
      amount: 200,
      status: 'pending',
      payTime: null,
      refundTime: null
    }
    this.setData({
      depositInfo: mockDepositInfo,
      depositStatus: mockDepositInfo.status
    })
  },

  // 支付押金
  handlePayDeposit() {
    wx.showLoading({ title: '支付中...' })
    
    // TODO: 调用支付API
    setTimeout(() => {
      const now = new Date()
      this.setData({
        depositStatus: 'paid',
        'depositInfo.status': 'paid',
        'depositInfo.payTime': now
      })
      
      wx.hideLoading()
      wx.showToast({
        title: '支付成功',
        icon: 'success'
      })
    }, 1500)
  },

  // 申请退还押金
  handleRefundDeposit() {
    wx.showModal({
      title: '申请退还押金',
      content: '确认要申请退还押金吗？',
      success: (res) => {
        if (res.confirm) {
          this.submitRefundRequest()
        }
      }
    })
  },

  // 提交退还申请
  submitRefundRequest() {
    wx.showLoading({ title: '提交中...' })
    
    // TODO: 调用后端API提交退还申请
    setTimeout(() => {
      const now = new Date()
      this.setData({
        depositStatus: 'refunded',
        'depositInfo.status': 'refunded',
        'depositInfo.refundTime': now
      })
      
      wx.hideLoading()
      wx.showToast({
        title: '申请已提交',
        icon: 'success'
      })
    }, 1500)
  }
})