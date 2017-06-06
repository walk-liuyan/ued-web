<template>
  <div class="navigator_bar pos-rel">
    <div class="container">
      <Row :gutter="16">
        <Col :xs="24" :sm="18" :md="18" :lg="20">
        <ul class="m-0 p-0">
          <li class="dib"><router-link to="/" class="c-white fz-16 p-l-15 p-r-15"><Icon type="ios-home"></Icon> 主页</router-link></li>
          <li class="dib"><router-link to="/articles/list/all" class="c-white fz-16 p-l-15 p-r-15"><Icon type="planet"></Icon> 文章</router-link></li>
          <li class="dib"><router-link to="/articles/list/591bb201da2f60005d0d5190" class="c-white fz-16 p-l-15 p-r-15"><Icon type="code"></Icon> 案例</router-link></li>
          <li class="dib"><router-link to="/about" class="c-white fz-16 p-l-15 p-r-15"><Icon type="ios-body"></Icon> 关于我</router-link></li>
        </ul>
        </Col>
        <Col :xs="24" :sm="6" :md="6" :lg="4">
        <div class="p-t-10"></div>
        <Input v-model="searching">
        <Button slot="append" icon="ios-search" @click="searchIt"></Button>
        </Input>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script>
  import FnMixins from '../../assets/js/fn-mixins'
  import ModelMixins from '../../assets/js/model-mixins'

  export default {
    data() {
      return {
        navList: [],
        searching: '',
      }
    },
    methods: {
      searchIt() {
        if (this.searching) {
          this.$store.dispatch('temporaryData', this.searching).then(() => {
            if (this.$route.name !== 'Result') {
              this.$router.push('/result')
            }
          }).catch((err) => {
            console.log('err', err)
            this.$Message.error('出错啦')
          })
        } else {
          this.$Message.error('必须输入关键字')
        }
      },
    },
    created() {
      const Category = this.queryCategory()
      Category.find().then((res) => {
        this.navList = _.map(res, (item) => {
          return item.toJSON()
        })
      }).catch((err) => {
        console.log('err', err)
        this.$Message.error('出错啦')
      })
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>
