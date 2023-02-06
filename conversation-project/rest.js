require("dotenv").config()
const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())

const port = 5000

const AccessToken = require("twilio").jwt.AccessToken
const ChatGrant = AccessToken.ChatGrant

// utilisé dans le génération du token 
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID
const twilioApiKey = process.env.TWILIO_API_KEY_SID
const twilioApiSecret = process.env.TWILIO_API_KEY_SECRET

// utilisé spécialement pour le chat conv
const serviceSid = process.env.TWILIO_CONVERSATIONS_SERVICE_SID

console.log("WWWWWWWWW",serviceSid);

// le "grant" autorise cet utilisateur à aller dans ce chat précis
// sur un appareil unique donné
const chatGrant = new ChatGrant({
    serviceSid: serviceSid,
})

// l'acces token est signé par le server puis renvoyé au client
// et contient le "grant" qui permettra à l'user d'entrer dans cette conv
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