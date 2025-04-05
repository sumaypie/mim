// pages/model-jobs/model-jobs.js
Page({
  data: {
    currentFilter: 'all',
    jobs: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    keyword: ''
  },

  onLoad() {
    this.loadJobs()
  },

  // 加载招聘信息
  loadJobs(refresh = false) {
    if (this.data.loading || (!refresh && !this.data.hasMore)) return

    this.setData({ loading: true })

    // TODO: 调用后端API获取招聘信息
    // const params = {
    //   page: refresh ? 1 : this.data.page,
    //   pageSize: this.data.pageSize,
    //   filter: this.data.currentFilter,
    //   keyword: this.data.keyword
    // }

    // 模拟数据
    setTimeout(() => {
      const mockJobs = [
        {
          id: 1,
          title: '素描人体模特',
          salary: '300元/3小时',
          location: '北京朝阳区',
          duration: '3小时',
          date: '2024-01-20',
          status: '招募中',
          studio: {
            avatar: '/static/images/studio-avatar.png',
            name: '某某画室'
          }
        },
        // 更多模拟数据...
      ]

      if (refresh) {
        this.setData({
          jobs: mockJobs,
          page: 2,
          hasMore: true,
          loading: false
        })
      } else {
        this.setData({
          jobs: [...this.data.jobs, ...mockJobs],
          page: this.data.page + 1,
          hasMore: mockJobs.length === this.data.pageSize,
          loading: false
        })
      }
    }, 500)
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      keyword: e.detail.value
    })
    this.loadJobs(true)
  },

  // 筛选切换
  onFilterChange(e) {
    const filterType = e.currentTarget.dataset.type
    this.setData({
      currentFilter: filterType
    })
    this.loadJobs(true)
  },

  // 加载更多
  onLoadMore() {
    this.loadJobs()
  },

  // 发布招聘
  onPostJob() {
    wx.navigateTo({
      url: '/pages/post-job/post-job'
    })
  },

  // 查看招聘详情
  onJobDetail(e) {
    const jobId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/job-detail/job-detail?id=${jobId}`
    })
  },

  onPullDownRefresh() {
    this.loadJobs(true)
    wx.stopPullDownRefresh()
  }
})