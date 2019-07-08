<template>
<div class="led-con" :style="itemStyle()">
  {{obj.val}}<span :style="{fontSize: obj.unitFontSize + 'px'}"> {{obj.unit}}</span>
</div>
</template>

<script>
export default {
  props: {
    obj: Object,
    val: Number,
    index: Number
  },
  data () {
    return {
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
