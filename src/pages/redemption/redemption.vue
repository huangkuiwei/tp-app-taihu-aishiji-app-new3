<template>
  <view class="redemption-page">
    <view class="page-title">
      <text>兑换</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="container">
      <view class="title">输入兑换码兑换领取</view>

      <view class="input-box">
        <input type="text" :value="code" @input="code = $event.detail.value" placeholder="请输入兑换码" />
      </view>

      <view class="submit" @click="submit">立即兑换</view>

      <view class="recode">
        <image
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/redemption/icon1.png"
        />

        <text @click="showRedemptionDialog">我的兑换记录</text>
      </view>

      <view class="tip">
        <view class="tip-title">温馨提示</view>

        <view class="tip-container">
          <view>尊敬的用户，请您兑换前请务必阅读以下条款：</view>
          <view>1、兑换码在有效期内使用，超过有效期将无法兑换；</view>
          <view>2、一个兑换码只能兑换一次，不可重复兑换；</view>
          <view>3、兑换后立即生效，不退不换。</view>
          <view>如有疑问可联系客服：4009989618。</view>
        </view>
      </view>
    </view>

    <exchange-dialog ref="exchangeDialog" :exchangeCenter="3" />
  </view>
</template>

<script>
import $http from '@/utils/http';
import ExchangeDialog from '@/pages/exchangeCenter/exchangeDialog.vue';

export default {
  name: 'redemption',

  components: {
    ExchangeDialog,
  },

  data() {
    return {
      code: '',
    };
  },

  methods: {
    submit() {
      if (!this.code) {
        uni.showToast({
          title: '兑换码不能为空',
          icon: 'none',
        });

        return;
      }

      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http
        .post('api/user/profile/exchange-vip', {
          redeem_code: this.code,
        })
        .then(() => {
          this.close();
          uni.hideLoading();

          uni.showToast({
            title: '兑换成功',
            icon: 'none',
          });
        });
    },

    showRedemptionDialog() {
      this.$refs.exchangeDialog.open();
    },
  },
};
</script>

<style>
page {
  height: 100%;
  background: #f6f7fb;
}
</style>

<style scoped lang="scss">
.redemption-page {
  height: 100%;
  display: flex;
  flex-direction: column;

  .page-title {
    background: #ffffff;
    flex-shrink: 0;
  }

  .banner {
    padding: calc(var(--page-title-height)) 0 0;
    background: #ffffff;
    flex-shrink: 0;
    margin-bottom: 10rpx;
  }

  .container {
    flex-grow: 1;
    overflow: auto;
    padding: 60rpx 50rpx;
    background: #ffffff;

    .title {
      text-align: center;
      font-weight: 500;
      font-size: 28rpx;
      color: #111111;
      margin-bottom: 78rpx;
    }

    .input-box {
      padding: 0 36rpx;
      margin-bottom: 21rpx;

      input {
        width: 100%;
        height: 100rpx;
        background: #f6f7fb;
        border-radius: 20rpx;
        border: 2px solid #f2f5ff;
        padding: 0 40rpx;
      }
    }

    .submit {
      width: calc(100% - 72rpx);
      margin: 0 auto 97rpx;
      height: 100rpx;
      background: linear-gradient(90deg, #4f69e6 0%, #6b56e3 100%);
      border-radius: 20rpx;
      font-weight: bold;
      font-size: 30rpx;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .recode {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10rpx;
      margin-bottom: 140rpx;

      image {
        width: 35rpx;
      }

      text {
        font-weight: 500;
        font-size: 26rpx;
        color: #555555;
      }
    }

    .tip {
      .tip-title {
        font-weight: 500;
        font-size: 26rpx;
        color: #111111;
        margin-bottom: 56rpx;
      }

      .tip-container {
        view {
          font-weight: 400;
          font-size: 22rpx;
          color: #999999;
          line-height: 45rpx;
        }
      }
    }
  }
}
</style>
