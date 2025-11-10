<template>
  <view class="history-plan-page">
    <view class="page-title">
      <text>计划详情</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"> </view>

    <view class="current-plan">
      <view class="plan-title">
        <text>{{ isWeightLoss ? '减重' : '增重' }}计划</text>
        <text>历史记录</text>
      </view>

      <view class="plan-time">
        <view>2025年10月23日</view>
        <view>开始 / 已坚持 <text>3</text> 天 / 还有 <text>45</text> 天</view>
      </view>

      <view class="plan-box-wrap">
        <view
          class="plan-box"
          v-for="item of historyPlanList.filter((x) => x.state === 1)"
          :key="item.plan_id"
          @click="previewPlan(item)"
        >
          <view class="title">{{ isWeightLoss ? '减肥' : '增肥' }}计划</view>

          <view class="progress-wrapper">
            <text class="progress-box">
              <text class="progress" :style="{ left: 'calc(' + item.progress + '%)' }">
                <text class="word">{{ item.current_weight }}公斤</text>
              </text>
            </text>
          </view>

          <view class="value">
            <view class="value-item">
              <view>{{ item.plan_initial_weight }} <text>公斤</text></view>
              <view>初始体重</view>
              <view>{{ item.start_date.slice(0, 10) }}</view>
            </view>

            <view class="value-item">
              <view>{{ item.plan_target_weight }} <text>公斤</text></view>
              <view>目标体重</view>
              <view>{{ item.end_date.slice(0, 10) }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="options">
      <view class="close" @click="close">关闭计划</view>
      <view class="reset" @click="resetPlan">调整计划</view>
    </view>

    <update-target-weight-dialog
      ref="updateTargetWeightDialog"
      :list="rulerLineList4"
      :userDetailInfo="lastPlanData"
      :editPlan="true"
      @submit="next"
    />

    <update-end-date-dialog
      ref="updateEndDateDialog"
      :userDetailInfo="lastPlanData"
      :editPlan="true"
      @submit="resetPlanSubmit"
      @preStep="preStep"
    />
  </view>
</template>

<script>
import $http from '@/utils/http';
import { mapState } from 'vuex';
import UpdateTargetWeightDialog from '@/pages/userCenter/updateTargetWeightDialog.vue';
import UpdateEndDateDialog from '@/pages/userCenter/updateEndDateDialog.vue';

export default {
  name: 'historyPlan',

  components: {
    UpdateEndDateDialog,
    UpdateTargetWeightDialog,
  },

  data() {
    let rulerLineList4 = [];

    for (let i = 0; i < 401; i++) {
      rulerLineList4.push(Number((i * 0.5).toFixed(1)));
    }

    return {
      historyPlanList: [],
      lastPlanData: {},
      rulerLineList4,
    };
  },

  computed: {
    ...mapState('app', ['userInfo']),

    isWeightLoss() {
      return (plan) => {
        return plan.plan_initial_weight - plan.plan_target_weight > 0;
      };
    },
  },

  onShow() {
    this.getHistoryPlanList();
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/share-img.jpg',
      path: '/pages/index/index',
    };
  },

  methods: {
    getHistoryPlanList() {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http
        .post('api/diet-info/weight-plan/history', {
          pageIndex: 1,
          pageSize: 9999,
        })
        .then((res) => {
          uni.hideLoading();

          res.data.Items.forEach((item) => {
            // 计算已减体重和进度
            item.loss_weight = Number((item.plan_initial_weight - item.current_weight).toFixed(2));
            item.progress = ((item.loss_weight / (item.plan_initial_weight - item.plan_target_weight)) * 100).toFixed(
              2,
            );

            if (item.progress > 100) {
              item.progress = 100;
            } else if (item.progress < 0) {
              item.progress = 0;
            }
          });

          this.historyPlanList = res.data.Items;
          let currentPlan = this.historyPlanList.find((x) => x.state === 1) || {};

          if (currentPlan) {
            this.lastPlanData = JSON.parse(
              JSON.stringify({
                ...currentPlan,
                target_weight: currentPlan.plan_target_weight,
                initial_weight: currentPlan.plan_initial_weight,
                begin_date: currentPlan.start_date,
              }),
            );

            this.lastPlanData.target_weight = this.rulerLineList4.findIndex(
              (item) => item === this.lastPlanData.target_weight,
            );
            this.lastPlanData.initial_weight = this.rulerLineList4.findIndex(
              (item) => item === this.lastPlanData.initial_weight,
            );
            this.lastPlanData.current_weight = this.rulerLineList4.findIndex(
              (item) => item === this.lastPlanData.current_weight,
            );
          }
        });
    },

    previewPlan(item) {
      uni.setStorageSync('lastPlanData', item);
      this.$toRouter('/pages/weightManagementPlan/weightManagementPlan');
    },

    close() {
      uni.showModal({
        title: '温馨提示',
        content: '确定要删除计划吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '删除中...',
            });

            $http
              .post('api/diet-info/weight-plan/delete', {
                plan_id: this.historyPlanList[0].plan_id,
              })
              .then(() => {
                uni.hideLoading();

                uni.showToast({
                  title: '删除成功',
                  icon: 'none',
                  mask: true,
                });

                setTimeout(() => {
                  this.$toBack();
                }, 1000);
              });
          }
        },
      });
    },

    resetPlan() {
      this.$refs.updateTargetWeightDialog.open();
    },

    next($event) {
      Object.assign(this.lastPlanData, $event);
      this.$refs.updateTargetWeightDialog.close();

      setTimeout(() => {
        this.$refs.updateEndDateDialog.open();
      });
    },

    preStep() {
      this.$refs.updateEndDateDialog.close();
      this.$refs.updateTargetWeightDialog.open();
    },

    resetPlanSubmit($event) {
      Object.assign(this.lastPlanData, $event);

      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http
        .post('api/diet-info/weight-plan/update', {
          plan_id: this.lastPlanData.plan_id,
          target_weight: this.rulerLineList4[this.lastPlanData.target_weight],
          end_date: this.lastPlanData.end_date,
        })
        .then(() => {
          uni.hideLoading();

          uni.showToast({
            title: '操作成功',
            icon: 'none',
            mask: true,
          });

          this.getHistoryPlanList();
        });
    },
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
  background: #f6f7fb linear-gradient(180deg, #b3f5e7 0%, #f1fcf8 100%) left top/100% 850rpx no-repeat;
}
</style>

<style scoped lang="scss">
.history-plan-page {
  .page-title {
  }

  .banner {
    padding: calc(var(--page-title-height) + 51rpx) 0 0;
  }

  .current-plan {
    display: flex;
    flex-direction: column;
    padding: 0 30rpx;
    position: relative;

    .plan-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 30rpx;

      text {
        &:nth-child(1) {
          font-weight: bold;
          font-size: 36rpx;
          color: #111111;
        }

        &:nth-child(2) {
          font-size: 26rpx;
          color: #65d285;
        }
      }
    }

    .plan-time {
      display: flex;
      align-items: center;
      margin-bottom: 50rpx;

      view {
        font-size: 26rpx;

        &:nth-child(1) {
          color: #111111;
          margin-right: 8rpx;
        }

        &:nth-child(2) {
          color: #999999;

          text {
            color: #65d285;
          }
        }
      }
    }

    .plan-box-wrap {
      position: relative;

      .plan-box {
        background: #ffffff;
        border-radius: 30rpx;
        padding: 28rpx;

        .title {
          width: 130rpx;
          height: 40rpx;
          background: #ecfdf2;
          border-radius: 10rpx;
          font-size: 24rpx;
          color: #65d285;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30rpx;
        }

        .progress-wrapper {
          width: 100%;
          height: 10rpx;
          background: #65d285;
          border-radius: 5rpx;
          position: relative;
          margin-bottom: 41rpx;

          .progress-box {
            position: absolute;
            left: 0;
            right: 130rpx;

            .progress {
              position: absolute;
              top: -16rpx;
              width: 130rpx;
              height: 40rpx;
              background: #65d285;
              border-radius: 20rpx;
              border: 2px solid #ffffff;

              .word {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24rpx;
                color: #ffffff;
              }
            }
          }
        }

        .value {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .value-item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 20rpx;

            view {
              &:nth-child(1) {
                font-weight: 500;
                font-size: 36rpx;
                color: #333333;

                text {
                  font-size: 24rpx;
                  color: #bababa;
                }
              }

              &:nth-child(2),
              &:nth-child(3) {
                font-size: 24rpx;
                color: #bababa;
              }
            }
          }
        }
      }
    }
  }

  .options {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 100rpx;
    padding: 0 30rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    view {
      width: 330rpx;
      height: 100rpx;
      border-radius: 50rpx;
      font-weight: 500;
      font-size: 30rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      &.close {
        border: 1px solid #65d285;
        color: #65d285;
      }

      &.reset {
        background: #65d285;
        color: #ffffff;
      }
    }
  }
}
</style>
