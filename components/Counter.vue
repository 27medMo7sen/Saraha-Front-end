<script setup>
const counter = useCounter();
</script>
<template>
  <div>
    <h1>Home</h1>
    Counter: {{ counter }}
    <button @click="counter++">+</button>
    <button @click="counter--">-</button>
  </div>
</template>
