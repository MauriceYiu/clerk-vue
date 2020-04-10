<template>
	<div class="orderDetail">
		<!-- <span v-text="'orderDetail'+$route.params.id"></span> -->
        <p class="title"> 商品类目</p>
        <div class="csroll_box" id="csroll_box">
            <div class="goods" >
                <div class="item" v-for="item in order.items">
                    <span class="name" v-text="item.productName"></span>
                    <span class="money"><span>&yen;</span><span v-text="item.dealPrice"></span></span>
                    <span class="num" ><span>&times;</span><span v-text="item.quantity"></span></span>
                </div>
            </div>
        </div>
        <div class="order_info" v-if="btn">
            <p class="title"> 订单详情</p>
            <div class="item">
                <p class="text algin_left">订单流水号</p>
                <p class="text algin_right" v-text="order.code"></p>
            </div>
            <div class="item">
                <p class="text algin_left">订单时间</p>
                <p class="text algin_right">{{order.createTime | numberToAllDate('')}}</p>
            </div>
            <div class="item">
                <p class="text algin_left">折扣金额</p>
                <p class="text algin_right"><span>&yen;</span><span v-text="order.discount"></span></p>
            </div>
            <div class="item">
                <p class="text algin_left">抹零金额</p>
                <p class="text algin_right"><span>&yen;</span><span v-text="order.removeZero"></span></p>
            </div>
            <div class="item">
                <p class="text algin_left">支付金额</p>
                <p class="text algin_right"><span>&yen;</span><span v-text="order.amount"></span></p>
            </div>
            <div class="item">
                <p class="text algin_left">座位号</p>
                <p class="text algin_right" v-text="order.partitionName + '--' + order.numName"></p>
            </div>
            <div class="item">
                <p class="text algin_left">备注</p>
                <p class="text algin_right notes" v-text="order.notes"></p>
            </div>
        </div>
        <div class="btnGroup" v-if="showCancel">
            <button type="button" @click="showDelConfirm=true">取消订单</button>
        </div>
        <!-- 确认取消弹出框 -->
        <div class="delConfirmMask" @click="showDelConfirm=false" v-if="showDelConfirm">
            <div class="delConfirm position-middle-center" @click.stop="">
                <p class="tipText">确定取消订单？</p>
                <div class="btn">
                    <button type="button" class="cancle" @click="showDelConfirm=false">取消</button>
                    <button type="button" @click="delOrder()">确定</button>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
export default {
  	data(){
  		return{
            order:{},
            btn: false,
            showCancel: false,
            showDelConfirm:false
  		}
  	},
  	methods:{
  		// 取消订单
        delOrder: function () {
            this.$http.delete('orders/'+this.$route.params.id+'?status=true').then((res)=>{
                sessionStorage.removeItem('orderId');
                this.$router.replace({path:'/order',replace: true});
            }).catch(()=>{
                
            })
        },
  	},
  	mounted(){
        this.$http.get('/orders/'+this.$route.params.id).then((res)=>{
            this.order = res.data;
            this.btn = true;
            if ( res.data.status == "NOTSURE" || res.data.status == "FAIL" ) {
                this.showCancel = true;
            }
        })
  		m$.setTitle('订单详情');
        this.$createScroll('csroll_box');
  	}
}
</script>
<style lang="scss" scoped>
	@import "orderDetail";
</style>
