<template>
  <view class="index-page">
    <view class="page-title">欢迎回来</view>
    <view class="banner"></view>

    <view class="plan-data-container">
      <view class="circle">
        <view class="circle-center">
          <view class="plan-data" v-if="homeWeightPlanData && homeWeightPlanData.state === 1">
            <view class="top">
              <text class="tip">{{ isWeightLoss ? '减重' : '增重' }}</text>
              <view class="number">
                <text>{{ Math.floor(Math.abs(homeWeightPlanData.weight_loss)) }}</text>
                <text
                  >.{{
                    (
                      (Math.abs(homeWeightPlanData.weight_loss) -
                        Math.floor(Math.abs(homeWeightPlanData.weight_loss))) *
                      10
                    ).toFixed(0)
                  }}</text
                >
              </view>
              <text class="unit">斤</text>
            </view>

            <view class="bottom" @click="showRecodeWeight">点击记录体重</view>
          </view>

          <view class="add-plan" v-else @click="addPlan">添加计划</view>
        </view>
      </view>

      <view class="btn">
        <!-- TODO 查看计划图标修改 -->
        <image
          v-if="homeWeightPlanData && homeWeightPlanData.state === 1"
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/vip/icon3.png"
          @click="goWeightManagementPlan"
        />

        <!-- TODO 新建计划图标修改 -->
        <image
          v-else
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/vip/icon3.png"
          @click="addPlan"
        />
      </view>
    </view>

    <view class="weight-data-wrapper">
      <view class="weight-data">
        <view class="weight-number">
          <text>{{ (homeWeightPlanData && homeWeightPlanData.plan_initial_weight) || '-' }}</text>
          <text>初始体重</text>
        </view>

        <view class="weight-number">
          <text>{{ (homeWeightPlanData && homeWeightPlanData.plan_target_weight) || '-' }}</text>
          <text>目标体重</text>
        </view>
      </view>

      <view class="calorie-type">
        <view class="calorie-item">
          <view class="name">脂肪</view>
          <view class="progress" style="background: #e6e6e6">
            <text style="background: #fdcd00" :style="{ width: dailyCalorie.remainingCRatio + '%' }"></text>
          </view>
          <!-- TODO 脂肪数据需要克数 -->
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
          <!-- TODO 碳水数据需要克数 -->
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
          <!-- TODO 蛋白质数据需要克数 -->
          <view class="value" v-if="dailyCalorie.protein_requirement">
            <text>{{ dailyCalorie.protein_intake }}/</text>
            <text>{{ dailyCalorie.protein_requirement }}克</text>
          </view>
          <view class="value" v-else>暂无</view>
        </view>
      </view>

      <view class="banners">
        <!-- TODO banner图片切图有问题 -->
        <image
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/index/banner1.png"
          @click="openFoodRecodeDialog"
        />

        <!-- TODO banner图片切图有问题 -->
        <image
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/index/banner2.png"
          @click="openMotionRecodeDialog"
        />
      </view>

      <view class="food-wrapper">
        <view class="food-tip">
          <text>会员减重方案</text>
          <text>为您定制专属的饮食方案</text>
        </view>

        <!-- TODO 饮食记录 -->
        <view class="food-list">
          <view class="food-item" v-for="item of foodRecodeList" :key="item.type">
            <view class="food-item-text">早餐<text>500</text>千卡</view>
          </view>
        </view>
      </view>
    </view>

    <add-food-recode-dialog ref="addFoodRecodeDialog" :type="selectFoodType" @addRecode="addRecode" />
    <add-motion-recode-dialog ref="addMotionRecodeDialog" @addRecode="addMotionRecode" />
    <update-weight-data-dialog ref="updateWeightDataDialog" @updateSuccess="initData" />
  </view>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import * as echarts from '@/uni_modules/lime-echart/static/echarts.min';
import $http from '@/utils/http';
import AddFoodRecodeDialog from '@/components/addFoodRecodeDialog.vue';
import AddMotionRecodeDialog from '@/components/addMotionRecodeDialog.vue';
import UpdateWeightDataDialog from '@/components/updateWeightDataDialog.vue';

let chart1 = null;

export default {
  name: 'indexPage',

  components: {
    UpdateWeightDataDialog,
    AddMotionRecodeDialog,
    AddFoodRecodeDialog,
  },

  data() {
    return {
      homeWeightPlanData: null,
      option1: {
        series: [
          {
            type: 'gauge',
            startAngle: 90,
            endAngle: -270,
            min: 0,
            max: 100,
            splitNumber: 12,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#5168E6', // 起始颜色
                },
                {
                  offset: 1,
                  color: '#6B57E3', // 结束颜色
                },
              ]),
              shadowColor: 'transparent',
              shadowBlur: 10,
              shadowOffsetX: 2,
              shadowOffsetY: 2,
            },
            progress: {
              show: true,
              roundCap: true,
              width: 7,
            },
            pointer: {
              show: false,
            },
            axisLine: {
              roundCap: true,
              lineStyle: {
                width: 2,
                color: [[1, '#DBDCEC']],
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
      dailyCalorie: {},
      foodRecodeList: [
        {
          type: 1,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/home/food-type1.png',
          text: '早餐',
          foodList: [],
        },
        {
          type: 3,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/home/food-type2.png',
          text: '午餐',
          foodList: [],
        },
        {
          type: 5,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/home/food-type3.png',
          text: '晚餐',
          foodList: [],
        },
        {
          type: 2,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-type1.png',
          text: '早加餐',
          foodList: [],
        },
        {
          type: 4,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-type2.png',
          text: '午加餐',
          foodList: [],
        },
        {
          type: 6,
          icon: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/food-type3.png',
          text: '晚加餐',
          foodList: [],
        },
      ],
      motionRecodeList: [],
      selectFoodType: undefined,
    };
  },

  onShow() {
    this.initData();
  },

  computed: {
    ...mapState('app', ['userDetailInfo']),
    ...mapGetters('app', ['isLogin']),

    isWeightLoss() {
      if (!this.homeWeightPlanData) {
        return true;
      }

      return this.homeWeightPlanData.plan_initial_weight - this.homeWeightPlanData.plan_target_weight > 0;
    },

    countdownDays() {
      if (this.homeWeightPlanData && this.homeWeightPlanData.end_date) {
        let time = new Date(this.homeWeightPlanData.end_date.replace(/-/g, '/')) - new Date();
        let days = Math.ceil(time / (60 * 60 * 24 * 1000));

        if (days < 0) {
          days = 0;
        }

        return days;
      }

      return 0;
    },

    suggestCalorie() {
      return (type) => {
        if (!this.dailyCalorie.calorie_requirement) {
          return 0;
        }

        let ratio = 0;

        if (type === 1 || type === 5) {
          ratio = 0.3;
        } else {
          ratio = 0.4;
        }

        return Math.round(this.dailyCalorie.calorie_requirement * ratio);
      };
    },

    totalMotion() {
      let totalMotion = 0;
      this.motionRecodeList.forEach((item) => {
        totalMotion += item.calorie;
      });

      return Math.round(totalMotion);
    },

    updateTime() {
      if (this.userDetailInfo) {
        if (this.userDetailInfo.begin_date === this.userDetailInfo.weight_recode_date) {
          return '暂无数据';
        }

        let date = new Date().format().slice(0, 10);
        let day =
          new Date(date + ' 23:59:59').getTime() -
          new Date(this.userDetailInfo.weight_recode_date.replace(/-/g, '/')).getTime();
        let days = Math.ceil(day / (24 * 60 * 60 * 1000));

        if (days === 1) {
          return `今天 ${this.userDetailInfo.weight_recode_date.slice(11, 16)}`;
        } else if (days === 2) {
          return `昨天 ${this.userDetailInfo.weight_recode_date.slice(11, 16)}`;
        } else {
          return `${this.userDetailInfo.weight_recode_date.slice(5, 10)} ${this.userDetailInfo.weight_recode_date.slice(
            11,
            16,
          )}`;
        }
      }

      return '暂无数据';
    },
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/share-img.jpg',
      path: '/pages/index/index',
    };
  },

  methods: {
    ...mapActions('app', ['_getUserDetailInfo']),

    async init1() {
      chart1 = await this.$refs.chart1Ref.init(echarts);
      chart1.setOption(this.option1);
    },

    /**
     * 初始化数据
     */
    async initData() {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      this.getDailyCalorie();
      this.getDailyFoods();
      await this.getHomeWeightPlan().catch(() => {});
      await this._getUserDetailInfo().catch(() => {});

      uni.hideLoading();
    },

    /**
     * 获取首页体重相关数据
     */
    getHomeWeightPlan() {
      return $http.get('api/diet-info/weight-plan/home').then((res) => {
        this.homeWeightPlanData = res.data;
      });
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
          res.data.remainingBRatio = (res.data.protein_intake / res.data.carbohydrate_requirement) * 100;
          res.data.remainingCRatio = (res.data.fat_intake / res.data.carbohydrate_requirement) * 100;

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

          // 图表数据修改和渲染
          this.option1.series[0].data[0].value = ratio;

          let timer = setInterval(() => {
            if (chart1) {
              chart1.setOption(this.option1);
              clearInterval(timer);
            }
          }, 50);
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

    getDailyFoods() {
      return $http
        .post('api/diet-info/daily-list', {
          date: new Date().format(),
        })
        .then((res) => {
          this.foodRecodeList.forEach((item) => {
            let current = res.data.find((item1) => item1.type === item.type);
            item.foodList = (current && current.die_list) || [];
            item.foodList = item.foodList.map((x) => x.name).join(' ');
          });

          let motionItem = res.data.find((item1) => item1.type === 7);

          this.motionRecodeList = (motionItem && motionItem.die_list) || [];
        });
    },

    showRecodeWeight() {
      if (!this.isLogin) {
        this.$toRouter('/packageLogin/pages/login/login');
        return;
      }

      if (!this.userDetailInfo) {
        this.$toRouter('/pages/evaluation/evaluation');
        return;
      }

      this.$refs.updateWeightDataDialog.open();
    },

    goWeightManagementPlan() {
      if (!this.isLogin) {
        this.$toRouter('/packageLogin/pages/login/login');
        return;
      }

      if (!this.userDetailInfo) {
        this.$toRouter('/pages/evaluation/evaluation');
        return;
      }

      if (!this.homeWeightPlanData) {
        this.$toRouter('/pages/addPlan/addPlan');
        return;
      }

      this.$toRouter('/pages/weightManagementPlan/weightManagementPlan');
    },

    openFoodRecodeDialog(type) {
      if (!this.isLogin) {
        this.$toRouter('/packageLogin/pages/login/login');
        return;
      }

      if (!this.userDetailInfo) {
        this.$toRouter('/pages/evaluation/evaluation');
        return;
      }

      this.selectFoodType = type;

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
        }&date_time=${new Date().format()}`,
      );
    },

    openMotionRecodeDialog() {
      if (!this.isLogin) {
        this.$toRouter('/packageLogin/pages/login/login');
        return;
      }

      this.$refs.addMotionRecodeDialog.open();
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

              this.initData();
            });
        });
    },

    /**
     * 跳转创建计划页
     */
    addPlan() {
      if (!this.isLogin) {
        this.$toRouter('/packageLogin/pages/login/login');
        return;
      }

      if (!this.userDetailInfo) {
        this.$toRouter('/pages/evaluation/evaluation');
        return;
      }

      // 创建计划
      this.$toRouter('/pages/addPlan/addPlan');
    },
  },
};
</script>

<style>
page {
  background: #f6f7fb url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/index/bg1.png') left top/100%
    560rpx no-repeat;
}
</style>

<style scoped lang="scss">
.index-page {
  .page-title {
  }

  .banner {
    padding: calc(var(--page-title-height) + 29rpx) 0 0;
  }

  .plan-data-container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .circle {
      position: relative;
      width: 326rpx;
      height: 326rpx;
      background: conic-gradient(from 0deg at 50% 50%, #71e8ca, #a2f4ba);
      border-radius: 50%;

      .circle-center {
        position: absolute;
        left: 18rpx;
        right: 18rpx;
        top: 18rpx;
        bottom: 18rpx;
        border-radius: 50%;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;

        .plan-data {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 44rpx;

          .top {
            display: flex;
            align-items: center;

            .tip {
              font-weight: 500;
              font-size: 24rpx;
              color: #111111;
              position: relative;
              top: 18rpx;
              margin-right: 18rpx;
            }

            .number {
              color: #000000;
              font-weight: 600;

              text {
                &:nth-child(1) {
                  font-size: 85rpx;
                }

                &:nth-child(2) {
                  font-size: 40rpx;
                }
              }
            }

            .unit {
              font-weight: 500;
              font-size: 25rpx;
              color: #111111;
              position: relative;
              top: -20rpx;
              left: -12rpx;
            }
          }

          .bottom {
            width: 177rpx;
            height: 40rpx;
            background: #65d285;
            border-radius: 20rpx;
            font-size: 24rpx;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .add-plan {
          width: 171rpx;
          height: 56rpx;
          background: #66d286;
          border-radius: 28rpx;
          font-size: 24rpx;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    .btn {
      position: absolute;
      right: 0;
      top: 12rpx;

      image {
        width: 135rpx;
      }
    }
  }

  .weight-data-wrapper {
    position: relative;
    top: -85rpx;
    background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/index/bg2.png') left top/100% auto
      no-repeat;
    padding: 47rpx 33rpx;

    .weight-data {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .weight-number {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 21rpx;
        margin-bottom: 87rpx;

        text {
          &:nth-child(1) {
            font-weight: 500;
            font-size: 50rpx;
            color: #000000;
          }

          &:nth-child(2) {
            font-size: 24rpx;
            color: #999999;
          }
        }
      }
    }

    .calorie-type {
      padding: 0 27rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 45rpx;

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

    .banners {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 21rpx;

      image {
        width: 335rpx;
      }
    }

    .food-wrapper {
      .food-tip {
        height: 69rpx;
        background: #fcf3e4;
        border-radius: 29rpx 29rpx 0 0;
        padding: 0 29rpx;
        display: flex;
        align-items: center;

        text {
          position: relative;
          top: -4rpx;

          &:nth-child(1) {
            color: #867659;
            font-size: 24rpx;
          }

          &:nth-child(2) {
            color: #cdae7a;
            font-size: 22rpx;
          }
        }
      }

      .food-list {
        position: relative;
        top: -10rpx;
        display: flex;
        flex-direction: column;
        gap: 20rpx;

        .food-item {
          padding: 45rpx 31rpx;
          background: #ffffff;
          border-radius: 30rpx;

          .food-item-text {
            height: 100%;
            font-weight: 500;
            font-size: 28rpx;
            color: #111111;
            display: flex;
            align-items: center;

            text {
              color: #66d286;
              font-size: 30rpx;
            }
          }
        }
      }
    }
  }
}
</style>
