// pages/component/tabBar/tabBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      state:{
        type:String,
        value:'1'
      }
  },
  /**
   * 组件的初始数据
   */
  data: {
    indexYes:'../../../image/index_Yes.png',
    indexNo: '../../../image/index_no.png',
    myYes: '../../../image/myYes.png',
    myNo: '../../../image/myNo.png',
    show:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    activeTab:function(e){
      let id = e.currentTarget.dataset.id;
      if (id == this.data.state) return;
        this.setData({
          state:id
        })
        if (id == '1') {
          wx.redirectTo({
            url: '/pages/index/index',
          })
        }
        if (id == '2') {
          wx.redirectTo({
            url: '/pages/my/my',
          })
        }
      }
  }
})
