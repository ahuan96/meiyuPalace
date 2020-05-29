<template>
  <div id="city" oncontextmenu="return false" onselectstart="return false">
    <div class="chooseList" v-for="(selectList, selectIndex) in selectAll" :key="selectIndex">
      <div class="left">
        <el-select v-model="selectList.provinceCode" :disabled="selectList.Province.length < 2 ? true : false" placeholder="选择省"
        @change="changeProvince">
          <el-option
            v-for="(item, index) in selectList.Province"
            :value-key='index'
            :key="item.index"
            :label="item.label"
            :value="{value:item.value, index: index, selectIndex: selectIndex}">
          </el-option>
        </el-select>
        <el-select v-model="selectList.cityCode" :disabled="selectList.city.length < 2 ? true : false"  placeholder="选择市"
        @change="changeCity"
        v-if="showCity">
          <el-option
            v-for="(item, index) in selectList.city"
            :key="item.index"
            :label="item.label"
            :value="{value:item.value, index: index, selectIndex: selectIndex, type: item.type}">
          </el-option>
        </el-select>
        <el-select v-model="selectList.areaCode" placeholder="选择区"
        v-if="showArea(selectList)"
        :disabled="areaCodeShow ? true : false"
        @change="changeArea">
          <el-option
            v-for="(item, index) in selectList.area"
            :key="item.index"
            :label="item.label"
            :value="{value:item.value, index: index, selectIndex: selectIndex}">
          </el-option>
        </el-select>
      </div>
      <div class="selectBtn">
        <span class="editBtn addCity"
          @click="addCity(selectIndex)" v-if="selectIndex === 0"
          v-show="!areaCodeShow && addShow"></span>
        <span class="editBtn deleteCity" @click="deleteCity(selectIndex)" v-if="selectIndex > 0"></span>
      </div>
    </div>
  </div>

</template>
<script>

import AREA from '@/lib/city.json'
export default {
  name: '',
  props: ['citycodeData'],
  data () {
    return {
      selectAll: [
        {
          provinceCode: '', // 省编码
          cityCode: '', // 市编码
          areaCode: '', // 区域代码
          Province: [],
          city: [],
          area: [],
          ProninceIndex: '' // 选择省份index值
        }
      ],
      selectEditAll: [], // 编辑城市选择
      areaCodeShow: false,
      addShow: false, // 添加按钮显示
      hideLevels: 'area',
      showCity: true
    }
  },
  methods: {
    /**
     * [getProvince 获取省数据资料]
     * @return {[type]} [description]
     */
    getProvince (index) {
      var ProvinceNew = []
      AREA.map((p) => {
        ProvinceNew.push(
          {
            label: p.province_name,
            value: p.number
          }
        )
      })
      this.selectAll[index].Province = ProvinceNew
    },
    /**
     * [getOldProvince 编辑省市区资料]
     * @return {[type]} [description]
     */
    getOldProvince () {
      if (this.citycodeData && this.citycodeData.oldCityCode === '') {
        return false
      }
      var chooseCodeArr = []
      var oldCityCodeArr = []
      if (this.citycodeData && (this.citycodeData.oldCityCode === '' || this.citycodeData.oldCityCode === undefined)) {
        oldCityCodeArr.push(this.citycodeData.oldCityCode)
        return false
      } else {
        if (this.citycodeData !== undefined) {
          oldCityCodeArr = this.citycodeData.oldCityCode.split(',')
        }
      }
      for (var i = 0; i < oldCityCodeArr.length; i++) {
        for (var j = 0; j < AREA.length; j++) {
          if (+oldCityCodeArr[i] === AREA[j].number && AREA[j].regions) {
            chooseCodeArr[i] = {
              provinceCode: {
                label: AREA[j].province_name,
                value: AREA[j].number,
                cityArr: AREA[j].regions
              },
              ProninceIndex: j
            }
          } else {
            for (var k = 0; k < AREA[j].regions.length; k++) {
              if (+oldCityCodeArr[i] === AREA[j].regions[k].number) {
                chooseCodeArr[i] = {
                  provinceCode: {
                    label: AREA[j].province_name,
                    value: AREA[j].number,
                    cityArr: AREA[j].regions
                  },
                  cityCode: {
                    label: AREA[j].regions[k].city_name,
                    value: AREA[j].regions[k].number,
                    areaArr: AREA[j].regions[k].citys
                  },
                  ProninceIndex: j
                }
              } else if (AREA[j].regions[k].citys !== undefined) {
                for (var l = 0; l < AREA[j].regions[k].citys.length; l++) {
                  if (+oldCityCodeArr[i] === AREA[j].regions[k].citys[l].number) {
                    chooseCodeArr[i] = {
                      provinceCode: {
                        label: AREA[j].province_name,
                        value: AREA[j].number,
                        cityArr: AREA[j].regions
                      },
                      cityCode: {
                        label: AREA[j].regions[k].city_name,
                        value: AREA[j].regions[k].number,
                        areaArr: AREA[j].regions[k].citys
                      },
                      areaCode: {
                        label: AREA[j].regions[k].citys[l].region,
                        value: AREA[j].regions[k].citys[l].number
                      },
                      ProninceIndex: j
                    }
                  }
                }
              }
            }
          }
        }
      }
      // this.selectAll[index].Province = ProvinceNew
      var editArr = []
      for (let i = 0; i < chooseCodeArr.length; i++) {
        editArr[i] = {
          provinceCode: {
            label: chooseCodeArr[i].provinceCode.label,
            value: chooseCodeArr[i].provinceCode.value
          },
          cityCode: {
          },
          areaCode: {},
          Province: [],
          city: [],
          area: [],
          ProninceIndex: chooseCodeArr[i].ProninceIndex
        }
        if (chooseCodeArr[i].cityCode !== undefined) {
          editArr[i].cityCode = {
            label: chooseCodeArr[i].cityCode.label,
            value: chooseCodeArr[i].cityCode.value
          }
        }
        if (chooseCodeArr[i].areaCode !== undefined) {
          editArr[i].areaCode = {
            label: chooseCodeArr[i].areaCode.label,
            value: chooseCodeArr[i].areaCode.value
          }
        }

        for (let j = 0; j < AREA.length; j++) {
          editArr[i].Province.push(
            {
              label: AREA[j].province_name,
              value: AREA[j].number
            }
          )
        }
        for (let j = 0; j < chooseCodeArr[i].provinceCode.cityArr.length; j++) {
          editArr[i].city.push(
            {
              label: chooseCodeArr[i].provinceCode.cityArr[j].city_name,
              value: chooseCodeArr[i].provinceCode.cityArr[j].number
            }
          )
        }
        if (this.citycodeData && this.citycodeData.totalShow) {
          editArr[i].city.unshift({
            label: '全部',
            value: chooseCodeArr[i].provinceCode.value,
            type: 'all'
          })
        }
        if (chooseCodeArr[i].cityCode !== undefined && chooseCodeArr[i].cityCode.areaArr !== undefined) {
          for (let j = 0; j < chooseCodeArr[i].cityCode.areaArr.length; j++) {
            editArr[i].area.push(
              {
                label: chooseCodeArr[i].cityCode.areaArr[j].region,
                value: chooseCodeArr[i].cityCode.areaArr[j].number
              }
            )
          }
          if (this.citycodeData && this.citycodeData.totalShow) {
            editArr[i].area.unshift({
              label: '全部',
              value: chooseCodeArr[i].cityCode.value,
              type: 'all'
            })
          }
        }
      }
      if (this.editCityCode !== undefined && this.editCityCode !== '') {
        if (this.citycodeData && this.citycodeData.oldCityCode !== '') {
          for (let i = 0; i < editArr.length; i++) {
            editArr[i].Province = this.selectEditAll[0].Province
            editArr[i].city = this.selectEditAll[0].city
          }
          this.selectAll = editArr
        } else {
          this.selectAll[0] = this.selectEditAll[0]
        }
      } else {
        this.selectAll = editArr
      }
      this.getCode()
    },
    /**
     * [changeProvince 限制选择省市区]
     * @return {[type]} [description]
     */
    getEditProvince (editCode) {
      var chooseCodeArr = []
      if (editCode === undefined) {
        return false
      }
      var oldCityCodeArr = []
      if (editCode !== '' && editCode.toString().indexOf(',') < 0) {
        oldCityCodeArr.push(editCode)
      } else {
        oldCityCodeArr = editCode.split(',')
      }
      for (var i = 0; i < oldCityCodeArr.length; i++) {
        for (var j = 0; j < AREA.length; j++) {
          if (+oldCityCodeArr[i] === AREA[j].number && AREA[j].regions) {
            chooseCodeArr[i] = {
              provinceCode: {
                label: AREA[j].province_name,
                value: AREA[j].number,
                cityArr: AREA[j].regions,
                provinceCodeTrue: true
              },
              ProninceIndex: j
            }
          } else {
            for (var k = 0; k < AREA[j].regions.length; k++) {
              if (+oldCityCodeArr[i] === AREA[j].regions[k].number) {
                chooseCodeArr[i] = {
                  provinceCode: {
                    label: AREA[j].province_name,
                    value: AREA[j].number,
                    cityArr: AREA[j].regions,
                    provinceCodeTrue: true
                  },
                  cityCode: {
                    label: AREA[j].regions[k].city_name,
                    value: AREA[j].regions[k].number,
                    areaArr: AREA[j].regions[k].citys,
                    cityCodeTrue: true
                  },
                  ProninceIndex: j
                }
              } else if (AREA[j].regions[k].citys !== undefined) {
                for (var l = 0; l < AREA[j].regions[k].citys.length; l++) {
                  if (+oldCityCodeArr[i] === AREA[j].regions[k].citys[l].number) {
                    chooseCodeArr[i] = {
                      provinceCode: {
                        label: AREA[j].province_name,
                        value: AREA[j].number,
                        cityArr: AREA[j].regions
                      },
                      cityCode: {
                        label: AREA[j].regions[k].city_name,
                        value: AREA[j].regions[k].number,
                        areaArr: AREA[j].regions[k].citys
                      },
                      areaCode: {
                        label: AREA[j].regions[k].citys[l].region,
                        value: AREA[j].regions[k].citys[l].number,
                        areaCodeTrue: true
                      },
                      ProninceIndex: j
                    }
                  }
                }
              }
            }
          }
        }
      }
      var editArr = []
      for (let i = 0; i < chooseCodeArr.length; i++) {
        editArr[i] = {
          provinceCode: {
            label: chooseCodeArr[i].provinceCode.label,
            value: chooseCodeArr[i].provinceCode.value,
            provinceCodeTrue: true
          },
          cityCode: {},
          areaCode: {},
          Province: [],
          city: [],
          area: [],
          ProninceIndex: chooseCodeArr[i].ProninceIndex

        }
        if (chooseCodeArr[i].cityCode !== undefined) {
          editArr[i].cityCode = {
            label: chooseCodeArr[i].cityCode.label,
            value: chooseCodeArr[i].cityCode.value,
            cityCodeTrue: true
          }
        } else {
          editArr[i].cityCode = ''
        }
        if (chooseCodeArr[i].areaCode !== undefined) {
          editArr[i].areaCode = {
            label: chooseCodeArr[i].areaCode.label,
            value: chooseCodeArr[i].areaCode.value,
            areaCode: true
          }
          this.areaCodeShow = true
        } else {
          editArr[i].areaCode = ''
          this.areaCodeShow = false
        }

        editArr[i].Province.push(
          {
            label: chooseCodeArr[i].provinceCode.label,
            value: chooseCodeArr[i].provinceCode.value
          }
        )
        if (chooseCodeArr[i].cityCode === undefined) {
          for (let j = 0; j < chooseCodeArr[i].provinceCode.cityArr.length; j++) {
            editArr[i].city.push(
              {
                label: chooseCodeArr[i].provinceCode.cityArr[j].city_name,
                value: chooseCodeArr[i].provinceCode.cityArr[j].number
              }
            )
          }
          // 添加全部
          if (this.citycodeData && this.citycodeData.totalShow) {
            editArr[i].city.unshift({
              label: '全部',
              value: this.editCityCode,
              type: 'all'
            })
          }
        } else {
          editArr[i].city.push({
            label: chooseCodeArr[i].cityCode.label,
            value: chooseCodeArr[i].cityCode.value
          })
        }

        if (chooseCodeArr[i].cityCode !== undefined && chooseCodeArr[i].cityCode.areaArr !== undefined) {
          for (let j = 0; j < chooseCodeArr[i].cityCode.areaArr.length; j++) {
            editArr[i].area.push(
              {
                label: chooseCodeArr[i].cityCode.areaArr[j].region,
                value: chooseCodeArr[i].cityCode.areaArr[j].number
              }
            )
          }
          if (this.citycodeData && this.citycodeData.totalShow) {
            editArr[i].area.unshift({
              label: '全部',
              value: this.editCityCode,
              type: 'all'
            })
          }
        }

        // 给定区域
        if (this.citycodeData && this.citycodeData.cityArray !== undefined && this.citycodeData.cityArray !== '') {
          let cityArrAll = this.citycodeData.cityArray

          let cityArrAllFirst = cityArrAll[0]
          let judgeLeve = this.getLeve(cityArrAllFirst)
          if (chooseCodeArr[i].cityCode === undefined && +judgeLeve === 2) {
            editArr[i].city = []
            for (let z = 0; z < cityArrAll.length; z++) {
              for (let y = 0; y < chooseCodeArr[i].provinceCode.cityArr.length; y++) {
                if (+cityArrAll[z] === +chooseCodeArr[i].provinceCode.cityArr[y].number) {
                  editArr[i].city.push(
                    {
                      label: chooseCodeArr[i].provinceCode.cityArr[y].city_name,
                      value: chooseCodeArr[i].provinceCode.cityArr[y].number
                    }
                  )
                }
                if (chooseCodeArr[i].provinceCode.cityArr[y].citys !== undefined) {
                  for (var w = 0; w < chooseCodeArr[i].provinceCode.cityArr[y].citys.length; w++) {
                    editArr[i].area.push(
                      {
                        label: chooseCodeArr[i].provinceCode.cityArr[y].citys[w].region,
                        value: chooseCodeArr[i].provinceCode.cityArr[y].citys[w].number
                      }
                    )
                  }
                }
              }
            }
            if (editArr[i].city.length === 1) {
              editArr[i].cityCode = {
                label: editArr[i].city[0].label,
                value: editArr[i].city[0].value,
                cityCodeTrue: true
              }
            }
            editArr[i].city.unshift({
              label: '全部',
              value: this.editCityCode,
              type: 'all'
            })
          }
          if (chooseCodeArr[i].cityCode !== undefined && chooseCodeArr[i].cityCode.areaArr !== undefined && +judgeLeve === 3) {
            editArr[i].area = []
            for (let z = 0; z < cityArrAll.length; z++) {
              for (let x = 0; x < chooseCodeArr[i].cityCode.areaArr.length; x++) {
                if (+cityArrAll[z] === +chooseCodeArr[i].cityCode.areaArr[x].number) {
                  editArr[i].area.push(
                    {
                      label: chooseCodeArr[i].cityCode.areaArr[x].region,
                      value: chooseCodeArr[i].cityCode.areaArr[x].number
                    }
                  )
                }
              }
            }
            if (editArr[i].area.length === 1) {
              editArr[i].areaCode = {
                label: editArr[i].area[0].label,
                value: editArr[i].area[0].value,
                cityCodeTrue: true
              }
            }
            editArr[i].area.unshift({
              label: '全部',
              value: this.editCityCode,
              type: 'all'
            })
          }
        }
      }
      this.selectEditAll = editArr
      this.selectAll = editArr
      this.selectEditAll[0].ProninceIndex = chooseCodeArr[0].ProninceIndex

      this.getCode()
    },
    getLeve (value) {
      for (var j = 0; j < AREA.length; j++) {
        if (+value === AREA[j].number && AREA[j].regions) {
          return 1
        } else {
          for (var k = 0; k < AREA[j].regions.length; k++) {
            if (+value === AREA[j].regions[k].number) {
              return 2
            } else if (AREA[j].regions[k].citys !== undefined) {
              for (var l = 0; l < AREA[j].regions[k].citys.length; l++) {
                if (+value === AREA[j].regions[k].citys[l].number) {
                  return 3
                }
              }
            }
          }
        }
      }
    },
    /**
     * [changeProvince 获取市数据资料]
     * @return {[type]} [description]
     */
    changeProvince (value) {
      var cityNew = []
      this.ProninceIndex = value.index
      this.selectAll[value.selectIndex].ProninceIndex = value.index
      AREA[+value.index].regions.map((p, i) => {
        cityNew.push(
          {
            label: p.city_name,
            value: p.number
          }
        )
      })
      if (this.citycodeData && this.citycodeData.totalShow) {
        cityNew.unshift(
          {
            label: '全部',
            value: value.value,
            type: 'all'
          }
        )
      }
      this.selectAll[value.selectIndex].cityCode = ''
      this.selectAll[value.selectIndex].areaCode = ''
      this.selectAll[value.selectIndex].city = cityNew
      this.selectAll[value.selectIndex].area = ''
      this.getCode()
    },
    /**
     * [changeCity 获取区数据资料]
     * @return {[type]} [description]
     */
    changeCity (value) {
      if (value.type === 'all') {
        this.selectAll[value.selectIndex].areaCode = ''
        this.selectAll[value.selectIndex].area = []
        this.getCode()
        return false
      }
      var areaNew = []

      // if (this.editCityCode !== undefined && this.editCityCode !== '') {
      //   this.ProninceIndex = this.selectEditAll[0].ProninceIndex
      // }
      var ProninceIndex = this.selectAll[value.selectIndex].ProninceIndex
      // var cityIndex
      // if (this.citycodeData && this.citycodeData.totalShow) {
      //   cityIndex = +value.index - 1
      // } else {
      //   cityIndex = +value.index
      // }
      for (var i = 0; i < AREA[ProninceIndex].regions.length; i++) {
        if (+AREA[ProninceIndex].regions[i].number === +value.value && AREA[ProninceIndex].regions[i].citys) {
          AREA[ProninceIndex].regions[i].citys.map((p) => {
            areaNew.push(
              {
                label: p.region,
                value: p.number
              }
            )
          })
          if ((this.citycodeData && this.citycodeData.totalShow) || (this.citycodeData && this.citycodeData.cityArray)) {
            areaNew.unshift(
              {
                label: '全部',
                value: value.value
              }
            )
          }
          this.selectAll[value.selectIndex].area = areaNew
          this.selectAll[value.selectIndex].areaCode = ''
        }
      }
      this.getCode()
    },
    /**
     * [changeArea 区数据更改]
     * @return {[type]} [description]
     */
    changeArea (value) {
      this.getCode()
    },
    /**
     * [getCode 区数据更改]
     * @return {[type]} [description]
     */
    getCode () {
      var chooseCode = []
      this.selectAll.forEach(function (item, index) {
        if (item.areaCode && item.areaCode.value !== undefined) {
          chooseCode.push(item.areaCode.value)
        } else if (item.cityCode && item.cityCode.value !== undefined) {
          chooseCode.push(item.cityCode.value)
        } else if (item.provinceCode && item.provinceCode !== '') {
          chooseCode.push(item.provinceCode.value)
        }
      })
      this.$emit('cityCode', chooseCode)
    },
    /**
     * [addCity 添加区域]
     * @return {[type]} [description]
     */
    addCity (selectIndex) {
      if (this.editCityCode !== undefined && this.editCityCode !== '') {
        var cityCode
        if (this.selectEditAll[0].cityCode.cityCodeTrue === undefined) {
          cityCode = ''
        } else {
          cityCode = this.selectEditAll[0].cityCode
        }
        var areaCode
        if (this.selectEditAll[0].areaCode.areaCodeTrue === undefined) {
          areaCode = ''
        } else {
          areaCode = this.selectEditAll[0].areaCode
        }
        this.selectAll.push({
          provinceCode: this.selectEditAll[0].provinceCode,
          cityCode: cityCode,
          areaCode: areaCode,
          Province: this.selectEditAll[0].Province,
          city: this.selectEditAll[0].city,
          area: this.selectEditAll[0].area,
          ProninceIndex: '' // 选择省份index值
        })
      } else {
        this.selectAll.push({
          provinceCode: '', // 省编码
          cityCode: '', // 市编码
          areaCode: '', // 区域代码
          Province: [],
          city: [],
          area: [],
          ProninceIndex: '' // 选择省份index值
        })
        this.getProvince(this.selectAll.length - 1)
      }
      this.getCode()
    },
    /**
     * [deleteCity 删除当前省市区]
     * @param  {[type]} selectIndex [description]
     * @return {[type]}             [description]
     */
    deleteCity (selectIndex) {
      this.selectAll.splice(selectIndex, 1)
      this.getCode()
    },
    /**
     * [showArea 是否显示当前区]
     * @param  {[obj]} selectIndex [当前省数据]
     * @return {[type]} [description]
     */
    showArea (selectList) {
      if (+selectList.area.length > 0) {
        return true
      } else {
        return false
      }
    },
    showCityFun () {
      if (this.citycodeData && this.citycodeData.hideLevel === 'city' && this.editCityCode) {
        if (this.selectAll[0].cityCode === '' || this.selectAll[0].area.length === 0) {
          this.selectAll[0].area = []
          this.selectAll[0].cityCode = []
          this.showCity = false
        } else {
          this.showCity = true
        }
        this.selectAll[0].area = []
        this.selectAll[0].areaCode = []
        this.getCode()
      } else if (this.citycodeData && this.citycodeData.hideLevel === 'area' && this.editCityCode && this.selectAll[0].area.length === 0) {
        this.showCity = true
        this.getEditProvince(this.editCityCode)
      }
    }
  },
  watch: {
    citycodeData: {
      // 深度监听，可监听到对象、数组的变化
      handler (newV, oldV) {
        this.showCityFun()
        if (this.citycodeData !== undefined && this.citycodeData.oldCityCode !== '' && this.citycodeData.oldCityCode !== undefined) {
          this.getOldProvince()
        }
      },
      deep: true
    }
  },
  created () {
    this.getProvince(0)
    var editCityCodeAll = window.Global.database.citycode
    this.editCityCode = editCityCodeAll
    if (this.editCityCode !== undefined && this.editCityCode !== '') {
      this.getEditProvince(this.editCityCode)
      // this.getOldProvince()
    }
    if (this.citycodeData !== undefined) {
      if (this.citycodeData.oldCityCode !== '' && this.citycodeData.oldCityCode !== undefined) {
        this.getOldProvince()
      }
      // 多组件单组件切换
      if (this.citycodeData.moreSelect) {
        this.addShow = true
      } else {
        this.addShow = false
      }
      // 是否切换显示
      if (this.citycodeData.hideLevel !== '' && this.citycodeData.hideLevel !== undefined) {
        this.showCityFun()
      }
    }
  },
  mounted () {
  },
  components: {

  }
}
</script>
