<template>
  <uni-popup ref="selectFoodTypeDialog" type="bottom" :safe-area="false">
    <view class="select-food-type-dialog">
      <view class="type-list">
        <view class="type-item" v-for="item of foodRecodeList" :key="item.type" @click="submit(item)">
          {{ item.text }}
        </view>

        <view class="type-item cancel" @click="close">取消</view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: 'selectFoodTypeDialog',

  props: {
    foodRecodeList: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    open() {
      this.$refs.selectFoodTypeDialog.open();
    },

    close() {
      this.$refs.selectFoodTypeDialog.close();
    },

    submit(item) {
      this.$emit('selectFoodTypeSubmit', item.type);
      this.close();
    },
  },
};
</script>

<style scoped lang="scss">
.select-food-type-dialog {
  width: 100%;
  background: #ffffff;
  border-radius: 30rpx 30rpx 0 0;
  padding: 0 50rpx;

  .type-list {
    display: flex;
    flex-direction: column;

    .type-item {
      padding: 45rpx 0;
      text-align: center;
      font-size: 32rpx;
      color: #111111;
      border-bottom: 2rpx solid #e6e6e6;

      &.cancel {
        font-size: 32rpx;
        color: #bfbfbf;
        border-bottom: none;
      }
    }
  }
}
</style>
