import { BasicLayout } from '@/layouts'

/**
 * @desc 权限路由
 * @desc 走导航的路由都在根路由/里，走BasicLayout基础布局
 * @desc 不走导航的和根路由/放在同级或者放在根路由里加上hidden:true
 * @desc 不需登录的放在基础路由constantRouterMap里，并放在权限控制的白名单里才不会走权限验证
 * */

const Empower = () => import(/* webpackChunkName: 'empower' */ '@/views/empower')
const Exception = () => import(/* webpackChunkName: 'exception' */ '@/views/exception')

const Home = () => import(/* webpackChunkName: 'home' */ '@/views/home')

const Personal = () => import(/* webpackChunkName: 'personal' */ '@/views/personal')
const Activity = () => import(/* webpackChunkName: 'activity' */ '@/views/activity')
const News = () => import(/* webpackChunkName: 'news' */ '@/views/news')
const UserManage = () => import(/* webpackChunkName: 'user-manage' */ '@/views/user-manage')
const Apply = () => import(/* webpackChunkName: 'apply' */ '@/views/apply')
const Setting = () => import(/* webpackChunkName: 'setting' */ '@/views/setting')

export const asyncRouterMap = [
  {
    path: '/admin',
    name: 'Index',
    component: BasicLayout,
    meta: { keepAlive: true, permission: 'index' },
    redirect: '/personal',
    children: [
      // 基本信息
      {
        path: '/personal',
        name: 'Personal',
        component: Personal,
        meta: { title: '基本信息', icon: 'home', keepAlive: true, permission: 'personal' },
        hidden: false
      },
      // 信息管理
      {
        path: '/activity',
        name: 'Activity',
        component: Activity,
        meta: { title: '信息管理', icon: 'profile', keepAlive: true, permission: 'activity' },
        hidden: false
      },
      // 资讯管理
      {
        path: '/news',
        name: 'News',
        component: News,
        meta: { title: '资讯管理', icon: 'sound', keepAlive: true, permission: 'news' },
        hidden: false
      },
      // 用户管理
      {
        path: '/user-manage',
        name: 'UserManage',
        component: UserManage,
        meta: { title: '用户管理', icon: 'user', keepAlive: true, permission: 'user_manage' },
        hidden: false
      },
      // 报名管理
      {
        path: '/apply',
        name: 'Apply',
        component: Apply,
        meta: { title: '报名管理', icon: 'pushpin', keepAlive: true, permission: 'apply' },
        hidden: false
      }
    ]
  },
  // 设置
  {
    path: '/setting',
    name: 'Setting',
    component: Setting,
    meta: { title: '设置', icon: 'setting' },
    hidden: false
  }
]

// 基础路由
export const constantRouterMap = [
  // 首页
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/empower',
    name: 'Empower',
    component: Empower
  },
  // 异常处理
  {
    path: '/exception',
    name: 'Exception',
    component: Exception
  }
]
