<template>
  <div>
    省份：
    <Select v-model="province" style="width:200px" @on-change="loadMeta('province')">
      <Option v-for="item in provinceList" :value="item" :key="item">{{ item }}</Option>
    </Select>
    系统模块：
    <Select v-model="parent_type" style="width:200px" @on-change="loadMeta('parent_type')">
      <Option v-for="item in parentTypeList" :value="item" :key="item">{{ item }}</Option>
    </Select>
    模型层次：
    <Select v-model="child_type" style="width:200px" @on-change="loadMeta('child_type')">
      <Option v-for="item in childTypeList" :value="item" :key="item">{{ item }}</Option>
    </Select>
    场景：
    <Select v-model="scene" style="width:200px" @on-change="loadData">
      <Option v-for="item in sceneList" :value="item" :key="item">{{ item }}</Option>
    </Select>
    <br>
    <br>
    <br>
    <Table :columns="columns" :data="stateList"></Table>
  </div>

</template>

<script>
import axios from 'axios'
import echarts from 'echarts'

export default {
  data () {
    return {
      parent_type: '',
      child_type: '',
      province: '',
      scene: '',
      ip: '',
      state: '',
      parentTypeList: [],
      childTypeList: [],
      provinceList: [],
      sceneList: [],
      ipList: [],
      stateList: [],
      columns: [
        {
          title: '省份',
          key: 'province'
        },
        {
          title: '系统模块',
          key: 'parent_type'
        },
        {
          title: '模型层次',
          key: 'child_type'
        },
        {
          title: '场景',
          key: 'scene'
        },
        {
          title: 'IP',
          key: 'ip'
        },
        {
          title: '状态',
          key: 'status'
        }
      ]
    }
  },
  methods: {
    loadMeta(location) {
      let that = this
      switch (location) {
        case 'province':
          that.parentTypeList = []
          that.childTypeList = []
          that.sceneList = []
          that.ipList = []
          that.stateList = []
          that.parent_type = ''
          that.child_type = ''
          that.scene = ''
          that.ip = ''
          that.state = ''
          break
        case 'parent_type':
          that.childTypeList = []
          that.sceneList = []
          that.ipList = []
          that.stateList = []
          that.child_type = ''
          that.scene = ''
          that.ip = ''
          that.state = ''
          break
        case 'child_type':
          that.sceneList = []
          that.ipList = []
          that.stateList = []
          that.scene = ''
          that.ip = ''
          that.state = ''
          break
        case 'scene':
          that.ipList = []
          that.stateList = []
          that.ip = ''
          that.state = ''
          break
        case 'ip':
          that.stateList = []
          that.state = ''
      }
      let param = {
        parent_type: that.parent_type === ''?null:that.parent_type,
        child_type: that.child_type === ''?null:that.child_type,
        province: that.province === ''?null:that.province,
        scene: that.scene === ''?null:that.scene,
        ip: that.ip === ''?null:that.ip,
      }
      console.log(param)
      axios({
        method: 'get',
        url: 'AIOPS-ALGORITHMS/service/cluster/meta',
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
          case 'state':
            that.stateList = data['data']
            break
        }
      })
    },
    loadData: function () {
      let that = this
      if (that.parent_type !== '' && that.child_type !== ''
        && that.province !== '' && that.scene !== ''){
        let param = {
          parent_type: that.parent_type,
          child_type: that.child_type,
          province: that.province,
          scene: that.scene,
        }
        console.log(param)
        axios({
          method: 'get',
          url: 'AIOPS-ALGORITHMS/service/cluster/data',
          withCredentials: true,
          params: param
        }).then(function (response) {
          let data = response.data
          console.log(data)
          if (data['code'] === 0) {
            return
          }
          that.stateList = data['data']
        })
      } else {

      }
    }
  },
  mounted () {
    this.loadMeta()
    this.chartLine = echarts.init(document.getElementById('chartLineBox'));
  }
}
</script>

<style scoped>

</style>
