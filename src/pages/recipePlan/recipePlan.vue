<template>
  <view class="recipe-plan-page">
    <view class="date">
      <calendar2 ref="calendar2" title="食谱计划" @selectDayChange="selectDayChange" />
    </view>

    <view class="container">
      <view class="chart-box">
        <view class="title">
          <text>饮食方案</text>
          <text>1000千卡</text>
        </view>

        <view class="detail">
          <view class="chart">
            <l-echart ref="chartRef" @finished="init" />
            <view class="number">
              <text>{{ 230 }}</text>
              <text>千卡</text>
            </view>
          </view>

          <view class="component">
            <view class="item">
              <text></text>
              <text>碳水化合物</text>
              <text>{{ 12 }}%</text>
              <text>{{ 10 }}克</text>
            </view>

            <view class="item">
              <text></text>
              <text>蛋白质</text>
              <text>{{ 56 }}%</text>
              <text>{{ 21.5 }}克</text>
            </view>

            <view class="item">
              <text></text>
              <text>脂肪</text>
              <text>{{ 32 }}%</text>
              <text>{{ 12.5 }}克</text>
            </view>
          </view>
        </view>
      </view>

      <view class="food-type-list">
        <view class="food-type-item" v-for="item of recodeList" :key="item.type">
          <view class="food-type-title">
            <view class="title">{{ item.text }}</view>
            <view class="time">{{ item.time }}</view>
            <view class="calorie">165/170千卡</view>
          </view>

          <view class="food-list">
            <view class="food-item">
              <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/logo3.jpg" />
              <view class="info">
                <text>拌黄瓜</text>
                <text>100克/16.00千卡</text>
              </view>
              <view class="replace" @click="replaceFood">更换</view>
            </view>

            <view class="food-item">
              <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/logo3.jpg" />
              <view class="info">
                <text>拌黄瓜</text>
                <text>100克/16.00千卡</text>
              </view>
              <view class="replace">更换</view>
            </view>

            <view class="food-item">
              <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/logo3.jpg" />
              <view class="info">
                <text>拌黄瓜</text>
                <text>100克/16.00千卡</text>
              </view>
              <view class="replace">更换</view>
            </view>
          </view>

          <view class="number">营养指数：95%</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import * as echarts from '@/uni_modules/lime-echart/static/echarts.min';
import Calendar2 from '@/components/calendar2.vue';

let chart = null;

export default {
  name: 'recipePlan',

  data() {
    return {
      selectDate: {},
      option: {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          show: false,
        },
        color: ['#BEF054', '#FE5B1F', '#FFB66E'],
        series: [
          {
            type: 'pie',
            radius: ['100%', '90%'],
            label: {
              show: false,
            },
            emphasis: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
        ],
      },
      recodeList: [
        {
          type: 1,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-icon1.png',
          text: '早餐',
          time: '07:00-09:00',
        },
        {
          type: 2,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-icon1.png',
          text: '早加餐',
          time: '09:00-11:00',
        },
        {
          type: 3,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-icon2.png',
          text: '午餐',
          time: '11:00-13:00',
        },
        {
          type: 4,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-icon2.png',
          text: '午加餐',
          time: '15:00-17:00',
        },
        {
          type: 5,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-icon3.png',
          text: '晚餐',
          time: '17:00-19:00',
        },
        {
          type: 6,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-icon3.png',
          text: '晚加餐',
          time: '19:00-20:00',
        },
      ],
    };
  },

  components: {
    Calendar2,
  },

  methods: {
    async init() {
      chart = await this.$refs.chartRef.init(echarts);
      chart.setOption(this.option);
    },

    selectDayChange(value) {
      this.selectDate = {
        currentDate: new Date(value),
        numberDay: new Date(value).getDay(),
      };
    },

    replaceFood() {
      this.$toRouter('/pages/replaceFood/replaceFood');
    },
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
}
</style>

<style scoped lang="scss">
.recipe-plan-page {
  height: 100%;
  overflow: auto;
  background: #f6f7fb linear-gradient(180deg, #e9f4ee 0%, #f2f6f7 73%) left top/100% 400rpx no-repeat;

  .date {
    padding: 0 25rpx;
    margin-bottom: 40rpx;
    position: relative;
  }

  .container {
    padding: 0 30rpx 80rpx;
    margin-bottom: 30rpx;

    .chart-box {
      background: #ffffff;
      border-radius: 30rpx;
      padding: 32rpx 25rpx;
      margin-bottom: 30rpx;

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 500;
        font-size: 28rpx;
        color: #1a1a1a;
        margin-bottom: 59rpx;
      }

      .detail {
        display: flex;
        align-items: center;

        .chart {
          width: 160rpx;
          height: 160rpx;
          margin-right: 56rpx;
          position: relative;

          .number {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 18rpx;

            text {
              &:nth-child(1) {
                font-weight: 500;
                font-size: 34rpx;
                color: #111111;
              }

              &:nth-child(2) {
                font-size: 22rpx;
                color: #999999;
              }
            }
          }
        }

        .component {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 25rpx;

          .item {
            display: flex;
            align-items: center;

            &:nth-child(1) {
              text {
                &:nth-child(1) {
                  background: #bef054;
                }
              }
            }

            &:nth-child(2) {
              text {
                &:nth-child(1) {
                  background: #fe5b1f;
                }
              }
            }

            &:nth-child(3) {
              text {
                &:nth-child(1) {
                  background: #ffb66e;
                }
              }
            }

            text {
              font-size: 24rpx;
              color: #666666;

              &:nth-child(1) {
                width: 15rpx;
                height: 15rpx;
                border-radius: 2rpx;
                margin-right: 12rpx;
              }

              &:nth-child(2) {
                width: 46%;
              }

              &:nth-child(3) {
                flex-grow: 1;
              }
            }
          }
        }
      }
    }

    .food-type-list {
      display: flex;
      flex-direction: column;
      gap: 30rpx;

      .food-type-item {
        background: #ffffff;
        border-radius: 30rpx;
        padding: 30rpx;
        background: #fffae7;

        .food-type-title {
          display: flex;
          align-items: center;
          margin-bottom: 33rpx;

          .title {
            font-weight: 500;
            font-size: 28rpx;
            color: #1a1a1a;
            margin-right: 21rpx;
          }

          .time {
            font-size: 24rpx;
            color: #1a1a1a;
            flex-grow: 1;
          }

          .calorie {
            font-size: 28rpx;
            color: #1a1a1a;
          }
        }
      }

      .food-list {
        display: flex;
        flex-direction: column;
        gap: 20rpx;
        margin-bottom: 40rpx;

        .food-item {
          padding: 10rpx;
          background: #ffffff;
          border-radius: 20rpx;
          display: flex;
          align-items: center;

          image {
            width: 100rpx;
            border-radius: 20rpx;
            margin-right: 18rpx;
          }

          .info {
            display: flex;
            flex-direction: column;
            gap: 24rpx;
            flex-grow: 1;

            text {
              &:nth-child(1) {
                font-size: 28rpx;
                color: #1a1a1a;
              }

              &:nth-child(2) {
                font-size: 24rpx;
                color: #999999;
              }
            }
          }

          .replace {
            width: 148rpx;
            height: 60rpx;
            border-radius: 30rpx;
            border: 2rpx solid #65d285;
            font-weight: 500;
            font-size: 26rpx;
            color: #65d285;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }

      .number {
        font-size: 28rpx;
        color: #1a1a1a;
      }
    }
  }
}
</style>
