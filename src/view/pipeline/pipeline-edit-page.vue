<template>
  <div>
    <Row :gutter="14" style="margin-top: 14px;">
      <i-col span="8">
        <Card>
          <p slot="title">
            <Icon type="ios-color-wand"></Icon>
            节点一
          </p>
          <Row type="flex" justify="center" align="middle" class="countto-page-row">
            <div class="count-to-con">
            </div>
          </Row>
        </Card>
      </i-col>
      <i-col span="8" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="ios-shuffle-strong"></Icon>
            节点二
          </p>
          <Row type="flex" justify="center" align="middle" class="countto-page-row">
            <div class="count-to-con">
            </div>
          </Row>
        </Card>
      </i-col>
      <i-col span="8" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="android-stopwatch"></Icon>
            节点三
          </p>
          <Row type="flex" justify="center" align="middle" class="countto-page-row">
            <div class="count-to-con">
            </div>
          </Row>
        </Card>
      </i-col>
    </Row>
    <Row :gutter="14" style="margin-top: 14px;">
      <i-col span="8" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="android-stopwatch"></Icon>
            添加新节点
          </p>
          <Row type="flex" justify="center" align="middle" class="countto-page-row">
            <div class="count-to-con">
            </div>
          </Row>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import CountTo from '_c/count-to'

export default {
  name: 'count_to_page',
  components: {
    CountTo
  },
  data () {
    return {
      end: 0,
      unit: [[3, '千多'], [4, '万多'], [5, '十万多']],
      unit2: [[1, '十多'], [2, '百多'], [3, '千多'], [4, '万多'], [5, '十万多'], [6, '百万多'], [7, '千万多'], [8, '亿多']],
      asynEndVal: 487,
      integratedEndVal: 3
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
.countto-page-row {
  height: 200px;
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
