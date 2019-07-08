<template>
<div :style="itemStyle()">
  {{val}}<span :style="{fontSize: obj.unitFontSize + 'px'}">{{unit}}</span>
  <div v-if="obj.showStatus === 'true'" class="sensor-status" :style="{backgroundColor: obj.normalStatusColor}"></div>
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
      if (this.obj.showStatus === 'true') {
        temp.paddingRight = '22px'
        temp.position = 'relative'
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
.sensor-status{
  position: absolute;
  top: 5px;
  right: 5px;
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
}
</style>
