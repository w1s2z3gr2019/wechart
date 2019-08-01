// pages/component/address/address.js
import { api, apiUrl } from '../../../utils/util.js';
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: 'Loading...',
    })
    let _this =this;
    wx.request({
      method: 'post',
      url: api + '/api/user/userContactList',
      data: {
        token: token,
        pageSize: 999,
        pageNo:1
      },
      success(res) {
        console.log(res.data)
        if (res.error && res.error.length) {
          wx.hideLoading();
          $Message({
            content: res.error[0].message,
            type: 'warning'
          });
          return;
        }
        let theData = res.data.data.list||[];
        theData.map((item,index)=>{
          theData[index].firstName = (item.contacts).substr(0,1)
        })
        _this.setData({
          list: theData
        })
        wx.hideLoading()
      },
      fail() {
        wx.hideLoading()
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