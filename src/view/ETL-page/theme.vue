<template>
<div>
  <Card>
    <Icon type="md-analytics" size="32" />
    <Input placeholder="搜索主题" style="width: auto; margin: 10px 10px;" v-model="inputTheme" :search=true @on-search="searchTheme">
    <Icon type="ios-search" slot="suffix" />
    </Input>
    <Button style="margin: 10px 10px;" type="primary" @click="searchTheme">搜索</Button>
    <Button style="margin: 10px 10px;" type="success" @click="addTheme">添加</Button>
    <Button style="margin: 10px 10px;" type="warning" @click="editTheme">修改</Button>
    <Button style="margin: 10px 10px;" type="error" @click="deleteTheme">删除</Button>
<!--    <Icon type="md-analytics" size="32" />-->
    <tables stripe :loading="loading" ref="tables" v-model="nowData" :columns="columns" @on-selection-change="selectTheme" />
    <!-- <Button style="margin: 10px 10px;" type="error" @click="testfunc">测试</Button> -->
    <Page :total="dataCount" ref="page" :current.sync="pageCurrent" :page-size="pageSize" @on-change="changepage" show-elevator />
  </Card>
  <Modal v-model="modalA" title="新增主题" @on-ok="saveTheme" @on-cancel="cancel">
    <Row :gutter="16">
      <i-col span="5" offset="4">
        <p style="font-size: 18px">主题名称</p>
      </i-col>
      <i-col span="10">
        <i-Input v-model="addThemeName" placeholder="请输入..."></i-Input>
      </i-col>
    </Row>
    <Row :gutter="16">

    </Row>
    <Row :gutter="16">
      <i-col span="24" offset="1">
        <Transfer :data="undistributeStr" :target-keys="targetKeys" :render-format="render1" @on-change="handleChange1"></Transfer>
      </i-col>
    </Row>
    <Row slot="footer">
      <i-col span="4" offset="11">
        <Button type="primary" @click="saveTheme">保存</Button>
      </i-col>
      <i-col span="4">
        <Button @click="cancel">取消</Button>
      </i-col>
    </Row>
  </Modal>
  <Modal v-model="modalE" title="修改主题" @on-ok="updateTheme" @on-cancel="cancel">
    <Row :gutter="16">
      <i-col span="5" offset="4">
        <p style="font-size: 18px">主题名称</p>
      </i-col>
      <i-col span="10">
        <i-Input v-model="editThemeName" placeholder="请输入..."></i-Input>
      </i-col>
    </Row>
    <Row :gutter="16">

    </Row>
    <Row :gutter="16">
      <i-col span="24" offset="1">
        <Transfer :data="allEtlStr" :target-keys="themeTargetKeys" :render-format="render1" @on-change="handleChange2"></Transfer>
      </i-col>
    </Row>
    <Row slot="footer">
      <i-col span="4" offset="11">
        <Button type="primary" @click="updateTheme">保存</Button>
      </i-col>
      <i-col span="4">
        <Button @click="cancel">取消</Button>
      </i-col>
    </Row>
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
      // 修改或者新增数据源modal
      modalA: false,
      editThemeName: '',
      modalE: false,
      addThemeName: '',
      // undistributeStr:this.queryUndistributedStrategy(),
      undistributeStr: [],
      targetKeys: [],
      thisThemeStrategy: [],
      undistributeStrategy: [],
      // 修改主题时候对应的主题策略加未分布策略
      allEtlStr: [],
      themeTargetKeys: [],
      // 分页
      dataCount: 10,
      pageSize: 10,
      pageCurrent: 2,
      nowData: [],
      // 主题搜索
      inputTheme: '',
      // 多选删除
      selecteThemeId: [],
      themeSelection: [],
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
      //   title: '主题id',
      //   key: 'id',
      //   sortable: true
      // },
      {
        title: '主题名称',
        key: 'themename',
        sortable: true
      },
      {
        title: 'ETL策略数量',
        key: 'strategyCount'
      },
      {
        title: '查看详情',
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
                marginRight: '20px'
              },
              on: {
                click: () => {
                  this.themeDetail(params)
                }
              }
            }, '查看详情')

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
      // //可以使用promise来解决同步
      // let qudfunc=this.queryUndistributedStrategy();
      // let qdfunc=this.getDistributedStrategy();
      // Promise.all([qudfunc,qdfunc]).then(res =>{
      //   // alert(this.undistributeStr.length)
      //   console.log(this.undistributeStrategy);
      //   console.log(this.thisThemeStrategy);
      // alert(this.GLOBAL.etlUrl)
      // var that=this;
      // axios({
      //   method: 'post',
      //   url: this.GLOBAL.etlUrl+"theme/queryThemes",
      //   withCredentials:true,
      //   params: {
      //     loginName:"superadmin",
      //     //把分页做到这里来，稍后再更改
      //     startNum:"0",
      //     endNum:"9999"
      //   },
      // }).then(function(response) {
      //       // console.log(response.data.datasources.length)
      //       // var resdata=JSON.parse(crypto.decrypt(response.data))
      //       // console.log(response.data)
      //       var resdata=response.data.resultList
      //       alert(resdata.length)
      //       console.log(resdata);
      //     });
    },
    // 修改主题
    editTheme () {
      var that = this
      if (that.selecteThemeId.toString() == '') {
        that.$Modal.info({
          title: '错误',
          content: '未选择主题'
        })
      } else if (that.selecteThemeId.length > 1) {
        that.$Modal.info({
          title: '错误',
          content: '只能选择一个主题进行修改。'
        })
      } else {
        that.modalE = true
        // 这里需要一个延时器处理回调。直接赋值会是空值，考虑写到getDistributedStrategy回调里面去
        // 清空之前的操作
        that.allEtlStr = []
        that.themeTargetKeys = []
        // 获取主题名称来进行赋值
        that.editThemeName = this.themeSelection[0].themename
        // 通过在回调里调用解决延时问题，但是出现了偶尔加载不出来主题已有策略的Bug。
        // 也可以使用promise解决，这里已经改写下面两个方法进行规避
        // this.queryUndistributedStrategy();
        // this.getDistributedStrategy();
        // var allthemedata=[];
        //* **********************promise方法
        // 可以使用promise来解决同步
        const qudfunc = that.queryUndistributedStrategy()
        const qdfunc = that.getDistributedStrategy()
        Promise.all([qudfunc, qdfunc]).then(res => {
          // alert(this.undistributeStr.length)
          // console.log(that.undistributeStrategy)
          // console.log(that.thisThemeStrategy)
          for (const item of that.undistributeStrategy) {
            that.allEtlStr.push({
              key: item.id.toString(),
              label: item.strategyname
            })
          };
          for (const item of that.thisThemeStrategy) {
            that.allEtlStr.push({
              key: item.id.toString(),
              label: item.strategyname
            })
          };
          // themeTargetKeys
          for (const item of that.thisThemeStrategy) {
            that.themeTargetKeys.push(item.id.toString())
          };
        })
      }
    },
    // 保存修改
    updateTheme () {
      if (this.editThemeName == '') {
        this.$Modal.info({
          title: '错误',
          content: '主题名不能为空'
        })
      } else {
        var that = this
        const param = {
          loginName: 'superadmin',
          addThemeName: this.editThemeName,
          themeId: this.selecteThemeId.toString(),
          Ids: this.themeTargetKeys
        }
        // console.log(param)
        // alert(param.loginname);
        axios({
          method: 'post',
          url: that.GLOBAL.etlUrl + 'theme/updateTheme',
          withCredentials: true,
          params: param
        }).then(function (response) {
          const data1 = response.data
          // console.log(response.data)
          // alert(data.data['status']);
          if (data1.status == 0) {
            that.modalE = false
            that.$Modal.success({
              title: '成功',
              content: '更新主题成功！'
            })
            // 重新加载数据源
            that.getETLThemedata()
            that.freshpage()
          } else {
            that.$Modal.error({
              title: '失败',
              content: '服务器端出错，请检查！'
            })
          }
        })
      }
    },
    // 取消modal
    cancel () {
      this.modalA = false
      this.modalE = false
    }, // 确定
    render1 (item) {
      return item.label
    },
    handleChange1 (newTargetKeys, direction, moveKeys) {
      // console.log(newTargetKeys)
      // console.log(direction);
      // console.log(moveKeys);
      this.targetKeys = newTargetKeys
    },
    handleChange2 (newTargetKeys, direction, moveKeys) {
      // console.log(newTargetKeys)
      // console.log(direction);
      // console.log(moveKeys);
      this.themeTargetKeys = newTargetKeys
    },

    // 尝试使用promise解决异步问题
    queryUndistributedStrategy () {
      var that = this
      return new Promise(function (resolve, reject) {
        axios({
          method: 'post',
          url: that.GLOBAL.etlUrl + 'theme/queryUndistributedStrategy',
          withCredentials: true,
          params: {
            loginName: 'superadmin'
          }
        }).then(function (response) {
          const data1 = response.data
          if (data1.status == 0) {
            // return data1.resultList;
            that.undistributeStrategy = data1.resultList
            // console.log(data1.resultList)
            // alert(data1.resultList.length)
            // return data1.resultList;
            resolve(data1.resultList)
          } else {
            that.$Modal.error({
              title: '失败',
              content: '服务器端出错，请检查！'
            })
          }
        })
      })
    },
    getDistributedStrategy () {
      var that = this
      return new Promise(function (resolve, reject) {
        axios({
          method: 'post',
          url: that.GLOBAL.etlUrl + 'theme/getDistributedStrategy',
          withCredentials: true,
          params: {
            loginName: 'superadmin',
            id: that.selecteThemeId[0]
          }
        }).then(function (response) {
          const data1 = response.data
          if (data1.status == 0) {
            that.thisThemeStrategy = data1.resultList
            // console.log(data1)
            resolve(data1.resultList)
            if (data1.resultList != null) {
              // alert("dis获取正常")
            }
          } else {
            that.$Modal.error({
              title: '失败',
              content: '服务器端出错，请检查！'
            })
          }
        })
      })
    },
    // 添加主题
    saveTheme () {
      var that = this
      var el = this.targetKeys
      var atn = this.addThemeName
      // console.log(atn)
      axios({
        method: 'post',
        url: that.GLOBAL.etlUrl + 'theme/saveTheme',
        withCredentials: true,
        params: {
          addThemeName: atn,
          Ids: el
        }
      }).then(function (response) {
        const data1 = response.data
        // console.log(response.data)
        // alert(data.data['status']);
        if (data1.status == 0) {
          that.$Modal.success({
            title: '添加成功',
            content: '主题已经成功添加！'
          })
          that.modalA = false
          // 重新加载数据源
          that.getETLThemedata()
          that.freshpage()
        } else {
          that.$Modal.error({
            title: '失败',
            content: '服务器端出错，请检查！'
          })
        }
      })
    },
    // 主题搜索功能
    searchTheme () {
      var that = this
      var it = this.inputTheme
      var transTableData = []
      axios({
        method: 'post',
        url: that.GLOBAL.etlUrl + 'theme/queryThemes',
        withCredentials: true,
        params: {
          loginName: 'superadmin',
          // 规避分页缺陷
          startNum: '0',
          // 两种思路第一种是把分页做到这里，第二种是通过查询总数与9999对比预警单次数据过大
          // 如果需要改进，将再mount钩子函数调用获取策略总数，再使用searchetl完成
          endNum: '9999',
          themeName: it
        }
      }).then(function (response) {
        // console.log(response.data.datasources.length)
        // var resdata=JSON.parse(crypto.decrypt(response.data))
        // console.log(response.data)
        var resdata = response.data.resultList
        that.tableData = resdata
        // console.log(transTableData)
        that.loading = false
        that.dataCount = resdata.length
        // that.nowData=response.data.datasources.slice(0,10)
        that.freshpage(that.pageCurrent)
      })
    },
    themeDetail (params) {
      // console.log(params.row)
      this.$router.push({
        name: '策略管理',
        params: {
          id: params.row.id
        }
      })
    },
    // 添加主题功能
    addTheme () {
      this.modalA = true
      this.addThemeName = ''
      const qudfunc = this.queryUndistributedStrategy()
      Promise.all([qudfunc]).then(res => {
        // this.undistributeStr=
        for (const item of res[0]) {
          this.undistributeStr.push({
            key: item.id.toString(),
            label: item.strategyname
          })
        };
        // console.log(res)
      })
      this.queryUndistributedStrategy()
      this.targetKeys = []
    },
    selectTheme (selection) {
      // alert(selection.length)
      // console.log(selection);
      this.themeSelection = selection
      this.selecteThemeId = []
      for (const item of selection) {
        this.selecteThemeId.push(item.id)
      }
      // alert( this.selecteThemeId.toString())
    },
    deleteTheme () {
      const that = this
      if (this.selecteThemeId.toString() == '') {
        that.$Modal.info({
          title: '错误',
          content: '未选择主题'
        })
      } else if (this.selecteThemeId.toString() != '') {
        const param = {
          idsString: this.selecteThemeId.toString()
        }
        // alert(param.loginname);
        axios({
          method: 'post',
          url: this.GLOBAL.etlUrl + 'theme/deleteTheme',
          withCredentials: true,
          params: param
        }).then(function (response) {
          const data1 = response.data
          // console.log(response.data)
          // alert(data.data['status']);
          if (data1.status == 0) {
            that.$Modal.success({
              title: '成功',
              content: '删除主题成功！'
            })
            // 重新加载数据源
            that.getETLThemedata()
            that.freshpage()
          } else {
            that.$Modal.error({
              title: '失败',
              content: '服务器端出错，请检查！'
            })
          }
        })
      }
    },
    getETLThemedata () {
      var that = this
      var transTableData = []
      axios({
        method: 'post',
        url: this.GLOBAL.etlUrl + 'theme/queryThemes',
        withCredentials: true,
        params: {
          loginName: 'superadmin',
          // 把分页做到这里来，稍后再更改
          startNum: '0',
          endNum: '9999'
        }
      }).then(function (response) {
        // console.log(response.data.datasources.length)
        // var resdata=JSON.parse(crypto.decrypt(response.data))
        // console.log(response.data)
        var resdata = response.data.resultList
        that.tableData = resdata
        // console.log(resdata)
        that.loading = false
        that.dataCount = resdata.length
        // that.nowData=response.data.datasources.slice(0,10)
        that.freshpage()
      })
    },
    // 当有数据更新刷新页面
    freshpage () {
      // 考虑把pageCurrent变为0整页删除bug
      this.pageCurrent = 1
      this.changepage(this.pageCurrent)
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
      // 储存当前页
      this.pageCurrent = index
    }

  },
  mounted () {
    this.getETLThemedata()
    // this.testfunc()
  }
}
</script>

<style>

</style>
