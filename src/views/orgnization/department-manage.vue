<template>
  <div>
    <el-card class="box-card cw-tree-table">
      <div class="app-container">
        <el-form :inline="true" :model="g_sFormData" class="demo-form-inline" size="small">
          <el-button icon="el-icon-plus" type="success" @click.stop="g_preAdd(false)" size="small"> 新增部门</el-button>
          <el-button style="margin-right:60px;" icon="el-icon-delete" type="danger" @click.stop="g_preDelete(false)" size="small"> 批量删除</el-button>
          <el-form-item label="部门名称">
            <el-input v-model="g_sFormData.cname" placeholder="部门名称 ..."></el-input>
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
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="departmentCode" label="部门代码" width="120" align="center"></el-table-column>
          <el-table-column prop="cname" label="部门名称" width="120" align="center"></el-table-column>
          <el-table-column prop="orgName" label="所属单位" width="120" align="center"></el-table-column>
          <el-table-column prop="ename" label="部门名称(英文)" width="120" align="center"></el-table-column>
          <el-table-column prop="linkManName" label="联系人" align="center"></el-table-column>
          <el-table-column prop="linkManTel" label="联系电话" align="center"></el-table-column>
          <el-table-column prop="linkManFax" label="传真" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="manageManName" label="部门负责人" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" show-overflow-tooltip align="center"></el-table-column>
          <el-table-column align="left" prop="created_at" label="操作" width="200">
            <template slot-scope="scope">
              <span class="options-action">
                <i class="el-icon-edit"></i><a href="javascript:;" @click.stop="g_preModify(scope.row)">编辑</a>
              </span>
              <span class="options-action">
                <i class="el-icon-delete"></i><a href="javascript:;" @click.stop="g_preDelete(scope.row)">删除</a>
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
        <el-form-item label="所属单位" prop="orgName">
          <el-input v-model="g_mFormData.orgName" @click.native="formTree"></el-input>
          <el-tree
            :data="data2"
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
            @node-click="handleNodeClick"
            v-if="treeShow">
          </el-tree>
        </el-form-item>
        <el-form-item label="部门名称" prop="cname">
          <el-input v-model="g_mFormData.cname"></el-input>
        </el-form-item>
        <el-form-item label="部门代码" prop="departmentCode">
          <el-input v-model="g_mFormData.departmentCode"></el-input>
        </el-form-item>
        <el-form-item label="部门名称（英文）" prop="ename">
          <el-input v-model="g_mFormData.ename"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="linkManName">
          <el-input v-model="g_mFormData.linkManName"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="linkManTel">
          <el-input v-model="g_mFormData.linkManTel"></el-input>
        </el-form-item>
        <el-form-item label="传真" prop="linkManFax">
          <el-input v-model="g_mFormData.linkManFax"></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="linkManFax" v-show="g_keepParent">
          <el-select v-model="g_mFormData.type" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="remark">
          <el-input v-model="g_mFormData.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.stop="g_showDialog = false">取 消</el-button>
        <el-button type="primary" @click.stop="g_addOrUpdateAction">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import modelApi_ from '@/api/class/orgnization/org'
import modelApi from '@/api/class/orgnization/department'
import * as CONS from '@/utils/constants'
import * as cUtil from '@/utils/crud-util'

let vm = null

export default {
  data() {
    return {
      resourId: '',
      resourceName: '',
      treeShow: false,
      g_addOrModifyTitle: '添加资源',
      g_listLoading: false,
      g_showDialog: false,
      g_keepParent:false,
      multipleSelection:[],
      rowsId:[],
      g_sFormData: {
        cname: ''
      },
      g_tableDatas: [],
      props: {
        border: true
      },
      g_mFormData: {
        id: '',
        code:'',
        cname: '',
        orgName:"",
        orgCode:"",
        departmentCode:'',
        ename:'',
        linkManName:'',
        telephone:'',
        linkManName: '',
        linkManTel:'',
        linkManFax:'',
        type:"",
        remark: ''
      },
      type_options:[
        {
          value: 0,
          label: '菜单'
        }, {
          value: 1,
          label: '功能'
        }
      ],
      g_rules: {
        cname: [
          { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        orgName: [
          { required: true, message: '请输入所属单位', trigger: 'blur' }
        ]
      },
      g_pageProps: {
        currentPage: 1,
        rowsOfPage: CONS.PAGE_SIZE,
        total: 0
      },
      data2: [],
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

  methods: {
    formTree(){
      modelApi_.getAllResTree(cUtil.mergePageProps(vm)).then(response => {
        vm.data2 = response.data
      })
      vm.treeShow = !vm.treeShow
    },
    //新增form中的tree点击事件
    handleNodeClick(data) {
      vm.g_mFormData.orgName = data.name
      vm.g_mFormData.orgCode = data.code
      vm.treeShow = false
    },
    //获取表格选中记录
    changeFun(val) {
        vm.multipleSelection = val   
    },
    // 新增或修改: 调用后台
    g_addOrUpdateAction() {
      vm.$refs.vForm.validate((valid) => {
        if (!valid) return
        cUtil.addOrUpdateAction(vm, modelApi)
      })
    },
    // 查询所有
    g_search() {
      vm.g_listLoading = true
      modelApi.getDepartmentTree(cUtil.mergePageProps(vm)).then(response => {
        vm.g_tableDatas = response.data.datas
        vm.g_pageProps.total = response.data.totalRows
        vm.g_listLoading = false
      })
    },
    //重置
    g_reset(){
      cUtil.reset(vm)
      vm.g_search()
    },
    //新增部门
    g_preAdd(){
      vm.g_actionType = CONS.ACTION_TYPE_ADD
      cUtil.resetFormData(vm)
      modelApi_.getAllResTree(cUtil.mergePageProps(vm)).then(response => {
        vm.data2 = response.data
      })
      vm.g_keepParent = false;
      vm.g_showDialog = true;
      vm.g_addOrModifyTitle = '新增部门'
    },
    //编辑修改部门
    g_preModify(row){
      vm.g_actionType = CONS.ACTION_TYPE_UPDATE
      vm.g_mFormData.code = row.code
      cUtil.fillFormData(vm,row)
      vm.g_keepParent = true;
      vm.g_showDialog = true;
      vm.g_addOrModifyTitle = '修改部门'
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
        cUtil.deleteById(vm, modelApi, vm.rowsId,'ids')
      }else{
        vm.rowsId.push(row.id)
        cUtil.deleteById(vm, modelApi, vm.rowsId,'ids')
      }
      
    }
  }

}
</script>

<style scoped>
.el-form-item__error{
  position: relative;
}
</style>
