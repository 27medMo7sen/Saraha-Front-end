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
          <!-- Search Results -->
          <div
            v-if="searchResultsArr.length"
            class="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-40"
          >
            <div
              v-for="user in searchResultsArr"
              :key="user"
              @click="goToUser(user)"
              class="p-4 border-b text-gray-800 border-gray-200 hover:bg-gray-300 cursor-pointer transition duration-200 z-40"
            >
              {{ user }}
            </div>
          </div>
        </li>
      </ul>
      <nuxt-link
        v-if="logedIn()"
        class="flex lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-bold rounded-xl transition duration-200"
        :to="`/user/${username}`"
        ><div class="flex gap-2 justify-center items-center">
          <IconsProfile /> Hello, {{ firstname }}
        </div></nuxt-link
      >
      <nuxt-link
        v-if="!logedIn()"
        class="hidden lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-bold rounded-xl transition duration-200"
        to="/login"
        @click="changeColor(4)"
        >Sign In</nuxt-link
      >
      <nuxt-link
        v-if="!logedIn()"
        class="hidden lg:inline-block py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200"
        to="/signup"
        @click="changeColor(4)"
        >Sign up</nuxt-link
      >
    </nav>
    <div class="navbar-menu relative z-50 hidden">
      <div class="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
      <nav
        class="fixed top-0 left-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-r overflow-y-auto"
      >
        <div class="flex items-center mb-8">
          <nuxt-link class="mr-auto text-3xl font-bold leading-none" to="/">
            <img
              src="/assets/Logo/png/logo-no-background.png"
              class="h-7"
              alt="logo"
              viewBox="0 0 10240 10240"
            />
          </nuxt-link>
          <button class="navbar-close" @click="toggleMenu">
            <svg
              class="h-6 w-6 text-gray-400 cursor-pointer hover:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div>
          <ul>
            <li class="mb-1">
              <nuxt-link
                class="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                to="#"
                >Home</nuxt-link
              >
            </li>
            <li class="mb-1">
              <nuxt-link
                class="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                to="#"
                >About Us</nuxt-link
              >
            </li>
            <li class="mb-1">
              <nuxt-link
                class="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                to="#"
                >Services</nuxt-link
              >
            </li>
            <li class="mb-1">
              <nuxt-link
                class="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                to="#"
                >Pricing</nuxt-link
              >
            </li>
            <li class="mb-1">
              <nuxt-link
                class="block p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded"
                to="#"
                >Contact</nuxt-link
              >
            </li>
          </ul>
        </div>
        <div class="mt-auto">
          <div class="pt-6">
            <a
              class="block px-4 py-3 mb-3 leading-loose text-xs text-center font-semibold bg-gray-50 hover:bg-gray-100 rounded-xl"
              href="#"
              >Sign in</a
            >
            <a
              class="block px-4 py-3 mb-2 leading-loose text-xs text-center text-white font-semibold bg-blue-600 hover:bg-blue-700 rounded-xl"
              href="#"
              >Sign Up</a
            >
          </div>
          <p class="my-4 text-xs text-center text-gray-400">
            <span>Copyright © 2021</span>
          </p>
        </div>
      </nav>
    </div>
  </div>
  <slot />
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
// import jwt from "jsonwebtoken";
// import * as jwt_decode from "jwt-decode";
export default {
  computed: {
    token() {
      const token = Cookies.get("userToken");
      console.log("done:", token);
      return token;
    },
  },
  data() {
    return {
      username: "",
      searchUsername: "",
      firstname: "",
      searchResultsArr: [],
    };
  },
  methods: {
    logedIn() {
      return this.token != undefined && this.token != null && this.token != "";
    },

    async decodeToken() {
      try {
        const res = await axios.get("http://localhost:8000/user/decodeToken", {
          headers: {
            Authorization: `Saraha ${this.token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        console.log(res);
        console.log(this.token);

        this.firstname = res.data.data.firstname;
        this.username = res.data.data.username;
      } catch (err) {
        console.log(err);
      }
    },
    async redirect() {
      if (this.logedIn()) {
        console.log("here");
        await this.decodeToken();
      } else return;
    },
    async searchUser() {
      try {
        const res = await axios.get("http://localhost:8000/user/search", {
          params: {
            username: this.searchUsername,
          },
        });
        this.searchResultsArr = [];
        if (this.searchUsername === "") return;
        for (const key in res.data.users) {
          this.searchResultsArr.push(res.data.users[key].username);
        }
        console.log(this.searchResultsArr);
      } catch (err) {
        console.log(err.response);
      }
    },
    async goToUser(user) {
      this.searchUsername = "";
      this.searchResultsArr = [];
      this.$router.push({ path: `/user/${user}` });
    },
    toggleMenu() {
      const menu = document.querySelectorAll(".navbar-menu");
      for (var j = 0; j < menu.length; j++) {
        menu[j].classList.toggle("hidden");
      }
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
/* Add your custom styles here */
</style>
