const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios'); // Import axios
const fs = require('fs'); // Import file system module
const path = require('path'); // Import path module

// Token bot Telegram Anda
const token = '6617017697:AAFgSCjYvk5a6oI8hCyS6p63O7wXwgGlHTg';

// Inisialisasi bot
const bot = new TelegramBot(token, { polling: true });

// Handler untuk perintah /start
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Halo! Kirimkan saya URL Twitter dan saya akan mencoba mengambil video dari link tersebut.');
});

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
        
        // Unduh file video dari URL
        const videoFileName = path.basename(videoUrl);
        const videoPath = path.join(__dirname, videoFileName);
        const writer = fs.createWriteStream(videoPath);

        const videoResponse = await axios({
          method: 'GET',
          url: videoUrl,
          responseType: 'stream'
        });

        videoResponse.data.pipe(writer);

        writer.on('finish', () => {
          // Kirim file video ke pengguna
          bot.sendVideo(chatId, videoPath).then(() => {
            // Hapus file setelah dikirim
            fs.unlinkSync(videoPath);
          }).catch((error) => {
            console.error('Gagal mengirim file video:', error);
          });
        });

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
          
          // Unduh file video dari URL
          const videoFileName = path.basename(videoUrl);
          const videoPath = path.join(__dirname, videoFileName);
          const writer = fs.createWriteStream(videoPath);

          const videoResponse = await axios({
            method: 'GET',
            url: videoUrl,
            responseType: 'stream'
          });

          videoResponse.data.pipe(writer);

          writer.on('finish', () => {
            // Kirim file video ke pengguna
            bot.sendVideo(chatId, videoPath).then(() => {
              // Hapus file setelah dikirim
              fs.unlinkSync(videoPath);
            }).catch((error) => {
              console.error('Gagal mengirim file video:', error);
            });
          });

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
