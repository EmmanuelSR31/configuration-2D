<template>
<div>
  <div class="progress-con" :style="{height: obj.height + 'px'}">
    <div class="progress-outer" :style="{height: obj.height + 'px', borderRadius: obj.height + 'px', backgroundColor: obj.backColor, borderRadius: obj.height + 'px'}"></div>
    <div class="progress-inner" :style="itemStyle()">
      {{val}}%
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    obj: Object
  },
  data () {
    return {}
  },
  methods: {
    init: function () {
    },
    /**
    * @desc 生成样式
    */
    itemStyle: function () {
      let temp = {
        color: this.obj.fontColor,
        backgroundColor: this.obj.color,
        width: (this.obj.val / this.obj.max * 100).toFixed(0) + '%',
        borderRadius: this.obj.height + 'px',
        lineHeight: this.obj.height + 'px',
        fontSize: this.obj.fontSize + 'px'
      }
      return temp
    }
  },
  mounted () {
    this.obj.val = '0'
    this.init()
  },
  computed: {
    val: function () {
      return (this.$math.divide(this.obj.val, this.obj.max) * 100).toFixed(2)
    }
  }
}
</script>

<style lang="scss">

</style>
