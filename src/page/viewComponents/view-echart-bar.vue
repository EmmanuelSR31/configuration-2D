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
      charts: '',
      sensorList: [{ id: 1, sensor_name: '电压' }, { id: 2, sensor_name: '电流' }] // 传感器列表
    }
  },
  methods: {
    init: function () {
      if (this.charts) {
        this.charts.dispose()
      }
      this.charts = echarts.init(document.getElementById('chartBar' + this.index))
      let legendData = []
      let seriesData = []
      this.obj.sensorId = [1, 2]
      for (const iterator of this.obj.sensorId) {
        let temp = this.sensorList.find(ele => ele.id === iterator).sensor_name
        legendData.push(temp)
        let dataTemp = []
        let num = 210
        let num1 = 20
        if (temp === '电流') {
          num = 6
          num1 = 2
        }
        for (let i = 0; i < 7; i++) {
          dataTemp.push(Math.ceil(Math.random() * num1) + num)
        }
        seriesData.push({
          name: temp,
          data: dataTemp,
          type: 'bar',
          smooth: this.smoothFlag
        })
      }
      let option = {
        /* title: {
          text: '柱状图'
        }, */
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: legendData
        },
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: seriesData
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
  }
}
</script>

<style lang="scss">
</style>
