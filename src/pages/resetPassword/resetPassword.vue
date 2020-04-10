<template>
	<div class="resetPassword">
		<form @submit.prevent="resetPassword">
			<div class="inputItem">
				<input type="tel" class="user" v-model="phone" placeholder="请输入您的手机号码">
			</div>
			<div class="inputItem">
				<input type="text" class="code" v-model="code" placeholder="请输入验证码">
				<span class="getCode flex flex-align-center" v-if="!isGetCode" @click="getCode">获取验证码</span>
				<span class="getCode flex flex-align-center" v-if="isGetCode">{{time+' s'}}</span>
			</div>
			<div class="inputItem">
				<input type="password" class="password" v-model="password" placeholder="请输入密码">
			</div>
			<div class="btnGroup">
				<button type="submit" class="loginBtn">确认</button>
			</div>
		</form>
	</div>
</template>

<script type="text/javascript">
import { url } from '@/router/url.js';
import {BASE_URL} from "./../../urlConfig"
export default {
	data(){
		return{
			img:url,
			userStyle: false,
			pwStyle: false,
			time:60,
			phone:'', // 手机号
			password: '', // 密码
			code: '', // 验证码
			isGetCode:false, // 是否获取验证码
		}
	},
	methods: {
		getCode: function () {
			this.phone = this.phone.replace(/\s+/g, "");
		    if ( (/^1[3|4|5|6|7|8|9][0-9]{9}$/).test(this.phone) ) {
	            this.isGetCode = true;
		        this.$http.post(BASE_URL+'/v1/verify-code?mobile='+this.phone+'&type=ACCOUNT').then((res)=>{
		            let intervalCode = setInterval(()=>{
		                this.time--;
		                if ( this.time <= 0 ) {
		                    this.isGetCode = false;
		                    this.time = 60;
		                    clearInterval(intervalCode);
		                }
		            }, 1000);
		        }).catch((err)=>{
		        	this.isGetCode = false;
		        })
		    } else {
		        this.$message({
		            message: '请输入正确的手机号',
		            customClass: 'error'
		        });
		        return;                   
		    }
		},
		// 重置密码
		resetPassword: function () {
			if ( !(/^1[3|4|5|6|7|8|9][0-9]{9}$/).test(this.phone) ) {
				this.$message({
				    message: '请输入正确的手机号',
				    customClass: 'error'
				});
				return;
			}
			if ( !this.password ) {
		        this.$message.error({
		            message: "请输入密码",
		            customClass: 'error'
		        });
		        return;
		    }
		    let data = {
		    	"mobile": this.phone,
		    	"verifyCode": this.code,
		    	// "pwd": hex_md5(this.password)
		    	"pwd": this.password
		    }
		    this.$http.post('reset-pwd', data).then((res)=>{
		    	this.$router.push({path:'./login'});
		    });
		}
	},
	mounted(){
  		m$.setTitle('修改密码');
  		m$.hiddenScroll('.resetPassword'); 
  		    setTimeout(function () { 
  		    m$.hiddenScroll('.resetPassword'); 
  		},10)
  		$(document).ready(()=>{
  			$('.login').height($(window).height());
  		});
  	}
}
</script>
<style lang="scss" scoped>
	@import "../../../static/css/common.scss";
	@import "resetPassword";
</style>
