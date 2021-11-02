<template>
  <div>
    <Card>
      <tables ref="tables" editable searchable search-place="top" v-model="tableData" :columns="columns" @on-delete="handleDelete"/>
      <Button style="margin: 10px 0;" type="primary" @click="exportExcel">导出为Csv文件</Button>
    </Card>
  </div>
</template>

<script>
import Tables from '_c/tables'
import { getPipelines } from '@/api/pipeline'
export default {
  name: 'tables_page',
  components: {
    Tables
  },
  data () {
    return {
      columns: [
        { title: 'Name', key: 'name', sortable: true },
        { title: 'Email', key: 'email', editable: true },
        { title: '节点', key: 'email', editable: true },
        { title: 'Id', key: 'Id', editable: true },
        { title: 'Create-Time', key: 'createTime' },
        {
          title: 'Action',
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
                    this.pipelineDetail(params.index)
                  }
                }
              }, 'View'),
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
              }, 'Delete')
            ])
          }
        }
      ],
      tableData: []
    }
  },
  methods: {

    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${(new Date()).valueOf()}.csv`
      })
    },

    show (index) {
      this.$Modal.info({
        title: 'User Info',
        content: `Name：${this.tableData[index].name}<br>Age：${this.tableData[index].email}<br>Address：${this.tableData[index].email}`
      })
    },

    remove (index) {
      this.tableData.splice(index, 1)
    },

    pipelineDetail (index) {
      // console.log(this.tableData[index])
      // console.log(this.tableData[index].name)
      // console.log(this.tableData[index].email)
      // console.log(this.tableData[index].Id)
      var Id = this.tableData[index].Id
      this.$router.push({
        name: 'pipeline_edit_page',
        params: {
          id: Id
        }
      })
    }
  },
  mounted () {
    getPipelines().then(res => {
      this.tableData = res.data
    })
  }
}
</script>

<style>

</style>
