import Component from '../share/Component'
import stripIndent from 'licia/stripIndent'
import $ from 'licia/$'
import Toolbar from './Toolbar'
import Selection from './Selection'
import isArr from 'licia/isArr'
import h from 'licia/h'
import concat from 'licia/concat'

interface IOptions {
  toolbar?: string[] | Toolbar
}

export = class Editor extends Component {
  selection: Selection
  toolbar: Toolbar
  private $content: $.$
  private content: HTMLElement
  static Toolbar = Toolbar
  constructor(
    container: Element,
    { toolbar = concat(Toolbar.defaultActions, ['fullscreen']) }: IOptions = {}
  ) {
    super(container, { compName: 'editor' })

    const html = this.$container.html()

    this.initTpl()

    this.$content = this.find('.content')
    this.content = this.$content.get(0) as HTMLElement

    this.selection = new Selection()

    if (isArr(toolbar)) {
      const toolbarContainer = h('div')
      this.container.prepend(toolbarContainer)
      this.toolbar = new Toolbar(toolbarContainer, {
        actions: toolbar as string[],
      })
    } else {
      this.toolbar = toolbar as Toolbar
    }
    this.toolbar.init(this)

    this.$content.html(html)

    this.bindEvent()
  }
  html() {
    return this.$content.html()
  }
  exec(command: string, val?: string) {
    document.execCommand(command, false, val)
    this.focus()
  }
  focus() {
    this.content.focus()
  }
  destroy() {
    this.toolbar.destroy()
    super.destroy()
  }
  private bindEvent() {
    this.$content
      .on('keyup', this.onContentKeyUp)
      .on('mouseup', this.onContentMouseUp)
  }
  private onContentKeyUp = () => {
    this.toolbar.update()
  }
  private onContentMouseUp = () => {
    this.toolbar.update()
  }
  private initTpl() {
    this.$container.html(
      this.c(stripIndent`
      <div class="body">
        <div class="content" contenteditable></div>
      </div>
    `)
    )
  }
}
