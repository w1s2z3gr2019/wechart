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
    theData:{},
    detailedAddress:'',
    switchValue:false
  },
  switch1Change(e){
    this.setData({
      switchValue: !this.data.switchValue
    })
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
      addressVal:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  namefun(e){
    this.setData({
      name:e.detail.value
    })
  },
  phoneFun(e){
    this.setData({
     phone:e.detail.value
    })
  },
  submit(){
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: 'Loading...',
    })
    let cityArr = this.data.region;
    console.log(this.data.theData)
    let url = this.data.theData.id ? '/api/user/updateUserContact' : '/api/user/addUserContact'
    wx.request({
      method: 'post',
      url: api + url,
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        id:this.data.theData.id?this.data.theData.id:'',
        token: token,
        province: cityArr[0],
        city: cityArr[1],
        area:cityArr[2],
        address: this.data.addressVal,
        contacts: this.data.name,
        contactNumber:this.data.phone,
        status: this.data.switchValue?1:0
      },
      success(res) {
        console.log(res.data)
        if (res.data.error && res.data.error.length) {
          wx.hideLoading()
          $Message({
            content: res.data.error[0].message,
            type: 'warning'
          });
          return;
        }
        wx.navigateBack();
        wx.hideLoading()
      },
      fail() {
        wx.hideLoading()
      }
    })
  },
  del(){
    let token = wx.getStorageSync('token');
    wx.showLoading({
      title: 'Loading...',
    })
    wx.request({
      method: 'post',
      url: api +  '/api/user/deleteUserContact',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        id: this.data.theData.id,
        token:token
      },
      success(res) {
        console.log(res.data)
        if (res.data.error && res.data.error.length) {
          wx.hideLoading()
          $Message({
            content: res.data.error[0].message,
            type: 'warning'
          });
          return;
        }
        wx.navigateBack();
        wx.hideLoading()
      },
      fail() {
        wx.hideLoading()
      }
    })
  },
  onLoad: function (options) {
    if(options.id){
      console.log()
      this.setData({
        theData: options,
        addressVal:options.address,
        region: [options.province, options.city, options.area],
        name: options.contacts,
        phone: options.contactNumber,
        switchValue: options.status=='1'?true:false
      })
    }
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