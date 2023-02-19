require("dotenv").config()
const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())

const port = 5000

const AccessToken = require("twilio").jwt.AccessToken
const ChatGrant = AccessToken.ChatGrant

// mix des trois pour fournir le token backend
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioApiKey = process.env.TWILIO_API_KEY_SID
const twilioApiSecret = process.env.TWILIO_API_KEY_SECRET

// service sid de la conversation chat twilio
const serviceSid = process.env.TWILIO_CONVERSATIONS_SERVICE_SID

// le grant est ajoué au token et précise l'autorisation de l'user selon le type de communication et lappareil,

const chatGrant = new ChatGrant({
    serviceSid: serviceSid,
})

//le token final est complet a partir des variables d'environnement et du "grant"
function getAccessToken(user) {
    const token = new AccessToken(
        twilioAccountSid,
        twilioApiKey,
        twilioApiSecret,
        {identity: user}
    )
    token.addGrant(chatGrant)
    const jwt = token.toJwt()
    console.log(`Token for ${user}: ${jwt}`)
    return jwt
}

app.get("/auth/user/:user", (req, res) => {
    const jwt = getAccessToken(req.params.user)
    res.send({token: jwt})
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})