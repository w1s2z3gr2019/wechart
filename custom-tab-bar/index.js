Component({
  data: {
    selected:0,
    "color": "#fff",
    "selectedColor": "#999999",
    "borderStyle": "white",
    "backgroundColor": "#E70012",
    list: [{
      activeYes:'active',
      activeNo:'',
      pagePath: "/pages/index/index",
      iconPath: "/image/index_no.png",
      selectedIconPath: "/image/index_Yes.png",
      text: "主页"
    }, {
      activeYes: 'active',
      activeNo: '',
      pagePath: "/pages/my/my",
      iconPath: "/image/myNo.png",
      selectedIconPath: "/image/myYes.png",
      text: "我的"
    }]
  },
  attached() {
    
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path;
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})