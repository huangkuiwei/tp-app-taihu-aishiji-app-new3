<template>
  <uni-popup ref="updateCurrentWeightDialog" type="bottom" :safe-area="false">
    <view class="update-current-weight-dialog">
      <view class="title">选择体重</view>

      <view class="list">
        <picker-view
          indicator-style="height: 40px;"
          style="width: 100%; height: 200px"
          :value="value"
          @change="value = $event.detail.value"
        >
          <picker-view-column>
            <view
              class="item"
              :class="{
                active: value[0] === index,
              }"
              v-for="(item, index) in list"
              :key="index"
            >
              <text class="value">{{ item }}</text>
              <text class="unit" v-if="value[0] === index">KG</text>
            </view>
          </picker-view-column>
        </picker-view>
      </view>

      <view class="options">
        <text @click="submit">确定</text>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: 'updateCurrentWeightDialog',

  data() {
    return {
      localUserDetailInfo: {},
      value: [0],
    };
  },

  props: {
    list: {
      type: Array,
      default: () => [],
    },

    userDetailInfo: {
      type: Object,
      default: () => ({}),
    },
  },

  methods: {
    open() {
      this.localUserDetailInfo = JSON.parse(JSON.stringify(this.userDetailInfo));

      let valueIndex = this.list.findIndex((item) => item === this.localUserDetailInfo.current_weight);

      if (valueIndex !== -1) {
        this.value = [this.localUserDetailInfo.current_weight];
      } else {
        this.value = [0];
      }

      this.$refs.updateCurrentWeightDialog.open();
    },

    close() {
      this.$refs.updateCurrentWeightDialog.close();
    },

    submit() {
      Object.assign(this.localUserDetailInfo, {
        current_weight: this.value[0],
      });

      this.$emit('submit', this.localUserDetailInfo);
      this.close();
    },
  },
};
</script>

<style scoped lang="scss">
.update-current-weight-dialog {
  width: 100%;
  background: #ffffff;
  border-radius: 30rpx 30rpx 0 0;
  padding: 30rpx 30rpx 50rpx;

  .title {
    font-weight: 500;
    font-size: 28rpx;
    color: #111111;
    margin-bottom: 63rpx;
  }

  .list {
    margin-bottom: 44rpx;

    picker-view {
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
              font-size: 38rpx;
              color: #65d285;
            }

            .unit {
              color: #65d285;
            }
          }

          .value {
            font-weight: 500;
            font-size: 28rpx;
            color: #999999;
          }

          .unit {
            font-weight: 500;
            font-size: 24rpx;
            color: #999999;
            margin-left: 15rpx;
            position: relative;
            top: 4rpx;
          }
        }
      }
    }
  }

  .options {
    display: flex;
    align-items: center;
    justify-content: center;

    text {
      width: 550rpx;
      height: 100rpx;
      background: #65d285;
      border-radius: 50rpx;
      font-weight: bold;
      font-size: 30rpx;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
