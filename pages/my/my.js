// pages/my/my.js
import { api } from '../../utils/util.js';
const { $Message } = require('../dist/base/index');
const app = getApp();
Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected:1
        })
      }
      wx.hideLoading();
      this.loadData();
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    theData:{},
    name: '',
    imgUrl: '../../image/tt.jpg',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  attached() {
    if (app.globalData.userInfo) {
      this.setData({
        name: app.globalData.userInfo.nickName,
        imgUrl: app.globalData.userInfo.avatarUrl
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          name: app.globalData.userInfo.nickName,
          imgUrl: app.globalData.userInfo.avatarUrl
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          console.log(res)
          this.setData({
            name: app.globalData.userInfo.nickName,
            imgUrl: app.globalData.userInfo.avatarUrl
          })
        }
      })
    }
  },
  methods:{
    loadData:function(){
      const _this = this;
      let token = wx.getStorageSync('token')
      if(!token){
        wx.showToast({
          icon: 'none',
          title: '未授权'
        })
        setTimeout(() => {
          wx.hideToast()
        }, 1500)
        return;
      }
      wx.showLoading({
        title: 'Loading...',
      })
      wx.request({
        method: 'GET',
        url: api + '/api/user/getMyDetails',
        data: {
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
          let theData = res.data.data;
          _this.setData({
            theData
          })
        },
        fail: function (err) {
          wx.hideLoading();
          $Message({
            content: '数据请求失败',
            type: 'error'
          });
        },
        complete:function(){
          wx.hideLoading();
        }
      })
    }
  }
})