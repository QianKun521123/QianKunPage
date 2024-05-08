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

export {
    convertDateTimeFormat,
  };
  