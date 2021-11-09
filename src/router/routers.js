import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        // component: () => import('@/view/single-page/home')
        component: resolve => require(['@/view/single-page/home'], resolve)
      }
    ]
  },
  {
    path: '/operator',
    name: 'operator',
    meta: {
      hideInBread: true
    },
    component: Main,
    children: [
      {
        path: 'operator_table_page',
        name: 'operator_table_page',
        meta: {
          icon: 'ios-hammer',
          title: '算子列表'
        },
        component: () => import('@/view/operator/operator-table-page.vue')
      }
    ]
  },
  {
    path: '/pipeline',
    name: 'pipeline',
    component: Main,
    meta: {
      hideInBread: true,
      title: '流水线'
    },
    children: [
      {
        path: 'pipeline_page',
        name: 'pipeline_page',
        meta: {
          icon: 'ios-hammer',
          title: '流水线'
        },
        component: () => import('@/view/pipeline/pipeline-table-page.vue')
      },
      {
        path: '/edit/:id',
        name: 'pipeline_edit_page',
        meta: {
          icon: 'ios-hammer',
          title: '编辑'
        },
        component: () => import('@/view/pipeline/pipeline-edit-page.vue')
      }
    ]
  },
  {
    path: '/ETL',
    name: 'ETL工具',
    meta: {
      icon: 'md-menu',
      title: 'ETL工具'
    },
    component: Main,
    children: [
      {
        path: '/dataSourceManage',
        name: '数据源管理',
        meta: {
          icon: 'md-funnel',
          title: '数据源管理'
        },
        // component: () => import('@/view/ETL-page/datasource.vue')
        component: resolve => require(['@/view/ETL-page/datasource.vue'], resolve)
      },
      {
        path: '/themeManage',
        name: '主题管理',
        meta: {
          icon: 'md-funnel',
          title: '主题管理'
        },
        // component: () => import('@/view/ETL-page/theme.vue')
        component: resolve => require(['@/view/ETL-page/theme.vue'], resolve)
      },
      {
        path: '/strategyManage',
        name: '策略管理',
        meta: {
          icon: 'md-funnel',
          title: '策略管理'
        },
        // component: () => import('@/view/ETL-page/strategy.vue')
        component: resolve => require(['@/view/ETL-page/strategy.vue'], resolve)
      },
      {
        path: '/etlStart',
        name: '策略启动',
        meta: {
          icon: 'md-funnel',
          title: '策略启动'
        },
        // component: () => import('@/view/ETL-page/etl_start.vue')
        component: resolve => require(['@/view/ETL-page/etl_start.vue'], resolve)
      }
      // {
      //   path: '/demo',
      //   name: '动态基线可视化demo',
      //   meta: {
      //     icon: 'md-funnel',
      //     title: '动态基线可视化demo'
      //   },
      //   component: () => import('@/view/ETL-page/demo.vue')
      // }
    ]
  },
  {
    path: '/analysis',
    name: '智能运维算法分析',
    meta: {
      icon: 'md-menu',
      title: '智能运维算法分析'
    },
    component: Main,
    children: [
      {
        path: 'meta-config',
        name: '算法配置',
        meta: {
          icon: 'md-funnel',
          title: '算法配置'
        },
        // component: () => import('@/view/analysis-page/meta-config.vue')
        component: resolve => require(['@/view/analysis-page/meta-config.vue'], resolve)
      },
      {
        path: 'job-config',
        name: '分析任务配置',
        meta: {
          icon: 'md-funnel',
          title: '分析任务配置'
        },
        // component: () => import('@/view/analysis-page/job-config.vue')
        component: resolve => require(['@/view/analysis-page/job-config.vue'], resolve)
      }
    ]
  },
  // 知识库
  {
    path: '/konwledgeDatabase',
    name: '知识库',
    meta: {
      icon: 'md-menu',
      title: '知识库'
    },
    component: Main,
    children: [
      {
        path: 'tag-manager',
        name: '标签管理',
        meta: {
          icon: 'md-funnel',
          title: '标签管理'
        },
        // component: () => import ('@/view/knowledge-page/tag-manager.vue')
        component: resolve => require(['@/view/knowledge-page/tag-manager.vue'], resolve)
      },
      {
        path: 'crawl',
        name: '爬虫管理',
        meta: {
          icon: 'md-funnel',
          title: '爬虫管理'
        },
        // component: () => import('@/view/knowledge-page/crawl.vue')
        component: resolve => require(['@/view/knowledge-page/crawl.vue'], resolve)
      },
      {
        path: 'knowledge',
        name: '知识库管理',
        meta: {
          icon: 'md-funnel',
          title: '知识库管理'
        },
        // component: () => import ('@/view/knowledge-page/knowledge.vue')
        component: resolve => require(['@/view/knowledge-page/knowledge.vue'], resolve)
      }
    ]
  },
  // //demo图件
  // {
  //   path: '/demoChart',
  //   name: 'demo图件',
  //   meta: {
  //     icon: 'md-menu',
  //     title: 'demo动态图件'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: '/demo',
  //       name: '动态基线可视化demo图件',
  //       meta: {
  //         icon: 'md-funnel',
  //         title: '动态基线可视化demo图件'
  //       },
  //       // component: () => import('@/view/ETL-page/demo.vue')
  //         component: resolve => require(['@/view/ETL-page/demo.vue'],resolve)
  //     },
  //
  //   ]
  // },
  {
    path: '/algorithm',
    name: '算法场景',
    meta: {
      icon: 'md-flower',
      title: '算法场景'
    },
    component: Main,
    children: [
      {
        path: 'alert-algo',
        name: '告警智能合并',
        meta: {
          icon: 'md-funnel',
          title: '告警智能合并'
        },
        component: resolve => require(['@/view/algorithm-page/Alert.vue'], resolve)
      }, {
        path: 'baseline',
        name: '动态基线算法',
        meta: {
          icon: 'md-funnel',
          title: '告警智能合并'
        },
        component: resolve => require(['@/view/algorithm-page/Baseline.vue'], resolve)
      }, {
        path: 'state-evaluation',
        name: '状态评价算法',
        meta: {
          icon: 'md-funnel',
          title: '状态评估算法'
        },
        component: resolve => require(['@/view/algorithm-page/StateEvaluation.vue'], resolve)
      }, {
        path: 'root',
        name: '故障根因算法',
        meta: {
          icon: 'md-funnel',
          title: '故障根因算法'
        },
        component: resolve => require(['@/view/algorithm-page/Root.vue'], resolve)
      },
      {
        path: 'timeseries',
        name: '时序关联算法',
        meta: {
          icon: 'md-funnel',
          title: '时序关联算法'
        },
        component: resolve => require(['@/view/algorithm-page/TimeSeries.vue'], resolve)
      }
    ]
  },
  // {
  //   path: 'ETL编辑',
  //   name: 'ETL编辑',
  //   meta: {
  //     icon: 'md-funnel',
  //     title: 'ETL策略编辑'
  //   },
  //   component: () => import('@/view/ETL-page/etlEdit.vue')
  // }
  {
    path: '/etlEdit',
    name: 'etlEdit',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'etlEdit_page',
        name: 'etlEdit_page',
        meta: {
          icon: 'md-notifications',
          title: 'ETL策略编辑'
        },
        // component: () => import('@/view/ETL-page/etlEdit.vue')
        component: resolve => require(['@/view/ETL-page/etlEdit.vue'], resolve)
      }
    ]
  },
  {
    path: '/etlCustomEdit',
    name: 'etlCustomEdit',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'etlCustomEdit_page',
        name: 'etlCustomEdit_page',
        meta: {
          icon: 'md-notifications',
          title: 'ETL策略编辑'
        },
        // component: () => import('@/view/ETL-page/etlCustomEdit.vue')
        component: resolve => require(['@/view/ETL-page/etlCustomEdit.vue'], resolve)
      }
    ]
  },
  {
    path: '/argu',
    name: 'argu',
    meta: {
      hideInMenu: true
    },
    component: Main,
    children: [
      {
        path: 'params/:id',
        name: 'params',
        meta: {
          icon: 'md-flower',
          title: route => `{{ params }}-${route.params.id}`,
          notCache: true,
          beforeCloseName: 'before_close_normal'
        },
        // component: () => import('@/view/argu-page/params.vue')
        component: resolve => require(['@/view/argu-page/params.vue'], resolve)
      },
      {
        path: 'query',
        name: 'query',
        meta: {
          icon: 'md-flower',
          title: route => `{{ query }}-${route.query.id}`,
          notCache: true
        },
        // component: () => import('@/view/argu-page/query.vue')
        component: resolve => require(['@/view/argu-page/query.vue'], resolve)
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    // component: () => import('@/view/error-page/401.vue')
    component: resolve => require(['@/view/error-page/401.vue'], resolve)
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    // component: () => import('@/view/error-page/500.vue')
    component: resolve => require(['@/view/error-page/500.vue'], resolve)
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    // component: () => import('@/view/error-page/404.vue')
    component: resolve => require(['@/view/error-page/404.vue'], resolve)
  }

]
