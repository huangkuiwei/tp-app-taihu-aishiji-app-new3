<template>
  <view class="exchange-center-page">
    <view class="page-title">
      <text>兑换中心</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="points-container">
      <view class="points">
        <view class="points-title">
          <text>我的金豆</text>
          <text>{{ signInfo.points || 0 }}</text>
        </view>

        <view class="point-detail" @click="$refs.recodeDialog.open()">金豆明细 ></view>
      </view>
    </view>

    <view class="exchange-container">
      <view class="title">
        <text>会员兑换</text>
        <text @click="$refs.exchangeDialog.open()">兑换记录</text>
      </view>

      <view class="exchange-list">
        <view class="exchange-item" v-for="item of exchangeList" :key="item.id">
          <image
            class="vip-icon"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/exchangeCenter/icon1.png"
          />

          <view class="left">
            <text>{{ item.name }}</text>
            <text>可享受{{ item.vip_days }}天会员权益</text>
          </view>

          <view class="right" @click="exchange(item)">
            <view class="icon">
              <image
                class="vip-icon"
                mode="widthFix"
                src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/exchangeCenter/icno2.png"
              />

              <text>{{ item.flowers_required }}</text>
            </view>
            <text class="btn">去兑换</text>
          </view>
        </view>
      </view>
    </view>

    <exchange-dialog ref="exchangeDialog" :exchangeCenter="1" />
    <recode-dialog ref="recodeDialog" />
  </view>
</template>

<script>
import $http from '@/utils/http';
import ExchangeDialog from '@/pages/exchangeCenter/exchangeDialog.vue';
import RecodeDialog from '@/components/recodeDialog.vue';

export default {
  name: 'exchangeCenter',

  components: {
    RecodeDialog,
    ExchangeDialog,
  },

  data() {
    return {
      exchangeList: [],
      signInfo: {},
    };
  },

  onShow() {
    this.getExchangeList();
    this.getSignInfo();
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/share-img.jpg',
      path: '/pages/index/index',
    };
  },

  methods: {
    getSignInfo() {
      return $http.get('api/lucky-bag/account-info').then((res) => {
        this.signInfo = res.data;
      });
    },

    getExchangeList() {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http.get('api/lucky-bag/available-exchanges').then((res) => {
        uni.hideLoading();

        this.exchangeList = res.data;
      });
    },

    exchange(item) {
      uni.showModal({
        title: '温馨提示',
        content: '确定要兑换此商品吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '加载中...',
              mask: true,
            });

            $http
              .post('api/lucky-bag/exchange-vip', {
                exchange_type: item.exchange_type,
              })
              .then(() => {
                uni.hideLoading();

                uni.showToast({
                  title: '兑换成功',
                  mask: true,
                  icon: 'none',
                });

                this.getSignInfo();
                this.getExchangeList();
              });
          }
        },
      });
    },
  },
};
</script>

<style>
page {
  height: 100%;
  background: #ffffff url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/exchangeCenter/bg.png') left
    top/100% auto no-repeat;
}
</style>

<style scoped lang="scss">
.exchange-center-page {
  .page-title {
  }

  .banner {
    padding: calc(var(--page-title-height) + 20rpx) 0 0;
  }

  .points-container {
    padding: 0 30rpx;
    margin-bottom: 30rpx;

    .points {
      padding: 42rpx 19rpx 34rpx;
      background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/exchangeCenter/bg2.png') left top/
        100% 100% no-repeat;

      .points-title {
        margin-bottom: 37rpx;

        text {
          &:nth-child(1) {
            font-weight: 500;
            font-size: 26rpx;
            color: #111111;
            margin-right: 14rpx;
          }

          &:nth-child(2) {
            font-weight: 500;
            font-size: 49rpx;
            color: #111111;
          }
        }
      }

      .point-detail {
        font-size: 24rpx;
        color: #999999;
      }
    }
  }

  .exchange-container {
    background: #ffffff;
    border-radius: 30rpx 30rpx 0 0;
    padding: 29rpx 28rpx;
    position: relative;

    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 28rpx;
      margin-bottom: 32rpx;

      text {
        font-weight: 500;

        &:nth-child(1) {
          font-size: 30rpx;
          color: #111111;
        }

        &:nth-child(2) {
          font-size: 26rpx;
          color: #999999;
        }
      }
    }

    .exchange-list {
      display: flex;
      flex-direction: column;
      gap: 20rpx;

      .exchange-item {
        background: #f6f7fb;
        border-radius: 20rpx;
        padding: 30rpx 28rpx 13rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .vip-icon {
          width: 93rpx;
          margin-right: 32rpx;
        }

        .left {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 15rpx;

          text {
            &:nth-child(1) {
              font-weight: 500;
              font-size: 28rpx;
              color: #111111;
            }

            &:nth-child(2) {
              font-size: 24rpx;
              color: #999999;
            }
          }
        }

        .right {
          .icon {
            margin-bottom: 19rpx;

            image {
              width: 33rpx;
              margin-right: 13rpx;
            }

            text {
              font-weight: 500;
              font-size: 30rpx;
              color: #5765e6;
            }
          }

          .btn {
            &.disabled {
              background: #e6e6e6;
              color: #999999;
            }

            background: linear-gradient(90deg, #4f69e6 0%, #6b56e3 100%);
            border-radius: 15rpx;
            width: 126rpx;
            height: 55rpx;
            font-weight: 500;
            font-size: 24rpx;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
