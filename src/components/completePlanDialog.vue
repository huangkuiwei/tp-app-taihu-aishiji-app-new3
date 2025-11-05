<template>
  <uni-popup ref="completePlanDialog" type="bottom" :safe-area="false">
    <view class="complete-plan-dialog">
      <view class="tip1">恭喜你，减重目标达成！</view>
      <view class="tip2">
        <text>累计减重5.6公斤！毅力和身材兼具的你，</text>
        <text>定会随着时间的发展无坚不摧</text>
      </view>
      <view class="options">
        <text class="btn1" @click="addPlan">继续挑战新目标</text>
        <text class="btn2" @click="close">保持体重</text>
        <text class="btn3" @click="close">确定</text>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: 'completePlanDialog',

  props: {},

  methods: {
    open() {
      this.$refs.completePlanDialog.open();
    },

    close() {
      this.$refs.completePlanDialog.close();
    },

    addPlan() {
      this.close();
      this.$emit('addPlan');
    },
  },
};
</script>

<style scoped lang="scss">
.complete-plan-dialog {
  width: 690rpx;
  margin: 0 auto;
  background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/index/bg3.png') left top/100% 100%
    no-repeat;
  padding: 312rpx 0 109rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .tip1 {
    font-weight: bold;
    font-size: 40rpx;
    color: #111111;
    margin-bottom: 50rpx;
  }

  .tip2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 26rpx;
    color: #111111;
    margin-bottom: 71rpx;

    text {
      line-height: 40rpx;
    }
  }

  .options {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 39rpx;

    .btn1 {
      width: 343rpx;
      height: 70rpx;
      background: #65d285;
      border-radius: 35rpx;
      font-weight: 500;
      font-size: 28rpx;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn2,
    .btn3 {
      font-weight: 500;
      font-size: 28rpx;
      color: #65d285;
    }
  }
}
</style>
