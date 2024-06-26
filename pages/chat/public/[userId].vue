<template>
  <div class="min-h-screen flex flex-col justify-between bg-gray-100">
    <!-- Header -->
    <header
      class="w-full bg-white shadow p-4 rounded-md flex items-center justify-between mt-4"
    >
      <div class="flex items-center">
        <img
          v-if="profilePhoto"
          :src="profilePhoto"
          alt="Profile Photo"
          class="w-10 h-10 rounded-full mr-4"
        />
        <img
          v-else
          src="@/assets/placeholder/image.png"
          alt="Profile Photo"
          class="w-10 h-10 rounded-full mr-4"
        />
        <div>
          <h2 class="text-lg font-semibold">{{ name }}</h2>
          <p class="text-sm text-gray-600">{{ username }}</p>
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
            v-for="(message, index) in sepratedMessages"
            :key="index"
            :class="{
              'w-full h-9  flex justify-center items-center': message.day,
              'p-2 rounded-lg w-auto min-w-36 max-w-96 break-words bg-gray-200 text-black self-start':
                !message.day && message.sender === userId,
              'p-2 rounded-lg w-auto min-w-36 max-w-96 break-words bg-black text-white self-end':
                !message.day && message.sender !== userId,
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
                v-if="message.sender !== userId"
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

    <!-- Input Form -->
    <form @submit.prevent="sendMessage" class="w-full flex px-4 pb-6 relative">
      <input
        v-model="input"
        autocomplete="off"
        class="flex-1 px-4 py-2 border border-gray-500 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black"
      />
      <button
        type="button"
        @click="toggleEmojiPicker"
        class="px-4 py-2 bg-gray-200 text-black rounded-r-none hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
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
    sepratedMessages() {
      if (this.messages.length === 0) return [];
      const sepratedMessages = [];
      for (let i = 0; i < this.messages.length; i++) {
        if (i === 0) {
          const day = dayjs(this.messages[i].sentAt.slice(0, 10)).format(
            "YYYY-MM-DD"
          );
          console.log(day);
          if (day === dayjs().format("YYYY-MM-DD")) {
            sepratedMessages.push({ day: "Today" });
          } else if (day === dayjs().subtract(1, "day").format("YYYY-MM-DD")) {
            sepratedMessages.push({ day: "Yesterday" });
          } else {
            sepratedMessages.push({ day });
          }
          sepratedMessages.push([this.messages[i]]);
        } else {
          const prevDay = dayjs(
            this.messages[i - 1].sentAt.slice(0, 10)
          ).format("YYYY-MM-DD");
          const day = dayjs(this.messages[i].sentAt.slice(0, 10)).format(
            "YYYY-MM-DD"
          );
          if (day === prevDay) {
            sepratedMessages[sepratedMessages.length - 1].push(
              this.messages[i]
            );
          } else {
            if (day === dayjs().format("YYYY-MM-DD")) {
              sepratedMessages.push({ day: "Today" });
            } else if (
              day === dayjs().subtract(1, "day").format("YYYY-MM-DD")
            ) {
              sepratedMessages.push({ day: "Yesterday" });
            } else {
              sepratedMessages.push({ day });
            }
            sepratedMessages.push([this.messages[i]]);
          }
        }
      }
      return sepratedMessages.flat();
    },
  },
  data() {
    return {
      socket: null,
      input: "",
      messages: [],
      name: "",
      userId: "",
      username: "",
      profilePhoto: "",
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
      if (userId === this.userId) {
        console.log("I am here");
        this.socket.emit("iAmHere");
      }
    });
    this.socket.on("chatMessage", ({ message, sender, receiver, sentAt }) => {
      if (
        (receiver === this.myUserId && sender === this.userId) ||
        (receiver === this.userId && sender === this.myUserId)
      ) {
        this.messages.push({ message, sender, receiver, sentAt, read: true });
        console.log(message, sentAt, receiver, sender, "1111111111111");
        this.scrollToBottom();
      }
    });
    this.fetchUser();
    this.getCaht();
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  methods: {
    async fetchUser() {
      try {
        const res = await axios.get(
          `http://localhost:8000/user/${this.$route.params.userId}`,
          {
            headers: {
              Authorization: `Saraha ${this.token}`,
            },
            withCredentials: true,
          }
        );
        console.log(res.data);
        if (res.data.user.profile_pic)
          this.profilePhoto = res.data.user.profile_pic.secure_url;
        this.userId = res.data.user.userId;
        console.log(this.userId);
        this.name = `${res.data.user.firstname} ${res.data.user.lastname}`;
        this.username = res.data.user.username;
        console.log(res.data.user.token);
      } catch (err) {
        console.log(err);
      }
    },
    async sendMessage() {
      try {
        const res = await axios.post(
          "http://localhost:8000/chat",
          {
            content: this.input,
            sendTo: this.userId,
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
    async getCaht() {
      try {
        const res = await axios.get(
          `http://localhost:8000/chat/public/${this.$route.params.userId}`,
          {
            headers: {
              Authorization: `Saraha ${this.token}`,
            },
            withCredentials: true,
          }
        );
        this.messages = res.data.chat.messages;
        console.log(res.data.chat.messages);
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      } catch (error) {
        console.error(error);
      }
    },
    scrollToBottom() {
      const container = this.$el.querySelector("#mesgs");
      container.scrollTop = container.scrollHeight;
    },
    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
    },
    addEmoji(event) {
      this.input += event.detail.unicode;
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
