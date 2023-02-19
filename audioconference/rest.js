const express = require('express')
const twilio = require('twilio')

const app = express()

// Generate Twilio access token
app.post('/api/twilio/token', (req, res) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const conferenceName = req.body.conferenceName

  const client = new twilio(accountSid, authToken)
  const token = new twilio.jwt.AccessToken(
    accountSid,
    process.env.TWILIO_API_KEY,
    process.env.TWILIO_API_SECRET,
    { ttl: 3600 }
  )

  const grant = new twilio.jwt.AccessToken.ConversationsGrant({ configurationProfileSid: process.env.TWILIO_CONFIGURATION_SID })
  token.addGrant(grant)

  const videoGrant = new twilio.jwt.AccessToken.VideoGrant()
  token.addGrant(videoGrant)

  const chatGrant = new twilio.jwt.AccessToken.ChatGrant({ serviceSid: process.env.TWILIO_CHAT_SERVICE_SID })
  token.addGrant(chatGrant)

  const voiceGrant = new twilio.jwt.AccessToken.VoiceGrant({
    incomingAllow: true,
    outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
    outgoingApplicationParams: {
      conferenceName: conferenceName
    }
  })
  token.addGrant(voiceGrant)

  res.json({ token: token.toJwt() })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})