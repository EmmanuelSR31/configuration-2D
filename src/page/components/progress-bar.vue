<template>
<div>
  <div class="progress-con" :style="{height: obj.height + 'px'}">
    <div class="progress-outer" :style="{height: obj.height + 'px', borderRadius: obj.height + 'px', backgroundColor: obj.backColor, borderRadius: obj.height + 'px'}"></div>
    <div class="progress-inner" :style="itemStyle()">
      60%
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
        width: '60%',
        borderRadius: this.obj.height + 'px',
        lineHeight: this.obj.height + 'px',
        fontSize: this.obj.fontSize + 'px'
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
