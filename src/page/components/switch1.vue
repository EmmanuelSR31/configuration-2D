<template>
<div class="svg-switch-con" :id="'switch' + index" @dblclick="change" :style="{height: obj.height + 'px'}">
  <img v-show="switchVal" src="/img/chart/on1.svg">
  <img v-show="!switchVal" src="/img/chart/off1.svg">
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
      switchVal: true
    }
  },
  methods: {
    init: function () {
    },
    change: function () {
      this.switchVal = !this.switchVal
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss">
.svg-switch-con{
  cursor: pointer;
}
</style>
