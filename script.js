// Obtém o elemento HTML <canvas> pelo seu ID 'myCanvas'.
// O canvas é um elemento que permite desenhar gráficos e outras imagens dinamicamente.
const canvas = document.getElementById('myCanvas');

// Obtém o contexto de renderização 2D do canvas, que é necessário para desenhar.
const ctx = canvas.getContext('2d');

// Define a largura do canvas como 90% da largura da janela do navegador,
// e a altura do canvas como 40% da altura da janela do navegador.
// Isso torna o gráfico responsivo, adaptando-se ao tamanho da tela do usuário.
canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.4;

// Declara uma variável global 'chart' que irá armazenar a instância do gráfico.
// 'shapes' é um array que irá armazenar as formas desenhadas no canvas, como retângulos e círculos.
// 'texts' é um array que irá armazenar os textos que o usuário pode adicionar.
// 'zoomLevel' controla o nível de zoom aplicado às formas no canvas.
// 'rotationAngle' controla o ângulo de rotação aplicado às formas no canvas.
let chart;
let shapes = [];
let texts = [];
let zoomLevel = 1;
let rotationAngle = 0;

// Função que atualiza o gráfico com novos dados e configurações.
// Esta função é chamada quando o usuário deseja redimensionar ou mudar o gráfico.
function updateChart() {
    // Obtém o título do gráfico a partir de um campo de entrada com o ID 'graph-title'.
    const title = document.getElementById('graph-title').value;
    
    // Obtém o tipo de gráfico selecionado a partir de um campo de seleção com o ID 'chart-type'.
    const chartType = document.getElementById('chart-type').value;
    
    // Obtém os valores dos dados a partir de um campo de entrada com o ID 'data-values',
    // separa os valores em uma lista, e converte cada valor em um número.
    const dataValues = document.getElementById('data-values').value.split(',').map(Number);

    // Se um gráfico já existir (ou seja, se 'chart' não for nulo), destrói a instância existente do gráfico.
    if (chart) {
        chart.destroy();
    }

    // Configuração do gráfico, incluindo tipo, dados e opções de visualização.
    const config = {
        type: chartType,
        data: {
            // Gera rótulos para o gráfico baseados na quantidade de valores de dados.
            labels: Array.from({ length: dataValues.length }, (_, i) => `Ponto ${i + 1}`),
            datasets: [{
                // Os dados que serão utilizados no gráfico.
                data: dataValues,
                // Cores de fundo das barras ou pontos no gráfico.
                backgroundColor: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
                // Cor da borda dos elementos do gráfico.
                borderColor: 'rgba(75, 192, 192, 1)',
                // Largura da borda do gráfico.
                borderWidth: 1
            }]
        },
        options: {
            // Faz com que o gráfico seja responsivo.
            responsive: true,
            // Mantém a proporção do gráfico mesmo quando redimensionado.
            maintainAspectRatio: false,
            plugins: {
                title: {
                    // Define que o título do gráfico será exibido.
                    display: true,
                    // Define o texto do título com base no que o usuário digitou.
                    text: title
                }
            }
        }
    };

    // Cria uma nova instância do gráfico usando a biblioteca Chart.js, passando o contexto e a configuração.
    chart = new Chart(ctx, config);
    
    // Atualiza o texto do elemento com o ID 'chart-status' para indicar que o gráfico foi atualizado com sucesso.
    document.getElementById('chart-status').textContent = 'Gráfico atualizado com sucesso!';
    
    // Chama a função para desenhar as formas no canvas.
    drawShapes();
}

// Função para adicionar um retângulo ao canvas.
// O retângulo é adicionado a um array de formas.
function addRectangle() {
    shapes.push({ type: 'rectangle', x: 50, y: 50, width: 100, height: 50 });
    // Chama a função que desenha as formas após adicionar um novo retângulo.
    drawShapes();
}

// Função para adicionar um círculo ao canvas.
// O círculo é adicionado a um array de formas.
function addCircle() {
    shapes.push({ type: 'circle', x: 300, y: 100, radius: 50 });
    // Chama a função que desenha as formas após adicionar um novo círculo.
    drawShapes();
}

// Função para adicionar texto ao canvas.
// O texto é obtido através de um prompt e armazenado em um array de textos.
function addText() {
    const text = prompt('Digite o texto que deseja adicionar:');
    texts.push({ content: text, x: 100, y: 100 });
    // Chama a função que desenha as formas após adicionar um novo texto.
    drawShapes();
}

// Função que desenha todas as formas e textos armazenados nos arrays.
function drawShapes() {
    // Limpa a área do canvas para preparar para o novo desenho.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Salva o estado atual do contexto do canvas.
    ctx.save();
    // Translada o contexto para o centro do canvas, facilitando a rotação e zoom.
    ctx.translate(canvas.width / 2, canvas.height / 2);
    // Aplica o nível de zoom ao contexto.
    ctx.scale(zoomLevel, zoomLevel);
    // Aplica a rotação ao contexto, convertendo graus para radianos.
    ctx.rotate(rotationAngle * Math.PI / 180);
    // Restaura a posição original do canvas após a transformação.
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Se um gráfico existir, atualiza o gráfico.
    if (chart) {
        chart.update();
    }

    // Desenha todas as formas armazenadas no array 'shapes'.
    shapes.forEach(shape => {
        // Define a cor de preenchimento com base no tipo da forma.
        ctx.fillStyle = shape.type === 'rectangle' ? 'rgba(75, 192, 192, 0.5)' : 'rgba(192, 75, 192, 0.5)';
        ctx.beginPath();
        // Desenha o retângulo ou círculo com base no tipo da forma.
        if (shape.type === 'rectangle') {
            ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === 'circle') {
            ctx.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Desenha todos os textos armazenados no array 'texts'.
    texts.forEach(text => {
        ctx.fillStyle = 'black'; // Define a cor do texto como preto.
        ctx.font = '20px Arial'; // Define a fonte do texto.
        ctx.fillText(text.content, text.x, text.y); // Desenha o texto no canvas nas coordenadas especificadas.
    });

    // Restaura o estado do contexto do canvas ao que era antes das transformações.
    ctx.restore();
}

// Função para aumentar o nível de zoom ao chamar.
function zoomIn() {
    zoomLevel += 0.1; // Aumenta o nível de zoom em 0.1.
    drawShapes(); // Redesenha as formas com o novo nível de zoom.
}

// Função para diminuir o nível de zoom ao chamar.
function zoomOut() {
    // Garante que o nível de zoom não caia abaixo de 0.1.
    zoomLevel = Math.max(0.1, zoomLevel - 0.1);
    drawShapes(); // Redesenha as formas com o novo nível de zoom.
}

// Função para rotacionar as formas no canvas.
function rotateShapes() {
    // Aumenta o ângulo de rotação em 45 graus e garante que permaneça dentro de 0 a 360 graus.
    rotationAngle = (rotationAngle + 45) % 360;
    drawShapes(); // Redesenha as formas após a rotação.
}

// Adiciona um ouvinte de evento ao botão de download.
// Quando o botão é clicado, o gráfico é baixado em um formato de imagem.
document.getElementById('download-btn').addEventListener('click', function() {
    // Obtém o formato selecionado para download a partir de um campo de seleção com o ID 'download-format'.
    const format = document.getElementById('download-format').value;
    
    // Cria um novo elemento de link <a> que será usado para iniciar o download da imagem.
    const link = document.createElement('a');
    
    // Define o href do link como a imagem do canvas convertida para o formato selecionado.
    link.href = canvas.toDataURL(format === 'jpeg' ? 'image/jpeg' : 'image/png');
    
    // Define o nome do arquivo que será baixado com a extensão apropriada.
    link.download = `grafico.${format}`;
    
    
    link.click();
});