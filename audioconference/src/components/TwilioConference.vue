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
        const response = await fetch('/api/twilio/token')
        const data = await response.json()
        this.token = data.token

        const client = new Twilio(this.token)
        this.conference = await client.conferences('my-conference').fetch()
        this.connected = true

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
    }
  }
}
</script>