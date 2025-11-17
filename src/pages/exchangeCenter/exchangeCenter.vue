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
        <image
          class="header-img"
          mode="aspectFill"
          :src="
            userInfo.avatar_url || 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/my/default_head.png'
          "
        />

        <view class="points-title">
          <text>{{ userInfo.uname || '微信用户' }}</text>
          <text>金币：{{ signInfo.points || 0 }}</text>
        </view>

        <view class="point-detail" @click="$refs.exchangeDialog.open()">兑换记录</view>
      </view>
    </view>

    <view class="exchange-container">
      <view class="exchange-list">
        <view class="exchange-item" v-for="item of exchangeList" :key="item.id">
          <view class="left">
            <view class="top">
              <image
                class="vip-icon"
                mode="widthFix"
                src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/box/icon1.png"
              />
              <text>{{ item.name }}</text>
            </view>

            <view class="bottom">
              <text>需消耗：{{ item.flowers_required }}金币</text>
            </view>
          </view>

          <view class="right" @click="exchange(item)">
            <text class="btn">兑换</text>
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
import { mapState } from 'vuex';

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
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/share.jpg',
      path: '/pages/index/index',
    };
  },

  computed: {
    ...mapState('app', ['userInfo']),
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
  background: #f6f7fb url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/exchangeCenter/bg1.png') left
    top/100% auto no-repeat;
}
</style>

<style scoped lang="scss">
.exchange-center-page {
  .page-title {
  }

  .banner {
    padding: calc(var(--page-title-height) + 46rpx) 0 0;
  }

  .points-container {
    padding: 0 37rpx;
    margin-bottom: 82rpx;

    .points {
      display: flex;
      align-items: center;

      .header-img {
        width: 130rpx;
        height: 130rpx;
        border-radius: 50%;
        margin-right: 27rpx;
      }

      .points-title {
        display: flex;
        flex-direction: column;
        gap: 23rpx;
        flex-grow: 1;

        text {
          &:nth-child(1) {
            font-weight: 500;
            font-size: 36rpx;
            color: #000000;
          }

          &:nth-child(2) {
            font-weight: 500;
            font-size: 26rpx;
            color: #000000;
          }
        }
      }

      .point-detail {
        width: 148rpx;
        height: 46rpx;
        border-radius: 23rpx;
        border: 1px solid #111111;
        font-weight: 500;
        font-size: 26rpx;
        color: #000000;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .exchange-container {
    padding: 0 30rpx;
    position: relative;

    .exchange-list {
      display: flex;
      flex-direction: column;
      gap: 20rpx;

      .exchange-item {
        background: #ffffff;
        border-radius: 30rpx;
        padding: 45rpx 27rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          display: flex;
          flex-direction: column;
          gap: 29rpx;

          .top {
            display: flex;
            align-items: center;

            .vip-icon {
              width: 50rpx;
              margin-right: 21rpx;
            }

            text {
              font-weight: 500;
              font-size: 36rpx;
              color: #222222;
            }
          }

          .bottom {
            font-weight: 500;
            font-size: 26rpx;
            color: #999999;
          }
        }

        .right {
          .btn {
            width: 120rpx;
            height: 55rpx;
            font-weight: 500;
            font-size: 26rpx;
            color: #ffffff;
            background: linear-gradient(90deg, #ff3121 0%, #ff9102 100%);
            border-radius: 28rpx;
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
