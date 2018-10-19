<template>
  <div>
    <el-card class="box-card cw-tree-table">
      <div class="app-container">
        <!-- 查询表单 -->
        <el-form :inline="true" :model="g_sFormData" class="demo-form-inline" size="small" style="margin-bottom:10px;">
          <el-button icon="el-icon-plus" type="success" @click.stop="g_preAdd(false)" size="small"> 新增单位</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click.stop="g_search" size="small"> 刷新</el-button>
        </el-form>

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
          <template slot="options" slot-scope="scope">
            <span class="options-action">
              <i class="el-icon-plus"></i><a href="javascript:;" @click.stop="optionsAction(1, scope.row)">新增下级资源</a>
            </span>
            <span class="options-action">
              <i class="el-icon-edit"></i><a href="javascript:;" @click.stop="optionsAction(2, scope.row)">编辑</a>
            </span>
            <span class="options-action">
              <i class="el-icon-delete"></i><a href="javascript:;" @click.stop="optionsAction(5, scope.row)">删除</a>
            </span>
          </template>
        </zk-table>

      </div>
    </el-card>
    <el-dialog :title="g_addOrModifyTitle" :visible.sync="g_showDialog">
      <el-form label-position="right" :rules="g_rules" ref="vForm" :model="g_mFormData" label-width="120px" width="400px">
        <el-input type="hidden" v-model="g_mFormData.parentCode"></el-input>
        <el-form-item label="上级单位" v-show="g_keepParent">
          <el-input style="color:#06c" v-model="g_mFormData.parentName" disabled></el-input>
        </el-form-item>
        <el-form-item label="单位名称" prop="name">
          <el-input v-model="g_mFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="单位代码" prop="organizationCode">
          <el-input v-model="g_mFormData.organizationCode"></el-input>
        </el-form-item>
        <el-form-item label="单位地址" prop="address">
          <el-input v-model="g_mFormData.address"></el-input>
        </el-form-item>
        <el-form-item label="单位邮编" prop="zipcode">
          <el-input v-model="g_mFormData.zipcode"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="telephone">
          <el-input v-model="g_mFormData.telephone"></el-input>
        </el-form-item>
        <el-form-item label="联系人人员姓名" prop="linkManName">
          <el-input v-model="g_mFormData.linkManName"></el-input>
        </el-form-item>
        <el-form-item label="联系人部门" prop="linkManDept">
          <el-input v-model="g_mFormData.linkManDept"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" prop="linkManTel">
          <el-input v-model="g_mFormData.linkManTel"></el-input>
        </el-form-item>
        <el-form-item label="单位描述" prop="remark">
          <el-input type="textarea" v-model="g_mFormData.remark"></el-input>
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
import modelApi from '@/api/class/orgnization/org'
import ZkTable from 'vue-table-with-tree-grid'

import * as cUtil from '@/utils/crud-util'
import * as CONS from '@/utils/constants'
let vm = null

export default {
  // 使用自定义组件
  components: {
    ZkTable
  },
  data() {
    return {
      g_addOrModifyTitle: '添加资源',
      g_listLoading: false,
      g_showDialog: false,
      g_sFormData: {},
      g_mFormData: {
        name: '',
        code:'',
        parentCode:'',
        parentName:'',
        organizationCode:'',
        address:'',
        zipcode:'',
        telephone:'',
        linkManName: '',
        linkManDept:'',
        linkManTel:'',
        remark: ''
      },
      g_rules: {
        name: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ],
        organizationCode: [
          { required: true, message: '请输入单位代码', trigger: 'blur' }
        ]
      },
      g_keepParent: false,
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
        selectionType: false
      },
      data: [],
      columns: [
        {
          label: '单位名称',
          prop: 'name',
          width: '400px'
        },
        {
          label: '单位代码',
          prop: 'organizationCode',
          width: '420px',
          maxWidth: '160px',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '单位地址',
          prop: 'address',
          width: '420px',
          maxWidth: '160px',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '操作',
          prop: 'remark',
          minWidth: '200px',
          maxWidth: '300px',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'options'
        }
      ]
    }
  },

  // 实例创建勾子
  created: function() {
    vm = this
    vm.g_search()
  },

  methods: {
    // 添加或修改: 调用后台
    g_addOrUpdateAction() {
      vm.$refs.vForm.validate((valid) => {
        if (!valid) return
        cUtil.orgUpdateAction(vm, modelApi)
      })
    },
    // 操作表格中的按钮
    optionsAction: function(actionType, row) {
      if (actionType === 1) {
        vm.g_preAdd(true, row)
      } else if (actionType === 2) {
        vm.g_preModify(row)
      } else if (actionType === 3) {
        vm.g_enableById(row)
      } else if (actionType === 4) {
        vm.g_disableById(row)
      }else if(actionType === 5){
        vm.g_preDelete(row)
      }
    },
    // 分页查询
    g_search() {
      vm.g_listLoading = true
      modelApi.getAllResTree(cUtil.mergePageProps(vm)).then(response => {
        vm.data = response.data
        vm.g_listLoading = false
      })
    },
    // 跳转到新增页面(或模态框), 覆盖minxins中的相应接口
    g_preAdd(g_keepParent, row) {
      vm.g_actionType = CONS.ACTION_TYPE_ADD
      cUtil.resetFormData(vm)
      vm.g_keepParent = g_keepParent
      if (g_keepParent && row) {
        vm.g_mFormData.parentName = row.name
        vm.g_mFormData.parentCode = row.code
      } else {
        delete vm.g_mFormData.parentName
      }
      vm.g_showDialog = true
      vm.g_addOrModifyTitle = '新增单位'
    },
    // 跳转到编辑页面(或模态框)
    g_preModify(row) {
      vm.g_keepParent = false
      vm.g_actionType = CONS.ACTION_TYPE_UPDATE
      vm.g_mFormData.code = row.code
      cUtil.fillFormData(vm, row)
      vm.g_showDialog = true
      vm.g_addOrModifyTitle = '修改单位'
    },
    //删除记录: 调用后台
    g_preDelete(row){
      cUtil.deleteById(vm, modelApi, row.code)
    }
  }
}
</script>

<style scoped>
th.zk-table__header-cell.zk-table--border-cell{
  text-align: center;
}
</style>
