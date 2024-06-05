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
        class="w-full bg-white rounded-lg shadow-lg p-6 flex-grow overflow-y-auto m-7"
      >
        <ul id="mesgs" class="space-y-2 w-full">
          <li
            v-for="(message, index) in messages"
            :key="index"
            :class="{
              'bg-gray-200 text-black self-start': message.sender === userId,
              'bg-black text-white self-end': message.sender !== userId,
            }"
            class="p-2 rounded-lg max-w-1/3 break-words"
          >
            {{ message.message }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Input Form -->
    <form @submit.prevent="sendMessage" class="w-full flex px-4 pb-6">
      <input
        v-model="input"
        autocomplete="off"
        class="flex-1 px-4 py-2 border border-gray-500 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black"
      />
      <button
        type="submit"
        class="px-4 py-2 bg-black text-white rounded-r-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        <IconsSend />
      </button>
    </form>
  </div>
</template>

<script>
import io from "socket.io-client";
import Cookies from "js-cookie";
import axios from "axios";

export default {
  computed: {
    token() {
      return Cookies.get("userToken");
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
    };
  },
  mounted() {
    this.socket = io("http://localhost:8000");
    this.socket.on("connect", () => {
      console.log("Connected to server");
    });
    this.socket.on("chatMessage", ({ message, sender }) => {
      this.messages.push({ message, sender });
      console.log(message, sender);
    });
    this.fetchUser();
    this.getCaht();
  },
  methods: {
    async fetchUser() {
      try {
        const res = await axios.get(
          `http://localhost:8000/user/${this.$route.params.username}`,
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
        this.userId = res.data.user._id;
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
            sendTo: this.username,
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
      } catch (error) {
        console.error(error);
      }
    },
    async getCaht() {
      try {
        const res = await axios.get(
          `http://localhost:8000/chat/public/${this.$route.params.username}`,
          {
            headers: {
              Authorization: `Saraha ${this.token}`,
            },
            withCredentials: true,
          }
        );
        this.messages = res.data.chat.messages;
        console.log(res.data.chat.messages);
      } catch (error) {
        console.error(error);
      }
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
/* Add your custom styles here */
#mesgs {
  display: flex;
  flex-direction: column;
}
.self-start {
  align-self: flex-start;
}
.self-end {
  align-self: flex-end;
}
</style>
