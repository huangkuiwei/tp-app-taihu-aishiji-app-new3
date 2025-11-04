<template>
  <uni-popup ref="updateGenderDialog">
    <view class="update-gender-dialog">
      <view class="title">选择你的性别</view>

      <view class="gender-list">
        <text
          :class="{ active: localUserDetailInfo.gender === index }"
          v-for="(item, index) of genderList"
          :key="item.value"
          @click="localUserDetailInfo.gender = index"
        >
          {{ item.text }}
        </text>
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
  name: 'updateGenderDialog',

  data() {
    return {
      localUserDetailInfo: {},
    };
  },

  props: {
    genderList: {
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
      this.$refs.updateGenderDialog.open();
    },

    close() {
      this.$refs.updateGenderDialog.close();
    },

    submit() {
      this.$emit('submit', this.localUserDetailInfo);
      this.close();
    },
  },
};
</script>

<style scoped lang="scss">
.update-gender-dialog {
  width: 690rpx;
  background: #ffffff;
  border-radius: 30rpx;

  .title {
    padding: 39rpx 0 70rpx;
    text-align: center;
    font-weight: 500;
    font-size: 30rpx;
    color: #000000;
  }

  .gender-list {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 75rpx;
    margin-bottom: 77rpx;

    text {
      width: 180rpx;
      height: 65rpx;
      background: #ffffff;
      border-radius: 33rpx;
      border: 1px solid #e0e0e0;
      font-weight: 500;
      font-size: 28rpx;
      color: #111111;
      display: flex;
      align-items: center;
      justify-content: center;

      &.active {
        background: #5664e5;
        color: #ffffff;
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
