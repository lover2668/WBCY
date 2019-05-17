
/**
 * 获取设备窗口高度
 */
function getWindowHeight() {
  var systemInfo = getSystemInfo();
  var windowHeight = systemInfo.windowHeight * 2;
  return windowHeight;
}

/**
 * 获取设备窗口高度
 */
function getWindowWidth() {
  var systemInfo = getSystemInfo();
  var windowWidth = systemInfo.windowWidth * 2;
  return windowWidth;
}

/**
 * 获取设备信息
 */
function getSystemInfo() {
  try {
    var systemInfo = wx.getSystemInfoSync();
    return systemInfo;
  }
  catch (e) {
    console.log("获取设备信息失败");
    console.log(e);
  }
}


/**
 * post请求，封装wx.request方法，获取数据
 */
function getRequest(url, postData, doSuccess, doFail = null, doComplete = null) {
  wx.showLoading({ title: '加载中...', });
  console.log(postData);
  wx.request({
    url: url,
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded;charset=uft-8' },
    data: postData,
    success: function (res) {
      wx.hideLoading();
      console.log("request successed!");
      console.log(res);
      var errCode = true;
      if (res.data[0] == "<" && res.statusCode != 500) {
        showSign("网络错误，请稍后重试");
        errCode = false;
      }
      if (res.statusCode == 500) {
        showSign("服务器内部错误，请稍后重试");
        errCode = false;
      }
      if (res.data.status == "Fail") {
        showSign(res.data.result);
        errCode = false;
      }
      if (!res.data) {
        showSign("网络错误，请稍后重试");
        errCode = false;
      }
      if (typeof doSuccess == "function") {
        console.log("response data is:");
        console.log(res.data.data);
        doSuccess(res.data.data, errCode);
      }
    },
    fail: function (res) {
      wx.hideLoading();
      console.log("request failed!");
      console.log(res);
      showSign("网络错误，请稍后重试");
    },
    complete: function () {
      wx.hideLoading();
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  });
}

/**
 * post请求，封装wx.request方法，上传数据
 */
function setRequest(url, postData, doSuccess, doFail = null, doComplete = null) {
  wx.showLoading({ title: '正在提交...', });
  console.log(postData);
  wx.request({
    url: url,
    method: 'POST',
    header: { 'content-type': 'application/x-www-form-urlencoded;charset=uft-8' },
    data: postData,
    success: function (res) {
      var errCode = true;
      wx.hideLoading();
      console.log("request successed!");
      console.log(res);
      if (res.data[0] == "<" && res.statusCode != 500) {
        console.log("res.data[0] ==  < && res.statusCode != 500");
        showSign("网络错误，请稍后重试");
        errCode = false;
      }
      if (res.statusCode == 500) {
        console.log("res.statusCode == 500");
        showSign("服务器内部错误，请稍后重试");
        errCode = false;
      }
      // if (!res.data) {
      //   showSign("网络错误，请稍后重试");
      //   errCode = false;
      // }
      if (res.data.status == "Fail") {
        showSign(res.data.result);
        errCode = false;
      }
      if (typeof doSuccess == "function") {
        console.log("response data is:");
        console.log(res.data.data);
        doSuccess(res.data.data, errCode);
      }
    },
    fail: function (res) {
      wx.hideLoading();
      console.log("request failed!");
      console.log(res);
      showSign("网络错误，请稍后重试");
    },
    complete: function () {
      wx.hideLoading();
      if (typeof doComplete == "function") {
        doComplete();
      }
    }
  });
}

function downloadAndLookFiles(fileUrl, doSuccess = null, doFail = null, doComplete = null) {
  wx.showLoading({
    title: '正在加载...',
  })
  wx.downloadFile({
    url: fileUrl, // 仅为示例，并非真实的资源
    success(res) {
      wx.hideLoading();
      console.log("download file success");
      console.log(res);
      // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
      // if (res.header["Content-Length"] === '0'){
      //   wx.showToast({
      //     title: '文件不存在',
      //     icon: 'none',
      //     duration: 3000
      //   })
      //   return;
      // }
      if (res.statusCode === 200) {
        // if (res["header"]["Content-Type"] == "image/jpeg" || res["header"]["Content-Type"] == "image/png" || res["header"]["Content-Type"] == "image/gif"){
        console.log(res.tempFilePath);
        var fileType = res.tempFilePath.split(".")[res.tempFilePath.split(".").length - 1];
        fileType = fileType.toLowerCase();
        if (fileType == "jpg" || fileType == "jpeg" || fileType == "png" || fileType == "gif") {
          wx.previewImage({
            urls: [res.tempFilePath],
            fail: res => {
              console.log(res);
              wx.showToast({
                title: '文件打开失败',
                icon: 'none',
                duration: 3000
              })
            }
          })
        }
        else {
          const filePath = res.tempFilePath;
          wx.openDocument({
            filePath: filePath,
            // fileType:filePath,
            // filePath: fileUrl,
            fail: res => {
              console.log(res);
              wx.showToast({
                title: '文件打开失败',
                icon: 'none',
                duration: 3000
              })
            }
          })
        }
        // else {
        //   wx.showToast({
        //     title: '不受支持的文件类型',
        //     icon: 'none',
        //     duration: 3000
        //   })
        // }
      }
      else {
        wx.showToast({
          title: '文件下载失败',
          icon: 'none',
          duration: 3000
        })
      }
      // if (typeof doSuccess == "function") {
      // console.log("response data is:");
      // console.log(res.data.data);
      // doSuccess("success", res.data.data);
      // }
    },
    fail: res => {
      wx.hideLoading();
      wx.showToast({
        title: '文件下载失败',
        icon: 'none',
        duration: 3000
      })
      console.log("download file failed");
      console.log(res);
    },
    // complete: res => {
    //   console.log("complete");
    //   console.log(res);
    //   if (res.statusCode === 200) {
    //     // if (res["header"]["Content-Type"] == "image/jpeg" || res["header"]["Content-Type"] == "image/png" || res["header"]["Content-Type"] == "image/gif"){
    //     var fileType = res.tempFilePath.split(".")[res.tempFilePath.split(".").length - 1];
    //     fileType = fileType.toLowerCase();
    //     if (fileType.toLowerCase() == "jpg" || fileType.toLowerCase() == "jpeg" || fileType.toLowerCase() == "png" || fileType.toLowerCase() == "gif") {
    //       wx.previewImage({
    //         urls: [res.tempFilePath],
    //         fail: res => {
    //           console.log(res);
    //           wx.showToast({
    //             title: '文件打开失败',
    //             icon: 'none',
    //             duration: 3000
    //           })
    //         }
    //       })
    //     }
    //     else {
    //       wx.openDocument({
    //         filePath: res.tempFilePath,
    //         // filePath: fileUrl,
    //         fail: res => {
    //           console.log(res);
    //           wx.showToast({
    //             title: '文件打开失败',
    //             icon: 'none',
    //             duration: 3000
    //           })
    //         }
    //       })
    //     }
    //   }
    //   else {
    //     wx.showToast({
    //       title: '文件下载失败',
    //       icon: 'none',
    //       duration: 3000
    //     })
    //   }
    // }
  })
}

function uploadImage(url, filePath, formData) {
  var userInfo = wx.getStorageSync("userInfo");
  var imageName = getTimeStamp() + "." + getImageType(filePath);
  wx.showLoading({
    title: '正在上传...',
  })
  wx.uploadFile({
    url: url,
    filePath: filePath,
    formData: formData,
    name: imageName,
    success: res => {
      wx.hideLoading();
      console.log(res);
    },
    fail: res => {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '上传失败，请稍后重试',
        showCancel: false
      })
      console.log(res);
    }
  })
}

/**
 * 预览照片
 */
function previewImage(imageUrl) {
  console.log(imageUrl);
  wx.previewImage({
    urls: [imageUrl],
    success: res => {
      console.log(res);
    },
    fail: res => {
      console.log(res);
    }
  })
}


function getImageType(filePath) {
  var extra = filePath.split(".");
  var extraName = extra[extra.length - 1];
  return extraName;
}

/**
 * 拨打电话
 */
function call(phoneNumber) {
  wx.makePhoneCall({
    phoneNumber: phoneNumber,
    success: function (res) { },
    fail: function (res) {
      showSign("拨号功能暂不可用，请稍后重试");
    },
    complete: function (res) { },
  })
}

/**
 * 获取缓存数据
 */
function getStorage(key) {
  try {
    wx.getStorageSync(key);
  }
  catch (e) {
    console.log("获取缓存数据出错");
    console.log(e);
  }
}

/**
 * 缓存数据
 */
function setStorage(key, value) {
  try {
    wx.setStorageSync(key, value);
  }
  catch (e) {
    console.log("缓存数据出错");
    console.log(e);
  }
}

/**
 * 获取小程序启动参数
 */
function getLaunchOptions() {
  try {
    var launchOptions = wx.getLaunchOptionsSync();
    return launchOptions;
  }
  catch (e) {
    console.log("获取小程序启动参数出错");
    console.log(e);
  }
}


/**
 * 获取用户微信运动步数
 */
// function getWeRunData () {
//   wx.getWeRunData({
//     success: res => {
//       console.log(res);
//     }
//   })
// }

/**
 * 简单提示
 */
function showSign(content) {
  // wx.showModal({
  //   title: '提示',
  //   content: content,
  //   showCancel: false,
  // })
  wx.showToast({
    title: content,
    icon: "none",
    duration: 3000,
  })
}

function showTip(content) {
  wx.showToast({
    title: '提交成功',
    duration: 3000,
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
  var timeString = appendZero(hour) + ":" + appendZero(minute) + ":" + appendZero(second);
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


module.exports = {
  getDate: getDate,
  getTime: getTime,
  getDateTime: getDateTime,
  getTimeStamp: getTimeStamp,
  call: call,
  getRequest: getRequest,
  setRequest: setRequest,
  showSign: showSign,
  showTip: showTip,
  previewImage: previewImage,
  uploadImage: uploadImage,
  getImageType: getImageType,
  downloadAndLookFiles: downloadAndLookFiles,
  getStorage: getStorage
}


























// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }






































































// var handle,
//   url;

// url = {
//   // getPatrolType: "https://itidcy.cn/WanBoServer/Patrol/OnGetPatrolType",
//   // getOfficeInfo: "https://itidcy.cn/WanBoServer/Patrol/GetOfficeInfo",
//   // getWatchInfo: "https://itidcy.cn/WanBoServer/Patrol/GetWatchInfo",
//   // setWatchInfo: "https://itidcy.cn/WanBoServer/Patrol/SetWatchResult"

// // 13711413439 王工


  
//   getPatrolType: "http://k17154485y.imwork.net:23530/WanBoServer/Patrol/OnGetPatrolType",
//   getOfficeInfo: "http://k17154485y.imwork.net:23530/WanBoServer/Patrol/GetOfficeInfo",
//   getWatchInfo: "http://k17154485y.imwork.net:23530/WanBoServer/Patrol/GetWatchInfo",
//   setWatchInfo: "http://k17154485y.imwork.net:23530/WanBoServer/Patrol/SetWatchResult"
// }

// handle = {
//   getRequest(action,data,callBack){
//     console.log(url[action]);
//     console.log("data is :")
//     console.log(data);
//     wx.request({
//       url: url[action],
//       method: "GET",
//       data: data,
//       success: function (e) {
//         callBack(e.data);
//       },
//       fail: function (e) {
//         console.log(e);
//         callBack(e);

//       }
//     })
//   },
//   postRequest(action, submitData, callBack) {
//     console.log(url[action]);
//     console.log("submitData is :")
//     console.log(submitData);
//     wx.request({
//       url: url[action],
//       method: "POST",
//       data: submitData,
//       header: {
//         "content-type": "application/x-www-form-urlencoded"
//       },
//       success: function (e) {
//         callBack(e.data);
//       },
//       fail: function (e) {
//         console.log(e);
//         // callBack(e);
//         wx.showModal({
//           title: '提示',
//           content: '发生未知错误，请稍后重试',
//           showCancel: false
//         })
//       }
//     })
//   }
// }


// module.exports = {
//   handle: handle
// }





