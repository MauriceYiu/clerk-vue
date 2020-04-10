<template>
	<div class="buySuccess">
		<div class="logo">
			<div>  
				<i class="iconfont icon-wancheng"></i>
			</div>
			<p>支付成功</p>
		</div>
		<div class="pay_info" v-if="btn">
            <p class="title"> 订单详情</p>
            <div class="item">
                <p class="text algin_left">订单流水号</p>
                <p class="text algin_right" v-text="orderData.code"></p>
            </div>
            <div class="item">
                <p class="text algin_left">订单时间</p>
                <p class="text algin_right">{{ orderData.paymentTime | numberToAllDate('')}}</p>
            </div>
            <div class="item">
                <p class="text algin_left">支付金额</p>
                <p class="text algin_right" v-text="'￥'+orderData.amount"></p>
            </div>
            <p class="title"> 备注</p>
            <div class="notes">
            	<p v-text="orderData.notes?orderData.notes:'暂无！'">多方花椒多方花椒多方花椒多方花椒多方花椒多方花椒多方花椒多方花椒多方花椒多方花椒多方花椒多方花椒多方花椒多方花椒多方花椒多方花椒多方花椒多方花椒多方花椒</p>
            </div>
        </div>
        <!-- <router-link class="button go-takeOrder" tag="div" to="/takeOrder" replace><button type="button">继续点单</button></router-link> -->
        <router-link class="button go-order" tag="div" to="/takeOrder" replace><button type="button">继续点单</button></router-link>
	</div>
</template>

<script type="text/javascript">
export default {
	data(){
		return{
			orderData:{},
			btn:false
		}
	},
	mounted(){
		m$.hiddenScroll('.buySuccess'); 
		    setTimeout(function () { 
		    m$.hiddenScroll('.buySuccess'); 
		},10)
		this.$http.get('/orders/'+this.$route.params.id).then((res)=>{
            this.orderData = res.data;
            this.btn = true;
        })
        $(document).ready(()=>{
  			$('.login').height($(window).height());
  		});
  		m$.setTitle('支付成功');
  	}
}
</script>
<style lang="scss" scoped>
	.buySuccess{
		width: 100%;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background-color: #fff;
		box-sizing: border-box;
		.logo{
			text-align: center;
			padding-top: .5rem;
			margin-bottom: .5rem;
			i {
				color:  #71d785;
				font-size: 2rem;
			}
			p {
				font-size: .4rem;
				margin-top: .2rem;
			}
		}
		.pay_info{
			// height: calc( 100% - 4.5rem );
			position: relative;
			.title {
				color: #444;
				height: 1rem;
				line-height: 1rem;
				padding: 0 .2rem;
				font-size: .32rem;
				border-top: .1rem solid #f1efef;
		  	}
			.item {
	  			display: webkit-flex;
				display: flex;
				font-size: .28rem;
				color: #999;
				height: .4rem;
				line-height: .4rem;
				margin-bottom: .32rem;
				.text {
					flex : 1;
				}
				.algin_right {
					text-align: right;
					padding-right: .25rem;
				}
				.algin_left {
					color: #666666;
					padding-left: .5rem;
				}
	  		}
	  		.notes {
				padding: 0 .5rem;
				max-height: 76px;
				overflow-y: scroll;
	  			p {
					font-size: .28rem;
					line-height: 1.5em;
					color: #666666;
	  			}
	  		}
		}
  		.button{
  			height: .8rem;
  			width: 100%;
  			text-align: center;
  			position: absolute;
  			font-size: 0;
  			button{
  				display: inline-block;
  				border: none;
  				background: none;
  				background-color: #71d785;
  				color: #fff;
  				height: 100%;
  				width: 4.3rem;
  				box-shadow: 0 0 10px 0 #71d685;
  				border-radius: 40px;
  				font-size: .32rem;
  			}
  		}
  		.go-takeOrder{
  			bottom: 2rem;
  		}
  		.go-order{
  			bottom: .8rem;
  		}
	}
</style>
