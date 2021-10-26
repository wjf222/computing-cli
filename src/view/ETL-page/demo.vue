<template>
  <div>
    <row>
      <i-col span="12" offset="2">
        <Select v-model="thisModel"  style="width:200px" placeholder="选择对应模型分析" @on-select="selectModel">
          <Option v-for="item in mds" :value="item.value" :key="item.id">{{ item.label }}</Option>
        </Select>
        <Select v-model="thisIp" clearable style="width:200px;margin-left: 10px" placeholder="根据ip选择对应基线进行查看" @on-select="selectIp" @on-clear="clearSelectIp">
          <Option v-for="item in ips" :value="item.value" :key="item.id">{{ item.value }}</Option>
        </Select>
<!--        <Input placeholder="输入ip搜索对应实体基线" style="width: auto; margin: 10px 10px;" v-model="searchModel" :search=true @on-search="searchIp">-->
<!--          <Icon type="ios-search" slot="suffix" />-->
<!--        </Input>-->
<!--        <Button style="margin: 10px 10px;" type="primary" @click="searchIp">搜索</Button>-->
      </i-col>
    </row>
    <row>
      <i-col span="24">
        <div ref="lineChart" style="height:400px;"></div>
      </i-col>
    </row>
  </div>

</template>
<script>
import echarts from 'echarts'
import { on, off } from '@/libs/tools'
import axios from 'axios'
export default {
  name: 'demo',
  components: {

  },
  data () {
    return {
      thisModel: 12,
      lineChartDom: null,
      text: '智能运维CPU使用率动态基线Demo展示',
      subtext: '分组展示',
      ips: [],
      mds: [
        {
          value: 12,
          label: 'CPU基线分析'
        },
        {
          value: 14,
          label: '内存使用率基线分析'
        },
        {
          value: 15,
          label: '磁盘使用率基线分析'
        }

      ],
      thisIp: null,
      allipdata: [],
      searchModel: null,
      chartOption: {
        dataset: {
          source: [
            { 'date': '2020-04-27', 'id': 29, 'ip': '10.238.0.12', 'job_id': 10, 'value': 34.25 },
            { 'date': '2020-04-26', 'id': 33, 'ip': '10.238.0.12', 'job_id': 10, 'value': 15.5 },
            { 'date': '2020-04-25', 'id': 37, 'ip': '10.238.0.12', 'job_id': 10, 'value': 18.5 },
            { 'date': '2020-04-24', 'id': 41, 'ip': '10.238.0.12', 'job_id': 10, 'value': 4.5 },
            { 'date': '2020-04-23', 'id': 45, 'ip': '10.238.0.12', 'job_id': 10, 'value': 31.75 },
            { 'date': '2020-04-22', 'id': 49, 'ip': '10.238.0.12', 'job_id': 10, 'value': 19.25 },
            { 'date': '2020-04-21', 'id': 53, 'ip': '10.238.0.12', 'job_id': 10, 'value': 23.75 }
          ]
        },
        tooltip: {
          trigger: 'axis'
        },
        title: {
          text: '智能运维CPU使用率动态基线Demo展示',
          subtext: '分组展示',
          x: 'center'
        },
        xAxis: {
          type: 'category',
          name: '日期'
          // 强制显示所有横坐标不建议使用
          // axisLabel:{
          //  interval: 0
          // }
        },
        yAxis: {
          type: 'value',
          name: 'CPU使用率（%）'
        },
        series: [{

          type: 'line',
          smooth: true,
          encode: {
            x: 'date',
            y: 'value'
          }
        }]
      }
    }
  },
  methods: {
    resize () {
      this.lineChartDom.resize()
    },
    ipsInit () {
      const that = this
      axios({
        method: 'get',
        url: 'AIOPS-ALGORITHMS/service/baseline/ips',
        withCredentials: true,
        params: {
          job_id: this.thisModel
        }
      }).then(function (response) {
        const data1 = response.data
        if (data1['code'] == 1) {
          // 传统方法
          // let tip=[];
          // for(var j = 0; j < data1.data.length; j++) {
          //   tip.push({
          //     value:data1.data[j],
          //     label:data1.data[j]
          //   })
          // }
          // vue的内置方法，mapfilter等等可以方便地对数据进行处理
          let nip = data1.data.map((item, i) => {
            return {
              value: item,
              label: item
            }
          })
          that.ips = nip
        } else {
          that.$Modal.error({
            title: '失败',
            content: '服务器端获取可能出错，请检查！'
          })
        }
      })
    },
    getDataset (tip) {
      // 这里重复init了，可以加入判断，如果有了对象直接获取对象？
      this.lineChartDom = echarts.init(this.$refs.lineChart)
      this.lineChartDom.setOption(this.chartOption)
      on(window, 'resize', this.resize)
      const that = this
      const param = {
        job_id: this.thisModel,
        ip: tip
      }
      axios({
        method: 'get',
        url: 'AIOPS-ALGORITHMS/service/baseline',
        withCredentials: true,
        params: param
      }).then(function (response) {
        const data1 = response.data
        if (data1['code'] == 1) {
          if (tip == null || tip == undefined) {
            that.allipdata = data1.data
            that.makeStuckData()
          } else {
            if (data1.data.length > 0) {
              let dataset_order = data1.data.sort(that.sortDate('date'))
              that.chartOption.dataset = [{
                source: dataset_order
              }]
              that.chartOption.series = [{
                type: 'line',
                smooth: true,
                encode: {
                  x: 'date',
                  y: 'value'
                }
              }]
              that.chartOption.title.subtext = '单点ip'
              // 这里图件未刷新，可以看到对应的变化，merge参数为true触发图件刷新
              that.lineChartDom.setOption(that.chartOption, true)
            } else {
              that.$Modal.error({
                title: '失败',
                content: '该实体当前并没有基线数据，请检查参数'
              })
            }
          }
        } else {
          that.$Modal.error({
            title: '失败',
            content: '服务器端参数可能出错，请检查！'
          })
        }
      })
    },
    // 处理堆叠数据
    makeStuckData () {
      var that = this
      axios({
        method: 'get',
        url: 'AIOPS-ALGORITHMS/service/baseline/ips',
        withCredentials: true,
        params: {
          job_id: this.thisModel
        }
      }).then(function (response) {
        const data1 = response.data
        if (data1['code'] == 1) {
          // 数组是一个特殊的对象，这里使用对象来存储多个数组
          let StuckData = {}
          let tips = data1.data
          // 生成二维数组空间
          for (var i = 0; i < tips.length; i++) {
            let ip = tips[i]
            // 这样才能将变量作为一个对象的key，push进一个数组。
            StuckData[ip] = []
          }
          // 将所有ip的基线数据分别push进对应的ip数组中
          for (let i = 0; i < that.allipdata.length; i++) {
            let item = that.allipdata[i]
            let key = item.ip
            StuckData[key].push({
              ip: item.ip,
              date: item.date,
              id: item.id,
              job_id: item.job_id,
              value: item.value
            })
          }
          // 将对应ip数组中的数据根据date排序方便展示。
          // 使用let i in能够获得对应键值
          for (let i in StuckData) {
            StuckData[i].sort(that.sortDate('date'))
          }
          // 获取结果
          // console.log(StuckData)
          // 将得到的数据放入dataset准备使用
          that.chartOption.dataset = []
          for (let i in StuckData) {
            that.chartOption.dataset.push({
              source: StuckData[i]
            })
          }
          // 准备堆叠图对应的options
          that.chartOption.series = []
          // console.log(that.chartOption.dataset[0].source[0].ip)
          for (let i = 0; i < that.chartOption.dataset.length; i++) {
            that.chartOption.series.push({
              name: that.chartOption.dataset[i].source[0].ip,
              type: 'line',
              smooth: true,
              datasetIndex: i,
              encode: {
                x: 'date',
                y: 'value'
              }
            })
          }
          that.chartOption.title.subtext = '分组展示'
          that.lineChartDom.setOption(that.chartOption, true)
        } else {
          that.$Modal.error({
            title: '失败',
            content: '服务器端获取可能出错，请检查！'
          })
        }
      })
    },
    // 数组的时间sort方法
    sortDate (key) {
      var that = this
      return function (a, b) {
        var key1 = a[key]
        var key2 = b[key]
        var t1 = that.strDateForDate(key1)
        var t2 = that.strDateForDate(key2)
        if (t1 > t2) {
          return 1
        } else {
          return -1
        }
      }
    },
    // 时间字符串转为时间格式方便比较：2020-04-23
    strDateForDate (str) {
      var strDate = str.split(' ')
      var strDatepart = strDate[0].split('-')
      var dtDate = new Date(strDatepart[0], strDatepart[1] - 1, strDatepart[2])
      return dtDate
    },
    selectIp (value) {
      this.getDataset(value)
    },
    clearSelectIp () {
      this.getDataset()
    },
    // searchIp (value) {
    //   this.thisIp = null
    //   this.getDataset(this.searchModel)
    // },
    selectModel (value) {
      this.thisModel = value
      this.thisIp = null
      if (value === 12) {
        this.chartOption.title.text = '智能运维CPU使用率动态基线Demo展示'
        this.chartOption.yAxis.name = 'CPU使用率（%）'
      } else if (value === 14) {
        this.chartOption.title.text = '智能运维内存使用率动态基线Demo展示'
        this.chartOption.yAxis.name = '内存使用率（%）'
      } else if (value === 15) {
        this.chartOption.title.text = '智能运维磁盘使用率动态基线Demo展示'
        this.chartOption.yAxis.name = '磁盘使用率（%）'
      }
      this.getDataset()
      this.ipsInit()
      // alert(value)
    }
  },
  mounted () {
    this.ipsInit()
    this.getDataset()
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}

</script>
