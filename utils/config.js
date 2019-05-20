

const baseUrl = "http://localhost:11780";//云服务器Url
// const baseUrl = "http://k17154485y.imwork.net:23530/WanBoServer";
// const baseUrl = "https://itidcy.cn/WanBoServer";
// const baseUrl = "https://itidcy.cn/WanBoServerTest";

const workOrderUrl = baseUrl + "/WorkOrder";//工单相关功能Url
const userUrl = baseUrl + "/WxOpen";//用户相关功能Url
const patrolUrl = baseUrl + "/Patrol";//巡更相关功能Url
const reportUrl = baseUrl + "/Report";//报事相关功能Url

const urls = {

  // getFileUrl: "http://k17154485y.imwork.net:23530/WanBoFiles",
  getFileUrl: "https://itidcy.cn/WanBoFiles",
  getPatrolTypeUrl: patrolUrl + "/OnGetPatrolType",
  getOfficeInfoUrl: patrolUrl + "/GetOfficeInfo",
  getWatchInfoUrl: patrolUrl + "/GetWatchInfo",
  setWatchInfoUrl: patrolUrl + "/SetWatchResult",
  setWatchImageUrl: patrolUrl + "/SetWatchImages",

  getWorkOrderUrl: workOrderUrl + "/OnGetRepairList",//获取工单列表
  getDoneWorkOrderUrl: workOrderUrl + "/OnGetDoneRepairList",//获取工单列表
  setReceiverSubmitUrl: workOrderUrl + "/OnSetReceiverSubmit",//设置工单完成情况
  setWorkerSubmitUrl: workOrderUrl + "/OnSetWorkerSubmit",//设置工单完成情况
  setRepairImageUrl: workOrderUrl + "/OnSetRepairImages",//设置工单完成照片

  setReportUrl: reportUrl + "/OnSetReport",//设置报事信息
  setReportImageUrl: reportUrl + "/OnSetReportImages",//设置报事照片
  getReportHistoryUrl: reportUrl + "/OnGetReportHistory",//获取报事历史

  loginUrl: userUrl + "/OnLogin",//用户登陆
  getUserInfoUrl: userUrl + "/OnGetUserInfo",//获取用户信息
  getUserInfoTestUrl: userUrl + "/OnGetUserTestInfo",//获取用户信息
  bindUserUrl: userUrl + "/OnBindUser",//绑定用户的用户ID和openid
  checkPasswordUrl: userUrl + "/OnCheckPassword",//检查用户密码是否正确

}



module.exports = {
  urls: urls
}