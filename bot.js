const tmi = require('tmi.js');
const fs = require('fs');

const client = new tmi.Client({
    options: { debug: true },
    connection: {
        secure: true,
        reconnect: true
    },
    identity: {
        username: 'filmes_seriesbr',
        password: 'oauth:7jqp8tfjdi9pbkzfq0xcc0w9mufxdn'
    },
    channels: [ 'filmes_seriesbr' ]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
    if (self) return; // Ignorar mensagens do próprio bot
    
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
