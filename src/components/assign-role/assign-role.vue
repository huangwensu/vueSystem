<template>
    <el-dialog :title="title" :visible="visible" :show-close="false" class="cw-com">
      <el-transfer
        :titles="['待选角色', '已选角色']"
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
import modelApi from '@/api/class/authority/role'
// import * as cUtil from '@/utils/common'
let vm = null

export default {
  name: 'AssignRole',
  props: {
    title: {
      type: String,
      default: '分配角色'
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
    vm.search()
  },

  mounted() {
    this.search()
  },
  methods: {

    // 分页查询
    search() {
      vm.listLoading = true
      modelApi.getList({ status: 0 }).then(response => {
        vm.data = vm.generateData(response.data)
        console.log('in getPageList ...1')
        vm.listLoading = false
      })
    },

    // 根据角色Id获取设置的资源
    getRolesByUserId(userId) {
      vm.listLoading = true
      modelApi.getRolesByUserId({ userId: userId }).then(response => {
        vm.seletedRoles = vm.generateAuthData(response.data)
        // vm.seletedRoles = ['e2a2a3a6523741e494d6ceae843a7ec4']
        console.log(response.data)
        vm.listLoading = false
      })
    },

    // 格式化原始数据
    generateData(resData) {
      const relData = []
      if (resData && resData.length >= 0) {
        resData.forEach((authItem, index) => {
          relData.push({
            label: authItem.name,
            key: authItem.id
          })
        })
      }
      return relData
    },

    generateAuthData(resData) {
      const relData = []
      if (resData && resData.length >= 0) {
        resData.forEach((authItem, index) => {
          relData.push(authItem.id)
        })
      }
      return relData
    },

    show(userId) {
      console.log(userId)
      vm.userId = userId
      vm.visible = true
      vm.getRolesByUserId(userId)
    },

    hide() {
      vm.visible = false
      // vm.$destroy()
    },

    confirm() {
      vm.$emit('confirm', { roleIds: vm.seletedRoles, userId: vm.userId })
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
