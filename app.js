// app.js
App({
  globalData: {
    userInfo: null,
    role: null, // 'super_admin', 'studio', 'model', 'customer'
    baseUrl: 'https://api.mimstudio.com', // 后端API地址，需要替换为实际地址
    version: '1.0.0'
  },
  
  onLaunch: function() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    this.login()

    // 获取用户信息
    this.getUserInfo()
  },

  // 手机号登录
  loginByPhone: function(phone, verifyCode) {
    return new Promise((resolve, reject) => {
      // 验证手机号格式
      const phoneReg = /^1[3-9]\d{9}$/
      if (!phoneReg.test(phone)) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none'
        })
        reject(new Error('手机号格式不正确'))
        return
      }

      // 验证验证码（固定为123456）
      if (verifyCode !== '123456') {
        wx.showToast({
          title: '验证码错误',
          icon: 'none'
        })
        reject(new Error('验证码错误'))
        return
      }

      // 模拟登录成功
      const mockLoginData = {
        success: true,
        token: 'mock_token_' + Date.now(),
        userInfo: {
          id: 1,
          phone: phone,
          role: 'model', // 可以根据需要设置角色
          nickname: '测试用户',
          avatar: '/static/images/logo.svg'
        }
      }

      // 保存token
      wx.setStorageSync('token', mockLoginData.token)
      // 保存用户角色和信息
      this.globalData.role = mockLoginData.userInfo.role
      this.globalData.userInfo = mockLoginData.userInfo

      // 显示登录成功提示
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 2000
      })

      resolve(mockLoginData)
    })
  },

  // 登录方法
  login: function(retryCount = 0) {
    const MAX_RETRY = 3;
    const RETRY_DELAY = 1000; // 1秒后重试

    return new Promise((resolve, reject) => {
      // 检查网络状态
      wx.getNetworkType({
        success: networkRes => {
          if (networkRes.networkType === 'none') {
            wx.showToast({
              title: '网络连接已断开，请检查网络设置',
              icon: 'none',
              duration: 3000
            });
            reject(new Error('网络连接已断开'));
            return;
          }

          wx.login({
            success: res => {
              if (res.code) {
                // 调用后端登录接口
                wx.request({
                  url: `${this.globalData.baseUrl}/api/auth/login`,
                  method: 'POST',
                  data: {
                    code: res.code
                  },
                  success: loginRes => {
                    if (loginRes.data.success) {
                      // 保存token
                      wx.setStorageSync('token', loginRes.data.token)
                      // 保存用户角色
                      if (loginRes.data.userInfo && loginRes.data.userInfo.role) {
                        this.globalData.role = loginRes.data.userInfo.role
                        this.globalData.userInfo = loginRes.data.userInfo
                      }
                      resolve(loginRes.data)
                    } else {
                      const errorMsg = loginRes.data.message || '登录失败';
                      wx.showToast({
                        title: errorMsg,
                        icon: 'none',
                        duration: 2000
                      });
                      reject(new Error(errorMsg));
                    }
                  },
                  fail: err => {
                    console.error('登录请求失败', err);
                    if (retryCount < MAX_RETRY) {
                      // 延迟重试
                      setTimeout(() => {
                        this.login(retryCount + 1)
                          .then(resolve)
                          .catch(reject);
                      }, RETRY_DELAY);
                    } else {
                      wx.showToast({
                        title: '网络请求失败，请稍后重试',
                        icon: 'none',
                        duration: 2000
                      });
                      reject(err);
                    }
                  }
                })
              } else {
                const errorMsg = '微信登录失败：' + (res.errMsg || '未知错误');
                wx.showToast({
                  title: errorMsg,
                  icon: 'none',
                  duration: 2000
                });
                console.error(errorMsg);
                reject(new Error(errorMsg));
              }
            },
            fail: err => {
              const errorMsg = '微信登录调用失败：' + (err.errMsg || '未知错误');
              wx.showToast({
                title: errorMsg,
                icon: 'none',
                duration: 2000
              });
              console.error(errorMsg);
              reject(new Error(errorMsg));
            }
          })
        },
        fail: err => {
          wx.showToast({
            title: '网络状态检查失败',
            icon: 'none',
            duration: 2000
          });
          reject(new Error('网络状态检查失败'));
        }
      });
    })
  },

  // 获取用户信息
  getUserInfo: function() {
    const { checkPermission, isSuperAdmin } = require('./utils/auth');
    return new Promise((resolve, reject) => {
      // 检查是否有token
      const token = wx.getStorageSync('token')
      if (!token) {
        // 尝试重新登录
        return this.login()
          .then(() => this.getUserInfo())
          .catch(err => {
            wx.showToast({
              title: '请先登录',
              icon: 'none'
            })
            reject('未登录')
          });
      }

      // 获取用户信息
      wx.request({
        url: `${this.globalData.baseUrl}/api/user/info`,
        method: 'GET',
        header: {
          'Authorization': `Bearer ${token}`
        },
        success: res => {
          if (res.data.success) {
            const userInfo = res.data.userInfo;
            // 检查是否为超级管理员
            if (isSuperAdmin(userInfo)) {
              userInfo.role = 'super_admin';
            }
            this.globalData.userInfo = userInfo;
            this.globalData.role = userInfo.role;
            resolve(userInfo)
          } else {
            // 如果返回未登录错误，尝试重新登录
            if (res.data.message === '未登录' || res.data.code === 401) {
              return this.login()
                .then(() => this.getUserInfo())
                .catch(err => {
                  wx.showToast({
                    title: '登录已过期，请重新登录',
                    icon: 'none'
                  })
                  reject('登录已过期')
                });
            }
            reject(res.data.message || '获取用户信息失败')
          }
        },
        fail: err => {
          console.error('获取用户信息请求失败', err)
          reject(err)
        }
      })
    })
  },

  // 检查用户是否已完善信息
  checkUserProfile: function() {
    const userInfo = this.globalData.userInfo
    if (!userInfo) return false
    
    // 根据不同角色检查必要信息
    switch(userInfo.role) {
      case 'studio':
        return userInfo.name && userInfo.phone
      case 'model':
        return userInfo.name && userInfo.phone && userInfo.gender
      case 'customer':
        return userInfo.name && userInfo.phone
      default:
        return false
    }
  },

  // 检查登录状态
  checkLoginStatus: function() {
    const token = wx.getStorageSync('token')
    return !!token
  }
  
})