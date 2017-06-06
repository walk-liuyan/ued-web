<template>
  <div class="tc">
    <label class="qiniu-upload tc">
      <div class="spin-auto auto p-t-20" v-if="ing">
        <Spin fix></Spin>
      </div>
      <div v-else>
        <div class="p-10">
          <div class="p-t-5"></div>
          <i class="fa fa-plus-circle fa-4x c-blue"></i>
        </div>
        <em>选择图片</em>
        <input id="files" type="file" :accept="accepts" @change="upload" :multiple="multiple">
        <slot></slot>
      </div>
    </label>
  </div>
</template>
<script>
  import ModelMixins from '../../assets/js/model-mixins'

  export default {
    props: {
      accepts: {
        type: String,
        default: 'image/jpeg,image/jpg,image/png,image/gif',
      },
      multiple: [Boolean],
      maxSize: {
        type: Number,
        default: 0,
      },
    },
    data() {
      return {
        file: null,
        ing: false,
        token: null,
      }
    },
    methods: {
      upload(event) {
        const file = event.target.files
        if (file) {
          if (this.maxSize) {
            // todo filter file
          }
          this.$Loading.start()
          this.ing = true
          this.genToken().then((token) => {
            this.token = token
            _(file).forEach((item) => {
              const formData = new FormData()
              formData.append('file', item)
              formData.append('token', this.token)
              axios.post('http://upload.qiniu.com/', formData).then((response) => {
                const result = response.data
                if (result.hash && result.key) {
                  this.$Loading.finish()
                  this.ing = false
                  this.$emit('complete', 200, result)
                } else {
                  this.$Loading.error()
                  this.ing = false
                  this.$emit('complete', 500, result)
                  this.$Message.error('出错了!')
                }
              }).catch((err) => {
                console.log('err', err)
                this.$Message.error('出错啦')
              })
            })
          }).catch((nothing, err) => {
            console.log('err', err)
            this.$Loading.error()
            this.ing = false
            this.$emit('complete', 500)
            this.$Message.error('出错了!')
          })
        }
      },
    },
    mixins: [ModelMixins],
  }
</script>
