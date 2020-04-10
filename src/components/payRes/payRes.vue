<template>
    <div id="payRes">
        <div class="success">
            <i class="iconfont icon-chenggong"></i>
            <div class="ststus">支付成功</div>
            <div class="money">￥{{money.toFixed(2)}}</div>
        </div>
        <div class="btn">
            <button @click.stop="$router.replace('/table')">返回首页</button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            money:0,
        }
    },
    mounted() {
        let m = this.$route.query.m;
        let b = new Base64();
        let money = b.decode(m);
        console.log(money)
        this.money = Number(money);
    },
}
</script>
<style lang="scss" scoped>
    @import "./payRes.scss"
</style>