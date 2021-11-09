<style scoped>
.demo-auto-complete-item{
          padding: 4px 0;
          border-bottom: 1px solid #F6F6F6;
      }
      .demo-auto-complete-group{
          font-size: 12px;
          padding: 4px 6px;
      }
      .demo-auto-complete-group span{
          color: #666;
          font-weight: bold;
      }
      .demo-auto-complete-group a{
          float: right;
      }
      .demo-auto-complete-count{
          float: right;
          color: #999;
      }
      .demo-auto-complete-more{
          display: block;
          margin: 0 auto;
          padding: 4px;
          text-align: center;
          font-size: 12px;
      }
      div.ivu-modal{
          position:unset;
      }

      .calculatorlarge{
          width:100px;
          height:32px;
      }
      .calculatormiddle{
          width:80px;
          height:32px;
      }
      .calculatornormal{
          width:60px;
          height:32px;
      }
      .demo-spin-container{
          display: inline-table;
          width: 100%;
          height: 200px;
          position: relative;
          border: 1px solid #eee;
        }
      [v-cloak]{
          display: none;
      }
</style>
<template>
  <div>
    <div id="strategy_form" v-cloak>
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
              <div>
                  <i-Select v-model="select_extract_dataSource" @on-change="changeExtractSource">
                      <i-Option v-for="item in extract_dataSource" :value="item.value" :key="item.value">{{ item.label }}</i-Option>
                  </i-Select>
              </div>
          </i-Col>
      </Row>
      <br>
      <Row :gutter="16">
          <i-Col span="4" offset="2">
              <div><label>请选择抽取的数据表单</label></div>
          </i-Col>
          <i-Col span="18">
              <div>
                  <Transfer :data="extract_table" :target-keys="select_extract_table"
                            :titles="extractTable_transfer_titles"
                            :list-style="extract_transfer_style"
                            @on-change="extractTableChange"
                            v-model="extract_table" filterable>
                      <div :style="{float: 'right', margin: '5px'}">
                          <i-Button type="primary" ghost size="small" @click="reloadExtractTransfer">重置</i-Button>
                      </div>
                  </Transfer>
              </div>
          </i-Col>
      </Row>
      <br>
      <Row :gutter="16">
          <i-Col span="4" offset="2">
              <div><label>请选择抽取的字段</label></div>
          </i-Col>
          <i-Col span="18">
              <div>
                  <Transfer :data="extract_column" :titles="extractColumn_transfer_titles"
                            :target-keys="selected_extract_column" :list-style="extract_transfer_style"
                            @on-change="extractColumnChange" filterable>
                  </Transfer>
              </div>
          </i-Col>
      </Row>
      <br>
      <Row :gutter="16">
               <i-Col span="4" offset="2">
                   <div><label>关联条件：</label></div>
               </i-Col>
               <i-Col span="8">
                   <div>
                     <!--pre标签可以用来识别换行符-->
                       <pre v-text="joinCondition" style="height: 100px; white-space: pre-wrap;word-wrap: break-word;border:solid 1px ;border-color:#C4C4C4;">{{ custom_sql }}</pre>
                   </div>
               </i-Col>
               <i-col span="2" style="top:68px">
                   <i-button @click="openSqlConnectionEditor">编辑SQL</i-button>
               </i-col>
           </Row>
        </Card>
        <card>
    <Row :gutter="16">
        <i-Col span="4" offset="2">
            <div><label>清洗条件：</label></div>
        </i-Col>
        <i-Col span="8">
            <div>
                <pre v-text="cleanCondition" style="height: 100px; white-space: pre-wrap;word-wrap: break-word;border:solid 1px ;border-color:#C4C4C4;">{{ custom_sql }}</pre>
            </div>
        </i-Col>
        <i-col span="2" style="top:68px">
            <i-button @click="openSqlCleanEditor">编辑SQL</i-button>
        </i-col>
    </Row>
    <br>
    <Row :gutter="16">
        <i-Col span="4" offset="2">
            <div><label>转换条件</label></div>
        </i-Col>
        <i-Col span="8">
           <!-- <i-Input v-model="transformCondition" placeholder="选填" />-->
            <Radio-Group v-model="useTransformCondition">
                <Radio label = "0"><span>不启用</span></Radio>
                <Radio label = "1"><span>启用</span></Radio>
            </Radio-Group>
        </i-Col>
    </Row>

        <Row v-if="useTransformCondition==='1'" :gutter="16">
            <i-Col span="4" offset="2">
                    <div><label></label></div>
            </i-Col>
            <i-Col span="16">
                <card style="height: 250px;overflow: auto">
                    <p slot="title">选择需要转换的字段：</p>
                    <i-button slot="extra" @click="addTransformColumn()" :disabled="isDisabledAdd">添加</i-button>
                    <i-button slot="extra" @click="deleteTransformColumn()" :disabled="isDisabledDelete">删除</i-button>
                    <row v-for="(item, j) in writeTransFormColumns" :gutter="16">
                        <i-col span="2">
                            <label>字段{{ j+1 }}</label>
                        </i-col>
                        <i-col   span="10">
                            <i-Select v-model="writeTransFormColumns[j].column_name" @on-change="changeTransformcolumn($event,j)" placement="bottom"  placeholder="选择转换列">
                                <i-Option v-for="item in transform_columns" :value="item.value" :key="item.value" :disabled="isDisabled(item.value)">{{ item.label }}</i-Option>
                            </i-Select>
                        </i-col>
                        <i-col span="3">
                            <i-select v-model="writeTransFormColumns[j].transform_type" placeholder="转换类型" >
                                <i-option v-for="item in transform_types" :value="item.value" :key="item.value" >{{ item.label }}</i-option>
                            </i-select>
                        </i-col>
                        <i-col  v-if="writeTransFormColumns[j].transform_type==='0'" span="9">
                            <i-input v-model="writeTransFormColumns[j].danwei_transform_function" placeholder="转换函数（用x代表当前列,支持运算符号+-*/%()）"></i-input>
                        </i-col>
                        <i-col v-if="writeTransFormColumns[j].transform_type==='1'" span="6">
                                <i-select v-model="writeTransFormColumns[j].date_transform_type" placeholder="日期转换类型" >
                                    <i-option v-for="item in date_transform_types" :value="item.value" :key="item.value">{{ item.label }}</i-option>
                                </i-select>
                        </i-col>
                    </row>
                </card>

            </i-Col>
            <i-Col span="10">

            </i-Col>
        </Row>

</card>
<card>
    <br>
    <Row :gutter="16">
        <i-Col span="4" offset="2">
            <div><label>数据抽取sql语句</label></div>
        </i-Col>
        <i-Col span="8">
            <div>
                <pre v-text="form_sql" style="height: 130px; white-space: pre-wrap;word-wrap: break-word;border:solid 1px ;border-color:#C4C4C4; overflow: auto;">{{ form_sql }}</pre>
            </div>
        </i-Col>
        <i-col span="2" style="top:68px">
            <i-button @click="openSqlEditor">测试SQL</i-button>
        </i-col>
    </Row>
</card>
<card>
    <Row :gutter="16">
        <i-Col span="4" offset="2">
            <div><label>请选择加载数据源</label></div>
        </i-Col>
        <i-Col span="8">
            <div>
                <i-Select v-model="select_load_dataSource" @on-change="changeLoadSource" placement="top">
                    <i-Option v-for="item in load_dataSource" :value="item.value" :key="item.value">{{ item.label }}</i-Option>
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
                        <!--<i-input v-model="writeTables[i].table_name"></i-input>-->
                        <Auto-Complete
                                v-model="writeTables[i].table_name"
                                icon="ios-search"
                                placeholder="加载表单"
                                :transfer="true"
                                @on-select ="autoTableSelect">
                            <div class="demo-auto-complete-item" style="max-height: 220px">
                                <i-Option v-for="option in loadDataSourceTables" :value="option" :key="option">
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
                <!-- <card style="height: 280px;overflow: auto"> -->
                    <p slot="title">表：{{ table.table_name }}</p>
                    <row v-for="(c, j) in table.column_names" :gutter="16">
                        <i-col span="4">
                            <label>字段{{ j+1 }}</label>
                        </i-col>
                        <i-col span="8">
                            <Auto-Complete
                                    v-model="table.column_names[j]"
                                    icon="ios-search"
                                    placeholder="已有字段"
                                    :transfer="true"
                                    @on-select ="autoColumnSelect($event,i,j)">
                                <div class="demo-auto-complete-item" style="max-height: 200px;overflow: auto;">
                                    <i-Option v-for="option in loadDataSourceColumns[i]" :value="option.column" :key="option.column">
                                        <span class="demo-auto-complete-title">{{ option.column }}</span>
                                        <span class="demo-auto-complete-count">类型：{{ option.type }}</span>
                                    </i-Option>
                                </div>
                            </Auto-Complete>
                        </i-col>
                        <i-col span="6">
                            <Auto-Complete
                                    v-model="table.column_types[j]"
                                    icon="ios-search"
                                    placeholder="字段类型">
                                <div class="demo-auto-complete-item" style="max-height: 200px;overflow: auto;">
                                    <i-Option v-for="option in typeAutoArray" :value="option" >
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
           <div>
               <i-select v-model="theme_select_model"  placement="top">
                   <i-option v-for="item in themeChooseList" :value="item.value" :key="item.value">{{ item.label }}</i-option>
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
      <Modal
           v-model="SqlConnectorModal"
           :styles="{top:'30px',width:'800px',height:'250px'}"
           :title="modal_title">
       <row>
          <Card>
               <p slot="title">表单信息</p>
               <row>
                   <i-col span="3">
                       <label style="font-size: 12px">数据表单</label>
                   </i-col>
                   <i-col span="6">
                       <Auto-Complete
                               v-model="extract_table_sql"
                               icon="ios-search"
                               placeholder="表单">
                           <div class="demo-auto-complete-item">
                               <i-Option size="small" v-for="option in extractDataSourceTables" :value="option" :key="option">
                                   <span class="demo-auto-complete-title">{{ option }}</span>
                               </i-Option>
                           </div>
                       </Auto-Complete>
                   </i-col>
                   <i-col span="3" offset="1">
                       <label style="font-size: 12px">数据列名</label>
                   </i-col>
                   <i-col span="6">
                       <Auto-Complete
                               v-model="extract_column_sql"
                               icon="ios-search"
                               placeholder="列名">
                           <div class="demo-auto-complete-item">
                               <i-Option size="small" v-for="option in extractDataSourceColumns" :value="option" :key="option">
                                   <span class="demo-auto-complete-title">{{ option }}</span>
                               </i-Option>
                           </div>
                       </Auto-Complete>
                   </i-col>
                   <i-col span="2" offset="1">
                       <i-Button @click="addField()">添加</i-Button>
                   </i-col>
               </row>
           </Card>
       </row>
       <row>
           <i-col span="14">
               <Row>
                   <Card >
                       <p slot="title">Sql术语</p>
                       <row v-if="modal_title == '关联条件sql编辑'">
                           <i-col span="6" >
                               <i-Button class="calculatorlarge" @click="sqlCalculator(0)">left outer join</i-Button>
                           </i-col>
                           <i-col span="6" offset="1">
                               <i-Button class="calculatorlarge" @click="sqlCalculator(1)">right outer join</i-Button>
                           </i-col>
                           <i-col span="6" offset="1">
                               <i-Button class="calculatorlarge" @click="sqlCalculator(3)" >join</i-Button>
                           </i-col>
                           <i-col span="3" offset="1">
                               <i-Button class="calculatornormal" @click="sqlCalculator(4)" >on</i-Button>
                           </i-col>
                       </row>
                       <row v-if="modal_title == '清洗条件sql编辑'">

                           <i-Button class="calculatorlarge" @click="sqlCalculator(10)" >is not null</i-Button>

                           <i-Button class="calculatornormal" style="margin-left: 12px" @click="sqlCalculator(9)">is null</i-Button>

                           <i-Button class="calculatornormal" style="margin-left: 12px" @click="sqlCalculator(6)">or</i-Button>

                           <i-Button class="calculatornormal" style="margin-left: 12px" @click="sqlCalculator(7)">and</i-Button>

                           <i-Button class="calculatornormal" style="margin-left: 12px" @click="sqlCalculator(8)">in</i-Button>

                       </row>
                       <br>
                       <row>
                           <i-col span="6">
                               <i-Button class="calculatorlarge" @click="sqlCalculator(11)" >空格</i-Button>
                           </i-col>
                       </row>
                   </Card>
               </Row>
           </i-col>
           <i-col span="9" offset="1">
               <Card >
                   <p slot="title">数值计算器</p>
                   <row>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(0)">1</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(1)">2</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(2)">3</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(3)" style="width:39px;height:32px">*</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(4)" style="width:39px;height:32px">=</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(5)" style="width:39px;height:32px">!=</i-Button>
                       </i-col>
                   </row>
                   <br>
                   <row>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(6)">4</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(7)">5</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(8)">6</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(9)" style="width:39px;height:32px">/</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(10)" style="width:39px;height:32px">></i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(11)" style="width:39px;height:32px">>=</i-Button>
                       </i-col>
                   </row>
                   <br>
                   <row>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(12)">7</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(13)">8</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(14)">9</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(15)" style="width:39px;height:32px">+</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(16)" style="width:39px;height:32px"><</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(17)" style="width:39px;height:32px"><=</i-Button>
                       </i-col>
                   </row>
                   <br>
                   <row >
                       <i-col span="8">
                           <i-Button @click="MathCalculator(18)" style="width:80px;height:32px">0</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(19)" style="width:39px;height:32px">.</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(20)" style="width:39px;height:32px">-</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(21)" style="width:39px;height:32px">(</i-Button>
                       </i-col>
                       <i-col span="4">
                           <i-Button @click="MathCalculator(22)" style="width:39px;height:32px">)</i-Button>
                       </i-col>
                   </row>
               </Card>
           </i-col>
       </row>
       <row>
           <Card>
               <row>
                   <pre id="code_1" class="ace_editor" style="min-height:100px" ref="ace">
                       <textarea class="ace_text-input">
                       </textarea>
                   </pre>
               </row>
               <row>
                   <i-col span="3" offset="1">
                       <Poptip title="提示" content="·join的时候记得添加表单名称../·单独选择数据表单，可添加表单名称">
                           <i-Button type="primary" icon="ios-information-outline" >温馨提示</i-Button>
                       </Poptip>
                   </i-col>
                   <i-col span="3"  offset="17">
                       <i-Button  @click="clearInput()" >清空</i-Button>
                   </i-col>
               </row>
           </Card>
       </row>
       <Row slot="footer" >
           <i-Col span="2" offset="20">
               <i-Button @click="cancel">取消</i-Button>
           </i-Col>
           <i-Col span="2">
               <i-Button type="primary" @click="saveConditionSqlEditor">保存</i-Button>
           </i-Col>
       </Row>
   </Modal>
   <Modal v-model="editSqlModal" :title="modal_title" :styles="{top:'30px',width:'800px',height:'250px'}">
    <card>
            <pre id="code" class="ace_editor" style="min-height:200px" ref="code">
                <textarea class="ace_text-input">
                </textarea>
            </pre>
    </card>
    <div v-if="sql_result.result_code == 1">
        <card style="height: 250px;">
            <span style="color: green">执行成功，数据总条数：{{ sql_result.rowNum }}</span>
            <i-Table stripe  height="200" width="100%":columns="sql_result.column_names" :data="sql_result.data"></i-Table>
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

    <Row slot="footer" >
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
  name: 'etlEdit_page',
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
      // 选择一个抽取数据源后对应的数据表单\
      extract_table: [],
      // 已选择的表单
      select_extract_table: [],
      extractTable_transfer_titles: ['表单列表', '已选择表单'],
      extract_column: [],
      // 已选择的字段
      selected_extract_column: [],
      extractColumn_transfer_titles: ['字段列表', '已选择字段'],
      extract_transfer_style: {
        width: '350px',
        height: '350px'
      },
      isJoin: '1',
      select_extract_dataSource_type: '',
      writeTables: [
        {
          table_name: '',
          column_names: [''],
          column_types: [''],
          column_sizes: ['']
        }
      ],
      // 转换列数据存储结构
      writeTransFormColumns: [
        {
          column_name: '',
          transform_type: '',
          danwei_transform_function: '',
          date_transform_type: ''
        }
      ],
      // 当前已被选择要转换的列的value值
      current_select_value: [''],

      // 是否禁用转换条件中的添加按钮
      isDisabledAdd: true,
      isDisabledDelete: true,
      transform_columns: [],
      // 关联条件
      joinCondition: '',
      cleanCondition: '',
      transformCondition: '',
      select_load_dataSource: -1,
      loadDataSourceTables: [],
      table_mark: [';'],
      loadDataSourceColumns: [],
      column_mark: [
        {
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
      sql_result: {
        column_names: [],
        rowNum: 0,
        data: [],
        result_code: -1,
        error_reason: ''
      },
      // sql计算器
      SqlConnectorModal: false,
      ConditionEditor: null,
      extractDataSourceTables: [],
      extractDataSourceColumns: [],
      extract_table_sql: '',
      extract_column_sql: '',
      select_extract_dataSource_type: '',
      select_load_dataSource_type: '',
      // ace编辑器
      // editor_1: null,
      themePath: 'ace/theme/tomorrow', // 不导入 webpack-resolver，该模块路径会报错
      modePath: 'ace/mode/sql', // 同上
      // 页面清洗与转换
      useTransformCondition: '0',
      transform_types: [{ value: '0', label: '单位转换' }, { value: '1', label: '日期转换' }],
      date_transform_types: [{ value: '0', label: '时间戳转日期' }, { value: '1', label: '日期转时间戳' }],
      editor: null,
      // 字段类型自动提示
      typeAutoArray: ['int', 'float', 'double', 'varchar',
        'char', 'text', 'date', 'datetime', 'timestamp', 'time', 'bit', 'bool', 'blob'],
      // mysql数据类型
      mysqlDataType: ['int', 'float', 'double', 'varchar',
        'char', 'text', 'date', 'datetime', 'timestamp', 'time', 'bit', 'bool', 'blob'],
      // oracle数据类型
      oracleDataType: ['NUMBER', 'INT', 'INTEGER', 'FLOAT', 'DOUBLE', 'VARCHAR', 'VARCHAR2',
        'TIMESTAMP', 'DATE', 'bit', 'bool', 'BLOB'],
      // 判断是页面是新增(0)或更新(1)
      pageType: -1,
      // 选择主题变量
      themeChooseList: [],
      theme_select_model: '-1',
      isTestSql: -1,
      // 执行次数
      runCount: 0

    }
  },
  watch: {
    extract_table_sql () {
      let that = this
      let param = {
        dataId: this.selected_extract_dataSourceId,
        tableName: this.extract_table_sql
      }
      axios({
        method: 'post',
        url: this.GLOBAL.etlUrl + 'api/get_columns',
        withCredentials: true,
        params: param
      }).then(function (response) {
        var data = response.data
        if (data['status']) {
          let columns = data.columns
          // 设置显示的column列表
          let ls = []
          for (let i = 0; i < columns.length; i++) {
            let field = columns[i].split(that.extract_table_sql)
            ls.push(field[1])
          }
          that.extractDataSourceColumns = ls
          that.extract_column_sql = ''
          // console.log(that.extractDataSourceColumns)
        } else {
          console.log('获取列名后台错误！')
        }
      })
    },
    writeTables: {
      handler (newValue, oldValue) {
        this.loadDataSourceColumns = []
        for (let i = 0; i < newValue.length; i++) {
          if (this.select_load_dataSource != '' && newValue[i].table_name != '') {
            let param = {
              dataId: this.select_load_dataSource,
              tableName: newValue[i].table_name
            }
            let that = this
            // console.log('writeTables')
            axios({
              method: 'post',
              url: this.GLOBAL.etlUrl + 'api/get_columns',
              withCredentials: true,
              params: param
            }).then(function (response) {
              var data = response.data
              if (data['status']) {
                let columns = data.columns
                // 设置显示的column列表
                let ls = []
                for (let i = 0; i < columns.length; i++) {
                  let table = columns[i].split('.')[0]
                  let column = columns[i].split('.')[1].split('（')[0]
                  let type = columns[i].split('.')[1].split('（')[1].split('）')[0]
                  ls.push(
                    {
                      table: table,
                      column: column,
                      type: type
                    }
                  )
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
        let dataSouces = data['datasources']
        // 取出抽取数据源、和加载数据源
        let list1 = []
        let list2 = []
        for (let i = 0; i < dataSouces.length; i++) {
          let d = {}
          d['value'] = dataSouces[i]['id']
          d['label'] = dataSouces[i]['name']
          if (dataSouces[i]['extract'] == 0) {
            list1.push(d)
          } else {
            list2.push(d)
          }
        }
        that.extract_dataSource = list1
        that.load_dataSource = list2
      })
    },
    // 点击改变抽取数据源后，根据数据源ID得到该数据源所包含的表单
    changeExtractSource (dataSourceId) {
      // alert(dataSourceId)
      this.extract_table = []
      this.select_extract_table = []
      this.extract_column = []
      this.selected_extract_column = []
      this.selected_extract_dataSourceId = dataSourceId
      this.getTables(dataSourceId)
    },
    getTables (dataSourceId) {
      var that = this
      var transTableData = []
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
          let tables = data.tables
          // 设置显示的table列表
          let ls = []
          let ls_1 = []
          for (let i = 0; i < tables.length; i++) {
            ls_1.push(tables[i])
            ls.push({
              key: tables[i],
              label: tables[i]
            })
          }
          that.extract_table = ls
          that.extractDataSourceTables = ls_1
          that.select_extract_dataSource_type = data.type
        } else {
          console.log('所选取的数据源为无效数据源！')
        }
      })
    },
    extractTableChange (newTargetKeys) {
      this.select_extract_table = newTargetKeys
      // console.log('WriteTable')
      // console.log(this.select_extract_table)
      this.extract_column = []
      this.selected_extract_column = []
      if (newTargetKeys != null && newTargetKeys.length != 0) {
        // 所有选中的table组合成的字符串
        let tableNames = ''
        for (let i = 0; i < newTargetKeys.length; i++) {
          if (i == newTargetKeys.length - 1) {
            tableNames += newTargetKeys[i]
          } else {
            tableNames += newTargetKeys[i] + ';'
          }
        }
        let param = {
          dataId: this.selected_extract_dataSourceId,
          tableName: tableNames
        }
        let that = this
        // console.log('extractTableChange')
        axios({
          method: 'post',
          url: this.GLOBAL.etlUrl + 'api/get_columns',
          withCredentials: true,
          params: param
        }).then(function (response) {
          // console.log(response)
          var data = response.data
          if (data['status']) {
            let columns = data.columns
            // 设置显示的column列表
            let ls = []
            for (let i = 0; i < columns.length; i++) {
              ls.push({
                key: columns[i],
                label: columns[i]
              })
            }
            that.extract_column = ls
          } else {
            console.log('获取列名后台错误！')
          }
        })
      }
    },
    reloadExtractTransfer () {
      if (this.selected_extract_dataSourceId != -1) {
        this.changeExtractSource(this.selected_extract_dataSourceId)
        this.extractTableChange()
      }
    },
    extractColumnChange (newTargetKeys) {
      this.selected_extract_column = newTargetKeys
      // console.log('extractColumnChange-newTargetKeys')
      // console.log(newTargetKeys)
      let column_info = this.getColumnInfo(this.selected_extract_column)
      let columnTypeArray = column_info.columntypes.split(',')

      let columnSizeArray = column_info.columnsize.split(',')
      this.writeTables[0].column_names = new Array(columnTypeArray.length)
      this.writeTables[0].column_types = columnTypeArray
      this.writeTables[0].column_sizes = columnSizeArray
      // console.log(this.writeTables[0]);

      // 当选择的字段改变时，重新初始化转换条件，并重新调用转换条件中的selected选择项
      this.initTransformValue()
      this.getTransformColumns()
    },
    // 解析已选择的字段，从中得到字段名称，类型，大小
    getColumnInfo (column_detail) {
      let rs = {}
      let columns = ''
      let types = ''
      let sizes = ''
      let readColumnArray = column_detail
      let tableSet = new Set()
      // 分隔符，多表时为;号，单表为,号
      let p = ''
      if (this.isJoin == '1') {
        p = ','
      } else {
        p = ';'
      }
      for (let x of readColumnArray) {
        tableSet.add(x.split('.')[0])
      }
      for (let t of tableSet) {
        // 每张表单对应的字段、类型、大小
        let column = ''
        let type = ''
        let size = ''
        for (let x of readColumnArray) {
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
      this.writeTransFormColumns = [
        {
          column_name: '',
          transform_type: '',
          danwei_transform_function: '',
          date_transform_type: ''
        }
      ]
      // 当前已被选择要转换的列的value值
      this.current_select_value = ['']
      // 是否禁用转换条件中的添加按钮
      this.isDisabledAdd = true
      this.isDisabledDelete = true
    },
    // 转换条件获取列选项
    getTransformColumns () {
      let array = this.selected_extract_column
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
    openSqlConnectionEditor () {
      this.sql_result.result_code = -1
      this.SqlConnectorModal = true
      this.modal_title = '关联条件sql编辑'
      this.ConditionEditor.setValue(this.joinCondition)
      this.ConditionEditor.focus()
    },
    addField () {
      let column = this.extract_column_sql.split('（')
      this.ConditionEditor.insert(this.extract_table_sql + column[0] + ' ')
      this.ConditionEditor.focus()
      this.extract_column_sql = ''
    },
    sqlCalculator (i) {
      switch (i) {
        case 0: {
          this.ConditionEditor.insert('left outer join( ) on ')
          let location = this.ConditionEditor.selection.getCursor()
          this.ConditionEditor.moveCursorTo(location['row'], location['column'] - 5)
          break
        }
        case 1: {
          this.ConditionEditor.insert('right outer join( ) on ')
          let location = this.ConditionEditor.selection.getCursor()
          this.ConditionEditor.moveCursorTo(location['row'], location['column'] - 5)
          break
        }
        case 2: {
          this.ConditionEditor.insert('full outer join( ) on ')
          let location = this.ConditionEditor.selection.getCursor()
          this.ConditionEditor.moveCursorTo(location['row'], location['column'] - 5)
          break
        }
        case 3: {
          this.ConditionEditor.insert('join( ) on ')
          let location = this.ConditionEditor.selection.getCursor()
          this.ConditionEditor.moveCursorTo(location['row'], location['column'] - 5)
          break
        }
        case 4: { this.ConditionEditor.insert('on '); break }
        case 5: { this.ConditionEditor.insert('where '); break }
        case 6: { this.ConditionEditor.insert('or '); break }
        case 7: { this.ConditionEditor.insert('and '); break }
        case 8: {
          this.ConditionEditor.insert('in( ) ')
          let location = this.ConditionEditor.selection.getCursor()
          this.ConditionEditor.moveCursorTo(location['row'], location['column'] - 2)
          break
        }
        case 9: { this.ConditionEditor.insert('is null '); break }
        case 10: { this.ConditionEditor.insert('is not null '); break }
        case 11: { this.ConditionEditor.insert(' '); break }
      }
      this.ConditionEditor.focus()
    },
    MathCalculator (i) {
      switch (i) {
        case 0: { this.ConditionEditor.insert('1'); break }
        case 1: { this.ConditionEditor.insert('2'); break }
        case 2: { this.ConditionEditor.insert('3'); break }
        case 3: { this.ConditionEditor.insert('*'); break }
        case 4: { this.ConditionEditor.insert('='); break }
        case 5: { this.ConditionEditor.insert('!='); break }
        case 6: { this.ConditionEditor.insert('4'); break }
        case 7: { this.ConditionEditor.insert('5'); break }
        case 8: { this.ConditionEditor.insert('6'); break }
        case 9: { this.ConditionEditor.insert('/'); break }
        case 10: { this.ConditionEditor.insert('>'); break }
        case 11: { this.ConditionEditor.insert('>='); break }
        case 12: { this.ConditionEditor.insert('7'); break }
        case 13: { this.ConditionEditor.insert('8'); break }
        case 14: { this.ConditionEditor.insert('9'); break }
        case 15: { this.ConditionEditor.insert('+'); break }
        case 16: { this.ConditionEditor.insert('<'); break }
        case 17: { this.ConditionEditor.insert('<='); break }
        case 18: { this.ConditionEditor.insert('0'); break }
        case 19: { this.ConditionEditor.insert('.'); break }
        case 20: { this.ConditionEditor.insert('-'); break }
        case 21: { this.ConditionEditor.insert('('); break }
        case 22: { this.ConditionEditor.insert(')'); break }
      }
      this.ConditionEditor.focus()
    },
    clearInput () {
      this.ConditionEditor.setValue('')
    },
    cancel () {
      this.editSqlModal = false
      this.SqlConnectorModal = false
    },
    saveConditionSqlEditor () {
      if (this.modal_title === '关联条件sql编辑') { this.joinCondition = $.trim(this.ConditionEditor.getValue()) } else if (this.modal_title === '清洗条件sql编辑') { this.cleanCondition = $.trim(this.ConditionEditor.getValue()) }
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
      let column = {
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
      this.modal_title = 'SQL编辑器'
      this.editSqlModal = true
      this.editor.setValue(this.form_sql)
    },
    // 执行sql语句
    runSql () {
      if (this.selected_extract_dataSourceId == -1) {
        this.message('未选取抽取数据源，不能运行SQL！')
        return
      }
      this.sql_result.result_code = 2
      let sql = $.trim(this.editor.getValue())
      let that = this
      let param = {
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
          let table = data.data
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
          for (let row in table[1]) {
            rowNum = table[1][row]
          }
          // 数据
          let tableData = []
          for (let i = 2; i < table.length; i++) {
            tableData.push(table[i])
          }
          if (columnNames.length > 7) {
            let c_start = columnNames[0]
            let c_end = columnNames[columnNames.length - 1]
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
      // this.custom_sql = $.trim(this.editor.getValue());
      this.editSqlModal = false
    },
    // 将填写的抽取信息转化为sql语句
    getFormSql: function () {
      let readcolumns = this.getColumnInfo(this.selected_extract_column).readcolumns
      let sql = ''
      if (this.isJoin == 1) {
        // 关联查询直接加关联条件
        let readColumnArray = readcolumns.split(';')
        let selectColumn = ''
        for (let x of readColumnArray) {
          selectColumn += x + ','
        }
        sql = 'SELECT ' + selectColumn.substr(0, selectColumn.length - 1)
        let select_table = ''
        for (let i = 0; i < this.select_extract_table.length; i++) {
          select_table += this.select_extract_table[i]
          if (i != this.select_extract_table.length - 1) { select_table += ',' }
        }
        sql = sql + ' FROM ' + select_table
        if (this.joinCondition != '') {
          sql += ' WHERE ' + this.joinCondition
          if (this.cleanCondition != '') {
            sql += ' AND ' + this.cleanCondition
          }
        } else {
          if (this.cleanCondition != '') {
            sql += ' WHERE ' + this.cleanCondition
          }
        }
      } else {
        // 选择不用关联条件时，判断表单个数，一个抽取表单对应一条简单的sql语句
        let readColumnArray = readcolumns.split(';')
        for (let x of readColumnArray) {
          let t = x.split('.')[0]
          let s = 'SELECT ' + x + ' FROM ' + t
          sql = sql + s + '#'
        }
        sql = sql.substr(0, sql.length - 1)
      }

      // 是否启用转换条件
      if (this.useTransformCondition == '1') { // 启用转换条件时
        let columnsArray = this.getWriteTransFormColumnsInfo()
        for (let x of columnsArray) {
          if (x.transform_type === '0') { // 单位转换
            let replaceStr = x.danwei_transform_function.replace('x', x.column_name)
            sql = sql.replace(x.column_name, replaceStr)
          } else if (x.transform_type === '1') { // 日期转换
            // 怎么做？
            if (x.date_transform_type === '0') { // 时间戳转日期
              let replaceStr = 'from_unixtime(' + x.column_name + ')'
              sql = sql.replace(x.column_name, replaceStr)
            } else if (x.date_transform_type === '1') { // 日期转时间戳
              let replaceStr = 'unix_timestamp(' + x.column_name + ')'
              sql = sql.replace(x.column_name, replaceStr)
            }
          }
        }
      }
      return sql
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
        let that = this
        let param = {
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
            let tables = data.tables
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
      let tableName = this.writeTables[m].table_name
      let that = this
      let param = {
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
          let columns = data.columns
          // 设置显示的column列表
          for (let i = 0; i < columns.length; i++) {
            let columnName = columns[i].split('（')[0].split('.')[1]
            if (columnName == value) {
              let columnType = columns[i].split('（')[1].split('，')[0]
              let columnSize = columns[i].split('（')[1].split('，')[1].split('）')[0]
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
      let strategy = this.$route.params.update_strategy
      this.strategyName = strategy.strategyname
      // 执行次数初始化
      this.runCount = strategy.executioncount

      this.joinCondition = strategy.joincondition
      this.cleanCondition = strategy.dataclean
      // 更新过程导入转换条件
      if (strategy.datatransform == '') {
        this.useTransformCondition = '0'
      } else {
        this.useTransformCondition = '1'
        this.writeTransFormColumns = JSON.parse(strategy.datatransform)
      }
      // 处理主题信息
      let theme = strategy.theme
      if (theme == undefined || theme == '' || theme == null) {
        this.theme_select_model = '-1'
      } else {
        this.theme_select_model = theme['id']
      }

      // this.loadTable = strategy.writetable;
      // this.loadColumn = strategy.writecolumns;
      this.isJoin = strategy.etltype
      let t = strategy.readtables.split(';')
      this.select_extract_table = t
      // this.extractTableChange(this.select_extract_table);
      // this.selected_extract_column = strategy.readcolumns
      // this.column_type = strategy.columntypes;
      // this.column_size = strategy.columnsize;
      // let columns = this.splitStr(strategy.readcolumns);
      // let types = this.splitStr(strategy.columntypes);
      // let size = this.splitStr(strategy.columnsize);
      // let rs = [];
      // for (let i=0; i<columns.length; i++){
      //     rs.push(columns[i] + "（" + types[i] + "，" + size[i] + "）");
      // }
      // this.selected_extract_column = rs;
      this.selected_extract_dataSourceId = strategy.etlExtractDataSource.id
      // 初始化writeTables
      let tableArray = strategy.writetable.split(';')
      let columnNamesArray = strategy.writecolumns.split(';')
      let columnTypesArray = strategy.columntypes.split(';')
      let columnSizesArray = strategy.columnsize.split(';')
      let writeTables = []
      for (let i = 0; i < tableArray.length; i++) {
        let table = {}
        table.table_name = tableArray[i]
        table.column_names = columnNamesArray[i].split(',')
        table.column_types = columnTypesArray[i].split(',')
        table.column_sizes = columnSizesArray[i].split(',')
        writeTables.push(table)
      }
      this.writeTables = writeTables

      // 转换条件选择表单有变化，更新它
      this.getTransformColumns()
    },
    // 获取所有主题
    getTheme: function () {
      let that = this
      let dataList = [{ value: '-1', label: '未选择' }]// 初始化主题选择框
      this.themeChooseList = []// 清空主题选择框
      let param = {}
      axios({
        method: 'post',
        url: this.GLOBAL.etlUrl + 'etl/getTheme',
        withCredentials: true,
        params: param
      }).then(function (response) {
        var data = response.data
        let status = data['status']
        if (status == '0') { // 正确返回结果
          let resultList = data['resultList']
          for (let i = 0; i < resultList.length; i++) {
            let dom = resultList[i]
            dom['value'] = resultList[i]['id']
            dom['label'] = resultList[i]['themename']
            dataList.push(dom)
          }
          that.themeChooseList = dataList
        } else {
          console.log(status)// 控制台提示报错
        }
      })
    },
    updateStrategy: function () {
      if (this.checkAddData()) {
        let that = this
        let column_info = this.getColumnInfo(this.selected_extract_column)
        let sql = this.form_sql
        let datatransform = ''
        if (this.useTransformCondition == '1') { // 启用转换条件时
          datatransform = JSON.stringify(this.writeTransFormColumns)
        }
        let param = {
          loginname: 'superadmin',
          id: this.$route.params.update_strategy.id,
          strategyname: this.strategyName,
          extractresource: this.selected_extract_dataSourceId,
          loadresource: this.select_load_dataSource,
          etltype: this.isJoin,
          executioncount: this.runCount,
          readtables: this.getReadTable(),
          readcolumns: column_info.readcolumns,
          joincondition: this.joinCondition,
          writetable: this.getWriteInfo().tableNames,
          writecolumns: this.getWriteInfo().columnNames,
          dataclean: this.cleanCondition,
          datatransform: datatransform,
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
                  name: 'etlEdit_page'
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
        let that = this
        let column_info = this.getColumnInfo(this.selected_extract_column)
        let sql = this.form_sql
        let datatransform = ''
        if (this.useTransformCondition == '1') { // 启用转换条件时
          datatransform = JSON.stringify(this.writeTransFormColumns)
        }
        let param = {
          loginname: 'superadmin',
          strategyname: this.strategyName,
          extractresource: this.selected_extract_dataSourceId,
          loadresource: this.select_load_dataSource,
          etltype: this.isJoin,
          executioncount: 0,
          readtables: this.getReadTable(),
          readcolumns: column_info.readcolumns,
          joincondition: this.joinCondition,
          writetable: this.getWriteInfo().tableNames,
          writecolumns: this.getWriteInfo().columnNames,
          dataclean: this.cleanCondition,
          datatransform: datatransform,
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
                // 需要处理
                that.closeTag({
                  name: 'etlEdit_page'
                })
                that.$router.push({
                  name: '策略管理'
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
      if (this.select_extract_table.length == 0) {
        this.message('请选择待抽取数据表单！')
        return false
      }
      if (this.selected_extract_column.length == 0) {
        this.message('请选择待抽取字段！')
        return false
      }
      /* if($.trim(this.joinCondition) == ""){
               this.message("请填写关联条件！");
               return false;
           } */

      // 判断转换条件中是否有空值
      if (this.useTransformCondition === '1') { // 如果开启了转换条件
        for (let column of this.writeTransFormColumns) {
          if (column.column_name == '') {
            this.message('请选择转换列名！')
            return false
          }
          if (column.transform_type == '') {
            this.message('请选择转换类型！')
            return false
          }
          if (column.transform_type === '0' && column.danwei_transform_function == '') {
            this.message('请填写单位转换函数！')
            return false
          }
          if (column.transform_type === '1' && column.date_transform_type == '') {
            this.message('请选择日期转换类型！')
            return false
          }
        }
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
      if ($.trim(this.writeTables[0].table_name) == '') {
        this.message('请填写加载数据表单！')
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
      let tables = this.writeTables
      let tableNames = ''
      let columnNames = ''
      let columnTypes = ''
      let columnSizes = ''
      let rs = {}

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
      let result = []
      let ss = str.split(';')
      for (let s of ss) {
        let c_array = s.split(',')
        for (let c of c_array) {
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
        let strategy = this.$route.params.update_strategy
        // console.log('created: ')
        // console.log(strategy)
        this.loadDataSources()
        this.select_extract_dataSource = strategy.etlExtractDataSource.id
        this.select_load_dataSource = strategy.etlLoadDataSource.id
        let that = this
        let param = {
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
            let tables = data.tables
            // 设置显示的table列表
            let ls = []
            for (let i = 0; i < tables.length; i++) {
              ls.push({
                key: tables[i],
                label: tables[i]
              })
            }
            that.extract_table = ls
            that.initUpdatePage()
          } else {
            console.log('所选取的数据源为无效数据源！')
          }
        })
        let param2 = {
          dataId: strategy.etlExtractDataSource.id,
          tableName: strategy.readtables
        }
        let extractColumns = this.splitStr(strategy.readcolumns)
        axios({
          method: 'post',
          url: this.GLOBAL.etlUrl + 'api/get_columns',
          withCredentials: true,
          params: param2
        }).then(function (response) {
          var data = response.data
          if (data['status']) {
            let columns = data.columns
            // 设置显示的column列表
            let ls = []
            for (let i = 0; i < columns.length; i++) {
              ls.push({
                key: columns[i],
                label: columns[i]
              })
            }
            // 穿梭框内所有字段
            that.extract_column = ls
            let selectedExtractColumns = []
            for (let i = 0; i < ls.length; i++) {
              for (let j = 0; j < extractColumns.length; j++) {
                // if (ls[i]['key'].indexOf(extractColumns[j]) >= 0) {
                // console.log(ls[i]['key'].split('（')[0] + '|' + extractColumns[j])
                // 防止空格，换行符等等显示两个字符串一致但是不相等
                let a = ls[i]['key'].split('（')[0].trim().replace(/\+/g, '').replace(/[ ]/g, '').replace(/[\r\n]/g, '')
                let b = extractColumns[j].trim().replace(/\+/g, '').replace(/[ ]/g, '').replace(/[\r\n]/g, '')
                if (a === b) {
                  selectedExtractColumns.push(ls[i]['key'])
                }
              }
            }
            that.selected_extract_column = selectedExtractColumns
          } else {
            console.log('获取列名后台错误！')
          }
        })
        this.form_sql = strategy.remark
        this.changeLoadSource(strategy.etlLoadDataSource.id)
        this.getTables(strategy.etlExtractDataSource.id)
      }
    }

  },

  created () {
    this.initpage()
    // 页面加载时获取所有的主题
    this.getTheme()
  },

  mounted () {
    this.loadDataSources()
    // ace编辑器
    let editor_1 = ace.edit(this.$refs.ace)
    editor_1.setTheme(this.themePath)
    editor_1.session.setMode(this.modePath)
    // 字体大小
    editor_1.setFontSize(18)
    // 设置只读（true时只读，用于展示代码）
    editor_1.setReadOnly(false)
    // 自动换行,设置为off关闭
    // 自动换行,设置为off关闭
    editor_1.setOption('wrap', 'free')
    // 启用提示菜单
    ace.require('ace/ext/language_tools')
    editor_1.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    })
    this.ConditionEditor = editor_1
    // sql ace编辑器
    let editor = ace.edit(this.$refs.code)
    editor.setTheme(this.themePath)
    editor.session.setMode(this.modePath)
    // 字体大小
    editor.setFontSize(18)
    // 设置只读（true时只读，用于展示代码）
    editor.setReadOnly(false)
    // 自动换行,设置为off关闭
    // 自动换行,设置为off关闭
    editor.setOption('wrap', 'free')
    editor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true
    })
    this.editor = editor
  },
  // updated每次页面渲染后都会执行,给transfer控件显示添加bootstrap的tooltip效果
  updated () {
    // 获取所有class="ivu-transfer-list-content-item"的元素
    $('.ivu-transfer-list-content-item').each(function () {
      let value = $(this).find('span').text()
      $(this).attr('data-toggle', 'tooltip')
      $(this).attr('title', value)
    })

    this.form_sql = this.getFormSql()
  }

}

</script>

<style>

</style>
