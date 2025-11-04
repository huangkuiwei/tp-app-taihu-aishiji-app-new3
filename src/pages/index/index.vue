<template>
  <view class="index-page">
    <view class="page-title">首页</view>
    <view class="banner"></view>

    <view class="card-container">
      <view class="weight-card">
        <view class="options">
          <template v-if="!isLogin">
            <view class="btn" @click="$toRouter('/packageLogin/pages/login/login')">请登录</view>
          </template>

          <template v-else-if="homeWeightPlanData && homeWeightPlanData.state === 1">
            <view class="btn" style="background: #ffffff; color: #5664e5" @click="showRecodeWeight">体重记录</view>
            <view
              class="btn"
              @click="
                $toRouter(
                  '/pages/resetPlan/resetPlan',
                  `plan_id=${homeWeightPlanData.plan_id}&plan_initial_weight=${homeWeightPlanData.plan_initial_weight}&plan_target_weight=${homeWeightPlanData.plan_target_weight}&start_date=${homeWeightPlanData.start_date}&end_date=${homeWeightPlanData.end_date}`,
                )
              "
            >
              修改计划
            </view>
          </template>

          <template v-else>
            <view class="btn" @click="addPlan">
              {{ userDetailInfo ? '新建计划' : '完善个人信息' }}
            </view>
          </template>
        </view>

        <view class="data1">
          <view class="left">
            <text style="font-size: 100rpx">{{ (homeWeightPlanData && homeWeightPlanData.current_weight) || 0 }}</text>
            <text>{{ updateTime }}</text>
          </view>

          <view class="right">
            <text v-if="isWeightLoss" style="font-size: 60rpx">{{
              (homeWeightPlanData && homeWeightPlanData.weight_loss) || 0
            }}</text>
            <text v-else style="font-size: 60rpx">{{
              (homeWeightPlanData && -homeWeightPlanData.weight_loss) || 0
            }}</text>
            <text>{{ isWeightLoss ? '下降' : '增加' }}</text>
          </view>
        </view>

        <view class="data2">
          <view class="item">
            <view>BMI</view>
            <view v-if="userDetailInfo">
              {{
                Number(
                  (userDetailInfo.current_weight / ((userDetailInfo.height * userDetailInfo.height) / 10000)).toFixed(
                    1,
                  ),
                )
              }}
            </view>
            <view v-else>-/-</view>
          </view>

          <view class="item">
            <view>目标日期</view>
            <view v-if="homeWeightPlanData && homeWeightPlanData.end_date">
              <text style="font-size: 22rpx">剩余</text>
              <text style="margin: 0 5rpx">{{ countdownDays }}</text>
              <text style="font-size: 22rpx">天</text>
            </view>
            <view v-else>-/-</view>
          </view>

          <view class="item">
            <view>目标体重</view>
            <view v-if="homeWeightPlanData && homeWeightPlanData.plan_target_weight">
              <text style="margin-right: 5rpx">{{ homeWeightPlanData.plan_target_weight }}</text>
              <text style="font-size: 22rpx">公斤</text>
            </view>
            <view v-else>-/-</view>
          </view>
        </view>
      </view>

      <view class="calorie-card">
        <view class="title">热量统计</view>

        <view class="calorie-container">
          <view class="chart">
            <view class="left">
              <view class="data-item data-item1">
                <view class="line"></view>

                <view class="data">
                  <view class="chart-title">饮食摄入</view>
                  <view class="number">
                    <image
                      mode="widthFix"
                      src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/home/icon1.png"
                    />

                    <view>
                      <text>{{ dailyCalorie.calorie_intake || 0 }}</text>
                      <text>千卡</text>
                    </view>
                  </view>
                </view>
              </view>

              <view class="data-item data-item2">
                <view class="line"></view>

                <view class="data">
                  <view class="chart-title">运动消耗</view>
                  <view class="number">
                    <image
                      mode="widthFix"
                      src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/home/icon2.png"
                    />

                    <view>
                      <text>{{ dailyCalorie.calorie_burn || 0 }}</text>
                      <text>千卡</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>

            <view class="right">
              <l-echart ref="chart1Ref" @finished="init1" />

              <view class="tip">
                <text>{{ dailyCalorie.remaining || '-/-' }}</text>
                <text>剩余千卡</text>
              </view>
            </view>
          </view>

          <view class="calorie-type">
            <view class="calorie-item">
              <view class="name">碳水</view>
              <view class="progress" style="background: #e5e8ff">
                <text style="background: #5664e5" :style="{ width: dailyCalorie.remainingARatio + '%' }"></text>
              </view>
              <view class="value" v-if="dailyCalorie.carbohydrate_requirement">
                还剩{{ dailyCalorie.remainingA }}千卡
              </view>
              <view class="value" v-else>暂无</view>
            </view>

            <view class="calorie-item">
              <view class="name">蛋白质</view>
              <view class="progress" style="background: #ffeaf0">
                <text style="background: #fd6896" :style="{ width: dailyCalorie.remainingBRatio + '%' }"></text>
              </view>
              <view class="value" v-if="dailyCalorie.protein_requirement"> 还剩{{ dailyCalorie.remainingB }}千卡 </view>
              <view class="value" v-else>暂无</view>
            </view>

            <view class="calorie-item">
              <view class="name">脂肪</view>
              <view class="progress" style="background: #fcf5e4">
                <text style="background: #fdcd00" :style="{ width: dailyCalorie.remainingCRatio + '%' }"></text>
              </view>
              <view class="value" v-if="dailyCalorie.fat_requirement"> 还剩{{ dailyCalorie.remainingC }}千卡 </view>
              <view class="value" v-else>暂无</view>
            </view>
          </view>
        </view>
      </view>

      <view class="food-card">
        <view class="title">
          <view class="left">饮食记录</view>

          <view class="right">
            <text @click="goWeightManagementPlan">去定制</text>
            <uni-icons type="arrow-right" size="12" color="#666666" />
          </view>
        </view>

        <view class="food-type">
          <view class="food-item" v-for="item of foodRecodeList" :key="item.type">
            <image mode="widthFix" :src="item.icon" />
            <view
              class="name"
              @click="item.foodList.length && $toRouter('/pages/foodAnalysis/foodAnalysis', `type=${item.type}`)"
            >
              <text>{{ item.text }}</text>
              <view class="recode" v-if="item.foodList">{{ item.foodList }}</view>
            </view>
            <view class="calorie" v-if="isLogin">建议{{ suggestCalorie(item.type) }}千卡</view>
            <view class="add" @click.stop="openFoodRecodeDialog(item.type)">
              <text>+</text>
            </view>
          </view>
        </view>
      </view>

      <view class="motion-card">
        <view class="title">
          <view class="left">运动记录</view>

          <view class="right">
            <text @click="goWeightManagementPlan">去定制</text>
            <uni-icons type="arrow-right" size="12" color="#666666" />
          </view>
        </view>

        <view class="motion-detail">
          <view class="motion-data">
            <view class="left" v-if="!motionRecodeList.length">运动<text>0</text>千卡</view>
            <view class="left" v-else>
              你完成了{{ motionRecodeList.length }}次运动共消耗<text>{{ totalMotion }}</text
              >千卡
            </view>
            <view class="right" v-if="dailyCalorie.exercise_calorie_requirement">
              建议消耗{{ dailyCalorie.exercise_calorie_requirement }}千卡
            </view>
          </view>

          <view class="motion-list" v-if="motionRecodeList.length">
            <view class="motion-item" v-for="(item, index) of motionRecodeList" :key="index">
              <text>·{{ item.name }}</text>
              <text>{{ item.quantity }}分钟</text>
              <text>-{{ item.calorie }}千卡</text>
            </view>
          </view>

          <view v-else style="margin-bottom: 137rpx"></view>
        </view>

        <view class="add-motion" @click="openMotionRecodeDialog">+添加运动</view>
      </view>
    </view>

    <view class="adv1">
      <image
        @click="goWeightManagementPlan"
        mode="widthFix"
        src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/home/adv1.png"
      />
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
  background: #f6f7fb url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/home/banner-bg.png') left
    top/100% auto no-repeat;
}
</style>

<style scoped lang="scss">
.index-page {
  .page-title {
  }

  .banner {
    padding: calc(var(--page-title-height) + 39rpx) 0 0;
  }

  .card-container {
    padding: 0 30rpx 200rpx;
    position: relative;

    .weight-card {
      background: #5664e5;
      border-radius: 20rpx;
      padding: 48rpx 20rpx 20rpx;
      position: relative;
      margin-bottom: 23rpx;

      .options {
        position: absolute;
        top: 30rpx;
        right: 20rpx;

        .btn {
          padding: 0 20rpx;
          height: 45rpx;
          margin-bottom: 20rpx;

          border-radius: 23rpx;
          font-weight: 500;
          font-size: 24rpx;
          background: #fd6896;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .data1 {
        color: #ffffff;
        display: flex;
        align-items: flex-end;
        margin-bottom: 58rpx;

        .left,
        .right {
          width: 50%;
          display: flex;
          flex-direction: column;

          text {
            &:nth-child(1) {
              font-weight: bold;
              margin-bottom: 47rpx;
            }

            &:nth-child(2) {
              font-weight: 500;
              font-size: 24rpx;
            }
          }
        }
      }

      .data2 {
        width: 100%;
        height: 105rpx;
        background: #737edd;
        border-radius: 20rpx;
        padding: 0 90rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20rpx;

          > view {
            font-weight: 500;
            color: #fcfcfc;

            &:nth-child(1) {
              font-size: 24rpx;
            }

            &:nth-child(2) {
              font-size: 30rpx;
            }
          }
        }
      }
    }

    .calorie-card {
      background: #ffffff;
      box-shadow: 0 3rpx 21rpx 0 rgba(215, 218, 242, 0.29);
      border-radius: 20rpx;
      padding: 28rpx 50rpx 30rpx 18rpx;
      margin-bottom: 21rpx;

      .title {
        font-weight: 500;
        font-size: 30rpx;
        color: #111111;
        margin-bottom: 43rpx;
      }

      .calorie-container {
        padding: 0 36rpx;

        .chart {
          display: flex;
          align-items: center;
          border-bottom: 4rpx solid #eeeeee;
          padding-bottom: 31rpx;
          margin-bottom: 30rpx;

          .left {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 32rpx;

            .data-item {
              display: flex;
              align-items: center;

              &.data-item1 {
                .line {
                  background: #e5e8ff;
                }
              }

              &.data-item2 {
                .line {
                  background: #ffeaf0;
                }
              }

              .line {
                width: 4rpx;
                height: 70rpx;
                border-radius: 2rpx;
                margin-right: 15rpx;
              }

              .data {
                display: flex;
                flex-direction: column;
                gap: 21rpx;

                .chart-title {
                  font-size: 24rpx;
                  color: #666666;
                }

                .number {
                  display: flex;
                  align-items: center;

                  image {
                    width: 29rpx;
                    margin-right: 12rpx;
                  }

                  view {
                    text {
                      &:nth-child(1) {
                        color: #111111;
                        font-size: 28rpx;
                        margin-right: 10rpx;
                      }

                      &:nth-child(2) {
                        color: #999999;
                        font-size: 22rpx;
                      }
                    }
                  }
                }
              }
            }
          }

          .right {
            flex-shrink: 0;
            width: 190rpx;
            height: 190rpx;
            position: relative;

            .tip {
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 10rpx;

              text {
                &:nth-child(1) {
                  color: #5664e5;
                  font-size: 32rpx;
                }

                &:nth-child(2) {
                  color: #999999;
                  font-size: 22rpx;
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
            gap: 11rpx;

            .name {
              font-size: 24rpx;
              color: #444444;
            }

            .progress {
              width: 147rpx;
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

            .value {
              font-size: 22rpx;
              color: #999999;
            }
          }
        }
      }
    }

    .food-card {
      background: #ffffff;
      box-shadow: 0 3rpx 21rpx 0 rgba(215, 218, 242, 0.29);
      border-radius: 20rpx;
      padding: 29rpx 21rpx 34rpx 17rpx;
      margin-bottom: 21rpx;

      .title {
        margin-bottom: 41rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          font-weight: 500;
          font-size: 30rpx;
          color: #111111;
        }

        .right {
          color: #afb6f6;
          font-size: 24rpx;
        }
      }

      .food-type {
        display: flex;
        flex-direction: column;
        gap: 20rpx;

        .food-item {
          background: #ffffff;
          box-shadow: 0 3rpx 21rpx 0 rgba(215, 218, 242, 0.29);
          border-radius: 20rpx;
          padding: 23rpx 15rpx;
          display: flex;
          align-items: center;

          image {
            flex-shrink: 0;
            width: 85rpx;
            margin-right: 29rpx;
          }

          .name {
            flex-grow: 1;
            overflow: hidden;
            font-weight: 500;
            font-size: 28rpx;
            color: #222222;

            .recode {
              font-size: 22rpx;
              color: #999999;
              margin-top: 19rpx;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }

          .calorie {
            flex-shrink: 0;
            font-weight: 500;
            font-size: 28rpx;
            color: #333333;
            margin: 0 21rpx 0 10rpx;
          }

          .add {
            flex-shrink: 0;
            width: 48rpx;
            height: 48rpx;
            background: #5664e5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 34rpx;
            font-weight: bold;
            color: #ffffff;

            text {
              position: relative;
              top: -4rpx;
            }
          }
        }
      }
    }

    .motion-card {
      background: #ffffff;
      box-shadow: 0 3rpx 21rpx 0 rgba(215, 218, 242, 0.29);
      border-radius: 20rpx;
      padding: 31rpx 19rpx 16rpx 22rpx;

      .title {
        margin-bottom: 37rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          font-weight: 500;
          font-size: 30rpx;
          color: #111111;
        }

        .right {
          color: #afb6f6;
          font-size: 24rpx;
        }
      }

      .motion-detail {
        padding: 0 17rpx;

        .motion-data {
          padding: 0 0 30rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2rpx dashed #eeeeee;

          .left {
            color: #333333;
            font-size: 28rpx;

            text {
              color: #5664e5;
              font-size: 36rpx;
            }
          }

          .right {
            font-weight: 500;
            font-size: 22rpx;
            color: #999999;
          }
        }

        .motion-list {
          padding: 30rpx 0;
          display: flex;
          flex-direction: column;
          gap: 29rpx;

          .motion-item {
            display: flex;
            align-items: center;

            text {
              &:nth-child(1) {
                color: #333333;
                font-size: 26rpx;
                font-weight: 500;
                margin-right: 10rpx;
              }

              &:nth-child(2) {
                color: #666666;
                font-weight: 500;
                font-size: 24rpx;
                flex-grow: 1;
              }

              &:nth-child(3) {
                font-size: 22rpx;
                color: #666666;
              }
            }
          }
        }
      }

      .add-motion {
        width: 158rpx;
        height: 54rpx;
        margin: 0 auto;
        background: #ebedff;
        border-radius: 27rpx;
        border: 1px solid #5664e5;
        font-weight: 500;
        font-size: 26rpx;
        color: #5664e5;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .adv1 {
    position: fixed;
    left: 30rpx;
    right: 30rpx;
    bottom: 10rpx;

    image {
      width: 100%;
    }
  }
}
</style>
