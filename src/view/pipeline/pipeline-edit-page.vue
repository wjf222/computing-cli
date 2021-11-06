<template>
  <div>
    <Row :gutter="24" style="margin-top: 14px;" type="flex" justify="start" align="middle" class="item-row">
      <i-col :span="6" v-for="(item, i) in itemData" :key="`item-${i}`" style="margin-top: 14px;">
        <card class="item-card">
          <p slot="title">节点{{ i }}</p>
          <Row type="flex" justify="center" align="middle" class="item-row">
            <Button style="margin: 10px 10px;" type="info" @click="editItemModal({ item })">修改</Button>
          </Row>
        </card>
      </i-col>
      <i-col :span="6" style="margin-top: 14px;">
        <card class="item-card">
          <p slot="title">
            <Icon type="android-stopwatch"></Icon>
            添加新节点
          </p>
          <Row type="flex" justify="center" align="middle" class="item-row">
            <Icon type="android-stopwatch"></Icon>
            <Button style="margin: 10px 10px;" type="success" @click="addItem">添加</Button>
          </Row>
        </card>
      </i-col>
    </Row>
    <Modal width=800 v-model="add" title="修改模组" @on-ok="saveItem" @on-cancel="cancel">
      <Row :gutter="16">
        <i-col span="3" offset="2">
          <p style="font-size: 15px">Name</p>
        </i-col>
        <i-col span="5">
          <Input v-model="modalValue.Name" placeholder="请输入..."></Input>
        </i-col>
        <i-col span="3" offset="2">
          <p style="font-size: 15px">Params</p>
        </i-col>
        <i-col span="5">
          <Input v-model="modalValue.Params" placeholder="请输入..."></Input>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="3" offset="2">
          <p style="font-size: 15px">ImageId</p>
        </i-col>
        <i-col span="5">
          <Select v-model="modalValue.ImageId" @on-change="changeDataType">
            <Option v-for="item in modalValue.type" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </i-col>
        <i-col span="3" offset="2">
          <p style="font-size: 15px">Envs</p>
        </i-col>
        <i-col span="5">
          <Input v-model="modalValue.Envs" placeholder="请输入..."></Input>
        </i-col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-col span="3" offset="2">
          <p style="font-size: 15px">OperatorId</p>
        </i-col>
        <i-col span="5">
          <Select v-model="modalValue.OperatorId" @on-change="changeDataType">
            <Option v-for="item in modalValue.type" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </i-col>
        <i-col span="3" offset="2">
          <p style="font-size: 15px">Arguments</p>
        </i-col>
        <i-col span="5">
          <Input v-model="modalValue.Arguments" placeholder="请输入..."></Input>
        </i-col>
      </Row>
      <br>
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
          <Button type="primary" @click="saveItem">保存</Button>
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
        Name: 'xxx',
        ImageId: 1,
        OperatorId: 1,
        // 可选
        Params: '',
        Arguments: '',
        Envs: '',
        Description: '',
        // 不展示
        ID: 1,
        CreatedAt: '',
        UpdatedAt: '',
        PipelineId: 1,
        Namespace: '',
        Type: '',
        Num: 0,
        BatchNum: 0,
        ResourceId: 0,
        ItemStatus: 0
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
        this.itemData = res.data.data.items
        console.log(res)
      })
    },

    changeDataType (value) {
      // TODO 获取对应值的候选项
    },

    /**
     * 打开modal框，并将数据填写在对应位置
     * @param item
     */
    editItemModal (item) {
      // TODO 展示并允许修改
      // console.log(item)
      console.log(item.item)
      this.testResult = -1
      this.add = true
      this.editOrAdd = true
      this.modalValue.PipelineId = item.item.PipelineId
      this.modalValue.Name = item.item.Name
      this.modalValue.Namespace = item.item.Namespace
      this.modalValue.Type = item.item.Type
      this.modalValue.Num = item.item.Num
      this.modalValue.BatchNum = item.item.BatchNum
      this.modalValue.ImageId = item.item.ImageId
      this.modalValue.OperatorId = item.item.OperatorId
      this.modalValue.ResourceId = item.item.ResourceId
      this.modalValue.ItemStatu = item.item.ItemStatu
      this.modalValue.Params = item.item.Params
      this.modalValue.Arguments = item.item.Arguments
      this.modalValue.Envs = item.item.Envs
      this.modalValue.Description = item.item.Description
      this.modalValue.PipelineName = item.item.PipelineName
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

.item-card {
  display: block;
  height: 200px;
  width: 200px;
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
