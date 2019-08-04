// pages/component/lotteryResult/lotteryResult.js
import { api, apiUrl } from '../../../utils/util.js';
const { $Message } = require('../../dist/base/index');
const app =getApp();
console.log(app)
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    resultIndex:1,
    probability:'45%',
    id:'123456',
    theData:{},
    otherData:{},
    apiUrl:apiUrl
  },
  /**
   * 生命周期函数--监听页面加载
   */
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
        token:token
      },
      success(res) {
        if (res.data.error && res.data.error.length) {
          wx.hideLoading()
          $Message({
            content: res.data.error[0].message,
            type: 'warning'
          });
          return;
        }
        let theData = res.data.data;
        //渲染页面回到顶部
        _this.setData({
          theData: theData,
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
  onLoad: function (options) {
    console.log(options)
    this.loadData(options.id)
    let ids = wx.getStorageSync('idList')
    this.otherData(ids)
  },
  otherData: function (id) {
    let _this = this;
    let token = wx.getStorageSync('token');
    wx.request({
      method: 'get',
      url: api + '/api/portal/topicDetails',
      data: {
        id: id,
        token:token
      },
      success(res) {
        if (res.data.error && res.data.error.length) {
          wx.hideLoading()
          $Message({
            content: res.data.error[0].message,
            type: 'warning'
          });
          return;
        }
        let otherData = res.data.data;
        let beginT = item.drawTimes, md = '', mh = '';
        if (beginT) {
          let arrT = beginT.split(' ');
          let y = arrT[0], mhs = arrT[1];
          let yy = arrT[0].split('-'), mm = mhs.split(':');
          md = yy[1] + '月' + yy[2] + '日';
          mh = mm[0] + ':' + mm[1];
        }
        otherData.md=md;
        otherData.mh=mh;
        _this.setData({
          otherData: otherData,
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
  onShareAppMessage: function (res) {
    console.log(res)
    if (res.from === 'button') {
      console.log(res);
    }
    return {
      title: '中奖啦!!!',
      path: '/pages/component/winShare/winShare',
      success: function (res) {
        console.log('成功', res)
      }
    }
  },
})