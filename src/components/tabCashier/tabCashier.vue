<template>
	<div class="takeOrder">
        <!-- vip -->
        <div class="search-product-box" :class="{fliter:(showCarDetail||showPayBox||showCode||showDelConfirm||isqrcode)}">
            <div class="search-produc"  @click="vipLoginCheckOrder">
                <i class="iconfont icon-sousuo"></i>
                <input type="text" placeholder="请输入要检索的商品名" v-model="product">
            </div>
            <div class="product-box" v-if="productList.length>0" @click.stop="productList=[];product=''">
                <ul class="ul">
                    <li class="product-item" v-for="item in productList" @click.stop="shoiceProduct(item)">
                        <span v-text="item.name"></span>
                    </li>
                </ul>
            </div>
        </div>
		<!-- 商品列表 -->
		<div class="goodsBox clearfix" :class="{fliter:(showCarDetail||showPayBox||showCode||showDelConfirm||isqrcode)}">
			<div class="left_bar left" id="left_bar" :style="seledOrder.length>0?'height:calc(100% - 1rem);':'height:100%;'">
				<div id="left_bar_scroll">
					<div v-if="goodsData[0].typeName" class="item flex flex-align-center flex-pack-center" v-for="(oitem,index) in goodsData" v-text="oitem.typeName" :class="{active:curIdx==index}" @click="changeGoodType(index)"></div>
                    <div class="debug-wechat"></div>
				</div>
			</div>
			<div class="right_goods left" id="right_goods">
				<div id="right_goods_scroll">
					<div class="goods_item oneLevel">
						<!-- <div class="goods_li" v-for="(item,ind) in goodsData[curIdx].products" @click="addProduct(item.id, true,null,false)"> -->
						<div class="goods_li" v-for="(item,ind) in goodsData[curIdx].products">
	                        <div class="goodImg left" :class="{'goodImg-border':!item.imageURL}" @click="showImg(item.imageURL)">
	                        	<!-- <img :data-echo="item.imageURL" alt=""> -->
	                        	<img :src="item.imageURL+'?x-oss-process=image/resize,l_300'" alt="">
	                        </div>
	                        <div class="goodMsg" @click="curSelItem=item;addProduct(item.id, true,null,false)">
		                        <p class="name" v-text="item.name"></p>
		                        <div class="msgBottom clearfix">
                                    <div class="price left" v-text=" '￥' + item.salesPrice"></div>
                                    <div class="changeNumber right clearfix">
                                        <!-- <span class="reduceNumber left" :style="{display:(item.goodNumber>0?'inline-block':'none')}" @click="item.goodNumber- -;reduceProduct(item.id)"><i class="iconfont icon-jianshao1"></i></span>
                                        <span class="number left" :style="{display:(item.goodNumber>0?'inline-block':'none')}" v-text="item.goodNumber"></span> -->
                                        <span class="addNumber left" v-if="item.id!=='0'" :id="item.id"><i class="iconfont icon-tianjia1"></i></span>
                                    </div>
		                        	<div class="addMore right" v-if="item.id==='0'?true:false" @click.stop="openNumberBox(item.id)">自定义网费</div>
		                        	<!-- <div class="addMore right" @click.stop="openNumberBox(item.id)">{{item.id=='0'?'自定义网费':'批量'}}</div> -->
		                        </div>
	                        </div>
	                    </div>
                        <div class="goods_li" v-for="(item,ind) in goodsData[curIdx].meals">
	                        <div class="goodImg left" :class="{'goodImg-border':!item.imageURL}" @click="showImg(item.imageURL)" 
                            style="background:#fff;text-align:center;line-height:1.2rem;color:#f26c63;">
                                套餐
	                        	<!-- <img :data-echo="item.imageURL" alt=""> -->
	                        	<!-- <img :src="item.imageURL+'?x-oss-process=image/resize,l_300'" alt=""> -->
	                        </div>
	                        <div class="goodMsg" @click="addProduct(item.id, true,null,false,item.label)">
		                        <p class="name" v-text="item.name"></p>
		                        <div class="msgBottom clearfix">
                                    <div class="price left" v-text=" '￥' + item.price"></div>
                                    <div class="changeNumber right clearfix">
                                        <!-- <span class="reduceNumber left" :style="{display:(item.goodNumber>0?'inline-block':'none')}" @click="item.goodNumber- -;reduceProduct(item.id)"><i class="iconfont icon-jianshao1"></i></span>
                                        <span class="number left" :style="{display:(item.goodNumber>0?'inline-block':'none')}" v-text="item.goodNumber"></span> -->
                                        <span class="addNumber left" v-if="item.id!=='0'" :id="item.id"><i class="iconfont icon-tianjia1"></i></span>
                                    </div>
		                        	<div class="addMore right" v-if="item.id==='0'?true:false" @click.stop="openNumberBox(item.id)">自定义网费</div>
		                        	<!-- <div class="addMore right" @click.stop="openNumberBox(item.id)">{{item.id=='0'?'自定义网费':'批量'}}</div> -->
		                        </div>
	                        </div>
	                    </div>
					</div>
		            <div class="goods_item" v-for="(item,ind) in goodsData[curIdx].subTypes" @click="traggerType($event)">
		                <p class="title_name" v-text="item.typeName"></p>
		                <!-- <div class="goods_li" v-for="(item,ind) in item.products" @click.stop="addProduct(item.id, true,null,false);"> -->
		                <div class="goods_li" v-for="(item,ind) in item.products" >
	                        <div class="goodImg left" :class="{'goodImg-border':!item.imageURL}" @click.stop="showImg(item.imageURL)">
	                        	<!-- <img :data-echo="item.imageURL" alt=""> -->
	                        	<img :src="item.imageURL+'?x-oss-process=image/resize,l_300'" alt="">
	                        </div>
	                        <div class="goodMsg" @click.stop="addProduct(item.id, true,null,false);">
		                        <p class="name" v-text="item.name"></p>
		                        <div class="msgBottom clearfix">
                                    <div class="price left" v-text=" '￥' + item.salesPrice"></div>
                                    <div class="changeNumber right clearfix">
                                        <!-- <span class="reduceNumber left" :style="{display:(item.goodNumber>0?'inline-block':'none')}" @click="item.goodNumber- -;reduceProduct(item.id)"><i class="iconfont icon-jianshao1"></i></span>
                                        <span class="number left" :style="{display:(item.goodNumber>0?'inline-block':'none')}" v-text="item.goodNumber">1</span> -->
                                        <span class="addNumber left" :id="item.id"><i class="iconfont icon-tianjia1"></i></span>
                                    </div>
		                        	<!-- <div class="addMore right" @click.stop="openNumberBox(item.id)">批量</div> -->
		                        </div>
	                        </div>
	                    </div>
		            </div>
				</div>
			</div>
		</div>
        <!-- 已下单列表 -->
		<div class="shopCar clearfix seled" v-if="seledOrder.length" @click="(seledOrder.length>0?showCarSeledDetail=true:null);showCarDetail=false" :class="{fliter:(showPayBox||showCode||showDelConfirm||isqrcode)}">
            <div class="seled-tit left">已提交订单商品</div>
			<div class="carImgBox right flex flex-align-center flex-pack-center" @click="seledOrder.length>0?showCarSeledDetail=true:null">
				<div class="carImg">
					<div class="goodsNumber flex flex-align-center flex-pack-center" v-text="seledOrderCount"></div>
					<i class="iconfont icon-gouwuchekong"></i>
				</div>
			</div>
		</div>
		
		<!-- 购物车 -->
		<div class="shopCar clearfix" :class="{fliter:(showPayBox||showCode||showDelConfirm||isqrcode)}">
			<div class="carImgBox left flex flex-align-center flex-pack-center" @click="(choiceArr.length>0?showCarDetail=true:null);showCarSeledDetail=false">
				<div class="carImg">
					<div class="goodsNumber flex flex-align-center flex-pack-center" v-text="totalPrice.count"></div>
					<i class="iconfont icon-gouwuchekong"></i>
				</div>
			</div>
			<div class="totalPrice left" v-text="'￥'+(totalPrice.amount).toFixed(2)"></div>
            <button type="button" class="confirmBtn right" @click="goPayType()">结账</button>
            <button type="button" class="confirmBtn right" @click="showSubNote=true;">提交</button>
			<!-- <button type="button" class="delBtn right" @click="showDelConfirm=true;">取消订单</button> -->
		</div>

		<!-- 购物车详情 -->
		<div class="carDetailBox" :style="{display:(showCarDetail?'block':'none')}" @click="showCarDetail=false">
			<div class="carDetail" @click.stop="">
				<div class="goodsBox" id="carGoodsBox" :style="{height:(0.88*(choiceArr.length-1)+0.44)+'rem'}">
					<div id="carGoodsBox_scroll">
						<div class="goodItem clearfix" v-for="item in choiceArr" v-if="!item.already">
							<div class="name left" v-text="item.productName"></div>
							<div class="price left" v-text="'￥'+(item.dealPrice).toFixed(2)"></div>
							<div class="changeNumber right">
								<span class="reduceNumber" @click="reduceProduct(item.productId,item)"><i class="iconfont icon-jianshao1"></i></span>
								<span class="number" v-text="item.quantity"></span>
								<span class="addNumber" @click="addProduct(item.productId, false,null,false)"><i class="iconfont icon-tianjia1"></i></span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
        <!-- 已点订单详情 -->
		<div class="carDetailBox seled" :style="{display:(showCarSeledDetail?'block':'none')}" @click="showCarSeledDetail=false">
			<div class="carDetail" @click.stop="">
				<div class="goodsBox" id="carGoodsBox" :style="{height:(0.88*(seledOrder.length-1)+0.44)+'rem'}">
					<div id="carGoodsBox_scroll">
						<div class="goodItem clearfix" v-for="item in seledOrder" v-if="item.already">
							<div class="name left" v-text="item.productName"></div>
							<div class="price left" v-text="'￥'+(item.dealPrice).toFixed(2)"></div>
							<div class="changeNumber right">
								<span class="reduceNumber" @click="reduceProduct(item.productId,item,false)"><i class="iconfont icon-jianshao1"></i></span>
								<span class="number" v-text="item.quantity"></span>
								<!-- <span class="addNumber" @click="addProduct(item.productId, false,null,false)"><i class="iconfont icon-tianjia1"></i></span> -->
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

        <!-- 确认取消弹出框 -->
        <div class="delConfirmMask" :style="{display:(showDelConfirm?'block':'none')}" @click="showDelConfirm=false">
            <div class="delConfirm position-middle-center" @click.stop="">
                <p class="tipText">订单支付中，确定取消支付？</p>
                <div class="btnGroup">
                    <button type="button" class="cancle" @click="showDelConfirm=false">取消</button>
                    <button type="button" @click="canclePayment()">确定</button>
                </div>
            </div>
        </div>

		<!-- 支付 -->
		<div class="payBox" :style="{display:(showPayBox?'block':'none')}" @click="showSetWrap=false;">
			<div class="returnBtn flex flex-align-center">
				<!-- <i @click="showPayBox=false">&times;</i> -->
				<i @click="returnMoney">&times;</i>
			</div>
			<div class="title flex flex-align-center flex-pack-center">
				<span>订单</span>
			</div>
			<div class="goodsMsg">
                <div class="vip-box clearfix" v-if="vipData">
                    <div class="name left" v-text="vipData.name"></div>
                    <div class="phone left" v-text="vipData.mobile"></div>
                    <div class="del right" @click="cancelVip">解绑会员</div>
                    <div class="price right" v-text="'￥'+vipData.amount"></div>
                </div>
				<div class="goodsListBox" :style="{height:(vipData?'':'68%')}">
					<div class="goodsList" id="goodsList">
						<div id="scroll">
							<!-- <div class="goods_li" v-for="(item,ind) in choiceArr" v-if="!item.already"> -->
							<div class="goods_li" v-for="(item,ind) in choiceArr">
		                        <div class="goodImg left" :style="!item.image?'line-height:1.1rem;text-align:center;color:red;':''">
		                        	<img :src="item.image" :title="item.productName" v-if="item.image">
                                    <span v-if="!item.image">套餐</span>
		                        </div>
		                        <div class="goodMsg">
			                        <p class="name" v-text="item.productName"></p>
			                        <div class="msgBottom clearfix">
			                        	<div class="price left" v-text=" '￥' + (item.dealPrice).toFixed(2)"></div>
			                        	<div class="changeNumber right">
			                        		<!-- <span class="reduceNumber" @click="reduceProduct(item.productId)"><i class="iconfont icon-jianshao1"></i></span> -->
			                        		<span class="number" v-text="'×'+item.quantity"></span>
			                        		<!-- <span class="addNumber" @click="addProduct(item.productId, false)"><i class="iconfont icon-tianjia1"></i></span> -->
			                        	</div>
			                        </div>
		                        </div>
		                    </div>
						</div>
					</div>
				</div>
				<div class="totalPriceBox">
					<div class="totalPriceCon" style="text-align:left;">
						<!-- <span class="totalNumber">总计<span v-text="totalPrice.count"></span></span> -->
						<!-- <span class="totalPrice">合计<span v-text="'￥'+(totalPrice.total).toFixed(2)"></span></span> -->
						<span class="totalPrice">优惠:<span v-text="'￥'+(totalPrice.discount).toFixed(2)"></span></span>
						<span class="totalPrice">零头:<span v-text="'￥'+(totalPrice.removeZero).toFixed(2)"></span></span>
						<span class="totalPrice">应付:<span v-text="'￥'+(totalPrice.amount).toFixed(2)"></span></span>
					</div>
                    
                    <div class="seat-number clearfix">
                        <!-- <div class="left">
                            <span>座位号：</span>
                        </div> -->
                        <!-- <div class="right"> -->
                            <!-- <span>请填写座位号</span> -->
                            <!-- <input type="text" placeholder="请填写座位号" v-model="tableNo" maxlength="10" @click="clickInput($event)"> -->
                        <!-- </div> -->
                    </div>
                    <div class="seat-number clearfix">
                        <div class="left">
                            <span>备注：</span>
                        </div>
                        <div class="right">
                            <!-- <span>请填写座位号</span> -->
                            <input type="text" placeholder="请输入口味、偏好等要求" v-model="notes" maxlength="120" @click="clickInput($event)">
                        </div>
                    </div>
				</div>
                <!--  -->
                <div v-if="showDiscount||showZero" :class="showSetWrap?'discount-wipe-zero show-set':'discount-wipe-zero'" @click.stop="" >
                                <div class="wrap">
                                    <div class="discount-set" v-if="showDiscount">
                                        <span>折扣:</span>
                                        <select class="dis-sel" name="" id="" v-model="firstDiscount" >
                                            <option :value="item" v-for="(item,index) in discountVals" :key="index">{{item}}</option>
                                        </select>
                                        <select class="dis-sel" name="" id="" v-model="lastDiscount">
                                            <option :value="item" v-for="(item,index) in discountVals" :key="index">{{item}}</option>
                                        </select>
                                        <div class="now-discount">
                                            <span>当前所选折扣：<b>{{firstDiscount+'.'+lastDiscount}}</b> 折</span>
                                        </div>
                                        <div>
                                            <span>折后价：<b>{{Number(Number(firstDiscount+''+lastDiscount)/100) == 0?totalPrice.amount.toFixed(2):((totalPrice.amount)*Number(Number(firstDiscount+''+lastDiscount)/100)).toFixed(2)}}</b> 元</span>
                                        </div>
                                        
                                    </div>
                                    <div v-if="showZero" style="padding-bottom:10px;" class="auto-money">
                                        <span class="money" style="font-size:14px;color:red;">自定义金额:</span>
                                        <input type="text" v-model="wipeZeroMoney" placeholder="请输入金额" />
                                    </div>
                                    <div class="sure-discount">
                                        <button @click="discountThisOrder">确定</button>
                                    </div>
                                 
                                </div>
                                <div class="trag-set" @click.stop="showPwd">
                                    <span>折扣 & 零头</span>
                                </div>
                            </div>
			</div>
			<div class="payTypeBox">
                <div class="item">
                    <div class="payTypeItem flex flex-align-center flex-pack-center alipay left" v-if="!isOnline && !vipData" @click="payByType('alipay')">支付宝</div>
                    <!-- <div class="payTypeItem flex flex-align-center flex-pack-center submit-order left" @click="submitOrder">提交订单</div> -->
                    <!-- <div class="payTypeItem flex flex-align-center flex-pack-center scan-code left" v-if="isOnline && !vipData" @click="testPay">在线支付</div> -->
                    <div class="payTypeItem flex flex-align-center flex-pack-center scan-code left" v-if="isOnline && !vipData" @click="scanCode">在线支付</div>
                    <!-- <div class="payTypeItem flex flex-align-center flex-pack-center scan-code left" v-if="isOnline" @click="showTestPayCode=true">在线支付</div> -->
                    <!-- <div class="payTypeItem flex flex-align-center flex-pack-center money left" @click="scanCode">扫一扫</div> -->
                    <div class="payTypeItem flex flex-align-center flex-pack-center wechat right" v-if="!isOnline && !vipData" @click="payByType('wechat')">微信</div>
                    <p class="vip-no-money" v-if="vipData&&(Number(vipData.amount)<Number((totalPrice.amount).toFixed(2)))">会员余额不足，请充值。</p>
                </div>
                <div class="item">
                    <div class="payTypeItem flex flex-align-center flex-pack-center money left" @click="placeOrder('cash')" v-if="clerkCashSales && !vipData">现金支付</div>
                    <!-- <div class="payTypeItem flex flex-align-center flex-pack-center member right" @click="payByType('MEMBER')">会员支付</div> -->
                    <div class="payTypeItem flex flex-align-center flex-pack-center member right" @click="showBindVipBoxOrPayByVip" v-if="!vipData">会员支付</div>
                    <div class="payTypeItem flex flex-align-center flex-pack-center only-member left" @click="showBindVipBoxOrPayByVip" v-if="vipData&&(Number(vipData.amount)>=Number((totalPrice.amount).toFixed(2)))">会员支付</div>
                    <div class="payTypeItem flex flex-align-center flex-pack-center only-member left" @click="goVipCharge" v-if="vipData&&(Number(vipData.amount)<Number((totalPrice.amount).toFixed(2)))">会员充值</div>
                </div>
			</div>
		</div>

		<!-- 支付宝二维码 -->
		<div class="qrcode" :style="{display:(showCode?'block':'none')}">
        	<p class="title flex flex-align-center flex-pack-center">支付二维码</p>
        	<div class="qrcode_box">
        		<div><img :src="payImgUrl" alt=""></div>
        	</div>
            <div class="tip" v-if="isOnline">
                <p>扫码并支付，即可完成订单。</p>
                <p>请在5分钟内完成支付，超时将自动取消。</p>
                <p v-text="timeDown"></p>
            </div>
            <div class="tip" v-else>
                <p>扫码并支付<strong v-text="'￥'+(totalPrice.amount).toFixed(2)"></strong></p>
                <p>请确认顾客已支付成功！</p>
            </div>
            <div class="btnGroup">
                <button type="button" @click="closeCodeImg()">取消支付</button>
                <button type="button" class="save" @click="payOfflineSuccess()" v-if="!isOnline">完成支付</button>
            </div>
        </div>
        
        <!-- 动画节点 -->
        <div class="goodAnimate"></div>
        
        <!-- 数字小键盘 -->
        <div class="numberMaskBox" v-if="showNumBox" @click="showNumBox=false">
            <div class="numberMask" id="numberMask" @click.stop="">
                <div class="inputBox" v-text="goodNumber"></div>
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
                    <div class="number" @click="delNumber()">删除</div>
                    <div class="number" @click="clickNum('0')">0</div>
                    <div class="number" @click="saveNumber()">保存</div>
                </div>
            </div>
        </div>

        <!-- 添加会员二维码 -->
        <div class="vipQrcode" :style="{display:isqrcode?'block':'none'}" @click="closeVipCode()">
            <button class="jumpBtn" v-if="clerkMemberSwitch" type="button" @click="closeVipCode(true)">跳过 >></button>
            <div class="vipPhoneBox" @click.stop="">
                <div class="phoneBtn" @click="showEnterPhone=true" v-if="!showEnterPhone">手动输入</div>
                <div class="phoneInput clearfix" v-else>
                    <input class="left" type="tel" placeholder="输入会员手机号（至少4位）" v-model="EnterPhone">
                    <!-- <span class="confirmBtn right" @click="showEnterPhoneFn">确定</span> -->
                    <ul class="moreVip" v-if="vipPhoneList&&vipPhoneList.length">
                        <li v-for="(item, idx) in vipPhoneList" @click="selPhoneVip(item)">
                            <span class="name left" v-text="item.name"></span>
                            <span class="price left" v-text="item.mobile"></span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="content" style="display:none;">
                <div id="vipQrcode" class="qrcode-border"></div>
                <p class="add-text">为了保障您的权益</p>
                <p class="add-text">请扫码留下您的消费记录</p>
                <p class="add-text">还可以积分哦！</p>
            </div>
        </div>
        <div id="show-img-info" v-if="nowImg===''?false:true" @click.stop="hideImg">
            <img :src="nowImg" alt="" @click.stop="">
            <span class="close" @click="hideImg">关闭</span>
        </div>
        <div id="show-loading-pay" v-if="showPayLoding">
            <div class="loading-box">
                <p class="loading-info">支付中请等待...</p>
                <div class="cancel-pay" @click="deletePayment(orderId)">{{canDeletepayment?'取消支付':('取消支付('+delPaymentLodingTime+'s)')}}</div>
            </div>
        </div>
        <div class="cancel-info" v-if="showCancelInfo">
            <p>取消支付成功！如果顾客已付款，系统会在24小时内将款项原路退回至顾客账户</p>
            <button @click="showCancelInfo=false">确定</button>
        </div>
        <div class="test-pay" v-if="showTestPayCode" @click="showTestPayCode=false">
            <input type="text" v-model="testPayCode" @click.stop="" />
            <button @click.stop="testPay">确定</button>
            <button @click.stop="deletePayment(orderId)">取消</button>
        </div>
        <div class="recharge" v-if="showRecharge">
            <div class="recharge-box" :style="showChargeType?'height:auto;padding:.2rem 0;':''">
                <div class="recharge-tit">会员充值</div>
                <div class="vip-info">
                    <span class="name">会员名称:{{vipData.name}}</span>
                    <span class="count-info right">会员账号:{{vipData.mobile}}</span>
                </div>
                <div class="customize-money" v-if="!showChargeType">
                    <span>自定义金额：</span>
                    <input type="text" v-model="inputVipMoney" name="" id="" placeholder="充值金额" />
                </div>
                <span v-if="!showChargeType">
                    <!-- this.$createScroll('scroll_store'); -->
                    <div class="recharge-rules" id="recharge">
                        <ul>
                            <li v-for="(item,index) in chargeRules" :key="index" @click="chargeVip(item)">{{item.name}}</li>
                        </ul>
                    </div>
                    <div class="confirm-box">
                        <button @click="showRecharge=false">取消</button>
                        <button class="yes" @click="chargeVip(null)">确定</button>
                    </div>
                </span>
                <div class="money-info" v-if="showChargeType">
                    <div class="money-info-box">
                        <div class="back">
                            <span @click="showChargeType=false">返回</span>
                        </div>
                        <span class="amount">￥{{curVipChargeInfo.amount}}</span>
                        <div class="code">流水号：{{curVipChargeInfo.code}}</div>
                    </div>
                    <div class="pay">
                        <button @click="chargePay">在线支付</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="alert-pwd" v-if="showAlertPwd" @click="showAlertPwd=false">
            <div class="alert-pwd-wrap" @click.stop="">
                <div class="inner-wrap">
                    <span>请输入授权密码</span>
                    <input type="password" name="" @keydown.enter="checkDiscountPwd" v-model="disCountPwd" placeholder="请输入密码" id="" />
                    <div>
                        <button @click="checkDiscountPwd">确定</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="show-specs" v-if="showSpecs" @click.stop="showSpecs=false;">
            <div class="spec-wrap">
                <ul>
                    <li @click.stop="addProductForSpec(curSelItem.id, true,null,false,false,1);showSpecs=false;">
                        <span class="count">1个</span>
                        <span class="amount">￥{{curSelItem.salesPrice}}</span>
                    </li>
                    <li v-for="(item,index) in curSelItem.specs" :key="index" @click.stop="addProductForSpec(curSelItem.id, true,null,false,false,item.spec);showSpecs=false;">
                        <span class="count">{{item.spec}}个</span>
                        <span class="amount">￥{{item.price}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="note" v-if="showSubNote" @click="showSubNote = false">
            <div class="note-wrap" @click.stop="">
                <div class="tit">备注(可不填)</div>
                <div class="note-inp">
                    <input type="text" v-model="subNote" placeholder="备注，选填" />
                </div>
                <div class="note-sure">
                    <button @click.stop="submitOrder">确认提交</button>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
import { url } from '@/router/url.js';
import {BASE_URL} from "./../../urlConfig";

export default {
  	data(){
  		return{
            showSubNote:false,
            subNote:"",
            seledOrderCount:0,
            curSelItem:{},
            showCarSeledDetail:false,
            wipeZeroMoney:'',
            checkedWipeZero:false,
            showDiscount:false,
            showZero:false,
            disCountPwd:"",
            showAlertPwd:false,
            showSetWrap:false,//是否显示抹零设置窗口
            lastDiscount:0,
            firstDiscount:0,
            discountVals:[0,1,2,3,4,5,6,7,8,9],
            curVipChargeInfo:{},
            showChargeType:false,//当前是否显示会员支付选择方式
            inputVipMoney:"",//会员充值自定义金额
            chargeRules:[],//充值规则
            showRecharge:false,
            canClick:true,
            showTestPayCode:false,//是否显示测试支付框
            testPayCode:"",//测试用code
            showCancelInfo:false,
            showPayLoding:false,//是否显示支付等待
            canDeletepayment:false,//是否能取消支付
            delPaymentLodingTime:15,//支付数秒时间
            nowImg:'',
  			goodsData:[{}], // 商品列表
			curIdx:0, // 当前选择商品分类索引
			showCarDetail: false, // 控制显示购物车详情
			showPayBox: false, // 控制显示支付框
			showCode: false, // 控制显示二维码
            showDelConfirm: false, // 控制显示删除订单
			storeId: '', // 店铺id
			iScrollBtn: false, // 控制非IOS机型下，滚动条样式
			img: url,

			orderId: '', // 订单id
			choiceArr: [], // 选择商品列表

			totalPrice: {
			    count: 0, // 总数量
			    total: 0, // 总计金额
			    discount: 0, // 优惠金额
                amount: 0, // 最终价格
                removeZero:0,
			},

			animateDom: {}, // 动画dom节点
			carDom: {}, // 购物车dom节点
			curPaymentId: '', // 当前支付id

			addGoodBtn: true, // 控制添加商品
			reduceGoodBtn: true, // 控制减少商品
            tableNo:'',//桌号
            notes:'',//备注

            payBtn: true, // 控制支付请求

            payImgUrl: '',

            intervalTimer: '', // 定时器对象

            clerkCashSales: false, // 是否支持现金支付

            newOrderStatus: { // 判断需要生成新订单的状态
                UNFINISHED:1,
                FINISHED:1,
                CANCELED:1,
                REFUNDED:1,
            },

            goodNumber: '', //数字键盘输入商品数量
            curProductId: '', // 当前点击的商品
            showNumBox: false, // 显示数字键盘

            canclePaymentBtn: true, // 控制取消支付
            timeDown:'2:59',
            timeDownTimer:'',

            isOnline: true, // 是否是在线支付
            offlinePayType: '', // 二维码支付时支付类型

            vipLoginApiBtn: true, // 控制会员二维码接口
            isqrcode: false, // 显示添加会员二维码
            vipLoginTimer: undefined, // 会员登录轮询
            vipData: undefined, // 会员数据
            clerkMemberSwitch: false, // 控制是否有跳过按钮
            showEnterPhone: true, // 显示输入手机号
            EnterPhone:'',//手机号
            vipPhoneList: '', //存在多个手机号重复数组
            product:'',//搜索商品
            productList:[],
            payCode:'',
            payType:'PAYCARD',
            delPaymentApiBtn:true,
            paymentBtn:true,
            seledOrder:[],//已点商品
            showSpecs:false,
            canDel:false,//是否允许删除已下单列表
            pwdType:"disAndZero",
  		}
  	},
    watch:{
       //搜索获取商品
        product ( val ) {
            if ( !(val.replace(/\s/g,'')) ) {
                this.productList = [];
                return;
            }
            this.$http.get('products/search?storeId='+this.storeId+'&q='+encodeURI(val)).then((res)=>{
                this.productList = res.data;
            })
        },
        EnterPhone ( val ) {
            if ( !(val.replace(/\s/g,'')) ) {
                this.vipPhoneList = [];
                return;
            }
            if(val.length<4){
                return;
            }
            this.$http.get(BASE_URL+'/v1/member/members-search?storeId='+this.storeId+'&q='+val).then((res)=>{
                for (var i = 0; i < res.data.length; i++) {
                    res.data[i].amount = res.data[i].amount.toFixed(2);
                }
                this.vipPhoneList = res.data;
            })
        },
        showChargeType(val){
            if(!val){
                // this.$createScroll('recharge');
            }
        }
    },
  	methods: {
        submitOrder(){
            
            if(this.choiceArr.length == 0){
                this.$message({
                    message: "请选择商品再提交",
                    showClose: true,
                    customClass: 'error'
                }); 
                return;
            }
            this.$http({
                url:"/submi",
                method:"POST",
                data:{
                    orderId:this.orderId,
                    note:this.subNote
                }
            }).then(res=>{
                if(res.data.result.code == 200){
                    this.$message({
                        message: res.data.result.msg,
                        showClose: true,
                        customClass: 'success'
                    });
                    // this.orderId = '';
                    sessionStorage.removeItem('orderId');
                    this.choiceArr = [];
                    this.totalPrice = {
                        count: 0, // 总数量
                        total: 0, // 总计金额
                        discount: 0, // 优惠金额
                        amount: 0, // 最终价格
                        removeZero: 0, // 最终价格
                    }

                    this.showPayBox = false;
                    this.showCarDetail = false;
                    this.getGoods();
                    if(this.$route.query.numId){
                        this.numId = this.$route.query.numId;
                        this.getSeledOrder(this.$route.query.numId);
                    }
                    setTimeout(()=>{
                        this.showSubNote = false;
                        // this.$router.push({path:"/table"});
                        this.$router.go(-1);
                    },300);
                }else{
                    this.$message({
                        message: res.data.result.msg,
                        showClose: true,
                        customClass: 'error'
                    });
                }
            });
            this.showSubNote = false;
        },
        returnMoney(){
            this.$http({
                url:BASE_URL+"/v1/pos/return-order",
                method:"POST",
                data:{
                    orderId:this.orderId
                }
            }).then(res=>{
                console.log(res);
                if(res.data.result.code == 200){
                    let body = res.data.data;
                    this.choiceArr = body.items;
                    this.totalPrice = {
                        count:    body.count, // 总数量
                        total:    body.total, // 总计金额
                        discount: body.discount, // 优惠金额
                        amount:   body.amount, // 最终价格
                        removeZero:   body.removeZero, // 最终价格
                    }
                    this.showPayBox=false;
                    if(this.$route.query.numId){
                        this.numId = this.$route.query.numId;
                        this.getSeledOrder(this.$route.query.numId);
                    }
                }
            });
        },
        //   
        wipeZero(){
            if(!this.orderId){
                this.$message({
                    message: "暂无订单",
                    customClass: 'error'
                });
                return;
            }
            if(Number(this.wipeZeroMoney) > this.totalPrice.amount.toFixed(2)){
                this.wipeZeroMoney = this.totalPrice.amount.toFixed(2);
            }
            let amount = this.wipeZeroMoney;
            console.log(amount);
            this.$http({
                url:BASE_URL+"/v1/pos/remove-zero",
                method:"POST",
                data:{
                    orderId:this.orderId,
                    amount
                }
            }).then(res=>{
                if(res.data.result.code == 400){
                    this.$message({
                        message: res.data.result.msg,
                        showClose: true,
                        customClass: 'error'
                    });
                    return; 
                }else if(res.data.result.code == 200){
                    this.$message({
                        message: res.data.result.msg,
                        customClass: 'success'
                    });
                    this.showSetWrap = false;
                    this.showAlertPwd = false;
                    this.disCountPwd = "";

                    let body = res.data.data;
                    this.choiceArr = body.items;
                    this.totalPrice = {
                        count:    body.count, // 总数量
                        total:    body.total, // 总计金额
                        discount: body.discount, // 优惠金额
                        amount:   body.amount, // 最终价格
                        removeZero:   body.removeZero, // 最终价格
                    }
                    this.checkedWipeZero = false;
                }
            })
        },
        showPwd(){
            if(this.showSetWrap){
                return;
            }
            this.showAlertPwd=true;
            this.pwdType = "disAndZero";
            // this.showSetWrap=true;
        },
        checkDiscountPwd(){
            if(!this.disCountPwd){
               this.$message({
                    message: "请输入密码",
                    customClass: 'error'
                });
                return; 
            }
            let pwd = new Base64();
            let pwdStr = 'hxbs 123.999'+ pwd.encode(this.disCountPwd);
            this.$http({
                url:BASE_URL+"/v1/pos/judge-psw",
                method:"POST",
                data:{
                    storeId:this.storeId,
                    judgePsw:pwdStr
                }
            }).then(res=>{
                if(res.data.code == 400){
                    this.$message({
                        message: res.data.msg,
                        customClass: 'error'
                    });
                    return; 
                }else if(res.data.code == 200){
                    if(this.pwdType == "disAndZero"){
                        this.showSetWrap = true;
                        this.showAlertPwd = false;
                        this.disCountPwd = "";
                    }else if(this.pwdType == "reduceProduct"){
                        this.canDel = true;
                        this.showAlertPwd = false;
                    }
                }
            })
        },
        //打折
          discountThisOrder(){
            if(!this.orderId){
                this.$message({
                    message: "暂无订单",
                    customClass: 'error'
                });
                return;
            }

            this.$http({
                url:BASE_URL+"/v1/pos/return-order",
                method:"POST",
                data:{
                    orderId:this.orderId
                }
            }).then(res=>{
                console.log(res);
                if(res.data.result.code == 200){
                    let body = res.data.data;
                    this.choiceArr = body.items;
                    this.totalPrice = {
                        count:    body.count, // 总数量
                        total:    body.total, // 总计金额
                        discount: body.discount, // 优惠金额
                        amount:   body.amount, // 最终价格
                        removeZero:   body.removeZero, // 最终价格
                    }
                    if(this.$route.query.numId){
                        this.numId = this.$route.query.numId;
                        this.getSeledOrder(this.$route.query.numId);
                    }
                    // 
                    
                    if(this.firstDiscount == 0 && this.lastDiscount == 0){
                        if(this.wipeZeroMoney != ''){
                            if(!/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(this.wipeZeroMoney)){
                                this.$message({
                                    message: "输入错误",
                                    showClose: true,
                                    customClass: 'error'
                                });
                                return;
                            }
                            this.wipeZero();
                        }
                        this.showSetWrap = false;
                        return; 
                    }
                    // this.orderId = sessionStorage.getItem('orderId');
                    let percent = parseFloat((`${this.firstDiscount}${this.lastDiscount}`)/100);
                    this.$http({
                        url:BASE_URL+"/v1/pos/discount",
                        method:"POST",
                        data:{
                            orderId:this.orderId,
                            percent
                        }
                    }).then(res=>{
                        if(res.data.result.code == 400){
                            this.$message({
                                message: res.data.result.msg,
                                customClass: 'error'
                            });
                            return; 
                        }else if(res.data.result.code == 200){
                            this.$message({
                                message: res.data.result.msg,
                                customClass: 'success'
                            });
                            this.showSetWrap = false;
                            this.showAlertPwd = false;
                            this.disCountPwd = "";

                            let body = res.data.data;
                            this.choiceArr = body.items;
                            this.totalPrice = {
                                count:    body.count, // 总数量
                                total:    body.total, // 总计金额
                                discount: body.discount, // 优惠金额
                                amount:   body.amount, // 最终价格
                                removeZero:   body.removeZero, // 最终价格
                            }
                            if(this.wipeZeroMoney != ''){
                                if(!/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(this.wipeZeroMoney)){
                                    this.$message({
                                        message: "输入错误",
                                        showClose: true,
                                        customClass: 'error'
                                    });
                                    return;
                                }
                                this.wipeZero();
                            }
                        }
                    })
                    // 
                }
            });

        },
        //   
        goVipCharge(){
            this.showRecharge=true;
            this.showPayBox=false;
            // this.$createScroll('recharge');
        },
        chargePay(){
           let _this = this;
            this.canDeletepayment = false;
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    var resultArr = result.split(",");
                    // 支付
                    _this.payCode = resultArr[resultArr.length-1];
                    // _this.showPayLoding = true;
                    _this.showPayBox = false;
                    if(result === 'scan resultStr is here'||_this.payCode === ''||result===''){
                        _this.$message({
                            message: '支付失败，请重新扫描。',
                            customClass: 'error'
                        })
                        _this.showPayLoding = false;
                        return;
                    }
                    let data = {
                        "orderId": _this.curVipChargeInfo.id,
                        "channel": "PAYCARD",
                        "amount": _this.curVipChargeInfo.amount,
                        "authCode": _this.payCode,
                        "notes": "会员充值"
                    }
                    
                    _this.$http.put(BASE_URL+'/v1/clerk/scanPayments', data).then((res)=>{
                        _this.payCode = '';
                        if ( res.status === 202 ) {
                            let overTimeNum = 0;
                            let curOrderId = _this.curVipChargeInfo.id;

                            // _this.delPaymentLodingTimer();
                            _this.payLoadTimer = setInterval(()=>{
                                overTimeNum += 2;
                                if ( overTimeNum >= 180 ) { // 超过180秒，取消订单
                                    clearInterval(_this.payLoadTimer);
                                    // _this.createOrder();
                                    return;
                                }
                                // let that = _this;
                                _this.payLoad(curOrderId, function () {
                                    clearInterval(_this.payLoadTimer);

                                    // _this.createOrder();
                                    _this.showPayLoding = false;
                                    // _this.$router.push({path:'/buySuccess/'+sendOrderId});//跳转购买成功页面
                                    _this.$message({
                                        message: '充值成功',
                                        customClass: 'success'
                                    });
                                    _this.getMemberData(_this.vipData.id);
                                    _this.showChargeType = false;
                                    _this.showRecharge = false;
                                    _this.inputVipMoney = "";
                                });
                            }, 2000)
                        } else {
                            
                            // _this.$router.push({path:'/buySuccess/'+sendOrderId});//跳转购买成功页面
                            _this.$message({
                                message: '充值成功',
                                customClass: 'success'
                            });
                            _this.getMemberData(_this.vipData.id);
                            _this.showChargeType = false;
                            _this.showRecharge = false;
                            _this.inputVipMoney = "";
                            // _this.createOrder();
                        
                        }
                    }).catch((err)=>{
                        _this.payCode = '';
                        _this.showPayLoding = false;
                        if ( err.response.status === 400 ) {
                            _this.showPayBox = true;
                        }
                    })
                    // 支付结束
                }
            });
        },
        // 获取会员信息
        getMemberData: function ( memberId ) {
            this.$http.get(BASE_URL+"/v1/pos/"+this.storeId+'/members?memberId='+memberId).then((res)=>{
                // this.vipData = res.data;
                this.vipData.amount = res.data.amount.toFixed(2);
            });
        },
        chargeVip(item){
            console.log(this.inputVipMoney)

            if(item){
                this.inputVipMoney = "";
            }else{
                if(!/^(0|[1-9][0-9]{0,9})(\.[0-9]{1,2})?$/.test(this.inputVipMoney)|| this.inputVipMoney == 0){
                    this.$message({
                        message: '充值金额输入有误',
                        showClose: true,
                        customClass: 'error'
                    });
                    return;
                }
                let rechargeLimit = JSON.parse(localStorage.getItem("rechargeLimit"));
                if(Number(this.inputVipMoney)<Number(rechargeLimit)){
                    this.$message({
                        message: '充值金额不能小于'+Number(rechargeLimit)+'元',
                        showClose: true,
                        customClass: 'error'
                    });
                    return;
                }
            }
            this.$http({
                url:BASE_URL+"/v1/pos/member-charges/"+this.$uuid(),
                method:"PUT",
                data:{
                    "storeId": this.storeId,
                    "memberId": this.vipData.id,
                    "amount": parseFloat(this.inputVipMoney?this.inputVipMoney:item.depositAmount),
                    "chargeRuleId": this.inputVipMoney?'':item.id,
                    "type":"CLERK"
                }
            }).then(res=>{
                this.curVipChargeInfo = res.data;
                this.showChargeType = true;
                console.log(res);
            })
        },
        testPay(){
            this.showPayLoding = true;
            this.showPayBox = false;
            this.showTestPayCode = true;
            let data = {
                        "orderId": this.orderId,
                        "channel": this.payType,
                        "amount": this.totalPrice.amount,
                        "authCode": this.testPayCode,
                        "tableNo": this.tableNo,
                        "notes": this.notes
                    }
                    let sendOrderId = this.orderId;
                    // if ( this.totalPrice.count <= 0 && this.totalPrice.total <= 0 ) {
                    //     return;
                    // }
                    this.$http.put(BASE_URL+'/v1/clerk/scanPayments', data).then((res)=>{
                        this.testPayCode = '';
                        if ( res.status === 202 ) {
                            let overTimeNum = 0;
                            let curOrderId = this.orderId;

                            this.delPaymentLodingTimer();
                            this.payLoadTimer = setInterval(()=>{
                                overTimeNum += 2;
                                if ( overTimeNum >= 180 ) { // 超过180秒，取消订单
                                    clearInterval(this.payLoadTimer);
                                    // this.createOrder();
                                    return;
                                }
                                // let that = _this;
                                this.payLoad(curOrderId,()=> {
                                    clearInterval(this.payLoadTimer);

                                    this.createOrder();
                                    this.showPayLoding = false;
                                    this.$router.push({path:'/buySuccess/'+sendOrderId});//跳转购买成功页面
                                });
                            }, 2000)
                        } else {
                            
                            this.$router.push({path:'/buySuccess/'+sendOrderId});//跳转购买成功页面

                            this.createOrder();
                        
                        }
                    }).catch((err)=>{
                        this.testPayCode = '';
                        this.showPayLoding = false;
                        if ( err.response.status === 400 ) {
                            this.showPayBox = true;
                            // this.searchOrderType();
                        }
                    });
        },
 
        //   扫一扫
        scanCode(){
            let _this = this;
            this.canDeletepayment = false;
            wx.scanQRCode({
                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                success: function (res) {
                    var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                    var resultArr = result.split(",");
                    // 支付
                    _this.payCode = resultArr[resultArr.length-1];
                    _this.showPayLoding = true;
                    _this.showPayBox = false;
                    if(result === 'scan resultStr is here'||_this.payCode === ''||result===''){
                        _this.$message({
                            message: '支付失败，请重新扫描。',
                            customClass: 'error'
                        })
                        _this.showPayLoding = false;
                        return;
                    }
                    let data = {
                        "orderId": _this.orderId,
                        "channel": _this.payType,
                        "amount": _this.totalPrice.amount,
                        "authCode": _this.payCode,
                        "tableNo": _this.tableNo,
                        "notes": _this.notes
                    }
                    let sendOrderId = _this.orderId;
                    if ( _this.totalPrice.count <= 0 && _this.totalPrice.total <= 0 ) {
                        return;
                    }
                    _this.$http.put(BASE_URL+'/v1/clerk/scanPayments', data).then((res)=>{
                        _this.payCode = '';
                        if ( res.status === 202 ) {
                            let overTimeNum = 0;
                            let curOrderId = _this.orderId;

                            _this.delPaymentLodingTimer();
                            _this.payLoadTimer = setInterval(()=>{
                                overTimeNum += 2;
                                if ( overTimeNum >= 180 ) { // 超过180秒，取消订单
                                    clearInterval(_this.payLoadTimer);
                                    _this.createOrder();
                                    return;
                                }
                                // let that = _this;
                                _this.payLoad(curOrderId, function () {
                                    clearInterval(_this.payLoadTimer);

                                    _this.createOrder();
                                    _this.showPayLoding = false;
                                    // _this.$router.push({path:'/buySuccess/'+sendOrderId});//跳转购买成功页面
                                    // _this.$router.push({path:'/table'});//跳转购买成功页面
                                    _this.$router.go(-1);//跳转购买成功页面
                                    _this.$message({
                                        message: "支付成功",
                                        customClass: 'success'
                                    });
                                    _this.orderId = "";
                                });
                            }, 2000)
                        } else {
                            
                            // _this.$router.push({path:'/buySuccess/'+sendOrderId});//跳转购买成功页面
                            // _this.$router.push({path:'/table'});//跳转购买成功页面
                            _this.$router.go(-1);//跳转购买成功页面
                            _this.$message({
                                message: "支付成功",
                                customClass: 'success'
                            });
                            _this.orderId = "";

                            _this.createOrder();
                        
                        }
                    }).catch((err)=>{
                        _this.payCode = '';
                        _this.showPayLoding = false;
                        if ( err.response.status === 400 ) {
                            _this.showPayBox = true;
                            _this.searchOrderType();
                        }
                    })
                    // 支付结束
                }
            });
        },
        delPaymentLodingTimer: function () {
            setTimeout(()=>{
                this.delPaymentLodingTime--;
                if ( this.delPaymentLodingTime <= 0 ) {
                    this.canDeletepayment = true;
                    this.delPaymentLodingTime = 15;
                } else {
                    this.delPaymentLodingTimer();
                }
            },1000)
        },
        // 等待支付轮训接口
        payLoad: function ( orderId, fn ) {
            this.$http.get(BASE_URL+'/v1/pay/micropay/query?orderId='+orderId).then((res)=>{
                if ( res.status === 200 ) {
                    fn();
                }else if(res.status === 400 || res.status === 500){
                    this.showPayBox = true;
                    this.payApiBtn = true;
                    this.paymentBtn = true;
                    this.showPayLoding = false;
                    clearInterval(this.payLoadTimer);
                }
            }).catch(( err )=>{
                this.showPayBox = true;
                this.payApiBtn = true;
                this.paymentBtn = true;
                this.showPayLoding = false;
                clearInterval(this.payLoadTimer);
                window.location.reload(true);
            })
        },
         // 查询订单状态
        searchOrderType: function () {
            // this.$http.get(BASE_URL+'/v1/pos/orders/' + this.orderId).then((res)=>{
            //     if ( this.newOrderStatus[res.data.status] ) {
            //         this.createOrder();
            //     }
            // });
            if(this.$route.query.numId){
                this.numId = this.$route.query.numId;
                this.getSeledOrder(this.$route.query.numId);
            }
        },
        //取消支付
        deletePayment( orderId ){
            if ( !this.canDeletepayment ) {
                return;
            } else {
                this.paymentBtn=true;
                clearInterval(this.payLoadTimer);

                if ( !this.delPaymentApiBtn ) {
                    return;
                }
                this.delPaymentApiBtn = false;
                this.$http.delete(BASE_URL+'/v1/pos/payments/'+orderId).then((res)=>{
                    this.showPayLoding = false;
                    this.delPaymentApiBtn = true;
                    this.orderId = "";
                    // this.createOrder();
                    this.showCancelInfo = true;
                    window.location.reload(true);
                }).catch(()=>{
                    this.showPayLoding = false;
                    this.delPaymentApiBtn = true;
                    this.orderId = "";
                })
            }
        },
        //   显示商品图片信息
        showImg(imgInfo){
            console.log(imgInfo)
            if(imgInfo){
                this.nowImg = imgInfo;
            }
        },
        hideImg(){
            this.nowImg = '';
        },
        //输入手机号
        showEnterPhoneFn(){
            this.EnterPhone = this.EnterPhone.replace(/\s+/g,'') 
            if ( this.EnterPhone.length<4 ) {
                this.$message.error({
                    message: "手机号至少4位",
                    customClass: 'error',
                });
                return;
            }
            this.$http.get(BASE_URL+'/v1/member/members-search?storeId='+this.storeId+'&q='+this.EnterPhone).then((res)=>{
                for (var i = 0; i < res.data.length; i++) {
                    res.data[i].amount = res.data[i].amount.toFixed(2);
                }
                // if ( res.data.length == 1 ) {
                //     this.selPhoneVip(res.data[0]);
                // } else {
                // }
                this.vipPhoneList = res.data;
            })
        },
        // 选择会员
        selPhoneVip: function ( vipItem ) {
            this.$http.put('orders/'+this.orderId+'/attachMember?memberId='+vipItem.id).then((res)=>{
                this.closeVipCode();
                this.vipData = vipItem;
                this.$message({
                    message: '成功绑定会员，如当前有自定义折扣，请重新折扣。',
                    customClass: 'success',
                    duration:7890
                });
                let body = res.data;
                this.choiceArr = body.items;
                this.totalPrice = {
                    count: body.count, // 总数量
                    total: body.total, // 总计金额
                    discount: body.discount, // 优惠金额
                    amount: body.amount, // 最终价格
                    removeZero:body.removeZero,
                }
            })
        },
        // 收缩展开商品分类
        traggerType: function ( evnet ) {
            if ( $(event.target).parent().css('height') == '50px' ) {
                $(event.target).parent().css('height', 'auto');
            } else {
                $(event.target).parent().css('height', '50px');
            }
        },
        openNumberBox: function ( productId ) {
            this.showNumBox = true;
            this.curProductId = productId;
            this.goodNumber = '';
        },
        clickNum: function ( num ) {
            if ( !this.goodNumber && num == '0' ) {
                return;
            }
            if ( this.goodNumber.length >= 4 ) {
                return;
            }
            this.goodNumber += num;
        },
        delNumber: function () {
            this.goodNumber = this.goodNumber.substring(0, this.goodNumber.length-1);
        },
        saveNumber: function () {
            if ( !this.goodNumber ) {
                return;
            }
            this.addProduct(this.curProductId, true, parseInt(this.goodNumber),false);
            this.showNumBox = false;
        },
        clickInput: function ( event ) {
        },
  		// 点击选好了触发
  		goPayType: function () {
            if(this.choiceArr.length==0&&this.seledOrder.length==0){
                this.$message({
                    message: "亲，请选择商品",
                    customClass: 'error'
                });
                return;
            }
            this.showEnterPhone = true;
            this.EnterPhone = '';
            if(this.$route.query.numId){
                this.$http({
                    url:"/get-numOrder",
                    method:"GET",
                    params:{
                        numId:this.$route.query.numId
                    }
                }).then(res=>{
                    if(res.data){
                        let items = res.data.items;
                        
                        this.choiceArr = this.getSeriData("other",items);
                        
                    }else{
                        this.seledOrder = [];
                        this.choiceArr = [];
                        this.orderId = "";
                        this.showCarSeledDetail = false;
                    }
                    
                });
            }
            // let choiceArr = this.choiceArr;
            // this.choiceArr = choiceArr.concat(this.seledOrder);

            // this.choiceArr = this.getSeriData("other",this.choiceArr);

            console.log(this.choiceArr)
            
            //不要会员添加
            this.showPayBox = true;
            return;

            // this.$http.get('query-binding?orderId='+this.orderId+'&type=CHECK').then((res)=>{
            //     if ( res.data.url ) {
            //         this.isqrcode = true;
            //         this.clerkMemberSwitch = !res.data.clerkMemberSwitch;
            //         setTimeout(()=>{
            //             $('#vipQrcode')[0].innerHTML='';
            //             let vipQrcode = new QRCode("vipQrcode", {
            //                 text: res.data.url,
            //                 colorDark : "#000000",
            //                 colorLight : "#ffffff",
            //                 height: 200,
            //                 width: 200,
            //                 correctLevel : QRCode.CorrectLevel.H
            //             });
            //         },200)
            //         this.vipLoginTimer = setInterval(()=>{
            //             this.vipLoginQuery(true);
            //         },2000)
            //     } else {
          	// 		this.showCarDetail = false;
          	// 		this.choiceArr.length>0?this.showPayBox=true:null;
            //     }
            // }).catch((err)=>{
            // });
          },
        showBindVipBoxOrPayByVip(){
            if(!this.vipData){
                this.$http.get('query-binding?orderId='+this.orderId+'&type=CHECK').then((res)=>{
                    // if ( res.data.url ) {
                        this.isqrcode = true;
                        this.clerkMemberSwitch = !res.data.clerkMemberSwitch;
                        setTimeout(()=>{
                            $('#vipQrcode')[0].innerHTML='';
                            let vipQrcode = new QRCode("vipQrcode", {
                                text: res.data.url,
                                colorDark : "#000000",
                                colorLight : "#ffffff",
                                height: 200,
                                width: 200,
                                correctLevel : QRCode.CorrectLevel.H
                            });
                        },200)
                        this.vipLoginTimer = setInterval(()=>{
                            this.vipLoginQuery(true);
                        },2000)
                    // } else {
                    //     this.showCarDetail = false;
                    //     this.choiceArr.length>0?this.showPayBox=true:null;
                    // }
                }).catch((err)=>{
                });
            }else{
                this.payByType('MEMBER');
            }
            
        },
  		// 切换商品分类
  		changeGoodType: function ( index ) {
  			this.curIdx = index;
  			let that = this;
  			setTimeout(()=>{
                $('.goods_item').css('height','50px');
                $('.goods_item.oneLevel').css('height','auto');
                $('.goods_item:nth-of-type(2)').css('height','auto');
  				$('.goods_item .changeNumber .addNumber').bind('moveAnimate', function ( e, curDom ) {
  					that.animateDom.css("left", $(curDom).offset().left + "px");
  					that.animateDom.css("top", $(curDom).offset().top  + "px");
  					that.shoppingCartAnimate();
  				})

                Echo.init({
                    offset: 0,//离可视区域多少像素的图片可以被加载
                　　throttle: 0, //图片延时多少毫秒加载
                    scrollDomId: 'right_goods',
                });
  			});
  		},
  		// 点击现金支付
  		placeOrder: function () {
            if ( !this.clerkCashSales ) {
                this.$message({
                    message: "不支持现金支付",
                    customClass: 'error'
                });
                return;
            }

            if ( !this.payBtn ) {
                return;
            }
            this.payBtn = false;

			// 生成订单
            let sendOrderId = this.orderId;

            this.curPaymentId = this.$uuid();
            let data = {
                "orderId": this.orderId,
                "channel": 'CASH',
                "amount": this.totalPrice.amount,
                "tableNo": this.tableNo,
                "notes": this.notes
            }
            clearInterval(this.intervalTimer);
            this.$http.put('payments', data).then((res)=>{ // 支付
                this.showPayBox = false;
                this.payBtn = true;
                // 生成新订单
                this.createOrder();
                // this.$router.push({path:'/buySuccess/'+sendOrderId});//跳转购买成功页面
                // this.$router.push({path:'/table'});//跳转购买成功页面
                this.$router.go(-1);//跳转购买成功页面
                this.$message({
                    message: "支付成功",
                    customClass: 'success'
                });
                this.orderId = "";
            }).catch(()=>{
                this.payBtn = true;
            })
  		},
  		// 通过支付宝支付
  		payByType: function ( payType ) {
            let oldOrderId = this.orderId; // 缓存订单id

            // 判断当前是否正在请求
            if ( !this.payBtn ) {
                return;
            }
            this.payBtn = false;

            this.curPaymentId = this.$uuid();
            let data = {
                "orderId": this.orderId,
                "channel": payType,
                "amount": this.totalPrice.amount,
                "tableNo": this.tableNo,
                "notes": this.notes
            }
            
            clearInterval(this.intervalTimer);
            clearInterval(this.timeDownTimer);
            
            if(payType=='alipay'){
                this.payByAlipayOrWechat( true, oldOrderId );
                return;
            }
            if(payType=='wechat'){
                this.payByAlipayOrWechat( false, oldOrderId );
                return;
            }
            this.$http.put('payments', data).then((res)=>{
                this.createOrder();
                this.payBtn = true;
                // this.$router.push({path:'/buySuccess/'+oldOrderId});//跳转购买成功页面
                this.$router.go(-1);//跳转购买成功页面
                // this.$router.push({path:'/table'});//跳转购买成功页面
                this.$message({
                    message: "支付成功",
                    customClass: 'success'
                });
                this.orderId = "";
            }).catch((res)=>{
                this.payBtn = true;
            });
  		},
        //倒计时 3min;
        timeDownFn(){
            let m=2,s=59;
            this.timeDownTimer = setInterval(()=>{
                s--;
                if(s==-1&&m==0){
                    clearInterval(this.timeDownTimer);
                    clearInterval(this.intervalTimer);
                    this.showCode = false;
                    this.canclePayment();
                    this.timeDown ='0:00'
                }else{
                    if(s==-1){
                        s = 59;
                        m--;
                    };
                    this.timeDown = m+':'+(s<10?('0'+s):s);
                }
            },1000)
        },
        // 二维码支付成功
        payOfflineSuccess: function ( channel ) {
            if ( !this.offlinePayType ) {
                return;
            }
            if ( !this.payBtn ) {
                return;
            }
            this.payBtn = false;

            this.curPaymentId = this.$uuid();
            let oldOrderId = this.orderId; // 缓存订单id
            
            this.$http.put('payments', {
                "orderId": this.orderId,
                "channel": this.offlinePayType,
                "amount": this.totalPrice.amount,
                "tableNo": this.tableNo,
                "notes": this.notes
            }).then((res)=>{
                this.createOrder();
                this.payBtn = true;
                // this.$router.push({path:'/buySuccess/'+oldOrderId});//跳转购买成功页面
                // this.$router.push({path:'/table'});//跳转购买成功页面
                this.$router.go(-1);//跳转购买成功页面
                this.$message({
                    message: "支付成功",
                    customClass: 'success'
                });
                this.orderId = "";
            }).catch((res)=>{
                this.payBtn = true;
            });
        },
        // 通过支付宝或微信支付
        payByAlipayOrWechat: function ( boo, oldOrderId ) {
            this.$http.post(BASE_URL+'/v1/pay/scan-code',{
                "orderId": oldOrderId,
                "type": boo,
                "tableNo": this.tableNo,
                "notes": this.notes
            }).then((res)=>{
                this.payImgUrl = res.data.url;
                this.showCode = true;
                this.payBtn = true;

                if ( res.data.payMode == 'CASHIER' ) {
                    this.isOnline = false;
                    boo?this.offlinePayType='ALIPAY_CASH':this.offlinePayType='WECHATPAY_CASH';
                    return;
                } else {
                    this.isOnline = true;
                }

                this.timeDown = '2:59';
                this.timeDownFn();
                this.intervalTimer = setInterval(()=>{
                    this.$http.get(BASE_URL+'/v1/pay/scan-code/query?orderId='+oldOrderId).then((res)=>{
                        if ( res.status === 200 ) {
                            clearInterval(this.intervalTimer);
                            clearInterval(this.timeDownTimer);
                            this.createOrder();
                            this.$router.push({path:'/buySuccess/'+oldOrderId});//跳转购买成功页面
                            this.showPayBox = false;
                        }
                    }).catch(()=>{
                        clearInterval(this.intervalTimer);
                        clearInterval(this.timeDownTimer);
                        this.showPayBox = false;
                        this.showCode = false;
                        this.showDelConfirm = false;
                    })
                }, 2000)
            }).catch(()=>{
                this.payBtn = true;
            })
        },
        // 关闭二维码框
        closeCodeImg: function () {
            if ( this.isOnline ) {
                this.showDelConfirm = true;
            } else {
                this.showCode = false;
            }
        },
  		// 获取商品列表
  		getGoods(){
            if ( !this.storeId ) {
                return;
            }
			this.$http.get('get-ps?storeId='+ this.storeId).then((res)=>{
                this.goodsData = res.data;
                let that = this;
                setTimeout(()=>{
                	$('.goods_item .changeNumber .addNumber').bind('moveAnimate', function ( e, curDom ) {
                		that.animateDom.css("left", $(curDom).offset().left + "px");
                		that.animateDom.css("top", $(curDom).offset().top  + "px");
                		that.shoppingCartAnimate();
                	})

                    Echo.init({
                        offset: 0,//离可视区域多少像素的图片可以被加载
                    　　throttle: 0, //图片延时多少毫秒加载
                        scrollDomId: 'right_goods',
                    });
                });
			})
  		},
  		// 购物车动画
  		shoppingCartAnimate(){
            var flyElm = this.animateDom.clone();
            $('.takeOrder').append(flyElm);
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
        addProductForSpec: function ( productId, btn, num ,ISmsg,label=false,productCount=1) {
           
            if(!this.canClick){
                // this.$message({
                //     message: "点击不能过快",
                //     showClose: true,
                //     duration:1000,
                //     type: 'error'
                // })
                return;
            }
            if ( productId == '0' && !num ) {
                return;
            }
            if ( !this.addGoodBtn ) {
                return;
            }
              this.addGoodBtn = false;
            let data;
            if(label){
                data = {
                    productCount,
                    "setMealId":productId
                }
            }else{
                data = {
                    productCount,
                    "productId":productId,
                    "setMealId":0
                }
            }
            // if ( productId == '0' ) {
            //     data = {
            //         "productId": productId,
            //         "productCount": 1,
            //         "amount": num
            //     }
            // }
            if(!this.orderId){
                //没有就新建id
                let createData;
                // let url='?createTime='+new Date().getTime()+'&storeId='+this.storeId+'&userName='+userName;
                // let url='?createTime='+new Date().getTime()+'&storeId='+this.storeId;
                if( this.vipData ){
                    // url+='&memberId='+this.vipData.id;
                    createData = {
                        storeId:this.storeId,
                        numId:this.numId,
                        memberId:this.vipData.id,
                        createTime:new Date().getTime()
                    };
                }else{
                   createData = {
                        storeId:this.storeId,
                        numId:this.numId,
                        createTime:new Date().getTime()
                    }; 
                }

                this.$http.post('/create-orders',createData).then((res)=>{
                    sessionStorage.setItem('orderId',res.data.id);
                    this.orderId = res.data.id;
                    this.$http.post('orders/add', {...data,"orderId":res.data.id}).then((res)=>{
                        if(res.data.result.code == 200){
                            if ( btn ) {
                                $('#'+productId).trigger('moveAnimate', $('#'+productId));
                            }
                            if ( ISmsg ) {
                                this.$message({
                                    message: "添加成功",
                                    customClass: 'success'
                                });
                            }
                            let body = res.data.data;
                            this.choiceArr = body.items;
                            this.totalPrice = {
                                count: body.count, // 总数量
                                total: body.total, // 总计金额
                                discount: body.discount, // 优惠金额
                                amount: body.amount, // 最终价格
                                removeZero: body.removeZero, // 最终价格
                            }
                        }else{
                            this.$message({
                                message: res.data.result.msg,
                                customClass: 'error'
                            });
                        }
                        this.addGoodBtn = true;
                        this.showSpecs=false;
                    }).catch((err)=>{
                        this.addGoodBtn = true;
                        if ( err.response.status === 400 ) {
                            this.$http.get('orders/' + this.orderId).then((res)=>{
                                if ( this.newOrderStatus[res.data.status] ) {
                                    sessionStorage.removeItem('orderId');
                                } else if ( res.data.status == 'NOTSURE' ) {
                                    // this.$router.push('/orderDetail/'+this.orderId);
                                    // this.showDelConfirm = true;
                                }
                            });
                        }
                    })
                })
                return;
            }
  		    this.$http.post('orders/add', {...data,"orderId":this.orderId}).then((res)=>{
                if(res.data.result.code == 200){
                    if ( btn ) {
                        $('#'+productId).trigger('moveAnimate', $('#'+productId));
                    }
                    let body = res.data.data;
                    this.choiceArr = body.items;
                    this.totalPrice = {
                        count: body.count, // 总数量
                        total: body.total, // 总计金额
                        discount: body.discount, // 优惠金额
                        amount: body.amount, // 最终价格
                        removeZero: body.removeZero, // 最终价格
                    }
                }else{
                   this.$message({
                        message: res.data.result.msg,
                        customClass: 'error'
                    }); 
                }
                  this.addGoodBtn = true;
                  this.showSpecs=false;
  		    }).catch((err)=>{
  		    	this.addGoodBtn = true;
                if ( err.response.status === 400 ) {
                    this.$http.get('orders/' + this.orderId).then((res)=>{
                        if ( this.newOrderStatus[res.data.status] ) {
                            // setTimeout(()=>{
                            //     this.$message({
                            //         message: "已重新生成订单",
                            //         customClass: 'error'
                            //     });
                            // }, 2000)
                            this.createOrder();
                        } else if ( res.data.status == 'NOTSURE' ) {
                            // this.$router.push('/orderDetail/'+this.orderId);
                            // this.showDelConfirm = true;
                        }
                    });
                }
              })
              this.canClick = false;
                setTimeout(()=>{
                    this.canClick = true;
                },500);
  		},
  		// 添加商品
  		addProduct: function ( productId, btn, num ,ISmsg,label=false,productCount=1) {
            if(this.curSelItem.specs){
                if(this.curSelItem.specs.length){
                    this.showSpecs = true;
                    return;
                }
            }
            if(!this.canClick){
                // this.$message({
                //     message: "点击不能过快",
                //     showClose: true,
                //     duration:1000,
                //     type: 'error'
                // })
                return;
            }
            if ( productId == '0' && !num ) {
                return;
            }
            if ( !this.addGoodBtn ) {
                return;
            }
              this.addGoodBtn = false;
            let data;
            if(label){
                data = {
                    productCount,
                    "setMealId":productId
                }
            }else{
                data = {
                    productCount,
                    "productId":productId,
                    "setMealId":0
                }
            }
            // if ( productId == '0' ) {
            //     data = {
            //         "productId": productId,
            //         "productCount": 1,
            //         "amount": num
            //     }
            // }
            if(!this.orderId){
                //没有就新建id
                let createData;
                // let url='?createTime='+new Date().getTime()+'&storeId='+this.storeId+'&userName='+userName;
                // let url='?createTime='+new Date().getTime()+'&storeId='+this.storeId;
                if( this.vipData ){
                    // url+='&memberId='+this.vipData.id;
                    createData = {
                        storeId:this.storeId,
                        numId:this.numId,
                        memberId:this.vipData.id,
                        createTime:new Date().getTime()
                    };
                }else{
                   createData = {
                        storeId:this.storeId,
                        numId:this.numId,
                        createTime:new Date().getTime()
                    }; 
                }

                this.$http.post('/create-orders',createData).then((res)=>{
                    sessionStorage.setItem('orderId',res.data.id);
                    this.orderId = res.data.id;
                    this.$http.post('orders/add', {...data,"orderId":res.data.id}).then((res)=>{
                        if(res.data.result.code == 200){
                            if ( btn ) {
                                $('#'+productId).trigger('moveAnimate', $('#'+productId));
                            }
                            if ( ISmsg ) {
                                this.$message({
                                    message: "添加成功",
                                    customClass: 'success'
                                });
                            }
                            let body = res.data.data;
                            this.choiceArr = body.items;
                            this.totalPrice = {
                                count: body.count, // 总数量
                                total: body.total, // 总计金额
                                discount: body.discount, // 优惠金额
                                amount: body.amount, // 最终价格
                                removeZero: body.removeZero, // 最终价格
                            }
                        }else{
                           this.$message({
                                message: res.data.result.msg,
                                customClass: 'error'
                            }); 
                        }
                        this.addGoodBtn = true;
                    }).catch((err)=>{
                        this.addGoodBtn = true;
                        if ( err.response.status === 400 ) {
                            this.$http.get('orders/' + this.orderId).then((res)=>{
                                if ( this.newOrderStatus[res.data.status] ) {
                                    sessionStorage.removeItem('orderId');
                                } else if ( res.data.status == 'NOTSURE' ) {
                                    // this.$router.push('/orderDetail/'+this.orderId);
                                    // this.showDelConfirm = true;
                                }
                            });
                        }
                    })
                })
                return;
            }
  		    this.$http.post('orders/add', {...data,"orderId":this.orderId}).then((res)=>{
                  if(res.data.result.code == 200){
                        if ( btn ) {
                            $('#'+productId).trigger('moveAnimate', $('#'+productId));
                        }
                        let body = res.data.data;
                        this.choiceArr = body.items;
                        this.totalPrice = {
                            count: body.count, // 总数量
                            total: body.total, // 总计金额
                            discount: body.discount, // 优惠金额
                            amount: body.amount, // 最终价格
                            removeZero: body.removeZero, // 最终价格
                        }
                  }else{
                     this.$message({
                        message: res.data.result.msg,
                        customClass: 'error'
                     }); 
                  }
  		        this.addGoodBtn = true;
  		    }).catch((err)=>{
  		    	this.addGoodBtn = true;
                if ( err.response.status === 400 ) {
                    // this.$http.get('orders/' + this.orderId).then((res)=>{
                    //     if ( this.newOrderStatus[res.data.status] ) {
                    //         // setTimeout(()=>{
                    //         //     this.$message({
                    //         //         message: "已重新生成订单",
                    //         //         customClass: 'error'
                    //         //     });
                    //         // }, 2000)
                    //         this.createOrder();
                    //     } else if ( res.data.status == 'NOTSURE' ) {
                    //         // this.$router.push('/orderDetail/'+this.orderId);
                    //         // this.showDelConfirm = true;
                    //     }
                    // });
                    if(this.$route.query.numId){
                        this.numId = this.$route.query.numId;
                        this.getSeledOrder(this.$route.query.numId);
                    }
                }
              })
              this.canClick = false;
                setTimeout(()=>{
                    this.canClick = true;
                },500);
  		},
  		// 减少商品
  		reduceProduct: function ( productId,item,canDel=true ) {
              if(!this.canClick){
                // this.$message({
                //     message: "点击不能过快",
                //     showClose: true,
                //     duration:1000,
                //     type: 'error'
                // })
                return;
            }
  			if ( !this.reduceGoodBtn ) {
  				return;
  			}
            this.reduceGoodBtn = false;
            let data;
            if(item.label){
                data = {
                    "productCount": 1,
                    "setMealId":item.setMealId,
                    already:item.already
                }
            }else{
                data = {
                    "productCount": item.spec,
                    "productId":productId,
                    "setMealId":0,
                    already:item.already
                }
            }
            if(canDel || this.canDel){
                this.$http.post('orders/remove', {...data,orderId:this.orderId}).then((res)=>{
                  let body = res.data;
                  
                if(body==''){
                    //订单已经删除
                    sessionStorage.removeItem('orderId');
                    this.orderId = '';
                    this.vipData = '';
                    this.choiceArr = [];
                    this.showCarDetail = false;
                    this.showPayBox = false;
                    this.totalPrice = {
                        count: 0, // 总数量
                        total: 0, // 总计金额
                        discount: 0, // 优惠金额
                        amount: 0, // 最终价格
                        removeZero: 0, // 最终价格
                    };
                    this.reduceGoodBtn = true;
                    if(this.$route.query.numId){
                        this.numId = this.$route.query.numId;
                        this.getSeledOrder(this.$route.query.numId);
                    }
                    return;
                }
  		        this.choiceArr = body.items;
  		        if ( this.choiceArr.length <= 0 ) {
  		        	this.showCarDetail = false;
  		        	this.showPayBox = false;
  		        }
  		        this.totalPrice = {
  		            count: body.count, // 总数量
  		            total: body.total, // 总计金额
  		            discount: body.discount, // 优惠金额
  		            amount: body.amount, // 最终价格
  		            removeZero: body.removeZero, // 最终价格
  		        }
                this.reduceGoodBtn = true;
                if(this.$route.query.numId){
                    this.numId = this.$route.query.numId;
                    this.getSeledOrder(this.$route.query.numId);
                }
                
                }).catch(()=>{
                    this.reduceGoodBtn = true;
                    if ( err.response.status === 400 ) {

                        if(this.$route.query.numId){
                            this.numId = this.$route.query.numId;
                            this.getSeledOrder(this.$route.query.numId);
                        }

                    }
                })
            }else{
                this.showAlertPwd = true;
                this.reduceGoodBtn = true;
                this.pwdType = "reduceProduct";
            }
  		    
            this.canClick = false;
            setTimeout(()=>{
                this.canClick = true;
            },500);
  		},
  		// 改变动画位置
  		changeAnimate: function ( e ) {
  			this.animateDom.css("left", e.screenX + "px");
  			this.animateDom.css("top", e.screenY + "px");
  		},
        // 生成订单
        createOrder: function () {
            sessionStorage.removeItem('orderId');
            this.choiceArr = [];
            this.totalPrice = {
                count: 0, // 总数量
                total: 0, // 总计金额
                discount: 0, // 优惠金额
                amount: 0, // 最终价格
                removeZero: 0, // 最终价格
            }

            this.showPayBox = false;
            this.showCarDetail = false;
        },
        // 取消支付 （取消接口）
        canclePayment: function () {
            if ( !this.canclePaymentBtn ) {
                return;
            }
            this.canclePaymentBtn = false;

            clearInterval(this.intervalTimer);
            clearInterval(this.timeDownTimer);
            this.$http.delete('payments/'+this.orderId).then((res)=>{
                this.showDelConfirm = false;
                this.showCode = false;
                this.canclePaymentBtn = true;
                this.orderId = "";
            }).catch(( err )=>{
                this.showDelConfirm = false;
                this.showCode = false;
                this.canclePaymentBtn = true;
                this.orderId = "";
            })
        },
  		delOrder: function () {
  			this.$http.delete('orders/'+ this.orderId).then((res)=>{
                this.createOrder();
                this.$message({
                    message: "订单已取消",
                    customClass: 'error'
                });
                this.showDelConfirm = false;
  			})
  		},
        // vip登录时判断是否存在订单
        vipLoginCheckOrder: function () {
            console.log('121212')
            // if ( !this.orderId ) {
            //     let url='?createTime='+new Date().getTime()+'&storeId='+this.storeId;
            //     // 没有订单就创建订单
            //     this.$http.put('/create-orders'+url).then((res)=>{
            //         sessionStorage.setItem('orderId',res.data.id);
            //         this.orderId = res.data.id;
            //         this.getVipCode();
            //     })
            // } else {
            //     this.getVipCode();
            // }
        },
        //搜索并添加商品
        shoiceProduct(item){
            this.addProduct(item.id, true,null,true);
            this.productList = [];
            this.product = '';
        },
        // 获取会员登录二维码
        getVipCode: function () {
            if ( !this.vipLoginApiBtn ) {
                return;
            }
            this.vipLoginApiBtn = false;

            this.showEnterPhone = true;
            this.EnterPhone = '';
            this.vipPhoneList = '';
            this.$http.get('order-binding?storeId='+this.storeId+'&orderId='+this.orderId).then((res)=>{
                this.isqrcode = true;
                setTimeout(()=>{
                    $('#vipQrcode')[0].innerHTML='';
                    let vipQrcode = new QRCode("vipQrcode", {
                        text: res.data,
                        colorDark : "#000000",
                        colorLight : "#ffffff",
                        height: 200,
                        width: 200,
                        correctLevel : QRCode.CorrectLevel.H
                    });
                },200)
                this.vipLoginTimer = setInterval(()=>{
                    this.vipLoginQuery();
                },2000)

                this.vipLoginApiBtn = true;
            }).catch(( err )=>{
                this.vipLoginApiBtn = true;
            })
        },
        // 解绑会员
        cancelVip: function () {
            this.$http.put('orders/'+this.orderId+'/relieveMember').then((res)=>{
                this.vipData = '';
                let body = res.data;
                this.choiceArr = body.items;
                this.totalPrice = {
                    count: body.count, // 总数量
                    total: body.total, // 总计金额
                    discount: body.discount, // 优惠金额
                    amount: body.amount, // 最终价格
                    removeZero: body.removeZero, // 最终价格
                }
            }).catch(()=>{

            })
        },
        // 会员登录轮询
        vipLoginQuery: function ( boo ) {
            this.$http.get('query-binding?orderId='+this.orderId+'&type=BINDING').then((res)=>{
                if ( res.status === 200 ) {
                    this.closeVipCode( boo );
                    this.vipData = res.data;
                    this.vipData.amount = this.vipData.amount.toFixed(2);
                }
            }).catch(()=>{
                clearInterval(this.vipLoginTimer);
                this.isqrcode = false;
            })
        },
        // 关闭二维码弹框
        closeVipCode: function ( boo ) {
            if ( boo ) {
                this.showPayBox = true;
            }
            this.isqrcode = false;
            this.clerkMemberSwitch = false;
            clearInterval(this.vipLoginTimer);
        },
        // 获取充值规则
        getChargeRules(){
            let storeId = localStorage.getItem('storeId');
            this.$http({
                url:BASE_URL+"/v1/pos/charge-rules",
                method:"GET",
                params:{
                    storeId
                }
            }).then(res=>{
                this.chargeRules = res.data;
            });
        },
        getSeriData(type,items){
            if(type=="seled"){
                let obj = {};
                    for (let i = 0; i < items.length; i++) {
                        if(items[i].already){
                            let key;
                            if(!items[i].productId){
                                items[i].productId = items[i].id;
                                key = items[i].id + "_" + items[i].spec;
                            }else{
                                key = items[i].productId + "_" + items[i].spec;
                            }
                            if (!obj[key]) {
                                obj[key] = JSON.stringify(items[i]);
                                obj[key] = JSON.parse(obj[key]);
                                obj[key].dealPrice = 0;
                                obj[key].quantity = 0;
                            }
                        }
                    }
                    let newItems = [];
                    for (let key in obj) {
                        for (let j = 0; j < items.length; j++) {
                            if(items[j].already){

                                if (key == (items[j].productId + "_" + items[j].spec)) {
                                    obj[key].dealPrice += items[j].dealPrice;
                                    obj[key].quantity += items[j].quantity;
                                }
                            }
                        }
                        newItems.push(obj[key]);
                    }
                    
                    return newItems;
            }else if(type=="chose"){
                let obj = {};
                    for (let i = 0; i < items.length; i++) {
                        if(!items[i].already){
                            let key = items[i].productId + "_" + items[i].spec;
                            if (!obj[key]) {
                                obj[key] = JSON.stringify(items[i]);
                                obj[key] = JSON.parse(obj[key]);
                                obj[key].dealPrice = 0;
                                obj[key].quantity = 0;
                            }
                        }
                    }
                    let newItems = [];
                    for (let key in obj) {
                        for (let j = 0; j < items.length; j++) {
                            if(!items[j].already){
                                if (key == (items[j].productId + "_" + items[j].spec)) {
                                    obj[key].dealPrice += items[j].dealPrice;
                                    obj[key].quantity += items[j].quantity;
                                }
                            }
                        }
                        newItems.push(obj[key]);
                    }
                    
                    return newItems;
            }else{
                let obj = {};
                    for (let i = 0; i < items.length; i++) {
                            // let key = items[i].productId + "_" + items[i].spec;
                            let key;
                            if(!items[i].productId){
                                items[i].productId = items[i].id;
                                key = items[i].id + "_" + items[i].spec;
                            }else{
                                key = items[i].productId + "_" + items[i].spec;
                            }
                            if (!obj[key]) {
                                obj[key] = JSON.stringify(items[i]);
                                obj[key] = JSON.parse(obj[key]);
                                obj[key].dealPrice = 0;
                                obj[key].quantity = 0;
                            }
                    }
                    let newItems = [];
                    for (let key in obj) {
                        for (let j = 0; j < items.length; j++) {
                                if (key == (items[j].productId + "_" + items[j].spec)) {
                                    obj[key].dealPrice += items[j].dealPrice;
                                    obj[key].quantity += items[j].quantity;
                                }
                        }
                        newItems.push(obj[key]);
                    }
                    
                    return newItems;
            }
        },
        // 获取当前台桌的已下单列表
        getSeledOrder(numId){
            this.$http({
                url:"/get-numOrder",
                method:"GET",
                params:{
                   numId 
                }
            }).then(res=>{
                if(res.data){
                    let items = res.data.items;
                    let newItems = this.getSeriData("seled",items);
                    if(newItems.length == 0){
                        this.showCarSeledDetail = false;
                    }
                    this.seledOrder = newItems;
                    this.choiceArr = this.getSeriData("chose",items);
                    if(this.choiceArr.length == 0){
                        this.showCarDetail = false;
                    }

                    let seledOrderCount = 0;

                    for(let i=0;i<newItems.length;i++){
                        seledOrderCount += newItems[i].quantity;
                    }

                    this.seledOrderCount = seledOrderCount;

                    this.orderId = res.data.id;
                    this.totalPrice = {
                        count:    res.data.count, // 总数量
                        total:    res.data.total, // 总计金额
                        discount: res.data.discount, // 优惠金额
                        amount:   res.data.amount, // 最终价格
                        removeZero:   res.data.removeZero, //
                    }
                }else{
                    this.seledOrder = [];
                    this.choiceArr = [];
                    this.orderId = "";
                    this.showCarSeledDetail = false;
                }
                
            });
        }
  	},
  	created: function () {
        m$.setTitle('点单');
  		if ( !localStorage.getItem('storeId') ) {
  		  	this.$router.push({path:'/login'});
  		} else {
            this.storeId = localStorage.getItem('storeId');
            this.getGoods();
            // 获取充值规则
            this.getChargeRules();

            this.$http.get('/stores/'+this.storeId).then((res)=>{
                this.clerkCashSales = res.data.clerkCashSales;
                localStorage.setItem("rechargeLimit",JSON.stringify(res.data.rechargeLimit));

                sessionStorage.setItem("discount",JSON.stringify(res.data.discount));
                sessionStorage.setItem("zero",JSON.stringify(res.data.zero));
            });
            
	        // // 判断是否有缓存订单
	        // if ( sessionStorage.getItem('orderId') ) {
	        // 	this.orderId = sessionStorage.getItem('orderId');
	        // 	this.$http.get('/get-numOrder?numId' + this.orderId).then((res)=>{
	        // 		let body = res.data;
	        // 		this.choiceArr = body.items;
	        // 		this.totalPrice = {
	        // 		    count: body.count, // 总数量
	        // 		    total: body.total, // 总计金额
	        // 		    discount: body.discount, // 优惠金额
	        // 		    amount: body.amount, // 最终价格
	        // 		    removeZero: body.removeZero, // 最终价格
	        // 		}

            //         this.$http.get('orders/' + this.orderId).then((res)=>{
            //             let body = res.data;
            //             this.choiceArr = body.items;
            //             this.totalPrice = {
            //                 count: body.count, // 总数量
            //                 total: body.total, // 总计金额
            //                 discount: body.discount, // 优惠金额
            //                 amount: body.amount, // 最终价格
            //                 removeZero: body.removeZero, // 最终价格
            //             } 

            //             if ( res.data.memberId ) {
            //                 this.$http.get(this.storeId+'/members?memberId='+res.data.memberId).then((res)=>{
            //                     this.vipData = res.data;
            //                     this.vipData.memberId = res.data.id;
            //                     this.vipData.amount = this.vipData.amount.toFixed(2);
            //                 });
            //             }
            //         });
            //     });
                
            //     // 如果用户刷新了界面，此时还原金额
            //     this.$http({
            //         url:BASE_URL+"/v1/pos/return-order",
            //         method:"POST",
            //         data:{
            //             orderId:this.orderId
            //         }
            //     }).then(res=>{
            //         console.log(res);
            //         if(res.data.result.code == 200){
            //             let body = res.data.data;
            //             this.choiceArr = body.items;
            //             this.totalPrice = {
            //                 count:    body.count, // 总数量
            //                 total:    body.total, // 总计金额
            //                 discount: body.discount, // 优惠金额
            //                 amount:   body.amount, // 最终价格
            //                 removeZero:   body.removeZero, // 最终价格
            //             }
            //         }
            //     });
	        // } else {
	        // 	// 生成订单
            //     // this.createOrder();
	        // }
  		}
  		/*let that = this;
  		// 离开界面时，取消订单
  		window.onbeforeunload = function () {
  		    if( !(that.choiceArr.length >= 1) ){
  		        that.$http.delete('orders/'+ that.orderId).then((res)=>{

  		        })
  		    }
  		}*/
  	},
  	mounted: function () {
        // alert($(document).height());
        $('.takeOrder').height($(window).height());
        // 判断来自微信浏览器
        if(isWeiXin()){
            if ( window.screen.height - $('.takeOrder').height() < 30) {
                $('.takeOrder').css('paddingTop', '64px');
            }
        }
        this.$createScroll('goodsList');
        this.$createScroll('right_goods');
        this.$createScroll('left_bar');
        this.$createScroll('carGoodsBox');


        this.animateDom = $('.goodAnimate');
        this.carDom = $('.shopCar .carImg');
        function isWeiXin() {
            var ua = window.navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        }
        let storePayMode = localStorage.getItem("storePayMode");
        if ( storePayMode == 'CASHIER' ) {
            this.isOnline = false;
            return;
        } else {
            this.isOnline = true;
        }

        setTimeout(()=>{
            let discount = JSON.parse(sessionStorage.getItem("discount"));
            let zero = JSON.parse(sessionStorage.getItem("zero"));
            this.showDiscount = discount;
            this.showZero = zero;
        },300);
        if(this.$route.query.numId){
            this.numId = this.$route.query.numId;
            this.getSeledOrder(this.$route.query.numId);
        }
  	},
}
</script>
<style lang="scss" scoped>
	@import "../../../static/css/common.scss";
	@import "./tabCashier.scss";
</style>
