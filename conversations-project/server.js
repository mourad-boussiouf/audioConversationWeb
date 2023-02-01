require("dotenv").config();
const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())

const port = 5000

const AccessToken = require("twilio").jwt.AccessToken
const ChatGrant = AccessToken.ChatGrant

// Base pour tous les webRTC/services twilio 
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioApiKey = process.env.TWILIO_API_KEY_SID
const twilioApiSecret = process.env.TWILIO_API_KEY_SECRET

// Utilisée pour le chat twilio 
const serviceSid = process.env.TWILIO_CONVERSATIONS_SERVICE_SID

// grant = id qui permet au programme client d'un utilisateur d'une reconnu et d'acceder au chat

// pour un appareil donné
const chatGrant = new ChatGrant({
    serviceSid: serviceSid,
})

// creation token, signature de ce token et le rendre en réponse au client user
// le token codé contient le grant qui vient d'etre attribué à cet user/client

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
    console.log(`test conv ecoute" sur l'url : http://localhost:${port}`)
})