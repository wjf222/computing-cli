<template>
  <div>
    <Row :gutter="20" style="margin-top: 14px;" type="flex" justify="start" align="middle" class="item-row">
      <i-col :xs="12" :md="8" :lg="8" v-for="(item, i) in itemData" :key="`item-${i}`" style="margin-top: 14px;">
        <card>
          <p slot="title">节点{{ i }}</p>
          <Row type="flex" justify="center" align="middle" class="item-row">
            <Button style="margin: 10px 10px;" type="info" @click="editItemModal">修改</Button>
          </Row>
        </card>
      </i-col>
      <i-col :xs="12" :md="8" :lg="8" style="margin-top: 14px;">
        <Card>
          <p slot="title">
            <Icon type="android-stopwatch"></Icon>
            添加新节点
          </p>
          <Row type="flex" justify="center" align="middle" class="item-row">
            <Icon type="android-stopwatch"></Icon>
            <Button style="margin: 10px 10px;" type="success" @click="addItem">添加</Button>
          </Row>
        </Card>
      </i-col>
    </Row>
    <Modal width=800 v-model="add" title="修改流水线" @on-ok="savePipeline" @on-cancel="cancel">
      <Row :gutter="16">
        <i-col span="4" offset="2">
          <p style="font-size: 15px">名称</p>
        </i-col>
        <i-col span="12">
          <i-input v-model="modalValue.PipelineName" placeholder="请输入..."></i-input>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="4" offset="2">
          <p style="font-size: 15px">命名空间</p>
        </i-col>
        <i-col span="12">
          <i-input v-model="modalValue.PipelineNamespace" placeholder="请输入..."></i-input>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="4" offset="2">
          <p style="font-size: 15px">用户名</p>
        </i-col>
        <i-col span="12">
          <i-input v-model="modalValue.UserName" placeholder="请输入..."></i-input>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="4" offset="2">
          <p style="font-size: 15px">描述</p>
        </i-col>
        <i-col span="12">
          <i-input v-model="modalValue.PipelineDescription" placeholder="请输入..."></i-input>
        </i-col>
      </Row>
      <br>
      <Row slot="footer">
        <i-col span="4" offset="11">
          <Button type="primary" @click="savePipeline">保存</Button>
        </i-col>
        <i-col span="4">
          <Button @click="cancel">取消</Button>
        </i-col>
      </Row>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'pipeline_edit_page',
  components: {},
  data () {
    return {
      // 新增数据源modal
      add: false,
      editOradd: false,
      modalValue: {
        PipelineName: '',
        PipelineNamespace: '',
        UserName: '',
        PipelineDescription: ''
      },
      testResult: -1,

      // 数组
      itemData: [
        { Name: 'x', Namespace: 'xx', ImageId: 1, OperatorId: 1, ObjectDataId: 1, Params: {}, color: '#2d8cf0' },
        { Name: 'x', Namespace: 'xx', ImageId: 1, OperatorId: 1, ObjectDataId: 1, Params: {}, color: '#ff9900' },
        { Name: 'x', Namespace: 'xx', ImageId: 1, OperatorId: 1, ObjectDataId: 1, Params: {}, color: '#ff9900' },
        { Name: 'x', Namespace: 'xx', ImageId: 1, OperatorId: 1, ObjectDataId: 1, Params: {}, color: '#ff9900' },
        { Name: 'x', Namespace: 'xx', ImageId: 1, OperatorId: 1, ObjectDataId: 1, Params: {}, color: '#ff9900' },
        { Name: 'x', Namespace: 'xx', ImageId: 1, OperatorId: 1, ObjectDataId: 1, Params: {}, color: '#ff9900' },
        { Name: 'x', Namespace: 'xx', ImageId: 1, OperatorId: 1, ObjectDataId: 1, Params: {}, color: '#ff9900' }
      ]
    }
  },

  methods: {
    init () {
      this.id = this.$route.params.id
      console.log(this.$route.params.id)
    },

    editItemModal (params) {
      // modal框读取对应数据
      console.log(params)
      this.testResult = -1
      this.add = true
      this.editOradd = true
      this.modalValue.PipelineName = params.row.PipelineName
      this.modalValue.PipelineNamespace = params.row.PipelineNamespace
      this.modalValue.UserName = params.row.userName
      this.modalValue.PipelineDescription = params.row.PipelineDescription
    },

    saveItem () {
      if (this.editOradd) {
        // 待更新
        this.modifyItem()
      } else {
        this.addItem()
      }
    },

    // 添加modal
    cancel () {
      this.add = false
    }, // 确定

    changeDataType (value) {
    },

    getItem (id) {
      /**
       * 返回指定 pipeline 下的所有模组
       *
       * 参数：
       * · id, string
       *
       * 参数格式：
       * · 跟随请求路径
       */
      return axios.request({
        url: '/pipelines/:id/items',
        method: 'get'
      })
    },

    addItem (id) {
      /**
       * 在指定 pipeline 下的创建一组模组
       *
       * 参数：
       * [
       *   {
       *      //必选参数
       *      “Name”: "x",
       *      "Namespace": "xx",
       *      "ImageId": 1,
       *      "OperatorId": 1,
       *      //可选参数
       *      "ObjectDataId": 1,
       *      "Params": {}
       *   }
       * ]
       *
       * 参数格式：
       * · json
       * · 跟随请求路径
       */
      return axios.request({
        url: '/pipelines/:id/items',
        method: 'post'
      })
    },

    modifyItem (id) {
      /**
       * 在指定 pipeline 下的更新一组模组
       *
       * 参数：
       * [
       *   {
       *      //必选参数
       *      “Name”: "x",
       *      "Namespace": "xx",
       *      "ImageId": 1,
       *      "OperatorId": 1,
       *      //可选参数
       *      "ObjectDataId": 1,
       *      "Params": {}
       *   }
       * ]
       *
       * 参数格式：
       * · json
       * · 跟随请求路径
       */
      return axios.request({
        url: '/pipelines/:id/items',
        method: 'patch'
      })
    }
  },

  mounted () {
    this.init()
  }
}
</script>

<style lang="less">
@baseColor: ~"#dc9387";
.item-row {
  height: 200px;
  padding-bottom: 10px;
}

.count-to-con {
  display: block;
  width: 100%;
  text-align: center;
}

.count-text {
  font-size: 50px;
  color: @baseColor;
}

.slot-text {
  font-size: 22px;
}

.unit-class {
  font-size: 30px;
  color: @baseColor;
}
</style>
