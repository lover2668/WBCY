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
    ],
    navPages: [
      "../work/workOrder/workOrder",
      "../patrol/frequency/frequency",
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
    // wx.checkSession({
    //   success: res => {
    //     console.log(res);
    //     var sessionId = wx.getStorageSync("sessionId");
    //     if (sessionId) {
    //       getUserInfo(that);
    //     } else {
    //       login(that);
    //     }
    //   },
    //   fail: res => {
    //     console.log(res);
    //     login(that);
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  input: function (e) {
    console.log(e);
    var that = this;
    that.setData({
      password: e.detail.value
    })
  },

  // checkPassword: function (e) {
  //   var that = this;
  //   var userInfo = wx.getStorageSync("userInfo");
  //   var userId = userInfo.Id;
  //   var password = that.data.password;
  //   wx.request({
  //     url: config.urls.checkPasswordUrl,
  //     method: "POST",
  //     header: { 'content-type': 'application/x-www-form-urlencoded;charset=uft-8' },
  //     data: {
  //       userId: '' + userId,
  //       password: password
  //     },
  //     success: function (res) {
  //       console.log(res);
  //       if (res.data.result == "匹配") {
  //         that.setData({
  //           coverViewShow: false
  //         })
  //       } else {
  //         if (res.data.result == "不匹配") {
  //           wx.showModal({
  //             title: '提示',
  //             content: '您输入的密码有误，请重新输入',
  //             showCancel: false,
  //           })
  //           return;
  //         } else {
  //           wx.showModal({
  //             title: '提示',
  //             content: '您提交的信息不完整，请重试',
  //             showCancel: false,
  //             success: res => {
  //               wx.checkSession({
  //                 success: res => {
  //                   console.log(res);
  //                   var sessionId = wx.getStorageSync("sessionId");
  //                   if (sessionId) {
  //                     getUserInfo(that);
  //                   } else {
  //                     login(that);
  //                   }
  //                 },
  //                 fail: res => {
  //                   console.log(res);
  //                   login(that);
  //                 }
  //               })
  //             }
  //           })
  //           return;
  //         }
  //       }
  //     },
  //     fail: function (res) {
  //       wx.showModal({
  //         title: '提示',
  //         content: '网络错误，请稍后重试',
  //         showCancel: false,
  //       })
  //       return;
  //     }
  //   })
  // },

  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function () {
  //   var that = this;
  //   var zt = wx.getStorageSync("currentZT");
  //   if (zt) {
  //     that.setData({
  //       currentZT: zt
  //     })
  //   }

  // },
  /**
   * 点击界面上方燕侨图标，修改当前帐套
   */
  // changeManagement: function (e) {
  //   wx.navigateTo({
  //     url: '../changeManagement/changeManagement',
  //   })
  // },

  /**
   * 点击界面中间图标，进入相应功能界面
   */
  imageTouched: function (e) {
    var that = this;
    console.log(e);
    var func = e.currentTarget.dataset.func;
    if (func === "任务单处理"){
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
      return;
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
    content: '您尚未绑定物业通账号，立即绑定？',
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
  for (var i = 0; i < userInfo.length; i++) {
    if (userInfo[i].roleId == 24 || userInfo[i].roleId == 25 ) {
      that.setData({
        workOrderInfo: userInfo[i]
      })
      wx.setStorageSync('workOrderInfo', userInfo[i]);
      break;
    }
  }
  wx.navigateTo({
    url: that.data.navPages[0],
  })
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