import * as cUtil from '@/utils/crud-util'
import * as CONS from '@/utils/constants'

/**
 * 定义所有可用的混合对象
 */
let vm = null

/**
 * 对于增删改查的小混合
 * @type {Object}
 */
export const g_crudMMixins = {

}

/**
 * 对于增删改查的大混合
 * @type {Object}
 */
export const g_crudCMixins = {

  // 实例创建勾子
  created: function() {
    vm = this
    vm.g_listLoading = false
  },

  destroyed: function() {
    vm = undefined
  },

  methods: {
    // 重置查询表单
    g_reset() {
      cUtil.reset(vm)
      vm.g_search()
    },
		// 跳转到添加页面(或弹出模态框)
    g_preAdd(modalTitle) {
      vm.g_actionType = CONS.ACTION_TYPE_ADD
      cUtil.resetFormData(vm)
      vm.g_showDialog = true
      vm.g_addOrModifyTitle = modalTitle
    },
		// 跳转到编辑页面(或模态框)
    g_preModify(row, modalTitle) {
      console.log('in g_preModify', row)
      vm.g_actionType = CONS.ACTION_TYPE_UPDATE
      cUtil.fillFormData(vm, row)
      vm.g_showDialog = true
      vm.g_addOrModifyTitle = modalTitle
    },
		// 翻页操作
    g_pageChange(currentPage) {
      vm.g_pageProps.currentPage = currentPage
      vm.g_search(cUtil.mergePageProps(vm))
    }
  }
}
