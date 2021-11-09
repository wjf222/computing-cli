<style scoped>
.demo-auto-complete-item {
  padding: 4px 0;
  border-bottom: 1px solid #F6F6F6;
}

.demo-auto-complete-group {
  font-size: 12px;
  padding: 4px 6px;
}

.demo-auto-complete-group span {
  color: #666;
  font-weight: bold;
}

.demo-auto-complete-group a {
  float: right;
}

.demo-auto-complete-count {
  float: right;
  color: #999;
}

.demo-auto-complete-more {
  display: block;
  margin: 0 auto;
  padding: 4px;
  text-align: center;
  font-size: 12px;
}
.demo-spin-container{
    display: inline-table;
    width: 100%;
    height: 200px;
    position: relative;
    border: 1px solid #eee;
  }

div.ivu-modal {
  position: unset;
}

[v-cloak] {
  display: none;
}
</style>
<template>
<div>
  <div id="strategy_custom">
    <Card>
      <Icon type="md-analytics" size="32" />
      <Row :gutter="16">
        <i-Col span="4" offset="2">
          <div><label>策略名称</label></div>
        </i-Col>
        <i-Col span="6">
          <div>
            <i-Input v-model="strategyName" placeholder="请输入..." />
          </div>
        </i-Col>
      </Row>
      <br>
      <Row :gutter="16">
        <i-Col span="4" offset="2">
          <div><label>请选择抽取数据源</label></div>
        </i-Col>
        <i-Col span="6">
          <div id="duplifix4">
            <i-Select v-model="select_extract_dataSource" @on-change="changeExtractSource">
              <i-Option v-for="item in extract_dataSource" :value="item.value" :key="item.value">{{ item.label }}</i-Option>
            </i-Select>
          </div>
        </i-Col>
      </Row>
    </Card>

    <card>
      <Row :gutter="16">
        <i-Col span="4" offset="2">
          <div><label>自定义数据抽取sql语句</label></div>
        </i-Col>
        <i-Col span="8">
          <div>
            <pre v-text="custom_sql" style="max-height: 200px;min-height: 100px;overflow: auto; white-space: pre-wrap;word-wrap: break-word;border:solid 1px ;border-color:#C4C4C4;">{{ custom_sql }}</pre>
          </div>
        </i-Col>
        <i-col span="2" style="top:20px">
          <i-button @click="openSqlEditor">编辑SQL</i-button>
        </i-col>

      </Row>
    </card>
    <card>
      <Row :gutter="16">
        <i-Col span="4" offset="2">
          <div><label>请选择加载数据源</label></div>
        </i-Col>
        <i-Col span="8">
          <div id="duplifix3">
            <i-Select v-model="select_load_dataSource" @on-change="changeLoadSource" placement="top">
              <i-Option v-for="item in load_dataSource" :value="item.value" :key="'datasource'+item.value">{{ item.label }}</i-Option>
            </i-Select>
          </div>
        </i-Col>
      </Row>
      <br>

      <row :gutter="16">
        <i-col offset="2" span="6">
          <card style="height: 350px;overflow: auto">
            <p slot="title">请填写加载数据表单</p>
            <div v-for="(table, i) in writeTables">
              <row>
                <i-col span="4">
                  <label>表</label>
                </i-col>
                <i-col span="16">
                  <Auto-Complete v-model="writeTables[i].table_name" icon="ios-search" placeholder="加载表单" :transfer="true" @on-select="autoTableSelect">
                    <div class="demo-auto-complete-item" style="max-height: 200px">
                      <i-Option v-for="option in loadDataSourceTables" :value="option" :key="'load'+option">
                        <span class="demo-auto-complete-title">{{ option }}</span>
                      </i-Option>
                    </div>
                  </Auto-Complete>
                </i-col>
              </row>
            </div>
          </card>
        </i-col>
        <i-col span="12">
          <card style="height: 350px; overflow: auto">
            <p slot="title">请填写加载数据表单对应的字段信息</p>
            <div v-for="(table,i) in writeTables">
              <!-- <card style="height: 250px;overflow: auto"> -->
              <p slot="title">表：{{ table.table_name }}</p>
              <row v-for="(c, j) in table.column_names" :gutter="16">
                <i-col span="4">
                  <label>字段{{ j+1 }}</label>
                </i-col>
                <i-col span="8">
                  <Auto-Complete v-model="table.column_names[j]" icon="ios-search" placeholder="已有字段" :transfer="true" @on-select="autoColumnSelect($event,i,j)">
                    <div class="demo-auto-complete-item" style="max-height: 200px;overflow: auto;">
                      <div id="duplifix2">
                        <i-Option v-for="option in loadDataSourceColumns[i]" :value="option.column" :key="option.column">
                          <span class="demo-auto-complete-title">{{ option.column }}</span>
                          <span class="demo-auto-complete-count">类型：{{ option.type }}</span>
                        </i-Option>
                      </div>
                    </div>
                  </Auto-Complete>
                </i-col>
                <i-col span="6">
                  <Auto-Complete v-model="table.column_types[j]" icon="ios-search" :transfer="true" placeholder="字段类型">
                    <div class="demo-auto-complete-item" style="max-height: 200px;overflow: auto;">
                      <i-Option v-for="option in typeAutoArray" :value="option">
                        <span class="demo-auto-complete-title">{{ option }}</span>
                      </i-Option>
                    </div>
                  </Auto-Complete>
                </i-col>
                <i-col span="6">
                  <i-input v-model="table.column_sizes[j]" placeholder="字段大小"></i-input>
                </i-col>
              </row>
              <!-- </card> -->
              <br>
            </div>
          </card>
        </i-col>
      </row>
    </card>
    <br>
    <Row :gutter="16">
      <i-Col span="4" offset="2">
        <div><label>请选择所属主题</label></div>
      </i-Col>
      <i-Col span="6">
        <div id="duplifix5">
          <i-select v-model="theme_select_model" placement="top">
            <i-option v-for="item in themeChooseList" :value="item.value" :key="'theme'+item.value">{{ item.label }}</i-option>
          </i-select>
        </div>
      </i-Col>
    </Row>
    <Row style="margin-bottom: 100px">
      <i-col offset="18">
        <i-button v-if="pageType == 0" type="success" icon="ios-plus-outline" @click="saveStrategy">保存策略</i-button>
        <i-button v-if="pageType == 1" type="warning" icon="ios-plus-outline" @click="updateStrategy">修改策略</i-button>
      </i-col>
    </Row>
  </div>

  <Modal v-model="editSqlModal" :title="modal_title" :styles="{top:'30px',width:'800px',height:'250px'}">
    <card>
      <row :gutter="16">
        <i-col span="3">
          <label>数据表单</label>
        </i-col>
        <i-col span="6">

          <Auto-Complete v-model="extract_table" icon="ios-search" placeholder="表单">
            <div class="demo-auto-complete-item" style="max-height: 200px">
              <i-Option v-for="option in extractDataSourceTables" :value="option" :key="'extracttable'+option">
                <span class="demo-auto-complete-title">{{ option }}</span>
              </i-Option>
            </div>
          </Auto-Complete>
        </i-col>
        <i-col span="3">
          <label>数据列名</label>
        </i-col>
        <i-col span="6">
          <Auto-Complete v-model="extract_column" icon="ios-search" placeholder="列名">
            <div class="demo-auto-complete-item" style="max-height: 200px">
              <div id="duplifix">
                <i-Option v-for="option in extractDataSourceColumns" :value="option" :key="'extractcol'+option">
                  <span class="demo-auto-complete-title">{{ option }}</span>
                </i-Option>
              </div>
            </div>
          </Auto-Complete>
        </i-col>
      </row>
    </card>
    <card>
      <pre id="code" class="ace_editor" style="min-height:200px" ref="code">
                    <textarea class="ace_text-input">
                    </textarea>
                </pre>
    </card>
    <div v-if="sql_result.result_code == 1">
      <card style="height: 250px;">
        <span style="color: green">执行成功，数据总条数：{{ sql_result.rowNum }}</span>
        <i-Table stripe height="200" width="100%" :columns="sql_result.column_names" :data="sql_result.data"></i-Table>
      </card>
    </div>
    <div v-if="sql_result.result_code == 0">
      <card>
        <span style="color: red;">执行失败</span>
        <pre>{{ sql_result.error_reason }}</pre>
      </card>
    </div>
    <div v-if="sql_result.result_code == 2">
        <card>
          <div class="demo-spin-container">
             <Spin fix></Spin>
         </div>
        </card>
    </div>

    <Row slot="footer">
      <i-Col span="2">
        <i-Button type="success" @click="runSql">测试</i-Button>
      </i-Col>
      <i-Col span="2" offset="18">
        <i-Button @click="cancel">取消</i-Button>
      </i-Col>
      <i-Col span="2">
        <i-Button type="primary" @click="saveEditorSql">保存</i-Button>
      </i-Col>
    </Row>

  </Modal>
</div>
</template>

<script>
import axios from 'axios'
import crypto from '@/libs/crypto'
import ace from 'ace-builds'
import 'ace-builds/webpack-resolver' // 在 webpack 环境中使用必须要导入
import 'ace-builds/src-noconflict/theme-tomorrow' // 默认设置的主题
import 'ace-builds/src-noconflict/mode-sql' // 默认设置的语言模式
import 'ace-builds/src-noconflict/snippets/sql'
import 'ace-builds/src-noconflict/ext-language_tools.js'

import { mapMutations } from 'vuex'

export default {
  name: 'etlCustomEdit_page',
  components: {

  },
  data () {
    return {
      strategyName: '',
      select_extract_dataSource: '',
      extract_dataSource: [], // 抽取数据源
      load_dataSource: [], // 加载数据源
      // 已选择的抽取数据源id
      selected_extract_dataSourceId: -1,
      // 是否选择关联查询
      isJoin: '2',
      select_load_dataSource: -1,
      loadDataSourceTables: [],
      table_mark: [';'],
      loadDataSourceColumns: [],
      column_mark: [{
        title: ',',
        detail: '同表下字段分隔'
      },
      {
        title: ';',
        detail: '不同表下字段分隔'
      }
      ],
      form_sql: '', // 根据前面选择的表字段等信息生成的sql
      custom_sql: '', // 用户自定义填写的sql，优先执行自定义sql，自定义为空时才执行form_sql
      editSqlModal: false,
      modal_title: 'SQL编辑器',
      editor: null,
      sql_result: {
        column_names: [],
        rowNum: 0,
        data: [],
        result_code: -1,
        error_reason: ''
      },
      writeTables: [{
        table_name: '',
        column_names: [''],
        column_types: [''],
        column_sizes: ['']
      }],
      // 判断是页面是新增(0)或更新(1)
      pageType: -1,
      extract_table: '',
      extractDataSourceTables: [],
      extract_column: '',
      extractDataSourceColumns: [],

      // 选择主题变量
      themeChooseList: [],
      theme_select_model: '-1',
      // sql语句通过测试了才能添加该自定义策略
      isTestSql: -1,
      // 字段类型自动提示
      typeAutoArray: ['int', 'float', 'double', 'varchar',
        'char', 'text', 'date', 'datetime', 'timestamp', 'time', 'bit', 'bool', 'blob'
      ],
      // mysql数据类型
      mysqlDataType: ['int', 'float', 'double', 'varchar',
        'char', 'text', 'date', 'datetime', 'timestamp', 'time', 'bit', 'bool', 'blob'
      ],
      // oracle数据类型
      oracleDataType: ['NUMBER', 'INT', 'INTEGER', 'FLOAT', 'DOUBLE', 'VARCHAR', 'VARCHAR2',
        'TIMESTAMP', 'DATE', 'bit', 'bool', 'BLOB'
      ],

      select_extract_dataSource_type: '',
      select_load_dataSource_type: '',
      // 执行次数
      runCount: 0
      // ace编辑器
      // editor_1: null,
      // themePath: "ace/theme/tomorrow", // 不导入 webpack-resolver，该模块路径会报错
      // modePath: "ace/mode/sql" // 同上
    }
  },
  watch: {
    writeTables: {
      handler (newValue, oldValue) {
        this.loadDataSourceColumns = []
        for (let i = 0; i < newValue.length; i++) {
          if (this.select_load_dataSource != '' && newValue[i].table_name != '') {
            // alert("watch")
            //  alert(this.select_load_dataSource+"sf :"+newValue[i].table_name)
            const param = {
              dataId: this.select_load_dataSource,
              tableName: newValue[i].table_name
            }
            // alert(this.select_load_dataSource)
            // alert(newValue[i].table_name)
            const that = this
            // console.log('writeTables')
            axios({
              method: 'post',
              url: this.GLOBAL.etlUrl + 'api/get_columns',
              withCredentials: true,
              params: param
            }).then(function (response) {
              var data = response.data
              if (data['status']) {
                const columns = data.columns
                // 设置显示的column列表
                let ls = []
                // alert(columns.length)
                for (let i = 0; i < columns.length; i++) {
                  const table = columns[i].split('.')[0]
                  const column = columns[i].split('.')[1].split('（')[0]
                  const type = columns[i].split('.')[1].split('（')[1].split('）')[0]
                  ls.push({
                    table: table,
                    column: column,
                    type: type
                  })
                }
                that.loadDataSourceColumns.push(ls)
              } else {
                console.log('获取列名后台错误！')
              }
            })
          }
        }
      },
      deep: true
    },
    extract_table: function () {
      const that = this
      const param = {
        dataId: this.selected_extract_dataSourceId,
        tableName: this.extract_table
      }
      if (this.extract_table.length > 0) {
        axios({
          method: 'post',
          url: this.GLOBAL.etlUrl + 'api/get_columns',
          withCredentials: true,
          params: param
        }).then(function (response) {
          var data = response.data
          if (data['status']) {
            const columns = data.columns
            // 设置显示的column列表
            let ls = []
            for (let i = 0; i < columns.length; i++) {
              ls.push(columns[i])
            }
            that.extractDataSourceColumns = ls
            // console.log('start')
            // console.log(that.extractDataSourceColumns)
          } else {
            console.log('获取列名后台错误！')
          }
        })
      }
    }
  },
  methods: {
    ...mapMutations([
      'closeTag'
    ]),
    testfunc () {
      var t = crypto.encrypt('aaaaaaaaaa')
      var tt = crypto.decrypt(t)
      alert(tt)
    },

    loadDataSources () {
      var that = this
      let list11 = []
      let list22 = []
      axios({
        method: 'post',
        url: this.GLOBAL.etlUrl + 'api/get_etl_datasource',
        withCredentials: true,
        params: {
          loginname: 'superadmin'
        }
      }).then(function (response) {
        var data = response.data
        // 所有数据源
        const dataSouces = data['datasources']
        // 取出抽取数据源、和加载数据源
        const list1 = []
        const list2 = []
        for (let i = 0; i < dataSouces.length; i++) {
          const d = {}
          d['value'] = dataSouces[i]['id']
          d['label'] = dataSouces[i]['name']
          if (dataSouces[i]['extract'] == 0) {
            list1.push(d)
          } else {
            list2.push(d)
          }
        }
        // alert(that.extract_dataSource instanceof Array)
        that.extract_dataSource = list1
        // alert("IIIIIIIIIIIII")
        // alert(that.extract_dataSource.length)
        that.load_dataSource = list2
        list11 = list1
        list22 = list2
      })

      // alert("list"+list11.length)
      // alert("datasource"+this.extract_dataSource.length)
      // that.extract_dataSource = list11;
      // that.load_dataSource = list22;
    },
    // 点击改变抽取数据源后，根据数据源ID得到该数据源所包含的表单
    changeExtractSource (dataSourceId) {
      this.extract_table = ''
      this.extract_column = ''
      this.selected_extract_dataSourceId = dataSourceId
      this.getTables(dataSourceId)
    },
    getTables (dataSourceId) {
      var that = this
      axios({
        method: 'post',
        url: this.GLOBAL.etlUrl + 'api/get_tables',
        withCredentials: true,
        params: {
          dataId: dataSourceId
        }
      }).then(function (response) {
        // console.log(response.data)
        var data = response.data
        if (data.status) {
          const tables = data.tables
          // 设置显示的table列表
          let ls = []
          for (let i = 0; i < tables.length; i++) {
            ls.push(tables[i])
          }
          that.extractDataSourceTables = ls
          that.select_extract_dataSource_type = data.type
        } else {
          // 2020.12.19 经过测试这里并不会触发，数据源无效直接500报错，需要在服务中修改
          console.log('未能获取表，所选取的数据源为无效数据源！')
        }
      })
    },

    // 解析已选择的字段，从中得到字段名称，类型，大小
    getColumnInfo (column_detail) {
      const rs = {}
      let columns = ''
      let types = ''
      let sizes = ''
      const readColumnArray = column_detail
      const tableSet = new Set()
      // 分隔符，多表时为;号，单表为,号
      let p = ''
      if (this.isJoin == '1') {
        p = ','
      } else {
        p = ';'
      }
      for (const x of readColumnArray) {
        tableSet.add(x.split('.')[0])
      }
      for (const t of tableSet) {
        // 每张表单对应的字段、类型、大小
        let column = ''
        let type = ''
        let size = ''
        for (const x of readColumnArray) {
          if (x.split('.')[0] == t) {
            column = column + x.split('（')[0] + ','
            type = type + x.split('（')[1].split('，')[0] + ','
            size = size + x.split('（')[1].split('，')[1].split('）')[0] + ','
          }
        }
        columns = columns + column.substr(0, column.length - 1) + p
        types = types + type.substr(0, type.length - 1) + p
        sizes = sizes + size.substr(0, size.length - 1) + p
      }
      rs['readcolumns'] = columns.substr(0, columns.length - 1)
      rs['columntypes'] = types.substr(0, types.length - 1)
      rs['columnsize'] = sizes.substr(0, sizes.length - 1)
      return rs
    },
    // 初始化相关变量
    initTransformValue () {
      this.writeTransFormColumns = [{
        column_name: '',
        transform_type: '',
        danwei_transform_function: '',
        date_transform_type: ''
      }]
      // 当前已被选择要转换的列的value值
      this.current_select_value = ['']
      // 是否禁用转换条件中的添加按钮
      this.isDisabledAdd = true
      this.isDisabledDelete = true
    },
    // 转换条件获取列选项
    getTransformColumns () {
      const array = this.selected_extract_column
      let ls = []
      for (let i = 0; i < array.length; i++) {
        ls.push({
          value: array[i],
          label: array[i]
        })
      }
      this.transform_columns = ls
      // 完成select项更新后，更新按钮状态
      this.isDisabledAddFunc()
      this.isDisabledDeleteFunc()
    },
    isDisabledAddFunc () {
      // 当所有列都不可选择时，禁用添加按钮
      if (this.current_select_value.length >= this.transform_columns.length) {
        this.isDisabledAdd = true
      } else {
        this.isDisabledAdd = false
      }
    },
    isDisabledDeleteFunc () {
      // 当所有列都不可选择时，禁用添加按钮
      if (this.writeTransFormColumns.length == 1) {
        this.isDisabledDelete = true
      } else {
        this.isDisabledDelete = false
      }
    },

    cancel () {
      this.editSqlModal = false
    },
    saveConditionSqlEditor () {
      if (this.modal_title === '关联条件sql编辑') {
        this.joinCondition = $.trim(this.ConditionEditor.getValue())
      } else if (this.modal_title === '清洗条件sql编辑') {
        this.cleanCondition = $.trim(this.ConditionEditor.getValue())
      }
      this.SqlConnectorModal = false
    },
    openSqlCleanEditor () {
      this.sql_result.result_code = -1
      this.SqlConnectorModal = true
      this.modal_title = '清洗条件sql编辑'
      this.ConditionEditor.setValue(this.cleanCondition)
      this.ConditionEditor.focus()
    },
    // 点击添加转换列
    addTransformColumn () {
      const column = {
        column_name: '',
        transform_type: '',
        danwei_transform_function: '',
        date_transform_type: ''
      }
      this.writeTransFormColumns.push(column)
      this.current_select_value.push('')

      this.isDisabledAddFunc()
      this.isDisabledDeleteFunc()
    },
    // 点击删除转换列
    deleteTransformColumn () {
      this.writeTransFormColumns.pop()
      this.current_select_value.pop()

      this.isDisabledAddFunc()
      this.isDisabledDeleteFunc()
    },
    // 选择一列时调用
    changeTransformcolumn (value, j) {
      this.current_select_value[j] = value
    },
    // 判断当前列是否该被禁选
    isDisabled (value) {
      for (let i = 0; i < this.current_select_value.length; i++) {
        if (value == this.current_select_value[i]) {
          return true
        }
      }
      return false
    },
    // sql计算器
    openSqlEditor () {
      this.sql_result.result_code = -1
      this.editSqlModal = true
      this.editor.setValue(this.custom_sql)
    },
    // 执行sql语句
    runSql () {
      if (this.selected_extract_dataSourceId == -1) {
        this.message('未选取抽取数据源，不能运行SQL！')
        return
      }
      this.sql_result.result_code = 2
      const sql = $.trim(this.editor.getValue())
      const that = this
      const param = {
        dataId: this.select_extract_dataSource,
        sql: sql
      }
      axios({
        method: 'post',
        url: this.GLOBAL.etlUrl + 'api/run_sql',
        withCredentials: true,
        params: param
      }).then(function (response) {
        // console.log(response.data)
        var data = response.data
        if (data.status == 0) {
          const table = data.data
          that.sql_result.result_code = 1
          // 列名
          let columnNames = []
          // for(let columnName in table[0]){
          //     columnNames.push({title:table[0][columnName], key:table[0][columnName], width:120});
          //       // columnNames.push({title:table[0][columnName], key:table[0][columnName]});
          // }
          var lth = 0
          for (let columnName in table[0]) {
            lth++
          }
          if (lth > 7) {
            for (let columnName in table[0]) {
              columnNames.push({ title: table[0][columnName], key: table[0][columnName], width: 120 })
            }
          } else if (lth <= 7) {
            for (let columnName in table[0]) {
              // columnNames.push({title:table[0][columnName], key:table[0][columnName], width:100});
              columnNames.push({ title: table[0][columnName], key: table[0][columnName] })
            }
          }
          // 查询结果总行数
          let rowNum
          for (const row in table[1]) {
            rowNum = table[1][row]
          }
          // 数据
          const tableData = []
          for (let i = 2; i < table.length; i++) {
            tableData.push(table[i])
          }
          if (columnNames.length > 7) {
            const c_start = columnNames[0]
            const c_end = columnNames[columnNames.length - 1]
            c_start.fixed = 'left'
            c_end.fixed = 'right'
            columnNames[0] = c_start
            columnNames[columnNames.length - 1] = c_end
          }
          that.sql_result.column_names = columnNames
          that.sql_result.rowNum = rowNum
          that.sql_result.data = tableData
          that.isTestSql = 1
          that.transformType(that.select_extract_dataSource_type, data.types,
            that.select_load_dataSource_type)
          that.writeTables[0].column_names = data.columns
          that.writeTables[0].column_types = data.types
          that.writeTables[0].column_sizes = data.sizes
        } else {
          that.sql_result.result_code = 0
          that.sql_result.error_reason = data.sqlError
          that.isTestSql = 0
        }
      })
    },
    saveEditorSql: function () {
      this.custom_sql = $.trim(this.editor.getValue())
      this.editSqlModal = false
    },

    // 由于不同数据源中相同类型的类型名称不同。需要进行不同数据源之间的类型转换
    // type1：数据源1的类型，typeArray：数据源1的数据类型数组，type2数据源2的类型
    transformType: function (type1, typeArray, type2) {
      if (type1 == 'oracle' && type2 == 'mysql') {
        for (var i = 0; i < typeArray.length; i++) {
          if (typeArray[i] != null && typeArray[i].toUpperCase() == 'VARCHAR2') {
            typeArray[i] = 'varchar'
          }
          if (typeArray[i] != null && typeArray[i].toUpperCase() == 'NUMBER') {
            typeArray[i] = 'int'
          }
        }
      }
      if (type1 == 'mysql' && type2 == 'oracle') {
        for (var i = 0; i < typeArray.length; i++) {
          if (typeArray[i] != null && typeArray[i].toUpperCase() == 'VARCHAR') {
            typeArray[i] = 'VARCHAR2'
          }
          if (typeArray[i] != null && typeArray[i].toUpperCase() == 'INT') {
            typeArray[i] = 'NUMBER'
          }
        }
      }
      if (type1 == 'oracle' && type2 == 'oracle') {
        for (var i = 0; i < typeArray.length; i++) {
          if (typeArray[i] != null && typeArray[i].toUpperCase() == 'VARCHAR') {
            typeArray[i] = 'VARCHAR2'
          }
          if (typeArray[i] != null && typeArray[i].toUpperCase() == 'INT') {
            typeArray[i] = 'NUMBER'
          }
        }
      }
      if (type1 == 'mysql' && type2 == 'mysql') {
        for (var i = 0; i < typeArray.length; i++) {
          if (typeArray[i] != null && typeArray[i].toUpperCase() == 'VARCHAR2') {
            typeArray[i] = 'varchar'
          }
          if (typeArray[i] != null && typeArray[i].toUpperCase() == 'NUMBER') {
            typeArray[i] = 'int'
          }
        }
      }
    },
    // 加载数据源改变后触发函数
    changeLoadSource (dataSourceId) {
      if (dataSourceId != '') {
        const that = this
        const param = {
          dataId: dataSourceId
        }
        axios({
          method: 'post',
          url: this.GLOBAL.etlUrl + 'api/get_tables',
          withCredentials: true,
          params: param
        }).then(function (response) {
          // console.log(response.data)
          var data = response.data
          if (data.status) {
            const tables = data.tables
            // 设置显示的table列表
            let ls = []
            for (let i = 0; i < tables.length; i++) {
              ls.push(tables[i])
            }
            that.loadDataSourceTables = ls
            that.select_load_dataSource_type = data.type
            if (data.type == 'mysql') {
              that.typeAutoArray = that.mysqlDataType
            }
            if (data.type == 'oracle') {
              that.typeAutoArray = that.oracleDataType
            }
          } else {
            console.log('所选取的数据源为无效数据源！')
          }
        })
      }
    },
    autoTableSelect: function (value) {
      // console.log(this.writeTables)
    },
    autoColumnSelect: function (value, m, n) {
      const tableName = this.writeTables[m].table_name
      const that = this
      const param = {
        dataId: this.select_load_dataSource,
        tableName: tableName
      }
      axios({
        method: 'post',
        url: this.GLOBAL.etlUrl + 'api/get_columns',
        withCredentials: true,
        params: param
      }).then(function (response) {
        var data = response.data
        if (data['status']) {
          const columns = data.columns
          // 设置显示的column列表
          for (let i = 0; i < columns.length; i++) {
            const columnName = columns[i].split('（')[0].split('.')[1]
            if (columnName == value) {
              const columnType = columns[i].split('（')[1].split('，')[0]
              const columnSize = columns[i].split('（')[1].split('，')[1].split('）')[0]
              that.writeTables[m].column_types[n] = columnType
              that.writeTables[m].column_sizes[n] = columnSize
            }
          }
          that.writeTables[m].column_types = [...that.writeTables[m].column_types]
        } else {
          console.log('获取列名后台错误！')
        }
      })
    },
    // 初始化策略修改参数
    initUpdatePage: function () {
      // router更改
      const strategy = this.$route.params.update_strategy
      alert(strategy)
      this.strategyName = strategy.strategyname

      this.custom_sql = strategy.remark
      // console.log('remark' + strategy.remark)
      this.isJoin = strategy.etltype
      const t = strategy.readtables.split(';')
      this.select_extract_table = t
      // 执行次数初始化
      this.runCount = strategy.executioncount
      // 处理主题信息
      const theme = strategy.theme
      if (theme == undefined || theme == '' || theme == null) {
        this.theme_select_model = '-1'
      } else {
        this.theme_select_model = theme['id']
      }

      const columns = this.splitStr(strategy.readcolumns)
      const types = this.splitStr(strategy.columntypes)
      const size = this.splitStr(strategy.columnsize)
      const rs = []
      for (let i = 0; i < columns.length; i++) {
        rs.push(columns[i] + '（' + types[i] + '，' + size[i] + '）')
      }
      this.selected_extract_dataSourceId = strategy.etlExtractDataSource.id
      // 初始化writeTables
      const tableArray = strategy.writetable.split(';')
      const columnNamesArray = strategy.writecolumns.split(';')
      const columnTypesArray = strategy.columntypes.split(';')
      const columnSizesArray = strategy.columnsize.split(';')
      const writeTables = []
      for (let i = 0; i < tableArray.length; i++) {
        const table = {}
        table.table_name = tableArray[i]
        table.column_names = columnNamesArray[i].split(',')
        table.column_types = columnTypesArray[i].split(',')
        table.column_sizes = columnSizesArray[i].split(',')
        writeTables.push(table)
      }
      this.writeTables = writeTables
    },
    // 获取所有主题
    getTheme: function () {
      const that = this
      const dataList = [{
        value: '-1',
        label: '未选择'
      }] // 初始化主题选择框
      this.themeChooseList = [] // 清空主题选择框
      var datalist1 = []
      const param = {}
      axios({
        method: 'post',
        url: this.GLOBAL.etlUrl + 'etl/getTheme',
        withCredentials: true,
        params: param
      }).then(function (response) {
        var data = response.data
        const status = data['status']
        if (status == '0') { // 正确返回结果
          const resultList = data['resultList']
          for (let i = 0; i < resultList.length; i++) {
            const dom = resultList[i]
            dom['value'] = resultList[i]['id']
            dom['label'] = resultList[i]['themename']
            dataList.push(dom)
          }
          // console.log(that.themeChooseList instanceof Array)
          // console.log(that.themeChooseList)
          that.themeChooseList = dataList
          // IIIIIIIIIIIIII
          datalist1 = dataList
        } else {
          console.log(status) // 控制台提示报错
        }
      })
      // alert("CRE")
      // alert(datalist1.length)
      // this.themeChooseList=datalist1;
    },
    updateStrategy: function () {
      if (this.checkAddData()) {
        const that = this
        const sql = this.custom_sql
        const param = {
          loginname: 'superadmin',
          id: this.$route.params.update_strategy.id,
          strategyname: this.strategyName,
          extractresource: this.selected_extract_dataSourceId,
          loadresource: this.select_load_dataSource,
          etltype: this.isJoin,
          executioncount: this.runCount,
          readtables: '',
          readcolumns: '',
          joincondition: '',
          writetable: this.getWriteInfo().tableNames,
          writecolumns: this.getWriteInfo().columnNames,
          dataclean: '',
          datatransform: '',
          isonline: 0,
          columntypes: this.getWriteInfo().columnTypes,
          columnsize: this.getWriteInfo().columnSizes,
          sql: sql,
          themeId: this.theme_select_model
        }
        axios({
          method: 'post',
          url: this.GLOBAL.etlUrl + 'api/update_etl',
          withCredentials: true,
          params: param
        }).then(function (response) {
          var data = response.data
          if (data['status']) {
            that.$Modal.success({
              title: '成功',
              content: '修改ETL策略成功！',
              onOk: () => {
                // 需要处理
                that.closeTag({
                  name: 'etlCustomEdit_page'
                })
                that.$router.push({
                  name: '策略管理'
                  // params:{
                  //   id:params.row.id,
                  // }
                })
                // window.parent.root.closeOpen();
                // window.parent.root.addpage({name:"策略管理",src:'etl_manage'});
                // window.parent.root.$emit("routeToETLManage");
              }
            })
          } else {
            that.$Modal.error({
              title: '失败',
              content: '服务器端出错，请检查！'
            })
          }
        })
      }
    },
    saveStrategy: function () {
      if (this.checkAddData()) {
        const that = this
        const sql = this.custom_sql
        const param = {
          loginname: 'superadmin',
          strategyname: this.strategyName,
          extractresource: this.selected_extract_dataSourceId,
          loadresource: this.select_load_dataSource,
          etltype: this.isJoin,
          executioncount: 0,
          readtables: '',
          readcolumns: '',
          joincondition: '',
          writetable: this.getWriteInfo().tableNames,
          writecolumns: this.getWriteInfo().columnNames,
          dataclean: '',
          datatransform: '',
          isonline: 0,
          columntypes: this.getWriteInfo().columnTypes,
          columnsize: this.getWriteInfo().columnSizes,
          sql: sql,
          themeId: this.theme_select_model
        }
        // console.log(param)
        axios({
          method: 'post',
          url: this.GLOBAL.etlUrl + 'api/add_etl',
          withCredentials: true,
          params: param
        }).then(function (response) {
          var data = response.data
          if (data['status']) {
            that.$Modal.success({
              title: '成功',
              content: '添加ETL策略成功！',
              onOk: () => {
                that.closeTag({
                  name: 'etlCustomEdit_page'
                })
                that.$router.push({
                  name: '策略管理'
                  // params:{
                  //   id:params.row.id,
                  // }
                })
                // window.parent.root.closeOpen();
                // window.parent.root.addpage({name:"策略管理",src:'etl_manage'});
                // window.parent.root.$emit("routeToETLManage");
              }
            })
          } else {
            that.$Modal.error({
              title: '失败',
              content: '服务器端出错，请检查！'
            })
          }
        })
      }
    },
    // 检查增加策略内数据有效性
    checkAddData: function () {
      if ($.trim(this.strategyName) == '') {
        this.message('请填写策略名称！')
        return false
      }
      if (this.selected_extract_dataSourceId == -1) {
        this.message('请选择抽取数据源！')
        return false
      }
      // 自定义数据抽取sql不需要验证以下信息
      if ($.trim(this.custom_sql) == '') {
        this.message('请编辑自定义SQL语句！')
        return false
      }
      if (this.isTestSql == -1) {
        this.message('请测试自定义SQL语句！')
        return false
      }
      if (this.isTestSql == 0) {
        this.message('测试自定义SQL语句无效，请重新编辑！')
        return false
      }
      if (this.select_load_dataSource == '') {
        this.message('请选择加载数据源！')
        return false
      }
      // 校验加载数据表
      if ($.trim(this.writeTables[0].table_name) == '') {
        this.message('请选择加载数据表单！')
        return false
      }
      return true
    },
    getReadTable: function () {
      let table = ''
      for (let i = 0; i < this.select_extract_table.length; i++) {
        if (i == this.select_extract_table.length - 1) {
          table += this.select_extract_table[i]
        } else {
          table += this.select_extract_table[i] + ';'
        }
      }
      return table
    },
    // 得到加载数据源信息
    getWriteInfo: function () {
      const tables = this.writeTables
      let tableNames = ''
      let columnNames = ''
      let columnTypes = ''
      let columnSizes = ''
      const rs = {}

      for (let i = 0; i < tables.length; i++) {
        tableNames += tables[i].table_name + ';'
        for (let j = 0; j < tables[i].column_names.length; j++) {
          columnNames += tables[i].column_names[j] + ','
          columnTypes += tables[i].column_types[j] + ','
          columnSizes += tables[i].column_sizes[j] + ','
        }
        columnNames = columnNames.substr(0, columnNames.length - 1) + ';'
        columnTypes = columnTypes.substr(0, columnTypes.length - 1) + ';'
        columnSizes = columnSizes.substr(0, columnSizes.length - 1) + ';'
      }

      rs['tableNames'] = tableNames.substr(0, tableNames.length - 1)
      rs['columnNames'] = columnNames.substr(0, columnNames.length - 1)
      rs['columnTypes'] = columnTypes.substr(0, columnTypes.length - 1)
      rs['columnSizes'] = columnSizes.substr(0, columnSizes.length - 1)
      return rs
    },
    // 切分字符串，型如：t1_c1,t1_c2;t2_c1,t2_c2,返回数组[t1_c1,t1_c2,t2_c1,t2_c2]
    splitStr: function (str) {
      const result = []
      const ss = str.split(';')
      for (const s of ss) {
        const c_array = s.split(',')
        for (const c of c_array) {
          result.push(c)
        }
      }
      return result
    },
    message: function (m) {
      this.$Message.error({
        content: m,
        duration: 5,
        closable: true
      })
    },
    initpage () {
      this.pageType = this.$route.params.pageType
      if (this.pageType == 1) {
        // 更新操作，进行赋值
        this.isTestSql = 1
        // 改成router
        const strategy = this.$route.params.update_strategy
        // console.log('created: ')
        // console.log(strategy)
        this.loadDataSources()
        this.select_extract_dataSource = strategy.etlExtractDataSource.id
        this.select_load_dataSource = strategy.etlLoadDataSource.id
        const that = this
        const param = {
          dataId: strategy.etlExtractDataSource.id
        }
        axios({
          method: 'post',
          url: this.GLOBAL.etlUrl + 'api/get_tables',
          withCredentials: true,
          params: param
        }).then(function (response) {
          var data = response.data
          if (data.status) {
            const tables = data.tables
            // 设置显示的table列表
            let ls = []
            for (let i = 0; i < tables.length; i++) {
              ls.push(
                tables[i]
              )
            }
            //  alert(that.loadDataSourceTables)
            that.loadDataSourceTables = ls
            that.initUpdatePage()
          } else {
            console.log('所选取的数据源为无效数据源！')
          }
        })
        const param2 = {
          dataId: strategy.etlExtractDataSource.id,
          tableName: strategy.readtables
        }
        if (param2.tableName.length > 0) {
          const extractColumns = this.splitStr(strategy.readcolumns)
          axios({
            method: 'post',
            url: this.GLOBAL.etlUrl + 'api/get_columns',
            withCredentials: true,
            params: param2
          }).then(function (response) {
            var data = response.data
            if (data['status']) {
              const columns = data.columns
              // 设置显示的column列表
              let ls = []
              for (let i = 0; i < columns.length; i++) {
                ls.push(
                  columns[i]
                )
              }
              that.extractDataSourceColumns = ls
            } else {
              console.log('获取列名后台错误！')
            }
          })
        }

        this.changeLoadSource(strategy.etlLoadDataSource.id)
        this.getTables(strategy.etlExtractDataSource.id)
      }
    }

  },

  created () {

  },

  mounted () {
    this.initpage()
    // 页面加载时获取所有的主题
    this.getTheme()

    this.loadDataSources()
    // ace编辑器
    const codeeditor = ace.edit(this.$refs.code)
    codeeditor.setTheme('ace/theme/tomorrow')
    codeeditor.session.setMode('ace/mode/sql')
    // 字体大小
    codeeditor.setFontSize(18)
    // 设置只读（true时只读，用于展示代码）
    codeeditor.setReadOnly(false)
    // 自动换行,设置为off关闭
    // 自动换行,设置为off关闭
    codeeditor.setOption('wrap', 'free')
    // 启用提示菜单
    // ace.require("ace/ext/language_tools");
    codeeditor.setOptions({
      enableSnippets: true,
      enableLiveAutocompletion: true,
      enableBasicAutocompletion: true
    })
    this.editor = codeeditor
  }

}
</script>

<style>

</style>
