const app = getApp();
const { isSuperAdmin } = require('../../utils/auth');

Page({
  data: {
    userInfo: null
  },

  onLoad: function() {
    // 检查是否为超级管理员
    const userInfo = app.globalData.userInfo;
    if (!isSuperAdmin(userInfo)) {
      wx.showToast({
        title: '无访问权限',
        icon: 'none'
      });
      wx.switchTab({
        url: '/pages/index/index'
      });
      return;
    }

    this.setData({
      userInfo: userInfo
    });
  },

  // 页面跳转处理
  navigateTo: function(e) {
    const path = e.currentTarget.dataset.path;
    if (path.startsWith('/pages/')) {
      if (path.includes('index/index')) {
        wx.switchTab({
          url: path
        });
      } else {
        wx.navigateTo({
          url: path
        });
      }
    }
  }
});