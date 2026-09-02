const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

const client = new Client();


const voiceChannelId = '1544722120536358912'; // room id


const guildId = 'guild id'; // لا تستخدمووووووووووووووو



let isConnectedToTarget = false;


async function joinVoiceChannelIfNeeded() {
  try {
    const channel = await client.channels.fetch(voiceChannelId);

    if (!channel || !channel.isVoice()) {
      console.log('❌ القناة الصوتية غير موجودة أو ليست قناة صوتية!');
      return;
    }

    
    const currentConnection = getVoiceConnection(guildId);
    if (currentConnection && currentConnection.joinConfig.channelId === voiceChannelId) {
      console.log('✅ الحساب موجود بالفعل في القناة الصوتية.');
      return;
    }

    
    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      selfMute: true, // كتم الصوت
      selfDeaf: true, // عزل الصوت
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    isConnectedToTarget = true;
    console.log(`✅ تم الدخول إلى القناة الصوتية: ${channel.name}`);
  } catch (error) {
    console.error(`❌ حدث خطأ أثناء محاولة الدخول إلى القناة: ${error}`);
  }
}


client.on('ready', async () => {
  console.log(`${client.user.username} is ready!`);
  joinVoiceChannelIfNeeded();
});


client.on('voiceStateUpdate', async (oldState, newState) => {
  
  if (newState.id !== client.user.id) return;

  
  if (!newState.channelId) {
    console.log('🔇 تم الخروج من كل القنوات الصوتية.');
    isConnectedToTarget = false;
    setTimeout(joinVoiceChannelIfNeeded, 2000); // حاول الدخول بعد 2 ثانية
  }

  
  if (newState.channelId && newState.channelId !== voiceChannelId) {
    console.log(`🎧 دخلت إلى قناة أخرى: ${newState.channel.name}`);
    isConnectedToTarget = false;
  }

  
  if (newState.channelId === voiceChannelId) {
    console.log(`✅ رجعت إلى القناة المستهدفة: ${newState.channel.name}`);
    isConnectedToTarget = true;
  }
});


client.login('MTI3OTUyNDE3MTg2MDE1MjM2Nw.GwndS6.W3MKB_o5KOgEZvNvzwpEz5-dojmWc83_4t6Kco');
