<template>
  <a-modal :title="editActivityDialog.type == 'add' ? '添加' : '修改'" width="800px" :visible="true" :confirm-loading="confirmLoading" @cancel="closeDialog" @ok="addSubmit">
    <a-spin :spinning="loading">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
        <a-form-model-item label="标题" prop="title">
          <a-input v-model="formData.title" placeholder="请输入姓名"></a-input>
        </a-form-model-item>
        <a-form-model-item label="参与人数" prop="aused">
          <a-input-number v-model="formData.aused" style="width: 200px" placeholder="请输入参与人数" :min="0" :max="99999" />
        </a-form-model-item>
        <a-form-model-item label="最多人数" prop="astock">
          <a-input-number v-model="formData.astock" style="width: 200px" placeholder="请输入最多人数" :min="0" :max="99999" />
        </a-form-model-item>
        <a-form-model-item label="得分" prop="score">
          <a-input-number v-model="formData.score" style="width: 200px" placeholder="请输入得分" :min="0" :max="99999" />
        </a-form-model-item>
        <a-form-model-item label="封面">
          <div class="cover" v-if="uploadImg.showImages.length">
            <div class="image-list">
              <div class="list-item" v-for="(item, index) in uploadImg.showImages" :key="item">
                <img :src="baseUrl + item" alt="相关图片" />
                <div class="item-hover">
                  <a-icon style="margin-right: 10px" type="eye" @click="openPreview(index)" />
                  <a-icon type="delete" @click="deleteRelateImg(index)" />
                </div>
              </div>
            </div>
          </div>
          <a-upload
            v-if="!uploadImg.showImages.length"
            list-type="picture-card"
            accept=".jpg, .png"
            action="#"
            :show-upload-list="false"
            :before-upload="relateBeforeUpload"
            :customRequest="relateUpload"
          >
            <a-icon type="plus" />
            <div class="ant-upload-text">上传</div>
          </a-upload>
          <a-modal :visible="uploadImg.previewVisible" :footer="null" @cancel="closePreview">
            <img alt="example" style="width: 100%" :src="uploadImg.previewImage" />
          </a-modal>
        </a-form-model-item>
        <a-form-model-item label="内容">
          <div id="richText"></div>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>
<script>
/**
 * @description 修改信息
 * @author xxx
 * */

import wangEditor from 'wangeditor'
import regExp from '@/utils/regExp'
import { uploadApi } from '@/api/public'
import { activitySetApi, activityAddApi } from '@/api/activity'
export default {
  name: 'EditActivity',
  props: {
    editActivityDialog: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      baseUrl: window.api,
      editor: null,
      loading: false,
      confirmLoading: false, // 弹出层loading
      formData: {},
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        image: [{ required: true, message: '请上传封面', trigger: 'change' }],
        content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        aused: [{ required: true, message: '请输入参与人数', trigger: 'blur' }],
        astock: [{ required: true, message: '请输入最多人数', trigger: 'blur' }],
        score: [{ required: true, message: '请输入得分', trigger: 'blur' }]
      },
      // 图片上传
      uploadImg: {
        showImages: [],
        previewVisible: false,
        previewImage: ''
      }
    }
  },
  created() {
    this.formatData()
    // 创建editor实例
    this.$nextTick(() => {
      this.initEditor()
    })
  },
  methods: {
    formatData() {
      const { type, data } = this.editActivityDialog
      if (type === 'add') {
        this.formData = {
          title: '',
          content: '',
          image: '',
          aused: '',
          astock: '',
          score: ''
        }
      } else {
        this.formData = data
      }
      // 图片
      if (this.formData.image) {
        this.uploadImg.showImages = [this.formData.image]
      }
    },

    // 初始化编辑器
    initEditor() {
      // 获取实例,wangEditor是被注册在window的
      this.editor = new wangEditor('#richText')
      this.editor.config.zIndex = 100
      this.editor.config.height = 300
      this.editor.config.pasteFilterStyle = true
      this.editor.config.showLinkImg = false
      this.editor.config.uploadImgShowBase64 = true
      this.editor.config.showLinkVideo = true
      // 配置 onchange 回调函数，将数据同步到 vue 中
      this.editor.config.onchange = value => {
        this.formData.content = value
      }
      this.editor.create() // 开始创建编辑器；
      this.editor.txt.html(this.formData.content)
    },

    // 相关图片上传
    relateBeforeUpload(file) {
      const limitType = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!limitType) {
        this.$message.error('请上传 JPG、PNG 格式图片!')
      }
      const limitSize = file.size / 1024 / 1024 < 2
      if (!limitSize) {
        this.$message.error('图片不可大于 2MB!')
      }
      return limitType && limitSize
    },
    // 获取文件流上传
    relateUpload(info) {
      const { file } = info
      const formData = new FormData()
      formData.set('thumb', file)
      uploadApi(formData)
        .then(res => {
          if (res.code !== 200) {
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
            return
          }
          this.$message.success('上传成功')
          this.uploadImg.showImages = [res.msg]
        })
        .catch(err => {
          this.$notification.error({
            message: '错误',
            description: err.message
          })
        })
    },

    // 预览
    openPreview(index) {
      this.uploadImg.previewImage = this.baseUrl + this.uploadImg.showImages[index]
      this.uploadImg.previewVisible = true
    },
    closePreview() {
      this.uploadImg.previewVisible = false
    },

    // 删除上传图片
    deleteRelateImg(index) {
      const that = this
      this.$confirm({
        title: '确定删除该图片?',
        okType: 'danger',
        onOk() {
          that.uploadImg.showImages.splice(index, 1)
        }
      })
    },

    // 弹出层提交
    addSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (!this.uploadImg.showImages.length) {
            this.$message.warning('请上传封面')
            return
          }
          if (!this.formData.content) {
            this.$message.warning('请输入内容')
            return
          }
          const { id, title, content, aused, astock, score } = this.formData
          const params = {
            title,
            image: this.uploadImg.showImages[0],
            content,
            aused,
            astock,
            score
          }
          let requestApi = null
          if (this.editActivityDialog.type === 'add') {
            requestApi = activityAddApi
          } else {
            params.id = id
            requestApi = activitySetApi
          }
          this.confirmLoading = true
          requestApi(params)
            .then(res => {
              this.confirmLoading = false
              if (res.code !== 200) {
                this.$notification.error({
                  message: '错误',
                  description: res.msg
                })
                return
              }
              this.$message.success('操作成功')
              this.$emit('CLOSE_EVENT', true)
            })
            .catch(err => {
              this.confirmLoading = false
              this.$notification.error({
                message: '错误',
                description: err.message
              })
            })
        } else {
          this.$message.warning('表单填写不完整')
        }
      })
    },

    // 密码验证
    checkPwd(rule, value, callback) {
      if (value && !regExp.pwdReg.test(value)) {
        callback(new Error('需包含大小写字符串、数字,且字符在8位以上'))
      } else {
        callback()
      }
    },

    // 手机号码验证
    checkPhone(rule, value, callback) {
      if (!regExp.phoneReg.test(value)) {
        callback(new Error('手机号码格式错误'))
      } else {
        callback()
      }
    },

    // 取消弹出层
    closeDialog() {
      this.$emit('CLOSE_EVENT')
    }
  }
}
</script>
<style lang="less" scoped>
.cover {
  display: flex;
  width: 100%;

  .image-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .list-item {
      position: relative;
      height: 102px;
      padding: 6px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;

      img {
        min-width: 50px;
        height: 100%;
      }

      .item-hover {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 9;
        display: none;
        justify-content: center;
        align-items: center;
        width: calc(100% - 16px);
        height: 88px;
        color: #fff;
        background: rgba(0, 0, 0, 0.2);
        transform: translate(-50%, -50%);
        cursor: pointer;
      }

      &:hover .item-hover {
        display: flex;
      }
    }
  }
}
</style>