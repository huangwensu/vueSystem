<template>
  <div :style="{width:tableWidth}" class='autoTbale'>
    <table class="table table-bordered" id='hl-tree-table'>
      <thead>
        <tr>
          <th v-for="(column, index) in cloneColumns" :style="column.style" :key="column.type">
            <label v-if="column.type === 'orderNum'">
                序号
            </label>
            <label v-else-if="column.type === 'selection'">
                <input type="checkbox" v-model="checks" @click.stop="handleCheckAll">
            </label>
            <label v-else>
                {{ renderHeader(column, index) }}
                <span class="cw-table-sort" v-if="column.sortable">
                    <i class="caret-top" :class="{on: column._sortType === 'asc'}" @click.stop.native="handleSort(index, 'asc')"></i>
                    <i class="caret-bottom" :class="{on: column._sortType === 'desc'}" @click.stop.native="handleSort(index, 'desc')"></i>
                </span>
            </label>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in initItems" :key="item.id" v-show="show(item)" :class="{'child-tr':item.parent}">
          <td v-for="(column, snum) in columns" :key="column.key" :style=column.style>
            <label v-if="column.type === 'orderNum'">
              {{index + 1}}
            </label>
            <label v-else-if="column.type === 'selection'">
              <input type="checkbox" :value="item.id" v-model="checkGroup">
            </label>
            <div v-else-if="column.type === 'action'">
              <el-button 
                v-for='action in (column.actions)' 
                :icon="action.icon || 'edit'" 
                :type="action.type" 
                :style="action.style" 
                :size="action.btnSize || 'small'" 
                @click.stop="RowClick(item,$event,index,action.text)" 
                :key="action.text">{{action.text}}
              </el-button>
            </div>
            <label @click.stop="toggle(index,item)" v-if="!column.type">
              <span v-if='snum==1'>
                <!-- <i v-html='item.spaceHtml'></i> -->
                <i v-html='item.spaceHtml'></i>
                <i v-if="item.children&&item.children.length>0" 
                    :class="{'el-icon-caret-right':!item.expanded,'el-icon-caret-bottom':item.expanded }"></i>
                <i v-else class="ms-tree-space"></i>
              </span> 
              <span v-html='renderBody(item,column)'></span>
            </label>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'TreeGrid',
  props: {
    columns: Array,
    items: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      initItems: [],    // 处理后数据数组
      cloneColumns: [], // 处理后的表头数据
      checkGroup: [],   // 复选框数组
      checks: false,    // 全选
      screenWidth: document.body.clientWidth, // 自适应宽
      tdsWidth: 0,      // td总宽
      timer: false,     // 控制监听时长
      dataLength: 0     // 树形数据长度
    }
  },
  computed: {
    tableWidth() {
      return this.tdsWidth > this.screenWidth && this.screenWidth > 0
        ? this.screenWidth + 'px'
        : '100%'
    }
  },
  watch: {
    screenWidth(val) {
      if (!this.timer) {
        this.screenWidth = val
        this.timer = true
        setTimeout(() => {
          this.timer = false
        }, 400)
      }
    },
    items() {
      if (this.items) {
        this.dataLength = this.Length(this.items)
        this.initData(this.deepCopy(this.items), 1, null)
        console.log('this.initItems', this.initItems)
        this.checkGroup = this.renderCheck(this.items)
        if (this.checkGroup.length === this.dataLength) {
          this.checks = true
        } else {
          this.checks = false
        }
      }
    },
    columns: {
      handler() {
        this.cloneColumns = this.makeColumns()
      },
      deep: true
    },
    checkGroup(data) {
      this.checkAllGroupChange(data)
    }
  },
  mounted() {
    if (this.items) {
      this.dataLength = this.Length(this.items)
      this.initData(this.deepCopy(this.items), 1, null)
      this.cloneColumns = this.makeColumns()
      this.checkGroup = this.renderCheck(this.items)
      if (this.checkGroup.length === this.dataLength) {
        this.checks = true
      } else {
        this.checks = false
      }
    }
    // 绑定onresize事件 监听屏幕变化设置宽
    this.$nextTick(() => {
      this.screenWidth = document.body.clientWidth
    })
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        this.screenWidth = window.screenWidth
      })()
    }
  },
  methods: {
    // 设置td宽度,td的align
    tdStyle(column) {
      var style = {}
      if (column.align) {
        style['text-align'] = column.align
      }
      if (column.width) {
        style['min-width'] = column.width + 'px'
      }
      return style
    },

    // 排序事件
    handleSort(index, type) {
      this.cloneColumns.forEach(col => (col._sortType = 'normal'))
      if (this.cloneColumns[index]._sortType === type) {
        this.cloneColumns[index]._sortType = 'normal'
      } else {
        this.cloneColumns[index]._sortType = type
      }
      this.$emit(
        'on-sort-change',
        this.cloneColumns[index]['key'],
        this.cloneColumns[index]['_sortType']
      )
    },
    // 点击某一行事件
    RowClick(data, event, index, text) {
      const result = this.makeData(data)
      this.$emit('on-row-click', result, event, index, text)
    },
    // 点击事件 返回数据处理
    makeData(data) {
      const t = typeof data
      let o
      if (t === 'array') {
        o = []
      } else if (t === 'object') {
        o = {}
      } else {
        return data
      }

      if (t === 'array') {
        for (let i = 0; i < data.length; i++) {
          o.push(this.makeData(data[i]))
        }
      } else if (t === 'object') {
        for (const i in data) {
          if (
            i !== 'spaceHtml' &&
            i !== 'parent' &&
            i !== 'level' &&
            i !== 'expanded' &&
            i !== 'isShow' &&
            i !== 'load'
          ) {
            o[i] = this.makeData(data[i])
          }
        }
      }
      return o
    },
    // 处理表头数据
    makeColumns() {
      const columns = this.deepCopy(this.columns)
      this.tdsWidth = 0
      columns.forEach((column, index) => {
        column._index = index
        column._width = column.width ? column.width : ''
        column._sortType = 'normal'
        this.tdsWidth += column.width ? parseFloat(column.width) : 0
      })
      return columns
    },
    // 数据处理 增加自定义属性监听
    initData(items, level, parent) {
      this.initItems = []
      let spaceHtml = ''
      for (var i = 1; i < level; i++) {
        spaceHtml += '<i class="ms-tree-space"></i>'
      }
      items.forEach((item, index) => {
        item = Object.assign({}, item, {
          parent: parent,
          level: level,
          spaceHtml: spaceHtml
        })
        if (typeof item.expanded === 'undefined') {
          item = Object.assign({}, item, {
            expanded: false
          })
        }
        if (typeof item.show === 'undefined') {
          item = Object.assign({}, item, {
            isShow: false
          })
        }
        item = Object.assign({}, item, {
          load: !!item.expanded
        })
        this.initItems.push(item)
        if (item.children && item.expanded) {
          this.initData(item.children, level + 1, item)
        }
      })
    },
    //  隐藏显示
    show(item) {
      return (
        item.level === 1 || (item.parent && item.parent.expanded && item.isShow)
      )
    },
    toggle(index, item) {
      const level = item.level + 1
      let spaceHtml = ''
      for (var i = 1; i < level; i++) {
        spaceHtml += '<i class="ms-tree-space"></i>'
      }
      if (item.children) {
        if (item.expanded) {
          item.expanded = !item.expanded
          this.close(index, item)
        } else {
          item.expanded = !item.expanded
          if (item.load) {
            this.open(index, item)
          } else {
            item.load = true
            item.children.forEach((child, childIndex) => {
              this.initItems.splice(index + childIndex + 1, 0, child)
              // 设置监听属性
              this.$set(this.initItems[index + childIndex + 1], 'parent', item)
              this.$set(this.initItems[index + childIndex + 1], 'level', level)
              this.$set(
                this.initItems[index + childIndex + 1],
                'spaceHtml',
                spaceHtml
              )
              this.$set(this.initItems[index + childIndex + 1], 'isShow', true)
              this.$set(
                this.initItems[index + childIndex + 1],
                'expanded',
                false
              )
            })
          }
        }
      }
    },
    open(index, item) {
      if (item.children) {
        item.children.forEach((child, childIndex) => {
          child.isShow = true
          if (child.children && child.expanded) {
            this.open(index + childIndex + 1, child)
          }
        })
      }
    },
    close(index, item) {
      if (item.children) {
        item.children.forEach((child, childIndex) => {
          child.isShow = false
          if (child.children) {
            this.close(index + childIndex + 1, child)
          }
        })
      }
    },
    // checkbox 全选 选择事件
    handleCheckAll() {
      this.checks = !this.checks
      console.log('handleCheckAll this.checks', this.checks)
      if (this.checks) {
        this.checkGroup = []
      } else {
        this.checkGroup = this.getArray(
          this.checkGroup.concat(this.All(this.items))
        )
      }
      this.$emit('on-selection-change', this.checkGroup)
    },
    // 数组去重
    getArray(a) {
      var hash = {}
      var len = a.length
      var result = []
      for (var i = 0; i < len; i++) {
        if (!hash[a[i]]) {
          hash[a[i]] = true
          result.push(a[i])
        }
      }
      console.log('getArray result', result)
      return result
    },
    checkAllGroupChange(data) {
      console.log('checkAllGroupChange data.length', data.length)
      console.log('checkAllGroupChange this.dataLength', data.dataLength)
      if (this.dataLength > 0 && data.length === this.dataLength) {
        this.checks = true
      } else {
        this.checks = false
      }
      this.$emit('on-selection-change', this.checkGroup)
    },
    All(data) {
      let arr = []
      data.forEach(item => {
        arr.push(item.id)
        if (item.children && item.children.length > 0) {
          arr = arr.concat(this.All(item.children))
        }
      })
      return arr
    },
    // 返回树形数据长度
    Length(data) {
      let length = data.length
      data.forEach(child => {
        if (child.children) {
          length += this.Length(child.children)
        }
      })
      return length
    },
    // 返回表头
    renderHeader(column, $index) {
      if ('renderHeader' in this.columns[$index]) {
        return this.columns[$index].renderHeader(column, $index)
      } else {
        return column.title || '#'
      }
    },

    // 返回内容
    renderBody(row, column, index) {
      if (column.render) {
        return column.render(row, column)
      } else {
        return row[column.key]
      }
    },
    // 默认选中
    renderCheck(data) {
      let arr = []
      data.forEach(item => {
        if (item._checked) {
          arr.push(item.id)
        }
        if (item.children && item.children.length > 0) {
          arr = arr.concat(this.renderCheck(item.children))
        }
      })
      return arr
    },
    // 深度拷贝函数
    deepCopy(data) {
      var t = this.type(data)
      var o
      var i
      var ni
      if (t === 'array') {
        o = []
      } else if (t === 'object') {
        o = {}
      } else {
        return data
      }
      if (t === 'array') {
        for (i = 0, ni = data.length; i < ni; i++) {
          o.push(this.deepCopy(data[i]))
        }
        return o
      } else if (t === 'object') {
        for (i in data) {
          o[i] = this.deepCopy(data[i])
        }
        return o
      }
    },
    type(obj) {
      var toString = Object.prototype.toString
      var map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
      }
      return map[toString.call(obj)]
    }
  },
  beforeDestroy() {
    window.onresize = null
  }
}
</script>
<style scoped>
.autoTbale {
  overflow: auto;
  font-size: 14px;
  color: #48576a;
}

.autoTbale table {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
}

.autoTbale .table-bordered {
  border: 1px solid #ebebeb;
}

.autoTbale .table > tbody > tr > td,
.autoTbale .table > tbody > tr > th,
.autoTbale .table > thead > tr > td,
.autoTbale .table > thead > tr > th {
  border-top: 1px solid #e7eaec;
  line-height: 1.42857;
  padding: 2px 6px;
  vertical-align: middle;
}

.autoTbale .table-bordered > tbody > tr > td,
.autoTbale .table-bordered > tbody > tr > th,
.autoTbale .table-bordered > tfoot > tr > td,
.autoTbale .table-bordered > tfoot > tr > th,
.autoTbale .table-bordered > thead > tr > td,
.autoTbale .table-bordered > thead > tr > th {
  border: 1px solid #e7e7e7;
}

.autoTbale .table > thead > tr > th {
  border-bottom: 1px solid #ddd;
}

.autoTbale .table-bordered > thead > tr > td,
.autoTbale .table-bordered > thead > tr > th {
  background-color: #eef1f6;
  color: #48576a;
}

.autoTbale .table-bordered > thead > tr > th {
    padding: 5px 0;
    background: #f9f9f9;
}

#hl-tree-table > tbody > tr {
  background-color: #fff;
}

#hl-tree-table > tbody > .child-tr {
  background-color: #fff;
}

.autoTbale label {
  margin: 0 8px;
}

.autoTbale .ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 14px;
  height: 14px;
}

.autoTbale .ms-tree-space::before {
  content: "";
}

#hl-tree-table th > label {
  margin: 0;
}
.zk-table {
  font-size: 14px !important;
}
</style>
