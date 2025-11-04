<template>
  <view class="profile-page">
    <view class="page-title">
      <text>设置</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="userinfo">
      <view class="box-title">基本信息</view>

      <view class="box">
        <view class="item" @click="editHeaderImg">
          <text class="label">头像</text>

          <view class="picker">
            <view class="value">
              <image
                class="header-img"
                mode="aspectFill"
                :src="
                  userInfo.avatar_url ||
                  'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/my/default_head.png'
                "
              />
            </view>
          </view>
        </view>

        <view class="item">
          <text class="label">昵称</text>

          <view class="picker">
            <view class="value">
              <text class="filed">{{ userInfo.uname }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="box-title">账户</view>

      <view class="box">
        <view class="item" @click="$toRouter('/packageLogin/pages/changePhone/changePhone')">
          <text class="label">更换手机号</text>

          <view class="picker">
            <view class="value">
              <text class="filed">{{ userInfo.phone }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="box-title">其他</view>

      <view class="box">
        <view class="item" @click="$toRouter('/packageProtocol/pages/protocol/protocol')">
          <text class="label">用户协议</text>

          <view class="picker">
            <view class="value">
              <text class="filed"></text>
              <uni-icons class="back" color="#999999" type="right" size="16"></uni-icons>
            </view>
          </view>
        </view>

        <view class="item" @click="$toRouter('/packageProtocol/pages/privacy/privacy')">
          <text class="label">隐私政策</text>

          <view class="picker">
            <view class="value">
              <text class="filed"></text>
              <uni-icons class="back" color="#999999" type="right" size="16"></uni-icons>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="account">
      <view class="box">
        <view class="item" @click="signOut">
          <text class="label">退出登录</text>
        </view>

        <view class="item" @click="$toRouter('/packageLogin/pages/logout/logout')">
          <text class="label" style="color: #eb0000">注销</text>
        </view>
      </view>
    </view>

    <uni-popup ref="signOutDialog">
      <view class="sign-out-dialog">
        <view class="title">确认要退出登录么？</view>

        <view class="tip">
          <view>退出登录后将无法继续同步数据、</view>
          <view>无法享受已获得的会员权益</view>
        </view>

        <view class="options">
          <view class="btn1" @click="$refs.signOutDialog.close()">取消</view>
          <view class="btn2" @click="submitSignOut">确认退出</view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import $http from '@/utils/http';

export default {
  name: 'profile',

  data() {
    return {};
  },

  computed: {
    ...mapState('app', ['userInfo']),
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/share-img.jpg',
      path: '/pages/index/index',
    };
  },

  methods: {
    ...mapActions('app', ['_getUserDetailInfo', '_getUserInfo']),

    editHeaderImg() {
      uni.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          uni.showLoading({
            title: '上传中，请稍等...',
            mask: true,
          });

          let filePath = res.tempFiles[0].tempFilePath;
          let url = await this.uploadFile(filePath);

          await $http.post('api/user/auth/userauth/update_wx_info', {
            avatarUrl: url,
          });

          await this._getUserInfo();

          uni.showToast({
            title: '更新成功',
            icon: 'none',
          });
        },
      });
    },

    uploadFile(path) {
      return $http.upload('api/global/fileupload/upload', path, 'file').then((res) => {
        return res.data;
      });
    },

    signOut() {
      this.$refs.signOutDialog.open();
    },

    submitSignOut() {
      uni.showLoading({
        title: '退出中...',
        mask: true,
      });

      $http.post('api/user/auth/userauth/logout').then(() => {
        uni.hideLoading();

        this.$refs.signOutDialog.close();

        uni.showToast({
          title: '退出成功',
          icon: 'none',
          mask: true,
        });

        setTimeout(() => {
          this.$toReLaunch('/pages/index/index');
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
.profile-page {
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
  }

  .userinfo {
    flex-grow: 1;
    padding: 40rpx 30rpx 0;

    .box-title {
      padding-left: 21rpx;
      font-size: 24rpx;
      color: #999999;
      margin-bottom: 19rpx;
    }
  }

  .box {
    background: #ffffff;
    border-radius: 20rpx;
    padding: 30rpx 24rpx;
    margin-bottom: 41rpx;

    .item {
      display: flex;
      align-items: center;

      &:not(:last-child) {
        padding-bottom: 30rpx;
        margin-bottom: 30rpx;
        border-bottom: 1px solid #f6f7fb;
      }

      .label {
        font-weight: 500;
        font-size: 28rpx;
        color: #111111;
      }

      .picker {
        flex-grow: 1;

        .value {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .filed {
            font-size: 24rpx;
            color: #555555;
            margin-right: 15rpx;
          }

          .header-img {
            width: 50rpx;
            height: 50rpx;
            border-radius: 50%;
          }
        }
      }
    }
  }

  .account {
    padding: 0 30rpx;
    margin-bottom: 100rpx;

    .item {
      justify-content: center;
    }
  }

  .sign-out-dialog {
    width: 580rpx;
    background: #ffffff;
    border-radius: 30rpx;
    padding: 40rpx 85rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;

    .title {
      font-weight: 500;
      font-size: 30rpx;
      color: #000000;
      margin-bottom: 50rpx;
    }

    .tip {
      font-weight: 500;
      font-size: 28rpx;
      color: #555555;
      margin-bottom: 35rpx;

      view {
        line-height: 50rpx;
        text-align: center;
      }
    }

    .options {
      align-self: stretch;

      .btn1 {
        width: 100%;
        height: 90rpx;
        background: linear-gradient(90deg, #4f69e6 0%, #6b56e3 100%);
        border-radius: 45rpx;
        font-weight: 500;
        font-size: 30rpx;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 19rpx;
      }

      .btn2 {
        width: 100%;
        height: 90rpx;
        background: #f2f5ff;
        border-radius: 45rpx;
        font-weight: 500;
        font-size: 30rpx;
        color: #5664e5;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
