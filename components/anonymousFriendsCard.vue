<template>
  <div class="chat-card">
    <h2>anonymous Chats</h2>
    <ul>
      <li v-if="loading"><IconsSpinner /></li>
      <li
        v-else
        v-for="chat in chats"
        :key="chat.chatId"
        class="chat-item flex gap-2"
      >
        <div class="text-3xl"><IconsAnonymous /></div>
        <div class="cursor-pointer" @click="chatRedirect(chat._id)">
          <p class="text-gray-500">anonymous user</p>
        </div>
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
      console.log(response.data);
      this.chats = response.data.chats;
      this.loading = false;
    } catch (error) {
      this.error = error.message;
    }
  },
  methods: {
    chatRedirect(chatId) {
      this.$router.push(`/chat/private/${chatId}`);
    },
  },
};
</script>

<style scoped>
.chat-card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  max-width: 400px;
  margin: 0 auto;
  background-color: #f9f9f9;
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

.chat-details {
  display: flex;
  flex-direction: column;
}
</style>
