/**
 * Created by dz on 16/9/27.
 */
import ReactDOM from 'react-dom';

export function insertComponent(component) {
  const el = document.createElement('div');
  document.body.appendChild(el);
  ReactDOM.render(component, el);
  return el;
}

export function removeComponentByRef(ref) {
  const p = ref.parentNode;
  ReactDOM.unmountComponentAtNode(p);
  p.parentNode.removeChild(p);
}

// 获取url参数
export function getUrlArguments() {
  const url = location.search;
  if (url.indexOf('?') !== -1) {
    const theRequest = {};
    const str = url.substr(1);
    const strs = str.split('&');
    for (let i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
    }
    return theRequest;
  }
  return null;
}

// 解析url参数里的字符串转为对象
export function getUrlParamObj() {
  let obj = {};
  try {
    const text = getUrlArguments().params;
    console.log(decodeURIComponent(text));
    obj = JSON.parse(decodeURIComponent(decodeURIComponent(text)));
  } catch (e) {
    console.log('url参数解析出错');
  }
  return obj;
}

export function formatJsonArgs(args) {
  const command = {
    command: args.command,
    params: args.params ? args.params : {},
  };
  return JSON.stringify(command);
}

// js 调用 native
export function callNative(funName, args) {
  try {
    const formatArgs = formatJsonArgs(args);
    if (typeof (android) === 'undefined') {
      window.webkit.messageHandlers[funName].postMessage(formatArgs);
    } else {
      console.log(22222);
      window.android[funName](formatArgs);
    }
  } catch (e) {
    console.log(`js 调用 native${e}`);
  }
}

// native 调用 js
export function defineToNative(funName, funBody) {
  if (typeof (android) === 'undefined') {
    window[funName] = funBody;
  } else {
    window.android[funName] = funBody;
  }
}
