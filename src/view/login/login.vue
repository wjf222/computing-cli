<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">输入任意用户名和密码即可</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      // if (userName === 'superadmin' && password === 'Nr123456') {
      //   this.$router.push({
      //     name: this.$config.homeName
      //   })
      // }
      this.handleLogin({ userName, password }).then(res => {
        this.getUserInfo().then(res => {
          if (password === 'Whvrildcl1#') {
            this.$router.push({
              name: this.$config.homeName
            })
          } else {
            this.$Modal.error({
              title: '失败',
              content: '账号或者密码错误!'
            })
            console.log('密码账号是：' + userName)
            console.log('密码是：' + password)
          }
        })
      })
    }
  }
}
</script>

<style>

</style>
