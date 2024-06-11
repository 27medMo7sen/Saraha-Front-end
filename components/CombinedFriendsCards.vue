<template>
  <div class="combined-friends-cards">
    <PublicFriendsCard class="friend-card" />
    <AnonymousFriendsCard class="friend-card" />
  </div>
</template>

<style scoped>
.combined-friends-cards {
  display: flex;
  flex-direction: column;
  gap: 16px; /* Gap between the cards */
  width: 100%; /* Adjust the width as needed */
  height: 100vh; /* Full height of the viewport */
  padding: 16px; /* Padding around the card container */
  background-color: #f4f4f4; /* Background color for the card container */
  border-radius: 8px; /* Rounded corners for the card container */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); /* Subtle shadow for the card container */
  overflow-y: auto; /* Scroll if content overflows */
}

.friend-card {
  border: 1px solid #ccc; /* Border around each card */
  border-radius: 8px; /* Rounded corners for each card */
  background-color: #ffffff; /* Background color for each card */
  padding: 16px; /* Padding inside each card */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for each card */
}
</style>
