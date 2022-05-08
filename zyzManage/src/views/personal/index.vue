<template>
  <div class="user">
    <a-card :loading="loading" title="基础信息">
      <a-button slot="extra" type="primary" icon="plus" @click="editInfo">修改</a-button>
      <div class="user-info">
        <div class="info-item">
          <span>名称：</span>
          <span>{{userInfo.username}}</span>
        </div>
        <div class="info-item">
          <span>手机号：</span>
          <span>{{userInfo.phone}}</span>
        </div>
        <div class="info-item">
          <span>评分：</span>
          <span>{{userInfo.score}}</span>
        </div>
        <div class="info-item">
          <span>地址：</span>
          <span>{{userInfo.address}}</span>
        </div>
      </div>
    </a-card>

    <!-- 修改信息 -->
    <EditInfo v-if="editUserDialog.visible" :userInfo="userInfo" @CLOSE_EVENT="closeEditInfo"></EditInfo>
  </div>
</template>
<script>
/**
 * @description 用户信息
 * @author xxx
 * */

import EditInfo from './components/EditInfo'
import { infoApi } from '@/api/empower'
export default {
  name: 'Personal',
  components: {
    EditInfo
  },
  data() {
    return {
      loading: false,
      userInfo: {},
      editUserDialog: {
        visible: false
      }
    }
  },

  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      this.loading = true
      infoApi()
        .then(res => {
          this.loading = false
          if (res.code !== 200) {
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
            return false
          }
          const data = res.data
          this.userInfo = data
        }).catch(err => {
          this.loading = false
          this.$notification.error({
            message: '错误',
            description: err.msg
          })
        })
    },
    editInfo() {
      this.editUserDialog.visible = true
    },
    closeEditInfo(refresh) {
      this.editUserDialog.visible = false
      if (refresh) this.getUserInfo()
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  width: 100%;
  .user-info {
    width: 100%;
    .info-item {
      width: 100%;
      margin-bottom: 20px;
      line-height: 1.5;
      font-size: 16px;
      color: #333;
    }
  }
}
</style>
