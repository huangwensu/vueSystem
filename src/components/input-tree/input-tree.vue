<template>
  <div >
    <el-input :id="treeName"
      v-model="name" 
      icon="caret-top" 
      :class="{'is-reverse':!isShow}" 
      readonly 
      @click.stop.native.stop="inputClick">
    </el-input>
    <div class="input-tree-wrap" v-show="isShow">
      <el-tree :ref="treeName" class="cw-tree"
        :data="treeData"
        highlight-current
        node-key="id"
        default-expand-all
        :props="defaultProps"
        @click.stop.native.stop
        @node-click="nodeClick"
        >
      </el-tree>
    </div>
  </div>
</template>
<script>
import modelApi from '@/api/class/organization/organization-list'
// import * as cUtil from '@/utils/common'
let vm = null

export default {
  name: 'InputTree',
  props: {
    defaultKey: {
      type: String,
      default: ''
    },
    defaultVal: {
      type: String,
      default: ''
    },
    eventName: {
      type: String,
      default: 'on-node-selected'
    },
    treeName: {
      type: String,
      default: 'orgTree'
    }
  },
  data() {
    return {
      name: '',
      isShow: false,
      currentNode: null,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },

  // 实例创建勾子
  created: function() {
    vm = this
    vm.g_search()
  },
  mounted() {
    vm.$refs[vm.treeName].setCurrentKey(vm.defaultKey)
    vm.name = vm.defaultVal
  },
  methods: {
    // 查询
    g_search() {
      modelApi.getAllOrgTree({}).then(response => {
        /* defaultTree[0].children = response.data
        vm.treeData = defaultTree */
        vm.treeData = response.data
      })
    },
    show() {
      vm.isShow = true
    },
    hide() {
      vm.isShow = false
    },
    inputClick(value, node, v) {
      vm.isShow = !vm.isShow
    },
    setCurrentKey(key) {
      console.log('in setCurrentKey')
      vm.$refs[vm.treeName].setCurrentKey(key)
    },
    getCurrentNode() {
      console.log('in getCurrentNode')
      return vm.$refs[vm.treeName].getCurrentKey() // vm.currentNode
    },
    nodeClick(node, value, v) {
      console.log(node, value, v, vm.eventName)
      vm.currentNode = node
      vm.name = node.name
      vm.$refs[vm.treeName].setCurrentNode(node)
      vm.isShow = false
      vm.$emit(vm.eventName, node)
    }
  },
  beforeDestroy() {
    vm = undefined
  }
}
</script>

<style scoped>
  .input-tree-wrap .cw-tree{
    height: 200px;
    padding: 20px;
    border-radius: 4px;
    border: 1px solid gainsboro;
  }

  .input-tree-wrap{
    position: absolute;
    bottom: 40px;
    width: 100%;    
  }

  .input-tree-wrap-down{
    position: absolute;
    top: 40px;
    width: 100%;    
  }

</style>
