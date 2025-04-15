"use strict";

const { makeInMemoryStore, fetchLatestBaileysVersion, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs-extra");
const path = require("path");
const conf = require("./set");
const session = conf.session.replace(/LUCKY-MD;;;=>/g, "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQU1PS21KeVVNdmt0bmxoMzV6UW1ZdWN2SE5XVFg4c0pnWXpFbytSQWhrUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiaFZmUEtjODFXd29ITkhyL0N5ZmRSZDJzMDNkcm1RS0RnS3F6S3V6T3VGdz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI2RlFZWWROemhkNkJVZlYwNnlndHh0Tm1udWMxTVJZbjJtdmtYT1RjZjJJPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJyTEx0clA5d0FGa2wra0xUbmxpaCtBY0RKT3lZNjN6Y3NTM21zeHNUbUNJPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjhDZVYwT20xOTFEV2RRVUQybUE1TjdLUW14MkFaVVgxREMxZWNYZm5Oa2M9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlBmbGJNSGVreHhib1lrbFhBWm1uU1ZZUEFiL3ZVYmZCcTEwNDBKakYxd009In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRVBwa3BaL21KK1hUWCtHb3BWRU1RRG9CeDB2cFFUZ0oyRXpuc2x1OEEwaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVW0rSUlmWmlseUNzbllKNUVNenZ2aW9nZnh4d2dxd0ZzV3dZdTZMRkwyOD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InlvbmhuQndnc2kyYkREY2NCTk1PbnVxN05ERW9tYk9ibkpNaG1Ta3QwT1R2OWdRNGtIL3hVZzV4M2h3TERFNWprMSs1YlZCcHVQd0ZZbFJiWlJGMGdRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTU5LCJhZHZTZWNyZXRLZXkiOiJEL3ZnM0ptV1J1TmM1UFI5aTk4NUEyYlE1ZCthZkFBK21rYjRQc0d6M0U4PSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzMsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMywiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJJSkd0TWRnNlJ3V1lvODJ3S2Uyd093IiwicGhvbmVJZCI6IjBhZGEwMThiLWJjZTgtNGY3YS1iNmE3LTk4ODllY2VlMDU3OCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI4WWpvSmYybm9VRjNjZ3dsLzVHdFZEUXVJNWs9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRGNxeTUxeEZXU1JwdWlZRTNaSUhKSFZxSENBPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkxXQ01EWVdRIiwibWUiOnsiaWQiOiIyNTU2MjM1MDIxMjc6NzRAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiT3V0bG9vayJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDS3J2NHU4QkVLbkg5YjhHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiV1JibDlvMUVuZGxzWjd6c1ZHZjZCNUlaNGRlZHpQeGxtcGpqb1g3dWdDdz0iLCJhY2NvdW50U2lnbmF0dXJlIjoid0xBaTR0WDFGOTRNMWdBNUNzakxTcFBJUHFmTDN1NG5MRDBtNkliSTlOWkFlTzcvOVNWc1g5OHFMWFFuTlg3OWJUaGE1R1M4QmQ1SmRQNEFNd3RMQUE9PSIsImRldmljZVNpZ25hdHVyZSI6IlIyVXRQekNnWlBrWGxyRnZOSHJLMEI3SlBrQXFYUThPYnZOYWhVaTZEWjdZQnFpSmZyUEdUSnIxVjJ0Z1ZhL0w2QWJJVHd0dkIxTlpRb29IUXpOUml3PT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU1NjIzNTAyMTI3Ojc0QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlZrVzVmYU5SSjNaYkdlODdGUm4rZ2VTR2VIWG5jejhaWnFZNDZGKzdvQXMifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NDQ2NTkzODIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBTFYxIn0=");
require("dotenv").config({ path: "./config.env" });

let auto_reply_message = "Hello, my owner is unavailable. Kindly leave a message.";

async function authentification() {
  try {
    if (!fs.existsSync(__dirname + "/auth/creds.json")) {
      console.log("Connected successfully...");
      await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
    } else if (fs.existsSync(__dirname + "/auth/creds.json") && session !== "zokk") {
      await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
    }
  } catch (e) {
    console.log("Session Invalid " + e);
  }
}
authentification();

const store = makeInMemoryStore({
  logger: pino().child({ level: "silent", stream: "store" })
});

setTimeout(() => {
  async function main() {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState(__dirname + "/auth");

    const sockOptions = {
      version,
      logger: pino({ level: "silent" }),
      browser: ['DML-MD', "safari", "1.0.0"],
      printQRInTerminal: true,
      fireInitQueries: false,
      shouldSyncHistoryMessage: true,
      downloadHistory: true,
      syncFullHistory: true,
      generateHighQualityLinkPreview: true,
      markOnlineOnConnect: false,
      keepAliveIntervalMs: 30_000,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, logger)
      },
      getMessage: async (key) => {
        if (store) {
          const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
          return msg.message || undefined;
        }
        return { conversation: 'An Error Occurred, Repeat Command!' };
      }
    };

    const zk = require("@whiskeysockets/baileys")(sockOptions);
    store.bind(zk.ev);
    setInterval(() => {
      store.writeToFile("store.json");
    }, 3000);

    zk.ev.on("call", async (callData) => {
      if (conf.ANTI_CALL === 'yes') {
        const callId = callData[0].id;
        const callerId = callData[0].from;
        await zk.rejectCall(callId, callerId);
        await zk.sendMessage(callerId, {
          text: "❗📵I AM DML MD | I REJECT THIS CALL BECAUSE MY OWNER IS NOT AVAILABLE FOR NOW. KINDLY SEND MESSAGE RIGHT NOW."
        });
      }
    });

    zk.ev.on("messages.upsert", async (m) => {
      const { messages } = m;
      const ms = messages[0];
      if (!ms.message) return;

      const messageKey = ms.key;
      const remoteJid = messageKey.remoteJid;

      if (!store.chats[remoteJid]) {
        store.chats[remoteJid] = [];
      }

      store.chats[remoteJid].push(ms);

      if (ms.message.protocolMessage && ms.message.protocolMessage.type === 0) {
        const deletedKey = ms.message.protocolMessage.key;
        const chatMessages = store.chats[remoteJid];
        const deletedMessage = chatMessages.find(msg => msg.key.id === deletedKey.id);

        if (deletedMessage) {
          const deletedBy = deletedMessage.key.participant || deletedMessage.key.remoteJid;
          let notification = `*🤦DML ANTIDELETE🤦*`;
          notification += `*Time deleted🌹:* ${new Date().toLocaleString()}`;
          notification += `*Deleted by🌺:* @${deletedBy.split('@')[0]}`;

          if (deletedMessage.message.conversation) {
            await zk.sendMessage(remoteJid, {
              text: notification + `*Message:* ${deletedMessage.message.conversation}`,
              mentions: [deletedMessage.key.participant]
            });
          } else if (deletedMessage.message.imageMessage || deletedMessage.message.videoMessage || deletedMessage.message.documentMessage || deletedMessage.message.audioMessage || deletedMessage.message.stickerMessage || deletedMessage.message.voiceMessage) {
            const mediaBuffer = await downloadMedia(deletedMessage.message);
            if (mediaBuffer) {
              const mediaType = deletedMessage.message.imageMessage ? 'image' : deletedMessage.message.videoMessage ? 'video' : deletedMessage.message.documentMessage ? 'document' : deletedMessage.message.audioMessage ? 'audio' : deletedMessage.message.stickerMessage ? 'sticker' : 'audio';
              await zk.sendMessage(remoteJid, {
                [mediaType]: mediaBuffer,
                caption: notification,
                mentions: [deletedMessage.key.participant]
              });
            }
          }
        }
      }
    });

    let repliedContacts = new Set();
    zk.ev.on("messages.upsert", async (m) => {
      const { messages } = m;
      const ms = messages[0];
      if (!ms.message) return;
      const messageText = ms.message.conversation || ms.message.extendedTextMessage?.text || "";
      const remoteJid = ms.key.remoteJid;

      if (messageText.match(/^[^\w\s]/) && ms.key.fromMe) {
        const prefix = messageText[0];
        const command = messageText.slice(1).split(" ")[0];
        const newMessage = messageText.slice(prefix.length + command.length).trim();

        if (command === "setautoreply" && newMessage) {
          auto_reply_message = newMessage;
          await zk.sendMessage(remoteJid, {
            text: `Auto-reply message has been updated to:\n"${auto_reply_message}"`
          });
          return;
        }
      }

      if (conf.AUTO_REPLY === "yes" && !repliedContacts.has(remoteJid) && !ms.key.fromMe && !remoteJid.includes("@g.us")) {
        await zk.sendMessage(remoteJid, {
          text: auto_reply_message,
          mentions: [ms.key.remoteJid]
        });

        repliedContacts.add(remoteJid);
      }
    });

    if (conf.AUTO_REACT === "yes") {
      zk.ev.on("messages.upsert", async (m) => {
        const { messages } = m;
        let emojis = [];
        const emojiFilePath = path.resolve(__dirname, 'luckybase', 'like.json');

        try {
          const data = fs.readFileSync(emojiFilePath, 'utf8');
          emojis = JSON.parse(data);
        } catch (error) {
          console.error('Error reading emojis file:', error);
          return;
        }

        for (const message of messages) {
          if (!message.key.fromMe) {
            const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
            await zk.sendMessage(message.key.remoteJid, {
              react: {
                text: randomEmoji,
                key: message.key
              }
            });
          }
        }
      });
    }

    let lastReactionTime = 0;
    const loveEmojis = ["❤️", "💖", "💘", "💝", "💓", "💌", "💕", "😎", "🔥", "💥", "💯", "✨", "🌟", "🌈", "⚡", "💎", "🌀", "👑", "🎉", "🎊", "🦄", "👽", "🛸", "🚀", "🦋", "💫", "🍀", "🎶", "🎧", "🎸", "🎤", "🏆", "🏅", "🌍", "🌎", "🌏", "🎮", "🎲", "💪", "🏋️", "🥇", "👟", "🏃", "🚴", "🚶", "🏄", "⛷️", "🕶️", "🧳", "🍿", "🥂", "🍻", "🍷", "🍸", "🥃", "🍾", "🎯", "⏳", "🎁", "🎈", "🎨", "🌻", "🌸", "🌺", "🌹", "🌼", "🌞", "🌝", "🌜", "🌙", "🌚", "🍀", "🌱", "🍃", "🍂", "🌾", "🐉", "🐍", "🦓", "🦄", "🦋", "🦧", "🦘", "🦨", "🦡", "🐉", "🐅", "🐆", "🐓", "🐢", "🐊", "🐠", "🐟", "🐡", "🦑", "🐙", "🦀", "🐬", "🦕", "🦖", "🐾", "🐕", "🐈", "🐇", "🐾"];

    if (conf.AUTO_REACT_STATUS === "yes") {
      console.log("AUTO_REACT_STATUS is enabled. Listening for status updates...");
      zk.ev.on("messages.upsert", async (m) => {
        const { messages } = m;
        for (const message of messages) {
          if (message.key && message.key.remoteJid === "status@broadcast") {
            const now = Date.now();
            if (now - lastReactionTime < 5000) {
              continue;
            }

            const keith = zk.user && zk.user.id ? zk.user.id.split(":")[0] + "@s.whatsapp.net" : null;
            if (!keith) continue;

            const randomLoveEmoji = loveEmojis[Math.floor(Math.random() * loveEmojis.length)];
            await zk.sendMessage(message.key.remoteJid, {
              react: {
                key: message.key,
                text: randomLoveEmoji
              }
            });

            lastReactionTime = Date.now();
            console.log(`Successfully reacted to status update by ${message.key.remoteJid} with ${randomLoveEmoji}`);

            await delay(2000); // 2-second delay between reactions
          }
        }
      });
    }
  }

  main();
}, 0);
