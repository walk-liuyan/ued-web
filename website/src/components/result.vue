<template>
  <div class="container p-t-20 p-b-20">
    <div class="bg-white rounded box_shadow overflow-hidden p-20">
      <div v-if="posts">
        <div v-if="posts.length">
          <CardArticle :posts="posts"></CardArticle>
          <div class="tc" v-if="posts.length !== count">
            <Button type="success" @click="addMorePosts">查看更多</Button>
          </div>
        </div>
        <div class="tc" v-else>
          <Alert type="error">没有搜索结果</Alert>
        </div>
      </div>
      <div class="spin-auto auto p-t-20" v-else>
        <Spin fix></Spin>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  import ModelMixins from '../assets/js/model-mixins'
  import FnMixins from '../assets/js/fn-mixins'
  import FiltersMixins from '../assets/js/filters-mixins'
  import CardArticle from './common/card_article'

  export default{
    components: {
      CardArticle,
    },
    data() {
      return {
        count: null,
        posts: null,
        pageSize: 10,
      }
    },
    methods: {
      query() {
        const titleQuery = new AV.Query('Posts')
        const summaryQuery = new AV.Query('Posts')
        const contentQuery = new AV.Query('Posts')
        titleQuery.contains('title', this.searching)
        summaryQuery.contains('summary', this.searching)
        contentQuery.contains('content', this.searching)
        return AV.Query.or(titleQuery, summaryQuery, contentQuery)
      },
      createdBy() {
        return AV.Object.createWithoutData('_User', currentEnv.belongTo)
      },
      addMorePosts() {
        this.$Loading.start()
        const skip = this.posts.length || 0
        const posts = this.query()
        posts.equalTo('createdBy', this.createdBy()).descending('updatedAt').limit(this.pageSize).skip(skip)
          .find()
          .then((res) => {
            const finalRes = _.map(res, (item) => {
              const obj = item.toJSON()
              obj.categoryObj = item.get('category').toJSON()
              return obj
            })
            this.posts = this.posts.concat(finalRes)
            this.$Loading.finish()
          })
          .catch((err) => {
            console.log('err', err)
            this.$Loading.error()
            this.$Message.error('出错啦')
          })
      },
      setUpPosts() {
        this.$Loading.start()
        this.posts = null
        const posts = this.query()
        posts.equalTo('createdBy', this.createdBy()).descending('updatedAt').limit(this.pageSize).find()
          .then((res) => {
            this.posts = _.map(res, (item) => {
              return item.toJSON()
            })
            this.$Loading.finish()
          })
          .catch((err) => {
            console.log('err', err)
            this.$Loading.error()
            this.$Message.error('出错啦')
          })
        posts.count().then((res) => {
          this.count = res
        }).catch((err) => {
          console.log('err', err)
          this.$Loading.error()
          this.$Message.error('出错啦')
        })
      },
    },
    computed: {
      searching() {
        return this.$store.getters.temporaryData
      },
    },
    watch: {
      searching() {
        this.setUpPosts()
      },
    },
    created() {
      this.setUpPosts()
    },
    mixins: [FnMixins, ModelMixins, FiltersMixins],
  }
</script>
