<template>
  <div>
    <el-card class="box-card cw-tree-table">
      <div class="app-container">
        <!-- 查询表单 -->
        <el-form :inline="true" :model="g_sFormData" class="demo-form-inline" size="small" style="margin-bottom:10px;">
          <el-button icon="el-icon-plus" type="success" @click.stop="g_preAdd(false)" size="small"> 新增资源</el-button>
          <el-button icon="el-icon-remove-outline" type="danger" @click.stop="g_disableById(false)" size="small"> 批量禁用</el-button>
          <el-button icon="el-icon-circle-check-outline" type="danger" @click.stop="g_enableById(false)" size="small"> 批量启用</el-button>
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
          <template slot="resourceType" slot-scope="scope">
            {{ scope.row.resourceType | formatResTypeLabel }}
          </template> 
          <template slot="status" slot-scope="scope">
            {{ scope.row.status | formatStatus }}
          </template>   
          <template slot="options" slot-scope="scope">
            <span class="options-action">
              <i class="el-icon-plus"></i><a href="javascript:;" @click.stop="optionsAction(1, scope.row)">新增下级资源</a>
            </span>
            <span class="options-action">
              <i class="el-icon-edit"></i><a href="javascript:;" @click.stop="optionsAction(2, scope.row)">编辑</a>
            </span>
            <span class="options-action" v-if="!scope.row.status">
              <i class="el-icon-plus"></i><a href="javascript:;" @click.stop="optionsAction(3, scope.row)">启用</a>
            </span>
            <span class="options-action" v-if="scope.row.status">
              <i class="el-icon-remove-outline"></i><a href="javascript:;" @click.stop="optionsAction(4, scope.row)">禁用</a>
            </span>
          </template>
        </zk-table>

      </div>
    </el-card>
    <el-dialog :title="g_addOrModifyTitle" :visible.sync="g_showDialog">
      <el-form label-position="right" :rules="g_rules" ref="vForm" :model="g_mFormData" label-width="120px" width="400px">
        <el-form-item label="上级单位" v-show="g_keepParent">
          <el-input style="color:#06c" v-model="g_mFormData.parentName" disabled></el-input>
        </el-form-item>
        <el-form-item label="资源名" prop="cname">
          <el-input v-model="g_mFormData.cname"></el-input>
        </el-form-item>
        <el-form-item label="资源类型" prop="resourceType">
          <el-select v-model="g_mFormData.resourceType" placeholder="请选择" style="width:100%">
            <el-option
              v-for="item in type_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源链接" prop="url">
          <el-input type="textarea" v-model="g_mFormData.url"></el-input>
        </el-form-item>
        <el-form-item label="资源图标" prop="pictureName">
          <i class="el-icon-plus"></i>
          <span>删除</span>
        </el-form-item>
        <el-form-item label="资源描述" prop="remark">
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
import modelApi from '@/api/class/system/resource-manage'
import ZkTable from 'vue-table-with-tree-grid'

import * as cUtil from '@/utils/crud-util'
import * as CONS from '@/utils/constants'
let vm = null

export default {
  // 局部使用自定义组件
  components: {
    ZkTable
  },
  data() {
    return {
      g_addOrModifyTitle: '',
      g_listLoading: false,
      g_showDialog: false,
      g_sFormData: {},
      g_mFormData: {
        id: '',
        cname: '',
        resourceType:'',
        parentName:'',
        url:'',
        remark: ''
      },
      g_rules: {
        cname: [
          { required: true, message: '请输入资源名', trigger: 'blur' }
        ],
        resourceType: [
          { required: true, message: '请输入资源类型', trigger: 'blur' }
        ]
      },
      type_options: [
        {
          value: 0,
          label: '功能'
        }, {
          value: 1,
          label: '菜单'
        }
      ],
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
        selectionType: true
      },
      data: [],
      columns: [
        {
          label: '名称',
          prop: 'cname',
          width: '200px'
        },
        {
          label: '类型',
          prop: 'resourceType',
          width: '80px',
          type: 'template',
          template:'resourceType'
        },
        {
          label: '描述',
          prop: 'remark',
          width: '220px',
          maxWidth: '160px',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '链接',
          prop: 'url',
          width: '220px',
          maxWidth: '160px',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '优先级',
          prop: 'resourceOrder',
          width: '220px',
          maxWidth: '160px',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '是否可用',
          prop: 'status',
          width: '80px',
          maxWidth: '160px',
          align: 'center',         
          headerAlign: 'center',
          type:'template',
          template:'status'
        },
        {
          label: '图标',
          prop: 'pictureName',
          width: '220px',
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
        cUtil.resource_addOrUpdateAction(vm, modelApi)
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
      } 
    },
    // 分页查询
    g_search() {
      vm.g_listLoading = true
      modelApi.getResouceManage(cUtil.mergePageProps(vm)).then(response => {
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
        vm.g_mFormData.parentId = row.id
        vm.g_mFormData.parentName = row.name
      } else {
        delete vm.g_mFormData.parentId
        delete vm.g_mFormData.parentName
      }
      vm.g_showDialog = true
      vm.g_addOrModifyTitle = '新增资源'
    },
    // 跳转到编辑页面(或模态框)
    g_preModify(row) {
      if(row.parentCode !== '0'){
        vm.g_keepParent = true
      }else{
        vm.g_keepParent = false
      }
      vm.g_actionType = CONS.ACTION_TYPE_UPDATE
      cUtil.fillFormData(vm, row)
      vm.g_mFormData.parentCode = row.parentCode
      vm.g_mFormData.code = row.code
      vm.g_showDialog = true
      vm.g_addOrModifyTitle = '编辑资源'
    },
    //禁用(批量禁用)记录: 调用后台
    g_disableById(row){
      var checkedProps = vm.$refs.orgTable.getCheckedProp('id')
      var disableId = []
      if(checkedProps.length <= 0 && !row){
        this.$alert('请选择要禁用的记录', '信息', {
          confirmButtonText: '确定'
        }); 
      }else if(checkedProps.length > 0 && !row){
        cUtil.disableById(vm, modelApi, checkedProps,'ids')  
      }else{
        disableId.push(row.code)
        cUtil.ResourceDisableById(vm, modelApi, disableId,'ids') 
      }
    },
    //启用(批量启用)记录:调用后台
    g_enableById(row){
      var checkedProps = vm.$refs.orgTable.getCheckedProp('id')
      var enableId = []
      if(checkedProps.length <= 0 && !row){
        this.$alert('请选择要启用的记录', '信息', {
          confirmButtonText: '确定'
        }); 
      }else if(checkedProps.length > 0 && !row){
        cUtil.resouseEnableById(vm, modelApi, checkedProps)  
      }else{
        enableId.push(row.code)
        cUtil.resouseEnableById(vm, modelApi, enableId) 
      }
    }
  }
}
</script>

<style scoped>
th.zk-table__header-cell.zk-table--border-cell{
  text-align: center;
}
</style>

