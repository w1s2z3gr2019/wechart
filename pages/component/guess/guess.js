// pages/component/guess/guess.js
import { api, apiUrl } from '../../../utils/util.js';
const { $Message } = require('../../dist/base/index');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasUserInfo:false,
    userInfo:{},
    initId:'',
    initImg:'../../../image/tt.jpg',
    apiUrl: apiUrl,
    theData: {},
    successState:true,
    loadingHidden: true,
    topNub:0,
    wechartName:'rongrongBaby',
    guessType:1,
    gv_id:''
  },
  reachBottom:function(){
    console.log('到底了')
  },
  cancelGx:function(){
    this.setData({
      successState:true
    })
  },
  inpChange(e){
    this.setData({
      val:e.detail.value
    })
  },
//选择问题3单选
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      gv_id: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  touchMove: function () {
    var nub = this.data.topNub;
    nub++
    this.setData({
      topNub: nub
    })
    if (nub == 7) {
      this.setData({
        loadingHidden:false
      })
      this.loadData()
    }
  },
  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  loadData:function(id){
    let _this = this;
    let token = wx.getStorageSync('token');
    let idList = wx.getStorageSync('idList') || [],
        nub = Math.floor(Math.random()*idList.length)
    let ids = id;
    if(!id){
      ids=idList[nub];
    }else{
      wx.showLoading({
        title: 'Loading...',
      })
    }
    console.log(ids)
    wx.request({
      method: 'get',
      url: api + '/api/portal/topicDetails',
      data: {
        id:ids,
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
        console.log(theData)
        let beginT = theData.drawTimes, md = '', mh = '';
        if (beginT) {
          let arrT = beginT.split(' ');
          let y = arrT[0], mhs = arrT[1];
          let yy = arrT[0].split('-'), mm = mhs.split(':');
          md = yy[1] + '月' + yy[2] + '日';
          mh = mm[0] + ':' + mm[1];
        }
        theData.pictureUrl = apiUrl + theData.pictureUrl;
        theData.md=md;
        theData.mh=mh;
        theData.drawT = theData.drawTimes ? theData.drawTimes.split(' ')[1] : '',
        //渲染页面回到顶部
          _this.setData({
            gv_id:'',
            theData:theData,
            guessType: theData.drawType,
            topNub: 0,
            loadingHidden: true
          })
          _this.goTop();
      },
      fail: function (err) {
        wx.hideLoading();
        $Message({
          content: '数据请求失败',
          type: 'error'
        });
      },
      complete: function () {
        _this.setData({
          topNub: 0,
          loadingHidden:true
        })
        wx.hideLoading();
      }
    })
    
  },
  //参与
  canY_ques(e){
    let token = wx.getStorageSync('token');
    const _this = this;
    console.log(e.currentTarget.dataset)
    let val = e.currentTarget.dataset.val||'';
    let id = e.currentTarget.dataset.id||'';
    let theData = this.data.theData||{};
    if (theData.drawType==2){
      id=this.data.gv_id
    }
    if (theData.drawType == 1) {
      id = theData.drawList[0].id
    }
    if (!id) {
      $Message({
        content: '请选择话题答案',
        type: 'warning'
      });
      return;
    }
    console.log()
    wx.showLoading({
      title: 'Loading...',
    })
    wx.request({
      method: 'post',
      url: api + '/api/user/addChoose',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        token:token,
        tid: this.data.theData.id,
        chooseValue: val,
        did: id
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
        _this.loadData(_this.data.initId)
        wx.hideLoading()
      },
      fail(){
        wx.hideLoading()
      }
    })
  },
  onLoad: function (options) {
    if (!options) return;
    this.setData({
      initId: options.id
    })
    //处理分享出去的页面
    // if(options.type){
    //   this.login(options)
    // }
    this.loadData(options.id)
  },
  login(){
    const _this = this;
    if (app.globalData.userInfo) {
      _this.shareLogin(app.globalData)
      _this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (_this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        _this.shareLogin(res)
        _this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          _this.shareLogin(res)
          _this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  shareLogin(res){
    const _this = this;
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
          wx.showModal({
            title: '登录了',
            content: '的撒打算',
          })
            if (res.data.error && res.data.error.length) {
              wx.hideLoading()
              $Message({
                content: res.data.error[0].message,
                type: 'warning'
              });
              return;
            }
            wx.setStorageSync('token', res.data.token)
            //请求数据
            _this.loadData(_this.data.initId);
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
      }
    })
  },
  //复制到剪贴板
  copy:function(){
    let val = this.data.wechartName;
    wx.setClipboardData({
      data: val,
      success(res){
        wx.showToast({
          title: '复制成功',
        })
        setTimeout(()=>{
          wx.hideToast()
        },1500)
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
    this.setData({
      gv_id:''
    })
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
    console.log('触底了')
   
  },
  getUserInfo: function (e) {
    console.log(e)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.login(e.detail)
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res);
      this.setData({
        successState: true
      })
    }
    let guessType = this.data.guessType;
    console.log(guessType)
    return {
      title: '竞猜啦',
      path: '/pages/component/guess/guess?id='+this.data.theData.id+'&type=1',
      success: function (rest) {
        
      },
      complete: function(){
       
　　　}
    }
  }
})