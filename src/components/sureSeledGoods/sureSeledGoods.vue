<template>
    <div id="sureSeledGoods">
        <!-- <div class="only-arrow-back">返回</div> -->
        <div class="seled-goods-emp">
            <div class="set-item">
                <span class="left-tit">点单员工</span>
                <div class="right-cont">
                    <span class="cont">{{employeeName}}</span>
                    <!-- <i class="iconfont icon-arrow-right-copy"></i> -->
                </div>
            </div>
        </div>
        <div class="seled-goods-wrap">
            <div class="tit">
                <span style="text-align:left;">商品名</span>
                <span>数量</span>
                <span style="text-align:right;">价格</span>
            </div>
            <div class="goods-cont" id="goodsCount">
                <ul>
                    <li class="item" v-for="(item,index) in nowSelectGoods" :key="index">
                        <span class="p-name" style="text-align:left;">{{item.productName}}</span>
                        <span>{{item.specEnabled?`${item.allPrice}元x${item.count}`:`${item.price}元x${item.count}`}}</span>
                        <span style="text-align:right;"><b>{{item.specEnabled?item.allPrice:((item.price*item.count).toFixed(2))}}</b>元</span>
                    </li>
                </ul>
                
            </div>
        </div>
        <div class="cart">
            <div class="cart-and-money">
                <span class="total-count">共{{totalCount}}件商品</span>
                <span class="total-money">合计:{{totalAmount}}元</span>
                <span class="go-pay" @click.stop="sureThisOrder()">确定点单</span>
                <span class="close" @click.stop="$emit('close')">返回</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['nowSelectGoods','totalAmount','totalCount','orderId','curSelTable','isAddItem','nowDeskOrderInfo'],
    data() {
        return {
            employeeName:"",
            canClick:true,
        }
    },
    methods: {
        sureThisOrder(){
          console.log(this.nowSelectGoods);
          let goodsArr = []
          if(!this.nowSelectGoods.length){
            this.$message({
                message: "请选择商品",
                customClass: 'error'
            });
            return;
          }
          if(!this.canClick){
            return;
          }
          this.canClick = false;
          let reqlist = [];

          for(let i=0;i<this.nowSelectGoods.length;i++){
            let obj = {
                productCount:this.nowSelectGoods[i].count,
                spec:this.nowSelectGoods[i].qty,
            }
            if(this.nowSelectGoods[i].setMealEnabled){
              obj = Object.assign(obj,{
                  productId:"",
                  setMealId:this.nowSelectGoods[i].setMealId,
              });
            }else{
              obj = Object.assign(obj,{
                  productId:this.nowSelectGoods[i].productId,
                  setMealId:0,
              });
            }
            reqlist.push(obj);

            // 
            let goodObj = {
              productName:this.nowSelectGoods[i].productName,
              quantity:this.nowSelectGoods[i].count,
              price:this.nowSelectGoods[i].specEnabled?Number(this.nowSelectGoods[i].allPrice):Number((Number(this.nowSelectGoods[i].price)*Number(this.nowSelectGoods[i].count)).toFixed(2)),
            };
            goodsArr.push(goodObj);
            // 

          }
          
          let data;
          let url="add-item";
          data = {
            numId:this.curSelTable.deskID,
            storeId:localStorage.getItem("storeId"),
            createName:localStorage.getItem("employeeName"),
            createMobile:localStorage.getItem("phone"),
            reqList:reqlist,
          }
          // 根据是否是新增消费来判断应该调用什么接口
          if(this.isAddItem && this.nowDeskOrderInfo.res.orderId){
            url="add-item";
            data = Object.assign(data,{
              orderId:this.nowDeskOrderInfo.res.orderId
            });
          }else{
            // url="create-orders";//
            // url="orders/add-item";
            data = Object.assign(data,{
              orderId:this.orderId
            });
          }
            this.$http({
              url,
              method:"POST",
              data
            }).then(res=>{
              this.canClick = true;
              if(this.isAddItem && this.nowDeskOrderInfo.res.orderId){
                  if(res.data.result.code == 400){
                    this.$message({
                        message: res.data.result.msg,
                        customClass: 'error',
                    });
                    this.canClick = true;
                    return;
                  }
                  this.$emit("doGetNumDetail",{"deskId":this.curSelTable.deskID});
              }else{
                if(res.status == 200){
                  if(res.data.result.code == 400){
                    this.$message({
                        message: res.data.result.msg,
                        customClass: 'error'
                    });
                    this.canClick = true;
                    return;
                  }
                  this.$emit("doGetNumDetail",{"deskId":this.curSelTable.deskID});
                }
              }
            }).catch(err=>{
              this.canClick = true;
            });
        },
    },
    mounted() {
        this.employeeName = localStorage.getItem("employeeName");
        this.$nextTick(()=>{
            this.$createScroll('goodsCount');
        });
        // console.log(this.nowDeskOrderInfo.res.orderId);
        // console.log(this.isAddItem);
    },
}
</script>


<style scoped lang="scss">
@import "./sureSeledGoods.scss"
</style>
