<template>
  <view class="redemption-page">
    <view class="page-title">
      <text>兑换</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#ffffff" type="arrow-left" size="22"></uni-icons>
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

      <view class="line"></view>

      <view class="tip">
        <view class="tip-title">温馨提示</view>

        <view class="tip-container">
          <view>尊敬的用户，请您兑换前请务必阅读以下条款：</view>
          <view>1、兑换码在有效期内使用，超过有效期将无法兑换；</view>
          <view>2、一个兑换码只能兑换一次，不可重复兑换；</view>
          <view>3、兑换后立即生效，不退不换。</view>
          <!-- TODO 客服电话 -->
          <view>如有疑问可联系客服：400-0000-0000。</view>
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
  background: linear-gradient(180deg, #686df4 0%, #869ef8 100%);
}
</style>

<style scoped lang="scss">
.redemption-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0 50rpx;

  .page-title {
    flex-shrink: 0;
    color: #ffffff;
  }

  .banner {
    padding: calc(var(--page-title-height) + 29rpx) 0 0;
    flex-shrink: 0;
  }

  .container {
    overflow: auto;
    padding: 60rpx 35rpx 116rpx;
    background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/redemption/bg.png') left top/100% 100%
      no-repeat;

    .title {
      text-align: center;
      font-weight: 500;
      font-size: 28rpx;
      color: #111111;
      margin-bottom: 68rpx;
    }

    .input-box {
      width: 100%;
      margin-bottom: 21rpx;

      input {
        width: 100%;
        height: 100rpx;
        background: #f6f6f6;
        border-radius: 20rpx;
        border: 2px solid #f2f5ff;
        padding: 0 40rpx;
        font-size: 26rpx;
      }
    }

    .submit {
      width: 580rpx;
      height: 100rpx;
      background: #8297f8;
      border-radius: 50rpx;
      font-weight: bold;
      font-size: 30rpx;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 44rpx;
    }

    .recode {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10rpx;
      margin-bottom: 60rpx;

      image {
        width: 35rpx;
        margin-right: 10rpx;
      }

      text {
        font-weight: 500;
        font-size: 26rpx;
        color: #555555;
      }
    }

    .line {
      margin-bottom: 72rpx;
      border-top: 1px dashed #ebebeb;
    }

    .tip {
      .tip-title {
        text-align: center;
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
