<template>
  <div>
    <h1>Socket.IO with Nuxt.js</h1>
    <button @click="sendMessage">Send Message</button>
    <p>{{ message }}</p>
    <publicFriendsCard />
    <anonymousFriendsCard />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { io, Socket } from "socket.io-client";

export default defineComponent({
  data() {
    return {
      socket: null as Socket | null, // Define the type for the socket property
      message: "",
    };
  },
  mounted() {
    this.socket = io("http://localhost:8000");

    this.socket.on("connect", () => {
      console.log("Connected to server");
    });
    this.socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    this.socket.on("messageFromServer", (data: string) => {
      this.message = data;
    });
    this.sendMessage();
  },
  methods: {
    sendMessage() {
      if (this.socket) {
        this.socket.emit("messageFromClient", "Hello from client");
      } else {
        console.error("Socket instance not available");
      }
    },
  },
  beforeDestroy() {
    // Clean up the socket connection when the component is destroyed
    if (this.socket) {
      this.socket.disconnect();
    }
  },
});
</script>

<style scoped>
/* Add your component styles here */
</style>
