// Obtém o elemento canvas do HTML
const ctx = document.getElementById('grafico').getContext('2d'); 

// Cria o gráfico com 3 linhas: CPU, Memória e Disco
const grafico = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Rótulos no eixo X (tempo)
        datasets: [
            {
                label: 'CPU (%)',
                borderColor: 'red',
                data: [],
                fill: false
            },
            {
                label: 'Memória RAM (%)',
                borderColor: 'blue',
                data: [],
                fill: false
            },
            {
                label: 'Disco (%)',
                borderColor: 'green',
                data: [],
                fill: false
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                max: 100 // porcentagem
            }
        }
    }
});

// Função que busca os dados no backend e atualiza o gráfico
function atualizarGrafico() {
    fetch('/dados')
        .then(response => response.json()) // Converte a resposta em JSON
        .then(dados => {
            const horario = new Date().toLocaleTimeString(); // Hora atual para eixo X

            // Adiciona a hora atual no gráfico
            grafico.data.labels.push(horario);

            // Atualiza os valores de cada linha
            grafico.data.datasets[0].data.push(dados.cpu);
            grafico.data.datasets[1].data.push(dados.memoria);
            grafico.data.datasets[2].data.push(dados.disco);

            // Mantém apenas os últimos 10 pontos no gráfico
            if (grafico.data.labels.length > 10) {
                grafico.data.labels.shift(); // Remove o primeiro (mais antigo)
                grafico.data.datasets.forEach(dataset => dataset.data.shift());
            }

            // Redesenha o gráfico com os novos dados
            grafico.update();
        });
}

// Atualiza o gráfico a cada 2 segundos
setInterval(atualizarGrafico, 2000);
