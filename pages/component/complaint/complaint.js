// pages/component/complaint/complaint.js
import { api, apiUrl, showToastFun,login } from '../../../utils/util.js';
const { $Message } = require('../../dist/base/index');
let app =getApp();
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
  getUserInfo: function (e) {
    const _this = this;
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      login(e.detail, (res) => {
        if (res) {
          _this.submit()
        }
      })
      this.setData({
        userInfo: e.detail.userInfo,
      })
    }
  },
  submit(){
    let token = wx.getStorageSync('token');
    let userInfo = app.globalData.userInfo;
    if (!userInfo) {
      return
    }
    const _this = this;
    if (!this.data.textVal) {
      wx.showToast({
        icon: 'none',
        title: '请填写投诉内容',
      })
      setTimeout(() => {
        wx.hideToast()
      }, 1500)
      return
    }
    if (!this.data.phone){
      wx.showToast({
        icon: 'none',
        title: '请填写您的联系方式',
      })
      setTimeout(() => {
        wx.hideToast()
      }, 1500)
      return
    }
    
    wx.showLoading({
      title: 'Loading...',
    })
    
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
          wx.showToast({
            icon: 'none',
            title: res.data.error[0].message,
          })
          setTimeout(() => {
            wx.hideToast()
          }, 1500)
          return;
        }
        wx.showToast({
          icon: 'success',
          title: '发送成功,感谢您的建议',
        })
        setTimeout(() => {
          wx.hideToast()
        }, 1500)
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