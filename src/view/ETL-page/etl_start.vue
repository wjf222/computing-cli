<template>
<div class="main-div" id="root_div" v-cloak>
  <Card>
    <Row>
      <i-Col span="3">
        <div>
          <i-select v-model="select_model"  placeholder="选择上线状态" @on-select="selectOnline" >
            <i-option v-for="item in chooseList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
          </i-select>
        </div>
      </i-Col>
      <i-Col span="3" style="margin-left: 10px">
        <div>
          <div>
            <i-select v-model="theme_select_model" @on-select="selectTheme">
              <i-option v-for="item in themeChooseList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
            </i-select>
          </div>
        </div>
      </i-Col>
      <i-Col span="3" style="margin-left: 10px">
        <div>
          <!-- <i-Input v-model="strategyName"/> -->
          <Input placeholder="搜索策略" style="width: auto;" v-model="strategyName" :search=true>
            <Icon type="ios-search" slot="suffix" />
          </Input>
        </div>
      </i-Col>
      <i-Col span="2" style="margin-left: 10px">
        <div>
          <i-Button type="primary" icon="ios-search" @click="searchetl">查询</i-Button>
        </div>
      </i-Col>
    </Row>
    <br>
    <tables stripe :loading="loading" ref="tables" v-model="nowData" :columns="columns" />
    <Page :total="dataCount" ref="page" :current.sync="pageCurrent" :page-size="pageSize" @on-change="changepage" show-elevator />
  </card>
  <!--启动执行模态框 -->
  <Modal v-model="startEtlModal" title="启动ETL策略" :mask-closable="false">
    <Row :gutter="16">
      <i-Col span="5" offset="2">
        <p style="font-size: 15px">执行策略</p>
      </i-Col>
      <i-Col span="10">
        <i-select v-model="start_style_select_model" @on-change="changeStartStyle">
          <i-option v-for="item in startStyleChooseList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
        </i-select>

      </i-Col>
    </Row>
    <br>
    <div id="chooseStartStyle" style="display: block;">
      <Row :gutter="16">
        <i-Col span="5" offset="2">
          <p style="font-size: 15px">启动时间</p>
        </i-Col>
        <i-Col span="10">
          <Radio-Group v-model="startTime" @on-change="changeRadio">
            <Radio label="0"><span>立即启动</span></Radio>
            <Radio label="1"><span>设置时间</span></Radio>
          </Radio-Group>

        </i-Col>
      </Row>
      <br>
      <div id="chooseTimeBlock" style="display:none">
        <Row :gutter="16">
          <i-Col span="5" offset="2">
            <p style="font-size: 15px">选择时间</p>
          </i-Col>
          <i-Col span="10">
            <time-picker v-model="chooseTime" :editable="false" format="yyyy-MM-dd HH:mm" placement="bottom-end" confirm></time-picker>
          </i-Col>
        </Row>
      </div>
      <br>
      <Row :gutter="8">
        <i-Col span="5" offset="2">
          <p style="font-size: 15px">执行周期</p>
        </i-Col>
        <i-Col span="3">
          <i-input :min="0" v-model="days"></i-input>
        </i-Col>
        <i-Col span="2">
          <p style="font-size: 15px">天</p>
        </i-Col>
        <i-Col span="3">
          <i-input :min="0" :max="23" v-model="hours"></i-input>
        </i-Col>
        <i-Col span="2">
          <p style="font-size: 15px">时</p>
        </i-Col>
        <i-Col span="3">
          <i-input :min="0" :max="59" v-model="mins"></i-input>
        </i-Col>
        <i-Col span="4">
          <p style="font-size: 15px">分</p>
        </i-Col>
      </Row>
      <br>
    </div>
    <div slot="footer">
      <i-button type="primary" size="large" @click="closeStartEtlModal">关闭</i-button>
      <i-button type="success" icon='ios-play' size="large" @click="startETL">启动</i-button>
    </div>
  </Modal>
  <!--显示日志模态框 -->
  <Modal v-model="showLogsModal" title="执行日志" width="50" :scrollable="true" :styles="{top: '20px'}">
    <div id="showLogDiv">
      <Row v-for="item in nowlogsItemsList">
        <i-Col span="8">
          <p style="font-size: 15px">{{ item.executeTime }}</p>

        </i-Col>
        <i-Col span="7">
          <p style="font-size: 15px">{{ item.strategyName }}</p>
        </i-Col>
        <i-Col span="3">
          <div v-if="item.label == '失败'">
            <p style="font-size: 15px;color:#ff0000;">执行{{ item.label }}</p>
          </div>
          <div v-else>
            <p style="font-size: 15px">执行{{ item.label }}</p>
          </div>
        </i-Col>
        <i-Col span="6">
          <i-button type="text" size="small" style="font-size: 15px;color:#56A3F4;" @click="showDetailLog(item)">查看日志详情</i-button>
        </i-Col>
        <br>
        <br>
      </Row>
    </div>
    <Page :total="logDataCount" ref="logPage" :current.sync="logPageCurrent" :page-size="logPageSize" @on-change="changeLogPage" show-elevator />
    <div slot="footer">
      <i-button type="primary" size="large" @click="closeLogs">关闭</i-button>
    </div>
  </Modal>

  <!--显示日志详情模态框 -->
  <Modal v-model="showDetailLogsModal" title="日志详情" width="50" :scrollable="true" :styles="{top: '20px'}">
    <Row :gutter="16">
      <i-Col span="8">
        <p style="font-size: 15px; font-weight:bold;">{{ currentItem.executeTime }}</p>
      </i-Col>
      <i-Col span="8">
        <p style="font-size: 15px;font-weight:bold;">{{ currentItem.strategyName }}</p>
      </i-Col>
      <i-Col span="4">
        <p style="font-size: 15px;font-weight:bold;">执行{{ currentItem.label }}</p>
      </i-Col>
    </Row>
    <br>
    <Row>
      <i-Col span="24">
        <div>
          <pre style="height: 350px;overflow: auto; white-space: pre-wrap;word-wrap: break-word;">{{ currentItem.log }}</pre>
        </div>
        <!-- <p style="font-size: 12px">{{ currentItem.log }}</p>-->
      </i-Col>
    </Row>
    <div slot="footer">
      <i-button type="primary" size="large" @click="closeDetailLog">关闭</i-button>
    </div>
  </Modal>
</div>
</template>

<script>
import axios from 'axios'
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
      // 日志分页
      logDataCount: 10,
      logPageSize: 10,
      logPageCurrent: 1,
      loading: true,
      strategyName: '', // 策略名称，根据策略名称查询
      // 是否上线选择框
      chooseList: [{
        value: '-1',
        label: '所有策略'
      }, {
        value: '1',
        label: '已上线'
      }, {
        value: '0',
        label: '未上线'
      }],
      select_model: '-1',
      theme_select_model: '-1',
      themeChooseList: [],
      nowData: [],
      // 记录正在执行的所有策略id
      executingList: [],
      // 是否显示启动模态框
      startEtlModal: false,
      showLogsModal: false,
      etlResult: null,
      // 日志信息list
      logsItemsList: [],
      nowlogsItemsList: [],

      // 是否显示某条日志详情模态框
      showDetailLogsModal: false,
      // 当前选择看的log信息
      currentItem: {},
      // 启动策略：周期性、一次性执行选择框
      start_style_select_model: '0', // 默认周期性执行
      startStyleChooseList: [{
        value: '0',
        label: '周期性执行'
      }, {
        value: '1',
        label: '执行一次'
      }],
      // 启动时间radio，
      startTime: '0', // 默认立即启动

      // 选择时间
      chooseTime: '',
      // 周期
      days: 0,
      hours: 0,
      mins: 0,
      // 当前启动或者停止的策略Index
      currentId: '',
      columns: [{
        title: '序号',
        key: 'number',
        // width:70,
        align: 'center',
        fixed: 'left'
      },
      {
        title: '策略名称',
        key: 'strategyname',
        // width:210,
        align: 'center',
        fixed: 'left'
      },
      {
        title: '所属主题',
        key: 'theme',
        // width:210,
        align: 'center',
        fixed: 'left'
      },
      {
        title: '抽取数据源名称',
        key: 'extractresource',
        // width:200,
        fixed: 'left'
      },
      {
        title: '载入数据源名称',
        key: 'loadresource',
        // width:200,
        fixed: 'left'
      },
      {
        title: '使用次数',
        key: 'executioncount',
        // width:160,
        fixed: 'left'
      },
      {
        title: '是否正在上线',
        key: 'isonline',
        // width:120,
        fixed: 'left'
      },
      {
        title: '查看执行日志',
        key: 'showExecuteLog',
        // width:120,
        fixed: 'left',
        render: (h, params) => {
          return h('div', [
            h('Button', {
              props: {
                icon: 'ios-information-outline',
                type: 'primary'
                // size: 'large'
              },
              /* style: {
                   marginRight: '5px'
                   }, */
              on: {
                click: () => {
                  this.showlogs(params.row.id, params.index)
                }
              }
            }, '查看')
          ])
        }
      },
      {
        title: '操作',
        key: 'operation',
        // width:130,
        fixed: 'left',
        render: (h, params) => {
          if (params.row.isonline == '是') { // 已上线，则停止
            return h('div', [
              h('Button', {
                props: {
                  icon: 'ios-pause',
                  type: 'error'
                },
                /* style: {
                     marginRight: '5px'
                     }, */
                on: {
                  click: () => {
                    this.showStop(params.row.id)
                  }
                }
              }, '停止')
            ])
          } else { // 未上线，则启动
            return h('div', [
              h('Button', {
                props: {
                  icon: 'ios-play',
                  type: params.row.buttonType,
                  loading: params.row.loading
                },
                /* style: {
                     marginRight: '5px'
                     }, */
                on: {
                  click: () => {
                    this.show(params.row.id)
                  }
                }
              }, params.row.tip)
            ])
          }
        }
      }
      ]

    }
  },
  methods: {
    selectTheme (value) {
      this.theme_select_model = value
      this.searchetl()
    },
    selectOnline (value) {
      this.select_model = value
      this.searchetl()
    },
    getThemeList () {
      var that = this
      // var themeList=[];
      const dataList = [{
        value: '-1',
        label: '所有主题'
      }] // 初始化主题选择框
      this.themeChooseList = [] // 清空主题选择框
      axios({
        method: 'post',
        url: this.GLOBAL.etlUrl + 'etl/getTheme',
        withCredentials: true
      }).then(function (response) {
        const data = response.data
        // alert(data.data['status']);
        if (data.status == 0) {
          const resultList = data['resultList']
          for (let i = 0; i < resultList.length; i++) {
            const dom = resultList[i]
            dom['value'] = resultList[i]['id']
            dom['label'] = resultList[i]['themename']
            dataList.push(dom)
          }
          that.themeChooseList = dataList
        } else {
          that.$Modal.error({
            title: '失败',
            content: '服务器端出错,未能获取主题列表,请检查！'
          })
        }
      })
    },
    getData () {
      var that = this
      const param = {
        startNum: '0', // 起始数据条数
        endNum: '9999', // 每页显示条数
        loginname: 'superadmin',
        strategyName: this.strategyName,
        isOnline: this.select_model,
        themeId: this.theme_select_model
      }
      axios({
        method: 'post',
        url: this.GLOBAL.etlUrl + 'etl/getEtlStrategyData',
        params: param,
        withCredentials: true
      }).then(function (response) {
        const data = response.data
        const dataList = []
        const status = data['status']
        if (status == '0') { // 正确返回结果
          const resultList = data['resultList']
          that.dataCount = resultList.length
          for (let i = 0; i < resultList.length; i++) {
            const dom = resultList[i]
            dom['number'] = i + 1
            dom['isonline'] = (resultList[i]['isonline'] == '0' ? '否' : '是')
            dom['extractresource'] = resultList[i]['etlExtractDataSource']['name']
            dom['loadresource'] = resultList[i]['etlLoadDataSource']['name']
            const theme = resultList[i]['theme']
            if (theme == undefined || theme == '' || theme == null) {
              dom['theme'] = '无'
            } else {
              dom['theme'] = theme['themename']
            }

            dom['loading'] = false
            dom['tip'] = '启动'
            dom['buttonType'] = 'success'
            // 点击查询时保留正在执行的状态
            for (const x in that.executingList) {
              if (that.executingList[x] == dom['id']) {
                dom['loading'] = true
                dom['tip'] = '执行中'
                dom['buttonType'] = 'warning'
              }
            }
            dataList.push(dom)
          }
          // 分页
          that.tableData = dataList
          that.freshpage(that.pageCurrent)
          that.loading = false
        } else { // 后台返回错误如何处理？
          // console.log(status) // 控制台提示报错
        }
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
      // console.log(this.nowData)
      // 储存当前页
      this.pageCurrent = index
    },
    // 当有数据更新刷新页面
    freshLogpage () {
      // 考虑把pageCurrent变为0整页删除bug
      this.logPageCurrent = 1
      this.changeLogPage(this.logPageCurrent)
      // 之前能用后面报子组件操作错误
      // this.$refs.page.current=1;
    },
    // 点击，切换页面
    changeLogPage (index) {
      // console.log(this.pageCurrent)
      // 需要显示开始数据的index,(因为数据是从0开始的，页码是从1开始的，需要-1)
      const _start = (index - 1) * this.pageSize
      // 需要显示结束数据的index
      const _end = index * this.pageSize
      // 截取需要显示的数据
      this.nowlogsItemsList = this.logsItemsList.slice(_start, _end)
      // console.log(this.nowlogsItemsList)
      // 储存当前页
      this.logPageCurrent = index
    },
    // 搜索ETL
    searchetl () {
      var that = this
      var ss = this.strategyName
      var tid = this.theme_select_model
      var ec = this.dataCount
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
          isOnline: this.select_model,
          themeId: tid,
          strategyName: ss

        }
      }).then(function (response) {
        const data = response.data
        const dataList = []
        const status = data['status']
        if (status == '0') { // 正确返回结果
          const resultList = data['resultList']
          that.dataCount = resultList.length
          for (let i = 0; i < resultList.length; i++) {
            const dom = resultList[i]
            dom['number'] = i + 1
            dom['isonline'] = (resultList[i]['isonline'] == '0' ? '否' : '是')
            dom['extractresource'] = resultList[i]['etlExtractDataSource']['name']
            dom['loadresource'] = resultList[i]['etlLoadDataSource']['name']
            const theme = resultList[i]['theme']
            if (theme == undefined || theme == '' || theme == null) {
              dom['theme'] = '无'
            } else {
              dom['theme'] = theme['themename']
            }

            dom['loading'] = false
            dom['tip'] = '启动'
            dom['buttonType'] = 'success'
            // 点击查询时保留正在执行的状态
            for (const x in that.executingList) {
              if (that.executingList[x] == dom['id']) {
                dom['loading'] = true
                dom['tip'] = '执行中'
                dom['buttonType'] = 'warning'
              }
            }
            dataList.push(dom)
          }
          // 分页
          that.tableData = dataList
          that.freshpage(that.pageCurrent)
          that.loading = false
        } else { // 后台返回错误如何处理？
          // console.log(status) // 控制台提示报错
        }
      })
    },
    // 点击查看日志
    showlogs: function (Id, index) {
      const that = this
      // 每次打开模态框之前设logs数组为空
      this.logsItemsList = []
      const strategyName = this.nowData[index]['strategyname']
      const param = {
        Id: Id
      }
      axios({
        method: 'post',
        url: this.GLOBAL.etlUrl + 'etl/getexecuteLogs',
        params: param,
        withCredentials: true
      }).then(function (response) {
        const data = response.data
        const status = data['status']
        if (status == '500') { // 正确返回结果
          that.$Modal.info({
            title: '执行日志',
            content: '该ETL策略当前无执行日志'
          })
        } else if (status == '0') {
          that.showLogsModal = true
          /* //清空以前的内容
          $("#showLogDiv").html(""); */
          that.etlResult = data['etlResult']
          // 最新的更新日志指针
          const index = that.etlResult['index']
          let currentIndex = index
          that.logDataCount = index
          do {
            if (that.etlResult['executeTimeArray'][currentIndex] != null) { // 如果当前项不为空
              // 显示日志
              const logsItem = {
                label: that.etlResult['labelArray'][currentIndex] == 0 ? '失败' : '成功',
                executeTime: new Date(that.etlResult['executeTimeArray'][currentIndex]).Format('yyyy-MM-dd hh:mm:ss'),
                log: that.etlResult['logsArray'][currentIndex],
                strategyName: strategyName
              }
              that.logsItemsList.push(logsItem)
            } else {
              break
            }
            currentIndex = currentIndex > 0 ? --currentIndex : that.etlResult['executeTimeArray'].length - 1
          } while (currentIndex != index)
          that.freshLogpage()
        }
      }).catch(response => {
        that.$Modal.error({
          title: '失败',
          content: '启动失败，服务端出错，请检查！'
        })
      })
    },
    // 点击关闭显示日志模态框
    closeLogs: function () {
      this.showLogsModal = false
    },
    // 点击显示成功或失败日志
    showDetailLog: function (item) {
      this.currentItem = item
      this.showDetailLogsModal = true
    },
    // 关闭显示日志详情模态框
    closeDetailLog: function () {
      this.showDetailLogsModal = false
    },
    // 点击停止按钮
    showStop: function (id) {
      const that = this

      this.$Modal.confirm({
        title: ' 停止周期性ETL任务',
        content: '<span style="font-size: 15px;">你确定要停止该任务吗？</span>',
        onOk: () => {
          const param = {
            Id: id
          }
          axios({
            method: 'post',
            url: this.GLOBAL.etlUrl + 'etl/etlStop',
            params: param,
            withCredentials: true
          }).then(function (response) {
            const data = response.data
            const status = data['status']
            if (status == '0') { // 正确返回结果
              that.$Notice.success({
                title: '成功',
                desc: '任务已经停止！'
              })

              // 重新更新页面显示数据
              that.getData()
            } else {
              that.$Notice.error({
                title: '失败',
                desc: '失败，服务端出错，请检查！'
              })
            }
          })
        },
        onCancel: () => {

        }
      })
    },
    // ETL启动模态框
    show: function (Id) {
      this.startEtlModal = true
      $('#chooseStartStyle').css('display', 'block')
      // 模态框复原
      this.start_style_select_model = '0'
      this.startTime = '0'
      this.changeRadio('0')
      this.days = 0
      this.hours = 0
      this.mins = 0
      // 更新时间选择默认值为当前时间
      this.chooseTime = this.dateFormat('YYYY-mm-dd HH:MM', new Date())
      this.currentId = Id
    },
    // 选择执行策略select改变时调用该函数
    changeStartStyle: function (value) {
      if (value == '1') { // 执行一次
        $('#chooseStartStyle').css('display', 'none')
      } else { // 周期性执行
        $('#chooseStartStyle').css('display', 'block')
      }
    },
    dateFormat: function (fmt, date) {
      let ret
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (let k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
        };
      };
      return fmt
    },
    // 选择启动时间radio改变时调用该函数
    changeRadio: function (value) {
      this.startTime = value
      if (value == '1') { // 切换到设置时间
        $('#chooseTimeBlock').css('display', 'block')
        // 更新时间选择默认值为当前时间
        this.chooseTime = this.dateFormat('YYYY-mm-dd HH:MM', new Date())
      } else { // 切换到立即启动
        $('#chooseTimeBlock').css('display', 'none')
      }
    },
    // 判断是否为正整数或0
    isInteger: function (val) {
      const reg = /^[1-9]\d*$|^0$/
      if (reg.test(val)) {
        return true
      } else {
        return false
      }
    },
    // 点击模态框中启动按钮时调用
    startETL: function () {
      const theEtlUrl = this.GLOBAL.etlUrl
      const that = this
      let executeCycleSeconds = 0
      let chooseTime = '' // 如果不选择时间，则chooseTime赋空

      // beforeExecuteIndex表示策略执行前当前最新的日志index,无日志用-1表示
      let beforeExecuteIndex = -1

      if (this.start_style_select_model == '0') { // 周期性执行
        // 判断输入文字是否合法
        if (!this.isInteger(this.days)) {
          that.$Notice.error({
            title: '天数输入错误',
            desc: '天数应为正整数或0！'
          })

          this.days = 0
          return
        } else if (!this.isInteger(this.hours) || this.hours > 23) {
          that.$Notice.error({
            title: '小时数输入错误',
            desc: '小时数应为不大于23的正整数或0！'
          })
          this.hours = 0
          return
        } else if (!this.isInteger(this.mins) || this.mins > 59) {
          that.$Notice.error({
            title: '分钟数输入错误',
            desc: '分钟数应为不大于59的正整数或0！'
          })
          this.mins = 0
          return
        }

        executeCycleSeconds = this.days * 24 * 60 * 60 + this.hours * 60 * 60 + this.mins * 60
        if (executeCycleSeconds == 0) { //
          that.$Notice.error({
            title: '执行周期不能为0',
            desc: '执行周期至少为1分钟！'
          })

          return
        }
        if (this.startTime == '1') { // 选择执行时间
          // chooseTime = that.chooseTime.Format('yyyy-MM-dd hh:mm')
          chooseTime = that.chooseTime
        }
      } else {
        // 一次性执行时，通过日志信息监控执行中状态：启动ETL任务之前先获取当前策略的日志信息，为显示“策略执行中”的状态做准备
        const paramTmp = {
          Id: this.currentId
        }
        axios({
          method: 'post',
          url: theEtlUrl + 'etl/getexecuteLogs',
          params: paramTmp,
          withCredentials: true
        }).then(function (response) {
          const data = response.data
          const status = data['status']
          if (status == '0') {
            beforeExecuteIndex = data['etlResult']['index']
          }
        })
      }

      // 开始提交策略
      const param = {
        Id: this.currentId,
        executeCycleSeconds: executeCycleSeconds,
        chooseTime: chooseTime
      }
      axios({
        method: 'post',
        url: theEtlUrl + 'etl/startEtl',
        params: param,
        withCredentials: true
      }).then(function (response) {
        const data = response.data
        const status = data['status']
        if (status == '0' && executeCycleSeconds != 0) { // 如果是周期性执行并且返回了正确返回结果
          that.$Modal.success({
            title: '成功',
            content: '启动成功！'
          })
          // 重新更新页面显示数据
          that.getData()
          that.startEtlModal = false
        } else if (status == '0' && executeCycleSeconds == 0) { // 如果是一次执行且成功，则给出执行进度
          for (const dom of that.nowData) {
            if (dom['id'] == param.Id) {
              dom['loading'] = true
              dom['tip'] = '执行中'
              dom['buttonType'] = 'warning'
            }
          }
          // 将正在执行的id放入执行数组
          that.executingList.push(param.Id)
          let afterExecuteIndex = '-1'
          that.closeStartEtlModal()
          const interval = setInterval(getCurrentExecuteIndex, 2000) // 2秒查询一次日志结果
          const self = that

          function getCurrentExecuteIndex () {
            // 开始提交策略
            const param1 = {
              Id: param.Id
            }
            axios({
              method: 'post',
              url: theEtlUrl + '/etl/getexecuteLogs',
              params: param1,
              withCredentials: true
            }).then(function (response) {
              const data = response.data
              const status = data['status']
              if (status == '0') {
                afterExecuteIndex = data['etlResult']['index']
              }
              if (afterExecuteIndex != beforeExecuteIndex) {
                clearInterval(interval)
                for (const dom of self.nowData) {
                  if (dom['id'] == param.Id) {
                    dom['loading'] = false
                    dom['tip'] = '启动'
                    dom['buttonType'] = 'success'
                  }
                }
                // 从执行数组中删除完成的id,id值理论上不存在重复的
                for (const x in self.executingList) {
                  if (self.executingList[x] == param.Id) {
                    self.executingList.splice(x, 1)
                    break
                  }
                }
              }
            })
          }
        } else {
          that.$Modal.error({
            title: '失败',
            content: '启动失败，服务端出错，请检查！'
          })
        }
      })
    },

    // 关闭启动框
    closeStartEtlModal: function () {
      this.startEtlModal = false
    }

  },
  created () {

  },
  mounted () {
    this.getData()
    this.getThemeList()
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.Format = function (fmt) {
      var o = {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'h+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        'S': this.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
      return fmt
    }
  }
}
</script>

<style>
div.ivu-table-stripe {
  height: auto;
}

[v-cloak] {
  display: none;
}
</style>
