<template>
  <view class="plan-suggestion-page">
    <view class="page-title">
      <text></text>

      <view class="back" @click="$toSwitch('/pages/index/index')">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="plan-box">
      <view class="plan-title">你的专属计划已生成</view>

      <view class="plan-time">
        计划将持续 <text>{{ Math.ceil(planDays / 7) }}</text> 周，每周平均{{
          planSuggestion.weekly_loss_weight >= 0 ? '减重' : '增肌'
        }}<text>{{ Math.abs(planSuggestion.weekly_loss_weight) }}</text
        >kg
      </view>

      <view class="card-box">
        <view class="card-item1">
          <view class="card-title">
            <text>您的身体评测报告</text>
          </view>

          <view class="card-title2">
            <text>根据您的身高体重测算，推荐BMI范围： </text>
          </view>

          <view class="chart-box">
            <view class="chart">
              <l-echart ref="chartRef1" @finished="init1" />
            </view>

            <view class="chart-data">
              <text>{{ planSuggestion.body_score }}</text>
              <text>身体评分</text>
            </view>
          </view>

          <view class="bmi">
            初始BMI值为：
            <text>{{ planSuggestion.plan_initial_bmi }}</text>
          </view>

          <view class="plan-detail">
            <view class="plan-item">
              <view class="title" style="background: linear-gradient(90deg, #5664e5 0%, #ffffff 100%)">饮食策略</view>

              <view class="content">
                <view class="content-item">
                  <text>营养结构</text>
                  <text>高蛋白均衡</text>
                </view>

                <view class="content-item">
                  <text>碳水</text>
                  <text>40%</text>
                </view>

                <view class="content-item">
                  <text>蛋白</text>
                  <text>30%</text>
                </view>

                <view class="content-item">
                  <text>脂肪</text>
                  <text>30%</text>
                </view>

                <view class="content-item">
                  <text>控糖方案</text>
                  <text>添加糖 ≤20g/天</text>
                </view>
              </view>
            </view>

            <view class="plan-item">
              <view class="title" style="background: linear-gradient(90deg, #fd6896 0%, #ffffff 100%)">运动策略</view>

              <view class="content1">
                <view class="content-item">
                  <text>日均消耗目标</text>
                  <text>500千卡</text>
                </view>

                <view class="content-item">
                  <text>有氧运动</text>
                  <text>2次/周·低强度</text>
                </view>

                <view class="content-item">
                  <text>无氧运动</text>
                  <text>1次/周·高强度</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="submit-btn" @click="submit">马上开始计划</view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import * as echarts from '@/uni_modules/lime-echart/static/echarts.min';

let chart1 = null;

export default {
  name: 'planSuggestion',

  data() {
    return {
      planSuggestion: {},
      countdownDays: '',
      countdownHours: '',
      countdownMinutes: '',
      option1: {
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            center: ['50%', '100%'], // 水平居中，垂直方向下移一点（默认是 '50%', '50%'）
            radius: '75%',
            axisLine: {
              lineStyle: {
                width: 15,
              },
            },
            pointer: {
              show: false,
            },
            axisTick: {
              distance: -17,
              length: 19,
              lineStyle: {
                color: '#fff',
                width: 4,
              },
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 0,
              },
            ],
          },
        ],
      },
    };
  },

  computed: {
    ...mapState('app', ['userInfo']),
    ...mapGetters('app', ['isVip']),

    weightData() {
      return {
        min: Number((((this.planSuggestion.height * this.planSuggestion.height) / 10000) * 18.5).toFixed(1)),
        max: Number((((this.planSuggestion.height * this.planSuggestion.height) / 10000) * 24.9).toFixed(1)),
      };
    },

    planDays() {
      let end_date = this.planSuggestion.end_date && this.planSuggestion.end_date.replace(/-/g, '/');
      let start_date = this.planSuggestion.start_date && this.planSuggestion.start_date.replace(/-/g, '/');

      let diff = new Date(end_date).getTime() - new Date(start_date).getTime();
      const minutes = Math.floor(diff / 1000 / 60);
      const hours = Math.floor(minutes / 60);

      return Math.ceil(hours / 24);
    },
  },

  onLoad() {
    this.planSuggestion = uni.getStorageSync('planSuggestion') || {};

    this.option1.series[0].data[0].value = this.planSuggestion.body_score;

    let color = [];

    for (let i = 0; i < 100; i++) {
      if (i <= this.planSuggestion.body_score) {
        color.push([i / 100, '#5664E5']);
      } else {
        color.push([i / 100, '#F2F5FF']);
      }
    }

    this.option1.series[0].axisLine.lineStyle.color = color;

    setTimeout(() => {
      chart1.setOption(this.option1);
    }, 500);
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
      chart1 = await this.$refs.chartRef1.init(echarts);
      chart1.setOption(this.option1);
    },

    submit() {
      if (this.isVip) {
        this.$toRouter('/pages/weightManagementPlan/weightManagementPlan');
      } else {
        this.$toRouter('/pages/vip/vip');
      }
    },
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
  background: #f6f7fb url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/weightManagementPlan/bg.png')
    left top/100% auto no-repeat;
}
</style>

<style scoped lang="scss">
.plan-suggestion-page {
  .page-title {
  }

  .banner {
    padding: calc(var(--page-title-height) + 9rpx) 0 0;
  }

  .plan-box {
    padding: 43rpx 30rpx 100rpx;

    .plan-title {
      font-weight: bold;
      font-size: 40rpx;
      color: #111111;
      margin-bottom: 28rpx;
    }

    .plan-time {
      font-size: 28rpx;
      color: #999999;
      margin-bottom: 31rpx;

      text {
        color: #5664e5;
        font-size: 40rpx;
        font-weight: bold;
        padding: 0 8rpx;
      }
    }

    .card-box {
      margin-bottom: 50rpx;

      .card-item1 {
        background: #ffffff;
        border-radius: 20rpx;
        margin-bottom: 22rpx;

        .card-title {
          padding: 36rpx 19rpx 0;
          position: relative;
          z-index: 9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20rpx;

          text {
            &:nth-child(1) {
              font-weight: 500;
              font-size: 30rpx;
              color: #1a1a1a;
            }

            &:nth-child(2) {
              font-size: 26rpx;
              color: #5168e6;
            }
          }
        }

        .card-title2 {
          padding: 0 19rpx 0;
          font-size: 22rpx;
          color: #999999;
          margin-bottom: 55rpx;
        }

        .chart-box {
          padding: 0 19rpx 0;
          height: 280rpx;
          position: relative;

          .chart {
            position: relative;
            top: -350rpx;
          }

          .chart-data {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 50rpx;
            z-index: 9;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 14rpx;

            text {
              &:nth-child(1) {
                font-weight: 500;
                font-size: 76rpx;
                color: #5664e5;
              }

              &:nth-child(2) {
                font-size: 22rpx;
                color: #999999;
              }
            }
          }
        }

        .bmi {
          padding: 0 19rpx 0;
          width: 580rpx;
          height: 60rpx;
          margin: 0 auto 66rpx;
          background: #f2f5ff;
          border-radius: 30rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28rpx;
          color: #333333;

          text {
            color: #5664e5;
          }
        }

        .plan-detail {
          .title {
            height: 60rpx;
            display: flex;
            align-items: center;
            padding: 0 18rpx;
            font-weight: 500;
            font-size: 30rpx;
            color: #ffffff;
            margin-bottom: 29rpx;
          }

          .content {
            display: flex;
            flex-wrap: wrap;
            padding-left: 59rpx;

            .content-item {
              white-space: nowrap;
              display: flex;
              flex-direction: column;
              gap: 20rpx;
              margin-bottom: 40rpx;

              &:nth-child(4n-3) {
                width: 40%;
              }

              &:nth-child(2) {
                width: 20%;
              }

              &:nth-child(3) {
                width: 20%;
              }

              &:nth-child(4) {
                width: 20%;
              }

              text {
                &:nth-child(1) {
                  font-size: 24rpx;
                  color: #999999;
                }

                &:nth-child(2) {
                  font-weight: 500;
                  font-size: 26rpx;
                  color: #111111;
                }
              }
            }
          }

          .content1 {
            display: flex;
            flex-wrap: wrap;
            padding-left: 20rpx;

            .content-item {
              white-space: nowrap;
              display: flex;
              flex-direction: column;
              gap: 20rpx;
              margin-bottom: 40rpx;
              width: 33%;

              text {
                &:nth-child(1) {
                  font-size: 24rpx;
                  color: #999999;
                }

                &:nth-child(2) {
                  font-weight: 500;
                  font-size: 26rpx;
                  color: #111111;
                }
              }
            }
          }
        }
      }
    }

    .submit-btn {
      width: 550rpx;
      height: 100rpx;
      margin: 0 auto;
      background: linear-gradient(90deg, #4f69e6 0%, #6b56e3 100%);
      border-radius: 50rpx;
      font-weight: bold;
      font-size: 30rpx;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
