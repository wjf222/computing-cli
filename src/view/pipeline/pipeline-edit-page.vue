<template>
  <div>
    <Row :gutter="20" style="margin-top: 14px;" type="flex" justify="start" align="middle" class="item-row">
      <i-col :xs="12" :md="8" :lg="8" v-for="(item, i) in itemData" :key="`item-${i}`" style="margin-top: 14px;">
        <card>
          <p slot="title">节点{{ i }}</p>
          <Row type="flex" justify="start" align="middle" class="item-row">
            <p>{{ item.Name }}</p>
          </Row>
        </card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="8" style="margin-top: 14px;">
        <Card>
          <p slot="title">
            <Icon type="android-stopwatch"></Icon>
            添加新节点
          </p>
          <Row type="flex" justify="center" align="middle" class="item-row">
            <Icon type="android-stopwatch"></Icon>
            添加新节点
          </Row>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>

export default {
  name: 'pipeline_edit_page',
  components: {},
  data () {
    return {
      inforCardData: [
        { title: '新增用户', icon: 'md-person-add', count: 803, color: '#2d8cf0' },
        { title: '累计点击', icon: 'md-locate', count: 232, color: '#19be6b' }

      ],
      itemData: [
        { Name: 'x', Namespace: 'xx', ImageId: 1, OperatorId: 1, ObjectDataId: 1, Params: {}, color: '#2d8cf0' },
        { Name: 'x', Namespace: 'xx', ImageId: 1, OperatorId: 1, ObjectDataId: 1, Params: {}, color: '#ff9900' },
        { Name: 'x', Namespace: 'xx', ImageId: 1, OperatorId: 1, ObjectDataId: 1, Params: {}, color: '#ff9900' },
        { Name: 'x', Namespace: 'xx', ImageId: 1, OperatorId: 1, ObjectDataId: 1, Params: {}, color: '#ff9900' },
        { Name: 'x', Namespace: 'xx', ImageId: 1, OperatorId: 1, ObjectDataId: 1, Params: {}, color: '#ff9900' },
        { Name: 'x', Namespace: 'xx', ImageId: 1, OperatorId: 1, ObjectDataId: 1, Params: {}, color: '#ff9900' },
        { Name: 'x', Namespace: 'xx', ImageId: 1, OperatorId: 1, ObjectDataId: 1, Params: {}, color: '#ff9900' }
      ]
    }
  },

  methods: {
    init () {
      this.id = this.$route.params.id
      console.log(this.$route.params.id)
      // if (this.pageType == 1) {
      //   // 更新操作，进行赋值
      //   this.isTestSql = 1
      //   // 改成router
      //   let strategy = this.$route.params.update_strategy
      //   // console.log('created: ')
      //   // console.log(strategy)
      //   this.loadDataSources()
      //   this.select_extract_dataSource = strategy.etlExtractDataSource.id
      //   this.select_load_dataSource = strategy.etlLoadDataSource.id
      //   let that = this
      //   let param = {
      //     dataId: strategy.etlExtractDataSource.id
      //   }
      //   axios({
      //     method: 'post',
      //     url: this.GLOBAL.etlUrl + 'api/get_tables',
      //     withCredentials: true,
      //     params: param
      //   }).then(function (response) {
      //     var data = response.data
      //     if (data.status) {
      //       let tables = data.tables
      //       // 设置显示的table列表
      //       let ls = []
      //       for (let i = 0; i < tables.length; i++) {
      //         ls.push({
      //           key: tables[i],
      //           label: tables[i]
      //         })
      //       }
      //       that.extract_table = ls
      //       that.initUpdatePage()
      //     } else {
      //       console.log('所选取的数据源为无效数据源！')
      //     }
      //   })
      //   let param2 = {
      //     dataId: strategy.etlExtractDataSource.id,
      //     tableName: strategy.readtables
      //   }
      //   let extractColumns = this.splitStr(strategy.readcolumns)
      //   axios({
      //     method: 'post',
      //     url: this.GLOBAL.etlUrl + 'api/get_columns',
      //     withCredentials: true,
      //     params: param2
      //   }).then(function (response) {
      //     var data = response.data
      //     if (data['status']) {
      //       let columns = data.columns
      //       // 设置显示的column列表
      //       let ls = []
      //       for (let i = 0; i < columns.length; i++) {
      //         ls.push({
      //           key: columns[i],
      //           label: columns[i]
      //         })
      //       }
      //       // 穿梭框内所有字段
      //       that.extract_column = ls
      //       let selectedExtractColumns = []
      //       for (let i = 0; i < ls.length; i++) {
      //         for (let j = 0; j < extractColumns.length; j++) {
      //           // if (ls[i]['key'].indexOf(extractColumns[j]) >= 0) {
      //           // console.log(ls[i]['key'].split('（')[0] + '|' + extractColumns[j])
      //           // 防止空格，换行符等等显示两个字符串一致但是不相等
      //           let a = ls[i]['key'].split('（')[0].trim().replace(/\+/g, '').replace(/[ ]/g, '').replace(/[\r\n]/g, '')
      //           let b = extractColumns[j].trim().replace(/\+/g, '').replace(/[ ]/g, '').replace(/[\r\n]/g, '')
      //           if (a === b) {
      //             selectedExtractColumns.push(ls[i]['key'])
      //           }
      //         }
      //       }
      //       that.selected_extract_column = selectedExtractColumns
      //     } else {
      //       console.log('获取列名后台错误！')
      //     }
      //   })
      //   this.form_sql = strategy.remark
      //   this.changeLoadSource(strategy.etlLoadDataSource.id)
      //   this.getTables(strategy.etlExtractDataSource.id)
      // }
    }
  },

  mounted () {
    this.init()
  }
}
</script>

<style lang="less">
@baseColor: ~"#dc9387";
.item-row {
  height: 200px;
  padding-bottom: 10px;
}

.count-to-con {
  display: block;
  width: 100%;
  text-align: center;
}

.count-text {
  font-size: 50px;
  color: @baseColor;
}

.slot-text {
  font-size: 22px;
}

.unit-class {
  font-size: 30px;
  color: @baseColor;
}
</style>
