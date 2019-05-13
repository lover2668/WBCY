

// const baseUrl = "http://localhost:11780";//云服务器Url
// const baseUrl = "http://k17154485y.imwork.net:23530/WanBoServer";
const baseUrl = "https://itidcy.cn/WanBoServer";

const workOrderUrl = baseUrl + "/WorkOrder";//工单相关功能Url
const userUrl = baseUrl + "/WxOpen";//用户相关功能Url
const patrolUrl = baseUrl + "/Patrol";//巡更相关功能Url


const urls = {

  getPatrolTypeUrl: patrolUrl + "/OnGetPatrolType",
  getOfficeInfoUrl: patrolUrl + "/GetOfficeInfo",
  getWatchInfoUrl: patrolUrl + "/GetWatchInfo",
  setWatchInfoUrl: patrolUrl + "/SetWatchResult",
  setWatchImageUrl: patrolUrl + "/SetWatchImages",

  getWorkOrderUrl: workOrderUrl + "/OnGetRepairList",//获取工单列表
  getDoneWorkOrderUrl: workOrderUrl + "/OnGetDoneRepairList",//获取工单列表
  setReceiverSubmitUrl: workOrderUrl + "/OnSetReceiverSubmit",//设置工单完成情况
  setWorkerSubmitUrl: workOrderUrl + "/OnSetWorkerSubmit",//设置工单完成情况

  loginUrl: userUrl + "/OnLogin",//用户登陆
  getUserInfoUrl: userUrl + "/OnGetUserInfo",//获取用户信息
  getUserInfoTestUrl: userUrl + "/OnGetUserTestInfo",//获取用户信息
  bindUserUrl: userUrl + "/OnBindUser",//绑定用户的用户ID和openid
  checkPasswordUrl: userUrl + "/OnCheckPassword",//检查用户密码是否正确

}



module.exports = {
  urls: urls
}