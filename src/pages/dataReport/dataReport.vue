<template>
  <view class="data-report-page">
    <view class="page-title">
      <text>数据报告</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="data-container">
      <view class="nav">
        <view class="nav-title">数据概览</view>

        <view class="nav-tab">
          <view
            class="nav-item"
            :class="{ active: selectedTime.id === item.id }"
            v-for="item of timeList"
            :key="item.id"
            @click="selectedTime = item"
          >
            <text class="name">{{ item.name }}</text>
          </view>
        </view>
      </view>

      <view class="chart">
        <view class="chart-type">
          <text
            v-for="item of chartList"
            @click="selectChartType = item"
            :class="{ active: selectChartType.id === item.id }"
            :key="item.value"
          >
            {{ item.name }}
          </text>
        </view>

        <view class="chart-box">
          <l-echart ref="chart1Ref" @finished="init1" />
        </view>

        <view v-if="!option1.series[0].data.length" class="empty-tip">暂无数据</view>
      </view>

      <view class="data-detail">
        <view class="title">数据统计</view>

        <view class="data-list">
          <view class="item">
            <view class="name">目标体重</view>

            <view class="value">
              <text>{{ userDetailInfo && userDetailInfo.target_weight }}</text>
              <text>KG</text>
            </view>
          </view>

          <view class="item">
            <view class="name">剩余时间</view>

            <view class="value">
              <text>{{ countdownDays }}</text>
              <text>天</text>
            </view>

            <view class="time" v-if="userDetailInfo">
              至{{ userDetailInfo.end_date.slice(5, 7) }}月{{ userDetailInfo.end_date.slice(8, 10) }}日
            </view>
          </view>

          <view class="item">
            <view class="name">体重记录</view>

            <view class="value">
              <text>{{ recodeDays }}</text>
              <text>天</text>
            </view>
          </view>

          <view class="item">
            <view class="name">体重变化</view>

            <view class="value">
              <text>{{ weightChange.width }}</text>
              <text>KG</text>
            </view>

            <view class="icon">
              <uni-icons v-if="weightChange.state === 1" type="arrow-up" size="30" color="#5664E5" />
              <uni-icons v-else-if="weightChange.state === -1" type="arrow-down" size="30" color="#5664E5" />
            </view>
          </view>

          <view class="item">
            <view class="name">BMI</view>

            <view class="value">
              <text>{{ bmiChange.bmi }}</text>
              <text>KG/㎡</text>
            </view>

            <view class="icon">
              <uni-icons v-if="bmiChange.state === 1" type="arrow-up" size="30" color="#5664E5" />
              <uni-icons v-else-if="bmiChange.state === -1" type="arrow-down" size="30" color="#5664E5" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import * as echarts from '@/uni_modules/lime-echart/static/echarts.min';
import $http from '@/utils/http';
import { mapState } from 'vuex';

let chart1 = null;

export default {
  name: 'dataReport',

  data() {
    return {
      dataReport: {},
      timeList: [
        {
          id: 0,
          name: '周期目标',
          value: 6,
        },
        {
          id: 1,
          name: '近一周',
          value: 7,
        },
        {
          id: 2,
          name: '近一月',
          value: 8,
        },
        {
          id: 3,
          name: '近90天',
          value: 3,
        },
      ],
      chartList: [
        {
          id: 1,
          name: '体重',
          value: 1,
        },
        {
          id: 2,
          name: '饮食',
          value: 2,
        },
        {
          id: 3,
          name: '运动',
          value: 3,
        },
      ],
      selectedTime: {},
      selectChartType: {},
      option1: {
        title: {
          show: false,
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          bottom: 0,
          show: false,
        },
        grid: {
          top: '15%',
          left: '8%',
          right: '8%',
          bottom: '0%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          data: [],
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
        },
        series: [
          {
            type: 'line',
            data: [],
            color: '#5664E5',
            areaStyle: {
              color: '#E5E8FF',
            },
            label: {
              show: true,
              position: 'top',
              color: '#999999',
              fontSize: 12,
              formatter: () => {
                return '';
              },
            },
          },
        ],
      },
    };
  },

  computed: {
    ...mapState('app', ['userDetailInfo']),

    countdownDays() {
      if (this.userDetailInfo && this.userDetailInfo.end_date) {
        let time = new Date(this.userDetailInfo.end_date.replace(/-/g, '/')) - new Date();
        let days = Math.ceil(time / (60 * 60 * 24 * 1000));

        if (days < 0) {
          days = 0;
        }

        return days;
      }

      return 0;
    },

    recodeDays() {
      if (this.userDetailInfo && this.userDetailInfo.begin_date) {
        let time = new Date() - new Date(this.userDetailInfo.begin_date.replace(/-/g, '/'));
        let days = Math.ceil(time / (60 * 60 * 24 * 1000));

        if (days < 0) {
          days = 0;
        }

        return days;
      }

      return 0;
    },

    weightChange() {
      if (!this.userDetailInfo) {
        return {};
      }

      let weight = Number((this.userDetailInfo.initial_weight - this.userDetailInfo.current_weight).toFixed(2));

      return {
        width: Math.abs(weight),
        state: weight === 0 ? 0 : weight < 0 ? 1 : -1,
      };
    },

    bmiChange() {
      if (!this.userDetailInfo) {
        return {};
      }

      let bmi = Number(
        (
          this.userDetailInfo.current_weight /
          ((this.userDetailInfo.height * this.userDetailInfo.height) / 10000)
        ).toFixed(1),
      );

      return {
        bmi,
        state:
          this.userDetailInfo.current_weight === this.userDetailInfo.initial_weight
            ? 0
            : this.userDetailInfo.current_weight > this.userDetailInfo.initial_weight
            ? 1
            : -1,
      };
    },
  },

  watch: {
    selectedTime() {
      this.getDataReport();
    },

    selectChartType() {
      this.getDataReport();
    },
  },

  onLoad() {
    this.selectedTime = this.timeList[1];
    this.selectChartType = this.chartList[0];
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/share-img.jpg',
      path: '/pages/index/index',
    };
  },

  methods: {
    async init1() {
      chart1 = await this.$refs.chart1Ref.init(echarts);
      chart1.setOption(this.option1);
    },

    getDataReport() {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      let api = '';

      if (this.selectChartType.id === 1) {
        api = 'api/diet-info/data-report';
      } else {
        api = 'api/diet-info/data-statistics';
      }

      $http
        .post(api, {
          report_type: this.selectedTime.value,
        })
        .then((res) => {
          uni.hideLoading();

          if (this.selectChartType.id === 1) {
            res.data = res.data.weight_list;

            this.option1.series[0].data = res.data.map((item) => item.weight);
          } else if (this.selectChartType.id === 2) {
            this.option1.series[0].data = res.data.map((item) => item.calorie_intake);
          } else {
            this.option1.series[0].data = res.data.map((item) => item.exercise_calorie);
          }

          this.option1.xAxis.data = res.data.map((item) => item.date_time.slice(5, 10));

          this.option1.series[0].label.formatter = (params) => {
            // params.dataIndex 是当前数据点的索引
            const index = params.dataIndex;
            const len = this.option1.xAxis.data.length;

            // 只显示第一个 (index === 0) 和最后一个 (index === len - 1)
            if (index === 0 || index === len - 1) {
              return params.value; // 显示数值
            }
            return '';
          };

          setTimeout(() => {
            chart1.setOption(this.option1);
          }, 200);
        });
    },
  },
};
</script>

<style>
page {
  height: 100%;
  background: #f6f7fb;
}
</style>

<style scoped lang="scss">
.data-report-page {
  height: 100%;
  display: flex;
  flex-direction: column;

  .page-title {
    flex-shrink: 0;
    background: #ffffff;
  }

  .banner {
    flex-shrink: 0;
    padding: calc(var(--page-title-height)) 0 0;
    background: #ffffff;
    margin-bottom: 10rpx;
  }

  .data-container {
    background: #ffffff;
    padding: 30rpx;
    flex-grow: 1;
    overflow: auto;

    .nav {
      margin-bottom: 58rpx;

      .nav-title {
        font-weight: 500;
        font-size: 30rpx;
        color: #001111;
        margin-bottom: 22rpx;
      }

      .nav-tab {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20rpx;

        .nav-item {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;

          &.active {
            .name {
              background: #5664e5;
              border-radius: 32rpx;
              font-weight: 500;
              font-size: 26rpx;
              color: #ffffff;
            }
          }

          .name {
            width: 157rpx;
            height: 63rpx;
            font-size: 26rpx;
            color: #111111;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }

    .chart {
      margin-bottom: 65rpx;
      position: relative;

      .chart-type {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 158rpx;
        margin-bottom: 39rpx;

        text {
          font-weight: 500;
          font-size: 28rpx;
          color: #555555;

          &.active {
            font-weight: bold;
            font-size: 28rpx;
            color: #111111;
          }
        }
      }

      .chart-box {
        width: 100%;
        height: 340rpx;
      }

      .empty-tip {
        text-align: center;
        color: #aaaaaa;
        font-size: 26rpx;
        position: absolute;
        left: 0;
        right: 0;
        top: 68rpx;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .data-detail {
      .title {
        font-weight: 500;
        font-size: 30rpx;
        color: #001111;
        margin-bottom: 31rpx;
      }

      .data-list {
        padding: 0 81rpx;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-bottom: 89rpx;
          position: relative;

          &:nth-child(2n) {
            width: 40%;
          }

          &:nth-child(2n-1) {
            width: 60%;
          }

          .name {
            font-weight: 500;
            font-size: 24rpx;
            color: #555555;
            margin-bottom: 54rpx;
          }

          .value {
            display: flex;
            align-items: center;
            gap: 23rpx;

            text {
              &:nth-child(1) {
                font-weight: bold;
                font-size: 60rpx;
                color: #111111;
              }

              &:nth-child(2) {
                font-weight: 500;
                font-size: 22rpx;
                color: #555555;
                position: relative;
                top: 12rpx;
              }
            }
          }

          .time {
            position: absolute;
            top: 60rpx;
            left: 130rpx;
            white-space: nowrap;
            background: #f2f5ff;
            border-radius: 18rpx 18rpx 18rpx 0;
            font-weight: 500;
            font-size: 22rpx;
            color: #5664e5;
            height: 35rpx;
            padding: 0 20rpx;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .icon {
            position: absolute;
            bottom: 0;
            left: -50rpx;
          }
        }
      }
    }
  }
}
</style>
