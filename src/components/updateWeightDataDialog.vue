<template>
  <uni-popup ref="updateWeightDataDialog">
    <view class="update-weight-data-dialog">
      <view class="title">选择当前体重</view>

      <view class="weight-list">
        <picker-view
          indicator-style="height: 50px;"
          style="width: 100%; height: 500rpx"
          :value="weightValue"
          @change="weightValue = $event.detail.value"
        >
          <picker-view-column>
            <view
              class="item"
              :class="{
                active: weightValue[0] === index,
                adjacent: weightValue[0] === index - 1 || weightValue[0] === index + 1,
                adjacent1: weightValue[0] === index - 2 || weightValue[0] === index + 2,
              }"
              v-for="(item, index) in weightList"
              :key="index"
            >
              <text class="value">{{ item }}</text>
              <text class="unit" v-show="weightValue[0] === index">KG</text>
            </view>
          </picker-view-column>
        </picker-view>
      </view>

      <view class="btn" @click="recodeWeight">记录</view>
    </view>
  </uni-popup>
</template>

<script>
import $http from '@/utils/http';

export default {
  name: 'updateWeightDataDialog',

  props: {},

  data() {
    let weightList = [];

    for (let i = 0; i < 401; i++) {
      weightList.push(Number((i * 0.5).toFixed(1)));
    }

    return {
      weightList: weightList,
      weightValue: [0],
    };
  },

  methods: {
    open() {
      this.getHomeWeightPlan();
      this.$refs.updateWeightDataDialog.open();
    },

    close() {
      this.$refs.updateWeightDataDialog.close();
    },

    /**
     * 获取首页体重相关数据
     */
    getHomeWeightPlan() {
      return $http.get('api/diet-info/weight-plan/home').then((res) => {
        let index = this.weightList.findIndex((item) => item === res.data.current_weight);

        if (index) {
          this.weightValue = [index];
        }
      });
    },

    recodeWeight() {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http
        .post('api/diet-info/user-weight/update', {
          weight: this.weightList[this.weightValue],
        })
        .then(() => {
          this.$refs.updateWeightDataDialog.close();
          uni.hideLoading();
          this.$emit('updateSuccess');

          uni.showToast({
            title: '更新成功',
            icon: 'none',
          });
        });
    },
  },
};
</script>

<style scoped lang="scss">
.update-weight-data-dialog {
  width: 690rpx;
  background: #ffffff;
  border-radius: 30rpx;
  padding: 31rpx 30rpx 42rpx;

  .title {
    font-weight: 500;
    font-size: 30rpx;
    color: #111111;
    margin-bottom: 69rpx;
  }

  .weight-list {
    picker-view {
      margin-bottom: 37rpx;

      picker-view-column {
        .item {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          &.active {
            .value {
              font-weight: bold;
              font-size: 50rpx;
              color: #5664e5;
              margin-right: 17rpx;
            }

            .unit {
              font-weight: 500;
              font-size: 24rpx;
              color: #5664e5;
            }
          }

          &.adjacent {
            font-size: 40rpx;
            color: #111111;
          }

          &.adjacent1 {
            font-size: 30rpx;
            color: #999999;
          }

          .value {
            margin-right: 17rpx;
          }

          .unit {
            position: relative;
            top: 10rpx;
          }
        }
      }
    }
  }

  .btn {
    width: 420rpx;
    height: 90rpx;
    margin: 0 auto;
    background: linear-gradient(90deg, #4f69e6 0%, #6b56e3 100%);
    border-radius: 45rpx;
    font-weight: bold;
    font-size: 28rpx;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
