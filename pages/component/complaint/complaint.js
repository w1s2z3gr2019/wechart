// pages/component/complaint/complaint.js
import { api, apiUrl } from '../../../utils/util.js';
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nub:0,
    textVal:'',
    phone:''
  },
  bindTextAreaBlur:function(e){
    let val = e.detail.value;
    this.setData({
      textVal:val,
      nub: val.length
    })
  },
  bindKeyInput:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  submit(){
    const _this = this;
    if (!this.data.phone){
      $Message({
        content: '请填写您的联系方式',
        type: 'warning'
      });
      return
    }
    if (!this.data.textVal) {
      $Message({
        content: '请填写投诉内容',
        type: 'warning'
      });
      return
    }
    wx.showLoading({
      title: 'Loading...',
    })
    let token = wx.getStorageSync('token')
    wx.request({
      method: 'post',
      url: api + '/api/user/addComplaintSuggestions',
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        title: this.data.phone,
        content:this.data.textVal,
        token:token
      },
      success(res) {
        wx.hideLoading();
        if (res.data.error && res.data.error.length) {
          wx.hideLoading()
          $Message({
            content: res.data.error[0].message,
            type: 'warning'
          });
          return;
        }
        $Message({
          content:'发送成功',
          type: 'success'
        });
        _this.setData({
          phone:'',
          textVal:''
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
  onShareAppMessage: function () {

  }
})