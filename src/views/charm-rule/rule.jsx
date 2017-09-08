/**
 * Created by hubin on 2017/9/5.
 */

import React, { Component, PropTypes } from 'react';
import './rule.scss';

const Rule = () => {
  return (
    <div styleName="charmdetaile">
      <table>
        <tbody>
          <tr styleName="th">
            <th>操作</th>
            <th>魅力值</th>
          </tr>
          <tr>
            <td>注册并加入公社</td>
            <td>+5(一次性)</td>
          </tr>
          <tr>
            <td>完善个人资料</td>
            <td>+5(一次性)</td>
          </tr>
          <tr>
            <td>完成认证</td>
            <td>+5(一次性)</td>
          </tr>
          <tr>
            <td>被关注</td>
            <td>+1</td>
          </tr>
          <tr>
            <td>被约见</td>
            <td>+3</td>
          </tr>
          <tr>
            <td>约见面成功</td>
            <td>+5</td>
          </tr>
        </tbody>
      </table>
      <div styleName="tips">
        <div styleName="title">说明</div>
        <ul>
          <li>1、魅力值是社交优势的体现，魅力值越高，约见的成功率越高</li>
          <li>2、被同一个用户关注、约见面多次，只增加一次魅力值</li>
          <li>3、向同一个用户约见面成功多次，只增加一次魅力值</li>
        </ul>
      </div>
    </div>
  );
};
export default Rule;