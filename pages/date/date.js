
var util = require("../../utils/util.js")
var serverData = require("../../utils/serverData.js")


const date = new Date()
const years = []
const months = []
const days = []

for (let i = date.getFullYear() - 10; i <= date.getFullYear() + 50; i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}


Page({
  data: {
    currentOffice: "",
    frequencies: [],
    dateViewHidden: true,
    years: years,
    year: date.getFullYear(),
    months: months,
    month: date.getMonth() + 1,
    days: days,
    day: date.getDate(),
    value: [parseInt(date.getFullYear()) - 2008, parseInt(date.getMonth()), parseInt(date.getDate()) - 1],
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
        url: '../index/index',
      })
      return;
    }
  },

  /*
  界面显示时触发
  该方法中，将从缓存中读取从服务器请求来并经过处理的班次和巡更点信息。
  */
  onShow: function (e) {
  },

  bindChange: function (e) {
    var that = this;
    console.log(e);
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]]
    })
    console.log(that.data.year);
    console.log(that.data.month);
    console.log(that.data.day);
  },
  
  confirmReset: function (e) {
    var that = this;
    var workDate = "" + that.data.year + "-" + appendZero(that.data.month) + "-" + appendZero(that.data.day);
      wx.setStorageSync("workDate", "" + that.data.year + "-" + appendZero(that.data.month) + "-" + appendZero(that.data.day));
      console.log("workData:   " + workDate);
      console.log("date:   " + getDate());
      // if (workDate < getDate()){
      //   wx.showModal({
      //     title: '提示',
      //     content: '工作日期不能早于当前日期',
      //     showCancel: false
      //   })
      //   return;
      // }
      wx.reLaunch({
        url: '../frequency/frequency',
      })
  },


 

})

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