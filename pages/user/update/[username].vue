<template>
  <div class="flex justify-center items-center h-screen w-screen">
    <img
      src="@/assets/Logo/png/saraha-favicon-color.png"
      alt="Saraha Logo"
      class="h-24 self-center animate-bounce"
    />
    <div class="flex justify-center items-center h-screen">
      <div class="bg-gray-800 rounded-lg p-8 w-full max-w-md">
        <div v-if="isLoading" class="font-ubuntu text-white">
          <IconsSpinner /><span>Almost done...</span>
        </div>
        <div v-else>
          <form @submit.prevent="saveUser" class="space-y-6">
            <div class="space-y-6">
              <div class="flex items-center space-x-4">
                <label for="firstname" class="text-gray-300 w-1/3 text-right"
                  >First name</label
                >
                <input
                  id="firstname"
                  type="text"
                  v-model="user.firstname"
                  placeholder="Enter your first name"
                  class="input flex-1"
                />
              </div>
              <div class="flex items-center space-x-4">
                <label for="lastname" class="text-gray-300 w-1/3 text-right"
                  >Last name</label
                >
                <input
                  id="lastname"
                  type="text"
                  v-model="user.lastname"
                  placeholder="Enter your last (family) name"
                  class="input flex-1"
                />
              </div>
              <div class="flex items-center space-x-4">
                <label for="username" class="text-gray-300 w-1/3 text-right"
                  >User name</label
                >
                <input
                  id="username"
                  type="text"
                  v-model="user.username"
                  placeholder="Example_User123"
                  class="input flex-1"
                />
              </div>
              <div class="flex items-center space-x-4">
                <label for="password" class="text-gray-300 w-1/3 text-right"
                  >Password</label
                >
                <input
                  id="password"
                  type="password"
                  v-model="user.password"
                  placeholder="******************"
                  class="input flex-1"
                />
              </div>
              <div class="flex items-center space-x-4">
                <label for="cPassword" class="text-gray-300 w-1/3 text-right"
                  >Repeat password</label
                >
                <input
                  id="cPassword"
                  type="password"
                  v-model="user.cPassword"
                  placeholder="******************"
                  class="input flex-1"
                />
              </div>
              <div class="flex items-center space-x-4">
                <label for="phoneNumber" class="text-gray-300 w-1/3 text-right"
                  >Phone number</label
                >
                <input
                  id="phoneNumber"
                  type="text"
                  v-model="user.phoneNumber"
                  placeholder="enter your phone number"
                  class="input flex-1"
                />
              </div>
              <div class="flex items-center space-x-4">
                <label for="bio" class="text-gray-300 w-1/3 text-right"
                  >Bio</label
                >
                <input
                  id="bio"
                  type="text"
                  v-model="user.bio"
                  placeholder="Update your bio here"
                  class="input flex-1"
                />
              </div>
              <div class="flex items-center space-x-4">
                <label for="age" class="text-gray-300 w-1/3 text-right"
                  >Age</label
                >
                <input
                  id="age"
                  type="number"
                  v-model="user.age"
                  placeholder="25"
                  class="input flex-1"
                />
              </div>
              <div class="flex items-center space-x-4">
                <label for="gender" class="text-gray-300 w-1/3 text-right"
                  >Select your gender</label
                >
                <select id="gender" class="input flex-1" v-model="user.gender">
                  <option selected value="not specified">Not specified</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div class="flex items-center space-x-4">
                <label for="country" class="text-gray-300 w-1/3 text-right"
                  >Country</label
                >
                <select
                  id="country"
                  class="input flex-1"
                  v-model="user.country"
                  @change="fetchStates"
                >
                  <option selected value="">Select Country</option>
                  <option
                    v-for="country in countries"
                    :key="country"
                    :value="country"
                  >
                    {{ country }}
                  </option>
                </select>
              </div>
              <div class="flex items-center space-x-4">
                <label for="state" class="text-gray-300 w-1/3 text-right"
                  >State</label
                >
                <select id="state" class="input flex-1" v-model="user.state">
                  <option selected value="">Select State</option>
                  <option v-for="state in states" :key="state" :value="state">
                    {{ state }}
                  </option>
                </select>
              </div>
            </div>
            <div class="flex justify-center">
              <button type="submit" class="btn">Update</button>
            </div>
          </form>
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
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
        cPassword: "",
        bio: "",
        gender: "not specified",
        age: null,
        country: "",
        state: "",
        phoneNumber: "",
      },
      final: {},
      isLoading: false,
      isLoadingTitle: "Loading...",
      errorsArr: [],
      errors: {},
      countries: [],
      states: [],
    };
  },
  methods: {
    async fetchCountries() {
      try {
        console.log("fetching countries");
        const res = await axios.get("https://restcountries.com/v3.1/all");
        this.countries = res.data.map((country) => country.name.common);
        console.log(this.countries);
      } catch (err) {
        console.log(err.message);
      }
    },
    async saveUser() {
      this.isLoading = true;
      this.isLoadingTitle = "saving...";
      this.errors = {};
      for (let key in this.user) {
        if (
          this.user[key] != "" &&
          this.user[key] != null &&
          this.user[key] != "not specified"
        ) {
          this.final[key] = this.user[key];
        }
      }
      console.log(this.final);
      try {
        const res = await axios.put(
          `http://localhost:8000/user/${this.$route.params.username}`,
          this.final,
          {
            headers: {
              Authorization: `Saraha ${this.token}`,
            },
          }
        );
        if (res.status == 201) {
          Cookies.set("userToken", res.data.user.token, {
            expires: 7,
          });
        }
        console.log(res, "done");
        this.$router.push(`/user/${this.$route.params.username}`);
      } catch (err) {
        // this.errorsArr = err.response.data.Errors;
        // this.processErrors();
        // this.isLoading = false;
        // this.isLoadingTitle = "Loading...";
        console.log(err);
      }
    },
    processErrors() {
      for (let key of this.errorsArr) {
        this.errors[key.path[0]] = key.message;
      }
    },
    async fetchStates() {
      try {
        console.log("fetching states");
        this.states = [];
        const res = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/states",
          {
            country: this.user.country,
          }
        );
        for (const key in res.data.data.states) {
          this.states.push(res.data.data.states[key].name);
        }
        console.log(res.data);
      } catch (err) {
        console.log(err.message);
      }
    },
  },
  mounted() {
    this.fetchCountries();
  },
};
</script>
