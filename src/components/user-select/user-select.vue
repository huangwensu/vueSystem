<template>
    <el-dialog :title="title" :visible="visible" :show-close="false" class="cw-com">
      <el-form :inline="true" :model="sFromData" class="demo-form-inline">
        <el-form-item label="人员姓名">
          <el-input v-model="sFromData.name" size="small" placeholder="人员姓名 ..." style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="人员状态">
          <el-select v-model="sFromData.status" size="small" placeholder="请选择" style="width:120px">
            <el-option
              v-for="item in userStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="search" @click.stop="search"> 查询</el-button>
          <el-button type="default" size="small" icon="search" @click.stop="reset"> 重置</el-button>
        </el-form-item>
        <div >
          <div class="sel-tree" style="overflow:auto;">
            <organization-tree-user
              treeName="devTreeSelect"
              showCheckbox
              @on-node-selected="onNodeSelected">
            </organization-tree-user>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="cancel">取 消</el-button>
        <el-button type="primary" @click.stop="confirm">确 定</el-button>
      </div>
    </el-dialog>
</template>
<script>
import modelApi from '@/api/class/user/user'
import OrganizationTreeUser from '@/components/organization-tree/organization-tree-user'
import * as cUtil from '@/utils/common'
let vm = null

export default {
  components: {
    OrganizationTreeUser
  },
  name: 'UserSelect',
  props: {
    showCheckbox: true,
    title: {
      type: String,
      default: '选择人员'
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
      },
      treeData: [
        {
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      userStatus: [{
        value: '',
        label: '全部'
      }, {
        value: '1',
        label: '有效'
      }, {
        value: '0',
        label: '无效'
      }]
    }
  },
  computed: {

  },
  watch: {
    /* visible (oldVal, newVal){
        console.log('in visible ...', newVal);
        if(!newVal){
            //vm.visible = false
            vm.$destroy()
        }
    }*/
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
      // let params = cUtil.mergePageProps(vm);
      const params = {}
      params.userType = 1
      modelApi.getPageList(params).then(response => {
        console.log('in getPageList ...')
        vm.tableDatas = response.data.data
        // vm.pageProps.total = response.data.totalRows
        vm.listLoading = false
      })
    },
    show() {
      vm.visible = true
    },

    hide() {
      vm.visible = false
    },

    confirm() {
      const selectNodes = vm.$refs.userTree.getCheckedNodes(vm.leafOnly)
      vm.$emit('confirm', selectNodes)
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
