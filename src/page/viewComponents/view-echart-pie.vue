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
      charts: '',
      sensorList: [{ id: 1, sensor_name: '电压' }, { id: 2, sensor_name: '电流' }] // 传感器列表
    }
  },
  methods: {
    init: function () {
      if (this.charts) {
        this.charts.dispose()
      }
      this.charts = echarts.init(document.getElementById('chartPie' + this.index))
      let legendData = []
      let seriesData = []
      this.obj.sensorId = [1, 2]
      for (const iterator of this.obj.sensorId) {
        let temp = this.sensorList.find(ele => ele.id === iterator).sensor_name
        legendData.push(temp)
        let num = 210
        let num1 = 20
        if (temp === '电流') {
          num = 6
          num1 = 2
        }
        seriesData.push({
          name: temp,
          value: Math.ceil(Math.random() * num1) + num
        })
      }
      let option = {
        /* title: {
          text: '饼图',
          x: 'center'
        }, */
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          data: legendData,
          orient: 'vertical',
          left: 'left'
        },
        series: [{
          type: 'pie',
          radius: '60%',
          data: seriesData
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
  }
}
</script>

<style lang="scss">
</style>
