import map from 'licia/map'
import max from 'licia/max'
import toStr from 'licia/toStr'
import BaseChart from './BaseChart'
import { px } from './util'

export default class BarChart extends BaseChart {
  private yEqual = 5
  private yLen = 0
  private xLen = 0
  private ySpace = 0
  private axisColor = '#666'
  private gridColor = '#eee'
  draw() {
    this.beforeDraw()
    this.drawXAxis()
    this.drawYAxis()
    this.drawBars()
  }
  private beforeDraw() {
    const { chart } = this
    const { width, height } = chart.canvas
    const padding = chart.getOption('padding')
    const { labels } = chart.getOption('data')
    this.xLen = Math.floor(
      (width - padding.left - padding.right - px(10)) / labels.length
    )
    this.yLen = Math.floor(
      (height - padding.top - padding.bottom - px(10)) / this.yEqual
    )
    this.ySpace = this.getYSpace()
  }
  private getYSpace() {
    const { datasets } = this.chart.getOption('data')

    let maxNum = 0
    map(datasets, (dataset: any) => {
      maxNum = max(max(...dataset.data), maxNum)
    })

    const len = Math.ceil(maxNum / this.yEqual)
    let pow = toStr(len).length - 1
    pow = pow > 2 ? 2 : pow
    return Math.ceil(len / Math.pow(10, pow)) * Math.pow(10, pow)
  }
  private drawXAxis() {
    const { chart } = this
    const { ctx, canvas } = chart
    const padding = chart.getOption('padding')
    const { labels } = chart.getOption('data')

    const y: number = canvas.height - padding.bottom + 0.5
    ctx.beginPath()
    ctx.strokeStyle = this.axisColor
    ctx.moveTo(padding.left, y)
    ctx.lineTo(canvas.width - padding.right, y)
    ctx.stroke()

    ctx.beginPath()
    ctx.font = `${px(12)}px Microsoft YaHei`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillStyle = this.axisColor

    for (let i = 0, len = labels.length; i < len; i++) {
      const text = labels[i]
      const x = padding.left + this.xLen * (i + 1) + 0.5
      const y = canvas.height - padding.bottom
      ctx.strokeStyle = this.gridColor
      ctx.moveTo(x, y)
      ctx.lineTo(x, padding.top + px(10))
      ctx.stroke()

      ctx.fillText(text, x - this.xLen / 2, y + px(5))
    }
  }
  private drawYAxis() {
    const { chart, yEqual } = this
    const { ctx, canvas } = chart
    const padding = chart.getOption('padding')

    const x: number = padding.left - 0.5
    ctx.beginPath()
    ctx.strokeStyle = this.axisColor
    ctx.moveTo(x, canvas.height - padding.bottom + 0.5)
    ctx.lineTo(x, padding.top + 0.5)
    ctx.stroke()

    ctx.beginPath()
    ctx.font = `${px(12)}px Microsoft YaHei`
    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = this.axisColor

    for (let i = 0; i < yEqual; i++) {
      const x = padding.left
      const y = canvas.height - padding.bottom - this.yLen * (i + 1) + 0.5
      ctx.strokeStyle = this.gridColor
      ctx.moveTo(x, y)
      ctx.lineTo(canvas.width - padding.right - px(10), y)
      ctx.stroke()

      ctx.fillText(toStr(this.ySpace * (i + 1)), x - px(10), y)
    }
  }
  private drawBars() {
    const { chart } = this
    const { ctx, canvas } = chart
    const { datasets } = chart.getOption('data')
    const padding = chart.getOption('padding')

    const len = datasets.length
    const space = this.xLen / (len + 1)
    const ratio = this.yLen / this.ySpace

    for (let i = 0; i < len; i++) {
      const { bgColor, data } = datasets[i]
      ctx.fillStyle = bgColor
      for (let j = 0, len = data.length; j < len; j++) {
        const x = padding.left + this.xLen * j + space * (i + 1 / 2)
        const height = data[j] * ratio
        const y = canvas.height - padding.bottom - height
        ctx.fillRect(x, y, space, height)
      }
    }
  }
}
