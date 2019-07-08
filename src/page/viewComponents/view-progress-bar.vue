<template>
<div>
  <div class="progress-con" :style="{height: obj.height + 'px'}">
    <div class="progress-outer" :style="{height: obj.height + 'px', borderRadius: height + 'px', backgroundColor: obj.backColor, borderRadius: obj.height + 'px'}"></div>
    <div class="progress-inner" :style="itemStyle()">
      {{obj.num}}%
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    obj: Object,
    num: Number,
    color: String,
    fontSize: String
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
        width: this.obj.num + '%',
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
.progress-con{
  position: relative;
}
.progress-outer{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
}
.progress-inner{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  text-align: center;
  height: 100%;
}
</style>
