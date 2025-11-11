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
          v-for="day in calendarDays"
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
    calendarDays() {
      const date = new Date(this.currentDate);
      const year = date.getFullYear();
      const month = date.getMonth();

      const firstDay = new Date(year, month, 1); // 本月第一天
      const lastDay = new Date(year, month + 1, 0); // 本月最后一天
      const totalDays = lastDay.getDate(); // 总天数
      const startDay = firstDay.getDay(); // 第一天是星期几（0=周日）

      const days = [];
      const today = new Date(); // 当前时间
      const minDate = this.minSelectableDate;

      // 补齐前面空白的格子（周一为第一列）
      const offset = (startDay + 6) % 7; // 调整成周一为第一天
      for (let i = 0; i < offset; i++) {
        days.push({ value: '', disabled: true });
      }

      // 添加当月的每一天
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
        });
      }

      // 补齐最后一行（最多补6个空格）
      const totalCells = offset + totalDays;
      const fillCount = (7 - (totalCells % 7)) % 7;
      for (let i = 0; i < fillCount; i++) {
        days.push({ value: '', disabled: true });
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
  }
}
</style>
