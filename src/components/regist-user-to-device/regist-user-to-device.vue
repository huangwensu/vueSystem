<template>
    <el-dialog :title="title" :visible="visible" :show-close="false" class="cw-com">
      <el-row type="flex" justify="space-between">
        <el-col :span="12" style="margin-right: 2px">
          <el-form :inline="true" :model="sFromData" class="demo-form-inline">
            <el-form-item label="机构名称">
              <el-input v-model="sFromData.name" size="small" placeholder="人员名称 ..." style="width:160px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" icon="search" @click.stop="search"> 查询</el-button>
              <el-button type="warning" size="small" icon="search" @click.stop="reset"> 重置</el-button>
            </el-form-item>
              <div class="sel-tree" style="overflow:auto;">
                <organization-tree 
                  ref="userTree1"
                  treeName="devTreeSelect"
                  showCheckbox
                  @on-node-selected="onNodeSelected">
                </organization-tree>
              </div>
          </el-form>
        </el-col>
        <el-col :span="12" style="margin-left: 2px">
          <el-form :inline="true" :model="sFromData" class="demo-form-inline">
            <el-form-item label="设备名称">
              <el-input v-model="sFromData.name" size="small" placeholder="人员名称 ..." style="width:160px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" icon="search" @click.stop="search"> 查询</el-button>
              <el-button type="warning" size="small" icon="search" @click.stop="reset"> 重置</el-button>
            </el-form-item>
            <div >
              <div class="sel-tree" style="overflow:auto;">
                <organization-tree-dev 
                  ref="userTree2"
                  treeName="orgTreeSelect"
                  @on-node-selected="onNodeSelected">
                </organization-tree-dev>
              </div>
            </div>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="cancel">取 消</el-button>
        <el-button type="primary" @click.stop="confirm">确 定</el-button>
      </div>
    </el-dialog>
</template>
<script>
import * as cUtil from '@/utils/common'
// import { OrganizationTree, OrganizationTreeDev } from '@/components/organization-tree'
import OrganizationTree from '@/components/organization-tree/organization-tree'
import OrganizationTreeDev from '@/components/organization-tree/organization-tree-dev'
let vm = null

export default {
  components: {
    OrganizationTree,
    OrganizationTreeDev
  },
  showCheckbox: true,
  name: 'RegistUserToDevice',
  props: {
    title: {
      type: String,
      default: '注册人员到设备'
    },
    leafOnly: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      sFromData: {
        userType: 1,
        name: '',
        orgname: '',
        status: ''
      }
    }
  },
  computed: {

  },
  watch: {

  },

  // 实例创建勾子
  created: function() {
    vm = this
    vm.search()
  },

  mounted() {

  },
  methods: {
    onNodeSelected(node) {
      // vm.g_sFormData.orgId = node.id
      // vm.g_search()
      console.log('in onNodeSelected', node)
    },
    // 重置查询表单
    reset() {
      cUtil.reset(vm)
      vm.search()
    },

    // 分页查询
    search() {
      vm.listLoading = true
      // const params = cUtil.mergePageProps(vm);
      const params = {}
      params.userType = 1
      /* modelApi.getPageList(params).then(response => {
        console.log('in getPageList ...')
        vm.listLoading = false
      }) */
    },
    show() {
      vm.visible = true
    },

    hide() {
      vm.visible = false
    },

    confirm() {
      const select1Nodes = vm.$refs.userTree1.getCheckedNodes(vm.leafOnly)
      // const select2Nodes = vm.$refs.userTree2.getCheckedNodes(vm.leafOnly)
      vm.$emit('confirm', select1Nodes)
    },

    cancel() {
      vm.$emit('cancel')
    }
  },
  beforeDestroy() {
    vm = undefined
  }
}
</script>
<style scoped>

</style>
