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
        <!-- 详情 -->
        <template slot="detail" slot-scope="record">
          <a-button type="link" @click="openDetail(record)">查看</a-button>
        </template>

        <template slot="operate" slot-scope="record">
          <a-button v-if="userInfo.admin != 1" type="link" size="small" @click="openApplyRemark(record)">报名</a-button>
          <a-button v-if="userInfo.admin == 1" type="link" size="small" @click="openEditActivity(record)">修改</a-button>
          <a-button v-if="userInfo.admin == 1" type="link" size="small" @click="delActivity(record.id)">删除</a-button>
        </template>
      </a-table>
    </div>

    <!-- 修改/添加用户 -->
    <EditActivity v-if="editActivityDialog.visible" :editActivityDialog="editActivityDialog" @CLOSE_EVENT="closeEditActivity"></EditActivity>

    <!-- 报名-备注 -->
    <ApplyRemark v-if="applyDialog.visible" :applyDialog="applyDialog" @CLOSE_EVENT="closeApply"></ApplyRemark>

    <!-- 新闻详情 -->
    <ActivityDetail v-if="detailDialog.visible" :detailDialog="detailDialog" @CLOSE_EVENT="closeDetail"></ActivityDetail>

    <!-- 图片预览 start -->
    <a-modal :visible="coverDialog.visible" :footer="null" @cancel="closeCover">
      <img alt="example" style="width: 100%" :src="coverDialog.url" />
    </a-modal>
    <!-- 图片预览 end -->
  </div>
</template>
<script>
/**
 * @description 项目管理
 * @author xxx
 * */
import { mapState } from 'vuex'
import EditActivity from './components/EditActivity'
import ApplyRemark from './components/ApplyRemark'
import ActivityDetail from './components/ActivityDetail'
import { activityApi, activityDelApi } from '@/api/activity'
export default {
  name: 'Activity',
  components: {
    EditActivity,
    ApplyRemark,
    ActivityDetail
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
          title: '参与人数',
          dataIndex: 'aused',
          align: 'center',
          scopedSlots: { customRender: 'aused' }
        },
        {
          title: '最多人数',
          dataIndex: 'astock',
          align: 'center',
          scopedSlots: { customRender: 'astock' }
        },
        {
          title: '得分',
          dataIndex: 'score',
          align: 'center',
          scopedSlots: { customRender: 'score' }
        },
        {
          title: '详情',
          align: 'center',
          scopedSlots: { customRender: 'detail' }
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

      editActivityDialog: {
        visible: false,
        type: '',
        data: {}
      },
      coverDialog: {
        visible: false,
        url: ''
      },
      applyDialog: {
        visible: false,
        id: '',
        userid: ''
      },
      detailDialog: {
        visible: false,
        id: ''
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.empower.userInfo
    })
  },
  created() {
    this.getActivityList()
  },
  methods: {
    getActivityList() {
      const { current } = this.pagination
      this.filterInfo.page = current
      const params = {
        ...this.filterInfo
      }
      this.tableLoad = true
      activityApi(params)
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
      this.editActivityDialog.visible = true
      this.editActivityDialog.type = 'add'
      this.editActivityDialog.data = {}
    },

    openEditActivity(record) {
      this.editActivityDialog.visible = true
      this.editActivityDialog.type = 'edit'
      this.editActivityDialog.data = Object.assign({}, record)
    },
    closeEditActivity(refresh) {
      this.editActivityDialog.visible = false
      if (refresh) this.getActivityList()
    },

    // 删除
    delActivity(id) {
      const that = this
      this.$confirm({
        title: '确定删除吗?',
        okType: 'danger',
        onOk() {
          return new Promise((resolve, reject) => {
            const params = {
              id
            }
            activityDelApi(params)
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
                that.getActivityList()
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

    // 报名
    openApplyRemark(record) {
      this.applyDialog.visible = true
      this.applyDialog.id = record.id
      this.applyDialog.userid = this.userInfo.id
    },
    closeApply(refresh) {
      this.applyDialog.visible = false
      if (refresh) this.getActivityList()
    },

    // 查看封面
    viewCover(url) {
      this.coverDialog.visible = true
      this.coverDialog.url = this.baseUrl + url
    },
    closeCover() {
      this.coverDialog.visible = false
    },

    // 打开详情
    openDetail(record) {
      this.detailDialog.visible = true
      this.detailDialog.id = record.id
    },
    closeDetail() {
      this.detailDialog.visible = false
    },

    // 页码，页码值改变时
    tableChange(pagination) {
      const { current } = pagination
      this.pagination.current = current
      this.getActivityList()
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
