<template>
<div>
  <ul class="list">
    <li v-for="(item, index) in list" :key="index">
      <img :src="item.img">
      <Button @click="set(item)">设计</Button>
    </li>
  </ul>
</div>
</template>

<script>
import hotspotSet from './hotspotSet.vue'
export default {
  data () {
    return {
      list: [
        {
          img: '/img/temp.jpg'
        },
        {
          img: '/img/temp.jpg'
        }
      ]
    }
  },
  methods: {
    /**
    * @desc 拖拽完成
    * @param {Object} item 拖拽对象
    */
    set: function (item) {
      this.$layer.iframe({
        content: {
          content: hotspotSet, // 传递的组件对象
          parent: this, // 当前的vue对象
          data: {
            objJson: JSON.stringify(item)
          }
        },
        area: ['950px', document.body.clientHeight - 40 + 'px'],
        title: '设计',
        shade: true,
        shadeClose: false
      })
    }
  }
}
</script>

<style lang="scss">
.list li{
  float: left;
  width: 25%;
  margin-right: 10px;
  img{
    width: 100%;
  }
}
</style>
