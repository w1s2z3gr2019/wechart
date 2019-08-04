// pages/component/winShare/winShare.js
import { api, apiUrl } from '../../../utils/util.js';
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
 
  data: {
    name:'TTT',
    winP:'iPhoneX 512G 一台',
    name: '',
    urlImg: '',
    theData:{}
  },
  loadData: function (id) {
    let _this = this;
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: 'Loading...',
    })
    wx.request({
      method: 'get',
      url: api + '/api/portal/topicDetails',
      data: {
        id: id,
      },
      success(res) {
        if (res.data.error && res.data.error.length) {
          wx.hideLoading()
          $Message({
            content: res.data.error[0].message,
            type: 'warning'
          });
          return;
        }
        let theData = res.data.data;
          //渲染页面回到顶部
          _this.setData({
            theData: theData,
          })
      },
      fail: function (err) {
        wx.hideLoading();
        $Message({
          content: '数据请求失败',
          type: 'error'
        });
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData(options.id)
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
    var app = getApp();
    let userInfo = app.globalData.userInfo;
    this.setData({
      name: userInfo.nickName,
      urlImg: userInfo.avatarUrl
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [current]
    })
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
  onShareAppMessage: function (e) {
    console.log(e)
  }
})