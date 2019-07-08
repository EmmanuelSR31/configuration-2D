<template>
<div class="contextmenu-con" id="tagContextmenu">
  <ul>
    <li v-for="item in contextMenuList" :key="item.name" @click="contextMenuClick(item.name)">
      {{item.title}}
    </li>
  </ul>
</div>
</template>
<script>
export default {
  name: 'tagContextMenu',
  props: {
    contextMenuData: { // 右键菜单位置对象
      axios: {
        x: null,
        y: null
      }
    }
  },
  computed: {
    contextMenuList: function () { // 右键菜单列表
      return this.$store.state.contextMenuList
    }
  },
  watch: {
    contextMenuData: function () {
      var x = this.contextMenuData.axios.x
      var y = this.contextMenuData.axios.y
      alert(x)
      var menu = document.getElementsByID('tagContextmenu')
      menu.style.display = 'block'
      menu.style.left = x + 'px'
      menu.style.top = y + 'px'
      document.addEventListener('mouseup', function () {
        menu.style.display = 'none'
      }, false)
    }
  },
  methods: {
    contextMenuClick: function (name) {

    }
  }
}
</script>
<style>
.contextmenu-con{
  position: absolute;
  z-index: 100;
}
</style>
