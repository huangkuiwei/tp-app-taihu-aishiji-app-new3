<template>
  <view class="set-reminder-page">
    <view class="page-title">
      <text>设置提醒</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"> </view>

    <view class="container">
      <view class="reminder-item" v-if="!reminderData.is_wx_subscribed" @click="goWebview">
        <view class="left">
          <text>所有提醒</text>
          <text>你已关闭提醒功能，打开可及时完成记录</text>
        </view>
        <view class="right">去打开</view>
      </view>

      <view class="reminder-item">
        <view class="left">
          <text>饮食记录提醒</text>
        </view>

        <view @click="toggleSwitch">
          <switch
            color="#5664E5"
            :disabled="!reminderData.is_wx_subscribed"
            :checked="reminderData.is_diet_remind_enabled"
            @change="onChange1"
          />
        </view>
      </view>

      <view class="reminder-item">
        <view class="left">
          <text>运动记录提醒</text>
        </view>

        <view @click="toggleSwitch">
          <switch
            color="#5664E5"
            :disabled="!reminderData.is_wx_subscribed"
            :checked="reminderData.is_exercise_remind_enabled"
            @change="onChange2"
          />
        </view>
      </view>

      <view class="reminder-item">
        <view class="left">
          <text>体重记录提醒</text>
        </view>

        <view @click="toggleSwitch">
          <switch
            color="#5664E5"
            :disabled="!reminderData.is_wx_subscribed"
            :checked="reminderData.is_weight_remind_enabled"
            @change="onChange3"
          />
        </view>
      </view>
    </view>

    <view class="submit">
      <text @click="updateReminderData">确认</text>
    </view>
  </view>
</template>

<script>
import $http from '@/utils/http';

export default {
  name: 'setReminder',

  data() {
    return {
      reminderData: {},
      link: '',
    };
  },

  async onShow() {
    uni.showLoading({
      title: '加载中...',
      mask: true,
    });

    await this.getWxSubStatus();
    await this.getReminderData();

    uni.hideLoading();
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/share-img.jpg',
      path: '/pages/index/index',
    };
  },

  methods: {
    getWxSubStatus() {
      return $http.get('api/user/profile/check-wx-subscription');
    },

    getReminderData() {
      return $http.get('api/user/profile/remind-settings').then((res) => {
        this.reminderData = res.data;
      });
    },

    goWebview() {
      this.$toRouter('/packageLogin/pages/webview/webview', `src=${encodeURIComponent(this.link)}`);
    },

    toggleSwitch() {
      if (!this.reminderData.is_wx_subscribed) {
        uni.showToast({
          title: '请先开启提醒',
          icon: 'none',
        });
      }
    },

    onChange1($event) {
      this.reminderData.is_diet_remind_enabled = $event.detail.value;
    },

    onChange2($event) {
      this.reminderData.is_exercise_remind_enabled = $event.detail.value;
    },

    onChange3($event) {
      this.reminderData.is_weight_remind_enabled = $event.detail.value;
    },

    /**
     * 更新订阅状态
     */
    updateReminderData() {
      $http
        .post('api/user/profile/update-remind-settings', {
          is_diet_remind_enabled: this.reminderData.is_diet_remind_enabled,
          is_exercise_remind_enabled: this.reminderData.is_exercise_remind_enabled,
          is_weight_remind_enabled: this.reminderData.is_weight_remind_enabled,
        })
        .then(() => {
          uni.showToast({
            title: '操作成功',
            icon: 'none',
          });

          setTimeout(() => {
            this.$toBack();
          }, 1500);
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
.set-reminder-page {
  height: 100%;
  display: flex;
  flex-direction: column;

  .page-title {
    background: #ffffff;
    flex-shrink: 0;
  }

  .banner {
    padding: calc(var(--page-title-height)) 0 0;
    background: #ffffff;
    flex-shrink: 0;
    margin-bottom: 10rpx;
  }

  .container {
    flex-grow: 1;
    background: #ffffff;
    padding: 41rpx 30rpx;
    display: flex;
    flex-direction: column;

    .reminder-item {
      display: flex;
      align-items: center;
      justify-content: space-between;

      &:not(:last-child) {
        margin-bottom: 30rpx;
        padding-bottom: 30rpx;
        border-bottom: 2rpx solid #e6e6e6;
      }

      .left {
        font-size: 28rpx;
        color: #1a1a1a;
        display: flex;
        flex-direction: column;
        gap: 20rpx;

        text {
          &:nth-child(2) {
            font-size: 22rpx;
            color: #999999;
          }
        }
      }

      .right {
        width: 137rpx;
        height: 50rpx;
        background: #5664e5;
        border-radius: 25rpx;
        font-weight: 500;
        font-size: 24rpx;
        color: #ffffff;
        line-height: 61rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      switch {
        transform: scale(0.8);
      }
    }
  }

  .submit {
    background: #ffffff;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 100rpx;

    text {
      width: 580rpx;
      height: 100rpx;
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
