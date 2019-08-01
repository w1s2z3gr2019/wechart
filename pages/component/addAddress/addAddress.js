// pages/component/addAddress/addAddress.js
import { api, apiUrl } from '../../../utils/util.js';
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressVal:'',
    region: [],
    name:'',
    phone:'',
    detailedAddress:''
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  address:function(){
    wx.addPhoneContact({
      success(res){
        console.log(res)
      } 
    })
  },
  bindTextAreaBlur(e){
    this.setData({
      addressVal:e.details.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  namefun(e){
    this.setData({
      name:e.details.value
    })
  },
  phoneFun(e){
    this.setData({
     phone:e.details.value
    })
  },
  submit(){
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: 'Loading...',
    })
    let cityArr = this.data.region;
    wx.request({
      method: 'post',
      url: api + '/api/user/addUserContact',
      data: {
        token: token,
        province: cityArr[0],
        city: cityArr[1],
        area:cityArr[2],
        address: this.data.addressVal,
        contacts: this.data.name,
        contactNumber:this.data.phone
      },
      success(res) {
        console.log(res.data)
        if (res.error && res.error.length) {
          wx.hideLoading()
          $Message({
            content: res.error[0].message,
            type: 'warning'
          });
          return;
        }
        wx.hideLoading()
      },
      fail() {
        wx.hideLoading()
      }
    })
  },
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