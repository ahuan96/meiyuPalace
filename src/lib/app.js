/**
 * [timeformat 格式化时间戳]
 * @param  {[Int]} timestamp [时间戳]
 * @param  {[Int]} type [方式]
 * @return {[String]} [时间字符串]
 */
export function timeformat (timestamp, type) {
  if (!timestamp) {
    return ''
  }

  // 处理当前时区为中心时区
  let date = new Date(timestamp * 1000)
  const basetime = date.getTime()
  const zonetime = date.getTimezoneOffset() * 60000
  const utc = basetime + zonetime

  // 处理中心时区为北京时区
  timestamp = utc + (3600000 * 8)
  date = new Date(timestamp)

  // 以北京时区为标准换算
  const year = date.getFullYear()
  const month = (date.getMonth() + 1 < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)
  const day = (date.getDate() < 10) ? ('0' + date.getDate()) : (date.getDate())

  const hour = (date.getHours() < 10) ? ('0' + date.getHours()) : (date.getHours())
  const minute = (date.getMinutes() < 10) ? ('0' + date.getMinutes()) : (date.getMinutes())
  const second = (date.getSeconds() < 10) ? ('0' + date.getSeconds()) : (date.getSeconds())

  const weekday = '星期' + '日一二三四五六'.charAt(date.getDay())

  // 组装并返回字符串
  if (type === 1) {
    return (year + '年' + month + '月' + day + '日　' + weekday)
  } else if (type === 2) {
    return (year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second)
  } else if (type === 3) {
    return (year + '-' + month + '-' + day)
  } else {
    return (year + '-' + month + '-' + day + ' ' + hour + ':' + minute)
  }
}

/**
 * [numformat 格式化数字]
 * @param  {[Int]} timestamp [时间戳]
 * @param  {[Int]} type [方式]
 * @return {[String]} [数字字符串]
 */
export function numformat (num, bit) {
  if (!num) {
    num = 0
  }

  if (!bit) {
    bit = 2
  } else {
    bit = parseInt(bit) > 0 ? parseInt(bit) : 0
  }

  let number = num.toString()
  if (number.indexOf('.') === -1) {
    if (bit > 0) {
      number += '.'
      for (let i = 0; i < bit; i++) {
        number += '0'
      }
    }
  } else {
    var arr = number.split('.')
    if (arr[1].length > bit) {
      if (bit === 0) {
        number = arr[0]
      } else {
        number = number.substr(0, (number.length - (arr[1].length - bit)))
      }
    } else {
      for (var i = 0; i < (bit - arr[1].length); i++) {
        number += '0'
      }
    }
  }
  return number
}
