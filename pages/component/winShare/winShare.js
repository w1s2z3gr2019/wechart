// pages/component/winShare/winShare.js
import { api, apiUrl } from '../../../utils/util.js';
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
 
  data: {
    ewmImg: apiUrl+'/static/940609329bc1911eb272d39b2999500.png',
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
          wx.showToast({
            icon: 'none',
            title: res.data.error[0].message,
          })
          setTimeout(() => {
            wx.hideToast()
          }, 1500)
          return;
        }
        let theData = res.data.data, userArr = [];
        if (theData.userList&&theData.userList.length > 7) {
          theData.userList.map((item, index) => {
            if (index < 7) {
              userArr.push(item)
            }
          })
          theData.userList = userArr
        }
          _this.setData({
            theData: theData,
          })
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title:'系统异常',
        })
        setTimeout(() => {
          wx.hideToast()
        }, 1500)
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