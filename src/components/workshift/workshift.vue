<template>
    <div class="workshift">
        <div class="smallTitle flex flex-align-center">我的交班记录</div>
        <div class="orderList" id="wrapper">
            <div id="scroller">
                <ul id="thelist">
                    <li v-for="(item,idx) in earningData" @click="$router.push('workDetail/'+item.id)">
                        <div class="top clearfix">
                            <span class="left" v-text="idx+1+'，'" style="padding-right:0px;"></span>
                            <span class="left" v-text="'开班人：'+item.operatorName" style="padding-right:20px;"></span>
                            <span class="left" v-text="'交班人：'+item.closeUsername"></span>
                        </div>
                        <div class="date">
                            <span>开班时间：</span>
                            <span>{{item.beginTime | numberToAllDate('')}}</span>
                        </div> 
                        <div class="date">
                            <span>交班时间：</span>
                            <span>{{item.endTime | numberToAllDate('')}}</span>
                        </div>
                        <div class="detail">
                            <span>详情</span>
                            <i class="iconfont icon-jiantou"></i>
                        </div>
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
            earningData: [],
            curPage: 0,
            pageSize: 10,
            curStoreId: '',
        }
    },
    methods:{
    },
    created: function () {
        m$.setTitle('我的交班记录');
        this.curStoreId = localStorage.getItem('storeId');
        this.$http.get('workshift/'+this.curStoreId+'/list').then((res)=>{
            // console.log(res.data);
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
                that.$http.get('workshift/'+this.curStoreId+'/list').then((res)=>{
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
    @import "../../../static/css/common.scss";
    @import "workshift.scss";
</style>
