<script setup></script>
<template>
  <div class="p-10">
    <ProfileCard />
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
      user: {},
    };
  },
  methods: {},
  mounted() {},
};
</script>
