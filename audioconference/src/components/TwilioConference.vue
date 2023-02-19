<template>
  <div>
    <button v-if="!connected" @click="connectToConference()">Connect to Conference</button>
    <div v-if="connected">
      <h2>You are in the conference</h2>
      <button @click="disconnectFromConference()">Disconnect</button>
      <ul>
        <li v-for="participant in participants" :key="participant.sid">
          {{ participant.identity }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Twilio from 'twilio-client'

Twilio.Device.setup(process.env.VUE_APP_TWILIO_AUTH_TOKEN);

export default {

  data() {
    return {
      token: null,
      conference: null,
      connected: false,
      participants: []
    }
  },

  methods: {
    // methode prend le connecte, création objet Twilio + connecte le participant
  async connectToConference() {
  try {
    // fetch token du server node js
    const response = await fetch('/api/twilio/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conferenceName: process.env.VUE_APP_TWILIO_CONFERENCE_NAME })
    })
    const data = await response.json()
    this.token = data.token

    

    // connexion objet twilio
    const client = new Twilio(this.token)
    this.conference = await client.conferences(process.env.VUE_APP_TWILIO_CONFERENCE_NAME).fetch()
    this.connected = true 

    // Device sert à lier un periphéique côté client à la conférence
    Twilio.Device.connect({ conference: process.env.VUE_APP_TWILIO_CONFERENCE_NAME })

    // deux listenteners qui gère la connexion et la déconexxion de l'user
    this.conference.on('participantConnected', this.handleParticipantConnected)
    this.conference.on('participantDisconnected', this.handleParticipantDisconnected)
  } catch (error) {
    console.error(error)
  }
  },
    async disconnectFromConference() {
      try {
        await this.conference.disconnect()

        this.token = null
        this.conference = null
        this.connected = false
        this.participants = []
      } catch (error) {
        console.error(error)
      }
    },
    handleParticipantConnected(participant) {
      this.participants.push(participant)
    },
    handleParticipantDisconnected(participant) {
      const index = this.participants.findIndex(p => p.sid === participant.sid)
      if (index !== -1) {
        this.participants.splice(index, 1)
      }
    },
    getToken: async function(identity) {
			const response = await fetch(`http://localhost:5000/auth/user/${identity}`)
			const responseJson = await response.json()
			return responseJson.token
		},
  }
}
</script>