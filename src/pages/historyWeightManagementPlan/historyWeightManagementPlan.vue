<template>
  <view class="history-weight-management-plan-page">
    <view class="page-title">
      <text>历史体重管理方案</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="plan-box">
      <view class="plan-title">
        <view class="left">
          <image
            class="word-icon"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/weightManagementPlan/word.png"
          />

          <view class="des">
            <view class="des-item">
              <image
                mode="widthFix"
                src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/weightManagementPlan/icon1.png"
              />

              <text>智能定制</text>
            </view>

            <view class="des-item">
              <image
                mode="widthFix"
                src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/weightManagementPlan/icon1.png"
              />

              <text>真实有效</text>
            </view>
          </view>
        </view>

        <view class="right">
          <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/weightManagementPlan/icon2.png"
          />
        </view>
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
              <text>{{ lastPlanData.body_score }}</text>
              <text>身体评分</text>
            </view>
          </view>

          <view class="bmi">
            初始BMI值为：
            <text>{{ lastPlanData.plan_initial_bmi }}</text>
          </view>

          <view class="detail-box">
            <image
              class="icon"
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/weightManagementPlan/icon3.png"
            />

            <view class="detail-info1">
              <view class="title">指标详情</view>

              <view class="info">
                <text>性别: {{ userDetailInfo.gender === 1 ? '男' : '女' }}</text>
                <text>年龄: {{ lastPlanData.actual_age }}岁</text>
                <text>身高: {{ userDetailInfo.height }}cm</text>
                <text>体重: {{ lastPlanData.current_weight }}公斤</text>
              </view>
            </view>

            <view class="detail-info2">
              <view class="left">
                <view class="left-item">
                  <text class="name">体脂率</text>

                  <view class="value">
                    <text>{{ lastPlanData.body_fat_percentage }}%</text>
                    <text>{{ bodyStatus.fatStatus }}</text>
                  </view>
                </view>

                <view class="left-item">
                  <text class="name">身体年龄</text>

                  <view class="value">
                    <text>{{ lastPlanData.body_age }}岁</text>
                    <text>{{ bodyStatus.ageStatus }}</text>
                  </view>
                </view>

                <view class="left-item">
                  <text class="name">基础代谢率</text>

                  <view class="value">
                    <text>{{ lastPlanData.plan_initial_bmr }}千卡/日</text>
                    <text v-if="realBMIScore === 1">偏低</text>
                    <text v-else-if="realBMIScore === 2">正常</text>
                    <text v-else>偏高</text>
                  </view>
                </view>
              </view>

              <view class="middle">
                <image
                  class="icon"
                  mode="widthFix"
                  src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/weightManagementPlan/icon4.png"
                />
              </view>

              <view class="right">
                <view class="right-item">
                  <text class="name">BMI</text>

                  <view class="value">
                    <text>{{ realBMI }}</text>
                  </view>
                </view>

                <view class="evaluate">
                  <view class="measure">
                    <view class="line">
                      <view class="line-item" v-for="(item, index) of scoreList" :key="item">
                        <text :style="{ visibility: realBMIScore === index + 1 ? '' : 'hidden' }"></text>
                        <text></text>
                        <text>{{ item }}</text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <!--<view class="chart-item2">-->
        <!--  <view class="card-title">-->
        <!--    <text>瘦身目标</text>-->
        <!--  </view>-->

        <!--  <view class="card-title2">-->
        <!--    预计在-->
        <!--    <text>{{ lastPlanData.end_date && lastPlanData.end_date.slice(0, 10) }}</text>-->
        <!--    达到-->
        <!--    <text>{{ lastPlanData.plan_target_weight }}KG</text>-->
        <!--  </view>-->
        <!--</view>-->
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import * as echarts from '@/uni_modules/lime-echart/static/echarts.min';

let chart1 = null;

export default {
  name: 'historyWeightManagementPlan',

  data() {
    return {
      lastPlanData: {},
      scoreList: ['偏瘦', '正常', '偏胖', '超胖'],
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

  onShow() {
    this.getLastPlanData();
    this._getUserInfo();
  },

  onLoad() {
    this.getLastPlanData();
  },

  computed: {
    ...mapState('app', ['userInfo', 'userDetailInfo']),

    realBMI() {
      if (this.userDetailInfo) {
        return Number(
          (
            this.userDetailInfo.current_weight /
            ((this.userDetailInfo.height * this.userDetailInfo.height) / 10000)
          ).toFixed(1),
        );
      }

      return undefined;
    },

    realBMIScore() {
      if (this.realBMI < 18.5) {
        return 1;
      } else if (this.realBMI >= 18.5 && this.realBMI <= 24.9) {
        return 2;
      } else if (this.realBMI > 24.9) {
        return 3;
      } else {
        return 4;
      }
    },

    bodyStatus() {
      let result = {};

      if (this.userDetailInfo) {
        if (this.lastPlanData.body_age <= this.lastPlanData.actual_age) {
          result.ageStatus = '正常';
        } else {
          result.ageStatus = '偏高';
        }

        // 男
        if (this.userDetailInfo.gender === 1) {
          if (this.lastPlanData.body_fat_percentage < 10) {
            result.fatStatus = '偏低';
          } else if (this.lastPlanData.body_fat_percentage >= 10 && this.lastPlanData.body_fat_percentage <= 20) {
            result.fatStatus = '正常';
          } else {
            result.fatStatus = '偏高';
          }
        } else {
          if (this.lastPlanData.body_fat_percentage < 10) {
            result.fatStatus = '偏低';
          } else if (this.lastPlanData.body_fat_percentage >= 10 && this.lastPlanData.body_fat_percentage <= 20) {
            result.fatStatus = '正常';
          } else {
            result.fatStatus = '偏高';
          }
        }
      }

      return result;
    },
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/share-img.jpg',
      path: '/pages/index/index',
    };
  },

  methods: {
    ...mapActions('app', ['_getUserInfo']),

    async init1() {
      chart1 = await this.$refs.chartRef1.init(echarts);
      chart1.setOption(this.option1);
    },

    /**
     * 获取最新一次计划数据
     */
    getLastPlanData() {
      this.lastPlanData = uni.getStorageSync('lastPlanData');

      this.option1.series[0].data[0].value = this.lastPlanData.body_score;

      let color = [];

      for (let i = 0; i < 100; i++) {
        if (i <= this.lastPlanData.body_score) {
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
.history-weight-management-plan-page {
  .page-title {
    background: #ffffff;
  }

  .banner {
    padding: calc(var(--page-title-height) + 9rpx) 0 0;
    background: #ffffff;
  }

  .plan-box {
    padding: 43rpx 30rpx 100rpx;

    .plan-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 54rpx;
      margin-bottom: 29rpx;

      .left {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 28rpx;

        .word-icon {
          width: 436rpx;
        }

        .des {
          height: 48rpx;
          padding: 0 16rpx;
          background: linear-gradient(90deg, #fbf6ff 0%, #f1f3ff 100%);
          border-radius: 24rpx;
          border: 1px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 21rpx;

          .des-item {
            display: flex;
            align-items: center;
            justify-content: center;

            image {
              width: 26rpx;
              margin-right: 9rpx;
            }

            text {
              font-size: 26rpx;
              color: #1a1a1a;
            }
          }
        }
      }

      .right {
        image {
          width: 197rpx;
        }
      }
    }

    .card-box {
      .card-item1 {
        background: #ffffff;
        padding: 36rpx 19rpx;
        border-radius: 20rpx;
        margin-bottom: 22rpx;

        .card-title {
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
          font-size: 22rpx;
          color: #999999;
          margin-bottom: 55rpx;
        }

        .chart-box {
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
          width: 580rpx;
          height: 60rpx;
          margin: 0 auto 18rpx;
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

        .detail-box {
          .icon {
            width: 100%;
            margin-bottom: 12rpx;
          }

          .detail-info1 {
            padding: 17rpx 12rpx;
            margin-bottom: 48rpx;

            .title {
              font-weight: 500;
              font-size: 30rpx;
              color: #111111;
              margin-bottom: 31rpx;
            }

            .info {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10rpx;

              text {
                width: 150px;
                height: 52rpx;
                background: #ffffff;
                border-radius: 10rpx;
                white-space: nowrap;
                border: 1px solid #e7e7e7;
                font-size: 22rpx;
                color: #666666;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
          }

          .detail-info2 {
            display: flex;
            align-items: center;

            .left {
              display: flex;
              flex-direction: column;
              gap: 55rpx;
            }

            .left-item,
            .right-item {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 12rpx;
              position: relative;

              .name {
                color: #333333;
                font-size: 22rpx;
              }

              .value {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 30rpx;

                text {
                  &:nth-child(1) {
                    color: #5664e5;
                    font-size: 30rpx;
                  }

                  &:nth-child(2) {
                    height: 32rpx;
                    background: #5664e5;
                    border-radius: 5rpx;
                    font-size: 22rpx;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 6rpx;
                  }
                }
              }
            }

            .middle {
              flex-grow: 1;

              .icon {
                width: 178rpx;
              }
            }

            .right {
              .right-item {
                margin-bottom: 30rpx;

                .name {
                  align-self: flex-end;
                }

                .value {
                  align-self: flex-end;
                }
              }

              .evaluate {
                .measure {
                  .line {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 4rpx;

                    .line-item {
                      display: flex;
                      align-items: center;
                      justify-content: center;

                      text {
                        &:nth-child(1) {
                          border-left: 12rpx solid #666666;
                          border-right: 12rpx solid transparent;
                          border-top: 12rpx solid transparent;
                          border-bottom: 12rpx solid transparent;
                        }

                        &:nth-child(2) {
                          width: 12rpx;
                          height: 48rpx;
                          margin-right: 5rpx;
                        }

                        &:nth-child(3) {
                          font-size: 22rpx;
                          color: #999999;
                          white-space: nowrap;
                        }
                      }

                      &:nth-child(1) {
                        text {
                          &:nth-child(2) {
                            background: linear-gradient(0deg, #5aff8a 0%, #83dff4 100%);
                            border-radius: 6rpx 6rpx 0rpx 0rpx;
                          }
                        }
                      }

                      &:nth-child(2) {
                        text {
                          &:nth-child(2) {
                            width: 12rpx;
                            height: 68rpx;
                            background: linear-gradient(0deg, #f4c839 0%, #64fd83 100%);
                          }
                        }
                      }

                      &:nth-child(3) {
                        text {
                          &:nth-child(2) {
                            background: linear-gradient(0deg, #ff725a 0%, #fcbd35 100%);
                          }
                        }
                      }

                      &:nth-child(4) {
                        text {
                          &:nth-child(2) {
                            background: #fe6e61;
                            border-radius: 0rpx 0rpx 6rpx 6rpx;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      .chart-item2 {
        background: #ffffff;
        padding: 29rpx 19rpx;
        border-radius: 20rpx;
        margin-bottom: 20rpx;

        .card-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 50rpx;

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
          color: #1a1a1a;
          font-size: 26rpx;

          text {
            color: #5664e5;
            font-size: 30rpx;
          }
        }
      }
    }
  }
}
</style>
