<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
        <el-input v-model="select_word" size="mini" placeholder="请输入歌手名" class="handle-input"></el-input>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加歌手</el-button>
      </div>
    </div>

    <el-table size="mini" border style="width: 100%" height="680px" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40">

      </el-table-column>
      <el-table-column label="歌手图片" width="110" align="center">
        <template slot-scope="scope">
          <div class="singer-img">
            <img :src="getUrl(scope.row.pic)" style="width: 100%">
          </div>
          <el-upload :action="uploadUrl(scope.row.id)" :before-upload="beforeAvatorUpload" :on-success="handleAvatorSuccess">
            <el-button size="mini">更新图片</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="歌手" width="120" align="center"></el-table-column>
      <el-table-column label="性别" width="50" align="center">
        <template slot-scope="scope">
          {{changeSex(scope.row.sex)}}
        </template>
      </el-table-column>
      <el-table-column label="生日" width="120" align="center">
        <template slot-scope="scope">
          {{attachBirth(scope.row.birth)}}
        </template>
      </el-table-column>
      <el-table-column prop="location" label="地区" width="100" align="center"></el-table-column>
      <el-table-column label="简介">
        <template slot-scope="scope">
          <p style="height: 100px;overflow: scroll">
            {{scope.row.introduction}}
          </p>
        </template>
      </el-table-column>
      <el-table-column label="歌曲管理" width="110" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="songEdit(scope.row.id,scope.row.name)">歌曲管理</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination background
                     layout="total,prev,pager,next"
                     :current-page="currentPage"
                     :page-size="pageSize"
                     :total="tableData.length"
                     @current-change="handleCurrentChange">

      </el-pagination>

    </div>

    <el-dialog title="添加歌手" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" ref="registerForm" label-width="80px">
        <el-form-item label="歌手名" prop="name" size="mini">
          <el-input size="mini" v-model="registerForm.name" placeholder="歌手名"></el-input>
        </el-form-item>
        <el-form-item label="性别" size="mini">
          <el-radio-group v-model="registerForm.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
            <el-radio :label="2">组合</el-radio>
            <el-radio :label="3">不明</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="生日" prop="birth" size="mini">
          <el-date-picker type="date" placeholder="选择日期" v-model="registerForm.birth"
                          style="width: 100%"></el-date-picker>
        </el-form-item>

        <el-form-item label="地区" prop="location" size="mini">
          <el-input size="mini" v-model="registerForm.location"></el-input>
        </el-form-item>

        <el-form-item label="简介" prop="introduction" size="mini">
          <el-input size="mini" v-model="registerForm.introduction" type="textarea"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
        <el-button size="mini" @click="addSinger">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改歌手" :visible.sync="editVisible" width="400px" center>
      <el-form :model="form" ref="form" label-width="80px">
        <el-form-item label="歌手名" prop="name" size="mini">
          <el-input size="mini" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="性别" size="mini">
          <el-radio-group v-model="form.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
            <el-radio :label="2">组合</el-radio>
            <el-radio :label="3">不明</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="生日" size="mini">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.birth"
                          style="width: 100%"></el-date-picker>
        </el-form-item>

        <el-form-item label="地区" prop="location" size="mini">
          <el-input size="mini" v-model="form.location"></el-input>
        </el-form-item>

        <el-form-item label="简介" prop="introduction" size="mini">
          <el-input size="mini" v-model="form.introduction" type="textarea"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button size="mini" @click="editVisible = false">取消</el-button>
        <el-button size="mini" @click="editSave">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="删除歌手" :visible.sync="delVisible" width="300px" center>
      <div align="center">删除不可恢复，是否确定删除？</div>
      <span slot="footer">
        <el-button size="mini" @click="delVisible = false">取消</el-button>
        <el-button size="mini" @click="deleteRow">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {getAllSinger, setSinger, updateSinger,delSinger} from "../api";
import {mixin} from "../mixins";
export default {
  mixins: [mixin],
  data(){
    return{
      delVisible: false, //删除弹窗是否显示
      centerDialogVisible: false, //添加弹窗是否显示
      editVisible: false,  //编辑弹窗是否显示
      registerForm:{  //添加框
        name:'',
        sex:'',
        birth:'',
        location:'',
        introduction:''
      },
      form:{  //编辑框
        id: '',
        name:'',
        sex:'',
        birth:'',
        location:'',
        introduction:''
      },
      tableData: [],
      tempData: [], //模糊查询用
      select_word: '',  //模糊查询输入内容
      pageSize: 5,
      currentPage: 1,
      idx: -1, //当前选择项
      multipleSelection: [] //哪些项已经打钩了
    }
  },
  computed:{
    data(){ //计算当前搜索结果表里的数据
      return this.tableData.slice((this.currentPage - 1) * this.pageSize,this.currentPage * this.pageSize);
    }
  },
  watch:{
    select_word: function () { //搜索框里面的内容发生变化的时候 列表显示随之变化
      if(this.select_word == ''){
        this.tableData = this.tempData;
      }else{
        this.tableData = [];
        for (let item of this.tempData) {
          if(item.name.includes(this.select_word)){
            this.tableData.push(item);
          }
        }
      }
    }
  },
  created() {
    this.getData();
  },
  methods:{
    handleCurrentChange(val){
      this.currentPage = val;
    },
    getData(){
      this.tempData = [];
      this.tableData = [];
      getAllSinger().then(res => {
        this.tableData = res;
        this.tempData = res;
      }).catch(err => {

      });
    },

    //添加歌手
    addSinger(){
      let d = this.registerForm.birth;
      let datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      let params = new URLSearchParams();
      params.append('name',this.registerForm.name);
      params.append('sex',this.registerForm.sex);
      params.append('pic','/img/singerPic/hhh.jpg');
      params.append('birth',datetime);
      params.append('location',this.registerForm.location);
      params.append('introduction',this.registerForm.introduction);
      setSinger(params).then(res => {
        if(res.code == 1){
          this.notify("添加成功","success")
          this.getData()
        }else{
          this.notify("添加失败","error")
        }
      }).catch(err => {
        console.log(err)
      });
      this.centerDialogVisible = false
    },
    handleEdit(row){ //弹出编辑页面
      this.editVisible = true;
      this.form = {
        id: row.id,
        name:row.name,
        sex:row.sex,
        birth:row.birth,
        location:row.location,
        introduction:row.introduction
      }

    },
    editSave(){ //保存编辑页面的数据
      let d = new Date(this.form.birth);
      let datetime = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
      let params = new URLSearchParams();
      params.append('id',this.form.id);
      params.append('name',this.form.name);
      params.append('sex',this.form.sex);
      params.append('birth',datetime);
      params.append('location',this.form.location);
      params.append('introduction',this.form.introduction);
      updateSinger(params).then(res => {
        if(res.code == 1){
          this.notify("修改成功","success")
          this.getData()
        }else{
          this.notify("修改失败","error")
        }
      }).catch(err => {
        console.log(err)
      });
      this.editVisible = false
    },
    //更新图片
    uploadUrl(id){
      return `${this.$store.state.HOST}/singer/updateSingerPic?id=${id}`
    },
    deleteRow(){ //删除歌手
      delSinger(this.idx).then(res => {
        if(res){
          this.notify("删除成功","success")
          this.getData()
        }else{
          this.notify("删除失败","error")
        }
      }).catch(err => {
        console.log(err)
      });
      this.delVisible = false;
    },
    songEdit(id,name){ //转向歌曲管理页面
      this.$router.push({path:'/Song',query:{id,name}})
    }
  }

}
</script>

<style scoped>

.handle-box {
  margin-bottom: 30px;
}

.singer-img {
  width: 100%;
  height: 80px;
  border-radius: 5px;
  margin-bottom: 5px;
  overflow: hidden;
}

.handle-input {
  width: 300px;
  display: inline-block;
}

.pagination {
  display: flex;
  justify-content: center;
}

</style>
