<template>
  <div style="height: 100%;overflow:auto" class="main">
    <div class="main_header">
      <div style="width: 194px;float: left;"><div class="main_header_title">鲲博时代Bim运营管理平台</div></div>
      <div class="main_header_home"><img src="/img/homeIcon.png" alt=""><span @click="linkTo({text: '首页', path: '/home', name: 'home', url: '/home'})" style="cursor: pointer;">首页</span></div>
      <div class="tagBox" ref="tagBox">
        <div class="tagBox_auto" ref="tagBox_auto">
          <Tag v-for="item in count" :key="item" :name="item" closable @on-close="handleClose2" @click.native="linkTo(item)" :class="[item.url === currentPageName ? 'tagCheck' : '']">{{item.text}}</Tag>
        </div>
      </div>
      <div class="main_user">
        <img src="/img/head.jpg" alt="">
        <span>{{user.actual_name}}</span>
        <div class="operationBox">
          <div class="triangle"></div>
          <ul>
            <li @click="logout">
              退出登录
            </li>
          </ul>
        </div>
      </div>
      <div class="main_set">
        <div class="sousuo">
          <div class="imgBox"></div>
          <span>搜索</span>
        </div>
        <div class="sousuo">
          <div class="imgBox"></div>
          <span>设置</span>
        </div>
      </div>
      <div class="main_set1">
        <img src="/img/mian_leftIcon.png" alt="" v-if="leftIconFlag === true" @click="leftIconFun">
        <img src="/img/mian_leftIcon-1.png" alt="" v-if="leftIconFlag === false">
        <img src="/img/mian_RightIcon.png" alt="" @click="rightIconFun" v-if="rightIconFlag === true">
        <img src="/img/mian_RightIcon-1.png" alt="" v-if="rightIconFlag === false">
      </div>
    </div>
    <div class="menu_box">
      <Menu :theme="leftMenuTheme" active-name="menulist" :open-names="['1']" accordion @on-select="routeTo" class="main_leftNav">
        <template v-for="item in menuList">
          <template v-if="item.children !== null && item.children !== undefined && item.children.length > 0">
            <Submenu :name="item" :key="item.text">
              <template slot="title">
                <Icon :type="item.iconCls !== null ? item.iconCls : 'ios-alert'"></Icon>
                {{item.text}}
              </template>
              <template v-for="tmp in item.children">
                <template v-if="tmp.children !== null && tmp.children !== undefined && tmp.children.length > 0">
                  <Submenu :name="tmp" :key="tmp.text">
                    <template slot="title">{{tmp.text}}</template>
                    <MenuItem v-for="tm in tmp.children" :name="tm" :key="tm.text">{{tm.text}}</MenuItem>
                  </Submenu>
                </template>
                <template v-else>
                  <MenuItem :name="tmp" :key="tmp.text">{{tmp.text}}</MenuItem>
                </template>
              </template>
            </Submenu>
          </template>
          <template v-else>
            <MenuItem :name="item" :key="item.text">
              <Icon :type="item.iconCls !== null ? item.iconCls : 'ios-alert'" :key="item.text"></Icon>
              {{item.text}}
            </MenuItem>
          </template>
        </template>
        <div style="height: 50px;"></div>
      </Menu>
    </div>
    <div class="single-page-con">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  import Util from '@/utils/index'
  import $ from 'jquery'
  export default {
    data () {
      return {
        leftMenuTheme: 'light', // 左侧菜单主题
        count: [], // 标签
        user: {},
        headPhoto: '/img/head.jpg',
        name: '',
        currentPageName: '', // 当前页面
        leftIconFlag: false,
        rightIconFlag: false,
        maxNum: 0,
        posLeft: 0,
        time: 0
      }
    },
    computed: {
      topShow: function () { // 顶部菜单显示隐藏
        return this.$store.state.topShow
      },
      conTop: function () { // 主内容距顶部高度
        return this.$store.state.conTop
      },
      menuList: function () {
        return this.$store.state.menuList // 左侧菜单列表
      }
    },
    methods: {
      // 标签页关闭
      handleClose2 (event, name) {
        if (this.currentPageName === '') {
          this.currentPageName = this.count[this.count.length - 1].url
        }
        var lastPageObj = this.count[0]
        // 关闭的标签和当前页面一样，页面跳转前一个
        if (this.currentPageName === name.url) {
          let len = this.count.length
          let i = this.count.findIndex((element) => (element.text === name.text))
          lastPageObj = i < (len - 1) ? this.count[i + 1] : this.count[i - 1]
          const index = this.count.indexOf(name)
          this.count.splice(index, 1)
          console.log(this.count)
          // sessionStorage.posLeft = 1
          var widthBox = this.$refs.tagBox.offsetWidth
          if (this.count.length * 156 < widthBox) { // 标签长度小于盒子长度
            this.leftIconFlag = false
            this.rightIconFlag = false
            $('.tagBox_auto').animate({ left: '0px' }, 500)
            this.maxNum = 0 // 超出盒子宽度的标签块
            sessionStorage.maxNum = JSON.stringify(this.maxNum)
          } else {
            this.leftIconFlag = true
            this.rightIconFlag = false
            let posLeft = Number($('.tagBox_auto').css('left').slice(0, -2)) // 当前盒子的定位
            $('.tagBox_auto').animate({ left: posLeft + 156 + 'px' }, 500) // 关闭标签之后滑动到第一个
            this.maxNum = this.maxNum - 1 // 超出盒子宽度的标签块
            sessionStorage.maxNum = JSON.stringify(this.maxNum)
          }
          sessionStorage.tagList = JSON.stringify(this.count)
          if (this.count.length === 0) {
            let newlastPageObj = { url: '/home' }
            // sessionStorage.posLeft = undefined
            this.linkTo(newlastPageObj)
          } else {
            this.linkTo(lastPageObj)
          }
        } else {
          const index = this.count.indexOf(name)
          console.log(index)
          this.count.splice(index, 1)
          // sessionStorage.posLeft = 1
          sessionStorage.tagList = JSON.stringify(this.count)
          var widthBoxs = this.$refs.tagBox.offsetWidth
          if (this.count.length * 156 < widthBoxs) {
            this.leftIconFlag = false
            this.rightIconFlag = false
            $('.tagBox_auto').animate({ left: '0px' }, 500)
            this.maxNum = 0 // 超出盒子宽度的标签块
            sessionStorage.maxNum = JSON.stringify(this.maxNum)
          } else {
            this.leftIconFlag = true
            this.rightIconFlag = false
            let posLeft = Number($('.tagBox_auto').css('left').slice(0, -2)) // 当前盒子的定位
            $('.tagBox_auto').animate({ left: posLeft + 156 + 'px' }, 500) // 关闭标签之后滑动到第一个
            this.maxNum = this.maxNum - 1 // 超出盒子宽度的标签块
            sessionStorage.maxNum = JSON.stringify(this.maxNum)
          }
        }
      },
      /**
       * @desc 跳转页面
       * @param {Object} item 跳转的页面对象
       */
      linkTo: function (item) { // 跳转页面
        this.$Spin.show()
        setTimeout(() => {
          this.$Spin.hide()
        }, 2000)
        this.$router.push({
          path: item.url
        })
      },
      /**
       * @desc 路由跳转
       * @param {Object} e 链接对象
       */
      routeTo: function (e) {
        let temp9 = this.count.find(ele => ele.text === e.text)
        console.log(temp9)
        if (temp9 === undefined) {
          if (e.text !== '首页') {
            this.count.push(e)
            this.rightIconFlag = false
            console.log(this.count)
            sessionStorage.tagList = JSON.stringify(this.count)
          }
        }
        this.$router.push({
          path: e.url
        })
        // 获取tag标签的宽度
        this.$nextTick(function () {
          var width = this.$refs.tagBox_auto.offsetWidth
          var widthBox = this.$refs.tagBox.offsetWidth
          if (widthBox <= width) {
            this.leftIconFlag = true
            this.rightIconFlag = false
            this.maxNum = this.maxNum + 1 // 超出盒子宽度的标签块
            sessionStorage.maxNum = JSON.stringify(this.maxNum)
            $('.tagBox_auto').animate({ left: -this.maxNum * 156 + 'px' }, 'slow')
          } else {
            this.leftIconFlag = false
            this.rightIconFlag = false
          }
        })
      },
      logout: function () {
        this.$store.dispatch('logout')
        this.$router.push({
          name: 'login'
        })
        sessionStorage.tagList = undefined
        sessionStorage.posLeft = undefined
        // sessionStorage.maxNum = undefined
      },
      // 标签左移
      leftIconFun () {
        if (this.time === 0) {
          this.time = this.maxNum
        }
        if (this.time !== 0) {
          this.time = this.time - 1
          $('.tagBox_auto').animate({ left: -this.time * 156 + 'px' }, 'slow')
          this.rightIconFlag = true
          if (-this.time * 156 === 0) {
            this.leftIconFlag = false
          } else {
            this.leftIconFlag = true
          }
        }
      },
      // 标签右移
      rightIconFun () {
        var excessWidth = this.maxNum * 156 // 超出盒子的宽度
        var posLeft = Number($('.tagBox_auto').css('left').slice(0, -2)) // 当前盒子的定位
        console.log(excessWidth, posLeft)
        if (-excessWidth === posLeft) {
          this.rightIconFlag = false
          this.leftIconFlag = true
        } else {
          $('.tagBox_auto').animate({ left: posLeft + -156 + 'px' }, 'slow')
          if (-excessWidth === posLeft + -156) {
            this.rightIconFlag = false
            this.leftIconFlag = true
          } else {
            this.rightIconFlag = true
            this.leftIconFlag = true
          }
        }
      }
    },
    mounted () {
      if (!Util.isEmpty(Util.getCookie('user'))) {
        this.user = JSON.parse(Util.getCookie('user'))
        if (this.user.headPhoto !== '' && this.user.headPhoto !== null) {
          this.headPhoto = this.user.headPhoto
        }
      }
      console.log(this.user)
      this.$store.state.menuList = []
      this.$api.post('/crm/ActionFormUtil/getDataById.do', { tableName: 'db_system_user_position', id: this.user.position_id }, r => {
        console.log(r)
        let positionText = r.data.rows[0].text
        if (positionText === '系统管理员') {
          this.$store.dispatch('updateMenuList')
        } else {
          this.$api.post('/system/user/position/getMenuByPositionId.do', { id: this.user.position_id }, r => {
            this.$store.state.menuList = r.data
          })
        }
      })
      this.$store.dispatch('setSelectData')
      // 存储标签列表
      if (sessionStorage.tagList !== undefined) {
        this.count = JSON.parse(sessionStorage.tagList)
        console.log(this.count)
      }
      // 判断标签的位置
      var widthBoxs = this.$refs.tagBox.offsetWidth
      $('.tagBox_auto').animate({ left: '0px' }, 500)
      this.maxNum = Number(JSON.parse(sessionStorage.maxNum))
      if (this.count.length * 156 > widthBoxs) {
        this.rightIconFlag = true
        this.leftIconFlag = false
      } else {
        this.rightIconFlag = false
        this.leftIconFlag = false
      }
      this.currentPageName = sessionStorage.currentPageName
      this.$Message.config({
        top: 300,
        duration: 3
      })
    },
    watch: {
      '$route' (to) {
        console.log(to)
        this.currentPageName = to.path
        sessionStorage.currentPageName = this.currentPageName
        console.log(this.currentPageName)
      }
    }
  }
</script>
<style lang="scss">
  @import '@/style/style.scss';
</style>
