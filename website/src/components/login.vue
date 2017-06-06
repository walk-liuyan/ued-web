<template>
  <Row>
    <Col span="8" offset="8">
    <div class="p-t-30"></div>
    <div class="spin-auto auto" v-if="ing">
      <Spin fix></Spin>
    </div>
    <div v-else>
      <Card>
        <Form :model="loginInputs" ref="loginForm" :rules="loginRules" :label-width="80">
          <Form-item label="用户名" prop="username">
            <Input v-model="loginInputs.username" placeholder="请输入">
            </Input>
          </Form-item>
          <Form-item label="密码" prop="password">
            <Input v-model="loginInputs.password" placeholder="请输入" type="password">
            </Input>
          </Form-item>
          <Form-item>
            <Button type="primary" @click="handleSubmit('loginForm')">提交</Button>
            <Button type="ghost" style="margin-left: 8px" @click="handleReset('loginForm')">取消</Button>
          </Form-item>
        </Form>
      </Card>
      <div class="copy">
        <div class="p-t-15 p-b-15 tc c-bluegray">
          <router-link to="/signup" class="c-bluegray">Join !</router-link>
        </div>
      </div>
    </div>
    </Col>
  </Row>
</template>
<script type="text/babel">
  import ModelMixins from '../assets/js/model-mixins'
  import FnMixins from '../assets/js/fn-mixins'

  export default{
    data() {
      return {
        ing: false,
        loginInputs: {
          username: null,
          password: null,
        },
        loginRules: {
          username: { required: true, message: '必填', trigger: 'blur' },
          password: { required: true, message: '必填', trigger: 'blur' },
        },
      }
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.ing = true
            this.logIn(this.loginInputs.username, this.loginInputs.password)
            .then((currentUser) => {
              this.$store.dispatch('currentUserInfo', currentUser.toJSON()).then(() => {
                this.$Message.success('提交成功!')
                this.ing = false
                this.$router.push('/admin/articles')
              })
            }).catch((error) => {
              this.ing = false
              console.log('error', error)
              this.$Message.error('出错啦')
            })
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
      },
      handleReset(name) {
        this.$refs[name].resetFields()
      },
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>
