<template>
  <div class="table">
    <div class="crumbs">
      <i class="el-icon-tickets"></i>歌曲信息
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
        <el-input v-model="select_word" size="mini" placeholder="请输入歌曲名" class="handle-input"></el-input>
        <el-button type="primary" size="mini" @click="centerDialogVisible = true">添加歌曲</el-button>
      </div>
    </div>

    <el-table size="mini" border style="width: 100%" height="680px" :data="data" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40">

      </el-table-column>
      <el-table-column label="歌曲图片" width="110" align="center">
        <template slot-scope="scope">
          <div class="song-img">
            <img :src="getUrl(scope.row.pic)" style="width: 100%">
          </div>
          <div class="play" @click="setSongUrl(scope.row.url,scope.row.id)">
            <div v-if="toggle == scope.row.id">
              <svg class="icon">
                <use xlink:href="#icon-zanting"></use>
              </svg>
            </div>
            <div v-if="toggle != scope.row.id">
              <svg class="icon">
                <use xlink:href="#icon-bofanganniu"></use>
              </svg>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="歌手-歌名" width="120" align="center"></el-table-column>
      <el-table-column prop="introduction" label="专辑" width="150" align="center"></el-table-column>
      <el-table-column label="歌词" align="center">
        <template slot-scope="scope">
          <ul style="height: 100px;overflow: scroll">
            <li v-for="(item,index) in parseLyric(scope.row.lyric)" :key="index">
              {{item}}
            </li>
          </ul>
        </template>
      </el-table-column>

      <el-table-column label="资源更新" align="center" width="150">
        <template slot-scope="scope">
          <el-upload :action="uploadUrl(scope.row.id)" :before-upload="beforeAvatorUpload"
                     :on-success="handleAvatorSuccess">
            <el-button size="mini">更新图片</el-button>
          </el-upload>
          <br/>
          <el-upload :action="uploadSongUrl(scope.row.id)" :before-upload="beforeSongUpload"
                     :on-success="handleSongSuccess">
            <el-button size="mini">更新歌曲</el-button>
          </el-upload>
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

    <el-dialog title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form :model="registerForm" ref="registerForm" label-width="80px" action="" id="tf">
        <div>
          <label>歌名</label>
          <el-input type="text" name="name" v-model="input"></el-input>
        </div>
        <div>
          <label>专辑</label>
          <el-input type="text" name="introduction" v-model="input2"></el-input>
        </div>
        <div>
          <label>歌词</label>
          <el-input type="textarea" name="lyric" v-model="input3"></el-input>
        </div>
        <div>
          <label>歌曲上传</label>
          <input type="file" name="file"></input>
        </div>
      </el-form>

      <span slot="footer">
        <el-button size="mini" @click="centerDialogVisible = false">取消</el-button>
        <el-button size="mini" @click="addSong">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改歌曲" :visible.sync="editVisible" width="400px" center>
      <el-form :model="form" ref="form" label-width="80px">
        <el-form-item label="歌手-歌名" prop="name" size="mini">
          <el-input size="mini" v-model="form.name" placeholder="歌手-歌名"></el-input>
        </el-form-item>

        <el-form-item label="专辑" prop="introduction" size="mini">
          <el-input size="mini" v-model="form.introduction" placeholder="专辑"></el-input>
        </el-form-item>
        <el-form-item label="歌词" prop="lyric" size="mini">
          <el-input size="mini" v-model="form.lyric" placeholder="专辑" type="textarea"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button size="mini" @click="editVisible = false">取消</el-button>
        <el-button size="mini" @click="editSave">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="删除歌曲" :visible.sync="delVisible" width="300px" center>
      <div align="center">删除不可恢复，是否确定删除？</div>
      <span slot="footer">
        <el-button size="mini" @click="delVisible = false">取消</el-button>
        <el-button size="mini" @click="deleteRow">确定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import {mixin} from "../mixins";
import {mapGetters} from "vuex";
import {songOfSingerId, updateSong,deleteSong} from "../api";

export default {
  mixins: [mixin],
  data(){
    return{
      singerId: '',  //传过来的歌手id
      singerName: '', //传过来的歌手名
      delVisible: false, //删除弹窗是否显示
      centerDialogVisible: false, //添加弹窗是否显示
      editVisible: false,  //编辑弹窗是否显示
      registerForm:{  //添加框
        name:'',
        singerName:'',
        lyric:'',
        introduction:''
      },
      form:{  //编辑框
        id: '',
        name:'',
        lyric:'',
        introduction:''
      },
      tableData: [],
      tempData: [], //模糊查询用
      select_word: '',  //模糊查询输入内容
      pageSize: 5,
      currentPage: 1,
      idx: -1, //当前选择项
      multipleSelection: [], //哪些项已经打钩了
      input: '',
      input2: '',
      input3: '',
      toggle: ''  //播放器的显示图标状态
    }
  },
  computed:{
    ...mapGetters([
      'isPlay'
    ]),
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
    this.singerId = this.$route.query.id;
    this.singerName = this.$route.query.name;
    this.getData();
  },
  destroyed() {
    this.$store.commit('setIsPlay',false);
  },
  methods:{
    handleCurrentChange(val){
      this.currentPage = val;
    },
    getData(){
      this.tempData = [];
      this.tableData = [];
      songOfSingerId(this.singerId).then(res => {
        this.tableData = res;
        this.tempData = res;
        this.currentPage = 1;
      }).catch(err => {

      });
    },

    //添加歌曲
    addSong(){
      let _this = this;
      var form = new FormData(document.getElementById('tf'));
      form.append('singerId',this.singerId);
      form.set('name',this.singerName + '-' + form.get('name'));

      if(!form.get('lyric')){
        form.set('lyric','[00:00:00]暂无歌词');
      }
      var req = new XMLHttpRequest();
      req.onreadystatechange = new function () {
        if(req.readyState == 4 && req.status == 200){//获取到返回的完整数据 && 200与后台正常交互完成
          let res = JSON.parse(req.response);
          if(res.code){
            _this.registerForm = {};
            console.log("zzzzzz")
            _this.getData();
            console.log("zzzzzz2")
            _this.notify(req.msg,'success');
            console.log("zzzzzz3")
          }else{
            _this.notify('保存失败','error');
          }
        }
      }
      req.open('post',`${_this.$store.state.HOST}/song/add`,false);
      req.send(form);
      _this.centerDialogVisible = false
    },
    handleEdit(row){ //弹出编辑页面
      this.editVisible = true;
      this.form = {
        id: row.id,
        name: row.name,
        introduction: row.introduction,
        lyric: row.lyric
      }

    },
    editSave(){ //保存编辑页面的数据
      let params = new URLSearchParams();
      params.append('id',this.form.id);
      params.append('name',this.form.name);
      params.append('introduction',this.form.introduction);
      params.append('lyric',this.form.lyric);
      updateSong(params).then(res => {
        if(res.code == 1){
          this.getData()
          this.notify("修改成功","success")
        }else{
          this.notify("修改失败","error")
        }
      }).catch(err => {
        console.log(err)
      });
      this.editVisible = false
    },
    //更新歌曲图片
    uploadUrl(id){
      return `${this.$store.state.HOST}/song/updateSongPic?id=${id}`
    },
    deleteRow(){ //删除歌曲
      deleteSong(this.idx).then(res => {
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
    parseLyric(text){ //解析歌词
      let lines = text.split("\n");
      let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;
      let result = [];
      for (let item of lines) {
        let value = item.replace(pattern,'');
        result.push(value);
      }
      return result;
    },beforeSongUpload(file){ //上传歌曲之前的校验
      var testMsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      if(testMsg != 'mp3'){
        this.$message.error({
          message: '上传文件只能是mp3格式',
          type: "error"
        });
        return false;
      }
      return true;
    },
    handleSongSuccess(res){ //上传歌曲成功之后
      let _this = this;
      if(res.code == 1){
        _this.getData();
        _this.$notify({
          title: '上传成功',
          type: 'success'
        });
      }else{
        _this.$notify({
          title: '上传失败',
          type: 'error'
        });
      }
    },
    uploadSongUrl(id){ //更新歌曲url
      return `${this.$store.state.HOST}/song/updateSongUrl?id=${id}`
    },
    setSongUrl(url,id){//切换(播放/暂停)歌曲
      this.toggle = id;
      this.$store.commit('setUrl',this.$store.state.HOST + url);
      if(this.isPlay){
        this.$store.commit('setIsPlay',false);
      }else{
        this.$store.commit('setIsPlay',true);
      }
    }
  }

}
</script>

<style scoped>

.handle-box {
  margin-bottom: 30px;
}

.song-img {
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

.play{
  position: absolute;
  z-index: 100;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  top: 15px;
  left: 15px;
}

.icon{
  width: 2em;
  height: 2em;
  color: yellowgreen;
  fill: currentColor;
  overflow: hidden;
}

</style>
