<template>
<div class="login" @keydown.enter="login">
  <div class="login-bg">
    <div class="login-con">
      <div class="login-title">鲲博时代Bim运营管理平台</div>
      <div class="login-subtitle">让生活更便捷，系统更方面，未来城市更美好......</div>
      <Form ref="loginForm" :model="loginObj" :rules="rules">
        <FormItem class="login-input-line" prop="userName">
          <Input type="text" v-model="loginObj.userName" placeholder="请输入用户名"></Input>
          <img src="/img/user-login.png" alt="">
        </FormItem>
        <FormItem class="login-input-line" prop="password">
          <Input type="password" v-model="loginObj.password" placeholder="请输入密码"></Input>
          <img src="/img/pass-login.png" alt="">
        </FormItem>
      </Form>
      <button type="button" class="login-btn" @click.prevent="login" :loading="loading">登录</button>
    </div>
  </div>
</div>
</template>
<script>
import Util from '@/utils/index'
export default {
  data () {
    return {
      loginObj: { // 登录用户对象
        userName: '',
        password: ''
      },
      loading: false,
      rules: { // 验证规则
        userName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /**
    * @desc 登录
    */
    login: function () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.post('/system/user/login.do', { name: this.loginObj.userName, password: this.loginObj.password }, r => {
            console.log(r)
            if (r.data.code) {
              let user = {
                id: r.data.obj.id,
                name: r.data.obj.name,
                actual_name: r.data.obj.actual_name,
                status: r.data.obj.status,
                department_id: r.data.obj.department_id,
                position_id: r.data.obj.position_id,
                user_type: r.data.obj.user_type
              }
              if (user.position_id === 119) {
                user.sale_id = r.data.obj.sale_id
              }
              Util.setCookie('userName', r.data.obj.name)
              Util.setCookie('user', JSON.stringify(user))
              this.$store.dispatch('setUser', user)
              localStorage.pageOpenedList = ''
              localStorage.cachePage = ''
              this.$store.state.pageOpenedList = [{ text: '首页', path: '/home', name: 'home', url: '/home' }]
              this.$store.state.cachePage = []
              this.$api.post('/crm/ActionFormUtil/getDataById.do', { tableName: 'db_system_user_position', id: user.position_id }, r => {
                console.log(r)
                let urls = r.data.rows[0].all_path
                // console.log(urls)
                if (!Util.isEmpty(urls)) {
                  if (urls.indexOf(',') !== -1) {
                    Util.setCookie('positionUrls', urls)
                  }
                }
                this.$router.push({
                  name: 'home'
                })
              })
            } else {
              this.loading = false
              this.$swal(r.data.msg, '', 'error')
              return false
            }
        })
      }
    })
  }
}
}
</script>
<style lang="scss">
@import "../style/login";
</style>
