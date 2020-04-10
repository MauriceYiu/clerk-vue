<template>
    <div id="bindVip">
        <div class="search">
            <div class="serach-wrap">
                <input type="text" v-model="memberPhone" placeholder="请输入会员手机号...">
                <div class="search-list" v-if="members.length">
                    <ul>
                        <li v-for="(item,index) in members" @click.stop="selMember(item)" :key="index">{{item.memberName}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="set-item">
            <span class="left-tit">会员姓名:</span>
            <div class="right-cont">
                <span class="cont">{{nowSelMember.memberName}}</span>
            </div>
        </div>
        <div class="line"></div>
        <div class="set-item">
            <span class="left-tit">会员手机号:</span>
            <div class="right-cont">
                <span class="cont">{{nowSelMember.memberMobile}}</span>
            </div>
        </div>
        <div class="line"></div>
        <div class="set-item">
            <span class="left-tit">会员卡号:</span>
            <div class="right-cont">
                <span class="cont">{{nowSelMember.memberCode}}</span>
            </div>
        </div>
        <div class="line"></div>
        <div class="set-item">
            <span class="left-tit">会员级别:</span>
            <div class="right-cont">
                <span class="cont">{{nowSelMember.memberLevel}}</span>
            </div>
        </div>
        <div class="line"></div>
        <div class="set-item">
            <span class="left-tit">折扣:</span>
            <div class="right-cont">
                <span class="cont">{{nowSelMember.memberDiscountMessage}}</span>
            </div>
        </div>
        <div class="line"></div>
        <div class="set-item">
            <span class="left-tit">可用余额:</span>
            <div class="right-cont">
                <span class="cont">{{nowSelMember.memberAmount}}</span>
            </div>
        </div>
        <div class="line"></div>
        <div class="btn">
            <button class="close" @click.stop="$emit('closeBind')">关闭</button>
            <button @click.stop="bind">{{memberInfo.memberId?'取消绑定':'确定'}}</button>
        </div>
    </div>
</template>

<script>
import {mapGetters,mapActions} from "vuex";
export default {
    props:["memberInfo"],
    data() {
        return {
            memberPhone:"",//会员手机号
            nowSelMember:{},
            members:[],
            firstOrderId:"",
            nowDeskOrderInfo:{},
            // isAddItem:false,
        }
    },
    watch: {
        memberPhone(val){
            if(val=="" || this.nowSelMember.memberMobile == val){
                this.members = [];
                return;
            }
            this.getMembers(val)
        }
    },
    methods: {
        bind(){
            if(this.memberInfo.memberId){
                this.cancelBind();
                return;
            }
            this.$http({
                url:"bind-member",
                method:"POST",
                data:{
                    memberId:this.nowSelMember.memberId,
                    storeId:localStorage.getItem('storeId'),
                    orderId:this.nowDeskOrderInfo.res.orderId,
                }
            }).then(res=>{
                if(res.data.code == 400){
                    this.$message({
                        message:res.data.msg,
                        showClose:true,
                        customClass:'error'
                    });
                    return;
                }else if(res.data.code == 200){
                    this.$emit("reGetPayInfo","");
                }
            });
        },
        // 取消绑定会员
        cancelBind(){
            this.$http({
                url:"relieve-member",
                method:"POST",
                data:{
                    orderId:this.nowDeskOrderInfo.res.orderId,
                }
            }).then(res=>{
                if(res.data.code == 200){
                this.$message({
                    message:res.data.msg,
                    showClose:true,
                    customClass:'success'
                });
                    this.$emit("reGetPayInfo","");
                    return;
                }else if(res.data.code == 400){
                    this.$message({
                        message:res.data.msg,
                        showClose:true,
                        customClass:'error'
                    });
                    return;
                }
            });
        },
        selMember(item){
            
            if(!this.nowDeskOrderInfo.res.orderId){
                this.$message({
                    message:"暂无订单",
                    showClose:true,
                    customClass:'error'
                });
                return;
            }
            this.memberPhone = item.memberMobile;
            item.memberAmount = item.memberAmount.toFixed(2);
            this.nowSelMember = item;
            this.members = [];
        },
        getMembers(memberPhone){
            this.$http({
                url:"members",
                method:"GET",
                params:{
                    storeId:localStorage.getItem('storeId'),
                    q:memberPhone,
                    // orderId:this.nowDeskOrderInfo.res.orderId,
                }
            }).then(res=>{
                this.members = res.data;
            })
        },
        ...mapGetters(['getNowDeskOrderInfo',"getFirstOrderId"]),
    },
    created() {
        this.nowDeskOrderInfo = this.getNowDeskOrderInfo();
        this.firstOrderId = this.getFirstOrderId();
        // this.isAddItem = this.getIsAddItem();
        if(this.memberInfo.memberId){
            let memberInfo = this.memberInfo;
            this.nowSelMember = memberInfo;
        }
    },
    mounted() {
    },
}
</script>


<style scoped lang="scss">
@import "./bindVip.scss"
</style>
