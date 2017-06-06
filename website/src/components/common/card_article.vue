<template>
  <div>
    <div class="p-15" v-for="(post, index) in posts" v-if="post.status === 1" :key="post.objectId">
      <h3><router-link :to="`/articles/content/${post.objectId}`" class="c-g6">{{post.title}}</router-link></h3>
      <p><small>{{post.createdAt | dateFormat('L')}}</small></p>
      <div class="p-t-15">
        <p class="ti2">{{post.summary | truncate(80)}}</p>
      </div>
      <div class="tr">
        <router-link :to="`/articles/content/${post.objectId}`">阅读全文 <i class="fa fa-angle-right"></i></router-link>
      </div>
      <div class="p-b-15"></div>
      <div class="bdb_gd" v-if="index < posts.length -1"></div>
    </div>
  </div>
</template>
<script type="text/babel">
  import FiltersMixins from '../../assets/js/filters-mixins'

  export default{
    props: ['posts'],
    mixins: [FiltersMixins],
  }
</script>
