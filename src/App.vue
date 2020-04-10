<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
import {BASE_URL} from "./urlConfig";
// import {mapGetters} from "vuex";
export default {
  name: "app",
  mounted() {
	let url = window.location.href.split("#")[0];
	console.log(url);
    this.$http
      .get(BASE_URL+"/wechat/scan?url="+url)
      .then(res => {
		  console.log(res);
        // this.returnUrl = res.data.url;
        wx.config({
          debug: false,
          appId: res.data.appId,
          timestamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signaTrue,
          jsApiList: ["checkJsApi","scanQRCode"]
        });
      });
  }
};
</script>
<style lang="scss">
#app {
  height: 100%;
  -webkit-overflow-scrolling:touch;
}
</style>
