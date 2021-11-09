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
import {on, off} from '@/libs/tools'

export default {
  data() {
    return {
      parent_type: '',
      child_type: '',
      province: '',
      scene: '',
      ip: '',
      pt: '',
      parentTypeList: [],
      childTypeList: [],
      provinceList: [],
      sceneList: [],
      ipList: [],
      ptList: [],
      modeSwitch: true,
      switchDisabled: false,
    }
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
      let url = 'AIOPS-ALGORITHMS/service/baseline/meta' + (that.modeSwitch ? '/auto' : '/custom');
      that.switchDisabled = true
      axios({
        method: 'get',
        url: url,
        withCredentials: true,
        params: param
      }).then(function (response) {
        let data = response.data
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
          case 'predict_time':
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
      let that = this
      if (that.parent_type !== '' && that.child_type !== ''
        && that.province !== '' && that.scene !== '' && that.ip !== '' && that.pt !== '') {
        let param = {
          parent_type: that.parent_type,
          child_type: that.child_type,
          province: that.province,
          scene: that.scene,
          ip: that.ip,
          t: that.pt
        }
        console.log(param)
        let url = 'AIOPS-ALGORITHMS/service/baseline/data' + (that.modeSwitch ? '/auto' : '/custom')
        console.log(url)
        axios({
          method: 'get',
          url: url,
          withCredentials: true,
          params: param
        }).then(function (response) {
          let data = response.data
          if (data['code'] === 0) {
            return
          }
          data = data['data']
          let values = data['value']
          let timeList = []
          let valueList = []
          for (let i in values) {
            let t_value = values[i]
            for (let k in t_value) {
              timeList.push(k)
              valueList.push(t_value[k])
            }
          }
          let unit = data['unit']

          // 开始绘图
          that.chartLine = echarts.init(document.getElementById('chartLineBox'));

          // 指定图表的配置项和数据
          that.option = {
            tooltip: {              //设置tip提示
              trigger: 'axis'
            },

            legend: {               //设置区分（哪条线属于什么）
              data: ['动态基线']
            },
            color: ['#8AE09F', '#FA6F53'],       //设置区分（每条线是什么颜色，和 legend 一一对应）
            xAxis: {                //设置x轴
              type: 'category',
              boundaryGap: false,     //坐标轴两边不留白
              data: timeList,
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
              name: '基线水平(' + unit + ')',
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
                name: '动态基线',
                data: valueList,
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
        }).catch(function (error) {
          that.$Modal.error({
            title: '错误',
            content: error.data.message
          });
        });
      } else {

      }
    },
    switchMode() {
      let that = this
      that.loadMeta('')
    },
    resize() {
      this.chartLine.resize()
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
        data: ['动态基线']
      },
      color: ['#8AE09F', '#FA6F53'],       //设置区分（每条线是什么颜色，和 legend 一一对应）
      xAxis: {                //设置x轴
        type: 'category',
        boundaryGap: false,     //坐标轴两边不留白
        data: [],
        // name: '时间点',           //X轴 name
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
        // name: '基线水平',
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
          name: '动态基线',
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
  beforeDestroy() {
    off(window, 'resize', this.resize)
  }
}
</script>

<style scoped>

</style>
