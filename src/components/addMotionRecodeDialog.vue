<template>
  <uni-popup ref="addRecodePopup">
    <view class="add-recode-dialog">
      <view class="title">
        <text class="title-text">添加运动</text>

        <view class="close">
          <uni-icons type="closeempty" color="#999999" size="24" @click="$refs.addRecodePopup.close()" />
        </view>
        <view class="recording-tip" v-if="recording">说话中</view>
      </view>

      <view class="input-box">
        <textarea
          :value="motionText"
          @input="motionText = $event.detail.value"
          :maxlength="-1"
          placeholder="快来说说你做了哪些运动版！ 比如呼啦圈20分钟、骑行10km"
        />
        <view class="tools">
          <view class="recording">
            <image
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/icon1.png"
              :style="{ width: recording ? '100rpx' : '90rpx' }"
              @touchstart="handleTouchStart"
              @touchend="handleTouchEnd"
            />

            <view
              v-if="progress"
              class="progress-ring"
              :style="{ background: `conic-gradient(#5664E5 calc(${progress} * 0.6deg), #5664e520 0)` }"
            />
          </view>
        </view>
      </view>

      <view class="submit" @click="submit">确定</view>
    </view>
  </uni-popup>
</template>

<script>
import $http from '@/utils/http';

let recorderManager = null;

export default {
  name: 'addMotionRecodeDialog',

  data() {
    return {
      motionText: '',
      recording: false,
      progress: 0,
    };
  },

  methods: {
    open() {
      this.$refs.addRecodePopup.open();
    },

    close() {
      this.$refs.addRecodePopup.close();
    },

    submit() {
      if (!this.motionText.trim()) {
        uni.showToast({
          title: '请填写记录',
          icon: 'none',
        });

        return;
      }

      this.$emit('addRecode', {
        text: this.motionText,
        type: 7,
        input_type: 1,
      });
    },

    handleTouchStart() {
      let timer = null;

      recorderManager = uni.getRecorderManager();

      recorderManager.onStart(() => {
        timer = setInterval(() => {
          if (this.progress >= 600) {
            clearInterval(timer);
            recorderManager.stop();
          } else {
            this.progress += 1;
          }
        }, 100);
      });

      recorderManager.onStop((res) => {
        this.recording = false;
        timer && clearInterval(timer);

        uni.showLoading({
          title: this.progress >= 600 ? '单次录音最高60秒，正在识别...' : '正在识别...',
          mask: true,
        });

        this.progress = 0;

        $http
          .upload('api/baseai/speech-to-text', res.tempFilePath, 'file', {
            sampleRate: 16000,
          })
          .then((res) => {
            uni.hideLoading();

            if (res.data && res.data.text) {
              this.motionText += res.data.text.join('');
            } else {
              uni.showToast({
                title: '未识别到语音，请重新录入',
                icon: 'none',
              });
            }
          });
      });

      recorderManager.onError((res) => {
        this.recording = false;
        this.progress = 0;
        timer && clearInterval(timer);

        if (res.errMsg === 'operateRecorder:fail auth deny') {
          uni.showModal({
            title: '提示',
            content: '您没有授权麦克风权限，无法使用该功能，请跳转到设置页面打开麦克风权限',
            showCancel: true,
            success: (res) => {
              if (res.confirm) {
                uni.openSetting({
                  success(res) {
                    console.log(res.authSetting);
                  },
                });
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            },
          });

          return;
        }

        uni.showToast({
          title: res.errMsg,
          icon: 'none',
        });
      });

      recorderManager.start();
      this.recording = true;
    },

    handleTouchEnd() {
      recorderManager.stop();
    },
  },
};
</script>

<style scoped lang="scss">
.add-recode-dialog {
  width: 690rpx;
  background: #ffffff;
  border-radius: 30rpx;
  padding: 34rpx 20rpx 48rpx;
  position: relative;

  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 35rpx;

    .title-text {
      font-weight: bold;
      font-size: 30rpx;
      color: #111111;
    }

    .recording-tip {
      position: absolute;
      top: 40rpx;
      left: 40rpx;
      font-size: 22rpx;
      color: #999999;
    }

    .close {
      position: absolute;
      top: 30rpx;
      right: 40rpx;
    }
  }

  .input-box {
    height: 520rpx;
    background: #f6f7fb;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    padding: 25rpx 22rpx 0;
    margin-bottom: 44rpx;
    position: relative;

    .recording-tip {
      position: absolute;
      top: -54rpx;
      left: 140rpx;
      font-size: 22rpx;
      color: #999999;
    }

    textarea {
      width: 100%;
      flex-grow: 1;
      font-size: 26rpx;
      line-height: 40rpx;
    }

    .tools {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20rpx 10rpx;

      .recording {
        width: 120rpx;
        height: 120rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        .tip {
          font-size: 22rpx;
          color: #bfbfbf;
          position: absolute;
          top: -34rpx;
          left: 18rpx;
        }

        .progress-ring {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;

          &::after {
            content: '';
            position: absolute;
            width: 116rpx;
            height: 116rpx;
            background: #f8f8f8;
            border-radius: 50%;
          }
        }

        image {
          position: relative;
          z-index: 9;
        }
      }
    }
  }

  .submit {
    margin: 0 auto;
    width: 420rpx;
    height: 90rpx;
    background: linear-gradient(90deg, #4f69e6 0%, #6b56e3 100%);
    border-radius: 45rpx;
    font-weight: bold;
    font-size: 28rpx;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
