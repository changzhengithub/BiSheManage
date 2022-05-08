<template>
  <a-modal title="详情" width="800px" :visible="true" :footer="null" @cancel="closeDialog">
    <a-spin :spinning="loading">
      <div class="activity-detail">
        <div class="detail-title">
          <span>{{detailInfo.title}}</span>
        </div>
        <div class="detail-content" v-html="detailInfo.content"></div>
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
/**
 * @description 项目详情
 * @author xxx
 * */

import { activityDetailApi } from '@/api/activity'
export default {
  name: 'ActivityDetail',
  props: {
    detailDialog: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      baseUrl: window.api,
      loading: false,
      detailInfo: {}
    }
  },
  created() {
    this.getActivityDetail()
  },
  methods: {
    getActivityDetail() {
      const params = {
        id: this.detailDialog.id
      }
      this.loading = true
      activityDetailApi(params)
        .then(res => {
          this.loading = false
          if (res.code !== 200) {
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
            return
          }
          const data = res.data
          this.detailInfo = data
        })
        .catch(err => {
          this.loading = false
          this.$notification.error({
            message: '错误',
            description: err.message
          })
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
.activity-detail {
  width: 100%;
  min-height: 200px;
  .detail-title {
    width: 100%;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
}
</style>