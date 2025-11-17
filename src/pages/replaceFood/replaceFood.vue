<template>
  <view class="replace-food-page">
    <view class="page-title">
      <text>更换食物</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="food-list-wrap">
      <view class="tip"
        >以下是为你推荐可替换<text>{{ name }}</text
        >的食物</view
      >

      <view class="food-list">
        <view class="food-item" v-for="item of recommendFoods" :key="item.id">
          <image mode="widthFix" :src="item.img_path" />
          <view class="info">
            <text>{{ item.name }}</text>
            <text>{{ item.weight }}克/{{ item.calorie }}千卡</text>
          </view>
          <view class="replace" @click="replaceFood(item)">替换</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import $http from '@/utils/http';

export default {
  name: 'replaceFood',

  data() {
    return {
      name: '',
      id: undefined,
      recommendFoods: [],
    };
  },

  onLoad(options) {
    this.name = decodeURIComponent(options.name);
    this.id = options.id;

    this.getRecommendFoods();
  },

  methods: {
    getRecommendFoods() {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http
        .post('api/diet-info/recipes_template', {
          pageIndex: 1,
          pageSize: 9999,
          id: this.id,
        })
        .then((res) => {
          uni.hideLoading();
          this.recommendFoods = res.data.Items;
        });
    },

    replaceFood(item) {
      uni.showModal({
        title: '温馨提示',
        content: '确认选择该食物进行替换吗？',
        success: (res) => {
          if (res.confirm) {
            $http
              .post('api/diet-info/update_plan_recipes', {
                id: this.id,
                template_id: item.id,
                img_path: item.img_path,
                name: item.name,
                weight: item.weight,
                calorie: item.calorie,
                food_category: item.food_category,
                protein: item.protein,
                fat: item.fat,
                carbs: item.carbs,
              })
              .then(() => {
                uni.showToast({
                  title: '替换成功',
                  icon: 'none',
                });

                setTimeout(() => {
                  this.$toBack();
                }, 1500);
              });
          }
        },
      });
    },
  },
};
</script>

<style lang="scss">
page {
  background: #f6f7fb;
}
</style>

<style scoped lang="scss">
.replace-food-page {
  .page-title {
    background: #ffffff;
  }

  .banner {
    background: #ffffff;
    padding: calc(var(--page-title-height)) 0 0;
  }

  .food-list-wrap {
    padding: 18rpx 30rpx 80rpx;

    .tip {
      font-size: 28rpx;
      color: #bfbfbf;
      margin-bottom: 18rpx;

      text {
        color: #65d285;
      }
    }

    .food-list {
      display: flex;
      flex-direction: column;
      gap: 20rpx;

      .food-item {
        padding: 10rpx;
        background: #ffffff;
        border-radius: 20rpx;
        display: flex;
        align-items: center;

        image {
          width: 100rpx;
          border-radius: 20rpx;
          margin-right: 18rpx;
        }

        .info {
          display: flex;
          flex-direction: column;
          gap: 24rpx;
          flex-grow: 1;

          text {
            &:nth-child(1) {
              font-size: 28rpx;
              color: #1a1a1a;
            }

            &:nth-child(2) {
              font-size: 24rpx;
              color: #999999;
            }
          }
        }

        .replace {
          width: 148rpx;
          height: 60rpx;
          border-radius: 30rpx;
          border: 2rpx solid #65d285;
          font-weight: 500;
          font-size: 26rpx;
          color: #65d285;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
