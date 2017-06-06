<template>
  <div class="p-20">
    <Modal
      v-model="editing"
      :loading="saving"
      title="编辑留言">
      <div class="upload-preview tc m-b-20 pos-rel" v-if="thumbnail">
        <figure>
          <img :src="`${thumbnail}?imageView2/1/w/100/h/100/interlace/0/q/100`" class="rounded bd-blue"/>
        </figure>
        <div class="tc">
          <Button type="primary" @click="thumbnail = false">修改图片</Button>
        </div>
      </div>
      <QiniuUpload :multiple="false" @complete="uploadComplete" ref="qiniuUpload" class="m-b-20" v-else>
        <a></a>
      </QiniuUpload>
      <div class="m-b-20"></div>
      <Form :model="editingCarousel" ref="editingForm" :label-width="80" :rules="editingRules">
        <Form-item label="状态">
          <Input v-model="editingCarousel.status" placeholder="请输入">
          </Input>
        </Form-item>
        <Form-item label="标题" prop="title">
          <Input v-model="editingCarousel.title" placeholder="请输入...">
          </Input>
        </Form-item>
        <Form-item label="链接" prop="link">
          <Input v-model="editingCarousel.link" type="textarea" placeholder="请输入...">
          </Input>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="handleSubmit('editingForm')">提交</Button>
        </Form-item>
      </Form>
      <div slot="footer"></div>
    </Modal>
    <div class="tr m-b-15">
      <Button type="primary" @click="add">新增</Button>
    </div>
    <div class="ivu-article">
      <Table height="400" border :columns="columns2" :data="carouselList" class="w-100 m-b-15"></Table>
    </div>
  </div>
</template>
<script type="text/babel">
  import ModelMixins from '../../assets/js/model-mixins'
  import FnMixins from '../../assets/js/fn-mixins'
  import FiltersMixins from '../../assets/js/filters-mixins'
  import QiniuUpload from '../common/qiniuUpload'

  export default{
    components: {
      QiniuUpload,
    },
    data() {
      return {
        pageSize: 100,
        thumbnail: '',
        carouselList: [],
        posts: [],
        categoryId: null,
        editing: false,
        saving: false,
        editingCarousel: {
          status: null,
          title: null,
          link: null,
        },
        editingRules: {
          title: { required: true, message: '必填', trigger: 'blur' },
          link: { required: true, message: '必填', trigger: 'blur' },
        },
        columns2: [
          {
            title: 'objectId',
            key: 'objectId',
            width: 200,
          },
          {
            title: '标题',
            key: 'title',
            width: 200,
          },
          {
            title: '链接',
            key: 'link',
            width: 200,
          },
          {
            title: '作者',
            key: 'createdByName',
            width: 100,
            sortable: true,
          },
          {
            title: '状态',
            key: 'status',
            width: 100,
          },
          {
            title: '最后更新',
            key: 'formatUpdatedAt',
            width: 150,
          },
          {
            title: '操作',
            key: 'action',
            width: 100,
            render(row, column, index) {
              return `<i-button type="text" size="small" @click="edit(${index})">编辑</i-button>`
            },
          },
        ],
      }
    },
    methods: {
      add() {
        this.htmlOverFlowHidden()
        this.editing = true
        this.thumbnail = ''
        this.editingCarousel = {
          content: null,
          status: '1',
          title: null,
          link: '',
        }
      },
      uploadComplete(status, result) {
        if (status === 200) {
          this.thumbnail = `http://img.hidoge.cn/${result.key}`
        } else {
          console.log('出错', status)
        }
      },
      edit(index) {
        this.htmlOverFlowHidden()
        console.log('this.carouselList[index]', this.carouselList[index])
        this.editing = true
        this.editingCarousel = this.carouselList[index]
        this.thumbnail = this.carouselList[index].picture
      },
      handleSubmit(name) {
        this.htmlOverFlowAuto()
        this.$refs[name].validate((valid) => {
          if (valid) {
            const user = this.currentUser()
            if (this.editingCarousel && this.editingCarousel.objectId) {
              this.saving = true
              const modelCarousel = this.modelUpdate('Carousel', this.editingCarousel.objectId)
              modelCarousel.save({
                status: _.toNumber(this.editingCarousel.status),
                title: this.editingCarousel.title,
                content: this.editingCarousel.content,
                picture: this.thumbnail,
                createdBy: AV.Object.createWithoutData('_User', user.objectId),
              }).then((res) => {
                const carousel = this.queryCarousel()
                carousel.include(['createdBy']).get(res.id).then((getRes) => {
                  const obj = getRes.toJSON()
                  this.$Message.success('操作成功')
                  this.editing = false
                  this.saving = false
                  obj.createdByName = obj.createdBy ? getRes.get('createdBy').toJSON().username : '无'
                  obj.formatUpdatedAt = this.dateFormat(new Date(), 'L')
                  this.carouselList = _.map(this.carouselList, (item) => {
                    if (item.objectId === obj.objectId) {
                      item = obj
                    }
                    return item
                  })
                })
              }).catch((err) => {
                console.log('err', err)
                this.$Message.error('出错啦')
              })
            } else {
              this.saving = true
              const modelCarousel = this.modelCarousel()
              modelCarousel.save({
                status: _.toNumber(this.editingCarousel.status),
                title: this.editingCarousel.title,
                link: this.editingCarousel.link,
                picture: this.thumbnail,
                createdBy: user,
              }).then((res) => {
                const carousel = this.queryCarousel()
                carousel.include(['createdBy']).get(res.id).then((getRes) => {
                  const obj = getRes.toJSON()
                  this.editing = false
                  this.saving = false
                  obj.createdByName = obj.createdBy ? getRes.get('createdBy').toJSON().username : '无'
                  obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
                  this.carouselList = [obj, ...this.carouselList]
                  this.$Message.success('操作成功')
                })
              }).catch((err) => {
                console.log('err', err)
                this.$Message.error('出错啦')
              })
            }
          } else {
            this.$Message.error('表单验证失败!')
          }
        })
      },
    },
    created() {
      const carousel = this.queryCarousel()
      const user = this.currentUser()
      if (user.username !== 'admin') {
        const createdBy = AV.Object.createWithoutData('_User', user.objectId)
        carousel.equalTo('createdBy', createdBy)
      }
      carousel.include(['createdBy']).limit(this.pageSize).find()
        .then((res) => {
          this.carouselList = _.map(res, (item) => {
            const obj = item.toJSON()
            obj.createdByName = obj.createdBy ? item.get('createdBy').toJSON().username : '无'
            obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
            return obj
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
