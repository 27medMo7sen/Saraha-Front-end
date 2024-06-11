<template>
  <div class="z-0">
    <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg z-0">
      <div class="relative">
        <img
          v-if="!coverExists"
          :src="coverPhotosPlaceHolder"
          alt="Cover Photo"
          class="w-full h-96 object-cover"
        />
        <img
          v-else
          :src="coverPhotos[currentCoverIndex]"
          alt="Cover Photo"
          class="w-full h-96 object-cover z-0"
        />
        <label
          v-if="!isMine"
          for="fileInputCover"
          class="absolute top-2 left-2 rounded cursor-pointer"
        >
          <div v-if="!isMine" class="flex z-0">
            <div
              class="p-2 rounded cursor-pointer bg-neutral-700 border-spacing-2 text-white hover:bg-neutral-800 hover:text-white z-0"
            >
              <IconsAddCover />
            </div>
          </div>
        </label>
        <input
          id="fileInputCover"
          type="file"
          v-if="!isMine"
          ref="fileInputCover"
          class="hidden z-0"
          @change="updateCoverPhoto"
        />
        <div
          v-if="!isMine && coverPhotos.length > 0"
          class="p-2 rounded cursor-pointer bg-neutral-700 border-spacing-2 text-white hover:bg-neutral-800 hover:text-white top-2 right-2 absolute z-0"
          @click="deleteCoverPhoto"
        >
          <IconsDelete />
        </div>
        <div class="absolute bottom-0 left-0 p-4 z-0">
          <img
            v-if="!profilePhoto"
            src="@/assets/placeholder/image.png"
            alt="Profile Photo"
            class="w-40 h-40 rounded-full border-4 border-gray-800 z-0"
          />
          <img
            v-else
            :src="transformToJpg(profilePhoto)"
            alt="Profile Photo"
            class="w-40 h-40 rounded-full border-4 border-gray-800 z-0"
          />
          <label for="fileInputProfile" class="cursor-pointer" v-if="!isMine">
            <span
              v-if="!isMine"
              class="absolute top-0 right-0 p-2 rounded cursor-pointer bg-neutral-700 border-spacing-2 text-white hover:bg-neutral-800 hover:text-white z-0"
            >
              <IconsUpdate />
            </span>
          </label>
          <input
            id="fileInputProfile"
            type="file"
            v-if="!isMine"
            ref="fileInputProfile"
            class="hidden z-0"
            @change="updateProfilePhoto"
          />
        </div>
        <div
          class="absolute left-0 right-0 bottom-0 flex gap-5 justify-center pb-4 z-0"
          v-if="coverPhotos.length > 1"
        >
          <button
            @click="previousCover"
            class="text-amber-100 rounded-full text-3xl hover:text-gray-900 focus:outline-none z-0 bg-gray-600"
          >
            <IconsBackArrow />
          </button>
          <button
            @click="nextCover"
            class="text-amber-100 rounded-full text-3xl hover:text-gray-900 focus:outline-none z-0 bg-gray-600"
          >
            <IconsForwardArrow />
          </button>
        </div>
      </div>

      <div class="p-6">
        <h2 class="text-3xl font-semibold">{{ name }}</h2>
        <p class="text-lg text-gray-400">({{ username }})</p>
        <p class="text-gray-600 text-lg">{{ bio }}</p>
        <div class="mt-4 flex w-2/3 gap-8 z-0">
          <div class="flex gap-2 justify-center items-center z-0">
            <IconsPhone /> {{ phoneNumber }}
          </div>
          <div class="flex gap-2 justify-center items-center z-0">
            <IconsLocation /> {{ address }}
          </div>
          <div
            class="flex gap-2 justify-center items-center z-0"
            v-if="gender === 'male'"
          >
            <IconsMale /> male
          </div>
          <div
            class="flex gap-2 justify-center items-center z-0"
            v-if="gender === 'female'"
          >
            <IconsFemale /> female
          </div>
        </div>
        <!-- Action Buttons -->
        <div class="mt-4 flex space-x-4 z-0" v-if="isMine">
          <button
            @click="follow"
            class="bg-blue-500 text-white px-6 py-3 rounded-full z-0"
          >
            Follow
          </button>
          <nuxt-link
            :to="`/chat/public/${userId}`"
            class="bg-green-500 text-white px-6 py-3 rounded-full z-0"
          >
            Message
          </nuxt-link>
        </div>
        <div v-else class="mt-4 flex space-x-4 z-0">
          <nuxt-link
            :to="`/user/update/${userId}/`"
            class="bg-green-500 text-white px-6 py-3 rounded-full z-0"
          >
            Update profile data
          </nuxt-link>
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
      name: "",
      username: "",
      bio: "",
      userId: "",
      address: "",
      isMine: false,
      phoneNumber: "",
      gender: "",
      coverPhotosPlaceHolder: "https://via.placeholder.com/600x400",
      profilePhoto: "",
      coverPhotos: [],
      coverExists: false,
      currentCoverIndex: 0,
    };
  },
  methods: {
    async fetchUser() {
      // console.log(this.$route.params.userId);
      try {
        const res = await axios.get(
          `http://localhost:8000/user/${this.$route.params.userId}`,
          {
            headers: {
              Authorization: `Saraha ${this.token}`,
            },
            withCredentials: true,
          }
        );
        console.log(res.data);

        if (res.data.user.profile_pic)
          this.profilePhoto = res.data.user.profile_pic.secure_url;

        this.name = `${res.data.user.firstname} ${res.data.user.lastname}`;
        this.username = res.data.user.username;
        this.bio = res.data.user.bio;
        this.gender = res.data.user.gender;
        this.address = `${res.data.user.country}, ${res.data.user.state}`;
        this.phoneNumber = res.data.user.phoneNumber;
        this.userId = res.data.user.userId;
        console.log(res.data.user.token);
        if (
          res.data.user.token === undefined ||
          JSON.stringify(res.data.user.token) !== JSON.stringify(this.token)
        ) {
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
          if (this.coverPhotos.length > 0) {
            this.coverExists = true;
          }
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
            withCredentials: true,
          }
        );
        console.log(response);
        const url = this.transformToJpg(
          response.data.user.profile_pic.secure_url
        );
        this.profilePhoto = response.data.user.profile_pic.secure_url;
        location.reload();
      } catch (error) {
        console.log("Error uploading file", error.response?.data || error);
      }
    },
    transformToJpg(url) {
      // This assumes the URL is a Cloudinary URL
      const cloudinaryBaseUrl = "https://res.cloudinary.com/";
      if (url.startsWith(cloudinaryBaseUrl)) {
        // Insert the transformation parameter 'f_jpg' into the URL
        const parts = url.split("/upload/");
        return `${parts[0]}/upload/f_jpg/${parts[1]}`;
      }
      return url; // Return the original URL if it's not a Cloudinary URL
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
            withCredentials: true,
          }
        );

        // Add the new cover photo to the coverPhotos array
        this.coverPhotos = response.data.userNew.coverPictures.map(
          (picture) => picture.secure_url
        );
        this.currentCoverIndex = this.coverPhotos.length - 1;
        location.reload();
      } catch (error) {
        console.log("Error uploading file", error.response?.data || error);
      }
    },
    async deleteCoverPhoto() {
      console.log(this.coverPhotos[this.currentCoverIndex]);
      try {
        const response = await axios.delete(
          "http://localhost:8000/user/deleteCover",
          {
            data: { secure_url: this.coverPhotos[this.currentCoverIndex] },
            headers: {
              Authorization: `Saraha ${this.token}`,
            },
            withCredentials: true,
          }
        );

        this.coverPhotos.splice(this.currentCoverIndex, 1);
        this.currentCoverIndex = 0;
        if (this.coverPhotos.length === 0) {
          this.coverExists = false;
        }
      } catch (error) {
        console.log("Error deleting file", error.response?.data || error);
      }
    },
    follow() {
      // Logic to follow the user
    },
    message() {
      // Logic to message the user
    },
    previousCover() {
      if (this.coverPhotos.length > 0)
        this.currentCoverIndex =
          (this.currentCoverIndex - 1 + this.coverPhotos.length) %
          this.coverPhotos.length;
    },
    nextCover() {
      if (this.coverPhotos.length > 0)
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
.user {
  width: 140px;
  height: 140px;
  border-radius: 100%;
  border: 3px solid #2e7d32;
  position: relative;
}
.profile-img {
  height: 100%;
  width: 100%;
  border-radius: 50%;
}
.icon {
  position: absolute;
  top: 10px;
  right: 0;
  background: #e2e2e2;
  border-radius: 100%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  vertical-align: middle;
  text-align: center;
  color: #0000ff;
  font-size: 14px;
  cursor: pointer;
}
</style>
