<template>
<div>
  <div class="location-con">
    <div class="location-btn">
      <a href="javascript:void(0)" @click="addConfig"><img src="/img/add.png">新增</a>
      <a href="javascript:void(0)" @click="changePage(1)"><img src="/img/refresh.png">刷新</a>
    </div>
  </div>
  <ul class="config-list">
    <li v-for="(item, index) in data" :key="index">
      <div class="config-li-img-con">
        <template v-if="item.coverChart === '' || item.coverChart === undefined || item.coverChart === null">
          <img src="/img/config-temp.png">
        </template>
        <template v-else>
          <img :src="item.coverChart">
        </template>
        <div class="config-li-title">{{item.title}}</div>
      </div>
      <div class="config-li-btn">
        <a @click="editConfig(item)">编辑</a><a @click="viewConfig(item)">预览</a><a @click="delConfig(item)">删除</a><a @click="publishConfig(item)">发布</a>
      </div>
      <div v-show="item.publishingLogo === 1" class="config-li-icon">已发布</div>
    </li>
  </ul>
  <div class="clear"></div>
  <div class="page-con">
    <Page :total="totalRows" :current="currentPage" :page-size="pageSize" placement="top" @on-change="changePage" show-total show-elevator></Page>
  </div>
  <Modal v-model="baseModal" width="380" title="基本信息" footer-hide :mask-closable="false">
    <div class="base-modal-con">
      <Form :model="currentItem" :label-width="80">
        <FormItem label="应用封面" class="config-cover">
          <Upload :action="'http://111.85.150.76:9001/files/upload'" accept="image/*" :format="['jpg', 'jpeg', 'png', 'gif', 'bmp']" :show-upload-list="false" :on-success="handleSuccess">
            <template v-if="currentItem.cover === '' || currentItem.cover === null || currentItem.cover === undefined">
              <img src="/img/config-temp.png">
            </template>
            <template v-else>
              <img :src="currentItem.cover">
            </template>
          </Upload>
          （支持自定义/大小264*177,500K以内支持jpg,png,bmp,gif ）
        </FormItem>
        <FormItem label="应用名称">
          <Input v-model="currentItem.name"></Input>
        </FormItem>
        <div class="text-center form-btn-con">
          <button @click="addNext">下一步</button>
        </div>
      </Form>
    </div>
  </Modal>
  <Modal v-model="editModal" class="config-modal" fullscreen footer-hide :mask-closable="false">
    <edit-configuration ref="editConfiguration" :method="modalMethod" :dataJson="JSON.stringify(currentItem)" @save-success="changePage(1)"></edit-configuration>
  </Modal>
</div>
</template>

<script>
import Util from '@/utils/index'
import editConfiguration from '../configurationManage/editConfiguration.vue'
export default {
  components: {
    editConfiguration
  },
  data () {
    return {
      loading: false, // 加载中
      currentPage: 1, // 当前页码
      pageSize: 13, // 每页显示数
      totalRows: 0, // 数据总数
      data: [],
      currentItem: {}, // 当前数据
      editModal: false, // 编辑对话框是否显示
      modalMethod: '', // 编辑对话框方法
      baseModal: false // 基本信息对话框是否显示
    }
  },
  computed: {
    tableHeight: function () { // 表格高度
      return document.body.clientHeight - 180
    }
  },
  methods: {
    /**
    * @desc 改变页码
    * @param {Num} current 页码
    */
    changePage: async function (current) {
      this.loading = true
      this.currentPage = current
      this.$api.put('/v2/apps/graphics/pageObtainData', { limit: this.pageSize, page: this.currentPage }, r => {
        console.log(r)
        if (r.data.status) {
          this.totalRows = r.data.data.total
          this.data = r.data.data.records
        }
        this.loading = false
      })
    },
    /**
    * @desc 改变每页显示数
    * @param {Num} size 每页显示数
    */
    changePageSize: function (size) {
      this.pageSize = size
      this.changePage(this.currentPage)
    },
    /**
    * @desc 新增数据
    */
    addConfig: function () {
      this.currentItem = { id: '' }
      this.baseModal = true
    },
    /**
    * @desc 新增下一步
    */
    addNext: function () {
      if (Util.isEmpty(this.currentItem.name)) {
        this.$swal('请填写应用名称', '', 'error')
      } else {
        this.modalMethod = 'add'
        this.editModal = true
        this.baseModal = false
        this.$refs.editConfiguration.init('add', '')
      }
    },
    /**
    * @desc 修改数据
    * @param {Object} item 修改的数据对象
    */
    editConfig: function (item) {
      this.modalMethod = 'edit'
      this.editModal = true
      this.$refs.editConfiguration.init('edit', item.id)
    },
    /**
    * @desc 预览
    * @param {Object} item 预览的数据对象
    */
    viewConfig: function (item) {
      let temp = JSON.parse(item.graphicsJson)
      let obj = { basicSettings: temp.basicSettings, items: temp.items }
      localStorage.configJson = JSON.stringify(obj)
      let routeUrl = this.$router.resolve({
        path: 'viewConfig'
      })
      window.open(routeUrl.href)
    },
    /**
    * @desc 删除数据
    * @param {Object} item 删除的数据对象
    */
    delConfig: function (item) {
      this.$Modal.confirm({
        title: '',
        content: '确认删除此数据？',
        onOk: () => {
          this.$api.delete('/v2/apps/graphics/del?id=' + item.id, {}, r => {
            if (r.data.status) {
              this.$Message.success('删除成功')
              this.changePage(1)
            } else {
              this.$swal('删除失败', '', 'error')
            }
          })
        },
        onCancel: () => {
        }
      })
    },
    /**
    * @desc 发布数据
    * @param {Object} item 发布的数据对象
    */
    publishConfig: function (item) {
      this.$api.post('/v2/apps/graphics/updGrapicsStatus', { id: item.id }, r => {
        if (r.data.status) {
          this.$Message.success('发布成功')
          this.changePage(1)
        } else {
          this.$swal('发布失败', '', 'error')
        }
      })
    },
    /**
    * @desc 上传成功
    * @param {Array} res 返回数据
    */
    handleSuccess: function (res) {
      this.$set(this.currentItem, 'cover', res.data)
    },
    /**
    * @desc 初始化
    */
    init: function () {
      this.changePage(1)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss">
@import "../../style/configuration";
.config-list{
  li{
    float: left;
    width: 15.66%;
    margin-right: 1%;
    margin-bottom: 20px;
    position: relative;
    overflow: hidden;
  }
}
@media (max-width: 1600px){
  .config-list li{
    width: 19%;
  }
}
@media (max-width: 1300px){
  .config-list li{
    width: 24%;
  }
}
.config-li-img-con{
  position: relative;
  img{
    width: 100%;
    height: 177px;
  }
}
.config-li-icon{
  position: absolute;
  top: 10px;
  right: -25px;
  width: 100px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  color: #fff;
  background-color: #2d8cf0;
  transform: rotate(45deg);
}
.config-li-title{
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 36px;
  line-height: 36px;
  text-align: center;
  color: #fff;
  font-size: .15rem;
  background-color: rgba(0, 0, 0, .68);
}
.config-li-btn{
  padding: 12px 0 0 0;
  background-color: #fff;
  a{
    display: inline-block;
    width: 25%;
    height: 18px;
    line-height: 18px;
    text-align: center;
    font-size: .13rem;
    margin-bottom: 12px;
    border-right: 1px solid #dedede;
    &:last-child{
      border-right: none;
    }
  }
}
</style>
