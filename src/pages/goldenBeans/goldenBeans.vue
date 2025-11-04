<template>
  <view class="golden-beans">
    <view class="page-title">赚金豆</view>

    <view class="banner"></view>

    <view class="container-box">
      <view class="number">
        <text>我的金豆</text>
        <text>{{ accountInfo.points || 0 }}</text>
        <text @click="openRecodeDialog">查看明细 ></text>
      </view>

      <view class="icon1">
        <image
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/icon1.png"
        />
      </view>

      <view class="open-btn">
        <image
          mode="widthFix"
          :src="
            accountInfo.lucky_bag_count
              ? 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/icon2.png'
              : 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/icon2_1.png'
          "
          @click="openLuckyBag"
        />
      </view>

      <image
        class="rule-icon"
        mode="widthFix"
        @click="openRuleDialog"
        src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/icon3.png"
      />

      <image
        class="exchange-icon"
        mode="widthFix"
        @click="goExchangeCenter"
        src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/icon4.png"
      />

      <image
        class="golden1"
        mode="widthFix"
        src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/icon5.png"
      />

      <image
        class="golden2"
        mode="widthFix"
        src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/icon5.png"
      />

      <image
        class="golden3"
        mode="widthFix"
        src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/icon5.png"
      />

      <image
        class="golden4"
        mode="widthFix"
        src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/icon5.png"
      />

      <image
        class="golden5"
        mode="widthFix"
        src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/icon5.png"
      />
    </view>

    <view class="get-points">
      <view class="lottery-wrapper">
        <image
          class="title-icon"
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/icon7.png"
        />

        <view class="lottery">
          <view
            class="item"
            v-for="(item, index) of lotteryList"
            :class="{ active: currentLotteryIndex === index }"
            :key="item.id"
          >
            <image
              v-if="item.reward_type === 1"
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/lottery1.png"
            />
            <image
              v-else-if="item.reward_type === 2"
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/lottery2.png"
            />
            <text>{{ item.name }}</text>
          </view>
        </view>

        <image
          @click="lottery"
          class="lottery-btn"
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/icon8.png"
        />
      </view>

      <view class="task">
        <image
          class="title-icon"
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/icon6.png"
        />

        <template v-if="isLogin">
          <view class="list">
            <view class="task-item" v-for="item of taskStatusData" :key="item.task_id">
              <view class="points-info">
                <view class="title">{{ item.task_name }}（{{ item.completed_count }}/{{ item.max_daily_times }}）</view>

                <view class="tip">
                  <text>+{{ item.base_points }}金豆</text>
                </view>
              </view>

              <view
                class="get-btn"
                :class="{ finish: item.completed_count === item.max_daily_times }"
                @click="completeTask(item)"
              >
                {{ item.completed_count === item.max_daily_times ? '已完成' : '去完成' }}
              </view>
            </view>
          </view>
        </template>

        <template v-else>
          <view class="login" @click="$toRouter('/packageLogin/pages/login/login')">登录后查看任务</view>
        </template>
      </view>
    </view>

    <uni-popup ref="pointsPopup">
      <view class="points-dialog" @click="$refs.pointsPopup.close()">
        <view class="tip">
          <template v-if="drawResult.id">
            恭喜！获得 <text>{{ drawResult.name }}</text>
          </template>

          <template v-else>
            恭喜！获得 <text>{{ drawResult.points }}</text> 金豆
          </template>
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
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/share-img.jpg',
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

    openLuckyBag() {
      if (!this.accountInfo.lucky_bag_count) {
        return;
      }

      verifyIsLogin();

      uni.showLoading({
        title: '抽取中...',
        mask: true,
      });

      $http.post('api/lucky-bag/open-lucky-bag').then((res) => {
        uni.hideLoading();

        this.initData();
        this.drawResult = res.data;
        this.$refs.pointsPopup.open();
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
  background: linear-gradient(90deg, #f9553a 0%, #fe6e3c 52%, #f9553a 100%);
}
</style>

<style scoped lang="scss">
.golden-beans {
  background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/bg1.png') left top/100% auto
    no-repeat;

  .page-title {
    color: #ffffff;
  }

  .banner {
    padding: calc(var(--page-title-height)) 0 41rpx;
  }

  .container-box {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 140rpx;

    .number {
      background: #11040145;
      border-radius: 33rpx;
      height: 66rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 32rpx;
      gap: 59rpx;
      margin-bottom: 100rpx;

      text {
        color: #ffffff;

        &:nth-child(1),
        &:nth-child(3) {
          font-weight: 500;
          font-size: 26rpx;
        }

        &:nth-child(2) {
          font-weight: bold;
          font-size: 36rpx;
        }
      }
    }

    .icon1 {
      margin-bottom: 80rpx;

      image {
        width: 393rpx;
      }
    }

    .open-btn {
      image {
        width: 405rpx;
      }
    }

    .rule-icon {
      position: absolute;
      top: 77rpx;
      left: 30rpx;
      width: 84rpx;
    }

    .exchange-icon {
      position: absolute;
      top: 207rpx;
      left: 30rpx;
      width: 84rpx;
    }

    .golden1 {
      position: absolute;
      top: 324rpx;
      left: 130rpx;
      width: 69rpx;
    }

    .golden2 {
      position: absolute;
      top: 165rpx;
      left: 157rpx;
      width: 81rpx;
    }

    .golden3 {
      position: absolute;
      top: 89rpx;
      left: 431rpx;
      width: 56rpx;
    }

    .golden4 {
      position: absolute;
      top: 223rpx;
      left: 545rpx;
      width: 89rpx;
    }

    .golden5 {
      position: absolute;
      top: 414rpx;
      left: 540rpx;
      width: 81rpx;
    }
  }

  .get-points {
    padding: 0 30rpx 80rpx;

    .lottery-wrapper {
      background: linear-gradient(0deg, #f7775f 0%, #ff916e 100%);
      border-radius: 20rpx;
      border: 1px solid #fefdf9;
      height: 770rpx;
      padding: 100rpx 20rpx 20rpx;
      margin-bottom: 76rpx;
      position: relative;

      .title-icon {
        position: absolute;
        top: -8rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 336rpx;
      }

      .lottery {
        height: 650rpx;
        background: #ffc8a5;
        border-radius: 15rpx;
        position: relative;

        .item {
          position: absolute;
          background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/bg2.png') left
            top/100% 100% no-repeat;
          width: 190rpx;
          height: 190rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 29rpx;

          &.active {
            background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/bg3.png') left
              top/100% 100% no-repeat;
          }

          &:nth-child(1) {
            top: 20rpx;
            left: 4%;
          }

          &:nth-child(2) {
            top: 20rpx;
            left: 36%;
          }

          &:nth-child(3) {
            top: 20rpx;
            right: 4%;
          }

          &:nth-child(4) {
            top: 230rpx;
            right: 4%;
          }

          &:nth-child(5) {
            top: 440rpx;
            right: 4%;
          }

          &:nth-child(6) {
            top: 440rpx;
            left: 36%;
          }

          &:nth-child(7) {
            top: 440rpx;
            left: 4%;
          }

          &:nth-child(8) {
            top: 230rpx;
            left: 4%;
          }

          image {
            width: 83rpx;
          }

          text {
            font-weight: 500;
            font-size: 24rpx;
            color: #111111;
          }
        }
      }

      .lottery-btn {
        position: absolute;
        top: 330rpx;
        left: 36%;
        width: 198rpx;
      }
    }

    .task {
      background: linear-gradient(0deg, #f7775f 0%, #ff916e 100%);
      border-radius: 20rpx;
      border: 1px solid #fefdf9;
      padding: 100rpx 20rpx 20rpx;
      display: flex;
      flex-direction: column;
      gap: 15rpx;
      position: relative;

      .title-icon {
        position: absolute;
        top: -8rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 336rpx;
      }

      .list {
        background: #ffc8a5;
        border-radius: 15rpx;
        padding: 20rpx;
        display: flex;
        flex-direction: column;
        gap: 15rpx;

        .task-item {
          display: flex;
          align-items: center;
          background: #ffffff;
          border-radius: 10rpx;
          padding: 37rpx 20rpx;

          .points-info {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 14rpx;

            .title {
              font-weight: 500;
              font-size: 28rpx;
              color: #222222;
            }

            .tip {
              text {
                font-size: 24rpx;
                color: #999999;
              }
            }
          }

          .get-btn {
            width: 128rpx;
            height: 52rpx;
            background: linear-gradient(-90deg, #ff4558 0%, #fe6e3c 100%);
            border-radius: 26rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26rpx;
            color: #ffffff;

            &.finish {
              background: #f7f7f7;
              font-weight: 500;
              color: #e2e2e2;
              border: 1px solid #e2e2e2;
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

  .points-dialog {
    width: 518rpx;
    height: 491rpx;
    background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/goldenBeans/bg4.png') left top/100%
      100% no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;

    .tip {
      padding-top: 100rpx;
      font-weight: bold;
      font-size: 48rpx;
      color: #1a1a1a;

      text {
        color: #ff2200;
      }
    }
  }
}
</style>
