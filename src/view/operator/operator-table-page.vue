<template>
  <div>
    <Card>
      <Input placeholder="命名空间" style="width: auto; margin: 10px 10px;" v-model="searchValue.namespace" :search=true></Input>
      <Input placeholder="算子" style="width: auto; margin: 10px 10px;" v-model="searchValue.name" :search=true></Input>
      <Button style="margin: 10px 10px;" type="primary" @click="searchOperator">搜索</Button>
      <Button style="margin: 10px 10px;" type="success" @click="addOperatorModal">添加</Button>
      <tables stripe :loading="loading" ref="tables" @on-edit="editOperatorModal" v-model="nowData" :columns="columns"
              @on-selection-change="getOperatorById"/>
      <Page :total="dataCount" ref="page" :current.sync="pageCurrent" :page-size="pageSize" @on-change="changepage" show-elevator />
    </Card>
    <Modal width=800 v-model="add" title="修改算子" @on-ok="saveOperator" @on-cancel="cancel">
      <Row :gutter="16">
        <i-col span="3" offset="2">
          <p style="font-size: 15px">算子名称</p>
        </i-col>
        <i-col span="5">
          <i-input v-model="modalValue.OperatorName" placeholder="请输入..."></i-input>
        </i-col>
        <i-col span="3" offset="2">
          <p style="font-size: 15px">主类</p>
        </i-col>
        <i-col span="5">
          <i-input v-model="modalValue.OperatorMainClass" placeholder="请输入..."></i-input>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="3" offset="2">
          <p style="font-size: 15px">命名空间</p>
        </i-col>
        <i-col span="5">
          <i-input v-model="modalValue.OperatorNamespace" placeholder="请输入..."></i-input>
        </i-col>
        <i-col span="3" offset="2">
          <p style="font-size: 15px">版本号</p>
        </i-col>
        <i-col span="5">
          <i-input v-model="modalValue.OperatorTag" placeholder="请输入..."></i-input>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="3" offset="2">
          <p style="font-size: 15px">运行类型</p>
        </i-col>
        <i-col span="5">
          <i-input v-model="modalValue.OperatorRuntimeType" placeholder="请输入..."></i-input>
        </i-col>
        <i-col span="3" offset="2">
          <p style="font-size: 15px">描述</p>
        </i-col>
        <i-col span="5">
          <i-input type="password" v-model="modalValue.OperatorDescription" placeholder="请输入..."></i-input>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="3" offset="2">
          <p style="font-size: 15px">上传文件</p>
        </i-col>
        <i-col span="5">
          <Upload :action="modalValue.id" >
            <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
          </Upload>
        </i-col>
      </Row>
      <br>
      <Row slot="footer">
        <i-col span="4" offset="11">
          <Button type="primary" @click="saveOperator">保存</Button>
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
import axios from 'axios'

export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        // 必选
        { title: '序号', key: 'ID', sortable: true },
        { title: '创建时间', key: 'CreatedAt', editable: true },
        { title: '修改时间', key: 'UpdatedAt', editable: true },
        // 可选
        { title: '删除时间', key: 'DeletedAt', editable: true },
        { title: '算子名称', key: 'OperatorName', editable: true },
        { title: '算子主类', key: 'OperatorMainClass', editable: true },
        { title: '命名空间', key: 'OperatorNamespace' },
        { title: '文件路径', key: 'OperatorFilePath' },
        { title: '标签', key: 'OperatorTag' },
        { title: '运行类型', key: 'OperatorRuntimeType' },
        { title: '描述', key: 'OperatorDescription' },
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
                    this.editOperatorModal(params)
                  }
                }
              }, '修改')

            ])
          }
        }
      ],
      searchValue: {
        namespace: '',
        name: ''
      },
      tableData: [],
      nowData: [],
      add: false,
      pageCurrent: 1,
      dataCount: 10,
      pageSize: 10,
      editOradd: false,
      inputOperator: '',
      modalValue: {
        id: 0,
        OperatorName: '',
        OperatorMainClass: '',
        // 数据源用途
        OperatorNamespace: '',
        OperatorTag: '',
        OperatorRuntimeType: '',
        OperatorDescription: '',
        OperatorFilePath: ''
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

    editOperatorModal (params) {
      // modal框读取对应数据
      this.add = true
      this.editOradd = true
      this.modalValue.OperatorName = params.row.OperatorName
      this.modalValue.OperatorMainClass = params.row.OperatorMainClass
      this.modalValue.OperatorNamespace = params.row.OperatorNamespace
      this.modalValue.OperatorTag = params.row.OperatorTag
      this.modalValue.OperatorRuntimeType = params.row.OperatorRuntimeType
      this.modalValue.OperatorDescription = params.row.OperatorDescription
      this.modalValue.OperatorFilePath = params.row.OperatorFilePath
      this.modalValue.id = 'http://192.168.1.210:32001/computing-meta/v1beta1/metadata/operators/' + params.row.ID + '?op=upload'
    },
    addOperatorModal () {
      // modal框读取对应数据
      this.add = true
      this.editOradd = false
      this.modalValue.OperatorName = ''
      this.modalValue.OperatorMainClass = ''
      this.modalValue.OperatorNamespace = ''
      this.modalValue.OperatorTag = ''
      this.modalValue.OperatorRuntimeType = ''
      this.modalValue.OperatorDescription = ''
      this.modalValue.OperatorFilePath = ''
    },

    saveOperator () {
      if (this.editOradd) {
        // 待更新
        this.editDatasource()
      } else {
        this.addOperator()
      }
    },
    addOperator () {
      const that = this
      const data = {
        // 必选参数
        OperatorName: this.modalValue.OperatorName,
        OperatorNamespace: this.modalValue.OperatorNamespace,
        OperatorMainClass: this.modalValue.OperatorMainClass,
        OperatorTag: this.modalValue.OperatorTag,
        // 可选参数
        OperatorRuntimeType: this.modalValue.OperatorRuntimeType,
        OperatorDescription: this.modalValue.OperatorDescription
      }
      axios({
        headers: {
          'Content-Type': 'application/json'
        },
        url: this.GLOBAL.operatorUrl + `operators`,
        method: 'post',
        withCredentials: true,
        data: data
      }).then(res =>
        console.log(res)
      )
      that.freshpage2()
    },

    // addOperator(){
    //
    // }
    // 添加modal
    cancel () {
      this.add = false
    }, // 确定
    changeDataType (value) {
    },
    getOperators (namespace, name) {
      /**
       * 返回Operators全量数据
       */
      console.log('wjf')
      return axios({
        // url: this.GLOBAL.operatorUrl + 'operators',
        url: this.GLOBAL.operatorUrl + 'operators',
        method: 'get',
        withCredentials: true,
        params: {
          namespace: namespace,
          name: name
        }
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
    freshpage2 () {
      // 考虑把pageCurrent变为0整页删除bug
      this.pageCurrent = 1
      this.changepage(this.pageCurrent)
      // this.$refs.page.current=1;
    },
    searchOperator () {
      let it = this.searchValue
      this.getOperators(it.namespace, it.name).then(res => {
        console.log(res.data.data)
        let that = this
        that.tableData = res.data.data
        that.dataCount = res.data.data.length
        that.freshpage2()
      })
    },
    // 点击，切换页面
    changepage (index) {
      // console.log(this.pageCurrent)
      // 需要显示开始数据的index,(因为数据是从0开始的，页码是从1开始的，需要-1)
      const _start = (index - 1) * this.pageSize
      // 需要显示结束数据的index
      const _end = index * this.pageSize
      // 截取需要显示的数据
      this.nowData = this.tableData.slice(_start, _end)
      // 储存当前页
      this.pageCurrent = index
    }
  },
  mounted () {
    this.getOperators().then(res => {
      var that = this
      that.tableData = res.data.data
      that.dataCount = res.data.data.length
      that.freshpage()
    })
  }
}
</script>

<style>

</style>
