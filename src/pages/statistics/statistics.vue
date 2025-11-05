<template>
  <view class="statistics-page">
    <view class="page-title">
      <text>统计</text>
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

        <view v-if="!option1.series[0].data.length" class="empty-tip">
          <text v-if="isLogin">暂无数据</text>
          <text class="login" v-else @click="$toRouter('/packageLogin/pages/login/login')">请登录</text>
        </view>
      </view>

      <view class="data-detail">
        <view class="title">数据统计</view>

        <view class="data-list" v-if="isLogin && userDetailInfo">
          <view class="item">
            <view class="name">目标体重</view>

            <view class="value">
              <text>{{ userDetailInfo.target_weight }}</text>
              <text>KG</text>
            </view>
          </view>

          <view class="item">
            <view class="name">剩余时间</view>

            <view class="value">
              <text>{{ countdownDays }}</text>
              <text>天</text>
            </view>

            <view class="time">
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
              <uni-icons v-if="weightChange.state === 1" type="arrow-up" size="30" color="#65D285" />
              <uni-icons v-else-if="weightChange.state === -1" type="arrow-down" size="30" color="#65D285" />
            </view>
          </view>

          <view class="item">
            <view class="name">BMI</view>

            <view class="value">
              <text>{{ bmiChange.bmi }}</text>
              <text>KG/㎡</text>
            </view>

            <view class="icon">
              <uni-icons v-if="bmiChange.state === 1" type="arrow-up" size="30" color="#65D285" />
              <uni-icons v-else-if="bmiChange.state === -1" type="arrow-down" size="30" color="#65D285" />
            </view>
          </view>
        </view>

        <view class="login" v-else-if="isLogin && !userDetailInfo" @click="$toRouter('/pages/evaluation/evaluation')">
          完善个人信息
        </view>
        <view class="login" v-else @click="$toRouter('/packageLogin/pages/login/login')">请登录</view>
      </view>

      <view class="week-data">
        <view class="title">本周数据</view>

        <!-- TODO 本周数据 -->
        <view class="week-data-container" v-if="isLogin && userDetailInfo">
          <view class="week-data-detail">
            <view class="item">
              <text class="unit">目标体重/kg</text>
              <text class="number">48</text>
            </view>

            <view class="item">
              <text class="unit">平均脂肪率/%</text>

              <view class="number">
                <text>32.2</text>
                <text class="state">偏高</text>
              </view>
            </view>
          </view>

          <view class="data-tip">
            <view class="data-tip-title">体重分析</view>

            <view class="data-tip-content">
              BMI计算器的结果是体重不足，可能会受到与之相关的风险，列举如下：营养不良、维生素缺乏、贫血（携带血管的能力降低）骨质疏松症，一种导致骨质疏松的疾病，增加骨折的风险免疫功能下降
            </view>
          </view>
        </view>

        <view class="login" v-else-if="isLogin && !userDetailInfo" @click="$toRouter('/pages/evaluation/evaluation')">
          完善个人信息
        </view>
        <view class="login" v-else @click="$toRouter('/packageLogin/pages/login/login')">请登录</view>
      </view>
    </view>
  </view>
</template>

<script>
import * as echarts from '@/uni_modules/lime-echart/static/echarts.min';
import $http from '@/utils/http';
import { mapGetters, mapState } from 'vuex';

let chart1 = null;

export default {
  name: 'statistics',

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
          name: 'BMI',
          value: 2,
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
            color: '#65D285',
            areaStyle: {
              color: '#E8FBF6',
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
    ...mapGetters('app', ['isLogin']),

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

  onShow() {
    this.getDataReport();
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

      $http
        .post(
          'api/diet-info/data-report',
          {
            report_type: this.selectedTime.value,
          },
          {
            hiddenErrorMessage: true,
          },
        )
        .then((res) => {
          uni.hideLoading();

          res.data = res.data.weight_list;

          if (this.selectChartType.id === 1) {
            this.option1.series[0].data = res.data.map((item) => item.weight);
          } else if (this.selectChartType.id === 2) {
            this.option1.series[0].data = res.data.map((item) => item.bmi);
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
        })
        .catch((err) => {
          if (err.Msg === '未找到健康档案，请先完成健康评估') {
          } else {
            if (err.Code !== -100) {
              uni.showToast({
                title: err.Msg,
                icon: 'none',
                mask: true,
              });
            }
          }
        });
    },
  },
};
</script>

<style>
page {
  height: 100%;
}
</style>

<style scoped lang="scss">
.statistics-page {
  height: 100%;
  overflow: auto;
  background: #f6f7fb linear-gradient(180deg, #b3f5e7 0%, #f1fcf8 100%) left top/100% 360rpx no-repeat;

  .page-title {
  }

  .banner {
    padding: calc(var(--page-title-height) + 42rpx) 0 0;
  }

  .data-container {
    padding: 0 30rpx;

    .nav {
      padding: 0 25rpx;
      margin-bottom: 33rpx;

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
              background: #65d285;
              border-radius: 32rpx;
              font-weight: 500;
              font-size: 28rpx;
              color: #ffffff;
            }
          }

          .name {
            width: 157rpx;
            height: 63rpx;
            font-size: 28rpx;
            color: #111111;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }

    .chart {
      background: #ffffff;
      padding: 34rpx 0;
      border-radius: 30rpx;
      margin-bottom: 20rpx;
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
      background: #ffffff;
      padding: 40rpx 26rpx;
      border-radius: 30rpx;
      margin-bottom: 20rpx;
      position: relative;

      .title {
        font-weight: 500;
        font-size: 30rpx;
        color: #001111;
        margin-bottom: 39rpx;
      }

      .data-list {
        padding: 0 62rpx;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-bottom: 70rpx;
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
            background: #e8fbf6;
            border-radius: 18rpx 18rpx 18rpx 0;
            font-weight: 500;
            font-size: 22rpx;
            color: #65d285;
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

    .week-data {
      background: #ffffff;
      padding: 42rpx 26rpx;
      border-radius: 30rpx;
      position: relative;

      .title {
        font-weight: 500;
        font-size: 30rpx;
        color: #001111;
        margin-bottom: 35rpx;
      }

      .week-data-container {
        .week-data-detail {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20rpx;

          .item {
            padding-left: 37rpx;
            width: 313rpx;
            height: 142rpx;
            background: #f6f7fb;
            border-radius: 20rpx;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 36rpx;

            .unit {
              font-weight: 500;
              font-size: 24rpx;
              color: #555555;
            }

            .number {
              font-weight: bold;
              font-size: 45rpx;
              color: #111111;
              display: flex;
              align-items: center;
              gap: 23rpx;

              .state {
                padding: 0 10rpx;
                height: 34rpx;
                background: #ea5757;
                border-radius: 17rpx;
                font-weight: 500;
                font-size: 24rpx;
                color: #ffffff;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
          }
        }

        .data-tip {
          background: #f6f7fb;
          border-radius: 20rpx;
          padding: 35rpx 28rpx;

          .data-tip-title {
            font-weight: 500;
            font-size: 28rpx;
            color: #111111;
            margin-bottom: 37rpx;
          }

          .data-tip-content {
            font-weight: 500;
            font-size: 24rpx;
            color: #555555;
            line-height: 40rpx;
          }
        }
      }
    }
  }

  .login {
    color: #65d285;
    font-size: 26rpx;
    text-align: center;
  }
}
</style>
