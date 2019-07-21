// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nub:100,
    userRow:8,
    pageSize:100,
    userW:0,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!options) return;
    console.log(options)
    let userRow = this.data.userRow;
    let winW = wx.getSystemInfoSync().windowWidth;
    console.log(winW)
    let userW = (winW - 20 - 2 * userRow) / userRow;
    console.log(userW)
    this.setData({
      userW: userW.toFixed(2)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let res = [];
    for(let i=0;i<100;i++){
      res.push({
        avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/wnicEL0zgiaOv78exJS4fCQUo5icC9Q05NFe41d9Dw4aA8qpRFHqMSkmp3eQGC9ucsb88v9kcze1q3RzsZn54V9qQ/132'
      })
    }
    this.setData({
      list:res
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})