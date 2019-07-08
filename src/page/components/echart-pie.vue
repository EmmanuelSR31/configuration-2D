<template>
<div :id="'chartPie' + index" :style="itemStyle()"></div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
require('echarts/lib/chart/pie')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('es6-promise').polyfill()
export default {
  props: {
    obj: Object,
    index: Number,
    width: Number,
    height: Number,
    whiteFlag: Boolean, // 白色图表线条文字
    annular: Boolean // 环形饼图
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
      this.charts = echarts.init(document.getElementById('chartPie' + this.index))
      let option = {
        title: {
          text: '饼图',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          data: ['传感器1', '传感器2', '传感器3', '传感器4', '传感器5'],
          orient: 'vertical',
          left: 'left'
        },
        series: [{
          type: 'pie',
          radius: '60%',
          data: [
            { value: 335, name: '传感器1' },
            { value: 310, name: '传感器2' },
            { value: 234, name: '传感器3' },
            { value: 135, name: '传感器4' },
            { value: 1548, name: '传感器5' }
          ]
        }]
      }
      if (this.whiteFlag) {
        option.title.textStyle = {
          color: '#fff'
        }
        option.legend.textStyle = {
          color: '#fff'
        }
      }
      if (this.annular) {
        option.series[0].radius = ['40%', '60%']
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
    annular: function (newVal, oldVal) {
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
