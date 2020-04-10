<template>
	<div class="changeWork" id="changeWork">
        <div id="scroller">
            <div class="title">
                <span class="storeName" v-text="workData.storeName"></span>
                <span>-交班</span>
            </div>
            <div class="time">
                <span>{{workData.beginTime | numberToAllDate('')}}</span>
                <span class="to_span">至</span>
                <span>{{workData.endTime | numberToAllDate('')}}</span>
            </div>
            <div class="HSpace1"></div>
            <div class="item clearfix">
                <span class="left">开班人</span>
                <span class="right color1" v-text="workData.operatorName"></span>
            </div>
            <div class="item clearfix">
                <span class="left">交班人</span>
                <span class="right color1" v-text="workData.closeUsername"></span>
            </div>
            <div class="HSpace1"></div>
            <div class="item spec1 clearfix">
                <span class="left">总销售额</span>
                <span class="right">￥{{(workData.turnInAmount/100).toFixed(2)}}</span>
            </div>
            <div class="HSpace1"></div>
            <div class="item clearfix" v-for="(item,index) in adminPayBill" :key="index">
                <span class="left">{{payType[item.channel]}}</span>
                <span class="right">{{(item.amount).toFixed(2)}}</span>
            </div>
            <!-- <div class="item clearfix">
                <span class="left">优惠券抵扣</span>
                <span class="right" v-text="'￥'+workData.couponAmount/100"></span>
            </div>
            <div class="item clearfix">
                <span class="left">会员余额支付</span>
                <span class="right" v-text="'￥'+workData.memberAmount/100"></span>
            </div>
            <div class="item clearfix">
                <span class="left">支付宝支付</span>
                <span class="right" v-text="'￥'+workData.alipayAmount/100"></span>
            </div>
            <div class="item clearfix">
                <span class="left">微信支付</span>
                <span class="right" v-text="'￥'+workData.wechatAmount/100"></span>
            </div>
            <div class="item clearfix" v-if="workData.alipayCashAmount>0">
                <span class="left">线下支付宝</span>
                <span class="right" v-text="'￥'+workData.alipayCashAmount/100"></span>
            </div>
            <div class="item clearfix" v-if="workData.wechatCashAmount>0">
                <span class="left">线下微信</span>
                <span class="right" v-text="'￥'+workData.wechatCashAmount/100"></span>
            </div> -->
            <div class="HSpace2"></div>
            <!-- <div class="item spec1 clearfix">
                <span class="left">总销售额</span>
                <span class="right" v-text="'￥'+workData.turnInAmount/100"></span>
            </div> -->
            <div class="HSpace2"></div>
            <div class="item spec1 clearfix">
                <span class="left">会员充值</span>
                <span class="right">￥{{(workData.memberDepositAmount/100).toFixed(2)}}</span>
            </div>
            <div class="HSpace2"></div>
            <!-- <div class="item spec1 clearfix" @click="$router.replace('/workOrderDetail/'+workData.id)">
                <span class="left">订单详情</span>
                <i class="right iconfont icon-jiantou"></i>
            </div> -->
            <div class="HSpace1"></div>
            
            <div id="typeBox">
                <div class="smallTitle" id="typeTitle"><span class="left">火星网费</span><span class="right" style=" color:#dc6060;">￥{{(costList.amount).toFixed(2)}}</span></div>
                <div class="smallTitle" id="typeTitle"><span class="left">会员支付网费</span><span class="right" style=" color:#dc6060;">￥{{(workData.net.amount).toFixed(2)}}</span></div>
                <div class="smallTitle" id="typeTitle"><span class="left">会员支付网费数量</span><span class="right" style=" color:#dc6060;">{{workData.net.qty}}</span></div>
                <!-- <div class="item" id="type" v-for="(item,idx) in costList.list">
                    <div class="typeName clearfix">
                        <span class="left" v-text="item.name"></span>
                        <span class="right" v-text="'￥'+item.price"></span>
                    </div>
                </div> -->
            </div>
            <div class="HSpace1"></div>
            <div id="typeBox">
                <div class="smallTitle" id="typeTitle">分类列表</div>
                <div :class="item.typeName===nowTypeName?'item active':'item'" id="type" v-for="(item,idx) in workData.itemDetails">
                    <div class="typeName clearfix" @click="getNowTypeProducts(item)">
                        <span class="left" v-text="item.typeName"></span>
                        <i class="right iconfont icon-jiantou"></i>
                        <span class="right">￥{{(item.amount).toFixed(2)}}</span>
                    </div>
                    <div class="smallGood clearfix" v-for="item2 in nowItem">
                        <span class="left" v-text="item2.qty+' × '+item2.name"></span>
                        <span class="right" >￥{{(item2.amount).toFixed(2)}}</span>
                    </div>
            
                    <div class="smallItem" v-for="item2 in item.productTypes">
                        <div class="smallTypeName clearfix">
                            <span class="left" v-text="item2.typeName"></span><i class="right iconfont icon-jiantou"></i>
                            <span class="right">￥{{(item2.amount).toFixed(2)}}</span>
                        </div>
                        <div class="smallTypeGood clearfix" v-for="item3 in item2.products">
                            <span class="left" v-text="item3.quantity+' × '+item3.productName"></span>
                            <span class="right">￥{{(item3.amount).toFixed(2)}}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="HSpace1"></div>
            <div id="couponBox" @click="changeCouponBox">
                <div class="smallTitle" id="typeTitle">优惠券核销记录<i class="right iconfont icon-jiantou"></i></div>
                <div class="smallGood clearfix" v-for="item in workData.coupons">
                    <span class="left" v-text="item.quantity+' × '+item.productName"></span>
                    <span class="right">￥{{(item.amount/100).toFixed(2)}}</span>
                </div>
            </div>
            
            <div class="HSpace1"></div>
            
            <!-- <div class="HSpace1"></div> -->
            <!-- <div class="item clearfix spec1">
                <span class="left">销售总数</span>
                <span class="right" v-text="workData.totalQuantity"></span>
            </div>
            <div class="item clearfix spec1">
                <span class="left">销售总值</span>
                <span class="right" v-text="'￥'+workData.totalAmount/100"></span>
            </div> -->
        </div>
    </div>
</template>

<script type="text/javascript">
import {BASE_URL} from "./../../../urlConfig";
export default {
  	data(){
  		return{
            nowTypeName:'',//当前所选择的分类的名字
			nowItem:[],//用户点击交班的分类的时候，所点击的分类下的商品
            CreatorData:[],
            workData: {net:{amount:0,qty:0}}, // 班次数据
            curStoreId: '',
            curPage: 0,
            pageSize: 10,
            statusFn:{
                'INIT':       "初始单",
                'UNSETTLED':  "未结算",
                'UNFINISHED': "未处理",
                'FINISHED':   "已处理",
                'CANCELED':   "已取消",
                'REFUNDED':   "已退",
                'NOTSURE':    "支付中",
                'FAIL':       "支付失败",
            },
            total: 0,
            totalAmount: 0,
            costList:{//本班网费
                amount:0,
                list:[]
            },
            adminPayBill:[],
            payType:{
                "memberRechargeAmount":"会员充值",
                "memberAmount":"会员",
                "MEMBER":"会员",
                "couponAmount":"优惠券",
                "COUPON":"优惠券",
                "WECHATPAY_CASH":"微信线下",
                "ALIPAY_CASH":"支付宝线下",
                "UNIONPAY":"银联",
                "alipayAmount":"支付宝",
                "ALIPAY":"支付宝",
                "wechatAmount":"微信",
                "WECHATPAY":"微信",
                "cashAmount":"现金",
                "CASH":"现金",
                "wingPayAmount":"翼支付",
                "unionPay":"银联支付",
                "smMicroPay":"会员卡",
                "qqMicroPay":"QQ钱包刷卡",
                "jdMicroPay":"京东刷卡"
            }
  		}
  	},
  	methods:{
          //获取当前分类下的商品销售情况
		getNowTypeProducts(item){
			if(this.nowTypeName === item.typeName){
				this.nowTypeName = '';
				return;
			}
			this.nowTypeName = item.typeName;
			this.$http({
				url:BASE_URL+"/v1/pos/get-itemDetails",
				method:"GET",
				params:{
					id:this.$route.params.id,
					storeId:this.curStoreId,
					typeName:item.typeName
				}
			}).then(res=>{
				this.nowItem = res.data;
				console.log(res);
			});
		},
        changeCouponBox: function () {
            if ( $('#couponBox').css('height') == '50px' ) {
                $('#couponBox').css('height', 'auto');
            } else {
                $('#couponBox').css('height', '50px');
            }
        },
  		orderDetail(id){
  			this.$router.push({path:'/orderDetail/'+id});
  		},
  		getOrderList(){
  			this.$http.get('/orders/list?storeId='+this.curStoreId+'&page='+this.curPage+'&size='+this.pageSize).then((res)=>{
  				this.CreatorData = res.data
  			})
  		}
  	},
    created: function () {
        this.$http.get('workshift/'+this.$route.params.id+'/details').then((res)=>{
            this.workData = res.data;
            let costs = res.data.cost;
            let paymentStatics = JSON.parse(res.data.paymentStatics);
            if(paymentStatics != null && paymentStatics != ""){
                this.adminPayBill = paymentStatics.adminPayBill;
            }
            let nameType = {
                'alipayAmount':'支付宝支付',
                'alipayCashAmount':'线下支付宝支付',
                'cashAmount':'现金支付',
                'couponAmount':'优惠券抵扣',
                'memberAmount':'会员支付',
                'wechatAmount':'微信支付',
                'wechatCashAmount':'线下微信支付',
            };
            for (var k in costs) {
                if(k!='turnInAmount'&&costs[k]!=0){
                    let obj={
                        name:'',
                        price:''
                    };
                    obj.name = nameType[k];
                    obj.price = costs[k];
                    this.costList.amount+=costs[k];
                    this.costList.list.push(obj);
                }
            }
            if ( res.data.itemDetails ) {
                setTimeout(()=>{
                    let typeDomArr = document.getElementsByClassName('typeName');
                    for (var i = 0, len = typeDomArr.length; i < len; i++) {
                        typeDomArr[i].onclick = function () {
                            if ( this.parentNode.className == 'item' ) {
                                this.parentNode.setAttribute("class", "item active");
                            } else {
                                this.parentNode.setAttribute("class", "item");
                            }
                        }
                    }
                    let smallTypeDomArr = document.getElementsByClassName('smallTypeName');
                    for (var i = 0, len = smallTypeDomArr.length; i < len; i++) {
                        smallTypeDomArr[i].onclick = function () {
                            if ( this.parentNode.className == 'smallItem' ) {
                                this.parentNode.setAttribute("class", "smallItem active");
                            } else {
                                this.parentNode.setAttribute("class", "smallItem");
                            }
                        }
                    }
                }, 200)
                
            }
        })
    },
  	mounted(){
        this.$createScroll('changeWork');
        this.curStoreId = localStorage.getItem("storeId");
  	}
}
</script>
<style lang="scss" scoped>
	@import "workDetail";
</style>

 