<template>
<div :style="itemStyle()">
  {{obj.text}}<span :style="numStyle()">{{obj.val}}</span>{{obj.unit}}
  <div v-if="obj.showStatus === 'true'" class="sensor-status" :style="{backgroundColor: obj.normalStatusColor}"></div>
</div>
</template>

<script>
export default {
  props: {
    obj: Object,
    val: String,
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
        fontSize: this.obj.unitFontSize + 'px',
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
    },
    /**
    * @desc 生成数值样式
    */
    numStyle: function () {
      let temp = {
        display: 'inline-block',
        width: this.obj.fontSize * this.obj.numDigits / 1.5 + 'px',
        color: this.obj.numColor,
        fontSize: this.obj.fontSize + 'px',
        textAlign: 'center'
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
