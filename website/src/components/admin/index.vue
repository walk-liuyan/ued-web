<template>
  <div class="container p-20">
    <div class="bg-white rounded box_shadow overflow-hidden">
      <div class="p-20 dn">
        <Button type="primary" @click="showCurrentUser">当前用户</Button>
        <Button type="error" @click="handleLogOut">注销</Button>
        <Button type="primary" @click="signIn">注册</Button>
        <Button type="error" @click="addToGroup">当前用户加入管理组</Button>
        <Button type="primary" @click="addPosts">添加一篇文章</Button>
        <Button type="primary" @click="getPosts">查询文章</Button>
        <Button type="primary" @click="loginAdmin">管理员登录</Button>
      </div>
      <Row>
        <Col :xs="24" :sm="8" :md="4" :lg="4">
        <Menu active-name="1" width="auto">
          <Menu-group title="管理选项">
            <Menu-item name="1" @click.native="goToLink(`/admin/articles`)">
              <Icon type="document-text"></Icon>
              文章
            </Menu-item>
            <Menu-item name="2" @click.native="goToLink(`/admin/category`)">
              <Icon type="document-text"></Icon>
              分类
            </Menu-item>
            <Menu-item name="3" @click.native="goToLink(`/admin/carousel`)">
              <Icon type="document-text"></Icon>
              幻灯片
            </Menu-item>
            <Menu-item name="4" @click.native="goToLink(`/admin/about`)">
              <Icon type="document-text"></Icon>
              关于我
            </Menu-item>
            <Menu-item name="5" @click.native="showCurrentUser">
              <Icon type="document-text"></Icon>
              当前用户
            </Menu-item>
            <Menu-item name="6" @click.native="handleLogOut">
              <Icon type="document-text"></Icon>
              注销
            </Menu-item>
          </Menu-group>
        </Menu>
        </Col>
        <Col :xs="24" :sm="16" :md="20" :lg="20">
        <div class="p-20">
          <transition name="fade-fast">
            <router-view></router-view>
          </transition>
        </div>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script type="text/babel">
  import FnMixins from '../../assets/js/fn-mixins'
  import ModelMixins from '../../assets/js/model-mixins'

  export default{
    data() {
      return {
        navList: [],
        currentUserData: null,
      }
    },
    methods: {
      signIn() {
        const user = new AV.User()
        user.setUsername('bigboss')
        user.setPassword('cat!@#123')
        user.signUp().then(() => {
          console.log('注册成功')
        })
      },
      loginAdmin() {
        this.logIn('admin', 'admin')
      },
      handleLogOut() {
        this.logOut()
        console.log('this.currentUser()', this.currentUser())
      },
      showCurrentUser() {
        this.$Message.info(`当前登录用户: ${this.currentUser().username}`)
      },
      createGroup() {
        const roleAcl = new AV.ACL()
        roleAcl.setPublicReadAccess(true)
        roleAcl.setPublicWriteAccess(false)
        roleAcl.setWriteAccess(AV.User.current(), true)
        const administratorRole = new AV.Role('Administrator', roleAcl)
        administratorRole.save().then((role) => {
          console.log('创建成功', role)
          const roleQuery = new AV.Query(AV.Role)
          roleQuery.equalTo('name', 'Administrator')
          roleQuery.equalTo('users', AV.User.current())
          roleQuery.find().then((results) => {
            if (results.length > 0) {
              role = results[0]
              return administratorRole
            }
            const relation = role.getUsers()
            relation.add(AV.User.current())
            return role.save()
          }).then((res) => {
            console.log('administratorRole', res)
          }).catch((error) => {
            console.log(error)
          })
        }).catch((error) => {
          console.log(error)
        })
      },
      addToGroup() {
        const roleQuery = new AV.Query(AV.Role)
        roleQuery.equalTo('name', 'Administrator')
        roleQuery.equalTo('users', AV.User.current())
        roleQuery.find().then((results) => {
          if (results.length > 0) {
            return results[0]
          }
          const relation = roleQuery.getUsers()
          relation.add(AV.User.current())
          return roleQuery.save()
        }).then((role) => {
          console.log('administratorRole', role)
        }).catch((error) => {
          console.log(error)
        })
      },
      addPosts() {
        const user = this.currentUser()
        const posts = this.modelPosts()
        posts.save({
          remark: 'test remark',
          createdBy: user,
          content: 'test content',
          title: 'test title',
          category: AV.Object.createWithoutData('Category', '591090eb44d904007bf44efe'),
        }).then((res) => {
          console.log('添加成功', res)
        })
      },
      getPosts() {
        const posts = this.queryPosts()
        posts.equalTo('title', 'test title').include(['category']).find().then((res) => {
          const finalRes = _.map(res, (item) => {
            const obj = item.toJSON()
            obj.categoryObj = item.get('category').toJSON()
            return obj
          })
          console.log('文章列表', finalRes)
        })
        .catch((err) => {
          console.log('err', err)
        })
      },
    },
    created() {
      this.currentUserData = this.currentUser() || null
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>
