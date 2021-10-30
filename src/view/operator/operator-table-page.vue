<template>
  <div>
    <Card>
      <Input placeholder="搜索算子" style="width: auto; margin: 10px 10px;" v-model="inputTheme" :search=true
             @on-search="getOperatorById">
        <Icon type="ios-search" slot="suffix"/>
      </Input>
      <Button style="margin: 10px 10px;" type="primary" @click="getOperatorById">搜索</Button>
      <Button style="margin: 10px 10px;" type="success" @click="addOperator">添加</Button>
      <Button style="margin: 10px 10px;" type="error" @click="delOperatorById">删除</Button>
      <tables stripe :loading="loading" ref="tables" v-model="tableData" :columns="columns"
              @on-selection-change="getOperatorById"/>
    </Card>
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
                    this.operatorDetail(params)
                  }
                }
              }, '修改')

            ])
          }
        }
      ],
      tableData: []
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
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

    operatorDetail () {

    }
  },
  mounted () {
    getTableData().then(res => {
      this.tableData = res.data
    })
  }
}
</script>

<style>

</style>
