<template>
  <view class="weight-management-plan-page">
    <view class="page-title">
      <text>体重管理方案</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="plan-box">
      <view class="plan-title">
        <view class="left">
          <image
            class="word-icon"
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/weightManagementPlan/word.png"
          />

          <view class="des">
            <view class="des-item">
              <image
                mode="widthFix"
                src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/weightManagementPlan/icon1.png"
              />

              <text>智能定制</text>
            </view>

            <view class="des-item">
              <image
                mode="widthFix"
                src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/weightManagementPlan/icon1.png"
              />

              <text>真实有效</text>
            </view>
          </view>
        </view>

        <view class="right">
          <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/weightManagementPlan/icon2.png"
          />
        </view>
      </view>

      <view class="card-box">
        <view class="card-item1">
          <view class="card-title">
            <text>您的身体评测报告</text>
            <text @click="$toRouter('/pages/historyPlan/historyPlan')">历史记录</text>
          </view>

          <view class="card-title2">
            <text>根据您的身高体重测算，推荐BMI范围： </text>
          </view>

          <view class="chart-box">
            <view class="chart">
              <l-echart ref="chartRef1" @finished="init1" />
            </view>

            <view class="chart-data">
              <text>{{ lastPlanData.body_score }}</text>
              <text>身体评分</text>
            </view>
          </view>

          <view class="bmi">
            初始BMI值为：
            <text>{{ lastPlanData.plan_initial_bmi }}</text>
          </view>

          <view class="detail-box">
            <image
              class="icon"
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/weightManagementPlan/icon3.png"
            />

            <view class="detail-info1">
              <view class="title">指标详情</view>

              <view class="info">
                <text>性别: {{ userDetailInfo.gender === 1 ? '男' : '女' }}</text>
                <text>年龄: {{ lastPlanData.actual_age }}岁</text>
                <text>身高: {{ userDetailInfo.height }}cm</text>
                <text>体重: {{ lastPlanData.current_weight }}公斤</text>
              </view>
            </view>

            <view class="detail-info2">
              <view class="left">
                <view class="left-item">
                  <text class="name">体脂率</text>

                  <view class="value">
                    <text>{{ lastPlanData.body_fat_percentage }}%</text>
                    <text>{{ bodyStatus.fatStatus }}</text>
                  </view>
                </view>

                <view class="left-item">
                  <text class="name">身体年龄</text>

                  <view class="value">
                    <text>{{ lastPlanData.body_age }}岁</text>
                    <text>{{ bodyStatus.ageStatus }}</text>
                  </view>
                </view>

                <view class="left-item">
                  <text class="name">基础代谢率</text>

                  <view class="value">
                    <text>{{ lastPlanData.plan_initial_bmr }}千卡/日</text>
                    <text v-if="realBMIScore === 1">偏低</text>
                    <text v-else-if="realBMIScore === 2">正常</text>
                    <text v-else>偏高</text>
                  </view>
                </view>
              </view>

              <view class="middle">
                <image
                  class="icon"
                  mode="widthFix"
                  src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/weightManagementPlan/icon4.png"
                />
              </view>

              <view class="right">
                <view class="right-item">
                  <text class="name">BMI</text>

                  <view class="value">
                    <text>{{ realBMI }}</text>
                  </view>
                </view>

                <view class="evaluate">
                  <view class="measure">
                    <view class="line">
                      <view class="line-item" v-for="(item, index) of scoreList" :key="item">
                        <text :style="{ visibility: realBMIScore === index + 1 ? '' : 'hidden' }"></text>
                        <text></text>
                        <text>{{ item }}</text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="chart-item2">
          <view class="card-title">
            <text>瘦身目标</text>
          </view>

          <view class="card-title2">
            预计在
            <text>{{ lastPlanData.end_date && lastPlanData.end_date.slice(0, 10) }}</text>
            达到
            <text>{{ lastPlanData.plan_target_weight }}KG</text>
          </view>

          <view class="chart">
            <l-echart ref="chartRef" @finished="init" />
          </view>
        </view>
      </view>

      <view class="cookbook-box">
        <view class="cookbook-title">每日食谱</view>

        <view class="time-nav">
          <view class="time-item" v-for="(item, key) of dateList" :key="key" @click="selectDateKey = key">
            <text class="date">{{ key.slice(5, 10) }}</text>
            <text class="line" :style="{ background: selectDateKey === key ? '#5664E5' : 'translate' }"></text>
          </view>
        </view>

        <view class="cookbook-list">
          <view
            class="cookbook-item"
            :style="{ background: foodBgColorList[key] }"
            v-for="(item, key) of dateList[selectDateKey]"
            :key="key"
          >
            <view class="cookbook-title">
              <text>{{ currentFoodData(item, key).typeName }}</text>
              <text>{{ currentFoodData(item).currentCalorie }}千卡（{{ currentFoodData(item).ratio }}%）</text>
            </view>

            <view class="food-list">
              <view class="food-item" v-for="(item1, key1) of item" :key="key1">
                <text>{{ item1.name }}</text>
                <text>{{ item1.calorie }}千卡/{{ item1.weight }}克</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="plan-item motion-plan" :class="{ vip: isVip }">
        <view class="plan-name">定制化运动方案</view>

        <view class="plan-detail1" v-if="isVip">
          <view class="progress">
            <text :style="{ width: exercisesProgress.progress + '%' }"></text>
          </view>

          <view class="progress-tip">
            <text>减重计划</text>
            <text>第{{ exercisesProgress.finishDay }}/{{ exercisesProgress.totalDay }}天</text>
          </view>

          <view class="time-nav">
            <view class="time-item" v-for="(item, key) of dateList" :key="key" @click="selectDateKey1 = key">
              <text class="date">{{ isToday(key) ? '今日训练' : key.slice(5, 10) }}</text>
              <text class="line" :style="{ background: selectDateKey1 === key ? '#5664E5' : 'translate' }"></text>
            </view>
          </view>

          <view class="exercises-list">
            <view class="exercises-item" v-for="item of exercisesPlanData" :key="item.id">
              <image mode="widthFix" :src="item.image_url" />

              <view class="info">
                <view class="name">{{ item.name }}</view>

                <view class="content">
                  <text>{{ item.content }}</text>
                  <text>{{ item.calorie }}千卡</text>
                </view>
              </view>

              <template v-if="isNotStart">
                <view class="no-start">未完成</view>
              </template>

              <view @click.capture.stop="onCheckboxClick(item)" v-else>
                <checkbox-group>
                  <checkbox value="1" :checked="item.is_completed.includes('1')" />
                </checkbox-group>
              </view>
            </view>
          </view>
        </view>

        <view class="no-permission" v-else>
          <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/weightManagementPlan/lock.png"
          />

          <text>会员专享</text>
        </view>
      </view>

      <view class="plan-item life-plan" :class="{ vip: isVip }">
        <view class="plan-name">定制化生活方案</view>

        <view class="plan-detail2" v-if="isVip">
          <view class="replace" @click="refreshLife">换一换</view>

          <view class="left-title">今日生活计划</view>

          <view class="life-list">
            <view class="life-item" v-for="item of lifestylePlanData" :key="item.category">
              <image mode="widthFix" :src="item.image_url" />

              <view class="info">
                <view class="name">{{ item.content }}</view>
                <view class="content">{{ item.benefit }}</view>
              </view>
            </view>
          </view>
        </view>

        <view class="no-permission" v-else>
          <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/weightManagementPlan/lock.png"
          />

          <text>会员专享</text>
        </view>
      </view>

      <view class="unlock" v-if="!isVip">
        <text @click="$toRouter('/pages/vip/vip')">解锁会员体验更多功能</text>
      </view>

      <view class="unlock" v-else>
        <text @click="recode">去记录</text>
      </view>
    </view>

    <add-motion-recode-dialog ref="addMotionRecodeDialog" @addRecode="addMotionRecode" />
  </view>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import * as echarts from '@/uni_modules/lime-echart/static/echarts.min';
import $http from '@/utils/http';
import AddMotionRecodeDialog from '@/components/addMotionRecodeDialog.vue';

let chart = null;
let chart1 = null;

export default {
  name: 'weightManagementPlan',

  components: {
    AddMotionRecodeDialog,
  },

  data() {
    return {
      lastPlanData: {},
      weighData: {},
      dateList: [],
      selectDateKey: null,
      selectDateKey1: null,
      option: {
        title: {
          show: false,
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          bottom: 0,
          show: false,
        },
        grid: {
          top: '15%',
          left: '5%',
          right: '5%',
          bottom: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: [],
          boundaryGap: false,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '体重',
            data: [],
            type: 'line',
            color: '#FFA537',
            areaStyle: {
              color: '#FFEDD7',
            },
            label: {
              show: true,
              position: 'top',
              color: '#999999',
              fontSize: 12,
            },
          },
        ],
      },
      exercisesPlanData: [],
      scoreList: ['偏瘦', '正常', '偏胖', '超胖'],
      foodBgColorList: ['#F2F5FF', '#FEFBEC', '#EEF6E6', '#F2F5FF', '#FEFBEC', '#EEF6E6'],
      option1: {
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 100,
            center: ['50%', '100%'], // 水平居中，垂直方向下移一点（默认是 '50%', '50%'）
            radius: '75%',
            axisLine: {
              lineStyle: {
                width: 15,
              },
            },
            pointer: {
              show: false,
            },
            axisTick: {
              distance: -17,
              length: 19,
              lineStyle: {
                color: '#fff',
                width: 4,
              },
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
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

  onShow() {
    this.getLastPlanData();
    this._getUserInfo();
    this._getLifestyle();
  },

  computed: {
    ...mapState('app', ['userInfo', 'lifestylePlanData', 'userDetailInfo']),
    ...mapGetters('app', ['isVip']),

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

    isWeightLoss() {
      return this.lastPlanData.plan_initial_weight - this.lastPlanData.plan_target_weight > 0;
    },

    exercisesProgress() {
      if (!this.lastPlanData.end_date) {
        return {};
      }

      let total =
        new Date(this.lastPlanData.end_date.replace(/-/g, '/')) -
        new Date(this.lastPlanData.start_date.replace(/-/g, '/'));
      let totalDay = Math.ceil(total / (24 * 60 * 60 * 1000));

      let finish = new Date() - new Date(this.lastPlanData.start_date.replace(/-/g, '/'));
      let finishDay = Math.ceil(finish / (24 * 60 * 60 * 1000));

      let progress = (finishDay / totalDay) * 100;

      if (progress < 0) {
        progress = 0;
      } else if (progress > 100) {
        progress = 100;
      }

      return {
        totalDay,
        finishDay,
        progress: progress,
      };
    },

    isNotStart() {
      if (!this.selectDateKey1) {
        return undefined;
      }

      let time = new Date(this.selectDateKey1.replace(/-/g, '/')).getDate();
      let now = new Date().getDate();

      return time !== now;
    },

    isToday() {
      return (time) => {
        let time1 = new Date(time.replace(/-/g, '/')).getDate();
        let now = new Date().getDate();

        return time1 === now;
      };
    },

    realBMI() {
      if (this.userDetailInfo) {
        return Number(
          (
            this.userDetailInfo.current_weight /
            ((this.userDetailInfo.height * this.userDetailInfo.height) / 10000)
          ).toFixed(1),
        );
      }

      return undefined;
    },

    realBMIScore() {
      if (this.realBMI < 18.5) {
        return 1;
      } else if (this.realBMI >= 18.5 && this.realBMI <= 24.9) {
        return 2;
      } else if (this.realBMI > 24.9) {
        return 3;
      } else {
        return 4;
      }
    },

    bodyStatus() {
      let result = {};

      if (this.userDetailInfo) {
        if (this.lastPlanData.body_age <= this.lastPlanData.actual_age) {
          result.ageStatus = '正常';
        } else {
          result.ageStatus = '偏高';
        }

        // 男
        if (this.userDetailInfo.gender === 1) {
          if (this.lastPlanData.body_fat_percentage < 10) {
            result.fatStatus = '偏低';
          } else if (this.lastPlanData.body_fat_percentage >= 10 && this.lastPlanData.body_fat_percentage <= 20) {
            result.fatStatus = '正常';
          } else {
            result.fatStatus = '偏高';
          }
        } else {
          if (this.lastPlanData.body_fat_percentage < 10) {
            result.fatStatus = '偏低';
          } else if (this.lastPlanData.body_fat_percentage >= 10 && this.lastPlanData.body_fat_percentage <= 20) {
            result.fatStatus = '正常';
          } else {
            result.fatStatus = '偏高';
          }
        }
      }

      return result;
    },
  },

  watch: {
    selectDateKey1(value) {
      this.getExercises(value);
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
    ...mapMutations('app', ['_setLifestyle']),
    ...mapActions('app', ['_getUserInfo', '_getLifestyle']),

    async init() {
      chart = await this.$refs.chartRef.init(echarts);
      chart.setOption(this.option);
    },

    async init1() {
      chart1 = await this.$refs.chartRef1.init(echarts);
      chart1.setOption(this.option1);
    },

    /**
     * 获取最新一次计划数据
     */
    getLastPlanData() {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http.get('api/diet-info/weight-plan/last').then((res) => {
        this.getRecodeWeightData(res.data.plan_id);

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
            this.selectDateKey1 = dateListKey;
          }

          dateList[dateListKey] = foodList;

          this.option1.series[0].data[0].value = res.data.body_score;

          let color = [];

          for (let i = 0; i < 100; i++) {
            if (i <= res.data.body_score) {
              color.push([i / 100, '#5664E5']);
            } else {
              color.push([i / 100, '#F2F5FF']);
            }
          }

          this.option1.series[0].axisLine.lineStyle.color = color;

          setTimeout(() => {
            chart1.setOption(this.option1);
          }, 500);
        });

        this.lastPlanData = res.data;
        this.dateList = dateList;
      });
    },

    /**
     * 获取当前计划已记录的体重数据
     */
    getRecodeWeightData(plan_id) {
      $http
        .post('api/diet-info/weight-plan-data', {
          plan_id,
        })
        .then((res) => {
          uni.hideLoading();

          res.data.weight_list = res.data.weight_list || [];
          this.weighData = res.data;

          this.option.xAxis.data = res.data.weight_list.map((item) => item.date_time.slice(6, 10));
          this.option.series[0].data = res.data.weight_list.map((item) => item.weight);

          this.option.series[0].label.formatter = (params) => {
            // params.dataIndex 是当前数据点的索引
            const index = params.dataIndex;
            const len = this.option.xAxis.data.length;

            // 只显示最后一个 (index === len - 1)
            if (index === len - 1) {
              return params.value; // 显示数值
            }
            return '';
          };

          setTimeout(() => {
            chart.setOption(this.option);
          }, 500);
        });
    },

    /**
     * 删除计划
     */
    deletePlan() {
      uni.showModal({
        title: '温馨提示',
        content: '确定要删除计划吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '加载中...',
              mask: true,
            });

            $http
              .post('api/diet-info/weight-plan/delete', {
                plan_id: this.lastPlanData.plan_id,
              })
              .then(() => {
                uni.hideLoading();

                uni.showToast({
                  title: '删除成功',
                  icon: 'none',
                  mask: true,
                });

                setTimeout(() => {
                  this.$toBack();
                }, 1000);
              });
          }
        },
      });
    },

    getExercises(time) {
      $http
        .post('api/diet-info/daily-exercises', {
          date: new Date(time.replace(/-/g, '/')).format(),
        })
        .then((res) => {
          res.data.forEach((item) => {
            if (item.is_completed) {
              item.is_completed = ['1'];
            } else {
              item.is_completed = [];
            }
          });

          this.exercisesPlanData = res.data;
        });
    },

    onCheckboxClick(item) {
      if (!item.is_completed.includes('1')) {
        uni.showModal({
          title: '温馨提示',
          content: '您确定完成了此项训练吗？',
          confirmText: '完成',
          success: (res) => {
            if (res.confirm) {
              item.is_completed = ['1'];

              uni.showLoading({
                title: '加载中...',
                mask: true,
              });

              $http
                .post('api/diet-info/complete-exercise', {
                  exercise_item_id: item.id,
                })
                .then(() => {
                  uni.hideLoading();

                  uni.showToast({
                    title: '操作成功',
                    icon: 'none',
                  });

                  this.getExercises();
                });
            }
          },
        });
      }
    },

    refreshLife() {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http
        .post(
          'api/diet-info/regenerate-lifestyle-advices',
          {},
          {
            timeout: 90000,
          },
        )
        .then((res) => {
          uni.hideLoading();
          this._setLifestyle(res.data);
        });
    },

    recode() {
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
            });
        });
    },
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
  background: #f6f7fb url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/weightManagementPlan/bg.png')
    left top/100% auto no-repeat;
}
</style>

<style scoped lang="scss">
.weight-management-plan-page {
  .page-title {
    background: #ffffff;
  }

  .banner {
    padding: calc(var(--page-title-height) + 9rpx) 0 0;
    background: #ffffff;
  }

  .plan-box {
    padding: 43rpx 30rpx 100rpx;

    .plan-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 54rpx;
      margin-bottom: 29rpx;

      .left {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 28rpx;

        .word-icon {
          width: 436rpx;
        }

        .des {
          height: 48rpx;
          padding: 0 16rpx;
          background: linear-gradient(90deg, #fbf6ff 0%, #f1f3ff 100%);
          border-radius: 24rpx;
          border: 1px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 21rpx;

          .des-item {
            display: flex;
            align-items: center;
            justify-content: center;

            image {
              width: 26rpx;
              margin-right: 9rpx;
            }

            text {
              font-size: 26rpx;
              color: #1a1a1a;
            }
          }
        }
      }

      .right {
        image {
          width: 197rpx;
        }
      }
    }

    .card-box {
      .card-item1 {
        background: #ffffff;
        padding: 36rpx 19rpx;
        border-radius: 20rpx;
        margin-bottom: 22rpx;

        .card-title {
          position: relative;
          z-index: 9;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20rpx;

          text {
            &:nth-child(1) {
              font-weight: 500;
              font-size: 30rpx;
              color: #1a1a1a;
            }

            &:nth-child(2) {
              font-size: 26rpx;
              color: #5168e6;
            }
          }
        }

        .card-title2 {
          font-size: 22rpx;
          color: #999999;
          margin-bottom: 55rpx;
        }

        .chart-box {
          height: 280rpx;
          position: relative;

          .chart {
            position: relative;
            top: -350rpx;
          }

          .chart-data {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 50rpx;
            z-index: 9;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 14rpx;

            text {
              &:nth-child(1) {
                font-weight: 500;
                font-size: 76rpx;
                color: #5664e5;
              }

              &:nth-child(2) {
                font-size: 22rpx;
                color: #999999;
              }
            }
          }
        }

        .bmi {
          width: 580rpx;
          height: 60rpx;
          margin: 0 auto 18rpx;
          background: #f2f5ff;
          border-radius: 30rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28rpx;
          color: #333333;

          text {
            color: #5664e5;
          }
        }

        .detail-box {
          .icon {
            width: 100%;
            margin-bottom: 12rpx;
          }

          .detail-info1 {
            padding: 17rpx 12rpx;
            margin-bottom: 48rpx;

            .title {
              font-weight: 500;
              font-size: 30rpx;
              color: #111111;
              margin-bottom: 31rpx;
            }

            .info {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10rpx;

              text {
                width: 150px;
                height: 52rpx;
                background: #ffffff;
                border-radius: 10rpx;
                white-space: nowrap;
                border: 1px solid #e7e7e7;
                font-size: 22rpx;
                color: #666666;
                display: flex;
                align-items: center;
                justify-content: center;
              }
            }
          }

          .detail-info2 {
            display: flex;
            align-items: center;

            .left {
              display: flex;
              flex-direction: column;
              gap: 55rpx;
            }

            .left-item,
            .right-item {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              gap: 12rpx;
              position: relative;

              .name {
                color: #333333;
                font-size: 22rpx;
              }

              .value {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 30rpx;

                text {
                  &:nth-child(1) {
                    color: #5664e5;
                    font-size: 30rpx;
                  }

                  &:nth-child(2) {
                    height: 32rpx;
                    background: #5664e5;
                    border-radius: 5rpx;
                    font-size: 22rpx;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0 6rpx;
                  }
                }
              }
            }

            .middle {
              flex-grow: 1;

              .icon {
                width: 178rpx;
              }
            }

            .right {
              .right-item {
                margin-bottom: 30rpx;

                .name {
                  align-self: flex-end;
                }

                .value {
                  align-self: flex-end;
                }
              }

              .evaluate {
                .measure {
                  .line {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 4rpx;

                    .line-item {
                      display: flex;
                      align-items: center;
                      justify-content: center;

                      text {
                        &:nth-child(1) {
                          border-left: 12rpx solid #666666;
                          border-right: 12rpx solid transparent;
                          border-top: 12rpx solid transparent;
                          border-bottom: 12rpx solid transparent;
                        }

                        &:nth-child(2) {
                          width: 12rpx;
                          height: 48rpx;
                          margin-right: 5rpx;
                        }

                        &:nth-child(3) {
                          font-size: 22rpx;
                          color: #999999;
                          white-space: nowrap;
                        }
                      }

                      &:nth-child(1) {
                        text {
                          &:nth-child(2) {
                            background: linear-gradient(0deg, #5aff8a 0%, #83dff4 100%);
                            border-radius: 6rpx 6rpx 0rpx 0rpx;
                          }
                        }
                      }

                      &:nth-child(2) {
                        text {
                          &:nth-child(2) {
                            width: 12rpx;
                            height: 68rpx;
                            background: linear-gradient(0deg, #f4c839 0%, #64fd83 100%);
                          }
                        }
                      }

                      &:nth-child(3) {
                        text {
                          &:nth-child(2) {
                            background: linear-gradient(0deg, #ff725a 0%, #fcbd35 100%);
                          }
                        }
                      }

                      &:nth-child(4) {
                        text {
                          &:nth-child(2) {
                            background: #fe6e61;
                            border-radius: 0rpx 0rpx 6rpx 6rpx;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      .chart-item2 {
        background: #ffffff;
        padding: 29rpx 19rpx;
        border-radius: 20rpx;
        margin-bottom: 20rpx;

        .card-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 50rpx;

          text {
            &:nth-child(1) {
              font-weight: 500;
              font-size: 30rpx;
              color: #1a1a1a;
            }

            &:nth-child(2) {
              font-size: 26rpx;
              color: #5168e6;
            }
          }
        }

        .card-title2 {
          color: #1a1a1a;
          font-size: 26rpx;

          text {
            color: #5664e5;
            font-size: 30rpx;
          }
        }
      }
    }

    .cookbook-box {
      padding: 38rpx 19rpx;
      align-self: stretch;
      background: #ffffff;
      border-radius: 20rpx;
      margin-bottom: 20rpx;

      .cookbook-title {
        font-weight: 500;
        font-size: 30rpx;
        color: #1a1a1a;
        margin-bottom: 33rpx;
      }

      .time-nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 18rpx;

        .time-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          .date {
            font-size: 24rpx;
            color: #1a1a1a;
            padding-bottom: 14rpx;
          }

          .line {
            width: 60rpx;
            height: 5rpx;
          }
        }
      }

      .cookbook-list {
        display: flex;
        flex-direction: column;
        gap: 20rpx;

        .cookbook-item {
          border-radius: 20rpx;
          padding: 24rpx;

          .cookbook-title {
            display: flex;
            align-items: center;
            margin-bottom: 26rpx;

            text {
              &:nth-child(1) {
                font-size: 28rpx;
                color: #1a1a1a;
                margin-right: 14rpx;
              }

              &:nth-child(2) {
                font-size: 22rpx;
                color: #5664e5;
              }
            }
          }

          .food-list {
            display: flex;
            flex-direction: column;
            gap: 20rpx;

            .food-item {
              display: flex;
              align-items: center;
              justify-content: space-between;

              text {
                font-size: 22rpx;
                color: #1a1a1a;
              }
            }
          }
        }
      }
    }

    .plan-item {
      align-self: stretch;
      background: #ffffff;
      border-radius: 20rpx;
      padding: 38rpx 19rpx;
      margin-bottom: 20rpx;
      position: relative;

      &.life-plan {
        margin-bottom: 30rpx;
      }

      &.vip {
        background: linear-gradient(180deg, rgba(204, 255, 238, 0.9) 0%, rgba(255, 255, 255, 0.93) 25%, #ffffff 100%);
      }

      .plan-name {
        font-weight: 500;
        font-size: 30rpx;
        color: #1a1a1a;
      }

      .plan-detail1 {
        .progress {
          margin: 44rpx 0 25rpx;
          height: 18rpx;
          background: #f6f7fb;
          border-radius: 9rpx;
          position: relative;

          text {
            position: absolute;
            height: 18rpx;
            background: #5664e5;
            border-radius: 9rpx;
          }
        }

        .progress-tip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 50rpx;

          text {
            font-size: 26rpx;

            &:nth-child(1) {
              color: #333333;
            }

            &:nth-child(2) {
              color: #555555;
            }
          }
        }

        .time-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18rpx;

          .time-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .date {
              font-size: 24rpx;
              color: #1a1a1a;
              padding-bottom: 14rpx;
            }

            .line {
              width: 60rpx;
              height: 5rpx;
            }
          }
        }

        .exercises-list {
          display: flex;
          flex-direction: column;
          gap: 20rpx;

          .exercises-item {
            background: #f6f7fb;
            padding: 16rpx;
            display: flex;
            border-radius: 20rpx;
            align-items: center;

            image {
              width: 80rpx;
              border-radius: 20rpx;
              margin-right: 26rpx;
            }

            .info {
              flex-grow: 1;
              display: flex;
              flex-direction: column;
              gap: 15rpx;

              .name {
                font-size: 26rpx;
                color: #333333;
              }

              .content {
                text {
                  color: #fd6a97;
                  font-size: 22rpx;
                }
              }
            }

            .no-start {
              font-size: 24rpx;
              color: #999999;
            }

            checkbox {
              transform: scale(0.6);
            }
          }
        }
      }

      .plan-detail2 {
        .replace {
          position: absolute;
          right: 20rpx;
          top: 42rpx;
          font-size: 24rpx;
          color: #5765e5;
        }

        .left-title {
          padding: 48rpx 0 30rpx;
          font-size: 26rpx;
          color: #333333;
        }

        .life-list {
          display: flex;
          flex-direction: column;
          gap: 20rpx;

          .life-item {
            display: flex;
            align-items: center;

            image {
              width: 80rpx;
              border-radius: 20rpx;
              margin-right: 26rpx;
            }

            .info {
              flex-grow: 1;
              display: flex;
              flex-direction: column;
              gap: 15rpx;

              .name {
                font-size: 26rpx;
                color: #333333;
              }

              .content {
                font-size: 22rpx;
                color: #999999;
              }
            }
          }
        }
      }

      .no-permission {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 50rpx 0;

        image {
          width: 60rpx;
          margin-bottom: 20rpx;
        }

        text {
          font-size: 26rpx;
          color: #333333;
        }
      }
    }

    .unlock {
      display: flex;
      align-items: center;
      justify-content: center;

      text {
        width: 590rpx;
        height: 100rpx;
        background: linear-gradient(90deg, #4f69e6 0%, #6b56e3 100%);
        border-radius: 50rpx;
        font-size: 32rpx;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
