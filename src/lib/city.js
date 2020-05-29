import AREA from '@/lib/city.json'

/**
 * [cityname 获取城市名]
 * @return {[]} []
 */
export function cityname (cityCode) {
  var chooseCodeArr = []
  if (typeof (cityCode) === 'number') {
    cityCode = cityCode.toString()
  }
  for (var j = 0; j < AREA.length; j++) {
    if (+cityCode === AREA[j].number && AREA[j].regions) {
      chooseCodeArr = {
        provinceCode: {
          label: AREA[j].province_name,
          value: AREA[j].number,
          cityArr: AREA[j].regions
        },
        ProninceIndex: j
      }
    } else {
      for (var k = 0; k < AREA[j].regions.length; k++) {
        if (+cityCode === AREA[j].regions[k].number) {
          chooseCodeArr = {
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
            if (+cityCode === AREA[j].regions[k].citys[l].number) {
              chooseCodeArr = {
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
                }
              }
            }
          }
        }
      }
    }
  }
  var cityName
  if (chooseCodeArr.provinceCode !== undefined) {
    cityName = chooseCodeArr.provinceCode.label
  }
  if (chooseCodeArr.cityCode !== undefined) {
    cityName = chooseCodeArr.provinceCode.label + ' ' + chooseCodeArr.cityCode.label
  }
  if (chooseCodeArr.areaCode !== undefined) {
    cityName = chooseCodeArr.provinceCode.label + ' ' + chooseCodeArr.cityCode.label + ' ' + chooseCodeArr.areaCode.label
  }
  return cityName
}

/**
 * [citylevel 获取城市层级]
 * @return {[]} []
 */
export function citylevel (cityCode) {
  var chooseCodeArr = []
  if (typeof (cityCode) === 'number') {
    cityCode = cityCode.toString()
  }
  for (var j = 0; j < AREA.length; j++) {
    if (+cityCode === AREA[j].number && AREA[j].regions) {
      chooseCodeArr = {
        provinceCode: {
          label: AREA[j].province_name,
          value: AREA[j].number,
          cityArr: AREA[j].regions
        },
        ProninceIndex: 1
      }
    } else {
      for (var k = 0; k < AREA[j].regions.length; k++) {
        if (+cityCode === AREA[j].regions[k].number) {
          chooseCodeArr = {
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
            cityIndex: 1
          }
        } else if (AREA[j].regions[k].citys !== undefined) {
          for (var l = 0; l < AREA[j].regions[k].citys.length; l++) {
            if (+cityCode === AREA[j].regions[k].citys[l].number) {
              chooseCodeArr = {
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
                areaIndex: 1
              }
            }
          }
        }
      }
    }
  }
  var cityLevel = 'false'
  if (chooseCodeArr.ProninceIndex !== undefined) {
    cityLevel = 'false'
  }
  if (chooseCodeArr.cityIndex) {
    cityLevel = 'false'
    if (chooseCodeArr.cityCode.areaArr === undefined) {
      cityLevel = 'true'
    }
  }
  if (chooseCodeArr.areaIndex) {
    cityLevel = 'true'
  }
  return cityLevel
}
