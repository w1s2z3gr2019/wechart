// pages/component/lotteryResult/lotteryResult.js
const app =getApp();
console.log(app)
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    resultIndex:1,
    probability:'45%',
    id:'123456'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
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
  onShareAppMessage: function (res) {
    console.log(res)
    if (res.from === 'button') {
      console.log(res);
    }
    return {
      title: '中奖啦!!!',
      path: '/pages/component/winShare/winShare',
      success: function (res) {
        console.log('成功', res)
      }
    }
  },
})