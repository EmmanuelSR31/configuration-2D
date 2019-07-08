<template>
  <div class="tags-outer-con" ref="tagCon" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
    <div class="tags-scroll-con" ref="scrollCon" :style="{left: tagConLeft + 'px'}">
      <Tag v-for="item in pageTagsList" ref="tagsPageOpened" :name="item.text" :key="item.text"
      :closable="item.text==='首页'?false:true" :color="item.text===currentPageName?'blue':'default'"
      @on-close="closeTag(item.text)" @click.native="linkTo(item)" v-on:contextmenu.native="showTagMenu(item, $event)">{{item.text}}</Tag>
      <div class="contextmenu-con" v-show="tagContextmenuShow" @mouseleave="contextMenuClose" :style="{left: axios.x + 'px', top: axios.y + 'px'}">
        <ul>
          <li v-for="item in contextMenuList" :key="item.name" @click="contextMenuClick(item.name)">
            {{item.title}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'openedPageTags',
  data () {
    return {
      tagContextmenuShow: false, // 是否显示右键菜单
      axios: { // 右键菜单位置
        x: null,
        y: null
      },
      tagConLeft: 0, // 滚动区域左侧距离
      refsTag: [] // 标签DOM
    }
  },
  props: {
    pageTagsList: Array // 标签数据列表
  },
  computed: {
    currentPageName: function () { // 当前页面名
      return this.$store.state.currentPageName
    },
    contextMenuList: function () { // 标签右键菜单
      return this.$store.state.contextMenuList
    }
  },
  methods: {
    /**
    * @desc 关闭标签
    * @param {String} name 要关闭的标签名
    */
    closeTag: function (name) { // 关闭标签
      let pageOpenedList = this.$store.state.pageOpenedList
      let lastPageObj = pageOpenedList[0]
      if (this.currentPageName === name) {
        let len = pageOpenedList.length
        let i = pageOpenedList.findIndex((element) => (element.text === name))
        lastPageObj = i < (len - 1) ? pageOpenedList[i + 1] : pageOpenedList[i - 1]
      }
      this.$store.dispatch('removeTag', name)
      this.$store.dispatch('closePage', name)
      pageOpenedList = this.$store.state.pageOpenedList
      localStorage.pageOpenedList = JSON.stringify(pageOpenedList)
      if (this.currentPageName === name) {
        this.linkTo(lastPageObj)
      }
    },
    /**
    * @desc 跳转页面
    * @param {Object} item 跳转的页面对象
    */
    linkTo: function (item) { // 跳转页面
      this.$router.push({
        path: item.url
      })
      this.$store.dispatch('setCurrentPageName', item.text)
    },
    /**
    * @desc 打开右键菜单
    * @param {Object} item 要打开右键菜单的标签
    * @param {Object} event 事件
    */
    showTagMenu: function (item, event) {
      event.preventDefault()
      var x = event.clientX - 5
      var y = event.clientY - 5
      this.$store.dispatch('setContextMenuOpenedTag', item.text)
      this.tagContextmenuShow = true
      this.axios.x = x
      this.axios.y = y
    },
    /**
    * @desc 点击右键菜单
    * @param {String} name 点击的右键菜单名
    */
    contextMenuClick: function (name) { // 点击右键菜单
      if (name === 'close' && this.$store.state.contextMenuOpenedTag !== 'home') {
        let pageOpenedList = this.$store.state.pageOpenedList
        let lastPageObj = pageOpenedList[0]
        if (this.currentPageName === this.$store.state.contextMenuOpenedTag) {
          let len = pageOpenedList.length
          let i = pageOpenedList.findIndex((element) => (element.name === this.$store.state.contextMenuOpenedTag))
          lastPageObj = i < (len - 1) ? pageOpenedList[i + 1] : pageOpenedList[i - 1]
        }
        this.$store.dispatch('closeCurrentTag')
        if (this.currentPageName === this.$store.state.contextMenuOpenedTag) {
          this.linkTo(lastPageObj)
        }
      } else if (name === 'closeOther') {
        this.$store.dispatch('closeOtherTag')
        this.linkTo(this.$store.state.pageOpenedList[this.$store.state.pageOpenedList.length - 1])
      } else if (name === 'closeAll') {
        this.$store.dispatch('closeAllTag')
        this.linkTo({ url: '/home', text: '首页' })
      }
      this.contextMenuClose()
    },
    /**
    * @desc 关闭右键菜单
    */
    contextMenuClose: function () {
      this.tagContextmenuShow = false
    },
    /**
    * @desc 鼠标中键滚动
    * @param {Object} e 事件
    */
    handlescroll: function (e) {
      var type = e.type
      let delta = 0
      if (type === 'DOMMouseScroll' || type === 'mousewheel') {
        delta = (e.wheelDelta) ? e.wheelDelta : -(e.detail || 0) * 40
      }
      let left = 0
      if (delta > 0) {
        left = Math.min(0, this.tagConLeft + delta)
      } else {
        if (this.$refs.tagCon.offsetWidth < this.$refs.scrollCon.offsetWidth) {
          left = this.tagConLeft < -(this.$refs.scrollCon.offsetWidth - this.$refs.tagCon.offsetWidth) ? this.tagConLeft : Math.max(this.tagConLeft + delta, this.$refs.tagCon.offsetWidth - this.$refs.scrollCon.offsetWidth)
        } else {
          this.tagConLeft = 0
        }
      }
      this.tagConLeft = left
    },
    /**
    * @desc 标签移动到可视区域
    * @param {Object} tag 标签对象
    */
    moveToView (tag) {
      if (tag.offsetLeft < -this.tagConLeft) { // 标签在可视区域左侧
        this.tagConLeft = -tag.offsetLeft - 10
      } else if (this.$refs.tagCon.offsetWidth < tag.offsetLeft + this.tagConLeft + tag.offsetWidth) { // 标签在可视区域右侧
        this.tagConLeft = -(tag.offsetLeft - (this.$refs.tagCon.offsetWidth - tag.offsetWidth) + 20)
      } else {
        // 标签在可视区域
      }
    }
  },
  mounted () {
    console.log(this.pageTagsList)
    this.refsTag = this.$refs.tagsPageOpened
  },
  watch: {
    '$route' (to) {
      this.currentPageName = to.name
      this.$nextTick(() => {
        this.refsTag.forEach((item, index) => {
          let temp = this.pageTagsList.find(ele => ele.text === item.name)
          if (to.path === temp.url) {
            let tag = this.refsTag[index].$el
            this.moveToView(tag)
          }
        })
      })
    }
  }
}
</script>
<style lang="scss">
.tags-outer-con{
  position: relative;
  width: 100%;
  height: 100%;
}
.tags-scroll-con{
  position: absolute;
  top: 0;
  overflow: visible;
  white-space: nowrap;
  transition: left 0.3s ease;
}
.ivu-tag-blue .ivu-tag-dot-inner{
  background: #1890ff;
}
.contextmenu-con{
  position: fixed;
  z-index: 100;
  background-color: #ffffff;
  padding: 5px 0;
  li{
    padding: 5px 15px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    &:hover{
      background-color: #eeeeee;
    }
  }
}
</style>
