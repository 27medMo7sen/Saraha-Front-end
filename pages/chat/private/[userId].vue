<template>
  <div class="min-h-screen flex flex-col justify-between bg-gray-100">
    <!-- Header -->
    <header
      class="w-full bg-white shadow p-4 rounded-md flex items-center justify-between mt-4"
    >
      <div class="flex items-center gap-2">
        <div class="text-3xl"><IconsAnonymous /></div>
        <div class="cursor-pointer" @click="chatRedirect(chat.chatId)">
          <p class="text-gray-500">anonymous user</p>
        </div>
      </div>
      <h1 class="text-2xl font-bold text-center">Chat Room</h1>
    </header>

    <!-- Main Content -->
    <div class="flex-grow flex flex-col items-center w-full">
      <div
        class="w-full bg-white rounded-lg shadow-lg p-6 flex-grow h-80 max-h-full m-7 overflow-hidden"
      >
        <ul id="mesgs" class="space-y-2 w-full">
          <li
            v-for="(message, index) in separatedMessages"
            :key="index"
            :class="{
              'w-full h-9 flex justify-center items-center': message.day,
              'p-2 rounded-lg w-auto min-w-36 max-w-96 break-words bg-gray-200 text-black self-start':
                !message.day && message.sender !== userId,
              'p-2 rounded-lg w-auto min-w-36 max-w-96 break-words bg-black text-white self-end':
                !message.day && message.sender === userId,
            }"
          >
            <div
              v-if="message.day"
              class="w-auto h-9 flex justify-center items-center rounded-xl bg-gray-300"
            >
              <div class="text-black px-2">{{ message.day }}</div>
            </div>
            <div v-else>
              {{ message.message }}
              <div
                v-if="message.sender === userId"
                class="text-sm w-full pt-4 flex justify-end"
              >
                <div class="bg-gray-800 inline rounded-lg">
                  {{ message.sentAt.slice(11, 16) }}
                </div>
              </div>
              <div v-else class="text-sm w-full pt-4 flex justify-end">
                <div class="bg-gray-100 inline rounded-lg">
                  {{ message.sentAt.slice(11, 16) }}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <form @submit.prevent="sendMessage" class="w-full flex px-4 pb-6 relative">
      <input
        v-model="input"
        autocomplete="off"
        class="flex-1 px-4 py-2 border border-gray-500 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black"
      />
      <button
        type="button"
        @click="toggleEmojiPicker"
        class="px-4 py-2 bg-gray-200 text-blck rounded-r-none hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        <IconsSmile />
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-black text-white rounded-r-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        <IconsSend />
      </button>
      <emoji-picker
        v-if="showEmojiPicker"
        @emoji-click="addEmoji"
        class="absolute bottom-16 right-4"
      ></emoji-picker>
    </form>
  </div>
</template>

<script>
import io from "socket.io-client";
import Cookies from "js-cookie";
import axios from "axios";
import "emoji-picker-element";
import dayjs from "dayjs";

export default {
  computed: {
    token() {
      return Cookies.get("userToken");
    },
    myUserId() {
      return Cookies.get("userId");
    },
    separatedMessages() {
      if (this.messages.length === 0) return [];
      const separatedMessages = [];
      for (let i = 0; i < this.messages.length; i++) {
        if (i === 0) {
          const day = dayjs(this.messages[i].sentAt.slice(0, 10)).format(
            "YYYY-MM-DD"
          );
          if (day === dayjs().format("YYYY-MM-DD")) {
            separatedMessages.push({ day: "Today" });
          } else if (day === dayjs().subtract(1, "day").format("YYYY-MM-DD")) {
            separatedMessages.push({ day: "Yesterday" });
          } else {
            separatedMessages.push({ day });
          }
          separatedMessages.push(this.messages[i]);
        } else {
          const prevDay = dayjs(
            this.messages[i - 1].sentAt.slice(0, 10)
          ).format("YYYY-MM-DD");
          const day = dayjs(this.messages[i].sentAt.slice(0, 10)).format(
            "YYYY-MM-DD"
          );
          if (day !== prevDay) {
            if (day === dayjs().format("YYYY-MM-DD")) {
              separatedMessages.push({ day: "Today" });
            } else if (
              day === dayjs().subtract(1, "day").format("YYYY-MM-DD")
            ) {
              separatedMessages.push({ day: "Yesterday" });
            } else {
              separatedMessages.push({ day });
            }
          }
          separatedMessages.push(this.messages[i]);
        }
      }
      return separatedMessages;
    },
  },
  data() {
    return {
      socket: null,
      input: "",
      messages: [],
      userId: "",
      showEmojiPicker: false,
    };
  },
  mounted() {
    this.socket = io("http://localhost:8000");
    this.socket.on("connect", () => {
      console.log("Connected to server");
      this.socket.emit("join", { userId: this.myUserId });
    });
    this.socket.on("areYouHere", ({ userId }) => {
      if (userId === this.$route.params.userId) {
        console.log("I am here");
        this.socket.emit("iAmHere");
      }
    });
    this.socket.on("chatMessage", ({ message, sender, receiver, sentAt }) => {
      if (
        (receiver === this.myUserId && sender === this.$route.params.userId) ||
        (receiver === this.$route.params.userId && sender === this.myUserId)
      ) {
        this.messages.push({ message, sender, receiver, sentAt, read: true });
        console.log(message, sentAt, receiver, sender);
        this.scrollToBottom();
      }
    });
    this.getChat();
    this.decodeToken();
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  methods: {
    async decodeToken() {
      try {
        const res = await axios.get("http://localhost:8000/user/decodeToken", {
          headers: {
            Authorization: `Saraha ${this.token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        console.log(res);
        this.userId = res.data.data.userId;
      } catch (err) {
        console.log(err);
      }
    },
    async sendMessage() {
      console.log(this.input);
      try {
        const res = await axios.post(
          `http://localhost:8000/chat/${this.$route.params.userId}`,
          {
            content: this.input,
          },
          {
            headers: {
              Authorization: `Saraha ${this.token}`,
            },
            withCredentials: true,
          }
        );

        console.log(res);
        this.input = "";
        this.scrollToBottom();
      } catch (error) {
        console.error(error);
      }
    },
    async getChat() {
      try {
        const res = await axios.get(
          `http://localhost:8000/chat/private/${this.$route.params.userId}`,
          {
            headers: {
              Authorization: `Saraha ${this.token}`,
            },
            withCredentials: true,
          }
        );
        console.log(this.$route.params.userId);
        this.messages = res.data.chat.messages;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      } catch (error) {
        console.error(error);
      }
    },
    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },
    addEmoji(event) {
      this.input += event.detail.unicode;
    },
    scrollToBottom() {
      const container = this.$el.querySelector("#mesgs");
      container.scrollTop = container.scrollHeight;
    },
    beforeDestroy() {
      if (this.socket) {
        this.socket.disconnect();
      }
    },
  },
};
</script>

<style scoped>
#mesgs {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  /* Scrollbar customization */
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #a0aec0 #f7fafc; /* Firefox */
}

/* WebKit-based browsers (Chrome, Safari) */
#mesgs::-webkit-scrollbar {
  width: 8px;
}

#mesgs::-webkit-scrollbar-track {
  background: #f7fafc;
  border-radius: 4px;
}

#mesgs::-webkit-scrollbar-thumb {
  background-color: #a0aec0;
  border-radius: 4px;
  border: 2px solid #f7fafc;
}

.self-start {
  align-self: flex-start;
}

.self-end {
  align-self: flex-end;
}
</style>
