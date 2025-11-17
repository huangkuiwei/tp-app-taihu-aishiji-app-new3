<template>
  <view class="recipe-plan-page">
    <view class="date">
      <calendar2 ref="calendar2" title="食谱计划" @selectDayChange="selectDayChange" />
    </view>

    <view class="container">
      <view class="chart-box">
        <view class="title">
          <text>饮食方案</text>
          <text>{{ dailyCalorie.calorie_requirement || 0 }}千卡</text>
        </view>

        <view class="detail">
          <view class="chart">
            <l-echart ref="chartRef" @finished="init" />
            <view class="number">
              <text>{{ dailyCalorie.calorie_requirement || 0 }}</text>
              <text>千卡</text>
            </view>
          </view>

          <view class="component">
            <view class="item">
              <text></text>
              <text>碳水化合物</text>
              <text>{{ dailyCalorie.carbohydrate_ratio * 100 || 0 }}%</text>
              <text>{{ dailyCalorie.carbohydrate_requirement || 0 }}克</text>
            </view>

            <view class="item">
              <text></text>
              <text>蛋白质</text>
              <text>{{ dailyCalorie.protein_ratio * 100 || 0 }}%</text>
              <text>{{ dailyCalorie.protein_requirement || 0 }}克</text>
            </view>

            <view class="item">
              <text></text>
              <text>脂肪</text>
              <text>{{ dailyCalorie.fat_ratio * 100 || 0 }}%</text>
              <text>{{ dailyCalorie.fat_requirement || 0 }}克</text>
            </view>
          </view>
        </view>
      </view>

      <view class="food-type-list">
        <view class="food-type-item" v-for="item of recodeList.filter((x) => x.foodList.length)" :key="item.type">
          <view class="food-type-title">
            <view class="title">{{ item.text }}</view>
            <view class="time">{{ item.time }}</view>
            <view class="calorie">{{ item.totalCalorie }}/{{ item.eatTotalCalorie }}千卡</view>
          </view>

          <view class="food-list">
            <view class="food-item" v-for="item1 of item.foodList" :key="item1.id">
              <image mode="widthFix" :src="item1.img_path" />
              <view class="info">
                <text>{{ item1.name }}</text>
                <text>{{ item1.weight }}克/{{ item1.calorie }}千卡</text>
              </view>
              <view
                class="replace"
                @click="replaceFood(item1)"
                v-if="selectDate.currentDate && selectDate.currentDate.format().slice(0, 10) === nowDate"
              >
                更换
              </view>
            </view>
          </view>

          <view class="number">营养指数：{{ item.totalNourishment }}%</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import * as echarts from '@/uni_modules/lime-echart/static/echarts.min';
import Calendar2 from '@/components/calendar2.vue';
import $http from '@/utils/http';

let chart = null;

export default {
  name: 'recipePlan',

  data() {
    return {
      selectDate: {},
      dailyCalorie: {},
      option: {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          show: false,
        },
        color: ['#BEF054', '#FE5B1F', '#FFB66E'],
        series: [
          {
            type: 'pie',
            radius: ['100%', '90%'],
            label: {
              show: false,
            },
            emphasis: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: [],
          },
        ],
      },
      recodeList: [
        {
          type: 1,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-icon1.png',
          text: '早餐',
          time: '07:00-09:00',
          foodList: [],
          totalCalorie: 0,
          eatTotalCalorie: 0,
          totalNourishment: 0,
        },
        {
          type: 2,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-icon1.png',
          text: '早加餐',
          time: '09:00-11:00',
          foodList: [],
          totalCalorie: 0,
          eatTotalCalorie: 0,
          totalNourishment: 0,
        },
        {
          type: 3,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-icon2.png',
          text: '午餐',
          time: '11:00-13:00',
          foodList: [],
          totalCalorie: 0,
          eatTotalCalorie: 0,
          totalNourishment: 0,
        },
        {
          type: 4,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-icon2.png',
          text: '午加餐',
          time: '15:00-17:00',
          foodList: [],
          totalCalorie: 0,
          eatTotalCalorie: 0,
          totalNourishment: 0,
        },
        {
          type: 5,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-icon3.png',
          text: '晚餐',
          time: '17:00-19:00',
          foodList: [],
          totalCalorie: 0,
          eatTotalCalorie: 0,
          totalNourishment: 0,
        },
        {
          type: 6,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-icon3.png',
          text: '晚加餐',
          time: '19:00-20:00',
          foodList: [],
          totalCalorie: 0,
          eatTotalCalorie: 0,
          totalNourishment: 0,
        },
      ],
      plan_id: undefined,
      nowDate: new Date().format().slice(0, 10),
    };
  },

  components: {
    Calendar2,
  },

  onLoad(options) {
    this.plan_id = options.plan_id;
    this.getDailyCalorie();
  },

  onShow() {
    if (this.$refs.calendar2.selectedDate) {
      this.getDailyFoods(this.$refs.calendar2.selectedDate);
      this.getFoodListByTime(this.$refs.calendar2.selectedDate);
    }
  },

  watch: {
    selectDate() {
      if (this.$refs.calendar2.selectedDate) {
        this.getDailyFoods(this.$refs.calendar2.selectedDate);
        this.getFoodListByTime(this.$refs.calendar2.selectedDate);
      }
    },
  },

  methods: {
    async init() {
      chart = await this.$refs.chartRef.init(echarts);
      chart.setOption(this.option);
    },

    getDailyCalorie() {
      return $http
        .post(
          'api/diet-info/daily-calorie',
          {
            date: new Date().format(),
          },
          {
            hiddenErrorMessage: true,
          },
        )
        .then((res) => {
          // 卡路里总量、剩余量和比例计算
          let total = res.data.calorie_requirement + res.data.calorie_burn;
          let remaining = total - res.data.calorie_intake;
          let ratio = Number(((remaining / total) * 100).toFixed(2));

          if (ratio > 100) {
            ratio = 100;
          } else if (ratio < 0) {
            ratio = 0;
          }

          res.data.ratio = ratio;
          res.data.remaining = remaining < 0 ? 0 : Number(remaining.toFixed(2));

          // 碳水、蛋白质、脂肪剩余量和比例计算
          res.data.remainingA = Number((res.data.carbohydrate_requirement - res.data.carbohydrate_intake).toFixed(2));
          res.data.remainingB = Number((res.data.protein_requirement - res.data.protein_intake).toFixed(2));
          res.data.remainingC = Number((res.data.fat_requirement - res.data.fat_intake).toFixed(2));

          if (res.data.remainingA < 0) {
            res.data.remainingA = 0;
          }

          if (res.data.remainingB < 0) {
            res.data.remainingB = 0;
          }

          if (res.data.remainingC < 0) {
            res.data.remainingC = 0;
          }

          res.data.remainingARatio = (res.data.carbohydrate_intake / res.data.carbohydrate_requirement) * 100;
          res.data.remainingBRatio = (res.data.protein_intake / res.data.protein_requirement) * 100;
          res.data.remainingCRatio = (res.data.fat_intake / res.data.fat_requirement) * 100;

          if (res.data.remainingARatio > 100) {
            res.data.remainingARatio = 100;
          }

          if (res.data.remainingBRatio > 100) {
            res.data.remainingBRatio = 100;
          }

          if (res.data.remainingCRatio > 100) {
            res.data.remainingCRatio = 100;
          }

          this.dailyCalorie = res.data;

          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.option.series[0].data = [
            { name: '', value: res.data.carbohydrate_ratio },
            { name: '', value: res.data.protein_ratio },
            { name: '', value: res.data.fat_ratio },
          ];

          // eslint-disable-next-line vue/no-async-in-computed-properties
          setTimeout(() => {
            chart && chart.setOption(this.option);
            this.$refs.chartRef.resize({ width: 80, height: 80 });
          }, 500);
        })
        .catch((err) => {
          if (err.Msg === '未找到健康档案，请先完成健康评估') {
            this.dailyCalorie = {};
          } else {
            if (err.Code !== -100) {
              uni.showToast({
                title: err.Msg,
                icon: 'none',
                mask: true,
              });
            }
          }
        });
    },

    getDailyFoods(time) {
      return $http
        .post('api/diet-info/daily-list', {
          date: time,
        })
        .then((res) => {
          this.recodeList.forEach((item) => {
            let current = res.data.find((item1) => item1.type === item.type);
            let die_list = (current && current.die_list) || [];

            if (die_list.length) {
              let eatTotalCalorie = 0;

              die_list.forEach((x) => {
                eatTotalCalorie += x.calorie;
              });

              item.eatTotalCalorie = eatTotalCalorie;
            } else {
              item.eatTotalCalorie = 0;
            }
          });
        });
    },

    getFoodListByTime(time) {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http
        .post('api/diet-info/plan_recipes', {
          date_time: time,
          plan_id: this.plan_id,
        })
        .then((res) => {
          uni.hideLoading();
          let typeList = {};

          res.data.recipes_list.forEach((item) => {
            let type = item.type;

            if (typeList[type]) {
              typeList[type].push(item);
            } else {
              typeList[type] = [item];
            }
          });

          Object.keys(typeList).forEach((key) => {
            let cur = this.recodeList.find((item) => Number(item.type) === Number(key));

            if (cur) {
              let totalCalorie = 0;
              let totalNourishment = 0;

              typeList[key].forEach((x) => {
                totalCalorie += x.calorie;
                totalNourishment += x.nourishment_index;
              });

              cur.foodList = typeList[key];
              cur.totalCalorie = totalCalorie.toFixed(0);
              cur.totalNourishment = (totalNourishment / typeList[key].length).toFixed(0);
            }
          });
        });
    },

    selectDayChange(value) {
      this.selectDate = {
        currentDate: new Date(value),
        numberDay: new Date(value).getDay(),
      };
    },

    replaceFood(item) {
      this.$toRouter(`/pages/replaceFood/replaceFood?name=${item.name}&id=${item.id}`);
    },
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
}
</style>

<style scoped lang="scss">
.recipe-plan-page {
  height: 100%;
  overflow: auto;
  background: #f6f7fb linear-gradient(180deg, #e9f4ee 0%, #f2f6f7 73%) left top/100% 400rpx no-repeat;

  .date {
    padding: 0 25rpx;
    margin-bottom: 40rpx;
    position: relative;
  }

  .container {
    padding: 0 30rpx 80rpx;
    margin-bottom: 30rpx;

    .chart-box {
      background: #ffffff;
      border-radius: 30rpx;
      padding: 32rpx 25rpx;
      margin-bottom: 30rpx;

      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: 500;
        font-size: 28rpx;
        color: #1a1a1a;
        margin-bottom: 59rpx;
      }

      .detail {
        display: flex;
        align-items: center;

        .chart {
          width: 160rpx;
          height: 160rpx;
          margin-right: 56rpx;
          position: relative;

          .number {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 18rpx;

            text {
              &:nth-child(1) {
                font-weight: 500;
                font-size: 34rpx;
                color: #111111;
              }

              &:nth-child(2) {
                font-size: 22rpx;
                color: #999999;
              }
            }
          }
        }

        .component {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 25rpx;

          .item {
            display: flex;
            align-items: center;

            &:nth-child(1) {
              text {
                &:nth-child(1) {
                  background: #bef054;
                }
              }
            }

            &:nth-child(2) {
              text {
                &:nth-child(1) {
                  background: #fe5b1f;
                }
              }
            }

            &:nth-child(3) {
              text {
                &:nth-child(1) {
                  background: #ffb66e;
                }
              }
            }

            text {
              font-size: 24rpx;
              color: #666666;

              &:nth-child(1) {
                width: 15rpx;
                height: 15rpx;
                border-radius: 2rpx;
                margin-right: 12rpx;
              }

              &:nth-child(2) {
                width: 46%;
              }

              &:nth-child(3) {
                flex-grow: 1;
              }
            }
          }
        }
      }
    }

    .food-type-list {
      display: flex;
      flex-direction: column;
      gap: 30rpx;

      .food-type-item {
        border-radius: 30rpx;
        padding: 30rpx;

        &:nth-child(1) {
          background: #fffae7;
        }

        &:nth-child(2) {
          background: #feeeef;
        }

        &:nth-child(3) {
          background: #eeffef;
        }

        &:nth-child(4) {
          background: #feeeef;
        }

        &:nth-child(5) {
          background: #f3f1ff;
        }

        &:nth-child(6) {
          background: #feeeef;
        }

        .food-type-title {
          display: flex;
          align-items: center;
          margin-bottom: 33rpx;

          .title {
            font-weight: 500;
            font-size: 28rpx;
            color: #1a1a1a;
            margin-right: 21rpx;
          }

          .time {
            font-size: 24rpx;
            color: #1a1a1a;
            flex-grow: 1;
          }

          .calorie {
            font-size: 28rpx;
            color: #1a1a1a;
          }
        }
      }

      .food-list {
        display: flex;
        flex-direction: column;
        gap: 20rpx;
        margin-bottom: 40rpx;

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

      .number {
        font-size: 28rpx;
        color: #1a1a1a;
      }
    }
  }
}
</style>
