# Gunakan node.js versi LTS (14.x saat ini)
FROM node:14

# Set direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json (jika ada) untuk instalasi dependensi
COPY package*.json ./

# Instal dependensi yang diperlukan
RUN npm install

# Salin kode aplikasi Anda ke dalam container
COPY . .

# Expose port yang diperlukan (misalnya, port 3000)
EXPOSE 3000

# Command untuk menjalankan aplikasi
CMD ["node", "twtv.js"]
