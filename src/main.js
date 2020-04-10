import Vue from 'vue'
import App from './App'
import router from './router'
import { Message,Select,Option,Checkbox,
    CheckboxButton,
    CheckboxGroup, } from 'element-ui'
import axios from 'axios'
import UUID from 'uuid-js'
import store from './store/index'
// import Mock from './mock/mock'
// Mock.mockData()
 import {BASE_URL} from "./urlConfig/index";
/*
    图片上传，获取验证码两个接口不使用根路径
*/
// axios.defaults.baseURL = 'https://api.huoxingy.com/v1/clerk/';
// axios.defaults.baseURL = 'https://staging-table-api.huoxingy.com/v1/clerk/';
axios.defaults.baseURL = BASE_URL+'/v1/clerk/';
// axios.defaults.baseURL = 'http://192.168.0.106:9090/v1/clerk/';
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

axios.defaults.withCredentials=true;


/*
    设置请求拦截器
*/
// axios.interceptors.request.use(function(config) {
//     // console.log(config);

//     // 获取验证码，注册不能带token验证
//     /*if ( config.url.indexOf('v1/verify-code') >= 0 || config.url.indexOf('v1/admin/sign-up') >= 0 ) {
//         return config;
//     }*/
//     let token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = token;
//     }
//     return config;
// }, function(error) {
//     return Promise.reject(error);
// });

/*
    添加响应拦截器
*/
axios.interceptors.response.use(function(response) {
    return response;
}, function(error) {
    if (error.response) {
        let tipText;
        error.response.data.message?tipText=error.response.data.message:tipText=error.response.data;
        if ( error.response.status == 401 ) {
            window.location.href = window.location.href.split('#')[0]+'#/login';
            tipText = '帐号失效，请重新登录';
        } else if ( error.response.status == 403 ) {
            tipText = '权限不足';
        }

        if ( tipText ) {
            Message.error({
                message: tipText,
                customClass: 'error'
            })
        }
    }
    return Promise.reject(error);
});

Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/*
    添加自定义过滤器
*/
Vue.filter('numberToDate', function ( val ) {
    let dateStr = new Date(val).toLocaleDateString();
    return dateStr;
})
Vue.filter('numberToAllDate', function ( val ) {
    let date = new Date(val);
    let dateStr =date.getFullYear()+'/'+((date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1))+'/'+(date.getDate()<10?'0'+date.getDate():date.getDate())+'-'+ 
    (date.getHours()<10?'0'+date.getHours():date.getHours()) + ':' + (date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())+':' + (date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds());
    return dateStr;
})

Vue.prototype.$uuid = function ( len, radix ) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [], i;
    radix = radix || chars.length;
    if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
        // rfc4122, version 4 form
        var r;
 
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
 
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for ( i = 0; i < 32; i++ ) {
            if ( !uuid[i] ) {
                r = 0 | Math.random()*63;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }

    return uuid.join('');
}
/*
  生产UUID：this.$uuid.create(1)
*/

Vue.prototype.$http = axios

Vue.prototype.$baseURL_2 = 'https://table-api.huoxingy.com/v1/'

Vue.prototype.$message = Message

// 创建滚动条方法
Vue.prototype.$createScroll = function ( id ) {
    var myScroll;
    myScroll = new iScroll( id, {
        scrollbarClass: 'scrollBar',
        hScroll: false,
        checkDOMChanges: true
    });
}
Vue.use(Select);
Vue.use(Option);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.config.productionTip = false

/* eslint-disable no-new */

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})
