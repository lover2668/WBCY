const config = require("../../../utils/config.js");
const util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    repairList: [],
    workers: [],
  },

  /**
   * 跳转到已完成工单列表界面
   */
  toDoneWorkOrder: function () {
    wx.navigateTo({
      url: '../doneWorkOrder/doneWorkOrder',
    })
    
  },

  /**
   * 筛选工单状态 
   * filtrateList:    ["全部", "已派单", "已现场确认", "维修中", "维修延期"], 
   * filtrateIndex:   0
   */
  // filtrateStatus: function (e) {
  //   var that = this;
  //   var repairList = that.data.repairList;
  //   console.log(e);
  //   var index = parseInt(e.detail.value);
  //   that.setData({
  //     filtrateIndex: index
  //   })
  //   filtrateRepairOrder(repairList, that.data.filtrateList[index], that);
  // },

  /**
   * 生命周期函数--监听页面显示
   * 界面显示时，向服务器请求最近的工单列表
   */
  onShow: function () {
    var that = this;
    getRepairList(that);//根据排序类型获取工单列表
  },

  /**
   * 更改工单列表排序方式
   * sortTypeList:        ["报修时间", "预约服务时间", "派工时间"]
   * sortTypeListIndex:   0
   */
  sortTextTaped: function (e) {
    var that = this;
    console.log(e);
    var index = parseInt(e.target.id);
    that.setData({ sortTypeListIndex: index });
    getRepairList(that);
  },

  /**
   * 点击列表中的某一项，跳转到详情页
   */
  viewTaped: function (e) {
    var that = this;
    console.log(e);
    var repairOrder = that.data.repairList[e.currentTarget.id] || {};
    var workers = that.data.workers || [];
    var workOrderInfo = wx.getStorageSync("workOrderInfo");
    console.log("repairOrder");
    console.log(repairOrder);
    if (repairOrder) {
      // console.log('../workDetail/workDetail?status=undone&repairOrder=' + JSON.stringify(repairOrder) + (workOrderInfo.roleId == 24 ? '&workers=' + JSON.stringify(workers) : '' + '&type=undone'))
      wx.navigateTo({
        url: '../workDetail/workDetail?repairOrder=' + JSON.stringify(repairOrder) + '&type=undone' + (workOrderInfo.roleId == 24 ? '&workers=' + JSON.stringify(workers) : ''),
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '获取工单详情失败,请稍后重试',
        showCancel: false
      })
    }
  },

  /**
   * scroll-view滑动到顶时，刷新工单列表
   */
  scrolltoupper: function () {
    var that = this;
    getRepairList(that);//根据排序类型获取工单列表
  },
})



/**
 * 自定义函数,获取工单列表
 */
function getRepairList(that) {
  // var ztInfo = wx.getStorageSync("currentZT") || {};
  var workOrderInfo = wx.getStorageSync("workOrderInfo");
  var data = {
    userId: workOrderInfo.userId,
    structureId: workOrderInfo.structureId,
    roleId: workOrderInfo.roleId,
  }
  util.getRequest(config.urls.getWorkOrderUrl, data, function (data,errCode) {
    // var repairList = data;
    if (errCode){
      if (workOrderInfo.roleId == 24){
        var repairList = data.orders;
        var workers = data.workers;
        that.setData({
          repairList,
          workers
        })
      }
      else {
        var repairList = data.orders;
        that.setData({
          repairList,
        })
      }
     
    }
    else {
      that.setData({
        repairList: null,
        workers: null
      })
    }
    console.log(data);
    // filtrateRepairOrder(repairList, that.data.filtrateList[that.data.filtrateIndex], that);
    // that.setData({
    //   repairList: repairList
    // })
  })
}

/**
 * 自定义函数，筛选小程序本地获取到的符合条件的工单
 */
// function filtrateRepairOrder(repairList, status, that) {
//   console.log(repairList);
//   var filtrateRepairOrder = [];
//   if (status == "全部") {
//     filtrateRepairOrder = repairList;
//   }
//   else {
//     for (var i = 0; i < repairList.length; i++) {
//       if (repairList[i].status == status) {
//         filtrateRepairOrder.push(repairList[i]);
//       }
//     }
//   }
//   that.setData({
//     filtrateRepairOrder: filtrateRepairOrder
//   })
// }