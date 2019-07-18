import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const state = {
  user: {}, // 用户
  menuList: [], // 左侧菜单列表
  cachePage: [], // 缓存页面
  leftMenuTheme: 'dark', // 左侧菜单主题
  openedSubmenu: '', // 左侧菜单打开项
  pageOpenedList: [{ // 打开页面列表
    text: '首页',
    path: '/home',
    name: 'home',
    url: '/home'
  }],
  currentPageName: '首页', // 当前页面名
  currentPath: [ // 当前页面路径
    {
      text: '首页',
      path: '/home',
      name: 'home',
      url: '/home'
    }
  ],
  dontCache: [], // 在这里定义你不想要缓存的页面的name属性值
  contextMenuList: [ // 标签右键菜单
    {
      name: 'close',
      title: '关闭当前'
    },
    {
      name: 'closeOther',
      title: '关闭其他'
    },
    {
      name: 'closeAll',
      title: '关闭所有'
    }
  ],
  contextMenuOpenedTag: '', // 打开右键菜单的标签
  controlArray: [ // 字段类型列表
    {
      title: '文本输入框',
      fieldType: 'textbox',
      width: '278',
      disabled: 'false',
      readonly: 'false',
      required: 'false',
      listDisplay: 'true',
      trWidth: '0'
    },
    {
      title: '多行文本输入框',
      fieldType: 'textboxMultiline',
      height: '64',
      width: '703',
      disabled: 'false',
      readonly: 'false',
      required: 'false',
      listDisplay: 'true',
      trWidth: '0'
    },
    {
      title: '数字输入框',
      fieldType: 'numberbox',
      width: '278',
      disabled: 'false',
      readonly: 'false',
      required: 'false',
      listDisplay: 'true',
      trWidth: '0'
    },
    {
      title: '下拉选择器',
      fieldType: 'combobox',
      width: '278',
      disabled: 'false',
      readonly: 'false',
      required: 'false',
      listDisplay: 'true',
      trWidth: '0'
    },
    {
      title: '单选框',
      fieldType: 'radio',
      radios: ['单选框'],
      width: '278',
      disabled: 'false',
      readonly: 'false',
      required: 'false',
      listDisplay: 'true',
      trWidth: '0'
    },
    {
      title: '多选框',
      fieldType: 'checkbox',
      checkboxs: ['多选框'],
      width: '278',
      disabled: 'false',
      readonly: 'false',
      required: 'false',
      listDisplay: 'true',
      trWidth: '0'
    },
    {
      title: '开关选择器',
      fieldType: 'switch',
      width: '278',
      disabled: 'false',
      readonly: 'false',
      required: 'false',
      listDisplay: 'true',
      trWidth: '0'
    },
    {
      title: '日期选择器',
      fieldType: 'datebox',
      width: '278',
      disabled: 'false',
      readonly: 'false',
      required: 'false',
      listDisplay: 'true',
      trWidth: '0'
    },
    {
      title: '日期时间选择器',
      fieldType: 'datetimebox',
      width: '278',
      disabled: 'false',
      readonly: 'false',
      required: 'false',
      listDisplay: 'true',
      trWidth: '0'
    },
    {
      title: '月份选择器',
      fieldType: 'monthbox',
      width: '278',
      disabled: 'false',
      readonly: 'false',
      required: 'false',
      listDisplay: 'true',
      trWidth: '0'
    },
    {
      title: '年份选择器',
      fieldType: 'yearbox',
      width: '278',
      disabled: 'false',
      readonly: 'false',
      required: 'false',
      listDisplay: 'true',
      trWidth: '0'
    },
    {
      title: '子表',
      fieldType: 'tablebox'
    },
    {
      title: '附件上传',
      fieldType: 'filebox',
      width: '278',
      disabled: 'false',
      readonly: 'false',
      required: 'false',
      listDisplay: 'true',
      trWidth: '0'
    },
    {
      title: '密码输入框',
      fieldType: 'passwordbox',
      width: '278',
      disabled: 'false',
      readonly: 'false',
      required: 'false',
      listDisplay: 'false',
      trWidth: '0'
    }
  ],
  currentEditForm: {}, // 当前修改表单
  currentEditFormData: {}, // 当前修改数据
  currentEditChildForm: {}, // 当前修改子表表单
  currentEditChildFormData: {}, // 当前修改子表数据
  selectData: {}, // 下拉数据
  normalSelect: [], // 普通下拉
  quoteSelect: [], // 引用下拉
  treeSelect: [], // 树形下拉
  columnAlign: [ // 表头对齐方式
    {
      text: '左对齐',
      value: 'left'
    },
    {
      text: '居中',
      value: 'center'
    },
    {
      text: '右对齐',
      value: 'right'
    }
  ],
  searchManner: [ // 搜索方式
    {
      text: '并且',
      value: 'and'
    },
    {
      text: '或者',
      value: 'or'
    }
  ],
  searchInputType: [ // 搜索输入框类型
    {
      type: 'textbox',
      text: '文本框'
    },
    {
      type: 'combobox',
      text: '下拉框'
    },
    {
      type: 'datebox',
      text: '日期框'
    },
    {
      type: 'yearbox',
      text: '年份框'
    },
    {
      type: 'monthbox',
      text: '月份框'
    }
  ],
  searchCondition: [ // 搜索条件
    {
      text: '包含',
      value: 'like'
    },
    {
      text: '不包含',
      value: 'not like'
    },
    {
      text: '等于',
      value: '='
    },
    {
      text: '不等于',
      value: '<>'
    },
    {
      text: '大于',
      value: '>'
    },
    {
      text: '大于等于',
      value: '>='
    },
    {
      text: '小于',
      value: '<'
    },
    {
      text: '小于等于',
      value: '<='
    },
    {
      text: '是否为空',
      value: 'isEmpty'
    }
  ],
  positionList: [], // 用户职位列表
  userStatusList: [], // 用户状态列表
  urlInParaCondition: [ // 链接输入参数条件列表
    {
      text: '包含',
      value: 'like'
    },
    {
      text: '等于',
      value: '='
    },
    {
      text: '大于',
      value: '>'
    },
    {
      text: '小于',
      value: '<'
    },
    {
      text: '日期大于等于',
      value: 'date>='
    },
    {
      text: '日期小于等于',
      value: 'date<='
    }
  ],
  urlInParaOption: [ // 引用下拉输入参数类型列表
    {
      text: '用户ID',
      value: 'userId'
    },
    {
      text: '手填',
      value: 'write'
    }
  ],
  autoFillType: [ // 新增时自动填写类型
    {
      text: '用户名',
      value: 'userName'
    },
    {
      text: '用户部门',
      value: 'department'
    },
    {
      text: '接口类',
      value: 'interface'
    },
    {
      text: '固定值',
      value: 'value'
    }
  ],
  chartFieldCalculateType: [ // 图表字段计算方式
    {
      text: '求和',
      value: 'sum'
    },
    {
      text: '平均值',
      value: 'average'
    },
    {
      text: '计数',
      value: 'count'
    },
    {
      text: '去重计数',
      value: 'distinct-count'
    },
    {
      text: '最大值',
      value: 'max'
    },
    {
      text: '最小值',
      value: 'min'
    }
  ],
  chartType: [ // 图表类型
    {
      type: 'line',
      title: '折线图',
      icon: 'chart-icon-line',
      tips: ['1个或2个维度', '1个或多个数值']
    },
    {
      type: 'bar',
      title: '柱状图',
      icon: 'chart-icon-bar',
      tips: ['2个以内维度', '1个或多个数值']
    },
    {
      type: 'pie',
      title: '饼图',
      icon: 'chart-icon-pie',
      tips: ['1个维度 1个数值', '0个维度 多个数值']
    },
    {
      type: 'gauge',
      title: '仪表盘',
      icon: 'chart-icon-gauge',
      tips: ['0个维度', '1个数值']
    },
    {
      type: 'stack-bar',
      title: '堆叠柱状图',
      icon: 'chart-icon-stack-bar',
      tips: ['1个或2个维度', '2个或多个数值']
    },
    {
      type: 'waterfall',
      title: '瀑布图',
      icon: 'chart-icon-waterfall',
      tips: ['1个或2个维度 1个数值', '0个维度多个数值']
    },
    {
      type: 'transverse-bar',
      title: '条形图',
      icon: 'chart-icon-transverse-bar',
      tips: ['2个以内维度', '1个或多个数值']
    },
    {
      type: 'stack-transverse-bar',
      title: '堆叠条形图',
      icon: 'chart-icon-stack-transverse-bar',
      tips: ['1个或2个维度', '2个或多个数值']
    },
    {
      type: 'area-line',
      title: '面积图',
      icon: 'chart-icon-area-line',
      tips: ['0个或1个维度', '1个或多个数值']
    },
    {
      type: 'stack-area-line',
      title: '堆叠面积图',
      icon: 'chart-icon-stack-area-line',
      tips: ['1个维度', '2个或多个数值']
    },
    {
      type: 'scatter',
      title: '散点图',
      icon: 'chart-icon-scatter',
      tips: ['0个或多个维度', '2个数值']
    },
    {
      type: 'sunburst',
      title: '旭日图',
      icon: 'chart-icon-sunburst',
      tips: ['2个或多个维度', '1个数值']
    },
    {
      type: 'treemap',
      title: '矩形树图',
      icon: 'chart-icon-treemap',
      tips: ['1个或多个维度', '0个或1个数值']
    },
    {
      type: 'funnel',
      title: '漏斗图',
      icon: 'chart-icon-funnel',
      tips: ['1个维度 1个数值', '0个维度 多个数值']
    },
    {
      type: 'line-and-bar',
      title: '双轴图',
      icon: 'chart-icon-line-and-bar',
      tips: ['1个维度 1个数值', '0个维度 多个数值']
    },
    {
      type: 'sankey',
      title: '桑基图',
      icon: 'chart-icon-sankey',
      tips: ['2个~20个维度', '1个数值']
    },
    {
      type: 'radar',
      title: '雷达图',
      icon: 'chart-icon-radar',
      tips: ['1个维度', '多个数值']
    }
  ],
  chartCondition: [ // 图表搜索条件
    {
      text: '包含',
      value: 'like'
    },
    {
      text: '不包含',
      value: 'not like'
    },
    {
      text: '等于',
      value: '='
    },
    {
      text: '不等于',
      value: '<>'
    },
    {
      text: '大于',
      value: '>'
    },
    {
      text: '大于等于',
      value: '>='
    },
    {
      text: '小于',
      value: '<'
    },
    {
      text: '小于等于',
      value: '<='
    },
    {
      text: '为空',
      value: 'isEmpty'
    },
    {
      text: '不为空',
      value: 'notEmpty'
    }
  ],
  chartDateCondition: [ // 图表日期筛选项
    {
      name: '今天',
      type: 'fixed',
      disabled: true,
      fixed: {
        start: '1',
        granularity: 'day',
        end: '1'
      },
      accurate: {}
    },
    {
      name: '昨天',
      type: 'fixed',
      disabled: true,
      fixed: {
        start: '1',
        granularity: 'day',
        end: '1'
      },
      accurate: {}
    },
    {
      name: '最近7天',
      type: 'fixed',
      disabled: true,
      fixed: {
        start: '7',
        granularity: 'day',
        end: '1'
      }
    },
    {
      name: '最近30天',
      type: 'fixed',
      disabled: true,
      fixed: {
        start: '30',
        granularity: 'day',
        end: '1'
      },
      accurate: {}
    },
    {
      name: '最近90天',
      type: 'fixed',
      disabled: true,
      fixed: {
        start: '90',
        granularity: 'day',
        end: '1'
      },
      accurate: {}
    },
    {
      name: '最近365天',
      type: 'fixed',
      disabled: true,
      fixed: {
        start: '365',
        granularity: 'day',
        end: '1'
      },
      accurate: {}
    }
  ],
  chartColorTheme: [ // 图表配色
    {
      name: '默认12',
      colors: ['rgb(81, 130, 228)', 'rgb(155, 204, 102)', 'rgb(63, 178, 126)', 'rgb(247, 203, 74)', 'rgb(248, 141, 72)', 'rgb(243, 83, 82)', 'rgb(206, 98, 214)',
        'rgb(137, 84, 212)', 'rgb(81, 86, 184)', 'rgb(81, 180, 241)', 'rgb(105, 212, 219)', 'rgb(212, 45, 107)']
    },
    {
      name: '灰色5',
      colors: ['rgb(90, 106, 123)', 'rgb(159, 178, 190)', 'rgb(92, 107, 134)', 'rgb(137, 142, 148)', 'rgb(203, 211, 218)']
    }
  ],
  gaugeConditions: [ // 图表配色
    {
      min: '0',
      max: '0.2',
      color: 'rgb(145, 199, 174)'
    },
    {
      min: '0.2',
      max: '0.8',
      color: 'rgb(99, 134, 158)'
    },
    {
      min: '0.8',
      max: '1',
      color: 'rgb(194, 53, 49)'
    }
  ],
  gaugeConditionsColors: [ // 仪表盘配置颜色
    'rgb(81, 130, 228)', 'rgb(155, 204, 102)', 'rgb(63, 178, 126)', 'rgb(247, 203, 74)', 'rgb(248, 141, 72)', 'rgb(243, 83, 82)', 'rgb(206, 98, 214)',
    'rgb(137, 84, 212)', 'rgb(81, 86, 184)', 'rgb(81, 180, 241)', 'rgb(105, 212, 219)', 'rgb(212, 45, 107)'
  ],
  fontSize: ['10', '11', '12', '13', '14', '15', '16', '18', '20', '24', '28', '32', '36', '48', '64'], // 字体大小
  lineWidth: ['1', '2', '3', '4', '5', '6', '7', '8', '9'], // 图表线条宽度
  lineType: [{ text: '实线', value: 'solid' }, { text: '虚线', value: 'dashed' }, { text: '点状', value: 'dotted' }], // 图表线条类型
  formListUrl: [ // 表单数据列表地址
    {
      text: '普通',
      value: 'formDataManage'
    },
    {
      text: '自定义数据来源',
      value: 'formDataManageForUrl'
    }
  ],
  headerHeight: 100, // 头部高度
  uploadIp: 'http://king-break.imwork.net:9007/device', // 上传ip地址
  commonItems: [ // 基本
    {
      name: '文本',
      type: 'text',
      text: '文本',
      fontSize: '12',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      color: 'rgba(0,0,0,1)',
      backColor: 'rgba(255,255,255,0)',
      textAlign: 'left',
      lineHeight: 'normal',
      icon: 'iconxingzhuang-wenzi',
      width: 200,
      height: 60
    },
    {
      name: '时间',
      type: 'datetime',
      fontSize: '12',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      color: 'rgba(0,0,0,1)',
      backColor: 'rgba(255,255,255,0)',
      textAlign: 'left',
      lineHeight: 'normal',
      icon: 'iconriqi',
      width: 200,
      height: 60
    },
    {
      name: '天气(标准版)',
      type: 'weather',
      class: 1,
      backColor: 'rgba(255,255,255,0)',
      textAlign: 'left',
      icon: 'icontianqi',
      width: 200,
      height: 60
    },
    {
      name: '天气(迷你版)',
      type: 'weather',
      class: 2,
      backColor: 'rgba(255,255,255,0)',
      textAlign: 'left',
      icon: 'icontubiaozhizuomoban',
      width: 300,
      height: 20
    },
    {
      name: '天气(温湿度)',
      type: 'weather',
      class: 3,
      backColor: 'rgba(255,255,255,0)',
      textAlign: 'left',
      icon: 'iconicon-temperature',
      width: 320,
      height: 120
    },
    {
      name: '天气(5天版)',
      type: 'weather',
      class: 4,
      backColor: 'rgba(255,255,255,0)',
      textAlign: 'left',
      icon: 'icontianqi-',
      width: 640,
      height: 60
    },
    {
      name: '链接',
      type: 'link',
      text: '链接',
      href: '',
      fontSize: '12',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      color: 'rgba(0,0,0,1)',
      backColor: 'rgba(255,255,255,0)',
      textAlign: 'left',
      lineHeight: 'normal',
      icon: 'iconlianjie',
      width: 200,
      height: 60
    }
  ],
  chartItems: [ // 组件
    {
      name: '开关',
      type: 'chart',
      class: 'switch',
      img: '/img/chart/switch1.png',
      selectSwitch: '开关(第一组)',
      onImg: '/img/chart/on1.svg',
      offImg: '/img/chart/off1.svg',
      width: 84,
      height: 34
    },
    {
      name: '数值',
      type: 'chart',
      class: 'value',
      img: '/img/chart/value.png',
      text: '',
      fontSize: '12',
      unitFontSize: '12',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      numDigits: 3,
      color: 'rgba(0,0,0,1)',
      numColor: 'rgba(0,0,0,1)',
      backColor: 'rgba(255,255,255,0)',
      textAlign: 'left',
      lineHeight: 'normal',
      showStatus: 'false',
      normalStatusColor: 'rgba(25,201,210,1)',
      errorStatusColor: 'rgba(235,98,51,1)',
      width: 200,
      height: 50
    },
    {
      name: 'LED数值',
      type: 'chart',
      class: 'led',
      img: '/img/chart/led.png',
      text: '',
      fontSize: '18',
      unitFontSize: '12',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
      numDigits: 3,
      color: 'rgba(255,99,71,1)',
      numColor: 'rgba(255,99,71,1)',
      backColor: 'rgba(255,255,255,0)',
      textAlign: 'left',
      lineHeight: 'normal',
      width: 200,
      height: 50
    },
    {
      name: '折线图',
      type: 'chart',
      class: 'echart-line',
      img: '/img/chart/curve1.png',
      whiteFlag: false,
      smoothFlag: false,
      areaFlag: false,
      dataZoom: false,
      markLine: false,
      stackFlag: false,
      width: 500,
      height: 300
    },
    {
      name: '柱状图',
      type: 'chart',
      class: 'echart-bar',
      img: '/img/chart/histogram1.jpg',
      whiteFlag: false,
      dataZoom: false,
      transverse: false,
      stackFlag: false,
      width: 500,
      height: 300
    },
    {
      name: '饼图',
      type: 'chart',
      class: 'echart-pie',
      img: '/img/chart/piechart2.jpg',
      whiteFlag: false,
      annular: false,
      width: 400,
      height: 400
    },
    {
      name: '仪表盘',
      type: 'chart',
      class: 'echart-gauge',
      img: '/img/chart/meter1.png',
      whiteFlag: false,
      max: 100,
      unit: '',
      axisLineWidth: 30,
      showAxisLabel: true,
      axisLabelDistance: 5,
      detailFontSize: 15,
      width: 400,
      height: 400
    }
  ],
  svgContainerItems: [ // 图库容器
    {
      name: '智能电磁流量计',
      type: 'device',
      class: 'container',
      img: '/img/svg/RQ(1).svg',
      width: 366,
      height: 557
    },
    {
      name: '气旋流量计',
      type: 'device',
      class: 'container',
      img: '/img/svg/RQ(2).svg',
      width: 554,
      height: 569
    },
    {
      name: '电磁流量计1',
      type: 'device',
      class: 'container',
      img: '/img/svg/RQ(3).svg',
      width: 563,
      height: 556
    },
    {
      name: '简单流量计',
      type: 'device',
      class: 'container',
      img: '/img/svg/RQ(4).svg',
      width: 481,
      height: 553
    },
    {
      name: '模拟输出流量传感器',
      type: 'device',
      class: 'container',
      img: '/img/svg/RQ(5).svg',
      width: 554,
      height: 554
    },
    {
      name: '流量积算器',
      type: 'device',
      class: 'container',
      img: '/img/svg/RQ(6).svg',
      width: 554,
      height: 510
    },
    {
      name: '锥式流量计',
      type: 'device',
      class: 'container',
      img: '/img/svg/RQ(7).svg',
      width: 554,
      height: 277
    },
    {
      name: '电磁流量计2',
      type: 'device',
      class: 'container',
      img: '/img/svg/RQ(8).svg',
      width: 364,
      height: 553
    },
    {
      name: '电磁流量计',
      type: 'device',
      class: 'container',
      img: '/img/svg/RQ(9).svg',
      width: 238,
      height: 560
    },
    {
      name: '流管3',
      type: 'device',
      class: 'container',
      img: '/img/svg/RQ(10).svg',
      width: 554,
      height: 168
    }
  ],
  svgValveItems: [ // 图库阀门
    {
      name: '控制阀',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(1).svg',
      width: 95,
      height: 140
    },
    {
      name: '旋转阀',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(2).svg',
      width: 142,
      height: 110
    },
    {
      name: '水平单向阀',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(3).svg',
      width: 140,
      height: 107
    },
    {
      name: '垂直单向阀',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(4).svg',
      width: 112,
      height: 140
    },
    {
      name: '电动阀',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(5).svg',
      width: 64,
      height: 141
    },
    {
      name: '手动阀1',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(6).svg',
      width: 142,
      height: 122
    },
    {
      name: '法兰控制阀',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(7).svg',
      width: 67,
      height: 141
    },
    {
      name: '球形阀2',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(8).svg',
      width: 140,
      height: 81
    },
    {
      name: '球形阀1',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(9).svg',
      width: 141,
      height: 90
    },
    {
      name: '阀门1',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(10).svg',
      width: 85,
      height: 140
    },
    {
      name: '球形阀3',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(11).svg',
      width: 93,
      height: 142
    },
    {
      name: '卸灰阀',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(12).svg',
      width: 95,
      height: 141
    },
    {
      name: '塑料旋启式止回阀',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(13).svg',
      width: 142,
      height: 118
    },
    {
      name: '控制阀2',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(14).svg',
      width: 58,
      height: 142
    },
    {
      name: '安全阀',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(15).svg',
      width: 126,
      height: 142
    },
    {
      name: '水平控制阀1',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(16).svg',
      width: 139,
      height: 139
    },
    {
      name: '垂直控制阀',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(17).svg',
      width: 131,
      height: 142
    },
    {
      name: '水平控制阀',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(18).svg',
      width: 104,
      height: 142
    },
    {
      name: '夹管阀',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(19).svg',
      width: 100,
      height: 142
    },
    {
      name: '水平控制阀2',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(20).svg',
      width: 110,
      height: 139
    },
    {
      name: '阀门',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(21).svg',
      width: 124,
      height: 140
    },
    {
      name: '双通阀',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(22).svg',
      width: 142,
      height: 125
    },
    {
      name: '手动阀2',
      type: 'device',
      class: 'valve',
      img: '/img/svg/FM(23).svg',
      width: 142,
      height: 109
    }
  ],
  imgItems: [ // 图形
    {
      type: 'img',
      img: '/img/graphical/tx(1).svg',
      color: 'rgba(255, 205, 99, 1)',
      backColor: 'rgba(255, 255, 255, 0)',
      width: 70,
      height: 60
    },
    {
      type: 'img',
      img: '/img/graphical/tx(2).svg',
      color: 'rgba(96, 125, 139, 1)',
      backColor: 'rgba(255, 255, 255, 0)',
      width: 196,
      height: 197
    },
    {
      type: 'img',
      img: '/img/graphical/tx(3).svg',
      color: 'rgba(124, 211, 113, 1)',
      backColor: 'rgba(255, 255, 255, 0)',
      width: 70,
      height: 35
    },
    {
      type: 'img',
      img: '/img/graphical/tx(4).svg',
      color: 'rgba(240, 75, 54, 1)',
      backColor: 'rgba(255, 255, 255, 0)',
      width: 48,
      height: 48
    },
    {
      type: 'img',
      img: '/img/graphical/tx(5).svg',
      color: 'rgba(166, 186, 171, 1)',
      backColor: 'rgba(255, 255, 255, 0)',
      width: 70,
      height: 70
    },
    {
      type: 'img',
      img: '/img/graphical/tx(6).svg',
      color: 'rgba(210, 196, 140, 1)',
      backColor: 'rgba(255, 255, 255, 0)',
      width: 70,
      height: 70
    },
    {
      type: 'img',
      img: '/img/graphical/tx(7).svg',
      color: 'rgba(247, 169, 59, 1)',
      backColor: 'rgba(255, 255, 255, 0)',
      width: 48,
      height: 48
    },
    {
      type: 'img',
      img: '/img/graphical/tx(8).svg',
      color: 'rgba(255, 88, 78, 1)',
      backColor: 'rgba(255, 255, 255, 0)',
      width: 118,
      height: 98
    },
    {
      type: 'img',
      img: '/img/graphical/tx(9).svg',
      color: 'rgba(77, 160, 216, 1)',
      backColor: 'rgba(255, 255, 255, 0)',
      width: 48,
      height: 48
    },
    {
      type: 'img',
      img: '/img/graphical/tx(10).svg',
      color: 'rgba(224, 203, 154, 1)',
      backColor: 'rgba(255, 255, 255, 0)',
      width: 240,
      height: 297
    }
  ],
  canvasItems: [ // 动画
    {
      name: '管道',
      type: 'pip-h',
      img: '/img/canvas/gdz2.svg',
      color: 'rgba(0, 153, 255, 1)',
      pipelineColor: 'rgba(206, 218, 239, 1)',
      pipelineHeight: 10,
      width: 700,
      height: 10
    },
    {
      name: '管道弯角',
      type: 'pip-corner',
      img: '/img/canvas/gdw3.png',
      color: 'rgba(0, 153, 255, 1)',
      pipelineColor: 'rgba(206, 218, 239, 1)',
      pipelineHeight: 10,
      rotateX: false,
      width: 260,
      height: 260
    },
    {
      name: '进度条',
      type: 'progress',
      img: '/img/canvas/progress.jpg',
      fontColor: 'rgba(255,255,255,1)',
      color: 'rgba(45, 140, 240, 1)',
      backColor: 'rgba(243, 243, 243, 1)',
      fontSize: '12',
      max: 100,
      width: 300,
      height: 30
    },
    {
      name: '水池',
      type: 'liquidfill',
      img: '/img/canvas/liquidfill.jpg',
      backColor: 'rgba(255,255,255,1)',
      color: 'rgba(45, 140, 240, 1)',
      fontSize: '20',
      max: 100,
      unit: '',
      width: 200,
      height: 200
    }
  ],
  switchs: [ // 开关组
    {
      name: '开关(第一组)',
      onImg: '/img/chart/on1.svg',
      offImg: '/img/chart/off1.svg'
    },
    {
      name: '开关(第二组)',
      onImg: '/img/chart/on2.svg',
      offImg: '/img/chart/off2.svg'
    },
    {
      name: '开关(第三组)',
      onImg: '/img/chart/on3.svg',
      offImg: '/img/chart/off3.svg'
    },
    {
      name: '开关(第四组)',
      onImg: '/img/chart/on4.png',
      offImg: '/img/chart/off4.png'
    },
    {
      name: '开关(第五组)',
      onImg: '/img/chart/on5.png',
      offImg: '/img/chart/off5.png'
    },
    {
      name: '开关(第六组)',
      onImg: '/img/chart/on6.png',
      offImg: '/img/chart/off6.png'
    },
    {
      name: '开关(第七组)',
      onImg: '/img/chart/on7.png',
      offImg: '/img/chart/off7.png'
    },
    {
      name: '开关(第八组)',
      onImg: '/img/chart/on8.png',
      offImg: '/img/chart/off8.png'
    },
    {
      name: '开关(第九组)',
      onImg: '/img/chart/on9.png',
      offImg: '/img/chart/off9.png'
    },
    {
      name: '开关(第十组)',
      onImg: '/img/chart/on10.png',
      offImg: '/img/chart/off10.png'
    }
  ]
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
