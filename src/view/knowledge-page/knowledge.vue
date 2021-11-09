<template>
  <div class="root">
    <Card>
      <!-- 筛选栏部分 -->
      <Row>
        <Col span="3">
          <Select v-model="bind_major_tag" placeholder='选择一级标签' @on-change="on_major_tag_change" filterable clearable>
            <Option v-for="item in select_major_tag_data" :value="item.tag_name" :key="item.tag_id">{{item.tag_name}}</Option>
          </Select>
        </Col>
        <Col span="3" offset="1">
          <Select v-model="bind_minor_tag" placeholder='选择二级标签' filterable multiple @on-change="on_minor_tag_change" >
            <Option v-for="item in select_minor_tag_data" :value="item.tag_name" :key="item.tag_id">{{item.tag_name}}</Option>
          </Select>
        </Col>
        <Col span="3" offset="1">
          <Select v-model="bind_third_tag" placeholder='选择三级标签' filterable multiple @on-change="on_third_tag_change" >
            <Option v-for="item in select_third_tag_data" :value="item.tag_name" :key="item.tag_id">{{item.tag_name}}</Option>
          </Select>
        </Col>
        <Col span="3" offset="1">
          <Input placeholder="模糊搜索" v-model="bind_search"></Input>
        </Col>
        <Col span="2" offset="1">
          <Button type="primary" @click="search_knowledge">搜索</Button>
        </Col>
        <Col span="2" offset="1">
          <Button type="primary" @click="add_knowledge_dialog">手动新增</Button>
        </Col>
      </Row>
      <br>
    <!-- 表格部分 -->
      <Table :loading="loading" stripe :data="page_table_data" :columns="table_columns">
        <template scope="{row, index}" slot="major_tag">
          <label>{{row.major_tag.tag_name}}</label>
        </template>
        <template scope="{row, index}" slot="secondary_tag">
          <label v-for="tag_index in row.secondary_tag" style="margin-right:10px">{{tag_index.tag_name}}</label>
        </template>
        <template scope="{row, index}" slot="third_tag">
          <label v-for="tag_index in row.third_tag" style="margin-right:10px">{{tag_index.tag_name}}</label>
        </template>
        <template scope="{ row, index }" slot="action">
          <Button type="primary"   @click="edit_dialog(row,index)" style="width: 75px;">编辑</Button>
          <Button type="error" @click="delete_dialog(row, index)" style="width:75px; margin-left:20px;">删除</Button>
        </template>
        <!-- <template scope="{ row, index}" slot="flag">
          <label v-if="row.knowledge_flag === 0">未筛选</label>
          <label v-if="row.knowledge_flag === 1">已筛选</label>
        </template> -->
      </Table>
      <br>
      <Page :total="data_count" ref="page" :current.sync="page_current" :page-size="page_size"  @on-change="change_page"   show-elevator show-total />
      <br>
      数据库共有 {{ cnt }} 条数据
    </Card>
    <Spin fix v-if="spin_flag">
      <div class="loader">
          <svg class="circular" viewBox="25 25 50 50">
              <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
          </svg>
      </div>
  </Spin>
  <Modal v-model="open_edit_knowledge" title="知识点编辑" @on-ok="edit_ok"  width="700" scrollable>
        <div>
            <Row class="knowledge_info">
              <Col span="4"><label>知识点标题</label></Col>
              <Col span="12" offset="2"><Input v-model="edit_knowledge_data.knowledge_title" size="large"></Input></Col>
            </Row>
            <br>
            <Row class="knowledge_info">
              <Col span="4" ><label>是否筛选</label></Col>
              <Col span="12" offset="2"><Select v-model="edit_knowledge_data.knowledge_flag">
                <Option v-for="item in edit_select_type_list" :value="item.value" :key="item.value">{{item.name}}</Option>
                </Select></Col>
            </Row>
            <br>
            <Row class="knowledge_info">
              <Col span="4" ><label>一级标签</label></Col>
              <Col span="12" offset="2"><Select v-model="edit_knowledge_data.major_tag.tag_id">
                <Option v-for="item in select_major_tag_data" :value="item.tag_id" :key="item.tag_id">{{item.tag_name}}</Option>
                </Select></Col>
            </Row>
            <br>
            <Row class="knowledge_info">
              <Col span="4" ><label>二级标签</label> </Col>   
              <Col span="12" offset="2"><Select v-model="edit_knowledge_data.minor_tags"  multiple filterable>
                <Option v-for="item in select_minor_tag_data" :value="item.tag_id" :key="item.tag_id">{{item.tag_name}}</Option>
                </Select></Col>
            </Row>
            <br>
            <Row class="knowledge_info">
              <Col span="4" ><label>三级标签</label> </Col>   
              <Col span="12" offset="2"><Select v-model="edit_knowledge_data.third_tags"  multiple filterable>
                <Option v-for="item in select_third_tag_data" :value="item.tag_id" :key="item.tag_id">{{item.tag_name}}</Option>
                </Select></Col>
            </Row>
            <br>
            <!-- <Row class="knowledge_info">
              <Col span="3" ><label>知识点内容</label></Col>
            </Row>
            <br> -->
            <Row  class="knowledge_info">
              <Col span="6" ><Input type="textarea" v-model="edit_knowledge_data.knowledge_text"  :autosize="{minRows:6,maxRows:20}" style="width:670px"></Input></Col>
            </Row>
        </div>
    </Modal>
    <Modal v-model="open_add_knowledge" title="新增知识点" @on-ok="add_ok" fullscreen >
        <div>
            <Row>
              <Col span="4"><label>知识点标题</label></Col>
              <Col span="12" offset="2"><Input v-model="add_knowledge_data.knowledge_title"></Input></Col>
            </Row>
            <br>
            <Row>
              <Col span="4" ><label>是否筛选</label></Col>
              <Col span="12" offset="2"><Select v-model="add_knowledge_data.knowledge_flag">
                <Option v-for="item in edit_select_type_list" :value="item.value" :key="item.value">{{item.name}}</Option>
                </Select></Col>
            </Row>
            <br>
            <Row>
              <Col span="4" ><label>一级标签</label></Col>
              <Col span="12" offset="2">
                <Select v-model="add_knowledge_data.major_tag">
                  <Option v-for="item in select_major_tag_data" :value="item.tag_id" :key="item.tag_id">{{item.tag_name}}</Option>
                </Select>
              </Col>
            </Row>
            <br>
            <Row>
              <Col span="4" ><label>二级标签</label> </Col> 
              <Col span="12" offset="2">
                <Select v-model="add_knowledge_data.minor_tags" multiple>
                  <Option v-for="item in select_minor_tag_data" :value="item.tag_id" :key="item.tag_id">{{item.tag_name}}</Option>
                </Select>
              </Col>
            </Row>
            <br>
            <Row>
              <Col span="4"><label>三级标签</label></Col> 
              <Col span="12" offset="2">
                <Select v-model="add_knowledge_data.third_tags" multiple>
                  <Option v-for="item in select_third_tag_data" :value="item.tag_id" :key="item.tag_id">{{item.tag_name}}</Option>
                </Select>
              </Col>
            </Row>
            <br>
            <Row>
              <Col span="18" ><Input type="textarea" v-model="add_knowledge_data.knowledge_text"  :autosize="{minRows:6,maxRows:20}"></Input></Col>
            </Row>
        </div>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'knowledge',
  data () {
    return {
      // 打开编辑知识点框架
      open_edit_knowledge: false,
      // 打开增加知识点表格
      open_add_knowledge: false,
      // 打开上传文件对话框
      upload_file_flag: false,
      // 表格加载中
      loading: false,
      // 页面加载中
      spin_flag: false,
      // table 标题
      table_columns: [
        {
          title: '知识点id',
          key: 'knowledge_id',
          minWidth: 100,
          maxWidth: 150 
        },
        {
          title: '知识点名',
          key: 'knowledge_name'
        },
        {
          title: '一级标签',
          slot: 'major_tag',
          key: 'major_tag',
          maxWidth: 150,
          minWidth:100
        },
        {
          title: '二级标签',
          slot: 'secondary_tag',
          key: 'secondary_tag',
          maxWidth: 150,
          minWidth:100
        },
        {
          title: '三级标签',
          slot: 'third_tag',
          key: 'third_tag',
          maxWidth: 150,
          minWidth:100
        },
        {
          title: '操作',
          key: 'action',
          slot: 'action',
          align: 'center'
        }
      ],
      // 表格数据 - 示例 , 一般在created里面获取
      table_data: [
        {
          knowledge_id: '1',
          knowledge_name: '知识点1',
          major_tag: 'linux',
          secondary_tag: '[命令,文件管理]',
          third_tag:'[]',
          knowledge_flag: '0'
        }
      ],
      // 当前页展示的表格数据
      page_table_data: [],
      // 一级标签
      bind_major_tag: '',
      // 二级标签
      bind_minor_tag: [],
      // 三级标签
      bind_third_tag: [],
      // 搜索绑定
      bind_search: '',
      // 是否筛选绑定,
      bind_flag: '',
      // 一级标签Select数据
      select_major_tag_data: [],
      // 二级标签Select数据
      select_minor_tag_data: [],
      // 三级标签Select数据
      select_third_tag_data: [],
      // page_size
      page_size: 10,
      // 当前聚焦页
      page_current: 1,
      // 展示数据的条数
      data_count: 0,
      // 当前数据库中知识点的总条目
      cnt : 0,
      // 保存编辑前的知识点数据
      save_edit_knowledge_data:{
        knowledge_id: '',
        knowledge_title: '',
        knowledge_text: '',
        knowledge_flag: '',
        major_tag: '',
        minor_tags: [],
        third_tags: []
      },
      // 当前编辑的知识点数据
      edit_knowledge_data: {
        knowledge_id: '',
        knowledge_title: '',
        knowledge_text: '',
        knowledge_flag: '',
        major_tag: '',
        minor_tags: [],
        third_tags: []
      },
      // 当前新增的知识点数据
      add_knowledge_data: {
        knowledge_id: '',
        knowledge_title: '',
        knowledge_text: '',
        knowledge_flag: '',
        major_tag: '',
        minor_tags: [],
        third_tags: []
      },
      // 当前编辑的知识点类型表
      edit_select_type_list: [
        {
          value: 0,
          name: '未筛选'
        },
        {
          value: 1,
          name: '已筛选'
        }
      ],
      file_form: {
        file: ""
      }
    }
  },
  // 初始化函数
  created: function () {
    // 保存this指针
    let that = this
    // 设置当前页面为 加载中
    this.spin_flag = true
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
      // url: 'http://120.77.244.102:8080/AIOPS-KNOWLEDGE/get_tags',
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
        that.$Message.error('请求副标签失败，请刷新页面！')
      }
      // 请求完毕，无论成功与否都关闭加载中
      that.spin_flag = false
    })
    // 设置当前页面为 加载中
    this.spin_flag = true
    // 请求所有三级标签
    axios({
      method: 'get',
      // url: 'http://120.77.244.102:8080/AIOPS-KNOWLEDGE/get_tags',
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
        that.$Message.error('请求副标签失败，请刷新页面！')
      }
      // 请求完毕，无论成功与否都关闭加载中
      that.spin_flag = false
    })
    // 设置表格为 加载中
    this.loading = true
    // 请求知识点,默认请求前100条知识点
    axios({
      method: 'get',
      url: 'AIOPS-KNOWLEDGE/get_knowledges',
    }).then(function (response) {
      let res_data = response.data
      // 当数据正确时
      if (res_data.status_code === 0) {
        let data = res_data.data.data;
        let cnt = res_data.data.knowledge_cnt;
        that.cnt = cnt;
        that.set_response_data(data);
        that.initialize_table(data.length, that.page_size, that.page_current);
        that.loading = false;
      }
    })
  },
  methods: {
    // 初始化表格数据函数
    initialize_table: function (data_count, page_size, page_current) {
      this.data_count = data_count
      this.page_current = page_current
      this.page_size = page_size
      this.cut_table_data(page_current, page_size)
    },
    // 翻页响应函数
    page_change: function (index) {
      this.show_knowledge_data(index, this.page_size)
    },
    // 页面跳转时 计算渲染知识点函数
    show_knowledge_data: function (page_index, page_size) {
      // 起始index
      let begin = (page_index - 1) * page_size
      // 末尾index
      let end = begin + page_size
      // 截取数据
      this.now_show_knowledge_list = this.knowledge_list.slice(begin, end)
      // 修改当前index
      this.page_index = page_index
    },
    // 解析获取到的知识点
    set_response_data: function (res_data) {
      // console.log(res_data)
      /**
       * table_data: [
        {
          knowledge_id: '1',
          knowledge_name: '知识点1',
          major_tag: 'linux',
          secondary_tag: '[命令,文件管理]',
          knowledge_flag: '0'
        }
      ]
       */
      // console.log(res_data)
      let table_data = []
      // 循环每一个知识点
      for (let item in res_data) {
        // 保存除标签外的其他信息
        let data = {
          knowledge_id: res_data[item].knowledge_id,
          knowledge_name: res_data[item].knowledge_title,
          knowledge_flag: res_data[item].knowledge_flag,
          knowledge_text: res_data[item].knowledge_text
        }
        // 用于存储二级标签
        let secondary_list = []
        // 用于存储三级标签
        let third_tag_list = []
        // 循环该知识点的每一个标签
        for (let tag in res_data[item].tags) {
          if (res_data[item].tags[tag].tag_type === 1) {
          // 获取一级标签
            data.major_tag = {
              tag_id: res_data[item].tags[tag].tag_id,
              tag_name: res_data[item].tags[tag].tag_name
            }
          } else if(res_data[item].tags[tag].tag_type === 2) {
            // 获取二级标签
            secondary_list.push({
              tag_id: res_data[item].tags[tag].tag_id,
              tag_name: res_data[item].tags[tag].tag_name
            })
          } else if(res_data[item].tags[tag].tag_type === 3){
            // 获取三级标签
            third_tag_list.push({
              tag_id: res_data[item].tags[tag].tag_id,
              tag_name: res_data[item].tags[tag].tag_name
            })
          }
        }
        data.secondary_tag = secondary_list
        data.third_tag = third_tag_list
        table_data.push(data)
      }
      // 存储数据
      // console.log('table_data:', table_data)
      this.table_data = table_data
    },
    add_response_data: function(res_data){
      
      // 将后请求到的数据添加到原来请求到的数据之后
      let table_data = []
      // 循环每一个知识点
      for (let item in res_data) {
        // 保存除标签外的其他信息
        let data = {
          knowledge_id: res_data[item].knowledge_id,
          knowledge_name: res_data[item].knowledge_title,
          knowledge_flag: res_data[item].knowledge_flag,
          knowledge_text: res_data[item].knowledge_text
        }
        // 用于存储二级标签
        let secondary_list = []
        // 用于存储三级标签
        let third_tag_list = []
        // 循环该知识点的每一个标签
        for (let tag in res_data[item].tags) {
          if (res_data[item].tags[tag].tag_type === 1) {
          // 获取一级标签
            data.major_tag = {
              tag_id: res_data[item].tags[tag].tag_id,
              tag_name: res_data[item].tags[tag].tag_name
            }
          } else if(res_data[item].tags[tag].tag_type === 2) {
            // 获取二级标签
            secondary_list.push({
              tag_id: res_data[item].tags[tag].tag_id,
              tag_name: res_data[item].tags[tag].tag_name
            })
          } else if(res_data[item].tags[tag].tag_type === 3){
            // 获取三级标签
            third_tag_list.push({
              tag_id: res_data[item].tags[tag].tag_id,
              tag_name: res_data[item].tags[tag].tag_name
            })
          }
        }
        data.secondary_tag = secondary_list
        data.third_tag = third_tag_list
        table_data.push(data)
      }
      // 添加到后面
      this.table_data = this.table_data.concat(table_data)
      //console.log('添加之后整体的table_data',this.table_data)
      // 存储数据
      // console.log('table_data:', table_data)
    },
    edit_dialog: function (row, index) {
      // console.log(row)
      // 获取单个知识点
      let post_data = {
        knowledge_id: row.knowledge_id,
        action_type:'select'
      }
      let that = this
      axios({
        method: 'post',
        url: 'AIOPS-KNOWLEDGE/edit_knowledge',
        data: post_data
      }).then(function(response){
        // console.log(response)
        let res_data = response.data
        if(res_data.status_code === 0){
          let knowledge = res_data.data.knowledge
          let tags = res_data.data.tags
          that.edit_knowledge_data.knowledge_id = knowledge.knowledge_id
          that.edit_knowledge_data.knowledge_text = knowledge.knowledge_text
          that.edit_knowledge_data.knowledge_title = knowledge.knowledge_title
          that.edit_knowledge_data.knowledge_flag = knowledge.knowledge_flag
          // 用于存储二级标签
          let secondary_list = []
          // 用于存储三级标签
          let third_list = []
          // 循环该知识点的每一个标签
          for (let tag in tags) {
            if (tags[tag].tag_type === 1) {
            // 获取一级标签
              that.edit_knowledge_data.major_tag = {
                tag_id: tags[tag].tag_id,
                tag_name: tags[tag].tag_name
              }
            } else if(tags[tag].tag_type === 2) {
              // 获取二级标签
              secondary_list.push(tags[tag].tag_id)
            } else if(tags[tag].tag_type === 3){
              // 获取三级标签
              third_list.push(tags[tag].tag_id)
            }
          }
          that.edit_knowledge_data.minor_tags = secondary_list
          that.edit_knowledge_data.third_tags = third_list
          // console.log(that.edit_knowledge_data.minor_tags)
          // 保存 一级标签数据
          that.save_edit_knowledge_data.major_tag_id = that.edit_knowledge_data.major_tag.tag_id
          // 保存 二级标签数据 深拷贝
          that.save_edit_knowledge_data.minor_tags = that.edit_knowledge_data.minor_tags.concat()
          // 保存 三级标签数据 深拷贝
          that.save_edit_knowledge_data.third_tags = that.edit_knowledge_data.third_tags.concat()
        }
      })
      this.open_edit_knowledge = true
    },
    edit_ok: function () {
      // 获取到编辑的数据
      // console.log("edit_ok",this.edit_knowledge_data)
      // 修改一级标签关联
      this.change_knowledge_major_tag(this.edit_knowledge_data.knowledge_id,this.save_edit_knowledge_data.major_tag_id,this.edit_knowledge_data.major_tag.tag_id)
      // 修改二级标签关联
      this.change_knowledge_tags(this.edit_knowledge_data.knowledge_id,this.save_edit_knowledge_data.minor_tags,this.edit_knowledge_data.minor_tags)
      // 修改三级标签关联
      this.change_knowledge_tags(this.edit_knowledge_data.knowledge_id,this.save_edit_knowledge_data.third_tags,this.edit_knowledge_data.third_tags)
      // 修改数据(除标签外的信息)
      let post_data = {
        action_type: 'update',
        knowledge_id: this.edit_knowledge_data.knowledge_id,
        new_value: {
          KNOWLEDGE_TITLE: this.edit_knowledge_data.knowledge_title,
          KNOWLEDGE_TEXT: this.edit_knowledge_data.knowledge_text,
          KNOWLEDGE_FLAG: this.edit_knowledge_data.knowledge_flag
        }
      }
      // 保存this指针
      let that = this
      axios({
        method: 'post',
        url: 'AIOPS-KNOWLEDGE/edit_knowledge',
        data: post_data
      }).then(function (response) {
        let res_data = response.data
        if (res_data.status_code === 0) {
          that.loading = true
          that.find_knowledge()
          that.loading = false
        }
      })
    },
    // 删除知识点
    delete_dialog: function(row, index){
      let post_data = {
        action_type : "delete",
        knowledge_id : row.knowledge_id
      }
      console.log(row)
      let that = this
      axios({
        method:"post",
        url:"AIOPS-KNOWLEDGE/edit_knowledge",
        data: post_data
      }).then(function(response){
        let res_data = response.data
        if(res_data.status_code === 0){
          that.loading = true
          that.find_knowledge()
          that.loading = false
          that.$Message.success("删除成功！")
        }
      })
    },
    // 修改知识点对应的主标签
    change_knowledge_major_tag: function(knowledge_id,before_tag_id, after_tag_id){
      // 
      // console.log("change_knowledge:",before_tag_id,after_tag_id)
      if(before_tag_id === after_tag_id){
        return;
      }
      else{
        // 删除before_tag
        let post_data = {
          knowledge_id: knowledge_id,
          tag_id: before_tag_id,
          action_type: 'delete'
        }
        axios({
          method:'post',
          url: 'AIOPS-KNOWLEDGE/edit_minor_tag',    
          data: post_data
        }).then(function(response){
          console.log("删除关联")
        })
        // 添加after_tag
        post_data = {
          knowledge_id: knowledge_id,
          tag_id: after_tag_id,
          action_type: 'insert'
        }
        axios({
          method:'post',
          url: 'AIOPS-KNOWLEDGE/edit_minor_tag',
          data: post_data
        }).then(function(response){
          console.log("新增关联")
        })
      }
    },
    // 修改二级标签链接
    change_knowledge_tags: function(knowledge_id,before_tags,after_tags){
      // console.log("change_knowledge",knowledge_id,before_minor_tags,after_minor_tags)
      // 两个循环
      for(let i = 0;i < before_tags.length;i++){
        if(after_tags.indexOf(before_tags[i])===-1){
          // 删除了某个副标签
          let tag = before_tags[i]
          let post_data = {
            knowledge_id: knowledge_id,
            tag_id: tag,
            action_type: 'delete'
          }
          axios({
            method:'post',
            url: 'AIOPS-KNOWLEDGE/edit_minor_tag',
            data:post_data
          }).then(function(response){
            console.log("删除关联")
        })
        }
      }

      for(let i = 0; i < after_tags.length;i++){
        if(before_tags.indexOf(after_tags[i]) === -1){
          let tag = after_tags[i]
          let post_data = {
            knowledge_id: knowledge_id,
            tag_id: tag,
            action_type: 'insert'
          }
          axios({
            method:'post',
            url: 'AIOPS-KNOWLEDGE/edit_minor_tag',
            data:post_data
          }).then(function(response){
            console.log("新增关联")
        })
        }
      }
    },
    // 打开新增知识点窗口
    add_knowledge_dialog: function () {
      this.open_add_knowledge = true
    },
    // 点击新增知识点
    add_ok: function () {
      
      // 保存this指针
      let that = this
      // 获取到需要新增的内容
      let new_value = {
        KNOWLEDGE_TITLE: this.add_knowledge_data.knowledge_title,
        KNOWLEDGE_TEXT: this.add_knowledge_data.knowledge_text,
        KNOWLEDGE_FLAG: this.add_knowledge_data.knowledge_flag
      }
      // 将所有新增知识点的标签放到一起
      let all_tags = []
      // 添加参数
      let post_data = {
        action_type: 'insert',
        new_value: new_value
      }
      // 发起请求
      axios({
        method: 'post',
        url: 'AIOPS-KNOWLEDGE//edit_knowledge',
        data: post_data
      }).then(function (response) {
        let res_data = response.data
        // console.log(res_data)
        if (res_data.status_code === 0) {
          // 数据获取成功
          that.add_knowledge_data.knowledge_id = res_data.data.knowledge_id
          if(that.add_knowledge_data.major_tag){
            all_tags.push(that.add_knowledge_data.major_tag)
          }
          if(that.add_knowledge_data.minor_tags.length !== 0){
            all_tags = all_tags.concat(that.add_knowledge_data.minor_tags)
          }
          if(that.add_knowledge_data.third_tags.length !== 0){
            all_tags = all_tags.concat(that.add_knowledge_data.third_tags)
          }
          console.log(all_tags)
          that.link_knowledge_tag(that.add_knowledge_data.knowledge_id,all_tags)
          that.$Message.success('新增数据成功,请刷新数据！')
        }
      })
    },
    change_page: function (index) {
      // 如果模糊匹配及筛选框为空
      if(this.bind_search===''){
        // 切换页码
        if(((index)*this.page_size) >= this.data_count ){
          this.$Message.success('数据增量刷新！')
          // 到达当前请求的最后一页，发起额外请求,请求100条
          // offset代表偏移的数据量
          // limit代表至少有多少条
          let that = this
          // 根据当前标签的选择发起请求
          // 标签设置为正在加载中
          this.loading = true
          // 存放请求参数
          let post_data = {
            'offset': (index)*this.page_size,
            'limit': 100
          }
          // 获取一级标签
          let major_tag_name = this.bind_major_tag
          // 获取二级标签
          let minor_tag_names = this.bind_minor_tag
          // 获取三级标签
          let third_tag_names = this.bind_third_tag
          // 存放所有标签
          let all_tags = []
          if(major_tag_name){
            all_tags.push(major_tag_name)
          }
          if(minor_tag_names.length !== 0){
            all_tags.push(minor_tag_names)
          }
          if(third_tag_names.length !== 0){
            all_tags.push(third_tag_names)
          }
          // 将标签转化为字符串形式保存
          if(all_tags.length !== 0) {
            post_data.all_tags = all_tags.toString()
          }
          this.loading = true
          axios({
            method: 'get',
            url: 'AIOPS-KNOWLEDGE/get_knowledges',
            params: post_data
          }).then(function (response) {
            let res_data = response.data
            // 当数据正确时
            if (res_data.status_code === 0) {
              let data = res_data.data.data;
              let cnt = res_data.data.knowledge_cnt;
              that.cnt = cnt;
              that.add_response_data(data)
              that.initialize_table(that.data_count + data.length, that.page_size, that.page_current)
              that.loading = false
            }
          })
        }
      }
      this.cut_table_data(index, this.page_size)

       
    },
    // 切割页面
    cut_table_data (index, size) {
      
      let start = (index - 1) * size
      let end = index * size
      this.page_table_data = this.table_data.slice(start, end)
    },
    // 刷新页面
    fresh_page: function () {
      location.reload()
    },
    // 搜索知识点
    search_knowledge: function () {
      if(this.bind_search === '')
      {
        return
      }
      // 标签设置为正在加载中
      this.loading = true
      let that = this
      let params = {
        sentence: this.bind_search
      }
      axios({
        url: 'AIOPS-KNOWLEDGE/search_knowledges',
        method: 'get',
        params: params
      }).then(function(response){
        let res_data = response.data
        if (res_data.status_code === 0) {
          // 数据获取成功
          that.$Message.success('数据刷新')
          // console.log('change_data:', res_data.data)
          that.set_response_data(res_data.data)
          that.initialize_table(res_data.data.length, that.page_size, that.page_current)
          that.change_page(1)
          // 标签加载完毕
          that.loading = false
        }
      })
    },
    // 响应函数：一级标签下拉框值更改
    on_major_tag_change: function (value) {
      // 如果三个下拉框都为空，则获取所有数据
      if(!this.bind_major_tag && this.bind_minor_tag.length == 0 && this.bind_third_tag == 0){
        this.bind_search = '';
        this.find_knowledge();
        return;
      }else{
        // 一级标签下拉框值更改，将后续两个下拉框置空
        this.bind_minor_tag = []
        this.bind_third_tag = []
        this.bind_search = ''
      }
      
    },
    // 响应函数：二级标签下拉框改变
    on_minor_tag_change: function (value) {
      // 如果传入的value为空，直接返回，不做任何操作
      if (value.length == 0){
        return;
      }
      // 判断一级标签下拉框值是否已选
      if(this.bind_major_tag){
        // 一级标签已选，则三级标签置为空
        this.bind_third_tag = []
      }else{
        //一级标签未选，提示选择一级标签
        alert('请先选择一级标签')
        // 二级三级都置空
        this.bind_minor_tag = [];
        this.bind_third_tag = [];
        // this.find_knowledge();
      }
      this.bind_search = ''
    },
    //
    on_third_tag_change: function (value) {
      // 如果传入value为空，直接返回，不做任何操作
      if(value.length == 0){
        return;
      }
      // 判断一级标签和二级标签是否已选
      if(this.bind_major_tag && this.bind_minor_tag.length != 0){
        // 一级标签和二级标签都已选
        this.find_knowledge()
      }else if(this.bind_major_tag){
        // 二级标签未选
        alert('请先选择二级标签');
        this.bind_third_tag = [];
      }else{
        // 一级标签未选
        alert('请先选择一级标签');
        this.bind_minor_tag = [];
        this.bind_third_tag = [];
      }
      this.bind_search = ''
      
    },
    // 根据当前各个下拉框选择的值对知识点进行查询
    find_knowledge: function () {
      let that = this
      // 根据当前标签的选择发起请求
      // 标签设置为正在加载中
      this.loading = true
      // 存放请求参数
      let post_data = {}
      // 获取一级标签
      let major_tag_name = this.bind_major_tag
      // 获取二级标签
      let minor_tag_names = this.bind_minor_tag
      // 获取三级标签
      let third_tag_names = this.bind_third_tag
      // 存放所有标签
      let all_tags = []
      if(major_tag_name){
        all_tags.push(major_tag_name)
      }
      if(minor_tag_names.length !== 0){
        all_tags.push(minor_tag_names)
      }
      if(third_tag_names.length !== 0){
        all_tags.push(third_tag_names)
      }
      // 将标签转化为字符串形式保存
      if(all_tags.length !== 0){
        post_data.all_tags = all_tags.toString()
      }
      //发起请求
      axios({
        method: 'get',
        url: 'AIOPS-KNOWLEDGE/get_knowledges',
        params: post_data
      }).then(function (response) {
        let res_data = response.data
        if (res_data.status_code === 0) {
          // 数据获取成功
          that.$Message.success('数据刷新')
          // console.log('change_data:', res_data.data)
          let data = res_data.data.data;
          let cnt = res_data.data.knowledge_cnt;
          that.cnt = cnt;
          that.set_response_data(data)
          that.initialize_table(data.length, that.page_size, that.page_current)
          that.change_page(1)
          that.loading = false
        }
      })
    },
    // 创建知识点与标签之间的连接
    link_knowledge_tag: function (knowledge_id, all_tags) {
      // 循环副标签插入
      for (let tag in all_tags) {
        axios({
          method: 'post',
          url: 'AIOPS-KNOWLEDGE/edit_minor_tag',
          data: {
            tag_id: all_tags[tag],
            knowledge_id: knowledge_id,
            action_type: 'insert',
            tag_weight: 0
          }
        }).then(function (response) {
          if (response.data.status_code === 0) {
            console.log('标签链接知识点成功')
          } else {
            console.log('标签链接知识点失败')
          }
        })
      }
    },
    add_knowledge_from_file_dialog: function(){
      this.upload_file_flag = true
    },
    handleUploadFile: function(){
      if(this.file_form){
        let that = this
        axios({
                method:'post',
                data: this.file_form,
                url:'AIOPS-CRAWL/upload'
        }).then(function(response){
            let res_data = response.data
            if(res_data.status_code === 0){
              that.$Message.success("导入文件成功！")
            }else{
              that.$Message.error("导入文件失败！")
            }
        })
      }
    }
  }
}
</script>
<style scoped>
.knowledge_info {
  font-size: 20px;
  font-weight: 100;
}
</style>