<template>
  <div class="chat-card">
    <h2>Recent Chats</h2>
    <ul>
      <li v-if="loading"><IconsSpinner /></li>
      <li v-else v-for="chat in chats" :key="chat.chatId" class="chat-item">
        <img
          :src="chat.profilePicture"
          alt="Profile Picture"
          class="profile-pic cursor-pointer"
        />
        <div
          class="chat-details cursor-pointer"
          @click="chatRedirect(chat.username)"
        >
          <strong>{{ chat.firstname }} {{ chat.lastname }}</strong>
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
        "http://localhost:8000/user/publicChats",
        {
          headers: {
            Authorization: `Saraha ${this.token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response.data.ret);
      this.chats = response.data.ret;
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    chatRedirect(username) {
      this.$router.push(`/chat/public/${username}`);
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
</style>
