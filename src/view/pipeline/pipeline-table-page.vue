<template>
  <div>
    <Card>
      <tables ref="tables" border searchable inputmode="" search-place="top" v-model="nowData" :columns="columns"
              @on-delete="delPipeline"/>
      <Page :total="dataCount" ref="page" :current.sync="pageCurrent" :page-size="pageSize" @on-change="changePage"
            show-elevator/>
    </Card>
    <Modal width=800 v-model="add" title="修改流水线" @on-ok="savePipeline" @on-cancel="cancel">
      <Row :gutter="16">
        <i-col span="4" offset="2">
          <p style="font-size: 15px">名称</p>
        </i-col>
        <i-col span="12">
          <Input v-model="modalValue.PipelineName" placeholder="请输入..."></Input>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="4" offset="2">
          <p style="font-size: 15px">命名空间</p>
        </i-col>
        <i-col span="12">
          <Input v-model="modalValue.PipelineNamespace" placeholder="请输入..."></Input>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="4" offset="2">
          <p style="font-size: 15px">用户名</p>
        </i-col>
        <i-col span="12">
          <Input v-model="modalValue.UserName" placeholder="请输入..."></Input>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="4" offset="2">
          <p style="font-size: 15px">描述</p>
        </i-col>
        <i-col span="12">
          <Input v-model="modalValue.PipelineDescription" placeholder="请输入..."></Input>
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
        PipelineDescription: '',
        PipelineGlobalParams: 'k1:v1;k2:v2'
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
          title: '标注ID',
          key: 'ID',
          sortable: true
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
                    this.pipelineDetail(params.row.ID)
                  }
                }
              }, params.row[params.column.key])
            ])
          }
        },
        {
          title: '命名空间',
          key: 'PipelineNamespace'
        },
        {
          title: '描述',
          key: 'PipelineDescription'
        },
        {
          title: '状态',
          key: 'PipelineStatus'
        },
        {
          title: '创建时间',
          key: 'CreatedAt',
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
    /**
     * 分页
     */
    freshPage () {
      // 考虑把pageCurrent变为0整页删除bug
      this.pageCurrent = 1
      this.changePage(this.pageCurrent)
      // this.$refs.page.current=1;
    },

    /**
     * 点击，切换页面
     * @param index
     */
    changePage (index) {
      // console.log(this.tableData)
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

    /**
     * 跳转到模组编辑页面
     * @param id
     */
    pipelineDetail (id) {
      console.log(id)
      this.$router.push({
        name: 'pipeline_edit_page',
        params: {
          id: id
        }
      })
    },

    getPipelines (namespace, name) {
      // TODO 后续添加该功能
      console.log(namespace)
      console.log(name)
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

    /**
     * 返回指定 id 的 pipeline
     * @param id
     * @returns {*}
     */
    getPipelineById (id) {
      // TODO 后续添加该功能
      console.log(id)
    },

    /**
     * 显示modal框，并将数据填写在对应位置
     * @param params
     */
    editPipelineModal (params) {
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

    cancel () {
      // 关闭modal
      this.add = false
    },

    /**
     * 创建 pipeline
     * @returns {*}
     */
    addPipeline () {
      // TODO 后续添加该功能
    },

    /**
     * 修改指定 id 的 pipeline
     * @param params
     * @returns {*}
     */
    modifyPipeline (params) {
      // TODO 后续添加该功能
      console.log(params)
    },

    /**
     * 删除指定 id 的 pipeline
     * @param id
     * @returns {*}
     */
    delPipeline (id) {
      // TODO 后续添加该功能
      console.log(id)
    },

    /**
     * 对 pipeline 执⾏操作, 支持 "start" 和 "stop"
     * @param id
     * @param op
     * @returns {*}
     */
    startOrStop (id, op) {
      // TODO 创建start和stop按钮
      console.log(id)
      console.log(op)
    },

    /**
     * 检查editModal必选项
     * @returns {boolean}
     */
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
      let that = this
      console.log(res)
      that.tableData = res.data.data
      that.dataCount = res.data.data.length
      that.freshPage()
    })
  }
}
</script>

<style>

</style>
