<template>
<div :id="'chartBar' + index" :style="itemStyle()"></div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
require('echarts/lib/chart/bar')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/dataZoom')
require('es6-promise').polyfill()
export default {
  props: {
    obj: Object,
    index: Number,
    width: Number,
    height: Number,
    whiteFlag: Boolean, // 白色图表线条文字
    dataZoom: Boolean, // 区域缩放
    transverse: Boolean, // 横向柱状图
    stackFlag: Boolean // 堆叠图
  },
  data () {
    return {
      charts: ''
    }
  },
  methods: {
    init: function () {
      if (this.charts) {
        this.charts.dispose()
      }
      this.charts = echarts.init(document.getElementById('chartBar' + this.index))
      let option = {
        title: {
          text: '柱状图'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['传感器1', '传感器2']
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: '传感器1',
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'bar'
        },
        {
          name: '传感器2',
          data: [720, 832, 701, 734, 1190, 1230, 1420],
          type: 'bar'
        }]
      }
      if (this.whiteFlag) {
        option.title.textStyle = {
          color: '#fff'
        }
        if (option.legend !== undefined) {
          option.legend.textStyle = {
            color: '#fff'
          }
        }
        option.xAxis.axisLine = {
          lineStyle: {
            color: '#fff'
          }
        }
        option.yAxis.axisLine = {
          lineStyle: {
            color: '#fff'
          }
        }
        option.xAxis.splitLine = {
          lineStyle: {
            color: '#fff'
          }
        }
        option.yAxis.splitLine = {
          lineStyle: {
            color: '#fff'
          }
        }
        option.tooltip.axisPointer = {
          lineStyle: {
            color: '#fff'
          }
        }
      }
      if (this.dataZoom) {
        option.dataZoom = [{
          type: 'inside'
        }, {
          type: 'slider'
        }]
      }
      if (this.transverse) {
        [option.xAxis, option.yAxis] = [option.yAxis, option.xAxis]
      }
      if (this.stackFlag) {
        for (const iterator of option.series) {
          iterator.stack = '总量'
        }
      }
      this.charts.setOption(option)
    },
    /**
    * @desc 生成样式
    */
    itemStyle: function () {
      let temp = {
        width: this.obj.width + 'px',
        height: this.obj.height + 'px'
      }
      return temp
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    width: function (newVal, oldVal) {
      const that = this
      this.$nextTick(function () {
        that.init()
      })
    },
    height: function (newVal, oldVal) {
      const that = this
      this.$nextTick(function () {
        that.init()
      })
    },
    whiteFlag: function (newVal, oldVal) {
      const that = this
      this.$nextTick(function () {
        that.init()
      })
    },
    dataZoom: function (newVal, oldVal) {
      const that = this
      this.$nextTick(function () {
        that.init()
      })
    },
    transverse: function (newVal, oldVal) {
      const that = this
      this.$nextTick(function () {
        that.init()
      })
    },
    stackFlag: function (newVal, oldVal) {
      const that = this
      this.$nextTick(function () {
        that.init()
      })
    }
  }
}
</script>

<style lang="scss">
</style>
