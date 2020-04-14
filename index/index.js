var app = getApp()
var address = require('./city.js')
var app = getApp()

Page({
  data: {
    address: '', //详细收货地址（四级）
    value: [0, 0, 0], // 地址选择器省市区 暂存 currentIndex
    region: '', //所在地区
    regionValue: [0, 0, 0], // 地址选择器省市区 最终 currentIndex
    provinces: [], // 一级地址
    citys: [], // 二级地址
    areas: [], // 三级地址
    visible: false,
  },


  onLoad(options) {
    // 默认联动显示北京,可设置为其它省
    var id = address.provinces[0].id
    // 获取省市县数据
    this.setData({
      provinces: address.provinces, // 34省
      citys: address.citys[id], //默认北京市辖区
      areas: address.areas[address.citys[id][0].id]
    })
  },


  closePopUp() { // 取消
    this.cityCancel()
  },


  pickAddress() { // 点击显示 picker
    this.setData({
      visible: true,
      value: [...this.data.regionValue]
    })
  },


  // 处理省市县联动逻辑 并保存 value
  cityChange(e) {
    var value = e.detail.value
    let {
      provinces,
      citys
    } = this.data

    // value：11,10,1
    var provinceNum = value[0]
    var cityNum = value[1]
    var areaNum = value[2]

    if (this.data.value[0] !== provinceNum) {
      // 获得省份的 id
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id], // 根据省的 id 同步城市数据
        areas: address.areas[address.citys[id][0].id] // 同步该省下第一个城市的所有区县的数据
      })
    } else if (this.data.value[1] !== cityNum) {
      var id = citys[cityNum].id // 获取对应城市的 id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[id] // 根据城市 id 同步该市所有区县
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, areaNum]
      })
    }
  },


  // 城市选择器
  // 点击地区选择取消按钮
  cityCancel() {
    var id = address.provinces[0].id // 默认为北京的 id
    this.setData({
      citys: address.citys[id], //默认北京市辖区,
      areas: address.areas[address.citys[id][0].id],
      value: [...this.data.regionValue],
      visible: false
    })
  },


  // 提交时由序号获取省市区id
  getRegionId(type) {
    let value = this.data.regionValue // [0,0,0]
    let provinceId = address.provinces[value[0]].id
    let townId = address.citys[provinceId][value[1]].id
    let areaId = ''
    if (address.areas[townId][value[2]].id) { // 设置区县的id
      areaId = address.areas[townId][value[2]].id
    } else {
      areaId = 0
    }

    if (type === 'provinceId') {
      return provinceId
    } else if (type === 'townId') {
      return townId
    } else {
      return areaId
    }
  },


  // 点击地区选择确定按钮
  citySure(e) {
    var value = this.data.value
    this.setData({
      visible: false
    })
    // 将选择的城市信息显示到输入框
    try {
      var region = (this.data.provinces[value[0]].name || '') + (this.data.citys[value[1]].name || '') // **省**市

      if (this.data.areas.length > 0) {
        region = region + this.data.areas[value[2]].name || ''
      } else {
        this.data.value[2] = 0
      }
    } catch (error) {
      console.log('adress select something error')
    }

    this.setData({
      region: region,
      regionValue: [...this.data.value]
    }, () => {
      console.log(`省份ID：${this.getRegionId('provinceId')}: 市区ID：${this.getRegionId('townId')}：城区ID：${this.getRegionId('areas')}`)
    })
  }
})