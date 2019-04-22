import { messagesExist } from "./utils/messages-exist";
import { isMod } from "./utils/permissions";
import { purge } from "./utils/purge";
import { setup } from "./utils/setup";
import { rebindUpdateMessages } from "./utils/rebind";

const config = require("config");
const Discord = require("discord.js");

const client = new Discord.Client();
const prefix = config.general.commandPrefix;

client.on("ready", async () => {
  client.user.setUsername(config.general.botUsername);
  config.reactMessagesIds = [];

  const channelNames = config.authorizedChannels;
  await channelNames.forEach(channelName => {
    const channel = client.channels.find("name", channelName);

    if (messagesExist(channel)) {
      // Rebind and update messages
      rebindUpdateMessages(client, channel);
    }
  });
});

client.on("error", async () => {
  // Add a logger here
});

client.on("message", async msg => {
  const isAuthorized = isMod(msg);
  const authorizedChannel =
    config.authorizedChannels.indexOf(msg.channel.name) !== -1;
  if (
    msg.content === `${prefix}setupRoles` &&
    isAuthorized &&
    authorizedChannel
  ) {
    await purge(msg.channel);
    await setup(client, msg.channel);
  }
});

client.login(config.general.botToken);
