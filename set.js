const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQU1PS21KeVVNdmt0bmxoMzV6UW1ZdWN2SE5XVFg4c0pnWXpFbytSQWhrUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaFZmUEtjODFXd29ITkhyL0N5ZmRSZDJzMDNkcm1RS0RnS3F6S3V6T3VGdz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI2RlFZWWROemhkNkJVZlYwNnlndHh0Tm1udWMxTVJZbjJtdmtYT1RjZjJJPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJyTEx0clA5d0FGa2wra0xUbmxpaCtBY0RKT3lZNjN6Y3NTM21zeHNUbUNJPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjhDZVYwT20xOTFEV2RRVUQybUE1TjdLUW14MkFaVVgxREMxZWNYZm5Oa2M9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlBmbGJNSGVreHhib1lrbFhBWm1uU1ZZUEFiL3ZVYmZCcTEwNDBKakYxd009In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRVBwa3BaL21KK1hUWCtHb3BWRU1RRG9CeDB2cFFUZ0oyRXpuc2x1OEEwaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVW0rSUlmWmlseUNzbllKNUVNenZ2aW9nZnh4d2dxd0ZzV3dZdTZMRkwyOD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InlvbmhuQndnc2kyYkREY2NCTk1PbnVxN05ERW9tYk9ibkpNaG1Ta3QwT1R2OWdRNGtIL3hVZzV4M2h3TERFNWprMSs1YlZCcHVQd0ZZbFJiWlJGMGdRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTU5LCJhZHZTZWNyZXRLZXkiOiJEL3ZnM0ptV1J1TmM1UFI5aTk4NUEyYlE1ZCthZkFBK21rYjRQc0d6M0U4PSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzMsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMywiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJJSkd0TWRnNlJ3V1lvODJ3S2Uyd093IiwicGhvbmVJZCI6IjBhZGEwMThiLWJjZTgtNGY3YS1iNmE3LTk4ODllY2VlMDU3OCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI4WWpvSmYybm9VRjNjZ3dsLzVHdFZEUXVJNWs9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRGNxeTUxeEZXU1JwdWlZRTNaSUhKSFZxSENBPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkxXQ01EWVdRIiwibWUiOnsiaWQiOiIyNTU2MjM1MDIxMjc6NzRAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiT3V0bG9vayJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDS3J2NHU4QkVLbkg5YjhHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiV1JibDlvMUVuZGxzWjd6c1ZHZjZCNUlaNGRlZHpQeGxtcGpqb1g3dWdDdz0iLCJhY2NvdW50U2lnbmF0dXJlIjoid0xBaTR0WDFGOTRNMWdBNUNzakxTcFBJUHFmTDN1NG5MRDBtNkliSTlOWkFlTzcvOVNWc1g5OHFMWFFuTlg3OWJUaGE1R1M4QmQ1SmRQNEFNd3RMQUE9PSIsImRldmljZVNpZ25hdHVyZSI6IlIyVXRQekNnWlBrWGxyRnZOSHJLMEI3SlBrQXFYUThPYnZOYWhVaTZEWjdZQnFpSmZyUEdUSnIxVjJ0Z1ZhL0w2QWJJVHd0dkIxTlpRb29IUXpOUml3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU1NjIzNTAyMTI3Ojc0QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlZrVzVmYU5SSjNaYkdlODdGUm4rZ2VTR2VIWG5jejhaWnFZNDZGKzdvQXMifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NDQ2NTkzODIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBTFYxIn0=',
    PREFIXE: process.env.PREFIX || "+",
    GITHUB : process.env.GITHUB|| 'https://github.com/MLILA17/DML-MD',
    OWNER_NAME : process.env.OWNER_NAME || "Outlook",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "255623502127",  
              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "non",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    AUTO_REACT: process.env.AUTO_REACTION || "non",  
     AUTO_SAVE_CONTACTS : process.env.AUTO_SAVE_CONTACTS || 'no',
    URL: process.env.URL || "https://files.catbox.moe/vcdwmp.jpg",  
    AUTO_REACT_STATUS: process.env.AUTO_REACT_STATUS || 'non',              
    CHAT_BOT: process.env.CHAT_BOT || "off",              
    AUTO_READ_MESSAGES: process.env.AUTO_READ_MESSAGES || "yes",
    AUTO_BLOCK: process.env.AUTO_BLOCK || 'no', 
    GCF: process.env.GROUP_HANDLE || 'no', 
    AUTO_REPLY : process.env.AUTO_REPLY || "no", 
    AUTO_STATUS_TEXT: process.env.AUTO_STATUS_TEXT || 'viewed by Dml md',   
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || 'no',
    AUTO_BIO: process.env.AUTO_BIO || 'yes',       
    ANTI_CALL_TEXT : process.env.ANTI_CALL_TEXT || '',             
    GURL: process.env.GURL  || "https://whatsapp.com/channel/0029Vb2hoPpDZ4Lb3mSkVI3C",
    WEBSITE :process.env.GURL || "https://whatsapp.com/channel/0029Vb2hoPpDZ4Lb3mSkVI3C",
    CAPTION : process.env.CAPTION || "✧⁠DML-MD✧",
    BOT : process.env.BOT_NAME || '✧⁠DML-MD✧⁠',
    MODE: process.env.PUBLIC_MODE || "no",              
    TIMEZONE: process.env.TIMEZONE || "Africa/Dodoma", 
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME || null,
    HEROKU_API_KEY : process.env.HEROKU_API_KEY || null,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '1',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ANTI_DELETE_MESSAGE : process.env.ANTI_DELETE_MESSAGE || 'no',
    ANTI_CALL: process.env.ANTI_CALL || 'yes', 
    AUDIO_REPLY : process.env.AUDIO_REPLY || 'yes',             
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
    /* new Sequelize({
     dialect: 'sqlite',
     storage: DATABASE_URL,
     logging: false,
})
: new Sequelize(DATABASE_URL, 
     dialect: 'postgres',
     ssl: true,
     protocol: 'postgres',
     dialectOptions: {
         native: true,
         ssl: { require: true, rejectUnauthorized: false },
     },
     logging: false,
}),*/
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});

