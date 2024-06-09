<template>
  <div class="z-40">
    <nav
      class="relative px-4 py-4 flex justify-between items-center bg-white z-40"
    >
      <nuxt-link to="/" class="text-3xl font-bold leading-none">
        <img
          src="/assets/Logo/png/logo-no-background.png"
          alt="LOGO"
          class="h-7"
        />
      </nuxt-link>
      <div class="lg:hidden">
        <button
          class="navbar-burger flex items-center text-blue-600 p-3 z-40"
          @click="toggleMenu"
        >
          <svg
            class="block h-4 w-4 fill-current"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Mobile menu</title>
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
          </svg>
        </button>
      </div>
      <ul
        class="hidden absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 lg:mx-auto lg:flex lg:items-center lg:w-auto lg:space-x-6 z-40"
      >
        <li>
          <nuxt-link
            :class="{ 'navbar-link': true, active: activeLink === 1 }"
            @click="changeColor(1)"
            to="/"
            >Home</nuxt-link
          >
        </li>
        <li class="text-gray-300">
          <IconsSeperator />
        </li>
        <li>
          <nuxt-link
            :class="{ 'navbar-link': true, active: activeLink === 2 }"
            @click="changeColor(2)"
            to="/about"
            >About Us</nuxt-link
          >
        </li>
        <li class="text-gray-300">
          <IconsSeperator />
        </li>
        <li>
          <nuxt-link
            :class="{ 'navbar-link': true, active: activeLink === 3 }"
            @click="changeColor(3)"
            to="#"
            >Contact</nuxt-link
          >
        </li>
        <li class="text-gray-300">
          <IconsSeperator />
        </li>
        <li class="text-gray-300 w-auto relative z-40">
          <form class="max-w-md mx-auto z-40">
            <label
              for="default-search"
              class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white z-40"
              >Search</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none z-40"
              >
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400 z-40"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                v-model="searchUsername"
                class="flex w-96 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 z-40"
                placeholder="Search by username"
                @input="searchUser"
                autocapitalize="off"
                autocomplete="off"
                required
              />
            </div>
          </form>
          <div
            v-if="searchResultsArr.length"
            class="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-40"
          >
            <div
              v-for="user in searchResultsArr"
              :key="user.userId"
              @click="goToUser(user.userId)"
              class="p-4 border-b text-gray-800 border-gray-200 hover:bg-gray-300 cursor-pointer transition duration-200 z-40"
            >
              {{ user.username }}
            </div>
          </div>
        </li>
      </ul>
      <nuxt-link
        v-if="logedIn"
        class="flex lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-bold rounded-xl transition duration-200"
        :to="`/user/${userId}`"
      >
        <div class="flex gap-2 justify-center items-center">
          <IconsProfile /> Hello, {{ firstname }}
        </div>
      </nuxt-link>
      <nuxt-link
        v-if="!logedIn"
        class="hidden lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-bold rounded-xl transition duration-200"
        to="/login"
        @click="changeColor(4)"
        >Sign In</nuxt-link
      >
      <nuxt-link
        v-if="!logedIn"
        class="hidden lg:inline-block py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200"
        to="/signup"
        @click="changeColor(4)"
        >Sign up</nuxt-link
      >
    </nav>
  </div>
  <slot />
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      username: "",
      searchUsername: "",
      userId: "",
      firstname: "",
      searchResultsArr: [],
      loading: true,
      activeLink: null,
    };
  },
  computed: {
    token() {
      return Cookies.get("userToken");
    },
    logedIn() {
      return (
        this.token !== undefined && this.token !== null && this.token !== ""
      );
    },
  },
  methods: {
    async decodeToken() {
      try {
        const res = await axios.get("http://localhost:8000/user/decodeToken", {
          headers: {
            Authorization: `Saraha ${this.token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        this.userId = res.data.data.userId;
        this.firstname = res.data.data.firstname;
        this.username = res.data.data.username;
        this.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    async redirect() {
      if (this.logedIn) {
        await this.decodeToken();
      } else {
        this.loading = false;
      }
    },
    async searchUser() {
      try {
        const res = await axios.get("http://localhost:8000/user/search", {
          params: {
            username: this.searchUsername,
          },
        });
        this.searchResultsArr = res.data.users;
      } catch (err) {
        console.log(err.response);
      }
    },
    async goToUser(userId) {
      this.searchUsername = "";
      this.searchResultsArr = [];
      this.$router.push({ path: `/user/${userId}` });
    },
    changeColor(index) {
      this.activeLink = index;
    },
  },
  mounted() {
    this.redirect();
  },
};
</script>

<style scoped>
/* Add your scoped styles here */
</style>
