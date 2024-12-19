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

// Definicija botova
const Sanella = {
    name: 'Sanella',
    age: 35,
    location: 'Hamburg',
    languages: ['German', 'English', 'Serbian'],
    isBot: true,
    intro: () => 'Hello, I am Sanella, nice to meet you!'
};

const Lidija = {
    name: 'Lidija',
    age: 34,
    location: 'Belgrade',
    languages: ['Serbian', 'English'],
    isBot: true,
    intro: () => 'Hi, I am Lidija, how can I help you today?'
};

const Hasan = {
    name: 'Hasan',
    age: 45,
    location: 'New York',
    languages: ['English', 'French', 'Spanish', 'Russian'],
    isBot: true,
    intro: () => 'Greetings, I am Hasan. Let\'s chat!'
};

// Funkcija koja omogućava botovima da učestvuju u razgovoru
const handleMessage = (bot, message) => {
    console.log(`${bot.name}: ${bot.intro()}`);
    console.log(`User: ${message}`);
    console.log(`${bot.name}: Let me think...`);
    setTimeout(() => {
        console.log(`${bot.name}: I am here to help!`);
    }, 1000);
};

// Exportujemo botove za korišćenje u drugim fajlovima
module.exports = {
    Sanella,
    Lidija,
    Hasan,
    handleMessage
};
