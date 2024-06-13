<template>
  <div class="flex justify-center items-center h-screen w-screen">
    <img
      src="@/assets/Logo/png/saraha-favicon-color.png"
      alt="Saraha Logo"
      class="h-24 self-center animate-bounce"
    />
    <div class="flex justify-center items-center h-screen">
      <div class="bg-gray-800 rounded-lg p-4 w-full max-w-lg">
        <div v-if="isLoading" class="font-ubuntu text-white">
          <IconsSpinner /><span>Almost done...</span>
        </div>
        <div v-else>
          <form @submit.prevent="saveUser" class="space-y-4">
            <div class="space-y-2">
              <div class="flex space-x-2">
                <div class="w-1/2">
                  <label
                    for="firstname"
                    class="text-gray-300 block text-left mb-1"
                    >First name<span class="text-red-400">*</span></label
                  >
                  <input
                    id="firstname"
                    type="text"
                    v-model="user.firstname"
                    placeholder="Enter your first name"
                    class="input w-full"
                    required="required"
                  />
                </div>
                <div class="w-1/2">
                  <label
                    for="lastname"
                    class="text-gray-300 block text-left mb-1"
                    >Last name<span class="text-red-400">*</span></label
                  >
                  <input
                    id="lastname"
                    type="text"
                    v-model="user.lastname"
                    placeholder="Enter your last (family) name"
                    class="input w-full"
                    required="required"
                  />
                </div>
              </div>
              <div>
                <label for="username" class="text-gray-300 block text-left mb-1"
                  >User name<span class="text-red-400">*</span></label
                >
                <input
                  id="username"
                  type="text"
                  v-model="user.username"
                  placeholder="Example_User123"
                  class="input w-full"
                  required="required"
                />
                <div class="text-red-300 text-xs italic">
                  {{ errors.username }}
                </div>
              </div>
              <div>
                <label
                  for="anonymousname"
                  class="text-gray-300 block text-left mb-1"
                  >Anonymous name<span class="text-red-400">*</span></label
                >
                <input
                  id="anonymousname"
                  type="text"
                  v-model="user.anonymousname"
                  placeholder="Enter your anonymous name"
                  class="input w-full"
                  required="required"
                />
                <div class="text-red-300 text-xs italic">
                  {{ errors.anonymousname }}
                </div>
              </div>
              <div>
                <label for="email" class="text-gray-300 block text-left mb-1"
                  >Email<span class="text-red-400">*</span></label
                >
                <input
                  id="email"
                  type="text"
                  v-model="user.email"
                  placeholder="example@gmail.com"
                  class="input w-full"
                  required="required"
                />
                <div class="text-red-300 text-xs italic">
                  {{ errors.email }}
                </div>
              </div>
              <div class="flex space-x-2">
                <div class="w-1/2">
                  <label
                    for="password"
                    class="text-gray-300 block text-left mb-1"
                    >Password<span class="text-red-400">*</span></label
                  >
                  <input
                    id="password"
                    type="password"
                    v-model="user.password"
                    placeholder="******************"
                    class="input w-full"
                    required="required"
                  />
                  <div class="text-red-300 text-xs italic">
                    {{ errors.password }}
                  </div>
                </div>
                <div class="w-1/2">
                  <label
                    for="cPassword"
                    class="text-gray-300 block text-left mb-1"
                    >Repeat password<span class="text-red-400">*</span></label
                  >
                  <input
                    id="cPassword"
                    type="password"
                    v-model="user.cPassword"
                    placeholder="******************"
                    class="input w-full"
                    required="required"
                  />
                  <div class="text-red-300 text-xs italic">
                    {{ errors.cPassword }}
                  </div>
                </div>
              </div>
              <div>
                <label
                  for="phoneNumber"
                  class="text-gray-300 block text-left mb-1"
                  >Phone number</label
                >
                <input
                  id="phoneNumber"
                  type="text"
                  v-model="user.phoneNumber"
                  placeholder="Enter your phone number"
                  class="input w-full"
                />
              </div>
              <div class="flex space-x-2">
                <div class="w-1/2">
                  <label for="age" class="text-gray-300 block text-left mb-1"
                    >Age</label
                  >
                  <input
                    id="age"
                    type="number"
                    v-model="user.age"
                    placeholder="25"
                    class="input w-full"
                  />
                </div>
                <div class="w-1/2">
                  <label for="gender" class="text-gray-300 block text-left mb-1"
                    >Gender</label
                  >
                  <select
                    id="gender"
                    class="input w-full"
                    v-model="user.gender"
                  >
                    <option selected value="not specified">
                      Not specified
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label for="country" class="text-gray-300 block text-left mb-1"
                  >Country
                </label>
                <select
                  id="country"
                  class="input w-full"
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
              <div>
                <label for="state" class="text-gray-300 block text-left mb-1"
                  >State</label
                >
                <select id="state" class="input w-full" v-model="user.state">
                  <option selected value="">Select State</option>
                  <option v-for="state in states" :key="state" :value="state">
                    {{ state }}
                  </option>
                </select>
              </div>
            </div>
            <div class="flex justify-center">
              <button type="submit" class="btn">Signup</button>
            </div>
            <p class="text-sm text-gray-300 text-center pt-4">
              Already have an account?
              <nuxt-link
                to="/login"
                class="font-medium text-primary hover:underline"
                >Login here</nuxt-link
              >
            </p>
          </form>
        </div>
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
        firstname: "",
        lastname: "",
        username: "",
        anonymousname: "",
        email: "",
        password: "",
        cPassword: "",
        gender: "not specified",
        age: null,
        country: "",
        state: "",
        phoneNumber: "",
      },
      isLoading: false,
      isLoadingTitle: "Loading...",
      errorsArr: [],
      errors: {},
      countries: [],
      states: [],
      socket: null,
    };
  },
  methods: {
    async fetchCountries() {
      try {
        console.log("fetching countries");
        const res = await axios.get(
          "https://api.first.org/data/v1/countries?limit=300"
        );
        console.log(res.data.data);
        for (const key in res.data.data) {
          this.countries.push(res.data.data[key].country);
        }
      } catch (err) {}
    },
    async saveUser() {
      this.isLoading = true;
      this.isLoadingTitle = "saving...";
      this.errors = {};
      try {
        const res = await axios.post(`http://localhost:8000/user`, this.user, {
          withCredentials: true,
        });
        console.log(res, "done");

        console.log(this.socket);
        this.$router.push("/verify");
      } catch (err) {
        console.log(err.response);
        if (err.response.data.message === "username is already exists") {
          console.log("username is already exists");
          this.errors.username = "username is already exists";
        }
        if (err.response.data.message === "Email is already exists") {
          this.errors.email = "email is already exists";
        }
        if (err.response.data.message === "anonymousname is already exists") {
          this.errors.anonymousname = "anonymous name is already exists";
        } else if (err.response.data.message === "Validation Error") {
          this.errorsArr = err.response.data.Errors;
          for (let key of err.response.data.Errors[0]) {
            if (key.message.startsWith(`"username" with value`))
              this.errors.username =
                "invalid user name, valid example: Example_User123";
            else if (key.message.startsWith(`"cPassword" must be`))
              this.errors.cPassword = "passwords do not match";
            else this.errors[key.path[0]] = key.message;
          }
        }
        this.isLoading = false;
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

<style scoped></style>
