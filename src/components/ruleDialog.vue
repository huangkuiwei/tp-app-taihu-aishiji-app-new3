<template>
  <custom-dialog ref="ruleDialog" title="活动规则" :shop-close="false">
    <view class="content">
      <view class="item">
        <view class="item-title">活动一：开福袋领金豆</view>
        <view class="item-tip">每日可免费开启一次福袋，完成所有任务可额外开启一次，金豆数量随机</view>
      </view>

      <view class="item">
        <view class="item-title">活动二：金币转转乐</view>
        <view class="item-tip">金币转转了可抽金豆和多日会员（每次消耗10金豆，具体金豆数量见转盘）</view>
      </view>

      <view class="item">
        <view class="item-tip">
          累计金豆可以换取会员，不同数量金豆换取不同期限会员，金豆越多换取会员期限越长（集体具体兑换内容见兑换详情页）
        </view>
      </view>
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
  line-height: 32rpx;
  font-size: 24rpx;
  text-align: justify;

  .item {
    margin-bottom: 30rpx;

    .item-title {
      color: #5664e5;
      margin-bottom: 20rpx;
    }

    .item-tip {
      text-indent: 48rpx;
      color: #1a1a1a;
      line-height: 40rpx;
    }
  }
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    width: 312rpx;
    height: 85rpx;
    background: linear-gradient(90deg, #4f69e6 0%, #6b56e3 100%);
    border-radius: 43rpx;
    font-weight: 500;
    font-size: 32rpx;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
