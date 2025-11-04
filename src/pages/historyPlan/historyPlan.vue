<template>
  <view class="history-plan-page">
    <view class="page-title">
      <text>历史方案</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"> </view>

    <view class="current-plan">
      <view class="plan-title">
        <image
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/historyPlan/icon1.png"
        />

        <text>当前方案</text>
      </view>

      <view class="plan-box-wrap">
        <view class="plan-box" v-for="item of historyPlanList.filter((x) => x.state === 1)" :key="item.plan_id">
          <view class="user" @click="$toBack()">
            <image
              mode="aspectFill"
              :src="
                userInfo.avatar_url || 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/my/default_head.png'
              "
            />

            <text>{{ userInfo.uname }}</text>

            <uni-icons class="back" color="#999999" type="right" size="18"></uni-icons>
          </view>

          <view class="value">
            <view class="value-item">
              <view>初始体重</view>
              <view>{{ item.plan_initial_weight }} <text>公斤</text></view>
            </view>

            <view class="value-item">
              <view>还需努力</view>
              <view>
                <template v-if="Number(item.progress) === 100">0</template>
                <template v-else>
                  {{ Math.abs(Number((item.current_weight - item.plan_target_weight).toFixed(2))) }}
                </template>
                <text>公斤</text>
              </view>
            </view>

            <view class="value-item">
              <view>目标体重</view>
              <view>{{ item.plan_target_weight }} <text>公斤</text></view>
            </view>
          </view>

          <view class="tip">
            <text
              >{{ isWeightLoss(item) ? '已减重' : '已增重'
              }}{{ isWeightLoss(item) ? item.loss_weight : -item.loss_weight }}公斤</text
            >
            <text>{{ item.current_weight }}公斤</text>
            <text>{{ Number(item.progress) === 100 ? '达成' : '未达成' }}</text>
          </view>

          <view class="progress-box">
            <text class="progress" :style="{ width: item.progress + '%' }"></text>
            <text class="word" :style="{ width: item.progress + '%' }">{{ Number(item.progress) }}%</text>
          </view>
        </view>
      </view>
    </view>

    <view class="history-plan">
      <view class="plan-title">
        <image
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/historyPlan/icon2.png"
        />

        <text>历史方案</text>
      </view>

      <view class="plan-box-wrap">
        <view class="plan-box" v-for="item of historyPlanList.filter((x) => x.state !== 1)" :key="item.plan_id">
          <view class="user" @click="previewPlan(item)">
            <image
              mode="aspectFill"
              :src="
                userInfo.avatar_url || 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/my/default_head.png'
              "
            />

            <text>{{ userInfo.uname }}</text>

            <uni-icons class="back" color="#999999" type="right" size="18" @click="$toBack()"></uni-icons>
          </view>

          <view class="value">
            <view class="value-item">
              <view>初始体重</view>
              <view>{{ item.plan_initial_weight }} <text>公斤</text></view>
            </view>

            <view class="value-item">
              <view>还需努力</view>
              <view>
                <template v-if="Number(item.progress) === 100">0</template>
                <template v-else>
                  {{ Math.abs(Number((item.current_weight - item.plan_target_weight).toFixed(2))) }}
                </template>
                <text>公斤</text>
              </view>
            </view>

            <view class="value-item">
              <view>目标体重</view>
              <view>{{ item.plan_target_weight }} <text>公斤</text></view>
            </view>
          </view>

          <view class="tip">
            <text
              >{{ isWeightLoss(item) ? '已减重' : '已增重'
              }}{{ isWeightLoss(item) ? item.loss_weight : -item.loss_weight }}公斤</text
            >
            <text>{{ item.current_weight }}公斤</text>
            <text>{{ Number(item.progress) === 100 ? '达成' : '未达成' }}</text>
          </view>

          <view class="progress-box">
            <text class="progress" :style="{ width: item.progress + '%' }"></text>
            <text class="word" :style="{ width: item.progress + '%' }">{{ Number(item.progress) }}%</text>
          </view>

          <view class="finish">方案结束时体重：{{ item.current_weight }}公斤</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import $http from '@/utils/http';
import { mapState } from 'vuex';

export default {
  name: 'historyPlan',

  data() {
    return {
      historyPlanList: [],
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
        });
    },

    previewPlan(item) {
      uni.setStorageSync('lastPlanData', item);
      this.$toRouter('/pages/historyWeightManagementPlan/historyWeightManagementPlan', `plan_id=${item.plan_id}`);
    },
  },
};
</script>

<style lang="scss">
page {
  background: #f6f7fb;
  padding-bottom: 80rpx;
}
</style>

<style scoped lang="scss">
.history-plan-page {
  .page-title {
    background: #ffffff;
  }

  .banner {
    padding: calc(var(--page-title-height)) 0 0;
  }

  .current-plan,
  .history-plan {
    &.current-plan {
      margin-top: 38rpx;
    }

    &.history-plan {
      .plan-title {
        background: #bbbbbb30;

        text {
          color: #999999;
        }
      }

      .progress-box {
        .progress {
          background: #eaeaea !important;
        }
      }
    }

    display: flex;
    flex-direction: column;
    padding: 0 30rpx;
    position: relative;
    margin-bottom: 40rpx;

    .plan-title {
      align-self: flex-start;
      height: 75rpx;
      background: #637fe530;
      border-radius: 20rpx 20rpx 0rpx 0rpx;
      padding: 0 23rpx 6rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      image {
        width: 24rpx;
        margin-right: 9rpx;
      }

      text {
        font-weight: 500;
        font-size: 28rpx;
        color: #1a1a1a;
      }
    }

    .plan-box-wrap {
      position: relative;
      top: -10rpx;

      .plan-box {
        background: #ffffff;
        border-radius: 20rpx;
        padding: 20rpx 21rpx 32rpx;

        &:not(:last-child) {
          margin-bottom: 20rpx;
        }

        .user {
          display: flex;
          align-items: center;
          margin-bottom: 21rpx;

          image {
            width: 50rpx;
            height: 50rpx;
            border-radius: 50%;
            margin-right: 15rpx;
          }

          text {
            flex-grow: 1;
            font-size: 24rpx;
            color: #333333;
          }
        }

        .value {
          background: #f2f5ff;
          border-radius: 8rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 38rpx 0;
          gap: 109rpx;
          margin-bottom: 37rpx;

          .value-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 30rpx;

            view {
              &:nth-child(1) {
                font-size: 26rpx;
                color: #999999;
              }

              &:nth-child(2) {
                font-weight: 500;
                font-size: 32rpx;
                color: #111111;
              }

              text {
                font-size: 23rpx;
                padding-left: 4rpx;
              }
            }
          }
        }

        .tip {
          display: flex;
          align-items: center;
          margin-bottom: 32rpx;

          text {
            &:nth-child(1) {
              font-size: 26rpx;
              color: #333333;
              flex-grow: 1;
            }

            &:nth-child(2) {
              font-size: 26rpx;
              color: #111111;
              margin-right: 11rpx;
            }

            &:nth-child(3) {
              height: 36rpx;
              background: linear-gradient(90deg, #4f69e6 0%, #6b56e3 100%);
              border-radius: 18rpx;
              padding: 0 10rpx;
              font-size: 22rpx;
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }

        .progress-box {
          width: 100%;
          height: 16rpx;
          background: #f4f4f4;
          border-radius: 8rpx;
          position: relative;

          .progress {
            position: absolute;
            left: 0;
            top: -12rpx;
            bottom: -12rpx;
            background: #fdcd00;
            border-radius: 20rpx;
          }

          .word {
            position: absolute;
            left: 0;
            top: -12rpx;
            bottom: -12rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 26rpx;
            color: #111111;
          }
        }

        .finish {
          margin-top: 38rpx;
          text-align: center;
          font-size: 26rpx;
          color: #637fe5;
        }
      }
    }
  }
}
</style>
