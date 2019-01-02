// pages/mapDetail/mapDetail.js
var util = require("../../utils/util.js");
Page({
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

  /**
   * 页面的初始数据
   */
  data: {
    image1: {
      hidden: true,
      src: "",
    },
    image2: {
      hidden: true,
      src: "",
    },
    frequencies: [],
    freqId: 0,
    watchTime: 0,
    markerId: 0,
    pageData: {
      frequency: "",
      date: "",
      time: 0,
      usedTime: 0,
      pointName: "",
      pointLa: 0,
      pointLo: 0,
      scanLa: 0,
      scanLo: 0,
      textInfo: "",
    },
    submitData: {
      officeId: 0,
      workDate: "",
      frequencyId: 0,
      pointId: "",
      arriveLa: 0,
      arriveLo: 0,
      arriveTime: "",
      watchTimes: 0,
      usedTime: 0,
      watchExplain: ""
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //     countdown(this);
    console.log("options:")
    console.log(options);
    var frequencies = wx.getStorageSync("frequencyInfo") || []
    var cFreq = frequencies[options.freqId].cFreq;
    var route = cFreq[options.time].route;
    var point = route[options.markerId];
    var officeInfo = wx.getStorageSync("officeInfo");
    var startTime = wx.getStorageSync("startTime");
    var usedTime = getUsedTime(startTime);
    var date = new Date();
    console.log(date.getTime() - cFreq[options.time].startTime);
    that.setData({
      frequencies: frequencies,
      freqId: options.freqId,
      watchTime: options.time,
      markerId: options.markerId,
      "pageData.frequency": frequencies[options.freqId].frequencyName,
      "pageData.date": wx.getStorageSync("workDate"),
      "pageData.time": "第" + (parseInt(options.time) + 1) + "次",
      "pageData.usedTime": "" + usedTime,
      "pageData.pointName": point.locationName,
      "pageData.pointLa": point.latitude,
      "pageData.pointLo": point.longitude,
      // "pageData.usedTime": parseInt((date.getTime() - cFreq[options.time].startTime) / 60000),
      // "submitData.usedTime": parseInt((date.getTime() - cFreq[options.time].startTime) / 60000),
      "submitData.usedTime": getUsedTime(startTime),
      "submitData.officeId": officeInfo.id,
      "submitData.frequencyId": frequencies[options.freqId].frequencyId,
      "submitData.pointId": point.pointId,
      "submitData.watchTimes": parseInt(options.time) + 1,
      "submitData.arriveTime": formatTime(new Date),
      "submitData.workDate": wx.getStorageSync("workDate")
    })
    console.log(that.data);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  uploadImage: function (e) {
    var that = this;
    var tempFilePaths = "";
    switch (e.currentTarget.id) {
      case "image1":
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            tempFilePaths = res.tempFilePaths
            console.log(res);
            that.setData({
              "image1.hidden": false,
              "image1.src": tempFilePaths[0]
            })
          },
          fail: function (res) {
            console.log(res);
          }
        })
        break;
      case "image2":
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            tempFilePaths = res.tempFilePaths
            console.log(res);
            that.setData({
              "image2.hidden": false,
              "image2.src": tempFilePaths[0]
            })
          },
          fail: function (res) {
            console.log(res);
          }
        })
        break;
    }
  },

  input: function (e) {
    console.log(e);
    var that = this;
    that.setData({
      "submitData.watchExplain": e.detail.value
    })
  },

  /**
   * 点击扫码按钮时触发
   */
  scan: function (e) {
    var that = this;
    var freqId = that.data.freqId;
    var time = that.data.watchTime;
    var markerId = that.data.markerId;
    var frequencies = that.data.frequencies;
    var point = frequencies[freqId].cFreq[time].route[markerId];
    wx.scanCode({
      success: function (e) {
        console.log(e);
        // var scanResult = JSON.parse(e.result);
        var scanResult = e.result;
        if (scanResult != point.locationName) {
          wx.showModal({
            title: '提示',
            content: '所扫二维码与当前巡更点不符，请检查后重试',
            showCancel: false,
          })
          return;
        }
        else {
          wx.showToast({
            title: '扫码成功',
          })
        }
        console.log(scanResult);
        // if (!(point.longitude == scanResult.longitude && point.latitude == scanResult.latitude)){
        //   wx.showModal({
        //     title: '提示',
        //     content: '二维码有误或扫码时所在的巡更点错误',
        //   })
        //   return;
        // }
        wx.getLocation({
          success: function (res) {
            console.log(res);
            that.setData({
              "submitData.arriveLa": res.latitude,
              "submitData.arriveLo": res.longitude,
              "pageData.scanLa": res.latitude,
              "pageData.scanLo": res.longitude,
            })
          },
          fail: function (res) {
            wx.showModal({
              title: '提示',
              content: '获取位置时出错，请检查您的手机定位设置后重试',
              showCancel: false
            })
            return;
          }
        })
        console.log(that.data);
      },
      fail: function (e) {
        console.log("fail");
        console.log(e);
        wx.showModal({
          title: '提示',
          content: '扫码时发生错误，请重试',
          showCancel: false
        })
        return;
      }
    })
  },

  submit: function (e) {
    var that = this;
    if (that.data.submitData.arriveLa == 0 || that.data.submitData.arriveLo == 0) {
      wx.showModal({
        title: '提示',
        content: '二维码尚未扫描，请扫描后再试',
        showCancel: false,
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确认提交？提交后数据将不可修改',
      cancelText: "我再想想",
      confirmText: "确认提交",
      success: function (e) {
        if (e.confirm) {
          var submitData = that.data.submitData;
          submitData.startTime = wx.getStorageSync("startTime") || "";
          util.handle.postRequest("setWatchInfo", submitData, function (data) {
            console.log(data);
            if (data.result == "数据已存在") {
              wx.showModal({
                title: '提示',
                content: '该巡更点巡更数据已存在，提交失败',
                showCancel: false,
                success: res => {
                  if (res.confirm) {
                    var officeInfo = wx.getStorageSync("officeInfo");
                    var officeId = officeInfo.id;
                    var workDate = wx.getStorageSync("workDate");
                    util.handle.postRequest("getWatchInfo", { officeId: officeId, workDate: workDate }, function (data) {
                      console.log(data);
                      wx.hideLoading();
                      if (data.status == "Success") {
                        var frequencies = data.data.frequencies;
                      }
                      wx.setStorageSync("frequencyInfo", frequencies);
                      // that.setData({
                      //   frequencies: frequencies
                      // })
                    });
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                }
              })
              return;
            }
            if (data.status == "Success") {
              var frequencies = data.data.frequencies;
              // wx.setStorageSync("frequencyInfo", frequencies);
              // var id = data.data;
              // var date = new Date();
              // if (that.data.image1.src) {
              //   var extra = that.data.image1.src.split(".");
              //   var imagePath = that.data.image1.src.split("/");
              //   var imageName = imagePath[imagePath.length - 1];
              //   var extraName = extra[extra.length - 1];
              //   wx.uploadFile({
              //     formData: { id: id, func:"1"},
              //     // formData: that.data.submitData,
              //     url: "https://itidcy.cn/WanBoServer/Patrol/SetWatchImages",
              //     // url: "http://k17154485y.imwork.net/wanboapp/action/SetWatchImages.aspx",
              //     filePath: that.data.image1.src,
              //     name: extra[imagePath.length - 2] + getTimeStamp() + "." + extraName,
              //     success: function (e) {
              //       console.log(e);
              //     }
              //   })
              // }
              // if (that.data.image2.src) {
              //   var extra = that.data.image2.src.split(".");
              //   var imagePath = that.data.image2.src.split("/");
              //   var imageName = imagePath[imagePath.length - 1];
              //   var extraName = extra[extra.length - 1];
              //   wx.uploadFile({
              //     formData: { id: id, func:"2"},
              //     url: "https://itidcy.cn/WanBoServer/Patrol/SetWatchImages",
              //     // url: "http://k17154485y.imwork.net/wanboapp/action/SetWatchImages.aspx",
              //     filePath: that.data.image2.src,
              //     name: extra[imagePath.length - 2] + getTimeStamp() + "." + extraName,
              //     success: function (e) {
              //       console.log(e);
              //     }
              //   })
              // }
              var freqId = that.data.freqId;
              var time = that.data.watchTime;
              // var markerId = that.data.markerId;
              // var frequencies = that.data.frequencies;
              // console.log(frequencies[freqId].cFreq[time]);
              // frequencies[freqId].cFreq[time].route[markerId].isScan = true;
              // console.log(frequencies[freqId].cFreq[time].route.length);
              // if ((parseInt(markerId) + 1) == frequencies[freqId].cFreq[time].route.length) {
              //   frequencies[freqId].cFreq[time].isDone = true;
              //   if (parseInt(time) + 1 == frequencies[freqId].times) {
              //     frequencies[freqId].isDone = true;
              //   }
              // }
              that.setData({
                frequencies: frequencies
              })
              wx.setStorageSync("frequencyInfo", frequencies);
              // console.log(that.data.frequencies[freqId].cFreq[time].route[markerId].isScan)
              // var isDone = true;
              // for (var i = 0; i < frequencies.length; i++) {
              //   if (!frequencies[i].isDone) {
              //     isDone = false;
              //     break;
              //   }
              // }
              if (frequencies.isDone) {
                // wx.removeStorageSync("frequencyInfo");
                wx.showModal({
                  title: '提示',
                  content: '提交成功，当日的所有巡更任务已完成，点击确定返回选择工作日期界面',
                  showCancel: false,
                  success: function (e) {
                    if (e.confirm) {
                      wx.reLaunch({
                        url: '../date/date',
                      })
                    }
                  }
                })
                return;
              }
              if (frequencies[freqId].cFreq[time].isDone) {
                wx.showModal({
                  title: '提示',
                  content: '提交成功，本次巡更已完成，点击确定返回首页',
                  showCancel: false,
                  success: function (e) {
                    if (e.confirm) {
                      wx.reLaunch({
                        url: '../frequency/frequency',
                      })
                    }
                  }
                })
                return;
              }
              // if (frequencies[freqId].cFreq[time].route[markerId].isScan) {
              wx.showModal({
                title: '提示',
                content: '提交成功，该巡更点巡更已完成，点击确定返回上一页',
                showCancel: false,
                success: function (e) {
                  if (e.confirm) {
                    wx.navigateBack({
                      delta: 1,
                    })
                  }
                }
              })
              // }
              return;
            }
            else {
              wx.showModal({
                title: '提示',
                content: '发生错误，请稍后重试',
                showCancel: false
              })
            }
          })
        }
      }
    })
    // console.log(that.data.submitData);
    // console.log(that.data.image1);
    // console.log(that.data.image2);
  }
})


function temp(e) {
  var that = this;
  var freqId = that.data.freqId;
  var time = that.data.watchTime;
  var markerId = that.data.markerId;
  var frequencies = that.data.frequencies;
  console.log(frequencies[freqId].cFreq[time]);
  frequencies[freqId].cFreq[time].route[markerId].isScan = true;
  console.log(frequencies[freqId].cFreq[time].route.length);
  if ((parseInt(markerId) + 1) == frequencies[freqId].cFreq[time].route.length) {
    frequencies[freqId].cFreq[time].isDone = true;
    if (parseInt(time) + 1 == frequencies[freqId].times) {
      frequencies[freqId].isDone = true;
    }
  }
  that.setData({
    frequencies: frequencies
  })
  wx.setStorageSync("frequencyInfo", frequencies);
  console.log(that.data.frequencies[freqId].cFreq[time].route[markerId].isScan)
}

function formatDate(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  return [year, month, day].map(formatNumber).join('/');
}

function formatTime(date) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}


/**
 * 生成时间戳
 */
function getTimeStamp() {
  var date = new Date();
  var timestamp = date.getTime();
  // timestamp = parseInt(timestamp / 1000).toString();
  return timestamp;
}

function getUsedTime(startTime){
  console.log(startTime);
  console.log(getDateTime());
  var stArr = startTime.split(" ");
  var ntArr = getDateTime().split(" ");
  // var stdArr = stArr[0].split("-");
  var sttArr = stArr[1].split(":");
  // var ntdArr = ntArr[0].split("-");
  var nttArr = ntArr[1].split(":");
  var usedTime = ((parseInt(nttArr[0]) - parseInt(sttArr[0])) * 3600 + (parseInt(nttArr[1]) - parseInt(sttArr[1])) * 60 + (parseInt(nttArr[2]) - parseInt(sttArr[2]))) / 60;
  console.log(parseInt(usedTime));
  return parseInt(usedTime);
}



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





































































































































































































// function countdown(that) {
//    var second = that.data.second
//    if (second == 0) {
//       // console.log("Time Out...");
//       that.setData({
//          second: "Time Out..."
//       });
//       return;
//    }
//    var time = setTimeout(function () {
//     second = second - 1;
//     var timehour = second / 3600;
//     var timeminute = (second % 3600) / 60;
//     var timesecond = second % 60;
//       that.setData({
//          second: second,
//          timeShow:"剩余时长：" + parseInt(timehour) +":" + parseInt(timeminute) + ":" + parseInt(timesecond)
//       });
//     console.log(second);
//       countdown(that);
//    }
//      , 1000)
// }