<template>
<div class="svg-img-con" :id="'valve' + index" @dblclick="change" :style="{height: obj.height + 'px'}">
  <svg class="icon" :style="svgStyle()" aria-hidden="true">
    <use xlink:href="#iconfamen1"></use>
  </svg>
</div>
</template>

<script>
export default {
  props: {
    obj: Object,
    index: Number,
    color: String
  },
  data () {
    return {
      switchVal: true
    }
  },
  methods: {
    init: function () {
    },
    change: function () {
      this.switchVal = !this.switchVal
      this.color = this.switchVal ? this.obj.color : this.obj.errorStatusColor
    },
    svgStyle: function () {
      let size = Math.min(this.obj.width, this.obj.height)
      let temp = {
        fontSize: `${size}px`,
        color: this.color
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
