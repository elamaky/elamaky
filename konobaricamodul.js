// konobaricamodul.js

module.exports = (io) => {
    io.on('connection', (socket) => {
        // Kada novi gost uđe, pošaljemo pozdravnu poruku od Konobarice
        socket.on('new_guest', () => {
            const greetingMessage = `Dobro nam došli, osećajte se kao kod kuće, i budite nam raspoloženi! Sada će vam vaša Konobarica posluziti kaficu ☕, 
                                                        a naši DJ-evi će se pobrinuti da vam ispune muzičke želje.`;

            // Emituj poruku sa klasom 'konobarica' kako bi imala stil
            io.emit('message', { 
                username: '<span class="konobarica">Konobarica</span>', 
                message: greetingMessage,
                isSystemMessage: true // označavamo kao sistemsku poruku
            });
        });
    });
};
// existingModule.js
const { spawn } = require('child_process');

function existingFunction() {
    // neki kod
}

function startStreaming(inputPath, rtmpUrl) {
    const ffmpeg = spawn('ffmpeg', ['-i', inputPath, '-f', 'flv', rtmpUrl]);

    ffmpeg.stdout.on('data', (data) => console.log(`Output: ${data}`));
    ffmpeg.stderr.on('data', (data) => console.error(`Error: ${data}`));
    ffmpeg.on('close', (code) => console.log(`FFmpeg exited with code ${code}`));

    return ffmpeg;
}
