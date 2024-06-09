<template>
  <div class="chat-card">
    <h2 class="bg-gray-200 m-0 p-3 rounded-lg">Public Chats</h2>
    <ul>
      <li v-if="loading"><IconsSpinner /></li>
      <li
        v-else-if="chats.length"
        v-for="chat in chats"
        :key="chat.userId"
        class=""
      >
        <div class="flex gap-3">
          <div v-if="chat.profilePicture !== ''">
            <img
              :src="chat.profilePicture"
              alt="Profile Picture"
              class="profile-pic cursor-pointer"
            />
          </div>
          <div v-else class="text-5xl">
            <img
              src="/assets/placeholder/image.png"
              alt="Profile Picture"
              class="profile-pic cursor-pointer"
            />
          </div>
          <div class="flex cursor-pointer" @click="chatRedirect(chat.userId)">
            <div class="chat-details w-64">
              <div class="inline">{{ chat.firstname }} {{ chat.lastname }}</div>
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
                {{ chat.updatedAt.slice(11, 16) }}
              </p>
              <div class="flex justify-center items-center">
                <p
                  class="bg-black rounded-lg flex justify-center text-gray-300 pl-1 pr-1"
                >
                  {{ chat.unread }}
                </p>
              </div>
            </div>
            <div v-else class="flex-col justify-center items-center">
              <p class="text-sm text-gray-500">
                {{ chat.updatedAt.slice(11, 16) }}
              </p>
            </div>
          </div>
        </div>
      </li>
      <li v-else class="">
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
export default {
  computed: {
    token() {
      return Cookies.get("userToken");
    },
    userId() {
      return Cookies.get("userId");
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
        "http://localhost:8000/user/publicChats",
        {
          headers: {
            Authorization: `Saraha ${this.token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response);
      this.loading = false;
      this.chats = response.data.ret;
    } catch (error) {
      console.log(error);
      this.loading = false;
    }
    this.socket = io("http://localhost:8000");

    this.socket.on("connect", () => {
      console.log("Connected to server");
      this.socket?.emit("join", { userId: this.userId });
    });
    this.socket.on("updatePublicChats", (data) => {
      console.log(data, "updatePublicChats");
      for (let i = 0; i < this.chats.length; i++) {
        if (this.chats[i].userId === data.userId) {
          const temp = this.chats[i];
          temp.unread++;
          temp.lastMessage = data.lastMessage;
          temp.updatedAt = data.updatedAt;
          this.chats.splice(i, 1);
          this.chats.unshift(temp);
        }
      }
    });
    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
  },
  methods: {
    chatRedirect(userId) {
      this.$router.push(`/chat/public/${userId}`);
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
  max-width: 400px;
  width: 500px;
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
