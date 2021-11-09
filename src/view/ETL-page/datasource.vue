<template>
<div>
  <Card>

    <Icon type="md-analytics" size="32" />

    <tables stripe :loading="loading" ref="tables" v-model="nowData" :columns="columns" @on-edit="editsource" @on-selection-change="selectETL" />
    <Button style="margin: 10px 10px;" type="success" @click="addsource">添加</Button>
    <Button style="margin: 10px 10px;" type="error" @click="deletesource">删除</Button>
    <Page :total="dataCount" ref="page" :current.sync="pageCurrent" :page-size="pageSize" @on-change="changepage" show-elevator />
  </Card>
  <Modal width=800  v-model="add" title="添加数据源" @on-ok="saveDataSource" @on-cancel="cancel">
    <Row :gutter="16">
      <i-Col span="3" offset="2">
        <p style="font-size: 15px">数据源名称</p>
      </i-Col>
      <i-Col span="5">
        <i-Input v-model="modalValue.dataSourceName" placeholder="请输入..."></i-Input>
      </i-Col>
      <i-Col span="3" offset="2" >
        <p style="font-size: 15px">数据源类型</p>
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
        <p style="font-size: 15px">数据源IP</p>
      </i-Col>
      <i-Col span="5">
        <i-Input v-model="modalValue.ip" placeholder="请输入..."></i-Input>
      </i-Col>
      <i-Col span="3" offset="2">
        <p style="font-size: 15px">数据源端口</p>
      </i-Col>
      <i-Col span="5">
        <i-Input v-model="modalValue.port" placeholder="请输入..."></i-Input>
      </i-Col>
    </Row>
    <br>
    <Row :gutter="16">
      <i-Col span="3" offset="2">
        <p style="font-size: 15px">用户名称</p>
      </i-Col>
      <i-Col span="5">
        <i-Input v-model="modalValue.userName" placeholder="请输入..."></i-Input>
      </i-Col>
      <i-Col span="3" offset="2">
        <p style="font-size: 15px">密码</p>
      </i-Col>
      <i-Col span="5">
        <i-Input type="password" v-model="modalValue.password" placeholder="请输入..."></i-Input>
      </i-Col>
    </Row>
    <br>
    <Row :gutter="16">
      <i-Col span="3" offset="2">
        <p style="font-size: 15px">数据库名称</p>
      </i-Col>
      <i-Col span="5">
        <i-Input v-model="modalValue.dataBaseName" placeholder="请输入..."></i-Input>
      </i-Col>
      <i-Col span="3" offset="2">
        <p style="font-size: 15px">数据源用途</p>
      </i-Col>
      <i-Col span="5">
        <i-Select v-model="modalValue.selectedPurpose" @on-change="changeDataType">
          <i-Option v-for="item in purpose2" :value="item.value" :key="item.value">{{ item.label }}</i-Option>
        </i-Select>
      </i-Col>
    </Row>
    <br>
    <Row :gutter="16">
      <i-Col span="5" offset="4">
        <i-Button type="success" @click="testDataSource">
          测试连接
        </i-Button>
      </i-Col>
      <i-Col span="10">
        <div v-if="testResult == -1">
          <Alert v-model="testResult" show-icon>测试连接结果</Alert>
        </div>
        <div v-if="testResult == 2">
          <Alert v-model="testResult" type="warning" show-icon>连接中，请稍后...</Alert>
        </div>
        <div v-if="testResult == 1">
          <Alert v-model="testResult" type="success" show-icon>测试成功</Alert>
        </div>
        <div v-if="testResult == 0">
          <Alert v-model="testResult" type="error" show-icon>测试失败，请检查配置信息！</Alert>
        </div>
      </i-Col>
    </Row>

    <Row slot="footer">
      <i-Col span="4" offset="11">
        <Button type="primary" @click="saveDataSource">保存</Button>
      </i-Col>
      <i-Col span="4">
        <Button @click="cancel">取消</Button>
      </i-Col>
    </Row>
  </Modal>
</div>
</template>

<script>
import axios from 'axios'
import crypto from '@/libs/crypto'
import Tables from '_c/tables'
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
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
      purpose2: [{
        value: 0,
        label: '抽取数据源'
      },
      {
        value: 1,
        label: '载入数据源'
      }
      ],
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
        },
        {
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
      testResult: -1,
      // 数据表
      columns: [{
        type: 'selection',
        width: 60,
        align: 'center'
      },
      {
        title: '序号',
        type: 'index',
        width: 60,
        align: 'center'
      },
      {
        title: '数据源名称',
        key: 'name',
        sortable: true
      },
      {
        title: '数据源类型',
        key: 'type'
      },
      {
        title: '数据源ip',
        key: 'ip'
      },
      {
        title: '数据源端口',
        key: 'port'
      },
      {
        title: '用途',
        // 使用render加载数据中的级联数据,这里需要加入判断，如果没有分配主题显示无。
        render: (h, params) => {
          if (this.nowData[params.index].extract == 0) {
            return h('span', '抽取数据源')
          } else {
            return h('span', '加载数据源')
          }
        }
      },
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
                  this.editsource(params)
                }
              }
            }, '修改')

          ])
        }
      }
      ],
      tableData: [],
      loading: true
    }
  },
  methods: {
    testfunc () {
      var t = crypto.encrypt('aaaaaaaaaa')
      var tt = crypto.decrypt(t)
      alert(tt)
    },
    // 添加modal
    cancel () {
      this.add = false
    }, // 确定
    editsource (params) {
      // modal框读取对应数据
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
    addsource () {
      this.add = true
      this.editOradd = false
      this.modalValue = {
        id: 0,
        dataSourceName: '',
        type: [{
          value: 'mysql',
          label: 'mysql'
        }
        ],
        ip: '',
        port: '',
        userName: '',
        password: '',
        dataBaseName: '',
        selectedType: '',
        selectedPurpose: 0,
        // oracle数据库包含模式名
        schemeName: ''
      }
    },
    addDatasource () {
      const that = this
      const url = this.getUrl()
      const param = {
        loginname: 'superadmin',
        // loginname: window.parent.root.user.loginname,
        dataSourceName: this.modalValue.dataSourceName,
        url: url,
        username: this.modalValue.userName,
        password: this.modalValue.password,
        type: this.modalValue.selectedType,
        extract: this.modalValue.selectedPurpose
      }
      // alert(param.loginname);
      if (this.checkModalData() === true) {
        axios({
          method: 'post',
          url: this.GLOBAL.etlUrl + 'api/add_datasource',
          withCredentials: true,
          params: param
        }).then(function (response) {
          const data1 = response.data
          if (data1['status'] === true) {
            that.addDataSourceModal = false
            that.$Modal.success({
              title: '成功',
              content: '添加数据源成功！'
            })
            // 重新加载数据源
            that.getETLSourcedata()
          } else {
            that.$Modal.error({
              title: '失败',
              content: '服务器端出错，请检查！'
            })
          }
        })
        this.add = false
      }
    },
    editDatasource () {
      const that = this
      const url = this.getUrl()
      const params = {
        id: this.modalValue.id,
        loginname: 'superadmin',
        // loginname: window.parent.root.user.loginname,
        dataSourceName: this.modalValue.dataSourceName,
        url: url,
        username: this.modalValue.userName,
        password: this.modalValue.password,
        type: this.modalValue.selectedType,
        extract: this.modalValue.selectedPurpose
      }
      const param_str = crypto.encrypt(JSON.stringify(params))
      const param = {
        info: param_str
      }
      if (this.checkModalData() === true) {
        axios({
          method: 'post',
          url: this.GLOBAL.etlUrl + 'dataSource/update_dataSource',
          withCredentials: true,
          params: param
        }).then(function (response) {
          const data1 = response.data
          // alert(data.data['status']);
          if (data1 == 'success') {
            that.addDataSourceModal = false
            that.$Modal.success({
              title: '成功',
              content: '修改数据源成功！'
            })
            // 从新加载数据源
            that.getETLSourcedata()
          } else {
            this.$Modal.error({
              title: '失败',
              content: '服务器端出错，请检查！'
            })
          }
        })
        // this.$Message.info('数据源保存成功！');
        this.add = false
      };
    },
    saveDataSource () {
      if (this.editOradd) {
        // 待更新
        this.editDatasource()
      } else {
        this.addDatasource()
      }
    },
    // 测试数据源
    testDataSource () {
      if (this.checkModalData() === true) {
        this.testResult = 2
        const that = this
        const url = this.getUrl()
        const param = {
          url: url,
          password: this.modalValue.password,
          username: this.modalValue.userName,
          type: this.modalValue.selectedType,
          extract: this.modalValue.selectedPurpose
        }
        axios({
          method: 'post',
          url: this.GLOBAL.etlUrl + 'api/test_database',
          withCredentials: true,
          params: param
        }).then(function (response) {
          const data1 = response.data
          // alert(data.data['status']);
          if (data1['status'] == 1) {
            that.testResult = 1
          } else {
            that.testResult = 0
          }
        })
      }
    },
    // 检查模态框内数据有效性
    message (m) {
      this.$Message.error({
        content: m,
        duration: 5,
        closable: true
      })
    },
    checkModalData () {
      if (this.modalValue.dataSourceName === '') {
        this.message('请填写数据源名称！')
        return false
      }
      if (this.modalValue.selectedType === '') {
        this.message('请选择数据源类别！')
        return false
      }
      if (this.modalValue.ip === '') {
        this.message('请填写数据源IP！')
        return false
      }
      if (this.modalValue.port === '') {
        this.message('请填写数据源端口！')
        return false
      }
      if (this.modalValue.userName === '') {
        this.message('请填写数据源用户名！')
        return false
      }
      if (this.modalValue.password === '') {
        this.message('请填写数据源密码！')
        return false
      }
      if (this.modalValue.dataBaseName === '') {
        this.message('请填写数据库名称！')
        return false
      }
      if (this.modalValue.selectedPurpose === -1) {
        this.message('请选择数据源用途！')
        return false
      }
      return true
    },
    // 根据填写的数据源信息拼接url
    getUrl () {
      let url
      if (this.modalValue.selectedType == 'mysql') {
        url = 'jdbc:' + this.modalValue.selectedType +
          '://' + this.modalValue.ip + ':' +
          this.modalValue.port + '/' + this.modalValue.dataBaseName
      }
      if (this.modalValue.selectedType == 'oracle') {
        url = 'jdbc:' + this.modalValue.selectedType + ':thin:@' +
          this.modalValue.ip + ':' + this.modalValue.port + ':' +
          this.modalValue.dataBaseName + '#' + this.modalValue.schemeName
      }
      return url
    },
    changeDataType (value) {
    },
    deletesource () {
      const that = this
      if (this.selecteSourcesId.toString() == '') {
        that.$Modal.info({
          title: '错误',
          content: '未选择数据源'
        })
      } else if (this.selecteSourcesId.toString() != '') {
        const param = {
          loginname: 'superadmin',
          idsString: this.selecteSourcesId.toString()
        }
        // alert(param.loginname);
        axios({
          method: 'post',
          url: this.GLOBAL.etlUrl + 'dataSource/delete_dataSource',
          withCredentials: true,
          params: param
        }).then(function (response) {
          const data1 = response.data
          if (data1 == 'success') {
            that.addDataSourceModal = false
            that.$Modal.success({
              title: '成功',
              content: '删除数据源成功！'
            })
            // 重新加载数据源
            that.getETLSourcedata()
            that.freshpage()
          } else {
            that.$Modal.error({
              title: '失败',
              content: '服务器端出错，请检查！'
            })
          }
        })
        this.add = false
      }
    },

    selectETL (selection) {
      // alert(selection.length)
      this.selecteSourcesId = []
      for (const item of selection) {
        this.selecteSourcesId.push(item.id)
      }
    },
    getETLSourcedata () {
      var that = this
      var transTableData = []
      console.log(this.GLOBAL.etlUrl)
      axios({
        method: 'post',
        url: this.GLOBAL.etlUrl + 'api/get_etl_datasource_aes',
        withCredentials: true,
        params: {
          loginname: 'superadmin'
        }
      }).then(function (response) {
        // console.log(response.data.datasources.length)
        var resdata = JSON.parse(crypto.decrypt(response.data))

        for (const item of resdata) {
          transTableData.push({
            id: item.id,
            name: item.name,
            type: item.type,
            ip: that.aparturlIP(item.url),
            port: that.aparturlPort(item.url),
            extract: item.extract
          })
        }
        that.tableData = transTableData
        // console.log(transTableData)
        that.loading = false
        that.dataCount = resdata.length
        that.freshpage(that.pageCurrent)
      })
    },
    // 分解数据源urlip
    aparturlIP (url) {
      var array = url.split(':')
      var type = array[1]
      var ip = ''
      var port = ''
      if (type == 'mysql') {
        ip = array[2].substring(2, 20)
        port = array[3].split('/')[0]

        return ip
      } else if (type == 'oracle') {
        ip = array[3].substring(1, 20)
        port = array[4]
        return ip
      }
    },
    // 分解数据源urlport
    aparturlPort (url) {
      var array = url.split(':')
      var type = array[1]
      var ip = ''
      var port = ''
      if (type == 'mysql') {
        ip = array[2].substring(2, 20)
        port = array[3].split('/')[0]
        return port
      } else if (type == 'oracle') {
        ip = array[3].substring(1, 20)
        port = array[4]
        // console.log(type+"++"+ip+"++"+port);
        return port
      }
    },
    aparturlDatabasename (url) {
      var array = url.split(':')
      var type = array[1]
      var databaseName = ''
      if (type == 'mysql') {
        databaseName = array[3].split('/')[1]
        return databaseName
      } else if (type == 'oracle') {
        return databaseName
      }
    },
    // 刷新页面,页码是第二页但是数据裁剪得不对
    freshpage () {
      this.pageCurrent = 1
      this.changepage(this.pageCurrent)
    },
    // 点击，切换页面
    changepage (index) {
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
    this.getETLSourcedata()
  }
}
</script>

<style>

</style>
