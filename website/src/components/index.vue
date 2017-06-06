<template>
  <div>
    <Face></Face>
    <div class="container">
      <h2 class="tc m-b-25"><Icon type="fireball" class="c-red"></Icon> Top</h2>
      <div v-if="tops && tops.length">
        <Card class="m-b-15" v-for="item in tops" v-if="item.status === 1" :key="item.objectId">
          <p slot="title"><router-link :to="`/articles/content/${item.objectId}`" class="c-g6">{{item.title}}</router-link></p>
          <p class="ti2" v-if="item.summary">{{item.summary | truncate(80)}}</p>
          <p v-else>没有摘要...</p>
          <div class="tr">
            <router-link :to="`/articles/content/${item.objectId}`">阅读全文 <i class="fa fa-angle-right"></i></router-link>
          </div>
        </Card>
      </div>
      <div class="tc c-g9" v-else>
        <Alert type="error">没有文章</Alert>
      </div>
      <div class="p-t-30 p-b-30">
        <img src="../assets/images/line.svg" alt="" class="w-100">
      </div>
    </div>
    <div class="container">
      <h2 class="tc m-b-25">文章</h2>
      <div v-if="posts && posts.length">
        <Card class="m-b-15" v-for="post in posts" v-if="post.status === 1" :key="post.objectId">
          <p slot="title"><router-link :to="`/articles/content/${post.objectId}`" class="c-g6">{{post.title}}</router-link></p>
          <p class="ti2" v-if="post.summary">{{post.summary | truncate(80)}}</p>
          <p v-else>没有摘要...</p>
          <div class="tr">
            <router-link :to="`/articles/content/${post.objectId}`">阅读全文 <i class="fa fa-angle-right"></i></router-link>
          </div>
        </Card>
        <div class="tc">
          <Button type="success" @click="goToLink(`/articles/list/all`)">查看更多</Button>
        </div>
      </div>
      <div class="tc c-g9" v-else>
        <Alert type="error">没有文章</Alert>
      </div>
    </div>
    <div class="p-b-30"></div>
    <div class="p-b-30"></div>
    <FooterArea></FooterArea>
  </div>
</template>
<script type="text/babel">
  import ModelMixins from '../assets/js/model-mixins'
  import FnMixins from '../assets/js/fn-mixins'
  import FiltersMixins from '../assets/js/filters-mixins'
  import Face from './common/face'
  import CardArticle from './common/card_article'
  import FooterArea from './common/footer'

  export default{
    components: {
      CardArticle,
      Face,
      FooterArea,
    },
    data() {
      return {
        posts: null,
        tops: null,
        pageSize: 10,
      }
    },
    created() {
      const posts = this.queryPosts()
      const tops = this.queryPosts()
      const createdBy = AV.Object.createWithoutData('_User', currentEnv.belongTo)
      tops.equalTo('createdBy', createdBy).equalTo('onTop', 1).descending('updatedAt').limit(5)
        .find()
        .then((res) => {
          this.tops = _.map(res, (item) => {
            return item.toJSON()
          })
        })
        .catch((err) => {
          console.log('err', err)
          this.$Message.error('出错啦')
        })
      posts.equalTo('createdBy', createdBy).notEqualTo('onTop', 1).descending('updatedAt').limit(5)
        .find()
        .then((res) => {
          this.posts = _.map(res, (item) => {
            return item.toJSON()
          })
        })
        .catch((err) => {
          console.log('err', err)
          this.$Message.error('出错啦')
        })
    },
    mixins: [FnMixins, ModelMixins, FiltersMixins],
  }
</script>
