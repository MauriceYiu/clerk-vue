<template>
  <div id="open-table" :class="showOpenTable?'show':''">
    <div class="set-item" v-if="isOpenOrBook=='BUSY'">
      <span class="left-tit">开单时间</span>
      <div class="right-cont">
        <span class="cont">{{curSelTableOpenInfo.beginTime | numberToAllDate}}</span>
        <!-- <i class="iconfont icon-arrow-right-copy"></i> -->
      </div>
    </div>
    <div class="set-item" v-if="isOpenOrBook=='BOOK'">
      <span class="left-tit">预抵时间</span>
      <div class="right-cont">
        {{new Date(arriveTime.replace(/\-/g, "/")).Format('yyyy/MM/dd hh:mm')}}
        <input id="arriveTime" type="text" readonly="" v-model="arriveTime"  name="input_date" data-lcalendar="2019-09-09,2030-09-09" style="opacity:0;position:absolute;top:0;left:0;right:0;width:100%;height:100%;" placeholder="请选择时间" />
        <i class="iconfont icon-arrow-right-copy"></i>
      </div>
    </div>
    <div class="line" v-if="isOpenOrBook=='BOOK'"></div>
    <div class="set-item" v-if="isOpenOrBook=='BOOK'">
      <span class="left-tit">取消时间</span>
      <div class="right-cont">
        {{new Date(cancelTime.replace(/\-/g, "/")).Format('yyyy/MM/dd hh:mm')}}
        <input id="cancelTime" type="text" readonly="" v-model="cancelTime"  name="input_date" data-lcalendar="2019-09-09,2030-09-09" style="opacity:0;position:absolute;top:0;left:0;right:0;width:100%;height:100%;" placeholder="请选择时间" />
        <i class="iconfont icon-arrow-right-copy"></i>
      </div>
    </div>
    <div class="line" v-if="isOpenOrBook=='BOOK'"></div>
    <div class="set-item" v-if="isOpenOrBook=='BOOK'" @click.stop="showSetInp=true;showMask=true;nowSetInp='bookMobile'">
      <span class="left-tit">联系电话</span>
      <div class="right-cont">
        <span class="cont">{{curSelTableOpenInfo.bookMobile}}</span>
        <i class="iconfont icon-arrow-right-copy"></i>
      </div>
    </div>
    <div class="line"></div>
    <div class="set-item" v-if="isOpenOrBook=='BOOK'" @click.stop="showSetInp=true;showMask=true;nowSetInp='bookName'">
      <span class="left-tit">预订人</span>
      <div class="right-cont">
        <span class="cont">{{curSelTableOpenInfo.bookName}}</span>
        <i class="iconfont icon-arrow-right-copy"></i>
      </div>
    </div>
    <!-- <div class="line" v-if="isOpenOrBook=='BOOK'"></div>
    <div class="set-item" @click.stop="showRule">
      <span class="left-tit">计费类型</span>
      <div class="right-cont">
        <span class="cont">{{nowRule.ruleName}}</span>
        <i v-if="!isChange" class="iconfont icon-arrow-right-copy"></i>
      </div>
    </div> -->
    <div class="line" v-if="isOpenOrBook=='BOOK'"></div>
    <div class="set-item" @click.stop="showSetInp=true;showMask=true;nowSetInp='bookPeople'">
      <span class="left-tit">顾客人数</span>
      <div class="right-cont">
        <span class="cont">{{curSelTableOpenInfo.people}}人</span>
        <i class="iconfont icon-arrow-right-copy"></i>
      </div>
    </div>
    <div class="line"></div>
    <div class="set-item" >
      <span class="left-tit">服务员</span>
      <div class="right-cont">
        <span class="cont">{{nowEmp.empName}}</span>
        <!-- <i class="iconfont icon-arrow-right-copy"></i> -->
      </div>
    </div>
    <div class="span-panle"></div>
    <div class="set-item other-sty">
      <span class="left-tit">备注信息</span>
      <div class="right-cont">
        <textarea placeholder="请输入备注信息..." v-model="curSelTableOpenInfo.notice"></textarea>
      </div>
    </div>
    <div class="button">
      <button v-if="isOpenOrBook=='BUSY'" class="sure" @click="open()">{{isChange?'确定修改':'确定开单'}}</button>
      <button v-if="isOpenOrBook=='BOOK'" class="sure" @click="sureBook()">{{isChange?'确定':'确定预约'}}</button>
      <!-- <button v-if="isOpenOrBook=='BOOK'&&showCartInfoType=='afterOpen'" class="sure" @click="afterOpen()">开单</button> -->
      <!-- <button v-if="isOpenOrBook=='BOOK'&&showCartInfoType=='afterOpen'" class="sure book" @click="afterOpen()">取消</button> -->
      <button class="cancel"  @click="$emit('hideOpenTable')">返回</button>
      <!-- <button class="cancel book"  v-if="isOpenOrBook=='BOOK'"  @click="$emit('hideOpenTable')">返回</button> -->
    </div>
    <div class="mask" v-if="showMask" @click.stop="showMask=false;showRulesList=false;showSetInp=false;">
        <div class="mask-cont" @click.stop="">
            <div class="rule-list" v-if="showRulesList">
                <ul >
                    <li v-for="(item,index) in curSelTableOpenInfo.rules" 
                    @click.stop="changeRules(item)"
                    :key="index">{{item.ruleName}}</li>
                </ul>
            </div>
            <div class="set-people" v-if="showSetInp">
                <div>
                    <input type="text" v-model="inpVal" placeholder="请输入..." />
                </div>
                <div class="btn">
                    <button class="sure" @click.stop="setInpVal()">确认</button>
                    <button  @click.stop="showMask=false;showSetInp=false;">取消</button>
                </div>
            </div>
        </div>
    </div>
    <div class="use-or-cancel" v-if="showUseOrModify" @click.stop="showUseOrModify=false">
        <div class="use-or-cancel-wrap">
          <div class="use" @click.stop="toUseOrModify(null,'USE')">使用</div>
          <div class="modify" @click.stop="toUseOrModify(null,'MODIFY')">修改</div>
          <div class="cancel" @click.stop="toUseOrModify(null,'CANCEL')">取消台桌</div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["showOpenTable", "curSelTableOpenInfo","curSelTable","storeId","isOpenOrBook","isChange","showCartInfoType"],
  data() {
    return {
      showUseOrModify:false,
      nowSetInp:'',
      cancelTime:new Date().Format("yyyy/MM/dd hh:mm:ss"),
      arriveTime:new Date().Format("yyyy/MM/dd hh:mm:ss"),
      showSetInp:false,
      showRulesList:false,
      showMask:false,
      notice: "",
      empList: [],
      ruleList:[],
      inpVal:"",
      nowRule: { ruleName: "暂无", ruleId: -1 }, //当前规则
      nowEmp: {
        empId: "",
        empName: "",
        mobile: ""
      }, //当前员工
      canClick:true,
      calendarForArriveTime:null,
      calendarForCancelTime:null,

    };
  },
  watch: {
    showOpenTable(val) {
      console.log(val)
      if (val) {
        this.$nextTick(() => {this.reNewInfo()});
      }
    },
    cancelTime(val){
      console.log(val)
    }
  },
  methods: {
    toUseOrModify(table,type){
        this.showUseOrModify = false;
        if(type=="USE"){
          console.log("Kkk")
            this.afterOpen();
            return;
        }else if(type=="MODIFY"){
            this.isChange = true;
            // 修改当前显示的预定信息页面，和购物车同一组件
            this.isOpenOrBook = "BOOK";
            this.showCartInfoType = "afterOpen";
            // this.getnumDetail(this.curSelTable.deskID,"BOOK");
            this.doModifyTableInfo();
            return;
        }else if(type=="CANCEL"){
          this.cancelBook();
        }
    },
    cancelBook(){
      this.$http({
        url:"cancel-book",
        method:"POST",
        data:{
          numId:this.curSelTableOpenInfo.numId,
        }
      }).then(res=>{
        if(res.data.code == 200){
          this.$message({
              message: res.data.msg,
              showClose: true,
              customClass: 'success'
          });
          this.$emit('hideOpenTable');
        }else if(res.data.code == 400){
          this.$message({
              message: res.data.msg,
              showClose: true,
              customClass: 'error'
          });
        }
      });
    },
    showRule(){
      if(this.isChange){
        return;
      }
      this.showRulesList=true;
      this.showMask=true;
    },
    afterOpen(){
        let flag = this.check();
        if(!flag){
            return;
        }
        console.log(this.canClick)
        if(!this.canClick){
            return;
        }
        this.canClick = false;
        this.$http({
            url:"busy-open",
            method:"POST",
            data:{
                numId:this.curSelTable.deskID,//桌号id
                source:this.isOpenOrBook,
                storeId:this.storeId,
                empName:this.nowEmp.empName,
                empId:this.nowEmp.empId,
                mobile:this.nowEmp.mobile,
                // ruleId:this.nowRule.ruleId,
                // ruleName:this.nowRule.ruleName,
                notice:this.curSelTableOpenInfo.notice,
                people:this.curSelTableOpenInfo.people,
                parName:this.curSelTableOpenInfo.parName,
                parId:this.curSelTable.parId,
                numName:this.curSelTableOpenInfo.numName,
                beginTime:new Date(this.curSelTableOpenInfo.addTime).Format("yyyy-MM-dd hh:mm:ss")
            }
        }).then(res=>{
            this.canClick = true;
            if(res.data.code == 400){
                this.$message({
                    message: res.data.msg,
                    customClass: 'error'
                });
                this.showOpenOrBook = false;
                return;
            }
            this.$emit("goSelGoods",{orderId:res.data.data});
        }).catch(err=>{
            this.canClick = true;
        });
    },
    open(){
        let flag = this.check();
        if(!flag){
            return;
        }
        if(this.isChange){
          this.doModifyTableInfo();
          return;
        }
        console.log(this.canClick)
        if(!this.canClick){
            return;
        }
        this.canClick = false;
       
        this.$http({
            url:"open-num",
            method:"POST",
            data:{
                numId:this.curSelTable.deskID,//桌号id
                source:this.isOpenOrBook,
                storeId:this.storeId,
                empName:this.nowEmp.empName,
                empId:this.nowEmp.empId,
                mobile:this.nowEmp.mobile,
                // ruleId:this.nowRule.ruleId,
                // ruleName:this.nowRule.ruleName,
                notice:this.curSelTableOpenInfo.notice,
                people:this.curSelTableOpenInfo.people,
                parName:this.curSelTableOpenInfo.parName,
                parId:this.curSelTable.parId,
                numName:this.curSelTableOpenInfo.numName,
                beginTime:new Date(this.curSelTableOpenInfo.beginTime).Format("yyyy-MM-dd hh:mm:ss")
            }
        }).then(res=>{
            this.canClick = true;
            if(res.data.code == 400){
                this.$message({
                    message: res.data.msg,
                    customClass: 'error'
                });
                this.showOpenOrBook = false;
                return;
            }
            this.$emit("goSelGoods",{orderId:res.data.data});
        }).catch(err=>{
            this.canClick = true;
        });
    },
    check(){
        // if(!this.nowRule.ruleId || this.nowRule.ruleId == -1){
        //     this.$message({
        //         message: "请选择计费规则",
        //         customClass: 'error'
        //     });
        //     return false;
        // }
        if(!/^\d+$/.test(this.curSelTableOpenInfo.people)){
            this.$message({
                message: "人数填写错误",
                customClass: 'error'
            });
            return false;
        }
        if(this.curSelTableOpenInfo.people == 0){
            this.$message({
                message: "请填写人数",
                customClass: 'error'
            });
            return false;
        }
        if(this.isOpenOrBook=='BOOK'){
          if(!this.curSelTableOpenInfo.bookMobile){
              this.$message({
                  message: "请填写联系电话",
                  customClass: 'error'
              });
              return false;
          }
          if(!this.curSelTableOpenInfo.bookName){
              this.$message({
                  message: "请填写预定人名字",
                  customClass: 'error'
              });
              return false;
          }
        }
        return true;
    },
    // 修改台桌信息
    doModifyTableInfo(){
        let data = {
                empId:this.nowEmp.empId,
                empName:this.nowEmp.empName,
                people:this.curSelTableOpenInfo.people,
                notice:this.curSelTableOpenInfo.notice,
                numId:this.curSelTable.deskID,//桌号id
                ruleId:this.nowRule.ruleId,
                ruleName:this.nowRule.ruleName,
            }
        if(this.showCartInfoType == "afterOpen"){
            data = Object.assign(data,{
                bookTime:new Date(this.arriveTime.replace(/\-/g, "/")).Format("yyyy-MM-dd hh:mm:ss"),
                cancelTime:new Date(this.cancelTime.replace(/\-/g, "/")).Format("yyyy-MM-dd hh:mm:ss"),
                bookName:this.curSelTableOpenInfo.bookName,
                bookMobile:this.curSelTableOpenInfo.bookMobile,
            })
        }
        this.$http({
                url:'merge-tran',
                method:"POST",
                data
        }).then(res=>{
            if(res.status == 200){
                this.$message({
                    message: "修改成功",
                    showClose: true,
                    customClass: 'success'
                });
                this.$emit('hideOpenTable');
                this.showOpenBook = false;
                this.$emit("doGetNumDetail",{deskId:this.curSelTable.deskID});
                this.canClick = true;
            }
        }).catch(err=>{
            this.canClick = true;
        })
    },
     sureBook(){
      let flag = this.check();
      if(!flag){
          return;
      }
      if(this.showCartInfoType == "afterOpen"){
        this.showUseOrModify = true;
          return;
          // this.doModifyTableInfo();
          // return;
      }
      if(!this.canClick){
          return;
      }
      this.canClick = false;
      
      this.$http({
          url:'/open-num',
          method:"POST",
          data:{
              numId:this.curSelTable.deskID,//桌号id
              source:this.isOpenOrBook,
              storeId:this.storeId,
              empName:this.nowEmp.empName,
              empId:this.nowEmp.empId,
              mobile:this.nowEmp.mobile,
              // ruleId:this.nowRule.ruleId,
              // ruleName:this.nowRule.ruleName,
              bookMobile:this.curSelTableOpenInfo.bookMobile,
              notice:this.curSelTableOpenInfo.notice,
              people:this.curSelTableOpenInfo.people,
              parName:this.curSelTableOpenInfo.parName,
              parId:this.curSelTableOpenInfo.parId,
              numName:this.curSelTableOpenInfo.numName,
              bookTime:new Date(this.arriveTime.replace(/\-/g, "/")).Format("yyyy-MM-dd hh:mm:ss"),
              cancelTime:new Date(this.cancelTime.replace(/\-/g, "/")).Format("yyyy-MM-dd hh:mm:ss"),
              bookName:this.curSelTableOpenInfo.bookName,
          }
      }).then(res=>{
          this.canClick = true;
          if(res.data.code == 400){
              this.$message({
                  message: res.data.msg,
                  showClose: true,
                  customClass: 'error'
              });
              this.
              return;
          }
          this.$emit('hideOpenTable');
          this.canClick = true;
      }).catch(err=>{
          this.canClick = true;
      });
  },
    setInpVal(){
      if(this.nowSetInp == 'bookPeople'){
        if(!/^\d+$/.test(this.inpVal)){
            this.$message({
                message: "人数填写错误",
                customClass: 'error'
            });
            return false;
        }
        if(this.inpVal == 0){
            this.$message({
                message: "请填写人数",
                customClass: 'error'
            });
            return false;
        }
        this.curSelTableOpenInfo.people = this.inpVal;
      }else if(this.nowSetInp == 'bookName'){
        this.curSelTableOpenInfo.bookName = this.inpVal;
      }else if(this.nowSetInp == 'bookMobile'){
        if(!/^\d{11}$/.test(this.inpVal)){
            this.$message({
                message: "手机号填写错误",
                showClose: true,
                customClass: 'error'
            });
            return false;
        }
        this.curSelTableOpenInfo.bookMobile = this.inpVal;
      }
        
        this.showMask=false;
        this.showSetInp=false;
        this.inpVal = "";
    },
    changeRules(item){
        this.nowRule = item;
        this.showRulesList = false;
        this.showMask = false;
    },
    reNewInfo() {
      this.empList = this.curSelTableOpenInfo.names;
      this.ruleList = this.curSelTableOpenInfo.rules;
      this.nowRule =
        this.curSelTableOpenInfo.rules.length == 1
          ? this.curSelTableOpenInfo.rules[0]
          : { ruleName: "暂无", ruleId: -1 };
    
      let empId = localStorage.getItem("empId");
      if(this.curSelTableOpenInfo.names.length==1){
          this.nowEmp = this.curSelTableOpenInfo.names[0];
      }

      for(let i=0;i<this.curSelTableOpenInfo.names.length;i++){
          if(this.curSelTableOpenInfo.names[i].empId == empId){
              this.nowEmp = this.curSelTableOpenInfo.names[i];
          }
      }
      if(this.curSelTableOpenInfo.bookTime){
        this.arriveTime = new Date(this.curSelTableOpenInfo.bookTime).Format('yyyy/MM/dd hh:mm');
        this.cancelTime = new Date(this.curSelTableOpenInfo.cancelTime).Format('yyyy/MM/dd hh:mm');
      }
      
    }
  },
  updated() {
    console.log($("input"))
      $("input").blur(function(){
          console.log('失去焦点')
          window.scrollTo(0,0);
      });
    $("textarea").blur(function(){
        console.log('失去焦点')
        window.scrollTo(0,0);
    });
    if(this.isOpenOrBook == 'BOOK'){
      this.$nextTick(() => {
        if(this.calendarForArriveTime || this.calendarForCancelTime){
          return;
        }
          this.calendarForArriveTime = new lCalendar();
          this.calendarForCancelTime = new lCalendar();
          this.calendarForArriveTime.init({
              'trigger': '#arriveTime', //标签id
              'type': 'datetime', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
              'minDate': '2016-9-9', //最小日期
              'maxDate': '2099-9-9' //最大日期
          });
          this.calendarForCancelTime.init({
              'trigger': '#cancelTime', //标签id
              'type': 'datetime', //date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择,
              'minDate': '2016-9-9', //最小日期
              'maxDate': '2099-9-9', //最大日期
          });
      });
    }
  },
  mounted() {
    this.$nextTick(() => {this.reNewInfo()});
  }
};
</script>

<style lang="scss" scope>
@import "./openTable.scss";
</style>
