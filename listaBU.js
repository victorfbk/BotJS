const fs = require('fs');
const readline = require('readline');

function lerArquivoTxt(nomeArquivo, titulos, callback) {
    fs.readFile(nomeArquivo, 'utf8', (err, data) => {
        if (err) {
            return callback(err);
        }
        
        const linhas = data.trim().split('\n');
        const tabela = linhas.map(linha => linha.replace('\r', '').split(';'));
        
        // Adiciona os títulos à tabela
        tabela.unshift(titulos);
        
        callback(null, tabela);
    });
}

function mostrarTabela(tabela) {
    tabela.forEach((linha, index) => {
        console.log(index + ': ' + linha.join(' | '));
    });
}

function escreverFilmeAtual(nomeFilme) {
    fs.writeFile('Filmeatual.txt', nomeFilme, (err) => {
        if (err) {
            console.error('Erro ao escrever o arquivo Filmeatual.txt:', err);
        } else {
            console.log(`O filme atual '${nomeFilme}' foi salvo no arquivo.`);
        }
    });
}

function mostrarFilmes(tabela, indiceInicial, primeiraExecucao) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    if (primeiraExecucao) {
        mostrarTabela(tabela);
        rl.question('Escolha o número do filme para iniciar: ', (resposta) => {
            const indiceInicialEscolhido = parseInt(resposta);
            if (isNaN(indiceInicialEscolhido) || indiceInicialEscolhido < 0 || indiceInicialEscolhido >= tabela.length) {
                console.log('Índice inicial inválido.');
                rl.close();
                return;
            }

            rl.close();
            const filmeEscolhido = tabela[indiceInicialEscolhido];
            escreverFilmeAtual(filmeEscolhido[1]);
            mostrarFilmes(tabela, indiceInicialEscolhido, false);
        });
    } else {
        const filmeEscolhido = tabela[indiceInicial];
        console.log(`\nIniciando contagem regressiva para '${filmeEscolhido[1]}' por ${filmeEscolhido[2]}:`);
        const duracaoEmSegundos = calcularDuracaoEmSegundos(filmeEscolhido[2]);
        escreverFilmeAtual(filmeEscolhido[1]);
        iniciarContagemRegressiva(duracaoEmSegundos, () => {
            console.log(`Fim de '${filmeEscolhido[1]}'`);
            const proximoIndice = (indiceInicial + 1) % tabela.length;
            if (proximoIndice !== 0) {
                mostrarFilmes(tabela, proximoIndice, false);
            } else {
                console.log('Retornando ao primeiro filme da lista.');
                mostrarFilmes(tabela, 1, false); // Retorna ao primeiro filme da lista
            }
        });
    }
}

function calcularDuracaoEmSegundos(duracao) {
    const partes = duracao.split(':');
    const horas = parseInt(partes[0]) || 0;
    const minutos = parseInt(partes[1]) || 0;
    const segundos = parseInt(partes[2]) || 0;
    return horas * 3600 + minutos * 60 + segundos;
}

function iniciarContagemRegressiva(segundos, callback) {
    let tempoRestante = segundos;
    const intervalo = setInterval(() => {
        if (tempoRestante <= 0) {
            clearInterval(intervalo);
            callback();
        } else {
            console.log(`Tempo restante: ${tempoRestante} segundos`);
            tempoRestante--;
        }
    }, 1000);
}

// Exemplo de uso:
const nomeArquivo = 'Todosteste.txt';
const titulos = ['Número', 'Nome do Filme', 'Duração']; // Títulos das colunas
lerArquivoTxt(nomeArquivo, titulos, (err, tabela) => {
    if (err) {
        console.error('Erro ao ler o arquivo:', err);
        return;
    }

    mostrarFilmes(tabela, 0, true); // Começa a partir do primeiro filme na primeira execução
});
