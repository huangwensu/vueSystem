import * as CONS from './constants'

/**
 * 重置搜索数据
 * @param  {[type]} vueObj 页面中的Vue对象实例
 * @return {[type]}        vueObj
 */
export function reset(vueObj) {
  var sFromData = vueObj && vueObj.sFromData
  if (sFromData) {
  	Object.keys(sFromData).forEach(function(key) {
	   if (typeof (key) === 'string') {
  			sFromData[key] = ''
  	  } else if (typeof (key) === 'number') {
  			sFromData[key] = 0
  	  }
  	})
  }
  var pageProps = vueObj && vueObj.pageProps
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
 * @param  {[type]} vueObj    页面中的Vue对象实例
 * @param  {String} mFormData 指定的表单对象,默认为mFormData对象
 * @return {[type]}           vueObj
 */
export function resetFormData(vueObj, mFormData = 'mFormData') {
  var mFormData = vueObj && vueObj[mFormData]
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
 * @param  {[type]} vueObj    页面中的Vue对象实例
 * @param  {[type]} row       表格中的一行数据
 * @param  {[type]} mFormData 指定的表单对象,默认为mFormData对象
 * @return {[type]}           vueObj
 */
export function fillFormData(vueObj, row, mFormData = 'mFormData') {
  if (vueObj[mFormData]) {
    Object.keys(vueObj[mFormData]).forEach(function(key) {
      vueObj[mFormData][key] = row[key] || ''
    })
  }
}

/**
 * 将分页参数合并到搜索参数
 * @param  {type} vueObj  页面中的Vue对象实例
 * @return {newData}      合并后的新对象
 */
export function mergePageProps(vueObj) {
  var pageProps = vueObj.pageProps
  var newData = Object.create(null)
  if (pageProps.currentPage) {
    newData.currentPage = pageProps.currentPage
  }
  if (pageProps.rowsOfPage) {
    newData.rowsOfPage = pageProps.rowsOfPage
  }
  return simpleMerge(newData, vueObj.sFromData)
}

/**
 * 简单合并
 * @param  {[type]} original 原对象
 * @param  {[type]} another  被拷贝对象
 * @return {[type]}          原对象
 */
export function simpleMerge(original, another) {
  Object.keys(another).forEach(function(key) {
    original[key] = another[key]
  })
  return original
}

/**
 * 添加或修改的简单封装(只适用模态框)
 * @param {[type]} vue      vue对象实例
 * @param {[type]} modelApi api调用实例
 */
export function addOrUpdateAction(vue, modelApi) {
  if (vue.actionType == CONS.ACTION_TYPE_ADD) {
    vue.listLoading = true
    modelApi.add(vue.mFormData).then(response => {
      vue.listLoading = false
      vue.showDialog = false
      vue.search(mergePageProps(vue))
      vue.$message({
        type: 'success',
        message: '添加成功!'
      })
    }).catch(function(err) {
      vue.$message({
        type: 'info',
        message: '添加失败!'
      })
      console.log('' + err)
    })
  } else if (vue.actionType == CONS.ACTION_TYPE_UPDATE) {
    vue.listLoading = true
    modelApi.update(vue.mFormData).then(response => {
      vue.listLoading = false
      vue.showDialog = false
      vue.search(mergePageProps(vue))
      vue.$message({
        type: 'success',
        message: '修改成功!'
      })
    }).catch(function(err) {
      vue.$message({
        type: 'info',
        message: '修改失败!'
      })
      console.log('' + err)
    })
  }
}

/**
 * 根据Id删除记录的简单封装
 * @param  {[type]} vue      vue对象实例
 * @param  {[type]} modelApi api调用实例
 * @param  {[type]} idValue  要删除记录的ID值
 * @param  {String} idKey    标识字段名称
 */
export function deleteById(vue, modelApi, idValue, idKey = 'id') {
  vue.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const paramData = {}
    paramData[idKey] = idValue
    vue.listLoading = true
    modelApi.deleteById(paramData).then(response => {
      vue.listLoading = false
    }).then(function(res) {
      vue.search(mergePageProps(vue))
      vue.$message({
        type: 'success',
        message: '删除成功!'
      })
    })
  }).catch(() => {
    vue.$message({
      type: 'info',
      message: '已取消删除!'
    })
  })
}

/**
 * 根据Id禁用的简单封装
 * @param  {[type]} vue      vue对象实例
 * @param  {[type]} modelApi api调用实例
 * @param  {[type]} idValue  要禁用记录的ID值
 * @param  {String} idKey    标识字段名称
 */
export function disableById(vue, modelApi, idValue, idKey = 'id') {
  vue.$confirm('此操作将禁用该记录, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const paramData = {}
    paramData[idKey] = idValue
    vue.listLoading = true
    modelApi.disableById(paramData).then(response => {
      vue.listLoading = false
    }).then(function(res) {
      vue.search(mergePageProps(vue))
      vue.$message({
        type: 'success',
        message: '禁用成功!'
      })
    })
  }).catch(() => {
    vue.$message({
      type: 'info',
      message: '已取消禁用!'
    })
  })
}
