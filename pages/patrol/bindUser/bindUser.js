// const config = require("../../utils/config.js");
// const sha1 = require('../../utils/sha1.js');
Page({
  data: {
    submitData: {}
  },
  //页面加载
  onLoad: function (e) {
    var that = this;
  },

  //点击提交按钮
  submit: function (e) {
    var that = this;
    console.log(e);
    var value = e.detail.value;
    var sData = that.data.submitData;
    if (!value.userName) {
      wx.showModal({
        title: '提示',
        content: '姓名不能为空',
        showCancel: false
      })
      return;
    }
    wx.setStorageSync("userName", value.userName);
    wx.showModal({
      title: '提示',
      content: '添加成功，点击确定返回巡更首页',
      showCancel: false,
      success: res => {
        wx.reLaunch({
          url: '../frequency/frequency',
        })
      }
    })
    // sData.userName = value.userName;
    // sData.password = value.password;
    // sData.sessionId = wx.getStorageSync("sessionId");
    // sData.serverUrl = config.urls.bindUserUrl;
    // that.setData({
    //   submitData: sData
    // })
    // console.log(e.detail.value);
    // return;
    //   wx.request({
    //     url: config.urls.bindUserUrl,
    //     method: 'POST',
    //     header: {
    //       'content-type': 'application/x-www-form-urlencoded;charset=uft-8'
    //     },
    //     data: sData,
    //     success: res => {
    //       console.log(res);
    //       if (res.data.status == "Success") {
    //         wx.showModal({
    //           title: '提示',
    //           content: '绑定成功，点击完成返回主页',
    //           showCancel: false,
    //           success: res => {
    //             wx.reLaunch({
    //               url: '../welcome/welcome',
    //             })
    //           }
    //         })
    //       }
    //       if (res.data.status == "Fail") {
    //         if (res.data.result == "数据已存在") {
    //           wx.showModal({
    //             title: '提示',
    //             content: '该物业通账号已被绑定，请勿重复绑定。如有疑问，请联系系统管理员。',
    //             showCancel: false,
    //           })
    //           return;
    //         }
    //         else {
    //           wx.showModal({
    //             title: '提示',
    //             content: res.data.result,
    //             showCancel: false,
    //           })
    //           return;
    //         }
    //       }
    //     }
    //   })
  }
})


function changeFormat(date) {
  var d = date.substr(0, date.length - 8);
  var arr = d.split("/");
  var result = "" + arr[0] + "-" + appendZero(arr[1]) + "-" + appendZero(arr[2]);
  return result;
}

function appendZero(value) {
  if (Number(value) < 10) {
    return "0" + value;
  }
  else {
    return value;
  }
}