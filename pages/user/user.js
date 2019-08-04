// pages/user/user.js
import { api, apiUrl } from '../../utils/util.js';
const { $Message } = require('../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userRow:8,
    totalCount:0,
    userW:0,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!options) return;
    console.log(options)
    let userRow = this.data.userRow;
    let winW = wx.getSystemInfoSync().windowWidth;
    let userW = (winW - 20 - 2 * userRow) / userRow;
    this.setData({
      userW: userW.toFixed(2)
    })
    this.loadData(options.id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  loadData(id){
    wx.showLoading({
      title: 'Loading...',
    })
    let token = wx.getStorageSync('token');
    const _this=this;
    wx.request({
      method: 'get',
      url: api + '/api/portal/selectByTcUser',
      data: {
        id: id
      },
      success(res) {
        console.log(res.data)
        wx.hideLoading() 
        if (res.data.error && res.data.error.length) {
          $Message({
            content: res.data.error[0].message,
            type: 'warning'
          });
          return;
        }
        let theData = res.data&&res.data.data.list||[],userT=[];
        theData.map(item=>{
          userT.push({
            avatarUrl: item.headUrl
          })
        })
        _this.setData({
          totalCount: res.data.data.totalCount,
          list: userT
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