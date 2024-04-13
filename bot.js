const tmi = require('tmi.js');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json'));

const client = new tmi.Client({
    options: { debug: true },
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: config.identity.username,
        password: config.identity.password
    },
    channels: config.channels
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    if (self) return; // Ignorar mensagens do próprio bot

    console.log(`[${channel}] ${tags['display-name']}: ${message}`);

    if (message.toLowerCase() === '!filme') {
        lerFilmeAtual((filme) => {
            if (filme) {
                client.say(channel, `O filme atual é: ${filme}`);
            } else {
                client.say(channel, 'Não há nenhum filme atual.');
            }
        });
    }
});

function lerFilmeAtual(callback) {
    fs.readFile('Filmeatual.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo Filmeatual.txt:', err);
            callback(null);
        } else {
            const filme = data.trim();
            callback(filme);
        }
    });
}
