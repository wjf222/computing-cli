<template>
<div class="root">
    <Card>
        <Row>
            <Col span="3" style="width: 150px">
                <Select v-model="select_type" clearable placeholder="选择标签类型" @on-change="type_change">
                    <Option v-for="item in tag_type_list" :value="item.value" :key="item.value">{{ item.name }}</Option>
                </Select>
            </Col>
            <Col span="3" style="margin-left: 30px">
                <Select v-model="select_source" clearable placeholder="选择标签来源"  @on-change="source_change">
                    <Option v-for="item in tag_source_list" :value="item.value" :key="item.value">{{ item.name }}</Option>
                </Select>
            </Col>
            <Col span="3" style="margin-left: 30px">
                <Input v-model="search_tag" placeholder="搜索标签" clearable />
            </Col>
            <Col span="2" offset="1">
                <Button type="primary" @click="find_tag">查询</Button>
            </Col>
            <Col span="1"offset="6">
              <Button type="primary" @click="add_tag" >新增标签</Button>
            </Col>
        </Row>
        <br>
        <Table stripe :columns="columns" :data="page_tag_data" :loading=loading>
          <template scope="{ row, index }" slot="tag_type">
            <label v-if="row.tag_type === 1">一级标签</label>
            <label v-if="row.tag_type === 2">二级标签</label>
            <label v-if="row.tag_type === 3">三级标签</label>
          </template>
            <template scope="{ row, index }" slot="action">
                <Button type="primary"   @click="edit_dialog(row,index)" style="width: 75px;">编辑</Button>
                <Button type="error" @click="delete_dialog(row,index)" style="width:75px; margin-left:20px;">删除</Button>
            </template>
        </Table>
        <br>
        <Page :total="data_count" ref="page" :current.sync="page_current" :page-size="page_size" @on-change="change_page" show-elevator />
    </Card>
    <Modal v-model="open_edit_tag" title="编辑标签" @on-ok="edit_ok" >
        <div>
            <Row>
              <Col span="3" offset="6"><label>标签名:</label></Col>
              <Col span="6" offset="2"><Input v-model="edit_tag.edit_tag_name"></Input></Col>
            </Row>
            <br>
            <Row>
              <Col span="3" offset="6"><label>标签类型:</label></Col>
              <Col span="6" offset="2"><Select v-model="edit_tag.edit_tag_type">
                <Option v-for="type in edit_tag_type_list" :value="type.value" :key="type.value">{{ type.name }}</Option>
                </Select></Col>
            </Row>
            <br>
            <Row>
              <Col span="3" offset="6"><label>标签来源:</label></Col>
              <Col span="6" offset="2">
                <Select v-model="edit_tag.edit_tag_source">
                  <Option v-for="type in tag_source_list" :value="type.value" :key="type.value">{{ type.name }}</Option>
                </Select>
              </Col>
            </Row>
        </div>
    </Modal>
    <Modal v-model="open_add_tag" title="新增标签" @on-ok="add_ok">
      <div>
            <Row>
              <Col span="3" offset="6"><label>标签名:</label></Col>
              <Col span="6" offset="2"><Input v-model="add_tag_info.tag_name"></Input></Col>
            </Row>
            <br>
            <Row>
              <Col span="3" offset="6"><label>标签类型:</label></Col>
              <Col span="6" offset="2"><Select v-model="add_tag_info.tag_type">
                <Option v-for="type in edit_tag_type_list" :value="type.value" :key="type.value">{{ type.name }}</Option>
                </Select></Col>
            </Row>
            <br>
            <Row>
              <Col span="3" offset="6"><label>标签来源:</label></Col>
              <Col span="6" offset="2">
                <Select v-model="add_tag_info.tag_source">
                  <Option v-for="type in tag_source_list" :value="type.value" :key="type.value">{{ type.name }}</Option>
                </Select>
              </Col>
            </Row>
        </div>
    </Modal>
</div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import axios from 'axios'
export default {
  name: 'tag-manager',
  data () {
    return {
      // 打开新增标签Modal
      open_add_tag: false,
      // 表格获取数据时有加载动画
      loading: false,
      // 打开编辑对话框
      open_edit_tag: false,
      // select选择的内容：默认为1 主标签
      select_type: '1',
      // 选择标签来源
      select_source: '',
      // 搜索tag的内容
      search_tag: '',
      // 准备删除的tag id
      prepare_delete_tag_id: '',
      // 当前编辑的标签内容
      edit_tag: {
        // id 不可编辑, 仅作查看
        edit_tag_id: '',
        edit_tag_name: '',
        edit_tag_type: '',
        edit_tag_source: ''
      },
      // 新增的标签内容
      add_tag_info: {
        tag_id: '',
        tag_name: '',
        tag_type: '',
        tag_source: ''
      },
      tag_type_list: [
        {
          value: '',
          name: '所有标签'
        },
        {
          value: '1',
          name: '一级标签'
        },
        {
          value: '2',
          name: '二级标签'
        },
        {
          value: '3',
          name: '三级标签'
        }
      ],
      tag_source_list: [
        {
          value: '系统添加',
          name: '系统添加'
        },
        {
          value: '已筛选',
          name: '已筛选'
        }
      ],
      columns: [
        {
          title: '标签id',
          key: 'tag_id',
          minWidth:75,
          maxWidth:150
        },
        {
          title: '标签名',
          key: 'tag_name',
          minWidth:75,
          maxWidth:150
        },
        {
          title: '标签类型',
          slot: 'tag_type',
          align: 'center',
          key: 'tag_type',
          minWidth:75,
          maxWidth:150
        },
        {
          title: '标签来源',
          key: 'tag_source',
          minWidth:75,
          maxWidth:150
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          minWidth: 120
        }
      ],
      // 所有数据
      tag_data: [
        /**
         * {
         *  tag_id: 1,
         *  tag_name: name,
         *  tag_type: 1,
         *  tag_source: 系统添加,
         *  tag_similar: []
         * }
         */
      ],
      // 当前页面展示的数据
      page_tag_data: [],
      // 页面展示的数据总条数
      data_count: 100,
      // 当前展示的页码
      page_current: 1,
      // 一页展示的内容
      page_size: 10,
      // 编辑标签页
      edit_tag_type_list: [
        {
          value: 1,
          name: '一级标签'
        },
        {
          value: 2,
          name: '二级标签'
        },
        {
          value: 3,
          name: '三级标签'
        }
      ]
    }
  },
  methods: {
    // eslint-disable-next-line vue/no-dupe-keys
    edit_dialog: function (row, index) {
      console.log(row)
      // 编辑框内容赋值
      this.edit_tag.edit_tag_id = row.tag_id
      this.edit_tag.edit_tag_name = row.tag_name
      this.edit_tag.edit_tag_type = row.tag_type
      this.edit_tag.edit_tag_source = row.tag_source
      // 打开编辑对话框
      this.open_edit_tag = true
    },
    delete_dialog: function (row, index) {
      // 设定准备删除id
      this.prepare_delete_tag_id = row.tag_id
      // 保存this
      let that = this
      // 提示是否删除
      this.$Modal.confirm({
        title: '警告',
        content: '确定删除吗?',
        // 确认删除的回调函数
        onOk: function () {
        // 创建请求
          axios({
            method: 'post',
            url: 'AIOPS-KNOWLEDGE' + '/edit_tag',
            data: {
              tag_id: that.prepare_delete_tag_id,
              action_type: 'delete'
            }
          }).then(function (response) {
            if (response.data.status_code === 0) {
              that.find_tag()
              that.$Message.success('删除成功')
            }
          })
        },
        onCancel: function () { this.$Message.info('取消删除') }
      })
    },
    edit_ok: function () {
      // 点击确定
      // this.$Message.info('点击了确定')
      // 创建请求参数
      let post_data = {
        tag_id: this.edit_tag.edit_tag_id,
        action_type: 'update',
        new_value: {
          'TAG_NAME': this.edit_tag.edit_tag_name,
          'TAG_TYPE': this.edit_tag.edit_tag_type,
          'TAG_SOURCE': this.edit_tag.edit_tag_source
        }
      }
      // 保存this
      let that = this
      axios({
        method: 'post',
        url: 'AIOPS-KNOWLEDGE' + '/edit_tag' ,
        data: post_data
      }).then(function (response) {
        if (response.data.status_code === 0) {
          that.find_tag()
          that.$Message.success('编辑成功!')
        } else {
          that.$Message.error('编辑失败!')
        }
        console.log(response)
      })
      console.log(this.edit_tag)
    },
    cut_table_data: function (index, size) {
      let start = (index - 1) * size
      let end = index * size
      this.page_tag_data = this.tag_data.slice(start, end)
      
    },
    change_page: function (index) {
      // 切换页码
      this.cut_table_data(index, this.page_size)
    },
    // 重新获取所有数据 ！！ important！
    find_tag: function () {
      // 查看当前选择的标签类型
      let selected_tag_type = this.select_type
      // 查看当前输入的内容
      let input_tag_value = this.search_tag
      // 筛选标签来源
      let select_source = this.select_source
      // 开启模糊匹配
      let open_like = 1
      // 创建请求
      let copy = {
        like_match: open_like
      }
      if (selected_tag_type) {
        copy.tag_type = selected_tag_type
      }
      if (select_source) {
        copy.tag_source = select_source
      }
      // 是否有查询文本
      if (input_tag_value) {
        copy.tag_title = input_tag_value
      }
      let that = this
      this.loading = true
      axios({
        method: 'get',
        url: 'AIOPS-KNOWLEDGE/get_tags',
        params: copy
      }).then(function (response) {
        let res_data = response.data
        if (res_data.status_code === 0) {
          that.tag_data = res_data.data
          that.data_count = res_data.data.length
          // that.cut_table_data(that.page_current, that.page_size)
          that.change_page(1)
          that.loading = false
        }
      })
    },
    // 变更标签类型时触发
    type_change: function (value) {
      this.find_tag()
    },
    // 变更标签来源时触发
    source_change: function (value) {
      this.find_tag()
    },
    // 打开新增标签对话框
    add_tag: function () {
      this.add_tag_info = {
        tag_id: '',
        tag_name: '',
        tag_type: '',
        tag_source: ''
      }
      this.open_add_tag = true
    },
    // 确定新增标签按钮
    add_ok: function () {
      let post_data = {
        action_type: 'insert',
        new_value: {
          'TAG_NAME': this.add_tag_info.tag_name,
          'TAG_TYPE': this.add_tag_info.tag_type,
          'TAG_SOURCE': this.add_tag_info.tag_source
        }
      }
      // 保存this
      let that = this
      axios({
        method: 'post',
        url: 'AIOPS-KNOWLEDGE' + '/edit_tag' ,
        data: post_data
      }).then(function (response) {
        if (response.data.status_code === 0) {
          that.find_tag()
          that.$Message.success('添加标签成功!')
        } else {
          that.$Message.error('添加标签失败!')
        }
        // console.log(response)
      })
      // console.log(this.add_tag_info)
    }
  },
  created: function () {
    // 表格数据加载中
    this.loading = true
    // 保存this指针
    let that = this
    // 默认请求主标签，即tag_type=1
    axios({
      method: 'get',
      url: 'AIOPS-KNOWLEDGE/get_tags',
      params: {
        tag_type: 1,
        new_value: ''
      }
    }).then(function (response) {
      let res_data = response.data
      // 如果展示获取到了数据
      if (res_data.status_code === 0) {
        // 数据赋值
        that.tag_data = res_data.data
        // 获取数据总数
        that.data_count = that.tag_data.length
        // 设置初始页面
        that.page_current = 1
        // 设置页面大小
        that.page_size = 10
        // 剪裁数据
        that.cut_table_data(that.page_current, that.page_size)
        that.loading = false
      }
    })
  }
}
</script>
<style lang="stylus" scoped>

</style>