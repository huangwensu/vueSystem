<template>
    <el-dialog :title="title" :visible="visible" :show-close="false" class="cw-com">
      <el-form :inline="true" :model="sFromData" class="demo-form-inline">
        <el-form-item label="机构">
          <el-select v-model="sFromData.orgname" size="small" placeholder="请选择" style="width:160px">
            <el-input v-model="sFromData.orgname" size="small" placeholder="人员名称 ..." style="width:160px"></el-input>
          </el-select>
        </el-form-item>
        <el-form-item label="名称/工号">
          <el-input v-model="sFromData.name" size="small" placeholder="人员名称 ..." style="width:160px"></el-input>
        </el-form-item>
        <el-form-item label="人员状态">
          <el-select v-model="sFromData.status" size="small" placeholder="请选择" style="width:160px;margin-left:6px;">
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
          <el-tree ref="userTree" class="sel-tree"
            :data="treeData"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps">
          </el-tree>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click.stop="visible = false">取 消</el-button> -->
        <el-button @click.stop="cancel">取 消</el-button>
        <el-button type="primary" @click.stop="confirm">确 定</el-button>
      </div>
    </el-dialog>
</template>
<script>
import modelApi from '@/api/class/user/user'
import * as cUtil from '@/utils/common'
let vue = null;

export default {
    name: 'UserSelect',
    props: {
        title: {
            type: String,
            default: '选择要注册的设备'
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
          status:'',
        },
        treeData: [{
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
        }],
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
        }],
      }
    },
    computed: {
      
    },
    watch: {
        /*visible (oldVal, newVal){
            console.log('in visible ...', newVal);
            if(!newVal){
                //vue.visible = false
                vue.$destroy()
            }
        }*/
    },

    // 实例创建勾子
    created: function(){
      vue = this
      vue.search()
    },

    mounted() {

    },
    methods: {
        // 重置查询表单
        reset () {
          cUtil.reset(vue)
          vue.search()
        },

        // 分页查询
        search () {
          vue.listLoading = true
          //let params = cUtil.mergePageProps(vue);
          let params = {};
          params.userType = 1
          modelApi.getPageList(params).then(response => {
            console.log('in getPageList ...');
            //vue.tableDatas = response.data.datas
            //vue.pageProps.total = response.data.totalRows
            vue.listLoading = false
          })
        },

        show () {
          vue.visible = true
        },

        hide () {
          vue.visible = false
        },

        confirm () {
            let selectNodes = vue.$refs.userTree.getCheckedNodes(vue.leafOnly);
            vue.$emit('confirm', selectNodes);
        },

        cancel (){
            vue.$emit('cancel');
        }
    },
    beforeDestroy() {
        vue = undefined
    }
}
</script>
<style scoped>
</style>
