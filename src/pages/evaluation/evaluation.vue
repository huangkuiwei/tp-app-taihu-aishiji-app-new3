<template>
  <view class="evaluation-page">
    <view class="page-title">
      <text></text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="welcome">
      <view class="progress">
        <text :style="{ left: (stepIndex / 7) * 100 + '%', width: 100 / 7 + '%' }"></text>
      </view>

      <view class="tip">欢迎来到{{ appInfo.appName }}</view>
    </view>

    <view class="evaluation-container">
      <view class="evaluation-box">
        <view class="evaluation-title">
          <text>{{ evaluationList[stepIndex].title }}</text>
          <text>{{ evaluationList[stepIndex].subTitle }}</text>
        </view>

        <view class="evaluation evaluation1" v-if="stepIndex === 0">
          <view class="gender-list">
            <text
              :class="{ active: item.value === gender }"
              v-for="item of genderList"
              :key="item.value"
              @click="gender = item.value"
            >
              {{ item.text }}
            </text>
          </view>
        </view>

        <view class="evaluation evaluation2" v-show="stepIndex === 1">
          <picker-view
            indicator-style="height: 40px;"
            style="width: 100%; height: 200px"
            :value="birth"
            @change="birth = $event.detail.value"
          >
            <picker-view-column>
              <view
                class="column-item"
                :class="{ active: birth[0] === index }"
                v-for="(item, index) in years"
                :key="index"
              >
                <text>{{ item }}</text>
                <text v-if="birth[0] === index">年</text>
              </view>
            </picker-view-column>

            <picker-view-column>
              <view
                class="column-item"
                :class="{ active: birth[1] === index }"
                v-for="(item, index) in months"
                :key="index"
              >
                <text>{{ item }}</text>
                <text v-if="birth[1] === index">月</text>
              </view>
            </picker-view-column>
          </picker-view>
        </view>

        <view class="evaluation evaluation3" v-show="stepIndex === 2">
          <picker-view
            indicator-style="height: 40px;"
            style="width: 100%; height: 200px"
            :value="height"
            @change="height = $event.detail.value"
          >
            <picker-view-column>
              <view
                class="column-item"
                :class="{ active: height[0] === index }"
                v-for="(item, index) in rulerLineList1"
                :key="index"
              >
                <text>{{ item }}</text>
                <text v-if="height[0] === index">CM</text>
              </view>
            </picker-view-column>
          </picker-view>
        </view>

        <view class="evaluation evaluation4" v-show="stepIndex === 3">
          <picker-view
            indicator-style="height: 40px;"
            style="width: 100%; height: 200px"
            :value="initialWeight"
            @change="initialWeight = $event.detail.value"
          >
            <picker-view-column>
              <view
                class="column-item"
                :class="{ active: initialWeight[0] === index }"
                v-for="(item, index) in rulerLineList2"
                :key="index"
              >
                <text>{{ item }}</text>
                <text v-if="initialWeight[0] === index">KG</text>
              </view>
            </picker-view-column>
          </picker-view>
        </view>

        <view class="evaluation evaluation5" v-show="stepIndex === 4">
          <picker-view
            indicator-style="height: 40px;"
            style="width: 100%; height: 200px"
            :value="targetWeight"
            @change="targetWeight = $event.detail.value"
          >
            <picker-view-column>
              <view
                class="column-item"
                :class="{ active: targetWeight[0] === index }"
                v-for="(item, index) in rulerLineList3"
                :key="index"
              >
                <text>{{ item }}</text>
                <text v-if="targetWeight[0] === index">KG</text>
              </view>
            </picker-view-column>
          </picker-view>
        </view>

        <view class="evaluation evaluation6" v-show="stepIndex === 5">
          <picker-view
            indicator-style="height: 40px;"
            style="width: 100%; height: 200px"
            :value="end_date"
            @change="onPickerChange"
          >
            <!-- 年 -->
            <picker-view-column>
              <view
                class="column-item"
                :class="{ active: end_date[0] === index }"
                v-for="(year, index) in years1"
                :key="year"
              >
                <text>{{ year }}</text>
                <text v-if="end_date[0] === index">年</text>
              </view>
            </picker-view-column>

            <!-- 月 -->
            <picker-view-column>
              <view
                class="column-item"
                :class="{ active: end_date[1] === index }"
                v-for="(month, index) in months1"
                :key="month"
              >
                <text>{{ month }}</text>
                <text v-if="end_date[1] === index">月</text>
              </view>
            </picker-view-column>

            <!-- 日 -->
            <picker-view-column>
              <view
                class="column-item"
                :class="{ active: end_date[2] === index }"
                v-for="(day, index) in days1"
                :key="day"
              >
                <text>{{ day }}</text>
                <text v-if="end_date[2] === index">日</text>
              </view>
            </picker-view-column>
          </picker-view>
        </view>

        <view class="evaluation evaluation7" v-show="stepIndex === 6">
          <picker-view
            indicator-style="height: 40px;"
            style="width: 100%; height: 200px"
            :value="exerciseHabitsIndex"
            @change="exerciseHabitsIndex = $event.detail.value"
          >
            <picker-view-column>
              <view class="column-item" v-for="(item, index) in exerciseHabits.map((item) => item.text)" :key="index">
                <text>{{ item }}</text>
              </view>
            </picker-view-column>
          </picker-view>
        </view>

        <view class="evaluation-title2">
          <text>{{ evaluationList[stepIndex].subTitle2 }}</text>
        </view>

        <view class="next" @click="next">{{ stepIndex > 5 ? '提交' : '下一步' }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import $http from '@/utils/http';
import { mapState } from 'vuex';

export default {
  name: 'evaluation',

  data() {
    const years = [];
    const months = [];

    for (let i = 1925; i < 2025; i++) {
      years.push(i);
    }

    for (let i = 1; i <= 12; i++) {
      months.push(i < 10 ? '0' + i : i);
    }

    let rulerLineList1 = [];
    let rulerLineList2 = [];
    let rulerLineList3 = [];

    for (let i = 0; i < 305; i++) {
      rulerLineList1.push(i);
    }

    for (let i = 0; i < 401; i++) {
      rulerLineList2.push(Number((i * 0.5).toFixed(1)));
      rulerLineList3.push(Number((i * 0.5).toFixed(1)));
    }

    return {
      evaluationList: [
        {
          title: '你的性别',
          subTitle: '完成数据，为你提供个性化专属方案',
          subTitle2: '选择你的性别，用来准确计算你的BMI值',
        },
        {
          title: '你的出生年月',
          subTitle: '完成数据，为你提供个性化专属方案',
          subTitle2: '选择你的年龄，用来准确计算你的BMI值',
        },
        {
          title: '你的身高',
          subTitle: '完成数据，为你提供个性化专属方案',
          subTitle2: '选择你的身高，用来准确计算你的BMI值',
        },
        {
          title: '你的体重',
          subTitle: '完成数据，为你提供个性化专属方案',
          subTitle2: '选择你的体重，用来准确计算你的BMI值',
        },
        {
          title: '你的目标体重',
          subTitle: '完成数据，为你提供个性化专属方案',
          subTitle2: '选择你的目标体重，用来估算你的减重周期',
        },
        {
          title: '你的目标日期',
          subTitle: '完成数据，为你提供个性化专属方案',
          subTitle2: '选择你的目标日期，用来估算你的减重量',
        },
        {
          title: '你的运动量',
          subTitle: '完成数据，为你提供个性化专属方案',
          subTitle2: '选择你的运动量，为你提供相关的运动建议',
        },
      ],
      stepIndex: 0,
      gender: null,
      genderList: [
        {
          value: 1,
          text: '男',
        },
        {
          value: 2,
          text: '女',
        },
      ],
      years,
      months,
      birth: [80, 0],
      rulerLineList1: rulerLineList1,
      height: [170],
      rulerLineList2: rulerLineList2,
      initialWeight: [140],
      rulerLineList3: rulerLineList3,
      targetWeight: [120],
      exerciseHabits: [
        {
          id: 0,
          value: 1,
          text: '几乎不运动',
          active: true,
        },
        {
          id: 1,
          value: 2,
          text: '偶尔运动，每周1-2天',
          active: false,
        },
        {
          id: 2,
          value: 3,
          text: '经常运动，每周3-5天',
          active: false,
        },
        {
          id: 3,
          value: 4,
          text: '运动频繁，每周6-7天',
          active: false,
        },
        {
          id: 4,
          value: 5,
          text: '高强度运动，长时间体力运动',
          active: false,
        },
      ],
      exerciseHabitsIndex: 0,
      planData: null,

      dateMap: new Map(),
      years1: [],
      months1: [],
      days1: [],
      end_date: [0, 0, 0],
      minDateStr: '',
      selectedDate: '',
    };
  },

  computed: {
    ...mapState('app', ['appInfo']),
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/share-img.jpg',
      path: '/pages/index/index',
    };
  },

  watch: {
    minDateStr(value) {
      const minDate = new Date(value);

      if (isNaN(minDate)) {
        throw new Error('最小日期格式无效，请使用 yyyy-MM-dd');
      }

      minDate.setHours(0, 0, 0, 0);

      // 生成从 minDate 开始，到未来几年内的所有合法日期（比如到 2026 年）
      const validDates = this.generateValidDateRange(minDate, 2026);

      // 构建层级映射：year → month → day（字符串）
      const dateMap = new Map();
      const yearSet = new Set();

      validDates.forEach((d) => {
        const y = String(d.year);
        const m = d.month < 10 ? `0${d.month}` : `${d.month}`;
        const dd = d.day < 10 ? `0${d.day}` : `${d.day}`;

        yearSet.add(y);
        if (!dateMap.has(y)) dateMap.set(y, new Map());
        if (!dateMap.get(y).has(m)) dateMap.get(y).set(m, new Set());
        dateMap.get(y).get(m).add(dd);
      });

      this.dateMap = dateMap;

      // 初始化选项
      this.years1 = Array.from(yearSet).sort((a, b) => a - b);
      this.months1 = dateMap.has(this.years1[0]) ? Array.from(dateMap.get(this.years1[0]).keys()).sort() : [];
      this.days1 = this.months1.length > 0 ? Array.from(dateMap.get(this.years1[0]).get(this.months1[0])).sort() : [];
    },
  },

  methods: {
    // 生成从 minDate 到 maxYear 年末的所有合法日期
    generateValidDateRange(minDate, maxYear = 2026) {
      const result = [];
      let currentDate = new Date(minDate);

      while (currentDate.getFullYear() <= maxYear) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();

        result.push({ year, month, day });

        // 下一天
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return result;
    },

    // 滚动选择时触发
    onPickerChange(e) {
      const [yIdx, mIdx, dIdx] = e.detail.value;
      const selectedYear = this.years1[yIdx];
      const selectedMonth = this.months1[mIdx];

      // 获取该年月下的可选日期
      const daySet = this.dateMap.get(selectedYear)?.get(selectedMonth);
      let validDays = [];

      if (daySet) {
        validDays = Array.from(daySet).sort();
      } else {
        let monthList = Array.from(this.dateMap.get(selectedYear).keys()).sort();
        let daySet1 = this.dateMap.get(selectedYear)?.get(monthList[0]);
        validDays = Array.from(daySet1).sort();
      }

      // 修正日索引（防止越界）
      let newDayIdx = dIdx;
      if (dIdx >= validDays.length) {
        newDayIdx = 0;
      }
      const selectedDay = validDays[newDayIdx];

      // 更新 data
      this.months1 = Array.from(this.dateMap.get(selectedYear)?.keys() || []).sort();
      this.days1 = validDays;

      // 修正月份（如果原月份不在新列表中）
      const actualMonth = this.months1.includes(selectedMonth) ? selectedMonth : this.months1[0];
      const actualDay = validDays.includes(selectedDay) ? selectedDay : validDays[0];

      // 修正 end_date
      setTimeout(() => {
        this.end_date = [yIdx, this.months1.indexOf(actualMonth), validDays.indexOf(actualDay)];
      }, 0);

      // 更新显示
      this.selectedDate = `${selectedYear}/${actualMonth}/${actualDay}`;
    },

    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },

    async next() {
      if (this.stepIndex === 0) {
        if (!this.gender) {
          uni.showToast({
            title: '请选择性别',
            icon: 'none',
          });

          return;
        }
      }

      if (this.stepIndex === 4) {
        uni.showLoading({
          title: '加载中...',
          mask: true,
        });

        setTimeout(() => {
          let weight = Math.abs(this.initialWeight[0] / 2 - this.targetWeight[0] / 2);
          let time = Date.now() + 7 * 24 * 60 * 60 * 1000 * Math.ceil(weight / 0.5);
          let time1 = Date.now() + 7 * 24 * 60 * 60 * 1000 * Math.ceil(weight / 1);

          let currentDate = new Date(time);
          let currentDate1 = new Date(time1);

          const year = currentDate.getFullYear();
          const month = currentDate.getMonth() + 1 > 9 ? currentDate.getMonth() + 1 : `0${currentDate.getMonth() + 1}`;
          const date = currentDate.getDate() > 9 ? currentDate.getDate() : `0${currentDate.getDate()}`;

          const year1 = currentDate1.getFullYear();
          const month1 =
            currentDate1.getMonth() + 1 > 9 ? currentDate1.getMonth() + 1 : `0${currentDate1.getMonth() + 1}`;
          const date1 = currentDate1.getDate() > 9 ? currentDate1.getDate() : `0${currentDate1.getDate()}`;

          this.minDateStr = `${year1}/${month1}/${date1}`;

          setTimeout(() => {
            let index1 = this.years1.findIndex((item) => Number(item) === Number(year));
            this.end_date = [index1, 0, 0];

            this.onPickerChange({
              detail: {
                value: this.end_date,
              },
            });

            setTimeout(() => {
              let index2 = this.months1.findIndex((item) => Number(item) === Number(month));
              this.end_date = [index1, index2, 0];

              this.onPickerChange({
                detail: {
                  value: this.end_date,
                },
              });

              setTimeout(() => {
                let index3 = this.days1.findIndex((item) => Number(item) === Number(date));
                this.end_date = [index1, index2, index3];

                this.onPickerChange({
                  detail: {
                    value: this.end_date,
                  },
                });

                setTimeout(() => {
                  uni.hideLoading();
                }, 200);
              }, 0);
            }, 0);
          });
        }, 0);
      }

      if (this.stepIndex === 6) {
        uni.showLoading({
          title: '加载中...',
          mask: true,
        });

        await this.sleep(2000);

        let birth_year = this.years[this.birth[0]].toString() + '/' + this.months[this.birth[1]].toString() + '/01';

        $http
          .post('api/diet-info/user-info/update', {
            gender: this.gender,
            birth_year: new Date(birth_year).format(),
            height: this.height[0],
            initial_weight: this.initialWeight[0] / 2,
            target_weight: this.targetWeight[0] / 2,
            exercise_habits: this.exerciseHabits[this.exerciseHabitsIndex].value,
            begin_date: new Date().format(),
            end_date: new Date(this.selectedDate).format(),
          })
          .then(() => {
            uni.hideLoading();

            uni.showToast({
              title: '提交成功',
              icon: 'none',
              mask: true,
            });

            setTimeout(() => {
              this.$toBack();
            }, 1000);
          });

        return;
      }

      this.stepIndex += 1;
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
.evaluation-page {
  height: 100%;
  background: #f6f7fb linear-gradient(180deg, #e9f4ee 0%, #f2f6f7 73%) left top/100% 500rpx no-repeat;
  padding-bottom: 80rpx;
  display: flex;
  flex-direction: column;

  .page-title {
    flex-shrink: 0;
  }

  .banner {
    padding: calc(var(--page-title-height) + 54rpx) 0 0;
    flex-shrink: 0;
  }

  .welcome {
    padding: 0 85rpx;
    margin-bottom: 53rpx;

    .progress {
      flex-shrink: 0;
      width: 100%;
      height: 11rpx;
      background: #ffffff;
      border-radius: 6rpx;
      position: relative;
      margin-bottom: 51rpx;

      text {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        background: #65d285;
        border-radius: 6rpx;
      }
    }

    .tip {
      font-weight: 500;
      font-size: 28rpx;
      color: #65d285;
      text-align: center;
    }
  }

  .evaluation-container {
    padding: 0 30rpx;
    flex-grow: 1;
    overflow: hidden;

    .evaluation-box {
      height: 100%;
      padding: 104rpx 64rpx 0;
      background: #ffffff;
      border-radius: 30rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .evaluation-title {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 30rpx;

        text {
          &:nth-child(1) {
            font-weight: bold;
            font-size: 36rpx;
            color: #111111;
          }

          &:nth-child(2) {
            font-size: 28rpx;
            color: #999999;
            line-height: 61rpx;
            text-align: center;
          }
        }
      }

      .evaluation {
        flex-grow: 1;
      }

      .evaluation1 {
        margin-top: 150rpx;

        .gender-list {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 29rpx;

          text {
            width: 561rpx;
            height: 100rpx;
            background: #ffffff;
            border-radius: 28rpx;
            border: 2px solid #e0e0e0;
            font-weight: 500;
            font-size: 28rpx;
            color: #bfbfbf;
            display: flex;
            align-items: center;
            justify-content: center;

            &.active {
              background: #effffb;
              border-radius: 28rpx;
              border: 3px solid #65d285;
            }
          }
        }
      }

      .evaluation2,
      .evaluation3,
      .evaluation4,
      .evaluation5,
      .evaluation6,
      .evaluation7 {
        width: 100%;
        margin-top: 120rpx;

        &.evaluation7 {
          .column-item {
            text {
              &:nth-child(1) {
                font-size: 32rpx;
                color: #111111;
                margin-right: 20rpx;
              }
            }
          }
        }

        picker-view {
          .column-item {
            display: flex;
            align-items: center;
            justify-content: center;

            &.active {
              text {
                font-weight: bold;
                color: #65d285 !important;
              }
            }

            text {
              &:nth-child(1) {
                font-size: 40rpx;
                color: #111111;
                margin-right: 20rpx;
              }

              &:nth-child(2) {
                font-size: 24rpx;
                position: relative;
                top: 4rpx;
              }
            }
          }
        }
      }

      .evaluation-title2 {
        font-size: 24rpx;
        color: #999999;
        margin-bottom: 42rpx;
      }

      .next {
        flex-shrink: 0;
        width: 550rpx;
        height: 100rpx;
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
}
</style>
