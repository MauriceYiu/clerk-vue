<template>
	<div class="earnings">
        <div class="topTatal clearfix">
            <div class="totalItem left">
                <div class="title">上月收益总额</div>
                <div class="orderNumber" v-text="'￥'+lastMonth"></div>
            </div>
            <div class="totalItem left">
                <div class="title">本月收益总额</div>
                <div class="orderNumber" v-text="'￥'+total"></div>
            </div>
            <!-- <div class="totalItem left" style="margin-top:5%;">
                <div class="title">上月推荐会员数</div>
                <div class="orderNumber" v-text="lastMonthMemberCount"></div>
            </div>
            <div class="totalItem left" style="margin-top:5%;">
                <div class="title">本月推荐会员数</div>
                <div class="orderNumber" v-text="sameMonthMemberCount"></div>
            </div> -->
        </div>
        <div class="smallTitle flex flex-align-center">本月订单</div>
        <div class="orderList" id="wrapper">
            <div id="scroller">
                <ul id="thelist">
                    <li v-for="(item,idx) in earningData">
                        <div class="top clearfix">
                            <span class="left" v-text="idx+1+'，'" style="padding-right:0px;"></span>
                            <span class="left" v-text="'订单号 '+item.code"></span>
                            <span class="right earningsColor total" v-text="'￥'+item.commission"></span>
                        </div>
                        <div class="goods clearfix" v-for="(item2, idx2) in item.items">
                            <span class="left" v-text="item2.productName+'  x'+item2.quantity"></span>
                            <span class="right earningsColor" v-text="'￥'+item2.commission">￥0.0</span>
                        </div>
                        <div class="date">{{item.createTime | numberToAllDate('')}}</div>
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
            arr:[
                {n:'烟类',p:'￥215'},
                {n:'饮料',p:'￥100'},
                {n:'面食',p:'￥20'},
            ],
            earningData: [],
            curPage: 0,
            pageSize: 10,
            curStoreId: '',
            total: 0,
            lastMonth: 0,
            // lastMonthMemberCount:0,
            // sameMonthMemberCount:0
        }
  	},
    methods:{
       
    },
    created: function () {
        m$.setTitle('我的收益');
        this.curStoreId = localStorage.getItem('storeId');
        this.$http.get('commission?storeId='+this.curStoreId+'&page='+this.curPage+'&size='+this.pageSize).then((res)=>{
            // console.log(res.data);
            this.earningData = res.data.orders;
            this.total = res.data.total;
            this.lastMonth = res.data.lastMonth;
            // this.lastMonthMemberCount=res.data.lastMonthMemberCount;
            // this.sameMonthMemberCount=res.data.sameMonthMemberCount;
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
                that.$http.get('commission?storeId='+that.curStoreId+'&page='+that.curPage+'&size='+that.pageSize).then((res)=>{
                    that.earningData = that.earningData.concat(res.data.orders); // 拼接数组
                    that.total = res.data.total;
                     //数据没有更多了
                    if(res.data.orders.length==0){
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
    @import "../../../static/css/common.scss";
    @import "earnings.scss";
</style>
