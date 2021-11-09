<template>
    <div>
        <Card>
            <p class="card-title">爬虫策略配置</p>
            <hr/>
            <div class="margin-space">
              <Table border :columns="table_column" :data="table_show_data" :loading="loading">
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary"  style="margin-right: 5px" @click="table_edit(row,index)">修改</Button>
                    <Button type="success" style="margin-right: 5px" @click="run_strategy(row,index)" :loading="strategy_status_list[row.strategy_name]">
                      <span v-if="strategy_status_list[row.strategy_name]">正在运行</span>
                      <span v-else>启动</span>
                    </Button>
                    <Button type="warning" style="margin-right: 5px" @click="table_delete(row,index)">删除</Button>
                </template>
              </Table>
              <br>
              <Page :total="crawl_func_count" ref="page" :current.sync="page_current" :page-size="page_size" @on-change="change_page" show-elevator />
              <br>
              <Row>
                  <Col span="2"><Button type="primary" @click="set_add_strategy" >新增一条策略</Button></Col>
                  <Col span="2"><Button type="success" @click="get_running_strategy" >查看当前执行情况</Button></Col>
                  <!-- <Col span="2" offset="18"><Button type="warning" @click="export_data" >爬取数据导出</Button></Col> -->
              </Row>
            </div>
        </Card>
        <br>
        <Modal v-model="open_edit_strategy" title="编辑策略" @on-ok="edit_ok" >
          <div>
              <Row>
                <Col span="3"><label>策略名称:</label></Col>
                <Col span="16"><label>{{ edit_data.strategy_name }}</label></Col>
              </Row>
              <br>
              <Card v-for="item in edit_data.strategy_info">
                <!-- <Row>
                  <Col span="18"><label>index: {{item.index}}</label></Col>
                  <Col span="6"><Button type="warning" @click="remove_info(item.index)">删除该条</Button></Col>
                </Row>
                <br> -->
                <Row>
                  <Col span="6"><label>数据源</label></Col>
                  <Col span="12">
                    <Select  v-model="item.data_source">
                      <Option v-for="one_source in select_data_source" :value="one_source">{{one_source}}</Option>
                    </Select>
                  </Col>
                </Row>
                <br>
                <Row>
                  <Col span="6"><label>爬取一级标签</label></Col>
                  <Col span="12">
                  <Select v-model="item.first_tag" filterable clearable @on-change="on_edit_knowledge_major_tag">
                    <Option v-for="one in select_major_tag_data" :value="one.tag_name">{{one.tag_name}}</Option>
                  </Select>
                  </Col>
                </Row>
                <br>
                <Row>
                  <Col span="6"><label>爬取二级标签</label></Col>
                  <Col span="12">
                    <Select v-model="item.second_tag" multiple filterable @on-change="on_edit_knowledge_minor_tag">
                      <Option v-for="one in select_minor_tag_data" :value="one.tag_name">{{one.tag_name}}</Option>
                    </Select>
                  </Col>
                </Row>
                <br>
                <Row>
                  <Col span="6"><label>爬取三级标签</label></Col>
                  <Col span="12">
                    <Select v-model="item.third_tag" multiple filterable>
                      <Option v-for="one in select_third_tag_data" :value="one.tag_name">{{one.tag_name}}</Option>
                    </Select>
                  </Col>  
                </Row>
              </Card>
              <br>
              <!-- <Row>
                <Col span="12"><Button type="primary" @click="add_info()">新增策略</Button></Col>
              </Row> -->
          </div>
        </Modal>
        <Modal v-model="open_run_strategy" title="启动爬虫" @on-ok="start_strategy(start_data.strategy_name)" okText="启动策略" >
          <div>
              <Row>
                <Col span="7"><label>策略名称:</label></Col>
                <Col span="16" offset="1"><label>{{ start_data.strategy_name }}</label></Col>
              </Row>
              <br>
              <Card v-for="(item,i) in start_data.strategy_info">
                <Row>
                  <Col span="6"><label>策略</label></Col>
                  <Col>{{i + 1}}</Col>
                </Row>
                <br>
                <Row>
                  <Col span="6"><label>数据源</label></Col>
                  <Col span="12">
                  <label>{{item.data_source}}</label>
                  </Col>
                </Row>
                <br>
                <Row>
                  <Col span="6"><label>爬取一级标签</label></Col>
                  <Col span="12">
                  <label>{{item.first_tag}}</label>
                  </Col>
                </Row>
                <br>
                <Row>
                  <Col span="6"><label>爬取二级标签</label></Col>
                  <Col span="12">
                    <label v-for="one_tag in item.second_tag">{{one_tag+"."}}</label>
                  </Col>
                </Row>
                <br>
                <Row>
                  <Col span="6"><label>爬取三级标签</label></Col>
                  <Col span="12">
                    <label v-for="one_tag in item.third_tag">{{one_tag+"."}}</label>
                  </Col>
                </Row>
              </Card>
          </div>
        </Modal>
        <Modal v-model="open_running_strategy" title="策略执行情况">
          <Row>
            <Col span="6"><strong>执行中的策略</strong></Col>
          </Row>
          <Row v-for="k,v in strategy_status_list">
            <Col span="10" offset="4" v-if="k">{{v}}</Col>
          </Row>
        </Modal>
        <Modal title="新增策略" v-model="open_add_strategy" @on-ok="add_strategy_ok">
          <Row>
            <Col span="3"><label for="">策略名:</label></Col>
            <Col span="12" offset="2"><Input v-model="add_data.strategy_name"></Input></Col>
          </Row>
          <br>
          <Row>
            <Col span="3"><label for="">策略描述:</label></Col>
            <Col span="12" offset="2"><Input v-model="add_data.strategy_describe"></Input></Col>
          </Row>
        </Modal>
    </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import axios from 'axios'
import qs from 'qs'
export default {
  name: 'crawl',
  data () {
    return {
      // strategy_status
      strategy_status_list: {},
      // 一级标签Select数据
      select_major_tag_data: [],
      // 二级标签Select数据
      select_minor_tag_data: [],
      // 三级标签Select数据
      select_third_tag_data: [],
      // 打开编辑策略接口
      open_edit_strategy: false,
      // 打开启动爬虫对话框
      open_run_strategy: false,
      // 打开正在运行的策略Modal
      open_running_strategy: false,
      // 打开新增爬虫策略对话框
      open_add_strategy: false,
      // 编辑策略 二级标签选择
      edit_select_minor_tag_data: [],
      // 编辑策略 三级标签选择
      edit_select_third_tag_data: [],
      // 表格正在加载中
      loading: false,
      // 展示的爬虫策略总条数
      crawl_func_count: 0,
      // 一页展示的数量
      page_size: 10,
      // 当前展示的页面索引值
      page_current: 1,
      // 表格第一行
      table_column: [
        {
          title: "策略名称",
          key: 'strategy_name',
          align: 'center'
        },
        {
          title: '策略描述',
          key: 'strategy_describe',
          align: 'center'
        },
        {
          title: '策略创建时间',
          key: 'strategy_created_time',
          align: 'center'
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          slot: 'action'
        }
      ],
      // 表格完整数据
      table_data: [
      ],
      // 表格当前页面展示的数据
      table_show_data: [
      ],
      // 表格插入的数据
      add_func_form_data: {
        func_name: '',
        crawl_source: '',
        crawl_tags: ''
      },
      // 定时爬虫
      time_form: {
        func: '',
        data: '',
        time: '',
        type: '',
        loop: ''
      },
      // 循环类型
      loop_types: [
        {
          label: '一日',
          value: 1
        },
        {
          label: '三日',
          value: 3
        },
        {
          label: '一周',
          value: 7
        }
      ],
      // 编辑策略的模拟数据
      edit_data: {
        strategy_name: '',
        strategy_info:
          {
            data_source: ['CSDN', 'OSCHINA'],
            major_tag_name: '网络',
            minor_tag_names: ['网络层', '传输层']
          }
      },
      start_data: {
        strategy_name: '',
        strategy_info: [
          {
            index: 1,
            data_source: ['CSDN', 'OSCHINA'],
            major_tag_name: '网络',
            minor_tag_names: ['网络层', '传输层']
          },
          {
            index: 2,
            data_source: ['CSDN'],
            major_tag_name: 'Shell',
            minor_tag_names: ['网络层', 'Shell 脚本']
          }
        ]
      },
      add_data: {
        strategy_name: '',
        strategy_describe: ''
      },
      // 数据源
      select_data_source: [
        'CSDN', 'OSCHINA'
      ]
    }
  },
  methods: {
    // 初始化table
    init_table: function () {

    },
    // 请求所有策略的运行情况
    request_strategy_status: function () {
      let that = this
      axios({
        method: 'get',
        url:'AIOPS-CRAWL/get_all_strategy_status'
      }).then(function (response) {
        let res_data = response.data
        if (res_data.status_code === 0) {
          that.strategy_status_list = res_data.status_list
        }else{
          that.$Message.error("获取所有情况失败！请刷新页面！")
        }
      })
    },
    // 获取所有爬虫策略当前是否运行
    get_all_strategy_status: function () {
      this.request_strategy_status()
      setInterval(this.request_strategy_status, 1000 * 10)
    },
    // 重新获取所有的爬虫策略
    fresh_table: function () {
      let that = this
      // 发起请求
      axios({
        method: 'get',
        url: 'AIOPS-KNOWLEDGE/get_all_crawl_strategy'
      }).then(function (response) {
        let res_data = response.data
        if (res_data.status_code === 0) {
          // that.loading = true
          that.table_data = res_data.data
          that.crawl_func_count = that.table_data.length
          that.page_current = 1
          that.page_size = 10
          that.cut_table_data(1, 10)
          // that.init_table()
          // that.loading = false
        }
      })
    },
    change_page: function (index) {
      this.cut_table_data(index, this.page_size)
    },
    // 切割数据
    cut_table_data (index, size) {
      let start = (index - 1) * size
      let end = index * size
      this.table_show_data = this.table_data.slice(start, end)
    },
    // 编辑爬虫策略
    table_edit (row, index) {
      let that = this
      // 获取到策略名称
      console.log(row.strategy_name)
      // eslint-disable-next-line no-unused-vars
      let strategy_name = row.strategy_name
      // 请求单个策略的详细信息
      axios({
        method: 'get',
        url: 'AIOPS-KNOWLEDGE/get_one_crawl_strategy',
        params: {
          strategy_name: strategy_name
        }
      }).then(function (response) {
        let res_data = response.data
        if (res_data.status_code === 0) {
          // 获取成功则打印获取到的单个策略名称
          that.edit_data = {
            strategy_name: strategy_name,
            strategy_info: that.format_strategy(res_data.data)
          }
          console.log('edit_data', that.edit_data)
          // console.log(that.edit_data)
          // that.edit_select_minor_tag_data = that.select_minor_tag_data
          // // 用于选择
          // console.log(that.edit_select_minor_tag_data)
          // that.edit_select_third_tag_data = that.select_third_tag_data
          // // 三级标签选择
          // console.log(that.edit_select_third_tag_data)
          // console.log(that.edit_data)
          //that.update_edit_select_tag_data()
          that.open_edit_strategy = true
        }
      })
      // 打开编辑框
    },
    update_edit_select_tag_data: function () {
      let that = this
      if (that.edit_data.strategy_info[0].first_tag != '') {
        let index = -1
        for (let i = 0; i < that.select_major_tag_data.length; i++) {
          if (that.select_major_tag_data[i].tag_name == that.edit_data.strategy_info[0].first_tag) {
            index = i
            break
          }
        }
        if (index == -1) {
          console.log(that.edit_data.strategy_info[0].first_tag + "does not exist!")
          return 
        }
        let data = {
          tag_ids : [that.select_major_tag_data[index].tag_id]
        }
        axios({
          method: 'post',
          url:'AIOPS-KNOWLEDGE/get_child_tags',
          data:data
        }).then(function(res) {
            let res_data = res.data;
            if(res_data.status_code == 0){
              res_data = res_data.data;
              that.edit_select_minor_tag_data = res_data;
            }
        })
      }
      if (that.edit_data.strategy_info[0].second_tag.length > 0) {
        let value = []
        let nums = that.edit_data.strategy_info[0].second_tag.length
        let cnt = 0
        for (let i = 0; i < that.select_minor_tag_data.length; i++) {
          for (let j = 0; j < nums; j++) {
            if (that.edit_data.strategy_info[0].second_tag[j] == that.select_minor_tag_data[i].tag_name) {
              value.push(that.select_minor_tag_data[i].tag_id)
              cnt++
              break
            }
          }
          if (cnt >= nums) {
            break
          }
        }
        if (cnt < nums) {
          console.log(that.edit_data.strategy_info[0].second_tag.toString() + "does not exist!")
          return 
        }
        let data = {
          tag_ids : value
        }
        axios({
          method: 'post',
          url:'AIOPS-KNOWLEDGE/get_child_tags',
          data:data
        }).then(function(res){
            let res_data = res.data;
            if(res_data.status_code == 0) {
              res_data = res_data.data;
              that.edit_select_third_tag_data = res_data;
            }
        })
      }
    },
    // 编辑窗口点击确定
    edit_ok () {
      // 遍历当前的strategy_info , 查看每一个策略的strategy_info_id 是否 === 0 
      // 如果等于0 则说明是新数据，需要新增，如果不等于0 则使用update对数据进行更新
      for (let i = 0; i < this.edit_data.strategy_info.length; i++) 
      {
        if (this.edit_data.strategy_info[i].strategy_info_id === 0) {
          let SECOND_TAG = ''
          let THIRD_TAG = ''
          if (this.edit_data.strategy_info[i].second_tag) {
            SECOND_TAG = this.edit_data.strategy_info[i].second_tag.toString()
          }
          if (this.edit_data.strategy_info[i].third_tag) {
            THIRD_TAG = this.edit_data.strategy_info[i].third_tag.toString()
          }
          // 发起新增请求
          let new_value = {
            "STRATEGY_NAME": this.edit_data.strategy_name,
            "DATA_SOURCE": this.edit_data.strategy_info[i].data_source,
            "FIRST_TAG": this.edit_data.strategy_info[i].first_tag,
            "SECOND_TAG": SECOND_TAG,
            "THIRD_TAG" : THIRD_TAG
          }
          axios({
            method: 'post',
            url: 'AIOPS-KNOWLEDGE/edit_crawl_strategy',
            data: {
              strategy_info_id: '',
              action_type: 'insert',
              new_value: new_value
            }
          }).then(function (response) {
            let res_data = response.data
            if (res_data.status_code === 0) {
              console.log('插入新策略信息成功')
            }
          })
        } else {
          // 发起更新请求
          let SECOND_TAG = ''
          let THIRD_TAG = ''
          if (this.edit_data.strategy_info[i].second_tag) {
            SECOND_TAG = this.edit_data.strategy_info[i].second_tag.toString()
          }
          if (this.edit_data.strategy_info[i].third_tag) {
            THIRD_TAG = this.edit_data.strategy_info[i].third_tag.toString()
          }
          let new_value = {
            "STRATEGY_NAME": this.edit_data.strategy_name,
            "DATA_SOURCE": this.edit_data.strategy_info[i].data_source,
            "FIRST_TAG": this.edit_data.strategy_info[i].first_tag,
            "SECOND_TAG": SECOND_TAG,
            "THIRD_TAG" : THIRD_TAG
          }
          axios({
            method: 'post',
            url: 'AIOPS-KNOWLEDGE/edit_crawl_strategy',
            data: {
              strategy_info_id: this.edit_data.strategy_info[i].strategy_info_id,
              action_type: 'update',
              new_value: new_value
            }
          }).then(function (response) {
            let res_data = response.data
            if (res_data.status_code === 0) {
              console.log('更新新策略信息成功')
            }
          })
        }
      }
    },
    // 移除数组中的某一条
    // remove_array: function (index, data) {
    //   let new_data = []
    //   for (let i in data) {
    //     if (data[i].index !== index) {
    //       new_data.push(data[i])
    //     }
    //   }
    //   return new_data
    // },
    // // 移除一条策略信息
    // remove_info: function (index, strategy_info_id) {
    //   // 在点击删除该条时，就发起删除strategy_info_id 的请求
    //   // 如果当前的strategy_info_id === 0 则不用发起请求
    //   if (strategy_info_id !== 0) {
    //     axios({
    //       method: 'post',
    //       url: 'AIOPS-KNOWLEDGE/edit_crawl_strategy',
    //       data: {
    //         strategy_info_id: strategy_info_id,
    //         action_type: 'delete',
    //         new_value: ''
    //       }
    //     }).then(function (response) {
    //       console.log(response)
    //     })
    //   }
    //   this.edit_data.strategy_info = this.remove_array(index, this.edit_data.strategy_info)
    // },
    // // 新增一条策略
    // add_info: function () {
    //   // 当前info为空时index从0开始
    //   // strategy_info_id 为0的数据为新的数据，需要新增
    //   let index = 0
    //   if (this.edit_data.strategy_info.length !== 0) {
    //     index = this.edit_data.strategy_info[this.edit_data.strategy_info.length - 1].index + 1
    //   }
    //   let new_info = {
    //     index: index,
    //     data_source: ['CSDN'],
    //     major_tag_name: '网络',
    //     minor_tag_names: ['网络层'],
    //     strategy_info_id: 0
    //   }
    //   this.edit_data.strategy_info.push(new_info)
    // },
    // 对于传回来的数据进行一些处理并写入到编辑框内
    format_strategy: function (data) {
      // 将返回的数据进行一定的处理,整理数据后返回 - - 其实也就是加个index
      // 当没有与之相对应的信息时，返回空
      if (data.length === 0) {
        return []
      } else {
        let strategy_info = []
        for (let i = 0; i < data.length; i++) {
          let ele = {
            strategy_info_id: data[i].strategy_info_id,
            data_source: data[i].data_source,
            first_tag: data[i].first_tag,
            second_tag: data[i].second_tag,
            third_tag: data[i].third_tag
          }
          strategy_info.push(ele)
        }
        console.log("strategy_info:",strategy_info)
        return strategy_info
      }
    },
    run_strategy (row, index) {
      // console.log(row)
      let that = this
      // eslint-disable-next-line no-unused-vars
      let strategy_name = row.strategy_name
      // 请求单个策略的详细信息
      axios({
        method: 'get',
        url: 'AIOPS-KNOWLEDGE/get_one_crawl_strategy',
        params: {
          strategy_name: strategy_name
        }
      }).then(function (response) {
        let res_data = response.data
        if (res_data.status_code === 0) {
          // 获取成功则打印获取到的单个策略名称
          that.start_data = {
            strategy_name: strategy_name,
            strategy_info: that.format_strategy(res_data.data)
          }
          // 打开启动框
          that.open_run_strategy = true
        }
      })
    },
    start_strategy: function (name) {
      // eslint-disable-next-line no-redeclare
      let strategy_name = name
      let that = this
      let params = {
        'strategy_name': strategy_name
      }
      // this.get_all_strategy_status().update({ strategy_name: 1 })
      axios({
        method: 'post',
        url: 'AIOPS-CRAWL/do_strategy',
        // data: qs.stringify(params),
        data: params,
        withCredentials: false,
      }).then( function (response) {
        let res_data = response.data
        if (res_data.status_code === 0) {
          that.$Message.success('爬虫' + name + '爬取完毕！')
        }
      })
    },
    get_running_strategy () {
      // 请求数据
      this.request_strategy_status()
      // 设置打开面板
      this.open_running_strategy = true
    },
    set_add_strategy: function () {
      this.open_add_strategy = true
    },
    add_strategy_ok: function () {
      let that = this
      let strategy_name = this.add_data.strategy_name
      let strategy_describe = this.add_data.strategy_describe
      if (strategy_name.length === 0 || strategy_describe.length === 0) {
        this.$Message.error('新增策略信息不能为空！')
      } else {
        axios({
          method: 'post',
          url: 'AIOPS-KNOWLEDGE/create_or_update_strategy',
          data: {
            action_type: 'insert',
            new_value: {
              STRATEGY_NAME: strategy_name,
              STRATEGY_DESCRIBE: strategy_describe
            }
          }
        }).then(function (response) {
          let res_data = response.data
          if (res_data.status_code === 0) { 
            that.$Message.success('新增策略成功!')
            that.insert_empty_strategy(strategy_name)
            that.add_data = {
              strategy_name: '',
              strategy_describe: ''
            }
            that.fresh_table()
          }
        })
      }
    },
    insert_empty_strategy: function (strategy_name) {
      let new_value = {
        "STRATEGY_NAME": strategy_name,
        "DATA_SOURCE": "CSDN",
        "FIRST_TAG": "",
        "SECOND_TAG": "",
        "THIRD_TAG" : ""
      }
      axios({
        method: 'post',
        url: 'AIOPS-KNOWLEDGE/edit_crawl_strategy',
        data: {
          strategy_info_id: '',
          action_type: 'insert',
          new_value: new_value
        }
      }).then(function (response) {
        let res_data = response.data
        if (res_data.status_code === 0) {
          console.log('插入新策略信息成功')
        }
      })
    },
    table_delete: function (row, index) {
      let that = this
      // 根据strategy_name删除
      let strategy_name = row.strategy_name
      // 删除策略
      axios({
        method: 'post',
        url: 'AIOPS-KNOWLEDGE/create_or_update_strategy',
        data: {
          action_type: 'delete',
          new_value: {
            STRATEGY_NAME: strategy_name
          }
        }
      }).then(function (response) {
        let res_data = response.data
        if (res_data.status_code === 0) {
          that.$Message.success('删除策略成功!')
          that.fresh_table()
        }
      })
    },
    export_data: function () {
      window.location.href = 'http://121.89.214.2:8080/AIOPS-CRAWL/download'
    },
    on_edit_knowledge_major_tag: function (value) {
      // console.log("value1", value)
      // this.edit_data.strategy_info[0].second_tag = []
      // this.edit_data.strategy_info[0].third_tag = []
      // this.update_edit_select_tag_data()
      // // 每次进行一级选择之前，将所有数据初始化
      // this.edit_knowledge_data.minor_tags = []
      // this.edit_knowledge_data.third_tags = []
      // // 获取一级标签下的二级标签
      // let data = {
      //   tag_ids: [value]
      // }
      // let that = this
      // axios({
      //   method: 'post',
      //   url: 'AIOPS-KNOWLEDGE/get_child_tags',
      //   data: data
      // }).then( function (res) {
      //   let res_data = res.data
      //   if (res_data.status_code == 0) {
      //     res_data = res_data.data
      //     that.edit_knowledge_select_minor_tag = res_data;
      //   }
      // })
      // console.log(value);
    },
    on_edit_knowledge_minor_tag: function (value) {
      // console.log("value2", value)
      // this.edit_data.strategy_info[0].third_tag = []
      // this.update_edit_select_tag_data()
      return
    }
  },
  // Vue 生命周期函数，创建页面时进入
  created: function () {
    let that = this
    // 获取所有的爬虫策略当前是否运行
    // this.get_all_strategy_status()
    // 请求所有一级标签
    axios({
      method: 'get',
      // url: 'http://120.77.244.102:8080/AIOPS-KNOWLEDGE/get_tags',
      url: 'AIOPS-KNOWLEDGE/get_tags',
      params: {
        tag_type: 1
      }
    }).then(function (response) {
      let res_data = response.data
      if (res_data.status_code === 0) {
        // 当数据正确时,保存数据
        that.select_major_tag_data = res_data.data
        // console.log(that.select_major_tag_data)
      } else {
        that.$Message.error('请求一级标签失败，请刷新页面！')
      }
      // 请求完毕，无论成功与否都关闭页面加载中
      that.spin_flag = false
    })
    // 设置当前页面为 加载中
    this.spin_flag = true
    // 请求所有二级标签
    axios({
      method: 'get',
      url: 'AIOPS-KNOWLEDGE/get_tags',
      params: {
        tag_type: 2
      }
    }).then(function (response) {
      let res_data = response.data
      if (res_data.status_code === 0) {
        // 当数据正确时,保存数据
        that.select_minor_tag_data = res_data.data
        // console.log(that.select_major_tag_data)
      } else {
        that.$Message.error('请求二级标签失败，请刷新页面！')
      }
    })
    this.spin_flag = true
    // 请求所有三级标签
    axios({
      method: 'get',
      url: 'AIOPS-KNOWLEDGE/get_tags',
      params: {
        tag_type: 3
      }
    }).then(function (response) {
      let res_data = response.data
      if (res_data.status_code === 0) {
        // 当数据正确时,保存数据
        that.select_third_tag_data = res_data.data
        // console.log(that.select_major_tag_data)
      } else {
        that.$Message.error('请求三级标签失败，请刷新页面！')
      }
    })
    this.fresh_table()
  }
}
</script>
<style scoped>
.card-title{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 20px;
    font-weight: 600;
}

.margin-space{
    margin-top: 20px;
}
</style>
