<template>
<div ref="con" style="height: 100%;position: relative;">
  <div :style="{width: basicSettings.width + 'px', height: basicSettings.height + 'px'}">
    <div class="view-config-con" :style="{backgroundColor: basicSettings.backColor, transform: 'scale(' + widthScale + ',' + heightScale + ')'}">
      <div v-for="(item, index) in items" class="svg-div config-view-item" :style="itemStyle(item)" :data-id="item.id" :key="index">
        <template v-if="item.type === 'device'">
          <img :src="item.img" :id="item.id">
        </template>
        <template v-else-if="item.type === 'chart'">
          <template v-if="item.class === 'switch'">
            <switch1 :obj="item" :index="index"></switch1>
          </template>
          <template v-else-if="item.class === 'value'">
            <sensor-value :obj="item" :val="item.val" :index="index"></sensor-value>
          </template>
          <template v-else-if="item.class === 'led'">
            <led :obj="item" :val="item.val" :index="index"></led>
          </template>
          <template v-else-if="item.class === 'echart-line'">
            <echart-line :obj="item" :width="item.width" :height="item.height" :whiteFlag="item.whiteFlag" :smoothFlag="item.smoothFlag" :areaFlag="item.areaFlag" :dataZoom="item.dataZoom" :markLine="item.markLine" :stackFlag="item.stackFlag" :index="index"></echart-line>
          </template>
          <template v-else-if="item.class === 'echart-bar'">
            <echart-bar :obj="item" :width="item.width" :height="item.height" :whiteFlag="item.whiteFlag" :dataZoom="item.dataZoom" :transverse="item.transverse" :stackFlag="item.stackFlag" :index="index"></echart-bar>
          </template>
          <template v-else-if="item.class === 'echart-pie'">
            <echart-pie :obj="item" :width="item.width" :height="item.height" :whiteFlag="item.whiteFlag" :annular="item.annular" :index="index"></echart-pie>
          </template>
          <template v-else-if="item.class === 'echart-gauge'">
            <echart-gauge :obj="item" :val="item.val" :index="index"></echart-gauge>
          </template>
        </template>
        <template v-else-if="item.type === 'text'">
          {{item.text}}
        </template>
        <template v-else-if="item.type === 'datetime'">
          {{nowDatetime}}
        </template>
        <template v-else-if="item.type === 'weather'">
          <div class="drag-weather-con">
            <template v-if="item.class === 1">
              <iframe width="200" scrolling="no" height="60" frameborder="0" allowtransparency="true" src="//i.tianqi.com/index.php?c=code&id=12&icon=1&num=1&site=12"></iframe>
            </template>
            <template v-else-if="item.class === 2">
              <iframe width="300" scrolling="no" height="20" frameborder="0" allowtransparency="true" src="//i.tianqi.com/index.php?c=code&id=1&icon=1&wind=1&num=1&site=12"></iframe>
            </template>
            <template v-else-if="item.class === 3">
              <iframe width="320" scrolling="no" height="120" frameborder="0" allowtransparency="true" src="//i.tianqi.com/index.php?c=code&id=19&icon=1&temp=1&num=1&site=12"></iframe>
            </template>
            <template v-else-if="item.class === 4">
              <iframe width="640" scrolling="no" height="60" frameborder="0" allowtransparency="true" src="//i.tianqi.com/index.php?c=code&id=12&icon=1&num=5&site=12"></iframe>
            </template>
            <div class="drag-weather-mask"></div>
          </div>
        </template>
        <template v-else-if="item.type === 'link'">
          <a :href="item.href" target="_blank" :style="{color: item.color}">{{item.text}}</a>
        </template>
        <template v-else-if="item.type === 'img'">
          <div class="svg-img-con">
            <img :src="item.img" :id="item.id" :style="svgImgStyle(item)">
          </div>
        </template>
        <template v-else-if="item.type === 'pip-h'">
          <pipeline :width="item.width" :height="item.height" :color="item.color" :pipelineColor="item.pipelineColor" :pipelineHeight="item.pipelineHeight" :val="item.val" :index="index"></pipeline>
        </template>
        <template v-else-if="item.type === 'pip-corner'">
          <pipeline-corner :width="item.width" :height="item.height" :color="item.color" :pipelineColor="item.pipelineColor" :pipelineHeight="item.pipelineHeight" :val="item.val" :index="index"></pipeline-corner>
        </template>
        <template v-else-if="item.type === 'progress'">
          <progress-bar :obj="item" :index="index"></progress-bar>
        </template>
        <template v-else-if="item.type === 'liquidfill'">
          <liquidfill :obj="item" :val="item.val" :index="index"></liquidfill>
        </template>
        <template v-else-if="item.type === 'upload'">
          <img :src="uploadIp + '/v2/upDown/preview?id=' + item.uploadId" :id="item.id">
        </template>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Util from '@/utils/index'
import pipeline from '../viewComponents/view-canvas-pipeline.vue'
import pipelineCorner from '../viewComponents/view-canvas-pipeline-corner.vue'
import progressBar from '../viewComponents/view-progress-bar.vue'
import liquidfill from '../viewComponents/view-liquidfill.vue'
import switch1 from '../viewComponents/view-switch1.vue'
import sensorValue from '../viewComponents/view-sensor-value.vue'
import led from '../viewComponents/view-led.vue'
import echartLine from '../viewComponents/view-echart-line.vue'
import echartBar from '../viewComponents/view-echart-bar.vue'
import echartPie from '../viewComponents/view-echart-pie.vue'
import echartGauge from '../viewComponents/view-echart-gauge.vue'
export default {
  name: 'viewConfiguration',
  props: {
    id: String,
    dataJson: String
  },
  components: {
    pipeline,
    pipelineCorner,
    progressBar,
    liquidfill,
    switch1,
    sensorValue,
    led,
    echartLine,
    echartBar,
    echartPie,
    echartGauge
  },
  data () {
    return {
      items: [],
      basicSettings: { // 基本设置
        name: '',
        cover: '',
        width: 0,
        height: 0,
        adapt: false,
        backColor: 'rgba(255,255,255,0)'
      },
      nowDatetime: '', // 当前时间
      widthScale: 1, // 宽度比例
      heightScale: 1, // 高度比例
      sensorIds: [], // 传感器id列表
      sensorItems: [], // 有传感器的组件列表
      uploadIp: this.$store.state.uploadIp, // 上传ip地址
      timer: '' // 定时器
    }
  },
  methods: {
    /**
    * @desc 初始化
    */
    init: function () {
      if (!Util.isEmpty(localStorage.configJson)) {
        let temp = JSON.parse(localStorage.configJson)
        // localStorage.configJson = ''
        this.initConfig(temp)
      } else {
        this.$api.put('/v2/apps/graphics/selOpenGraphics', {}, r => {
          if (r.data.status) {
            let temp = JSON.parse(r.data.data.graphicsJson)
            this.initConfig(temp)
          }
        })
      }
    },
    /**
    * @desc 初始化组态
    * @param {Object} temp 数据
    */
    initConfig: function (temp) {
      this.basicSettings = temp.basicSettings
      // 页面自适应
      if (this.basicSettings.adapt) {
        let w = this.$refs.con.clientWidth
        let h = this.$refs.con.clientHeight
        this.widthScale = this.$math.divide(w, this.basicSettings.width)
        this.heightScale = this.$math.divide(h, this.basicSettings.height)
      }
      this.items = temp.items
      this.getSensorIds()
    },
    /**
    * @desc 获取所有传感器id
    */
    getSensorIds: function () {
      for (const iterator of this.items) {
        if (!Util.isEmpty(iterator.sensorId)) {
          this.sensorIds.push(iterator.sensorId)
          this.sensorItems.push(iterator)
        }
      }
      // console.log(this.sensorIds)
      const that = this
      if (this.sensorIds.length > 0) {
        this.getSensorData()
        this.timer = window.setInterval(that.getSensorData, 3000)
      }
    },
    /**
    * @desc 获取传感器数据
    */
    getSensorData: function () {
      /* this.$api.put('/v2/apps/graphics/putSensorData', { sensorJson: this.sensorIds.join(',') }, r => {
        // console.log(r)
        if (r.data.status) {
          for (const iterator of r.data.data) {
            for (const key in iterator) {
              if (iterator.hasOwnProperty(key)) {
                let item = this.sensorItems.find(ele => ele.sensorId === key)
                if (item !== undefined) {
                  this.$set(item, 'val', iterator[key])
                }
              }
            }
          }
        }
      }) */
      this.$api.put('/v2/apps/graphics/putSensorData', { sensorJson: this.sensorIds.join(',') }, r => {
        // console.log(r)
        if (r.data.status) {
          /* for (const iterator of this.sensorItems) {
            let arr = []
            let ids = []
            if (iterator.sensorId instanceof Array) {
              ids = iterator.sensorId
            } else {
              ids.push(iterator.sensorId)
            }
            // console.log(ids)
            for (const item of ids) {
              for (const itm of r.data.data) {
                for (const key in itm) {
                  if (itm.hasOwnProperty(key)) {
                    if (key === item) {
                      arr.push(itm[key])
                    }
                  }
                }
              }
            }
            this.$set(iterator, 'val', arr.join(','))
            // console.log(iterator.val)
          } */
          for (const iterator of r.data.data) {
            for (const item of this.sensorItems) {
              let arr = []
              let ids = []
              if (item.sensorId instanceof Array) {
                ids = item.sensorId
              } else {
                ids.push(item.sensorId)
              }
              for (const itm of ids) {
                for (const key in iterator) {
                  if (iterator.hasOwnProperty(key)) {
                    if (key === itm) {
                      arr.push(iterator[key])
                    }
                  }
                }
              }
              this.$set(item, 'val', arr.join(','))
            }
          }
        }
      })
    },
    /**
    * @desc 生成样式
    * @param {Object} item 要生成样式的对象
    */
    itemStyle: function (item) {
      let temp = {
        width: item.width + 'px',
        height: item.height + 'px',
        top: item.top + 'px',
        left: item.left + 'px',
        backgroundColor: item.backColor,
        borderWidth: item.borderWidth + 'px',
        borderStyle: item.borderStyle,
        borderColor: item.borderColor,
        borderRadius: item.borderRadius + 'px',
        opacity: item.transparency / 10,
        transform: `rotate(${item.rotate}deg)`
      }
      if (['text', 'datetime', 'link'].includes(item.type)) {
        temp.fontSize = item.fontSize + 'px'
        temp.fontWeight = item.fontWeight
        temp.fontStyle = item.fontStyle
        temp.textDecoration = item.textDecoration
        temp.color = item.color
        temp.textAlign = item.textAlign
      }
      if (['progress', 'liquidfill'].includes(item.type)) {
        delete temp.backgroundColor
      }
      if (['pip-corner'].includes(item.type)) {
        temp.transform = item.rotateX ? `rotateX(180deg) rotate(${item.rotate}deg)` : `rotateX(0deg) rotate(${item.rotate}deg)`
      }
      return temp
    },
    /**
    * @desc 生成svg图片样式
    * @param {Object} item 要生成样式的对象
    */
    svgImgStyle: function (item) {
      let temp = {
        width: `${item.width}px`,
        height: `${item.height}px`,
        filter: `drop-shadow(${item.color} ${item.width}px 0)`,
        position: 'relative',
        left: `-${item.width}px`
      }
      return temp
    },
    /**
    * @desc 更新当前时间
    */
    setNowDatetime: function () {
      let date = new Date()
      this.nowDatetime = date.toLocaleString('zh', { hour12: false })
    }
  },
  mounted () {
    const that = this
    // 时间实时更新
    window.setInterval(that.setNowDatetime, 1000)
    this.init()
  }
}
</script>

<style lang="scss">
@import "../../style/configuration";
.config-view-item{
  position: absolute;
}
.view-config-con{
  position: absolute;
  left: 0;
  top: 0;
}
</style>
