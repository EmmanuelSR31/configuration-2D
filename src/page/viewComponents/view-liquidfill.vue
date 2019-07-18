<template>
<div>
  <div :id="'liquidfill' + index" :ref="'liquidfill' + index" :style="{width: obj.width + 'px', height: obj.height + 'px'}"></div>
</div>
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts-liquidfill'
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
          data: [(this.val / this.obj.max).toFixed(2)],
          shape: 'rect',
          radius: '100%',
          color: [this.obj.color],
          backgroundStyle: {
            color: this.obj.backColor
          },
          outline: {
            itemStyle: {
              borderColor: this.obj.color
            }
          },
          label: {
            formatter: this.val + this.obj.unit + '\n' + (this.val / this.obj.max).toFixed(2) * 100 + '%',
            fontSize: this.obj.fontSize
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
    val: function (newVal, oldVal) {
      const that = this
      this.$nextTick(function () {
        that.charts.setOption({
          series: [{
            data: [(that.val / that.obj.max).toFixed(2)],
            label: {
              formatter: this.val + this.obj.unit + '\n' + (that.val / that.obj.max).toFixed(2) * 100 + '%'
            }
          }]
        })
      })
    }
  }
}
</script>

<style lang="scss">

</style>
