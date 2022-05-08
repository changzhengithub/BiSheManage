<template>
  <div class="user">
    <div class="user-table">
      <a-table
        rowKey="id"
        :data-source="tableData"
        :columns="tableColumns"
        :pagination="pagination"
        :loading="tableLoad"
        @change="tableChange"
      >
        <!-- 状态 -->
        <template slot="state" slot-scope="state">
          <!-- <span>{{state == 1 ? '未确认' : '已确认'}}</span> -->
          <a-tag v-if="state == 1" color="blue">未确认</a-tag>
          <a-tag v-if="state == 2" color="green">已确认</a-tag>
        </template>

        <template slot="operate" slot-scope="record">
          <a-button v-if="record.state == 1 && userInfo.admin == 1" type="link" size="small" @click="changeApplyState(record.id, 2)">确认</a-button>
          <a-button type="link" size="small" @click="changeApplyState(record.id, 0)">取消报名</a-button>
          <a-button type="link" size="small" @click="openEditRemark(record)">修改备注</a-button>
        </template>
      </a-table>
    </div>

    <!-- 报名-备注 -->
    <EditRemark v-if="applyDialog.visible" :applyDialog="applyDialog" @CLOSE_EVENT="closeEditRemark"></EditRemark>
  </div>
</template>
<script>
/**
 * @description 报名管理
 * @author xxx
 * */
import { mapState } from 'vuex'
import EditRemark from './components/EditRemark'

import { userstockApi, userstockStateApi } from '@/api/apply'
export default {
  name: 'Apply',
  components: {
    EditRemark
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
          title: '用户',
          dataIndex: 'username',
          align: 'center',
          scopedSlots: { customRender: 'username' }
        },
        {
          title: '状态',
          dataIndex: 'state',
          align: 'center',
          scopedSlots: { customRender: 'state' }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center',
          scopedSlots: { customRender: 'remark' }
        },
        {
          title: '操作',
          align: 'center',
          scopedSlots: { customRender: 'operate' }
        }
      ],

      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      applyDialog: {
        visible: false,
        id: '',
        remark: ''
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.empower.userInfo
    })
  },
  created() {
    this.getApplyList()
  },
  methods: {
    getApplyList() {
      const { current } = this.pagination
      this.filterInfo.page = current
      const params = {
        ...this.filterInfo
      }
      this.tableLoad = true
      userstockApi(params)
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

    // 修改报名状态
    changeApplyState(id, state) {
      const that = this
      this.$confirm({
        title: state === 2 ? '确认报名吗?' : '确定取消报名吗?',
        okType: state === 2 ? 'info' : 'danger',
        onOk() {
          return new Promise((resolve, reject) => {
            const params = {
              id,
              state
            }
            userstockStateApi(params)
              .then(res => {
                resolve(res)
                if (res.code !== 200) {
                  that.$notification.error({
                    message: '错误',
                    description: res.msg
                  })
                  return
                }
                that.$message.success('操作成功')
                that.pagination.current = 1
                that.getApplyList()
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
    openEditRemark(record) {
      const { id, remark } = record
      this.applyDialog.visible = true
      this.applyDialog.id = id
      this.applyDialog.remark = remark
    },
    closeEditRemark(refresh) {
      this.applyDialog.visible = false
      if (refresh) this.getApplyList()
    },

    // 页码，页码值改变时
    tableChange(pagination) {
      const { current } = pagination
      this.pagination.current = current
      this.getApplyList()
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
