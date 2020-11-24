<template>
<div>
  <div class="sample-card-left">
    <h3>工具箱</h3>
    <ul>
      <li v-for="(item, index) in frames" :title="item.title" :key="index">
        <drag :transfer-data="item"><img :src="item.img"></drag>
      </li>
    </ul>
    <div @mousedown.stop v-show="currentItem.type !== undefined">
      <h3>设置</h3>
      <Form :model="hotspotSet" :label-width="80">
        <FormItem label="文字说明">
          <Input v-model="hotspotSet.title"></Input>
        </FormItem>
        <FormItem label="样片产品">
          <Select v-model="hotspotSet.product" filterable>
            <Option value="">请选择</Option>
            <Option v-for="(item, index) in productList" :value="item" :key="index">{{item}}</Option>
            <Option value="true">是</Option>
          </Select>
        </FormItem>
      </Form>
      <div class="hotspot-set-button">
        <Button @click="saveHotspot">确定</Button>
        <Button @click="clear">清除</Button>
      </div>
    </div>
  </div>
  <div class="sample-card-center">
    <drop @drop="handleDrop">
      <img ref="cardImg" :src="sampleCard.img" class="sample-card-img" :draggable="false">
      <VueDragResize v-for="(item, index) in hotspots" :isActive="item.active" :isDraggable="!item.lock" :isResizable="!item.lock" :parentLimitation="true" :w="item.width" :h="item.height" :x="item.left" :y="item.top" :minw="1" :minh="1" @activated="onDrag(item, index)" @deactivated="deactivatedItem(index)" @dragstop="dragStop" @resizestop="resizeStop" v-on:contextmenu.native="showContextMenu(item, index, $event)" :data-id="item.id" :key="index">
        <template v-if="item.type === 'rectangle'">
          <div class="hotspot-rectangle"></div>
        </template>
        <template v-else-if="item.type === 'ellipse'">
          <div class="hotspot-ellipse"></div>
        </template>
      </VueDragResize>
    </drop>
    <div class="contextmenu-con" v-show="contextmenuShow" @mouseleave="contextMenuClose" :style="{left: contextMenu.x + 'px', top: contextMenu.y + 'px'}">
      <ul>
        <li v-show="!contextMenuItem.lock" @click="itemLock">锁定</li>
        <li v-show="contextMenuItem.lock" @click="itemUnlock">解锁</li>
        <li @click="itemCopy">复制</li>
        <li @click="delItem(contextMenuItemIndex)">删除</li>
      </ul>
    </div>
  </div>
  <div>
    <Button @click="save" style="margin-bottom: 20px;">保存</Button>
  </div>
</div>
</template>

<script>
import { Drag, Drop } from 'vue-drag-drop'
import VueDragResize from 'vue-drag-resize'
export default {
  props: {
    objJson: String, // 样卡本JSON
    layerid: String
  },
  components: {
    Drag,
    Drop,
    VueDragResize
  },
  data () {
    return {
      sampleCard: {}, // 样卡本
      frames: [ // 热点框
        {
          title: '长方形',
          img: '/img/rectangle.jpg'
        },
        {
          title: '椭圆',
          img: '/img/ellipse.jpg'
        }
      ],
      hotspots: [], // 热点列表
      currentItem: {}, // 当前拖拽对象
      contextMenuItem: {}, // 打开右键菜单的对象
      currentItemIndex: 0, // 当前拖拽对象位置
      contextMenuItemIndex: 0, // 打开右键菜单的对象对象位置
      contextMenu: { // 右键菜单
        x: 0,
        y: 0
      },
      contextmenuShow: false, // 是否显示右键菜单
      showHotspotSet: true, // 设置热点对话框是否显示
      hotspotSet: {}, // 热点设置
      productList: [] // 产品列表
    }
  },
  methods: {
    /**
    * @desc 拖拽完成
    * @param {Object} item 拖拽对象
    */
    handleDrop: function (item, evt) {
      let obj = {}
      if (item.title === '长方形') {
        obj.type = 'rectangle'
      } else if (item.title === '椭圆') {
        obj.type = 'ellipse'
      }
      obj.id = this.hotspots.length
      obj.left = evt.offsetX
      obj.top = evt.offsetY
      obj.width = 100
      obj.height = 100
      obj.active = true
      obj.lock = false
      this.hotspots.push(obj)
      this.currentItem = obj
      this.currentItemIndex = this.hotspots.length - 1
    },
    /**
    * @desc 开始移动
    * @param {Object} item 移动对象
    * @param {Num} index 位置
    */
    onDrag: function (item, index) {
      for (let temp of this.hotspots) {
        temp.active = false
      }
      this.currentItem = {}
      this.$nextTick(function () {
        this.currentItem = item
        this.hotspotSet = { title: item.title, product: item.product }
        this.currentItem.active = true
        this.currentItemIndex = index
      })
    },
    /**
    * @desc 取消选择
    * @param {Num} index 位置
    */
    deactivatedItem: function (index) {
      this.hotspots[index].active = false
      this.currentItem = {}
      this.hotspotSet = {}
    },
    /**
    * @desc 移动结束
    * @param {Object} e 移动数据
    */
    dragStop: function (e) {
      this.currentItem.left = e.left
      this.currentItem.top = e.top
    },
    /**
    * @desc 改变大小结束
    * @param {Object} e 移动数据
    */
    resizeStop: function (e) {
      this.currentItem.left = e.left
      this.currentItem.top = e.top
      this.currentItem.width = e.width
      this.currentItem.height = e.height
    },
    /**
    * @desc 打开右键菜单
    * @param {Object} item 要打开右键菜单的对象
    * @param {Number} index 对象位置
    * @param {Object} event 事件
    */
    showContextMenu: function (item, index, event) {
      event.preventDefault()
      this.contextMenuItem = item
      this.contextMenuItemIndex = index
      this.contextMenu.x = event.offsetX + item.left - 5
      this.contextMenu.y = event.offsetY + item.top - 5
      this.contextmenuShow = true
    },
    /**
    * @desc 关闭右键菜单
    */
    contextMenuClose: function () {
      this.contextmenuShow = false
    },
    /**
    * @desc 对象锁定
    */
    itemLock: function () {
      this.hotspots[this.contextMenuItemIndex].lock = true
      this.contextmenuShow = false
    },
    /**
    * @desc 对象解锁
    */
    itemUnlock: function () {
      this.hotspots[this.contextMenuItemIndex].lock = false
      this.contextmenuShow = false
    },
    /**
    * @desc 对象复制
    */
    itemCopy: function () {
      let temp = JSON.parse(JSON.stringify(this.contextMenuItem))
      temp.id = this.hotspots.length
      temp.left = temp.left - 20
      temp.top = temp.top - 20
      this.hotspots.push(temp)
      this.contextmenuShow = false
    },
    /**
    * @desc 删除对象
    * @param {Number} index 对象位置
    */
    delItem: function (index) {
      this.hotspots.splice(index, 1)
      this.contextmenuShow = false
      this.currentItem = {}
    },
    /**
    * @desc 保存热点设置
    */
    saveHotspot: function () {
      this.currentItem.title = this.hotspotSet.title
      this.currentItem.product = this.hotspotSet.product
    },
    clear: function () {},
    save: function () {
      let obj = {
        hotspots: this.hotspots,
        card: {
          width: this.$refs.cardImg.width,
          height: this.$refs.cardImg.height
        }
      }
      localStorage.setItem('hotspots', JSON.stringify(obj))
    }
  },
  mounted () {
    this.sampleCard = JSON.parse(this.objJson)
  }
}
</script>

<style lang="scss">
.sample-card-left{
  float: left;
  width: 2.2rem;
  text-align: center;
  li{
    img{
      width: 100%;
    }
  }
}
.sample-card-center{
  float: left;
  width: calc(100% - 2.2rem);
  position: relative;
}
.hotspot-rectangle, .hotspot-ellipse{
  border: 1px dashed #999;
  width: 100%;
  height: 100%;
}
.hotspot-ellipse{
  border-radius: 50%;
}
.vdr{
  border: none;
}
.contextmenu-con{
  position: absolute;
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
.hotspot-set-button{
  text-align: center;
}
.sample-card-img{
  width: 100%;
}
</style>
