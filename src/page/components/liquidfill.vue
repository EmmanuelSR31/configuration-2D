<template>
<div>
  <div :id="'liquidfill' + index" :ref="'liquidfill' + index" :style="{width: width + 'px', height: height + 'px'}"></div>
</div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts-liquidfill'
require('echarts/lib/component/tooltip')
require('es6-promise').polyfill()
export default {
  props: {
    color: String,
    backColor: String,
    fontSize: String,
    index: Number,
    width: Number,
    height: Number,
    unit: String
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
      this.charts = echarts.init(document.getElementById('liquidfill' + this.index))
      let option = {
        grid: {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0
        },
        series: [{
          type: 'liquidFill',
          data: [0.6],
          shape: 'rect',
          radius: '100%',
          color: [this.color],
          backgroundStyle: {
            color: this.backColor
          },
          outline: {
            itemStyle: {
              borderColor: this.color
            }
          },
          label: {
            formatter: '60' + this.unit + '\n60%',
            fontSize: this.fontSize
          }
        }]
      }
      this.charts.setOption(option)
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
    color: function (newVal, oldVal) {
      const that = this
      this.$nextTick(function () {
        that.init()
      })
    },
    backColor: function (newVal, oldVal) {
      const that = this
      this.$nextTick(function () {
        that.init()
      })
    },
    fontSize: function (newVal, oldVal) {
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
    }
  }
}
</script>

<style lang="scss">

</style>
