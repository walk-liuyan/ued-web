<template>
  <div class="p-20">
    <div class="ivu-article" v-if="post">
      <h2>{{post.title}}</h2>
      <p><small>{{post.createdAt | dateFormat('L')}}</small></p>
      <div class="p-t-15 content_area">
        <div v-html="post.content"></div>
      </div>
      <div class="p-t-30 p-b-30">
        <img src="../../assets/images/line.svg" alt="" class="w-100">
      </div>
      <vue-images :imgs="images" v-if="images"
                  :modalclose="true"
                  :keyinput="true"
                  :mousescroll="true"
                  :showclosebutton="true"
                  :showcaption="true"
                  :showthumbnails="true"></vue-images>
    </div>
  </div>
</template>
<script type="text/babel">
  import vueImages from 'vue-images'
  import ModelMixins from '../../assets/js/model-mixins'
  import FnMixins from '../../assets/js/fn-mixins'
  import FiltersMixins from '../../assets/js/filters-mixins'

  export default{
    components: {
      vueImages,
    },
    data() {
      return {
        posts: [],
        post: null,
        contentId: null,
        images: null,
      }
    },
    methods: {
      setUpPost() {
        this.contentId = this.$route.params.contentId
        this.posts = []
        const posts = this.queryPosts()
        posts.get(this.contentId)
        .then((res) => {
          this.post = res.toJSON()
          this.post.categoryObj = res.get('category').toJSON()
          this.post.content = converter.makeHtml(this.post.content)
          this.images = _.map(this.post.pic, (item) => {
            return {
              imageUrl: item,
            }
          })
        }).catch((err) => {
          console.log('err', err)
          this.$Message.error('出错啦')
        })
      },
    },
    created() {
      this.setUpPost()
    },
    watch: {
      $route() {
        this.setUpPost()
      },
    },
    mixins: [FnMixins, ModelMixins, FiltersMixins],
  }
</script>
