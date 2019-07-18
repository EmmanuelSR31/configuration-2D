<template>
<div :id="'chartGauge' + index" :style="itemStyle()"></div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
require('echarts/lib/chart/gauge')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require('es6-promise').polyfill()
export default {
  props: {
    obj: Object,
    index: Number,
    width: Number,
    height: Number,
    whiteFlag: Boolean, // 白色图表线条文字
    unit: String,
    max: Number,
    axisLineWidth: Number,
    showAxisLabel: Boolean,
    axisLabelDistance: Number,
    detailFontSize: Number
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
      const that = this
      this.charts = echarts.init(document.getElementById('chartGauge' + this.index))
      let option = {
        tooltip: {
          trigger: 'item'
        },
        series: [{
          type: 'gauge',
          data: [{ value: 80 }],
          max: this.max,
          axisLine: {
            lineStyle: {
              width: this.axisLineWidth
            }
          },
          splitLine: {
            length: this.axisLineWidth
          },
          axisLabel: {
            show: this.showAxisLabel,
            distance: this.axisLabelDistance
          },
          detail: {
            fontSize: this.detailFontSize,
            formatter: function (value) {
              return value + that.unit
            }
          }
        }]
      }
      if (this.whiteFlag) {
        option.series[0].title = {
          color: '#fff'
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
    max: function (newVal, oldVal) {
      const that = this
      this.$nextTick(function () {
        that.init()
      })
    },
    unit: function (newVal, oldVal) {
      const that = this
      this.$nextTick(function () {
        that.init()
      })
    },
    axisLineWidth: function (newVal, oldVal) {
      const that = this
      this.$nextTick(function () {
        that.init()
      })
    },
    showAxisLabel: function (newVal, oldVal) {
      const that = this
      this.$nextTick(function () {
        that.init()
      })
    },
    axisLabelDistance: function (newVal, oldVal) {
      const that = this
      this.$nextTick(function () {
        that.init()
      })
    },
    detailFontSize: function (newVal, oldVal) {
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
