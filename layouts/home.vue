<template>
  <div class="navbar">
    <div class="logo">
      <img src="@/assets/Logo/png/logo-no-background.png" alt="Logo" />
    </div>
    <ul class="nav-links">
      <li><nuxt-link to="/" id="page">Home</nuxt-link></li>
      <li><nuxt-link to="/about">About</nuxt-link></li>
      <li>
        <nuxt-link to="/profile">{{
          isLoggedIn ? userName : "Login"
        }}</nuxt-link>
      </li>
      <li v-if="!isLoggedIn">
        <nuxt-link to="/signup">Signup</nuxt-link>
      </li>
    </ul>
  </div>
  <slot />
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      userName: "",
    };
  },
  // Add your login logic here to set the isLoggedIn and userName variables accordingly
};
</script>
