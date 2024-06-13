<template>
  <div
    class="flex h-screen w-screen justify-center items-center"
    v-if="isLoading"
  >
    <img
      src="@/assets/Logo/png/saraha-favicon-color.png"
      alt="Saraha Logo"
      class="h-24 self-center animate-bounce"
    />
    <IconsSpinner />
  </div>
  <div
    class="flex justify-center items-center"
    v-else-if="!isLoading && !error"
  >
    <img
      src="@/assets/Logo/png/saraha-favicon-color.png"
      alt="Saraha Logo"
      class="h-24 self-center animate-bounce"
    />
    <div class="flex justify-center items-center h-screen">
      <div
        class="bg-gray-800 text-white rounded-lg p-8 max-w-md text-center mb-6"
      >
        <h1 class="text-3xl font-bold mb-4">Welcome to Saraha</h1>
        <p class="text-lg mb-6">Your account is verified.</p>
        <nuxt-link
          class="py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200"
          to="/login"
          >Sign In</nuxt-link
        >
      </div>
    </div>
  </div>
  <div class="flex justify-center items-center" v-else-if="!isLoading && error">
    <img
      src="@/assets/Logo/png/saraha-favicon-color.png"
      alt="Saraha Logo"
      class="h-24 self-center animate-bounce"
    />
    <div class="flex justify-center items-center h-screen">
      <div class="bg-gray-800 text-white rounded-lg p-8 max-w-md text-center">
        <h1 class="text-3xl font-bold mb-4">Some error occurred</h1>
        <p class="text-lg mb-6">Please try to sign up again.</p>
      </div>
    </div>
  </div>
  <slot />
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      isLoading: true,
      error: false,
    };
  },
  async mounted() {
    try {
      await axios.post(
        `http://localhost:8000/user/confirmEmail/${this.$route.params.userToken}`
      );
      this.isLoading = false;
    } catch (error) {
      console.error(error);
      this.error = true;
      this.isLoading = false;
    }
  },
};

definePageMeta({
  title: "Verify Email",
  layout: "account",
});
</script>
