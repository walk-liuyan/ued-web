<template>
  <div class="container p-t-20 p-b-20">
    <div class="bg-white rounded box_shadow overflow-hidden">
      <Row>
        <Col :xs="24" :sm="8" :md="4" :lg="4">
        <Menu width="auto" :active-name="categoryId" v-if="navList && navList.length">
          <Menu-group title="分类列表">
            <Menu-item :name="nav.objectId" @click.native="goToLink(`/articles/list/${nav.objectId}`)" v-for="nav in navList" v-if="nav.status === 1" :key="nav.objectId">
              <Icon type="document-text"></Icon>
              {{nav.title}}
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
        categoryId: null,
      }
    },
    created() {
      this.categoryId = this.$route.params.categoryId
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
