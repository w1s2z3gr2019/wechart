// pages/component/guess/guess.js
import { api, apiUrl } from '../../../utils/util.js';
const { $Message } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    initImg:'../../../image/tt.jpg',
    apiUrl: apiUrl,
    theData:{},
    successState:true,
    loadingHidden: true,
    topNub:0,
    wechartName:'rongrongBaby',
    guessType:1,
  },
  reachBottom:function(){
    console.log('到底了')
  },
  cancelGx:function(){
    this.setData({
      successState:true
    })
  },
  //参与抽奖  Q2
  canY_ques:function(){
    this.setData({
      successState: false
    })
  },
//选择问题3单选
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

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
        id:ids
      },
      success(res) {
        console.log(res.data)
        if (res.error && res.error.length) {
          wx.hideLoading()
          $Message({
            content: res.error[0].message,
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
        //渲染页面回到顶部
          _this.setData({
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
    console.log(e)
    wx.showLoading({
      title: 'Loading...',
    })
    wx.request({
      method: 'post',
      url: api + '/api/user/addChoose',
      data: {
        tid: this.data.theData.id,
        chooseValue: e.currentTarget.dataset.val,
        did: e.currentTarget.dataset.id
      },
      success(res) {
        console.log(res.data)
        if (res.error && res.error.length) {
          wx.hideLoading()
          $Message({
            content: res.error[0].message,
            type: 'warning'
          });
          return;
        }
        wx.hideLoading()
      },
      fail(){
        wx.hideLoading()
      }
    })
  },
  onLoad: function (options) {
    console.log(options)
    if (!options) return;
    this.loadData(options.id)
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
      imageUrl: '../../../image/tt.jpg',
      path: '/pages/component/guess/guess?type=' + guessType,
      success: function (rest) {
        
      },
      complete: function(){
       
　　　　}
    }
  }
})