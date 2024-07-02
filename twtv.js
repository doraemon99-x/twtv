const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios'); // Import axios
const fs = require('fs'); // Import file system module
const path = require('path'); // Import path module

// Token bot Telegram Anda
const token = '6617017697:AAH7v5lFv1Fes2vmdtCvpsHVfrAsX99ETnI';

// Inisialisasi bot
const bot = new TelegramBot(token, { polling: true });

// Handler untuk perintah /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Halo! Kirimkan saya URL Twitter dan saya akan mencoba mengambil video dari link tersebut.');
});

// Fungsi untuk mengunduh dan langsung mengirimkan video ke pengguna
const downloadAndSendVideo = async (chatId, videoUrl) => {
  try {
    // Kirim file video ke pengguna langsung dari URL
    bot.sendVideo(chatId, videoUrl).then(() => {
      // Kirim pesan dengan URL video
      bot.sendMessage(chatId, `Video berhasil ditemukan: ${videoUrl}`);
    }).catch((error) => {
      console.error('Gagal mengirim file video:', error);
      bot.sendMessage(chatId, 'Gagal mengirim file video.');
    });
  } catch (error) {
    console.error('Gagal mengirim file video:', error);
    bot.sendMessage(chatId, 'Gagal mengirim file video.');
  }
};

// Handler untuk perintah /twt
bot.onText(/\/twt (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const url = match[1]; // Mendapatkan URL Twitter dari pesan
  
  // Buat payload sesuai dengan permintaan Anda
  const payload = { videoLink: url };

  // URL endpoint yang akan digunakan
  const apiUrl = 'https://tesfg-624-8f02fc86-jc1ns8ex.onporter.run/api/video';

  try {
    // Lakukan permintaan POST dengan axios
    const response = await axios.post(apiUrl, payload);

    // Cek jika permintaan berhasil
    if (response.status === 200) {
      const data = response.data;
      if (data.found) {
        const videoUrl = data.media[0].url;
        
        // Kirim file video ke pengguna langsung dari URL
        downloadAndSendVideo(chatId, videoUrl);

      } else {
        bot.sendMessage(chatId, 'Video tidak ditemukan.');
      }
    } else {
      bot.sendMessage(chatId, 'Gagal mengambil video dari URL Twitter.');
    }
  } catch (error) {
    bot.sendMessage(chatId, `Terjadi kesalahan: ${error.message}`);
  }
});

// Handler untuk pesan yang mengandung URL Twitter
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Jika pesan bukan perintah dan berisi URL Twitter
  if (!msg.text.startsWith('/')) {
    // Buat payload sesuai dengan permintaan Anda
    const payload = { videoLink: text };

    // URL endpoint yang akan digunakan
    const apiUrl = 'https://tesfg-624-8f02fc86-jc1ns8ex.onporter.run/api/video';

    try {
      // Lakukan permintaan POST dengan axios
      const response = await axios.post(apiUrl, payload);

      // Cek jika permintaan berhasil
      if (response.status === 200) {
        const data = response.data;
        if (data.found) {
          const videoUrl = data.media[0].url;
          
          // Kirim file video ke pengguna langsung dari URL
          downloadAndSendVideo(chatId, videoUrl);

        } else {
          bot.sendMessage(chatId, 'Video tidak ditemukan.');
        }
      } else {
        bot.sendMessage(chatId, 'Gagal mengambil video dari URL Twitter.');
      }
    } catch (error) {
      bot.sendMessage(chatId, `Terjadi kesalahan: ${error.message}`);
    }
  }
});
