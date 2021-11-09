<template>
  <div>
    <Table border :loading="algoLoading" :columns="algoListColumns" :data="algoListData"></Table>
    <Button style="margin: 10px 10px;" type="success" @click="loadAdd">添加</Button>
    <Page :total="totalPage" :current="currentPage" @on-change="loadPage" show-elevator/>
    <Modal
      v-model="algoAddModel"
      title="添加一个算法"
      okText="添加"
      @on-ok="addAlgo">
      <Row>
        <Col span="4">
          算法名：
        </Col>
        <Col span="20">
          <Input v-model="algoNameModel" placeholder="输入算法名" style="width: 400px; margin-bottom: 10px" />
        </Col>
      </Row>
      <Row>
        <Col span="4">
          算法简介：
        </Col>
        <Col span="20">
          <Input v-model="algoIntroModel" show-word-limit type="textarea" placeholder="输入算法简介" style="width: 400px; margin-bottom: 10px" />
        </Col>
      </Row>
      <Row>
        <Col span="4">
          算法参数：
          <ButtonGroup shape="circle" size="small" style="margin-top: 20px">
            <Button icon="md-add" @click="addParams"></Button>
            <Button icon="md-remove" @click="deleteParams"></Button>
          </ButtonGroup>
        </Col>
        <Col span="20">
          <Table border height="200" :columns="algoParamsColumns" :data="algoParamsData" style="width:400px; margin-bottom: 10px"></Table>
        </Col>
      </Row>
    </Modal>
    <Modal
      v-model="algoUpdateModel"
      title="查看/更新算法"
      okText="更新"
      @on-ok="updateAlgo">
      <Row>
        <Col span="4">
          算法ID：
        </Col>
        <Col span="20">
          <Tag style="margin-bottom: 10px">{{algoIdModel}}</Tag>
        </Col>
      </Row>
      <Row>
        <Col span="4">
          算法名：
        </Col>
        <Col span="20">
          <Input v-model="algoNameModel" placeholder="输入算法名" style="width: 400px; margin-bottom: 10px" />
        </Col>
      </Row>
      <Row>
        <Col span="4">
          算法简介：
        </Col>
        <Col span="20">
          <Input v-model="algoIntroModel" show-word-limit type="textarea" placeholder="输入算法简介" style="width: 400px; margin-bottom: 10px" />
        </Col>
      </Row>
      <Row>
        <Col span="4">
          算法参数：
          <ButtonGroup shape="circle" size="small" style="margin-top: 20px">
            <Button icon="md-add" @click="addParams"></Button>
            <Button icon="md-remove" @click="deleteParams"></Button>
          </ButtonGroup>

        </Col>
        <Col span="20">
          <Table border height="200" :columns="algoParamsColumns" :data="algoParamsData" style="width:400px; margin-bottom: 10px"></Table>
        </Col>
      </Row>
      <Row>
        <Col span="4">
          可用：
        </Col>
        <Col span="20">
          <i-switch v-model="algoStatusModel"/>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'meta-config',
  data () {
    return {
      algoIdModel: -1,
      currentPage: 1,
      tablePageSize: 10,
      totalPage: 0,
      currentHistoryJobId: -1,
      algoAddModel: false,
      algoUpdateModel: false,
      algoStatusModel: false,
      algoLoading: true,
      algoNameModel: '',
      algoIntroModel: '',
      algoListData: [],
      algoParamsData: [],
      algoParamBase: {
        'param_name': 'custom',
        'param_value': 'false'
      },
      algoListDataTotal: [],
      algoListColumns: [
        {
          title: '算法ID',
          key: 'algo_id',
          align: 'center',
          width: '80px'
        },
        {
          title: '算法名称',
          key: 'algo_name',
          align: 'center'
        },
        {
          title: '算法简介',
          key: 'algo_intro',
          align: 'center'
        },
        // {
        //   title: '算法参数',
        //   key: 'algo_params',
        //   render: (h, params) => {
        //     return h('pre', {
        //     }, params.row.algo_params)
        //   }
        // },
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
                      content: '<p>确认删除该算法？</p>',
                      onOk: () => {
                        that.deleteAlgo(params.row.algo_id)
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
          key: 'param_name',
          render: (h, params) => {
            let that = this
            return h('Input', {
              props: {
                size: 'small',
                value: params.row.param_name,
                disabled: that.algoParamsData[params.index]['param_name'] === 'custom'
              },
              on: {
                input: (event) => {
                  that.algoParamsData[params.index]['param_name'] = event
                }
              }
            })
          }
        },
        {
          title: '默认值',
          key: 'param_value',
          render: (h, params) => {
            let that = this
            // if (that.algoParamsData[params.index]['param_name'] === 'custom'){
            //   return h('Select', {
            //     props: {
            //       size: 'small',
            //       value: params.row.param_value
            //     },
            //     on: {
            //       input: (event) => {
            //         that.algoParamsData[params.index]['param_value'] = event
            //       }
            //     }
            //   })
            // }
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
      ]
    }
  },
  methods: {
    loadAlgo () {
      let that = this
      that.algoLoading = true
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
          tList.push({
            algo_id: data[t]['algo_id'],
            algo_intro: data[t]['algo_intro'],
            algo_name: data[t]['algo_name'],
            algo_params: JSON.stringify(JSON.parse(unescape(data[t]['algo_params'].replace(/\\/g, '%'))), null, 4),
            usable: data[t]['usable']
          })
        }
        that.algoListDataTotal = tList
        that.totalPage = that.algoListDataTotal.length
        that.loadPage(that.currentPage)
        that.algoLoading = false
      }).catch(function (error) {
        that.$Modal.error({
          title: '错误',
          content: error.data.message
        });
        that.algoLoading = false
      });
    },
    addAlgo () {
      let that = this
      let algo_params = {}
      for (let k in that.algoParamsData) {
        algo_params[that.algoParamsData[k]['param_name']] = that.algoParamsData[k]['param_value']
      }
      let param = {
        algo_intro: that.algoIntroModel,
        algo_name: that.algoNameModel,
        algo_params: algo_params,
        usable: 0
      }
      axios({
        method: 'post',
        url: 'AIOPS-ALGORITHMS/meta/algorithms',
        withCredentials: true,
        data: param
      }).then(function (response) {
        let data = response.data
        that.showMessage(data['code'] === 1, data['message'])
        if (data['code'] === 0) {
          return
        }
        data = data['data']
        that.loadAlgo()
      }).catch(function (error) {
        that.$Modal.error({
          title: '错误',
          content: error.data.message
        });
      });
    },
    updateAlgo () {
      let that = this
      let algo_params = {}
      for (let k in that.algoParamsData) {
        algo_params[that.algoParamsData[k]['param_name']] = that.algoParamsData[k]['param_value']
      }
      let param = {
        algo_id: that.algoIdModel,
        algo_intro: that.algoIntroModel,
        algo_name: that.algoNameModel,
        algo_params: algo_params,
        usable: that.algoStatusModel ? 1 : 0
      }
      axios({
        method: 'post',
        url: 'AIOPS-ALGORITHMS/meta/algorithm',
        withCredentials: true,
        data: param
      }).then(function (response) {
        let data = response.data
        that.showMessage(data['code'] === 1, data['message'])
        if (data['code'] === 0) {
          return
        }
        data = data['data']
        that.loadAlgo()
      }).catch(function (error) {
        that.$Modal.error({
          title: '错误',
          content: error.data.message
        });
      });
    },
    deleteAlgo (algo_id) {
      let that = this
      axios({
        method: 'delete',
        url: 'AIOPS-ALGORITHMS/meta/algorithm',
        withCredentials: true,
        data: {
          algo_id: algo_id
        }
      }).then(function (response) {
        let data = response.data
        that.showMessage(data['code'] === 1, data['message'])
        if (data['code'] === 0) {
          return
        }
        data = data['data']
        that.loadAlgo()
      }).catch(function (error) {
        that.$Modal.error({
          title: '错误',
          content: error.data.message
        });
      });
    },
    addParams () {
      let that = this
      that.algoParamsData.push(
        {
          param_name: 'name',
          param_value: 'value'
        }
      )
    },
    deleteParams () {
      let that = this
      if (that.algoParamsData[that.algoParamsData.length-1]['param_name'] === 'custom') return
      that.algoParamsData.pop()
    },
    loadAdd () {
      let that = this
      that.algoIdModel = -1
      that.algoNameModel = ''
      that.algoIntroModel = ''
      that.algoParamsData = [that.algoParamBase]
      that.algoStatusModel = false
      that.algoAddModel = true
    },
    loadUpdate (index) {
      let that = this
      that.algoIdModel = index.algo_id
      that.algoNameModel = index.algo_name
      that.algoIntroModel = index.algo_intro
      let par = JSON.parse(index.algo_params)
      that.algoStatusModel = index.usable
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
      that.algoUpdateModel = true
    },
    loadPage (page) {
      let that = this
      that.currentPage = page
      that.algoListData = that.algoListDataTotal.slice(that.tablePageSize * (page - 1),
        that.tablePageSize * page)
    },
    showMessage (isSucc, desc) {
      if (isSucc) {
        this.$Notice.success({
          title: '成功',
          desc: desc,
          duration: 10
        })
      } else {
        this.$Notice.error({
          title: '错误',
          desc: desc,
          duration: 10
        })
      }
    }
  },
  mounted () {
    this.loadAlgo()
  }
}
</script>

<style scoped>

</style>
