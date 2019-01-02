var officeData;
var watchData;


officeData = {
  office: [
    { officeId: 0, officeName: "美林" },
    { officeId: 1, officeName: "国风上观" },
    { officeId: 2, officeName: "国风北京" },
    { officeId: 3, officeName: "燕侨" },
    { officeId: 4, officeName: "紫芳园" },
    { officeId: 5, officeName: "南湖东园" },
    { officeId: 6, officeName: "南湖中园" },
    { officeId: 7, officeName: "花家地北里" },
    { officeId: 8, officeName: "海子花园" }]
}

watchData = {
  frequency: [
    { frequencyId: 0, frequencyName: "早班", times: 3, startTime: "08:00", endTime: "11:00", minutes: 60 },
    { frequencyId: 1, frequencyName: "中班", times: 3, startTime: "12:00", endTime: "15:00", minutes: 60 },
    { frequencyId: 2, frequencyName: "晚班", times: 3, startTime: "17:00", endTime: "20:00", minutes: 60 },
  ],
  point: [
    { pointId: 0, longitude: 116.320080, latitude: 40.069550, locationName: "6号楼", NO: 0 },
    { pointId: 1, longitude: 116.323170, latitude: 40.069190, locationName: "7号楼", NO: 1 },
    { pointId: 2, longitude: 116.326289, latitude: 40.068088, locationName: "8号楼", NO: 2 },

  ]
}

module.exports = {
  officeData:officeData,
  watchData:watchData,
}