<template>
  <div class="">
    
    <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
      <div class="relative">
        <img
          v-if="!coverPhotos || coverPhotos.length === 0"
          :src="coverPhotosPlaceHolder[currentCoverIndex]"
          alt="Cover Photo"
          class="w-full h-96 object-cover"
        />
        <img
          v-else
          :src="coverPhotos[currentCoverIndex]"
          alt="Cover Photo"
          class="w-full h-96 object-cover"
        />
        <label
        v-if="!isMine"
          for="fileInputCover"
          class="absolute top-2 left-2 p-2 rounded cursor-pointer"
        >
          <div
          v-if="!isMine"
            class="absolute p-2 rounded cursor-pointer bg-neutral-700 border-spacing-2 text-white hover:bg-neutral-800 hover:text-white "
          >
            <IconsUpdate />
          </div>
        </label>
        <input
          id="fileInputCover"
          type="file"
          v-if="!isMine"
          ref="fileInputCover"
          class="hidden"
          @change="updateCoverPhoto"
        />
        <div class="absolute bottom-0 left-0 p-4">
          <img
            v-if="!profilePhoto"
            :src="profilePhotoPlaceHolder"
            alt="Profile Photo"
            class="w-40 h-40 rounded-full border-4 border-gray-800"
          />
          <img
            v-else
            :src="profilePhoto"
            alt="Profile Photo"
            class="w-40 h-40 rounded-full border-4 border-gray-800"
          />
          <label for="fileInputProfile" class="cursor-pointer" v-if="!isMine">
            <span
            v-if="!isMine"
              class="absolute top-0 right-0 p-2 rounded cursor-pointer bg-neutral-700 border-spacing-2 text-white hover:bg-neutral-800 hover:text-white z-10"
            >
              <IconsUpdate />
            </span>
          </label>
          <input
            id="fileInputProfile"
            type="file"
            v-if"!isMine"
            ref="fileInputProfile"
            class="hidden"
            @change="updateProfilePhoto"
          />
        </div>
        <div
          class="absolute left-0 right-0 bottom-0 flex justify-center pb-4 z-10"
        >
          <button
            @click="previousCover"
            class="text-gray-800 text-3xl hover:text-gray-900 focus:outline-none"
          >
            <IconsBackArrow />
          </button>
          <button
            @click="nextCover"
            class="text-gray-800 text-3xl hover:text-gray-900 focus:outline-none"
          >
            <IconsForwardArrow />
          </button>
        </div>
      </div>

      <div class="p-6">
        <h2 class="text-3xl font-semibold">{{ name }}</h2>
        <p class="text-lg text-gray-400">({{ username }})</p>
        <p class="text-gray-600 text-lg">{{ bio }}</p>
        <div class="mt-4 flex w-1/3 justify-between">
          <div class="flex gap-2 justify-center items-center">
            <IconsPhone /> {{ phoneNumber }}
          </div>
          <div class="flex gap-2 justify-center items-center"> 
            <IconsLocation /> {{ address }}
          </div>
        </div>
        <!-- Action Buttons -->
        <div class="mt-4 flex space-x-4"  v-if="isMine">
         
          <button
            @click="follow"
            class="bg-blue-500 text-white px-6 py-3 rounded-full"
          >
            Follow
          </button>
          <button
            @click="message"
            class="bg-green-500 text-white px-6 py-3 rounded-full"
          >
            Message
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import axios from "axios";

export default {
  computed: {
    token() {
      return Cookies.get("userToken");
    },
  },
  data() {
    return {
      name: "John Doe",
      username: "",
      bio: "This is a short bio.",
      address: "",
      isMine: false,
      phoneNumber: "",
      profilePhotoPlaceHolder: "https://via.placeholder.com/150",
      coverPhotosPlaceHolder: [
        "https://via.placeholder.com/600x400",
        "https://via.placeholder.com/600x401",
      ],
      profilePhoto: "",
      coverPhotos: [],
      currentCoverIndex: 0,
    };
  },
  methods: {
    async fetchUser() {
      try {
        const res = await axios.get(
          `http://localhost:8000/user/${this.$route.params.username}`,
          {
            headers: {
              Authorization: `Saraha ${this.token}`,
            },
          }
        );
        console.log(res.data);
        if (res.data.user.profile_pic)
          this.profilePhoto = res.data.user.profile_pic.secure_url;
        this.name = `${res.data.user.firstname} ${res.data.user.lastname}`;
        this.username = res.data.user.username;
        this.bio = res.data.user.bio;
        this.address = `${res.data.user.country}, ${res.data.user.state}`;
        this.phoneNumber = res.data.user.phoneNumber;
        console.log(res.data.user.token);
        if(res.data.user.token===undefined||JSON.stringify(res.data.user.token) !== JSON.stringify(this.token)){
          this.isMine = true;
        }
        if (res.data.user.coverPictures !== undefined) {
          console.log("fetching");
          this.coverPhotos = [];
          for (const key of res.data.user.coverPictures) {
            console.log(key.secure_url);
            this.coverPhotos.push(key.secure_url);
          }
          this.currentCoverIndex = this.coverPhotos.length - 1;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async updateProfilePhoto(event) {
      const fileInput = event.target.files[0];
      if (!fileInput) {
        return;
      }

      const formData = new FormData();
      formData.append("profile", fileInput);

      try {
        const response = await axios.post(
          "http://localhost:8000/user/profilePic",
          formData,
          {
            headers: {
              Authorization: `Saraha ${this.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(response);
        this.profilePhoto = response.data.profile_pic_url;
        if (response.status == 201) {
          Cookies.set("userToken", response.data.user.token, {
            expires: 7,
          });
        }
        location.reload();
      } catch (error) {
        console.log("Error uploading file", error.response?.data || error);
      }
    },
    async updateCoverPhoto(event) {
      const fileInput = event.target.files[0];
      if (!fileInput) {
        return;
      }

      const formData = new FormData();
      formData.append("cover", fileInput);

      try {
        const response = await axios.post(
          "http://localhost:8000/user/coverPics",
          formData,
          {
            headers: {
              Authorization: `Saraha ${this.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        // Add the new cover photo to the coverPhotos array
        this.coverPhotos = response.data.userNew.coverPictures.map(
          (picture) => picture.secure_url
        );
        this.currentCoverIndex = this.coverPhotos.length - 1;
      } catch (error) {
        console.log("Error uploading file", error.response?.data || error);
      }
    },
    follow() {
      // Logic to follow the user
    },
    message() {
      // Logic to message the user
    },
    previousCover() {
      this.currentCoverIndex =
        (this.currentCoverIndex - 1 + this.coverPhotos.length) %
        this.coverPhotos.length;
    },
    nextCover() {
      this.currentCoverIndex =
        (this.currentCoverIndex + 1) % this.coverPhotos.length;
    },
  },
  mounted() {
    this.fetchUser();
  },
};
</script>

<style scoped>
@keyframes love-animation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
