<template>
  <div class="cw">
      <el-row>
          <el-col id="cwContainerId" :span="4" class="tree-container">
                <organization-tree @eventName="onNodeSelected"></organization-tree>
          </el-col>
          <el-col :span="20">
                <el-card class="box-card" style="margin:10px 4px;">
                    <div class="app-container">
                        <el-form :inline="true"  :model="g_sFormData" class="demo-form-inline" size="small">
                            <el-form-item label="姓名">
                                <el-input v-model="g_sFormData.name" placeholder="请输入员工姓名"></el-input>
                            </el-form-item>
                            <el-form-item label="工号">
                                <el-input v-model="g_sFormData.code" placeholder="请输入员工工号"></el-input>
                            </el-form-item>
                            <el-form-item label="账号">
                                <el-input v-model="g_sFormData.account" placeholder="请输入员工账号"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" icon="el-icon-search" @click.stop="g_search">查询</el-button>
                                <el-button type="default" icon="el-icon-refresh" @click.stop="reset">重置</el-button>
                            </el-form-item>
                        </el-form>
                        <el-button-group style="padding-bottom: 6px;">
                            <el-button type="primary" icon="el-icon-plus" @click.stop="preAdd" size="small"> 新增员工</el-button>
                            <el-button type="warning" icon="el-icon-plus" @click.stop="beforeRegist" size="small"> 注册员工到设备</el-button>
                        </el-button-group>
                        <!-- 表格数据 -->
                        <el-table :data="tableDatas" v-loading.body="listLoading" element-loading-text="Loading..." border fit highlight-current-row>
                            <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
                            <el-table-column label="姓名" width="200" align="center">
                                <template slot-scope="scope">
                                {{scope.row.name}}
                                </template>
                            </el-table-column>
                            <el-table-column label="工号" width="250" align="center">
                                <template slot-scope="scope">
                                {{scope.row.code}}
                                </template>
                            </el-table-column>
                            <el-table-column label="账号" width="250" align="center">
                                <template slot-scope="scope">
                                {{scope.row.account}}
                                </template>
                            </el-table-column>
                            <el-table-column label="注册头像" width="200" align="center">
                                <template slot-scope="scope">
                                    <img :src="scope.row.imageUrls[0] | getRealPath" width="60" height="60" style="padding-top:6px;">
                                </template>
                            </el-table-column>
                            <el-table-column label="显示头像" width="200" align="center">
                                <template slot-scope="scope">
                                    <img :src="scope.row.customerPicName | getRealPath" width="60" height="60" style="padding-top:6px;">
                                </template>
                            </el-table-column>
                            <el-table-column prop="created_at" label="操作" width="295" align="center">
                                <template slot-scope="scope">
                                    <el-button icon="el-icon-edit" type="text" size="small" @click.stop="preModify(scope.row)">编辑</el-button>
                                    <el-button icon="el-icon-delete" type="text" style="color: red" size="small" @click.stop="g_deleteById(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="block" style="float: right;">
                            <el-pagination
                                :small=false
                                layout="total, prev, pager, next"
                                :page-size="g_pageProps.rowsOfPage"
                                :total="g_pageProps.total"
                                @current-change="g_pageChange">
                            </el-pagination>
                        </div>
                    </div>
                </el-card>
          </el-col>
      </el-row>
  </div>
</template>

<script>
import OrganizationTree from '@/components/organization-tree/organization-tree'

import modelApi from '@/api/class/user/user-manage'
import * as cUtil from '@/utils/crud-util'
import * as CONS from '@/utils/constants'


let vm = null
export default {
    components:{
        OrganizationTree
    },
    data(){
        return {
            tableDatas: null,
            g_sFormData: {
                excludeSuperUsers:'true',
                orgCode:'',
                account: '',
                name: '',
                needLike:'need'
            },
            g_rules: {
                name: [
                    { required: true, message: '请输入员工名称', trigger: 'blur' }
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
    created:function(){
        vm = this
        vm.g_search()
    },
    methods:{
        //树节点查询
        onNodeSelected(node) {
            vm.g_sFormData.orgCode = node.code
            vm.g_search()
        },
        // 分页查询
        g_search() {
            vm.listLoading = true
            const params = cUtil.mergePageProps(vm)
            modelApi.getUserListManage(params).then(response => {
                vm.tableDatas = response.data.datas
                vm.g_pageProps.total = response.data.totalRows
                vm.listLoading = false
            })
        },
        //分页查询
        g_pageChange(val){
            vm.g_pageProps.currentPage = val
            vm.g_search()
        },
        preAdd(){
            vm.$router.push({ path: '/user/user-add', query: { id: '' }})
        }
    }
}
</script>
<style scoped>
  .el-card__header {
    padding: 6px 20px;
    border-bottom: 1px solid #d1dbe5;
    box-sizing: border-box;
  }
  .el-card__body{
    padding: 0;
  }
  .el-form-item{
    margin-bottom: 16px;
  }
  .el-button [class*=el-icon-]+span {
    margin-left: 0px;
  }

  .app-container .el-form {
    margin-bottom: 0px;
  }

  .el-pagination {
    white-space: nowrap;
    padding: 10px 0px;
    color: #48576a;
  }
</style>


