<template>
  <view class="my-page">
    <view class="page-title">我的</view>

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
            <text class="tip">ID: {{ userInfo.uid }}</text>
          </view>

          <view class="no-login" v-else @click="$toRouter('/packageLogin/pages/login/login')">
            <text class="name">还未登录</text>
            <text class="tip">登录/注册</text>
          </view>
        </view>

        <view class="setting">
          <image
            mode="widthFix"
            @click="goProfile"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/my/setting.png"
          />
        </view>
      </view>

      <view class="vip-icon" @click="$toRouter('/pages/vip/vip')">
        <image
          class="bg"
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/my/bg2.png"
        />

        <view class="content-box">
          <text>{{ isVip ? '喵互娱会员' : '会员专享' }}</text>
          <text>{{ isVip ? `会员到期：${userInfo.vip_info.vip_end_time.slice(0, 10)}` : '加入会员享受全部权益' }}</text>
        </view>

        <view class="btn" v-if="isVip">续费会员</view>
        <view class="btn" v-else>立即开通</view>
      </view>

      <view class="nav-container">
        <view class="nav">
          <view class="nav-item" @click="goUserCenter">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/my/icon1.png" />
            <text class="nav-title">我的数据</text>
            <uni-icons color="#999999" type="right" size="14"></uni-icons>
          </view>

          <view class="nav-item" @click="jumpAuthPage('/pages/setReminder/setReminder')">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/my/icon2.png" />
            <text class="nav-title">提醒设置</text>
            <uni-icons color="#999999" type="right" size="14"></uni-icons>
          </view>

          <view class="nav-item" @click="jumpAuthPage('/pages/redemption/redemption')">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/my/icon3.png" />
            <text class="nav-title">兑换码</text>
            <uni-icons color="#999999" type="right" size="14"></uni-icons>
          </view>

          <view class="nav-item" @click="jumpAuthPage('/packageLogin/pages/feedback/feedback')">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/my/icon4.png" />
            <text class="nav-title">意见和反馈</text>
            <uni-icons color="#999999" type="right" size="14"></uni-icons>
          </view>

          <view class="nav-item">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/my/icon5.png" />
            <button class="nav-title" open-type="contact">联系客服</button>
            <uni-icons color="#999999" type="right" size="14"></uni-icons>
          </view>

          <view class="nav-item" @click="$toRouter('/packageLogin/pages/about/about')">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/my/icon6.png" />
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
// import * as echarts from '@/uni_modules/lime-echart/static/echarts.min';
import { verifyIsLogin } from '@/utils';

// let chart1 = null;

export default {
  name: 'myPage',

  data() {
    return {
      // option1: {
      //   series: [
      //     {
      //       type: 'gauge',
      //       startAngle: 90,
      //       endAngle: -270,
      //       min: 0,
      //       max: 100,
      //       splitNumber: 12,
      //       itemStyle: {
      //         color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      //           {
      //             offset: 0,
      //             color: '#5168E6', // 起始颜色
      //           },
      //           {
      //             offset: 1,
      //             color: '#6B57E3', // 结束颜色
      //           },
      //         ]),
      //         shadowColor: 'transparent',
      //         shadowBlur: 10,
      //         shadowOffsetX: 2,
      //         shadowOffsetY: 2,
      //       },
      //       progress: {
      //         show: true,
      //         roundCap: true,
      //         width: 4,
      //       },
      //       pointer: {
      //         show: false,
      //       },
      //       axisLine: {
      //         roundCap: true,
      //         lineStyle: {
      //           width: 4,
      //           color: [[1, '#DBDCEC']],
      //         },
      //       },
      //       radius: '100%',
      //       axisTick: {
      //         show: false,
      //       },
      //       splitLine: {
      //         show: false,
      //       },
      //       axisLabel: {
      //         show: false,
      //       },
      //       title: {
      //         show: false,
      //       },
      //       detail: {
      //         show: false,
      //       },
      //       data: [
      //         {
      //           value: 0,
      //         },
      //       ],
      //     },
      //   ],
      // },
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
      // let ratio = this.lossWeightData.a / (this.lossWeightData.a + this.lossWeightData.b);
      // if (ratio < 0) {
      //   ratio = 0;
      // } else if (ratio > 1) {
      //   ratio = 1;
      // }
      // this.option1.series[0].data[0].value = ratio * 100;
      //
      // setTimeout(() => {
      //   chart1.setOption(this.option1);
      // }, 500);
    });
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/share.jpg',
      path: '/pages/index/index',
    };
  },

  methods: {
    ...mapActions('app', ['_getUserDetailInfo', '_getUserInfo']),

    // async init1() {
    //   chart1 = await this.$refs.chart1Ref.init(echarts);
    //   chart1.setOption(this.option1);
    // },

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
  background: #f6f7fb linear-gradient(90deg, #e8fdf4 0%, #f6fcf5 100%) left top/100% 420rpx no-repeat;
}
</style>

<style scoped lang="scss">
.my-page {
  padding-bottom: 60rpx;

  .page-title {
  }

  .banner {
    padding: calc(var(--page-title-height) + 46rpx) 0 0;
  }

  .page-container {
    padding: 0 30rpx;

    .info {
      padding: 0 7rpx;
      display: flex;
      align-items: center;
      margin-bottom: 49rpx;

      .left {
        margin-right: 26rpx;

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

        .username,
        .no-login {
          display: flex;
          flex-direction: column;
          gap: 27rpx;

          .name {
            font-weight: 500;
            font-size: 36rpx;
            color: #222222;
          }

          .tip {
            font-weight: 500;
            font-size: 26rpx;
            color: #999999;
          }
        }
      }

      .setting {
        image {
          width: 40rpx;
        }
      }
    }

    .vip-icon {
      width: 100%;
      margin-bottom: 52rpx;
      position: relative;

      .bg {
        width: 100%;
      }

      .content-box {
        position: absolute;
        left: 69rpx;
        right: 0;
        top: 24rpx;
        bottom: 0;
        display: flex;
        flex-direction: column;
        gap: 17rpx;

        text {
          &:nth-child(1) {
            font-weight: bold;
            font-size: 29rpx;
            color: #333333;
          }

          &:nth-child(2) {
            font-size: 24rpx;
            color: #333333;
          }
        }
      }

      .btn {
        position: absolute;
        top: 33rpx;
        right: 43rpx;
        width: 151rpx;
        height: 55rpx;
        background: linear-gradient(90deg, #ff3121 0%, #ff9102 100%);
        border-radius: 28rpx;
        font-weight: 500;
        font-size: 26rpx;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .nav-container {
      .nav {
        background: #ffffff;
        border-radius: 30rpx;
        padding: 61rpx 20rpx;
        display: flex;
        flex-direction: column;

        .nav-item {
          display: flex;
          align-items: center;

          &:not(:last-child) {
            padding-bottom: 34rpx;
            margin-bottom: 34rpx;
            border-bottom: 2rpx solid #ebebeb;
          }

          image {
            width: 40rpx;
            margin-right: 27rpx;
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
