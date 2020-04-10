<template>
	<div class="index">
        <div :class="{blur:blurBtn}" style="height:100%;">
            <div class="title">今日点单数</div>
            <div class="orderNumber" v-text="orderCount"></div>
    		<div class="menuBox clearfix">
                <router-link to="/table" tag="div" class="item color1">
                    <i class="iconfont icon-jiaju-fanzhuo"></i>
                    <div class="name">台桌</div>
                </router-link>
                <!-- <router-link to="/takeOrder" tag="div" class="item color1">
                    <i class="iconfont icon-diancantianchong"></i>
                    <div class="name">点单</div>
                </router-link> -->
                <!-- <router-link to="/order" tag="div" class="item color2">
                    <i class="iconfont icon-dingdan"></i>
                    <div class="name">订单</div>
                </router-link> -->
                <router-link class="item color3" to="/achievement" tag="div">
                    <i class="iconfont icon-yejiguanli"></i>
                    <div class="name">业绩</div>
                </router-link>
                <div class="item color4" @click="getQrcode">
                    <i class="iconfont icon-huiyuan"></i>
                    <div class="name">会员</div>
                </div>
                <!-- <router-link class="item color5" to="/earnings" tag="div">
                    <i class="iconfont icon-money"></i>
                    <div class="name">收益</div>
                </router-link> -->
                <router-link class="item color6" to="/coupon" tag="div">
                    <i class="iconfont icon-youhuiquan"></i>
                    <div class="name">优惠券</div>
                </router-link>
                <!-- <router-link class="item color7" to="/check" tag="div">
                    <i class="iconfont icon-pandian"></i>
                    <div class="name">盘点</div>
                </router-link> -->
                <!-- <router-link class="item color8" to="/workshift" tag="div">
                    <i class="iconfont icon-workclock"></i>
                    <div class="name">交班记录</div>
                </router-link> -->
                <!-- <router-link class="item color8" to="/reward" tag="div">
                    <i class="iconfont icon-workclock"></i>
                    <div class="name">打赏记录</div>
                </router-link> -->
                <div class="item color9" @click="logout">
                    <i class="iconfont icon-tuichudenglu"></i>
                    <div class="name">退出</div>
                </div>
                
            </div>
        </div>
        <div class="code" v-if="isqrcode" @click="isqrcode=false;blurBtn=false;">
            <div class="code-wrap">
                <div id="qrcode" @click.stop=""></div>
                <div class="info">
                    <div class="vip-charge-tit-info">扫码加会员</div>
                    <div class="vip-charge" @click.stop="showVipInpFun">会员充值</div>
                </div>
            </div>
            <!-- <div class=" position-middle-center" id="qrcode" @click.stop=""></div> -->
        </div>

        <!--  -->
        <div class="vip-inp" v-if="showVipInp" @click="showVipInp=false;">
            <div class="inp-box">
                <div class="inp-wrap">
                    <input type="text" @click.stop="" v-model="EnterPhone" placeholder="请输入11位手机号..."/>
                    <div class="vip-list" @click.stop="" v-if="vipPhoneList&&vipPhoneList.length">
                        <ul>
                            <li v-for="(item,index) in vipPhoneList" :key="index" @click="selPhoneVip(item)">
                                <span class="vip-name left">{{item.memberName}}</span>
                                <span class="vip-num right">{{item.memberMobile}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="recharge" v-if="showRecharge">
            <div class="recharge-box" :style="showChargeType?'height:auto;padding:.2rem 0;':''">
                <div class="recharge-tit">会员充值</div>
                <div class="vip-info">
                    <span class="name">会员名称:{{vipData.memberName}}</span>
                    <span class="count-info right">会员账号:{{vipData.memberMobile}}</span>
                </div>
                <div class="customize-money" v-if="!showChargeType">
                    <span>自定义金额：</span>
                    <input type="text" v-model="inputVipMoney" name="" id="" placeholder="充值金额" />
                </div>
                <span v-if="!showChargeType">
                    <!-- this.$createScroll('scroll_store'); -->
                    <div class="recharge-rules" id="recharge">
                        <ul>
                            <li v-for="(item,index) in chargeRules" :key="index" @click="chargeVip(item)">{{item.name}}</li>
                        </ul>
                    </div>
                    <div class="confirm-box">
                        <button @click="showRecharge=false">取消</button>
                        <button class="yes" @click="chargeVip(null)">确定</button>
                    </div>
                </span>
                <div class="money-info" v-if="showChargeType">
                    <div class="money-info-box">
                        <div class="back">
                            <span @click="showChargeType=false">返回</span>
                        </div>
                        <span class="amount">￥{{curVipChargeInfo.amount}}</span>
                        <div class="charge-code">流水号：{{curVipChargeInfo.code}}</div>
                    </div>
                    <div class="pay">
                        <button @click="chargePay">在线支付</button>
                    </div>
                </div>
            </div>
        </div>
        <!--  -->
	</div>
</template>

<script>
import {BASE_URL} from "./../../urlConfig";
export default {
  	data(){
  		return{
            showChargeType:false,
            curVipChargeInfo:{},
            inputVipMoney:"",
            isqrcode:false,
            htmlCodeBtn:false,
            orderCount: 0, // 今日订单数量
            blurBtn:false,
            storeId: '',
            showRecharge:false,
            showVipInp:false,
            vipPhoneList:[],
            EnterPhone:"",
            vipData:{},
            chargeRules:[],//充值规则
            payCode:'',
  		}
      },
      watch: {
          EnterPhone ( val ) {
            if ( !(val.replace(/\s/g,'')) ) {
                this.vipPhoneList = [];
                return;
            }
            if(val.length<4){
                return;
            }
            this.$http.get(BASE_URL+'/v1/clerk/search-member?storeId='+this.storeId+'&mobile='+val).then((res)=>{
                for (var i = 0; i < res.data.data.length; i++) {
                    res.data.data[i].amount = res.data.data[i].amount.toFixed(2);
                }
                this.vipPhoneList = res.data.data;
            })
        },
      },
    methods:{
        chargePay(){
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
                    if(result === 'scan resultStr is here'||_this.payCode === ''||result===''){
                        _this.$message({
                            message: '支付失败，请重新扫描。',
                            customClass: 'error'
                        })
                        return;
                    }
                    let data = {
                        "orderId": _this.curVipChargeInfo.id,
                        "channel": "PAYCARD",
                        "amount": _this.curVipChargeInfo.amount,
                        "authCode": _this.payCode,
                        "notes": "会员充值"
                    }
                    
                    _this.$http.put(BASE_URL+'/v1/clerk/scanPayments', data).then((res)=>{
                        _this.payCode = '';
                        if ( res.status === 202 ) {
                            let overTimeNum = 0;
                            let curOrderId = _this.curVipChargeInfo.id;

                            // _this.delPaymentLodingTimer();
                            _this.payLoadTimer = setInterval(()=>{
                                overTimeNum += 2;
                                if ( overTimeNum >= 180 ) { // 超过180秒，取消订单
                                    clearInterval(_this.payLoadTimer);
                                    // _this.createOrder();
                                    return;
                                }
                                // let that = _this;
                                _this.payLoad(curOrderId, function () {
                                    clearInterval(_this.payLoadTimer);

                                    // _this.createOrder();
                                    _this.showPayLoding = false;
                                    // _this.$router.push({path:'/buySuccess/'+sendOrderId});//跳转购买成功页面
                                    _this.$message({
                                        message: '充值成功',
                                        customClass: 'success'
                                    });
                                    // _this.getMemberData(_this.vipData.memberId);
                                    _this.showChargeType = false;
                                    _this.showRecharge = false;
                                    _this.inputVipMoney = "";
                                });
                            }, 2000)
                        } else {
                            
                            // _this.$router.push({path:'/buySuccess/'+sendOrderId});//跳转购买成功页面
                            _this.$message({
                                message: '充值成功',
                                customClass: 'success'
                            });
                            // _this.getMemberData(_this.vipData.memberId);
                            _this.showChargeType = false;
                            _this.showRecharge = false;
                            _this.inputVipMoney = "";
                            // _this.createOrder();
                        
                        }
                    }).catch((err)=>{
                        _this.payCode = '';
                        // _this.showPayLoding = false;
                        if ( err.response.status === 400 ) {
                            // _this.showPayBox = true;
                        }
                    })
                    // 支付结束
                }
            });
        },
        // 等待支付轮训接口
        payLoad: function ( orderId, fn ) {
            this.$http.get(BASE_URL+'/v1/pay/micropay/query?orderId='+orderId).then((res)=>{
                if ( res.status === 200 ) {
                    fn();
                }else if(res.status === 400 || res.status === 500){
                    // this.showPayBox = true;
                    // this.payApiBtn = true;
                    // this.paymentBtn = true;
                    // this.showPayLoding = false;
                    clearInterval(this.payLoadTimer);
                }
            }).catch(( err )=>{
                // this.showPayBox = true;
                // this.payApiBtn = true;
                // this.paymentBtn = true;
                // this.showPayLoding = false;
                clearInterval(this.payLoadTimer);
            })
        },
        chargeVip(item){
            console.log(this.inputVipMoney)

            if(item){
                this.inputVipMoney = "";
            }else{
                if(!/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(this.inputVipMoney)|| this.inputVipMoney == 0){
                    this.$message({
                        message: '充值金额输入有误',
                        showClose: true,
                        customClass: 'error'
                    });
                    return;
                }
                let rechargeLimit = JSON.parse(localStorage.getItem("rechargeLimit"));
                if(Number(this.inputVipMoney)<Number(rechargeLimit)){
                    this.$message({
                        message: '充值金额不能小于'+Number(rechargeLimit)+'元',
                        showClose: true,
                        customClass: 'error'
                    });
                    return;
                }
            }
            this.$http({
                url:BASE_URL+"/v1/clerk/member-charges",
                method:"PUT",
                data:{
                    "storeId": this.storeId,
                    "memberAccountId": this.vipData.id,
                    "amount": parseFloat(this.inputVipMoney?this.inputVipMoney:item.depositAmount),
                    "chargeRuleId": this.inputVipMoney?'':item.id,
                    "type":"CLERK"
                }
            }).then(res=>{
                this.curVipChargeInfo = res.data;
                this.showChargeType = true;
                console.log(res);
            })
        },
        // 获取充值规则
        getChargeRules(){
            let storeId = localStorage.getItem('storeId');
            this.$http({
                url:BASE_URL+"/v1/pos/charge-rules",
                method:"GET",
                params:{
                    storeId
                }
            }).then(res=>{
                this.chargeRules = res.data;
            });
        },
        // 选择会员
        selPhoneVip: function ( vipItem ) {
            this.vipData = vipItem;
            this.showVipInp = false;
            this.EnterPhone = "";
            setTimeout(()=>{
                this.showRecharge=true;
            },200);
        },
        // 获取会员数据
        showVipInpFun(){
            this.isqrcode=false;
            this.blurBtn=false;
            setTimeout(()=>{
                this.showVipInp=true;
            },500);
        },
        getQrcode(){
            m$.template({
                time:'',
                val:''
            });
            this.$http.get('/referral-code?storeId='+localStorage.getItem('storeId')).then((res)=>{
                m$.template({
                    time:0,
                    val:''
                })
                this.isqrcode = true;
                this.blurBtn  = true;
                setTimeout(()=>{
                    let qrcode = new QRCode("qrcode", {
                        text:  res.data,
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        correctLevel : QRCode.CorrectLevel.H
                    });
                },200);

                this.$http.get('/stores/'+this.storeId).then((res)=>{
                    localStorage.setItem("rechargeLimit",JSON.stringify(res.data.rechargeLimit));
                });


            }).catch((res)=>{
               m$.template({
                    time:0,
                    val:''
                })  
            })
        },
        logout: function () {
            this.$http.post(BASE_URL+'/logout', {}).then((res)=>{
                    localStorage.clear();
                    sessionStorage.clear();
                    this.$router.push({path:'/login'});
                }).catch((err)=>{

                })
        }
    },
    created: function () {
        if(localStorage.getItem('curVipPerson')){
            //有会员就展示出来
            localStorage.removeItem("curVipPerson");
        }
        if ( !localStorage.getItem('storeId') ) {
            this.$router.push({path:'/login'});
        } else {
            this.storeId = localStorage.getItem('storeId');

            this.$http.post('authorize?storeId='+this.storeId, {}).then((res)=>{
                this.$http.get('/today?storeId='+this.storeId).then((res)=>{
                    this.orderCount = res.data.orderCount;
                });
            }).catch(()=>{
                this.$router.push({path:'/login'});
                localStorage.clear();
            })
            // this.$http.get('/today?storeId='+this.storeId).then((res)=>{
            //     this.orderCount = res.data.orderCount;
            // });
            this.getChargeRules();
        }
    },
  	mounted(){
  		m$.setTitle('首页'); 
        $(document).ready(()=>{
            $('.index').height($(window).height());
        });
  	}
}
</script>
<style lang="scss" scoped>
	@import "index";
</style>
