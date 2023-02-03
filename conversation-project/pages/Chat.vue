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
    methods: {
        initConversationsClient: async function() {
            window.conversationsClient = ConversationsClient
            const token = await this.getToken(this.name)
            this.conversationsClient = await ConversationsClient.create(token)
            this.statusString = "Twilio initialisation"
            this.conversationsClient.on("connectionStateChanged", (state) => {
                switch (state) {
                case "connected":
                    this.statusString = "You are connected."
                    this.isConnected = true
                    break
                case "disconnecting":
                    this.statusString = "Disconnecting from Twilio..."
                    break
                case "disconnected":
                    this.statusString = "Disconnected."
                    break
                case "denied":
                    this.statusString = "Failed to connect."
                    break
                }
            })
        },
        getToken: async function(identity) {
            const response = await fetch(`http://localhost:5000/auth/user/${identity}`)
            const responseJson = await response.json()
            return responseJson.token
        },
        registerName: async function() {
            this.nameRegistered = true
            await this.initConversationsClient()
        },
        createConversation: async function() {
            // verif que les deux user sont bien dans la conv client
            try {
                await this.conversationsClient.getUser("User1")
                await this.conversationsClient.getUser("User2")
            } catch {
                console.error("Waiting for User1 and User2 client sessions")
                return
            }

            try {
                const newConversation = await this.conversationsClient.createConversation({uniqueName: "chat"})
                const joinedConversation = await newConversation.join().catch(err => console.log(err))
                await joinedConversation.add("User1").catch(err => console.log("error: ", err))
                await joinedConversation.add("User2").catch(err => console.log("error: ", err))
                this.activeConversation = joinedConversation
            } catch {
                this.activeConversation = await (this.conversationsClient.getConversationByUniqueName("chat"))
            }
        }
    }
}
</script>

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
