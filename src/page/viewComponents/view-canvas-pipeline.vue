<template>
<div>
  <canvas :id="'canvasCon' + index" :width="this.width" :height="this.height"></canvas>
</div>
</template>

<script>
export default {
  props: {
    width: Number,
    height: Number,
    index: Number,
    color: String, // 管道颜色
    pipelineColor: String, // 管道背景色
    pipelineHeight: Number, // 管道宽度
    val: String
  },
  data () {
    return {
      canvas: '',
      ctx: '',
      waters: [], // 块列表
      moveX: 4, // 移动距离
      waterWidth: 60, // 块宽度
      space: 30, // 块之间距离
      timer: ''
    }
  },
  methods: {
    init: function () {
      this.ctx = this.canvas.getContext('2d')
      this.drawPipeline()
      console.log(this.val)
    },
    drawPipeline: function () {
      this.initWater()
      this.updateWater()
      this.drawWater()
      const that = this
      if (this.timer) {
        window.clearInterval(this.timer)
      }
      this.timer = window.setInterval(function () {
        that.updateWater()
        that.drawWater()
      }, 40)
    },
    // 根据宽度初始化每个块
    initWater: function () {
      let num = this.width / (this.waterWidth + this.space) + 1
      this.waters = []
      for (let i = 0; i < num; i++) {
        let obj = {
          fromX: i * (this.waterWidth + this.space),
          toX: (i + 1) * this.waterWidth + i * this.space
        }
        this.waters.push(obj)
      }
    },
    updateWater: function () {
      // 每个块位置加移动距离
      for (const iterator of this.waters) {
        iterator.fromX = iterator.fromX + this.moveX
        iterator.toX = iterator.toX + this.moveX
      }
      // 如果最后一个块的起始位置大于整个宽度加间距，删除最后一个，头部加入一个新块
      if (this.waters[this.waters.length - 1].fromX > (this.width + this.space)) {
        this.waters.splice(this.waters.length - 1, 1)
        this.waters.unshift({
          fromX: this.waters[0].fromX - (this.waterWidth + this.space),
          toX: this.waters[0].toX - (this.waterWidth + this.space)
        })
      }
      // console.log(JSON.stringify(this.waters))
    },
    drawWater: function () {
      this.ctx = this.canvas.getContext('2d')
      this.ctx.fillStyle = this.pipelineColor
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.ctx.fillRect(0, 0, this.width, this.pipelineHeight)
      for (const iterator of this.waters) {
        this.ctx.beginPath()
        this.ctx.moveTo(iterator.fromX, this.pipelineHeight / 2)
        this.ctx.lineTo(iterator.toX, this.pipelineHeight / 2)
        this.ctx.strokeStyle = this.color
        this.ctx.lineWidth = this.pipelineHeight - 2
        // this.ctx.lineCap = 'round'
        this.ctx.stroke()
        this.ctx.closePath()
      }
    }
  },
  mounted () {
    this.canvas = document.getElementById('canvasCon' + this.index)
    if (!this.canvas.getContext) return
    this.init()
  },
  watch: {
    val: function (newVal, oldVal) {
      const that = this
      this.$nextTick(function () {
        that.init()
      })
    }
  }
}
</script>

<style>

</style>
