<template>
    <!-- <div id="selGoods" @click.stop="" @touchstart.prevent="" @touchmove.prevent="" @touchend.prevent=""> -->
    <div id="selGoods" @click.stop="">
        <div class="top">
            <span class="arrow-back" @click.stop="$router.replace('/table')">
                <i class="iconfont icon-xiazai6"></i>
            </span>
            <div class="search">
                <input type="text" placeholder="请输入商品名称" v-model="product" />
                <!-- <span class="sou" @click.stop="search()">搜索</span> -->
            </div>
            <div class="product-box" v-if="productList.length>0" @click.stop="productList=[];product=''">
                <ul class="ul">
                    <li class="product-item" v-for="(item,index) in productList" :key="index" @click.stop="shoiceProduct(item)">
                        <span v-text="item.productName"></span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="menu-wrap">
            <div class="menu" id="menuList">
                <ul>
                    <li @click="getNowTypeGoods(item);curMenuIndex=index;" :class="curMenuIndex==index?'active':''" v-for="(item,index) in goodsList" :key="index">{{item.typeName}}</li>
                </ul>
            </div>
        </div>
        <div class="goods-wrap">
            <div class="goods" id="goodsList">
                <ul>
                    <li v-for="(item,index) in nowTypeGoodsList" :key="index"> 
                        <div class="left-cont">
                            <img v-if="item.image" :src="item.image" alt="">
                            <div class="img" v-if="!item.image">
                                套餐
                            </div>
                        </div>
                        <div class="right-cont">
                            <div class="top-area">
                                <span class="goods-name">{{item.productName}}</span>
                            </div>
                            <div class="bottom-area">
                                <span class="left goods-price"><b>￥</b>{{item.price}}</span>
                                <div class="right count" @click.stop="modifyItem('add',item)">
                                    <!-- <span class="reduce" @click="item.specId!=0?modifyItemForSpec('reduce',item):modifyItem('reduce',item)" v-if="item.count>0">
                                        <i class="iconfont icon-jian"></i>
                                    </span>-->
                                    <span class="now-goods-count">{{item.stockEnabled?item.qty:'无限'}}</span> 
                                    <span class="add" :id="item.productId?(item.typeId+'-'+item.productId):(item.typeId+'-'+item.setMealId)">
                                        <i class="iconfont icon-zengjia999"></i>
                                        <!-- <i class="iconfont icon-jian"></i> -->
                                    </span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
                <div v-if="nowTypeGoodsList.length==0" style="font-size:.32rem;padding:.5rem;box-sizing:border-box;">此分类暂无商品...</div>
            </div>
        </div>
        <div class="cart-list-wrap" v-show="showSeledGoods && nowSelectGoods.length>0" @click.stop="showSeledGoods=false;">
            <div class="inner-wrap">
                <div class="list" @click.stop="" id="seled-goods-list">
                    <ul>
                        <li v-for="(item,index) in nowSelectGoods" :key="index">
                            <div class="name left">{{item.specId!=0?`${item.productName}(${item.qty}个${item.price}元)`:item.productName}}</div>
                            <div class="price left">￥{{item.price}}</div>
                            <div class="changeNumber right">
                                <span class="reduceNumber" @click.stop="item.specId!=0?modifyItemForSpec('reduce',item):modifyItem('reduce',item)">
                                    <i class="iconfont icon-jianshao"></i>
                                </span>
                                <span class="number">{{item.count}}</span>
                                <span class="addNumber" @click.stop="modifyItem('add',item)">
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
                    <b v-if="totalCount!=0">{{totalCount}}</b>
                </span>
                <span class="total-money">￥{{totalAmount}}</span>
                <span class="go-pay" @click.stop="goSureSelGoods()">完成</span>
            </div>
        </div>
        <div class="mask" v-if="showMask" @click.stop="showMask=false;showSpecMask=false;">
            <div class="mask-cont" @click.stop="">
                <div class="spec-list" v-if="showSpecMask">
                    <ul>
                        <li v-for="(item,index) in nowGoodsSpecs" 
                        @click.stop="modifyItemForSpec('add',item)"
                        :key="index">{{item.qty}}个{{item.price}}元</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="goodAnimate"></div>
        <sureSeledGoods
        :nowSelectGoods="nowSelectGoods"
        :totalAmount="totalAmount"
        :totalCount="totalCount"
        :nowDeskOrderInfo="nowDeskOrderInfo"
        :orderId="firstOrderId"
        :isAddItem="isAddItem"
        :curSelTable="curSelTable"
        @doGetNumDetail="doGetNumDetail"
        @close="showSureSeledGoods=false"
        v-if="showSureSeledGoods"/>
    </div>
</template>

<script>
import sureSeledGoods from "./../sureSeledGoods/sureSeledGoods";
import {mapGetters,mapActions} from "vuex";

export default {
    components:{sureSeledGoods},
    data() {
        return {
            showSureSeledGoods:false,
            firstOrderId:"",
            isAddItem:false,
            nowDeskOrderInfo:{},
            product:'',//搜索商品
            productList:[],
            carDom: {}, // 购物车dom节点
            animateDom:{},
            nowTypeGoodsList:[],
            showMask:false,
            showSpecMask:false,
            curMenuIndex:0,
            goodsList:[],
            types:[],
            size:10000,
            totalCount:0,//当前所选商品数量
            totalAmount:0,
            nowSelectGoods:[],
            nowGoodsSpecs:[],
            canClick:true,
            clickCount:0,
            showSeledGoods:false,//显示已选商品
        }
    },
    watch: {
        "clickCount":function(val){
            let nowSelectGoods = this.nowSelectGoods;
            let totalAmount=0;
            let totalCount=0;
            for(let i=0;i<nowSelectGoods.length;i++){
            if(nowSelectGoods[i].specId!=0){
                totalAmount += Number(Number(nowSelectGoods[i].allPrice).toFixed(2));
                totalCount += nowSelectGoods[i].count;
            }else{
                totalAmount += Number(Number(nowSelectGoods[i].count * nowSelectGoods[i].price).toFixed(2));
                totalCount += nowSelectGoods[i].count;
            }
            }
            this.totalAmount = totalAmount.toFixed(2);
            this.totalCount = totalCount;
        },
        product(val){
            if(!val){
                this.productList=[];
                this.product=''
                return;
            }
            this.search();
        }
    },
    methods: {
        checkGoodsCount(item){
        if(item.stockEnabled){
          console.log(item);
          console.log("check--------------------check1");
          console.log(this.nowSelectGoods);
          console.log("check--------------------check2");
          console.log(this.curSelGoods);
          for(let i=0;i<this.nowSelectGoods.length;i++){
            if(item.productId == this.nowSelectGoods[i].productId){
              if(item.stockCount <= this.nowSelectGoods[i].count){
                this.$message({
                    message: "商品库存不足!",
                    showClose: true,
                    customClass: 'error'
                });
                return false;
              }
            }
          }
        }
        return true;
      },
        doGetNumDetail(){
            this.getnumDetail(this.curSelTable.deskID);
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
        //搜索并添加商品
        search(){
            if ( !(this.product.replace(/\s/g,'')) ) {
                this.productList = [];
                return;
            }
            this.$http({
              url:"products/search",
              params:{
                storeId:this.storeId,
                // q:encodeURI(this.product),
                q:this.product,
                typeId:"",
                page:0,
                size:10000
              }
            }).then((res)=>{
                for(let i=0;i<res.data.data.length;i++){
                    if(res.data.data[i].setMealEnabled){
                        res.data.data[i].productId = res.data.data[i].setMealId;
                    }
                }
                this.productList = res.data.data;
            })
            // this.$http.get('products/search?storeId='+this.storeId+'&q='+encodeURI(this.product)).then((res)=>{
            //     this.productList = res.data;
            // })
        },
        shoiceProduct(item){
            this.modifyItem("add",item);
            this.productList = [];
            this.product = '';
        },
        goSureSelGoods(){
            if(!this.totalCount){
                this.$message({
                    message: "请选择商品",
                    showClose: true,
                    customClass: 'error'
                });
                return;
            }
            this.showSureSeledGoods = true;
            // this.$emit("goSureSelGoods",{
            //     'nowSelectGoods':this.nowSelectGoods,
            //     "totalAmount":this.totalAmount,
            //     "totalCount":this.totalCount
            // });
        },
        getNowTypeGoods(item){
            this.nowTypeGoodsList = item.data;
            let that = this;
            setTimeout(()=>{
                $('#goodsList .bottom-area .add').bind('moveAnimate', function ( e, curDom ) {
                    console.log($(curDom))
                    that.animateDom.css("left", $(curDom).offset().left + "px");
                    that.animateDom.css("top", $(curDom).offset().top  + "px");
                    that.shoppingCartAnimate();
                });
            })
            
        },
        // 购物车动画
  		shoppingCartAnimate(){
            var flyElm = this.animateDom.clone();
            $('#selGoods').append(flyElm);
            flyElm.css({
            	'zIndex': 99,
                'top': this.animateDom.offset().top +'px',
                'left': this.animateDom.offset().left +'px',
            });
            flyElm.animate({
                top: this.carDom.offset().top,
                left: this.carDom.offset().left,
                width: 10,
                height: 10
            }, 'slow', function() {
                flyElm.remove();
            });
        },
        modifyItemForSpec(type,item){
            console.log("kkjkj")
            this.showMask=false;
            this.showSpecMask=false;
            if(!item.specEnabled){
                this.modifyItem("add",item);
                return;
            }
            if(item.lowerShelf){
                this.$message({
                    message: "此商品已下架!",
                    showClose: true,
                    customClass: 'error'
                });
                return;
            }
            
            this.clickCount++;
            let nowSelectGoods = this.nowSelectGoods;
            if(type == 'add'){
                let flag = false;
                let index;
                for(let i=0;i<nowSelectGoods.length;i++){
                    if(nowSelectGoods[i].productId == item.productId && nowSelectGoods[i].specId == item.specId){
                    flag = true;
                    index = i;
                    }
                }
                if(flag){
                    nowSelectGoods[index].count = nowSelectGoods[index].count + nowSelectGoods[index].qty;
                    let count = (nowSelectGoods[index].count / nowSelectGoods[index].qty).toFixed(0);
                    console.log(count)
                    nowSelectGoods[index].allPrice = (count * nowSelectGoods[index].price).toFixed(2);
                    console.log(nowSelectGoods[index].allPrice)
                }else{
                    item.count += item.qty;
                    let count = (item.count / item.qty).toFixed(0);
                    item.allPrice = (count * item.price).toFixed(2);
                    nowSelectGoods.push(item);
            }
            this.nowSelectGoods = nowSelectGoods;
            }else{
                let flag = false;
                let index;
                console.log(item.productId);
                for(let i=0;i<nowSelectGoods.length;i++){
                    if(nowSelectGoods[i].productId == item.productId && nowSelectGoods[i].specId == item.specId){
                    flag = true;
                    index = i;
                    }
                }
                console.log(index);
                if(flag){
                        nowSelectGoods[index].count -= nowSelectGoods[index].qty;
                        let count = (nowSelectGoods[index].count / nowSelectGoods[index].qty).toFixed(0);
                        nowSelectGoods[index].allPrice = (count * nowSelectGoods[index].price).toFixed(2);
                        if(nowSelectGoods[index].count <= 0){
                            nowSelectGoods.splice(index,1);
                        }
                }
                this.nowSelectGoods = nowSelectGoods;
            }
            // console.log(this.goodsList)
            // for(let i=0;i<this.nowSelectGoods.length;i++){
            //     console.log("j")
            //     for(let j=0;j<this.goodsList.length;j++){
            //         for(let x=0;x<this.goodsList[j].data.length;x++){
            //             if(this.nowSelectGoods[i].productId == this.goodsList[j].data[x].productId){
            //                 this.goodsList[j].data[x].count = this.nowSelectGoods[i].count;
            //                 console.log(this.goodsList[j].data[x].count)
            //             }else{
            //                 this.goodsList[j].data[x].count = 0;
            //             }
            //         }
            //     }
            // }
            // console.log(this.goodsList)
        },
        getSpecs(item){
            if(!this.canClick){
                return;
            }
            this.canClick = false;
            this.$http({
                url:"get-spec",
                method:"GET",
                params:{
                    productId:item.productId
                }
            }).then(res=>{
                this.canClick = true;
                let specs = res.data.data;
                
                for(let i=0;i<specs.length;i++){
                    specs[i].count = 0;
                    specs[i].allPrice = specs[i].price;
                    if(specs[i].setMealEnabled){
                        specs[i].productId = specs[i].setMealId;
                    }
                }
                if(specs.length == 1){
                    // 加入库存限制
                    if(item.stockEnabled){
                        if(item.qty<1){
                            this.$message({
                                message: "商品库存不足!",
                                showClose: true,
                                customClass: 'error',
                            });
                            return;
                        }
                    }
                    // 加入库存限制end
                    this.modifyItem("add",specs[0]);
                    return;
                }
                this.nowGoodsSpecs = specs;
                this.showMask = true;
                this.showSpecMask = true;
            }).catch(err=>{
                this.canClick = true;
            });
        },
        modifyItem(type,item){
          if(type == 'add'){
            if(!this.checkGoodsCount(item)){
              return;
            }
          }
          if(item.lowerShelf){
            this.$message({
                message: "此商品已下架!",
                showClose: true,
                customClass: 'error'
            });
            return;
          }
          this.clickCount++;
          let nowSelectGoods = this.nowSelectGoods;
          if(type == 'add'){
            if(item.specEnabled){
              this.getSpecs(item);
              return;
            }
            if(item.productId){
                $('#'+item.typeId+'-'+item.productId).trigger('moveAnimate', $('#'+item.typeId+'-'+item.productId));
            }else{
                $('#'+item.typeId+'-'+item.setMealId).trigger('moveAnimate', $('#'+item.typeId+'-'+item.setMealId));
            }
            console.log(item);
            let flag = false;
            let index;
            for(let i=0;i<nowSelectGoods.length;i++){
              if(nowSelectGoods[i].productId == item.productId && nowSelectGoods[i].specEnabled == item.specEnabled){
            //   if(nowSelectGoods[i].productId == item.productId){
                flag = true;
                index = i;
              }
            }
            if(flag){
                nowSelectGoods[index].count++;
            }else{
                item.count++;
                nowSelectGoods.push(item);
            }
            this.nowSelectGoods = nowSelectGoods;
            console.log(item)
          }else{
            let flag = false;
            let index;
            console.log(item.productId);
            for(let i=0;i<nowSelectGoods.length;i++){
              if(nowSelectGoods[i].productId == item.productId  && nowSelectGoods[i].specEnabled == item.specEnabled){
                flag = true;
                index = i;
              }
            }
            console.log(index);
            if(flag){
                nowSelectGoods[index].count--;
                if(nowSelectGoods[index].count <= 0){
                  nowSelectGoods.splice(index,1);
                }
            }
            this.nowSelectGoods = nowSelectGoods;
          }
        //   console.log(this.nowSelectGoods)
        // console.log(this.nowSelectGoods)
        //   for(let i=0;i<this.nowSelectGoods.length;i++){
        //       console.log("j")
        //       for(let j=0;j<this.goodsList.length;j++){
        //           for(let x=0;x<this.goodsList[j].data.length;x++){
        //             if(this.nowSelectGoods[i].productId == this.goodsList[j].data[x].productId){
        //                 this.goodsList[j].data[x].count = this.nowSelectGoods[i].count;
        //                 console.log(this.goodsList[j].data[x].count)
        //             }else{
        //                 this.goodsList[j].data[x].count = 0;
        //             }
        //           }
        //       }
        //   }
        //   console.log(this.goodsList)
        },
        // 获取商品
        getGoods(page=0,typeId){
          this.$http({
            url:'get-all',
            method:'GET',
            params:{
              storeId:this.storeId,
            //   page,
            //   size:this.size,
            //   typeId
            }
          }).then(res=>{
            if(res.data.data){
              let goodsList = res.data.data;
              for(let i=0;i<goodsList.length;i++){
                  for(let j=0;j<goodsList[i].data.length;j++){
                      goodsList[i].data[j].count = 0;
                      goodsList[i].data[j].stockCount = goodsList[i].data[j].qty;
                    if(goodsList[i].data[j].setMealEnabled){
                        goodsList[i].data[j].productId = goodsList[i].data[j].setMealId;
                    }
                  }
                  
              }
              this.goodsList = goodsList;
              this.nowTypeGoodsList = goodsList[0].data;
            //   this.totalPage = res.data.totalPage;
            //   this.totalElements = res.data.totalElements;
            //   this.canChangePage = true;
                let that = this;
                setTimeout(()=>{
                    $('#goodsList .bottom-area .add').bind('moveAnimate', function ( e, curDom ) {
                        that.animateDom.css("left", $(curDom).offset().left + "px");
                        that.animateDom.css("top", $(curDom).offset().top  + "px");
                        that.shoppingCartAnimate();
                    });
                })
                
            }else{
              this.goodsList = [];
              this.nowTypeGoodsList = [];
            //   this.canChangePage = true;
            }
          })
        },
        // 获取商品分类
        getType(){
          this.$http({
            url:"get-type",
            method:"GET",
            params:{
              storeId:this.storeId
            }
          }).then(res=>{
            if(res.data.code == 200){
              this.types = res.data.data;
              let types = res.data.data;
              if(types.length){
                this.getGoods(0,types[0].id);
              }else{
                this.getGoods(0,"");
              }
            }
          })
        },
        ...mapGetters(['getNowDeskOrderInfo',"getNowSelDesk","getIsAddItem","getFirstOrderId"]),
        ...mapActions(["saveNowDeskOrderInfo"])
    },
    created() {
        this.nowDeskOrderInfo = this.getNowDeskOrderInfo();
        this.firstOrderId = this.getFirstOrderId();
        this.curSelTable = this.getNowSelDesk();
        this.isAddItem = this.getIsAddItem();
    },
    mounted() {
        let storeId = localStorage.getItem('storeId');
        this.storeId = storeId;
        this.getType();
        this.$nextTick(()=>{
            this.$createScroll('goodsList');
            this.$createScroll('menuList');
            this.$createScroll('seled-goods-list');
        });
        this.animateDom = $('.goodAnimate');
        this.carDom = $('.cart .che .icon-cart-copy-copy');
        if(this.isAddItem){
            if(!this.nowDeskOrderInfo || !this.nowDeskOrderInfo.res){
                this.$router.replace("/table");
            }
        }
        if(!this.curSelTable || !this.curSelTable.deskID){
            this.$router.replace("/table");
        }
        console.log(this.isAddItem)
    },
}
</script>

<style scoped lang="scss">
@import "./selGoods.scss"
</style>
