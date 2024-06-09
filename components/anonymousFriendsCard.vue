<template>
  <div class="chat-card">
    <h2 class="bg-gray-200 m-0 p-3 rounded-lg">anonymous Chats</h2>
    <ul>
      <li v-if="loading"><IconsSpinner /></li>
      <li
        v-else-if="chats && chats.length > 0"
        v-for="chat in chats"
        :key="chat.userId"
        class="chat-item flex gap-2"
      >
        <div class="text-3xl"><IconsAnonymous /></div>
        <div
          class="cursor-pointer chat-details"
          @click="chatRedirect(chat.starter)"
        >
          <p class="text-gray-500">anonymous user</p>
          <p class="last-message text-sm text-gray-400">
            {{ chat.lastMessage }}
          </p>
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

export default {
  computed: {
    token() {
      return Cookies.get("userToken");
    },
  },
  data() {
    return {
      chats: [],
      loading: true,
      error: null,
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
      console.log(response);
      this.chats = response.data.chats || [];
      this.loading = false;
    } catch (error) {
      this.error = error.message;
      this.loading = false;
    }
  },
  methods: {
    chatRedirect(userId) {
      this.$router.push(`/chat/private/${userId}`);
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
  margin-right: 10px;
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
