# Gunakan image node resmi
FROM node:14

# Buat direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json ke dalam direktori kerja
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin sisa kode aplikasi ke dalam direktori kerja
COPY . .

# Buat direktori temp di dalam container
RUN mkdir /app/temp

# Ekspos port (opsional, jika Anda ingin menjalankan bot pada port tertentu)
# EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "index.js"]
