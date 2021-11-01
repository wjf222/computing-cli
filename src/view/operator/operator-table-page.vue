<template>
  <div>
    <Card>
      <Input placeholder="搜索算子" style="width: auto; margin: 10px 10px;" v-model="inputOperator" :search=true
             @on-search="searchOperator">
        <Icon type="ios-search" slot="suffix"/>
      </Input>
      <Button style="margin: 10px 10px;" type="primary" @click="searchOperator">搜索</Button>
      <Button style="margin: 10px 10px;" type="success" @click="addOperator">添加</Button>
      <Button style="margin: 10px 10px;" type="error" @click="delOperatorById">删除</Button>
      <tables stripe :loading="loading" ref="tables" @on-edit="editOperator" v-model="nowData" :columns="columns"
              @on-selection-change="getOperatorById"/>
      <Page :total="dataCount" ref="page" :current.sync="pageCurrent" :page-size="pageSize" @on-change="changepage" show-elevator />
    </Card>
    <Modal width=800 v-model="add" title="修改算子" @on-ok="saveOperator" @on-cancel="cancel">
      <Row :gutter="16">
        <i-Col span="3" offset="2">
          <p style="font-size: 15px">Name</p>
        </i-Col>
        <i-Col span="5">
          <i-Input v-model="modalValue.dataSourceName" placeholder="请输入..."></i-Input>
        </i-Col>
        <i-Col span="3" offset="2">
          <p style="font-size: 15px">NameSpace</p>
        </i-Col>
        <i-Col span="5">
          <i-Select v-model="modalValue.selectedType" @on-change="changeDataType">
            <i-Option v-for="item in modalValue.type" :value="item.value" :key="item.value">{{ item.label }}</i-Option>
          </i-Select>
        </i-Col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-Col span="3" offset="2">
          <p style="font-size: 15px">Tag</p>
        </i-Col>
        <i-Col span="5">
          <i-Input v-model="modalValue.ip" placeholder="请输入..."></i-Input>
        </i-Col>
        <i-Col span="3" offset="2">
          <p style="font-size: 15px">MainClass</p>
        </i-Col>
        <i-Col span="5">
          <i-Input v-model="modalValue.port" placeholder="请输入..."></i-Input>
        </i-Col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-Col span="3" offset="2">
          <p style="font-size: 15px">RunTimeType</p>
        </i-Col>
        <i-Col span="5">
          <i-Input v-model="modalValue.userName" placeholder="请输入..."></i-Input>
        </i-Col>
        <i-Col span="3" offset="2">
          <p style="font-size: 15px">Description</p>
        </i-Col>
        <i-Col span="5">
          <i-Input type="password" v-model="modalValue.password" placeholder="请输入..."></i-Input>
        </i-Col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-Col span="3" offset="2">
          <p style="font-size: 15px">CreateTime</p>
        </i-Col>
        <i-Col span="5">
          <Date-picker type="date" placeholder="选择日期" v-model="modalValue.dataBaseName" ></Date-picker>
        </i-Col>
        <i-Col span="3" offset="2">
          <p style="font-size: 15px">上传文件</p>
        </i-Col>
        <i-Col span="5">
          <Upload action="//jsonplaceholder.typicode.com/posts/">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
          </Upload>
        </i-Col>
      </Row>
      <br>

      <Row slot="footer">
        <i-Col span="4" offset="11">
          <Button type="primary" @click="saveOperator">保存</Button>
        </i-Col>
        <i-Col span="4">
          <Button @click="cancel">取消</Button>
        </i-Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getTableData } from '@/api/data'
import axios from '@/libs/api.request'

export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        // 必选
        { title: 'OperatorName', key: 'name', sortable: true },
        { title: 'OperatorNamespace', key: 'email', editable: true },
        { title: 'OperatorTag', key: 'email', editable: true },
        // 可选
        { title: 'OperatorMainClass', key: 'email', editable: true },
        { title: 'OperatorRuntimeType', key: 'email', editable: true },
        { title: 'OperatorDescription', key: 'email', editable: true },
        { title: 'Create-Time', key: 'createTime' },
        {
          title: '修改',
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
                  // 可以使用比例单位改进
                  marginRight: '0px'
                },
                on: {
                  click: () => {
                    this.editOperator(params)
                  }
                }
              }, '修改')

            ])
          }
        }
      ],
      tableData: [],
      nowData: [],
      add: false,
      pageCurrent: 2,
      dataCount: 10,
      pageSize: 10,
      editOradd: false,
      inputOperator: '',
      modalValue: {
        dataSourceName: '',
        type: [{
          value: 'mysql',
          label: 'mysql'
        }
          // {
          //   value: 'oracle',
          //   label: 'oracle'
          // }
        ],
        // 数据源用途
        purpose: [{
          value: 0,
          label: '抽取数据源'
        }, {
          value: 1,
          label: '载入数据源'
        }
        ],
        ip: '',
        port: '',
        userName: '',
        password: '',
        dataBaseName: '',
        selectedType: 'mysql',
        selectedPurpose: 0,
        // oracle数据库包含模式名
        schemeName: ''
      },
      purpose2: [{
        value: 0,
        label: '抽取数据源'
      },
      {
        value: 1,
        label: '载入数据源'
      }
      ],
      loading: false
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
    },

    editOperator (params) {
      // modal框读取对应数据
      console.log(params)
      this.testResult = -1
      this.add = true
      this.editOradd = true
      this.modalValue.id = params.row.id
      this.modalValue.dataSourceName = params.row.name
      this.modalValue.ip = params.row.ip
      this.modalValue.port = params.row.port
      this.modalValue.userName = params.row.username
      this.modalValue.password = params.row.password
      this.modalValue.dataBaseName = params.row.dataBaseName
      this.modalValue.selectedType = params.row.type
      this.modalValue.selectedPurpose = params.row.extract
    },
    saveOperator () {
      if (this.editOradd) {
        // 待更新
        this.editDatasource()
      } else {
        this.addDatasource()
      }
    },
    // 添加modal
    cancel () {
      this.add = false
    }, // 确定
    changeDataType (value) {
    },
    getOperators (tag, namespace, name) {
      /**
       * 返回Operators全量数据
       */
      return axios.request({
        url: '/operators',
        method: 'get'
      })
    },

    searchOperator () {
      console.log('searchOperator')
      var that = this
      var it = this.inputOperator
      axios.request({
        url: '/operators',
        method: 'get',
        params: {
          namespace: it
        }
      }).then(function (response) {
        var resdata = response.data
        that.tableData = resdata
        that.loading = false
        that.dataCount = resdata.length
        // // that.nowData=response.data.datasources.slice(0,10)
        that.freshpage(that.pageCurrent)
      })
    },
    getOperatorById (id) {
      /**
       * 根据id检索指定operator
       */
      return axios.request({
        url: '/operators',
        method: 'get'
      })
    },

    addOperator () {
      /**
       * 创建 operator
       */
      return axios.request({
        url: '/operators/:id',
        method: 'post'
      })
    },

    uploadOperatorById (id, upload_file) {
      /**
       * 上传 operator
       */
      return axios.request({
        url: '/operators/:id',
        method: 'put'
      })
    },

    delOperatorById (id) {
      /**
       * 删除指定的 operator
       */
      return axios.request({
        url: '/operators/:id',
        method: 'delete'
      })
    },
    // 当有数据更新刷新页面
    freshpage () {
      // 考虑把pageCurrent变为0整页删除bug
      this.pageCurrent = 1
      this.changepage(this.pageCurrent)
      // this.$refs.page.current=1;
    },
    // 点击，切换页面
    changepage (index) {
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
    }
  },
  mounted () {
    getTableData().then(res => {
      var that = this
      that.tableData = res.data
      that.dataCount = resdata.length
      that.freshpage()
    })
  }
}
</script>

<style>

</style>
