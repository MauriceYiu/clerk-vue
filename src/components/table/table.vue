<template>
  <div class="table">
    <div class="left-cont">
      <div class="left-top-area">
        <ul>
          <li :class="nowAreaIndex==-1?'active':''" @click="getThisAreaTable(0,-1)"><span class="area-name">全部区域</span></li>
          <li v-for="(item,index) in parList" :key="index" :class="nowAreaIndex==index?'active':''"
           @click="getThisAreaTable(item,index)"><span class="area-name">{{item.partitionName}}</span></li>
        </ul>
      </div>
      <!-- <div class="bottom-area-status">
        <div :class="statusActive=='FREE'?'status-item free active':'status-item free'" @click="statusActive='FREE'">
          <span class="status-cir"></span>
          <span>空闲</span>
        </div>
        <div :class="statusActive=='BUSY'?'status-item busy active':'status-item busy'" @click="statusActive='BUSY'">
          <span class="status-cir"></span>
          <span>占用</span>
        </div>
        <div :class="statusActive=='BOOK'?'status-item book active':'status-item book'" @click="statusActive='BOOK'">
          <span class="status-cir"></span>
          <span>预定</span>
        </div>
      </div> -->
    </div>
    <div class="clear-left-cont"></div>
    <div class="right-cont" id="table-list-wrap">
      <div class="table-list">
        <div class="desk" v-for="(item,index) in tableList" :key="index">
            <h3 class="par-name">{{item.parName}}</h3>
            <ul v-if="item.desks.length">
                <li v-for="(deskItem,deskIndex) in item.desks" :key="deskIndex">
                    <div :class="deskHeadCss[deskItem.status]" 
                    @click.stop="clickTable(deskItem,index)">
                    <div class="table-name">{{deskItem.deskName}}</div>
                    <span class="table-time">{{deskItem.status=='FREE'?'空闲中':(deskItem.status=='BUSY'?`消费:${deskItem.amount}元`:(deskItem.status=='FAULT'?'故障':'已预订'))}}</span>
                    <!-- <span class="table-bg iconfont icon-canju"></span> -->
                    </div>
                </li>
            </ul>
            <div class="no-table" v-else>此区暂无台桌</div>
        </div>
      </div>
    </div>
    <!-- 开单 -->
    <div class="click-table" v-if="showOpenOrBook" @click="showOpenOrBook=false">
        <div class="open-or-book" @click.stop="(showServerList=false,showSelStatus=false)">
            <!-- <div class="title">开单或预约</div> -->
            <!-- <div class="table-num">
                <span class="item-info">客位:</span><span>{{curSelTable.parName+"-"+curSelTable.numName}}</span>
            </div> -->
            <!-- <div class="table-status">
                <span class="item-info">状态:</span>
                <div class="sel-table-status" @click.stop="">
                    <div class="select" @click.stop="showSelStatus?(showSelStatus=false):(showSelStatus=true,showServerList=false)">
                        <span class="selected-item">{{openTableStatus=='BUSY'?"开单":"预约"}}</span>
                        <i class="iconfont icon-xiala"></i>
                    </div>
                    <div :class="showSelStatus?'status-list show':'status-list hidden'">
                        <div class="list-inner">
                            <ul>
                                <li @click="openTableStatus='BUSY';showSelStatus=false">开单</li>
                                <li @click="openTableStatus='BOOK';showSelStatus=false">预约</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="service">
                <span class="item-info">服务员:</span>
                <div class="sel-serv" @click.stop="">
                    <div class="select" @click.stop="showServerList?(showServerList=false):(showServerList=true,showSelStatus=false)">
                        <span class="selected-item">{{curSelEmp?curSelEmp.name:'暂无服务员'}}</span>
                        <i class="iconfont icon-xiala"></i>
                    </div>
                    <div :class="showServerList?'service-list show':'service-list hidden'">
                        <div class="list-inner" id="list-inner-emp">
                            <ul>
                                <li @click="curSelEmp=item;showServerList=false" v-for="(item,index) in empList" :key="index">{{item.name}}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div> -->
            <div class="button">
                <button class="open-table" @click.stop="doOpenOrBook('BUSY')"><i class="iconfont icon-diancai"></i>开单</button>
                <button class="sure" @click.stop="doOpenOrBook('BOOK')"><i class="iconfont icon-yuyue"></i>预定</button>
            </div>
        </div>
    </div>
    <div class="use-or-cancel" v-if="showUseOrCancel" @click.stop="showUseOrCancel=false">
        <div class="use-or-cancel-wrap">
          <div class="use" @click.stop="toUseOrModify(curSelTable,'USE')">使用</div>
          <div class="cancel" @click.stop="toUseOrModify(curSelTable,'MODIFY')">修改</div>
        </div>
    </div>
    <openTable 
    :showOpenTable="showOpenTable" 
    @hideOpenTable="hideOpenTable()"
    :curSelTable="curSelTable"
    :isOpenOrBook="isOpenOrBook"
    :storeId="storeId"
    :curSelTableOpenInfo="curSelTableOpenInfo"
    @goSelGoods="goSelGoods"
    :isChange="isChange"
    :showCartInfoType="showCartInfoType"
    />
    <!-- <selGoods
    v-show="showSelGoods"
    :nowDeskOrderInfo="nowDeskOrderInfo"
    @goSureSelGoods="goSureSelGoods"
    @closeSelGoods="showSelGoods=false;"
    /> -->
    <!-- <sureSeledGoods 
    :nowSelectGoods="nowSelectGoods"
    :totalAmount="totalAmount"
    :totalCount="totalCount"
    :nowDeskOrderInfo="nowDeskOrderInfo"
    :orderId="orderId"
    :isAddItem="isAddItem"
    :curSelTable="curSelTable"
    @doGetNumDetail="doGetNumDetail"
    v-if="showSureSeledGoods"/> -->
    <!-- <goPay 
    :nowSelectGoods="nowSelectGoods"
    :totalAmount="totalAmount"
    :nowDeskOrderInfo="nowDeskOrderInfo"
    @doAddItem="doAddItem"
    v-if="showGoPay"/> -->
  </div>
</template>

<script>
import {BASE_URL,WS_API_URL} from "./../../urlConfig";
import openTable from "./../openTable/openTable";
import selGoods from "./../selGoods/selGoods";
import sureSeledGoods from "./../sureSeledGoods/sureSeledGoods";
import goPay from "./../goPay/goPay";
import {mapActions} from "vuex";
export default {
  components:{openTable,selGoods,sureSeledGoods,goPay},
  data() {
    return {
      deskHeadCss:{
        "FREE":"table-item-wrap free",
        "BUSY":"table-item-wrap busy",
        "BOOK":"table-item-wrap book",
        "FAULT":"table-item-wrap bad",
      },
      showCartInfoType:"normal",//afterOpen
      isChange:false,
      isAddItem:false,
      nowDeskOrderInfo:{},//当前台桌的订单信息
      empId:"",
      showGoPay:false,
      nowSelectGoods:[],
      totalAmount:0,
      totalCount:0,
      showSureSeledGoods:false,
      showSelGoods:false,
      orderId:"",
      isOpenOrBook:"BUSY",//BUSY是开台，BOOK是预定
      storeId:"",//店铺ID
      statusActive:"ALL",//当前筛选台桌的状态条件
      showOpenTable:false,//是否显示开启台桌弹框
      showOpenOrBook:false,//开台或预定
      showServerList:false,//是否显示服务员列表
      openTableStatus:"BUSY",//开启台桌的默认状态
      showSelStatus:false,//是否显示下拉台桌状态
      curSelEmp:null,//当前选择的服务员
      empList:[],//员工列表
      parList:[],//区域列表
      tableList:[],//桌位列表
      curSelArea:null,//当前选择的分区
      nowAreaIndex:-1,//当前选择的区域索引
      showUseOrCancel:false,
      updatesTime:"",
      token:"",
      phone:"",
      canClick:true,
      curSelTable:{},
      curSelTableOpenInfo:{
        numName:"",
        parName:"",
        people:1,
        beginTime:"",
        rules:[{ruleName:"",ruleId:-1}],
        notice:"",
        names:[],
      },//当前所选台桌的开台信息
    };
  },
  watch: {
      statusActive(val){
          console.log(this.curSelArea)
          if(!this.curSelArea){
              this.getTable(this.statusActive,0);
          }else{
              this.getTable(this.statusActive,this.curSelArea.id);
          }
      }
  },
  methods: {
      closeOp(){
          this.showOpenTable=false;
      },
    // 
    doAddItem(){
        this.showGoPay = false;
        this.showSelGoods = true;
        this.showSureSeledGoods = false;
        this.isAddItem = true;
    },
    doGetNumDetail(data){
        this.getnumDetail(data.deskId);
    },
    // 确认选择已选择商品
    goSureSelGoods(data){
        this.showSelGoods = false;
        this.nowSelectGoods = data.nowSelectGoods;
        this.totalAmount = data.totalAmount;
        this.totalCount = data.totalCount;
        setTimeout(()=>{
            this.showSureSeledGoods = true;
        },100);
    },
    goSelGoods(data){
        console.log(data)
        this.orderId = data.orderId;
        this.setIsAddItem(false);
        this.saveOrderIdFirst(data.orderId);
        this.$router.push("/selGoods");
        // this.showSelGoods = true;
        // this.showOpenTable = false;
    },
    doOpenOrBook(type){
        this.isOpenOrBook = type;
        this.showOpenOrBook = false;
        this.getOpenOrBookInfo();
    },
    getOpenOrBookInfo(){
        if(!this.canClick){
            return;
        }
        this.canClick = false;
        this.$http({
            url:"one-open",
            method:"POST",
            data:{
                storeId:this.storeId,
                parId:this.curSelTable.parId,
                numId:this.curSelTable.deskID,
            }
        }).then(res=>{
            this.canClick = true;
            if(res.data.result.code == 200){
                let data = res.data.data;
                data = Object.assign(data,{
                    notice:""
                });
                this.curSelTableOpenInfo = data;
                this.showOpenTable=true;
            }else if(res.data.result.code == 400){
                this.$message({
                    message: res.data.result.msg,
                    showClose: true,
                    type: 'error'
                });
            }
        }).catch(err=>{
            this.canClick = true;
        })
    },
    hideOpenTable(){
        this.showOpenTable = false;
        this.getTable(this.statusActive,0);
    },
    //   
        // 使用台桌还是取消
    toUseOrCancel(item,type){
        if(type=="USE"&&item.status=="BUSY"){
          this.$router.push({path:"/tabCashier",query:{numId:item.id}});
          return;
        }
        this.$http({
            url:"/update-num",
            method:"POST",
            data:{
              numId:item.id,
              type:type=="USE"?"ON":"OFF",
            }
        }).then(res=>{
            if(res.data.code == 200){
                this.$message({
                    message: res.data.msg,
                    showClose: true,
                    customClass: 'success'
                });
                if(type=="USE"){
                    this.$router.push({path:"/tabCashier",query:{numId:item.id}});
                }else{
                    if(!this.curSelArea){
                        this.getTable(this.statusActive,0);
                    }else{
                        this.getTable(this.statusActive,this.curSelArea.id);
                    }
                }
            }else{
                this.$message({
                    message: res.data.msg,
                    showClose: true,
                    customClass: 'error'
                }); 
            }
            this.showUseOrCancel = false;
        });
    },
    // 直接开台调用的方法
    sure(){
        let url =  "open-num";
        if(this.showCartInfoType == 'afterOpen'){
            url = "busy-open"
        }
      this.$http({
          url,
          method:"POST",
          data:{
              numId:this.curSelTable.id,
              creatorId:this.curSelEmp.mobile,
              source:this.openTableStatus
          }
      }).then(res=>{
          if(res.data.code == 200){
              this.$message({
                  message: res.data.msg,
                  showClose: true,
                  customClass: 'success'
              });
              if(this.openTableStatus=="BUSY"){
                  this.$router.push({path:"/tabCashier",query:{numId:this.curSelTable.id}});
              }else{
                  if(!this.curSelArea){
                      this.getTable(this.statusActive,0);
                  }else{
                      this.getTable(this.statusActive,this.curSelArea.id);
                  }
              }
          }else{
              this.$message({
                  message: res.data.msg,
                  showClose: true,
                  customClass: 'error'
              }); 
          }
          this.showOpenTable = false;
          this.openTableStatus = "BUSY";
      });
  },
    // 查看当前分区的桌位
    getThisAreaTable(item,index){
        if(item==0){
            this.curSelArea = null;
            this.statusActive = "ALL"
            this.getTable(this.statusActive,0);
        }else{
            this.curSelArea = item;
            this.getTable(this.statusActive,item.id);

        }
        this.nowAreaIndex = index;
    },
    getTable(source,parId){
        this.$http({
            url:"/get-allPar",
            method:"GET",
            params:{
              storeId:this.storeId,
              source,
              parId
            }
        }).then(res=>{
            this.tableList = res.data.pars;
        })
    },
    // 获取分区
    getPar(){
        this.$http({
            url:"/get-par",
            method:"GET",
            params:{
              storeId:this.storeId,
            }
        }).then(res=>{
            this.parList = res.data;
        })  
    },
    
    // 获取服务员
    getEmp(){
        this.$http({
            url:"/get-emp",
            method:"GET",
            params:{
              storeId:this.storeId,
            }
        }).then(res=>{
            this.empList = res.data;
            
            if(res.data.length){
                this.curSelEmp = res.data[0];
                for(let i = 0;i<res.data.length;i++){
                    if(res.data[i].mobile == this.phone){
                        this.curSelEmp = res.data[i];
                    }
                }
            }
        }) 
    },
    // 点击台桌,进行预约或开台
    clickTable(item,index){
        if(item.status == 'FAULT'){
            this.$message({
                  message: "台桌故障中！请联系收银台...",
                  showClose: true,
                  customClass: 'error'
              });
              return;
        }
        this.curSelTable=item;
        this.saveNowSelDesk(item);
        this.curSelTableIndex = index;
        if(item.status == "BUSY"){
            this.isChange = false;
            this.showCartInfoType = "normal";
            this.getnumDetail(item.deskID);
            // this.showUseOrCancel = true;
            // this.$router.push({path:"/tabCashier",query:{numId:item.id}});
        }else if(item.status == "BOOK"){
            
            this.isChange = true;
            // 修改当前显示的预定信息页面，和购物车同一组件
            this.isOpenOrBook = "BOOK";
            this.showCartInfoType = "afterOpen";
            this.getnumDetail(this.curSelTable.deskID,"BOOK");
            return;
        }else if(item.status == "FREE"){
            this.isChange = false;
            this.showCartInfoType = "normal";
            this.showOpenOrBook = true;
        }
    },
    toUseOrModify(table,type){
        this.showUseOrCancel = false;
        if(type=="USE"){
            
        }else if(type=="MODIFY"){
            this.isChange = true;
            // 修改当前显示的预定信息页面，和购物车同一组件
            this.isOpenOrBook = "BOOK";
            this.showCartInfoType = "afterOpen";
            this.getnumDetail(this.curSelTable.deskID,"BOOK");
        }
    },
    getnumDetail(numId,type="BUSY"){
        this.$http({
            url:"get-numDetail",
            method:"GET",
            params:{
                numId
            }
        }).then(res=>{
            if(res.status == 200){
                // 成功返回后显示相关界面
                this.nowDeskOrderInfo = res.data;
                this.saveNowDeskOrderInfo(res.data);
                if(type=="BUSY"){
                    this.$router.push({path:'/goPay'});
                }else if(type=="BOOK"){
                    this.curSelTableOpenInfo = {
                        addTime:res.data.numTrans.addTime,
                        bookTime:res.data.numTrans.bookTime,
                        cancelTime:res.data.numTrans.cancelTime,
                        bookMobile:res.data.numTrans.bookMobile,
                        bookName:res.data.numTrans.bookName,
                        rules:[
                            { ruleName: res.data.numTrans.rulesName, ruleId: res.data.numTrans.ruleId }
                        ],
                        people:res.data.numTrans.people,
                        parName:res.data.numTrans.partitionName,
                        parId:res.data.numTrans.parId,
                        numId:res.data.numTrans.numId,
                        numName:res.data.numTrans.numName,
                        names:[{
                            empId: res.data.numTrans.empId,
                            empName: res.data.numTrans.empName,
                            mobile: res.data.numTrans.mobile
                        }],
                        notice:res.data.numTrans.notice
                    }
                    this.showOpenTable = true;
                }
                // this.showGoPay = true;
            }
        });
    },
    
        //连接服务器的函数
        connect: function () {
            var socket = new SockJS(WS_API_URL+'gs-guide-websocket');
            this.stompClient = Stomp.over(socket);
            let that = this;
            this.stompClient.connect({'Auth-Token': this.token}, function (frame) {
                that.stompClient.ws.onerror = function ( evnt ) {
                    that.connect();
                }
                that.stompClient.ws.onclose = function ( evnt ) {
                    that.connect();
                }
                // that.sendMessage();
                //订阅服务器发送来的消息
                // that.stompClient.subscribe('/message/'+that.token+"/"+that.storeInfo.storeId, function (event) {
                //     let res = JSON.parse(event.body);
                //     that.updatesTime = res.lastTimestamp;
                //     that.orderNum += res.count;
                //     if ( res.count > 0 ) {
                //         if ( that.curVoiceName ) {
                //             $('.audio').remove();
                //             $('.index').append($('<audio style="display:none" controls="" class="audio" src="../../../static/voice/'+that.curVoiceName+'" autoplay="autoplay" id="audios"></audio>'));
                //         }
                //     }
                // });
                that.stompClient.subscribe('/message/'+that.storeId, function (event) {
                    console.log("我收到了服务器消息");
                    let res = JSON.parse(event.body);
                    if(res.source == "CALL" || res.source == "REWARD"){
                        console.log("call");
                        return;
                    }
                    
                        if(res.source == "BAR" || res.source == "FINBAR" || res.source == "NUM" || res.source == "PAY"){
                            that.updatesTime = res.lastTimestamp;
                            if(res.count > 0){
                                if(!that.curSelArea){
                                    that.getTable(that.statusActive,0);
                                }else{
                                    that.getTable(that.statusActive,that.curSelArea.id);
                                }
                            }
                        }
                        if(res.source == "DETAIL"){
                            that.updatesTime = res.lastTimestamp;
                            if(res.count > 0){
                                console.log("doRefreshNum")
                                that.refreshNum();
                                // that.$emit("doRefreshNum",{});
                            }
                        }
                        if(res.source == "ALLOW"){
                            that.updatesTime = res.lastTimestamp;
                            if(res.count > 0){
                                console.log("doRefreshNum")
                                that.refreshNum();
                                // that.$emit("doRefreshNum",{});
                            }
                        }
                   
                });



            });
            this.stompClient.ws.onclose = function ( evnt ) {
                setTimeout(()=>{
                    that.connect(); 
                }, 1000);
            }
            this.stompClient.debug = function(str) {
            };
        },
       
        //发送聊天信息
        sendMessage: function () {
            
            this.stompClient.send('/app/todo-orders/updates-count/'+this.token, {}, JSON.stringify({'lastTimestamp': this.updatesTime,'storeId':this.storeId}));
        },
        
        // 断开ws连接
        disconnect: function () {
            if (this.stompClient !== null) {
                this.stompClient.disconnect();
            }
        },// 断开ws连接(语音服务)
        ...mapActions(["saveNowDeskOrderInfo","saveNowSelDesk","setIsAddItem","saveOrderIdFirst","refreshNum"]),
  },
  created () {
    if(localStorage.getItem("phone")){
        this.phone = localStorage.getItem("phone");
        this.empId = localStorage.getItem("empId");
    }  
  },
  mounted() {
      if (!localStorage.getItem('token')) {
        this.$router.push({path: '/login'});
        return;
    } else {
        this.token = localStorage.getItem('token');
    }
    let storeId = localStorage.getItem('storeId');
    this.storeId = storeId;

    this.getTable(this.statusActive,0);
    this.getPar();
    this.getEmp();
    this.connect();
    this.$nextTick(()=>{
    //   this.$createScroll("left-top-area");
      this.$createScroll("table-list-wrap");
    //   this.$createScroll("list-inner-emp");
    });
  }
};
</script>

<style scoped lang="scss">
@import "./table.scss";
</style>
