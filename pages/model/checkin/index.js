// pages/model/checkin/index.js
Page({
  data: {
    jobInfo: null,
    currentLocation: null,
    distance: null,
    checkinStatus: '', // 'in' | 'out' | ''
    checkinTime: null,
    checkoutTime: null
  },

  onLoad(options) {
    const { jobId } = options
    // 获取工作信息
    this.getJobInfo(jobId)
    // 获取当前位置
    this.getCurrentLocation()
  },

  // 获取工作信息
  getJobInfo(jobId) {
    // TODO: 调用后端API获取工作信息
    const mockJobInfo = {
      id: jobId,
      title: '人物速写模特',
      studio: '艺术工作室',
      address: '北京市朝阳区某地',
      latitude: 39.9042,
      longitude: 116.4074,
      date: '2024-01-20',
      startTime: '09:00',
      endTime: '12:00'
    }
    this.setData({ jobInfo: mockJobInfo })
  },

  // 获取当前位置
  getCurrentLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        const { latitude, longitude } = res
        this.setData({ currentLocation: { latitude, longitude } })
        this.calculateDistance()
      },
      fail: () => {
        wx.showToast({
          title: '请授权位置信息',
          icon: 'none'
        })
      }
    })
  },

  // 计算距离
  calculateDistance() {
    const { jobInfo, currentLocation } = this.data
    if (!jobInfo || !currentLocation) return

    // 计算当前位置与工作地点的距离
    const distance = this.getDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      jobInfo.latitude,
      jobInfo.longitude
    )
    this.setData({ distance })
  },

  // 计算两点之间的距离（米）
  getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000 // 地球半径（米）
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  },

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  },

  // 打卡
  handleCheckin() {
    const { distance, checkinStatus } = this.data
    
    // 验证是否在工作地点范围内（100米）
    if (distance > 100) {
      wx.showToast({
        title: '请在工作地点打卡',
        icon: 'none'
      })
      return
    }

    const now = new Date()
    if (!checkinStatus) {
      // 上班打卡
      this.setData({
        checkinStatus: 'in',
        checkinTime: now
      })
      this.submitCheckinRecord('in', now)
    } else if (checkinStatus === 'in') {
      // 下班打卡
      this.setData({
        checkinStatus: 'out',
        checkoutTime: now
      })
      this.submitCheckinRecord('out', now)
    }
  },

  // 提交打卡记录
  submitCheckinRecord(type, time) {
    const { jobInfo } = this.data
    // TODO: 调用后端API提交打卡记录
    wx.showToast({
      title: type === 'in' ? '上班打卡成功' : '下班打卡成功',
      icon: 'success'
    })
  },

  // 刷新位置
  onRefreshLocation() {
    this.getCurrentLocation()
  }
})