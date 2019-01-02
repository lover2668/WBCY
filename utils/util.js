var handle,
  url;

url = {
  getOfficeInfo: "https://itidcy.cn/WanBoServerTest/Patrol/GetOfficeInfo",
  getWatchInfo: "https://itidcy.cn/WanBoServerTest/Patrol/GetWatchInfo",
  // getWatchInfo: "http://localhost:11780/Patrol/GetWatchInfo",
  setWatchInfo: "https://itidcy.cn/WanBoServerTest/Patrol/SetWatchResult"
}

handle = {
  getRequest(action,data,callBack){
    console.log(url[action]);
    console.log("data is :")
    console.log(data);
    wx.request({
      url: url[action],
      method: "GET",
      data: data,
      success: function (e) {
        callBack(e.data);
      },
      fail: function (e) {
        console.log(e);
        callBack(e);

      }
    })
  },
  postRequest(action, submitData, callBack) {
    console.log(url[action]);
    console.log("submitData is :")
    console.log(submitData);
    wx.request({
      url: url[action],
      method: "POST",
      data: submitData,
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (e) {
        callBack(e.data);
      },
      fail: function (e) {
        console.log(e);
        // callBack(e);
        wx.showModal({
          title: '提示',
          content: '发生未知错误，请稍后重试',
          showCancel: false
        })
      }
    })
  }
}


module.exports = {
  handle: handle
}






// function formatTime(date) {
//   var year = date.getFullYear()
//   var month = date.getMonth() + 1
//   var day = date.getDate()

//   var hour = date.getHours()
//   var minute = date.getMinutes()
//   var second = date.getSeconds()


//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

// function formatNumber(n) {
//   n = n.toString()
//   return n[1] ? n : '0' + n
// }

// module.exports = {
//   formatTime: formatTime
// }
