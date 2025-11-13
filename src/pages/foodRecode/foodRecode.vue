<template>
  <view class="food-recode-page">
    <view class="date">
      <calendar2 ref="calendar2" @selectDayChange="selectDayChange" />
    </view>

    <view class="container">
      <view class="manage">
        <view class="chart-box">
          <view class="left">
            <view class="name">食物摄入</view>
            <view class="value">{{ dailyCalorie.calorie_intake || 0 }}</view>
            <view class="unit">千卡</view>
          </view>

          <view class="chart">
            <l-echart ref="chartRef" @finished="initChart" />

            <view class="chart-date">
              <text>还可以吃</text>
              <text>{{ canEatCalorie }}</text>
              <text
                >推荐{{
                  Number((dailyCalorie.calorie_requirement + dailyCalorie.calorie_burn).toFixed(2)) || 0
                }}千卡</text
              >
            </view>
          </view>

          <view class="right">
            <view class="name">运动消耗</view>
            <view class="value">{{ dailyCalorie.calorie_burn || 0 }}</view>
            <view class="unit">千卡</view>
          </view>
        </view>

        <view class="calorie-type">
          <view class="calorie-item">
            <view class="name">脂肪</view>
            <view class="progress" style="background: #e6e6e6">
              <text style="background: #fdcd00" :style="{ width: dailyCalorie.remainingCRatio + '%' }"></text>
            </view>
            <view class="value" v-if="dailyCalorie.fat_requirement">
              <text>{{ dailyCalorie.fat_intake }}/</text>
              <text>{{ dailyCalorie.fat_requirement }}克</text>
            </view>
            <view class="value" v-else>暂无</view>
          </view>

          <view class="calorie-item">
            <view class="name">碳水</view>
            <view class="progress" style="background: #e6e6e6">
              <text style="background: #5664e5" :style="{ width: dailyCalorie.remainingARatio + '%' }"></text>
            </view>
            <view class="value" v-if="dailyCalorie.carbohydrate_requirement">
              <text>{{ dailyCalorie.carbohydrate_intake }}/</text>
              <text>{{ dailyCalorie.carbohydrate_requirement }}克</text>
            </view>
            <view class="value" v-else>暂无</view>
          </view>

          <view class="calorie-item">
            <view class="name">蛋白质</view>
            <view class="progress" style="background: #e6e6e6">
              <text style="background: #fd6896" :style="{ width: dailyCalorie.remainingBRatio + '%' }"></text>
            </view>
            <view class="value" v-if="dailyCalorie.protein_requirement">
              <text>{{ dailyCalorie.protein_intake }}/</text>
              <text>{{ dailyCalorie.protein_requirement }}克</text>
            </view>
            <view class="value" v-else>暂无</view>
          </view>
        </view>
      </view>

      <view class="recode">
        <view class="tabs">
          <text :class="{ active: recodeType === 1 }" @click="recodeType = 1">饮食记录</text>
          <text :class="{ active: recodeType === 2 }" @click="recodeType = 2">运动记录</text>
        </view>

        <view class="recode-detail">
          <view class="empty-recode" v-if="showEmptyRecode">
            <image
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/foodRecode/empty-icon.png"
            />
            <view class="tip1">您还没有{{ recodeType === 1 ? '饮食' : '运动' }}记录</view>
            <view class="tip2">点击下方<text>按钮</text>开始添加吧</view>
          </view>

          <template v-else>
            <view class="food-type-list" v-if="recodeType === 1">
              <view
                class="food-type-item"
                v-for="item of foodRecodeList.filter((x) => x.foodList.length)"
                :key="item.type"
                @click="previewFoodList(item)"
              >
                <view class="food-type-name">
                  <text class="name">{{ item.text }}</text>

                  <view class="calorie">
                    <text>{{ item.totalCalorie }}</text>
                    <text>/{{ suggestCalorie(item.type) }}卡</text>
                  </view>
                </view>

                <view class="food-recode-list">
                  <view class="food-recode-item" v-for="item1 of item.foodList" :key="item1.id">
                    <image
                      mode="widthFix"
                      :src="
                        item1.img_path ||
                        'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/todayRecode/food-icon1.png'
                      "
                    />

                    <view class="info1">
                      <text>{{ item1.name }}</text>
                      <!-- TODO 重量？ -->
                      <text>{{ item1.weight }}</text>
                    </view>

                    <view class="info2">{{ item1.calorie }}千卡 ></view>
                  </view>
                </view>
              </view>
            </view>

            <view class="motion-list" v-if="recodeType === 2">
              <view class="motion-item" v-for="item1 of motionRecodeList" :key="item1.id">
                <image
                  mode="widthFix"
                  :src="
                    item1.img_path ||
                    'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app3/todayRecode/food-icon7.png'
                  "
                />

                <view class="info1">
                  <text>{{ item1.name }}</text>
                  <text>{{ item1.quantity }}分钟</text>
                </view>

                <view class="info2">{{ item1.calorie }}千卡 ></view>
              </view>
            </view>
          </template>
        </view>
      </view>

      <view class="add-btn" @click="add">添加</view>

      <add-food-recode-dialog
        ref="addFoodRecodeDialog"
        :type="type"
        @addRecode="addRecode"
        @addImageRecode="addImageRecode"
      />

      <add-motion-recode-dialog ref="addMotionRecodeDialog" @addRecode="addMotionRecode" />

      <select-food-type-dialog
        ref="selectFoodTypeDialog"
        :foodRecodeList="foodRecodeList"
        @selectFoodTypeSubmit="openFoodRecodeDialog"
      />
    </view>
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
import SelectFoodTypeDialog from '@/components/selectFoodTypeDialog.vue';

let chart = null;

export default {
  name: 'foodRecodePage',

  components: {
    SelectFoodTypeDialog,
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
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/home/food-type1.png',
          text: '早餐',
          foodList: [],
          active: false,
        },
        {
          type: 3,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/home/food-type2.png',
          text: '午餐',
          foodList: [],
          active: false,
        },
        {
          type: 5,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/home/food-type3.png',
          text: '晚餐',
          foodList: [],
          active: false,
        },
        {
          type: 2,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-type1.png',
          text: '早加餐',
          foodList: [],
          active: false,
        },
        {
          type: 4,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-type2.png',
          text: '午加餐',
          foodList: [],
          active: false,
        },
        {
          type: 6,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-type3.png',
          text: '晚加餐',
          foodList: [],
          active: false,
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
      recodeType: 1,
    };
  },

  computed: {
    ...mapState('app', ['userDetailInfo']),
    ...mapGetters('app', ['isLogin', 'isVip']),

    canEatCalorie() {
      let number =
        this.dailyCalorie.calorie_requirement + this.dailyCalorie.calorie_burn - this.dailyCalorie.calorie_intake;

      if (number < 0) {
        return 0;
      }

      return Number(number.toFixed(2));
    },

    showEmptyRecode() {
      if (this.recodeType === 1) {
        let foodList = [];

        this.foodRecodeList.forEach((item) => {
          foodList.push(...item.foodList);
        });

        return !foodList.length;
      } else {
        return !this.motionRecodeList.length;
      }
    },

    suggestCalorie() {
      return (type) => {
        let ratio = 0;
        let total = this.dailyCalorie.calorie_requirement;

        if (type === 1) {
          ratio = 0.25;
        } else if (type === 2) {
          ratio = 0.05;
        } else if (type === 3) {
          ratio = 0.35;
        } else if (type === 4) {
          ratio = 0.05;
        } else if (type === 5) {
          ratio = 0.25;
        } else if (type === 6) {
          ratio = 0.05;
        }

        return Math.round(total * ratio);
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

    recodeType() {
      this.getDailyFoods();
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

    add() {
      if (!this.userDetailInfo) {
        verifyIsLogin();

        this.$toRouter('/pages/evaluation/evaluation');
      }

      if (this.recodeType === 1) {
        this.$refs.selectFoodTypeDialog.open();
      } else {
        this.$refs.addMotionRecodeDialog.open();
      }
    },

    openFoodRecodeDialog(type) {
      this.type = type;

      setTimeout(() => {
        this.$refs.addFoodRecodeDialog.open();
      });
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

  .date {
    padding: 0 25rpx;
    margin-bottom: 15rpx;
    position: relative;
  }

  .container {
    padding: 0 30rpx 100rpx;

    .manage {
      background: #ffffff;
      border-radius: 30rpx;
      padding: 36rpx 30rpx 53rpx;
      margin-bottom: 35rpx;

      .chart-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 23rpx;
        position: relative;
        margin-bottom: 53rpx;

        .left,
        .right {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20rpx;

          .name {
            font-size: 28rpx;
            color: #333333;
          }

          .value {
            font-weight: 500;
            font-size: 40rpx;
            color: #333333;
          }

          .unit {
            font-size: 26rpx;
            color: #bfbfbf;
          }
        }

        .chart {
          width: 272rpx;
          height: 272rpx;
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
                font-size: 26rpx;
                color: #bfbfbf;
              }

              &:nth-child(2) {
                font-weight: 500;
                font-size: 50rpx;
                color: #333333;
              }

              &:nth-child(3) {
                font-size: 24rpx;
                color: #65d285;
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
          gap: 20rpx;

          .name {
            font-weight: 500;
            font-size: 24rpx;
            color: #111111;
          }

          .progress {
            width: 180rpx;
            height: 6rpx;
            border-radius: 3rpx;
            position: relative;

            text {
              position: absolute;
              left: 0;
              top: 0;
              height: 100%;
              border-radius: 3rpx;
            }
          }

          .value {
            font-size: 24rpx;
            color: #999999;

            text {
              &:nth-child(1) {
                color: #111111;
              }
            }
          }
        }
      }
    }

    .recode {
      background: #ffffff;
      border-radius: 30rpx;

      .tabs {
        display: flex;
        align-items: center;
        padding: 32rpx 0;
        border-bottom: 1px solid #f6f7fb;

        text {
          width: 50%;
          color: #999999;
          font-weight: 500;
          font-size: 30rpx;
          display: flex;
          align-items: center;
          justify-content: center;

          &.active {
            color: #65d285;
          }
        }
      }

      .recode-detail {
        .food-type-list {
          padding: 30rpx;
          display: flex;
          flex-direction: column;
          gap: 40rpx;

          .food-type-name {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30rpx;

            .name {
              font-weight: 500;
              font-size: 30rpx;
              color: #333333;
            }

            .calorie {
              display: flex;
              align-items: center;

              text {
                &:nth-child(1) {
                  color: #333333;
                  font-size: 30rpx;
                }

                &:nth-child(2) {
                  color: #999999;
                  font-size: 24rpx;
                }
              }
            }
          }
        }

        .food-recode-list,
        .motion-list {
          display: flex;
          flex-direction: column;
          gap: 20rpx;

          &.motion-list {
            padding: 30rpx;
          }

          .food-recode-item,
          .motion-item {
            display: flex;
            align-items: center;

            image {
              width: 71rpx;
              margin-right: 21rpx;
              border-radius: 10rpx;
            }

            .info1 {
              flex-grow: 1;
              display: flex;
              flex-direction: column;
              gap: 15rpx;

              text {
                &:nth-child(1) {
                  font-size: 24rpx;
                  color: #333333;
                }

                &:nth-child(2) {
                  font-size: 24rpx;
                  color: #999999;
                }
              }
            }

            .info2 {
              font-size: 24rpx;
              color: #999999;
            }
          }
        }

        .empty-recode {
          padding: 26rpx 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          image {
            width: 167rpx;
            margin-bottom: 29rpx;
          }

          .tip1 {
            font-size: 24rpx;
            color: #333333;
            margin-bottom: 16rpx;
          }

          .tip2 {
            font-size: 22rpx;
            color: #999999;

            text {
              color: #65d285;
            }
          }
        }
      }
    }

    .add-btn {
      width: 550rpx;
      height: 100rpx;
      margin: 100rpx auto 0;
      background: #65d285;
      border-radius: 50rpx;
      font-weight: bold;
      font-size: 30rpx;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
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
