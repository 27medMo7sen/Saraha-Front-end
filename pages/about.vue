<template lang="">
  <div>{{ data.data }}</div>
  <div v-if="data.error">Error: {{ data.error }}</div>
</template>
<script setup>
definePageMeta({
  layout: "about",
});

const data = await useLazyFetch("https://fakestoreapi.com/products");
</script>
<style lang=""></style>
