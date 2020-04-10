<template>
    <div id="pay">
        <div class="pay-wrap">
            <div class="span-panle"></div>
            <div class="set-item">
                <span class="left-tit">{{`${nowPayInfo.parName}-${nowPayInfo.numName}`}}</span>
                <div class="right-cont">
                    <span class="cont" style="color:#e66a6a;font-size:.34rem;">{{Number(nowPayInfo.originalPrice).toFixed(2)}}元</span>
                    <!-- <i class="iconfont icon-arrow-right-copy"></i> -->
                </div>
            </div>
            <div class="span-panle"></div>
            <div class="set-item" @click.stop="showManualDis">
                <span class="left-tit">手动优惠</span>
                <div class="right-cont">
                    <span class="cont">{{nowPayInfo.allHandDiscount.toFixed(2)}}元</span>
                    <i class="iconfont icon-arrow-right-copy"></i>
                </div>
            </div>
            <div class="span-panle"></div>
            <div class="set-item" @click.stop="showBindVip=true;">
                <span class="left-tit">会员优惠</span>
                <div class="right-cont">
                    <span class="cont">{{nowPayInfo.allMemberDiscount.toFixed(2)}}元</span>
                    <i class="iconfont icon-arrow-right-copy"></i>
                </div>
            </div>
            <div class="span-panle"></div>
            <div class="set-item other-sty">
                <span class="left-tit">备注信息</span>
                <div class="right-cont">
                    <textarea placeholder="请输入备注信息..." v-model="notice"></textarea>
                </div>
            </div>
        </div>
        <div class="cart">
            <div class="cart-and-money">
                <span class="total-money"><b class="hui" style="font-size:.3rem;">优惠: {{nowPayInfo.discountAmount.toFixed(2)}} 元</b></br><b style="font-size:.3rem;">应付: <i style="font-size:.4rem;">{{nowPayInfo.totalAmount.toFixed(2)}}</i> 元</b></span>
                <span class="go-pay" v-if="clerkPayEnabled" @click.stop="showMask=true;showPayType=true;">结账</span>
            </div>
        </div>
        <!-- <bindVip 
        @reGetPayInfo="reGetPayInfo"
        @closeBind="showBindVip=false"
        v-if="showBindVip"
        /> -->
        <div class="mask" v-if="showMask" @click.stop="showMask=false;showPayType=false;showSetWrap=false;">
            <div class="mask-cont" @click.stop="showMask=false;showPayType=false;showSetWrap=false;">
                <div class="pay-type" v-if="showPayType"  @click.stop="">
                    <div class="tit">选择付款方式</div>
                    <div class="pay-list">
                        <!-- <div class="set-item" @click.stop="channel='CASH';selOk('CASH');"> -->
                        <i v-if="!isOnlyMemberPay||!nowPayInfo.memberMessage.memberAccountId">
                            <div class="set-item" @click.stop="isCloseDesk('CASH');">
                                <span class="left-tit"><i class="iconfont icon-0" style="color:#ec5b4c;font-size:.375rem;vertical-align:middle;margin-right:.25rem;"></i><b style="vertical-align:middle;">现金支付</b></span>
                                <div class="right-cont">
                                    <i class="iconfont icon-arrow-right-copy"></i>
                                </div>
                            </div>
                            <div class="line"></div>
                            <div class="set-item" @click.stop="isCloseDesk('PAYCARD')">
                                <span class="left-tit"><i style="font-size:.34rem;color:#053d8e;vertical-align:middle;margin-right:.25rem;" class="iconfont icon-zaixianzhifu"></i><b style="vertical-align:middle;">在线支付</b></span>
                                <div class="right-cont">
                                    <i class="iconfont icon-arrow-right-copy"></i>
                                </div>
                            </div>
                            <div class="line"></div>
                            <!-- <div class="set-item" @click.stop="channel='MEMBER';selOk('MEMBER');"> -->
                            <div class="set-item" @click.stop="isCloseDesk('MEMBER');">
                                <span class="left-tit"><i style="font-size:.25rem;color:#148de5;vertical-align:middle;margin-right:.25rem;" class="iconfont icon-huiyuan"></i><b style="vertical-align:middle;">会员支付</b></span>
                                <div class="right-cont">
                                    <i class="iconfont icon-arrow-right-copy"></i>
                                </div>
                            </div>
                            <div class="line"></div>
                        </i>
                        <i v-if="nowPayInfo.memberMessage.memberAccountId&&isOnlyMemberPay">
                            <div class="set-item" @click.stop="isCloseDesk('MEMBER');">
                                <span class="left-tit"><i style="font-size:.25rem;color:#148de5;vertical-align:middle;margin-right:.25rem;" class="iconfont icon-huiyuan"></i><b style="vertical-align:middle;">会员支付</b></span>
                                <div class="right-cont">
                                    <i class="iconfont icon-arrow-right-copy"></i>
                                </div>
                            </div>
                            <div class="line"></div>
                        </i>
                        <!-- <ul>
                            <li @click.stop="selOk('CASH');"><i class="iconfont icon-0" style="color:#ec5b4c;"></i><b>现金支付</b></li>
                            <li @click.stop="scanCode"><i style="font-size:.34rem;color:#053d8e;" class="iconfont icon-zaixianzhifu"></i><b>在线支付</b></li>
                            <li @click.stop="selOk('MEMBER');"><i style="font-size:.275rem;color:#148de5;" class="iconfont icon-huiyuan"></i><b>会员支付</b></li>
                        </ul> -->
                    </div>
                    <!-- <div class="set-item" @click.stop="isPayCloseDesk=!isPayCloseDesk">
                        <span class="left-tit" style="font-size:.28rem;">
                            <i :class="isPayCloseDesk?'iconfont icon-Raidobox-xuanzhong':'iconfont icon-Raidobox-weixuan'"></i>
                            结账是否关闭台桌</span>
                        <div class="right-cont">
                        </div>
                    </div> -->
                </div>
                <div class="discount-wipe-zero" v-if="showSetWrap" @click.stop="">
                    <div class="wrap">
                        <div class="discount-set">
                            <span>折扣:</span>
                            <select class="dis-sel" name="" id="" v-model="firstDiscount" >
                                <option :value="item" v-for="(item,index) in discountVals" :key="index">{{item}}</option>
                            </select>
                            <select class="dis-sel" name="" id="" v-model="lastDiscount">
                                <option :value="item" v-for="(item,index) in discountVals" :key="index">{{item}}</option>
                            </select>
                            <div class="now-discount">
                                <span>当前所选折扣：<b>{{firstDiscount+'.'+lastDiscount}}</b> 折</span>
                            </div>
                            <!-- <div>
                                <span>折后价：<b>{{(Number(nowPayInfo.totalAmount.toFixed(2))*Number(`0.${firstDiscount}${lastDiscount}`)).toFixed(2)}}</b> 元</span>
                            </div> -->
                        </div>
                        <div style="padding-bottom:10px;" class="auto-money">
                            <span class="money" style="font-size:14px;color:red;">自定义金额:</span>
                            <input type="text" v-model="autoMoney" placeholder="请输入金额" />
                        </div>
                        <div class="sure-discount">
                            <button @click="discountThisOrder">确定</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="showIsCloseDesk" class="close-desk" @click.stop="showIsCloseDesk=false">
            <div class="close-desk-wrap">
                <div class="one" v-if="showOne">
                    <div class="tit">结账是否关闭台桌?</div>
                    <div class="btn">
                        <button class="no" @click.stop="beforeSelOk(false)">不关闭</button>
                        <!-- <button class="yes" @click.stop="showOne=false;showTwo=true;">关闭</button> -->
                        <button class="yes" @click.stop="beforeSelOk(true)">关闭</button>
                    </div>
                </div>
                <!-- <div class="two" v-if="showTwo">
                    <div class="tit">确认是否关闭台桌?</div>
                    <div class="btn">
                        <button class="no"  @click.stop="showTwo=false;showOne=true;">不关闭</button>
                        <button class="yes" @click.stop="beforeSelOk(true)">关闭</button>
                    </div>
                </div> -->
            </div>
        </div>
        <div id="show-loading-pay" v-if="showPayLoding">
            <div class="loading-box">
                <p class="loading-info">支付中请等待...</p>
                <!-- <div class="cancel-pay" @click="deletePayment">{{canDeletepayment?'取消支付':('取消支付('+delPaymentLodingTime+'s)')}}</div> -->
            </div>
        </div>
        <checkAuth 
        v-if="isShowCheckAuth" 
        :checkType="'onlyCheckPwd'"
        @closeCheckAuth="closeCheckAuth"
        />
        <bindVip 
        v-if="showBindVip"
        @closeBind="showBindVip=false"
        @reGetPayInfo="reGetPayInfo"
        :memberInfo="memberInfo"
        />
    </div>
</template>

<script>
import {mapGetters,mapActions} from "vuex";
import bindVip from "./../bindVip/bindVip";
import checkAuth from "./../checkAuth/checkAuth";
import {BASE_URL} from "./../../urlConfig/index";
export default {
    // props:['nowSelectGoods','totalAmount','totalCount','nowDeskOrderInfo'],
    components:{bindVip,checkAuth},
    data() {
        return {
            isOnlyMemberPay:null,
            clerkPayEnabled:true,
            showOne:true,
            showTwo:false,
            showIsCloseDesk:false,//结账前是否关闭台桌提示框
            isPayCloseDesk:false,
            delPaymentLodingTime:15,//支付数秒时间
            canDeletepayment:false,
            showPayLoding:false,
            memberInfo:{
                memberAccountId: "",
                memberAmount: 0,
                memberCode: "",
                memberDiscountMessage: "",
                memberId: "",
                memberLevel: "",
                memberMobile: "",
                memberName: "",
            },
            showBindVip:false,
            isCheckEd:false,
            discountVals:[0,1,2,3,4,5,6,7,8,9],
            autoMoney:"",
            firstDiscount:0,
            lastDiscount:0,
            showSetWrap:false,//是否显示抹零设置窗口
            channel:"PAYCARD",
            showPayType:false,
            notice:"",
            isShowCheckAuth:false,
            numInfo:[],
            parId:"",
            numId:0,
            showMask:false,
            curSelTableOpenInfo:{},
            storeId:"",
            isOpenOrBook:"BUSY",//BUSY是开台，BOOK是预定
            showOpenTable:false,
            showRoomAmountInfo:false,
            showBindVip:false,
            employeeName:"",
            showGoods:false,
            nowDeskOrderInfo:{},
            curSelTable:{},
            tableInfo:[],
            nowPayInfo:{
                allHandDiscount:0,
                discountAmount: 0,
                getIntegral: 0,
                list: [],
                memberMessage: {},
                numId: 0,
                numName: "",
                parId: 0,
                parName: "",
                totalAmount: 0
            },//当前台桌的结账界面信息
            payCode:"",
            paymentBtn:true,
            delPaymentApiBtn:true,
        }
    },
    watch: {
        showIsCloseDesk(val){
            if(!val){
                this.showOne=true;
                this.showTwo=false;
            }
        }
    },
    methods: {
        delPaymentLodingTimer: function () {
            setTimeout(()=>{
                this.delPaymentLodingTime--;
                if ( this.delPaymentLodingTime <= 0 ) {
                    this.canDeletepayment = true;
                    this.delPaymentLodingTime = 15;
                } else {
                    this.delPaymentLodingTimer();
                }
            },1000)
        },
         //取消支付
        deletePayment(){
            if ( !this.canDeletepayment ) {
                return;
            } else {
                this.paymentBtn=true;
                clearInterval(this.payLoadTimer);

                if ( !this.delPaymentApiBtn ) {
                    return;
                }
                this.delPaymentApiBtn = false;
                let orderId = this.nowDeskOrderInfo.res.orderId;
                this.$http.delete(BASE_URL+'/v1/pos/payments/'+orderId).then((res)=>{
                    this.showPayLoding = false;
                    this.delPaymentApiBtn = true;
                    this.$router.replace({path:'/table'});
                }).catch(()=>{
                    this.showPayLoding = false;
                    this.delPaymentApiBtn = true;
                    this.$router.replace({path:'/table'});
                })
            }
        },

        //扫一扫
        scanCode(closeEnabled){
            let _this = this;
            this.canDeletepayment = false;
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    var resultArr = result.split(",");
                    // 支付
                    _this.payCode = resultArr[resultArr.length-1];
                    _this.showPayLoding = true;
                    if(result === 'scan resultStr is here'||_this.payCode === ''||result===''){
                        _this.$message({
                            message: '支付失败，请重新扫描。',
                            customClass: 'error'
                        })
                        _this.showPayLoding = false;
                        return;
                    }
                    let sendOrderId = _this.orderId;
                    _this.showIsCloseDesk = false;
                    _this.selOk(closeEnabled)
                }
            });
        },
        discountThisOrder(){
            if(this.autoMoney!=""){
                if(!/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(this.autoMoney)){
                    this.$message({
                        message: '价格格式有误',
                        customClass: 'error'
                    })
                    return true;
                }
                if(this.autoMoney>Number(this.nowPayInfo.originalPrice.toFixed(2))){
                    this.autoMoney = this.nowPayInfo.totalAmount.toFixed(2);
                    this.$message({
                        message: '价格不可高于原价',
                        customClass: 'error'
                    })
                    return true;
                }
                if(this.autoMoney!=0){
                    this.getPayOrderInfo({percent:1,price:this.autoMoney});
                    // this.sureHandleCount++;
                    return;
                }
            }
            
            let percent = `0.${this.firstDiscount}${this.lastDiscount}`;
            if(percent=="0.00"){
                this.$message({
                    message: '请选择折扣',
                    customClass: 'error'
                })
                return true;
            }
            console.log(percent);
            this.getPayOrderInfo({percent,price:0});
            // this.sureHandleCount++;
        },
        showManualDis(){
            if(!this.isCheckEd){
                this.isShowCheckAuth=true;
            }else{
                this.showSetWrap = true;
                this.showMask = true;
            }
        },
        closeCheckAuth(data){
            this.isShowCheckAuth=false;
            this.showMask=false;
            if(data&&data.flag){
                this.isCheckEd = data.flag;
                this.showMask = true;
                this.showSetWrap = true;
                // this.getPayOrderInfo(this.curSelTable.deskID);
            }
        },
        setPar(){
            if(this.tableInfo.length){
                for(let i=0;i<this.tableInfo.length;i++){
                    if(this.parId == this.tableInfo[i].parId){
                        this.numInfo = this.tableInfo[i].list;
                    }
                }
            }
        },
        sure(){
            let flag = this.checkInfo();
            if(!flag){
                return;
            }
            this.$http({
                    url:"change-order-num",
                    method:"GET",
                    params:{
                        numId:this.numId,
                        itemId:this.nowModifyGoods.orderItemId,
                        qty:this.changeCount
                    }
                }).then(res=>{
                    if(res.data.code == 200){
                        this.$message({
                            message: res.data.msg,
                            showClose: true,
                            customClass: 'success'
                        });
                        this.showMask=false;
                        this.showModifyGoods=false;
                        this.changeTable=false;
                        // this.$emit("closeModGoodsForCart","");
                        this.getnumDetail(this.curSelTable.deskID);
                    }else if(res.data.code == 400){
                        this.$message({
                            message: res.data.msg,
                            showClose: true,
                            customClass: 'error'
                        });
                    }
                    return;
                });
        },
        checkInfo(){
            if(this.numId == this.nowDeskOrderInfo.numTrans.numId){
                this.$message({
                    message: "不可转入到当前台桌",
                    showClose: true,
                    customClass: 'error'
                });
                return false;
            }
            if(!/^\d+$/.test(this.changeCount)){
                this.$message({
                    message: "数量输入错误",
                    showClose: true,
                    customClass: 'error'
                });
                return false;
            }
            if(this.changeCount > this.nowModifyGoods.count){
                this.$message({
                    message: "数量不能大于该商品原定数量",
                    showClose: true,
                    customClass: 'error'
                });
                return false;
            }
            if(!this.changeCount){
                this.$message({
                    message: "请填写数量",
                    showClose: true,
                    customClass: 'error'
                });
                return false;
            }
            if(!this.numId){
                this.$message({
                    message: "请确认是否有空闲桌台/包间",
                    showClose: true,
                    customClass: 'error'
                });
                return false;
            }
            return true;
        },
        getInfo(){
            this.$http({
                url:"get-change-num",
                method:"GET",
                params:{
                    storeId:localStorage.getItem("storeId")
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.showModifyGoods = false;
                    this.changeTable = true;
                    this.tableInfo = res.data.data;
                }
            });
        },
        goCancelGoods(){
            this.checkAuth = true;
        },
        goChangeTable(){
            this.getInfo();
        },
        modifyGoodsItem(item){
            this.nowModifyGoods = item;
            this.showMask = true;
            this.showModifyGoods = true;
        },
        showModifyDeskInfo(){
            this.curSelTableOpenInfo = {
                beginTime:this.nowDeskOrderInfo.numTrans.beginTime,
                rules:[
                    { ruleName: this.nowDeskOrderInfo.numTrans.rulesName, ruleId: this.nowDeskOrderInfo.numTrans.ruleId }
                ],
                people:this.nowDeskOrderInfo.numTrans.people,
                names:[{
                    empId: this.nowDeskOrderInfo.numTrans.empId,
                    empName: this.nowDeskOrderInfo.numTrans.empName,
                    mobile: this.nowDeskOrderInfo.numTrans.mobile
                }],
                notice:this.nowDeskOrderInfo.numTrans.notice
            }
        },
        hideOpenTable(){
            this.showOpenTable = false;
        },
        reGetPayInfo(){
            this.showBindVip = false;
            this.getPayOrderInfo();
        },
        doGetNumDetail(data){
            this.getnumDetail(data.deskId);
            this.showOpenTable = false;
        },
        getnumDetail(numId){
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
                    this.$router.replace({path:'/goPay'});
                    // this.showGoPay = true;
                }
            });
        },
        addItem(){
            this.setIsAddItem(true);
            this.$router.replace('/selGoods');
        },
        getPayOrderInfo(data){
            this.$http({
                url:"pre-order",
                method:"GET",
                params:{
                    numId:this.nowDeskOrderInfo.numTrans.numId,
                    orderId:this.nowDeskOrderInfo.res.orderId,
                    percent:data?data.percent:null,
                    price:data?data.price:null
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.nowPayInfo = res.data.data;
                    this.memberInfo = res.data.data.memberMessage;
                    this.showMask=false;
                    this.isShowCheckAuth=false;
                    this.showSetWrap = false;
                }else if(res.data.code == 400){
					this.$message({
						message:res.data.msg,
						customClass:"error",
                        showClose:true,
                        duration:9000,
                    });
                    setTimeout(() => {
                        this.$router.replace('/table');
                    }, 1000);
				}
            });
        },
        isCloseDesk(type){
            this.channel = type;
            // this.showIsCloseDesk = true;
            this.beforeSelOk(false);
        },
        beforeSelOk(closeEnabled){
            if(this.channel!='PAYCARD'){
                this.selOk(closeEnabled);
            }else{
                if(this.nowPayInfo.totalAmount.toFixed(2)==0){
                    this.$message({
                        message:"不允许在线支付，请选择其他支付方式。",
                        showClose:true,
                        customClass:'error'
                    });
                    return;
                }
                this.scanCode(closeEnabled);
            }
        },
        selOk(closeEnabled) {
            if(this.channel=="MEMBER"){
                if(!this.nowPayInfo.memberMessage.memberId){
                    this.$message({
                        message:"暂无绑定会员",
                        showClose:true,
                        customClass:'error'
                    });
                    return;
                }
            }
            // this.channel = type;
            let listRes = [];
            for(let i=0;i<this.nowPayInfo.list.length;i++){
                let obj = {
                    id:this.nowPayInfo.list[i].id,
                    numEnabled:this.nowPayInfo.list[i].numEnabled,
                    discount:this.nowPayInfo.list[i].discount,
                    amount:this.nowPayInfo.list[i].amount,
                }
                listRes.push(obj);
            }
            console.log(this.nowDeskOrderInfo.res.orderId);
            if(!this.nowDeskOrderInfo.res.orderId){
                this.$message({
                    message:"暂无订单",
                    showClose:true,
                    customClass:'error'
                });
                return;
            }
            let payName = localStorage.getItem('employeeName');
            let payMobile = localStorage.getItem('phone');
            let data = {
                closeEnabled,
                count:this.nowDeskOrderInfo.res.totalCount,
                orderId:this.nowDeskOrderInfo.res.orderId,
                numId:this.nowPayInfo.numId,
                allCouponDiscount:this.nowPayInfo.allCouponDiscount.toFixed(2),
                allHandDiscount:this.nowPayInfo.allHandDiscount.toFixed(2),
                allMemberDiscount:this.nowPayInfo.allMemberDiscount.toFixed(2),
                allTimeDiscount:this.nowPayInfo.allTimeDiscount.toFixed(2),
                discountAmount:this.nowPayInfo.discountAmount.toFixed(2),
                originalPrice:this.nowPayInfo.originalPrice.toFixed(2),
                totalAmount:this.nowPayInfo.totalAmount.toFixed(2),
                amount:this.nowPayInfo.amount.toFixed(2),
                notes:this.notice,
                listRes,
                channel:this.channel,
                authCode:this.channel=='PAYCARD'?this.payCode:"",
                payName,
                payMobile
            };
                this.showIsCloseDesk = false;
                this.pay(data);
            },
        // 支付
            pay(data){
                let b = new Base64();
                let m = b.encode(data.totalAmount);
                this.showPayLoding = true;
                setTimeout(()=>{
                    this.$http({
                        url:"payments",
                        method:"PUT",
                        data:data
                    }).then(res=>{
                        if(res.data.code == 200){
                            this.$message({
                                message:res.data.msg,
                                customClass:"success",
                                showClose:true
                            });
                            this.showPayLoding = false;
                            this.payInfo = {};
                            this.$router.replace({path:'/payRes',query:{m}});
                        }else if(res.data.code == 400){
                            this.$message({
                                message:res.data.msg,
                                customClass:"error",
                                showClose:true
                            });
                            this.payInfo = {};
                            this.$router.replace({path:'/table'});
                        }else if( res.status === 202 ){
                            // 支付轮训
                            let overTimeNum = 0;
                            let curOrderId = data.payInfo.orderId;

                            this.delPaymentLodingTimer();
                            this.payLoadTimer = setInterval(()=>{
                                overTimeNum += 2;
                                if ( overTimeNum >= 180 ) { // 超过180秒，取消订单
                                    clearInterval(this.payLoadTimer);
                                    return;
                                }
                                let that = this;
                                this.payLoad(curOrderId, function () {
                                    clearInterval(that.payLoadTimer);
                                    that.$message({
                                        message: '支付成功！',
                                        showClose: true,
                                        customClass: 'success'
                                    });

                                    that.showPayLoding = false;
                                    // 支付成功后，获取商品列表
                                    that.payInfo = {};
                                    that.$router.replace({path:'/payRes',query:{m}});
                                });
                            }, 2000)
                        }else{
                            if(res.data.id){
                                this.$message({
                                    message:"支付成功",
                                    customClass:"success",
                                    showClose:true
                                });
                                this.payInfo = {};
                                this.showPayLoding = false;
                                this.$router.replace({path:'/payRes',query:{m}});
                            }
                        }
                    }).catch(err=>{
                        this.showPayLoding = false;
                        this.payInfo = {};
                        this.showGoPay = false;
                        this.$router.replace({path:'/table'});
                    });
                },500);
            },
            // 等待支付轮训接口
            payLoad: function ( orderId, fn ) {
                this.$http.get(BASE_URL+'/v1/pay/micropay/query?orderId='+orderId).then((res)=>{
                    if ( res.status === 200 ) {
                        fn();
                    }
                }).catch(( err )=>{
                    this.payApiBtn = true;
                    this.paymentBtn = true;
                    this.showPayLoding = false;
                    this.payInfo = {};
                    this.showGoPay = false;
                    this.$router.replace({path:'/table'});
                    clearInterval(this.payLoadTimer);
                })
            },
            // 
        ...mapGetters(['getNowDeskOrderInfo',"getNowSelDesk"]),
        ...mapActions(['setIsAddItem',"saveNowDeskOrderInfo"]),

    },
    created() {
        this.nowDeskOrderInfo = this.getNowDeskOrderInfo();
        this.curSelTable = this.getNowSelDesk();
        console.log($("input"))
        $("input").blur(function(){
            console.log('失去焦点')
            window.scrollTo(0,0);
        });
        $("textarea").blur(function(){
            console.log('失去焦点')
            window.scrollTo(0,0);
        });
    },
    updated() {
        $("input").blur(function(){
            console.log('失去焦点')
            window.scrollTo(0,0);
        });
        $("textarea").blur(function(){
            console.log('失去焦点')
            window.scrollTo(0,0);
        });
    },
    mounted() {
        this.isOnlyMemberPay = JSON.parse(localStorage.getItem("isOnlyMemberPay"));
        this.storeId = localStorage.getItem("storeId");
        this.employeeName = localStorage.getItem("employeeName");
        console.log(this.nowDeskOrderInfo)
        if(!this.nowDeskOrderInfo || !this.nowDeskOrderInfo.res){
            this.$router.replace("/table");
        }
        this.getPayOrderInfo();
        let url = window.location.href.split("#")[0];
        console.log(url);
        this.$http
        .get(BASE_URL+"/wechat/scan?url="+url)
        .then(res => {
            console.log(res);
            // this.returnUrl = res.data.url;
            wx.config({
            debug: false,
            appId: res.data.appId,
            timestamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            signature: res.data.signaTrue,
            jsApiList: ["checkJsApi","scanQRCode"]
            });
        });
        let clerkPayEnabled = JSON.parse(localStorage.getItem("clerkPayEnabled"));
        console.log(clerkPayEnabled);
        if(clerkPayEnabled == false){
            this.clerkPayEnabled = false;
        }else{
            this.clerkPayEnabled = true;
        }
    }
}
</script>


<style scoped lang="scss">
@import "./pay.scss"
</style>
