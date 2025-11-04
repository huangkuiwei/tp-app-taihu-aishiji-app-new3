<template>
  <view class="health-assistant">
    <view class="page-title">
      <text></text>

      <view class="back" @click="$toBack">
        <uni-icons class="back" color="#1A1A1A" type="arrow-left" size="22"></uni-icons>
      </view>
    </view>

    <view class="banner"></view>

    <view class="tabs">
      <text :class="{ active: tabValue === 1 }" @click="changeTab(1)">对话</text>
      <text :class="{ active: tabValue === 2 }" @click="changeTab(2)">发现</text>
    </view>

    <view class="introduce">
      <view class="title">{{ aiTitle }}</view>
      <view class="sub-title">各种饮食运动问题都可以来问我哦</view>
    </view>

    <scroll-view
      class="chat-box"
      :scroll-y="true"
      :show-scrollbar="false"
      :scroll-top="scrollTop"
      :style="{
        background:
          tabValue === 2 &&
          'url(https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/aichat/bg2.png) left top/100% 100% no-repeat',
        paddingTop: tabValue === 2 && '80rpx',
      }"
    >
      <view class="question-card" v-show="tabValue === 1">
        <view class="card-title">
          <view class="word">你可能感兴趣</view>
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
                @click="selectQuestion(item)"
              >
                {{ item.text }}
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="chat-list">
        <view
          class="chat-item"
          :class="{ question: item.role === 1, answer: item.role === 2 }"
          v-for="item of chatList"
          :key="item.id"
        >
          <text v-if="item.role === 1">{{ item.content }}</text>
          <towxml v-else :nodes="item.content"></towxml>
        </view>
      </view>
    </scroll-view>

    <view class="message-box">
      <view class="input-box">
        <input
          type="text"
          :placeholder="tabValue === 1 ? '有什么饮食运动问题需要问我吗？' : '说点什么...'"
          :value="questionText"
          @input="questionText = $event.detail.value"
        />
      </view>

      <view class="send" :class="{ disabled: answering }" @click="sendMessage">发送</view>

      <view class="ai-tip"> 本服务为AI生成内容，结果仅供参考 </view>
    </view>
  </view>
</template>

<script>
import $http from '@/utils/http';
import { concatenateArrayBuffers, verifyIsLogin } from '@/utils';

export default {
  name: 'healthAssistant',

  data() {
    return {
      agent_id: undefined,
      org_agent_id: undefined,
      aiName: '',
      aiTitle: '',
      scrollTop: 99999,
      chatList: [],
      questionText: '',
      conversation_id: undefined,
      answering: false,
      thinkText: '正在思考，请稍等...',
      tabValue: 1,

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
      sendTimeout: null, // 定时器ID
      sendInterval: null, // 定时器ID
    };
  },

  onShow() {
    this.startDanmu();
  },

  onHide() {
    this.initDanmu();
  },

  onLoad(options) {
    this.agent_id = options.agent_id;

    if (this.agent_id === '10000') {
      this.tabValue = 1;
      this.org_agent_id = '10018'; // 默认
    } else {
      this.tabValue = 2;
      this.org_agent_id = options.agent_id;
    }

    if (options.questionText) {
      this.questionText = options.questionText;

      setTimeout(() => {
        this.sendMessage();
      }, 200);
    }

    this.aiName = decodeURIComponent(options.name);
  },

  watch: {
    agent_id() {
      if (this.agent_id === '10000') {
        this.aiTitle = 'Hi，我是你的专属ai助手~';
      } else if (this.agent_id === '10018') {
        this.aiTitle = '嗨~我是你的专属营养顾问，很高兴为您服务！';
        this.questionList = [
          {
            id: 1,
            text: '如何减肥最合理？',
          },
          {
            id: 2,
            text: '135斤多久能瘦到90斤？？',
          },
        ];
      } else if (this.agent_id === '10019') {
        this.aiTitle = '嗨~我是你的专属营养师，很高兴为您服务！';
        this.questionList = [
          {
            id: 1,
            text: '该如何选择适合我的食物？',
          },
          {
            id: 2,
            text: '哪些食物营养健康',
          },
        ];
      } else if (this.agent_id === '10023') {
        this.aiTitle = '嗨~我能为你提供最合适您的饮食方案！';
        this.questionList = [
          {
            id: 1,
            text: '素食',
          },
          {
            id: 2,
            text: '喜欢吃夜宵',
          },
        ];
      } else if (this.agent_id === '10020') {
        this.aiTitle = '嗨~我是你的专属健身教练，很高兴为您服务！';
        this.questionList = [
          {
            id: 1,
            text: '如何开始健身计划',
          },
          {
            id: 2,
            text: '哪些运动项目适合我？',
          },
        ];
      } else if (this.agent_id === '10021') {
        this.aiTitle = '嗨~我是你的专属食品配料表专家！';
        this.questionList = [
          {
            id: 1,
            text: '如何解读配料表中的成分',
          },
          {
            id: 2,
            text: '哪些成分对人体有害？',
          },
        ];
      } else if (this.agent_id === '10024') {
        this.aiTitle = '嗨~可以为你提供准确的 BMI 值和相关健康建议！';
        this.questionList = [
          {
            id: 1,
            text: '身高170CM体重55kg，BMI值是多少？',
          },
          {
            id: 2,
            text: 'BMI偏低如何增加体重？',
          },
        ];
      } else if (this.agent_id === '10025') {
        this.aiTitle = '嗨~我可以为你提供准确的基础代谢率结果和建议！';
        this.questionList = [
          {
            id: 1,
            text: '身高170CM体重55kg，我的基础代谢率是多少？',
          },
          {
            id: 2,
            text: '基础代谢率对身体有什么影响？',
          },
        ];
      } else if (this.agent_id === '10022') {
        this.aiTitle = '嗨~我是热量计算器，可以帮你计算准确的热量！';
        this.questionList = [
          {
            id: 1,
            text: '每天摄入多少热量合适？',
          },
          {
            id: 2,
            text: '热量摄入过多怎么消耗热量？',
          },
        ];
      } else if (this.agent_id === '10026') {
        this.aiTitle = '嗨~我能为你计算精准的热量缺口！';
        this.questionList = [
          {
            id: 1,
            text: '如何确定我的活动水平？',
          },
          {
            id: 2,
            text: '我想减肥，应该设置多大的热量缺口？',
          },
        ];
      }

      this.getHistoryChat();
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
    initDanmu() {
      if (typeof this.sendInterval === 'number') {
        clearTimeout(this.sendTimeout);
        clearInterval(this.sendInterval);
        this.sendTimeout = null;
        this.sendInterval = null;
      }

      this.activeDanmus = [];
      this.danmuIndex = 0;
    },

    startDanmu() {
      this.initDanmu();
      this.sendSingleDanmu();

      this.sendTimeout = setTimeout(() => {
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

    changeTab(value) {
      if (this.tabValue === value) {
        return;
      }

      this.tabValue = value;

      if (value === 1) {
        this.agent_id = '10000';
        this.startDanmu();
      } else {
        this.agent_id = this.org_agent_id;
      }
    },

    getHistoryChat() {
      uni.showLoading({
        title: '加载中...',
        mask: true,
      });

      $http
        .post('api/baseai/chat-records', {
          order_type: 1,
          pageIndex: 1,
          pageSize: 20,
          agent_id: this.agent_id,
        })
        .then((res) => {
          uni.hideLoading();

          if (res.data.Items && res.data.Items.length) {
            this.conversation_id = res.data.Items[0].conversation_id;
            this.chatList = res.data.Items.reverse();

            res.data.Items.forEach((item) => {
              if (item.role === 2) {
                item.content = this.$towxml(item.content, 'markdown');
              }
            });
          }

          this.$nextTick(() => {
            this.scrollTop += 1;
          });
        });
    },

    selectQuestion(item) {
      this.questionText = item.text;
      this.sendMessage();
    },

    sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    },

    sendMessage() {
      verifyIsLogin();

      if (this.answering) {
        return;
      }

      if (!this.questionText) {
        uni.showToast({
          title: '问题不能为空',
          icon: 'none',
        });

        return;
      }

      this.answering = true;

      this.chatList.push({
        id: Math.round().toString(),
        role: 1,
        content: this.questionText,
      });

      let answerObj = {
        id: Math.round().toString(),
        role: 2,
        content: this.$towxml(this.thinkText, 'markdown'),
      };

      this.chatList.push(answerObj);

      this.$nextTick(() => {
        this.scrollTop += 1;
      });

      const requestTask = uni.request({
        url: process.env.VUE_APP_REQUEST_BASE_API_URL + 'api/baseai/agent-chat',
        method: 'POST',
        header: {
          Accept: 'text/event-stream',
          token: uni.getStorageSync('foodDiaryToken').value,
        },
        data: {
          agent_id: this.agent_id,
          message: this.questionText,
          conversation_id: this.conversation_id,
        },
        enableChunked: true,
        responseType: 'arraybuffer',
        success: (res) => {
          console.log('Data received 数据接受完毕:', res.data);
        },
        fail: (error) => {
          console.log('打印***error 错误处理', error);
        },
        complete: (complete) => {
          console.log('打印***complete 完成接收', complete);

          // conversation_id为空的情况下重新获取conversation_id
          if (!this.conversation_id) {
            setTimeout(() => {
              $http
                .post('api/baseai/chat-records', {
                  order_type: 1,
                  pageIndex: 1,
                  pageSize: 20,
                  agent_id: this.agent_id,
                })
                .then((res) => {
                  if (res.data.Items && res.data.Items.length) {
                    this.conversation_id = res.data.Items[0].conversation_id;
                  }
                });
            }, 500);
          }
        },
      });

      let chunkLength = 0;
      let resList = [];

      requestTask.onChunkReceived(async (res) => {
        chunkLength += 1;
        let currentChunk = chunkLength;
        resList.push(res);

        const uint8Array = new Uint8Array(concatenateArrayBuffers(...resList.map((item) => item.data)));
        let text = String.fromCharCode.apply(null, uint8Array);

        try {
          let result = JSON.parse(text);

          if (result.Code) {
            answerObj.content = this.$towxml(result.Msg, 'markdown');

            this.$nextTick(() => {
              this.scrollTop += 1;
            });

            return;
          }
        } catch (e) {}

        const arr = text.split('\n\n').filter(Boolean);
        let content = '';

        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === 'event: end\n' + 'data: {}') {
            break;
          }

          const jsonStr = arr[i].slice(6); // 去掉前缀

          try {
            const data = JSON.parse(jsonStr);
            await this.sleep(20);

            for (let j = 0; j < data.text.length; j++) {
              await this.sleep(20);

              if (currentChunk !== chunkLength) {
                content = '';
                answerObj.content = this.$towxml(content, 'markdown');
                return;
              } else {
                content += data.text[j];
                answerObj.content = this.$towxml(content, 'markdown');
              }

              this.$nextTick(() => {
                this.scrollTop += 1;
              });
            }
          } catch (e) {}
        }

        this.answering = false;
      });

      this.questionText = '';
    },
  },
};
</script>

<style lang="scss">
page {
  height: 100%;
  background: #f6f7fb;
}
</style>

<style scoped lang="scss">
.health-assistant {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: url('https://hnenjoy.oss-cn-shanghai.aliyuncs.com/food-diary-app2/aichat/bg.png') left top/100% auto
    no-repeat;

  .page-title {
  }

  .banner {
    flex-shrink: 0;
    padding: calc(var(--page-title-height)) 0 60rpx;
  }

  .tabs {
    flex-shrink: 0;
    margin-bottom: 47rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 71rpx;

    text {
      font-weight: 500;
      font-size: 28rpx;
      color: #555555;

      &.active {
        font-weight: bold;
        font-size: 32rpx;
        color: #5664e5;
      }
    }
  }

  .introduce {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 30rpx;

    .title {
      font-weight: bold;
      font-size: 32rpx;
      color: #5664e5;
      margin-bottom: 19rpx;
    }

    .sub-title {
      font-size: 24rpx;
      color: #969bad;
    }
  }

  .chat-box {
    padding: 0 30rpx 180rpx;
    flex-grow: 1;
    overflow: auto;

    .question-card {
      padding-top: 30rpx;
      margin-bottom: 30rpx;

      .card-title {
        padding: 38rpx 31rpx 55rpx;
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
          top: 0;
        }
      }

      .question-list {
        height: 160px;
        background: #ffffff;
        box-shadow: 0 3rpx 21rpx 0 rgba(215, 218, 242, 0.29);
        border-radius: 20rpx;
        position: relative;
        top: -24rpx;

        .question-detail {
          width: 100%;
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
      }
    }

    .chat-list {
      display: flex;
      flex-direction: column;
      gap: 43rpx;

      .chat-item {
        max-width: 90%;
        white-space: wrap;
        word-break: break-word;
        line-height: 40rpx;
        font-size: 26rpx;

        &.question {
          padding: 18rpx 24rpx;
          background: #5664e5;
          border-radius: 35rpx 35rpx 0rpx 35rpx;
          color: #ffffff;
          align-self: flex-end;
        }

        &.answer {
          padding: 0 24rpx;
          min-width: 50%;
          background: #ffffff;
          border-radius: 5rpx 25rpx 25rpx 25rpx;
          color: #111111;
          align-self: flex-start;
        }
      }
    }
  }

  .message-box {
    position: fixed;
    z-index: 999;
    bottom: 70rpx;
    left: 56rpx;
    right: 56rpx;
    display: flex;
    align-items: center;

    .input-box {
      flex-grow: 1;
      height: 80rpx;
      background: #ffffff;
      box-shadow: 5rpx 9rpx 20rpx 0rpx rgba(185, 189, 203, 0.3);
      border-radius: 20rpx;
      display: flex;
      align-items: center;
      margin-right: 15rpx;

      input {
        padding: 0 38rpx;
        flex-grow: 1;
        font-size: 26rpx;
      }
    }

    .send {
      flex-shrink: 0;
      font-weight: 500;
      font-size: 32rpx;
      color: #5664e5;

      &.disabled {
        color: #aaaaaa;
      }
    }

    .ai-tip {
      position: absolute;
      bottom: -40rpx;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 20rpx;
      color: #aaaaaa;
    }
  }
}
</style>
