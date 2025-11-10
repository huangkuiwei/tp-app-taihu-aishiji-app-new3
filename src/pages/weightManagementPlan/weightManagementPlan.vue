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
        <image
          class="word-icon1"
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/weightManagementPlan/word1.png"
        />

        <image
          class="word-icon2"
          mode="widthFix"
          src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/weightManagementPlan/word2.png"
        />

        <view class="des">
          <view class="des-item">
            <image
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/weightManagementPlan/icon1.png"
            />

            <text>智能定制</text>
          </view>

          <view class="des-item">
            <image
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/weightManagementPlan/icon1.png"
            />

            <text>高效达成</text>
          </view>

          <view class="des-item">
            <image
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/weightManagementPlan/icon1.png"
            />

            <text>真实蜕变</text>
          </view>
        </view>
      </view>

      <view class="card-box">
        <view class="card-item1">
          <view class="card-title">
            <text>您的身体评测报告</text>
            <!--<text @click="$toRouter('/pages/historyPlan/historyPlan')">历史记录</text>-->
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
                  src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app4/weightManagementPlan/body.png"
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

        <view class="chart-item2-box">
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

        <view class="food-plan-box">
          <view class="food-plan" v-if="isVip">
            <view class="plan-name">专属饮食方案</view>

            <!-- TODO vip 方案数据 -->
            <view class="plan-detail">
              <view class="detail1">
                <view class="detail-title">方案要点</view>

                <view class="content">
                  <view class="content-item">
                    <text>01</text>
                    <text>注意菜肴的成熟度，蔬菜断生即可，可生食的蔬菜宜生食。</text>
                  </view>

                  <view class="content-item">
                    <text>02</text>
                    <text>注意进餐顺序，优先吃蛋白质(类似吃2-3口菜肴，再吃1口主食)</text>
                  </view>

                  <view class="content-item">
                    <text>03</text>
                    <text>注意进餐顺序，优先吃蛋白质(类似吃2-3口菜肴，再吃1口主食)</text>
                  </view>
                </view>
              </view>

              <view class="detail2">
                <view class="detail-title">热量预算与营养配比</view>

                <view class="content">
                  <view class="calorie">
                    <text>热量预算：</text>
                    <text>1000千卡</text>
                  </view>

                  <view class="ratio">
                    <view class="ratio-title">三大营养比例</view>

                    <view class="calorie-type">
                      <view class="calorie-item">
                        <view class="name">脂肪</view>
                        <view class="progress" style="background: #e6e6e6"> </view>
                        <view class="value">
                          <text>{{ 0 }}/</text>
                          <text>{{ 50 }}克</text>
                        </view>
                      </view>

                      <view class="calorie-item">
                        <view class="name">碳水</view>
                        <view class="progress" style="background: #e6e6e6"> </view>
                        <view class="value">
                          <text>{{ 0 }}/</text>
                          <text>{{ 50 }}克</text>
                        </view>
                      </view>

                      <view class="calorie-item">
                        <view class="name">蛋白质</view>
                        <view class="progress" style="background: #e6e6e6"> </view>
                        <view class="value">
                          <text>{{ 0 }}/</text>
                          <text>{{ 50 }}克</text>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>

              <view class="detail3">
                <view class="detail-title">热量预算与营养配比</view>

                <view class="content">
                  <view class="content-item">
                    <view></view>
                    <view class="content-title">食物类别</view>
                    <view>水果</view>
                    <view>蔬菜</view>
                    <view>奶类</view>
                    <view>蛋类</view>
                    <view>肉类</view>
                    <view>精制谷类</view>
                    <view>杂粮</view>
                    <view>薯类食材</view>
                    <view></view>
                  </view>

                  <view class="content-item">
                    <view></view>
                    <view class="content-title">每日重量</view>
                    <view>300g</view>
                    <view>300g</view>
                    <view>300g</view>
                    <view>300g</view>
                    <view>300g</view>
                    <view>300g</view>
                    <view>300g</view>
                    <view>300g</view>
                    <view></view>
                  </view>

                  <view class="content-item">
                    <view></view>
                    <view class="content-title">每日热量</view>
                    <view>140kcal</view>
                    <view>140kcal</view>
                    <view>140kcal</view>
                    <view>140kcal</view>
                    <view>140kcal</view>
                    <view>140kcal</view>
                    <view>140kcal</view>
                    <view>140kcal</view>
                    <view></view>
                  </view>
                </view>
              </view>

              <view class="detail4">
                <view class="detail-title">注意事项</view>

                <view class="content">
                  <view class="content-item">
                    <text>01</text>
                    <text>避免油煎、快餐、炸、爆炒、烧烤食品(糕点、地 瓜大枣、甜菜肉饼、汉堡、披萨、膨化食品)。</text>
                  </view>

                  <view class="content-item">
                    <text>02</text>
                    <text>避免油煎、快餐、炸、爆炒、烧烤食品(糕点、地 瓜大枣、甜菜肉饼、汉堡、披萨、膨化食品)。</text>
                  </view>

                  <view class="content-item">
                    <text>03</text>
                    <text>避免油煎、快餐、炸、爆炒、烧烤食品(糕点、地 瓜大枣、甜菜肉饼、汉堡、披萨、膨化食品)。</text>
                  </view>
                </view>
              </view>
            </view>
          </view>

          <view class="no-permission" v-else>
            <view class="plan-name">专属饮食方案</view>

            <view class="permission-tip">
              <image
                mode="widthFix"
                src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/weightManagementPlan/lock.png"
              />

              <text>会员专享</text>
            </view>
          </view>
        </view>
      </view>

      <view class="unlock" v-if="!isVip">
        <text @click="$toRouter('/pages/vip/vip')">解锁会员体验更多功能</text>
      </view>

      <view class="unlock" v-else>
        <text @click="previewFoodPlan">查看食谱计划</text>
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
              color.push([i / 100, '#65D285']);
            } else {
              color.push([i / 100, '#ECFDF2']);
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

    // TODO 食谱计划
    previewFoodPlan() {
      this.$toRouter('/pages/recipePlan/recipePlan');
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
  background: #f6f7fb linear-gradient(180deg, #b3f5e7 0%, #f1fcf8 100%) left top/100% 850rpx no-repeat;
}
</style>

<style scoped lang="scss">
.weight-management-plan-page {
  .page-title {
  }

  .banner {
    padding: calc(var(--page-title-height) + 57rpx) 0 0;
  }

  .plan-box {
    padding: 0 0 100rpx;

    .plan-title {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-bottom: 41rpx;

      .word-icon1 {
        width: 545rpx;
        margin-bottom: 28rpx;
      }

      .word-icon2 {
        width: 461rpx;
        margin-bottom: 31rpx;
      }

      .des {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15rpx;

        .des-item {
          height: 48rpx;
          padding: 0 16rpx;
          background: #ffffff;
          border-radius: 24rpx;
          border: 1px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;

          image {
            width: 22rpx;
            margin-right: 12rpx;
          }

          text {
            font-size: 24rpx;
            color: #1a1a1a;
          }
        }
      }
    }

    .card-box {
      margin-bottom: 62rpx;

      .card-item1 {
        background: #ffffff;
        padding: 36rpx 49rpx;
        border-radius: 30rpx;
        margin-bottom: 29rpx;

        .card-title {
          position: relative;
          z-index: 9;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20rpx;

          text {
            &:nth-child(1) {
              font-weight: 500;
              font-size: 30rpx;
              color: #1a1a1a;
            }

            // &:nth-child(2) {
            //   font-size: 26rpx;
            //   color: #5168e6;
            // }
          }
        }

        .card-title2 {
          text-align: center;
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
                color: #65d285;
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
          background: #ecfdf2;
          border-radius: 30rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28rpx;
          color: #333333;

          text {
            color: #65d285;
          }
        }

        .detail-box {
          .icon {
            width: 100%;
            margin-bottom: 12rpx;
          }

          .detail-info1 {
            padding: 17rpx 12rpx;
            margin-bottom: 20rpx;

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
              gap: 75rpx;
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
                    color: #65d285;
                    font-size: 30rpx;
                  }

                  &:nth-child(2) {
                    height: 32rpx;
                    background: #65d285;
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
                width: 201rpx;
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

      .chart-item2-box {
        padding: 0 30rpx;

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
            font-weight: bold;
            font-size: 26rpx;
            color: #1a1a1a;

            text {
              color: #65d285;
              font-size: 30rpx;
            }
          }
        }
      }

      .food-plan-box {
        padding: 0 30rpx;

        .plan-name {
          font-weight: 500;
          font-size: 30rpx;
          color: #1a1a1a;
        }

        .food-plan {
          .plan-detail {
            margin-top: 31rpx;

            .detail-title {
              background: linear-gradient(-90deg, #65d285 0%, #79e69f 100%);
              border-radius: 0 30rpx 30rpx 0;
              height: 60rpx;
              padding: 0 27rpx;
              font-weight: 500;
              font-size: 30rpx;
              color: #ffffff;
              display: inline-flex;
              align-items: center;
              justify-content: center;
            }

            .detail1,
            .detail4 {
              background: #ffffff;
              border-radius: 20rpx;
              padding: 0 0 32rpx;
              margin-bottom: 30rpx;

              .content {
                margin-top: 38rpx;
                padding: 0 41rpx;
                display: flex;
                flex-direction: column;
                gap: 37rpx;

                .content-item {
                  display: flex;

                  text {
                    &:nth-child(1) {
                      flex-shrink: 0;
                      width: 42rpx;
                      height: 42rpx;
                      background: linear-gradient(0deg, #65d285 0%, #ecfdf2 100%);
                      border-radius: 21rpx;
                      font-weight: 500;
                      font-size: 26rpx;
                      color: #ffffff;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      margin-right: 19rpx;
                    }

                    &:nth-child(2) {
                      font-size: 26rpx;
                      color: #555555;
                      line-height: 35rpx;
                    }
                  }
                }
              }
            }

            .detail2 {
              background: #ffffff;
              border-radius: 20rpx;
              padding: 0 0 32rpx;
              margin-bottom: 30rpx;

              .content {
                margin-top: 38rpx;
                padding: 0 41rpx;

                .calorie {
                  display: flex;
                  align-items: center;
                  gap: 40rpx;
                  padding-bottom: 22rpx;
                  border-bottom: 1px solid #f6f7fb;
                  margin-bottom: 42rpx;

                  text {
                    color: #333333;

                    &:nth-child(1) {
                      font-size: 26rpx;
                    }

                    &:nth-child(2) {
                      font-size: 34rpx;
                    }
                  }
                }

                .ratio {
                  .ratio-title {
                    padding: 0 12rpx;
                    margin-bottom: 44rpx;
                    font-size: 26rpx;
                    color: #333333;
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
              }
            }

            .detail3 {
              background: #ffffff;
              border-radius: 20rpx;
              padding: 0 0 32rpx;
              margin-bottom: 30rpx;

              .content {
                margin-top: 20rpx;
                display: flex;
                align-items: center;

                .content-item {
                  width: 33.3%;
                  display: flex;
                  flex-direction: column;

                  &:nth-child(1) {
                    view:nth-child(2) {
                      border-top-left-radius: 20rpx;
                    }
                  }

                  &:nth-child(2) {
                    border-radius: 20rpx;

                    view {
                      background: linear-gradient(180deg, #effffb 0%, #eafff1 100%) !important;
                    }
                  }

                  &:nth-child(3) {
                    view:nth-child(2) {
                      border-top-right-radius: 2rpx;
                    }
                  }

                  view {
                    height: 77rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 26rpx;
                    color: #111111;

                    &:first-child,
                    &:last-child {
                      height: 40rpx;
                    }

                    &:nth-child(2n) {
                      background: #f6f7fb;
                    }
                  }
                }
              }
            }
          }
        }

        .no-permission {
          background: #ffffff;
          border-radius: 20rpx;
          padding: 38rpx 20rpx 107rpx;

          .permission-tip {
            margin-top: 46rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

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
      }
    }

    .unlock {
      display: flex;
      align-items: center;
      justify-content: center;

      text {
        width: 590rpx;
        height: 100rpx;
        background: #65d285;
        border-radius: 50rpx;
        font-size: 32rpx;
        color: #f6f7fb;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
}
</style>
