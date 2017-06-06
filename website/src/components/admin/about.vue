<template>
  <div class="p-20">
    <Modal
      v-model="editing"
      :loading="saving"
      @on-ok="handleSubmit"
      title="编辑">
      <div class="fix p-l-10 p-r-10">
        <div class="upload-preview tc m-b-20 l">
          <div class="fix">
            <figure v-for="(thumbnail, index) in thumbnails" class="l pos-rel">
              <img :src="`${thumbnail}?imageView2/1/w/100/h/100/interlace/0/q/100`"
                   class="rounded bd-blue m-r-5"/>
              <Icon type="close-circled" @click.native="deleteFile(index)" class="btn_remove"></Icon>
            </figure>
          </div>
        </div>
        <QiniuUpload :multiple="true" @complete="uploadComplete" ref="qiniuUpload" class="l">
          <a></a>
        </QiniuUpload>
      </div>
      <div class="m-b-20"></div>
      <Form :model="editingAbout" ref="editingForm" :label-width="80" :rules="editingRules">
        <Form-item label="庙号" prop="title">
          <Input v-model="editingAbout.title" placeholder="请输入...">
          </Input>
        </Form-item>
        <Form-item label="个人首页" prop="myPage">
          <Input v-model="editingAbout.myPage" placeholder="请输入...">
          </Input>
        </Form-item>
        <Form-item label="简介" prop="summary">
          <Input v-model="editingAbout.summary" placeholder="请输入..." type="textarea" :rows="4">
          </Input>
        </Form-item>
      </Form>
      <h3 class="c-g9 m-b-5 p-l-5">内容</h3>
      <markdown-editor v-model="editingAbout.content" ref="markdownContent"></markdown-editor>
    </Modal>
    <div class="tr m-b-15">
      <Button type="primary" @click="add">新增</Button>
    </div>
    <Table height="600" border :columns="columns2" :data="abouts" class="w-100 m-b-15"></Table>
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
        abouts: [],
        aboutId: null,
        thumbnails: [],
        saving: false,
        editing: false,
        editingRules: {
          title: { required: true, max: 80, message: '必填，且最多80个文字', trigger: 'blur' },
          summary: { required: true, max: 80, message: '必填，且最多80个文字', trigger: 'blur' },
        },
        editingAbout: {
          summary: '',
          content: '',
          myPage: '',
        },
        pageSize: 100,
        columns2: [
          {
            title: 'objectId',
            key: 'objectId',
            width: 200,
          },
          {
            title: '作者',
            key: 'createdByName',
            sortable: true,
          },
          {
            title: '最后更新',
            key: 'formatUpdatedAt',
            width: 150,
            sortable: true,
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
      deleteFile(index) {
        this.thumbnails.splice(index, 1)
      },
      add() {
        this.htmlOverFlowHidden()
        this.editing = true
        this.editingAbout = {
          content: '',
          summary: '',
          title: '',
          myPage: '',
        }
        this.thumbnails = []
      },
      uploadComplete(status, result) {
        if (status === 200) {
          this.thumbnails.push(`http://img.hidoge.cn/${result.key}`)
        } else {
          console.log('出错', status)
        }
      },
      edit(index) {
        this.htmlOverFlowHidden()
        this.editing = true
        this.editingAbout = this.abouts[index]
        this.thumbnails = this.editingAbout.picture || []
      },
      handleSubmit() {
        this.htmlOverFlowAuto()
        const user = this.currentUser()
        if (this.editingAbout && this.editingAbout.objectId) {
          this.saving = true
          const modelAbout = this.modelUpdate('About', this.editingAbout.objectId)
          modelAbout.save({
            picture: this.thumbnails,
            title: this.editingAbout.title,
            myPage: this.editingAbout.myPage,
            summary: this.editingAbout.summary,
            content: this.editingAbout.content,
            createdBy: AV.Object.createWithoutData('_User', user.objectId),
          }).then((res) => {
            const about = this.queryAbout()
            about.include(['createdBy']).get(res.id).then((getRes) => {
              const obj = getRes.toJSON()
              this.$Message.success('操作成功')
              this.editing = false
              this.saving = false
              obj.createdByName = getRes.get('createdBy').toJSON().username
              obj.formatUpdatedAt = this.dateFormat(new Date(), 'L')
              this.abouts = _.map(this.abouts, (item) => {
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
          const modelAbout = this.modelAbout()
          modelAbout.save({
            picture: this.thumbnails,
            title: this.editingAbout.title,
            myPage: this.editingAbout.myPage,
            summary: this.editingAbout.summary,
            content: this.editingAbout.content,
            createdBy: AV.Object.createWithoutData('_User', user.objectId),
          }).then((res) => {
            const about = this.queryAbout()
            about.include(['createdBy']).get(res.id).then((getRes) => {
              const obj = getRes.toJSON()
              this.editing = false
              this.saving = false
              obj.createdByName = getRes.get('createdBy').toJSON().username
              obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
              this.abouts = [obj, ...this.abouts]
              this.$Message.success('操作成功')
              console.log('this.abouts', this.abouts)
            })
          }).catch((err) => {
            console.log('err', err)
            this.$Message.error('出错啦')
          })
        }
      },
    },
    created() {
      const abouts = this.queryAbout()
      const user = this.currentUser()
      if (user.username !== 'admin') {
        const createdBy = AV.Object.createWithoutData('_User', user.objectId)
        abouts.equalTo('createdBy', createdBy)
      }
      abouts.include(['createdBy']).descending('updatedAt').limit(this.pageSize).find()
        .then((res) => {
          this.abouts = _.map(res, (item) => {
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
