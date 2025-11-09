<template>
  <view class="vip-page" :class="{ isVip: isVip }">
    <view class="page-title">
      <text>会员中心</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="userinfo">
      <view class="left">
        <image
          mode="aspectFill"
          :src="
            userInfo.avatar_url || 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/my/default_head.png'
          "
        />
      </view>

      <view class="right" v-if="isLogin">
        <view class="top">
          <text>{{ userInfo.uname }}</text>
        </view>

        <view v-if="isVip">会员到期：{{ userInfo.vip_info.vip_end_time.slice(0, 10) }}</view>
        <view v-else>会员权益尚未开通</view>
      </view>

      <view class="right" v-else @click="$toRouter('/packageLogin/pages/login/login')">
        <view>还未登录</view>
        <view>点击登录/注册</view>
      </view>

      <image
        v-if="isVip"
        class="vip-icon"
        mode="widthFix"
        src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/vip/icon2.png"
      />

      <image
        v-else
        class="vip-icon"
        mode="widthFix"
        src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/vip/icon1.png"
      />
    </view>

    <view class="container-box">
      <view class="title">喵互娱会员</view>

      <view class="vip-shop-box">
        <view class="vip-shop-list">
          <view
            class="item"
            @click="selectedVip = item"
            :class="{ active: selectedVip.id === item.id }"
            v-for="item of vipList"
            :key="item.id"
          >
            <view class="name">{{ item.product_des }}</view>
            <view class="price">
              <text>￥</text>
              <text>{{ item.price }}</text>
            </view>
            <view class="tip">
              <text v-if="item.id === 10000">每日低至{{ Number((item.price / 30).toFixed(2)) }}元</text>
              <text v-if="item.id === 10001">每月低至{{ Number((item.price / 3).toFixed(2)) }}元</text>
              <text v-if="item.id === 10002">超值特惠</text>
            </view>

            <!-- TODO 背景切图 -->
            <view class="vip-icon" v-if="item.id === 10000">
              <text>限时优惠</text>
            </view>
          </view>
        </view>

        <!--<view class="rule">-->
        <!--  <view class="rule-title">购买说明：</view>-->
        <!--  <view>1、会员商品包含自动续费和单次购买项目，自动续费商品包括“连续包月”、“年会员”，开通时请按需购买；</view>-->
        <!--  <view>2、如需取消自动续费可在个人中心页面管理自动续费；</view>-->
        <!--  <view>2、会员到期前1小时可取消自动续费，超时系统将自动续订；</view>-->
        <!--  &lt;!&ndash; TODO 客服电话 &ndash;&gt;-->
        <!--  <view>3、如有疑问可咨询在线客服或拨打客服电话：400-0000-0000。</view>-->
        <!--</view>-->
      </view>
    </view>

    <view class="buy-box">
      <template v-if="showShopInfo">
        <view class="btn" style="margin-bottom: 36rpx" @click="submit(selectedVip, openid, userInfo.phone)">
          {{ isVip ? '点我续费' : '点我开通' }}
        </view>
        <view class="agreement">
          <checkbox-group @change="agree = $event.detail.value">
            <label>
              <checkbox value="1" :checked="agree.includes('1')" />
            </label>

            <text>我已阅读并同意</text>
            <text @click="$toRouter('/packageLogin/pages/protocol/protocol')">《会员服务协议》</text>
          </checkbox-group>
        </view>
      </template>

      <template v-else>
        <view class="buy-tip">由于相关规定，iOS版小程序暂不支持购买</view>
        <button class="btn" @click="openContact">联系客服</button>
      </template>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import $http from '@/utils/http';
import { onPay } from '@/pages/vip/member';

export default {
  name: 'vip',

  data() {
    const platform = uni.getDeviceInfo().platform;

    return {
      vipList: [],
      selectedVip: {},
      agree: [],
      openid: null,
      // showShopInfo: false, // 测试
      showShopInfo:
        (process.env.UNI_PLATFORM === 'mp-weixin' && platform !== 'ios') || process.env.UNI_PLATFORM !== 'mp-weixin',
    };
  },

  computed: {
    ...mapState('app', ['userInfo']),
    ...mapGetters('app', ['isLogin', 'isVip']),
  },

  onLoad() {
    uni.login({
      success: (res) => {
        $http
          .post('api/user/auth/userauth/get_openid', {
            code: res.code,
            micro_appid: uni.getAccountInfoSync().miniProgram.appId,
          })
          .then((res) => {
            this.openid = res.data;
          });
      },
    });

    this.getProductList();
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/share-img.png',
      path: '/pages/index/index',
    };
  },

  methods: {
    submit(price, openid, mobile) {
      if (!this.agree.includes('1')) {
        uni.showToast({
          title: '请先阅读并同意协议',
          icon: 'none',
        });

        return;
      }

      onPay(price, openid, mobile);
    },

    openContact() {
      uni.openCustomerServiceChat({
        corpId: 'wwa09afa94a53c191b',
        extInfo: {
          url: 'https://work.weixin.qq.com/kfid/kfc4d6f5ec87ef53883',
        },
      });
    },

    getProductList() {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http.get('api/global/product/get').then((res) => {
        uni.hideLoading();

        res.data.forEach((item) => {
          item.price = Number((item.price / 100).toFixed(2));
          item.original_price = Number((item.original_price / 100).toFixed(2));
        });

        this.vipList = res.data;
        this.selectedVip = this.vipList[0];
      });
    },
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
}
</style>

<style scoped lang="scss">
.vip-page {
  height: 100%;
  background: #f6f7fb;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &.isVip {
    background: linear-gradient(90deg, #ffd274 0%, #f9e7bb 100%);
  }

  .page-title {
    flex-shrink: 0;
  }

  .banner {
    flex-shrink: 0;
    padding: calc(var(--page-title-height) + 61rpx) 0 0;
  }

  .userinfo {
    flex-shrink: 0;
    padding: 0 28rpx;
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 79rpx;

    .left {
      flex-shrink: 0;
      margin-right: 25rpx;

      image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
      }
    }

    .right {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 18rpx;

      view {
        &:nth-child(1) {
          font-weight: bold;
          font-size: 26rpx;
          color: #222222;
          display: flex;
          align-items: center;
          gap: 21rpx;
        }

        &:nth-child(2) {
          font-weight: 500;
          font-size: 22rpx;
          color: #333333;
        }
      }
    }

    .vip-icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 23rpx;
      width: 278rpx;
    }
  }

  .container-box {
    flex-grow: 1;
    overflow: auto;
    border-radius: 30rpx 30rpx 0 0;
    padding: 44rpx 36rpx;
    background: #ffffff;

    .title {
      font-weight: bold;
      font-size: 28rpx;
      color: #222222;
      margin-bottom: 58rpx;
    }

    .vip-shop-box {
      .vip-shop-list {
        display: flex;
        align-items: center;
        gap: 36rpx;
        overflow: auto;
        padding-top: 20rpx;
        margin-bottom: 52rpx;

        .item {
          flex-shrink: 0;
          width: 225rpx;
          height: 244rpx;
          background: #fbf9f5;
          border-radius: 30rpx;
          border: 4rpx solid #f4edd6;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;

          &.active {
            border: 4rpx solid #ccb188;
          }

          .name {
            padding-top: 20rpx;
            font-size: 24rpx;
            color: #2c2314;
            margin-bottom: 31rpx;
          }

          .price {
            margin-bottom: 36rpx;

            text {
              font-weight: bold;
              color: #2c2314;

              &:nth-child(1) {
                font-size: 24rpx;
              }

              &:nth-child(2) {
                font-size: 56rpx;
              }
            }
          }

          .tip {
            font-size: 24rpx;
            color: #ccb188;
          }

          .vip-icon {
            position: absolute;
            top: -22rpx;
            left: -6rpx;

            text {
              width: 147rpx;
              height: 41rpx;
              background: linear-gradient(92deg, #f28e26 0%, #fd644f 100%);
              border-radius: 20rpx 17rpx 20rpx 0;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 25rpx;
              color: #ffffff;
            }
          }
        }
      }

      .rule {
        padding: 0 18rpx;
        font-size: 20rpx;
        color: #666666;

        view {
          line-height: 35rpx;
        }
      }
    }
  }

  .buy-box {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30rpx 85rpx 40rpx;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;

    .btn {
      width: 100%;
      height: 100rpx;
      background: linear-gradient(90deg, #ff3121 0%, #ff9102 100%);
      border-radius: 50rpx;
      font-weight: bold;
      font-size: 30rpx;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .agreement {
      font-size: 24rpx;
      color: #1a1a1a;
      display: flex;
      align-items: center;
      justify-content: center;

      checkbox-group {
        checkbox {
          transform: scale(0.7);
        }
      }
    }

    .buy-tip {
      font-size: 28rpx;
      margin-bottom: 24rpx;
    }
  }
}
</style>
