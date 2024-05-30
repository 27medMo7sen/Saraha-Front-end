<script setup lang="ts"></script>

<template>
  <div class="font-ubuntu flex-col h-96">
    <h1 class="text-2xl font-bold m-5 >Welcome to Saraha">Welcome to Saraha</h1>
    <div class="flex h-80 w-auto justify-center items-center">
      <img
        src="@/assets/Logo/png/saraha-favicon-color.png"
        alt="Saraha Logo"
        class="h-24 self-end animate-bounce"
      />
      <div
        class="flex justify-center text-center bg-gray-800 text-gray-200 rounded-lg h-2/5 w-1/2 p-4"
      >
        <p class="">
          Discover Saraha: Where anonymity meets connection. Send anonymous
          messages, share hints, and spark conversations with friends.signup or
          login if you allready have an account to unlock features like
          searching for and connecting with your friends. Use hints to drop
          subtle clues or share secrets anonymously. Join us today and start
          sharing your thoughts anonymously.
        </p>
      </div>
    </div>
    <div class="flex justify-center items-center gap-2">
      <button
        class="relative -top-1 -left-1 hover:bg-emerald-300 rounded-l-md hover:text-gray-800 bg-gray-800 py-2.5 px-5 font-medium uppercase text-white transition-all before:absolute before:top-1 before:left-1 before:-z-[1] before:h-full before:w-full before:border-2 before:rounded-l-md before:border-gray-700 before:transition-all before:content-[''] hover:top-0 hover:left-0 before:hover:top-0 before:hover:left-0"
      >
        <nuxt-link to="/signup">Signup</nuxt-link>
      </button>
      <button
        class="relative -top-1 -left-1 bg-gray-800 py-2.5 px-5 hover:bg-lime-400 rounded-r-md hover:text-gray-800 font-medium uppercase text-white transition-all before:absolute before:top-1 before:left-1 before:-z-[1] before:h-full before:w-full before:border-2 before:rounded-r-md before:border-gray-700 before:transition-all before:content-[''] hover:top-0 hover:left-0 before:hover:top-0 before:hover:left-0"
        to="/login"
      >
        <nuxt-link to="/login">login</nuxt-link>
      </button>
    </div>
  </div>
</template>
