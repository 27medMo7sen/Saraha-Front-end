<script setup></script>
<template>
  <div class="flex justify-center items-center">
    <img
      src="@/assets/Logo/png/saraha-favicon-color.png"
      alt="Saraha Logo"
      class="h-24 self-center animate-bounce"
    />
    <div class="flex justify-center items-center h-screen">
      <div class="bg-gray-800 text-white rounded-lg p-8 max-w-md text-center">
        <h1 class="text-3xl font-bold mb-4">Verify Your Email</h1>
        <p class="text-lg mb-6">
          Please check your email to verify your account.
        </p>
      </div>
    </div>
  </div>
  <slot />
</template>

<script>
definePageMeta({
  title: "Verify Email",
  layout: "account",
});
export default {
  head() {
    return {
      title: "Verify Email",
    };
  },
};
</script>
