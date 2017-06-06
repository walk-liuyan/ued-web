/**
 * Created by PetitKero on 13/10/2016.
 */
/**
 * This provides mixins used for common api in the Vue components.
 * Before you begin to used it , plz inject this mixins in the components
 * like mixins: [ApiMixin]
 *
 * @mixin
 */

const ModelMixin = {
  handleReqError(req) {
    if (req.data.error) {
      this.$Message.error('出错啦')
    }
    return req.data.error
  },
  handleCatchError(err) {
    console.log('err', err)
    this.$Message.error('出错啦')
    return false
  },
  logOut() {
    this.$Message.success('已退出')
    return AV.User.logOut()
  },
  logIn(userName, password) {
    return AV.User.logIn(userName, password)
  },
  currentUser() {
    const currentUser = AV.User.current()
    if (!currentUser) {
      this.$Message.error('你没有登录')
      this.$router.push('/login')
      return false
    }
    return currentUser.toJSON()
  },
  modelUpdate(table, id) {
    return AV.Object.createWithoutData(table, id)
  },
  modelPosts() {
    const AVObj = AV.Object.extend('Posts')
    const obj = new AVObj()
    obj.setACL(this.commonAcl())
    return obj
  },
  modelCategory() {
    const AVObj = AV.Object.extend('Category')
    const obj = new AVObj()
    obj.setACL(this.commonAcl())
    return obj
  },
  modelAbout() {
    const AVObj = AV.Object.extend('About')
    const obj = new AVObj()
    obj.setACL(this.commonAcl())
    return obj
  },
  modelCarousel() {
    const AVObj = AV.Object.extend('Carousel')
    const obj = new AVObj()
    obj.setACL(this.commonAcl())
    return obj
  },
  queryPosts() {
    return new AV.Query('Posts')
  },
  queryCategory() {
    return new AV.Query('Category')
  },
  queryAbout() {
    return new AV.Query('About')
  },
  queryCarousel() {
    return new AV.Query('Carousel')
  },
  async genToken() {
    return AV.Cloud.run('genUpToken')
  },
}

export default {
  created() {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  },
  methods: ModelMixin,
}
