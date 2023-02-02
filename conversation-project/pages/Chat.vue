<template>
  <div id="chat">
    <h1>Bienvenue sur le chat<span v-if="nameRegistered">, {{ name }}</span>!</h1>
    <p>{{ statusString }}</p>
    <div v-if="!nameRegistered">
      <input v-model="name" @keyup.enter="registerName"  placeholder="Entrez votre pseudo">
      <button @click="registerName">S'enregistrer</button>
    </div>
    <div v-if="nameRegistered && !activeConversation && isConnected">
      <button @click="createConversation">Rejoindre</button>
    </div>
    <Conversationtwi v-if="activeConversation" :active-conversation="activeConversation" :name="name" />
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
<script>
import {Client as ConversationsClient} from "@twilio/conversations"
import Conversationtwi from "../components/Conversation-twi";

export default {
    components: { Conversationtwi },
    data() {
        return {
            statusString: "",
            activeConversation: null,
            name: "",
            nameRegistered: false,
            isConnected: false
        }
    },
}
</script>