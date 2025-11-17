import $http from '@/utils/http';

const appStore = {
  namespaced: true,

  state: {
    userInfo: {},
    userDetailInfo: null,
    lifestylePlanData: [],
    appInfo: {
      appName: '小食视记',
      companyName: '长沙酷喵互娱网络科技有限公司',
    },
  },

  getters: {
    isLogin(state) {
      return !!state.userInfo.uid;
    },

    isVip(state) {
      return state.userInfo.vip_info && state.userInfo.vip_info.vip_type;
    },

    vipName(state) {
      let vipInfo = state.userInfo.vip_info;

      if (vipInfo.vip_type === 0) {
        return '普通用户';
      } else if (vipInfo.vip_type === 2) {
        return '体验3天会员';
      } else if (vipInfo.vip_type === 3) {
        return '体验7天会员';
      } else if (vipInfo.vip_type === 4) {
        return '体验30天会员';
      } else if (vipInfo.vip_type === 5) {
        return '月会员';
      } else if (vipInfo.vip_type === 6) {
        return '季会员';
      } else if (vipInfo.vip_type === 7) {
        return '年会员';
      }
    },
  },

  mutations: {
    _setUserInfo(state, payload) {
      if (payload.uid) {
        // 加个默认头像
        payload.avatar_url =
          payload.avatar_url || 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app/recode/head01.png';

        // 默认昵称
        // if (!payload.uname) {
        //   payload.uname = `${payload.phone.slice(0, 3)}****${payload.phone.slice(-4)}`;
        // }
        payload.uname = `${payload.phone.slice(0, 3)}****${payload.phone.slice(-4)}`;
      }

      state.userInfo = payload;
    },

    _setUserDetailInfo(state, payload) {
      state.userDetailInfo = payload;
    },

    _clearUserDetailInfo(state) {
      state.userDetailInfo = null;
    },

    _setSystemInfo(state, payload) {
      state.systemInfo = payload;
    },

    _setLifestyle(state, payload) {
      state.lifestylePlanData = payload;
    },
  },

  actions: {
    _getUserInfo({ commit }) {
      return $http
        .get(
          'api/user/auth/userauth/info?referch=1',
          {},
          {
            hideLoginBox: true,
          },
        )
        .then((res) => {
          commit('_setUserInfo', res.data);
        });
    },

    _getUserDetailInfo({ commit }) {
      return $http
        .get(
          'api/diet-info/user-info/get?forceRefresh=true',
          {},
          {
            hiddenErrorMessage: true,
            hideLoginBox: true,
          },
        )
        .then((res) => {
          commit('_setUserDetailInfo', res.data);
          return JSON.parse(JSON.stringify(res));
        })
        .catch((err) => {
          if (err.Msg === '未找到健康档案，请先完成健康评估') {
            commit('_clearUserDetailInfo');
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

    _getLifestyle({ commit }) {
      return $http
        .get(
          'api/diet-info/today-lifestyle-advices',
          {},
          {
            hideLoginBox: true,
            hiddenErrorMessage: true,
            timeout: 90000,
          },
        )
        .then((res) => {
          commit('_setLifestyle', res.data);
        });
    },
  },
};

export default appStore;
