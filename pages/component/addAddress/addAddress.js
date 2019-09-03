// pages/component/addAddress/addAddress.js
import { api, apiUrl, showToastFun ,login} from '../../../utils/util.js';
const { $Message } = require('../../dist/base/index');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressVal:'',
    region: [],
    name:'',
    phone:'',
    userInfo:app.globalData.userInfo,
    theData:{},
    detailedAddress:'',
    switchValue:false
  },
  getUserInfo: function (e) {
    const _this = this;
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      login(e.detail, (res) => {
        if (res) {
          _this.submit();
        }
      })
      this.setData({
        userInfo: e.detail.userInfo,
      })
    }
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
    let userInfo = app.globalData.userInfo;
    if (!userInfo){
      return 
    }
    wx.showLoading({
      title: 'Loading...',
    })
    if (!this.data.name) {
      showToastFun('none', '请填写收货人')
      return;
    }
    if (!this.data.phone) {
      showToastFun('none', '请填写收货人手机号码')
      return;
    }
    if (!(this.data.region.length)){
      showToastFun('none','请选择省市区')
      return;
    }
    if (!this.data.addressVal) {
      showToastFun('none', '请填写具体地址')
      return;
    }
    let cityArr = this.data.region;
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
          wx.showToast({
            icon: 'none',
            title: res.data.error[0].message,
          })
          setTimeout(() => {
            wx.hideToast()
          }, 1500)
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
          wx.showToast({
            icon: 'none',
            title: res.data.error[0].message,
          })
          setTimeout(() => {
            wx.hideToast()
          }, 1500)
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