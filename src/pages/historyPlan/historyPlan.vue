<template>
  <view class="history-plan-page">
    <view class="page-title">
      <text>历史计划</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="current-plan">
      <view class="plan-box-wrap" v-if="historyPlanList.filter((x) => x.state !== 1).length">
        <view class="plan-box" v-for="item of historyPlanList.filter((x) => x.state !== 1)" :key="item.plan_id">
          <view class="title">
            <text>{{ isWeightLoss(item) ? '减肥' : '增肥' }}计划</text>
            <!-- TODO 是否新增完成计划时间字段 -->
            <text>累计坚持{{ planDays(item).useDay }}天</text>

            <image
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/historyPlan/delete.png"
              @click="deletePlan(item)"
            />
          </view>

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

      <view class="empty-box" v-else>暂无历史计划数据</view>
    </view>
  </view>
</template>

<script>
import $http from '@/utils/http';
import { mapState } from 'vuex';

export default {
  name: 'historyPlan',

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

    planDays() {
      return (planData) => {
        let end_date = planData.end_date && planData.end_date.replace(/-/g, '/');
        let start_date = planData.start_date && planData.start_date.replace(/-/g, '/');
        let now = new Date();

        let diff = new Date(end_date).getTime() - new Date(start_date).getTime();
        const minutes = Math.floor(diff / 1000 / 60);
        const hours = Math.floor(minutes / 60);

        let diff1 = new Date(end_date).getTime() - now.getTime();
        const minutes1 = Math.floor(diff1 / 1000 / 60);
        const hours1 = Math.floor(minutes1 / 60);

        let totalDay = Math.ceil(hours / 24);
        let unUseDay = Math.ceil(hours1 / 24);
        let useDay = Math.ceil(totalDay - unUseDay);

        if (unUseDay < 0) {
          unUseDay = 0;
        }

        if (useDay > totalDay) {
          useDay = totalDay;
        }

        return {
          totalDay,
          unUseDay,
          useDay,
        };
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
        });
    },

    deletePlan(item) {
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
                plan_id: item.plan_id,
              })
              .then(() => {
                uni.hideLoading();

                uni.showToast({
                  title: '删除成功',
                  icon: 'none',
                  mask: true,
                });

                this.getHistoryPlanList();
              });
          }
        },
      });
    },
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
  background: #f6f7fb;
}
</style>

<style scoped lang="scss">
.history-plan-page {
  .page-title {
    background: #ffffff;
  }

  .banner {
    padding: calc(var(--page-title-height)) 0 0;
    background: #ffffff;
  }

  .current-plan {
    margin-top: 20rpx;
    display: flex;
    flex-direction: column;
    padding: 0 30rpx;
    position: relative;

    .plan-box-wrap {
      position: relative;

      .plan-box {
        background: #ffffff;
        border-radius: 30rpx;
        padding: 28rpx;
        margin-bottom: 30rpx;

        .title {
          display: flex;
          align-items: center;
          margin-bottom: 30rpx;

          text {
            &:nth-child(1) {
              width: 130rpx;
              height: 40rpx;
              background: #ecfdf2;
              border-radius: 10rpx;
              font-size: 24rpx;
              color: #65d285;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 30rpx;
            }

            &:nth-child(2) {
              flex-grow: 1;
              font-size: 28rpx;
              color: #111111;
            }
          }

          image {
            width: 28rpx;
          }
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

    .empty-box {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      color: #aaaaaa;
      padding: 100rpx 0;
    }
  }
}
</style>
