<template>
  <div >
    <div>
      <el-tree :ref="treeName" class="cw-tree"
        :data="treeData"
        highlight-current
        node-key="id"
        default-expand-all
        show-checkbox
        :expand-on-click-node=false
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
let vm = null
const defaultTree = [{ id: '', name: '全部', children: [] }]
export default {
  name: 'UserSelect',
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
      default: 'organizationTree'
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
        defaultTree[0].children = response.data
        vm.treeData = defaultTree
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
    getCurrentNode() {
      console.log('in getCurrentNode')
      return vm.$refs[vm.treeName].getCurrentKey() // vm.currentNode
    },
    nodeClick(node, value, v) {
      console.log(node)
      vm.currentNode = node
      vm.name = node.label
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
