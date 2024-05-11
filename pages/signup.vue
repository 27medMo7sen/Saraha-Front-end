<script setup>
definePageMeta({
  layout: "landing",
});
</script>
<template>
  <div class="flex justify-center items-center h-screen w-screen">
    <img
      src="@/assets/Logo/png/saraha-favicon-color.png"
      alt="Saraha Logo"
      class="h-24 self-center animate-bounce"
    />
    <div
      class="flex bg-gray-800 justify-center items-center text-white h-4/6 w-1/4 rounded-lg"
    >
      <div v-if="isLoading" class="flex gap-2 m-4">
        <IconsSpinner /> <span class="font-ubuntu text-lg">Saving...</span>
      </div>
      <div v-else>
        <form @submit.prevent="saveUser" class="w-full max-w-sm flex-col">
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/3">
              <label
                class="block text-gray-200 font-bold md:text-right mb-1 md:mb-0 pr-4"
                for="inline-full-name"
              >
                User name
              </label>
            </div>
            <div class="md:w-2/3">
              <input
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-full-name"
                type="text"
                v-model="user.username"
                placeholder="Example_User123"
              />
              <span class="text-red-300 text-xs italic">{{
                errors.username
              }}</span>
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/3">
              <label
                class="block text-gray-200 font-bold md:text-right mb-1 md:mb-0 pr-4"
                for="inline-full-name"
              >
                Email
              </label>
            </div>
            <div class="md:w-2/3">
              <input
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-full-name"
                type="text"
                v-model="user.email"
                placeholder="example@gmail.com"
              />
              <span class="text-red-300 text-xs italic">{{
                errors.email
              }}</span>
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/3">
              <label
                class="block text-gray-200 font-bold md:text-right mb-1 md:mb-0 pr-4"
                for="inline-password"
              >
                Password
              </label>
            </div>
            <div class="md:w-2/3">
              <input
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-password"
                type="password"
                v-model="user.password"
                placeholder="******************"
              />
              <span class="text-red-300 text-xs italic">{{
                errors.password
              }}</span>
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/3">
              <label
                class="block text-gray-200 font-bold md:text-right mb-1 md:mb-0 pr-4"
                for="inline-password"
              >
                Repeat password
              </label>
            </div>
            <div class="md:w-2/3">
              <input
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-password"
                type="password"
                v-model="user.cPassword"
                placeholder="******************"
              />
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/3">
              <label
                class="block text-gray-200 font-bold md:text-right mb-1 md:mb-0 pr-4"
                for="age"
              >
                Age
              </label>
            </div>
            <div class="md:w-2/3">
              <input
                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                id="inline-password"
                type="number"
                v-model="user.age"
                placeholder="25"
              />
              <span class="text-red-300 text-xs italic">{{ errors.age }}</span>
            </div>
          </div>
          <div class="flex justify-between">
            <label
              for="gender"
              class="block text-gray-200 font-bold md:text-right mb-1 md:mb-0 pr-4"
              >Select your gender</label
            >
            <select
              id="countries"
              class="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/2 p-2.5"
              v-model="user.gender"
            >
              <option selected value="not specified">not specified</option>
              <option value="male">male</option>
              <option value="female">female</option>
            </select>
          </div>
          <div class="md:flex p-8 md:justify-center md:items-center">
            <div class="md:w-1/3"></div>
            <div class="md:w-2/3">
              <button
                class="shadow bg-emerald-400 hover:bg-lime-400 focus:shadow-outline focus:outline-none text-gray-800 font-bold py-2 px-4 rounded"
                type="submit "
              >
                Signup
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: "",
        cPassword: "",
        gender: "not specified",
        age: null,
      },
      isLoading: false,
      isLoadingTitle: "Loding...",
      errorsArr: [],
      errors: {},
    };
  },
  methods: {
    saveUser() {
      this.isLoading = true;
      this.isLoadingTitle = "saving...";
      console.log("in");
      this.errors = {};
      //   console.log(this.username, this.email, this.password, this.cPassword);
      axios
        .post(`http://localhost:8000/user`, this.user)
        .then((res) => {
          console.log(res.data);
          alert(res.data.message);
          this.user.username = "";
          this.user.email = "";
          this.user.password = "";
          this.user.cPassword = "";
          this.user.gender = "not specified";
          this.user.age = null;
          this.isLoading = false;
          this.isLoadingTitle = "Loding...";
        })
        .catch((err) => {
          console.log(err.response.data.Errors);
          this.errorsArr = err.response.data.Errors;
          console.log(JSON.parse(JSON.stringify(this.errorsArr)));
          //   alert(err.response.data.message);
          this.isLoading = false;
          this.isLoadingTitle = "Loding...";
          for (let key of err.response.data.Errors[0]) {
            console.log(key.path[0]);
            this.errors[key.path[0]] = key.message;
          }
          console.log(this.errors);
        });
    },
  },
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
