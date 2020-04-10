<template>
    <div class="reward">
        <div class="select-date">
            <span class="prev iconfont icon-jiantou2-copy left" @click="changeDate('reduce')"></span>
            <div class="date">
                <div class="now-date">{{nowDate}}</div>
                <div class="end-time" v-if="nowGetType=='DAY'">截止23:59:59</div>
            </div>
            <span class="next iconfont icon-jiantou2-copy right" @click="changeDate('add')"></span>
        </div>
        <div class="change-type">
            <span @click="changeGetType">{{nowGetType=="DAY"?"按月查询":"按日查询"}}</span>
        </div>
        <div class="data-name">
            打赏记录(总金额：{{totalAmount.toFixed(2)}} 总打赏数：{{totalCount}})
        </div>
        <div class="csroll-title">
            <span class="name">名字</span>
            <span class="money">金额</span>
            <span class="num">数量</span>
        </div>
        <div class="csroll_box" id="csroll_box">
            <div class="goods">
                <div class="item" v-for="(item,index) in rewardData" :key="index">
                    <span class="name">
                        <span>{{item.name}}</span>
                    </span>
                    <span class="money">
                        <span>&yen;</span>
                        <span v-text="item.amount"></span>
                    </span>
                    <span class="num">
                        <span>&times;</span>
                        <span v-text="item.qty"></span>
                    </span>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
export default {
  data() {
    return {
      startDate: new Date().Format("yyyy-MM-dd"), //
      endDate: new Date().Format("yyyy-MM-dd"), //
      getDataBtn: true,
      nowDate: "", //当前日期
      nowTime: "", //当前日期
      timestamp: 0, //当前时间戳
      newTimestamp: 0, //变化后的时间戳
      rewardData: [],
      nowGetType: "DAY",
      nowYaer: "", //当前年份
      nowMonth: "", //当前月份
      totalAmount: 0,
      totalCount: 0
    };
  },
  watch: {
    nowTime(val) {
      let date = new Date(val);
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let day = date.getDate();
      let dateParam = `${year}-${month > 9 ? month : "0" + month}-${
        day > 9 ? day : "0" + day
      }`;
      // alert(dateParam)
      if (this.nowGetType == "MONTH") {
        this.getRewardData({ year, month }, this.nowGetType);
      } else {
        this.getRewardData(dateParam, this.nowGetType);
      }
    }
  },
  methods: {
    //修改查询方式
    changeGetType() {
      let date = new Date();
      let year = date.getFullYear();
      let month = (date.getMonth() + 1)>9?(date.getMonth() + 1):"0"+(date.getMonth() + 1);
      let day = (date.getDate())>9?(date.getDate()):"0"+(date.getDate());
      if (this.nowGetType == "DAY") {
        this.nowGetType = "MONTH";
        this.nowDate = year + "年" + month + "月";
        this.nowTime = year + "-" + month;
      } else {
        this.nowGetType = "DAY";
        this.nowDate = month + "月" + day + "日";
        this.nowTime = year + "-" + month + "-" + day;
      }
      let nowTimestamp = new Date(`${year}/${month}/${day}`).getTime();
      this.timestamp = nowTimestamp;
      this.newTimestamp = nowTimestamp;
    },
    changeDate(type) {
      if (this.nowGetType == "DAY") {
        if (type === "add") {
          let date = new Date();
          let year = date.getFullYear();
          //往后一天
          this.newTimestamp += 24 * 60 * 60 * 1000;
          if (this.newTimestamp > this.timestamp) {
            this.newTimestamp = this.timestamp;
            return;
          } else {
            let newDate = new Date(this.newTimestamp);
            
            let day = newDate.getDate()>9?newDate.getDate():"0"+newDate.getDate();
            let month = (newDate.getMonth() + 1)>9?(newDate.getMonth() + 1):"0"+(newDate.getMonth() + 1);

            this.nowDate = month + "月" + day + "日";
            
            this.nowTime = year + "-" + month + "-" + day;
          }
        } else {
          let date = new Date();
          let year = date.getFullYear();
          //往前一天
          this.newTimestamp -= 24 * 60 * 60 * 1000;
          if (this.newTimestamp < this.timestamp) {
            let newDate = new Date(this.newTimestamp);
            let day = newDate.getDate()>9?newDate.getDate():"0"+newDate.getDate();
            let month = (newDate.getMonth() + 1)>9?(newDate.getMonth() + 1):"0"+(newDate.getMonth() + 1);

            this.nowDate = month + "月" + day + "日";
            
            this.nowTime = year + "-" + month + "-" + day;
          } else {
            this.newTimestamp = this.timestamp;
            return;
          }
        }
      } else {
        if (type === "add") {
          let date = new Date();
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          if (
            this.nowYaer > year ||
            (this.nowYaer == year && this.nowMonth >= month)
          ) {
            return;
          }
          //往后一月
          this.nowMonth++;

          if (this.nowMonth > 12) {
            this.nowYaer = this.nowYaer + 1;
            this.nowMonth = "01";
            this.nowDate = this.nowYaer + "年" + this.nowMonth + "月";
            this.nowTime = this.nowYaer + "-" + this.nowMonth;
          } else {
            this.nowMonth =
              this.nowMonth < 10 ? "0" + this.nowMonth : this.nowMonth;
            this.nowDate = this.nowYaer + "年" + this.nowMonth + "月";
            this.nowTime = this.nowYaer + "-" + this.nowMonth;
          }
        } else {
          //往前一月
          this.nowMonth--;
          if (this.nowMonth < 1) {
            this.nowYaer = this.nowYaer - 1;
            this.nowMonth = 12;
            this.nowDate = this.nowYaer + "年" + this.nowMonth + "月";
            this.nowTime = this.nowYaer + "-" + this.nowMonth;
          } else {
            this.nowMonth =
              this.nowMonth < 10 ? "0" + this.nowMonth : this.nowMonth;
            this.nowDate = this.nowYaer + "年" + this.nowMonth + "月";
            this.nowTime = this.nowYaer + "-" + this.nowMonth;
          }
        }
      }
    },
    getRewardData(date, getType) {
      let empId = localStorage.getItem("empId");
      let storeId = localStorage.getItem('storeId');
      let params;
      if (this.nowGetType == "DAY") {
        params = {
          empId,
          from: date,
          source: getType,
          type: "EMP",
          storeId
        };
      } else {
        params = {
          empId,
          year: date.year,
          month: date.month,
          source: getType,
          type: "EMP",
          storeId
        };
      }
      this.$http({
        url: "get-reward",
        methods: "GET",
        params
      }).then(res => {
        console.log(res);
        this.rewardData = res.data.rews;
        this.totalAmount = res.data.total;
        this.totalCount = res.data.count;
        this.$createScroll("csroll_box");
      });
    }
  },
  mounted() {
    //初始化时间
    let date = new Date();
    //获取当前时间（不包含时分秒）的时间戳
    let month = (date.getMonth() + 1)>9?(date.getMonth() + 1):"0"+(date.getMonth() + 1);
    let year = date.getFullYear();
    let day = date.getDate()>9?date.getDate():"0"+date.getDate();
    let nowTimestamp = new Date(`${year}/${month}/${day}`).getTime();
    //计算出昨天的时间戳,之前只能查询前一天的数据，所以这里计算了一下时间，现在可以查当日的数据
    let prevDateTimestamp = nowTimestamp - 24 * 60 * 60 * 1000;
    //初始时间两个时间戳一致
    // this.timestamp = prevDateTimestamp;
    // this.newTimestamp = prevDateTimestamp;
    this.timestamp = nowTimestamp;
    this.newTimestamp = nowTimestamp;
    //根据昨天的时间戳，获取昨天的日期
    let prevDate = new Date(prevDateTimestamp);
    let prevMonth = prevDate.getMonth() + 1;
    let prevYear = prevDate.getFullYear();
    let prevDay = prevDate.getDate();
    //昨天的日期
    // this.nowDate = prevMonth + "月" + prevDay + "日";
    //今天的日期
    this.nowDate = month + "月" + day + "日";
    this.nowYaer = year;
    this.nowMonth = month;
    // 获取数据
    let dateParam = `${year}-${month > 9 ? month : "0" + month}-${
      day > 9 ? day : "0" + day
    }`;
    console.log(dateParam);
    this.getRewardData(dateParam, "DAY");
  }
};
</script>
<style lang="scss" scoped>
@import "./reward.scss";
</style>