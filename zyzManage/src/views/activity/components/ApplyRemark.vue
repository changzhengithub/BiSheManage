<template>
  <a-modal title="备注" width="500px" :visible="true" :confirm-loading="confirmLoading" @cancel="closeDialog" @ok="addSubmit">
    <a-form-model ref="ruleForm" :model="formData" :rules="rules" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
      <a-form-model-item label="备注">
        <a-textarea v-model="formData.remark" placeholder="请输入备注" :auto-size="{ minRows: 3, maxRows: 6 }" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
/**
 * @description 报名备注
 * @author xxx
 * */

import { userstockSetApi } from '@/api/apply'
export default {
  name: 'ApplyRemark',
  props: {
    applyDialog: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      confirmLoading: false, // 弹出层loading
      formData: {
        remark: ''
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }]
      }
    }
  },
  created() {

  },
  methods: {

    // 弹出层提交
    addSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const { id, userid } = this.applyDialog
          const params = {
            userid,
            stockid: id,
            remark: this.formData.remark
          }
          this.confirmLoading = true
          userstockSetApi(params)
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