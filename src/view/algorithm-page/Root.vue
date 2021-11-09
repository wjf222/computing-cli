<template>
  <div class="main-div" id="root_div" v-cloak>
    <Card>
      <Row>
        <i-Col span="3">
          <Select v-model="dateModel"  style="width:200px" placeholder="选择日期" @on-select="selectDate">
            <Option v-for="date in root_dates" :value="date" :key="date.id">{{ date }}</Option>
          </Select>
        </i-Col>
        <i-Col span="3" style="margin-left: 10px">
          <Select v-model="levelModel"  style="width:200px" placeholder="选择模型层次" @on-select="selectLevel">
            <Option v-for="item in root_levels" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </i-Col>
      </Row>
      <br>
<!--      <tables stripe :loading="loading"  ref="tables" v-model="nowData" :columns="columns" row-key="id" />-->
      <tree-table  :columns="columns" :data="nowData" :show-header="true" :selection-type="false"></tree-table>
      <Page :total="dataCount" ref="page" :current.sync="pageCurrent" :page-size="pageSize" @on-change="changepage" show-elevator />
    </card>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'tables_page',
  components: {

  },
  data () {
    return {
      root_dates: [],
      datalist_2:[
        {
          "layer_num": 1,
          "error_index": "武汉",
          "error_link": {
            "sum": 1232,
            "value": {
              "图像识别": {
                "sum": 286,
                "value": {
                  "内网": {
                    "sum": 143,
                    "value": {
                      "10.238.31.102": {
                        "sum": 143,
                        "value": {
                          "telnet-研发服务器-10.238.31.102-22": 143
                        }
                      }
                    }
                  },
                  "硬件层": {
                    "sum": 143,
                    "value": {
                      "10.238.31.102": {
                        "sum": 143,
                        "value": {
                          "telnet-研发服务器-10.238.31.102-22": 143
                        }
                      }
                    }
                  }
                }
              },
              "数据中心": {
                "sum": 429,
                "value": {
                  "内网": {
                    "sum": 429,
                    "value": {
                      "10.238.0.116": {
                        "sum": 143,
                        "value": {
                          "telnet-统计专用服务器-10.238.0.116-22": 143
                        }
                      },
                      "10.238.0.117": {
                        "sum": 143,
                        "value": {
                          "telnet-统计专用服务器-10.238.0.117-22": 143
                        }
                      },
                      "10.238.0.118": {
                        "sum": 143,
                        "value": {
                          "telnet-统计专用服务器-10.238.0.118-22": 143
                        }
                      }
                    }
                  }
                }
              },
              "数据监控": {
                "sum": 517,
                "value": {
                  "微服务": {
                    "sum": 88,
                    "value": {
                      "10.238.0.45": {
                        "sum": 88,
                        "value": {
                          "数据分析服务": 3,
                          "系统服务": 3,
                          "网关服务": 79,
                          "配置服务": 3
                        }
                      }
                    }
                  },
                  "硬件层": {
                    "sum": 429,
                    "value": {
                      "10.238.0.116": {
                        "sum": 143,
                        "value": {
                          "telnet-统计专用服务器-10.238.0.116-22": 143
                        }
                      },
                      "10.238.0.117": {
                        "sum": 143,
                        "value": {
                          "telnet-统计专用服务器-10.238.0.117-22": 143
                        }
                      },
                      "10.238.0.118": {
                        "sum": 143,
                        "value": {
                          "telnet-统计专用服务器-10.238.0.118-22": 143
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        {
          "layer_num": 1,
          "error_index": "湖北",
          "error_link": {
            "sum": 1587,
            "value": {
              "分布式故障定位": {
                "sum": 288,
                "value": {
                  "物联管理": {
                    "sum": 288,
                    "value": {
                      "10.238.0.132": {
                        "sum": 144,
                        "value": {
                          "nagios-nrpe-server": 144
                        }
                      },
                      "10.238.0.134": {
                        "sum": 144,
                        "value": {
                          "nagios-nrpe-server": 144
                        }
                      }
                    }
                  }
                }
              },
              "图像识别": {
                "sum": 572,
                "value": {
                  "物联管理": {
                    "sum": 572,
                    "value": {
                      "10.238.61.19": {
                        "sum": 143,
                        "value": {
                          "nagios-nrpe-server": 143
                        }
                      },
                      "10.238.61.20": {
                        "sum": 143,
                        "value": {
                          "nagios-nrpe-server": 143
                        }
                      },
                      "10.238.61.21": {
                        "sum": 143,
                        "value": {
                          "nagios-nrpe-server": 143
                        }
                      },
                      "10.238.61.23": {
                        "sum": 143,
                        "value": {
                          "nagios-nrpe-server": 143
                        }
                      }
                    }
                  }
                }
              },
              "大数据安装培训": {
                "sum": 144,
                "value": {
                  "物联管理": {
                    "sum": 144,
                    "value": {
                      "10.238.0.15": {
                        "sum": 144,
                        "value": {
                          "nagios-nrpe-server": 144
                        }
                      }
                    }
                  }
                }
              },
              "数据中心": {
                "sum": 573,
                "value": {
                  "物联管理": {
                    "sum": 573,
                    "value": {
                      "10.238.0.115": {
                        "sum": 144,
                        "value": {
                          "nagios-nrpe-server": 144
                        }
                      },
                      "10.238.0.47": {
                        "sum": 143,
                        "value": {
                          "nagios-nrpe-server": 143
                        }
                      },
                      "10.238.0.80": {
                        "sum": 143,
                        "value": {
                          "nagios-nrpe-server": 143
                        }
                      },
                      "10.238.0.83": {
                        "sum": 143,
                        "value": {
                          "nagios-nrpe-server": 143
                        }
                      }
                    }
                  }
                }
              },
              "数据监控": {
                "sum": 10,
                "value": {
                  "中间件": {
                    "sum": 10,
                    "value": {
                      "10.238.0.46": {
                        "sum": 10,
                        "value": {
                          "tomcat-18080": 5,
                          "tomcat-docs": 5
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      ],
      // 分页
      dataCount: 10,
      pageSize: 10,
      dateModel: '2020-06-18 00:00:00',
      levelModel: 'area',
      root_levels: [{
        value: 'area',
        label: '地区'
      }, {
        value: 'system',
        label: '系统模块'
      }, {
        value: 'module',
        label: '模型层次'
      }, {
        value: 'node',
        label: '节点'
      }

      ],
      pageCurrent: 1,
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
      columns: [
        {
          lable: '故障模组名称',
          prop: 'name'
        },
        {
          lable: '故障总数',
          prop: 'error_num'
        }
      ],
      select_model: '-1',
      theme_select_model: '-1',
      themeChooseList: [],
      nowData: [],
      show_root: null
    }
  },
  methods: {
    // 选择日期 触发事件
    selectDate (value) {
      // 渲染选择
      this.dateModel = value
      // 发起请求，请求当天的分析数据和原始数据
      this.get_data_by_date(this.dateModel, this.levelModel)
    },
    selectLevel (value) {
      // 渲染选择
      this.levelModel = value
      // 发起请求，请求当天的分析数据和原始数据
      this.get_data_by_date(this.dateModel, this.levelModel)
    },
    // 获取所有日期
    get_all_dates: function () {
      let that = this
      axios({
        method: 'get',
        url:'AIOPS-ALGORITHMS/service/root/get_dates'
      }).then(function (response) {
        let dates = []
        let data = response.data
        if(data['code'] == 0){
          this.$Message.error('请求所有日期数据失败！')
        }else{
          dates = data["data"];
        }
        that.root_dates = dates;
      })
    },
    get_data_by_date: function (date, level) {
      let data = {
        "date": date,
        "level": level
      }
      let that = this
      axios({
        method: 'get',
        url:"AIOPS-ALGORITHMS/service/root/get_data_by_date",
        params: data
      }).then(function (response) {
        if(response.data.code == 1){
          let res_data = response.data.data
          // 当前展示信息
          that.datalist_2 = res_data[0]
          //that.makeData()
          console.log(that.datalist_2)
        }
      })
    },
    selectTheme (value) {
      this.theme_select_model = value
    },
    selectOnline (value) {
      this.select_model = value
    },
    getThemeList () {

    },
    makeData () {
      var that = this
      var dataList = []
      const resultList = this.datalist_2
      this.dataCount = resultList.length
      for (let i = 0; i < resultList.length; i++) {
        var dom = {}
        dom['id'] = (resultList[i]['error_index'])
        dom['name'] = (resultList[i]['error_index'])
        dom['error_num'] = resultList[i]['error_link']['sum']
        dom['children'] = []
        // 第一层到图像识别、雷电定位
        for (let item in resultList[i]['error_link']['value']) {
          var dom_1 = {}
          dom_1['id'] = (resultList[i]['error_index']) + item
          dom_1['name'] = item
          dom_1['error_num'] = resultList[i]['error_link']['value'][item]['sum']
          dom_1['children'] = []
          // 第二层到内网外网
          for (let item_1 in resultList[i]['error_link']['value'][item]['value']) {
            var dom_2 = {}
            dom_2['id'] = (resultList[i]['error_index']) + item + item_1
            dom_2['name'] = item_1
            dom_2['error_num'] = resultList[i]['error_link']['value'][item]['value'][item_1]['sum']
            dom_2['children'] = []
            // 第三层到ip
            for (let item_2 in resultList[i]['error_link']['value'][item]['value'][item_1]['value']) {
              var dom_3 = {}
              dom_3['id'] = (resultList[i]['error_index']) + item + item_1 + item_2
              dom_3['name'] = item_2
              dom_3['error_num'] = resultList[i]['error_link']['value'][item]['value'][item_1]['value'][item_2]['sum']
              dom_3['children'] = []
              // 第四层到ip下面的详细信息
              for (let item_3 in resultList[i]['error_link']['value'][item]['value'][item_1]['value'][item_2]['value']) {
                var dom_4 = {}
                dom_4['id'] = (resultList[i]['error_index']) + item + item_1 + item_2 + item_3
                dom_4['name'] = item_3
                dom_4['error_num'] = resultList[i]['error_link']['value'][item]['value'][item_1]['value'][item_2]['value'][item_3]
                dom_3['children'].push(dom_4)
              }
              dom_2['children'].push(dom_3)
            }
            dom_1['children'].push(dom_2)
          }
          dom['children'].push(dom_1)
        }
        dataList.push(dom)
      }
      // 分页
      that.tableData = dataList
      // console.log(dataList)
      that.freshpage(that.pageCurrent)
      that.loading = false
    },

    getData () {
      var that = this
      const param = {
        root_type: '1',
        root_time: '2020-6-18'
      }
      axios({
        method: 'post',
        url: this.GLOBAL.BASE_URL + 'root/auto',
        params: param,
        withCredentials: true
      }).then(function (response) {
        const data = response.data
        const dataList = []
        const status = data['code']
        if (status === 1) { // 正确返回结果
          const resultList = data['data']
          that.dataCount = resultList.length
          for (let i = 0; i < resultList.length; i++) {
            var dom = {}
            dom['number'] = i + 1
            dom['name'] = (resultList[i]['error_index'])
            dom['error_num'] = resultList[i]['error_link']['sum']
            dom['children'] = []
            // 第一层到图像识别、雷电定位
            for (let item in resultList[i]['error_link']['value']) {
              var dom_1 = {}
              dom_1['number'] = (i + 1) * 100 + i
              dom_1['name'] = item
              dom_1['error_num'] = resultList[i]['error_link']['value'][item]['sum']
              dom_1['children'] = []
              // 第二层到内网外网
              for (let item_1 in resultList[i]['error_link']['value'][item]['value']) {
                var dom_2 = {}
                dom_2['number'] = ((i + 1) * 100 + i) * 100 + i
                dom_2['name'] = item_1
                dom_2['error_num'] = resultList[i]['error_link']['value'][item]['value'][item_1]['sum']
                dom_2['children'] = []
                // 第三层到ip
                for (let item_2 in resultList[i]['error_link']['value'][item]['value'][item_1]['value']) {
                  var dom_3 = {}
                  dom_3['number'] = (((i + 1) * 100 + i) * 100 + i) * 100 + i
                  dom_3['name'] = item_2
                  dom_3['error_num'] = resultList[i]['error_link']['value'][item]['value'][item_1]['value'][item_2]['sum']
                  dom_3['children'] = []
                  // 第四层到ip下面的详细信息
                  for (let item_3 in resultList[i]['error_link']['value'][item]['value'][item_1]['value'][item_2]['value']) {
                    var dom_4 = {}
                    dom_4['number'] = ((((i + 1) * 100 + i) * 100 + i) * 100 + i) + i
                    dom_4['name'] = item_3
                    dom_4['error_num'] = resultList[i]['error_link']['value'][item]['value'][item_1]['value'][item_2]['value'][item_3]
                    dom_3['children'].push(dom_4)
                  }
                  dom_2['children'].push(dom_3)
                }
                dom_1['children'].push(dom_2)
              }
              dom['children'].push(dom_1)
            }
            dataList.push(dom)
          }
          // 分页
          that.tableData = dataList
          that.freshpage(that.pageCurrent)
          that.loading = false
        } else { // 后台返回错误如何处理？
          console.log(status) // 控制台提示报错
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
      //console.log(this.nowData)
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
      //console.log(this.nowlogsItemsList)
      // 储存当前页
      this.logPageCurrent = index
    }
  },
  created () {

  },
  mounted () {
    this.makeData()
    this.get_all_dates()
    // this.getData()
    // this.getThemeList()
  }
}
</script>
