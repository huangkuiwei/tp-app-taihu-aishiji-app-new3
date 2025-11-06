<template>
  <view class="user-center-page">
    <view class="page-title">
      <text>我的数据</text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="userinfo">
      <view class="box">
        <view class="item" @click="$refs.updateGenderDialog.open()">
          <text class="label">性别</text>

          <view class="picker">
            <view class="value">
              <text class="filed">{{ genderList[userDetailInfo.gender].text }}</text>
              <uni-icons class="back" color="#999999" type="right" size="16"></uni-icons>
            </view>
          </view>
        </view>

        <view class="item" @click="$refs.updateBirthDialog.open()">
          <text class="label">出生年月</text>

          <view class="picker">
            <view class="value">
              <text class="filed">{{
                userDetailInfo.birth_year && userDetailInfo.birth_year.replace(/\//g, '-')
              }}</text>
              <uni-icons class="back" color="#999999" type="right" size="16"></uni-icons>
            </view>
          </view>
        </view>

        <view class="item" @click="$refs.updateHeightDialog.open()">
          <text class="label">身高</text>

          <view class="picker">
            <view class="value">
              <text class="filed">{{ rulerLineList1[userDetailInfo.height] }}cm</text>
              <uni-icons class="back" color="#999999" type="right" size="16"></uni-icons>
            </view>
          </view>
        </view>
      </view>

      <view class="box">
        <view class="item" @click="$refs.updateCurrentWeightDialog.open()">
          <text class="label">当前体重</text>

          <view class="picker">
            <view class="value">
              <text class="filed">{{ rulerLineList2[userDetailInfo.current_weight] || currentWeight }}KG</text>
              <uni-icons class="back" color="#999999" type="right" size="16"></uni-icons>
            </view>
          </view>
        </view>

        <view class="item" @click="$refs.updateTargetWeightDialog.open()">
          <text class="label">目标体重</text>

          <view class="picker">
            <view class="value">
              <text class="filed">{{ rulerLineList4[userDetailInfo.target_weight] || targetWeight }}KG</text>
              <uni-icons class="back" color="#999999" type="right" size="16"></uni-icons>
            </view>
          </view>
        </view>

        <view class="item">
          <text class="label">开始日期</text>

          <view class="picker">
            <view class="value">
              <text class="filed">{{
                userDetailInfo.end_date && userDetailInfo.begin_date.slice(0, 10).replace(/\//g, '-')
              }}</text>
              <!--<uni-icons class="back" color="#999999" type="right" size="16"></uni-icons>-->
            </view>
          </view>
        </view>
      </view>

      <view class="box">
        <view class="item" @click="$refs.updateHabitsDialog.open()">
          <text class="label">运动量</text>

          <view class="picker">
            <view class="value">
              <text class="filed">
                {{ exerciseHabits[userDetailInfo.exercise_habits].text }}
              </text>
              <uni-icons class="back" color="#999999" type="right" size="16"></uni-icons>
            </view>
          </view>
        </view>
      </view>
    </view>

    <update-gender-dialog
      ref="updateGenderDialog"
      :genderList="genderList"
      :userDetailInfo="userDetailInfo"
      @submit="Object.assign(userDetailInfo, $event)"
    />

    <update-birth-dialog
      ref="updateBirthDialog"
      :genderList="genderList"
      :userDetailInfo="userDetailInfo"
      @submit="Object.assign(userDetailInfo, $event)"
    />

    <update-height-dialog
      ref="updateHeightDialog"
      :list="rulerLineList1"
      :userDetailInfo="userDetailInfo"
      @submit="Object.assign(userDetailInfo, $event)"
    />

    <update-current-weight-dialog
      ref="updateCurrentWeightDialog"
      :list="rulerLineList2"
      :userDetailInfo="userDetailInfo"
      @submit="Object.assign(userDetailInfo, $event)"
    />

    <update-target-weight-dialog
      ref="updateTargetWeightDialog"
      :list="rulerLineList4"
      :userDetailInfo="userDetailInfo"
      @submit="Object.assign(userDetailInfo, $event)"
    />

    <update-habits-dialog
      ref="updateHabitsDialog"
      :list="exerciseHabits"
      :userDetailInfo="userDetailInfo"
      @submit="Object.assign(userDetailInfo, $event)"
    />

    <update-end-date-dialog
      ref="updateEndDateDialog"
      :userDetailInfo="userDetailInfo"
      @submit="Object.assign(userDetailInfo, $event)"
    />
  </view>
</template>

<script>
import { mapActions } from 'vuex';
import $http from '@/utils/http';
import UpdateGenderDialog from '@/pages/userCenter/updateGenderDialog.vue';
import UpdateBirthDialog from '@/pages/userCenter/updateBirthDialog.vue';
import UpdateHeightDialog from '@/pages/userCenter/updateHeightDialog.vue';
import UpdateCurrentWeightDialog from '@/pages/userCenter/updateCurrentWeightDialog.vue';
import UpdateTargetWeightDialog from '@/pages/userCenter/updateTargetWeightDialog.vue';
import UpdateHabitsDialog from '@/pages/userCenter/updateHabitsDialog.vue';
import UpdateEndDateDialog from '@/pages/userCenter/updateEndDateDialog.vue';

export default {
  name: 'userCenter',

  components: {
    UpdateEndDateDialog,
    UpdateHabitsDialog,
    UpdateTargetWeightDialog,
    UpdateCurrentWeightDialog,
    UpdateHeightDialog,
    UpdateBirthDialog,
    UpdateGenderDialog,
  },

  data() {
    let rulerLineList1 = [];
    let rulerLineList2 = [];
    let rulerLineList3 = [];
    let rulerLineList4 = [];

    for (let i = 90; i < 221; i++) {
      rulerLineList1.push(i);
    }

    for (let i = 0; i < 401; i++) {
      rulerLineList2.push(Number((i * 0.5).toFixed(1)));
      rulerLineList3.push(Number((i * 0.5).toFixed(1)));
      rulerLineList4.push(Number((i * 0.5).toFixed(1)));
    }

    return {
      userDetailInfo: {},
      currentWeight: 0,
      targetWeight: 0,
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
      rulerLineList1: rulerLineList1,
      rulerLineList2: rulerLineList2,
      rulerLineList3: rulerLineList3,
      rulerLineList4: rulerLineList4,
      exerciseHabits: [
        {
          id: 0,
          value: 1,
          text: '几乎不动，长时间久坐',
          active: true,
        },
        {
          id: 1,
          value: 2,
          text: '偶尔活动，每周1-3天',
          active: false,
        },
        {
          id: 2,
          value: 3,
          text: '经常活动，每周3-5天',
          active: false,
        },
        {
          id: 3,
          value: 4,
          text: '活动频繁，每周6-7天',
          active: false,
        },
        {
          id: 4,
          value: 5,
          text: '高强度活动，长时间体力工作',
          active: false,
        },
      ],
    };
  },

  watch: {
    userDetailInfo: {
      handler(value, oldValue) {
        if (!oldValue.id) {
          return;
        }

        uni.showLoading({
          title: '更新中...',
        });

        if (Number(this.currentWeight) === Number(this.rulerLineList2[value.current_weight])) {
          $http
            .post('api/diet-info/user-info/update', {
              gender: this.genderList[value.gender].value,
              birth_year: new Date(value.birth_year.toString() + '/01').format(),
              height: this.rulerLineList1[value.height],
              initial_weight: this.rulerLineList3[value.initial_weight],
              target_weight: this.rulerLineList4[value.target_weight],
              exercise_habits: this.exerciseHabits[value.exercise_habits].value,
              begin_date: new Date(value.begin_date.replace(/-/g, '/')).format(),
              end_date: new Date(value.end_date.replace(/-/g, '/')).format(),
            })
            .then(() => {
              this.targetWeight = this.rulerLineList4[value.target_weight];

              uni.showToast({
                title: '更新成功',
                icon: 'none',
              });
            });
        } else {
          $http
            .post('api/diet-info/user-weight/update', {
              weight: this.rulerLineList2[value.current_weight],
            })
            .then(() => {
              this.currentWeight = this.rulerLineList2[value.current_weight];

              uni.showToast({
                title: '更新成功',
                icon: 'none',
              });
            });
        }
      },

      deep: true,
    },
  },

  onShow() {
    this.getUserDetailInfo();
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
     * 获取用户信息数据
     */
    getUserDetailInfo() {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      this._getUserDetailInfo().then((res) => {
        uni.hideLoading();

        // 数据格式处理
        if (res.data.gender) {
          res.data.gender = this.genderList.findIndex((item) => item.value === res.data.gender);
        }

        if (res.data.birth_year) {
          res.data.birth_year = res.data.birth_year.slice(0, 7).replace(/-/g, '/');
        }

        if (res.data.begin_date && res.data.end_date) {
          let currentDate1 = new Date(res.data.begin_date.replace(/-/g, '/'));
          let currentDate2 = new Date(res.data.end_date.replace(/-/g, '/'));

          const year1 = currentDate1.getFullYear();
          const month1 =
            currentDate1.getMonth() + 1 > 9 ? currentDate1.getMonth() + 1 : `0${currentDate1.getMonth() + 1}`;
          const date1 = currentDate1.getDate() > 9 ? currentDate1.getDate() : '0' + currentDate1.getDate();

          const year2 = currentDate2.getFullYear();
          const month2 =
            currentDate2.getMonth() + 1 > 9 ? currentDate2.getMonth() + 1 : `0${currentDate2.getMonth() + 1}`;
          const date2 = currentDate2.getDate() > 9 ? currentDate2.getDate() : '0' + currentDate2.getDate();

          res.data.begin_date = `${year1}/${month1}/${date1}`;
          res.data.end_date = `${year2}/${month2}/${date2}`;
        }

        if (res.data.height) {
          res.data.height = this.rulerLineList1.findIndex((item) => item === res.data.height);
        }

        if (res.data.current_weight) {
          // 备份一份当前体重
          this.currentWeight = res.data.current_weight;
          res.data.current_weight = this.rulerLineList2.findIndex((item) => item === res.data.current_weight);
        }

        if (res.data.initial_weight) {
          res.data.initial_weight = this.rulerLineList3.findIndex((item) => item === res.data.initial_weight);
        }

        if (res.data.target_weight) {
          // 备份一份目标体重
          this.targetWeight = res.data.target_weight;
          res.data.target_weight = this.rulerLineList4.findIndex((item) => item === res.data.target_weight);
        }

        if (res.data.exercise_habits) {
          res.data.exercise_habits = this.exerciseHabits.findIndex((item) => item.value === res.data.exercise_habits);
        }

        this.userDetailInfo = res.data;
      });
    },
  },
};
</script>

<style>
page {
  background: #f6f7fb;
}
</style>

<style scoped lang="scss">
.user-center-page {
  .page-title {
    background: #ffffff;
  }

  .banner {
    padding: calc(var(--page-title-height)) 0 0;
    background: #ffffff;
  }

  .userinfo {
    padding: 30rpx;

    .box {
      background: #ffffff;
      border-radius: 20rpx;
      padding: 0 24rpx;
      margin-bottom: 20rpx;

      .item {
        height: 92rpx;
        display: flex;
        align-items: center;

        &:not(:last-child) {
          border-bottom: 1px solid #f6f7fb;
        }

        .label {
          font-weight: 500;
          font-size: 28rpx;
          color: #111111;
        }

        .picker {
          flex-grow: 1;

          .value {
            display: flex;
            align-items: center;
            justify-content: flex-end;

            .filed {
              font-size: 24rpx;
              color: #555555;
              margin-right: 15rpx;
            }
          }
        }
      }
    }
  }
}
</style>
