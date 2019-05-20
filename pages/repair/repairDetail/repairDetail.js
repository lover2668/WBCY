const config = require("../../../utils/config.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    repairOrder: {},
    workers: [],
    workersIndex: 0,
    date: getDate(),
    time: getTime(),
    today: getDateTime(),
    beforeImage: [],
    afterImage: [],
    status: "",
    roleId: null,
    type: '',
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options);
    var workOrderInfo = wx.getStorageSync("workOrderInfo");
    var repairOrder = JSON.parse(options.repairOrder);
    that.setData({
      // status: options.status,
      repairOrder: repairOrder,
      toDay: util.getDateTime(),
      roleId: workOrderInfo.roleId,
      type: options.type
    })
    if (options.type == "done") {
      wx.setNavigationBarTitle({
        title: '已处理任务单详情',
      })
    }
    else {
      wx.setNavigationBarTitle({
        title: '待处理任务单详情',
      })
    }
    if (workOrderInfo.roleId == 24 && options.type === "undone") {
      var workers = JSON.parse(options.workers);
      that.setData({
        workers: workers,
      })
    }
    var beforeImages = [];
    var afterImages = [];
    // if (repairOrder.reportImages){

    // }
    for (var i = 0; i < 3; i++) {
      beforeImages.push(repairOrder.reportImages[i] ? config.urls.getFileUrl + repairOrder.reportImages[i] : "");
      if (repairOrder.afterImages) {
        afterImages.push(repairOrder.afterImages[i] ? config.urls.getFileUrl + repairOrder.afterImages[i] : (that.data.type == "undone" ? "../../../images/addimage.png" : ""));
      }
      else {
        afterImages.push(that.data.type == "undone" ? "../../../images/addimage.png" : "");
      }

    }
    that.setData({//设置占位图片
      beforeImage: beforeImages,
      afterImage: afterImages
    })
  },


  pickerBindchange: function (e) {
    console.log(e);
    var that = this;
    var index = 0;
    var value = e.detail.value;
    if (value) {
      index = parseInt(e.detail.value);
      that.setData({
        workersIndex: index
      })
    }

  },

  beforeImageTaped: function (e) {
    console.log(e);
    var that = this;
    var index = parseInt(e.target.id);
    console.log("beforeImage");
    console.log(that.data.beforeImage[index]);
    if (!that.data.beforeImage[index]) { return; }
    util.previewImage(that.data.beforeImage[index]);
  },


  afterImageTaped: function (e) {
    var that = this;
    if (that.data.type === 'done') {
      console.log(e);
      var that = this;
      var index = parseInt(e.target.id);
      console.log(that.data.afterImage[index]);
      if (!that.data.afterImage[index]) { return; }
      util.previewImage(that.data.afterImage[index]);
    }
    else {
      var index = parseInt(e.target.id);
      selectAndUploadImage(that, index);
    }
  },

  afterImageLongTaped: function (e) {
    console.log(e);
    var that = this;
    var index = parseInt(e.target.id);
    util.previewImage(that.data.afterImage[index]);
  },



  phoneCall: function (e) {
    console.log(e);
    util.call(e.target.dataset.phoneNumber);
    // wx.makePhoneCall({
    //   phoneNumber: e.target.dataset.phoneNumber,
    //   fail: res => {
    //     wx.showModal({
    //       title: '提示',
    //       content: '拨号功能暂不可用',
    //       showCancel: false
    //     })
    //   }
    // })
  },

  datepickerBindchange: function (e) {
    var that = this;
    console.log(e);
    var date = e.detail.value;
    var time = that.data.time;
    that.setData({
      date: date,
      today: date + " " + time
    })
  },

  timepickerBindchange: function (e) {
    var that = this;
    console.log(e);
    var time = e.detail.value;
    var date = that.data.date;
    that.setData({
      time: time,
      today: date + " " + time + ":00"
    })
  },

  submit: function (e) {
    var that = this;
    var submitData = e.detail.value;
    var repairOrder = that.data.repairOrder;
    var workOrderInfo = wx.getStorageSync("workOrderInfo");
    if (workOrderInfo.roleId == 24) {
      var worker = that.data.workers[that.data.workersIndex];
      // console.log(submitData);
      // return;
      submitData.id = repairOrder.id;
      submitData.roleId = 24;
      submitData.workerName = worker.userName;
      submitData.workerPhone = worker.phone;
      submitData.workerId = worker.userId;
      console.log(submitData);
      // return;
      // if (!checkSubmitData(submitData)){return;}
      util.setRequest(config.urls.setReceiverSubmitUrl, submitData, function (data, errCode) {
        if (errCode) {
          wx.showModal({
            title: '提示',
            content: '提交成功,点击确定返回工单列表',
            success: res => {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      });
    }
    else {
      submitData.id = repairOrder.id;
      submitData.roleId = 25;
      console.log(submitData);
      // return;
      // if (!checkSubmitData(submitData)){return;}
      util.setRequest(config.urls.setWorkerSubmitUrl, submitData, function (data, errCode) {
        if (errCode) {
          wx.showModal({
            title: '提示',
            content: '提交成功,点击确定返回工单列表',
            success: res => {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      });
    }
  }
})

function selectAndUploadImage(that, id) {
  var userInfo = wx.getStorageSync("userInfo");
  wx.chooseImage({
    count: 1, // 默认9
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      console.log(res);
      // return;
      // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
      var tempFilePath = res.tempFilePaths[0];
      var afterImage = that.data.afterImage;
      afterImage[id] = tempFilePath;
      that.setData({
        afterImage: afterImage
      })
      var formData = { index: id + 1, id: that.data.repairOrder.id };
      util.uploadImage(config.urls.setRepairImageUrl, tempFilePath, formData);
    }
  })
}


/**
 * 获取日期
 */
function getDate() {
  var date = new Date;
  var year = (Number(date.getFullYear()));
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var dateString = year + "-" + appendZero(month) + "-" + appendZero(day);
  return dateString;
}

/**
 * 获取时间
 */
function getTime() {
  var date = new Date;
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var timeString = appendZero(hour) + ":" + appendZero(minute) + ":" + appendZero(second)
  return timeString;
}

/**
 * 获取日期时间
 */
function getDateTime() {
  var datetimeString = getDate() + " " + getTime();
  return datetimeString;
}

/**
 * 生成时间戳
 */
function getTimeStamp() {
  var date = new Date();
  var timestamp = date.getTime();
  return timestamp;
}

function appendZero(value) {
  if (Number(value) < 10) {
    return "0" + value;
  }
  else {
    return value;
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}