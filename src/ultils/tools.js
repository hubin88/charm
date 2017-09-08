/**
 * Created by fighter on 2016/9/28.
 */
// import cookie from 'cookie';

// 增加时间秒数
export function dateAddSeconds(sec) {
  return new Date((new Date()).getTime() + (sec * 1000));
}

// cookie处理
// export class Cookie {
//   static setCookie(name, val, option) {
//     const v = (typeof val === 'string') ? val : JSON.stringify(val);
//     document.cookie = cookie.serialize(name, v, option);
//   }
//
//   static setCookieExpireInSecond(name, val, second, option) {
//     Cookie.setCookie(name, val, { expires: dateAddSeconds(second), ...option });
//   }
//
//   static getCookie(cName) {
//     const p = cookie.parse(document.cookie);
//     if (cName in p) {
//       return p[cName];
//     }
//     return null;
//   }
//
//   static getJSONCookie(cName) {
//     return JSON.parse(Cookie.getCookie(cName));
//   }
//
//   static deleteCookie(cName) {
//     Cookie.setCookie(cName, '', { maxAge: -1 });
//   }
// }

export function dateFormat(d, format = 'yyyy-MM-dd') {
  if (!d) return '';
  let date = d;
  switch (typeof date) {
    case 'string':
      date = new Date(date.replace(/-/g, '/'));
      break;
    case 'number':
    default:
      date = new Date(date);
  }
  if (!(date instanceof Date)) return '';

  const dict = {
    yyyy: date.getFullYear(),
    M: date.getMonth() + 1,
    d: date.getDate(),
    H: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
    MM: (`${date.getMonth() + 101}`).substr(1),
    dd: (`${date.getDate() + 100}`).substr(1),
    HH: (`${date.getHours() + 100}`).substr(1),
    mm: (`${date.getMinutes() + 100}`).substr(1),
    ss: (`${date.getSeconds() + 100}`).substr(1),
  };
  try {
    return format.replace(/(yyyy|MM?|dd?|HH?|mm?|ss?)/g, f => dict[f]);
  } catch (e) {
    return '';
  }
}

export function timeDifference(specifiedDate) {
  if (!specifiedDate) return '';
  const nowTime = new Date().getTime();
  let specifiedtime;
  switch (typeof specifiedDate) {
    case 'string':
      specifiedtime = new Date(specifiedDate.replace(/-/g, '/')).getTime();
      break;
    case 'number':
    default:
      specifiedtime = new Date(specifiedDate).getTime();
  }
  const differ = nowTime - specifiedtime;
  const difference = Math.floor(Math.abs(differ) / 1000);
  const daysTime = Math.floor(difference / 86400);
  const hoursTime = Math.floor((difference / 3600) - (daysTime * 24));
  const minutesTime = Math.floor((difference / 60) - (hoursTime * 60) - (daysTime * 24 * 60));
  if (differ > 0) {
    if (daysTime >= 7) {
      return dateFormat(specifiedDate, 'MM-dd');
    } else if (daysTime > 0) {
      return `${daysTime}天前`;
    }
    if (hoursTime > 0) {
      return `${hoursTime}小时前`;
    }
    if (minutesTime > 0) {
      return `${minutesTime}分钟前`;
    }
    return '刚刚';
  }
  return '刚刚';
}

// 日期处理
export class Dates {
  static getNow(dateType) {
    const now = new Date();
    return dateFormat(now, dateType);
  }

  static getNowWeekNumber() {
    const week = new Date().getDay();
    let nowWeek = week;
    if (week === 0) nowWeek = 7;
    return nowWeek;
  }

  static getOneDayWeekWithDateObject(deltaDay = 0, dateType, weekType = [1, 2, 3, 4, 5, 6, 7]) {
    const oneDayLong = 24 * 60 * 60 * 1000;
    const now = new Date();
    const dayTime = now.getTime() + (deltaDay * oneDayLong);
    const day = new Date(dayTime);
    const weekDay = now.getDay() + deltaDay;
    const week = weekDay > 0 ? weekDay % 7 : 7 + (weekDay % 7);
    return {
      date: dateFormat(day, dateType),
      week: week === 0 ? weekType[6] : weekType[week - 1],
    };
  }

  static getThisWeek(start, dateType, weekType) {
    const today = new Date().getDay();
    const weekArray = [0, 1, 2, 3, 4, 5, 6];
    return weekArray.reduce((prev, next) => {
      prev.push(Dates.getOneDayWeekWithDateObject((next + start) - today, dateType, weekType));
      return prev;
    }, []);
  }

  static getThisWeekStartMondayArray(dateType, weekType) {
    return Dates.getThisWeek(1, dateType, weekType);
  }

  static getThisWeekStartSundayArray(dateType, weekType) {
    return Dates.getThisWeek(0, dateType, weekType);
  }
}

//
// // 获取系统参数
// export function getSystem() {
//   const systemInfo = {
//     isIpad: 'ipad',
//     isIphoneOs: 'iphone os',
//     isMidp: 'midp',
//     isUc7: 'rv:1.2.3.4',
//     isUc: 'ucweb',
//     isAndroid: 'android',
//     isCE: 'windows ce',
//     isWM: 'windows mobile',
//   };
//   const userAgent = navigator.userAgent.toLowerCase();
//   const s = { ...systemInfo };
//   Object.keys(systemInfo).forEach((i) => {
//     s[i] = userAgent.includes(systemInfo[i]);
//   });
//   if (s.isIpad || s.isIphoneOs) return IS_IOS;
//   if (s.isMidp || s.isUc7 || s.isUc || s.isAndroid) return IS_ANDROID;
//   if (s.isCE || s.isWM) return IS_WINDOWS_PHONE;
//   return null;
// }

// 获取地址栏参数，传入参数名，获取参数值
const GetParamData = () => {
  let str = location.href; // 取得整个地址栏
  const num = str.indexOf('?');
  str = str.substr(num + 1); // 取得所有参数   stringvar.substr(start [, length ]
  const arr = str.split('&'); // 各个参数放到数组里
  const paramData = {};
  for (let i = 0; i < arr.length; i += 1) {
    const n = arr[i].indexOf('=');
    if (n > 0) {
      const name = arr[i].substring(0, n);
      const value = decodeURIComponent(arr[i].substr(n + 1));
      paramData[name] = value;
    }
  }
  return paramData;
};
export const ParamData = new GetParamData();

// 回车事件
export const enterKey = (event, id) => {
  const e = event || window.event;
  if (e.keyCode === 13) {
    const btn = document.getElementById(id);
    e.preventDefault();
    btn.click();
  }
};

export function timeStampConvert(dateString) {
  const d = Date(parseInt(dateString, 10) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
  return new Date(d.replace(/-/g, '/'));
}

// 时间戳转换
export function dateConvert(dateString, split) {
  const dt = timeStampConvert(dateString);
  return `${dt.getFullYear()}${split}${dt.getMonth() + 1}${split}${dt.getDate()}`;
}

export function setStyle(obj, json) {
  const o = obj;
  Object.keys(json).forEach((item) => {
    o.style[item] = json[item];
  });
}

export function getStyle(obj, name) {
  if (obj.currentStyle) {
    return obj.currentStyle[name];// IE下获取非行间样式
  }
  return getComputedStyle(obj, false)[name];// FF、Chorme下获取非行间样式
}

export function getQueryString(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = location.search.substr(1).match(reg);
  if (r != null) return unescape(decodeURI(r[2]));
  return null;
}

export function removeWrap() {
  const wrap = document.getElementById('wrap');
  wrap.parentNode.parentNode.removeChild(wrap.parentNode);
}

export function getFileName() {
  const pathname = window.location.pathname;
  const last = pathname.lastIndexOf('.');
  const start = pathname.lastIndexOf('/') + 1;
  const filename = pathname.substring(last, start);
  return filename;
}

// cookie处理
// export class Cookie {
//   static setCookie(name, val, option) {
//     const v = (typeof val === 'string') ? val : JSON.stringify(val);
//     document.cookie = cookie.serialize(name, v, option);
//   }
//
//   static getCookie(cName) {
//     const p = cookie.parse(document.cookie);
//     if (cName in p) {
//       return p[cName];
//     }
//     return null;
//   }
//
//   static getJSONCookie(cName) {
//     return JSON.parse(Cookie.getCookie(cName));
//   }
//
//   static deleteCookie(cName) {
//     Cookie.setCookie(cName, '', { maxAge: -1 });
//   }
// }

// 去掉左右两边的空格
export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
}

// 判断值是否为空
function isEmpty(strValue) {
  if (strValue === null
    || strValue === undefined
    || trim(strValue) === ''
    || trim(strValue).toLowerCase() === 'null'
    || trim(strValue).toLowerCase() === 'undefined') {
    return true;
  }
  return false;
}

// 倒计时
export const timer = (id) => {
  let t = 60;
  const btn = document.getElementById(id);
  btn.setAttribute('disabled', true);
  const timeCount = () => {
    if (t === 0) {
      clearTimeout(timeCount);
      t = 60;
      btn.innerText = '获取验证码';
      btn.removeAttribute('disabled');
    } else {
      if (!btn.getAttribute('disabled')) {
        btn.innerText = '获取验证码';
        clearTimeout(timeCount);
        return;
      }
      t -= 1;
      btn.innerText = `重新获取${t}s`;
      setTimeout(() => {
        timeCount();
      }, 1000);
    }
  };
  return timeCount();
};

// 各种验证
export const check = {
  // 手机号码
  account: {
    reg: /^1[34578]{1}[0-9]{9}$/,
    error: '请输入正确的手机号',
    error_empty: '请输入手机号',
    validate(val) {
      const value = String(val);
      if (isEmpty(value)) return this.error_empty;
      const flag = this.reg.test(trim(value));
      return flag ? true : this.error;
    },
  },
  // 验证码
  code: {
    reg: /^\d{4}$/,
    error: '验证码错误',
    validate(val) {
      const value = String(val);
      const flag = this.reg.test(trim(value));
      return flag ? true : this.error;
    },
  },
  // 密码
  password: {
    storage: null,
    reg: /^\w{6,12}$/,
    error: '密码长度为6~12个字符',
    validate(val) {
      const value = String(val);
      const flag = this.reg.test(trim(value));
      if (flag) {
        this.storage = value;
      }
      return flag ? true : this.error;
    },
  },
  // 密码确认
  repassword: {
    error: '两次密码不一致',
    validate(val) {
      const value = String(val);
      if (value !== check.password.storage) {
        return this.error;
      }
      return true;
    },
  },
  // 旧密码
  passwordOld: {
    reg: /^\w{6,12}$/,
    error: '密码长度为6~12个字符',
    validate(val) {
      const value = String(val);
      const flag = this.reg.test(trim(value));
      return flag ? true : this.error;
    },
  },
};

// 图片加载
export function loadImage(urlArr) {
  urlArr.forEach((item) => {
    const img = new Image();
    img.src = item;
  });
}

// 判断设备
export function getDevice() {
  const UserAgent = navigator.userAgent.toLowerCase();
  if (/ipad/.test(UserAgent)) {
    return 'Ios';
  } else if (/iphone os/.test(UserAgent)) {
    return 'Ios';
  } else if (/android/.test(UserAgent)) {
    return 'android';
  } else if (/windows ce/.test(UserAgent)) {
    return 'Windows CE';
  } else if (/windows mobile/.test(UserAgent)) {
    return 'Windows Mobile';
  } else if (/windows nt 5.0/.test(UserAgent)) {
    return 'Windows 2000';
  } else if (/windows nt 5.1/.test(UserAgent)) {
    return 'Windows XP';
  } else if (/windows nt 6.0/.test(UserAgent)) {
    return 'Windows Vista';
  } else if (/windows nt 6.1/.test(UserAgent)) {
    return 'Windows 7';
  } else if (/windows nt 6.2/.test(UserAgent)) {
    return 'Windows 8';
  } else if (/windows nt 6.3/.test(UserAgent)) {
    return 'Windows 8.1';
  }
  return 'Unknow';
}
