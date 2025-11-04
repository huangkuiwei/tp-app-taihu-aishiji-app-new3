<template>
  <uni-popup ref="updateBirthDialog">
    <view class="update-birth-dialog">
      <view class="title">选择你的出生年月</view>

      <view class="list">
        <picker-view
          indicator-style="height: 40px;"
          style="width: 100%; height: 120px"
          :value="value"
          @change="value = $event.detail.value"
        >
          <picker-view-column>
            <view
              class="item"
              :class="{
                active: value[0] === index,
              }"
              v-for="(item, index) in years"
              :key="index"
            >
              <text class="value">{{ item }}</text>
            </view>
          </picker-view-column>

          <picker-view-column>
            <view
              class="item"
              :class="{
                active: value[1] === index,
              }"
              v-for="(item, index) in months"
              :key="index"
            >
              <text class="value">{{ item }}</text>
            </view>
          </picker-view-column>
        </picker-view>
      </view>

      <view class="options">
        <text @click="close">取消</text>
        <text @click="submit">确定</text>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: 'updateBirthDialog',

  data() {
    const years = [];
    const months = [];

    for (let i = 1925; i < 2025; i++) {
      years.push(String(i));
    }

    for (let i = 1; i <= 12; i++) {
      months.push(i < 10 ? '0' + i : String(i));
    }

    return {
      localUserDetailInfo: {},
      years,
      months,
      value: [0, 0],
    };
  },

  props: {
    userDetailInfo: {
      type: Object,
      default: () => ({}),
    },
  },

  methods: {
    open() {
      this.localUserDetailInfo = JSON.parse(JSON.stringify(this.userDetailInfo));
      let year = this.localUserDetailInfo.birth_year.slice(0, 4);
      let month = this.localUserDetailInfo.birth_year.slice(-2);

      let index1 = this.years.findIndex((item) => item === year);
      let index2 = this.months.findIndex((item) => item === month);

      if (index1 > -1 && index2 > -1) {
        this.value = [index1, index2];
      }

      this.$refs.updateBirthDialog.open();
    },

    close() {
      this.$refs.updateBirthDialog.close();
    },

    submit() {
      let birth_year = this.years[this.value[0]] + '/' + this.months[this.value[1]];

      Object.assign(this.localUserDetailInfo, {
        birth_year: birth_year,
      });

      this.$emit('submit', this.localUserDetailInfo);
      this.close();
    },
  },
};
</script>

<style scoped lang="scss">
.update-birth-dialog {
  width: 690rpx;
  background: #ffffff;
  border-radius: 30rpx;

  .title {
    padding: 39rpx 0 53rpx;
    text-align: center;
    font-weight: 500;
    font-size: 30rpx;
    color: #000000;
  }

  .list {
    picker-view {
      margin-bottom: 52rpx;

      picker-view-column {
        .item {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;

          &.active {
            .value {
              color: #111111;
            }
          }

          .value {
            font-weight: 500;
            font-size: 28rpx;
            color: #999999;
          }
        }
      }
    }
  }

  .options {
    display: flex;
    align-items: center;
    border-top: 2rpx solid #e6e6e6;

    text {
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 36rpx;
      font-weight: 500;
      font-size: 28rpx;

      &:nth-child(1) {
        border-right: 2rpx solid #e6e6e6;
        color: #999999;
      }

      &:nth-child(2) {
        color: #111111;
      }
    }
  }
}
</style>
