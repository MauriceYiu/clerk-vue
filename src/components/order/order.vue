<template>
	<div class="order" id="order">
        <!--<div class="targetBox">
            <div class="clearfix">
                <span class="left">本月业绩线：</span>
                <span class="right price" v-text="'￥'+target"></span>
            </div>
            <div class="clearfix">
                <span class="left">距离目标：</span>
                <span class="right price" v-text="'￥'+((target-totalAmount)>0?(target-totalAmount).toFixed(2):0)"></span>
            </div>
            <div class="finish">
                {{(target-totalAmount)>0?'还差一点，加把劲！':'已达成目标，再接再厉！'}}
            </div>
        </div>-->
        <div class="topTatal clearfix">
            <div class="totalItem left" style="width:60%">
                <div class="title">本月销售总额</div>
                <div class="orderNumber" v-text="'￥'+totalAmount"></div>
            </div>
            <div class="totalItem left" style="width:40%">
                <div class="title">本月订单总数</div>
                <div class="orderNumber" v-text="total"></div>
            </div>
        </div>
        <div class="order_scroll_box" id="wrapper">
            <div class="noMsgTip" v-if="CreatorData.length<=0">暂无订单信息</div>
            <div id="scroller">
                <ul id="thelist">
                    <li class="order_item" v-for="(item,idx) in CreatorData" @click="orderDetail(item.id)">
                        <div class="info">
                            <p class="name" ><span>订单号 </span><span v-text="item.code"></span></p>
                            <p >{{item.addTime | numberToAllDate('')}}</p>
                        </div>
                        <div class="money">
                            <p class="status" :class="{status_deal:statusFn[item.status] == '未处理', status_finish:statusFn[item.status] == '未完成'}" v-text="statusFn[item.status]"></p>
                            <p v-text="'￥'+item.amount"></p>
                        </div>
                    </li>
                </ul>
                <div id="pullUp" :style="{display:(CreatorData.length>=pageSize?'block':'none')}">
                    <span class="pullUpLabel">上拉加载更多</span>
                </div>
            </div>
        </div>
	</div>
</template>

<script type="text/javascript">
export default {
  	data(){
  		return{
            CreatorData:[],
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
            target: 0, 
            surplus: 0,

  		}
  	},
  	methods:{
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
        this.curStoreId = localStorage.getItem('storeId');
        this.$http.get('/orders/total-amount?storeId='+this.curStoreId).then((res)=>{
            this.totalAmount = res.data.totalAmount.toFixed(2)
            this.target = res.data.target;
        })
    },
  	mounted(){
  		m$.setTitle('订单列表');
        this.$http.get('/orders/list?storeId='+this.curStoreId+'&page='+this.curPage+'&size='+this.pageSize).then((res)=>{
            this.CreatorData = res.data.orders;
            this.total = res.data.total;
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
                            if ( that.CreatorData.length < that.pageSize ) {
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
                            if (pullUpEl.className.match('flip')&&that.CreatorData.length>=that.pageSize) {
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
                    that.$http.get('orders/list?storeId='+that.curStoreId+'&page='+that.curPage+'&size='+that.pageSize).then((res)=>{
                        that.CreatorData = that.CreatorData.concat(res.data.orders); // 拼接数组
                        that.total = res.data.total;
                        //数据没有更多了
                        if(res.data.orders.length==0){
                            isEnd = true;
                        }else {
                            isEnd = false;
                        }
                        setTimeout(()=>{
                            myScroll.refresh();
                            getDataBtn = true;
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
	@import "order";
</style>

 