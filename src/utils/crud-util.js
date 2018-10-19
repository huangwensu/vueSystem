import * as CONS from './constants'

/**
 * 重置搜索数据
 * @param  {[type]} vm 页面中的vm对象实例
 * @return {[type]}        vm
 */
export function reset(vm) {
  const sFromData = vm && vm.g_sFormData
  if (sFromData) {
    Object.keys(sFromData).forEach(function(key) {
      if (typeof (key) === 'string') {
        sFromData[key] = ''
      } else if (typeof (key) === 'number') {
        sFromData[key] = 0
      } else {
        sFromData[key] = ''
      }
    })
  }
  const pageProps = vm && vm.g_pageProps
  if (pageProps) {
    if (pageProps.currentPage) {
      pageProps.currentPage = 1
    }
    if (pageProps.rowsOfPage) {
      pageProps.rowsOfPage = CONS.PAGE_SIZE
    }
  }
}

/**
 * 重置添加或编辑表单(或指定表单的)数据
 * @param  {[type]} vm    页面中的vm对象实例
 * @param  {String} mFormData 指定的表单对象,默认为mFormData对象
 * @return {[type]}           vm
 */
export function resetFormData(vm, mFormData = 'g_mFormData') {
  mFormData = vm && vm[mFormData]
  if (mFormData) {
    Object.keys(mFormData).forEach(function(key) {
      if (typeof (key) === 'string') {
        mFormData[key] = ''
      } else if (typeof (key) === 'number') {
        mFormData[key] = 0
      }
    })
  }
}

/**
 * 将表格中的数据填充到编辑表单中
 * @param  {[type]} vm    页面中的vm对象实例
 * @param  {[type]} row       表格中的一行数据
 * @param  {[type]} mFormData 指定的表单对象,默认为mFormData对象
 * @return {[type]}           vm
 */
export function fillFormData(vm, row, mFormData = 'g_mFormData') {
  if (vm[mFormData]) {
    Object.keys(vm[mFormData]).forEach(function(key) {
      vm[mFormData][key] = row[key] || ''
    })
  }
}

/**
 * 将分页参数合并到搜索参数
 * @param  {type} vm  页面中的vm对象实例
 * @return {newData}      合并后的新对象
 */
export function mergePageProps(vm) {
  const pageProps = vm && vm.g_pageProps
  const newData = Object.create(null)
  if (pageProps && pageProps.currentPage) {
    newData.currentPage = pageProps.currentPage
  }
  if (pageProps && pageProps.rowsOfPage) {
    newData.rowsOfPage = pageProps.rowsOfPage
  }
  return simpleMerge(newData, vm.g_sFormData)
}

/**
 * 将表单参数合并到搜索参数
 * @param  {[type]} original 原对象
 * @param  {[type]} another  被拷贝对象
 * @return {[type]}          原对象
 */
export function simpleMerge(original, another) {
  if (!another) return original
  Object.keys(another).forEach(function(key) {
    original[key] = another[key]
  })
  return original
}

/**
 * 添加或修改的简单封装(只适用模态框)
 * @param {[type]} vm      vm对象实例
 * @param {[type]} modelApi api调用实例
 */
export function addOrUpdateAction(vm, modelApi) {
  if (vm.g_actionType === CONS.ACTION_TYPE_ADD) {
    vm.g_listLoading = true
    modelApi.add(vm.g_mFormData).then(response => {
      vm.g_listLoading = false
      vm.g_showDialog = false
      vm.g_search(mergePageProps(vm))
      vm.$message({
        type: 'success',
        message: '添加成功!'
      })
    }).catch(function(err) {
      vm.$message({
        type: 'info',
        message: '添加失败!'
      })
      console.log('' + err)
    })
  } else if (vm.g_actionType === CONS.ACTION_TYPE_UPDATE) {
    vm.g_listLoading = true
    modelApi.updateById(vm.g_mFormData).then(response => {
      vm.g_listLoading = false
      vm.g_showDialog = false
      vm.g_search(mergePageProps(vm))
      vm.$message({
        type: 'success',
        message: '修改成功!'
      })
    }).catch(function(err) {
      vm.$message({
        type: 'info',
        message: '修改失败!'
      })
      console.log('' + err)
    })
  }
}

/**
 * 根据ID删除记录的简单封装
 * @param  {[type]} vm      vm对象实例
 * @param  {[type]} modelApi api调用实例
 * @param  {[type]} idValue  要删除记录的ID值
 * @param  {String} idKey    标识字段名称
 */
export function deleteById(vm, modelApi, idValue, idKey = 'id') {
  vm.$confirm('此操作将永久删除该记录, 是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const paramData = {}
    paramData[idKey] = idValue
    vm.g_listLoading = true
    modelApi.deleteById(paramData).then(response => {
      vm.g_listLoading = false
    // }).then(res => {
      vm.g_search(mergePageProps(vm))
      vm.$message({
        type: 'success',
        message: '删除成功!'
      })
    })
  }).catch(() => {
    vm.$message({
      type: 'info',
      message: '已取消删除!'
    })
  })
}

/**
 * 根据ID禁用记录的简单封装
 * @param  {[type]} vm      vm对象实例
 * @param  {[type]} modelApi api调用实例
 * @param  {[type]} idValue  要删除记录的ID值
 * @param  {String} idKey    标识字段名称
 */
export function disableById(vm, modelApi, idValue, idKey = 'id') {
  vm.$confirm('此操作将禁用该记录, 是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const paramData = {}
    paramData[idKey] = idValue
    vm.g_listLoading = true
    modelApi.disableById(paramData).then(response => {
      vm.g_listLoading = false
      // }).then(res => {
      vm.g_search(mergePageProps(vm))
      vm.$message({
        type: 'success',
        message: '禁用成功!'
      })
    })
  }).catch(() => {
    vm.$message({
      type: 'info',
      message: '已取消禁用!'
    })
  })
}

/**
 * 根据ID启用记录的简单封装
 * @param  {[type]} vm      vm对象实例
 * @param  {[type]} modelApi api调用实例
 * @param  {[type]} idValue  要删除记录的ID值
 * @param  {String} idKey    标识字段名称
 */
export function enableById(vm, modelApi, idValue, idKey = 'id') {
  vm.$confirm('此操作将启用该记录, 是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const paramData = {}
    paramData[idKey] = idValue
    vm.g_listLoading = true
    modelApi.enableById(paramData).then(response => {
      vm.g_listLoading = false
      // }).then(res => {
      vm.g_search(mergePageProps(vm))
      vm.$message({
        type: 'success',
        message: '启用成功!'
      })
    })
  }).catch(() => {
    vm.$message({
      type: 'info',
      message: '已取消启用!'
    })
  })
}



/**
 * 单位维护新增或修改的简单封装(只适用模态框)
 * @param {[type]} vm      vm对象实例
 * @param {[type]} modelApi api调用实例
 */
export function orgUpdateAction(vm, modelApi) {
    vm.g_listLoading = true
    modelApi.orgUpdateById(vm.g_mFormData).then(response => {
      vm.g_listLoading = false
      vm.g_showDialog = false
      vm.g_search(mergePageProps(vm))
      vm.$message({
        type: 'success',
        message: '修改成功!'
      })
    }).catch(function(err) {
      vm.$message({
        type: 'info',
        message: '修改失败!'
      })
      console.log('' + err)
    })
  } 


/**
 * 资源管理新增或修改的简单封装(只适用模态框)
 * @param {[type]} vm      vm对象实例
 * @param {[type]} modelApi api调用实例
 */
export function resource_addOrUpdateAction(vm, modelApi) {
  if (vm.g_actionType === CONS.ACTION_TYPE_ADD) {
    vm.g_listLoading = true
    console.log(vm.g_mFormData)
    modelApi.resourceAdd(vm.g_mFormData).then(response => {
      vm.g_listLoading = false
      vm.g_showDialog = false
      vm.g_search(mergePageProps(vm))
      vm.$message({
        type: 'success',
        message: '添加成功!'
      })
    }).catch(function(err) {
      vm.$message({
        type: 'info',
        message: '添加失败!'
      })
      console.log('' + err)
    })
  } else if (vm.g_actionType === CONS.ACTION_TYPE_UPDATE) {
    vm.g_listLoading = true
    modelApi.resourceUpdate(vm.g_mFormData).then(response => {
      vm.g_listLoading = false
      vm.g_showDialog = false
      vm.g_search(mergePageProps(vm))
      vm.$message({
        type: 'success',
        message: '修改成功!'
      })
    }).catch(function(err) {
      vm.$message({
        type: 'info',
        message: '修改失败!'
      })
      console.log('' + err)
    })
  }
}


/**
 * 资源管理启用记录的简单封装
 * @param  {[type]} vm      vm对象实例
 * @param  {[type]} modelApi api调用实例
 * @param  {[type]} idValue  要删除记录的ID值
 * @param  {String} idKey    标识字段名称
 */
export function resouseEnableById(vm, modelApi, idValue, idKey = 'id') {
  vm.$confirm('此操作将启用该记录, 是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const paramData = {}
    paramData[idKey] = idValue
    vm.g_listLoading = true
    modelApi.resourceStart(paramData).then(response => {
      vm.g_listLoading = false
      // }).then(res => {
      vm.g_search(mergePageProps(vm))
      vm.$message({
        type: 'success',
        message: '启用成功!'
      })
    })
  }).catch(() => {
    vm.$message({
      type: 'info',
      message: '已取消启用!'
    })
  })
}


/**
 * 角色管理新增或修改的简单封装(只适用模态框)
 * @param {[type]} vm      vm对象实例
 * @param {[type]} modelApi api调用实例
 */
export function role_addOrUpdateAction(vm, modelApi) {
  if (vm.g_actionType === CONS.ACTION_TYPE_ADD) {
    vm.g_listLoading = true
    modelApi.roleAdd(vm.g_mFormData).then(response => {
      vm.g_listLoading = false
      vm.g_showDialog = false
      vm.g_search(mergePageProps(vm))
      vm.$message({
        type: 'success',
        message: '添加成功!'
      })
    }).catch(function(err) {
      vm.$message({
        type: 'info',
        message: '添加失败!'
      })
      console.log('' + err)
    })
  } else if (vm.g_actionType === CONS.ACTION_TYPE_UPDATE) {
    vm.g_listLoading = true
    modelApi.roleUpdateById(vm.g_mFormData).then(response => {
      vm.g_listLoading = false
      vm.g_showDialog = false
      vm.g_search(mergePageProps(vm))
      vm.$message({
        type: 'success',
        message: '修改成功!'
      })
    }).catch(function(err) {
      vm.$message({
        type: 'info',
        message: '修改失败!'
      })
      console.log('' + err)
    })
  }
}

/**
 * 资源管理禁用记录的简单封装
 * @param  {[type]} vm      vm对象实例
 * @param  {[type]} modelApi api调用实例
 * @param  {[type]} idValue  要删除记录的ID值
 * @param  {String} idKey    标识字段名称
 */
export function ResourceDisableById(vm, modelApi, idValue, idKey = 'id') {
  vm.$confirm('此操作将禁用该记录, 是否继续？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const paramData = {}
    paramData[idKey] = idValue
    vm.g_listLoading = true
    modelApi.resourceForbidden(paramData).then(response => {
      vm.g_listLoading = false
      // }).then(res => {
      vm.g_search(mergePageProps(vm))
      vm.$message({
        type: 'success',
        message: '禁用成功!'
      })
    })
  }).catch(() => {
    vm.$message({
      type: 'info',
      message: '已取消禁用!'
    })
  })
}
