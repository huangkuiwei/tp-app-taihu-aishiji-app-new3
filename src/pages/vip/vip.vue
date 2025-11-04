<template>
  <view class="vip-page">
    <view class="page-title">
      <text>会员中心</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="user-container">
      <view class="userinfo">
        <view class="top">
          <image
            mode="aspectFill"
            :src="
              userInfo.avatar_url || 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/my/default_head.png'
            "
          />

          <text v-if="isLogin">{{ userInfo.uname }}</text>
          <text v-else>登录/注册</text>
        </view>

        <view class="bottom" v-if="isLogin">
          <text v-if="!isVip">暂未开通会员，无法享受会员权益</text>
          <text v-else>会员到期日期：{{ userInfo.vip_info.vip_end_time.slice(0, 10) }}</text>
        </view>

        <view class="vip-icon" v-if="!isVip">
          <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/vip/icon3.png" />
          <text>未开通</text>
        </view>

        <!--<view class="renewal" v-else @click="$toRouter('/pages/renewalManage/renewalManage')">关闭自动续费</view>-->
      </view>
    </view>

    <view class="vip-info">
      <view class="vip-title">
        <text>黄金会员</text>
        <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/vip/icon1.png" />
      </view>

      <view class="vip-shop-list">
        <view
          class="item"
          @click="selectedVip = item"
          :class="{ active: selectedVip.id === item.id }"
          v-for="item of vipList"
          :key="item.id"
        >
          <view class="top">
            <view class="name">{{ item.product_name }}</view>

            <view class="price">
              <text>￥</text>
              <text>{{ item.price }}</text>
            </view>
          </view>

          <view class="bottom">每日低至{{ item.unitPrice }}元</view>

          <view class="recommend" v-if="item.is_recommend">
            <image
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/vip/recommend.png"
            />
          </view>
        </view>
      </view>

      <!--<view class="rule">-->
      <!--  <view>购买说明：</view>-->
      <!--  <view>1、会员商品包含自动续费和单次购买项目，自动续费商品包括“连续包月”、“年会员”，开通时请按需购买；</view>-->
      <!--  <view>2、如需取消自动续费可在个人中心页面管理自动续费；</view>-->
      <!--  <view>2、会员到期前1小时可取消自动续费，超时系统将自动续订；</view>-->
      <!--  <view>3、如有疑问可咨询在线客服或拨打客服电话：4009989618。</view>-->
      <!--</view>-->

      <view class="introduce">
        <view class="title">会员权益</view>

        <view class="introduce-list">
          <view class="introduce-item">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/vip/icon2.png" />
            <text>专属定制方案</text>
          </view>

          <view class="introduce-item">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/vip/icon2.png" />
            <text>实时饮食建议</text>
          </view>

          <view class="introduce-item">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/vip/icon2.png" />
            <text>定制化健康食谱</text>
          </view>

          <view class="introduce-item">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/vip/icon2.png" />
            <text>每餐食物分析</text>
          </view>
        </view>
      </view>

      <view class="pay-type">
        <radio-group @change="payType = $event.detail.value">
          <label>
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/vip/wx.png" />
            <text class="name">微信</text>
            <radio class="type" value="wx" :checked="payType === 'wx'"></radio>
          </label>

          <!--<label>-->
          <!--  <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/vip/zfb.png" />-->
          <!--  <text class="name">支付宝</text>-->
          <!--  <radio class="type" value="zfb" :checked="payType === 'zfb'"></radio>-->
          <!--</label>-->
        </radio-group>
      </view>

      <view class="buy-box">
        <template v-if="showShopInfo">
          <view class="btn" style="margin-bottom: 24rpx" @click="submit(selectedVip, openid, userInfo.phone)">
            {{ isVip ? '立即续费' : '立即购买' }}
          </view>
          <view class="agreement">
            <checkbox-group @change="agree = $event.detail.value">
              <label>
                <checkbox value="1" :checked="agree.includes('1')" />
              </label>

              <text class="part1">支付即视为阅读并同意</text>
              <text class="part2" @click="$toRouter('/packageProtocol/pages/protocol/protocol')">《会员服务协议》</text>
            </checkbox-group>
          </view>
        </template>

        <template v-else>
          <view class="buy-tip">由于相关规定，iOS版小程序暂不支持购买</view>
          <button class="btn" @click="openContact">联系客服</button>
        </template>
      </view>
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
      payType: 'wx',
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
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/share-img.jpg',
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

      if (this.payType) {
        onPay(price, openid, mobile, this.payType);
      }
    },

    openContact() {
      uni.openCustomerServiceChat({
        corpId: 'wwfee5c045f8987186',
        extInfo: {
          url: 'https://work.weixin.qq.com/kfid/kfcb64201122e83af30',
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

        // TODO 连续包月
        // res.data.splice(1, 0, {
        //   id: 10003,
        //   is_recommend: true,
        //   original_price: 4200,
        //   price: 2990,
        //   product_des: '月会员',
        //   product_name: '连续包月',
        //   select_percentage: 0.1,
        // });

        res.data.forEach((item) => {
          item.price = Number((item.price / 100).toFixed(2));
          item.original_price = Number((item.original_price / 100).toFixed(2));

          if (item.id === 10000) {
            item.unitPrice = Number((item.price / 31).toFixed(2));
          } else if (item.id === 10001) {
            item.unitPrice = Number((item.price / 90).toFixed(2));
          } else if (item.id === 10002) {
            item.unitPrice = Number((item.price / 365).toFixed(2));
          } else if (item.id === 10003) {
            item.unitPrice = Number((item.price / 31).toFixed(2));
          }
        });

        this.vipList = res.data;
        this.selectedVip = this.vipList[0];
      });
    },
  },
};
</script>

<style>
page {
  background: #f6f7fb;
}
</style>

<style scoped lang="scss">
.vip-page {
  .page-title {
    background: #ffffff;
  }

  .banner {
    padding: calc(var(--page-title-height)) 0 0;
    background: #ffffff;
  }

  .user-container {
    padding: 20rpx 50rpx 0;

    .userinfo {
      padding: 19rpx 20rpx 86rpx;
      background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/vip/bg1.png') left top/100% 100%
        no-repeat;
      display: flex;
      flex-direction: column;
      position: relative;

      .top {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        margin-bottom: 21rpx;

        image {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          margin-right: 15rpx;
        }

        text {
          font-weight: bold;
          font-size: 30rpx;
          color: #ffffff;
        }
      }

      .bottom {
        display: flex;

        text {
          &:nth-child(1) {
            font-size: 22rpx;
            color: #ffffff;
          }
        }
      }

      .vip-icon {
        position: absolute;
        top: 0;
        right: 0;

        image {
          width: 100rpx;
        }

        text {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          font-size: 22rpx;
          color: #ffffff;
        }
      }

      .renewal {
        position: absolute;
        top: 45rpx;
        right: 28rpx;
        width: 179rpx;
        height: 60rpx;
        background: #5664e5;
        border-radius: 30rpx;
        font-weight: bold;
        font-size: 22rpx;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .vip-info {
    padding: 32rpx 32rpx 100rpx;
    background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/vip/bg2.png') left top/100% auto
      no-repeat;
    position: relative;
    top: -60rpx;

    .vip-title {
      font-weight: bold;
      font-size: 30rpx;
      color: #111111;
      position: relative;

      text {
        position: relative;
        z-index: 9;
      }

      image {
        position: absolute;
        top: 10rpx;
        left: 100rpx;
        width: 49rpx;
      }
    }

    .vip-shop-list {
      display: flex;
      align-items: center;
      gap: 20rpx;
      padding: 56rpx 0 0 0;
      overflow: auto;
      margin-bottom: 30rpx;

      .item {
        flex-shrink: 0;
        width: 230rpx;
        border-radius: 20rpx;
        border: 1px solid #baff56;
        position: relative;

        &.active {
          .top {
            background: #f3ffcd;
          }
        }

        .top {
          background: #ffffff;
          border-top-left-radius: 20rpx;
          border-top-right-radius: 20rpx;
          padding: 32rpx 0 24rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .name {
            font-size: 30rpx;
            color: #111111;
            margin-bottom: 35rpx;
          }

          .price {
            text {
              color: #111111;

              &:nth-child(1) {
                font-size: 30rpx;
              }

              &:nth-child(2) {
                font-weight: bold;
                font-size: 65rpx;
              }
            }
          }
        }

        .bottom {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15rpx 0;
          font-size: 21rpx;
          color: #111111;
          border-bottom-left-radius: 20rpx;
          border-bottom-right-radius: 20rpx;
          background: #c8ff80;
        }

        .recommend {
          position: absolute;
          top: -22rpx;
          left: -6rpx;

          image {
            width: 100rpx;
          }
        }
      }
    }

    .rule {
      padding: 0 20rpx;
      font-size: 20rpx;
      color: #666666;
      margin-bottom: 16rpx;

      view {
        line-height: 35rpx;
      }
    }

    .introduce {
      background: #ffffff;
      border-radius: 20rpx;
      padding: 30rpx 19rpx;
      margin-bottom: 30rpx;

      .title {
        font-weight: bold;
        font-size: 30rpx;
        color: #111111;
        margin-bottom: 36rpx;
      }

      .introduce-list {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-around;
        padding-left: 79rpx;
        gap: 26rpx;

        .introduce-item {
          width: calc(50% - 14rpx);
          display: flex;
          align-items: center;

          image {
            width: 28rpx;
            margin-right: 10rpx;
          }

          text {
            font-weight: 500;
            font-size: 26rpx;
            color: #111111;
          }
        }
      }
    }

    .pay-type {
      background: #ffffff;
      border-radius: 20rpx;
      padding: 23rpx 0;
      margin-bottom: 98rpx;

      radio-group {
        label {
          padding: 0 25rpx;
          display: flex;
          align-items: center;

          &:not(:last-child) {
            padding-bottom: 22rpx;
            margin-bottom: 22rpx;
            border-bottom: 2rpx solid #e6e6e6;
          }

          image {
            width: 55rpx;
            margin-right: 25rpx;
          }

          .name {
            flex-grow: 1;
            font-weight: 500;
            font-size: 26rpx;
            color: #111111;
          }

          radio {
            transform: scale(0.75);
          }
        }
      }
    }

    .buy-box {
      display: flex;
      flex-direction: column;
      align-items: center;

      .btn {
        width: 100%;
        height: 100rpx;
        background: #111111;
        border-radius: 20rpx;
        font-weight: bold;
        font-size: 30rpx;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .agreement {
        font-size: 22rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        checkbox-group {
          checkbox {
            transform: scale(0.7);
          }
        }

        .part1 {
          color: #999999;
        }

        .part2 {
          color: #111111;
        }
      }

      .buy-tip {
        font-size: 28rpx;
        margin-bottom: 24rpx;
      }
    }
  }
}
</style>
