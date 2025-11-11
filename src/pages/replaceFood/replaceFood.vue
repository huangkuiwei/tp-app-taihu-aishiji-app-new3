<template>
  <view class="replace-food-page">
    <view class="page-title">
      <text>更换食物</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <!-- TODO 替换食物数据 -->
    <view class="food-list-wrap">
      <view class="tip">以下是为你推荐可替换<text>拌黄瓜</text>的食物</view>

      <view class="food-list">
        <view class="food-item">
          <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/logo3.jpg" />
          <view class="info">
            <text>拌黄瓜</text>
            <text>100克/16.00千卡</text>
          </view>
          <view class="replace" @click="replaceFood">替换</view>
        </view>

        <view class="food-item">
          <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/logo3.jpg" />
          <view class="info">
            <text>拌黄瓜</text>
            <text>100克/16.00千卡</text>
          </view>
          <view class="replace">替换</view>
        </view>

        <view class="food-item">
          <image mode="widthFix" src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/logo3.jpg" />
          <view class="info">
            <text>拌黄瓜</text>
            <text>100克/16.00千卡</text>
          </view>
          <view class="replace">替换</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'replaceFood',

  methods: {
    // TODO 替换
    replaceFood() {},
  },
};
</script>

<style lang="scss">
page {
  background: #f6f7fb;
}
</style>

<style scoped lang="scss">
.replace-food-page {
  .page-title {
    background: #ffffff;
  }

  .banner {
    background: #ffffff;
    padding: calc(var(--page-title-height)) 0 0;
  }

  .food-list-wrap {
    padding: 18rpx 30rpx 80rpx;

    .tip {
      font-size: 28rpx;
      color: #bfbfbf;
      margin-bottom: 18rpx;

      text {
        color: #65d285;
      }
    }

    .food-list {
      display: flex;
      flex-direction: column;
      gap: 20rpx;

      .food-item {
        padding: 10rpx;
        background: #ffffff;
        border-radius: 20rpx;
        display: flex;
        align-items: center;

        image {
          width: 100rpx;
          border-radius: 20rpx;
          margin-right: 18rpx;
        }

        .info {
          display: flex;
          flex-direction: column;
          gap: 24rpx;
          flex-grow: 1;

          text {
            &:nth-child(1) {
              font-size: 28rpx;
              color: #1a1a1a;
            }

            &:nth-child(2) {
              font-size: 24rpx;
              color: #999999;
            }
          }
        }

        .replace {
          width: 148rpx;
          height: 60rpx;
          border-radius: 30rpx;
          border: 2rpx solid #65d285;
          font-weight: 500;
          font-size: 26rpx;
          color: #65d285;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
