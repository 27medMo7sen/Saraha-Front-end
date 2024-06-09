<script setup></script>
<template>
  <div class="flex justify-center items-center h-screen w-screen">
    <img
      src="@/assets/Logo/png/saraha-favicon-color.png"
      alt="Saraha Logo"
      class="h-24 self-center animate-bounce"
    />
    <div class="flex justify-center items-center h-screen">
      <div class="flex justify-center items-center h-screen">
        <div class="bg-gray-800 rounded-lg p-8 w-full max-w-md">
          <div v-if="isLoading" class="font-ubuntu text-white">
            <IconsSpinner /><span>Almost done...</span>
          </div>
          <div v-else>
            <form @submit.prevent="login" class="space-y-6">
              <div class="flex flex-col space-y-4">
                <div class="flex flex-col">
                  <label for="email" class="text-gray-300">Email</label>
                  <input
                    id="email"
                    type="text"
                    v-model="user.email"
                    placeholder="example@gmail.com"
                    class="input"
                  />
                  <div class="text-red-300 text-xs italic">
                    {{ errors.email }}
                  </div>
                </div>
                <div class="flex flex-col">
                  <label for="password" class="text-gray-300">Password</label>
                  <input
                    id="password"
                    type="password"
                    v-model="user.password"
                    placeholder="******************"
                    class="input"
                  />
                  <div class="text-red-300 text-xs italic">
                    {{ errors.password }}
                  </div>
                </div>
              </div>
              <div class="text-xs">
                <nuxt-link to="/forget" class="text-gray-300 hover:underline"
                  >Forgot password?</nuxt-link
                >
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <button type="submit" class="btn">Login</button>
                  <div>
                    <input
                      type="checkbox"
                      v-model="user.rememberMe"
                      class="form-checkbox rounded text-primary-500"
                    />
                    <label class="ml-2 text-gray-300">Remember Me</label>
                  </div>
                </div>
              </div>
              <div class="text-sm text-gray-300 text-center">
                <p>Don't have an account?</p>
                <nuxt-link
                  to="/signup"
                  class="font-medium text-primary hover:underline"
                  >Signup here</nuxt-link
                >
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
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
      user: {
        email: "",
        password: "",
      },
      isLoading: false,
      isLoadingTitle: "Loding...",
      errors: {},
    };
  },
  methods: {
    async login() {
      this.isLoading = true;
      this.errors = {};
      try {
        const res = await axios.post(
          `http://localhost:8000/user/login`,
          this.user,
          { withCredentials: true }
        );
        console.log(res, "dafsdfasdfafsd");
        Cookies.set("userId", res.data.user.userId);
        console.log(this.token, "you've done it");
        this.user.email = "";
        this.user.password = "";
        this.isLoading = false;
        this.isLoadingTitle = "Loding...";
        this.$router.push("/");
      } catch (err) {
        console.log(err.response);
        if (err.response.data.message.startsWith("password")) {
          this.errors.password = err.response.data.message.substring(9);
          this.password = "";
        }
        if (err.response.data.message.startsWith("email")) {
          this.errors.email = err.response.data.message.substring(5);
          this.email = "";
          this.password = "";
        }
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped></style>
