import Component from '../share/Component'
import BaseChart from './BaseChart'
import BarChart from './BarChart'
import LineChart from './LineChart'
import PieChart from './PieChart'
import RingChart from './RingChart'
import defaults from 'licia/defaults'
import { Object, Any } from 'ts-toolbelt'
import { px } from './util'

interface ITitle {
  text: string
  font?: string
  color?: string
  position?: 'top' | 'bottom'
  top?: number
  bottom?: number
}

interface IPadding {
  left?: number
  right?: number
  top?: number
  bottom?: number
}

interface IData {
  labels: string[]
  datasets: any[]
}

interface IOptions {
  type?: string
  bgColor?: string
  title?: ITitle
  padding?: IPadding
  data: IData
}

export = class Chart extends Component {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  private chart: BaseChart
  private options: Object.Required<IOptions, Any.Key, 'deep'>
  constructor(
    container: HTMLElement,
    { type = 'bar', bgColor = '#fff', title, data, padding }: IOptions
  ) {
    super(container, { compName: 'chart' })

    title = title || { text: '' }
    defaults(title, {
      font: `bold ${px(18)}px Arial`,
      color: '#666',
      position: 'top',
      top: px(10),
      bottom: px(5),
    })

    padding = padding || {}
    defaults(padding, {
      left: px(50),
      right: px(10),
      top: px(60),
      bottom: px(50),
    })

    this.options = {
      type,
      bgColor,
      title: title as Required<ITitle>,
      padding: padding as Required<IPadding>,
      data,
    }

    this.initCanvas()
    this.initChart()
    this.draw()
  }
  getOption(name: string) {
    return (this.options as any)[name]
  }
  draw() {
    this.drawBg()
    this.drawTitle()
    this.chart.draw()
  }
  private drawTitle() {
    const { ctx } = this
    const { title } = this.options
    const { width, height } = this.canvas
    if (!title.text) {
      return
    }

    ctx.beginPath()
    ctx.font = title.font
    ctx.fillStyle = title.color
    ctx.textAlign = 'center'
    if (title.position === 'top') {
      ctx.textBaseline = 'top'
      ctx.fillText(title.text, width / 2, title.top)
    } else {
      ctx.textBaseline = 'bottom'
      ctx.fillText(title.text, width / 2, height - title.bottom)
    }
  }
  private drawBg() {
    const { ctx } = this
    const { width, height } = this.canvas

    ctx.fillStyle = this.options.bgColor
    ctx.fillRect(0, 0, width, height)
  }
  private initChart() {
    switch (this.options.type) {
      case 'bar':
        this.chart = new BarChart(this)
        break
      case 'line':
        this.chart = new LineChart(this)
        break
      case 'pie':
        this.chart = new PieChart(this)
        break
      case 'ring':
        this.chart = new RingChart(this)
        break
    }
  }
  private initCanvas() {
    let canvas: HTMLCanvasElement

    if (this.container.tagName === 'CANVAS') {
      canvas = this.container as HTMLCanvasElement
    } else {
      canvas = document.createElement('canvas')
      const { width, height } = this.$container.offset()
      canvas.width = px(width)
      canvas.height = px(height)
      this.$container.append(canvas)
    }

    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    this.canvas = canvas
  }
}
