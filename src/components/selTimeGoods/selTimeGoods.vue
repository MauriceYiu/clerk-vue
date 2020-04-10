<template>
  <div class="sel-time-goods">
      <div class="search">
          <span class="arrow-back" @click.stop="$router.replace('/table')">
                <i class="iconfont icon-xiazai6"></i>
            </span>
          <input type="text" v-model="searchVal" placeholder="请输入..." />
      </div>
      <div class="goods-list">
          <div class="tit">
              <span style="flex:2;">图片</span>
              <span style="flex:3;">名称</span>
              <span style="flex:2;">操作</span>
          </div>
            <div class="goods-list-wrap">
                <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
                        <ul>
                            <li class="item" v-for="(item,index) in goodsList" :key="index">
                                <span style="flex:2;" class="goods-img">
                                    <img :src="item.imageUrl" alt="">
                                </span>
                                    <span style="flex:3;" class="info">
                                        <i>商品名：{{item.name}}</i>
                                        <i>规则名：{{item.ruleName}}</i>
                                    </span>
                                    <span style="flex:2;" class="do-sth">
                                        <span class="reduceNumber" @click.stop="modifyItemForTimeGoods('reduce',item)">
                                                <i class="iconfont icon-jianshao"></i>
                                        </span>
                                        <span class="addNumber" @click.stop="modifyItemForTimeGoods('add',item)">
                                            <i class="iconfont icon-zengjia999"></i>
                                        </span>
                                    </span>
                            </li>
                        </ul>
                </mescroll-vue>
            </div>
      </div>
      <div class="bottom">
          <div class="cart-list-wrap" v-show="showSeledGoods && nowSelectTimeGoods.length>0" @click.stop="showSeledGoods=false;">
            <div class="inner-wrap">
                <div class="list" @click.stop="" id="seled-goods-list">
                    <ul>
                        <li v-for="(item,index) in nowSelectTimeGoods" :key="index">
                            <div class="name left">{{item.name}}</div>
                            <div class="changeNumber right">
                                <span class="reduceNumber" @click.stop="modifyItemForTimeGoods('reduce',item)">
                                    <i class="iconfont icon-jianshao"></i>
                                </span>
                                <span class="addNumber" @click.stop="modifyItemForTimeGoods('add',item)">
                                    <i class="iconfont icon-zengjia999"></i>
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
          <div class="cart">
            <div class="cart-and-money">
                <span class="che" @click.stop="showSeledGoods=true">
                    <i class="iconfont icon-cart-copy-copy">
                    </i>
                    <b v-if="nowSelectTimeGoods.length!=0">{{nowSelectTimeGoods.length}}</b>
                </span>
                <!-- <span class="total-money">￥{{totalAmount}}</span> -->
                <span class="go-pay" @click.stop="goSureSelGoods()">完成</span>
            </div>
        </div>
      </div>
  </div>
</template>

<script>
import {mapGetters,mapActions} from "vuex";
import MescrollVue from 'mescroll.js/mescroll.vue';
export default {
    components:{
        MescrollVue
    },
    data(){
        return{
            mescroll:null,
            searchVal:'',
            goodsList:[],
            storeId:"",
            size:10,
            showSeledGoods:false,
            totalCount:0,
            totalAmount:0,
            nowPage:0,
            nowSelectTimeGoods:[],
            nowDeskOrderInfo:{},
            curSelTable:{},
            orderId:"",
            numId:0,
            mescrollDown:{
                isLock:true,
            },
            mescrollUp: { // 上拉加载的配置.
                callback: this.upCallback, // 上拉回调,此处简写; 相当于 callback: function(page, mescroll) { }
                //以下是一些常用的配置,当然不写也可以的.
				page: {
					num: 0, //当前页 默认0,回调之前会加1; 即callback(page)会从1开始
					size: 10 //每页数据条数,默认10
				},
				htmlNodata: '<p class="upwarp-nodata">-- 已加载完成 --</p>',
				noMoreSize: 0, //如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
							// 避免列表数据过少(比如只有一条数据),显示无更多数据会不好看
							// 这就是为什么无更多数据有时候不显示的原因
				empty: {
					tip: "暂无相关数据~" //提示
				}
			}
        }
    },
    watch:{
        searchVal(val){
            this.searchGoods(val);
        },
    },
    beforeRouteEnter (to, from, next) { // 如果没有配置顶部按钮或isBounce,则beforeRouteEnter不用写
            next(vm => {
                // 滚动到原来的列表位置,恢复顶部按钮和isBounce的配置
                vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter()
            })
    },
    beforeRouteLeave (to, from, next) { // 如果没有配置顶部按钮或isBounce,则beforeRouteLeave不用写
        // 记录列表滚动的位置,隐藏顶部按钮和isBounce的配置
        this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave()
        next()
    },
    methods:{
        ...mapGetters(['getNowDeskOrderInfo',"getNowSelDesk"]),
        ...mapActions(["saveNowDeskOrderInfo"]),
        mescrollInit (mescroll) {
            this.mescroll = mescroll  // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
        },
        upCallback(page,mescroll){
            this.nowPage++;
            this.getGoodsList(page.num,mescroll);
        },
        goSureSelGoods(){
                if(!this.nowSelectTimeGoods.length){
                    this.$message({
                        message: "请选择商品",
                        showClose: true,
                        customClass: 'error'
                    });
                    return;
                }
                let reqList = [];
                for(let i=0;i<this.nowSelectTimeGoods.length;i++){
                    let obj = {
                        productTimeId:this.nowSelectTimeGoods[i].id
                    }
                    reqList.push(obj);
                }
                let createName = localStorage.getItem("employeeName")?localStorage.getItem("employeeName"):"";
                let createMobile = localStorage.getItem("phone")?localStorage.getItem("phone"):"";
                this.$http({
                    url:"add-time-item",
                    method:"POST",
                    data:{
                        orderId:this.orderId,
                        numId:this.numId,
                        storeId:this.storeId,
                        createName,
                        createMobile,
                        reqList,
                    }
                }).then(res=>{
                     this.$message({
                        message: "添加成功",
                        showClose: true,
                        customClass: 'success'
                    });
                    this.$router.replace("/table");
                });
        },
        modifyItemForTimeGoods(type,item){
            let nowSelectTimeGoods = this.nowSelectTimeGoods;
            if(type == 'add'){
                console.log(item);
                let flag = false;
                let index;
                for(let i=0;i<nowSelectTimeGoods.length;i++){
                if(nowSelectTimeGoods[i].id == item.id){
                    flag = true;
                    index = i;
                }
                }
                if(flag){
                    nowSelectTimeGoods[index].count++;
                }else{
                    item.count++;
                    nowSelectTimeGoods.push(item);
                }
                this.nowSelectTimeGoods = nowSelectTimeGoods;
            }else{
                let flag = false;
                let index;
                for(let i=0;i<nowSelectTimeGoods.length;i++){
                if(nowSelectTimeGoods[i].id == item.id){
                    flag = true;
                    index = i;
                }
                }
                if(flag){
                    nowSelectTimeGoods.splice(index,1);
                }
                this.nowSelectTimeGoods = nowSelectTimeGoods;
          }
        },
        searchGoods(val){
            if(val==""){
                this.getGoodsList(0);
                return;
            }
            this.$http({
                url:"search-product",
                method:"GET",
                params:{
                    name:decodeURI(val),
                    storeId:this.storeId
                }
            }).then(res=>{
                this.goodsList = res.data;
            })
        },
        getnumDetail(numId){
            this.$http({
                url:"get-numDetail",
                method:"GET",
                params:{
                    numId
                }
            }).then(res=>{
                if(res.status == 200){
                    // 成功返回后显示相关界面
                    this.nowDeskOrderInfo = res.data;
                    this.saveNowDeskOrderInfo(res.data);
                    this.$router.replace({path:'/goPay'});
                    // this.showGoPay = true;
                }
            });
        },
        getGoodsList(page=0,mescroll=null){
            this.$http({
                url:"get-product-time",
                method:"GET",
                params:{
                    storeId:this.storeId,
                    page,
                    size:this.size,
                }
            }).then(res=>{
                let goodsList = this.goodsList;
                this.goodsList = goodsList.concat(res.data.content);
                if(mescroll){
                    this.$nextTick(() => {
                        mescroll.endSuccess(res.data.content.length,!res.data.last);
                    })
                }
            })
        }
    },
     created() {
        this.nowDeskOrderInfo = this.getNowDeskOrderInfo();
        this.curSelTable = this.getNowSelDesk();
        this.orderId = this.$route.query.orderId;
        this.numId = this.$route.query.numId;
        console.log(this.orderId)
    },
    mounted(){
        console.log(this.nowDeskOrderInfo)
        let storeId = localStorage.getItem('storeId');
        this.storeId = storeId;
        this.getGoodsList();
    }
}
</script>

<style lang="scss" scoped>
@import "./selTimeGoods.scss";
</style>