<template>
  <div>
    <Card>
      <Button style="margin: 10px 10px;" type="primary" @click="searchTheme">搜索</Button>
      <Button style="margin: 10px 10px;" type="success" @click="addTheme">添加</Button>
      <Button style="margin: 10px 10px;" type="warning" @click="editTheme">修改</Button>
      <Button style="margin: 10px 10px;" type="error" @click="deleteTheme">删除</Button>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete"/>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getTableData } from '@/api/data'
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
          title: 'Handle',
          key: 'handle',
          options: ['delete'],
          button: [
            (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    vm.$emit('on-delete', params)
                    vm.$emit('input', params.tableData.filter((item, index) => index !== params.row.initRowIndex))
                  }
                }
              }, [
                h('Button', '修改')
              ])
            }
          ]
        }
      ],
      tableData: []
    }
  },
  methods: {
    handleDelete (params) {
      console.log(params)
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
