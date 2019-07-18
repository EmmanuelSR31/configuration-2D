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
    val: Number
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
          data: [{ value: this.val }],
          max: this.obj.max,
          axisLine: {
            lineStyle: {
              width: this.obj.axisLineWidth
            }
          },
          splitLine: {
            length: this.obj.axisLineWidth
          },
          axisLabel: {
            show: this.obj.showAxisLabel,
            distance: this.obj.axisLabelDistance
          },
          detail: {
            fontSize: this.obj.detailFontSize,
            formatter: function (value) {
              return value + that.obj.unit
            }
          }
        }]
      }
      if (this.obj.whiteFlag) {
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
    val: function (newVal, oldVal) {
      const that = this
      this.$nextTick(function () {
        that.charts.setOption({
          series: [{
            data: [{ value: that.val }]
          }]
        })
      })
    }
  }
}
</script>

<style lang="scss">
</style>
