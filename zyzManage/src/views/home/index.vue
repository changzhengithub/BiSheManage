<template>
  <div class="index">
    <div class="index-header">
      <div class="header-logo">
        <span>{{homeInfo.title}}</span>
      </div>
      <div class="header-nav">
        <div class="nav-list" v-if="userInfo">
          <div class="list-item" @click="gotoPage">
            <span>个人中心</span>
          </div>
        </div>
        <div class="nav-login" @click="toggleLogin">
          <span>{{userInfo ? '登出' : '登录'}}</span>
        </div>
      </div>
    </div>

    <div class="index-banner">
      <div class="banner-img">
        <img :src="baseUrl + homeInfo.index_bg" alt="" />
      </div>
      <div class="banner-detail">
        <div class="detail-title">{{homeInfo.rotation_title1}}</div>
        <div class="detail-desc">{{homeInfo.rotation_title2}}</div>
      </div>
    </div>
    <div class="index-main">
      <div class="main-panel">
        <div class="panel-header">
          <div class="header-title">{{homeInfo.show_title1}}</div>
          <div class="header-link" @click="gotoPage">
            <div class="link-icon"><a-icon type="arrow-right" /></div>
            <span>了解详情</span>
          </div>
        </div>
        <div class="panel-list">
          <div class="list-item" v-for="(item, index) in newList" :key="index">
            <div class="item-img">
              <img :src="baseUrl + item.image" alt="">
            </div>
            <div class="item-title">
              <span>{{item.title}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="main-panel">
        <div class="panel-header">
          <div class="header-title">{{homeInfo.show_title2}}</div>
          <div class="header-link" @click="gotoPage">
            <div class="link-icon"><a-icon type="arrow-right" /></div>
            <span>了解详情</span>
          </div>
        </div>
        <div class="panel-list">
          <div class="list-item" v-for="(item, index) in newList" :key="index">
            <div class="item-img">
              <img :src="baseUrl + item.image" alt="">
            </div>
            <div class="item-title">
              <span>{{item.title}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="index-footer">

    </div>
  </div>
</template>
<script>
/**
 * @description 首页
 * @author xxx
 * */
import { mapState, mapActions } from 'vuex'

import { homeInfoApi } from '@/api/home'
import { newsApi } from '@/api/news'
import { stockApi } from '@/api/stock'

export default {
  name: 'Home',
  data() {
    return {
      baseUrl: window.api,
      loading: false,
      homeInfo: {},
      newList: [], // 新闻列表
      stockList: [] // 活动列表
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.empower.userInfo
    })
  },
  created() {
    this.getHomeInfo()
    this.getStockList()
    this.getNewList()
  },
  methods: {
    ...mapActions(['Logout']),
    getHomeInfo() {
      this.loading = true
      homeInfoApi()
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
          this.homeInfo = data
        }).catch(err => {
          this.loading = false
          this.$notification.error({
            message: '错误',
            description: err.msg
          })
        })
    },

    // 获取活动列表
    getStockList() {
      const params = {
        page: 1
      }
      stockApi(params)
        .then(res => {
          if (res.code !== 200) {
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
            return false
          }
          const data = res.data
          this.stockList = data.slice(0, 4)
        }).catch(err => {
          this.$notification.error({
            message: '错误',
            description: err.msg
          })
        })
    },

    // 获取新闻列表
    getNewList() {
      const params = {
        page: 1
      }
      newsApi(params)
        .then(res => {
          if (res.code !== 200) {
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
            return false
          }
          const data = res.data
          this.newList = data.slice(0, 4)
        }).catch(err => {
          this.$notification.error({
            message: '错误',
            description: err.msg
          })
        })
    },

    toggleLogin() {
      if (this.userInfo) {
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
      } else {
        this.$router.push({
          name: 'Index'
        })
      }
    },

    gotoPage() {
      this.$router.push({
        name: 'Index'
      })
    }

  }
}
</script>

<style lang="less" scoped>
.index {
  width: 100%;
  // height: 100%;
  background-color: #fff;
  .index-header {
    .flex_vertical_center_horizontal_between();
    width: 100%;
    height: 64px;
    padding-left: 150px;
    background-color: #fff;
    .header-logo {
      font-weight: 600;
      font-size: 20px;
      color: #333;
    }
    .header-nav {
      .flex_vertical_center();
      height: 100%;
      .nav-list {
        .list-item {
          font-size: 16px;
          cursor: pointer;
        }
      }
      .nav-login {
        .flex_center();
        width: 100px;
        height: 100%;
        margin-left: 20px;
        font-size: 14px;
        color: #fff;
        background-color: #c02321;
        cursor: pointer;
      }
    }
  }
  .index-banner {
    position: relative;
    width: 100%;
    // height: 870px;
    margin-bottom: 24px;
    .banner-img {
      width: 100%;
      img {
        width: 100%;
      }
    }
    .banner-detail {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 9;
      width: 100%;
      padding-top: 300px;
      padding-left: 200px;
      color: #fff;
      .detail-title {
        margin-bottom: 20px;
        font-size: 60px;
      }
      .detail-desc {
        font-size: 40px;
      }
    }

  }
  .index-main {
    width: 100%;
    padding: 0 150px;
    .main-panel {
      width: 100%;
      .panel-header {
        .flex_vertical_center_horizontal_between();
        width: 100%;
        height: 60px;
        margin-bottom: 20px;
        .header-title {
          font-size: 26px;
          color: #323232;
        }
        .header-link {
          .flex_center();
          width: 130px;
          height: 40px;
          font-size: 16px;
          color: #323232;
          border: 1px solid #e19391;
          border-radius: 20px;
          cursor: pointer;
          .link-icon {
            .flex_center();
            width: 26px;
            height: 26px;
            margin-right: 5px;
            font-size: 16px;
            color: #fff;
            background-color: #c02321;
            border-radius: 50%;
          }
        }
      }
      .panel-list {
        .flex_horizontal_between();
        width: 100%;
        .list-item {
          width: 22%;
          .item-img {
            width: 100%;
            margin-bottom: 15px;
            img {
              width: 100%;
            }
          }
          .item-title {
            .ellipsis-row(2);
            width: 100%;
            height: 100px;
            line-height: 1.5;
          }
        }
      }
    }
  }
  .index-footer {
    width: 100%;
    height: 60px;
    background-color: rgb(36, 36, 36);
  }
}
</style>
