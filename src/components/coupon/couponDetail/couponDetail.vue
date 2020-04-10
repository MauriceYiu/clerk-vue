<template>
	<div class="couponDetail" id="couponDetail">
        <div class="top-bg flex flex-align-center flex-pack-center">
            <div class="top-inner">
                <p v-text="couponObj.title" class="title"></p>
                <p v-text="couponObj.productName" class="productName"></p>
            </div>
        </div>
        <div class="items">
            <div class="item">
                <span class="name">有效日期：</span>
                <span style="color:#e66a6a;">{{couponObj.startTime | numberToDate('')}}</span>
                <span>~</span>
                <span style="color:#e66a6a;">{{couponObj.endTime | numberToDate('')}}</span>
            </div>
            <div class="item">
                <span class="name">优惠券类型：</span>
                <span v-text="couponType[couponObj.type]" class="text"></span>
            </div>
        </div>
        <div class="content">
            <div class="title">优惠说明：</div>
            <p v-text="couponObj.description"></p>
        </div>
        <div class="content">
            <div class="title">使用规则：</div>
            <p v-text="couponObj.notice"></p>
        </div>
	</div>
</template>

<script type="text/javascript">
export default {
  	data() {
  		return{
            couponObj:{},
            couponType:{
                "GET_ITEM_FREE":'商品抵用券'
            },
  		}
  	},
    watch:{
      
    },
  	methods:{
       
  	},
    created: function () {
        this.curStoreId = localStorage.getItem('storeId');
        this.$http.get(this.$route.params.id+'/coupon').then((res)=>{
            this.couponObj = res.data;
        })
    },
  	mounted(){
  		m$.setTitle('优惠券详情');
  	}
}
</script>
<style lang="scss" scoped>
@import "../../../../static/css/common.scss";
	@import "couponDetail";
</style>

 