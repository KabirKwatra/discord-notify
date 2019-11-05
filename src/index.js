import ids from "../ids.json"; // client ids, soundbites, channel ids
import * as commando from "discord.js";

const client = new commando.Client({
    commandPrefix: '$',
    owner: '171336809836576768'
});
const logGuildID = ids.channels[0]["server"];
const logChannelID = ids.channels[0]["log_channel"];

client.on('ready', () => { // log in
    client.channels.get(logChannelID).send(`Logged in as ${client.user.tag}!`).then(_ =>
        console.log(`Logged in as ${client.user.tag}!`))
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    const voiceChannel = newMember.voiceChannel;

    if (voiceChannel && oldMember && oldMember.voiceChannel && oldMember.voiceChannel.id === voiceChannel.id) return;

    let user = ids.users.filter(user => user.id === newMember.id)[0]; // may be undefined

    if (user === undefined || voiceChannel === undefined
        || client.voiceConnections.array().includes(voiceChannel.connection)) return; // stop if not
    console.log('@' + newMember.displayName + ': state updated');

    // TEXT
    client.channels.get(logChannelID).send(newMember.displayName +
        ` ALERT IN VOICE CHANNEL ***<#${voiceChannel.id}>!***`).then(_ =>
        console.log('#' + client.guilds.get(logGuildID).channels.get(logChannelID).name + ': message sent'));

    // VOICE
    voiceChannel.join().then(connection => { // connect to vc
        console.log('#' + voiceChannel.name + ': connection established');

        let dispatcher = connection.playFile(user.path); // play audio
        console.log('#' + voiceChannel.name + ': audio playing');

        dispatcher.on('end', end => { // audio finishes
            console.log('#' + voiceChannel.name + ': audio finished playing');
            voiceChannel.leave();
        });
    });
});

client.login(process.env.BOT_TOKEN).then(r => { // login with token
});
