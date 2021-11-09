<template>
<div>
  <Card>

    <Icon type="md-analytics" size="32" />
    <Select v-model="ThisTheme" clearable style="width: 150px; margin: 10px 10px;" placeholder="选择所属主题" @on-select="selectTheme" @on-clear="clearSelectTheme">
      <Option v-for="item in themeList" :value="item.id" :key="item.id">{{ item.themename }}</Option>
    </Select>
    <Input placeholder="搜索策略" style="width: auto; margin: 10px 10px;" v-model="searchStrategy" :search=true @on-search="searchetl">
      <Icon type="ios-search" slot="suffix" />
    </Input>
    <Button style="margin: 10px 10px;" type="primary" @click="searchetl">搜索</Button>
    <Button style="margin: 10px 10px;" type="success" @click="addStrategy">添加</Button>
    <Button style="margin: 10px 10px;" type="error" @click="deleteetl">删除</Button>
    <!-- <Button style="margin: 10px 10px;" type="error" @click="testfunc">测试</Button> -->
    <tables stripe :loading="loading" ref="tables" v-model="nowData" :columns="columns" @on-selection-change="selectETL" />

    <Page :total="dataCount" ref="page" :current.sync="pageCurrent" :page-size="pageSize" @on-change="changepage" show-elevator />
  </Card>
  <Modal v-model="etlTypeModal" title="选择策略类型" @on-ok="modalOK">
    <div>
      <i-select v-model="type_select_model">
        <i-option v-for="item in typeChooseList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
      </i-select>
    </div>
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
      // 添加策略
      etlTypeModal: false,
      type_select_model: '1',
      typeChooseList: [{
        value: '1',
        label: '标准策略'
      },
        // {
        //     value:"0",
        //     label:"数据同步策略"
        // },
      {
        value: '2',
        label: '自定义SQL策略'
      }
      ],
      // 分页
      dataCount: 10,
      pageSize: 10,
      pageCurrent: 1,
      ThisTheme: '',
      nowData: [],
      etlCount: 0,
      // 选择主题
      themeList: [],
      themeId: -1,
      // 多选删除
      selecteEtlId: [],
      searchStrategy: '',
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
      // {
      //   title: '策略id',
      //   key: 'id',
      //   sortable: true
      // },
      {
        title: '策略名称',
        key: 'strategyname',
        sortable: true
      },
      {
        title: '策略类别',
        key: 'etltype',
        render: (h, params) => {
          if (this.nowData[params.index].etltype == 1) {
            return h('span', '标准策略')
          } else {
            return h('span', '自定义抽取策略')
          }
        }
      },
      {
        title: '所属主题',
        // 使用render加载数据中的级联数据,这里需要加入判断，如果没有分配主题显示无。
        render: (h, params) => {
          if (this.nowData[params.index].theme != undefined && this.nowData[params.index].theme != '') {
            return h('span', this.nowData[params.index].theme.themename)
          } else {
            return h('span', '未分配')
          }
        }
      },
      {
        title: '抽取数据源',
        render: (h, params) => {
          return h('span', this.nowData[params.index].etlExtractDataSource.name)
        }
      },
      {
        title: '加载数据源',
        render: (h, params) => {
          return h('span', this.nowData[params.index].etlLoadDataSource.name)
        }
      },
      {
        title: '使用次数',
        key: 'executioncount'
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
                  this.themeDetail(params)
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
    init () {
      const id = this.$route.params.id
      if (id != undefined) {
        this.selectTheme(id)
        this.ThisTheme = id
        // this.getETLStrategy();
        this.getThemeList()
        // getcount配合promise完成分页，但是9999已经够用
        // this.getEtlCount();
      } else {
        this.getETLStrategy()
        this.getThemeList()
        // this.getEtlCount();
      }
    },
    getThemeList () {
      var that = this
      // var themeList=[];
      axios({
        method: 'post',
        url: this.GLOBAL.etlUrl + 'etl/getTheme',
        withCredentials: true
      }).then(function (response) {
        const data1 = response.data
        // alert(data.data['status']);
        if (data1.status == 0) {
          that.themeList = data1.resultList
        } else {
          that.$Modal.error({
            title: '失败',
            content: '服务器端出错,未能获取主题列表,请检查！'
          })
        }
      })
    },
    getEtlCount () {
      var that = this
      // var themeList=[];
      axios({
        method: 'post',
        url: this.GLOBAL.etlUrl + 'etl/getEtlStrategyCount',
        withCredentials: true,
        params: {
          loginname: 'superadmin',
          themeId: -1,
          isOnline: 0
        }
      }).then(function (response) {
        const data1 = response.data
        // alert(data.data['status']);
        if (data1.status == 0) {
          that.etlCount = data1.dataCount
        } else {
          that.$Modal.error({
            title: '失败',
            content: '服务器端出错,未能获取主题列表,请检查！'
          })
        }
      })
    },
    selectTheme (value) {
      this.themeId = value
      this.searchetl()
    },
    clearSelectTheme () {
      this.themeId = -1
      this.searchetl()
    },
    // 新增策略
    addStrategy: function () {
      // window.parent.root.addpage({name:"新增策略",src:'add_strategy'})
      this.etlTypeModal = true
    },
    addetl () {
      this.$router.push({
        name: 'etlEdit_page',
        params: {
          pageType: 0
        }
      })
    },
    modalOK: function () {
      // if(this.type_select_model == '0'){
      //     window.parent.root.addpage({name:"数据同步策略",src:'strategy_synchronize'});
      // }
      if (this.type_select_model == '1') {
        this.$router.push({
          name: 'etlEdit_page',
          params: {
            pageType: 0
          }
        })
      }
      if (this.type_select_model == '2') {
        this.$router.push({
          name: 'etlCustomEdit_page',
          params: {
            pageType: 0
          }
        })
      }
    },
    selectETL (selection) {
      // alert(selection.length)
      this.selecteEtlId = []
      for (const item of selection) {
        this.selecteEtlId.push(item.id)
      }
    },
    // 搜索ETL
    searchetl () {
      var that = this
      var ss = this.searchStrategy
      var tid = this.themeId
      var ec = this.etlCount
      var transTableData = []
      axios({
        method: 'post',
        url: this.GLOBAL.etlUrl + 'etl/getEtlStrategyData',
        withCredentials: true,
        params: {
          loginname: 'superadmin',
          // 规避分页缺陷
          startNum: '0',
          endNum: '9999',
          // endNum:"100",
          isOnline: -1,
          themeId: tid,
          strategyName: ss

        }
      }).then(function (response) {
        var resdata = response.data.resultList
        that.tableData = resdata
        that.dataCount = resdata.length
        that.freshpage(that.pageCurrent)
        that.loading = false
        // console.log(resdata)
      })
    },
    message (m) {
      this.$Message.error({
        content: m,
        duration: 5,
        closable: true
      })
    },
    // 查看主题详情
    themeDetail (params) {
      // console.log(params.row)
      var etlType = params.row.etltype
      if (etlType == 1) {
        this.$router.push({
          name: 'etlEdit_page',
          params: {
            update_strategy: params.row,
            pageType: 1
          }
        })
      }
      // if (etlType == 0) {
      //   window.parent.root.addpage({
      //     name: "修改数据同步策略",
      //     src: 'strategy_synchronize'
      //   });
      // }
      if (etlType == 2) {
        this.$router.push({
          name: 'etlCustomEdit_page',
          params: {
            update_strategy: params.row,
            pageType: 1
          }
        })
      }
    },
    deleteetl () {
      const that = this
      if (this.selecteEtlId.toString() == '') {
        that.$Modal.info({
          title: '错误',
          content: '未选择策略'
        })
      } else if (this.selecteEtlId.toString() != '') {
        const param = {
          loginname: 'superadmin',
          idsString: this.selecteEtlId.toString()
        }
        // alert(param.loginname);
        axios({
          method: 'post',
          url: this.GLOBAL.etlUrl + 'api/delete_etl',
          withCredentials: true,
          params: param
        }).then(function (response) {
          const data1 = response.data
          // console.log(response.data)
          // alert(data.data['status']);
          if (data1 == 'success') {
            that.addDataSourceModal = false
            that.$Modal.success({
              title: '成功',
              content: '删除策略成功！'
            })
            // 重新加载数据源
            that.getETLStrategy()
          } else {
            that.$Modal.error({
              title: '失败',
              content: '服务器端出错，请检查！'
            })
          }
        })
      }
    },
    getETLStrategy () {
      var that = this
      var transTableData = []
      axios({
        method: 'post',
        url: this.GLOBAL.etlUrl + 'etl/getEtlStrategyData',
        withCredentials: true,
        params: {
          loginname: 'superadmin',
          // 把分页做到这里来，稍后再更改
          startNum: '0',
          // 两种思路第一种是把分页做到这里，第二种是通过查询总数与9999对比预警单次数据过大
          // 如果需要改进，将再mount钩子函数调用获取策略总数，再使用searchetl完成
          endNum: '9999',
          isOnline: 0,
          themeId: -1

        }
      }).then(function (response) {
        var resdata = response.data.resultList
        that.tableData = resdata
        that.dataCount = resdata.length
        that.freshpage(that.pageCurrent)
        that.loading = false
        // console.log('get')
        // console.log(resdata)
      })
    },
    // 当有数据更新刷新页面
    freshpage () {
      // 考虑把pageCurrent变为0整页删除bug
      this.pageCurrent = 1
      this.changepage(this.pageCurrent)
      // 之前能用后面报子组件操作错误
      // this.$refs.page.current=1;
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
      // if (_end > this.etlCount) {
      //   this.nowData = this.tableData.slice(_start, this.etlCount);
      // } else {
      //   this.nowData = this.tableData.slice(_start, _end);
      // }
      // 储存当前页
      this.pageCurrent = index
    }

  },
  mounted () {
    // this.getETLStrategy();
    // this.getThemeList();
    this.getEtlCount()
    this.init()
  }
}
</script>

<style>

</style>
