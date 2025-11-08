<template>
  <view class="food-recode-page">
    <view class="page-title">
      <!-- TODO 选择日期 -->
      <text>10月23日</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="date">
      <calendar2 ref="calendar2" @selectDayChange="selectDayChange" />
    </view>

    <view class="container">
      <view class="manage">
        <view class="chart-box">
          <view class="left">
            <view class="name">食物摄入</view>
            <view class="value">{{ dailyCalorie.calorie_intake || 0 }}</view>
          </view>

          <view class="chart">
            <l-echart ref="chartRef" @finished="initChart" />

            <view class="chart-date">
              <text>还可以吃</text>
              <text>{{ canEatCalorie }}</text>
              <text
                >建议{{
                  Number((dailyCalorie.calorie_requirement + dailyCalorie.calorie_burn).toFixed(2)) || 0
                }}千卡</text
              >
            </view>
          </view>

          <view class="right">
            <view class="name">运动消耗</view>
            <view class="value">{{ dailyCalorie.calorie_burn || 0 }}</view>
          </view>
        </view>

        <view class="calorie-type">
          <view class="calorie-item">
            <view class="name">碳水</view>
            <view class="value"
              >{{ dailyCalorie.carbohydrate_intake || 0 }}克/{{ dailyCalorie.carbohydrate_requirement || 0 }}克</view
            >
            <view class="progress" style="background: #eae9ef">
              <text style="background: #35d16e" :style="{ width: dailyCalorie.remainingARatio + '%' }"></text>
            </view>
          </view>

          <view class="calorie-item">
            <view class="name">蛋白质</view>
            <view class="value"
              >{{ dailyCalorie.protein_intake || 0 }}克/{{ dailyCalorie.protein_requirement || 0 }}克</view
            >
            <view class="progress" style="background: #eae9ef">
              <text style="background: #35d16e" :style="{ width: dailyCalorie.remainingBRatio + '%' }"></text>
            </view>
          </view>

          <view class="calorie-item">
            <view class="name">脂肪</view>
            <view class="value">{{ dailyCalorie.fat_intake || 0 }}克/{{ dailyCalorie.fat_requirement || 0 }}克</view>
            <view class="progress" style="background: #eae9ef">
              <text style="background: #35d16e" :style="{ width: dailyCalorie.remainingCRatio + '%' }"></text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <add-food-recode-dialog
      ref="addFoodRecodeDialog"
      :type="type"
      @addRecode="addRecode"
      @addImageRecode="addImageRecode"
    />
    <add-motion-recode-dialog ref="addMotionRecodeDialog" @addRecode="addMotionRecode" />

    <custom-tab-bar />
  </view>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import * as echarts from '@/uni_modules/lime-echart/static/echarts.min';
import { verifyIsLogin } from '@/utils';
import $http from '@/utils/http';
import AddMotionRecodeDialog from '@/components/addMotionRecodeDialog.vue';
import AddFoodRecodeDialog from '@/components/addFoodRecodeDialog.vue';
import Calendar2 from '@/components/calendar2.vue';

let chart = null;

export default {
  name: 'foodRecodePage',

  components: {
    Calendar2,
    AddFoodRecodeDialog,
    AddMotionRecodeDialog,
  },

  data() {
    return {
      dateList: {},
      selectDate: {},
      dailyCalorie: {},
      foodRecodeList: [
        {
          type: 1,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/todayRecode/food-icon1.png',
          text: '早餐',
          foodList: [],
        },

        {
          type: 3,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/todayRecode/food-icon3.png',
          text: '午餐',
          foodList: [],
        },

        {
          type: 5,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/todayRecode/food-icon5.png',
          text: '晚餐',
          foodList: [],
        },
        // {
        //   type: 2,
        //   icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-icon1.png',
        //   text: '早加餐',
        //   foodList: [],
        // },
        {
          type: 4,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/todayRecode/food-icon4.png',
          text: '午加餐',
          foodList: [],
        },
        {
          type: 6,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/todayRecode/food-icon6.png',
          text: '晚加餐',
          foodList: [],
        },
      ],
      motionRecodeList: [],
      selectRecodeItem: {},
      modify: false,
      exercisesPlanData: [],
      selectDateKey: null,
      type: 0,
      option: {
        series: [
          {
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            min: 0,
            max: 100,
            splitNumber: 12,
            itemStyle: {
              color: '#0ABF92',
              shadowColor: 'transparent',
              shadowBlur: 4,
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
            progress: {
              show: true,
              roundCap: true,
              width: 8,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 8,
                color: [[1, '#F6F7FB']],
              },
            },
            radius: '100%',
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            title: {
              show: false,
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 0,
              },
            ],
          },
        ],
      },
    };
  },

  computed: {
    ...mapState('app', ['userDetailInfo']),
    ...mapGetters('app', ['isLogin', 'isVip']),

    updateTime() {
      if (this.userDetailInfo) {
        let date = new Date().format().slice(0, 10);
        let day =
          new Date(date + ' 23:59:59').getTime() -
          new Date(this.userDetailInfo.weight_recode_date.replace(/-/g, '/')).getTime();
        return Math.ceil(day / (24 * 60 * 60 * 1000));
      }

      return undefined;
    },

    motionTotalCalorie() {
      let total = 0;

      this.motionRecodeList.forEach((item) => {
        total += item.calorie;
      });

      return total;
    },

    isToday() {
      return this.selectDate.numberDay === new Date().getDay();
    },

    canEatCalorie() {
      let number =
        this.dailyCalorie.calorie_requirement + this.dailyCalorie.calorie_burn - this.dailyCalorie.calorie_intake;

      if (number < 0) {
        return 0;
      }

      return Number(number.toFixed(2));
    },

    currentFoodData() {
      return (foodList, type) => {
        let allCalorie = 0;

        Object.keys(this.dateList[this.selectDateKey]).forEach((key) => {
          this.dateList[this.selectDateKey][key].forEach((item) => {
            allCalorie += item.calorie;
          });
        });

        let typeName = '';
        let currentCalorie = 0;

        if (type === '1') {
          typeName = '早餐';
        } else if (type === '2') {
          typeName = '早加餐';
        } else if (type === '3') {
          typeName = '午餐';
        } else if (type === '4') {
          typeName = '午加餐';
        } else if (type === '5') {
          typeName = '晚餐';
        } else if (type === '6') {
          typeName = '晚加餐';
        }

        foodList.forEach((item) => {
          currentCalorie += item.calorie;
        });

        return {
          typeName,
          currentCalorie,
          ratio: Number(((currentCalorie / allCalorie) * 100).toFixed(2)),
        };
      };
    },
  },

  async onLoad() {
    this.selectDate = {
      currentDate: new Date(),
      numberDay: new Date().getDay(),
    };
  },

  onShow() {
    this._getUserDetailInfo();
    this.getDailyFoods();
    this.getDailyCalorie();
    this.getLastPlanData();

    let showAddFoodDialog = uni.getStorageSync('showAddFoodDialog');

    if (showAddFoodDialog) {
      uni.removeStorageSync('showAddFoodDialog');
      this.$refs.addFoodRecodeDialog.open();
    }
  },

  watch: {
    async selectDate() {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      await this.getDailyFoods().catch(() => {});
      await this.getDailyCalorie().catch(() => {});

      uni.hideLoading();
    },
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/share-img.png',
      path: '/pages/index/index',
    };
  },

  methods: {
    ...mapActions('app', ['_getUserDetailInfo']),

    /**
     * 初始化进度条图表数据
     */
    async initChart() {
      // chart 图表实例不能存在data里
      chart = await this.$refs.chartRef.init(echarts);
      chart.setOption(this.option);
    },

    selectDayChange(value) {
      this.selectDate = {
        currentDate: new Date(value),
        numberDay: new Date(value).getDay(),
      };
    },

    getLastPlanData() {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http
        .get(
          'api/diet-info/weight-plan/last',
          {},
          {
            hiddenErrorMessage: true,
          },
        )
        .then((res) => {
          res.data.recipes_list = res.data.recipes_list.filter(
            (item) => item.type === 1 || item.type === 3 || item.type === 5,
          );
          let dateList = {};

          res.data.recipes_list.forEach((item) => {
            let date = item.date;

            if (dateList[date]) {
              dateList[date].push(item);
            } else {
              dateList[date] = [item];
            }
          });

          Object.keys(dateList).forEach((dateListKey, index) => {
            let foodList = {};
            let item = dateList[dateListKey];

            item.forEach((item) => {
              let type = item.type;

              if (foodList[type]) {
                foodList[type].push(item);
              } else {
                foodList[type] = [item];
              }
            });

            if (index === 0) {
              this.selectDateKey = dateListKey;
            }

            dateList[dateListKey] = foodList;
          });

          this.dateList = dateList;
        })
        .catch(() => {
          this.dateList = [];
        })
        .finally(() => {
          uni.hideLoading();
        });
    },

    getDailyFoods() {
      return $http
        .post('api/diet-info/daily-list', {
          date: this.selectDate.currentDate.format(),
        })
        .then((res) => {
          this.foodRecodeList.forEach((item) => {
            let current = res.data.find((item1) => item1.type === item.type);

            item.foodList = (current && current.die_list) || [];

            let totalCalorie = 0;

            item.foodList.forEach((item2) => {
              totalCalorie += item2.calorie;
            });

            item.totalCalorie = Number(totalCalorie.toFixed(2));

            if (item.type === this.selectRecodeItem.type) {
              this.selectRecodeItem = item;
            }
          });

          let motionItem = res.data.find((item1) => item1.type === 7);

          this.motionRecodeList = (motionItem && motionItem.die_list) || [];
        });
    },

    getDailyCalorie() {
      return $http
        .post(
          'api/diet-info/daily-calorie',
          {
            date: this.selectDate.currentDate.format(),
          },
          {
            hiddenErrorMessage: true,
          },
        )
        .then((res) => {
          res.data.carbohydrate_ratio = Math.round(res.data.carbohydrate_ratio * 100);
          res.data.protein_ratio = Math.round(res.data.protein_ratio * 100);
          res.data.fat_ratio = Math.round(res.data.fat_ratio * 100);

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

    onRateChanging(event, filed) {
      this.dailyCalorie[filed] = event.detail.value;

      // 保持总比例为100%
      if (filed === 'carbohydrate_ratio') {
        if (Number(this.dailyCalorie.protein_ratio)) {
          this.dailyCalorie.protein_ratio =
            100 - Number(this.dailyCalorie.carbohydrate_ratio) - Number(this.dailyCalorie.fat_ratio);
        } else {
          this.dailyCalorie.fat_ratio =
            100 - Number(this.dailyCalorie.carbohydrate_ratio) - Number(this.dailyCalorie.protein_ratio);
        }
      } else if (filed === 'protein_ratio') {
        if (Number(this.dailyCalorie.fat_ratio)) {
          this.dailyCalorie.fat_ratio =
            100 - Number(this.dailyCalorie.carbohydrate_ratio) - Number(this.dailyCalorie.protein_ratio);
        } else {
          this.dailyCalorie.carbohydrate_ratio =
            100 - Number(this.dailyCalorie.protein_ratio) - Number(this.dailyCalorie.fat_ratio);
        }
      } else if (filed === 'fat_ratio') {
        if (Number(this.dailyCalorie.carbohydrate_ratio)) {
          this.dailyCalorie.carbohydrate_ratio =
            100 - Number(this.dailyCalorie.protein_ratio) - Number(this.dailyCalorie.fat_ratio);
        } else {
          this.dailyCalorie.protein_ratio =
            100 - Number(this.dailyCalorie.carbohydrate_ratio) - Number(this.dailyCalorie.fat_ratio);
        }
      }
    },

    modifyRatio() {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http
        .post('api/diet-info/macronutrient/update', {
          carbs_ratio: Number((this.dailyCalorie.carbohydrate_ratio / 100).toFixed(2)),
          protein_ratio: Number((this.dailyCalorie.protein_ratio / 100).toFixed(2)),
          fat_ratio: Number((this.dailyCalorie.fat_ratio / 100).toFixed(2)),
        })
        .then(() => {
          uni.hideLoading();

          uni.showToast({
            title: '修改成功',
            icon: 'none',
          });

          this.getDailyFoods();
          this.getDailyCalorie();
        });
    },

    goWeightData() {
      if (!this.userDetailInfo) {
        verifyIsLogin();

        this.$toRouter('/pages/evaluation/evaluation');
      } else {
        this.$toRouter('/pages/weightData/weightData');
      }
    },

    showAddMotionRecodeDialog() {
      if (!this.userDetailInfo) {
        verifyIsLogin();

        this.$toRouter('/pages/evaluation/evaluation');
      } else {
        this.$refs.addMotionRecodeDialog.open();
      }
    },

    showAddFoodRecodeDialog(item) {
      if (!this.userDetailInfo) {
        verifyIsLogin();

        this.$toRouter('/pages/evaluation/evaluation');
      } else {
        this.type = item.type;

        setTimeout(() => {
          this.$refs.addFoodRecodeDialog.open();
        }, 0);
      }
    },

    previewFoodList(item) {
      if (!this.userDetailInfo) {
        verifyIsLogin();

        this.$toRouter('/pages/evaluation/evaluation');
      } else {
        if (item.foodList.length > 0) {
          this.$toRouter(
            '/pages/foodAnalysis/foodAnalysis',
            `type=${item.type}&time=${this.selectDate.currentDate.format()}`,
          );
        } else {
          uni.showToast({
            title: '暂无记录，请先添加',
            icon: 'none',
          });
        }
      }
    },

    addRecode(event) {
      this.$refs.addFoodRecodeDialog.close();

      this.$toRouter(
        '/pages/dietaryRecord/dietaryRecord',
        `text=${encodeURIComponent(event.text)}&type=${event.type}&input_type=${
          event.input_type
        }&date_time=${this.selectDate.currentDate.format()}`,
      );
    },

    addImageRecode(event) {
      this.$refs.addFoodRecodeDialog.close();

      this.$toRouter(
        '/pages/dietaryRecord/dietaryRecord',
        `text=&url=${encodeURIComponent(event.url)}&type=${event.type}&input_type=${
          event.input_type
        }&date_time=${this.selectDate.currentDate.format()}`,
      );
    },

    addMotionRecode(event) {
      this.$refs.addMotionRecodeDialog.close();

      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http
        .post(
          'api/diet-info/exercise-analysis',
          {
            text: event.text,
            input_type: event.input_type,
            type: event.type,
            date_time: new Date().format(),
          },
          {
            timeout: 90000,
          },
        )
        .then((res) => {
          if (res.data && !res.data.length) {
            uni.hideLoading();

            uni.showModal({
              title: '温馨提示',
              content: '未检出到运动项目，请重新输入',
              showCancel: false,
              success: (res) => {
                if (res.confirm) {
                  this.$toBack();
                }
              },
            });

            return;
          }

          $http
            .post(
              'api/diet-info/create-batch',
              {
                food_batch: res.data,
              },
              {
                timeout: 90000,
              },
            )
            .then(() => {
              uni.hideLoading();

              uni.showToast({
                title: '添加成功',
                icon: 'none',
              });

              this.getDailyFoods();
              this.getDailyCalorie();
            });
        });
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
.food-recode-page {
  height: 100%;
  overflow: auto;
  background: #f6f7fb linear-gradient(180deg, #e9f4ee 0%, #f2f6f7 73%) left top/100% 400rpx no-repeat;

  .page-title {
  }

  .banner {
    padding: calc(var(--page-title-height) + 44rpx) 0 0;
  }

  .date {
    padding: 0 25rpx;
    margin-bottom: 40rpx;
    position: relative;
  }

  .container {
    padding: 0 30rpx 35rpx;

    .manage {
      background: #ffffff;
      border-radius: 30rpx;
      padding: 26rpx 50rpx;
      margin-bottom: 43rpx;

      .chart-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 23rpx;
        position: relative;
        margin-bottom: 44rpx;

        .left,
        .right {
          display: flex;
          flex-direction: column;
          gap: 20rpx;

          &.right {
            .value {
              color: #35d16e;
            }
          }

          .name {
            font-size: 25rpx;
            color: #000000;
          }

          .value {
            font-weight: 500;
            font-size: 40rpx;
            color: #f15852;
          }
        }

        .chart {
          width: 230rpx;
          height: 230rpx;
          position: relative;

          .chart-date {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 16rpx;

            text {
              &:nth-child(1) {
                font-size: 21rpx;
                color: #838383;
              }

              &:nth-child(2) {
                font-weight: 500;
                font-size: 47rpx;
                color: #000000;
              }

              &:nth-child(3) {
                font-size: 21rpx;
                color: #838383;
              }
            }
          }
        }
      }

      .calorie-type {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .calorie-item {
          display: flex;
          flex-direction: column;

          .name {
            font-size: 24rpx;
            color: #494949;
            margin-bottom: 20rpx;
          }

          .value {
            font-size: 24rpx;
            color: #838383;
            margin-bottom: 10rpx;
          }

          .progress {
            width: 173rpx;
            height: 10rpx;
            border-radius: 5rpx;
            position: relative;

            text {
              position: absolute;
              left: 0;
              top: 0;
              height: 100%;
              border-radius: 5rpx;
            }
          }
        }
      }
    }
  }
}

.login {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #aaaaaa;
}

.empty-recode {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  color: #aaaaaa;
  padding: 30rpx 0;
}
</style>
