<template>
  <div id="check-auth">
    <div class="wrap" @click.stop>
      <div class="item" v-if="checkType=='cancelGoods'">
        <div class="info left-tit">取消数量:</div>
        <div class="info right-cont">
          <input type="text" v-model="count" />
        </div>
      </div>
      <div class="item">
        <div class="info left-tit">授权密码:</div>
        <div class="info right-cont">
          <input type="password" v-model="pwd" />
        </div>
      </div>
      <div class="btn">
        <button class="close" @click.stop="$emit('closeCheckAuth')">关闭</button>
        <button class="sure" @click.stop="sure">确认</button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["checkType", "goodsInfo","orderInfo"],
  data() {
    return {
      count: 0,
      pwd: ""
    };
  },
  methods: {
    sure() {
      if (this.checkType == "cancelGoods") {
        let flag = this.check();
        if (!flag) {
          return;
        }
        // 先判断授权密码
        this.checkpwdAndDoSth();
      }else if(this.checkType == "onlyCheckPwd"){
        this.checkpwdAndDoSth();
      }
    },
    check() {
      if (!/^\d+$/.test(this.count)) {
        this.$message({
          message: "数量输入错误",
          showClose: true,
          customClass: "error"
        });
        return false;
      }
      if (this.count > this.goodsInfo.count) {
        this.$message({
          message: "数量不能大于该商品原定数量",
          showClose: true,
          customClass: "error"
        });
        return false;
      }
      if (!this.count||this.count==0) {
        this.$message({
          message: "数量必须大于零",
          showClose: true,
          customClass: "error"
        });
        return false;
      }
      if (!this.pwd) {
        this.$message({
          message: "请填写授权密码",
          showClose: true,
          customClass: "error"
        });
        return false;
      }
      return true;
    },
    checkpwdAndDoSth() {
      if (!this.pwd) {
        this.$message({
          message: "请输入密码",
          showClose: true,
          customClass: "error"
        });
        return;
      }
      let pwd = new Base64();
      let pwdStr = "hxbs 123.999" + pwd.encode(this.pwd);
      this.$http({
        url: "judge-psw",
        method: "POST",
        data: {
          storeId: localStorage.getItem("storeId"),
          judgePsw: pwdStr
        }
      }).then(res => {
        if (res.data.code == 400) {
          this.$message({
            message: res.data.msg,
            showClose: true,
            customClass: "error"
          });
          return;
        } else if (res.data.code == 200) {
          // 减少商品
          if (this.checkType == "cancelGoods") {
            this.doCancelGoods();
          }else if(this.checkType == "onlyCheckPwd"){
            this.$emit('closeCheckAuth',{flag:true});
          }
        }
      });
    },
    doCancelGoods() {
      this.$http({
        url: "pre-cancel-item",
        method: "GET",
        params: {
          itemId: this.goodsInfo.orderItemId,
          qty: this.count,
          orderId:this.orderInfo.res.orderId
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.$message({
            message: res.data.msg,
            showClose: true,
            customClass: "success"
          });
          this.pwd = "";
          this.$emit("closeCheckAuth");
          return;
        } else if (res.data.code == 400) {
          this.$message({
            message: res.data.msg,
            showClose: true,
            customClass: "error"
          });
          return;
        }
      });
    }
    // doCancelGoods() {
    //   this.$http({
    //     url: "cancel-item",
    //     method: "GET",
    //     params: {
    //       itemId: this.goodsInfo.orderItemId,
    //       qty: this.count
    //     }
    //   }).then(res => {
    //     if (res.data.code == 200) {
    //       this.$message({
    //         message: res.data.msg,
    //         showClose: true,
    //         customClass: "success"
    //       });
    //       this.pwd = "";
    //       this.$emit("closeCheckAuth");
    //       return;
    //     } else if (res.data.code == 400) {
    //       this.$message({
    //         message: res.data.msg,
    //         showClose: true,
    //         customClass: "error"
    //       });
    //       return;
    //     }
    //   });
    // }
  },
  updated() {
    console.log($("input"))
    $("input").blur(function(){
        console.log('失去焦点')
        window.scrollTo(0,0);
    });
    
  },
  mounted() {
    console.log($("input"))
    $("input").blur(function(){
        console.log('失去焦点')
        window.scrollTo(0,0);
    });
  },
};
</script>
<style lang="scss" scoped>
@import "./checkAuth.scss";
</style>