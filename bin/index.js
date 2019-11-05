"use strict";

var _ids = require("../ids.json");

var _ids2 = _interopRequireDefault(_ids);

var _discord = require("discord.js");

var commando = _interopRequireWildcard(_discord);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = new commando.Client({
    commandPrefix: '$',
    owner: '171336809836576768'
}); // client ids, soundbites, channel ids

var logGuildID = _ids2.default.channels[0]["server"];
var logChannelID = _ids2.default.channels[0]["log_channel"];

client.on('ready', function () {
    // log in
    client.channels.get(logChannelID).send("Logged in as " + client.user.tag + "!").then(function (_) {
        return console.log("Logged in as " + client.user.tag + "!");
    });
});

client.on('voiceStateUpdate', function (oldMember, newMember) {
    var voiceChannel = newMember.voiceChannel;

    if (voiceChannel && oldMember && oldMember.voiceChannel && oldMember.voiceChannel.id === voiceChannel.id) return;

    var user = _ids2.default.users.filter(function (user) {
        return user.id === newMember.id;
    })[0]; // may be undefined

    if (user === undefined || voiceChannel === undefined || client.voiceConnections.array().includes(voiceChannel.connection)) return; // stop if not
    console.log('@' + newMember.displayName + ': state updated');

    // TEXT
    client.channels.get(logChannelID).send(newMember.displayName + (" ALERT IN VOICE CHANNEL ***<#" + voiceChannel.id + ">!***")).then(function (_) {
        return console.log('#' + client.guilds.get(logGuildID).channels.get(logChannelID).name + ': message sent');
    });

    // VOICE
    voiceChannel.join().then(function (connection) {
        // connect to vc
        console.log('#' + voiceChannel.name + ': connection established');

        var dispatcher = connection.playFile(user.path); // play audio
        console.log('#' + voiceChannel.name + ': audio playing');

        dispatcher.on('end', function (end) {
            // audio finishes
            console.log('#' + voiceChannel.name + ': audio finished playing');
            voiceChannel.leave();
        });
    });
});

client.login(process.env.BOT_TOKEN).then(function (r) {// login with token
});