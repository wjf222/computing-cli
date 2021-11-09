<template>
  <div>
    <Card>
      <Input placeholder="搜索流水线命名空间" style="width: auto; margin: 10px 10px;" v-model="searchValue.namespace" :search=true></Input>
      <Input placeholder="搜索流水线命名" style="width: auto; margin: 10px 10px;" v-model="searchValue.name" :search=true></Input>
      <Button style="margin: 10px 10px;" type="primary" @click="searchPipeline">搜索</Button>
      <Button style="margin: 10px 10px;" type="success" @click="addPipelineModal">添加流水线</Button>
      <tables ref="tables" border inputmode="" search-place="top" v-model="nowData" :columns="columns"
              @on-delete="delPipeline"/>
      <Page :total="dataCount" ref="page" :current.sync="pageCurrent" :page-size="pageSize" @on-change="changePage"
            show-elevator/>
    </Card>
    <Modal width=800 v-model="modalValue.add" title="修改流水线" @on-ok="savePipelineModalData" @on-cancel="cancelPipelineModalData">
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
          <p style="font-size: 15px">描述</p>
        </i-col>
        <i-col span="12">
          <Input v-model="modalValue.PipelineDescription" placeholder="请输入..."></Input>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="4" offset="2">
          <p style="font-size: 15px">参数</p>
        </i-col>
        <i-col span="12">
          <Input v-model="modalValue.PipelineGlobalParams" placeholder="请输入..."></Input>
        </i-col>
      </Row>
      <br>
      <Row slot="footer">
        <i-col span="4" offset="11">
          <Button type="primary" @click="savePipelineModalData">保存</Button>
        </i-col>
        <i-col span="4">
          <Button @click="cancelPipelineModalData">取消</Button>
        </i-col>
      </Row>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import axios from 'axios'

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

      // 搜索选项
      searchValue: {
        namespace: '',
        name: ''
      },

      modalValue: {
        // 判断modal是否显示
        add: false,
        // 判断是新增页面还是修改页面
        editOrAdd: '',
        ID: 0,
        // 实际使用的参数
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
                    this.pipelineDetail(params)
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
          title: '参数',
          key: 'PipelineGlobalParams'
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
                    this.delPipeline(params)
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
     * 显示添加流水线的表单
     * @returns {*}
     */
    addPipelineModal () {
      this.modalValue = {
        add: true,
        editOrAdd: 'add',
        PipelineName: '',
        PipelineNamespace: '',
        PipelineDescription: '',
        PipelineGlobalParams: 'k1:v1;k2:v2'
      }
    },

    /**
     * 显示编辑流水线的表单
     * @param params
     */
    editPipelineModal (params) {
      console.log(params)
      this.modalValue = {
        add: true,
        editOrAdd: 'edit',
        ID: params.row.ID,
        PipelineName: params.row.PipelineName,
        PipelineNamespace: params.row.PipelineNamespace,
        PipelineDescription: params.row.PipelineDescription,
        PipelineGlobalParams: params.row.PipelineGlobalParams
      }
    },

    /**
     * 添加流水线
     */
    addPipeline () {
      const that = this
      const data = {
        // 必选参数
        PipelineName: this.modalValue.PipelineName,
        PipelineNamespace: this.modalValue.PipelineNamespace,
        // 可选参数
        PipelineDescription: this.modalValue.PipelineDescription,
        PipelineGlobalParams: this.modalValue.PipelineGlobalParams
      }
      if (this.checkPipelineModalData() === true) {
        axios({
          headers: {
            'Content-Type': 'application/json'
          },
          url: this.GLOBAL.dataUrl + `pipelines`,
          method: 'post',
          withCredentials: true,
          data: data
        }).then(function (response) {
          console.log(response)
          // if (data1['status'] === true) {
          //   that.addPipelineModal = false
          //   that.$Modal.success({
          //     title: '成功',
          //     content: '添加流水线成功！'
          //   })
          //   // 重新加载数据源
          //   that.getETLSourcedata()
          // } else {
          //   that.$Modal.error({
          //     title: '失败',
          //     content: '服务器端出错，请检查！'
          //   })
          // }
        })
        this.modalValue.add = false
      }
    },

    /**
     * 修改流水线
     */
    editPipeline () {
      let id = this.modalValue.ID
      const that = this
      const data = {
        // 必选参数
        PipelineName: this.modalValue.PipelineName,
        PipelineNamespace: this.modalValue.PipelineNamespace,
        // 可选参数
        PipelineDescription: this.modalValue.PipelineDescription,
        PipelineGlobalParams: this.modalValue.PipelineGlobalParams
      }
      if (this.checkPipelineModalData() === true) {
        axios({
          headers: {
            'Content-Type': 'application/json'
          },
          url: this.GLOBAL.dataUrl + `pipelines/${id}`,
          method: 'patch',
          withCredentials: true,
          data: data
        }).then(function (response) {
          console.log(response)
          that.loading = false
          that.freshpage()
        })
        this.modalValue.add = false
      }
    },

    /**
     * 检查模态框内数据有效性
     * @returns {boolean}
     */
    checkPipelineModalData () {
      if (this.modalValue.PipelineName === '') {
        this.message('请填写流水线名称！')
        return false
      }
      if (this.modalValue.PipelineNamespace === '') {
        this.message('请填写命名空间！')
        return false
      }
      return true
    },

    /**
     * 提交modal页面
     */
    savePipelineModalData () {
      let that = this
      switch (that.modalValue.editOrAdd) {
        case 'add': {
          this.addPipeline()
          break
        }
        case 'edit': {
          this.editPipeline()
          break
        }
      }
    },

    cancelPipelineModalData () {
      this.modalValue.add = false
    },

    /**
     * 跳转到模组编辑页面
     * @param params
     */
    pipelineDetail (params) {
      let id = params.row.ID
      console.log(id)
      this.$router.push({
        name: 'pipeline_edit_page',
        params: {
          id: id
        }
      })
    },

    /**
     * 删除流水线
     * @param params
     */
    delPipeline (params) {
      let id = params.row.ID
      let that = this
      axios.request({
        url: this.GLOBAL.dataUrl + `pipelines/${id}`,
        method: 'delete'
      }).then(function (response) {
        console.log(response)
        that.loading = false
        that.$Modal.success({
          title: '成功',
          content: '删除数据源成功！'
        })
        that.freshpage()
      })
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
     * 返回符合要求的pipeline列表
     */
    searchPipeline () {
      let namespace = this.searchValue.namespace
      let name = this.searchValue.name
      console.log(namespace)
      console.log(name)
      this.getPipeline(namespace, name).then(res => {
        let that = this
        console.log(res)
        that.tableData = res.data.data
        that.dataCount = res.data.data.length
        that.freshPage()
      })
    },

    /**
     * 返回符合要求的pipeline列表
     * @param namespace string
     * @param name string
     * @returns {AxiosPromise}
     */
    getPipeline (namespace, name) {
      console.log(this.GLOBAL.dataUrl)
      return axios({
        url: this.GLOBAL.dataUrl + 'pipelines',
        method: 'get',
        withCredentials: true,
        params: {
          namespace: namespace,
          name: name
        }
      })
    },

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
    }
  },

  mounted () {
    this.getPipeline().then(res => {
      let that = this
      that.tableData = res.data.data
      that.dataCount = res.data.data.length
      that.freshPage()
    })
  }
}
</script>

<style>

</style>
