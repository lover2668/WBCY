//index.js

// 简单数据浏览，沟通，信息采集 实时化，移动化， 沟通化，现场化


const config = require("../../../utils/config.js");
const util = require("../../../utils/util.js");
const serverData = require("../../../utils/serverData.js");
Page({
  data: {
    office: [],
  },


  onLoad: function (e) {
  var that = this;
  var office = wx.getStorageSync("office") || [];
  // if(office.length == 0) {
  //   console.log("office info 不存在");
    wx.showLoading({
      title: '正在获取管理处信息...',
    })


    util.getRequest(config.urls.getOfficeInfoUrl, {}, function (data, errCode) {
      if (errCode) {
        that.setData({
          office: data
        })
        wx.setStorageSync("office", data);
      }
      console.log(data);
    })
  },

  onShow: function(e){
    

  },

  viewTap: function (e) {
    console.log(e);
    //选择管理处后，将其存入缓存
    wx.removeStorageSync("frequencyInfo");
    var choosedOffice = { id: e.currentTarget.id, officeName: e.currentTarget.dataset.officeName };
    wx.setStorageSync("officeInfo", choosedOffice);
    wx.reLaunch({
      url: '../date/date',
    })
  }
})


function getDate() {
  var date = new Date;
  var year = (Number(date.getFullYear()));
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var dateString = year + "-" + appendZero(month) + "-" + appendZero(day);
  return dateString;
}

function appendZero(value) {
  if (Number(value) < 10) {
    return "0" + value;
  }
  else {
    return value;
  }
}