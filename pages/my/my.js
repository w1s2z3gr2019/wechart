// pages/my/my.js
const app = getApp();
Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 1
        })
      }
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    imgUrl: '../../image/tt.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  attached() {
    console.log(app)
    this.setData({
      name: app.globalData.userInfo.nickName,
      imgUrl: app.globalData.userInfo.avatarUrl
    })
  },
  methods: {
  }
})