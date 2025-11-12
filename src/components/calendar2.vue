<template>
  <view class="calendar-com">
    <view class="page-title">
      <text>{{ title || formatSelectedDate }}</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="calendar-wrapper" v-show="showCalendar">
      <!-- 星期行 -->
      <view class="calendar-weekdays">
        <view v-for="day in weekDays" :class="{ active: activeWeekDay(day) }" :key="day" class="weekday">
          {{ day }}
        </view>
      </view>

      <!-- 日期展示 -->
      <view class="calendar-days">
        <view
          v-for="day in calendarDays.filter((item) => (isInCurrentWeek ? item.isInCurrentWeek : true))"
          :key="day.date"
          class="calendar-day"
          :class="{
            disabled: day.disabled,
            selected: day.selected,
            today: day.isToday,
          }"
          @click="selectDay(day)"
        >
          <view>
            <text>{{ day.value }}</text>
          </view>
        </view>
      </view>

      <view class="toggle" @click="isInCurrentWeek = !isInCurrentWeek">
        <uni-icons size="14" color="#999999" :type="isInCurrentWeek ? 'down' : 'up'" />
      </view>
    </view>
  </view>
</template>

<script>
import { verifyIsLogin } from '@/utils';

export default {
  name: 'calendar',

  props: {
    initialWeight: {
      type: Number,
    },

    targetWeight: {
      type: Number,
    },

    title: {
      type: String,
    },
  },

  data() {
    return {
      currentDate: new Date().getTime(), // 当前显示月份的时间戳
      selectedDate: null, // 选中日期的时间戳
      minSelectableDate: null, // 最小可选日期（明天）
      weekDays: ['一', '二', '三', '四', '五', '六', '日'],
      showCalendar: true,
      isInCurrentWeek: true,
    };
  },

  mounted() {
    let date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    this.selectedDate = `${year}/${month + 1 > 9 ? month + 1 : `0${month + 1}`}/${day > 9 ? day : `0${day}`}`;
  },

  computed: {
    // 计算今天所在周的起止时间（周一到周日）
    currentWeekRange() {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0=周日, 1=周一, ..., 6=周六
      // 调整：周一为第0天
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 周日时，周一在6天前
      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMonday);
      monday.setHours(0, 0, 0, 0);

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);

      return {
        start: monday.getTime(),
        end: sunday.getTime(),
      };
    },

    calendarDays() {
      const date = new Date(this.currentDate);
      const year = date.getFullYear();
      const month = date.getMonth();

      const firstDay = new Date(year, month, 1); // 本月第一天
      const lastDay = new Date(year, month + 1, 0); // 本月最后一天

      // 获取当月第一天是星期几（0=周日）
      let startWeekday = firstDay.getDay(); // 0 ~ 6
      // 调整为周一作为第0列：(startWeekday + 6) % 7 得到前面要补多少天上个月的日期
      const offset = (startWeekday + 6) % 7;

      const days = [];
      const today = new Date(); // 当前时间
      const minDate = this.minSelectableDate;
      const { start: weekStart, end: weekEnd } = this.currentWeekRange;

      // 1. 添加上个月的末尾几天
      const prevMonthLastDay = new Date(year, month, 0).getDate(); // 上个月有多少天

      for (let i = offset - 1; i >= 0; i--) {
        const dayNum = prevMonthLastDay - i;
        const date = new Date(year, month - 1, dayNum);
        const year1 = date.getFullYear();
        const month1 = date.getMonth();
        const dateStr = `${year1}/${month1 + 1 > 9 ? month1 + 1 : `0${month1 + 1}`}/${
          dayNum > 9 ? dayNum : `0${dayNum}`
        }`;
        const time = date.getTime();
        const isToday = time === today.getTime();
        const isSelected = this.selectedDate && dateStr === this.selectedDate;
        let isDisabled = time > minDate;

        days.push({
          dateStr,
          value: dayNum,
          date: time,
          isToday: isToday,
          disabled: isDisabled,
          selected: isSelected,
          isInCurrentWeek: time >= weekStart && time <= weekEnd,
        });
      }

      // 2. 添加当前月的所有日期
      const totalDays = lastDay.getDate();
      for (let day = 1; day <= totalDays; day++) {
        const dateStr = `${year}/${month + 1 > 9 ? month + 1 : `0${month + 1}`}/${day > 9 ? day : `0${day}`}`;
        const currDate = new Date(year, month, day).getTime();
        const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
        const isSelected = this.selectedDate && dateStr === this.selectedDate;
        let isDisabled = currDate > minDate;

        days.push({
          dateStr,
          value: day,
          date: currDate,
          isToday,
          disabled: isDisabled,
          selected: isSelected,
          isInCurrentWeek: currDate >= weekStart && currDate <= weekEnd,
        });
      }

      // 3. 【关键】只在最后一行有当前月日期时，才补下个月的日期
      const totalCells = days.length;
      const remainder = totalCells % 7;

      if (remainder !== 0) {
        // 最后一行不完整，需要补足到7列
        const fillCount = 7 - remainder;
        for (let day = 1; day <= fillCount; day++) {
          const date = new Date(year, month + 1, day);
          const year1 = date.getFullYear();
          const month1 = date.getMonth();
          const dateStr = `${year1}/${month1 + 1 > 9 ? month1 + 1 : `0${month1 + 1}`}/${day > 9 ? day : `0${day}`}`;
          const time = date.getTime();
          const isToday = time === today.getTime();
          const isSelected = this.selectedDate && dateStr === this.selectedDate;
          let isDisabled = time > minDate;

          days.push({
            dateStr,
            value: day,
            date: time,
            isToday: isToday,
            disabled: isDisabled,
            selected: isSelected,
            isInCurrentWeek: time >= weekStart && time <= weekEnd,
          });
        }
      }

      return days;
    },

    activeWeekDay() {
      return (day) => {
        let currentDay = new Date(this.selectedDate).getDay();

        if (currentDay === 0 && day === this.weekDays[6]) {
          return true;
        } else {
          return currentDay === this.weekDays.findIndex((weekDay) => weekDay === day) + 1;
        }
      };
    },

    formatSelectedDate() {
      if (this.selectedDate) {
        let data = this.selectedDate.split('/');
        return `${data[1]}月${data[2]}日`;
      }

      return '';
    },
  },

  watch: {
    selectedDate(value) {
      this.$emit('selectDayChange', value);
    },
  },

  created() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate());
    this.minSelectableDate = tomorrow.getTime();
  },

  methods: {
    selectDay(day) {
      if (!day || day.disabled || !day.value) return;
      verifyIsLogin();
      this.selectedDate = day.dateStr;
    },
  },
};
</script>

<style scoped lang="scss">
.calendar-com {
  .page-title {
  }

  .banner {
    padding: calc(var(--page-title-height) + 44rpx) 0 0;
  }

  .calendar-wrapper {
    transition: all 0.3s;

    .calendar-weekdays {
      display: flex;
      justify-content: space-between;
      text-align: center;
      margin-bottom: 16rpx;

      .weekday {
        font-size: 28rpx;
        color: #bfbfbf;
        flex-grow: 1;
        text-align: center;

        &.active {
          color: #333333;
        }
      }
    }

    .calendar-days {
      display: flex;
      flex-wrap: wrap;

      .calendar-day {
        width: calc(100% / 7);
        padding: 2rpx 0;
        cursor: pointer;
        font-size: 28rpx;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: center;

        view {
        }

        &.selected {
          color: #ffffff;

          view {
            background: #65d285;
          }
        }

        &.disabled {
          view {
            color: #aaaaaa;
          }
        }

        view {
          width: 58rpx;
          height: 58rpx;
          border-radius: 15rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4rpx;
        }
      }
    }

    .toggle {
      text-align: center;
    }
  }
}
</style>
