// pages/component/gailv/gailv.js
import { api, apiUrl, winState } from '../../../utils/util.js';
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listState:false,
    winState: winState,
    loading: false,
    pageNum: 1,
    total: 0,
    listData: [],
    list: [1, 2, 12, 1]
  },
  loadData(pageNum) {
    const _this = this;
    wx.showLoading({
      title: 'Loading...',
    })
    let token = wx.getStorageSync('token');
    let nub = pageNum ? pageNum : _this.data.pageNum;
    wx.request({
      method: 'GET',
      url: api + '/api/user/getMyGuessing',
      data: {
        pageNo: nub,
        pageSize: 10,
        status: 0,
        token: token
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
        let resDate = res.data && res.data.data, list = [];
        if (resDate.list && !resDate.list.length) {
          return;
        }
        (resDate.list).map(item => {
          let beginT = item.drawTime, yy = '', hms = '';
          if (beginT) {
            let arrT = beginT.split(' ');
            yy = arrT[0];
            hms = arrT[1];
          }
          list.push({
            status: item.status,
            title: item.title,
            prizeDescription: item.prizeDescription,
            probability: item.probability * 100,
            id: item.id,
            yy: yy,
            hms: hms,
            statusValue: item.statusValue
          })
        })
        if (pageNum) {
          _this.setData({
            pageNum
          });
          _this.lower(list);
        } else {
          _this.setData({
            listState:true,
            total: resDate.totalCount,
            listData: list
          })
        }
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
  //数据滚动加载
  lower(resData) {
    //此处放后台获取的数据
    const _this = this;
    var result = _this.data.listData;
    var cont = result.concat(resData);
    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
    });
    setTimeout(() => {
      _this.setData({
        loading: false,
        listData: cont,
      });
      wx.hideLoading();
    }, 1500)
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
    let total = this.data.total,
      listLen = this.data.listData.length;
    let pageNum = this.data.pageNum + 1;
    if (listLen >= total) {
      return;
    }
    this.setData({
      loading: true
    })
    this.loadData(pageNum)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})