<template>
	<div class="check">
        <div class="scrollBox" id="scrollBox">
            <ul class="goodList" @click.stop="closeNumberBox">
                <li class="goodLi" v-for="(item,idx) in inventoryList">
                    <div class="goodLiBox clearfix">
                        <div class="goodName" v-text="item.productName"></div>
                        <div class="accurateQuantity left" v-text="'应有数量：'+item.counterQuantity"></div>
                        <div class="checkQuantity left clearfix">
                            <span class="left">实际数量：</span>
                            <span class="left input" v-text="item.checkQuantity" @click.stop="openNumberBox(item)"></span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="total clearfix">
            <!-- <div class="left name">总计：</div> -->
            <button class="right" @click="willGoCheck">确定</button>
        </div>

        <!-- 确认盘点弹出框 -->
        <!-- <div class="checkConfirmMask" :style="{display:(showCheckConfirm?'block':'none')}" @click="showCheckConfirm=false">
            <div class="checkConfirm position-middle-center" @click.stop="">
                <p class="tipText">确认盘点？</p>
                <div class="btnGroup">
                    <button type="button" class="cancle" @click="showCheckConfirm=false">取消</button>
                    <button type="button" @click="saveCheck">确认</button>
                </div>
            </div>
        </div> -->
        <div class="checkResult checkConfirmMask" :style="{display:(showCheckConfirm?'block':'none')}" @click="showCheckConfirm=false">
            <div class="bigBox position-middle-center" @click.stop="">
                <div class="top">
                    请在收银端走点单流程修正
                </div>
                <div class="box" id="box">
                    <ul class="goodList" v-if="checkInventoryList.length">
                        <li class="goodLi" v-for="(item,idx) in checkInventoryList">
                            <div class="goodLiBox clearfix">
                                <div class="goodName" v-text="item.productName"></div>
                                <div class="accurateQuantity left" v-text="'应有数量：'+item.accurateSingleQty"></div>
                                <div class="checkQuantity left clearfix">
                                    <span class="left">实际数量：</span>
                                    <span class="left input" v-text="item.checkSingleQty"></span>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <p v-else style="height:50px;line-height:50px;text-align:center;">暂无商品!</p>
                </div>
            </div>
        </div>
        <div class="numberMask" id="numberMask" @click.stop="">
            <div class="inputBox">
                <div class="left" v-text="goodNumber"></div>
                <i class="right iconfont icon-jiantou1" @click="delNumber()"></i>
            </div>
            <div class="numberBox clearfix">
                <div class="number" @click="clickNum('1')">1</div>
                <div class="number" @click="clickNum('2')">2</div>
                <div class="number" @click="clickNum('3')">3</div>
                <div class="number" @click="clickNum('4')">4</div>
                <div class="number" @click="clickNum('5')">5</div>
                <div class="number" @click="clickNum('6')">6</div>
                <div class="number" @click="clickNum('7')">7</div>
                <div class="number" @click="clickNum('8')">8</div>
                <div class="number" @click="clickNum('9')">9</div>
                <div class="number" @click="clickNum('-')">-</div>
                <div class="number" @click="clickNum('0')">0</div>
                <div class="number" @click="saveNumber()">保存</div>
            </div>
        </div>
	</div>
</template>

<script>
export default {
  	data(){
  		return{
            curStoreId: '',
            inventoryList: [],
            showCheckConfirm: false, // 确认盘点
            goodNumber: '', //数字键盘输入商品数量
            curGood: {}, // 当前点击商品
            preventBtn:true,
            billData:{
                kind:0,
                notes:''
            },
            checkInventoryList:[],
            willCheckBody:{}
  		}
  	},
    methods:{
        openNumberBox: function ( item ) {
            // console.log(item)
            $('#numberMask').css('bottom', '0');
            this.curGood = item;
            this.goodNumber = item.checkQuantity+'';
        },
        closeNumberBox: function () {
            $('#numberMask').css('bottom', '-6rem');
        },
        clickNum: function ( num ) {
            if ( !this.goodNumber && num == '0' ) {
                this.goodNumber = num; 
                return;
            }
            if ( this.goodNumber == '-' && num == '0')  {
                return;
            }
            if ( this.goodNumber && num == '-' ) {
                return;
            }
            if ( this.goodNumber.length >= 6 ) {
                return;
            }
            this.goodNumber += num;
        },
        delNumber: function () {
            this.goodNumber = this.goodNumber.substring(0, this.goodNumber.length-1);
        },
        saveNumber: function () {
            if ( parseInt(this.goodNumber)<0 ) {
                return;
            }
            this.curGood.checkQuantity = parseInt(this.goodNumber);
            this.closeNumberBox();
        },

        
        // 点击盘点
        willGoCheck(){
            this.checkInventoryList = [];
            this.billData={notes:'',kind:0}
            let body = {
                id:this.$uuid(),
                storeId:this.curStoreId,
                notes:'',
                singleProfit:0,//盘盈总个数量
                wholeProfit:0,//盘盈总件数量
                singleLosses:0,//盘亏总个数量
                wholeLosses:0,//盘亏总件数量
                source:'COUNTER',
                products:[]
            };
            for (var i = 0; i < this.inventoryList.length; i++) {
                // if ( !/^-?\d+$/.test(this.inventoryList[i].checkQuantity) ) {
                //     this.$message({
                //         showClose: true,
                //         message: '请输入正确的  '+this.inventoryList[i].productName+'  商品个数',
                //         type: 'error'
                //     })
                //     return;
                // }

                let newProducts = {
                    productId:this.inventoryList[i].productId,
                    isKind:false,
                    productName:this.inventoryList[i].productName,
                    stockQuantityRatio:this.inventoryList[i].stockQuantityRatio,
                    checkSingleQty:parseInt(this.inventoryList[i].checkQuantity),//实际总个数量
                    accurateSingleQty:this.inventoryList[i].counterQuantity,//应有个数
                };

                if(this.inventoryList[i].checkQuantity>=this.inventoryList[i].counterQuantity){
                    //实际比应有多=>盘盈总个数量
                    body.singleProfit += (this.inventoryList[i].checkQuantity-this.inventoryList[i].counterQuantity);
                }else {
                    //实际比应有少=>盘亏总个数量
                    body.singleLosses += (this.inventoryList[i].counterQuantity-this.inventoryList[i].checkQuantity);
                };
                if(this.inventoryList[i].checkQuantity!=this.inventoryList[i].counterQuantity){
                    this.billData.kind+=1;
                    this.checkInventoryList.push(newProducts);
                    newProducts.isKind = true;
                }
                if(newProducts.isKind){
                    body.products.unshift(newProducts);
                }else{
                    body.products.push(newProducts);
                }
            }
            body.kind=this.billData.kind;//种类
            this.willCheckBody = body;
            
            this.showCheckConfirm=true;
            this.$createScroll('box');
        },
        //发送盘点数据
        saveCheck(){
            if ( !this.preventBtn ) {
                return;
            }
            this.preventBtn = false;
            this.$http.post('take-stock',this.willCheckBody).then((res)=>{
                this.$message({
                    showClose: true,
                    message: "盘点成功！",
                    customClass: 'success'
                })
                this.showCheckConfirm=false;
                this.getInventoryList();
                setTimeout(()=>{
                    this.preventBtn = true;
                },200)
            }).catch((err)=>{
                setTimeout(()=>{
                    this.preventBtn = true;
                },200)
            })
        },
        openType: function ( idx ) {
            if ( $($('.typeLi')[idx]).hasClass("open") ) {
                $($('.typeLi')[idx]).removeClass("open");
                $($('.typeLi')[idx]).addClass("close");

                $($('.typeName i')[idx]).removeClass('icon-arrow-down');
                $($('.typeName i')[idx]).addClass('icon-jiantou');
            } else {
                $($('.typeLi')[idx]).removeClass("close");
                $($('.typeLi')[idx]).addClass("open");

                $($('.typeName i')[idx]).removeClass('icon-jiantou');
                $($('.typeName i')[idx]).addClass('icon-arrow-down');
            }
            
        },
        getInventoryList: function () {
            this.$http.get('/counter/products?storeId='+this.curStoreId).then((res)=>{
                for (var j = 0, len2 = res.data.length; j < len2; j++) {
                    res.data[j].checkQuantity = res.data[j].counterQuantity;
                }
                this.inventoryList = res.data;
            })
        }
    },
    created: function () {
        m$.setTitle('商品盘点');
        this.curStoreId = localStorage.getItem('storeId');
        this.$http.get('check-work?storeId=' + this.curStoreId).then((res)=>{
            this.getInventoryList();
        }).catch(( err )=>{
            this.$message({
                message: "无盘点权限！",
                customClass: 'error'
            })
            this.$router.replace('index');
        });
    },
  	mounted(){
        this.$createScroll('scrollBox');
        
  	}
}
</script>
<style lang="scss" scoped>
    @import "../../../static/css/common.scss";
    @import "check.scss";
</style>
