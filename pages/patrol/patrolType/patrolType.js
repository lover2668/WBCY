const config = require("../../../utils/config.js");
const util = require("../../../utils/util.js");
const serverData = require("../../../utils/serverData.js");

Page({
  data: {
    currentOffice: "",
    patrolTypes: [],
  },

  /*
  界面初始化时触发
  该方法中，将判断管理处信息是否存在，若不存在，则跳转到选择管理处。
  */
  onLoad: function(e) {
    var that = this;
    var office = wx.getStorageSync("officeInfo") || null;
    that.setData({
      currentOffice: office.officeName
    })
    getPatrolType(office.id, that);
  },

  /*
  界面显示时触发
  该方法中，将从缓存中读取从服务器请求来并经过处理的班次和巡更点信息。
  */
  onShow: function(e) {

  },

  reset: function(e) {
    var that = this;
    var frequencyInfo = wx.getStorageSync("frequencyInfo");
    for (var i = 0; i < frequencyInfo.length; i++) {
      if (frequencyInfo[i].isDone == false) {
        wx.showModal({
          title: '提示',
          content: '当前工作日期有未巡更的巡更点，重置将会导致当前工作日期这些巡更点无法巡更，确定要重置巡更信息吗？',
          success: res => {
            if (res.confirm) {
              wx.reLaunch({
                url: '../date/date',
              })
            }
          }
        })
        return;
      }
    }
    wx.showModal({
      title: '提示',
      content: '只有在开始新的一天的巡更时才需要重置巡更信息，确定要重置巡更信息吗？',
      success: function(e) {
        if (e.confirm) {
          wx.reLaunch({
            url: '../date/date',
          })
        }
      }
    })
  },

  /*
  点击“切换管理处？”字样时触发
  该方法用于返回上一界面重新选择管理处。
   */
  textTap: function(e) {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  /*
  点击班次view时触发
  该方法用于确定当前班次和巡更序次，并跳转到地图页面。
   */
  viewTap: function(e) {
    var that = this;
    wx.setStorageSync("currentPatrolType", that.data.patrolTypes[parseInt(e.currentTarget.id)]);
    wx.navigateTo({
      url: '../frequency/frequency',
    })
    // }
    //   }
    // })

  }
})


function getPatrolType(e, that) {
  util.getRequest(config.urls.getPatrolTypeUrl, { officeId: e }, function (data, errCode) {
    if (errCode) {
      var patrolTypes = data;
      // var patrolTypes = ["保安巡更", "工程巡更"];
      wx.setStorageSync("patrolTypes", patrolTypes);
      that.setData({
        patrolTypes: patrolTypes
      })
    }
    console.log(data);
  })


}
// function getWatchInfo(that){
//   var frequencies = that.data.frequencies;
//   for(var i = 0; i < frequencies.length; i++){
//     var start = frequencies[i].startTime.split(":")[0];
//     var end = frequencies[i].endTime.split(":")[0];
//     if (start < end){
//       frequencies[i].workDate = getDate();
//     }
//     if (start > end){
//       frequencies[i].workDate = getEarlyDate(1);
//     }
//   }

// }

function getDate() {
  var date = new Date;
  var year = (Number(date.getFullYear()));
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var dateString = year + "-" + appendZero(month) + "-" + appendZero(day);
  return dateString;
}

function getDateTime() {
  var date = new Date;
  var year = (Number(date.getFullYear()));
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var dateString = year + "-" + appendZero(month) + "-" + appendZero(day) + " " + appendZero(hour) + ":" + appendZero(minute) + ":" + appendZero(second);
  return dateString;
}


function getEarlyDate(d) {
  var date = new Date;
  var year = (Number(date.getFullYear()));
  var month = date.getMonth() + 1;
  var day = date.getDate() - d;
  var dateString = year + "-" + appendZero(month) + "-" + appendZero(day);
  return dateString;
}

function getMinute() {
  var date = new Date;
  var minute = date.getMinutes();
  return minute;
}

function getHour() {
  var date = new Date;
  var hour = date.getHours();
  return hour;
}

function appendZero(value) {
  if (Number(value) < 10) {
    return "0" + value;
  } else {
    return value;
  }
}