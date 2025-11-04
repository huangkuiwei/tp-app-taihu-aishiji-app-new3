<template>
  <custom-dialog ref="recodeDialog" title="金豆明细" :shop-close="false">
    <view class="content">
      <view class="recode-list">
        <template v-if="recodeList.length">
          <view class="recode-item" v-for="(item, index) of recodeList" :key="index">
            <text>{{ item.change_reason }}{{ item.change_points }}</text>
            <text>{{ item.change_time.slice(0, 10) }}</text>
          </view>
        </template>

        <view class="empty-recode" v-else> 暂无记录 </view>
      </view>
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
  name: 'recodeDialog',

  components: {
    customDialog,
  },

  data() {
    return {
      recodeList: [],
    };
  },

  methods: {
    getRecodeList() {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http
        .post('api/lucky-bag/points-record', {
          pageIndex: 1,
          pageSize: 9999,
        })
        .then((res) => {
          uni.hideLoading();

          this.recodeList = res.data.Items;
        });
    },

    open() {
      this.getRecodeList();
      this.$refs.recodeDialog.open();
    },

    close() {
      this.$refs.recodeDialog.close();
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

    .empty-recode {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      color: #aaaaaa;
      padding: 30rpx 0;
    }

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
