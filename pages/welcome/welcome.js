const config = require("../../utils/config.js");
const util = require("../../utils/util.js");

//待处理问题：短信，密码
Page({
  data: {
    pageHidden: false,
    coverViewShow: true,
    password: "",
    icons: [
      {
        imgSrc: "../../images/gongdan.png",
        bindtap: "imageTouched",
        showValue: "任务单处理"
      },
      {
        imgSrc: "../../images/xunjian.png",
        bindtap: "imageTouched",
        showValue: "巡更管理"
      },
      {
        imgSrc: "../../images/xunchang.png",
        bindtap: "imageTouched",
        showValue: "报事管理"
      },
      {
        imgSrc: "../../images/weixiu.png",
        bindtap: "imageTouched",
        showValue: "有偿维修管理"
      },
      {
        imgSrc: "../../images/tousu.png",
        bindtap: "imageTouched",
        showValue: "投诉表扬建议管理"
      },
      {
        imgSrc: "../../images/shoufei.png",
        bindtap: "imageTouched",
        showValue: "客户信息查询"
      },
      // {
      //   imgSrc: "../../images/jiaofei.png",
      //   bindtap: "imageTouched",
      //   showValue: "客户信息查询"
      // },
      // {
      //   imgSrc: "../../images/xunchang.png",
      //   bindtap: "imageTouched",
      //   showValue: "有偿维修管理"
      // },
    ],
    navPages: [
      "../work/workOrder/workOrder",
      "../patrol/frequency/frequency",
      "../report/report/report",
      "../repair/repairOrder/repairOrder",
      "../complain/complainOrder/complainOrder",
      "../appropriator/search/search"
    ],
    userInfo: {},
    currentZT: {
      "ZTCode": "100000",
      "ZTName": "北京燕侨"
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.checkSession({
      success: res => {
        console.log(res);
        var sessionId = wx.getStorageSync("sessionId");
        if (sessionId) {
          getUserInfo(that);
        } else {
          login(that);
        }
      },
      fail: res => {
        console.log(res);
        login(that);
      }
    })
  },


  /**
   * 点击界面中间图标，进入相应功能界面
   */
  imageTouched: function (e) {
    var that = this;
    console.log(e);
    var func = e.currentTarget.dataset.func;
    if (func === "任务单处理") {
      var userInfo = wx.getStorageSync("userInfo");
      for (var i = 0; i < userInfo.roles.length; i++) {
        if (userInfo.roles[i].roleId == 24 || userInfo.roles[i].roleId == 25) {
          that.setData({
            workOrderInfo: userInfo.roles[i]
          })
          wx.setStorageSync('workOrderInfo', userInfo.roles[i]);
          break;
        }
      }
    }
    wx.navigateTo({
      url: that.data.navPages[e.currentTarget.id - 1],
    })
    return;
    // }
    // }
    wx.showModal({
      title: '提示',
      content: '没有此权限',
      showCancel: false,
    })
    return;
  }
})

/**
 * 自定义函数，跳转到登陆界面
 */
function toLogin() {
  wx.showModal({
    title: '提示',
    content: '您尚未绑定F2系统账号，如仅需要使用“巡更管理”功能，可点击取消，立即绑定？',
    confirmText: '是',
    cancelText: '否',
    success: res => {
      if (res.confirm) {
        wx.navigateTo({
          url: '../login/login',
        })
      }
      else {
        return;
      }
    }
  })

}

/**
 * 自定义函数，获取用户信息
 */
function getUserInfo(that) {
  wx.showLoading({ title: '正在加载...', })
  wx.request({
    url: config.urls.getUserInfoUrl,
    method: "POST",
    header: { 'content-type': 'application/x-www-form-urlencoded;charset=uft-8' },
    data: {
      sessionId: wx.getStorageSync("sessionId")
    },
    success: function (res) {
      wx.hideLoading();
      checkAndSaveUser(that, res.data);
    },
    fail: res => {
      wx.hideLoading();
      console.log("网络错误");
    }
  })
}

function login(that) {
  wx.showLoading({
    title: '正在加载...',
  })
  wx.login({
    success: res => {
      // wx.hideLoading();
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      console.log(res);
      wx.request({
        url: config.urls.loginUrl,
        method: "POST",
        header: { 'content-type': 'application/x-www-form-urlencoded;charset=uft-8' },
        data: { code: res.code },
        success: function (res) {
          wx.hideLoading();
          console.log(res);
          var result = res.data;
          if (result.success) {
            wx.setStorageSync("sessionId", result.sessionId);
            checkAndSaveUser(that, result.userInfo);
          }
        },
        fail: function (res) {
          wx.hideLoading();
          console.log("wx.login发生错误");
          console.log(res);
        }
      })
    }
  })
}


function checkAndSaveUser(that, data) {
  if (data.status == "Fail") {
    if (data.result == "无此用户") {
      toLogin();
      return;
    } else {
      login(that);
      return;
    }
  }
  var userInfo = data.data || [];
  that.setData({
    userInfo: userInfo
  })
  wx.setStorageSync("userInfo", userInfo);
  // for (var i = 0; i < userInfo.roles.length; i++) {
  //   if (userInfo.roles[i].roleId == 24 || userInfo.roles[i].roleId == 25 ) {
  //     that.setData({
  //       workOrderInfo: userInfo.roles[i]
  //     })
  //     wx.setStorageSync('workOrderInfo', userInfo.roles[i]);
  //     break;
  //   }
  // }
  // wx.navigateTo({
  //   url: that.data.navPages[0],
  // })
  that.setData({
    pageHidden: false
  })
  console.log("user is:");
  console.log(userInfo);
  // if (!wx.getStorageSync("currentZT")) {
  //   wx.setStorageSync("currentZT", userInfo.ZTInfo[0]);
  //   that.setData({
  //     currentZT: userInfo.ZTInfo[0]
  //   })
  // }
}