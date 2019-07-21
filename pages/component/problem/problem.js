// pages/component/problem/problem.js
import { api, apiUrl } from '../../../utils/util.js';
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    guessType:0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideLoading();
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
    this.loadData()
  },
  loadData(){
    wx.showLoading({
      title: 'Loading...',
    })
    let token = wx.getStorageSync('token')
    wx.request({
      method: 'GET',
      url: api + '/api/admin/selectCommonProblemList',
      data: {
        pageNo:1,
        pageSize:9999
      },
      success(res) {
        console.log(res.data)
        wx.hideLoading()
        if (res.error && res.error.length) {
          $Message({
            content: res.error[0].message,
            type: 'warning'
          });
          return;
        }
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