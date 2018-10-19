<template>
    <el-dialog :title="title" :visible="visible" :show-close="false" class="cw-com">
      <el-transfer
        :titles="['待选权限', '已选权限']"
        v-model="seletedRoles"
        :data="data">
      </el-transfer>

      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="cancel">取 消</el-button>
        <el-button type="primary" @click.stop="confirm">确 定</el-button>
      </div>
    </el-dialog>
</template>
<script>
import modelApi from '@/api/class/system/role-manage'
// import * as cUtil from '@/utils/common'
let vm = null

export default {
  name: 'AssignAuthority',
  props: {
    title: {
      type: String,
      default: '分配权限'
    }
  },
  data() {
    return {
      visible: false,
      data: [],
      seletedRoles: []
    }
  },
  // 实例创建勾子
  created: function() {
    vm = this
    //vm.search()
  },

  mounted() {
    //this.search()
  },
  methods: {
    // 分页查询
    // search() {
    //   vm.listLoading = true
    //   modelApi.getRoleAuthManage({ status: 0 }).then(response => {
    //     vm.data = vm.generateData(response.data)
    //     console.log('in getPageList ...1')
    //     vm.listLoading = false
    //   })
    // },

    // 根据角色Id获取设置的资源
    getListByRoleId(roleId) {
      vm.listLoading = true
      modelApi.getRoleAuthManage({ t:'1',id: roleId }).then(response => {
        vm.data = vm.generateData(response.data)
        vm.seletedRoles = vm.generateAuthData(response.data)
        vm.listLoading = false
      })
    },

    // 待选择的权限
    generateData(resData) {
      const relData = []
      if (resData) {
        var auths = resData.auths;
        for(var i=0;i<auths.length;i++)
          relData.push({
            label: auths[i].cname,
            key: auths[i].id
          })
        
      }
      return relData
    },

    //已有的权限
    generateAuthData(resData) {
      const relData = []
      if (resData) {
          var selectAuths = resData.selectAuths;
          for(var i=0;i<selectAuths.length;i++){
            relData.push(selectAuths[i].id)
          } 
      }
      return relData
    },

    show(roleId) {
      vm.roleId = roleId
      vm.visible = true
      vm.getListByRoleId(roleId)
    },

    hide() {
      vm.visible = false
      // vm.$destroy()
    },

    confirm() {
      vm.$emit('confirm', { authorizationIds: vm.seletedRoles, roleId: vm.roleId })
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

  .cw-com .el-checkbox__inner{
    height: 13px;
    /* width: 16px */
  }
  .cw-com .el-transfer{
    margin-left: 10%;
    /* text-align: center; */
  }

  .cw-com .el-transfer-panel{
    width: 40%;
    text-align: left;
  }

  .cw-com .el-transfer-panel .el-transfer-panel__header{
    color: #6c6c6c;
    font-weight: 600;
  }

</style>
