<template>
  <view class="index-page">
    <view class="page-title">{{ isLogin ? '欢迎回来' : '记录' }}</view>
    <view class="banner"></view>

    <view class="plan-data-container">
      <view class="circle">
        <view class="circle-center">
          <view class="plan-data" v-if="homeWeightPlanData && homeWeightPlanData.state === 1">
            <view class="top">
              <text class="tip">{{ isWeightLoss ? '减重' : '增重' }}</text>
              <view class="number">
                <text>{{ isMinusSign && '-' }}{{ Math.floor(Math.abs(homeWeightPlanData.weight_loss)) }}</text>
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
              <text class="unit">公斤</text>
            </view>

            <view class="bottom" @click="showRecodeWeight">点击记录体重</view>
          </view>

          <view class="add-plan" v-else @click="addPlan">
            <template v-if="isLogin">
              <text v-if="!userDetailInfo">完善个人信息</text>
              <text v-else>添加计划</text>
            </template>

            <text v-else>请登录</text>
          </view>
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

      <view class="banners">
        <!-- TODO banner图片切图有问题 -->
        <image
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/index/banner1.png"
          @click="openSelectFoodTypeDialog"
        />

        <!-- TODO banner图片切图有问题 -->
        <image
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/index/banner2.png"
          @click="openMotionRecodeDialog"
        />
      </view>

      <view class="food-wrapper">
        <view class="food-tip" @click="goWeightManagementPlan">
          <text>会员减重方案</text>
          <text>为您定制专属的饮食方案</text>
          <text>></text>
        </view>

        <view class="food-list">
          <view class="food-item" v-for="item of foodRecodeList" :key="item.type">
            <view class="food-item-text" @click="onSelectTypeChange(item)">
              {{ item.text }}<text>{{ currentCalorie(item.foodList) }}</text
              >千卡
            </view>

            <view class="food-item-detail" v-show="item.active">
              <view class="current-food" v-if="item.foodList.length">
                <view class="current-food-item-wrap">
                  <view class="current-food-item" v-for="(item1, index) of item.foodList" :key="index">
                    <text>{{ item1.name }}</text>
                    <text>{{ item1.calorie }}千卡</text>
                  </view>
                </view>

                <view class="current-food-item1" @click="jumpFoodRecode">
                  <text>...</text>
                </view>
              </view>

              <view class="progress" @click="jumpFoodRecode">
                <text class="tip">还可以吃</text>
                <!-- TODO 进度 -->
                <view class="progress-line">
                  <text></text>
                </view>
                <!-- TODO 每餐建议热量 -->
                <text class="number">1200千卡</text>
                <text class="icon">▶</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="ai-icon">
      <image
        mode="widthFix"
        src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/index/ai-icon.png"
        @click="jumpAi(jkzsChat)"
      />
    </view>

    <add-food-recode-dialog ref="addFoodRecodeDialog" :type="selectFoodType" @addRecode="addRecode" />
    <add-motion-recode-dialog ref="addMotionRecodeDialog" @addRecode="addMotionRecode" />
    <update-weight-data-dialog ref="updateWeightDataDialog" @updateSuccess="initData" />
    <select-food-type-dialog
      ref="selectFoodTypeDialog"
      :foodRecodeList="foodRecodeList"
      @selectFoodTypeSubmit="openFoodRecodeDialog"
    />
    <complete-plan-dialog ref="completePlanDialog" @addPlan="addPlan" />
  </view>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import $http from '@/utils/http';
import AddFoodRecodeDialog from '@/components/addFoodRecodeDialog.vue';
import AddMotionRecodeDialog from '@/components/addMotionRecodeDialog.vue';
import UpdateWeightDataDialog from '@/components/updateWeightDataDialog.vue';
import SelectFoodTypeDialog from '@/components/selectFoodTypeDialog.vue';
import CompletePlanDialog from '@/components/completePlanDialog.vue';

export default {
  name: 'indexPage',

  components: {
    CompletePlanDialog,
    SelectFoodTypeDialog,
    UpdateWeightDataDialog,
    AddMotionRecodeDialog,
    AddFoodRecodeDialog,
  },

  data() {
    return {
      homeWeightPlanData: null,
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
      selectFoodType: undefined,
      aiChartList: [],
      jkzsChat: {},
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

    currentCalorie() {
      return (foodList) => {
        let currentCalorie = 0;

        foodList.forEach((item) => {
          currentCalorie += item.calorie;
        });

        return currentCalorie;
      };
    },

    isMinusSign() {
      if (!this.homeWeightPlanData) {
        return false;
      }

      return (
        (this.isWeightLoss && this.homeWeightPlanData.weight_loss < 0) ||
        (!this.isWeightLoss && this.homeWeightPlanData.weight_loss > 0)
      );
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
      this.getAiChartList();
      await this.getHomeWeightPlan().catch(() => {});
      await this._getUserDetailInfo().catch(() => {});

      uni.hideLoading();
    },

    /**
     * 获取首页体重相关数据
     */
    getHomeWeightPlan() {
      return $http.get('api/diet-info/weight-plan/home').then((res) => {
        // 对比数据，是否完成目标
        if (this.homeWeightPlanData && this.homeWeightPlanData.state === 1 && res.data.state !== 1) {
          this.$refs.completePlanDialog.open();
        }

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

    getDailyFoods() {
      return $http
        .post('api/diet-info/daily-list', {
          date: new Date().format(),
        })
        .then((res) => {
          this.foodRecodeList.forEach((item) => {
            let current = res.data.find((item1) => item1.type === item.type);
            item.foodList = (current && current.die_list) || [];
          });

          let motionItem = res.data.find((item1) => item1.type === 7);

          this.motionRecodeList = (motionItem && motionItem.die_list) || [];
        });
    },

    /**
     * 获取 ai 搭子列表
     */
    getAiChartList() {
      $http
        .get('api/baseai/agent-list')
        .then((res) => {
          let jkzsChatIndex = res.data.findIndex((item) => item.id === 10000);

          if (jkzsChatIndex !== -1) {
            this.jkzsChat = res.data[jkzsChatIndex];
          }

          res.data.splice(jkzsChatIndex, 1);
          this.aiChartList = res.data;
        })
        .catch(() => {
          this.aiChartList = [];
        });
    },

    /**
     * 跳转 AI 搭子聊天界面
     */
    jumpAi(item) {
      if (item.id === 10000) {
        this.$toRouter('/pages/healthAssistant/healthAssistant', `agent_id=${item.id}&name=${item.name}`);
        return;
      }

      this.$toRouter('/pages/aiChat/aiChat', `agent_id=${item.id}&name=${item.name}`);
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

    openSelectFoodTypeDialog() {
      if (!this.isLogin) {
        this.$toRouter('/packageLogin/pages/login/login');
        return;
      }

      this.$refs.selectFoodTypeDialog.open();
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

    onSelectTypeChange(item) {
      if (!this.isLogin) {
        this.$toRouter('/packageLogin/pages/login/login');
        return;
      }

      item.active = !item.active;
    },

    jumpFoodRecode() {
      if (!this.isLogin) {
        this.$toRouter('/packageLogin/pages/login/login');
        return;
      }

      if (!this.userDetailInfo) {
        this.$toRouter('/pages/evaluation/evaluation');
        return;
      }

      this.$toRouter('/pages/foodRecode/foodRecode');
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
    z-index: 999;
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
            flex-grow: 1;
          }

          &:nth-child(3) {
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
          transition: all 0.3s;

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
              font-weight: 800;
              margin: 0 6rpx;
            }
          }

          .food-item-detail {
            margin-top: 43rpx;

            .current-food {
              display: flex;
              align-items: center;
              overflow: auto;
              margin-bottom: 37rpx;

              .current-food-item-wrap {
                flex-grow: 1;
                display: flex;
                align-items: center;
                gap: 14rpx;
                overflow: auto;
                margin-right: 14rpx;

                .current-food-item {
                  flex-shrink: 0;
                  height: 100rpx;
                  padding: 0 14rpx;
                  background: #f8f8f8;
                  border-radius: 20rpx;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  gap: 15rpx;

                  text {
                    &:nth-child(1) {
                      font-weight: 500;
                      font-size: 24rpx;
                      color: #111111;
                    }

                    &:nth-child(2) {
                      font-size: 26rpx;
                      color: #666666;
                    }
                  }
                }
              }

              .current-food-item1 {
                width: 116rpx;
                height: 100rpx;
                background: #f8f8f8;
                border-radius: 20rpx;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                text {
                  font-weight: 500;
                  font-size: 26rpx;
                  color: #111111;
                  position: relative;
                  top: -6rpx;
                }
              }
            }

            .progress {
              display: flex;
              align-items: center;

              .tip {
                font-size: 24rpx;
                color: #666666;
                margin-right: 12rpx;
              }

              .progress-line {
                flex-grow: 1;
                height: 10rpx;
                background: #ededf5;
                border-radius: 5rpx;
                margin-right: 10rpx;
                position: relative;

                text {
                  position: absolute;
                  left: -6rpx;
                  top: -6rpx;
                  bottom: 0;
                  min-width: 20rpx;
                  height: 20rpx;
                  background: #65d285;
                  border-radius: 10rpx;
                  border: 2rpx solid #ffffff;
                }
              }

              .number {
                font-size: 24rpx;
                color: #666666;
                margin-right: 18rpx;
              }

              .icon {
                color: #696b75;
                font-size: 24rpx;
              }
            }
          }
        }
      }
    }
  }

  .ai-icon {
    position: fixed;
    right: 13rpx;
    bottom: 6rpx;

    image {
      width: 112rpx;
    }
  }
}
</style>
