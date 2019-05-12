// pages/map/map.js
const config = require("../../../utils/config.js");
const util = require("../../../utils/util.js");
const serverData = require("../../../utils/serverData.js");
var time;
Page({

  /**
   * 页面的初始数据6
   */
  data: {
    freqId: 0,//当前班次的Id
    watchTime: 0,//当前序次
    second: 10,//规定时长
    frequencies: [],//班次信息
    timeShow: "00:00:00",//剩余时长
    nowTimeShow: "00:00:00",//当前时间
    la: 40.069090,//地图中点经度
    lo: 116.321611,//地图中点纬度
    markerArr: [],//地图上的标记点
    polylineArr: [],//地图上标记点之间的连线
    route: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("markArr:");
    console.log(that.data.markerArr);
    console.log("options:");
    console.log(options);
    // return;
    that.setData({
      freqId: options.freqId,
      watchTime: options.time
    })
    // var app = getApp();
    // app.countdown(this);
    // var exitTime = wx.getStorageSync("exitTime");

    // if (exitTime){
    //   resetSecond(this);
    // }
    // countdown(this);
    var officeInfo = wx.getStorageSync("officeInfo");
    // util.handle.getRequest("getWatchInfo",{officeId:officeInfo.id},function (e){

    // })
    // wx.getLocation({
    //   type: "wgs84",
    //   success: function (res) {
    //     console.log(res);
    //   },
    // })
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    setMap(that);//初始化地图
    // var exitSecond = wx.getStorageSync("exitSecond") || 0;
    // console.log(exitSecond);
    // var mapExit = wx.getStorageSync("mapExit");
    // if (exitSecond == 0 && mapExit) {
    //   that.setData({
    //     second : 0
    //   })
    // }
    // else {
    //   var exitTime = wx.getStorageSync("exitTime");
    //   if (exitTime) {
    //     resetSecond(this);
    //   }
    // }
    // countdown(this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // clearTimeout(time);
    // var that = this;
    // if (!(that.data.second == 0)) {
    //   stopTimer(this);
    // }
    // wx.setStorageSync("mapExit", true);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // clearTimeout(time);
    // var that = this;
    // if (!(that.data.second == 0)) {
    //   stopTimer(this);
    // }
    // wx.setStorageSync("mapExit", true);
  },
  // buttonTouch: function (e) {
  //   var that = this;
  //   wx.scanCode({
  //     success: function (res) {
  //       console.log(res)
  //       var r = res.result;
  //       var result = JSON.parse(r);
  //       console.log(result);
  //       if (result.name == "巡更点1") {
  //         var markerArr = that.data.markerArr;
  //         markerArr[0].iconPath = "../../images/zuobiaogreen.png";
  //         that.setData({
  //           "markerArr": markerArr
  //         })
  //         console.log(that.data.markerArr[0]);
  //       }
  //     }
  //   })

  // },

  viewTaped: function (e) {
    console.log(e);
    var id = parseInt(e.currentTarget.id);
    var that = this;
    var route = that.data.route;
    var point = route[id];
    console.log(point);
    if (point.isScan) {
     wx.showToast({
       title: '该点已完成巡更',
       icon: "none",
       duration:3000
     })
      return; 
    }
    if ((id - 1 >= 0) && (!route[id - 1].isScan)) {
      wx.showToast({
        title: '上一个巡更点还没有进行巡更，请巡更后再试',
        icon: "none",
        duration: 3000
      })
      // wx.showModal({
      //   title: '提示',
      //   content: '上一个巡更点还没有进行巡更，请巡更后再试',
      //   showCancel: false,
      // })
      return;
    }
    var time = that.data.frequencies[that.data.freqId].minutes;
    var usedTime = parseInt(that.data.second / 60);
    usedTime = usedTime > time ? "已超时" : "" + usedTime + "分钟";
    console.log(time);
    console.log(usedTime);
    // return;
    wx.navigateTo({
      url: '../mapDetail/mapDetail?freqId=' + that.data.freqId + "&time=" + that.data.watchTime + "&markerId=" + id + "&usedTime=" + usedTime,
    })
  },

  markerTap: function (e) {
    var that = this;
    var markerId = parseInt(e.markerId);
    // if (that.data.markerArr[markerId].isScan) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '该巡更点已完成巡更',
    //     showCancel: false
    //   })
    //   return;
    // }
    if (markerId - 1 >= 0) {
      if (!that.data.markerArr[markerId - 1].isScan) {
        wx.showModal({
          title: '提示',
          content: '上一个巡更点还没有进行巡更，请巡更后再试',
          showCancel: false,
        })
        return;
      }
    }
    //url: '../map/map?freqId='+ freqId + "&time=" + (time -1),
    console.log(e);
    var time = that.data.frequencies[that.data.freqId].minutes;
    var usedTime = parseInt(that.data.second / 60);
    usedTime = usedTime > time ? "已超时" : "" + usedTime + "分钟";

    wx.navigateTo({
      url: '../mapDetail/mapDetail?freqId=' + that.data.freqId + "&time=" + that.data.watchTime + "&markerId=" + markerId + "&usedTime=" + usedTime,
    })
    var that = this;
    var markerInfo = that.data.markerArr[e.markerId];
    var realLocation = {};
    wx.getLocation({
      success: function (res) {
        // console.log(res);
        realLocation.latitude = res.latitude;
        realLocation.longitude = res.longitude;
      },
    })
    // markerInfo.scanLatitude = realLocation.latitude || null;
    // markerInfo.scanLongitude = realLocation.longitude || null;
    // console.log(markerInfo);
    // console.log(e.markerId);
    // console.log(that.data.markerArr[e.markerId]);
  },
})

function getTime(that) {
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
}


// function countdown(that) {
//   var second = that.data.second
//   if (second <= 0) {
//     that.setData({
//       second: 0
//     });
//     wx.removeStorageSync("exitTime");
//     wx.removeStorageSync("exitSecond");
//     clearTimeout(time);
//     // console.log("Time Out...");

//     return;
//   }
//   time = setTimeout(function () {
//     second = second - 1;
//     var timehour = second / 3600;
//     var timeminute = (second % 3600) / 60;
//     var timesecond = second % 60;
//     var date = new Date();
//     var hour = date.getHours()
//     var minute = date.getMinutes()
//     var tsecond = date.getSeconds()
//     that.setData({
//       second: second,
//       timeShow: "" + formatNumber(parseInt(timehour)) + ":" + formatNumber(parseInt(timeminute)) + ":" + formatNumber(parseInt(timesecond)),
//       nowTimeShow: "" + formatNumber(hour) + ":" + formatNumber(minute) + ":" + formatNumber(tsecond)
//     });
//     console.log(second);
//     countdown(that);
//   }
//     , 1000)
// }

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/*
重设时间
*/
// function resetSecond(that) {
//   var exitTime = wx.getStorageSync("exitTime")
//   var date = new Date();
//   var newTime = date.getTime();
//   var TDOA = parseInt((newTime - exitTime) / 1000)
//   console.log(TDOA);
//   var exitSecond = wx.getStorageSync("exitSecond");
//   that.setData({
//     second: exitSecond - TDOA
//   })
// }

/*
停止计时器
*/
// function stopTimer(that) {
//   // clearTimeout(time);
//   var date = new Date();
//   console.log(date.getTime());
//   wx.setStorageSync("exitTime", date.getTime());
//   wx.setStorageSync("exitSecond", that.data.second);
// }

/*
初始化地图的点线信息
*/
function setMap(that) {
  var date = new Date();
  var frequencies = wx.getStorageSync("frequencyInfo") || []//在缓存中取得班次信息
  var cFreq = frequencies[that.data.freqId].cFreq;
  that.setData({
    frequencies: frequencies
  })
  console.log(frequencies);
  var cf = cFreq[that.data.watchTime];
  console.log("cf:");
  console.log(cf);
  var route = cf.route;//在班次信息中取得上一页中选择的班次及子班次对应的巡更点信息。
  that.setData({
    route: route
  })
  var markerArr = [];
  var polylinePoints = [];
  var lo = route[0].longitude;
  var la = route[0].latitude;
  //该循环用于设置地图上的巡视点信息
  for (var i = 0; i < route.length; i++) {
    var point = route[i];
    var linePoint = {
      latitude: point.latitude,
      longitude: point.longitude
    }
    var point = {
      isScan: point.isScan,
      id: i,
      latitude: point.latitude,
      longitude: point.longitude,
      title: point.locationName,
      iconPath: point.isScan ? "../../../images/zuobiaogreen.png" : "../../../images/zuobiao.png",
      width: 30,
      height: 30,
      callout: {
        content: point.locationName,
        color: "#ffffff",
        bgColor: point.isScan ? "#00ff00" : "#ff0000",
        fontSize: 15,
        borderRadius: 5,
        display: "ALWAYS"
      }
    }
    polylinePoints.push(linePoint);
    markerArr.push(point);
  }
  var polylineArr = [{
    color: "#FF0000DD",
    width: 2,
    dottedLine: true,
    arrowLine: true,
    points: polylinePoints
  }]
  that.setData({
    markerArr: markerArr,
    polylineArr: polylineArr,
    la: la,
    lo, lo
  })
}