function convertDateTimeFormat(dateTimeStr:string) {
    if (dateTimeStr.length !== 14) {
        throw new Error('Invalid date time format. Expected length 14.');
    }

    const year = dateTimeStr.slice(0, 4);
    const month = dateTimeStr.slice(4, 6);
    const day = dateTimeStr.slice(6, 8);
    const hour = dateTimeStr.slice(8, 10);
    const minute = dateTimeStr.slice(10, 12);
    const second = dateTimeStr.slice(12, 14);

    // 创建一个新的Date对象，然后使用toISOString()转换为ISO格式的字符串
    const date = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second)));
    return date.toISOString().slice(0, 19).replace('T', ' ');
}
/*
  timestamp: 13位时间戳 | new Date() | Date()
  console.log(dateFormat(1714528800000, 'YY-MM-DD HH:mm:ss'))
  format => YY：年，M：月，D：日，H：时，m：分钟，s：秒，SSS：毫秒
*/
function dateFormat (value: number|string|Date = Date.now(), format = 'YYYY-MM-DD HH:mm:ss'): string {
    if (typeof value === 'number' || typeof value === 'string') {
      var date = new Date(value)
    } else {
      var date = value
    }
    let showTime = format
    if (showTime.includes('SSS')) {
      const S = String(date.getMilliseconds())
      showTime = showTime.replace('SSS', S.padStart(3, '0'))
    }
    if (showTime.includes('YY')) {
      const Y = String(date.getFullYear())
      showTime = showTime.includes('YYYY') ? showTime.replace('YYYY', Y) : showTime.replace('YY', Y.slice(2, 4))
    }
    if (showTime.includes('M')) {
      const M = String(date.getMonth() + 1)
      showTime = showTime.includes('MM') ? showTime.replace('MM', M.padStart(2, '0')) : showTime.replace('M', M)
    }
    if (showTime.includes('D')) {
      const D = String(date.getDate())
      showTime = showTime.includes('DD') ? showTime.replace('DD', D.padStart(2, '0')) : showTime.replace('D', D)
    }
    if (showTime.includes('H')) {
      const H = String(date.getHours())
      showTime = showTime.includes('HH') ? showTime.replace('HH', H.padStart(2, '0')) : showTime.replace('H', H)
    }
    if (showTime.includes('m')) {
      const m = String(date.getMinutes())
      showTime = showTime.includes('mm') ? showTime.replace('mm', m.padStart(2, '0')) : showTime.replace('m', m)
    }
    if (showTime.includes('s')) {
      const s = String(date.getSeconds())
      showTime = showTime.includes('ss') ? showTime.replace('ss', s.padStart(2, '0')) : showTime.replace('s', s)
    }
    return showTime
  }
export {
    convertDateTimeFormat,
    dateFormat,
  };
  