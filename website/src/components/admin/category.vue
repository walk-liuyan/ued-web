<template>
  <div class="p-20">
    <Modal
      v-model="editing"
      :loading="saving"
      title="编辑留言">
      <Form :model="editingCate" ref="editingForm" :label-width="80">
        <Form-item label="状态">
          <Input v-model="editingCate.status" placeholder="请输入">
          </Input>
        </Form-item>
        <Form-item label="标题" prop="title">
          <Input v-model="editingCate.title" placeholder="请输入...">
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
      表格 - 基础使用，不要分页，不要筛选，不要排序
      <Table height="400" border :columns="columns2" :data="categoryList" class="w-100 m-b-15"></Table>
    </div>
  </div>
</template>
<script type="text/babel">
  import ModelMixins from '../../assets/js/model-mixins'
  import FnMixins from '../../assets/js/fn-mixins'
  import FiltersMixins from '../../assets/js/filters-mixins'

  export default{
    data() {
      return {
        pageSize: 100,
        categoryList: [],
        categoryId: null,
        editing: false,
        saving: false,
        editingCate: {},
        editingRules: {
          status: { required: true, message: '必填', trigger: 'blur' },
          title: { required: true, max: 10, message: '最多10个文字', trigger: 'blur' },
        },
        columns2: [
          {
            title: 'objectId',
            key: 'objectId',
            width: 250,
            fixed: 'left',
          },
          {
            title: '类目名称',
            key: 'title',
            width: 200,
          },
          {
            title: '状态',
            key: 'formatStatus',
            width: 100,
          },
          {
            title: '最后更新',
            key: 'formatUpdatedAt',
            width: 180,
            sortable: true,
          },
          {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 150,
            render(row, column, index) {
              return `<i-button type="text" size="small" @click="edit(${index})">编辑</i-button>`
            },
          },
        ],
      }
    },
    methods: {
      edit(index) {
        this.htmlOverFlowHidden()
        this.editing = true
        this.editingCate = this.categoryList[index]
      },
      add() {
        this.htmlOverFlowHidden()
        this.editing = true
        this.editingCate = {
          title: '',
          status: '1',
        }
      },
      handleSubmit(name) {
        this.htmlOverFlowAuto()
        const user = this.currentUser()
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.editingCate && this.editingCate.objectId) {
              this.saving = true
              const modelCategory = this.modelUpdate('Category', this.editingCate.objectId)
              modelCategory.save({
                status: this.editingCate.status,
                title: this.editingCate.title,
                createdBy: AV.Object.createWithoutData('_User', user.objectId),
              }).then((res) => {
                const obj = res.toJSON()
                this.$Message.success('操作成功')
                this.editing = false
                this.saving = false
                obj.formatStatus = this.formatStatus(_.toString(obj.status))
                obj.formatUpdatedAt = this.dateFormat(new Date(), 'L')
                this.posts = _.map(this.posts, (item) => {
                  if (item.objectId === obj.objectId) {
                    item = obj
                  }
                  return item
                })
              }).catch((err) => {
                console.log('err', err)
                this.$Message.error('出错啦')
              })
            } else {
              this.saving = true
              const modelCategory = this.modelCategory()
              modelCategory.save({
                status: _.toNumber(this.editingCate.status),
                title: this.editingCate.title,
                createdBy: AV.Object.createWithoutData('_User', user.objectId),
              }).then((res) => {
                const obj = res.toJSON()
                this.editing = false
                this.saving = false
                obj.formatStatus = this.formatStatus(_.toString(obj.status))
                obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
                this.categoryList = [obj, ...this.categoryList]
                this.$Message.success('操作成功')
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
      const category = this.queryCategory()
      category.limit(this.pageSize).find().then((res) => {
        this.categoryList = _.map(res, (item) => {
          const obj = item.toJSON()
          obj.formatStatus = this.formatStatus(_.toString(obj.status))
          obj.formatUpdatedAt = obj.updatedAt ? this.dateFormat(obj.updatedAt, 'L') : '无'
          return obj
        })
      }).catch((err) => {
        console.log('err', err)
        this.$Message.error('出错啦')
      })
    },
    mixins: [FnMixins, ModelMixins, FiltersMixins],
  }
</script>
