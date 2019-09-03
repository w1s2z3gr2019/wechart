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
    imgUrl: '',
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
          this.setData({
            name: app.globalData.userInfo.nickName,
            imgUrl: app.globalData.userInfo.avatarUrl
          })
        }
      })
    }
  },
  methods:{
    getUserInfo: function (e) {
      if (e.detail.userInfo) {
        let userInfo =  e.detail.userInfo;
        app.globalData.userInfo = e.detail.userInfo;
        this.login(e.detail)
        this.setData({
          userInfo: e.detail.userInfo,
          imgUrl: userInfo.avatarUrl,
          name:userInfo.nickName
        })
      }
    },
    login: function (res) {
      const _this = this;
      wx.showLoading({
        title: 'Loading...',
      })
      wx.login({
        success: ret => {
          wx.request({
            method: 'GET',
            url: api + '/open/signin',
            data: {
              code: ret.code,
              nickName: res.userInfo.nickName,
              avatarUrl: res.userInfo.avatarUrl,
              remember: false
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
              wx.setStorageSync('token', res.data.token)
              //请求数据
              setTimeout(()=>{
                _this.loadData();
              },100)
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
        }
      })
    },
    loadData:function(){
      const _this = this;
      let token = wx.getStorageSync('token');
      let userInfo = app.globalData.userInfo;
      if (!userInfo){
        return;
      }
      wx.request({
        method: 'GET',
        url: api + '/api/user/getMyDetails',
        data: {
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
          let theData = res.data.data;
          _this.setData({
            theData
          })
        },
        fail: function (err) {
          wx.hideLoading();
          
        },
        complete:function(){
          wx.hideLoading();
        }
      })
    }
  }
})