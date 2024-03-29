// pages/component/problem/problem.js
import { api, apiUrl } from '../../../utils/util.js';
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
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
    const _this = this;
    wx.showLoading({
      title: 'Loading...',
    })
    let token = wx.getStorageSync('token')
    wx.request({
      method: 'GET',
      url: api + '/api/portal/selectCommonProblemList',
      data: {
        pageNo:1,
        pageSize:9999
      },
      success(res) {
        console.log(res.data)
        wx.hideLoading();
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
        console.log(res.data.data.list)
        let theData = res.data.data.list;
        theData.map((item,index)=>{
          let str = theData[index].content;
          theData[index].content = str.split(/\n/g);
        })
        console.log(theData)
        _this.setData({
          list:res.data.data.list
        })
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '系统异常',
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