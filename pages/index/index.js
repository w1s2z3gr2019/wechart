//index.js
//获取应用实例
const app = getApp()
Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    }
  },
  data: {
    saveImgState:true,
    shareState:true,
    shareImgPath:'',
    screenWidth:0,
    listData:[
      {
        imgUrl:'../../image/title.png',
        weekTitle:'每周话题',
        title: '陈晓陈妍希夫妇今年会不会',
        jinp:'迪斯尼公仔一个',

      }
    ],
    list:[1,2,3,1,2,3,3],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //初始
  attached() {
    wx.hideTabBar({})
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          console.log(res)
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    //获取用户设备信息，屏幕宽度
    wx.getSystemInfo({
      success: res => {
        this.setData({
          screenWidth: res.screenWidth
        })
        console.log(this.data.screenWidth)
      }
    })
    this.saveImageToPhotosAlbum()
  },
  methods:{
    shareFun(){
      this.setData({
        shareState:false
      })
    },
    cancelFun(){
      this.setData({
        shareState: true
      })
    },
    closeSave(){
      this.setData({
        saveImgState:true
      })
    },
    saveImg(){
      this.setData({
        saveImgState:false,
        shareState: true
      })
      setTimeout(()=>{
        this.saveImageToPhotosAlbum()
      },500)
    },

    saveImageToPhotosAlbum:function () {
      var that = this;
      //设置画板显示，才能开始绘图
      var path1 = "../../image/tt.jpg"
      var canvasHead = '../../image/canvasHead.png';
      var title = '李胜利事件还会不会死灰复燃？';
      var dec = '5月28日 20:00 自动开奖/每月一次';
      var zanZhu = '竞猜官方  赞助';
      var headImg = '../../image/wechart.png';
      var canvasBot = '../../image/canvasBot.png';
      var gzhImg = '../../image/gzhImg.png'
      // var headImg = 'https://wx.qlogo.cn/mmopen/vi_32/wnicEL0zgiaOv78exJS4fCQUo5icC9Q05NFe41d9Dw4aA8qpRFHqMSkmp3eQGC9ucsb88v9kcze1q3RzsZn54V9qQ/132';
      var context = wx.createCanvasContext('share')
      //绘制标题
      context.setFillStyle('#fff');
      context.fillRect(0, 0, 300, 400);
      context.drawImage(canvasHead, 0, 0, 300, 65)
      context.drawImage(path1, 10, 75, 280, 125)
      context.setFontSize(14);
      context.setFillStyle("#000000");
      context.fillText(title,12, 220);
      context.setFontSize(12);
      context.setFillStyle("#999");
      context.fillText(dec, 12, 240);
      context.setFillStyle("#E43E16");
      context.fillText(zanZhu, 210, 240);
      context.setFillStyle("#F5F5F5");
      context.fillRect(12, 250, 276, 1);
      // wx.getImageInfo({
      //   src: headImg,
      //   success:function(res){
      //     console.log(res)
      //   }
      // })
      //画参与人员
      // context.beginPath();
      //  context.arc(27, 290, 15, 0, 2 * Math.PI, false);
      //  context.clip();

      for(let i=0;i<5;i++){
          context.arc(12+10*(i+1), 270, 10, 0, 2 * Math.PI, false);
          
          context.drawImage(headImg, 12 + i * 20, 260, 20, 20);
          if(i==4){
            context.setFillStyle("#999");
            context.fillText('等参与了抽奖', 120,275)
            context.fillText('>', 276, 275)
          }
      }
      //底部绘制
      context.drawImage(canvasBot, 0, 300,300, 100)
      context.setFillStyle('#ddd');
      context.fillRect(119, 289, 62, 62)
      context.drawImage(gzhImg, 120, 290, 60, 60)
      context.setFontSize(16);
      context.setFillStyle("#fff");
      context.fillText('长按识别小程序二维码', 75, 380)
      //把画板内容绘制成图片，并回调 画板图片路径
      context.draw(false, function () {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 300,
          height: 400,
          destWidth: 300 *750 / wx.getSystemInfoSync().windowWidth,
          destHeight: 400 *750 / wx.getSystemInfoSync().windowWidth,
          quality:1,
          canvasId: 'share',
          success: function (res) {
            that.setData({
              shareImgPath: res.tempFilePath
            })
            if (!res.tempFilePath) {
              console.log(res.tempFilePath)
            }
            console.log(that.data.shareImgPath)
          }
        })
      });
      },
      savefile(){
        wx.showToast({
          icon: 'loading',
          title: '保存中...'
        })
        wx.saveImageToPhotosAlbum({
          filePath: this.data.shareImgPath,
          //保存成功失败之后，都要隐藏画板，否则影响界面显示。
          success: (res) => {
            console.log(res)
            this.setData({
              saveImgState: true
            })
            wx.showToast({
              icon:'success',
              title:'保存成功'
            })
            setTimeout(()=>{
              wx.hideToast()
            },1500)
          },
          fail: (err) => {
            console.log(err)
            wx.showToast({
              icon:'none',
              title: '保存失败'
            })
            setTimeout(() => {
              wx.hideToast()
            }, 1500)
            this.setData({
              saveImgState: true
            })
          }
        })
      },
    onShareAppMessage: function (options) {
      console.log(options)
      let _this = this;
      _this.setData({
        shareState: true
      })
     return {
       title:'猜猜玩',
       path:'/pages/index/index',
       success:function(res){
         console.log(res)
       }
     }
    },
    getUserInfo: function (e) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  },
  
  
})
