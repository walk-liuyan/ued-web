<template>
  <div class="container">
    <div class="p-20">
      <div v-if="data">
        <Row :gutter="16">
          <Col :xs="24" :sm="8" :md="6" :lg="6">
          <Card>
            <div class="tc">
              <img :src="data.picture[0]" alt="" class="w-100" v-if="data && data.picture">
              <h3 v-if="data && data.title" class="m-b-10">{{data.title}}</h3>
              <p v-if="data && data.summary">{{data.summary}}</p>
            </div>
            <div class="tr p-t-10">
              <a :href="data.myPage" target="_blank" v-if="data && data.myPage">查看更多 <i class="fa fa-angle-right"></i></a>
            </div>
          </Card>
          <div class="p-b-15"></div>
          </Col>
          <Col :xs="24" :sm="16" :md="18" :lg="18">
          <Card>
            <div v-if="data && data.content" class="markdown-body">
              <div v-html="data.content"></div>
            </div>
          </Card>
          <div class="p-b-15"></div>
          </Col>
        </Row>
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

  export default{
    data() {
      return {
        ing: false,
        data: null,
        test: null,
      }
    },
    created() {
      const about = this.queryAbout()
      const createdBy = AV.Object.createWithoutData('_User', currentEnv.belongTo)
      about.equalTo('createdBy', createdBy).descending('updatedAt').find()
        .then((res) => {
          this.data = res[0].toJSON()
          this.data.content = converter.makeHtml(this.data.content)
        })
        .catch((err) => {
          console.log('err', err)
          this.$Message.error('出错啦')
        })
    },
    mixins: [FnMixins, ModelMixins],
  }
</script>
