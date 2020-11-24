<template>
<div class="led-con" :style="itemStyle()">
  <span class="led-val-con">
    <span class="led-bg">{{bgVal}}<span :style="{fontSize: obj.unitFontSize + 'px'}">{{unit}}</span></span>
    <span class="led-val">{{val}}<span :style="{fontSize: obj.unitFontSize + 'px'}">{{unit}}</span></span>
  </span>
  
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
      val: '15.0',
      unit: 'c',
      bgVal: ''
    }
  },
  methods: {
    init: function () {
      this.bgVal = this.val.replace(/[0-9]/ig, '8')
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
  },
  watch: {
    val: function (newVal, oldVal) {
      this.init()
    }
  }
}
</script>

<style lang="scss">
.led-val-con{
  position: relative;
}
.led-val, .led-bg{
  position: absolute;
  display: inline-block;
  left: 0;
  top: 0;
  font-variant-numeric: tabular-nums;
}
.led-bg{
  color: #3e3e3e;
}
</style>
