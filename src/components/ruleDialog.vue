<template>
  <custom-dialog ref="ruleDialog" title="活动规则" :shop-close="false">
    <view class="content">
      <view class="item">·做任务，开盲盒；</view>
      <view class="item"
        >·每次开启盲盒消耗需10金币，奖池包含期限会员和不等额金币，开通会员或续费会员均可额外获得3次抽奖机会；</view
      >
      <view class="item">·金币可兑换会员，最高可得永久会员，数量有限，先到先得！</view>
      <view class="item">·如有疑问，可联系客服或拨打客服热线；</view>
      <!-- TODO 客服电话 -->
      <view class="item">·客服电话：400-0000-0000</view>
    </view>

    <template #footer>
      <view class="btn">
        <text @click="close">知道了</text>
      </view>
    </template>
  </custom-dialog>
</template>

<script>
import customDialog from '@/components/customDialog.vue';

export default {
  name: 'ruleDialog',

  components: {
    customDialog,
  },

  methods: {
    open() {
      this.$refs.ruleDialog.open();
    },

    close() {
      this.$refs.ruleDialog.close();
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  font-size: 26rpx;
  color: #000000;
  line-height: 48rpx;
  text-align: justify;
  margin-bottom: 68rpx;

  .item {
    line-height: 48rpx;
  }
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    width: 343rpx;
    height: 70rpx;
    background: #65d285;
    border-radius: 35rpx;
    font-size: 32rpx;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
