<template>
	<div class="earnings">
        <div class="smallTitle flex flex-align-center">该班次所有订单</div>
        <div class="orderList" id="wrapper">
            <div id="scroller">
                <ul id="thelist">
                    <li v-for="(item,idx) in earningData">
                        <div class="top clearfix">
                            <span class="left" v-text="idx+1+'，'" style="padding-right:0px;"></span>
                            <span class="left" >{{item.paymentTime | numberToAllDate('')}}</span>
                            <span class="right earningsColor total" v-text="'金额：￥'+item.amount"></span>
                        </div>
                        <div class="top clearfix">
                            <span class="left">订单来源</span>
                            <span class="right total" v-text="sourceType[item.source]"></span>
                        </div>
                        <div class="top clearfix">
                            <span class="left">订单状态</span>
                            <span class="right total" :class="{'earningsColor1':item.status=='REFUNDED'}" v-text="statusType[item.status]"></span>
                        </div>
                        <div class="top clearfix">
                            <span class="left">支付方式</span>
                            <span class="right total" v-text="channelType[item.payments[0].channel]"></span>
                        </div>
                        <div v-if="item.status=='REFUNDED'">
                            <div class="top clearfix">
                                <span class="left">退款方式</span>
                                <span class="right total" v-text="channelType[item.payments[1].channel]"></span>
                            </div>
                            <div class="top clearfix">
                                <span class="left">退单原因</span>
                                <span class="right total" style="width:80%;word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsi;text-align:right;" v-text="item.refundReason"></span>
                            </div>
                        </div>
                        <div class="goods clearfix" v-for="(item2, idx2) in item.items">
                            <span class="left name" v-text="item2.productName+'  x'+item2.quantity"></span>
                            <span class="right" v-text="'￥'+item2.salesPrice">￥0.0</span>
                        </div>
                        <div class="date">订单号：{{item.code}}</div>
                    </li>
                </ul>
                <div id="pullUp" :style="{display:(earningData.length>=pageSize?'block':'none')}">
                    <span class="pullUpLabel">上拉加载更多</span>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
export default {
  	data(){
  		return{
            sourceType: {
                POS: "收银台",
                WEB: "电脑点单",
                EMPLOYEE: "店员宝",
                WEIXIN: "微信点单",
                CONSUMER: "消费者，微信",
                TAKEOUT: "三方外卖"
            },
            statusType: { // 状态类型
                UNSETTLED: "未结算",
                UNFINISHED: "未处理",
                FINISHED: "已处理",
                CANCELED: "已取消",
                REFUNDED: "已退"
            },
            channelType: { // 结算方式
                ALIPAY: '支付宝',
                CASH: '现金',
                WECHATPAY: '微信',
                MEMBER : '会员支付',
                ALIPAY_CASH : '线下支付宝',
                WECHATPAY_CASH : '线下微信',
            },
            earningData: [],
            curPage: 0,
            pageSize: 8,
            total: 0,
            lastMonth: 0,
  		}
  	},
    methods:{
       
    },
    created: function () {
        m$.setTitle('我的订单');
        this.$http.get('workshift/'+this.$route.params.id+'/orders-list'+'?page='+this.curPage+'&size='+this.pageSize).then((res)=>{
            this.earningData = res.data;
        })
    },
  	mounted(){
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
                        if ( that.earningData.length < that.pageSize ) {
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
                        if (pullUpEl.className.match('flip')&&that.earningData.length>=that.pageSize) {
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
                that.$http.get('workshift/'+that.$route.params.id+'/orders-list'+'?page='+that.curPage+'&size='+that.pageSize).then((res)=>{
                    for (var i = 0; i < res.data.length; i++) {
                        if ( res.data[i].payments.length > 1 ) {
                            if ( res.data[i].payments[0].amount < 0 ) {
                                let cache = res.data[i].payments[0];
                                res.data[i].payments[0] = res.data[i].payments[1];
                                res.data[i].payments[1] = cache;
                            }
                        }
                    }


                    that.earningData = that.earningData.concat(res.data); // 拼接数组
                     //数据没有更多了
                    if(res.data.length==0){
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
  	}
}
</script>
<style lang="scss" scoped>
    @import "../../../../static/css/common.scss";
    @import "workOrderDetail.scss";
</style>
