<template>
  <div id="chat">
    <h1>Welcome to the Vue chat app<span v-if="nameRegistered">, {{ name }}</span>!</h1>
    <p>{{ statusString }}</p>
    <div v-if="!nameRegistered">
      <input @keyup.enter="registerName" v-model="name" placeholder="Enter your name">
      <button @click="registerName">Register name</button>
    </div>
    <div v-if="nameRegistered && !activeConversation && isConnected">
      <button @click="createConversation">Join chat</button>
    </div>
    <Conversation v-if="activeConversation" :active-conversation="activeConversation" :name="name" />
  </div>
</template>
<style scoped>
ul {
 list-style-type: none;
 padding: 0;
}
 
li {
 display: inline-block;
 margin: 0 10px;
}
 
a {
 color: #42b983;
}
</style>