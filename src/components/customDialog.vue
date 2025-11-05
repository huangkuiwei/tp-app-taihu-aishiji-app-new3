<template>
  <uni-popup ref="popupRef" :is-mask-click="false">
    <view class="custom-dialog">
      <view class="title">
        <text>{{ title }}</text>
      </view>

      <view class="content-box">
        <slot></slot>
      </view>

      <slot name="footer"></slot>
    </view>

    <view class="close" v-show="shopClose">
      <uni-icons color="#ffffff" type="close" size="30" @click="close"></uni-icons>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: 'ruleDialog',

  props: {
    title: {
      type: String,
      default: '',
    },

    shopClose: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    open() {
      this.$refs.popupRef.open();
    },

    close() {
      this.$refs.popupRef.close();
    },
  },
};
</script>

<style scoped lang="scss">
.custom-dialog {
  width: 550rpx;
  background: linear-gradient(90deg, #e8fdf4 0%, #f6fcf5 100%);
  border-radius: 30rpx;
  padding: 41rpx 25rpx;

  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 48rpx;

    text {
      font-weight: 500;
      font-size: 36rpx;
      color: #65d285;
    }
  }

  .content-box {
    max-height: 50vh;
    overflow: auto;
  }
}

.close {
  text-align: center;
  padding-top: 28rpx;
}
</style>
