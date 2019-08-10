// pages/component/lotteryResult/lotteryResult.js
import { api, apiUrl } from '../../../utils/util.js';
const { $Message } = require('../../dist/base/index');
const app =getApp();
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
    idList:[],
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
          wx.showToast({
            icon: 'none',
            title: res.data.error[0].message,
          })
          setTimeout(() => {
            wx.hideToast()
          }, 1500)
          return;
        }
        let theData = res.data.data,userArr=[];
        console.log(theData)
        if (theData.userList&&theData.userList.length > 7){
          theData.userList.map((item,index)=>{
            if(index<7){
              userArr.push(item)
            }
          })
          theData.userList = userArr
        }
        console.log(theData.userList)
        //渲染页面回到顶部
        _this.setData({
          theData: theData,
        })
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
  onLoad: function (options) {
    this.loadData(options.id)
    let idList = wx.getStorageSync('idList')
    let nub = Math.floor(Math.random() * idList.length)
    let ids ='';
    if (idList[nub] != options.id){
      ids = idList[nub]
    }else{
      ids = idList[Math.floor(Math.random() * idList.length)]
    }
    this.setData({
      idList
    })
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
          wx.showToast({
            icon: 'none',
            title: res.data.error[0].message,
          })
          setTimeout(() => {
            wx.hideToast()
          }, 1500)
          return;
        }
        let otherData = res.data.data;
        let beginT = otherData.drawTimes, md = '', mh = '';
        if (beginT) {
          let arrT = beginT.split(' ');
          let y = arrT[0], mhs = arrT[1];
          let yy = arrT[0].split('-'), mm = mhs.split(':');
          md = yy[1] + '月' + yy[2] + '日';
          mh = mm[0] + ':' + mm[1] + ':' + mm[2];
        }
        let userArr = [];
        if (otherData.userList && otherData.userList.length > 7) {
          otherData.userList.map((item, index) => {
            if (index < 7) {
              userArr.push(item)
            }
          })
          otherData.userList = userArr
        }
        otherData.md=md;
        otherData.mh=mh;
        _this.setData({
          otherData: otherData,
        })
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '系统异常'
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //用户查看跳转
  jumpUser(e) {
    wx.navigateTo({
      url: '/pages/user/user?id=' + this.data.otherData.id　　// 页面 B
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
    }
    return {
      title: '中奖啦!!!',
      path: '/pages/component/winShare/winShare?id='+this.data.theData.id,
      success: function (res) {
      }
    }
  },
})