<template>
  <div>
    <Card>
      <tables ref="tables" border searchable inputmode="" search-place="top" v-model="nowData" :columns="columns"
              @on-delete="delPipeline"/>
      <Page :total="dataCount" ref="page" :current.sync="pageCurrent" :page-size="pageSize" @on-change="changepage"
            show-elevator/>
    </Card>
    <Modal width=800 v-model="add" title="修改流水线" @on-ok="savePipeline" @on-cancel="cancel">
      <Row :gutter="16">
        <i-col span="4" offset="2">
          <p style="font-size: 15px">名称</p>
        </i-col>
        <i-col span="12">
          <i-Input v-model="modalValue.PipelineName" placeholder="请输入..."></i-Input>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="4" offset="2">
          <p style="font-size: 15px">命名空间</p>
        </i-col>
        <i-col span="12">
          <i-Input v-model="modalValue.PipelineNamespace" placeholder="请输入..."></i-Input>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="4" offset="2">
          <p style="font-size: 15px">用户名</p>
        </i-col>
        <i-col span="12">
          <i-Input v-model="modalValue.UserName" placeholder="请输入..."></i-Input>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="4" offset="2">
          <p style="font-size: 15px">描述</p>
        </i-col>
        <i-col span="12">
          <i-Input v-model="modalValue.PipelineDescription" placeholder="请输入..."></i-Input>
        </i-col>
      </Row>
      <br>
      <Row slot="footer">
        <i-col span="4" offset="11">
          <Button type="primary" @click="savePipeline">保存</Button>
        </i-col>
        <i-col span="4">
          <Button @click="cancel">取消</Button>
        </i-col>
      </Row>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getPipelines } from '@/api/pipeline'

export default {
  name: 'pipeline_table_page',
  components: {
    Tables
  },
  data: function () {
    return {
      // 分页
      dataCount: 10,
      pageSize: 10,
      pageCurrent: 1,
      nowData: [],

      // 多选删除
      selecteSourcesId: [],

      // 新增数据源modal
      add: false,
      editOradd: false,
      modalValue: {
        PipelineName: '',
        PipelineNamespace: '',
        UserName: '',
        PipelineDescription: ''
      },
      testResult: -1,

      // 数据表
      loading: true,
      columns: [
        {
          title: '序号',
          type: 'index',
          align: 'center'
        },
        {
          title: '名称',
          key: 'PipelineName',
          render: (h, params) => {
            return h('div', [
              h('a', {
                style: {
                  textDecoration: 'underline'
                },
                on: {
                  'click': () => {
                    this.pipelineDetail(params)
                  }
                }
              }, params.row[params.column.key])
            ])
          }
        },
        {
          title: '命名空间',
          key: 'PipelineNamespace',
          editable: true
        },
        {
          title: '用户名',
          key: 'UserName',
          editable: true
        },
        {
          title: '描述',
          key: 'PipelineDescription',
          editable: true
        },
        {
          title: '标注ID',
          key: 'Id',
          sortable: true
        },
        {
          title: '操作',
          key: 'action',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.editPipelineModal(params)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      tableData: []
    }
  },
  methods: {
    freshpage () {
      // 考虑把pageCurrent变为0整页删除bug
      this.pageCurrent = 1
      this.changepage(this.pageCurrent)
      // this.$refs.page.current=1;
    },

    changepage (index) {
      /**
       * 点击，切换页面
       */
      console.log(this.tableData)
      // console.log(this.pageCurrent)
      // 需要显示开始数据的index,(因为数据是从0开始的，页码是从1开始的，需要-1)
      const _start = (index - 1) * this.pageSize
      // 需要显示结束数据的index
      const _end = index * this.pageSize
      // 截取需要显示的数据
      this.nowData = this.tableData.slice(_start, _end)
      // 储存当前页
      console.log(this.nowData)
      this.pageCurrent = index
    },

    pipelineDetail (params) {
      // 跳转到模组编辑页面
      console.log(params)
      this.$router.push({
        name: 'pipeline_edit_page',
        params: {
          id: params.id
        }
      })
    },

    getPipelines (user, namespace, name) {
      /**
       * 返回符合要求的pipeline列表
       * 1. user为空 返回空列表；
       * 2. user不为空且namespace为空返回user对应的所有记录；
       * 3. user和namespace不为空且name为空，返回user和namespace对应的所有记录；
       * 4. 都不为空返回精确查找的记录。
       * 其中user默认值为“default”
       *
       * 参数：
       * · user, string
       * · namespace, string
       * · name, string
       *
       * 参数格式：
       * · URL末尾添加
       */
      return axios.request({
        url: '/pipelines',
        method: 'get'
      })
    },

    getPipelineById (id) {
      /**
       * 返回指定 id 的 pipeline
       *
       * 参数：
       * · id, string
       *
       * 参数格式：
       * · 跟随请求路径
       */
      return axios.request({
        url: '/pipelines/:id',
        method: 'get'
      })
    },

    editPipelineModal (params) {
      // modal框读取对应数据
      console.log(params)
      this.testResult = -1
      this.add = true
      this.editOradd = true
      this.modalValue.PipelineName = params.row.PipelineName
      this.modalValue.PipelineNamespace = params.row.PipelineNamespace
      this.modalValue.UserName = params.row.userName
      this.modalValue.PipelineDescription = params.row.PipelineDescription
    },

    savePipeline () {
      if (this.editOradd) {
        // 待更新
        this.modifyPipeline()
      } else {
        this.addPipeline()
      }
    },

    // 添加modal
    cancel () {
      this.add = false
    }, // 确定

    changeDataType (value) {
    },

    addPipeline () {
      /**
       * 创建 pipeline
       *
       * 参数：
       * {
       *   //必选参数
       *   “PipelineName”: "a",
       *   "PipelineNamespace": "24344556467532b",
       *   //可选参数
       *   "UserName": "x",
       *   "PipelineDescription": "x"
       * }
       *
       * 参数格式：
       * · json
       */
      return axios.request({
        url: '/pipelines',
        method: 'post'
      })
    },

    modifyPipeline (params) {
      /**
       * 修改指定 id 的 pipeline
       */
      console.log(params)
      return axios.request({
        url: '/pipelines/:id',
        method: 'patch'
      })
    },

    delPipeline (id) {
      /**
       * 删除指定 id 的 pipeline
       *
       * 参数：
       * · id, string
       *
       * 参数格式：
       * · URL末尾添加
       */
      return axios.request({
        url: '/pipelines/:id',
        method: 'delete'
      })
    },

    uploadPipelineById (id) {
      /**
       * 对 pipeline 执⾏操作
       *
       * 参数：
       * · op, string, 支持 "start" 和 "stop" ，在URL末尾添加
       *
       * 参数格式：
       * · URL末尾添加
       */
      return axios.request({
        url: '/pipelines/:id',
        method: 'put'
      })
    },

    checkModalData () {
      if (this.modalValue.PipelineName === '') {
        this.message('请填写流水线名称！')
        return false
      }
      if (this.modalValue.PipelineNamespace === '') {
        this.message('请填写命名空间！')
        return false
      }
      return true
    }
  },
  mounted () {
    getPipelines().then(res => {
      var that = this
      that.tableData = res.data
      that.dataCount = res.data.length
      that.freshpage()
    })
  }
}
</script>

<style>

</style>
