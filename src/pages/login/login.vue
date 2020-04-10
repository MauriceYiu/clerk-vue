<template>
	<div class="login">
		<div class="login_inner" :class="{selStore:showSelStore}">
			<div class="title flex flex-align-center flex-pack-center">
				<img :src="img.logo" alt="">
			</div>
			<form @submit.prevent="login">
				<div class="inputItem clearfix" :class="{active:userStyle}">
					<i class="iconfont icon-mobile left"></i>
					<input type="tel" class="user left" v-model="phone" placeholder="请输入用户名" @focus="userStyle=true;" @blur="userStyle=false" autocomplete="off">
				</div>
				<div class="inputItem clearfix" :class="{active:pwStyle}">
					<i class="iconfont icon-mima left"></i>
					<input type="password" class="password left" v-model="password" placeholder="请输入密码" @focus="pwStyle=true;" @blur="pwStyle=false" autocomplete="off">
				</div>
				<div class="btnGroup">
					<button type="submit" class="loginBtn">登录</button>
				</div>
			</form>
			<div class="forgetPW">
				<a href="javascript:;" @click="$router.push({path:'/resetPassword'});">忘记密码？点击重置</a>
			</div>
		</div>
		<div class="selStoreBox" v-if="showSelStore">
			<div class="title flex flex-align-center flex-pack-center">选择店铺</div>
			<div class="scroll_store" id="scroll_store">
				<div class="selStore">
					<div v-for="(item,idx) in storeList" class="storeItem" :key="idx" @click="selStore(item)">
						<div class="name flex flex-align-center flex-pack-center" v-text="item.storeName"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
import { url } from '@/router/url.js';
// import Qs from 'qs';
import {BASE_URL} from "./../../urlConfig";


export default {
	data(){
		return{
			img:url,
			userStyle: false, // 控制样式
			pwStyle: false, // 控制样式

			phone: '', // 手机号
			password: '' ,// 密码

			storeList: [], // 店铺列表
			showSelStore: false, // 是否显示选择店铺界面
		}
	},
	methods: {
		login: function () { // 登录事件
			this.phone = this.phone.replace(/\s+/g, "");
		    if ( !(/^1[3|4|5|6|7|8|9][0-9]{9}$/.test(this.phone)) ) {
		        this.$message.error({
		            message: "请输入正确的手机号",
		            customClass: 'error',
		        });
		        return;
		    };
		    if ( !this.password ) {
		        this.$message.error({
		            message: "请输入密码",
		            customClass: 'error'
		        });
		        return;
		    };

		    // 清空缓存
		    localStorage.clear();

		    let data = {
		        "username": this.phone,
		        // "password": hex_md5(this.password),
		        "password": this.password,
		    };
		    let b = new Base64();
		    let authStr = 'Basic '+ b.encode(data.username+':'+data.password);

		    let loginUrl=BASE_URL+'/v1/clerk/login';
            if(window.location.href.split('?')[1]){
                loginUrl= loginUrl+'?openid='+window.location.href.split('?')[1].split('=')[1];
            }
		    this.$http.post(loginUrl, 
				"remember-me=true"
			, {
				auth: data, // 添加登录验证
				headers:{
					'Content-type': 'application/x-www-form-urlencoded'
				},
				// transformRequest: [function(data) {      //在请求之前对data传参进行格式转换
				// 	data = Qs.stringify(data)
				// 	return data
				// }],
		    }).then((res)=>{
				// console.log(res);
		    	localStorage.setItem('token', authStr); // 缓存token验证
		    	localStorage.setItem('phone', this.phone); // 缓存电话号码
		    	if ( res.data.length > 1 ) {
		    		this.storeList = res.data;
		    		this.showSelStore = true;
		    		setTimeout(()=>{
		    			this.$createScroll('scroll_store');
		    		})
		    	} else {
					localStorage.setItem('storeId', res.data[0].storeId);
					localStorage.setItem('storePayMode', res.data[0].payMode);
					localStorage.setItem('empId', res.data[0].employeeId);
					localStorage.setItem('employeeName', res.data[0].employeeName);
					localStorage.setItem('clerkPayEnabled', res.data[0].clerkPayEnabled);
					localStorage.setItem('isTimeGoodsEnable', res.data[0].timeProductEnabled);
					localStorage.setItem('isOnlyMemberPay', res.data[0].memberEnabled);
					localStorage.setItem('storeTimeEnabled', res.data[0].storeTimeEnabled);
		    		this.$router.push({path:'/index'});
		    		/*this.$http.post('authorize?storeId='+res.data[0].storeId, {}).then((res)=>{
			    		this.$router.push({path:'/index'});
		    		})*/
		    	}
		    }).catch((err)=>{
		    	if ( err.response ) {
		    	    if ( err.response.status == 401 ) {
		    	        this.$message({
		    	            message: "帐号或者密码有误",
		    	            customClass: 'error'
		    	        })
		    	    } else if ( err.response.status == 403 ) {
		    	        this.$message({
		    	            message: "权限不足",
		    	            customClass: 'error'
		    	        })
		    	    } else {
		    	        this.$message({
		    	            message: err.response.data,
		    	            customClass: 'error'
		    	        })
		    	    }
		    	}
		    })
		},
		// 设置高度
		setHeight: function () {
			var viewHeight = window.innerHeight; //获取可视区域高度
			$("input").focus(function()
			{
			    $(".wrap").css("height",viewHeight);
			}).blur(function()
			{
			    $(".wrap").css("height","100%");
			});
		},
		selStore: function ( item ) { // 选择店铺
			localStorage.setItem('storeId', item.storeId);
			localStorage.setItem('storePayMode', item.payMode);
			localStorage.setItem('empId', item.employeeId);
			localStorage.setItem('employeeName', item.employeeName);
			localStorage.setItem('clerkPayEnabled', item.clerkPayEnabled);
			localStorage.setItem('isTimeGoodsEnable', item.timeProductEnabled);
			localStorage.setItem('isOnlyMemberPay', item.memberEnabled);
			localStorage.setItem('storeTimeEnabled', item.storeTimeEnabled);
			this.$router.push({path:'/index'});
			// this.$http.post('authorize?storeId='+item.storeId, {}).then((res)=>{
	  //   		this.$router.push({path:'/index'});
   //  		}).catch(()=>{
   //          })
		}
	},
	created(){
		

	},
	mounted(){
  		m$.setTitle('登录');
  		// m$.hiddenScroll('.login'); 
  		//     setTimeout(function () { 
  		//     m$.hiddenScroll('.login'); 
  		// },10)
  		$(document).ready(()=>{
  			$('.login').height($(window).height());
  		});
  		console.log($("input"))
		$("input").blur(function(){
			console.log('失去焦点')
			window.scrollTo(0,0);
		});
  	}
}
</script>
<style lang="scss" scoped>
	@import "../../../static/css/common.scss";
	@import "login";
</style>
