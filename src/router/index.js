import Vue from 'vue'

import Router from 'vue-router'

// import Home from '@/views/Home.vue'
import Failed from '@/views/404.vue'

import Teacher from '@/views/Teacher/index.vue'
import TeacherAdmin from '@/views/Teacher/admin.vue'
import TeacherTgroup from '@/views/Teacher/tgroup.vue'
import TeacherTactive from '@/views/Teacher/Tactive.vue'

import Master from '@/views/Master/index.vue'
import MasterAdmin from '@/views/Master/admin.vue'

import Group from '@/views/Group/index.vue'
import GroupAdmin from '@/views/Group/admin.vue'
import GroupAdd from '@/views/Group/add.vue'

Vue.use(Router)

console.log(999)

export default new Router({
  routes: [
    /**
     * [Home 首页]
     */
    {
      name: '',
      path: '/'
    },

    /**
     * [Teacher 老师管理]
     */
    {
      name: 'Teacher',
      path: '/teacher/',
      component: Teacher,
      redirect: {
        path: '/teacher/admin/'
      },
      children: [
        {
          name: 'TeacherAdmin',
          path: '/teacher/admin/',
          component: TeacherAdmin
        },
        {
          name: 'TeacherTgroup',
          path: '/teacher/tgroup/:id',
          component: TeacherTgroup
        },
        {
          name: 'TeacherTactive',
          path: '/teacher/tactive/',
          component: TeacherTactive
        }
      ]
    },

    /**
     * [Master 少年宫管理员]
     */
    {
      name: 'Master',
      path: '/master/',
      component: Master,
      redirect: {
        path: '/master/admin/'
      },
      children: [
        {
          name: 'MasterAdmin',
          path: '/master/admin/',
          component: MasterAdmin
        }
      ]
    },
    /**
     * [Group 社团小组]
     */
    {
      name: 'Group',
      path: '/group/',
      component: Group,
      redirect: {
        path: '/group/admin/'
      },
      children: [
        {
          name: 'GroupAdmin',
          path: '/group/admin/',
          component: GroupAdmin
        },
        {
          name: 'GroupAdd',
          path: '/group/add/',
          component: GroupAdd
        }
      ]
    },
    /**
     * [Failed 404]
     */
    {
      name: 'Failed',
      path: '/404/',
      component: Failed,
      hidden: true
    },

    /**
     * [Others 其它]
     */
    {
      name: 'Others',
      path: '*',
      redirect: {
        path: '/404/'
      }
    }
  ]
})
