<template>
  <div class="user">
    <div class="user-header">
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

        <template slot="operate" slot-scope="record">
          <a-button type="link" size="small" @click="openEditUser(record)">修改</a-button>
          <a-button type="link" size="small" @click="delUsr(record.id)">删除</a-button>
        </template>
      </a-table>
    </div>

    <!-- 修改/添加用户 -->
    <EditUser v-if="editUserDialog.visible" :editUserDialog="editUserDialog" @CLOSE_EVENT="closeEditUser"></EditUser>
  </div>
</template>
<script>
/**
 * @description 报名管理
 * @author xxx
 * */

import EditUser from './components/EditUser'
import { userApi, userDelApi } from '@/api/userManage'
export default {
  name: 'UserManage',
  components: {
    EditUser
  },
  data() {
    return {
      filterInfo: {
        page: 1
      },

      tableLoad: false, // 表格loading
      tableData: [],
      selectedRowKeys: [], // 选择用户
      tableColumns: [
        {
          title: '名称',
          dataIndex: 'username',
          ellipsis: true
        },
        {
          title: '评分',
          dataIndex: 'score'
        },
        {
          title: '手机号',
          dataIndex: 'phone'
        },
        {
          title: '地址',
          dataIndex: 'address',
          ellipsis: true
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

      editUserDialog: {
        visible: false,
        type: '',
        data: {}
      }
    }
  },

  created() {
    this.getUserList()
  },
  methods: {
    getUserList() {
      const { current } = this.pagination
      this.filterInfo.page = current
      const params = {
        ...this.filterInfo
      }
      this.tableLoad = true
      userApi(params)
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
      this.editUserDialog.visible = true
      this.editUserDialog.type = 'add'
      this.editUserDialog.data = {}
    },

    openEditUser(record) {
      this.editUserDialog.visible = true
      this.editUserDialog.type = 'edit'
      this.editUserDialog.data = Object.assign({}, record)
    },
    closeEditUser(refresh) {
      this.editUserDialog.visible = false
      if (refresh) this.getUserList()
    },

    // 批量删除用户
    delUsr(id) {
      const that = this
      this.$confirm({
        title: '确定删除选中用户?',
        okType: 'danger',
        onOk() {
          return new Promise((resolve, reject) => {
            const params = {
              id
            }
            userDelApi(params)
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
                that.getUserList()
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

    // 页码，页码值改变时
    tableChange(pagination) {
      const { current } = pagination
      this.pagination.current = current
      this.getUserList()
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
