<template>
<div class="led-con" :style="itemStyle()">
  {{val}}<span :style="{fontSize: obj.unitFontSize + 'px'}">{{unit}}</span>
</div>
</template>

<script>
export default {
  props: {
    obj: Object,
    index: Number
  },
  data () {
    return {
      val: '25.0',
      unit: 'c'
    }
  },
  methods: {
    init: function () {
    },
    /**
    * @desc 生成样式
    */
    itemStyle: function () {
      let temp = {
        color: this.obj.color,
        height: this.obj.height + 'px',
        fontSize: this.obj.fontSize + 'px',
        fontWeight: this.obj.fontWeight,
        fontStyle: this.obj.fontStyle,
        textDecoration: this.obj.textDecoration,
        textAlign: this.obj.textAlign
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
