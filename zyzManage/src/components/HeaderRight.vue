<template>
  <div class="header-user">
    <a-dropdown placement="bottomRight">
      <div class="user-name" :class="{'user-top': mode == 'top'}">
        <span>{{ userInfo.username }}</span>
      </div>
      <template v-slot:overlay>
        <a-menu class="ant-pro-drop-down">
          <!-- <a-menu-item @click="openPersonalInfo">
            <a-icon type="user" />
            <span>个人信息</span>
          </a-menu-item>
          <a-menu-divider /> -->
          <a-menu-item @click="logoutSubmit">
            <a-icon type="logout" />
            <span>退出登录</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

<script>
/**
 * @desc 头部右侧头像下拉
 * @author xxx
 * @param {String} [mode] - 模式 'left' 左侧导航 'top' 顶部导航
 * @example 调用示例
 * <HeaderRight mode="left"></HeaderRight>
 */

import { mapActions } from 'vuex'
import storage from 'store'
import { USER_INFO } from '@/store/mutation-types'

export default {
  name: 'HeaderRight',
  props: {
    mode: {
      type: String,
      default: 'left'
    }
  },
  data() {
    return {
      userInfo: {} // 个人信息
    }
  },
  created() {
    this.userInfo = storage.get(USER_INFO)
  },
  methods: {
    ...mapActions(['Logout']),

    openPersonalInfo() {
      this.$router.push({
        name: 'User'
      })
    },
    // 退出登录
    logoutSubmit() {
      this.$confirm({
        title: '提示',
        content: '确定要退出登录？',
        onOk: () => {
          this.Logout()
          this.$message.success('退出成功')
          setTimeout(() => {
            window.location.reload()
          }, 500)
        },
        onCancel () {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.header-user {
  .flex_vertical_center();
  height: 100%;
  cursor: pointer;
  .user-name {
    color: #333;
  }
  .user-top {
    color: #fff;
  }
}

.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
