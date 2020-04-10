<template>
	<div class="coupon" id="coupon">
        <div class="coupon_scroll_box" id="wrapper">
            <div class="noMsgTip" v-if="couponList.length<=0">暂无优惠券信息</div>
            <div id="scroller">
                <ul id="thelist">
                    <li class="coupon_item" v-for="(item,idx) in couponList">
                        <div class="info-box clearfix">
                            <div  class="info"  @click="couponInstanceFn(item,idx)">
                               <div class="img flex flex-align-center flex-pack-center left">
                                   <div class="img-inner">
                                       <img :src="item.logoURL" v-if="item.logoURL">
                                   </div>
                               </div>
                               <div class="text left">
                                    <div class="title title1">
                                        <span class="type" v-text="item.title"></span>
                                    </div>
                                    <div class="title title2">
                                        <span class="coupon-type" v-text="couponType[item.type]"></span>
                                        <span class="product-name" v-text="item.productName"></span>
                                    </div>
                                    <div class="expire-days">
                                        <span>有效日期</span>
                                        <!-- <span v-text="item.expireDays+'天'" style="color:#e66a6a;"></span> -->
                                        <span style="color:#e66a6a;">{{item.startTime | numberToDate('')}}</span>
                                        <span>~</span>
                                        <span style="color:#e66a6a;">{{item.endTime | numberToDate('')}}</span>
                                    </div>
                               </div> 
                           </div>
                           <div class="use-rules" @click="()=>{$router.push('couponDetail/'+item.id)}">
                                <div class="inner1">
                                   <span v-text="'使用规则：'+item.notice"></span>
                                   <i class="iconfont icon-jiantou"></i>
                                </div>
                           </div>
                        </div>
                        <div class="distribute flex flex-align-center flex-pack-right" v-if="distributeBtn==idx">
                            <button type="button" @click="()=>{distributeBtn=-1}" class="cancle">取消</button>
                            <button type="button" @click="distributeFn(item,idx)">派发</button>
                        </div>
                    </li>
                </ul>
                <div id="pullUp" :style="{display:(couponList.length>=pageSize?'block':'none')}">
                <!-- <div id="pullUp"> -->
                    <span class="pullUpLabel">上拉加载更多</span>
                </div>
            </div>
        </div>

        <!-- 派发优惠券二维码 -->
        <div class="vipQrcode" :style="{display:isqrcode?'block':'none'}" @click="closeCouponCode">
            <div class="position-middle-center content">
                <div id="couponCode" class="qrcode-border"></div>
                <p class="add-text">扫码领取优惠券</p>
            </div>
        </div>
	</div>
</template>

<script type="text/javascript">
export default {
  	data(){ 
  		return{
            couponList:[],
            curStoreId: '',
            curPage: 0,
            pageSize: 5,
            total: 0,
            couponType:{
                "GET_ITEM_FREE":'商品抵用券'
            },
            distributeBtn:-1,

            isqrcode: false, // 
            couponTimer: '',
            queryId: '', // 轮询id
  		}
  	},
  	methods:{
        //绑定优惠券和会员
        couponInstanceFn(item,idx){
            if(this.distributeBtn == idx){
                this.distributeBtn = -1;
            }else {
                this.distributeBtn = idx;
            }
        },
        //派发
        distributeFn(item,idx){
            let body ={
                couponId:item.id,
            }
            this.$http.post("coupon-instance",body).then((res)=>{
                this.isqrcode = true;
                this.queryId = res.data.couponInstanceId;
                setTimeout(()=>{
                    $('#couponCode')[0].innerHTML='';
                    let couponCode = new QRCode("couponCode", {
                        text: res.data.url,
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        height: 200,
                        width: 200,
                        correctLevel : QRCode.CorrectLevel.H
                    });
                },200)
                this.couponTimer = setInterval(()=>{
                    this.couponQuery();
                },2000)
            }).catch((err)=>{})

        },
        // 优惠券轮询
        couponQuery: function () {
            this.$http.get(this.queryId+'/query-instance').then((res)=>{
                if ( res.data.code == 200 ) {
                    clearInterval(this.couponTimer);
                    this.$message({
                        message: "派发成功！",
                        customClass: 'success'
                    });
                    this.distributeBtn = -1;
                    this.isqrcode = false;
                }
            })
        },
        // 关闭领取窗口
        closeCouponCode: function () {
            this.isqrcode = false;
            clearInterval(this.couponTimer);
        }
  	},
    created: function () {
        this.curStoreId = localStorage.getItem('storeId');
    },
    mounted(){
          m$.setTitle('派发优惠券');
          let userName = localStorage.getItem("phone");
        this.$http.get('coupon?storeId='+this.curStoreId+'&page='+this.curPage+'&size='+this.pageSize+'&userName='+userName).then((res)=>{
            this.couponList = res.data.content;
            $(document).ready(()=>{
                let myScroll;
                let pullUpEl;
                let pullUpOffset;
                let generatedCount = 0;
                let that = this;
                let isEnd = false;
                let getDataBtn = true;
                //动画部分
                setTimeout(()=>{
                    pullUpEl = document.getElementById('pullUp');   
                    pullUpOffset = pullUpEl.offsetHeight;
                    myScroll = new iScroll('wrapper', {
                        useTransition: true,
                        topOffset: 0,
                        onRefresh: function () {
                            if (pullUpEl.className.match('loading')) {
                                pullUpEl.className = '';
                                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多';
                                if(isEnd){
                                    pullUpEl.querySelector('.pullUpLabel').innerHTML = '亲，已经到底啦！';
                                }
                            }
                        },
                        onScrollMove: function () {
                            if ( that.couponList.length < that.pageSize ) {
                                return;
                            }
                            if (this.y < (this.maxScrollY - 20) && !pullUpEl.className.match('flip')) {
                                pullUpEl.className = 'flip';
                                pullUpEl.querySelector('.pullUpLabel').innerHTML = '释放刷新';
                                this.maxScrollY = this.maxScrollY;
                            } else if (this.y > (this.maxScrollY + 20) && pullUpEl.className.match('flip')) {
                                pullUpEl.className = '';
                                pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Pull up to load more...';
                                this.maxScrollY = pullUpOffset;
                            }
                        },
                        onScrollEnd: function () {
                            if (pullUpEl.className.match('flip')&&that.couponList.length>=that.pageSize) {
                            // if (pullUpEl.className.match('flip')) {
                                pullUpEl.className = 'loading';
                                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中';               
                                pullUpAction(); // Execute custom function (ajax call?)
                            }
                        }
                    });
                    document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);//阻止冒泡
                    document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 0); }, false);
                }, 500);

                //上拉加载更多数据
                function pullUpAction () {
                    if ( !getDataBtn ) {
                        return;
                    }
                    getDataBtn = false;
                    that.curPage++;
                    that.$http.get('coupon?storeId='+that.curStoreId+'&page='+that.curPage+'&size='+that.pageSize).then((res)=>{
                        that.couponList = that.couponList.concat(res.data.content); // 拼接数组
                        //数据没有更多了
                        if(res.data.content.length==0){
                            isEnd = true;
                        }else {
                            isEnd = false;
                        }
                        setTimeout(()=>{
                            getDataBtn = true;
                            myScroll.refresh();
                        },300)
                    }).catch(()=>{
                        getDataBtn = true;
                    })
                }
            });
        })
  	}
}
</script>
<style lang="scss" scoped>
@import "../../../static/css/common.scss";
	@import "coupon";
</style>

 