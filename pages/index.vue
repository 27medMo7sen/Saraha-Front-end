<template>
  <div class="main-page font-ubuntu">
    <div v-if="logedIn()" class="content-wrapper">
      <CombinedFriendsCards class="left-pane" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { io, Socket } from "socket.io-client";
import Cookies from "js-cookie";

export default defineComponent({
  computed: {
    userId() {
      return Cookies.get("userId");
    },
  },
  data() {
    return {
      socket: null as Socket | null,
      message: "",
      token: "",
    };
  },
  mounted() {
    // this.socket = io("http://localhost:8000");
    // this.socket.on("connect", () => {
    //   console.log("Connected to server");
    //   this.socket?.emit("join", { userId: this.userId });
    // });
    // this.socket.on("disconnect", () => {
    //   console.log("Disconnected from server");
    // });
    // this.socket.on("messageFromServer", (data: string) => {
    //   this.message = data;
    // });
  },
  methods: {
    logedIn() {
      console.log("yes ", this.token);
      const token = Cookies.get("userToken");
      console.log("done:", token);
      if (token) {
        return true;
      } else {
        return false;
      }
    },
  },
});
</script>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh; /* Full height of the viewport */
}

.content-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 80%; /* Take up most of the viewport height */
}

.left-pane {
  flex: 0 0 450px; /* Ensure the left pane does not shrink or grow */
}

.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
}

.description-box {
  background-color: #333;
  color: #fff;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  width: 50%;
}

.button-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.signup-button,
.login-button {
  position: relative;
  top: -1px;
  left: -1px;
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
  border-radius: 4px;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.signup-button:hover {
  background-color: #00d084;
  color: #333;
}

.login-button:hover {
  background-color: #00d084;
  color: #333;
}
</style>
