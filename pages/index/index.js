//index.js
import { api, apiUrl} from '../../utils/util.js';
const { $Message } = require('../dist/base/index');
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
    frequencyData:['周','月','日'],
    apiUrl: apiUrl,
    visible: true,
    saveImgState:true,
    shareState:true,
    shareImgPath:'',
    initImg:'../../image/tt.jpg',
    screenWidth:0,
    loading:false,
    actions: [
      {
        name: '登录',
        color: '#2d8cf0',
      },
    
    ],
    pageNum:1,
    total:0,
    listData:[],
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //初始
  attached() {
    wx.removeStorageSync('idList')
    wx.hideTabBar({})
    if (app.globalData.userInfo) {
      this.login(app.globalData)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.login(res)
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
          this.login(res)
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
    login: function (res, pageNum) {
      const _this = this;
      if (!res){
        loadData(pageNum)
        return;
      }
      wx.showLoading({
        title: 'Loading...',
      })
      wx.login({
        success: ret => {
          wx.request({
            method: 'GET',
            url: api + '/open/signin',
            data: {
              code:ret.code,
              nickName: res.userInfo.nickName,
              avatarUrl: res.userInfo.avatarUrl,
              remember: false
            },
            success(res) {
              if (res.error&&res.error.length){
                wx.hideLoading()
                $Message({
                  content: res.error[0].message,
                  type: 'warning'
                });
                return;
              }
              wx.setStorageSync('token', res.data.token)
              //请求数据
              loadData();
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

      function loadData(pageNum) {
        wx.showLoading({
          title: '加载中...',
        })
        let nub = pageNum ? pageNum : _this.data.pageNum;
        wx.request({
          method: 'GET',
          url: api + '/api/portal/selectByTC',
          data: {
            pageNo:nub,
            pageSize:6
          },
          success(res) {
            wx.hideLoading()
            if (res.error && res.error.length) {
              $Message({
                content: res.error[0].message,
                type: 'warning'
              });
              return;
            }
            let resDate = res.data&&res.data.data,list=[];
            console.log(resDate.list);
            if (resDate.list && !resDate.list.length){
              $Message({
                content: '暂无数据',
                type: 'success'
              });
              return;
            }
            let idList = [];
            (resDate.list).map(item=>{
              let beginT = item.drawTimes,md='',mh='';
              if (beginT){
                let arrT = beginT.split(' ');
                let y = arrT[0],mhs = arrT[1];
                let yy = arrT[0].split('-'),mm=mhs.split(':');
                md=yy[1]+'月'+yy[2]+'日';
                mh = mm[0]+':'+mm[1];
              }
              idList.push(item.id)
              list.push({
                title:item.title,
                id:item.id,
                md:md,
                mh:mh,
                frequency: item.frequency,
                typeValue: item.typeValue,
                frequencyValue: item.frequencyValue,
                pictureUrl: item.pictureUrl && item.pictureUrl != '0' ? item.pictureUrl:'',
                prizeDescription: item.prizeDescription,
                sponsorshipType: item.sponsorshipType,
                sponsorshipTypeValue: item.sponsorshipTypeValue,
                sponsor: item.sponsor && item.sponsor.length >8?item.sponsor.substr(0,8)+'...':item.sponsor,
                userListAll:item.userList,
                userList: item.userList && item.userList.length > 6 ? item.userList.length=6:item.userList || [{ avatarUrl:'https://wx.qlogo.cn/mmopen/vi_32/wnicEL0zgiaOv78exJS4fCQUo5icC9Q05NFe41d9Dw4aA8qpRFHqMSkmp3eQGC9ucsb88v9kcze1q3RzsZn54V9qQ/132',id:'1'}],
              })
            })
            if (pageNum) {
              _this.setData({
                pageNum
              });
              lower(list);
            } else {
              _this.setData({
                total: resDate.totalCount,
                listData: list
              })
              wx.setStorageSync('idList', idList)
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
      }
      //数据滚动加载
      function lower(resData) {
        //此处放后台获取的数据
        var result = _this.data.listData;
        var cont = result.concat(resData),idList=[];
        cont.map(item=>{
          idList.push(item.id)
        })
        wx.setStorageSync('idList', idList)
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
      }
    },
    //下滑加载
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
      this.login('',pageNum)
    },
    handleOpen() {
      this.setData({
        visible1: true
      });
    },
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
    //用户查看跳转
    jumpUser(e){
      let id = e.currentTarget.dataset.id||'';
      wx.navigateTo({
        url: '/pages/user/user?id='+id　　// 页面 B
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
      let data = this.data.listData[0];
      if(!data){
        return;
      }
     
      //设置画板显示，才能开始绘图
      var path1 = data.pictureUrl?data.pictureUrl:"../../image/tt.jpg"
      var canvasHead = '../../image/canvasHead.png';
      var tit = '['+data.typeValue+']';
      var title = data.title||'';
      var dec = data.md ? data.md + ' ' + data.mh + ' 自动开奖':'自动开奖';
      var zanZhu = data.sponsorshipType ? data.sponsor && data.sponsor.length > 5 ? data.sponsor.substr(0, 5) + '... 赞助' : data.sponsor +' 赞助':'竞猜官方 赞助';
      var headImg = '../../image/wechart.png';
      var canvasBot = '../../image/canvasBot.png';
      var gzhImg = '../../image/gzhImg.png'
      var context = wx.createCanvasContext('share')
      //绘制标题
      context.setFillStyle('#fff');
      context.fillRect(0, 0, 300, 400);
      context.drawImage(canvasHead, 0, 0, 300, 65)
      context.drawImage(path1, 10, 75, 280, 125)
      context.setFontSize(14);
      context.setFillStyle("#000000");
      context.fillText(tit, 12, 220);
      context.fillText(title, 13 * tit.length, 220);
      context.setFontSize(12);
      context.setFillStyle("#999");
      context.fillText(dec, 12, 240);
      context.setFillStyle("#E43E16");
      console.log(300 - 30 - (zanZhu.length) * 13);
      context.fillText(zanZhu, 300-(zanZhu.length)*12.5, 240);
      context.setFillStyle("#F5F5F5");
      context.fillRect(12, 260, 276, 1);
      //底部绘制
      context.drawImage(canvasBot, 0, 300, 300, 100)
      context.setFillStyle('#ddd');
      context.fillRect(119, 289, 62, 62)
      context.drawImage(gzhImg, 120, 290, 60, 60)
      context.setFontSize(16);
      context.setFillStyle("#fff");
      context.fillText('长按识别小程序二维码', 75, 380)
      // for (let i = 0; i < data.userList.length;i++){
      //     context.arc(12+10*(i+1), 270, 10, 0, 2 * Math.PI, false);
      //     context.drawImage(data.userList[i].avatarUrl, 12 + i * 20, 260, 20, 20);
      //   if (i == (data.userList.length-1)){
      //     context.setFillStyle("#999");
      //     context.fillText('等参与了抽奖', 18 + data.userList.length* 20, 275)
      //     context.fillText('>', 276, 275)
      //   }
           
      // }
     
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
       title:'猜奖',
       path:'/pages/index/index',
       success:function(res){
         console.log(res)
       }
     }
    },
    handleClick:function(){
      this.setData({
        hasUserInfo: true
      })
    },
    getUserInfo: function (e) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      this.login(e.detail)
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
  },
  
  
})
