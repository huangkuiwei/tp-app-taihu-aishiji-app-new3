<template>
  <view class="my-page">
    <view class="page-title">个人中心</view>

    <view class="banner"></view>

    <view class="page-container">
      <view class="info">
        <view class="left">
          <image
            mode="aspectFill"
            :src="
              userInfo.avatar_url || 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/my/default_head.png'
            "
          />
        </view>

        <view class="right">
          <view class="username" v-if="isLogin">
            <text class="name">{{ userInfo.uname }}</text>
          </view>

          <view class="no-login" v-else @click="$toRouter('/packageLogin/pages/login/login')">
            <text class="name">登录/注册</text>
            <text class="tip">游客模式</text>
          </view>

          <template v-if="isLogin">
            <view class="time">{{ vipName }}</view>
          </template>
        </view>

        <view class="setting">
          <image
            mode="widthFix"
            @click="goProfile"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/my/setting.png"
          />
        </view>
      </view>

      <view class="vip-icon" @click="$toRouter('/pages/vip/vip')">
        <image
          class="bg"
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/my/vip-icon1.png"
        />

        <view class="content-box">
          <text>权益中心</text>
          <text>{{
            isVip ? `会员到期日期：${userInfo.vip_info.vip_end_time.slice(0, 10)}` : '加入会员畅享更多权益'
          }}</text>
        </view>

        <!--<view class="btn" v-if="isVip" @click.stop="$toRouter('/pages/renewalManage/renewalManage')">管理续费</view>-->
        <view class="btn" v-if="!isVip">立即开通</view>
      </view>

      <view class="data">
        <view class="title">
          <text>数据报告</text>
          <text v-if="userDetailInfo" @click="previewDataPage('/pages/dataReport/dataReport')">查看更多</text>
        </view>

        <view class="data-box" v-if="userDetailInfo">
          <view class="left">
            <view class="left-title">
              {{ isWeightLoss ? '本次减重（公斤）' : '本次增肌（公斤）' }}
            </view>
            <view class="chart">
              <l-echart ref="chart1Ref" @finished="init1" />

              <view class="chart-data">
                <view>{{ lossWeightData.a }}</view>
                <view>
                  <text v-if="lossWeightData.b > 0">还差{{ lossWeightData.b }}</text>
                  <text v-else>已完成</text>
                </view>
              </view>
            </view>
            <view class="data-detail">
              <view class="item1">
                <text>{{ userDetailInfo.initial_weight }}</text>
                <text>初始</text>
              </view>

              <view class="item2">
                <image
                  mode="widthFix"
                  src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/my/icon1.png"
                />
              </view>

              <view class="item3">
                <text>{{ userDetailInfo.target_weight }}</text>
                <text>目标</text>
              </view>
            </view>
          </view>

          <view class="right">
            <view class="right-data right-data1">
              <view class="data-title">BMI</view>
              <view class="data-value">
                {{
                  Number(
                    (userDetailInfo.current_weight / ((userDetailInfo.height * userDetailInfo.height) / 10000)).toFixed(
                      1,
                    ),
                  )
                }}
              </view>
            </view>

            <view class="right-data right-data2">
              <view class="data-title">剩余天数</view>
              <view class="data-value">{{ countdownDays }}</view>
            </view>
          </view>
        </view>

        <view class="add-info-tip" v-else>
          <view>
            请先
            <text class="highlight" v-if="isLogin" @click="$toRouter('/pages/evaluation/evaluation')">
              完善个人基本信息
            </text>
            <text class="highlight" v-else @click="$toRouter('/packageLogin/pages/login/login')">登录</text>
          </view>
        </view>
      </view>

      <view class="nav-container">
        <view class="nav">
          <view class="nav-item" @click="goUserCenter">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/my/menu1.png" />
            <text class="nav-title">我的数据</text>
            <uni-icons color="#999999" type="right" size="14"></uni-icons>
          </view>

          <!--<view class="nav-item" @click="jumpAuthPage('/pages/setReminder/setReminder')">-->
          <!--  <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/my/menu2.png" />-->
          <!--  <text class="nav-title">提醒设置</text>-->
          <!--  <uni-icons color="#999999" type="right" size="14"></uni-icons>-->
          <!--</view>-->

          <view class="nav-item" @click="jumpAuthPage('/pages/redemption/redemption')">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/my/menu3.png" />
            <text class="nav-title">兑换码</text>
            <uni-icons color="#999999" type="right" size="14"></uni-icons>
          </view>

          <view class="nav-item" @click="jumpAuthPage('/packageLogin/pages/feedback/feedback')">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/my/menu4.png" />
            <text class="nav-title">意见和反馈</text>
            <uni-icons color="#999999" type="right" size="14"></uni-icons>
          </view>

          <view class="nav-item">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/my/menu5.png" />
            <button class="nav-title" @click="openContact">联系客服</button>
            <uni-icons color="#999999" type="right" size="14"></uni-icons>
          </view>

          <view class="nav-item" @click="$toRouter('/packageLogin/pages/about/about')">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/my/menu6.png" />
            <text class="nav-title">关于我们</text>
            <uni-icons color="#999999" type="right" size="14"></uni-icons>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import * as echarts from '@/uni_modules/lime-echart/static/echarts.min';
import { verifyIsLogin } from '@/utils';

let chart1 = null;

export default {
  name: 'myPage',

  data() {
    return {
      option1: {
        series: [
          {
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            min: 0,
            max: 100,
            splitNumber: 12,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#5168E6', // 起始颜色
                },
                {
                  offset: 1,
                  color: '#6B57E3', // 结束颜色
                },
              ]),
              shadowColor: 'transparent',
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
            progress: {
              show: true,
              roundCap: true,
              width: 4,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 4,
                color: [[1, '#DBDCEC']],
              },
            },
            radius: '100%',
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            title: {
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
    ...mapState('app', ['userInfo', 'userDetailInfo']),
    ...mapGetters('app', ['isLogin', 'isVip', 'vipName']),

    isWeightLoss() {
      if (!this.isLogin || !this.userDetailInfo) {
        return true;
      }

      return this.userDetailInfo.initial_weight - this.userDetailInfo.target_weight > 0;
    },

    lossWeightData() {
      if (!this.userDetailInfo) {
        return {};
      }

      if (this.isWeightLoss) {
        return {
          a: Number((this.userDetailInfo.initial_weight - this.userDetailInfo.current_weight).toFixed(2)),
          b: Number((this.userDetailInfo.current_weight - this.userDetailInfo.target_weight).toFixed(2)),
        };
      } else {
        return {
          a: Number((this.userDetailInfo.current_weight - this.userDetailInfo.initial_weight).toFixed(2)),
          b: Number((this.userDetailInfo.target_weight - this.userDetailInfo.current_weight).toFixed(2)),
        };
      }
    },

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
  },

  onShow() {
    this._getUserInfo();
    this._getUserDetailInfo().then(() => {
      let ratio = this.lossWeightData.a / (this.lossWeightData.a + this.lossWeightData.b);

      if (ratio < 0) {
        ratio = 0;
      } else if (ratio > 1) {
        ratio = 1;
      }

      this.option1.series[0].data[0].value = ratio * 100;

      setTimeout(() => {
        chart1.setOption(this.option1);
      }, 500);
    });
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/share-img.jpg',
      path: '/pages/index/index',
    };
  },

  methods: {
    ...mapActions('app', ['_getUserDetailInfo', '_getUserInfo']),

    async init1() {
      chart1 = await this.$refs.chart1Ref.init(echarts);
      chart1.setOption(this.option1);
    },

    previewDataPage(url) {
      verifyIsLogin();

      if (!this.userDetailInfo) {
        this.$toRouter('/pages/evaluation/evaluation');
        return;
      }

      this.$toRouter(url);
    },

    openContact() {
      uni.openCustomerServiceChat({
        corpId: 'wwfee5c045f8987186',
        extInfo: {
          url: 'https://work.weixin.qq.com/kfid/kfcb64201122e83af30',
        },
      });
    },

    jumpAuthPage(url) {
      verifyIsLogin();
      this.$toRouter(url);
    },

    goProfile() {
      verifyIsLogin();
      this.$toRouter('/pages/profile/profile');
    },

    goUserCenter() {
      verifyIsLogin();

      if (!this.userDetailInfo) {
        this.$toRouter('/pages/evaluation/evaluation');
        return;
      }

      this.$toRouter('/pages/userCenter/userCenter');
    },
  },
};
</script>

<style>
page {
  background: #f6f7fb url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/home/banner-bg.png') left
    top/100% auto no-repeat;
}
</style>

<style scoped lang="scss">
.my-page {
  padding-bottom: 60rpx;

  .page-title {
  }

  .banner {
    padding: calc(var(--page-title-height) + 23rpx) 0 0;
  }

  .page-container {
    padding: 0 30rpx;

    .info {
      display: flex;
      align-items: center;
      margin-bottom: 33rpx;

      .left {
        margin-right: 18rpx;

        image {
          width: 130rpx;
          height: 130rpx;
          border-radius: 50%;
          display: block;
        }
      }

      .right {
        display: flex;
        flex-direction: column;
        gap: 21rpx;
        flex-grow: 1;

        .username {
          display: flex;
          align-items: center;

          .name {
            font-weight: bold;
            font-size: 26rpx;
            color: #222222;
          }
        }

        .no-login {
          display: flex;
          flex-direction: column;
          gap: 21rpx;

          .name {
            font-weight: bold;
            font-size: 26rpx;
            color: #222222;
          }

          .tip {
            font-weight: 500;
            font-size: 22rpx;
            color: #333333;
          }
        }

        .time {
          font-weight: 500;
          font-size: 22rpx;
          color: #333333;
          display: flex;
          align-items: center;
          gap: 20rpx;
        }
      }

      .setting {
        image {
          width: 41rpx;
        }
      }
    }

    .vip-icon {
      width: 100%;
      margin-bottom: 23rpx;
      position: relative;

      .bg {
        width: 100%;
      }

      .content-box {
        position: absolute;
        left: 114rpx;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 17rpx;

        text {
          &:nth-child(1) {
            font-weight: 500;
            font-size: 26rpx;
            color: #f5c08c;
          }

          &:nth-child(2) {
            font-size: 22rpx;
            color: #9e764f;
          }
        }
      }

      .btn {
        position: absolute;
        top: 33rpx;
        right: 43rpx;
        width: 160rpx;
        height: 54rpx;
        background: linear-gradient(180deg, #ffab37 0%, #fe7b35 100%);
        border-radius: 27rpx;
        font-weight: bold;
        font-size: 26rpx;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .data {
      background: #ffffff;
      box-shadow: 0 3rpx 21rpx 0 rgba(215, 218, 242, 0.29);
      border-radius: 20rpx;
      padding: 30rpx;
      margin-bottom: 21rpx;

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 30rpx;

        text {
          &:nth-child(1) {
            color: #111111;
            font-size: 30rpx;
            font-weight: 500;
          }

          &:nth-child(2) {
            color: #999999;
            font-size: 24rpx;
          }
        }
      }

      .data-box {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left,
        .right {
          width: calc(50% - 5rpx);

          &.left {
            background: #f6f7fb;
            border-radius: 14rpx;
            padding: 22rpx;

            .left-title {
              font-weight: 500;
              font-size: 26rpx;
              color: #222222;
              margin-bottom: 40rpx;
            }

            .chart {
              width: 200rpx;
              height: 200rpx;
              margin: 0 auto 23rpx;
              position: relative;

              .chart-data {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 19rpx;

                view {
                  &:nth-child(1) {
                    font-weight: 500;
                    font-size: 40rpx;
                    color: #222222;
                  }

                  &:nth-child(2) {
                    background: #ecedff;
                    border-radius: 19rpx;
                    font-size: 24rpx;
                    color: #5664e5;
                    padding: 6rpx 16rpx;
                  }
                }
              }
            }

            .data-detail {
              display: flex;
              align-items: center;
              justify-content: space-between;

              .item1,
              .item3 {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 10rpx;

                text {
                  &:nth-child(1) {
                    color: #333333;
                    font-size: 32rpx;
                  }

                  &:nth-child(2) {
                    color: #666666;
                    font-size: 26rpx;
                  }
                }
              }

              .item2 {
                image {
                  width: 19rpx;
                }
              }
            }
          }

          &.right {
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .right-data {
              padding: 20rpx 31rpx 67rpx;

              &.right-data1 {
                background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/my/bg1.png') left top/100%
                  100% no-repeat;
              }

              &.right-data2 {
                background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/my/bg2.png') left top/100%
                  100% no-repeat;
                position: relative;
                top: 10rpx;
              }

              .data-title {
                font-weight: 500;
                font-size: 26rpx;
                color: #222222;
                margin-bottom: 56rpx;
              }

              .data-value {
                font-weight: 500;
                font-size: 34rpx;
                color: #222222;
              }
            }
          }
        }
      }

      .add-info-tip {
        font-size: 26rpx;
        text-align: center;
        padding: 40rpx 0 20rpx;

        .highlight {
          color: #5664e5;
        }
      }
    }

    .nav-container {
      .nav {
        background: #ffffff;
        border-radius: 20rpx;
        padding: 40rpx 30rpx;
        display: flex;
        flex-direction: column;

        .nav-item {
          display: flex;
          align-items: center;

          &:not(:last-child) {
            padding-bottom: 30rpx;
            margin-bottom: 30rpx;
            border-bottom: 2rpx solid #f6f6f6;
          }

          image {
            width: 60rpx;
            margin-right: 20rpx;
          }

          .nav-title {
            font-weight: 500;
            font-size: 28rpx;
            color: #111111;
            flex-grow: 1;
          }

          button {
            text-align: left;
            background: transparent;
            padding: 0 0 0 2rpx;
            margin: 0;

            &:after {
              border: none;
            }
          }
        }
      }
    }
  }
}
</style>
