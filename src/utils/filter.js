import { formatDate } from './index'

const vueFilter = {
  // 机构类型过滤器
  formatOrgTypeLabel: function(value) {
    return value === 0 ? '机构' : '部门'
  },
  // 机构类型过滤器
  formatResTypeLabel: function(value) {
    return value === 0 ? '功能':'菜单' 
  },
  // 通用状态过滤器
  formatStatus: function(value) {
    return !value ?  '禁用' : '正常'
  },
  // 通用状态过滤器
  formatOnlineStatus: function(value) {
    return !value ? '在线' : '离线'
  },
  // 通用状态过滤器
  formatRegRecordStatus: function(value) {
    return value === '0' ? '未标记' : value === '1' ? '正常' : '误识'
  },
  // 通用用户类型过滤器
  formatUserType: function(value) {
    return value === 1 ? '普通员工' : value === 2 ? 'VIP' : '黑名单'
  },
  // 时间字段过滤器
  formatDate: function(value) {
    var date = new Date(value);
    return formatDate(date, 'yyyy-MM-dd hh:mm');
    //return parseTime(value, 'yyyy-mm-dd')
  },
  //unicode编码转换为符号
  formatUnicode:function(value){
    
  },
  getRealPath: function(value) {
    return 'http://192.168.80.74:8080/upload/' + value
  }
}

export default vueFilter
