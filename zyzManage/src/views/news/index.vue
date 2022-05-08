<template>
  <div class="user">
    <div class="user-header" v-if="userInfo.admin == 1">
      <a-button type="primary" icon="plus" @click="addUser">添加</a-button>
    </div>
    <div class="user-table">
      <a-table
        rowKey="id"
        :data-source="tableData"
        :columns="tableColumns"
        :pagination="pagination"
        :loading="tableLoad"
        @change="tableChange"
      >
        <!-- 封面 -->
        <template slot="image" slot-scope="image">
          <a-button type="link" @click="viewCover(image)">预览</a-button>
        </template>

        <template slot="operate" slot-scope="record">
          <a-button v-if="userInfo.admin == 1" type="link" size="small" @click="openEditNews(record)">修改</a-button>
          <a-button v-if="userInfo.admin == 1" type="link" size="small" @click="delNews(record.id)">删除</a-button>
          <a-button v-if="userInfo.admin != 1" type="link" size="small" @click="openNewsDetail(record.id)">详情</a-button>
        </template>
      </a-table>
    </div>

    <!-- 修改/添加咨询 -->
    <EditNews v-if="editNewsDialog.visible" :editNewsDialog="editNewsDialog" @CLOSE_EVENT="closeEditNews"></EditNews>

    <!-- 新闻详情 -->
    <NewsDetail v-if="newsDetailDialog.visible" :newsDetailDialog="newsDetailDialog" @CLOSE_EVENT="closeNewsDetail"></NewsDetail>

    <!-- 图片预览 start -->
    <a-modal :visible="coverDialog.visible" :footer="null" @cancel="closeCover">
      <img alt="example" style="width: 100%" :src="coverDialog.url" />
    </a-modal>
    <!-- 图片预览 end -->
  </div>
</template>
<script>
/**
 * @description 咨询管理
 * @author xxx
 * */
import { mapState } from 'vuex'
import EditNews from './components/EditNews'
import NewsDetail from './components/NewsDetail'
import { newsApi, newsDelApi } from '@/api/news'
export default {
  name: 'NewsManage',
  components: {
    EditNews,
    NewsDetail
  },
  data() {
    return {
      baseUrl: window.api,
      filterInfo: {
        page: 1
      },

      tableLoad: false, // 表格loading
      tableData: [],
      selectedRowKeys: [], // 选择用户
      tableColumns: [
        {
          title: '标题',
          dataIndex: 'title',
          ellipsis: true
        },
        {
          title: '封面',
          dataIndex: 'image',
          align: 'center',
          scopedSlots: { customRender: 'image' }
        },
        {
          title: '操作',
          align: 'center',
          width: 120,
          scopedSlots: { customRender: 'operate' }
        }
      ],

      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      editNewsDialog: {
        visible: false,
        type: '',
        id: ''
      },
      newsDetailDialog: {
        visible: false,
        id: ''
      },
      coverDialog: {
        visible: false,
        url: ''
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.empower.userInfo
    })
  },
  created() {
    this.getNewsList()
  },
  methods: {
    getNewsList() {
      const { current } = this.pagination
      this.filterInfo.page = current
      const params = {
        ...this.filterInfo
      }
      this.tableLoad = true
      newsApi(params)
        .then(res => {
          this.tableLoad = false
          if (res.code !== 200) {
            this.$notification.error({
              message: '错误',
              description: res.msg
            })
            return false
          }
          const { data, pagination } = res
          this.tableData = data
          this.pagination.total = pagination.total
        }).catch(err => {
          this.tableLoad = false
          this.$notification.error({
            message: '错误',
            description: err.msg
          })
        })
    },

    addUser() {
      this.editNewsDialog.visible = true
      this.editNewsDialog.type = 'add'
      this.editNewsDialog.id = ''
    },

    openEditNews(record) {
      this.editNewsDialog.visible = true
      this.editNewsDialog.type = 'edit'
      this.editNewsDialog.id = record.id
    },
    closeEditNews(refresh) {
      this.editNewsDialog.visible = false
      if (refresh) this.getNewsList()
    },


    // 删除
    delNews(id) {
      const that = this
      this.$confirm({
        title: '确定删除吗?',
        okType: 'danger',
        onOk() {
          return new Promise((resolve, reject) => {
            const params = {
              id
            }
            newsDelApi(params)
              .then(res => {
                resolve(res)
                if (res.code !== 200) {
                  that.$notification.error({
                    message: '错误',
                    description: res.msg
                  })
                  return
                }
                that.selectedRowKeys = []
                that.$message.success('删除成功')
                that.pagination.current = 1
                that.getNewsList()
              })
              .catch(err => {
                reject(err)
                that.$notification.error({
                  message: '错误',
                  description: err.message
                })
              })
          })
        }
      })
    },

    // 打开详情
    openNewsDetail(id) {
      this.newsDetailDialog.visible = true
      this.newsDetailDialog.id = id
    },
    closeNewsDetail() {
      this.newsDetailDialog.visible = false
    },

    // 查看封面
    viewCover(url) {
      this.coverDialog.visible = true
      this.coverDialog.url = this.baseUrl + url
    },
    closeCover() {
      this.coverDialog.visible = false
    },

    // 页码，页码值改变时
    tableChange(pagination) {
      const { current } = pagination
      this.pagination.current = current
      this.getNewsList()
    }
  }
}
</script>

<style lang="less" scoped>
.user {
  width: 100%;
  height: 100%;
  padding: 24px;
  background-color: #fff;
  .user-header {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
