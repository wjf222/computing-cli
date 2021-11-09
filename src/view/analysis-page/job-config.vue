<template>
  <div>
    <Table :loading="jobLoading" border :columns="jobListColumns" :data="jobListData"></Table>
    <Button style="margin: 10px 10px;" type="success" @click="loadAdd">添加</Button>
    <Page :total="totalPage" :current="currentPage" @on-change="loadPage" show-elevator/>
    <Modal
        v-model="historyDetailModal"
        title="任务执行日志">{{historyMessage}}</Modal>
    <Modal
      v-model="jobModal"
      title="添加一个分析任务"
      okText="添加"
      @on-ok="addJob">
      <Row>
        <Col span="4">
          任务名：
        </Col>
        <Col span="20">
          <Input v-model="jobNameModel" placeholder="输入任务名" style="width: 400px; margin-bottom: 10px" />
        </Col>
      </Row>
      <Row>
      <Col span="4">
        任务简介：
      </Col>
      <Col span="20">
        <Input v-model="jobIntroModel" show-word-limit type="textarea" placeholder="输入任务简介" style="width: 400px; margin-bottom: 10px" />
      </Col>
      </Row>
      <Row>
      <Col span="4">
        算法：
      </Col>
      <Col span="20">
        <Select v-model="algoModel" style="width:400px; margin-bottom: 10px" @on-change="loadAlgoParams">
          <Option v-for="item in algoList" :value="item.algo_id" :key="item.algo_id">{{ item.algo_name }}</Option>
        </Select>
      </Col>
      </Row>
      <Row>
      <Col span="4">
        算法参数：
      </Col>
      <Col span="20">
        <Table border :columns="algoParamsColumns" :data="algoParamsData" style="width:400px; margin-bottom: 10px"></Table>
      </Col>
      </Row>
      <Row>
        <Col span="4">
          执行时间：
        </Col>
        <Col span="20">
          <div style="width: 400px; margin-bottom: 10px">
            从&emsp;<DatePicker type="datetime" placeholder="Select date" format="yyyy-MM-dd HH:mm:ss" style="width: 160px" v-model="jobStartTime"></DatePicker>&emsp;开始，每隔&emsp;
            <InputNumber :max="365" :min="0" v-model="jobDayModel" style="width: 50px"></InputNumber>&emsp;天&emsp;
            <InputNumber :max="23" :min="0" v-model="jobHourModel" style="width: 50px"></InputNumber>&emsp;时&emsp;
            <InputNumber :max="59" :min="0" v-model="jobMinuteModel" style="width: 50px"></InputNumber>&emsp;分&emsp;
            <InputNumber :max="59" :min="0" v-model="jobSecondModel" style="width: 50px"></InputNumber>&emsp;秒后执行
          </div>
        </Col>
      </Row>
    </Modal>
    <Modal
      v-model="jobUpdateModel"
      title="查看/更新分析任务"
      okText="更新"
      @on-ok="updateJob">
      <Row>
        <Col span="4">
          任务ID：
        </Col>
        <Col span="20">
          <Tag style="margin-bottom: 10px">{{jobIdModel}}</Tag>
        </Col>
      </Row>
      <Row>
        <Col span="4">
          任务名：
        </Col>
        <Col span="20">
          <Input v-model="jobNameModel" placeholder="输入任务名" style="width: 400px; margin-bottom: 10px" />
        </Col>
      </Row>
      <Row>
        <Col span="4">
          任务简介：
        </Col>
        <Col span="20">
          <Input v-model="jobIntroModel" show-word-limit type="textarea" placeholder="输入任务简介" style="width: 400px; margin-bottom: 10px" />
        </Col>
      </Row>
      <Row>
        <Col span="4">
          算法：
        </Col>
        <Col span="20">
          <Select v-model="algoModel" style="width:400px; margin-bottom: 10px" @on-change="loadAlgoParams">
            <Option v-for="item in algoList" :value="item.algo_id" :key="item.algo_id">{{ item.algo_name }}</Option>
          </Select>
        </Col>
      </Row>
      <Row>
        <Col span="4">
          算法参数：
        </Col>
        <Col span="20">
          <Table border :columns="algoParamsColumns" :data="algoParamsData" style="width:400px; margin-bottom: 10px"></Table>
        </Col>
      </Row>
      <Row>
        <Col span="4">
          执行时间：
        </Col>
        <Col span="20">
          <div style="width: 400px; margin-bottom: 10px">
            从&emsp;<DatePicker type="datetime" placeholder="Select date" format="yyyy-MM-dd HH:mm:ss" style="width: 160px" v-model="jobStartTime"></DatePicker>&emsp;开始，每隔&emsp;
            <InputNumber :max="365" :min="0" v-model="jobDayModel" style="width: 50px"></InputNumber>&emsp;天&emsp;
            <InputNumber :max="23" :min="0" v-model="jobHourModel" style="width: 50px"></InputNumber>&emsp;时&emsp;
            <InputNumber :max="59" :min="0" v-model="jobMinuteModel" style="width: 50px"></InputNumber>&emsp;分&emsp;
            <InputNumber :max="59" :min="0" v-model="jobSecondModel" style="width: 50px"></InputNumber>&emsp;秒后执行
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="4">
          可用：
        </Col>
        <Col span="20">
          <i-switch v-model="jobStatusModel"/>
        </Col>
      </Row>
    </Modal>
    <Drawer :closable="false" width="800" v-model="historyDrawerModel">
      <Table :loading="historyLoading" :columns="historyColumns" :data="historyData"></Table>
    </Drawer>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'job-config',
  data () {
    return {
      jobIdModel: -1,
      currentPage: 1,
      tablePageSize: 10,
      totalPage: 0,
      currentHistoryJobId: -1,
      jobDayModel: 1,
      jobHourModel: 0,
      jobMinuteModel: 0,
      jobSecondModel: 0,
      jobStartTime: new Date(),
      algoModel: '',
      jobNameModel: '',
      jobIntroModel: '',
      crontabModel: '',
      historyMessage: '',
      algoList: [],
      jobListData: [],
      jobListDataTotal: [],
      algoParamsData: [],
      historyData: [],
      historyDetailModal: false,
      historyDrawerModel: false,
      jobModal: false,
      jobUpdateModel: false,
      jobStatusModel: false,
      jobLoading: true,
      historyLoading: true,
      jobListColumns: [
        {
          title: '任务ID',
          key: 'job_id',
          align: 'center',
          width: '80px'
        },
        {
          title: '任务名称',
          key: 'job_name',
          align: 'center',
          render: (h, params) => {
            let that = this
            return h('Button', {
              props: {
                type: 'text'
              },
              on: {
                click: (event) => {
                  that.historyDrawerModel = true
                  that.currentHistoryJobId = params.row.job_id
                  that.loadHistory(params.row.job_id)
                }
              }
            }, params.row.job_name)
          }
        },
        {
          title: '任务简介',
          key: 'job_intro',
          align: 'center'
        },
        {
          title: '可用',
          key: 'usable',
          align: 'center',
          width: '100px',
          render: (h, params) => {
            let color = params.row.usable ? 'cyan' : 'warning'
            let status = params.row.usable ? '可用' : '不可用'
            return h('Tag', {
              props: {
                color: color
              }
            }, status)
          }
        },
        {
          title: '操作',
          key: 'operate',
          align: 'center',
          width: '200px',
          render: (h, params) => {
            let that = this
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary'
                },
                on: {
                  click: (event) => {
                    that.loadUpdate(params.row)
                  }
                }
              }, '详细信息'),
              h('Button', {
                props: {
                  type: 'error'
                },
                on: {
                  click: (event) => {
                    this.$Modal.confirm({
                      title: '确认删除',
                      content: '<p>确认删除该任务？</p>',
                      onOk: () => {
                        that.deleteJob(params.row.job_id)
                      },
                      onCancel: () => {
                      }
                    });
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      algoParamsColumns: [
        {
          title: '参数名',
          key: 'param_name'
        },
        {
          title: '参数值',
          key: 'param_value',
          render: (h, params) => {
            let that = this
            return h('Input', {
              props: {
                size: 'small',
                value: params.row.param_value
              },
              on: {
                input: (event) => {
                  that.algoParamsData[params.index]['param_value'] = event
                }
              }
            })
          }
        }
      ],
      historyColumns: [
        {
          title: '开始时间',
          key: 'start_time',
          align: 'center'
        },
        {
          title: '结束时间',
          key: 'finish_time',
          align: 'center'
        },
        {
          title: '执行状态',
          key: 'status',
          align: 'center',
          render: (h, params) => {
            let color=''
            switch (params.row.status) {
              case 0:
                color='error'
                break;
              case 1:
                color='success'
                break;
              case 2:
                color='primary'
                break;
            }
            let status = '未知'
            switch (params.row.status) {
              case 0:
                status='失败'
                break;
              case 1:
                status='成功'
                break;
              case 2:
                status='已提交'
                break;
            }
            return h('Tag', {
              props: {
                color: color
              }
            }, status)
          }
        },
        {
          title: '日志',
          key: 'log',
          align: 'center',
          render: (h, params) => {
            let that = this
            return h('Button', {
              props: {
                type: 'info',
                disabled: params.row.log === null || params.row.log.trim() === ''
              },
              on: {
                click: (event) => {
                  that.historyMessage = params.row.log
                  that.historyDetailModal = true
                }
              }
            }, '查看日志')
          }
        }
      ]
    }
  },
  methods: {
    addJob () {
      let that = this
      let algo_params = {}
      for (let k in that.algoParamsData) {
        algo_params[that.algoParamsData[k]['param_name']] = that.algoParamsData[k]['param_value']
      }
      let job_interval = {
        days: that.jobDayModel,
        hours: that.jobHourModel,
        minutes: that.jobMinuteModel,
        seconds: that.jobSecondModel
      }
      let param = {
        job_name: that.jobNameModel,
        job_intro: that.jobIntroModel,
        algo_id: that.algoModel,
        algo_params: algo_params,
        start_time: that.dateFormat(that.jobStartTime),
        job_interval: job_interval,
        usable: 1
      }
      axios({
        method: 'post',
        url: 'AIOPS-ALGORITHMS/meta/jobs',
        withCredentials: true,
        data: param
      }).then(function (response) {
        let data = response.data
        that.showMessage(data['code'] === 1, data['message'])
        if (data['code'] === 0) {
          return
        }
        data = data['data']
        that.loadJob()
      }).catch(function (error) {
        that.$Modal.error({
          title: '错误',
          content: error.data.message
        });
      });
    },
    loadJob () {
      let that = this
      that.jobLoading = true
      axios({
        method: 'get',
        url: 'AIOPS-ALGORITHMS/meta/jobs',
        withCredentials: true
      }).then(function (response) {
        let data = response.data
        if (data['code'] === 0) {
          that.showMessage(false, data['message'])
          return
        }
        data = data['data']
        let tList = []
        for (let k in data) {
          tList.push(
            {
              job_id: data[k]['job_id'],
              job_name: data[k]['job_name'],
              job_intro: data[k]['job_intro'],
              algo_id: data[k]['algo_id'],
              algo_params: JSON.stringify(JSON.parse(unescape(data[k]['algo_params'].replace(/\\/g, '%'))), null, 4),
              start_time: data[k]['start_time'],
              job_interval: JSON.stringify(JSON.parse(unescape(data[k]['job_interval'].replace(/\\/g, '%'))), null, 4),
              usable: data[k]['usable']
            }
          )
        }
        that.jobListDataTotal = tList
        that.totalPage = that.jobListDataTotal.length
        that.loadPage(that.currentPage)
        that.jobLoading = false
      }).catch(function (error) {
        that.$Modal.error({
          title: '错误',
          content: error.data.message
        });
        that.jobLoading = false
      });
    },
    updateJob () {
      let that = this
      let algo_params = {}
      for (let k in that.algoParamsData) {
        algo_params[that.algoParamsData[k]['param_name']] = that.algoParamsData[k]['param_value']
      }
      let job_interval = {
        days: that.jobDayModel,
        hours: that.jobHourModel,
        minutes: that.jobMinuteModel,
        seconds: that.jobSecondModel
      }
      let param = {
        job_id: that.jobIdModel,
        job_name: that.jobNameModel,
        job_intro: that.jobIntroModel,
        algo_id: that.algoModel,
        algo_params: algo_params,
        start_time: that.dateFormat(that.jobStartTime),
        job_interval: job_interval,
        usable: that.jobStatusModel
      }
      axios({
        method: 'post',
        url: 'AIOPS-ALGORITHMS/meta/job',
        withCredentials: true,
        data: param
      }).then(function (response) {
        let data = response.data
        that.showMessage(data['code'] === 1, data['message'])
        if (data['code'] === 0) {
          return
        }
        data = data['data']
        that.loadJob()
      }).catch(function (error) {
        that.$Modal.error({
          title: '错误',
          content: error.data.message
        });
      });
    },
    deleteJob (job_id) {
      let that = this
      axios({
        method: 'delete',
        url: 'AIOPS-ALGORITHMS/meta/job',
        withCredentials: true,
        data: {
          job_id: job_id
        }
      }).then(function (response) {
        let data = response.data
        that.showMessage(data['code'] === 1, data['message'])
        if (data['code'] === 0) {
          return
        }
        data = data['data']
        that.loadJob()
      }).catch(function (error) {
        that.$Modal.error({
          title: '错误',
          content: error.data.message
        });
      });
    },
    loadAlgorithms () {
      let that = this
      axios({
        method: 'get',
        url: 'AIOPS-ALGORITHMS/meta/algorithms',
        withCredentials: true
      }).then(function (response) {
        let data = response.data
        if (data['code'] === 0) {
          that.showMessage(false, data['message'])
          return
        }
        data = data['data']
        let tList = []
        for (let t in data) {
          if (data[t]['usable']) {
            tList.push({
              algo_id: data[t]['algo_id'],
              algo_intro: data[t]['algo_intro'],
              algo_name: data[t]['algo_name'],
              algo_params: data[t]['algo_params'],
              usable: data[t]['usable']
            })
          }
        }
        that.algoList = tList
      }).catch(function (error) {
        that.$Modal.error({
          title: '错误',
          content: error.data.message
        });
      });
    },
    loadAlgoParams () {
      let that = this
      for (let algo in that.algoList) {
        if (that.algoList[algo].algo_id === that.algoModel) {
          let params = JSON.parse(that.algoList[algo].algo_params)
          let t = []
          for (let param in params) {
            t.push({
              param_name: param,
              param_value: params[param]
            })
          }
          that.algoParamsData = t
        }
      }
    },
    loadUpdate (index) {
      let that = this
      that.jobIdModel = index.job_id
      that.jobNameModel = index.job_name
      that.jobIntroModel = index.job_intro
      that.algoModel = index.algo_id
      that.jobStartTime = this.getDate(index.start_time)
      let interval = JSON.parse(index.job_interval)
      that.jobDayModel = interval['days']
      that.jobHourModel = interval['hours']
      that.jobMinuteModel = interval['minutes']
      that.jobSecondModel = interval['seconds']
      that.jobStatusModel = index.usable
      let par = JSON.parse(index.algo_params)
      let l = []
      for (let k in par) {
        l.push(
          {
            param_name: k,
            param_value: par[k]
          }
        )
      }
      that.algoParamsData = l
      that.jobUpdateModel = true
    },
    loadAdd () {
      let that = this
      that.jobNameModel = ''
      that.jobIntroModel = ''
      that.algoModel = -1
      that.jobStartTime = new Date()
      that.jobDayModel = 0
      that.jobHourModel = 0
      that.jobMinuteModel = 1
      that.jobSecondModel = 0
      that.algoParamsData = []
      that.jobModal = true
    },
    loadHistory (job_id) {
      let that = this
      that.historyLoading = true
      that.historyData = []
      that.historyDrawerModel = true
      let param = {
        job_id: job_id
      }
      axios({
        method: 'get',
        url: 'AIOPS-ALGORITHMS/meta/history',
        withCredentials: true,
        params: param
      }).then(function (response) {
        let data = response.data
        if (data['code'] === 0) {
          that.showMessage(false, data['message'])
          return
        }
        data = data['data']
        let tList = []
        for (let t in data) {
          tList.push({
            start_time: data[t]['start_time'],
            finish_time: data[t]['finish_time'],
            status: data[t]['job_status'],
            log: data[t]['job_ip']+' >>> '+(data[t]['job_log']===null?'无日志':data[t]['job_log'])
          })
        }
        that.historyData = tList
        that.historyLoading = false
      }).catch(function (error) {
        that.$Modal.error({
          title: '错误',
          content: error.data.message
        });
        that.historyLoading = false
      });
    },
    loadPage (page) {
      let that = this
      that.currentPage = page
      that.jobListData = that.jobListDataTotal.slice(that.tablePageSize * (page - 1),
        that.tablePageSize * page)
    },
    showMessage (isSucc, desc) {
      if (isSucc) {
        this.$Notice.success({
          title: '成功',
          desc: desc,
          duration: 0
        })
      } else {
        this.$Notice.error({
          title: '错误',
          desc: desc,
          duration: 0
        })
      }
    },
    getDate (timeStr) {
      var timeArr = timeStr.split(' ')
      var d = timeArr[0].split('-')
      var t = timeArr[1].split(':')
      return new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2])
    },
    dateFormat (time) {
      let date = new Date(time)
      let year = date.getFullYear()
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      // 拼接
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
    }
  },
  mounted () {
    this.loadAlgorithms()
    this.loadJob()
    const timer = setInterval(() => {
      let that = this
      if (that.historyDrawerModel) this.loadHistory(this.currentHistoryJobId)
    }, 10000)
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timer)
    })
  }
}
</script>

<style scoped>

</style>
