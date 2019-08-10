const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  winState:['待开奖','待开奖','正在开奖','已开奖','已撤销'],
  formatTime: formatTime,
  api: "https://api.xcustom.net",
  apiUrl: 'https://static.xcustom.net/upload'
}
