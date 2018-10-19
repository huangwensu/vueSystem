/**
 * 常量定义文件
 *
 */

// 分页大小
export const PAGE_SIZE = 10

// 添加动作常量
export const ACTION_TYPE_ADD = 'ACTION_TYPE_ADD'

// 修改动作常量
export const ACTION_TYPE_UPDATE = 'ACTION_TYPE_UPDATE'

// 删除动作常量
export const ACTION_TYPE_DELETE = 'ACTION_TYPE_DELETE'

// 通用状态 全部/正常/禁用
export const COMMON_STATUS_OPTIONS = [
  {
    value: '',
    label: '全部'
  }, {
    value: 0,
    label: '正常'
  }, {
    value: 1,
    label: '禁用'
  }
]

// 识别状态 全部/未标记/正常/误识
export const RECORD_STATUS_OPTIONS = [
  {
    value: '',
    label: '全部'
  }, {
    value: '0',
    label: '未标记'
  }, {
    value: '1',
    label: '正常'
  }, {
    value: '2',
    label: '误识'
  }
]

// 用户类型 全部/普通用户/VIP/黑名单
export const USER_TYPE_OPTIONS = [
  {
    value: '',
    label: '全部'
  }, {
    value: 1,
    label: '普通用户'
  }, {
    value: 2,
    label: 'VIP'
  }, {
    value: 3,
    label: '黑名单'
  }
]
