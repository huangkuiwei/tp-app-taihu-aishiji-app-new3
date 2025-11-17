<template>
  <view class="receive-red-packet-page">
    <view class="container">
      <view class="top">
        <image
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/receiveRedPacket/logo.png"
        />

        <text>{{ appInfo.appName }}发出的红包</text>
      </view>

      <view class="bottom">恭喜发财，大吉大利！</view>
    </view>

    <view class="btn">
      <image
        mode="widthFix"
        @click="confirmReceive"
        src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/receiveRedPacket/open-btn.png"
      />
    </view>
  </view>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'receiveRedPacket',

  data() {
    return {
      redPacket: false,
      sign_order_no: null,
    };
  },

  onLoad() {
    this.sign_order_no = uni.getStorageSync('sign_order_no');
  },

  computed: {
    ...mapState('app', ['appInfo']),
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/zhiyingsaoshi/share.jpg',
      path: '/pages/index/index',
    };
  },

  methods: {
    confirmReceive() {
      uni.showLoading({
        title: '正在抽取红包',
        mask: true,
      });

      uni.request({
        method: 'POST',
        url: `https://fyapi.cshuz.cn/api/open/order/cashgift/v3`,
        data: {
          external_agreement_no: this.sign_order_no,
        },
        success: async (res) => {
          console.log('res', res);

          if (res.data.Code === 0 || res.data.code === 0) {
            let packages = res.data.data.packages || [];
            console.log('packages', packages);

            if (!packages.length) {
              uni.showToast({
                title: '暂无红包可领取',
                icon: 'none',
              });

              return;
            }

            let mchId = res.data.data.mch_id;
            let appid = res.data.data.appid;

            for (let i = 0; i < packages.length; i++) {
              await this.merchantTransfer(mchId, appid, packages[i]).catch(() => {});
            }

            uni.hideLoading();
            uni.removeStorageSync('sign_order_no');

            uni.showModal({
              title: '温馨提示',
              content: '红包领取成功',
              showCancel: false,
              confirmText: '进入首页',
              closable: false,
              success: (res2) => {
                if (res2.confirm) {
                  uni.switchTab({
                    url: '/pages/index/index',
                  });
                }
              },
            });
          } else {
            uni.hideLoading();
            uni.showToast({
              title: res.data.msg || res.data.Msg,
              icon: 'none',
              mask: true,
            });
          }
        },

        fail: () => {
          uni.hideLoading();
        },
      });
    },

    merchantTransfer(mchId, appid, package1) {
      return new Promise((resolve, reject) => {
        uni.requestMerchantTransfer({
          mchId: mchId,
          appId: appid,
          package: package1,
          success: (res1) => {
            console.log('res1:', res1);

            // res.err_msg将在页面展示成功后返回应用时返回ok，并不代表付款成功
            if (res1.errMsg === 'requestMerchantTransfer:ok') {
            }
            resolve(res1);
          },
          fail: (error) => {
            console.log('error:', error, mchId, appid, package1);
            uni.showToast({
              title: error.errMsg,
              icon: 'none',
            });

            reject(error);
          },
        });
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
.receive-red-packet-page {
  height: 100%;
  background: #f15442
    url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/scantool/static/assets/receiveRedPacket/red-packet-bg.png') left
    top/100% auto no-repeat;
  position: relative;

  .container {
    padding-top: 236rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .top {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 52rpx;

      image {
        width: 60rpx;
        margin-right: 25rpx;
      }

      text {
        font-weight: 500;
        font-size: 40rpx;
        color: #ffe0b0;
      }
    }

    .bottom {
      font-weight: 500;
      font-size: 56rpx;
      color: #ffe0b0;
    }
  }

  .btn {
    position: absolute;
    top: 57%;
    left: 0;
    right: 0;
    text-align: center;

    image {
      width: 266rpx;
    }
  }
}
</style>
