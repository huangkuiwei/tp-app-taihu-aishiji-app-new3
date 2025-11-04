<template>
  <uni-popup ref="updateHabitsDialog">
    <view class="update-habits-dialog">
      <view class="title">选择你的运动量</view>

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
              <text class="value">{{ item.text }}</text>
            </view>
          </picker-view-column>
        </picker-view>
      </view>

      <view class="options">
        <text @click="close">取消</text>
        <text @click="submit">确定</text>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: 'updateHabitsDialog',

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
      this.value = [this.localUserDetailInfo.exercise_habits];

      this.$refs.updateHabitsDialog.open();
    },

    close() {
      this.$refs.updateHabitsDialog.close();
    },

    submit() {
      Object.assign(this.localUserDetailInfo, {
        exercise_habits: this.value[0],
      });

      this.$emit('submit', this.localUserDetailInfo);
      this.close();
    },
  },
};
</script>

<style scoped lang="scss">
.update-habits-dialog {
  width: 690rpx;
  background: #ffffff;
  border-radius: 30rpx;

  .title {
    padding: 39rpx 0 53rpx;
    text-align: center;
    font-weight: 500;
    font-size: 30rpx;
    color: #000000;
  }

  .list {
    picker-view {
      margin-bottom: 52rpx;

      picker-view-column {
        .item {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          &.active {
            .value {
              color: #111111;
            }
          }

          .value {
            font-weight: 500;
            font-size: 28rpx;
            color: #999999;
          }
        }
      }
    }
  }

  .options {
    display: flex;
    align-items: center;
    border-top: 2rpx solid #e6e6e6;

    text {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 36rpx;
      font-weight: 500;
      font-size: 28rpx;

      &:nth-child(1) {
        border-right: 2rpx solid #e6e6e6;
        color: #999999;
      }

      &:nth-child(2) {
        color: #111111;
      }
    }
  }
}
</style>
