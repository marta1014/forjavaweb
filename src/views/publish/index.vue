<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="活动区域">
        <el-select v-model="formInline.region" placeholder="状态">
          <el-option label="开启" value="1"></el-option>
          <el-option label="关闭" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="品牌">
        <el-input v-model="formInline.brandName" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="公司">
        <el-input v-model="formInline.companyName" placeholder=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" plain @click="batchesDel">批量删除</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
      >>
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column fixed prop="id" label="ID" width="150">
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" width="120">
      </el-table-column>
      <el-table-column prop="companyName" label="企业名称" width="220">
      </el-table-column>
      <el-table-column prop="ordered" label="排序" width="120">
      </el-table-column>
      <el-table-column prop="description" label="描述" width="500">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click="handleClickEdit(scope.row)"
            type="text"
            size="small"
            >编辑</el-button
          >
          <el-button
            type="text"
            size="small"
            @click="deleteBrandItem(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      >
      </el-pagination>
    </div>

    <div>
      <el-dialog title="品牌信息" :visible.sync="dialogFormVisible">
        <el-form :model="brandItem">
          <el-form-item label="品牌名称" :label-width="formLabelWidth">
            <el-input
              v-model="brandItem.brandName"
              auto-complete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="公司名称" :label-width="formLabelWidth">
            <el-input
              v-model="brandItem.companyName"
              auto-complete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述" :label-width="formLabelWidth">
            <el-input
              v-model="brandItem.description"
              auto-complete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="排序" :label-width="formLabelWidth">
            <el-input
              v-model="brandItem.ordered"
              auto-complete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="售后状态" :label-width="formLabelWidth">
            <el-select v-model="brandItem.status" placeholder="请选择活动区域">
              <el-option label="开启" value="shanghai"></el-option>
              <el-option label="关闭" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmUpdateItem">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleClickEdit (row) {
      this.dialogFormVisible = true
      this.brandItem = row
    },
    confirmUpdateItem () {
      const { brandName, companyName, description, ordered, status, id } =
        this.brandItem
      this.$http
        .post('/brand/ServletForUpdateBrandInfo', {
          brandName,
          companyName,
          description,
          ordered,
          status,
          id
        })
        .then((res) => {
          this.$message.success('success')
          this.dialogFormVisible = false
          this.getAllBrand()
        })
    },
    deleteBrandItem ({ id }) {
      this.$http.post('/brand/ServletDeleteBrandById', { id }).then((res) => {
        this.$message.success('success')
        this.getAllBrand()
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    batchesDel () {
      const arr = []
      this.multipleSelection.map((item) => {
        arr.push(item.id)
      })
      !arr.length && this.$message.error('错了哦，这是一条错误消息')

      arr.length &&
        this.$http
          .post('/brand/BatchesDeleteByIds', { data: arr })
          .then((res) => {
            this.getAllBrand()
          })
    },
    onSubmit () {
      const { brandName, companyName, region } = this.formInline
      const data = {
        brandName,
        companyName,
        status: region,
        currentPage: this.currentPage,
        pageSize: this.PageSize
      }
      this.$http.post('/brand/selectByPageAndCondition', data).then(res => {
        const { rows, totalCount } = res
        this.tableData = rows
        this.totalCount = totalCount
      })
    },
    handleSizeChange (val) {
      this.PageSize = val
      this.getAllBrand()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getAllBrand()
    },
    getAllBrand () {
      this.$http.post('/brand/selectByPage', { currentPage: this.currentPage, pageSize: this.PageSize }).then(res => {
        const { rows, totalCount } = res
        this.tableData = rows
        this.totalCount = totalCount
      })
    }
  },

  data () {
    return {
      tableData: [],
      formInline: {
        brandName: '',
        companyName: '',
        region: ''
      },
      currentPage: 1,
      dialogTableVisible: false,
      dialogFormVisible: false,
      brandItem: {
        brandName: '',
        companyName: '',
        description: '',
        ordered: '',
        status: ''
      },
      multipleSelection: [],
      formLabelWidth: '120px',
      totalCount: 0,
      PageSize: 10
    }
  },
  created () {
    this.getAllBrand()
  }
}
</script>
