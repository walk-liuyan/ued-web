<template>
  <div class="face_area m-b-15">
    <div class="container tc">
      <div class="p-t-20"></div>
      <div class="p-t-30"></div>
      <transition
        name="bounce"
      >
        <img :src="`${aboutData.picture}?imageView2/1/w/80/h/80/q/75`" alt="" class="doge" v-if="aboutData && aboutData.picture">
      </transition>
      <div class="p-t-30"></div>
      <h1 class="c-white n i fz-34" v-if="aboutData && aboutData.title">{{aboutData.title}}</h1>
      <div class="p-b-20"></div>
      <p class="c-white fz-18" v-if="aboutData && aboutData.summary">{{aboutData.summary}}</p>
      <div class="p-b-30"></div>
      <div class="p-b-30"></div>
      <div class="p-b-25"></div>
    </div>
  </div>
</template>
<script type="text/babel">
  import ModelMixins from '../../assets/js/model-mixins'
  import FnMixins from '../../assets/js/fn-mixins'
  import FiltersMixins from '../../assets/js/filters-mixins'
  import Face from '../common/face'
  import CardArticle from '../common/card_article'
  import FooterArea from '../common/footer'

  export default{
    components: {
      CardArticle,
      Face,
      FooterArea,
    },
    data() {
      return {
        aboutData: {},
      }
    },
    created() {
      const createdBy = AV.Object.createWithoutData('_User', currentEnv.belongTo)
      const about = this.queryAbout()
      about.equalTo('createdBy', createdBy).descending('updatedAt').find()
        .then((res) => {
          this.aboutData = res[0].toJSON()
        })
        .catch((err) => {
          console.log('err', err)
          this.$Message.error('出错啦')
        })
    },
    mixins: [FnMixins, ModelMixins, FiltersMixins],
  }
</script>
