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

      <button @click="toggleMenu" class="block lg:hidden focus:outline-none">
        <svg
          class="w-6 h-6 text-gray-900"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>

      <div class="hidden lg:flex justify-center items-center w-auto flex-1">
        <ul
          :class="{
            block: isMenuOpen,
            hidden: !isMenuOpen,
          }"
          class="absolute lg:static top-16 left-0 w-full lg:w-auto bg-white lg:bg-transparent lg:flex lg:items-center lg:space-x-6 z-40 transition-transform transform lg:transform-none duration-300 ease-in-out"
        >
          <li>
            <nuxt-link
              :class="{ 'navbar-link': true, active: activeLink === 1 }"
              @click="
                changeColor(1);
                toggleMenu();
              "
              to="/"
              >Home</nuxt-link
            >
          </li>
          <li class="text-gray-300 hidden lg:block">
            <IconsSeperator />
          </li>
          <li>
            <nuxt-link
              :class="{ 'navbar-link': true, active: activeLink === 2 }"
              @click="
                changeColor(2);
                toggleMenu();
              "
              to="/about"
              >About Us</nuxt-link
            >
          </li>
          <li class="text-gray-300 hidden lg:block">
            <IconsSeperator />
          </li>
          <li>
            <nuxt-link
              :class="{ 'navbar-link': true, active: activeLink === 3 }"
              @click="
                changeColor(3);
                toggleMenu();
              "
              to="#"
              >Contact</nuxt-link
            >
          </li>
          <li class="text-gray-300 hidden lg:block">
            <IconsSeperator />
          </li>
          <li class="w-full lg:w-auto relative z-40">
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
                  v-model="authState.searchUsername"
                  class="flex w-full lg:w-96 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 z-40"
                  placeholder="Search by username"
                  @input="searchUser"
                  autocapitalize="off"
                  autocomplete="off"
                  required
                />
              </div>
            </form>
            <div
              v-if="authState.searchResultsArr.length"
              class="absolute mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-40"
            >
              <div
                v-for="user in authState.searchResultsArr"
                :key="user.userId"
                @click="goToUser(user.userId)"
                class="p-4 border-b text-gray-800 border-gray-200 hover:bg-gray-300 cursor-pointer transition duration-200 z-40"
              >
                {{ user.username }}
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="hidden lg:flex lg:gap-3 lg:items-center">
        <div v-if="authState.username">
          <nuxt-link
            class="flex lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-bold rounded-xl transition duration-200"
            :to="`/user/${authState.userId}`"
            @click="toggleMenu()"
          >
            <div class="flex gap-2 justify-center items-center">
              <IconsProfile /> Hello, {{ authState.firstname }}
            </div>
          </nuxt-link>
        </div>
        <div v-if="authState.username">
          <nuxt-link
            class="flex lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-red-200 hover:bg-red-400 text-sm text-gray-900 font-bold rounded-xl transition duration-200"
            to="/login"
            @click="
              logout();
              toggleMenu();
            "
            >Logout</nuxt-link
          >
        </div>
        <div v-if="!authState.username">
          <nuxt-link
            class="flex lg:inline-block lg:ml-auto lg:mr-3 py-2 px-6 bg-gray-50 hover:bg-gray-100 text-sm text-gray-900 font-bold rounded-xl transition duration-200"
            to="/login"
            @click="
              changeColor(4);
              toggleMenu();
            "
            >Sign In</nuxt-link
          >
        </div>
        <div v-if="!authState.username">
          <nuxt-link
            class="flex lg:inline-block py-2 px-6 bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold rounded-xl transition duration-200"
            to="/signup"
            @click="
              changeColor(4);
              toggleMenu();
            "
            >Sign up</nuxt-link
          >
        </div>
      </div>
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
      authState,
      isMenuOpen: false,
    };
  },
  computed: {
    logedIn() {
      return (
        this.authState.token !== undefined &&
        this.authState.token !== null &&
        this.authState.token !== ""
      );
    },
  },
  methods: {
    async decodeToken() {
      try {
        const res = await axios.get("http://localhost:8000/user/decodeToken", {
          headers: {
            Authorization: `Saraha ${this.authState.token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        console.log(res.data.data, "Decoded token");
        setAuthState(res.data.data);
        this.authState.loading = false;
      } catch (err) {
        console.log(err);
      }
    },
    async redirect() {
      if (this.logedIn) {
        await this.decodeToken();
      } else {
        this.authState.loading = false;
      }
    },
    async searchUser() {
      console.log(this.authState.searchUsername);
      if (
        this.authState.searchUsername === "" ||
        this.authState.searchUsername == null
      ) {
        this.authState.searchResultsArr = [];
        return;
      }
      try {
        const res = await axios.get("http://localhost:8000/user/search", {
          params: {
            username: this.authState.searchUsername,
          },
        });
        this.authState.searchResultsArr = res.data.users;
      } catch (err) {
        console.log(err.response);
      }
    },
    async logout() {
      console.log("Logging out", this.authState.token);
      try {
        const res = await axios.patch(
          "http://localhost:8000/user/logout",
          {},
          {
            headers: {
              Authorization: `Saraha ${this.authState.token}`,
            },
            withCredentials: true,
          }
        );
        Cookies.remove("userToken");
        Cookies.remove("userId");
        clearAuthState();
        console.log(res, "Logged out");
        this.$router.push("/login");
      } catch (err) {
        console.log(err.response);
      }
    },
    async goToUser(userId) {
      this.authState.searchUsername = "";
      this.authState.searchResultsArr = [];
      this.$router.push({ path: `/user/${userId}` });
    },
    changeColor(index) {
      this.authState.activeLink = index;
      this.isMenuOpen = false;
    },
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
  },
  mounted() {
    this.redirect();
  },
};
</script>

<style scoped>
.navbar-link {
  transition: color 0.3s ease-in-out;
}
.navbar-link.active {
  color: blue;
}
@media (max-width: 1024px) {
  ul {
    background-color: white;
    border-top: 1px solid #e2e8f0;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  li {
    border-bottom: 1px solid #e2e8f0;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}
</style>
