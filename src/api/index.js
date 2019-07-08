// 配置API接口地址
// var root = ''
// var root = 'http://192.168.0.18:6009'
var root = 'http://king-break.imwork.net:9007/device'
// 引用axios
var axios = require('axios')
var qs = require('qs')
// 自定义判断元素类型JS
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull (o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}
/*
  接口处理函数
*/

function apiAxios (method, url, params, callback) {
  if (params) {
    params = filterNull(params)
  }
  var paramsStr = qs.stringify(params)
  axios({
    method: method,
    url: url,
    data: method !== 'GET' ? paramsStr : null,
    params: method === 'GET' ? paramsStr : null,
    baseURL: root,
    withCredentials: false,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(function (res) {
    callback(res)
  })
  .catch(function (err) {
    if (err) {
      console.log('载入错误，' + err)
    }
  })
}

function apiAxiosDownload (method, url, params, callback) {
  if (params) {
    params = filterNull(params)
  }
  axios({
    method: method,
    url: url,
    data: null,
    params: null,
    baseURL: root,
    withCredentials: false,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    responseType: 'blob'
  })
  .then(function (res) {
    callback(res)
  })
  .catch(function (err) {
    if (err) {
      console.log('载入错误，' + err)
    }
  })
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, callback) {
    return apiAxios('GET', url, params, callback)
  },
  post: function (url, params, callback) {
    return apiAxios('POST', url, params, callback)
  },
  delete: function (url, params, callback) {
    return apiAxios('DELETE', url, params, callback)
  },
  put: function (url, params, callback) {
    return apiAxios('PUT', url, params, callback)
  },
  download: function (url, params, callback) {
    return apiAxiosDownload('POST', url, params, callback)
  }
}
