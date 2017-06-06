<template>
  <div id="app">
    <Navigator></Navigator>
    <transition name="fade-fast">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import Navigator from './components/common/navigator'
  import FooterArea from './components/common/footer'
  import ApiMixin from './assets/js/apis-mixins'

  export default {
    name: 'app',
    components: {
      FooterArea,
      Navigator,
    },
    data() {
      return {
        data: null,
      }
    },
    mixins: [ApiMixin],
  }
</script>
