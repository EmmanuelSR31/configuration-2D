<template>
<div>
  <canvas :id="'canvasCon' + index" :width="width" :height="height"></canvas>
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
      }, 100)
    },
    // 根据宽度初始化每个块
    initWater: function () {
      let num = (this.width + this.height - this.pipelineHeight) / (this.waterWidth + this.space) + 1
      this.waters = []
      for (let i = 0; i < num; i++) {
        let fromX = -this.waterWidth + i * (this.waterWidth + this.space)
        let toX = i * (this.waterWidth + this.space)
        let fromY = this.pipelineHeight / 2
        let toY = this.pipelineHeight / 2
        // 如果起始位置X大于整体宽度减一半管道宽度，起始位置X设为整体宽度减一半管道宽度
        if (fromX > (this.width - this.pipelineHeight / 2)) {
          fromX = this.width - this.pipelineHeight / 2
        }
        // 如果截止位置X大于整体宽度，截止位置X设为整体宽度减一半管道宽度，截至位置Y设为原本截止位置X减整体宽度
        if (toX > this.width) {
          toX = this.width - this.pipelineHeight / 2
          toY = i * (this.waterWidth + this.space) - this.width
        }
        // 截至位置Y大于块宽度，起始位置Y设为截至位置Y减块宽度
        if (toY > this.waterWidth) {
          fromY = toY - this.waterWidth
        }
        this.waters.push({
          fromX: fromX,
          toX: toX,
          fromY: fromY,
          toY: toY
        })
      }
    },
    updateWater: function () {
      for (const iterator of this.waters) {
        // 如果起始位置X小于等于整体宽度减一半管道宽度，起始位置X加移动距离
        if (iterator.fromX <= (this.width - this.pipelineHeight / 2)) {
          iterator.fromX = iterator.fromX + this.moveX
          // 如果起始位置X大于整体宽度减一半管道宽度，起始位置X设为整体宽度减一半管道宽度
          if (iterator.fromX > (this.width - this.pipelineHeight / 2)) {
            iterator.fromX = this.width - this.pipelineHeight / 2
          }
        }
        // 截止位置X加移动距离
        iterator.toX = iterator.toX + this.moveX
        // 如果截止位置X小于等于整体宽度减一半管道宽度
        if (iterator.toX <= this.width - this.pipelineHeight / 2) {
          /* if (iterator.toX > this.width) {
            iterator.toX = this.width - this.pipelineHeight / 2
            iterator.toY = iterator.toY + this.moveX
          } */
        } else {
          // 截止位置X设为整体宽度减一半管道宽度，截止位置Y加移动距离
          iterator.toX = this.width - this.pipelineHeight / 2
          iterator.toY = iterator.toY + this.moveX
        }
        // 截止位置Y大于块宽度，起始位置Y设为截止位置Y减块宽度
        if (iterator.toY > this.waterWidth) {
          iterator.fromY = iterator.toY - this.waterWidth
        } else {
          // 起始位置Y设为一半管道宽度
          iterator.fromY = this.pipelineHeight / 2
        }
      }
      // 如果最后一个块的起始位置大于整个高度加间距，删除最后一个，头部加入一个新块
      if (this.waters[this.waters.length - 1].fromY > (this.height + this.space)) {
        this.waters.splice(this.waters.length - 1, 1)
        this.waters.unshift({
          fromX: this.waters[0].fromX - this.waterWidth - this.space,
          toX: this.waters[0].toX - this.waterWidth - this.space,
          fromY: this.pipelineHeight / 2,
          toY: this.pipelineHeight / 2
        })
      }
    },
    drawWater: function () {
      this.ctx = this.canvas.getContext('2d')
      this.ctx.clearRect(0, 0, this.width, this.height)
      this.ctx.beginPath()
      this.ctx.strokeStyle = this.pipelineColor
      this.ctx.moveTo(0, this.pipelineHeight / 2)
      this.ctx.lineTo(this.width - this.pipelineHeight / 2, this.pipelineHeight / 2)
      this.ctx.lineTo(this.width - this.pipelineHeight / 2, this.height)
      this.ctx.lineWidth = this.pipelineHeight
      this.ctx.stroke()
      this.ctx.closePath()
      this.ctx.strokeStyle = this.color
      this.ctx.lineWidth = this.pipelineHeight - 2
      for (const iterator of this.waters) {
        this.ctx.beginPath()
        this.ctx.moveTo(iterator.fromX, iterator.fromY)
        // 如果块拐弯
        if (iterator.toY > (this.pipelineHeight / 2) && iterator.fromX < (this.width - this.pipelineHeight / 2)) {
          this.ctx.lineTo(this.width - this.pipelineHeight / 2, this.pipelineHeight / 2)
        }
        this.ctx.lineTo(iterator.toX, iterator.toY)
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
