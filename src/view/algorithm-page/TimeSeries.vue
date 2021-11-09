<template>
  <div>
    <Card>
      <Row :gutter="20" style="margin-top: 10px;">
        <i-col :xs="12" :md="8" :lg="4" style="min-width: 200px">
          自动分析:
          <i-switch v-model="modeSwitch" @on-change="switchMode" v-bind:loading="switchDisabled"></i-switch>
        </i-col>
      </Row>
      <Row :gutter="20" style="margin-top: 10px;">
        <i-col :xs="12" :md="8" :lg="4" style="min-width: 200px;">
          省份：<br/>
          <label>
            <Select v-model="province" style="width:200px" @on-change="loadMeta('province')">
              <Option v-for="item in provinceList" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </label>
        </i-col>
        <i-col :xs="12" :md="8" :lg="4" style="min-width: 200px">
          系统模块：<br/>
          <label>
            <Select v-model="parent_type" style="width:200px" @on-change="loadMeta('parent_type')">
              <Option v-for="item in parentTypeList" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </label>
        </i-col>
        <i-col :xs="12" :md="8" :lg="4" style="min-width: 200px">
          模型层次：<br/>
          <label>
            <Select v-model="child_type" style="width:200px" @on-change="loadMeta('child_type')">
              <Option v-for="item in childTypeList" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </label>
        </i-col>
        <i-col :xs="12" :md="8" :lg="4" style="min-width: 200px">
          场景：<br/>
          <label>
            <Select v-model="scene" style="width:200px" @on-change="loadMeta('scene')">
              <Option v-for="item in sceneList" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </label>
        </i-col>
        <i-col :xs="12" :md="8" :lg="4" style="min-width: 200px">
          ip：<br/>
          <label>
            <Select v-model="ip" style="width:200px" @on-change="loadMeta('ip')">
              <Option v-for="item in ipList" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </label>
        </i-col>
        <i-col :xs="12" :md="8" :lg="4" style="min-width: 200px">
          预测时间：<br/>
          <label>
            <Select v-model="pt" style="width:200px" @on-change="loadData">
              <Option v-for="item in ptList" :value="item" :key="item">{{ item }}</Option>
            </Select>
          </label>
        </i-col>
      </Row>

      <Row :gutter="20" style="margin-top: 10px;">
        <Card>
          <div id="chartLineBox" style="height: 500px;"></div>
        </Card>
      </Row>
    </Card>
  </div>

</template>

<script>
import axios from 'axios'
import echarts from 'echarts'
import {off, on} from "@/libs/tools";

export default {
  data() {
    return {
      province: '',
      parent_type: '',
      child_type: '',
      scene: '',
      ip: '',
      pt: '',
      provinceList: [],
      parentTypeList: [],
      childTypeList: [],
      sceneList: [],
      ipList: [],
      ptList: [],
      modeSwitch: true,
      switchDisabled: false
    }
  },
  mounted() {
    this.loadMeta('')
    this.chartLine = echarts.init(document.getElementById('chartLineBox'));

    // 指定图表的配置项和数据
    this.option = {
      tooltip: {              //设置tip提示
        trigger: 'axis'
      },
      grid: {
        top: '3%',
        left: '1.2%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      legend: {               //设置区分（哪条线属于什么）
        data: ['时序关联']
      },
      color: ['#8AE09F', '#FA6F53'],       //设置区分（每条线是什么颜色，和 legend 一一对应）
      xAxis: {                //设置x轴
        type: 'category',
        boundaryGap: false,     //坐标轴两边不留白
        data: [],
        name: '时间点',           //X轴 name
        nameTextStyle: {        //坐标轴名称的文字样式
          color: '#000000',
          fontSize: 16,
          padding: [0, 0, 0, 20]
        },
        axisLine: {             //坐标轴轴线相关设置。
          lineStyle: {
            color: '#000000',
          }
        }
      },
      yAxis: {
        name: '基线水平',
        nameTextStyle: {
          color: '#000000',
          fontSize: 16,
          padding: [0, 0, 10, 0]
        },
        axisLine: {
          lineStyle: {
            color: '#000000',
          }
        },
        type: 'value'
      },
      series: [
        {
          name: '时序关联',
          data: [],
          type: 'line',               // 类型为折线图
          lineStyle: {                // 线条样式 => 必须使用normal属性
            normal: {
              color: '#8AE09F',
            }
          },
        }
      ]
    };

    // 使用刚指定的配置项和数据显示图表。
    this.chartLine.setOption(this.option);

    this.$nextTick(() => {
      this.chartLine = echarts.init(document.getElementById('chartLineBox'))
      this.chartLine.setOption(this.option)
      on(window, 'resize', this.resize)
    })
  },
  methods: {
    loadMeta(location) {
      let that = this
      switch (location) {
        case '':
          that.provinceList = []
          that.parentTypeList = []
          that.childTypeList = []
          that.sceneList = []
          that.ipList = []
          that.ptList = []
          that.province = ''
          that.parent_type = ''
          that.child_type = ''
          that.scene = ''
          that.ip = ''
          that.pt = ''
          break
        case 'province':
          that.parentTypeList = []
          that.childTypeList = []
          that.sceneList = []
          that.ipList = []
          that.ptList = []
          that.parent_type = ''
          that.child_type = ''
          that.scene = ''
          that.ip = ''
          that.pt = ''
          break
        case 'parent_type':
          that.childTypeList = []
          that.sceneList = []
          that.ipList = []
          that.ptList = []
          that.child_type = ''
          that.scene = ''
          that.ip = ''
          that.pt = ''
          break
        case 'child_type':
          that.sceneList = []
          that.ipList = []
          that.ptList = []
          that.scene = ''
          that.ip = ''
          that.pt = ''
          break
        case 'scene':
          that.ipList = []
          that.ptList = []
          that.ip = ''
          that.pt = ''
          break
        case 'ip':
          that.ptList = []
          that.pt = ''
      }
      let param = {
        parent_type: that.parent_type === '' ? null : that.parent_type,
        child_type: that.child_type === '' ? null : that.child_type,
        province: that.province === '' ? null : that.province,
        scene: that.scene === '' ? null : that.scene,
        ip: that.ip === '' ? null : that.ip,
      }
      let url = 'AIOPS-ALGORITHMS/service/timeseries' + (that.modeSwitch ? '/auto' : '/custom');
      that.switchDisabled = true
      axios({
        method: 'get',
        url: url,
        withCredentials: true,
        params: param
      }).then(function (response) {
        let data = response.data
        // code === 0 代表请求出错
        if (data['code'] === 0) {
          return
        }
        switch (data['type']) {
          case 'province':
            that.provinceList = data['data']
            break
          case 'parent_type':
            that.parentTypeList = data['data']
            break
          case 'child_type':
            that.childTypeList = data['data']
            break
          case 'scene':
            that.sceneList = data['data']
            break
          case 'ip':
            that.ipList = data['data']
            break
          case 'predict_date':
            that.ptList = data['data']
            break
        }
        that.switchDisabled = false
      }).catch(function (error) {
        that.$Modal.error({
          title: '错误',
          content: error.data.message
        });
        that.switchDisabled = false
      });
    },
    loadData() {
      // 获取完整数据
      let that = this
      if (that.province !== '' || that.parent_type !== '' || that.child_type !== '' || that.scene !== '' || that.ip !== '' || that.pt !== '') {
        let param = {
          province: that.province,
          parent_type: that.parent_type,
          child_type: that.child_type,
          scene: that.scene,
          ip: that.ip,
          pt: that.pt
        }
        let url = 'AIOPS-ALGORITHMS/service/timeseries/data' + (that.modeSwitch ? '/auto' : '/custom')

        axios({
          method: 'get',
          params: param,
          url: url
        }).then(function (response) {
          let data = response.data
          if (data['code'] === 0) {
            return
          }
          if (data["data"] != null) {
            data = data["data"][0].split(",")
          }

          let x_zhou = []
          let count = 1
          for (let i = 1; i <= data.length; i++) {
            x_zhou.push(i)
          }
          that.chartLine = echarts.init(document.getElementById('chartLineBox'));
          // 指定图表的配置项和数据
          that.option = {
            tooltip: {              //设置tip提示
              trigger: 'axis'
            },

            legend: {               //设置区分（哪条线属于什么）
              data: ['时序关联']
            },
            color: ['#8AE09F', '#FA6F53'],       //设置区分（每条线是什么颜色，和 legend 一一对应）
            xAxis: {                //设置x轴
              type: 'category',
              boundaryGap: false,     //坐标轴两边不留白
              data: x_zhou,
              name: '时间点',           //X轴 name
              nameTextStyle: {        //坐标轴名称的文字样式
                color: '#000000',
                fontSize: 16,
                padding: [0, 0, 0, 20]
              },
              axisLine: {             //坐标轴轴线相关设置。
                lineStyle: {
                  color: '#000000',
                }
              }
            },
            yAxis: {
              name: '时序值',
              nameTextStyle: {
                color: '#000000',
                fontSize: 16,
                padding: [0, 0, 10, 0]
              },
              axisLine: {
                lineStyle: {
                  color: '#000000',
                }
              },
              type: 'value'
            },
            series: [
              {
                name: '时序关联',
                data: data,
                type: 'line',               // 类型为折线图
                lineStyle: {                // 线条样式 => 必须使用normal属性
                  normal: {
                    color: '#8AE09F',
                  }
                },
              }
            ]
          };

          // 使用刚指定的配置项和数据显示图表。
          that.chartLine.setOption(that.option);
          console.log(that.option)
        }).catch(function (error) {
          that.$Modal.error({
            title: '错误',
            content: error
          });
        });
      }

    },
    switchMode() {
      return
    },
    resize() {
      this.chartLine.resize()
    }
  },
  beforeDestroy() {
  off(window, 'resize', this.resize)
}
}
</script>

<style scoped>

</style>
