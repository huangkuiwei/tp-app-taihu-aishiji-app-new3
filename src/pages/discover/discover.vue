<template>
  <view class="discover-page">
    <view class="page-title">发现</view>
    <view class="banner"></view>

    <view class="card-container">
      <view class="question-card">
        <view class="card-title">
          <view class="word">猜你想问：</view>
          <image
            mode="widthFix"
            src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/discover/icon1.png"
          />
        </view>

        <view class="question-list">
          <view class="question-detail">
            <!-- 弹幕显示区域 -->
            <view class="danmu-container" id="danmuContainer">
              <view
                v-for="(item, index) in activeDanmus"
                :key="index"
                class="danmu-item"
                :style="{
                  top: item.top + 'px',
                  animationDuration: item.duration + 's',
                }"
                @click="jumpAi(jkzsChat, item.text)"
              >
                {{ item.text }}
              </view>
            </view>
          </view>
          <view class="ask-btn" v-if="aiChartList.length" @click="jumpAi(jkzsChat)">
            <image
              mode="widthFix"
              src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/discover/ask-btn.png"
            />
          </view>
        </view>
      </view>

      <view class="ai-container">
        <view class="ar-title">智能工具</view>

        <view class="ai-list">
          <view class="ai-item" v-for="(item, index) of aiChartList" :key="index" @click="jumpAi(item)">
            <view class="top">
              <text>{{ item.name }}</text>

              <image
                mode="widthFix"
                src="https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/discover/icon2.png"
              />
            </view>

            <view class="bottom">
              <text>以少油少糖多\n纤维为核心原则</text>
              <image mode="widthFix" :src="item.logo" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import $http from '@/utils/http';

export default {
  name: 'discoverPage',

  data() {
    return {
      aiChartList: [],
      jkzsChat: {},
      allDanmuData: [
        { text: '给我推荐一个健康食谱' },
        { text: '为什么体重总反弹？' },
        { text: '一个月瘦多少斤才算成功？' },
        { text: '不吃晚饭能减肥吗？' },
        { text: '低脂奶，有助于减重吗？' },
        { text: '健康饮食的重要性' },
        { text: '怎么计算热量缺口' },
        { text: '减肥要配合运动么' },
        { text: '少吃多餐和多吃少餐,哪一个更好？' },
        { text: '减肥真的需要精确计算卡路里吗？' },
        { text: '短期间歇性断食有帮助吗？' },
        { text: '减肥速度多快比较合适？' },
        { text: '除了饮食,还有什么会影响减肥？' },
        { text: '我能不能只减某一个部位？' },
        { text: '我为什么会反弹？' },
      ],
      topList: [19, 69, 119],
      activeDanmus: [], // 当前屏幕上显示的弹幕
      containerHeight: 160, // 容器高度
      danmuIndex: 0, // 用于循环取弹幕数据的索引
      sendInterval: null, // 定时器ID
    };
  },

  onShow() {
    this.initData();
    this.startDanmu();
  },

  onHide() {
    this.activeDanmus = [];

    if (typeof this.sendInterval === 'number') {
      clearInterval(this.sendInterval);
      this.sendInterval = null;
    }
  },

  computed: {
    ...mapState('app', ['userDetailInfo']),
    ...mapGetters('app', ['isLogin']),
  },

  onShareAppMessage() {
    return {
      title: 'AI饮食记录小程序',
      imageUrl: 'https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/share-img.jpg',
      path: '/pages/index/index',
    };
  },

  methods: {
    startDanmu() {
      this.sendSingleDanmu();

      setTimeout(() => {
        this.sendSingleDanmu();
      }, 1000);

      // 每隔一定时间发送一条弹幕
      this.sendInterval = setInterval(() => {
        this.sendSingleDanmu();
      }, 2000);
    },

    sendSingleDanmu() {
      // 循环获取弹幕数据
      const danmuData = this.allDanmuData[this.danmuIndex % this.allDanmuData.length];
      this.danmuIndex++;

      const newDanmu = {
        text: danmuData.text,
        top: this.topList[this.danmuIndex % this.topList.length],
        // duration: 10 + Math.random() * 8, // 随机持续时间 10s - 16s
        duration: 15,
      };

      this.activeDanmus.push(newDanmu);

      // 可选：限制屏幕上同时存在的弹幕数量，避免过多卡顿
      // if (this.activeDanmus.length > 50) {
      // 移除最早的一条
      // this.activeDanmus.shift();
      // }
    },

    /**
     * 初始化数据
     */
    async initData() {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      await this.getAiChartList();
      uni.hideLoading();
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
    jumpAi(item, questionText) {
      // verifyIsLogin();

      if (item.id === 10000) {
        this.$toRouter(
          '/pages/healthAssistant/healthAssistant',
          `agent_id=${item.id}&name=${item.name}&questionText=${questionText || ''}`,
        );
        return;
      }

      this.$toRouter('/pages/aiChat/aiChat', `agent_id=${item.id}&name=${item.name}`);
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
.discover-page {
  .page-title {
  }

  .banner {
    padding: calc(var(--page-title-height) + 39rpx) 0 0;
  }

  .card-container {
    padding: 0 30rpx 26rpx;
    position: relative;

    .question-card {
      margin-bottom: 30rpx;

      .card-title {
        padding: 41rpx 29rpx 55rpx;
        background: #5664e5;
        border-top-left-radius: 20rpx;
        border-top-right-radius: 20rpx;

        .word {
          font-weight: 500;
          font-size: 32rpx;
          color: #ffffff;
        }

        image {
          position: absolute;
          width: 172rpx;
          right: 27rpx;
          top: -30rpx;
        }
      }

      .question-list {
        height: 480rpx;
        background: #ffffff;
        box-shadow: 0 3rpx 21rpx 0 rgba(215, 218, 242, 0.29);
        border-radius: 20rpx;
        position: relative;
        top: -14rpx;

        .question-detail {
          height: 160px;
          margin-bottom: 29rpx;
          display: flex;
          flex-direction: column;

          .danmu-container {
            height: 100%;
            width: 100%;
            position: relative;
            overflow: hidden;

            .danmu-item {
              position: absolute;
              left: 100%;
              white-space: nowrap;
              font-size: 24rpx;
              color: #333333;
              background: #f2f5ff80;
              border-radius: 35rpx;
              height: 35px;
              padding: 0 44rpx;
              display: flex;
              align-items: center;
              justify-content: center;
              animation: slideIn linear forwards;
            }

            @keyframes slideIn {
              to {
                transform: translateX(-1440rpx); /* 移动到屏幕左侧外 */
              }
            }
          }
        }

        .ask-btn {
          display: flex;
          align-items: center;
          justify-content: center;

          image {
            width: 287rpx;
          }
        }
      }
    }

    .ai-container {
      .ar-title {
        font-weight: 500;
        font-size: 30rpx;
        color: #111111;
        margin-bottom: 30rpx;
      }

      .ai-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 20rpx;

        .ai-item {
          width: calc(50% - 12rpx);
          background: #ffffff;
          border-radius: 15rpx;
          padding: 30rpx 21rpx;

          .top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20rpx;

            text {
              font-weight: 500;
              font-size: 28rpx;
              color: #111111;
            }

            image {
              width: 12rpx;
            }
          }

          .bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;

            text {
              font-size: 22rpx;
              color: #999999;
              white-space: pre-wrap;
              line-height: 30rpx;
            }

            image {
              width: 55rpx;
            }
          }
        }
      }
    }
  }
}
</style>
