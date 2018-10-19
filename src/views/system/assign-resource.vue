<template>
  <div>
    <el-card class="box-card cw-tree-table">
      <div class="app-container">
        <div style="margin-bottom:20px;">
          <el-button icon="el-icon-plus" type="success" @click.stop="authResourceRefCreate()" size="small"> 设 置</el-button>
        </div>
        <zk-table style="font-size:13px;"
          ref="orgTable"
          sum-text="sum"
          index-text="序号"
          :data="data"
          :columns="columns"
          :stripe="props.stripe"
          :border="props.border"
          :show-header="props.showHeader"
          :show-summary="props.showSummary"
          :show-row-hover="props.showRowHover"
          :show-index="props.showIndex"
          :tree-type="props.treeType"
          :is-fold="props.isFold"
          :expand-type="props.expandType"
          :selection-type="props.selectionType">
          <template slot="type" slot-scope="scope">
            {{ scope.row.type | formatResTypeLabel }}
          </template>          
          <template slot="status" slot-scope="scope">
            {{ scope.row.status | formatStatus }}
          </template>          
          <template slot="remark" slot-scope="scope">
            {{ scope.row.remark }}
          </template>          
        </zk-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import modelApi from '@/api/class/system/resource-manage'
import ZkTable from 'vue-table-with-tree-grid'

let vm = null

export default {
  // 使用自定义组件
  components: {
    ZkTable
  },
  data() {
    return {
      resourId: '',
      resourceName: '',
      g_listLoading: false,
      props: {
        stripe: false,
        border: true,
        showHeader: true,
        showSummary: false,
        showRowHover: true,
        showIndex: true,
        treeType: true,
        isFold: false,
        expandType: false,
        selectionType: true
      },
      data: [],
      columns: [
        {
          label: '名称',
          prop: 'cname',
          width: '400px'
        },
        {
          label: '类型',
          prop: 'resourceType',
          minWidth: '80px',
          maxWidth: '160px',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '描述',
          prop: 'remark',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '链接',
          prop: 'url',
          minWidth: '200px',
          maxWidth: '300px'
        },
        {
          label: '优先级',
          prop: 'resourceOrder',
          minWidth: '200px',
          maxWidth: '300px'
        },
        {
          label: '是否可用',
          prop: 'status',
          minWidth: '200px',
          maxWidth: '300px'
        }
      ]
    }
  },
  // 实例创建勾子
  created: function() {
    vm = this
    const query = vm.$router.history.current.query
    if (query.id) {
      vm.authorizationId = query.id
      vm.resourceName = query.name
      // vm.queryResByAuthId(query.id)
    }
    vm.g_search()
  },
  mounted: function() {

  },
  methods: {
    authResourceRefCreate() {
      var checkedProps = vm.$refs.orgTable.getCheckedProp('id')
      vm.g_listLoading = true
      modelApi.authResourceRefCreate({ 'authorizationId': vm.authorizationId, 'resourceIds': checkedProps }).then(response => {
        vm.g_listLoading = false
        vm.$router.push({ path: '/system/authority-manage' })
      })
    },
    // 查询所有
    g_search() {
      vm.g_listLoading = true
      modelApi.getResouceManage().then(response => {
        this.getCheckedData(response.data)
        vm.g_listLoading = false
      })
    },
    // 获取已经设置的资源
    getCheckedData(orginData) {
      var authId = vm.authorizationId
      modelApi.getAllResTreeByAuthId(authId).then(response => {
        vm.data = vm.setCheckedForAuthData(orginData, response.data)
      })
    },
    // 将原有数据设置_isChecked
    setCheckedForAuthData(orginData, authData) {
      for (let i = 0; i < orginData.length; i++) {
        if (vm.isInAuthData(authData, orginData[i].code)) {
          orginData[i]._isChecked = true
        }
        if (orginData[i].children && orginData[i].children.length > 0) {
          vm.setCheckedForAuthData(orginData[i].children, authData)
        }
      }
      return orginData
    },
    // 判断是否已经设置的
    isInAuthData(authData, code) {
      for (let i = 0; i < authData.length; i++) {
        if (authData[i].resourceCode === code) {
          return true
        }
      }
      return false
    }
  }
}
</script>
<style scoped>
th.zk-table__header-cell.zk-table--border-cell{
  text-align: center;
}
.cw-tree-table {
  font-size: 14px !important;
}
.options-action {
  color:#409EFF;
  font-size:12px;
  margin-right:6px;
}
</style>
