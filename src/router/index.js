import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
import Layout from '../views/layout/Layout'
Vue.use(Router)

export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{ path: 'dashboard', component: _import('dashboard/index') }]
  },
  {
    path: '/orgnization',
    component: Layout,
    redirect: '/orgnization/orglist',
    name: '组织机构管理',
    meta: { role: ['admin'] },
    children: [
      { 
        path: 'orglist', 
        icon: 'el-icon-date', 
        component: _import('orgnization/orgList'), 
        name: '单位维护',
        meta: { role: ['admin'] }
      },
      { 
        path: 'dapartment-manage', 
        icon: 'el-icon-date', 
        component: _import('orgnization/department-manage'), 
        name: '部门管理', 
        meta: { role: ['admin'] }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/user-manage',
    name: '机构管理员',
    meta: { role: ['admin'] },
    children: [
      { 
        path: 'user-manage', 
        icon: 'el-icon-date', 
        component: _import('user/user-manage'), 
        name: '人员管理', 
        meta: { role: ['admin'] }
      },
      { 
        path: 'user-add', 
        icon: 'el-icon-date', 
        component: _import('user/user-add'), 
        name: '新增普通人员', 
        meta: { role: ['admin'] }, 
        hidden: true 
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/resource',
    name: '系统管理',
    meta: { role: ['admin'] },
    children: [
      { 
        path: 'resource', 
        icon: 'el-icon-date', 
        component: _import('system/resource-manage'), 
        name: '资源管理', 
        meta: { role: ['admin'] }
      },
      { 
        path: 'authority', 
        icon: 'el-icon-date', 
        component: _import('system/authority-manage'), 
        name: '资源权限管理', 
        meta: { role: ['admin'] }
      },
      { 
        path: 'role', 
        icon: 'el-icon-date', 
        component: _import('system/role-manage'), 
        name: '角色管理', 
        meta: { role: ['admin'] }
      },
      { 
        path: 'assign-resource',
        icon: 'el-icon-date', 
        component: _import('system/assign-resource'), 
        name: '设置资源', 
        meta: { role: ['admin'] }, 
        hidden: true 
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [

]

export const defaultPath = '/orgnization/orglist'
//export const defaultPath = '/login'
