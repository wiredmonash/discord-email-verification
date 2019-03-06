const CONFIG = process.env.DISCORD_LOGIN_API_TOKEN == undefined ? require('./config.json') : process.env
const csv = require('csv-parser')
const cryptoJSON = require('crypto-json')
const fs = require('fs')
const member_emails = []

fs.createReadStream('members.csv')
  .pipe(csv())
  .on('data', data => member_emails.push(data.Email.toLowerCase()))
  .on('end', () =>
    fs.writeFile(
      'members.json',
      JSON.stringify(
        cryptoJSON.encrypt({ members: member_emails }, CONFIG.CRYPTO_JSON_MEMBER_ENCRYPT_KEY, {
          encoding: CONFIG.CRYPTO_JSON_ENCODING,
          keys: ['members'],
          algorithm: CONFIG.CRYPTO_JSON_ALGORITHM
        })
      ),
      () => null
    )
  )
