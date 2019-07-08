import store from '@/store'
import api from '@/api/index.js'
import { router } from '@/router/index'
import iView from 'iview'
import uuidv4 from 'uuid/v4'
import swal from 'sweetalert2'

let util = {}

/**
* @desc 两数组是否相等
* @param {Array} arr 数组一
* @param {Array} targetArr 数组二
* @return {Boolean} res 是否相等，是返回true，否返回false
*/
util.inOf = function (arr, targetArr) {
  let res = true
  arr.map(item => {
    if (targetArr.indexOf(item) < 0) {
      res = false
    }
  })
  return res
}

/**
* @desc 数组是否包含
* @param {Object} ele 对象
* @param {Array} targetArr 数组
* @return {Boolean} 是否包含，是返回true，否返回false
*/
util.oneOf = function (ele, targetArr) {
  if (targetArr.indexOf(ele) >= 0) {
    return true
  } else {
    return false
  }
}

/**
* @desc 是否为空
* @param {Object} obj 对象
* @return {Boolean} 是否为空，是返回true，否返回false
*/
util.isEmpty = function (obj) {
  if (obj === null) return true
  if (typeof obj === 'undefined') {
    return true
  }
  if (typeof obj === 'string') {
    if (obj === '') {
      return true
    }
    var reg = new RegExp('^([ ]+)|([　]+)$')
    return reg.test(obj)
  }
  return false
}

/**
* @desc 复制数组
* @param {Array} arr 数组
* @return {Array} 数组
*/
util.copyArr = function (arr) {
  return arr.map((e) => {
    if (typeof e === 'object') {
      return Object.assign({}, e)
    } else {
      return e
    }
  })
}

/**
* @desc 删除最后的逗号
* @param {String} str 字符串
* @return {String} 字符串
*/
util.removeLastComma = function (str) {
  return str.lastIndexOf(',') === (str.length - 1) ? str.substring(0, str.length - 1) : str
}

/**
* @desc 去除前后空格
* @param {String} str 字符串
* @return {String} 字符串
*/
util.myTrim = function (str) {
  return str.replace(/^\s+|\s+$/gm, '')
}

/**
* @desc 字符串转为整数
* @param {String} str 字符串
* @return {Num} 整数
*/
util.strToInt = function (str) {
  return parseInt(str)
}

/**
* @desc 百分数转小数
* @param {String} str 字符串
* @return {Num} 数字
*/
util.changePercentToPoint = function (str) {
  if (str.toString().indexOf('%') !== -1) {
    str = str.toString().replace('%', '')
    str = str / 100
  }
  return str
}

/**
* @desc 字段数组加数据类型
* @param {Array} fields 字段数组
* @return {Array} 字段数组
*/
util.fieldsAddType = function (fields) {
  for (var field of fields) {
    /* if (field.fieldType === 'numberbox') {
      field.type = field.precision === '0' ? 'int' : 'float'
    } else if (field.fieldType === 'datebox') {
      field.type = 'date'
    } else if (field.fieldType === 'datetimebox') {
      field.type = 'datetime'
    } else { */
    field.type = 'varchar(255)'
    // }
    if (field.fieldType === 'tablebox') {
      field.listDisplay = false
    }
  }
  return fields
}

/**
* @desc 保存数据格式化
* @param {Object} obj 数据
* @param {Array} fields 字段数组
*/
util.getFormValues = function (obj, fields) {
  let data = []
  for (let variable of fields) {
    if (variable.text !== 'msg' && variable.text !== 'uuid' && variable.text !== 'current_task_' && variable.text !== 'end_date_') {
      if (obj[variable.text] !== null && obj[variable.text] !== undefined) {
        data.push({
          text: variable.text,
          value: '\'' + obj[variable.text] + '\''
        })
      } else {
        data.push({
          text: variable.text,
          value: '\'\''
        })
      }
    }
  }
  return data
}

/**
* @desc 新增时保存数据格式化，增加create_time
* @param {Object} obj 数据
*/
util.getFormValuesForAdd = function (obj) {
  let data = []
  for (let variable in obj) {
    if (variable !== 'msg' && variable !== 'uuid') {
      if (variable === 'create_time') { // 信息添加时间
        data.push({
          text: variable,
          value: '\'' + this.getCurrentDate() + '\''
        })
      } else {
        console.log(variable)
        if (obj[variable] !== null && obj[variable] !== undefined) {
          data.push({
            text: variable,
            value: '\'' + obj[variable] + '\''
          })
        } else {
          data.push({
            text: variable,
            value: '\'\''
          })
        }
      }
    }
  }
  return data
}

/**
* @desc 表单验证
* @param {Array} fields 字段数组
* @param {Object} dataObj 数据对象
*/
util.formValidate = function (fields, dataObj) {
  for (const iterator of fields) {
    console.log(iterator)
    console.log(iterator.required === 'true' && this.isEmpty(dataObj[iterator.text]))
    if (iterator.required === 'true' && this.isEmpty(dataObj[iterator.text])) {
      swal('请填写' + iterator.title, '', 'error')
      return false
    }
  }
  return true
}

/**
* @desc 去除不展示字段
* @param {Array} fields 字段数组
* @return {Array} arr 字段数组
*/
util.removeFieldTable = function (fields) {
  let arr = []
  for (let variable of fields) {
    if (!['create_user_id', 'taskid', 'pid', 'msg', 'current_task_', 'end_date_'].includes(variable.text)) {
      arr.push(variable)
    }
  }
  return arr
}

/**
* @desc 绑定字段数据默认值
* @param {Array} fields 字段数组
* @return {Object} obj 数据对象
*/
util.fieldArrToObj = function (fields) {
  let obj = {}
  for (let field of fields) {
    obj[field.text] = field.fieldType === 'numberbox' ? 0 : field.fieldType === 'checkbox' ? [] : ''
    if (['datebox', 'datetimebox', 'monthbox', 'yearbox'].includes(field.fieldType)) {
      if (field.currentDate === 'true') {
        obj[field.text] = this.getCurrentDate()
      }
    }
    if (['switch'].includes(field.fieldType)) {
      obj[field.text] = false
    }
  }
  return obj
}

/**
* @desc 处理表单数据
* @param {Array} fields 字段数组
* @param {Object} dataObj 数据对象
* @return {Object} dataObj 数据对象
*/
util.formatFormData = function (fields, dataObj) {
  delete dataObj.id
  delete dataObj.create_user_id
  delete dataObj.taskid
  delete dataObj._index
  delete dataObj._rowKey
  for (let field of fields) {
    if (field.fieldType === 'checkbox') {
      dataObj[field.text] = this.isEmpty(dataObj[field.text]) ? [] : dataObj[field.text].split(',')
    } else if (field.fieldType === 'numberbox') {
      dataObj[field.text] = Number(dataObj[field.text])
    } else if (field.fieldType === 'switch') {
      if (dataObj[field.text] === 'true') {
        dataObj[field.text] = true
      } else if (dataObj[field.text] === 'false') {
        dataObj[field.text] = false
      }
    }
  }
  return dataObj
}

/**
* @desc 处理附件字段的数据
* @param {Array} fields 字段数组
* @param {Object} dataObj 数据对象
* @return {Object} obj 附件字段数据对象
*/
util.formatFieldFile = function (fields, dataObj) {
  let obj = {}
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].fieldType === 'filebox') {
      let paths = dataObj[fields[i].text]
      obj[fields[i].text] = this.isEmpty(paths) ? [] : paths.split(',')
    }
  }
  return obj
}

/**
* @desc 格式化树数据
* @param {Array} data 数据列表
* @return {Array} data 数据列表
*/
util.formatterTreeData = function (data) {
  for (let variable of data) {
    variable.title = variable.text
    variable.expand = true
    if (variable.children.length > 0) {
      for (let temp of variable.children) {
        temp.title = temp.text
        if (temp.children.length > 0) {
          for (let tmp of temp.children) {
            tmp.title = tmp.text
            if (tmp.children.length > 0) {
              for (let tp of tmp.children) {
                tp.title = tp.text
              }
            }
          }
        }
      }
    }
  }
  return data
}

/**
* @desc 格式化拖拽树数据
* @param {Array} data 数据列表
* @return {Array} data 数据列表
*/
util.formatterDragTreeData = function (data) {
  for (let variable of data) {
    variable.title = variable.text
    variable.expand = true
    if (variable.children.length > 0) {
      for (let temp of variable.children) {
        temp.title = temp.text
        if (temp.children.length > 0) {
          for (let tmp of temp.children) {
            tmp.title = tmp.text
            if (tmp.children.length > 0) {
              for (let tp of tmp.children) {
                tp.title = tp.text
              }
            } else {
              tmp.isLeaf = true
            }
          }
        } else {
          temp.isLeaf = true
        }
      }
    } else {
      variable.isLeaf = true
    }
  }
  return data
}

/**
* @desc 数据转换为级联选择数据格式
*/
util.getAllProduct = function () {
  /* api.post('/grant/grantproducttype/getAllProduct.do', {}, r => {
    store.state.productTreeList = r.data
  }) */
  /* if (typeof (Worker) !== 'undefined') {
    let w = new Worker('/img/getAllProduct.js')
    w.onmessage = function (event) {
      store.state.productTreeList = JSON.parse(event.data)
    }
  } else {
    alert('抱歉，你的浏览器不支持 Web Workers，请升级浏览器。')
  } */
  if (typeof (Worker) !== 'undefined') {
    let w = new Worker('/img/productAddType.js')
    w.onmessage = function (event) {
      store.state.productTreeList = JSON.parse(event.data)
    }
  } else {
    alert('抱歉，你的浏览器不支持 Web Workers，请升级浏览器。')
  }
}

/**
* @desc 数据转换为级联选择数据格式
* @param {Object} data 数据对象
*/
util.formatterForCascader = function (data) {
  for (let iterator of data) {
    iterator.value = iterator.id
    iterator.label = iterator.title
    if (iterator.listProduct.length > 0) {
      for (let ite of iterator.listProduct) {
        ite.value = ite.id
        ite.label = ite.product_name
      }
      iterator.children = iterator.listProduct
    }
  }
  console.log(data)
  let parents = data.filter(value => this.isEmpty(value.parent_id))
  // console.log(parents)
  let children = data.filter(value => !this.isEmpty(value.parent_id))
  let translator = (parents, children) => {
    parents.forEach((parent) => {
      children.forEach((current, index) => {
        if (current.parent_id === parent.id) {
          let temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          translator([current], temp)
          typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
        }
      }
      )
    }
    )
  }
  translator(parents, children)
  console.log(parents)
  return parents
}

/**
* @desc 数据转换为树结构数据格式(新)
* @param {Object} data 数据对象
*/
util.formatterForTree = function (data) {
  let parents = data.filter(value => this.isEmpty(value.parent_id))
  // console.log(parents)
  let children = data.filter(value => !this.isEmpty(value.parent_id))
  let translator = (parents, children) => {
    parents.forEach((parent) => {
      children.forEach((current, index) => {
        if (current.parent_id === parent.id) {
          let temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          translator([current], temp)
          typeof parent.children !== 'undefined' ? parent.children.push(current) : parent.children = [current]
        }
      }
      )
    }
    )
  }
  translator(parents, children)
  // console.log(parents)
  return parents
}

/**
* @desc 数据转换为树结构数据格式
* @param {Object} tableData 数据对象
* @return {Array} arr 树结构数据列表
*/
util.dataConvertForTree = function (tableData, treeField) {
  let datas = tableData.rows
  let arr = []
  for (let i = 0; i < datas.length; i++) {
    datas[i].pid = parseInt(datas[i].pid)
    if (datas[i].pid === 0) {
      datas[i].children = []
      for (let j = 0; j < datas.length; j++) {
        datas[j].children = []
        if (datas[j].pid === datas[i].id) {
          for (let z = 0; z < datas.length; z++) {
            if (datas[z].pid === datas[j].id) {
              datas[j].children.push(datas[z])
            }
          }
          datas[i].children.push(datas[j])
        }
      }
      arr.push(datas[i])
    }
  }
  return arr
}

/**
* @desc 数据转换为树表格结构数据格式
* @param {Object} tableData 数据对象
* @return {Array} arr 树结构数据列表
*/
util.dataConvertForTreeGrid = function (tableData, treeField) {
  let datas = tableData.rows
  let arr = []
  for (let i = 0; i < datas.length; i++) {
    datas[i].pid = parseInt(datas[i].pid)
    if (datas[i].pid === 0) {
      datas[i].children = []
      for (let j = 0; j < datas.length; j++) {
        datas[j].children = []
        for (let z = 0; z < datas.length; z++) {
          if (datas[z].pid === datas[j].id) {
            datas[j].children.push(datas[z])
          }
        }
        if (datas[j].pid === datas[i].id) {
          datas[i].children.push(datas[j])
        }
      }
      arr.push(datas[i])
    }
  }
  return arr
}

/**
* @desc 表头属性修改
* @param {Array} columns 表头
* @return {Array} columns 表头
*/
util.columnsFormatter = function (columns) {
  for (let iterator of columns) {
    iterator.key = iterator.field
    delete iterator.field
  }
  return columns
}

/**
* @desc 获取当前日期
* @return {Date} 当前日期
*/
util.getCurrentDate = function () {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }
  let day = date.getDate()
  if (day < 10) {
    day = '0' + day
  }
  let hour = date.getHours()
  if (hour < 10) {
    hour = '0' + hour
  }
  let minutes = date.getMinutes()
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  let second = date.getSeconds()
  if (second < 10) {
    second = '0' + second
  }
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + second
  // return date.toLocaleString('zh', {hour12: false})
}

/**
* @desc 格式化日期
* @param {Number} 毫秒数
*/
util.formatterDate = function (mil) {
  let date = new Date(mil)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  if (month < 10) {
    month = '0' + month
  }
  let day = date.getDate()
  if (day < 10) {
    day = '0' + day
  }
  let hour = date.getHours()
  if (hour < 10) {
    hour = '0' + hour
  }
  let minutes = date.getMinutes()
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  let second = date.getSeconds()
  if (second < 10) {
    second = '0' + second
  }
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + second
}

/**
* @desc 生成uuid
* @return {String} uuid
*/
util.uuid = function () {
  /* function S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()) */
  return uuidv4()
}

/**
* @desc 字段去除属性禁用
* @param {Array} fields 字段列表
* @return {Array} arr 字段列表
*/
util.fieldsForSelect = function (fields) {
  let arr = fields.concat()
  for (let iterator of arr) {
    delete iterator.disabled
    delete iterator.readonly
  }
  return arr
}

/**
* @desc 浮点数加法运算
*/
util.FloatAdd = function (arg1, arg2) {
  let r1, r2, m
  try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}

/**
* @desc 浮点数减法运算
*/
util.FloatSub = function (arg1, arg2) {
  let r1, r2, m, n
  try { r1 = arg1.toString().split('.')[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split('.')[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2))
  // 动态控制精度长度
  r1 = r2
  n = r1 || r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

/**
* @desc 浮点数乘法运算
*/
util.FloatMul = function (arg1, arg2) {
  let m = 0
  let s1 = arg1.toString()
  let s2 = arg2.toString()
  try { m += s1.split('.')[1].length } catch (e) {}
  try { m += s2.split('.')[1].length } catch (e) {}
  return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}

/**
* @desc 浮点数除法运算
*/
util.FloatDiv = function (arg1, arg2) {
  let t1 = 0
  let t2 = 0
  let r1, r2
  try { t1 = arg1.toString().split('.')[1].length } catch (e) {}
  try { t2 = arg2.toString().split('.')[1].length } catch (e) {}
  r1 = Number(arg1.toString().replace('.', ''))
  r2 = Number(arg2.toString().replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

/**
* @desc string转为Boolean
* @param {String} str 字符串
* @return {Boolean} 布尔值
*/
util.strToBool = function (str) { // string转为Boolean
  if (str === 'true' || str === true) {
    return true
  } else if (str === 'false' || str === false) {
    return false
  } else {
    return false
  }
}

/**
* @desc 新增数据
* @param {String} tableName 表单名
* @param {Object} formObj 表单对象
* @param {String} pid 父ID
*/
util.addFormData = function (tableName, formObj, pid) {
  store.dispatch('setCurrentEditForm', formObj)
  if (formObj.needTree === 'true' && formObj.treeForm !== '') {
    if (pid === '') {
      iView.Message.error('请先选择左侧一条数据')
      return false
    }
  }
  router.push({
    name: 'editFormData',
    params: { tableName: tableName, id: '', pid: pid, method: 'add' }
  })
}

/**
* @desc 修改数据
* @param {String} tableName 表单名
* @param {Object} formObj 表单对象
* @param {Object} params 修改的数据对象
*/
util.editFormData = function (tableName, formObj, params) {
  store.dispatch('setCurrentEditForm', formObj)
  store.dispatch('setCurrentEditFormData', params.row)
  router.push({
    name: 'editFormData',
    params: { tableName: tableName, id: params.row.id, pid: '', method: 'edit' }
  })
}

/**
* @desc 查看数据
* @param {String} tableName 表单名
* @param {Object} formObj 表单对象
* @param {Object} params 修改的数据对象
*/
util.viewFormData = function (tableName, formObj, params) {
  store.dispatch('setCurrentEditForm', formObj)
  store.dispatch('setCurrentEditFormData', params.row)
  router.push({
    name: 'editFormData',
    params: { tableName: tableName, id: params.row.id, pid: '', method: 'view' }
  })
}

/**
* @desc 删除数据
* @param {String} tableName 表单名
* @param {Object} params 修改的数据对象
* @param {Function} changePage 翻页方法
* @param {Int} currentPage 当前页
*/
util.deleteFormData = function (tableName, params, changePage, currentPage, isAct) {
  let flag = true
  if (isAct === 0) {
    flag = false
    if (params.row.current_task_ === null && params.row.end_date_ === null) {
      flag = true
    }
  }
  if (flag) {
    iView.Modal.confirm({
      title: '',
      content: '确认删除此数据？',
      onOk: () => {
        api.post('/crm/ActionFormUtil/delete.do', { tableName: tableName, id: params.row.id }, r => {
          if (r.data === '0') {
            swal('删除数据失败', '', 'error')
          } else {
            iView.Message.success('删除数据成功')
            changePage(currentPage)
          }
        })
      },
      onCancel: () => {
      }
    })
  } else {
    swal('流程已开启，不能删除', '', 'error')
  }
}

/**
* @desc 生成表格表头
* @param {Array} fields 表单字段
* @param {Boolean} flag 是否需要序列表头
* @return {Object} column 表头
*/
util.initColumns = function (fields, flag) {
  let columnsTemp = []
  if (flag) {
    columnsTemp.push({
      type: 'index',
      title: '序列',
      width: 50,
      align: 'center'
    })
  }
  for (let variable of fields) {
    if (variable.listDisplay === 'true' || variable.listDisplay === true) {
      if (variable.fieldType === 'tablebox') {
        columnsTemp.push(this.tableboxColumns(variable))
      } else if (variable.fieldType === 'combobox') {
        columnsTemp.push(this.comboboxColumns(variable))
      } else if (variable.fieldType === 'filebox') {
        columnsTemp.push(this.fileColumns(variable))
      } else if (variable.fieldType === 'passwordbox') {
        columnsTemp.push(this.passColumns(variable))
      } else if (variable.fieldType === 'switch') {
        columnsTemp.push(this.switchColumns(variable))
      } else {
        columnsTemp.push(this.textColumns(variable))
      }
    }
  }
  console.log(columnsTemp)
  return columnsTemp
}

/**
* @desc 生成子表表头
* @param {Object} variable 字段
* @return {Object} column 表头
*/
util.tableboxColumns = function (variable) {
  let column = {
    title: variable.title,
    key: variable.text,
    width: 80,
    align: 'center',
    render: (h, params) => {
      return h('Button', {
        props: {
          type: 'primary',
          size: 'small'
        },
        on: {
          click: () => {
            this.childTableManage(params, variable.tableTitle)
          }
        }
      }, '查看详情')
    }
  }
  return column
}

/**
* @desc 管理子表数据
* @param {Object} params 数据对象
* @param {String} tableTitle 子表表名
*/
util.childTableManage = function (params, tableTitle) {
  router.push({
    name: 'childTableManage',
    params: { tableName: tableTitle, recordID: params.row.uuid }
  })
}

/**
* @desc 生成下拉表头
* @param {Object} variable 字段
* @return {Object} column 表头
*/
util.comboboxColumns = function (variable) {
  let column = {
    title: variable.title,
    key: variable.text,
    render: (h, params) => {
      let fieldText = params.column.key
      let selectId = variable.selectID
      let valueTemp = ''
      if (!this.isEmpty(params.row[fieldText]) && !this.isEmpty(store.state.selectData[selectId])) {
        let valueTemp1 = store.state.selectData[selectId].find((element) => (element.id.toString() === params.row[fieldText]))
        if (!this.isEmpty(valueTemp1)) {
          valueTemp = valueTemp1.text
        }
      }
      return h('div', valueTemp)
    }
  }
  column = this.columnProps(column, variable)
  return column
}

/**
* @desc 生成附件表头
* @param {Object} variable 字段
* @return {Object} column 表头
*/
util.fileColumns = function (variable) {
  let column = {
    title: variable.title,
    key: variable.text,
    render: (h, params) => {
      let temp = params.row[variable.text]
      let files = temp.split(',')
      return h('div', files.map(function (item) {
        if (item !== '') {
          return h('a', {
            attrs: {
              href: item,
              download: item.split('/')[3].substring(36),
              target: '_blank'
            }
          }, item.split('/')[3].substring(36) + ',')
        }
      }))
    }
  }
  column = this.columnProps(column, variable)
  return column
}

/**
* @desc 生成密码表头
* @param {Object} variable 字段
* @return {Object} column 表头
*/
util.passColumns = function (variable) {
  let column = {
    title: variable.title,
    key: variable.text,
    render: (h, params) => {
      let fieldText = params.column.key
      let valueTemp = ''
      if (!this.isEmpty(params.row[fieldText])) {
        valueTemp = '******'
      }
      return h('div', valueTemp)
    }
  }
  column = this.columnProps(column, variable)
  return column
}

/**
* @desc 生成开关表头
* @param {Object} variable 字段
* @return {Object} column 表头
*/
util.switchColumns = function (variable) {
  let column = {
    title: variable.title,
    key: variable.text,
    render: (h, params) => {
      let fieldText = params.column.key
      let valueTemp = ''
      if (params.row[fieldText] === 'true' || params.row[fieldText] === true) {
        valueTemp = '是'
      } else if (params.row[fieldText] === 'false' || params.row[fieldText] === false) {
        valueTemp = '否'
      }
      return h('div', valueTemp)
    }
  }
  column = this.columnProps(column, variable)
  return column
}

/**
* @desc 生成文本表头
* @param {Object} variable 字段
* @return {Object} column 表头
*/
util.textColumns = function (variable) {
  let column = {
    title: variable.title,
    key: variable.text,
    render: (h, params) => {
      let temp = params.row[params.column.key]
      if (temp === 'null') {
        temp = ''
      }
      return h('div', temp)
    }
  }
  column = this.columnProps(column, variable)
  return column
}

/**
* @desc 增加表头属性
* @param {Object} column 表头
* @param {Object} variable 字段
* @return {Object} column 表头
*/
util.columnProps = function (column, variable) {
  if (variable.trWidth !== 0 && variable.trWidth !== '0' && variable.trWidth !== undefined) {
    column.width = variable.trWidth
  }
  if (variable.trAlign !== undefined) {
    column.align = variable.trAlign
  }
  return column
}

/**
* @desc 表头加操作列
* @param {Array} columnsTemp 表头
* @param {String} tableName 表单名
* @param {Object} formObj 表单对象
* @param {Function} changePage 翻页方法
* @param {Int} currentPage 当前页
*/
util.columnsAddAction = function (columnsTemp, tableName, formObj, changePage, currentPage, editFormData, viewFormData, isAct) {
  columnsTemp.push({
    title: '操作',
    key: 'action',
    width: 200,
    align: 'center',
    render: (h, params) => {
      return h('div', [
        h('a', {
          props: {
            href: 'javascript:void()'
          },
          style: {
            marginRight: '15px',
            color: '#101010'
          },
          on: {
            click: () => {
              editFormData(params)
            }
          }
        }, [
          h('img', {
            attrs: {
              src: '/img/edit.png'
            },
            style: {
              marginRight: '8px',
              verticalAlign: 'middle'
            }
          }),
          h('span', '编辑')
        ]),
        h('a', {
          props: {
            href: 'javascript:void()'
          },
          style: {
            marginRight: '15px',
            color: '#101010'
          },
          on: {
            click: () => {
              viewFormData(params)
            }
          }
        }, [
          h('img', {
            attrs: {
              src: '/img/view.png'
            },
            style: {
              marginRight: '8px',
              verticalAlign: 'middle'
            }
          }),
          h('span', '查看')
        ]),
        h('a', {
          props: {
            href: 'javascript:void()'
          },
          style: {
            color: '#101010'
          },
          on: {
            click: () => {
              this.deleteFormData(tableName, params, changePage, currentPage, isAct)
            }
          }
        }, [
          h('img', {
            attrs: {
              src: '/img/del.png'
            },
            style: {
              marginRight: '8px',
              verticalAlign: 'middle'
            }
          }),
          h('span', '删除')
        ])
      ])
    }
  })
  return columnsTemp
}

/**
* @desc 表头加流程列
* @param {Array} columnsTemp 表头数组
* @param {Function} viewProcessDetail 查看流程详情方法
*/
util.columnsAddProcess = function (columnsTemp, viewProcessDetail) {
  columnsTemp.push({
    title: '流程进度',
    key: 'msg',
    width: 80,
    align: 'center',
    render: (h, params) => {
      let temp = params.row.current_task_
      if (params.row.current_task_ === null && params.row.end_date_ === null) {
        temp = '待开启'
      } else if (params.row.current_task_ === null && params.row.end_date_ !== null) {
        temp = '已结束'
      }
      return h('div', temp)
    }
  })
  columnsTemp.push({
    title: '流程详情',
    key: 'process',
    width: 80,
    align: 'center',
    render: (h, params) => {
      return h('Button', {
        props: {
          type: 'success',
          size: 'small'
        },
        on: {
          click: () => {
            viewProcessDetail(params)
          }
        }
      }, '流程详情')
    }
  })
  return columnsTemp
}

/**
* @desc 设置Cookie
* @param {String} name 名字
* @param {String} value 值
*/
util.setCookie = function (name, value) {
  let exp = new Date()
  exp.setTime(exp.getTime() + 30 * 60 * 1000)
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString()
}

/**
* @desc 取Cookie
* @param {String} name 名字
*/
util.getCookie = function (name) {
  let arr
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if (document.cookie.match(reg)) {
    arr = document.cookie.match(reg)
    return unescape(arr[2])
  } else {
    return null
  }
}

/**
* @desc 删除Cookie
* @param {String} name 名字
*/
util.delCookie = function (name) {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = this.getCookie(name)
  if (cval !== null) {
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

/**
* @desc 流程状态格式化
* @param {String} value 状态值
* @return {String} 状态文本
*/
util.flowStateFormat = function (value) {
  let temp = { Ready: '可领取', Completed: '已完成', Forwarded: '已跳转', Created: '已创建', Reserved: '预分配', Withdraw: '退回' }
  return temp[value]
}

/**
* @desc 链接输入参数条件格式化
* @param {String} value 条件值
* @return {String} 条件文本
*/
util.urlInParaTypeFormat = function (value) {
  return this.isEmpty(value) ? '' : store.state.urlInParaCondition.find((element) => (element.value === value)).text
}

/**
* @desc 是否格式化
* @param {String} value 值
* @return {String} 文本
*/
util.trueFalseFormat = function (value) {
  return value || value === 'true' ? '是' : '否'
}

/**
* @desc 引用下拉输入参数值格式化
* @param {String} value 参数值
* @return {String} 参数名
*/
util.urlInParaOptionFormat = function (value) {
  return this.isEmpty(value) ? '' : store.state.urlInParaOption.find((element) => (element.value === value)).text
}

/**
* @desc 初始化表单引用下拉数据
* @param {Array} fields 字段列表
*/
util.initFormQuoteSelectData = function (fields) {
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].fieldType === 'combobox' && fields[i].selectType === '1' && this.isEmpty(store.state.selectData[fields[i].selectID])) {
      let obj = {}
      obj.name = fields[i].selectID
      // 下拉输入字段
      if (!this.isEmpty(fields[i].inParas) && fields[i].inParas.length > 0) {
        for (let j = 0; j < fields[i].inParas.length; j++) {
          if (fields[i].inParas[j].option === 'userId') {
            obj[fields[i].inParas[j].name] = store.state.user.id
          } else if (fields[i].inParas[j].option === 'write') {
            obj[fields[i].inParas[j].name] = fields[i].inParas[j].value
          }
        }
      }
      api.post('/develop/url/getUrl.do', obj, r => {
        store.state.selectData[fields[i].selectID] = r.data
        console.log('链接下拉')
        console.log(store.state.selectData)
      })
    }
  }
}

/**
* @desc 初始化级联字段下拉数据
* @param {Object} field 级联字段
* @param {Array} fields 字段列表
* @param {String} val 字段值
*/
util.changeCascadeSelectData = function (field, fields, val) {
  let toField = fields.find(ele => ele.text === field.cascadeField)
  api.post('/develop/url/getUrl.do', { name: toField.selectID, value: val }, r => {
    store.state.selectData[toField.selectID] = r.data
    console.log('级联下拉')
    console.log(r)
    console.log(store.state.selectData)
  })
}

/**
* @desc 数字字段值计算
* @param {Object} field 数字字段
* @param {Object} formDataObj 数据对象
* @return {Number} 计算值
*/
util.numberCalculate = function (field, formDataObj) {
  let count = 0
  if (field.calculateType === 'multiply' || field.calculateType === 'plus') {
    for (let i = 0; i < field.calculateFields.length; i++) {
      let temp = field.calculateFields[i]
      if (i === 0) {
        count = formDataObj[temp]
      } else {
        if (field.calculateType === 'multiply') {
          count = this.FloatMul(this.changePercentToPoint(count), this.changePercentToPoint(formDataObj[temp]))
        } else if (field.calculateType === 'plus') {
          count = this.FloatAdd(this.changePercentToPoint(count), this.changePercentToPoint(formDataObj[temp]))
        }
      }
    }
  } else if (field.calculateType === 'divide') {
    count = this.FloatDiv(this.changePercentToPoint(formDataObj[field.calculateFirstField]), this.changePercentToPoint(formDataObj[field.calculateLastField]))
  } else if (field.calculateType === 'minus') {
    count = this.FloatSub(this.changePercentToPoint(formDataObj[field.calculateFirstField]), this.changePercentToPoint(formDataObj[field.calculateLastField]))
  }
  return count
}

/**
* @desc 字段值由其他字段拼接组成
* @param {Object} field 字段
* @param {Object} formDataObj 数据对象
* @param {Array} fields 字段组
*/
util.splitByOtherField = function (field, formDataObj, fields) {
  let temp = ''
  // console.log(field.splitFields)
  for (let iterator of field.splitFields) {
    let fieldTemp = fields.find(ele => ele.text === iterator)
    // console.log(fieldTemp)
    // console.log(formDataObj[iterator])
    if (fieldTemp !== undefined && !this.isEmpty(formDataObj[iterator])) {
      if (fieldTemp.fieldType === 'combobox') {
        let selObj = store.state.selectData[fieldTemp.selectID].find(ele => ele.id + '' === formDataObj[iterator])
        if (selObj !== undefined) {
          temp += selObj.text
        }
      } else {
        temp += formDataObj[iterator]
      }
    }
  }
  return temp
}

/**
* @desc 取表单下拉数据
* @param {Array} fields 表单字段
*/
util.getFormSelectData = function (fields) {
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].fieldType === 'combobox') {
      // if (this.isEmpty(store.state.selectData[fields[i].selectID])) {
        if (fields[i].selectType === '0') {
          api.post('/crm/ActionFormUtil/getByTableName.do', { tableName: fields[i].selectID }, rs => {
            store.state.selectData[fields[i].selectID] = rs.data.rows
          })
        } else if (fields[i].selectType === '1') {
          let obj = {}
          obj.name = fields[i].selectID
          // 下拉输入字段
          if (!this.isEmpty(fields[i].inParas) && fields[i].inParas.length > 0) {
            for (let j = 0; j < fields[i].inParas.length; j++) {
              if (fields[i].inParas[j].option === 'userId') {
                obj[fields[i].inParas[j].name] = store.state.user.id
              } else if (fields[i].inParas[j].option === 'write') {
                obj[fields[i].inParas[j].name] = fields[i].inParas[j].value
              }
            }
          }
          api.post('/develop/url/getUrl.do', obj, r => {
            store.state.selectData[fields[i].selectID] = r.data
          })
        } else if (fields[i].selectType === '2') {
          api.post('/crm/ActionFormUtil/getByTableName.do', { tableName: fields[i].selectID }, r => {
            store.state.selectData[fields[i].selectID] = this.dataConvertForTree(r.data, '')
          })
        }
      // }
    }
  }
  console.log(store.state.selectData)
}

/**
* @desc 编辑时取表单下拉数据
* @param {Array} fields 表单字段
*/
util.getFormSelectDataForEdit = function (fields, method, dataObj) {
  let cascadeFields = []
  let cascadeFieldSelectIDs = []
  let fieldAndCascadeField = {}
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].cascade === 'true') {
      cascadeFields.push(fields[i].cascadeField)
      cascadeFieldSelectIDs.push(fields.find(ele => ele.text === fields[i].cascadeField).selectID)
      fieldAndCascadeField[fields[i].text] = { cascadeFieldSelectID: fields.find(ele => ele.text === fields[i].cascadeField).selectID, cascadeFields: fields[i].cascadeField }
    }
  }
  console.log(fieldAndCascadeField)
  for (let i = 0; i < fields.length; i++) {
    if (fields[i].fieldType === 'combobox' && cascadeFields.indexOf(fields[i].text) === -1) {
      // if (this.isEmpty(store.state.selectData[fields[i].selectID])) {
        if (fields[i].selectType === '0') {
          api.post('/crm/ActionFormUtil/getByTableName.do', { tableName: fields[i].selectID }, rs => {
            store.state.selectData[fields[i].selectID] = rs.data.rows
          })
        } else if (fields[i].selectType === '1') {
          let obj = {}
          obj.name = fields[i].selectID
          // 下拉输入字段
          if (!this.isEmpty(fields[i].inParas) && fields[i].inParas.length > 0) {
            for (let j = 0; j < fields[i].inParas.length; j++) {
              if (fields[i].inParas[j].option === 'userId') {
                obj[fields[i].inParas[j].name] = store.state.user.id
              } else if (fields[i].inParas[j].option === 'write') {
                obj[fields[i].inParas[j].name] = fields[i].inParas[j].value
              }
            }
          }
          api.post('/develop/url/getUrl.do', obj, r => {
            store.state.selectData[fields[i].selectID] = r.data
          })
        } else if (fields[i].selectType === '2') {
          api.post('/crm/ActionFormUtil/getByTableName.do', { tableName: fields[i].selectID }, r => {
            store.state.selectData[fields[i].selectID] = this.dataConvertForTree(r.data, '')
          })
        }
      // }
    }
    /* if (fields[i].fieldType === 'combobox' && fields[i].cascade === 'true' && method === 'edit') {
      console.log(11111111)
      console.log(dataObj[fields[i].text])
      api.post('/develop/url/getUrl.do', {name: fieldAndCascadeField[fields[i].text].cascadeFieldSelectID, value: dataObj[fields[i].text]}, r => {
        console.log(r)
        let da = {id: fieldAndCascadeField[fields[i].text].cascadeFieldSelectID, data: r.data}
        console.log(fieldAndCascadeField[fields[i].text].cascadeFieldSelectID)
        store.state.selectData[fieldAndCascadeField[fields[i].text].cascadeFieldSelectID] = []
        store.state.selectData[fieldAndCascadeField[fields[i].text].cascadeFieldSelectID] = r.data
        store.dispatch('setOneSelectData', da)
        console.log(store.state.selectData[fieldAndCascadeField[fields[i].text].cascadeFieldSelectID])
      })
    } */
  }
  // 被级联的下拉清空数据
  if (method === 'add') {
    for (let i = 0; i < cascadeFieldSelectIDs.length; i++) {
      store.state.selectData[cascadeFieldSelectIDs[i]] = []
    }
  }
  console.log(store.state.selectData)
}

/**
* @desc 初始化图表配置
* @param {Object} chartObj 图表配置对象
* @param {Array} xField 维度字段列表
* @param {Array} yField 数值字段列表
* @param {String} yFieldType 数值字段图表类型
* @param {Array} secondaryYField 次轴字段列表
* @param {String} secondaryYFieldType 次轴字段图表类型
* @param {Array} colorTheme 配色
* @param {Array} radarMax 雷达图最大值
* @param {Array} xData 维度数据
* @param {Array} yData 数值数据
* @param {Array} sYData 次轴数据
* @return {Object} obj 图表配置对象
*/
util.initChartOption = function (chartObj, xField, yField, yFieldType, scatterYField, secondaryYField, secondaryYFieldType, colorTheme, radarMax, xData, yData, sYData) {
  let obj = {}
  let xName = ''
  let yName = ''
  let type = chartObj.type
  let waterfallData = Array.of(0)
  if (['stack-bar', 'waterfall', 'transverse-bar', 'stack-transverse-bar'].indexOf(type) !== -1) {
    type = 'bar'
  }
  if (['area-line', 'stack-area-line'].indexOf(type) !== -1) {
    type = 'line'
  }
  if (['line-and-bar'].indexOf(type) !== -1) {
    type = yFieldType === 'stack-bar' ? 'bar' : yFieldType
  }
  xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  yData = [[820, 932, 901, 934, 1290, 1330, 1320], [420, 952, 501, 634, 1090, 1630, 1520]]
  sYData = [[420, 932, 901, 534, 1290, 1330, 1120], [420, 452, 601, 634, 690, 1230, 1120]]
  let scatterData = [
    [
      [10.0, 8.04],
      [8.0, 6.95],
      [13.0, 7.58],
      [9.0, 8.81],
      [11.0, 8.33],
      [14.0, 9.96],
      [6.0, 7.24],
      [4.0, 4.26],
      [12.0, 10.84],
      [7.0, 4.82],
      [5.0, 5.68]
    ],
    [
      [18.0, 9.96],
      [2.0, 7.28],
      [8.0, 8.22],
      [12.0, 10.88],
      [7.0, 8.82],
      [5.0, 5.28],
      [10.0, 8.08],
      [8.0, 2.95],
      [13.0, 7.58],
      [9.0, 8.81],
      [11.0, 8.33]
    ]
  ]
  if (chartObj.x.title !== '' && chartObj.x.title !== undefined) {
    xName = chartObj.x.title
  }
  if (chartObj.x.unit !== '' && chartObj.x.unit !== undefined) {
    xName += '(' + chartObj.x.unit + ')'
  }
  if (chartObj.y.title !== '' && chartObj.y.title !== undefined) {
    yName = chartObj.y.title
  }
  if (chartObj.y.unit !== '' && chartObj.y.unit !== undefined) {
    yName += '(' + chartObj.y.unit + ')'
  }
  /* 折线图,柱状图,堆叠柱状图,瀑布图,条形图,堆叠条形图,面积图,堆叠面积图,散点图 */
  if (['line', 'bar', 'stack-bar', 'waterfall', 'transverse-bar', 'stack-transverse-bar', 'area-line', 'stack-area-line', 'scatter', 'line-and-bar'].indexOf(chartObj.type) !== -1) {
    obj = {
      tooltip: {
        trigger: 'axis'
      },
      toolbox: {
        feature: {
          restore: { show: true },
          saveAsImage: { show: true }
        },
        right: 25
      },
      backgroundColor: chartObj.hasBackgroundColor === 'true' ? chartObj.backgroundColor : 'transparent',
      xAxis: [
        {
          name: xName,
          nameLocation: chartObj.x.location,
          nameGap: 20,
          nameTextStyle: {
            fontSize: chartObj.x.nameFontSize,
            color: chartObj.x.nameColor
          },
          axisLine: {
            show: chartObj.x.show,
            lineStyle: {
              width: chartObj.x.lineWidth,
              color: chartObj.x.lineColor,
              type: chartObj.x.lineType
            }
          },
          axisLabel: {
            show: chartObj.x.showLabels,
            interval: chartObj.x.showAll ? '0' : 'auto',
            rotate: chartObj.x.rotation,
            fontSize: chartObj.x.labelFontSize,
            color: chartObj.x.labelColor
          },
          splitLine: {
            show: chartObj.x.showSplitLine,
            lineStyle: {
              width: chartObj.x.splitLineWidth,
              color: chartObj.x.splitLineColor,
              type: chartObj.x.splitLineType
            }
          },
          type: 'category',
          data: xData
        }
      ],
      yAxis: [
        {
          nameTextStyle: {
            fontSize: chartObj.y.nameFontSize,
            color: chartObj.y.nameColor
          },
          axisLine: {
            show: chartObj.y.show,
            lineStyle: {
              width: chartObj.y.lineWidth,
              color: chartObj.y.lineColor,
              type: chartObj.y.lineType
            }
          },
          axisLabel: {
            show: chartObj.y.showLabels,
            fontSize: chartObj.y.labelFontSize,
            color: chartObj.y.labelColor
          },
          splitLine: {
            show: chartObj.y.showSplitLine,
            lineStyle: {
              width: chartObj.y.splitLineWidth,
              color: chartObj.y.splitLineColor,
              type: chartObj.y.splitLineType
            }
          },
          type: 'value'
        }
      ],
      series: []
    }
    /* 条形图,堆叠条形图 */
    if (['transverse-bar', 'stack-transverse-bar'].indexOf(chartObj.type) !== -1) {
      obj.xAxis[0].type = 'value'
      delete obj.xAxis[0].data
      obj.yAxis[0].type = 'category'
      obj.yAxis[0].data = xData
    }
    let legend = []
    for (let i = 0; i < yField.length; i++) {
      let name = (yField[i].alias !== '' && yField[i].alias !== undefined) ? yField[i].alias : yField[i].title
      obj.series.push({
        name: name,
        type: type,
        label: {
          show: chartObj.showDatalabels,
          fontSize: chartObj.datalabelFontSize
        },
        data: yData[i]
      })
      /* 颜色 */
      if (['line', 'area-line', 'stack-area-line'].indexOf(chartObj.type) !== -1 || ['line'].indexOf(yFieldType) !== -1) {
        obj.series[i].lineStyle = { normal: { color: yField[i].color } }
        obj.series[i].itemStyle = { normal: { color: yField[i].color } }
        /* 是否阶梯显示 */
        obj.series[i].step = chartObj.lineStep === 'false' ? false : chartObj.lineStep
        /* 是否平滑曲线显示 */
        obj.series[i].smooth = chartObj.lineStyle === 'curve' ? 'true' : false
      }
      if (['bar', 'stack-bar', 'waterfall', 'transverse-bar', 'stack-transverse-bar', 'scatter'].indexOf(chartObj.type) !== -1 || ['bar', 'stack-bar'].indexOf(yFieldType) !== -1) {
        obj.series[i].itemStyle = { normal: { color: yField[i].color } }
      }
      /* 堆叠 */
      if (['stack-bar', 'waterfall', 'stack-transverse-bar', 'stack-area-line'].indexOf(chartObj.type) !== -1 || ['stack-bar'].indexOf(yFieldType) !== -1) {
        obj.series[i].stack = 'stack'
      }
      /* 面积 */
      if (['area-line', 'stack-area-line'].indexOf(chartObj.type) !== -1) {
        obj.series[i].areaStyle = {}
      }
      /* 散点图 */
      if (['scatter'].indexOf(chartObj.type) !== -1) {
        delete obj.xAxis[0].data
        obj.series[i].data = scatterData[i]
        obj.series[i].symbolSize = chartObj.symbolSize
      }
      legend.push(name)
    }
    /* 双轴图 */
    if (['line-and-bar'].indexOf(chartObj.type) !== -1) {
      let sYName = ''
      if (chartObj.rightY.showTitle) {
        sYName = (chartObj.rightY.title !== '' && chartObj.rightY.title !== undefined) ? chartObj.rightY.title : ''
        sYName += (chartObj.rightY.unit !== '' && chartObj.rightY.unit !== undefined) ? '(' + chartObj.rightY.unit + ')' : ''
      }
      obj.yAxis.push({
        name: sYName,
        nameTextStyle: {
          fontSize: chartObj.rightY.nameFontSize,
          color: chartObj.rightY.nameColor
        },
        axisLine: {
          show: chartObj.rightY.show,
          lineStyle: {
            width: chartObj.rightY.lineWidth,
            color: chartObj.rightY.lineColor,
            type: chartObj.rightY.lineType
          }
        },
        axisLabel: {
          show: chartObj.rightY.showLabels,
          fontSize: chartObj.rightY.labelFontSize,
          color: chartObj.rightY.labelColor
        },
        type: 'value'
      })
      for (let i = 0; i < secondaryYField.length; i++) {
        obj.series.push({
          name: (secondaryYField[i].alias !== '' && secondaryYField[i].alias !== undefined) ? secondaryYField[i].alias : secondaryYField[i].title,
          type: secondaryYFieldType === 'stack-bar' ? 'bar' : secondaryYFieldType,
          label: {
            show: chartObj.showDatalabels,
            fontSize: chartObj.datalabelFontSize
          },
          itemStyle: { normal: { color: secondaryYField[i].color } },
          yAxisIndex: 1,
          data: sYData[i]
        })
        if (secondaryYFieldType === 'line') {
          /* 颜色 */
          obj.series[obj.series.length - 1].lineStyle = { normal: { color: secondaryYField[i].color } }
          /* 是否阶梯显示 */
          obj.series[obj.series.length - 1].step = chartObj.lineStep === 'false' ? false : chartObj.lineStep
          /* 是否平滑曲线显示 */
          obj.series[obj.series.length - 1].smooth = chartObj.lineStyle === 'curve' ? 'true' : false
        }
        /* 堆叠 */
        if (secondaryYFieldType === 'stack-bar') {
          obj.series[obj.series.length - 1].stack = 'stack'
        }
      }
    }
    /* 瀑布图 */
    if (['waterfall'].indexOf(chartObj.type) !== -1) {
      if (xField.length === 1 && yField.length === 1) {
        for (let i = 1; i < yData[0].length; i++) {
          waterfallData[i] = waterfallData[i - 1] + yData[0][i - 1]
        }
        obj.tooltip = {
          trigger: 'axis',
          formatter: function (params) {
            let temp = params[0].name + '<br/>'
            for (let i = 1; i < params.length; i++) {
              temp += params[i].seriesName + ' : ' + params[i].value + '<br/>'
            }
            return temp
          }
        }
        obj.series.unshift({
          name: '总量',
          type: type,
          stack: 'stack',
          itemStyle: {
            normal: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            },
            emphasis: {
              barBorderColor: 'rgba(0,0,0,0)',
              color: 'rgba(0,0,0,0)'
            }
          },
          data: waterfallData
        })
      }
    }
    obj.xAxis[0].name = chartObj.x.showTitle ? xName : ''
    obj.yAxis[0].name = chartObj.y.showTitle ? yName : ''
    if (yField.length > 1) {
      obj.legend = { data: legend }
    }
  }
  /* 饼图,漏斗图 */
  if (['pie', 'funnel'].indexOf(chartObj.type) !== -1) {
    let pieData = []
    let legend = []
    if (xField.length === 1 && yField.length === 1) {
      for (let i = 0; i < xData.length; i++) {
        pieData.push({
          name: xData[i],
          value: yData[0][i]
        })
        legend.push(xData[i])
      }
    }
    if (xField.length === 0 && yField.length > 1) {
      for (let i = 0; i < yField.length; i++) {
        let name = (yField[i].alias !== '' && yField[i].alias !== undefined) ? yField[i].alias : yField[i].title
        pieData.push({
          name: name,
          value: yData[i]
        })
        legend.push(name)
      }
    }
    obj = {
      tooltip: {
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        data: legend
      },
      color: colorTheme.colors,
      backgroundColor: chartObj.hasBackgroundColor === 'true' ? chartObj.backgroundColor : 'transparent',
      series: [
        {
          name: yName,
          type: chartObj.type,
          label: {
            show: chartObj.showDatalabels,
            fontSize: chartObj.datalabelFontSize
          },
          funnelAlign: chartObj.funnelAlign,
          data: pieData
        }
      ]
    }
    if (['pie'].indexOf(chartObj.type) !== -1) {
      obj.series[0].radius = chartObj.pieStyle === 'pieShape' ? [0, '75%'] : ['50%', '75%']
      obj.series[0].roseType = chartObj.pieRose === 'false' ? false : chartObj.pieRose
      if (chartObj.legend.position === 'null') {
        delete obj.legend
      } else {
        obj.legend[chartObj.legend.position] = 5
        obj.legend.orient = ['left', 'right'].indexOf(chartObj.legend.position) !== -1 ? 'vertical' : 'horizontal'
      }
    }
  }
  /* 仪表盘 */
  if (chartObj.type === 'gauge') {
    let name = ''
    if (chartObj.gauge.title !== '' && chartObj.gauge.title !== undefined) {
      name = chartObj.gauge.title
    } else {
      name = (yField[0].alias !== '' && yField[0].alias !== undefined) ? yField[0].alias : yField[0].title
    }
    let formatter = ''
    let rateDigit = 0
    let temp = 0.0
    let max = 1
    if (chartObj.gauge.rateDigit !== '' && chartObj.gauge.rateDigit !== undefined) {
      rateDigit = chartObj.gauge.rateDigit
    }
    if (chartObj.gauge.max !== '' && chartObj.gauge.max !== undefined && chartObj.gauge.max >= 820) {
      temp = (this.FloatDiv(820, chartObj.gauge.max) * 100).toFixed(rateDigit)
      formatter = '{b} : {c}(' + temp + '%)'
      max = chartObj.gauge.max
    } else {
      formatter = '{b} : {c}'
      max = 820
    }
    obj = {
      tooltip: {
        formatter: formatter
      },
      backgroundColor: chartObj.hasBackgroundColor === 'true' ? chartObj.backgroundColor : 'transparent',
      axisLabel: {
        formatter: (chartObj.gauge.unit !== '' && chartObj.gauge.unit !== undefined) ? '{value}' + chartObj.gauge.unit : '{value}'
      },
      series: [
        {
          type: chartObj.type,
          max: max,
          axisLine: {
            lineStyle: {}
          },
          data: [{ name: name, value: 820 }]
        }
      ]
    }
    if (chartObj.gauge.title !== '' && chartObj.gauge.title !== undefined) {
      obj.series[0].name = chartObj.gauge.title
    }
    if (chartObj.gauge.max !== '' && chartObj.gauge.max !== undefined) {
      obj.series[0].max = chartObj.gauge.max
    }
    let colors = []
    for (let i = 0; i < chartObj.gauge.conditions.length; i++) {
      colors.push([parseFloat(chartObj.gauge.conditions[i].max), chartObj.gauge.conditions[i].color])
    }
    obj.series[0].axisLine.lineStyle.color = colors
  }
  /* 雷达图 */
  if (chartObj.type === 'radar') {
    let legend = []
    let radarData = []
    let indicator = []
    for (let i = 0; i < yField.length; i++) {
      let name = (yField[i].alias !== '' && yField[i].alias !== undefined) ? yField[i].alias : yField[i].title
      legend.push(name)
      radarData.push({ name: name, value: yData[i], lineStyle: { normal: { color: yField[i].color } }, itemStyle: { normal: { color: yField[i].color } } })
    }
    for (let j = 0; j < xData.length; j++) {
      indicator[j] = { name: xData[j], max: radarMax[j] }
    }
    obj = {
      tooltip: {},
      backgroundColor: chartObj.hasBackgroundColor === 'true' ? chartObj.backgroundColor : 'transparent',
      legend: {
        data: legend
      },
      radar: {
        name: {
          show: chartObj.x.showLabels
        },
        axisLine: {
          show: chartObj.x.show
        },
        indicator: indicator
      },
      series: [
        {
          name: yName,
          type: chartObj.type,
          label: {
            show: chartObj.showDatalabels,
            fontSize: chartObj.datalabelFontSize
          },
          data: radarData
        }
      ]
    }
    if (chartObj.radarStyle === 'area') {
      obj.series[0].areaStyle = {}
    }
  }
  console.log(obj)
  return obj
}

export default util
