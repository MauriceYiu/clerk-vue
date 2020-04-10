<template>
  <div class="achievement">
    <!-- <p class="title clearfix">
			<span class="left">
				<i class="iconfont icon-tongzhi1"></i>{{'本月销售目标：'+data.target}}</span>
			<span class="right">数据统计截至昨日24点*</span>
		</p> -->
    <div class="tips">
      <div class="cur-mot">
        <!-- <p v-text="nowMonthKpiMoney"></p> -->
        <p class="mot-name">本月业绩</p>
        <!-- <span></span> -->
      </div>
      <div class="pre-mot">
        <!-- <p v-text="lastMonthKpiMoney"></p> -->
        <p class="mot-name">上月业绩</p>
        <!-- <span></span> -->
      </div>
      <div class="span_move left">
      </div>
    </div>
    <div class="data-box">
      <div class="cur-data">
        <!-- <div class="progress-box"> -->
        <!-- <div class="progress">

						<span class="cur-progress" :style="{left:(finishedAchievement)+'%'}"></span>
						<span class="text1">本月完成业绩</span>
						<span class="text2" v-text="finishedAchievement+'%'"></span>
					</div> -->
        <!-- <p class="encourage"  v-text="(data.target>0)?(finishedAchievement>50?'快到本月目标了哦，加油！':'本月目标刚开始，加油！'):'未设置销售目标'"></p> -->
        <!-- <p class="encourage" v-if="!achive" v-text="(data.target>0)?(finishedAchievement>50?'快到本月目标了哦，加油！':'本月目标刚开始，加油！'):'未设置销售目标'"></p> -->
        <!-- <p class="encourage" v-if="achive">耶！已完成任务，继续努力，更上一层楼。</p> -->
        <!-- </div> -->
        <div class="data-name">
          销售业绩
        </div>

        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide swiper-no-swiping">
              <div id="detail">
                <div class="item-wrap">
                  <div class="item-inner">
                    <div class="item-tit">开台次数</div>
                    <div class="item-cont">
                      {{moneyDetailData.openNum}}次
                    </div>
                  </div>
                </div>
                <div class="item-wrap">
                  <div class="item-inner">
                    <div class="item-tit">开台总销售额，其中会员支付额</div>
                    <div class="item-cont">
                      <div>总销售额(不含会员充值) ￥{{moneyDetailData.salesTotal}}</div>
                      <div>其中会员支付 ￥{{moneyDetailData.totalMember}}</div>
                    </div>
                  </div>
                </div>
                <div class="item-wrap">
                  <div class="item-inner">
                    <div class="item-tit">推荐会员数</div>
                    <div class="item-cont">
                      {{moneyDetailData.memberCount}}个
                    </div>
                  </div>
                </div>
                <div class="item-wrap">
                  <div class="item-inner">
                    <div class="item-tit">会员充值金额</div>
                    <div class="item-cont">
                      会员充值金额 ￥{{moneyDetailData.memberCharge}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="swiper-slide swiper-no-swiping">
              <div id="detail">
                <div class="item-wrap">
                  <div class="item-inner">
                    <div class="item-tit">开台次数</div>
                    <div class="item-cont">
                      {{prevMoneyDetailData.openNum}}次
                    </div>
                  </div>
                </div>
                <div class="item-wrap">
                  <div class="item-inner">
                    <div class="item-tit">开台总销售额，其中会员支付额</div>
                    <div class="item-cont">
                      <div>总销售额(不含会员充值) ￥{{prevMoneyDetailData.salesTotal}}</div>
                      <div>其中会员支付 ￥{{prevMoneyDetailData.totalMember}}</div>
                    </div>
                  </div>
                </div>
                <div class="item-wrap">
                  <div class="item-inner">
                    <div class="item-tit">推荐会员数</div>
                    <div class="item-cont">
                      {{prevMoneyDetailData.memberCount}}个
                    </div>
                  </div>
                </div>
                <div class="item-wrap">
                  <div class="item-inner">
                    <div class="item-tit">会员充值金额</div>
                    <div class="item-cont">
                      会员充值金额 ￥{{prevMoneyDetailData.memberCharge}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="csroll-title">
					<span class="name">分类名称</span>
					<span class="money">销售数量</span>
					<span class="num">销售金额</span>
				</div> -->
        <!-- <div class="swiper-container">
					<div class="swiper-wrapper">
						<div class="swiper-slide swiper-no-swiping">
							<div class="csroll_box" id="csroll_box">
								<div class="goods">
									<div class="item" v-for="item in data.items">
										<span class="name" v-text="item.typeName"></span>
										<span class="num">
											<span>&times;</span>
											<span v-text="item.qty"></span>
										</span>
										<span class="money">
											<span>&yen;</span>
											<span v-text="item.amount"></span>
										</span>
									</div>
								</div>
							</div>
						</div>
						<div class="swiper-slide swiper-no-swiping">
							<div class="csroll_box" id="csroll_box_prev">
								<div class="goods">
									<div class="item" v-for="item in prevData.items">
										<span class="name" v-text="item.typeName"></span>
										<span class="num">
											<span>&times;</span>
											<span v-text="item.qty"></span>
										</span>
										<span class="money">
											<span>&yen;</span>
											<span v-text="item.amount"></span>
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div> -->
      </div>
      <!-- <div class="bottom">
        		 <span class="name" >总数/额</span>
                <span class="money">20</span>
                <span class="num" >￥56</span> 
        	</div> -->
    </div>
  </div>
</template>

<script>
import { BASE_URL } from "./../../urlConfig";
export default {
  data() {
    return {
      curStoreId: "",
      finishedAchievement: 0,
      data: {},
      prevData: {}, //上月数据
      achive: false,
      nowMonthKpiMoney: 0,
      lastMonthKpiMoney: 0,
      empId: "",
      moneyDetailData: {
        memberCharge: 0,
        memberCount: 0,
        openNum: 0,
        salesTotal: 0,
        totalMember: 0
      },
      prevMoneyDetailData: {
        memberCharge: 0,
        memberCount: 0,
        openNum: 0,
        salesTotal: 0,
        totalMember: 0
      }
    };
  },
  methods: {
    getSalesKpi(year, month, kpiType) {
      let phone = localStorage.getItem("phone");
      this.curStoreId = localStorage.getItem("storeId");
      this.$http({
        url: `${BASE_URL}/v1/employees/${phone}/sales-kpi`,
        method: "GET",
        params: {
          year,
          month,
          storeId: this.curStoreId
        }
      }).then(res => {
        console.log(res);
        if (kpiType === "now") {
          this.finishedAchievement = res.data.target
            ? ((res.data.amount / res.data.target) * 100).toFixed(2)
            : 0;
          if (this.finishedAchievement >= 100) {
            this.finishedAchievement = 100;
            this.achive = true;
          }

          this.data = res.data;
          this.nowMonthKpiMoney = res.data.amount;
          this.$createScroll("csroll_box");
          this.$createScroll("csroll_box_prev");
        } else {
          this.lastMonthKpiMoney = res.data.amount;
          this.prevData = res.data;
        }

        // SWIPER
        var mySwiper = new Swiper(".swiper-container", {
          noSwiping: true
        });

        $(".cur-mot").on("click", function() {
          mySwiper.slidePrev();
          $(".span_move")
            .removeClass("right")
            .addClass("left");
        });
        $(".pre-mot").on("click", function() {
          mySwiper.slideNext();
          $(".span_move")
            .removeClass("left")
            .addClass("right");
        });
      });
    },
    getKpiDetail(year, month, type) {
      let params = {
        year,
        month,
        storeId: this.curStoreId,
        type: "MONTH"
      };
      this.$http({
        url: BASE_URL + "/v1/admin/employee-commission/" + this.empId,
        params
      }).then(res => {
        if (type == "now") {
          this.moneyDetailData = res.data;
        } else {
          this.prevMoneyDetailData = res.data;
        }
        // SWIPER
        var mySwiper = new Swiper(".swiper-container", {
          noSwiping: true
        });

        $(".cur-mot").on("click", function() {
          mySwiper.slidePrev();
          $(".span_move")
            .removeClass("right")
            .addClass("left");
        });
        $(".pre-mot").on("click", function() {
          mySwiper.slideNext();
          $(".span_move")
            .removeClass("left")
            .addClass("right");
        });
      });
    }
  },
  mounted() {
    let date = new Date();

    let nowYear = date.getFullYear();
    let nowMonth;
    date.getMonth() + 1 > 9
      ? (nowMonth = date.getMonth() + 1)
      : (nowMonth = `0${date.getMonth() + 1}`);

    let lastMonth, lastYear;
    nowMonth - 1 < 1 ? (lastMonth = 12) : (lastMonth = nowMonth - 1);
    nowMonth == 1 ? (lastYear = nowYear - 1) : (lastYear = nowYear);

    lastMonth > 9 ? (lastMonth = lastMonth) : (lastMonth = `0${lastMonth}`);

    this.curStoreId = localStorage.getItem("storeId");
    this.empId = localStorage.getItem("empId");

    // 本月业绩
    this.getKpiDetail(nowYear, nowMonth, "now");
    // 上月业绩
    this.getKpiDetail(lastYear, lastMonth, "last");

    // this.$http.get("/sale-info?storeId=" + this.curStoreId).then(res => {
    //   this.finishedAchievement = res.data.target
    //     ? (res.data.sameMonthTotal / res.data.target * 100).toFixed(2)
    //     : 0;
    //   if (this.finishedAchievement >= 100) {
    //     this.finishedAchievement = 100;
    //     this.achive = true;
    //   }
    //   this.data = res.data;
    //   this.$createScroll("csroll_box");
    // });
    m$.setTitle("业绩");
  }
};
</script>
<style lang="scss" scoped>
@import "achievement";
</style>
