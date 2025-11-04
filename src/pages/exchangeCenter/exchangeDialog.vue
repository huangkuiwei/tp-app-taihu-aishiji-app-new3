<template>
  <custom-dialog ref="exchangeDialog" title="兑换记录" :shop-close="false">
    <view class="content">
      <view class="recode-list" v-if="exchangeList.length">
        <view class="recode-item" v-for="item of exchangeList" :key="item.id">
          <text>{{ item.name }}</text>
          <text>{{ item.exchange_time.slice(6, 10) }}</text>
        </view>
      </view>

      <view class="empty-recode">暂无记录</view>
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
      margin-bottom: 30rpx;

      text {
        font-size: 24rpx;
        color: #1a1a1a;

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
    width: 312rpx;
    height: 85rpx;
    background: linear-gradient(90deg, #4f69e6 0%, #6b56e3 100%);
    border-radius: 43rpx;
    font-weight: 500;
    font-size: 32rpx;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
