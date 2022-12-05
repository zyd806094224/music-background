export const mixin = {
  methods: {
    // 提示信息
    notify (title, type) {
      this.$notify({
        title: title,
        type: type
      })
    },
    // 根据相对地址获取绝对地址
    getUrl (url) {
      return `${this.$store.state.HOST}/${url}`
    },
    //获取性别
    changeSex(value){
      if(value == 0){
        return '男';
      }
      if(value == 1){
        return '女';
      }
      if(value == 2){
        return '组合';
      }
      if(value == 3){
        return '不明';
      }
      return value;
    },
    attachBirth(value){ //生日显示转换
      return String(value).substr(0,10);
    },
    beforeAvatorUpload(file){ //上传图片之前的校验
      console.log('zzz' + file.type)
      const isJPG = file.type.endsWith('image/jpeg') || file.type.endsWith('image/png');
      if(!isJPG){
        this.$message.error('上传头像必须是jpg或者png格式');
        return false;
      }
      const isLt2M = (file.size/1024/1024) < 2;
      if(!isLt2M){
        this.$message.error('上传头像大小不能超过2M');
        return false;
      }
      return true;
    },
    handleAvatorSuccess(res){ //上传图片成功之后
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
    handleDelete(id){ //弹出删除窗口
      this.idx = id;
      this.delVisible = true;
    },
    handleSelectionChange(val){ //把已经选择的项赋值给multipleSelection
      this.multipleSelection = val;
    },
    delAll(){ //批量删除已经选择的项
      for (let item of this.multipleSelection) {
        this.handleDelete(item.id);
        this.deleteRow();
      }
      this.multipleSelection = [];
    }
  }
}
