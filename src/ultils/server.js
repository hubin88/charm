/**
 * Created by huoban-xia on 2017/7/11.
 */
import 'fetch-ie8';
import {getQueryString} from './tools';

const token = getQueryString("token");

export function POST(url, obj) {
  const postData = (typeof obj === 'object') ? JSON.stringify(obj) : obj;
  return fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: postData,
  }).then(res => res.json()).then(rs => rs);
}

export function GET(url) {
  return fetch(url, {
    method: 'get',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  }).then(res => res.json()).then(rs => rs);
}

export function DELETE(url) {
  return fetch(url, {
    method: 'delete',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  }).then(res => res.json()).then(rs => rs);
}

export function postAjax(url, obj) {
  const postData = (typeof obj === 'object') ? JSON.stringify(obj) : obj;
  return fetch(url, {
    method: 'post',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: postData,
  }).then(res => res.json()).then((rs) => {
    if(rs.code!==200&&rs.code!==201){
      throw new Error(rs.message);
    }
    return rs;
  });
}
export function getAjax(url) {
  return fetch(url, {
    method: 'get',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token,
    },
  }).then(res => res.json()).then((rs) => {
    if(rs.code!==200&&rs.code!==201){
      throw new Error(rs.message);
    }
    return rs;
  });
}