<template>
  <view class="login-page">
    <view class="page-title">
      <text></text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="container">
      <view class="logo">
        <!-- TODO logo修改 -->
        <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/logo3.jpg" />
      </view>

      <view class="input-box">
        <text>{{ phone.slice(0, 3) }}****{{ phone.slice(-4) }}</text>
      </view>

      <view class="login" @click="login">一键登录</view>
      <view class="other-login" @click="$toBack">其他手机号码登录</view>
    </view>

    <view class="agreement">
      <checkbox-group @change="agree = $event.detail.value">
        <label>
          <checkbox value="1" :checked="agree.includes('1')" />
        </label>
      </checkbox-group>
      <view>
        我已阅读并同意
        <text @click="$toRouter('/packageLogin/pages/protocol/protocol')">《用户协议》</text>
        和
        <text @click="$toRouter('/packageLogin/pages/privacy/privacy')">《隐私政策》</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapActions } from 'vuex';
import $http from '@/utils/http';

export default {
  name: 'login',

  data() {
    return {
      agree: [],
      phone: '',
      token: '',
    };
  },

  onLoad(options) {
    this.phone = options.phone;
    this.token = options.token;
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/share-img.jpg',
      path: '/pages/index/index',
    };
  },

  methods: {
    ...mapActions('app', ['_getUserInfo']),

    /**
     * 登录
     */
    login() {
      if (!this.agree.includes('1')) {
        uni.showToast({
          title: '请阅读并同意《用户协议》和《隐私政策》',
          icon: 'none',
        });

        return;
      }

      // 登录完成之后保存 token
      const storageExpireDays = 7;
      const currentTime = Date.now();
      const expireTime = currentTime + storageExpireDays * 24 * 60 * 60 * 1000; // 当前时间加上7天
      uni.setStorageSync('foodDiaryToken', {
        value: this.token,
        expireTime: expireTime,
      });

      // 后端更新open_id和unionid
      uni.login({
        success: (res) => {
          $http.post('api/user/auth/userauth/get_openid', {
            code: res.code,
            micro_appid: uni.getAccountInfoSync().miniProgram.appId,
          });
        },
      });

      // 登录完成获取用户信息
      this._getUserInfo().then(() => {
        uni.hideLoading();

        uni.showToast({
          title: '登录成功',
          icon: 'none',
          mask: true,
        });

        uni.switchTab({
          url: '/pages/index/index',
        });
      });
    },
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
  background: #ffffff;
}
</style>

<style scoped lang="scss">
.login-page {
  height: 100%;
  padding-bottom: 67rpx;
  display: flex;
  flex-direction: column;

  .page-title {
  }

  .banner {
    flex-shrink: 0;
    padding: calc(var(--page-title-height)) 0 0;
  }

  .container {
    flex-grow: 1;
    padding-top: 150rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .logo {
      margin-bottom: 184rpx;

      image {
        width: 120rpx;
        border-radius: 23rpx;
      }
    }

    .input-box {
      font-weight: 500;
      font-size: 48rpx;
      color: #1a1a1a;
      margin-bottom: 92rpx;
    }

    .login {
      width: 560rpx;
      height: 100rpx;
      background: #65d285;
      border-radius: 50rpx;
      font-weight: 500;
      font-size: 32rpx;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30rpx;
    }

    .other-login {
      font-weight: 500;
      font-size: 24rpx;
      color: #666666;
      margin-bottom: 37rpx;
    }
  }

  .agreement {
    align-self: center;
    display: flex;
    align-items: center;

    checkbox {
      transform: scale(0.6);
    }

    view {
      font-size: 22rpx;
      color: #999999;
    }
  }
}
</style>
