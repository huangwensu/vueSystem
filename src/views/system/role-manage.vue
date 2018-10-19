<template>
  <div>
    <el-card class="box-card cw-tree-table">
      <div class="app-container">
        <el-form :inline="true" :model="g_sFormData" class="demo-form-inline" size="small">
          <el-button icon="el-icon-plus" type="success" @click.stop="g_preAdd(false)" size="small"> 新增</el-button>
          <el-button icon="el-icon-delete" type="danger" @click.stop="g_disableById(false)" size="small"> 批量禁用</el-button>
          <el-button icon="el-icon-delete" type="danger" @click.stop="g_enableById(false)" size="small"> 批量启用</el-button>
          <el-button style="margin-right:60px;" icon="el-icon-delete" type="danger" @click.stop="g_deleteById(false)" size="small"> 批量删除</el-button>
          <el-form-item label="角色名称">
            <el-input v-model="g_sFormData.name" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色英文名">
            <el-input v-model="g_sFormData.ename" placeholder="请输入角色英文名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click.stop="g_search"> 查询</el-button>
            <el-button type="default" icon="el-icon-refresh" @click.stop="g_reset"> 重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="multipleTable"
          :data="g_tableDatas"
          tooltip-effect="dark"
          style="width: 100%"
          border fit highlight-current-row
          element-loading-text="Loading..."
          @selection-change="changeFun">
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column type="selection" width="55" align="center" :selectable="selectable"></el-table-column>
          <el-table-column prop="role.cname" label="角色名" width="120" align="center"></el-table-column>
          <el-table-column prop="role.ename" label="角色英文名" width="120" align="center"></el-table-column>
          <el-table-column prop="createUserName" label="创建人" width="120" align="center"></el-table-column>
          <el-table-column label="状态" width="120" align="center">
            <template slot-scope="scope">
              {{ scope.row.role.status | formatStatus }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center">
            <template slot-scope="scope"> 
              {{ scope.row.role.createTime | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="lastUpdateUserName" label="最后更新人" align="center"></el-table-column>
          <el-table-column label="最后更新时间" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              {{ scope.row.role.lastUpdateTime | formatDate }}
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="操作" width="300" align="center">
            <template slot-scope="scope">
              <span class="options-action">
                <i class="el-icon-edit"></i><a href="javascript:;" @click.stop="optionsAction(1,scope.row)">编辑</a>
              </span>
              <span class="options-action" v-if="scope.row.createUserName">
                <i class="el-icon-remove-outline"></i><a href="javascript:;" @click.stop="optionsAction(2, scope.row)">禁用</a>
              </span>
              <span class="options-action" v-if="scope.row.createUserName">
                <i class="el-icon-delete"></i><a href="javascript:;" @click.stop="optionsAction(3, scope.row)">删除</a>
              </span>
              <span class="options-action">
                <i class="el-icon-setting"></i><a href="javascript:;" @click.stop="beforeAssignAuthority(scope.row)">角色权限</a>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="block" style="float:right;margin-top:20px;">
          <el-pagination
            :small=false           
            :page-size="g_pageProps.rowsOfPage"
            :current-page="g_pageProps.currentPage"
            layout="total, prev, pager, next"
            :total="g_pageProps.total">
          </el-pagination>
        </div>
      </div>
    </el-card>
    <el-dialog :title="g_addOrModifyTitle" :visible.sync="g_showDialog">
      <el-form label-position="right" :rules="g_rules" ref="vForm" :model="g_mFormData" label-width="125px" width="400px"> 
        <el-form-item label="角色名" prop="cname">
          <el-input v-model="g_mFormData.cname"></el-input>
        </el-form-item>
        <el-form-item label="英文名" prop="ename">
          <el-input v-model="g_mFormData.ename"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="g_showDialog = false">取 消</el-button>
        <el-button type="primary" @click.stop="g_addOrUpdateAction">确 定</el-button>
      </div>
    </el-dialog>
    <assign-authority ref="assignAuthorityRef" @cancel="cancelAssignAuthority" @confirm="confirmAssignAuthority"></assign-authority>
  </div>
</template>

<script>
import modelApi from '@/api/class/system/role-manage'
import * as CONS from '@/utils/constants'
import * as cUtil from '@/utils/crud-util'
import AssignAuthority from '@/components/assign-authority/assign-authority'

let vm = null

export default {
  components:{
    AssignAuthority
  },
  data() {
    return {
      resourId: '',
      resourceName: '',
      treeShow: false,
      g_addOrModifyTitle: '新增',
      g_listLoading: false,
      g_showDialog: false,
      g_keepParent:false,
      multipleSelection:[],
      rowsId:[],
      g_sFormData: {
        name: ''
      },
      g_tableDatas: [],
      props: {
        border: true
      },
      g_mFormData: {
        cname: '',
        ename:''
      },
      g_rules: {
        cname: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ]
      },
      g_pageProps: {
        currentPage: 1,
        rowsOfPage: CONS.PAGE_SIZE,
        total: 0
      }
    }
  },

  // 实例创建勾子
  created: function() {
    vm = this
    vm.g_search()
  },

  methods: {
    //设置权限弹框
    beforeAssignAuthority(row){
      vm.$refs.assignAuthorityRef.show(row.id)
    },
    confirmAssignAuthority(){
      vm.$refs.assignAuthorityRef.hide()
    },
    cancelAssignAuthority(roleAuthorData){
      vm.g_listLoading = true
      // modelApi.addRoleAuthorizationRef(roleAuthorData).then(response => {
      //   vm.g_listLoading = false
      //   vm.$refs.assignAuthorityRef.hide()
      // })
      vm.$refs.assignAuthorityRef.hide()
    },
    //表格CheckBox设置disabled
    selectable(row,index) {
        if(!row.createUserName){
            return false
        }else {
            return true
        }
    },
    //表格中的操作事件
    optionsAction:function(actionType,row){
      if(actionType == 1){
        vm.g_preModify(row)
      }else if(actionType == 2){

      }else{

      }
    },
    //获取表格选中记录
    changeFun(val) {
        vm.multipleSelection = val   
    },
    // 新增或修改: 调用后台
    g_addOrUpdateAction() {
      vm.$refs.vForm.validate((valid) => {
        if (!valid) return
        cUtil.role_addOrUpdateAction(vm, modelApi)
      })
    },
    // 查询所有
    g_search() {
      vm.g_listLoading = true
      modelApi.getRoleManage(cUtil.mergePageProps(vm)).then(response => {
        vm.g_tableDatas = response.data.datas
        vm.g_pageProps.total = response.data.totalRows
        vm.g_listLoading = false
      })
    },
    //重置
    g_reset(){
      cUtil.reset(vm)
    },
    //添加角色
    g_preAdd(){
      vm.g_actionType = CONS.ACTION_TYPE_ADD
      cUtil.resetFormData(vm)
      vm.g_keepParent = false;
      vm.g_showDialog = true;
      vm.g_addOrModifyTitle = '新增'
    },
    //编辑修改角色
    g_preModify(row){
      vm.g_actionType = CONS.ACTION_TYPE_UPDATE
      cUtil.resetFormData(vm)
      vm.g_keepParent = true;
      vm.g_showDialog = true;
      vm.g_addOrModifyTitle = '编辑'
    },
    //删除(批量删除)记录: 调用后台
    g_preDelete(row){
      if(vm.multipleSelection.length <= 0 && !row ){
          this.$alert('请选择要删除的记录', '信息', {
            confirmButtonText: '确定'
          }); 
      }else if(vm.multipleSelection.length > 0 && !row){
        for(var i=0;i<vm.multipleSelection.length;i++){
          vm.rowsId.push(vm.multipleSelection[i].id)
        }
        cUtil.deleteById(vm, modelApi, vm.rowsId)
      }else{
        cUtil.deleteById(vm, modelApi, row.id)
      }
      
    }
  },
  distroyed() {
    vm.$refs.assignAuthorityRef.$destroy()
  }

}
</script>

<style scoped>

</style>
