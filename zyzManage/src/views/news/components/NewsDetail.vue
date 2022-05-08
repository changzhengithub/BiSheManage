<template>
  <a-modal title="详情" width="800px" :visible="true" :footer="null" @cancel="closeDialog">
    <a-spin :spinning="loading">
      <div class="news-detail">
        <div class="detail-title">
          <span>{{newsDetail.title}}</span>
        </div>
        <div class="detail-content" v-html="newsDetail.content"></div>
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
/**
 * @description 新闻详情
 * @author xxx
 * */

import { newsDetailApi } from '@/api/news'
export default {
  name: 'NewsDetail',
  props: {
    newsDetailDialog: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      baseUrl: window.api,
      loading: false,
      newsDetail: {}
    }
  },
  created() {
    this.getNewsDetail()
  },
  methods: {
    getNewsDetail() {
      const params = {
        id: this.newsDetailDialog.id
      }
      this.loading = true
      newsDetailApi(params)
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
          this.newsDetail = data
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
.news-detail {
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