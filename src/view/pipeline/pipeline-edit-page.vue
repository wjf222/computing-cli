<template>
  <div>
    <Row :gutter="14" style="margin-top: 14px;">
      <i-col span="8">
        <Card>
          <p slot="title">
            <Icon type="ios-color-wand"></Icon>
            节点一
          </p>
          <Row type="flex" justify="center" align="middle" class="countto-page-row">
            <div class="count-to-con">
            </div>
          </Row>
        </Card>
      </i-col>
      <i-col span="8" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="ios-shuffle-strong"></Icon>
            节点二
          </p>
          <Row type="flex" justify="center" align="middle" class="countto-page-row">
            <div class="count-to-con">
            </div>
          </Row>
        </Card>
      </i-col>
      <i-col span="8" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="android-stopwatch"></Icon>
            节点三
          </p>
          <Row type="flex" justify="center" align="middle" class="countto-page-row">
            <div class="count-to-con">
            </div>
          </Row>
        </Card>
      </i-col>
    </Row>
    <Row :gutter="14" style="margin-top: 14px;">
      <i-col span="8" class="padding-left-10">
        <Card>
          <p slot="title">
            <Icon type="android-stopwatch"></Icon>
            添加新节点
          </p>
          <Row type="flex" justify="center" align="middle" class="countto-page-row">
            <div class="count-to-con">
            </div>
          </Row>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import CountTo from '_c/count-to'
export default {
  name: 'count_to_page',
  components: {
    CountTo
  },
  data () {
    return {
      end: 0,
      unit: [[3, '千多'], [4, '万多'], [5, '十万多']],
      unit2: [[1, '十多'], [2, '百多'], [3, '千多'], [4, '万多'], [5, '十万多'], [6, '百万多'], [7, '千万多'], [8, '亿多']],
      asynEndVal: 487,
      integratedEndVal: 3
    }
  },
  methods: {
    init () {
      setInterval(() => {
        this.asynEndVal += parseInt(Math.random() * 20)
        this.integratedEndVal += parseInt(Math.random() * 30)
      }, 2000)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less">
@baseColor: ~"#dc9387";
.countto-page-row{
  height: 200px;
}
.count-to-con{
  display: block;
  width: 100%;
  text-align: center;
}
.count-text{
  font-size: 50px;
  color: @baseColor;
}
.slot-text{
  font-size: 22px;
}
.unit-class{
  font-size: 30px;
  color: @baseColor;
}
</style>
