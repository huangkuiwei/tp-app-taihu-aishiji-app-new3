<template>
  <custom-dialog ref="exchangeDialog" title="兑换记录" :shop-close="false">
    <view class="content">
      <view class="recode-list" v-if="exchangeList.length">
        <view class="recode-item" v-for="item of exchangeList" :key="item.id">
          <text>{{ item.exchange_time.slice(0, 10) }}</text>
          <text>{{ item.name }}</text>
        </view>
      </view>

      <view class="empty-recode" v-else>暂无记录</view>
    </view>

    <template #footer>
      <view class="btn">
        <text @click="close">知道了</text>
      </view>
    </template>
  </custom-dialog>
</template>

<script>
import customDialog from '@/components/customDialog.vue';
import $http from '@/utils/http';

export default {
  name: 'exchangeDialog',

  props: {
    exchangeCenter: {
      type: Number,
    },
  },

  components: {
    customDialog,
  },

  data() {
    return {
      exchangeList: [],
    };
  },

  methods: {
    getExchangeList() {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http
        .post('api/lucky-bag/exchange-records', {
          pageIndex: 1,
          pageSize: 9999,
          exchangeCenter: this.exchangeCenter,
        })
        .then((res) => {
          uni.hideLoading();

          this.exchangeList = res.data.Items;
        });
    },

    open() {
      this.getExchangeList();
      this.$refs.exchangeDialog.open();
    },

    close() {
      this.$refs.exchangeDialog.close();
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  .recode-list {
    display: flex;
    flex-direction: column;
    margin-bottom: 50rpx;

    .recode-item {
      display: flex;
      align-items: center;
      margin-bottom: 49rpx;

      text {
        font-size: 26rpx;
        color: #000000;

        &:nth-child(1) {
          flex-grow: 1;
        }
      }
    }
  }

  .empty-recode {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #aaaaaa;
    padding: 30rpx 0 60rpx;
  }
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;

  text {
    width: 343rpx;
    height: 70rpx;
    background: #65d285;
    border-radius: 35rpx;
    font-size: 32rpx;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
