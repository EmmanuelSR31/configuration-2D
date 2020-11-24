<template>
<div ref="cardCon">
  <div v-for="(item, index) in list" class="view-sample-card" :key="index">
    <img :src="item.img">
    <a href="http://www.baidu.com" v-for="(itm, index) in hotspots" class="view-hotspot" :class="itm.type === 'rectangle' ? 'hotspot-rectangle' : 'hotspot-ellipse'" :style="hotspotStyle(itm)" :key="index"></a>
  </div>
</div>
</template>

<script>
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
      ],
      hotspots: [], // 热点列表
      card: {},
      widthScale: 1, // 宽度比例
      heightScale: 1 // 高度比例
    }
  },
  methods: {
    /**
    * @desc 热点样式
    * @param {Object} item 热点对象
    */
    hotspotStyle: function (item) {
      let temp = {
        left: item.left * this.widthScale + 'px',
        top: item.top * this.widthScale + 'px',
        width: item.width * this.widthScale + 'px',
        height: item.height * this.widthScale + 'px'
      }
      return temp
    }
  },
  mounted () {
    let obj = JSON.parse(localStorage.hotspots)
    this.card = obj.card
    this.hotspots = obj.hotspots
    let w = this.$math.divide(this.$refs.cardCon.clientWidth, 4)
    this.widthScale = this.$math.divide(w, this.card.width)
  }
}
</script>

<style lang="scss">
.view-sample-card{
  float: left;
  width: 25%;
  margin-right: 10px;
  position: relative;
  img{
    width: 100%;
  }
}
.view-hotspot{
  position: absolute;
}
</style>
