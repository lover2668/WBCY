// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    freqId:0,
    watchTime:0,
    frequencies:[],
    pageData:{
      frequencyName:"",
      startTime:"",
      endTime:"",
      times:0,
      currentTime:0,
      currentPoint:0,
      time:0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // console.log("markerArray");
    // console.log(that.data.markerArr);
    console.log("options is:   ")
    console.log(options);
    var watchTime = options.time;
    var frequencies = wx.getStorageSync("frequencyInfo") || [];
    that.setData({
      frequencies: frequencies,
      freqId: options.freqId,
      watchTime: watchTime
    })
    var freqId = parseInt(that.data.freqId);//选择的班次
    var cFreq = that.data.frequencies[freqId].cFreq;//选择班次的所有子班次
    var cfDone = that.data.frequencies[freqId].isDone;//选择的班次是否完成
    var freq = frequencies[options.freqId];
    // var time = cFreq.length;
    // var point = {};
    // for (var i = 0; i < cFreq.length; i++) {
    //   if (!cFreq[i].isDone) {
    //     console.log(cFreq[i]);
    //     time = cFreq[i].time;
    //     break;
    //   }
    // }
    // for (var i = 0; i < cFreq[watchTime].route.length; i++){
    //   if (!cFreq[watchTime].route[i].isScan){
    //     console.log("point is:")
    //     console.log(cFreq[watchTime].route[i]);
    //     point = cFreq[watchTime].route[i];
    //     break;
    //   }
    // }
    that.setData({
      "pageData.frequencyName": freq.frequencyName,
      "pageData.startTime": freq.startTime,
      "pageData.endTime":freq.endTime,
      "pageData.times":freq.times,
      "pageData.currentTime": parseInt(watchTime) + 1,
      "pageData.time":freq.minutes,
      // "pageData.point":point
    })
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  navBack: function () {
    wx.showModal({
      title: '提示',
      content: '返回首页会导致巡更已用时长重置，确定返回？',
      success: res => {
        if (res.confirm){
          wx.reLaunch({
            url: '../frequency/frequency',
          })
        }
        else {
          return;
        }
      }
    })
  },

  submit: function () {
    var that = this;
    var date = new Date();
    var minute = date.getMinutes();
    var hour = date.getHours();
    var freqId = parseInt(that.data.freqId);//选择的班次
    var cFreq = that.data.frequencies[freqId].cFreq;//选择班次的所有子班次
    var cfDone = that.data.frequencies[freqId].isDone;//选择的班次是否完成
    var startTime = that.data.frequencies[freqId].startTime;
    var endTime = that.data.frequencies[freqId].endTime;
    console.log(startTime + "==============" + endTime);
    console.log(hour + "----------------" + minute);
    
    // if (getHour(startTime) > hour){
    //   wx.showModal({
    //     title: '提示',
    //     content: '巡视时间未到，不能开始巡视',
    //     showCancel: false
    //   })
    //   return;
    // }
    // else if (getHour(startTime) == hour && getMinute(startTime) > minute){
    //   wx.showModal({
    //     title: '提示',
    //     content: '巡视时间未到，不能开始巡视',
    //     showCancel: false
    //   })
    //   return;
    // }
    // if (getHour(endTime) < hour){
    //   wx.showModal({
    //     title: '提示',
    //     content: '该班次巡更已超时',
    //     showCancel: false
    //   })
    //   var frequencies = that.data.frequencies;
    //   frequencies[freqId].isDone = true;
    //   that.setData({
    //     frequencies: frequencies
    //   })
    //   wx.setStorageSync("frequencyInfo", that.data.frequencies);
    //   return;
    // }
    // else if (getHour(endTime) == hour && getMinute(endTime) < minute){
    //   wx.showModal({
    //     title: '提示',
    //     content: '该班次巡更已超时',
    //     showCancel: false
    //   })
    //   var frequencies = that.data.frequencies;
    //   frequencies[freqId].isDone = true;
    //   that.setData({
    //     frequencies: frequencies
    //   })
    //   wx.setStorageSync("frequencyInfo", that.data.frequencies);
    //   return;
    // }
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
        showCancel: false
      })
      return;
    }
    if (cfDone) {
      wx.showModal({
        title: '提示',
        content: '该班次的巡更任务已完成',
        showCancel: false
      })
      return;
    }
    console.log(cFreq);
    var time = 1;
    for (var i = 0; i < cFreq.length; i++) {
      if (!cFreq[i].isDone) {
        console.log(cFreq[i]);
        time = cFreq[i].time;
        break;
      }
    }
    wx.showModal({
      title: '提示',
      content: '确定开始第' + time + '次巡更，点击确定将开始计时',
      success: function (e) {
        if (e.confirm) {
          var date = new Date();
          var frequencies = wx.getStorageSync("frequencyInfo") || [];
          var startTime = frequencies[freqId].cFreq[time - 1].startTime;
          wx.setStorageSync("startTime", startTime ? startTime : getDateTime());
          // frequencies[freqId].cFreq[time - 1].startTime = date.getTime();
          wx.setStorageSync("frequencyInfo", frequencies)
          wx.navigateTo({
            // url: '../map/map?freqId='+ freqId + "&time=" + (time -1),
            url: "../map/map?freqId=" + freqId + "&time=" + (time - 1),
            // url: "../mapDetail/mapDetail?freqId=" + freqId + "&time=" + (time - 1)
          })
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },


})


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


/**
 * 当前经度
 * 当前纬度
 * 二维码经度
 * 二维码纬度
 * 班次
 * 路线
 * 工作日期
 * 当前序次
 * 当前已用时长
 * 图片1
 * 图片2
 */