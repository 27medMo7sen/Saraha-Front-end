<template>
  <div class="navbar">
    <div class="logo">
      <img src="@/assets/Logo/png/logo-no-background.png" alt="Logo" />
    </div>
    <ul class="nav-links">
      <li><nuxt-link to="/">Home</nuxt-link></li>
      <li><nuxt-link to="/about" id="page">About</nuxt-link></li>
      <li><nuxt-link to="/profile"> profile </nuxt-link></li>
      <li><nuxt-link to="/signup">Signup</nuxt-link></li>
    </ul>
  </div>
  <slot />
</template>
