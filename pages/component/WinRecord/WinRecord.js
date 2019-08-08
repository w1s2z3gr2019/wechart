// pages/component/WinRecord/WinRecord.js
// pages/component/guessRecord/guessRecord.js
import { api, apiUrl } from '../../../utils/util.js';
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    pageNum: 1,
    total: 0,
    listData: [],
    list: [1]
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
        status: 1,
        token: token
      },
      success(res) {
        console.log(res.data)
        wx.hideLoading();
        if (res.data.error && res.data.error.length) {
          wx.hideLoading()
          $Message({
            content: res.data.error[0].message,
            type: 'warning'
          });
          return;
        }
        let resDate = res.data && res.data.data, list = [];
        if (resDate.list && !resDate.list.length) {
          $Message({
            content: '暂无数据',
            type: 'success'
          });
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
            total: resDate.totalCount,
            listData: list
          })
        }
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