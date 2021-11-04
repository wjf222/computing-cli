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
    <Modal width=800 v-model="add" title="修改模组" @on-ok="saveItem" @on-cancel="cancel">
      <Row :gutter="16">
        <i-col span="3" offset="2">
          <p style="font-size: 15px">Name</p>
        </i-col>
        <i-col span="5">
          <Input v-model="modalValue.dataSourceName" placeholder="请输入..."></Input>
        </i-col>
        <i-col span="3" offset="2">
          <p style="font-size: 15px">NameSpace</p>
        </i-col>
        <i-col span="5">
          <Select v-model="modalValue.selectedType" @on-change="changeDataType">
            <Option v-for="item in modalValue.type" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="3" offset="2">
          <p style="font-size: 15px">Tag</p>
        </i-col>
        <i-col span="5">
          <Input v-model="modalValue.ip" placeholder="请输入..."></Input>
        </i-col>
        <i-col span="3" offset="2">
          <p style="font-size: 15px">MainClass</p>
        </i-col>
        <i-col span="5">
          <Input v-model="modalValue.port" placeholder="请输入..."></Input>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="3" offset="2">
          <p style="font-size: 15px">RunTimeType</p>
        </i-col>
        <i-col span="5">
          <Input v-model="modalValue.userName" placeholder="请输入..."></Input>
        </i-col>
        <i-col span="3" offset="2">
          <p style="font-size: 15px">Description</p>
        </i-col>
        <i-col span="5">
          <Input type="password" v-model="modalValue.password" placeholder="请输入..."></Input>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="3" offset="2">
          <p style="font-size: 15px">CreateTime</p>
        </i-col>
        <i-col span="5">
          <Date-picker type="date" placeholder="选择日期" v-model="modalValue.dataBaseName" ></Date-picker>
        </i-col>
        <i-col span="3" offset="2">
          <p style="font-size: 15px">上传文件</p>
        </i-col>
        <i-col span="5">
          <Upload action="//jsonplaceholder.typicode.com/posts/">
            <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
          </Upload>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="3" offset="2">
          <p style="font-size: 15px">描述</p>
        </i-col>
        <i-col span="13">
          <Input v-model="modalValue.Description" placeholder="请输入..."></Input>
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
import { getItem } from '@/api/pipeline'

export default {
  name: 'pipeline_edit_page',
  components: {},
  data () {
    return {
      // 新增数据源modal
      add: false,
      editOrAdd: false,
      modalValue: {
        // 必选
        Name: '',
        ImageId: 1,
        OperatorId: 1,
        // 可选
        Params: '',
        Arguments: '',
        Envs: '',
        Description: ''
      },
      testResult: -1,

      // 数组
      itemData: [
        {
          ID: 1,
          CreatedAt: '',
          UpdatedAt: '',
          PipelineId: 1,
          Name: '',
          Namespace: '',
          Type: '',
          Num: 0,
          BatchNum: 0,
          ImageId: 1,
          OperatorId: 1,
          ResourceId: 0,
          ItemStatus: 0,
          Params: '',
          Arguments: '',
          Envs: '',
          Description: ''
        }
      ]
    }
  },

  methods: {
    init () {
      this.id = this.$route.params.id
      getItem(this.id).then(res => {
        console.log(res)
      })
    },

    changeDataType (value) {
      // TODO 获取对应值的候选项
    },

    /**
     * 打开modal框，并将数据填写在对应位置
     * @param params
     */
    editItemModal (params) {
      // TODO 展示并允许修改
      console.log(params)
      this.testResult = -1
      this.add = true
      this.editOrAdd = true
      this.modalValue.PipelineName = params.row.PipelineName
      this.modalValue.PipelineNamespace = params.row.PipelineNamespace
      this.modalValue.UserName = params.row.userName
      this.modalValue.PipelineDescription = params.row.PipelineDescription
    },

    saveItem () {
      if (this.editOrAdd) {
        // 待更新
        this.modifyItem()
      } else {
        this.addItem()
      }
    },

    /**
     * 关闭modal框
     */
    cancel () {
      this.add = false
    },

    /**
     * 添加item
     * @param id
     * @returns {*}
     */
    addItem (id) {
      // TODO 添加item
    },

    /**
     * 编辑item
     * @param id
     * @returns {*}
     */
    modifyItem (id) {
      // TODO 编辑item
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
