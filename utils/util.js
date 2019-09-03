const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
let api = 'https://api.xcustom.net';
const login=(res,callback)=>{
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
          callback(1)
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
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const showToastFun=function(icon,title){
  wx.showToast({
    icon: icon,
    title: title,
  })
  setTimeout(() => {
    wx.hideToast()
  }, 1500)
  return;
}

module.exports = {
  login,
  showToastFun,
  winState:['待开奖','待开奖','正在开奖','已开奖','已撤销'],
  formatTime: formatTime,
  api: api,
  apiUrl: 'https://static.xcustom.net/upload'
}
