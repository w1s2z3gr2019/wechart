// pages/component/guess/guess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHidden: true,
    topNub:0,
    wechartName:'rongrongBaby',
    guessType:1,
    title: ["李胜利事件还会不会死灰复燃？", "黄金今日行情最高多少点？","美国封锁下的华为将以什么样的结果收场？"],
    items: [
      { name: 'USA', value: '华为终将用5G技术占领美国' },
      { name: 'CHN', value: '美国的国家力量会让华为破产', checked: 'true' },
      { name: 'BRA', value: '听说有瓜，我是来当吃瓜群众的' },
    ],
    
  },
  reachBottom:function(){
    console.log('到底了')
  },
//选择问题3单选
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  touchMove: function () {
    console.log('按住不松')
    var nub = this.data.topNub;
    nub++
    this.setData({
      topNub: nub
    })
    console.log(nub)
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
  loadData:function(){
    let arr =[1,2,3];
    let nub = Math.floor(Math.random()*3);
    setTimeout(()=>{
      this.setData({
        guessType: arr[nub],
        topNub:0,
        loadingHidden:true
      })
      this.goTop();
    },3000)
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      guessType: options.guessType
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
  onShareAppMessage: function () {

  }
})