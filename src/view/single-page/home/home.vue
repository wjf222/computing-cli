<template>
    <div class="iframe" >
    <Row class="platform">
      <div class="con_plat con_1 w118">
        <div class="shang_plat">
          <div class="img_new img_plat s_bg_pos1"></div>
          <div>
            <h2>智能运维分析平台的建设以产生决策智能为目标</h2>
            <p>支持IT运维多种数据源提取、融合、梳理整合</p>
            <p>运维流程、故障、异常分析、预测等各个运维场景建立智能化模型</p>
            <p>大数据分析方法，实现提供实时的变更和调度智能决策能力</p>
            <p>提供一站式的运维服务</p>
          </div>
        </div>
      </div> <!--第一组-->

      <!--内容-->

    </Row><!--平台-->
    <Row class="product width">

      <div class="tit_plat w118"><h3>满足多层次需求智能运维产品</h3></div>
      <ul>
        <li onclick="myFunction('RepairStaffMVP')">
          <div class="l">
            <h4 class="tab_plat">运维工程师MVP推荐</h4>
            <p>目标准确、实时推荐、可靠性高<br>机器学习算法支持</p>
            <a href="javascipt:;"  onclick="myFunction('RepairStaffMVP')"  class="understand">了解详情</a>
          </div>
          <div class="r img_new"></div>
        </li>

        <li onclick="myFunction('MaintainAssess')">
          <div class="l">
            <h4 class="tab_plat">维护商质量服务评价</h4>
            <p>稳定系数高、安全、直观可靠<br>运维商推荐体系完备</p>
            <a href="javascipt:;"  onclick="myFunction('MaintainAssess')"  class="understand">了解详情</a>
          </div>
          <div class="r img_new"></div>
        </li>

        <li  onclick="myFunction('theme_config')">
          <div class="l">
            <h4 class="tab_plat">平台主题管理</h4>
            <p>大数据运维平台主题管理<br>主题明了，方便快捷</p>
            <a href="javascipt:;"  onclick="myFunction('theme_config')"  class="understand">了解详情</a>
          </div>
          <div class="r img_new"></div>
        </li>

        <li  onclick="myFunction('biManagePage')">
          <div class="l">
            <h4 class="tab_plat">定制化BI组合图</h4>
            <p>满足运维BI多维度的可视化需求<br>提供特定类型数据的可视化图表组件</p>
            <a href="javascipt:;"  onclick="myFunction('biManagePage')"  class="understand">了解详情</a>
          </div>
          <div class="r img_new"></div>
        </li>

        <li onclick="myFunction('dataSource_manage')">
          <div class="l">
            <h4 class="tab_plat">多源数据抽取</h4>
            <p>支持多源异构数据源中运维数据<br>提供抽取、清洗、转换和集成功能<br>商业智能的联机分析处理基础</p>
            <a href="javascipt:;"  onclick="myFunction('dataSource_manage')"  class="understand">了解详情</a>
          </div>
          <div class="r img_new"></div>
        </li>

        <li>
          <div class="l" onclick="myFunction('moal_config_admin')">
            <h4 class="tab_plat">平台模型构建</h4>
            <p>一站式云服务，<br>助您快速搭建模型应用</p>
            <a href="javascipt:;"  onclick="myFunction('moal_config_admin')"  class="understand">了解详情</a>
          </div>
          <div class="r img_new"></div>
        </li>
      </ul>
<!--      <div class="more"><a href="javascript:;" onclick="myFunction('404')">查看更多产品</a></div>-->
    </Row><!--产品结束-->
    </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: '平台角色数', icon: 'md-person-add', count: 2, color: '#2d8cf0' },
        { title: '累计点击', icon: 'md-locate', count: 232, color: '#19be6b' },
        { title: '策略总数', icon: 'md-help-circle', count: 12, color: '#ff9900' },
        { title: '标签统计', icon: 'md-share', count: 657, color: '#ed3f14' },
        { title: '新增爬虫', icon: 'md-chatbubbles', count: 12, color: '#E46CBB' },
        { title: '页面总数', icon: 'md-map', count: 14, color: '#9A66E4' }
      ],
      pieData: [
        { value: 335, name: '标签管理' },
        { value: 310, name: '知识库管理' },
        { value: 234, name: '算法配置' },
        { value: 135, name: '分析任务配置' },
        { value: 1548, name: 'ETL工具' }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    }
  },
  mounted () {
    //
  }
}
</script>

<style lang="css">
.count-style{
  font-size: 50px;
}
@import './baidu.css';
@import './css.css';
</style>
