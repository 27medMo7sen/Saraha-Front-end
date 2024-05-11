<template>
  <div class="navbar flex justify-between">
    <div class="logo">
      <img src="@/assets/Logo/png/logo-no-background.png" alt="Logo" />
    </div>
    <ul class="nav-links">
      <li><nuxt-link to="/" id="page">Home</nuxt-link></li>
      <li><nuxt-link to="/about">About</nuxt-link></li>
    </ul>
  </div>
  <slot />
</template>
