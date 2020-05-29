import Vue from 'vue'
import Vuex from 'vuex'

import * as mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

const state = {
  /**
   * [XUEKE 学科]
   */
  XUEKE: [
    { id: '-2', name: '全部' },
    { id: '-1', name: '艺术综合' },
    { id: '1', name: '音乐' },
    { id: '2', name: '美术' }
  ],
  /**
  * [XUEKE 改版-学科]
  */
  XUEKE2: [
    { id: '', name: '全部' },
    { id: '1', name: '音乐' },
    { id: '2', name: '美术' },
    { id: '3', name: '艺术综合' }
  ],

  /**
   * [XUEDUAN 学段]
   */
  XUEDUAN: [
    { id: '-2', name: '全部' },
    { id: '1', name: '小学' },
    { id: '2', name: '初中' },
    { id: '3', name: '高中' },
    { id: '4', name: '中职' }
  ],

  /**
   * [NIANJI 年级]
   */
  NIANJI: [
    { id: '-2', name: '全部' },
    { id: '1', name: '一年级', xueduan: '1' },
    { id: '2', name: '二年级', xueduan: '1' },
    { id: '3', name: '三年级', xueduan: '1' },
    { id: '4', name: '四年级', xueduan: '1' },
    { id: '5', name: '五年级', xueduan: '1' },
    { id: '6', name: '六年级', xueduan: '1' },
    { id: '7', name: '七年级', xueduan: '2' },
    { id: '8', name: '八年级', xueduan: '2' },
    { id: '9', name: '九年级', xueduan: '2' },
    { id: '10', name: '高一', xueduan: '3' },
    { id: '11', name: '高二', xueduan: '3' },
    { id: '12', name: '高三', xueduan: '3' },
    { id: '13', name: '专一', xueduan: '4' },
    { id: '14', name: '专二', xueduan: '4' },
    { id: '15', name: '专三', xueduan: '4' }
  ],

  /**
   * [XUEQI 学期]
   */
  XUEQI: [
    { id: '-2', name: '全部' },
    { id: '1', name: '上学期' },
    { id: '2', name: '下学期' }
  ],

  /**
   * XINGBIE 性别]
   */
  XINGBIE: [
    { id: '-2', name: '全部' },
    { id: '0', name: '未填' },
    { id: '1', name: '男' },
    { id: '2', name: '女' }
  ],

  /**
   * [BIAODAN 表单验证规则]
   */
  BIAODAN: {
    need: [
      { required: true },
      {}
    ],
    needless: [
      { required: false },
      {}
    ],
    select: [
      { required: true, message: '请选择', trigger: 'change' },
      {}
    ],
    citycode: [
      { required: true, message: '请选择所属地区', trigger: 'change' },
      {}
    ],
    datetime: [
      { required: true, message: '请选择日期', trigger: 'blur' },
      {}
    ],
    account: [
      { required: true, message: '请输入账号', trigger: 'blur' },
      { min: 6, max: 12, message: '长度为 6 到 12 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 12, message: '长度为 6 到 12 个字符', trigger: 'blur' }
    ],
    number: [
      { required: true, message: '请输入数字', trigger: 'blur' },
      { min: 1, max: 6, message: '长度为 1 到 6 个字符', trigger: 'blur' }
    ],
    tel: [
      { required: true, message: '请输入电话', trigger: 'blur' },
      { len: 11, message: '长度为 11 个字符', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '请输入名称', trigger: 'blur' },
      { min: 2, max: 32, message: '长度为 2 到 32 个字符', trigger: 'blur' }
    ],
    no: [
      { required: true, message: '请输入学号', trigger: 'blur' },
      { min: 6, max: 18, message: '长度为 6 到 18 个字符', trigger: 'blur' }
    ],
    addr: [
      { required: true, message: '请输入地址', trigger: 'blur' },
      { min: 2, max: 500, message: '长度为 2 到 500 个字符', trigger: 'blur' }
    ],
    cont: [
      { required: true, message: '请输入内容', trigger: 'blur' },
      {}
    ],
    unit: [
      { required: false },
      { min: 1, max: 4, message: '长度在 1 到 4 个字符', trigger: 'blur' }
    ],
    desc: [
      { required: false },
      { min: 2, max: 500, message: '长度为 2 到 500 个字符', trigger: 'blur' }
    ]
  },

  /**
   * [PILIANG 批量操作]
   */
  PILIANG: [
    { id: '-2', name: '批量操作' },
    { id: '0', name: '批量导出' },
    { id: '1', name: '批量导入' }
  ],

  /**
   * [NIANFEN 年份]
   */
  NIANFEN: [
    { id: '2019', name: '2019年' },
    { id: '2020', name: '2020年' }
  ],
  NIANFEN2: [
    { id: '2019', name: '2019-2020学年' },
    { id: '2020', name: '2020-2021学年' }
  ]
}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
