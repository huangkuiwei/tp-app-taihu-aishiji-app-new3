<template>
  <view class="about-page">
    <view class="page-title">
      <text>关于我们</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="about-container">
      <view class="icon-box">
        <view class="icon1">
          <view class="img">
            <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/logo3.jpg" />
          </view>
          <view class="name">减肥记录</view>
          <view class="version" v-if="version">当前版本{{ version }}</view>
        </view>
      </view>

      <view class="company">长沙数织科技有限公司</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'about',

  data() {
    return {
      version: '',
    };
  },

  onLoad() {
    // #ifdef MP-WEIXIN
    let { version } = uni.getAccountInfoSync().miniProgram;
    this.version = version;
    // #endif
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/share-img.jpg',
      path: '/pages/index/index',
    };
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
.about-page {
  height: 100%;
  display: flex;
  flex-direction: column;

  .page-title {
    flex-shrink: 0;
    background: #ffffff;
  }

  .banner {
    flex-shrink: 0;
    padding: calc(var(--page-title-height)) 0 0;
    background: #ffffff;
    margin-bottom: 10rpx;
  }

  .about-container {
    background: #ffffff;
    flex-grow: 1;
    padding: 156rpx 61rpx 122rpx;
    display: flex;
    flex-direction: column;

    .icon-box {
      display: flex;
      align-items: flex-start;
      flex-grow: 1;

      .icon1 {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .img {
          width: 120rpx;
          height: 120rpx;
          margin-bottom: 39rpx;

          image {
            width: 100%;
            border-radius: 23rpx;
          }
        }

        .name {
          font-weight: bold;
          font-size: 28rpx;
          color: #111111;
          margin-bottom: 19rpx;
        }

        .version {
          font-size: 24rpx;
          color: #999999;
        }
      }
    }

    .company {
      flex-shrink: 0;
      text-align: center;
      font-size: 24rpx;
      color: #999999;
    }
  }
}
</style>
