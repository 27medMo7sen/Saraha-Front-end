<template>
  <div class="chat-card">
    <h2 class="bg-gray-200 m-0 p-3 rounded-lg">Anonymous Chats</h2>
    <ul>
      <li v-if="loading"><IconsSpinner /></li>
      <li
        v-else-if="reformChats.length"
        v-for="chat in reformChats"
        :key="chat.userId"
        class="chat-item flex gap-2"
      >
        <div class="text-3xl"><IconsAnonymous /></div>
        <div class="flex cursor-pointer" @click="chatRedirect(chat.userId)">
          <div class="chat-details w-64">
            <div class="inline">Anonymous user</div>
            <div
              v-if="chat.unread !== 0"
              class="text-sm text-black flex justify-between"
            >
              <p class="last-message font-semibold">{{ chat.lastMessage }}</p>
            </div>
            <div v-else class="text-sm text-gray-900 flex justify-between">
              <p class="last-message">{{ chat.lastMessage }}</p>
            </div>
          </div>
          <div
            v-if="chat.unread !== 0"
            class="flex-col justify-center items-center"
          >
            <p class="text-sm text-black">
              {{ formattedDate(chat.updatedAt) }}
            </p>
            <div class="flex justify-center items-center">
              <p
                class="bg-black rounded-lg flex justify-center text-gray-300 pl-1 pr-1"
              >
                {{ chat.unread }}
              </p>
            </div>
          </div>
          <div v-else class="flex w-20 justify-center items-center">
            <p class="text-sm inline text-gray-500">
              {{ formattedDate(chat.updatedAt) }}
            </p>
          </div>
        </div>
      </li>
      <li v-else>
        <p class="mt-32 ml-11 text-xl bg-gray-800 rounded-lg p-2 text-gray-200">
          No chats available
        </p>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import io from "socket.io-client";
import dayjs from "dayjs";

export default {
  computed: {
    token() {
      return Cookies.get("userToken");
    },
    userId() {
      return Cookies.get("userId");
    },
    reformChats() {
      return this.chats.map((chat) => {
        const appendList = {};
        appendList.userId = chat.userId;
        appendList.lastMessage = chat.lastMessage;
        appendList.unread = chat.unread;

        const today = dayjs().format("YYYY-MM-DD");
        const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
        const chatDate = dayjs(chat.updatedAt.slice(0, 10)).format(
          "YYYY-MM-DD"
        );

        if (chatDate === today) {
          console.log(chatDate, today, chat.updatedAt.slice(0, 10));
          appendList.updatedAt = chat.updatedAt.slice(11, 16);
        } else if (chatDate === yesterday) {
          appendList.updatedAt = "yesterday";
        } else {
          appendList.updatedAt = chat.updatedAt.slice(0, 10);
        }
        return appendList;
      });
    },
  },
  data() {
    return {
      chats: [],
      loading: true,
      error: null,
      socket: null,
    };
  },
  async mounted() {
    try {
      const response = await axios.get(
        "http://localhost:8000/user/privateChats",
        {
          headers: {
            Authorization: `Saraha ${this.token}`,
          },
          withCredentials: true,
        }
      );
      this.chats = response.data.ret || [];
      this.loading = false;
    } catch (error) {
      this.error = error.message;
      this.loading = false;
    }

    this.socket = io("http://localhost:8000");

    this.socket.on("connect", () => {
      this.socket.emit("join", { userId: this.userId });
    });

    this.socket.on("updateAnonymousChats", (data) => {
      const index = this.chats.findIndex((chat) => chat.userId === data.userId);
      if (index !== -1) {
        const chat = this.chats[index];
        chat.unread++;
        chat.lastMessage = data.lastMessage;
        chat.updatedAt = dayjs(data.updatedAt).toISOString(); // Ensure date formatting
        this.chats.splice(index, 1);
        this.chats.unshift(chat);
      }
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  methods: {
    chatRedirect(userId) {
      this.$router.push(`/chat/private/${userId}`);
    },
    formattedDate(date) {
      if (date === "yesterday" || date.includes(":")) {
        return date;
      }
      return dayjs(date).format("YYYY-MM-DD");
    },
  },
};
</script>

<style scoped>
.chat-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  height: 470px;
  width: 420px;
  margin: 0 auto;
  background-color: #0c0808;
}

.chat-card h2 {
  margin-top: 0;
}

.chat-card ul {
  list-style: none;
  padding: 0;
}

.chat-card li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
}

.chat-card li:last-child {
  border-bottom: none;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.chat-details {
  display: flex;
  flex-direction: column;
}

.chat-details .last-message {
  white-space: nowrap;
  overflow: hidden;
  width: 220px;
  text-overflow: ellipsis;
}
</style>
