<template>
    <div id="goPay">
    <div class="go-pay-wrap">
        <div class="set-item">
            <span class="left-tit">开单时间</span>
            <div class="right-cont">
                <span class="cont">{{new Date(nowDeskOrderInfo.numTrans.beginTime).Format('yyyy-MM-dd hh:mm:ss')}}</span>
                <!-- <i class="iconfont icon-arrow-right-copy"></i> -->
            </div>
        </div>
        <div class="line"></div>
        <div class="set-item">
            <span class="left-tit">入座时长</span>
            <div class="right-cont">
                <span class="cont">{{nowDeskOrderInfo.numTrans.inTime}}</span>
                <!-- <i class="iconfont icon-arrow-right-copy"></i> -->
            </div>
        </div>
        <div class="line"></div>
        <div class="set-item">
            <span class="left-tit">顾客人数</span>
            <div class="right-cont">
                <span class="cont">{{nowDeskOrderInfo.numTrans.people}}人</span>
                <!-- <i class="iconfont icon-arrow-right-copy"></i> -->
            </div>
        </div>
        <div class="line" v-if="nowDeskOrderInfo.numTrans.bookName"></div>
        <div class="set-item" v-if="nowDeskOrderInfo.numTrans.bookName">
            <span class="left-tit">预定人</span>
            <div class="right-cont">
                <span class="cont">{{nowDeskOrderInfo.numTrans.bookName}}</span>
                <!-- <i class="iconfont icon-arrow-right-copy"></i> -->
            </div>
        </div>
        <div class="line" v-if="nowDeskOrderInfo.numTrans.bookMobile"></div>
        <div class="set-item" v-if="nowDeskOrderInfo.numTrans.bookMobile">
            <span class="left-tit">预定电话</span>
            <div class="right-cont">
                <span class="cont">{{nowDeskOrderInfo.numTrans.bookMobile}}</span>
                <!-- <i class="iconfont icon-arrow-right-copy"></i> -->
            </div>
        </div>
        <div class="line"></div>
        <div class="set-item">
            <span class="left-tit">计费规则</span>
            <div class="right-cont">
                <span class="cont">{{nowDeskOrderInfo.numTrans.rulesName}}</span>
                <!-- <i class="iconfont icon-arrow-right-copy"></i> -->
            </div>
        </div>
        <div class="line"></div>
        <!-- <div class="set-item" @click.stop="showBindVip=true">
            <span class="left-tit">会员绑定</span>
            <div class="right-cont">
                <span class="cont">{{nowDeskOrderInfo.numTrans.empName}}</span>
                <i class="iconfont icon-arrow-right-copy"></i>
            </div>
        </div>
        <div class="line"></div>
        <div class="set-item" @click.stop="showBindVip=true">
            <span class="left-tit">手动优惠</span>
            <div class="right-cont">
                <span class="cont">{{nowDeskOrderInfo.numTrans.empName}}</span>
                <i class="iconfont icon-arrow-right-copy"></i>
            </div>
        </div>
        <div class="line"></div> -->
        <div class="set-item"  @click.stop="showModifyDeskInfo()">
            <span class="left-tit"></span>
            <div class="right-cont">
                <i class="iconfont icon-xiugai" style="font-size:.45rem;color:#999;"></i>
                <span class="cont" >修改</span>
            </div>
        </div>
        <div class="span-panle"></div>
        <div class="set-item" v-if="nowDeskOrderInfo.res.historyItemRes" @click.stop="showOldGoods=!showOldGoods">
            <span class="left-tit">历史商品清单</span>
            <div class="right-cont">
                <!-- <span class="cont"><b style="font-size:.34rem;color:red;">{{(nowDeskOrderInfo.res.totalProductAmount).toFixed(2)}}</b>元</span> -->
                <i :class="showOldGoods?'iconfont icon-arrow-right-copy arrow-bottom':'iconfont icon-arrow-right-copy'"></i>
            </div>
        </div>
        <div :class="showOldGoods?'seled-goods-wrap show':'seled-goods-wrap'">
            <div class="tit">
                <span style="text-align:left;width:30%;">名称</span>
                <span>数量</span>
                <span>金额</span>
                <span style="text-align:center;width:30%;">时间</span>
            </div>
            <div class="goods-cont" id="goodsCount">
                <ul>
                    <li class="item" v-for="(item,index) in nowDeskOrderInfo.res.historyItemRes" :key="index">
                        <span style="text-align:left;width:30%;">{{item.productName}}</span>
                        <span>{{item.count}}</span>
                        <span>{{item.amount.toFixed(2)}}</span>
                        <span style="text-align:center;width:30%;">{{new Date(item.addTime).Format("hh:mm:ss")}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="span-panle" v-if="nowDeskOrderInfo.res.historyProductTimes"></div>
        <div class="set-item" v-if="isTimeGoodsEnable&&nowDeskOrderInfo.res.historyProductTimes" @click.stop="showOldGoodsForTime=!showOldGoodsForTime">
            <span class="left-tit">历史计时商品清单</span>
            <div class="right-cont">
                <!-- <span class="cont"><b style="font-size:.34rem;color:red;">{{(nowDeskOrderInfo.res.totalProductAmount).toFixed(2)}}</b>元</span> -->
                <i :class="showOldGoodsForTime?'iconfont icon-arrow-right-copy arrow-bottom':'iconfont icon-arrow-right-copy'"></i>
            </div>
        </div>
        <div :class="showOldGoodsForTime?'seled-goods-wrap show':'seled-goods-wrap'">
            <div class="tit">
                <span style="text-align:left;width:20%;">名称</span>
                <span style="text-align:left;width:30%;">规则名</span>
                <span style="text-align:left;width:20%;">金额</span>
                <span style="text-align:center;width:30%;">时间</span>
            </div>
            <div class="goods-cont" id="goodsCount">
                <ul>
                    <li class="item" v-for="(item,index) in nowDeskOrderInfo.res.historyProductTimes" :key="index">
                        <span style="text-align:left;width:20%;">{{item.productTimeName}}</span>
                        <span style="text-align:left;width:30%;">{{item.ruleName}}</span>
                        <span style="text-align:left;width:20%;">{{item.amount.toFixed(2)}}</span>
                        <span style="text-align:center;width:30%;">{{new Date(item.addTime).Format("hh:mm:ss")}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="span-panle" v-if="nowDeskOrderInfo.res.historyItemRes"></div>
        <div class="set-item" @click.stop="showGoods=!showGoods">
            <span class="left-tit">商品消费</span>
            <div class="right-cont">
                <span class="cont"><b style="font-size:.34rem;color:red;">{{(nowDeskOrderInfo.res.totalProductAmount).toFixed(2)}}</b>元</span>
                <i :class="showGoods?'iconfont icon-arrow-right-copy arrow-bottom':'iconfont icon-arrow-right-copy'"></i>
            </div>
        </div>
        <div :class="showGoods?'seled-goods-wrap show':'seled-goods-wrap'">
            <div class="tit">
                <span style="text-align:left;width:30%;">名称</span>
                <span>数量</span>
                <span>金额</span>
                <span style="text-align:center;width:30%;">时间</span>
            </div>
            <div class="goods-cont" id="goodsCount">
                <ul>
                    <li class="item" v-for="(item,index) in nowDeskOrderInfo.res.itemRes" :key="index">
                        <span style="text-align:left;width:30%;">{{item.productName}}</span>
                        <span>{{item.count}}</span>
                        <span>{{item.amount.toFixed(2)}}</span>
                        <span @click.stop="modifyGoodsItem(item)" style="text-align:center;width:30%;">{{new Date(item.addTime).Format("hh:mm:ss")}}<i class="iconfont icon-xiugai" style="font-size:.34rem;color:#999;"></i></span>
                    </li>
                </ul>
            </div>
        </div>
        <!--  -->
        <div class="set-item" v-if="isTimeGoodsEnable" @click.stop="showTimeGoods=!showTimeGoods">
            <span class="left-tit">计时商品消费<i style="font-size:.2rem;color:red;">(红字为已结束)</i></span>
            <div class="right-cont">
                <span class="cont"><b style="font-size:.34rem;color:red;">{{(nowDeskOrderInfo.res.totalHistoryProductTime).toFixed(2)}}</b>元</span>
                <i :class="showTimeGoods?'iconfont icon-arrow-right-copy arrow-bottom':'iconfont icon-arrow-right-copy'"></i>
            </div>
        </div>
        <div :class="showTimeGoods?'seled-goods-wrap show':'seled-goods-wrap'" v-if="isTimeGoodsEnable">
            <div class="tit">
                <span style="text-align:left;width:25%;">名称</span>
                <span style="text-align:left;width:25%;">规则</span>
                <span style="text-align:left;width:20%;">金额</span>
                <span style="text-align:center;width:30%;">时间</span>
            </div>
            <div class="goods-cont" id="goodsCount">
                <ul>
                    <li class="item" v-for="(item,index) in nowDeskOrderInfo.res.productTimeItems" :style="item.stopEnabled?'color:#e66a6a;':''" :key="index">
                        <span style="text-align:left;width:25%;">{{item.productTimeName}}</span>
                        <span style="text-align:left;width:25%;">{{item.ruleName}}</span>
                        <span style="text-align:left;width:20%;">{{item.amount.toFixed(2)}}</span>
                        <span @click.stop="modifyGoodsItemForTime(item)" style="text-align:center;width:30%;">{{new Date(item.addTime).Format("hh:mm:ss")}}<i class="iconfont icon-xiugai" style="font-size:.34rem;color:#999;"></i></span>
                    </li>
                </ul>
            </div>
        </div>
        <!--  -->
        <div class="line" v-if="!showTimeInfo"></div>
        <div class="set-item" @click.stop="showTimeInfo=!showTimeInfo">
            <span class="left-tit">计时记录</span>
            <div class="right-cont">
                <!-- <span class="cont"><b style="font-size:.34rem;color:red;">{{nowDeskOrderInfo.res.totalRoomAmount.toFixed(2)}}</b>元</span> -->
                <i :class="showTimeInfo?'iconfont icon-arrow-right-copy arrow-bottom':'iconfont icon-arrow-right-copy'"></i>
            </div>
        </div>
        <div :class="showTimeInfo?'room-amount-info show':'room-amount-info'">
            <table class="room-info">
                <tr>
                    <th style="width:40%;">台桌名</th>
                    <th style="width:20%;">入座时长</th>
                    <th style="width:40%;">计费规则</th>
                    <!-- <th style="width:20%;">包间费</th> -->
                </tr>
                <tr v-for="(item,index) in nowDeskOrderInfo.suspendNumTransactions" :key="index">
                    <td style="width:40%;">{{nowDeskOrderInfo.numTrans.partitionName}}-{{nowDeskOrderInfo.numTrans.numName}}</td>
                    <td style="width:20%;">{{item.hour}}时{{item.min}}分</td>
                    <td style="width:40%;">{{item.rulesName}}</td>
                    <!-- <td style="width:20%;">{{item.amount.toFixed(2)}}元</td> -->
                </tr>
            </table>
        </div>
        <!--  -->
        <div class="line" v-if="!showRoomAmountInfo"></div>
        <div class="set-item" @click.stop="showRoomAmountInfo=!showRoomAmountInfo">
            <span class="left-tit">包间消费</span>
            <div class="right-cont">
                <span class="cont"><b style="font-size:.34rem;color:red;">{{nowDeskOrderInfo.res.totalRoomAmount.toFixed(2)}}</b>元</span>
                <i :class="showRoomAmountInfo?'iconfont icon-arrow-right-copy arrow-bottom':'iconfont icon-arrow-right-copy'"></i>
            </div>
        </div>
        <div :class="showRoomAmountInfo?'room-amount-info show':'room-amount-info'">
            <!-- <table class="room-info">
                <tr>
                    <th style="width:30%;">台桌名</th>
                    <th style="width:20%;">入座时长</th>
                    <th style="width:30%;">计费规则</th>
                    <th style="width:20%;">包间费</th>
                </tr>
                <tr v-for="(item,index) in nowDeskOrderInfo.suspendNumTransactions" :key="index">
                    <td style="width:30%;">{{nowDeskOrderInfo.numTrans.partitionName}}-{{nowDeskOrderInfo.numTrans.numName}}</td>
                    <td style="width:20%;">{{item.hour}}时{{item.min}}分</td>
                    <td style="width:30%;">{{item.rulesName}}</td>
                    <td style="width:20%;">{{item.amount.toFixed(2)}}元</td>
                </tr>
            </table> -->
            <div class="tit">
                <span class="room" style="text-align:left;">包间名</span>
                <span class="room" style="text-align:right;">{{`${nowDeskOrderInfo.numTrans.partitionName}-${nowDeskOrderInfo.numTrans.numName}`}}</span>
            </div>
            <div class="tit">
                <span class="room" style="text-align:left;">计费规则</span>
                <span class="room" style="text-align:right;">{{nowDeskOrderInfo.numTrans.rulesName}}</span>
            </div>
            <div class="tit">
                <span class="room" style="text-align:left;">开单时间</span>
                <span class="room" style="text-align:right;">{{new Date(nowDeskOrderInfo.numTrans.addTime).Format('yyyy-MM-dd hh:mm:ss')}}</span>
            </div>
            <div class="tit">
                <span class="room" style="text-align:left;">入座时长</span>
                <span class="room" style="text-align:right;">{{nowDeskOrderInfo.numTrans.inTime}}</span>
            </div>
            <div class="tit">
                <span class="room" style="text-align:left;">包间计费</span>
                <span class="room" style="text-align:right;">{{(nowDeskOrderInfo.res.totalRoomAmount).toFixed(2)}}</span>
            </div>
        </div>
        <div class="line" v-if="!showRoomAmountInfo"></div>
        <div class="set-item">
            <span class="left-tit">服务费</span>
            <div class="right-cont">
                <span class="cont"><b style="font-size:.34rem;color:red;">{{nowDeskOrderInfo.res.totalServiceAmount.toFixed(2)}}</b>元</span>
                <i class="iconfont icon-arrow-right-copy"></i>
            </div>
        </div>
        <div class="span-panle"></div>
        <div class="set-item">
            <span class="left-tit">点单员工</span>
            <div class="right-cont">
                <span class="cont">{{nowDeskOrderInfo.numTrans.empName}}</span>
                <!-- <i class="iconfont icon-arrow-right-copy"></i> -->
            </div>
        </div>
        <div class="open-time" v-if="storeTimeEnabled&&nowDeskOrderInfo.numTrans.suspendEnabled==0">
            <button @click.stop="showSelRule=true">开始计时</button>
        </div>
    </div>
        <div class="cart">
            <div class="cart-and-money">
                <span class="total-money" style="font-size:.24rem;">合计: <b style="font-size:.34rem;">{{(nowDeskOrderInfo.res.totalAmount).toFixed(2)}}</b> 元</span>
                <!-- <button class="go-pay" v-if="nowDeskOrderInfo.res.itemRes.length==0&&nowDeskOrderInfo.numTrans.suspendEnabled==0" @click="closeDesk">关台</button> -->

                <span class="go-pay" v-if="nowDeskOrderInfo.res.itemRes.length==0&&nowDeskOrderInfo.numTrans.suspendEnabled==0" @click.stop="closeDesk">关台</span>

                <span class="go-pay" v-if="clerkPayEnabled&&(nowDeskOrderInfo.res.itemRes.length!=0||nowDeskOrderInfo.numTrans.suspendEnabled!=0)" @click.stop="$router.push({path:'/pay'})">结账</span>

                <span class="add-goods" @click.stop="addItem">增加消费</span>
            </div>
        </div>
        <!-- <bindVip 
        @reGetPayInfo="reGetPayInfo"
        @closeBind="showBindVip=false"
        v-if="showBindVip"
        /> -->
        <div class="mask" v-if="showMask" @click.stop="showMask=false;showModifyGoods=false;changeTable=false;showSelGoodsType=false;">
            <div class="mask-cont" @click.stop="">
                <div class="modify-goods" v-if="showModifyGoods" @click.stop="">
                    <div class="cont">
                        <div class="cont-item-tit">
                            {{nowModifyGoods.productName}}
                        </div>
                        <div class="cont-item" @click.stop="goChangeTable">
                            <span>转台</span>
                        </div>
                        <div class="cont-item" @click.stop="goCancelGoods">
                            <span>取消</span>
                        </div>
                    </div>
                    <div class="cont-close" @click="showMask=false;showModifyGoods=false">关闭</div>
                </div>
                <div class="modify-goods" v-if="showStopTime" @click.stop="">
                    <div class="cont">
                        <div class="cont-item-tit">
                            {{nowModifyTimeGoods.productTimeName}}
                        </div>
                        <div class="cont-item" @click.stop="goStopTimeGoods">
                            <span>结束</span>
                        </div>
                    </div>
                    <div class="cont-close" @click="showMask=false;showStopTime=false">关闭</div>
                </div>
                <div class="modify-goods" v-if="showSelGoodsType" @click.stop="">
                    <div class="cont">
                        <div class="cont-item-tit">
                            请选择商品类型
                        </div>
                        <div class="cont-item" @click.stop="goSelGoods('normal')">
                            <span>选择普通商品</span>
                        </div>
                        <div class="cont-item" @click.stop="goSelGoods('time')">
                            <span>选择计时商品</span>
                        </div>
                    </div>
                    <div class="cont-close" @click="showSelGoodsType=false;showMask=false;">关闭</div>
                </div>
                <div class="change-table" v-if="changeTable" @click.stop="">
                    <div class="item">
                        <div class="info left-tit">转台数量:</div>
                        <div class="info right-cont">
                            <span style="font-size:.3rem;">{{changeCount}}</span>
                            <!-- <input type="text" v-model="changeCount"/> -->
                        </div>
                    </div>
                    <div class="item">
                        <div class="info left-tit">房间分类:</div>
                        <div class="info right-cont">
                           <select v-model="parId" @change="setPar">
                               <option v-for="(item,index) in tableInfo" :key="index" :value="item.parId">{{item.parName}}</option>
                           </select>
                        </div>
                    </div>
                    <div class="item">
                        <div class="info left-tit">桌号:</div>
                        <div class="info right-cont">
                           <select v-model="numId">
                               <option v-for="(item,index) in numInfo" :key="index" :value="item.numId">{{item.numName}}</option>
                           </select>
                        </div>
                    </div>
                    <div class="btn">
                        <button class="close" @click.stop="changeTable=false;showMask=false;">关闭</button>
                        <button class="sure"  @click.stop="sure">确认</button>
                    </div>
                </div>
            </div>
        </div>
        <openTable 
        :showOpenTable="showOpenTable" 
        @hideOpenTable="hideOpenTable()"
        :curSelTable="curSelTable"
        :isOpenOrBook="isOpenOrBook"
        :storeId="storeId"
        :curSelTableOpenInfo="curSelTableOpenInfo"
        :isChange="isChange"
        @doGetNumDetail="doGetNumDetail"
        />
        <checkAuth 
        v-if="checkAuth" 
        :checkType="'cancelGoods'"
        :goodsInfo="nowModifyGoods"
        :orderInfo="nowDeskOrderInfo"
        @closeCheckAuth="closeCheckAuth"
        />
        <div class="sure-open-time-wrap" v-if="showSelRule" @click.stop="showSelRule=false;">
            <div class="sure-open-time" @click.stop="">
                <div class="tit">请选择计费规则</div>
                <div class="rules" @click.stop="setNormalRule">
                    <select name="" id="" v-model="nowSelRule">
                        <option :value="`${item.ruleId}_*_.-%&_--_*_${item.ruleName}`" v-for="(item,index) in nowDeskOrderInfo.ruleList" :key="index">{{item.ruleName}}</option>
                    </select>
                </div>
                <div class="btn">
                    <button class="cancel" @click.stop="showSelRule=false;">取消</button>
                    <button class="sure" @click.stop="sureSetRule">确认</button>
                </div>
            </div>
        </div>
        <div class="sure-open-time-wrap" v-if="showOpenTime" @click.stop="showOpenTime=false;">
            <div class="sure-open-time" @click.stop="">
                <div class="tit">确定开始计时？</div>
                <div class="btn">
                    <button class="cancel" @click.stop="showOpenTime=false;">取消</button>
                    <button class="sure" @click.stop="openTime">确认</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters,mapActions} from "vuex";
import openTable from "./../openTable/openTable";
import checkAuth from "./../checkAuth/checkAuth";
export default {
    // props:['nowSelectGoods','totalAmount','totalCount','nowDeskOrderInfo'],
    components:{openTable,checkAuth},
    data() {
        return {
            storeTimeEnabled:false,
            isTimeGoodsEnable:false,
            showOldGoodsForTime:false,
            nowModifyTimeGoods:{},
            showStopTime:false,
            showTimeGoods:false,
            showSelGoodsType:false,
            clerkPayEnabled:true,
            nowSelRule:"",
            showOpenTime:false,
            showSelRule:false,
            checkAuth:false,
            numInfo:[],
            parId:"",
            numId:0,
            changeCount:0,
            changeTable:false,
            showModifyGoods:false,
            nowModifyGoods:{},
            showMask:false,
            isChange:true,
            curSelTableOpenInfo:{},
            storeId:"",
            isOpenOrBook:"BUSY",//BUSY是开台，BOOK是预定
            showOpenTable:false,
            showRoomAmountInfo:false,
            showTimeInfo:false,
            showBindVip:false,
            employeeName:"",
            showGoods:false,
            showOldGoods:false,
            nowDeskOrderInfo:{},
            curSelTable:{},
            tableInfo:[]
        }
    },
    computed: {
        refreshNum () {
            let count  = this.getRefreshNum();
            return count;
        },
    },
    watch: {
        parId(val){
            // 
        },
        refreshNum(val){
            console.log("refreshNum++")
            this.reGetPayInfo();
        }
    },
    methods: {
        goStopTimeGoods(){
            this.$http({
                url:"stop-item",
                method:"POST",
                data:{
                    productTimeItemId:this.nowModifyTimeGoods.id
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.$message({
                        message: res.data.msg,
                        showClose: true,
                        customClass: 'success'
                    });
                }else{
                    this.$message({
                        message: res.data.msg,
                        showClose: true,
                        customClass: 'error'
                    });
                }
                this.showMask = false;
                this.showStopTime = false;
                this.getnumDetail(this.curSelTable.deskID);
            });
        },
        goSelGoods(type){
            if(type == 'normal'){
                this.setIsAddItem(true);
                this.$router.replace('/selGoods');
            }else{
                this.$router.replace({path:'/selTimeGoods',query:{orderId:this.nowDeskOrderInfo.numTrans.orderId,numId:this.curSelTable.deskID}});
            }
        },
        closeDesk(){
            this.$http({
                url:"close-num",
                method:"GET",
                params:{
                    orderId:this.nowDeskOrderInfo.numTrans.orderId
                }
            }).then(res=>{
                this.$message({
                    message: "关台成功",
                    showClose: true,
                    customClass: 'success'
                });
                this.$router.replace({path:'/table'})
                return;
            })
        },
        setNormalRule(){
            if(this.nowSelRule){
                return;
            }
            if(this.nowDeskOrderInfo.ruleList.length > 1){
                this.nowSelRule = `${this.nowDeskOrderInfo.ruleList[0].ruleId}_*_.-%&_--_*_${this.nowDeskOrderInfo.ruleList[0].ruleName}`;
            }
        },
        sureSetRule(){
            console.log(this.nowSelRule);
            if(this.nowSelRule == ""){
                this.$message({
                    message: "请选择计费规则",
                    showClose: true,
                    customClass: 'error'
                });
                return;
            }
            this.showSelRule = false;
            this.showOpenTime = true;
        },
        // 暂停计费
        openTime(){
            console.log(this.nowSelRule);
            if(this.nowSelRule == ""){
                this.$message({
                    message: "请选择计费规则",
                    showClose: true,
                    customClass: 'error'
                });
                return;
            }
            let nowSelRule = this.nowSelRule.split("_*_.-%&_--_*_");
            this.$http({
                url:"num-suspend",
                method:"POST",
                data:{
                    numId:this.nowDeskOrderInfo.numTrans.numId,
                    ruleId:nowSelRule[0],
                    ruleName:nowSelRule[1],
                }
            }).then(res=>{
                this.showSelRule = false;
                this.nowSelRule = "";
                if(res.data.code == 200){
                    this.$message({
                        message: res.data.msg,
                        customClass: 'success'
                    });
                }else if(res.data.code == 400){
                    this.$message({
                        message: res.data.msg,
                        customClass: 'error'
                    });
                }
                this.reGetPayInfo();
                this.showOpenTime = false;
            });
        },
        closeCheckAuth(){
            this.checkAuth=false;
            this.showMask=false;
            this.showModifyGoods=false;
            this.changeTable=false;
            this.getnumDetail(this.curSelTable.deskID);
        },
        setPar(){
            if(this.tableInfo.length){
                for(let i=0;i<this.tableInfo.length;i++){
                    if(this.parId == this.tableInfo[i].parId){
                        this.numInfo = this.tableInfo[i].list;
                    }
                }
            }
        },
        
        sure(){
            let flag = this.checkInfo();
            if(!flag){
                return;
            }
            this.$http({
                    url:"change-order-num",
                    method:"GET",
                    params:{
                        numId:this.numId,
                        itemId:this.nowModifyGoods.orderItemId,
                        qty:this.changeCount
                    }
                }).then(res=>{
                    if(res.data.code == 200){
                        this.$message({
                            message: res.data.msg,
                            showClose: true,
                            customClass: 'success'
                        });
                        this.showMask=false;
                        this.showModifyGoods=false;
                        this.changeTable=false;
                        // this.$emit("closeModGoodsForCart","");
                        this.getnumDetail(this.curSelTable.deskID);
                    }else if(res.data.code == 400){
                        this.$message({
                            message: res.data.msg,
                            showClose: true,
                            customClass: 'error'
                        });
                    }
                    return;
                });
        },
        checkInfo(){
            if(this.numId == this.nowDeskOrderInfo.numTrans.numId){
                this.$message({
                    message: "不可转入到当前台桌",
                    showClose: true,
                    customClass: 'error'
                });
                return false;
            }
            if(!/^\d+$/.test(this.changeCount)){
                this.$message({
                    message: "数量输入错误",
                    showClose: true,
                    customClass: 'error'
                });
                return false;
            }
            if(this.changeCount > this.nowModifyGoods.count){
                this.$message({
                    message: "数量不能大于该商品原定数量",
                    showClose: true,
                    customClass: 'error'
                });
                return false;
            }
            if(!this.changeCount){
                this.$message({
                    message: "请填写数量",
                    showClose: true,
                    customClass: 'error'
                });
                return false;
            }
            if(!this.numId){
                this.$message({
                    message: "请确认是否有空闲桌台/包间",
                    showClose: true,
                    customClass: 'error'
                });
                return false;
            }
            return true;
        },
        getInfo(){
            this.$http({
                url:"get-change-num",
                method:"GET",
                params:{
                    storeId:localStorage.getItem("storeId")
                }
            }).then(res=>{
                if(res.data.code == 200){
                    this.showModifyGoods = false;
                    this.changeTable = true;
                    this.tableInfo = res.data.data;
                }
            });
        },
        goCancelGoods(){
            this.checkAuth = true;
        },
        goChangeTable(){
            this.changeCount = this.nowModifyGoods.count
            this.getInfo();
        },
        modifyGoodsItem(item){
            this.nowModifyGoods = item;
            this.showMask = true;
            this.showModifyGoods = true;
        },
        modifyGoodsItemForTime(item){
            this.nowModifyTimeGoods = item;
            this.showMask = true;
            this.showStopTime = true;
        },
        showModifyDeskInfo(){
            this.curSelTableOpenInfo = {
                beginTime:this.nowDeskOrderInfo.numTrans.beginTime,
                rules:[
                    { ruleName: this.nowDeskOrderInfo.numTrans.rulesName, ruleId: this.nowDeskOrderInfo.numTrans.ruleId }
                ],
                people:this.nowDeskOrderInfo.numTrans.people,
                names:[{
                    empId: this.nowDeskOrderInfo.numTrans.empId,
                    empName: this.nowDeskOrderInfo.numTrans.empName,
                    mobile: this.nowDeskOrderInfo.numTrans.mobile
                }],
                notice:this.nowDeskOrderInfo.numTrans.notice
            }
            this.showOpenTable=true;
        },
        hideOpenTable(){
            this.showOpenTable = false;
        },
        reGetPayInfo(){
            // this.showBindVip = false;
            this.getnumDetail(this.curSelTable.deskID);
        },
        doGetNumDetail(data){
            this.getnumDetail(data.deskId);
            this.showOpenTable = false;
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
        addItem(){
            // if(!this.nowDeskOrderInfo.allowOrder){
            //     this.$message({
            //         message: "该台正在进行结账，请稍后开台点单或与工作人员核实！",
            //         showClose: true,
            //         customClass: 'error'
            //     });
            //     return false;
            // }
            if(!this.isTimeGoodsEnable){
                this.setIsAddItem(true);
                this.$router.replace('/selGoods');
                return;
            }
            this.showSelGoodsType = true;
            this.showMask = true;
            // this.setIsAddItem(true);
            // this.$router.replace('/selGoods');
        },
        ...mapGetters(['getNowDeskOrderInfo',"getNowSelDesk","getRefreshNum"]),
        ...mapActions(['setIsAddItem',"saveNowDeskOrderInfo"]),

    },
    created() {
        this.nowDeskOrderInfo = this.getNowDeskOrderInfo();
        this.curSelTable = this.getNowSelDesk();
        if(this.nowDeskOrderInfo.ruleList.length == 1){
            // `${item.ruleId}_*_.-%&_--_*_${item.ruleName}`
            this.nowSelRule = `${this.nowDeskOrderInfo.ruleList[0].ruleId}_*_.-%&_--_*_${this.nowDeskOrderInfo.ruleList[0].ruleName}`
        }
    },
    updated() {
        console.log($("input"))
        $("input").blur(function(){
            console.log('失去焦点')
            window.scrollTo(0,0);
        });
        $("select").on("change",function(){
            window.scrollTo(0,0);
        });
    },
    mounted() {
        this.storeId = localStorage.getItem("storeId");
        this.employeeName = localStorage.getItem("employeeName");
        console.log(this.nowDeskOrderInfo)
        if(!this.nowDeskOrderInfo || !this.nowDeskOrderInfo.res){
            this.$router.replace("/table");
        }
        console.log($("input"))
        $("input").blur(function(){
            console.log('失去焦点')
            window.scrollTo(0,0);
        });
        $("select").on("change",function(){
            window.scrollTo(0,0);
        });
        let clerkPayEnabled = JSON.parse(localStorage.getItem("clerkPayEnabled"));
        let isTimeGoodsEnable = JSON.parse(localStorage.getItem("isTimeGoodsEnable"));
        let storeTimeEnabled = JSON.parse(localStorage.getItem("storeTimeEnabled"));

        if(clerkPayEnabled == false){
            this.clerkPayEnabled = false;
        }else{
            this.clerkPayEnabled = true;
        }

        if(isTimeGoodsEnable == false || !isTimeGoodsEnable){
            this.isTimeGoodsEnable = false;
        }else{
            this.isTimeGoodsEnable = true;
        }

        if(storeTimeEnabled == false || !storeTimeEnabled){
            this.storeTimeEnabled = false;
        }else{
            this.storeTimeEnabled = true;
        }
    },
}
</script>


<style scoped lang="scss">
@import "./goPay.scss"
</style>
