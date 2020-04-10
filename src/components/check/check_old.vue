<template>
	<div class="check" @click="closeNumberBox">
        <div class="scrollBox" id="scrollBox">
            <ul class="typeList" id="typeList">
                <li class="typeLi close" v-for="(item,idx) in inventoryList">
                    <div class="typeName clearfix" @click="openType(idx)">
                        <div class="name left" v-text="item.typeName"></div>
                        <i class="right iconfont icon-jiantou"></i>
                    </div>
                    <ul class="goodList">
                        <li class="goodLi" v-for="(good,idx) in item.products">
                            <div class="goodLiBox clearfix">
                                <div class="goodName left" v-text="good.name"></div>
                                <div class="sholdPrice left clearfix">
                                    <span class="left">应补金额：</span>
                                    <span class="right" v-text="good.checkQuantity>good.quantity?'￥+'+((parseInt(good.checkQuantity)-parseInt(good.quantity))*good.salePrice).toFixed(2):'￥'+((parseInt(good.checkQuantity)-parseInt(good.quantity))*good.salePrice).toFixed(2)"></span>
                                </div>
                                <div class="accurateQuantity left" v-text="'应有数量：'+good.quantity"></div>
                                <div class="checkQuantity left clearfix">
                                    <span class="left">实际数量：</span>
                                    <span class="left input" v-text="good.checkQuantity" @click.stop="openNumberBox(good)"></span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <div class="total clearfix">
            <!-- <div class="left name">总计：</div> -->
            <button class="right" @click="showCheckConfirm=true">确定</button>
        </div>

        <!-- 确认盘点弹出框 -->
        <div class="checkConfirmMask" :style="{display:(showCheckConfirm?'block':'none')}" @click="showCheckConfirm=false">
            <div class="checkConfirm position-middle-center" @click.stop="">
                <p class="tipText">确认盘点？</p>
                <div class="btnGroup">
                    <button type="button" class="cancle" @click="showCheckConfirm=false">取消</button>
                    <button type="button" @click="saveCheck">确认</button>
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
  		}
  	},
    methods:{
        openNumberBox: function ( item ) {
            $('#numberMask').css('bottom', '0');
            this.curGood = item;
            this.goodNumber = item.checkQuantity+'';
        },
        closeNumberBox: function () {
            $('#numberMask').css('bottom', '-6rem');
        },
        clickNum: function ( num ) {
            if ( !this.goodNumber && num == '0' ) {
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
            if ( !parseInt(this.goodNumber) ) {
                return;
            }
            this.curGood.checkQuantity = this.goodNumber;
            this.closeNumberBox();
        },

        // 确认盘点
        saveCheck: function () {
            let goodCheckArr = [];
            for (let i = 0, len = this.inventoryList.length; i < len; i++) {
                for (var j = 0, len2 = this.inventoryList[i].products.length; j < len2; j++) {
                    goodCheckArr.push({
                        id: this.$uuid(),
                        productId: this.inventoryList[i].products[j].id,
                        name: this.inventoryList[i].products[j].name,
                        accurateQuantity: this.inventoryList[i].products[j].quantity,
                        checkQuantity: parseInt(this.inventoryList[i].products[j].checkQuantity),
                        errorQuantity: this.inventoryList[i].products[j].checkQuantity - this.inventoryList[i].products[j].quantity
                    });
                }
            }
            this.$http.put(this.curStoreId+'/inventory-checks', goodCheckArr).then((res)=>{
                this.getInventoryList();
                this.showCheckConfirm = false;
                this.$message({
                    message: "盘点成功！",
                    customClass: 'success'
                })
            });
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
            this.$http.get('inventories?storeId=' + this.curStoreId).then((res)=>{
                for (let i = 0, len = res.data.length; i < len; i++) {
                    for (var j = 0, len2 = res.data[i].products.length; j < len2; j++) {
                        res.data[i].products[j].checkQuantity = res.data[i].products[j].quantity;
                    }
                }
                this.inventoryList = res.data;
            });
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
