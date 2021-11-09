<template>
  <div>
    <Card>
      <Row :gutter="20" style="margin-top: 10px;">
        <i-col :xs="12" :md="8" :lg="4" style="min-width: 200px;">
          选择合并告警日期:<br/>
          <label>
            <Select v-model="dateModel" style="width:200px" placeholder="选择日期" @on-select="selectDate">
              <Option v-for="date in alert_dates" :value="date" :key="date.id">{{ date }}</Option>
            </Select>
          </label>
        </i-col>
        <i-col :xs="12" :md="8" :lg="4" style="min-width: 200px;">
          选择合并类型:<br/>
          <label>
            <Select v-model="typeModel" style="width:200px" placeholder="选择合并类型" @on-select="selectType">
              <Option v-for="type in alert_types" :value="type.value" :key="type.id">{{ type.label }}</Option>
            </Select>
          </label>
        </i-col>
      </Row>
      <Row :gutter="20" style="margin-top: 10px;">
        <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
          <Card>
            <div class="res-show-box" style="width: 100%;">
              <div class="alert-title" style="text-align:center;">
                告警信息
              </div>
              <div class="res-inner-box">
                <pre>{{ origin_alert }}</pre>
              </div>
            </div>
          </Card>
        </i-col>
        <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
          <Card >
            <div class="alert-title" style="text-align:center;">
              合并图示
            </div>
            <div id="myChart" style="height:600px;"></div>
          </Card>
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<style scoped>
.alert-title {
  text-align: center;
  font-size: 25px;
  font-weight: 400;
}
</style>

<script>
import echarts from 'echarts'
import {on, off} from '@/libs/tools'
import axios from 'axios'

require('echarts/extension/dataTool')
export default {
  name: 'alert',
  data() {
    return {
      // 表格原始数据
      typeModel: 0,
      alert_types: [
        {
          value: 0,
          label: "原始告警信息"
        },
        {
          value: 1,
          label: "单结点告警智能合并"
        },
        {
          value: 2,
          label: "功能告警智能合并"
        },
        {
          value: 3,
          label: "地区告警智能合并"
        },
        {
          value: 4,
          label: "综合告警智能合并"
        }
      ],
      alert_dates: [],
      dateModel: 0,
      //当前展示的告警信息
      show_alert: "默认告警信息",
      // 原始告警
      origin_alert: {},
      // 单结点告警
      one_node_alert: {},
      // 功能告警
      func_alert: {},
      // 地区告警
      area_alert: {},
      // 综合告警
      all_alert: {}
    }
  },
  // 渲染之前，获取数据库中已分析的合并数据
  created: function () {
    this.get_all_dates()
  },
  // 初始化页面
  mounted: function () {
    // 设置图标等待状态
    // this.myChart = echarts.init(document.getElementById('myChart'))
    // this.myChart.showLoading()

    this.$nextTick(() => {
      this.draw_graph(this.origin_alert, this.typeModel);
      on(window, 'resize', this.resize)
    })
  },
  methods: {
    // 选择合并类型 触发事件
    selectType(value) {
      this.typeModel = value;
      let type = ""
      let show_alert = ''
      let show_alert_str = ''
      switch (value) {
        case 0:
          // 原始告警
          type = 'origin'
          show_alert_str = JSON.stringify(this.origin_alert, null, 4)
          show_alert = this.origin_alert
          console.log('show_alert', show_alert)
          break;
        case 1:
          // 单结点
          type = 'result'
          show_alert_str = JSON.stringify(this.one_node_alert, null, 4)
          show_alert = this.one_node_alert
          console.log('show_alert', show_alert)
          break;
        case 2:
          // 功能告警
          type = 'result'
          show_alert_str = JSON.stringify(this.func_alert, null, 4)
          show_alert = this.func_alert
          console.log('show_alert', show_alert)
          break;
        case 3:
          // 地区告警
          type = 'result'
          show_alert_str = JSON.stringify(this.area_alert, null, 4)
          show_alert = this.area_alert
          console.log('show_alert', show_alert)
          break;
        case 4:
          // 综合告警
          type = 'result'
          show_alert_str = JSON.stringify(this.all_alert, null, 4)
          show_alert = this.all_alert
          console.log('show_alert', show_alert)
          break;
      }
      // 展示
      this.show_alert = show_alert_str
      // 绘制
      this.draw_graph(show_alert, type);
    },
    // 选择日期 触发事件
    selectDate(value) {
      // 渲染选择
      this.dateModel = value
      // 发起请求，请求当天的分析数据和原始数据
      this.get_data_by_date(value)
    },
    // 获取所有日期
    get_all_dates: function () {
      let that = this
      axios({
        method: 'get',
        url: 'AIOPS-ALGORITHMS/service/alert/get_dates'
      }).then(function (response) {
        let dates = []
        let data = response.data
        if (data['code'] == 0) {
          this.$Message.error('请求所有日期数据失败！')
        } else {
          dates = data["data"];
          console.log('dates:', dates)
        }
        that.alert_dates = dates;
      })
    },

    get_data_by_date: function (value) {
      let data = {
        "date": value
      }
      let that = this
      axios({
        method: 'get',
        url: "AIOPS-ALGORITHMS/service/alert/get_data_by_date",
        params: data
      }).then(function (response) {
        console.log(response.data)
        if (response.data.code == 1) {
          let res_data = response.data.data
          // 当前展示信息
          that.show_alert = res_data[0]
          // 原始告警
          that.origin_alert = JSON.parse(res_data[0])
          // 单结点告警
          that.one_node_alert = JSON.parse(res_data[1])[0]
          // 功能告警
          that.func_alert = JSON.parse(res_data[1])[1]
          // 地区告警
          that.area_alert = JSON.parse(res_data[1])[2]
          // 综合告警
          that.all_alert = JSON.parse(res_data[1])[3]
        }
        console.log('原始告警', that.origin_alert)
        console.log('单结点告警', that.one_node_alert)
        console.log('功能告警', that.func_alert)
        console.log('地区告警', that.area_alert)
        console.log('综合告警', that.all_alert)
        // 请求之后默认绘制单结点告警智能合并
        // 1. 将上方选择框选择到原始告警智能合并
        that.typeModel = 0
        // 2. 展示原始JSON，并绘制数据
        let type = 'origin'
        that.draw_graph(that.origin_alert, type)
      })
    },

    draw_graph: function (alert_info, type) {
      let myChart = echarts.init(document.getElementById('myChart'))
      // 读入数据
      var option;
      myChart.showLoading();
      // 解析告警信息
      var option = this.get_option(alert_info, type)
      // 设置数据
      myChart.setOption(option);
      // 隐藏等待
      myChart.hideLoading();
      this.myChart = myChart;
    },

    get_option: function (alert_info, type) {

      var option = {
        tooltip: {              //设置tip提示
          trigger: 'axis'
        },
        grid: {
          top: '3%',
          left: '1.2%',
          right: '1%',
          bottom: '3%',
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: [],
            type: 'bar',
            barMaxWidth: 100
          }
        ]
      }

      if (type == "origin") {
        // 循环每个单结点
        for (let node in alert_info) {
          option["xAxis"]["data"].push(node)
          option["series"][0]["data"].push(alert_info[node]["sum"])
        }
      } else {
        // 结果类型
        for (let node in alert_info) {
          option["xAxis"]["data"].push(alert_info[node]['error_index'])
          option["series"][0]["data"].push(parseInt(alert_info[node]["error_link"]["sum"]))
        }
      }
      console.log('option', option)

      return option;
    },

    resize() {
      this.myChart.resize()
    }

  },
  beforeDestroy() {
    off(window, 'resize', this.resize)
  }
}
</script>

<style lang="less">
.res-show-box {
  display: inline-block;
  vertical-align: top;
  width: 500px;
  height: 630px;

  .res-inner-box {
    height: ~"calc(100% - 44px)";
    overflow: auto;
  }
}
</style>
