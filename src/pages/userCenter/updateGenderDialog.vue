<template>
  <uni-popup ref="updateGenderDialog" type="bottom" :safe-area="false">
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

  .gender-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 29rpx;
    margin-bottom: 69rpx;

    text {
      width: 561rpx;
      height: 100rpx;
      background: #ffffff;
      border-radius: 28rpx;
      border: 2px solid #e0e0e0;
      font-weight: 500;
      font-size: 28rpx;
      color: #bfbfbf;
      display: flex;
      align-items: center;
      justify-content: center;

      &.active {
        background: #effffb;
        border-radius: 28rpx;
        border: 3px solid #65d285;
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
