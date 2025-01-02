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

socket.on('audioData', (chunk) => {
  console.log('Received audio data chunk:', chunk);

  // Decode audio data
  audioContext.decodeAudioData(chunk.buffer, (buffer) => {
    console.log('Audio data decoded successfully:', buffer);

    // Create a new buffer source and connect to gain node
    const source = audioContext.createBufferSource();
    console.log('BufferSource created:', source);

    source.buffer = buffer;
    source.connect(gainNode);
    console.log('BufferSource connected to GainNode');

    source.start();
    console.log('Audio playback started');
  }, (error) => {
    console.error('Error decoding audio data:', error);
  });
});

socket.on('audioEnded', () => {
  console.log('Audio playback ended');
});

function playSong(songUrl) {
  console.log('Requested to play song with URL:', songUrl);

  socket.emit('playSong', songUrl);
  console.log('PlaySong event emitted with URL:', songUrl);
}
