<template>
  <a-modal
    title="修改信息"
    width="550px"
    :visible="true"
    :confirm-loading="confirmLoading"
    @cancel="closeDialog"
    @ok="addSubmit"
  >
    <a-form-model ref="ruleForm" :model="formData" :rules="rules" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
      <a-form-model-item label="密码" prop="passwd">
        <a-input v-model="formData.passwd" placeholder="请输入密码"></a-input>
      </a-form-model-item>
      <a-form-model-item label="手机号" prop="phone">
        <a-input v-model="formData.phone" placeholder="请输入手机号"></a-input>
      </a-form-model-item>
      <a-form-model-item label="地址" prop="address">
        <a-textarea v-model="formData.address" placeholder="请输入地址" :auto-size="{ minRows: 3, maxRows: 6 }"></a-textarea>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
/**
 * @description 修改用户信息
 * @author xxx
 * */

import regExp from '@/utils/regExp'
import { userSetApi } from '@/api/user'
export default {
  name: 'EditInfo',
  props: {
    userInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      confirmLoading: false, // 弹出层loading

      formData: {},
      rules: {
        passwd: [{ validator: this.checkPwd, trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: this.checkPhone, trigger: 'blur' }
        ],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.formData = Object.assign({}, this.userInfo)
  },
  methods: {

    // 弹出层提交
    addSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const { phone, passwd, address } = this.formData
          const params = {
            phone,
            passwd,
            address
          }
          this.confirmLoading = true
          userSetApi(params)
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
</style>
