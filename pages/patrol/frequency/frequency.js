
const config = require("../../../utils/config.js");
const util = require("../../../utils/util.js");
const serverData = require("../../../utils/serverData.js");

Page({
  data: {
    currentOffice: "",
    currentUser: "",
    frequencies: [],
  },

  /*
  界面初始化时触发
  该方法中，将判断管理处信息是否存在，若不存在，则跳转到选择管理处。
  */
  onLoad: function (e) {
    var that = this;
    var office = wx.getStorageSync("officeInfo") || null;
    if (!office) {
      wx.reLaunch({
        url: '../patrolIndex/patrolIndex',
      })
      return;
    }

    var user = wx.getStorageSync("userName");
    if (!user) {
      wx.reLaunch({
        url: '../bindUser/bindUser',
      })
      return;
    }
    // if (!)
    that.setData({
      currentOffice: office.officeName,
      currentUser: user
    })
    getFrequencyInfo(office.id, that);
  },

  /*
  界面显示时触发
  该方法中，将从缓存中读取从服务器请求来并经过处理的班次和巡更点信息。
  */
  onShow: function (e) {

  },

  reset: function (e) {
    var that = this;
    var frequencyInfo = wx.getStorageSync("frequencyInfo");
    console.log(frequencyInfo);
    // return;
    for (var i = 0; i < frequencyInfo.length; i++) {
      if (frequencyInfo[i].isDone == false) {
        wx.showModal({
          title: '提示',
          content: '当前工作日期有未巡更的巡更点，重置将会导致当前工作日期这些巡更点无法巡更，确定要重置巡更信息吗？',
          success: res => {
            if (res.confirm) {
              wx.removeStorageSync("frequencyInfo");
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
      success: function (e) {
        if (e.confirm) {
          wx.removeStorageSync("frequencyInfo");
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
  changeObject: function (e) {
    wx.reLaunch({
      url: '../patrolIndex/patrolIndex',
    })
  },

  /*
   点击“切换巡更人？”字样时触发
   该方法用于返回选人界面重新选择巡更人。
    */
  changeUser: function (e) {
    wx.reLaunch({
      url: '../bindUser/bindUser',
    })
  },
  /*
  点击班次view时触发
  该方法用于确定当前班次和巡更序次，并跳转到地图页面。
   */
  viewTap: function (e) {
    var that = this;
    var user = wx.getStorageSync("userName");
    if (!user) {
      wx.showModal({
        title: '提示',
        content: '尚未绑定巡更人，无法开始巡更，点击确定进行绑定',
        success: res => {
          if (res.confirm) {
            wx.reLaunch({
              url: '../bindUser/bindUser',
            })
          }
        }
      })
      return;
    }
    var freqId = e.currentTarget.id;//选择的班次
    var cFreq = that.data.frequencies[freqId].cFreq;//选择班次的所有子班次
    var cfDone = that.data.frequencies[freqId].isDone;//选择的班次是否完成
    var lastCfDone = false;
    if (freqId == 0) {
      lastCfDone = true;
    }
    else {
      lastCfDone = that.data.frequencies[freqId - 1].isDone;//选择的班次的上一班次是否完成
    }
    if (!lastCfDone) {
      wx.showModal({
        title: '提示',
        content: '上一班次的巡更任务还未完成，请完成上一班次的巡更任务后再试',
      })
      return;
    }

    if (cfDone) {
      wx.showModal({
        title: '提示',
        content: '该班次的巡更任务已完成',
      })
      return;
    }
    // console.log(cFreq);
    var time = 1;
    for (var i = 0; i < cFreq.length; i++) {
      if (!cFreq[i].isDone) {
        console.log(cFreq[i]);
        time = cFreq[i].time;
        break;
      }
    }
    console.log("time: " + time);
    // wx.showModal({
    //   title: '提示',
    //   content: '确定开始第' + time + '次巡更，点击确定将开始计时',
    //   success: function (e) {
    // if (e.confirm) {
    // var date = new Date();
    // var frequencies = wx.getStorageSync("frequencyInfo") || [];
    // var startTime = frequencies[freqId].cFreq[time - 1].startTime;
    // wx.setStorageSync("startTime", startTime ? startTime : getDateTime());
    // frequencies[freqId].cFreq[time - 1].startTime = date.getTime();
    // wx.setStorageSync("frequencyInfo", frequencies)
    wx.navigateTo({
      url: '../detail/detail?freqId=' + freqId + "&time=" + (time - 1),
      // url: "../detail/detail?freqId=" + freqId,
    })
    // }
    //   }
    // })

  }
})


function getFrequencyInfo(e, that) {
  var workDate = wx.getStorageSync("workDate");
  util.getRequest(config.urls.getWatchInfoUrl, { officeId: e, workDate: workDate, patrolType: wx.getStorageSync("currentPatrolType") }, function (data, errCode) {
    if (errCode) {
      var frequencies = data.frequencies;
      wx.setStorageSync("frequencyInfo", frequencies);
      that.setData({
        frequencies: frequencies
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
  }
  else {
    return value;
  }
}