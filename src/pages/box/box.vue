<template>
  <view class="box-page">
    <view class="page-title"></view>
    <view class="banner"></view>

    <view class="container-box">
      <view class="number">
        <text @click="goExchangeCenter">金币兑换</text>
      </view>

      <view class="word">
        <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/word1.png" />
      </view>

      <view class="user-list">
        <swiper autoplay :interval="3000" circular vertical>
          <swiper-item v-for="(item, key) of userList" :key="key">
            <view>
              <text>{{ item.name }}打开盲盒获得{{ item.value }}</text>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <view class="draw-list-wrapper">
        <view class="title">奖品池</view>

        <view class="draw-list">
          <view class="draw-item">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/icon1.png" />
            <text>7天会员</text>
          </view>

          <view class="draw-item">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/icon2.png" />
            <text>5金币</text>
          </view>

          <view class="draw-item">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/icon2.png" />
            <text>20金币</text>
          </view>

          <view class="draw-item">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/icon1.png" />
            <text>3天会员</text>
          </view>

          <view class="draw-item">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/icon2.png" />
            <text>10金币</text>
          </view>
        </view>
      </view>

      <view class="get-points">
        <view class="lottery-wrapper">
          <view class="lottery">
            <view
              class="item"
              v-for="(item, index) of lotteryList"
              :class="{ active: currentLotteryIndex === index }"
              :key="item.id"
            >
            </view>
          </view>

          <view class="options">
            <view @click="openRuleDialog">活动规则</view>
            <view>剩余金币：{{ accountInfo.points || 0 }}</view>
            <view @click="openRecodeDialog">中奖记录</view>
          </view>

          <view class="lottery-btn">
            <image
              @click="lottery"
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/btn2.png"
            />

            <text class="times">{{ accountInfo.lucky_draw_count }}</text>
          </view>
        </view>

        <view class="task">
          <image
            class="title-icon"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/word2.png"
          />

          <template v-if="isLogin">
            <view class="list">
              <view class="task-item" v-for="item of taskStatusData" :key="item.task_id">
                <view class="points-info">
                  <view class="title"
                    >{{ item.task_name }}（{{ item.completed_count }}/{{ item.max_daily_times }}）</view
                  >

                  <view class="tip">
                    <text>奖励{{ item.base_points }}金币</text
                    ><text v-if="item.base_draw_count">，抽奖次数+{{ item.base_draw_count }}</text>
                  </view>
                </view>

                <button
                  :open-type="
                    item.completed_count !== item.max_daily_times && item.task_id === 10015 ? 'share' : undefined
                  "
                  class="get-btn"
                  :class="{ finish: item.completed_count === item.max_daily_times }"
                  @click="completeTask(item)"
                >
                  {{ item.completed_count === item.max_daily_times ? '已完成' : '去完成' }}
                </button>
              </view>
            </view>
          </template>

          <template v-else>
            <view class="login" @click="$toRouter('/packageLogin/pages/login/login')">登录后查看任务</view>
          </template>
        </view>
      </view>
    </view>

    <uni-popup ref="pointsPopup">
      <view class="points-dialog">
        <view class="tip">
          <image
            v-if="drawResult.vip_type === 0"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/icon2.png"
          />
          <image
            v-else
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/icon1.png"
          />
          <text>{{ drawResult.name }}</text>
        </view>

        <view class="btn" @click="$refs.pointsPopup.close()">
          <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/btn3.png" />
        </view>
      </view>
    </uni-popup>

    <rule-dialog ref="ruleDialog" />
    <recode-dialog ref="recodeDialog" />
  </view>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import RuleDialog from '@/components/ruleDialog.vue';
import RecodeDialog from '@/components/recodeDialog.vue';
import $http from '@/utils/http';
import { verifyIsLogin } from '@/utils';

export default {
  name: 'goldenBeans',

  components: {
    RecodeDialog,
    RuleDialog,
  },

  data() {
    return {
      taskStatusData: [],
      accountInfo: {},
      roundSunshine: [],
      lotteryList: [],
      currentLotteryIndex: -1,
      disabled: false,
      drawResult: {},
      userList: [
        { name: '185****5684', value: '7天会员' },
        { name: '191****5234', value: '50金币' },
        { name: '178****9985', value: '月会员' },
        { name: '136****4521', value: '7天会员' },
        { name: '185****4459', value: '月会员' },
        { name: '138****3214', value: '20金币' },
        { name: '171****4521', value: '10金币' },
        { name: '185****1458', value: '50金币' },
      ],
    };
  },

  computed: {
    ...mapState('app', ['userDetailInfo']),
    ...mapGetters('app', ['isLogin']),
  },

  onShow() {
    this.initData(true);
    this._getUserDetailInfo();
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/share.jpg',
      path: '/pages/index/index',
    };
  },

  methods: {
    ...mapActions('app', ['_getUserDetailInfo']),

    async initData(showToast) {
      if (showToast) {
        uni.showLoading({
          title: '加载中...',
          mask: true,
        });
      }

      this.getLotteryData();
      await this.getTaskStatusData().catch(() => {});
      await this.getAccountInfo().catch(() => {});

      if (showToast) {
        uni.hideLoading();
      }
    },

    getLotteryData() {
      $http.get('api/lucky-bag/lucky-draw-options').then((res) => {
        this.lotteryList = res.data;
      });
    },

    getTaskStatusData() {
      return $http.get('api/lucky-bag/task-status').then((res) => {
        this.taskStatusData = res.data;
      });
    },

    getAccountInfo() {
      return $http.get('api/lucky-bag/account-info').then((res) => {
        this.accountInfo = res.data;
      });
    },

    completeTask(item) {
      if (item.completed_count === item.max_daily_times) {
        return;
      }

      verifyIsLogin();

      // 每日体重记录
      if (item.task_id === 10008) {
        if (!this.userDetailInfo) {
          this.$toRouter('/pages/evaluation/evaluation');
        } else {
          this.$toSwitch('/pages/index/index');
        }
      }
      // 饮食记录
      else if (item.task_id === 10014) {
        this.$toSwitch('/pages/index/index');
      }
      // 分享
      else if (item.task_id === 10015) {
        $http.post('api/lucky-bag/share');
      }
    },

    openRuleDialog() {
      this.$refs.ruleDialog.open();
    },

    goExchangeCenter() {
      verifyIsLogin();
      this.$toRouter('/pages/exchangeCenter/exchangeCenter');
    },

    openRecodeDialog() {
      verifyIsLogin();
      this.$refs.recodeDialog.open();
    },

    lottery() {
      verifyIsLogin();

      if (this.disabled) {
        return;
      }

      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http.post('api/lucky-bag/lucky-draw').then((res) => {
        uni.hideLoading();

        this.drawResult = res.data;
        let currentDraw = this.lotteryList.find((item) => item.id === this.drawResult.id);

        this.drawResult = {
          ...currentDraw,
          ...this.drawResult,
        };

        this.disabled = true;
        this.currentLotteryIndex = 0;
        let count = 0;

        let timer = setInterval(() => {
          if (count === 3) {
            if (this.drawResult.id === this.lotteryList[this.currentLotteryIndex].id) {
              this.disabled = false;
              clearInterval(timer);

              this.initData();
              this.$refs.pointsPopup.open();
            } else {
              this.currentLotteryIndex++;
            }
          } else {
            if (this.currentLotteryIndex === 7) {
              this.currentLotteryIndex = 0;
              count++;
            } else {
              this.currentLotteryIndex++;
            }
          }
        }, 200);
      });
    },
  },
};
</script>

<style>
page {
  height: 100%;
  overflow: auto;
  background: #839af5 url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/bg.png') left top/100% auto
    no-repeat;
}
</style>

<style scoped lang="scss">
.box-page {
  background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/bg2.png') left top/100% auto
      no-repeat,
    url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/bg4.png') left 162rpx top 480rpx/426rpx auto
      no-repeat;

  .page-title {
  }

  .banner {
    padding: calc(var(--page-title-height)) 0 0;
  }

  .container-box {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20rpx;

    .number {
      position: absolute;
      left: 0;
      top: 0;
      background: #00000050;
      border-radius: 0 26rpx 26rpx 0;
      width: 137rpx;
      height: 52rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      text {
        font-size: 26rpx;
        color: #ffffff;
        line-height: 40rpx;
      }
    }

    .word {
      margin-bottom: 30rpx;

      image {
        width: 535rpx;
      }
    }

    .user-list {
      width: 510rpx;
      margin-bottom: 160rpx;

      swiper {
        width: 100%;
        height: 50rpx;
        background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/bg3.png?t=123') left top/100%
          100% no-repeat;

        swiper-item {
          height: 100%;
          width: 100%;

          view {
            font-size: 26rpx;
            color: #ffffff;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }

    .draw-list-wrapper {
      width: 100%;
      height: 135rpx;
      padding: 0 20rpx;
      background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/bg5.png') left top/100% 100%
        no-repeat;
      display: flex;
      align-items: center;
      margin-bottom: 38rpx;

      .title {
        width: 43rpx;
        height: 105rpx;
        background: #fa40b8;
        border-radius: 20rpx;
        font-size: 26rpx;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin-right: 20rpx;
      }

      .draw-list {
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .draw-item {
          width: 105rpx;
          height: 105rpx;
          background: #ffffff;
          border-radius: 20rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10rpx;

          image {
            width: 50rpx;
          }

          text {
            font-size: 24rpx;
            color: #111111;
          }
        }
      }
    }

    .get-points {
      width: 100%;

      .lottery-wrapper {
        position: relative;
        margin-bottom: 30rpx;

        .lottery {
          background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/bg6.png') left top/100% 100%
            no-repeat;
          width: 100%;
          height: 425rpx;
          padding: 60rpx 78rpx;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          justify-items: center;
          gap: 30rpx;
          margin-bottom: 23rpx;

          .item {
            background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/bg7.png') left top/100%
              100% no-repeat;
            width: 112rpx;
            height: 112rpx;

            &.active {
              background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/bg7.png') left top/100%
                100% no-repeat;
              transform: scale(1.1);
            }
          }
        }

        .options {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 90rpx;
          margin-bottom: 43rpx;

          view {
            &:nth-child(1),
            &:nth-child(3) {
              font-size: 28rpx;
              color: #765ae3;
              position: relative;

              &:after {
                content: '';
                position: absolute;
                left: 0;
                right: 0;
                width: 100%;
                bottom: -14rpx;
                height: 2rpx;
                background: #765ae3;
              }
            }

            &:nth-child(2) {
              font-weight: bold;
              font-size: 28rpx;
              color: #765ae3;
            }
          }
        }

        .lottery-btn {
          width: 100%;
          position: relative;

          image {
            width: 100%;
          }

          .times {
            position: absolute;
            right: 20rpx;
            top: -10rpx;
            width: 35rpx;
            height: 35rpx;
            background: #9278fa;
            border-radius: 50%;
            border: 3px solid #ffffff;
            font-weight: bold;
            font-size: 24rpx;
            color: #ffffff;
            line-height: 35rpx;
            text-shadow: 0 3rpx 0 rgba(98, 72, 205, 0.46);
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }

      .task {
        background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/bg8.png') left top/100% 100%
          no-repeat;
        padding: 48rpx 24rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;

        .title-icon {
          width: 335rpx;
          margin-bottom: 47rpx;
        }

        .list {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 19rpx;

          .task-item {
            display: flex;
            align-items: center;
            background: #ffffff;
            border-radius: 30rpx;
            padding: 30rpx 32rpx;

            .points-info {
              flex-grow: 1;
              display: flex;
              flex-direction: column;
              gap: 14rpx;

              .title {
                font-weight: 500;
                font-size: 30rpx;
                color: #111111;
              }

              .tip {
                text {
                  font-size: 24rpx;
                  color: #999999;
                }
              }
            }

            .get-btn {
              width: 155rpx;
              height: 60rpx;
              border-radius: 30rpx;
              background: linear-gradient(-90deg, #fa98dd 0%, #fe40af 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 500;
              font-size: 30rpx;
              color: #ffffff;

              &.finish {
                background: #f7f7f7;
                font-weight: 500;
                color: #e2e2e2;
                border: 1px solid #e2e2e2;
              }

              &:after {
                border: none;
              }
            }
          }
        }

        .login {
          font-size: 28rpx;
          padding: 100rpx 0;
          text-align: center;
          color: #ffffff;
        }
      }
    }
  }

  .points-dialog {
    width: 698rpx;
    height: 698rpx;
    background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/bg9.png') left top/100% 100%
      no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .tip {
      padding-top: 235rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 25rpx;
      margin-bottom: 72rpx;

      image {
        width: 138rpx;
      }

      text {
        font-size: 53rpx;
        color: #ffffff;
      }
    }

    .btn {
      image {
        width: 311rpx;
      }
    }
  }
}
</style>
