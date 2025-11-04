<template>
  <view class="feedback-page">
    <view class="page-title">
      <text>意见反馈</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"> </view>

    <view class="feedback-container">
      <view class="feedback-box">
        <view class="input-box">
          <textarea
            placeholder="请输入您要反馈的问题或意见（5-500字以内）"
            :maxlength="500"
            :value="content"
            @input="content = $event.detail.value"
          />
        </view>
      </view>

      <view class="tip">
        您的反馈和意见我们会尽快解决，但无法保证每一条都能及时反馈，如有紧急咨询可直接拨打客服热线：4009989618
      </view>

      <view class="submit" @click="submit">提交</view>
    </view>
  </view>
</template>

<script>
import $http from '@/utils/http';

export default {
  name: 'feedback',

  data() {
    return {
      content: '',
    };
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/share-img.jpg',
      path: '/pages/index/index',
    };
  },

  methods: {
    async submit() {
      if (!this.content) {
        uni.showToast({
          title: '反馈内容不能为空',
          icon: 'none',
        });

        return;
      }

      if (this.content.length < 5) {
        uni.showToast({
          title: '反馈内容字数不能少于5个',
          icon: 'none',
        });

        return;
      }

      uni.showLoading({
        title: '正在提交...',
        mask: true,
      });

      $http
        .post('api/user/profile/submit-suggestion', {
          content: this.content,
        })
        .then(() => {
          uni.hideLoading();

          uni.showToast({
            title: '提交成功',
            icon: 'none',
            mask: true,
          });

          setTimeout(() => {
            this.$toBack();
          }, 1000);
        });
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
.feedback-page {
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

  .feedback-container {
    background: #ffffff;
    flex-grow: 1;
    padding: 20rpx 30rpx;
    display: flex;
    flex-direction: column;

    .feedback-box {
      flex-shrink: 0;
      border-radius: 20rpx;
      background: #ffffff;
      margin-bottom: 33rpx;

      .input-box {
        background: #f6f7fb;
        height: 421rpx;
        border-radius: 20rpx;
        padding: 32rpx 34rpx;

        textarea {
          width: 100%;
          height: 100%;
          font-size: 24rpx;
        }
      }
    }

    .tip {
      flex-grow: 1;
      font-size: 22rpx;
      color: #999999;
      line-height: 45rpx;
    }

    .submit {
      width: 580rpx;
      height: 100rpx;
      margin: 0 auto 100rpx;
      background: linear-gradient(90deg, #4f69e6 0%, #6b56e3 100%);
      border-radius: 50rpx;
      font-weight: bold;
      font-size: 30rpx;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
