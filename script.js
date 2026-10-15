// Calabouço dos Números — jogo educativo de matemática para o 6º ano.
// As perguntas são geradas dentro de conteúdos básicos: operações, dobro/metade,
// comparação de números e problemas curtos.

const telaInicial = document.querySelector("#tela-inicial");
const telaJogo = document.querySelector("#tela-jogo");
const telaFinal = document.querySelector("#tela-final");

const botaoComecar = document.querySelector("#botao-comecar");
const botaoSair = document.querySelector("#botao-sair");
const botaoContinuar = document.querySelector("#botao-continuar");
const botaoReiniciar = document.querySelector("#botao-reiniciar");
const botaoInicioFinal = document.querySelector("#botao-inicio-final");

const textoAndar = document.querySelector("#texto-andar");
const textoPontos = document.querySelector("#texto-pontos");
const textoVidas = document.querySelector("#texto-vidas");
const textoEstrelas = document.querySelector("#texto-estrelas");
const textoSalas = document.querySelector("#texto-salas");
const progresso = document.querySelector("#progresso");
const mensagemMago = document.querySelector("#mensagem-mago");
const categoria = document.querySelector("#categoria");
const perguntaElemento = document.querySelector("#pergunta");
const opcoesElemento = document.querySelector("#opcoes");
const retorno = document.querySelector("#retorno");

const TOTAL_SALAS = 10;
const VIDAS_INICIAIS = 3;

let salaAtual = 0;
let vidas = VIDAS_INICIAIS;
let estrelas = 0;
let acertos = 0;
let perguntaAtual = null;
let respondida = false;

function numeroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function criarOpcoes(respostaCorreta) {
  const valores = new Set([respostaCorreta]);
  while (valores.size < 4) {
    const variacao = numeroAleatorio(-10, 10);
    const alternativa = respostaCorreta + (variacao === 0 ? 3 : variacao);
    if (alternativa >= 0 && alternativa !== respostaCorreta) valores.add(alternativa);
  }
  return embaralhar([...valores]);
}

function gerarPergunta() {
  const tipo = numeroAleatorio(1, 6);
  let texto = "";
  let resposta = 0;
  let tema = "🧮 CONTAS DO CALABOUÇO";

  switch (tipo) {
    case 1: {
      const a = numeroAleatorio(10, 90);
      const b = numeroAleatorio(1, 50);
      texto = `Quanto é ${a} + ${b}?`;
      resposta = a + b;
      break;
    }
    case 2: {
      const a = numeroAleatorio(30, 100);
      const b = numeroAleatorio(1, a);
      texto = `Quanto é ${a} − ${b}?`;
      resposta = a - b;
      break;
    }
    case 3: {
      const a = numeroAleatorio(2, 10);
      const b = numeroAleatorio(2, 10);
      texto = `Quanto é ${a} × ${b}?`;
      resposta = a * b;
      break;
    }
    case 4: {
      const divisor = numeroAleatorio(2, 10);
      const respostaDivisao = numeroAleatorio(2, 10);
      const dividendo = divisor * respostaDivisao;
      texto = `Quanto é ${dividendo} ÷ ${divisor}?`;
      resposta = respostaDivisao;
      break;
    }
    case 5: {
      const n = numeroAleatorio(3, 30);
      texto = `Qual é o dobro de ${n}?`;
      resposta = n * 2;
      tema = "✨ DESAFIO DO DOBRO";
      break;
    }
    default: {
      const n = numeroAleatorio(10, 80);
      const metade = n * 2;
      texto = `Qual é a metade de ${metade}?`;
      resposta = n;
      tema = "🌙 DESAFIO DA METADE";
      break;
    }
  }

  // Deixa as alternativas em uma faixa possível para o nível escolar.
  return { texto, resposta, tema, opcoes: criarOpcoes(resposta) };
}

function mostrarTela(telaEscolhida) {
  [telaInicial, telaJogo, telaFinal].forEach((tela) => tela.classList.add("escondido"));
  telaEscolhida.classList.remove("escondido");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function atualizarEstatisticas() {
  textoAndar.textContent = `Sala ${Math.min(salaAtual + 1, TOTAL_SALAS)} de ${TOTAL_SALAS}`;
  textoPontos.textContent = `⭐ ${estrelas}`;
  textoVidas.textContent = vidas;
  textoEstrelas.textContent = estrelas;
  textoSalas.textContent = `${salaAtual}/${TOTAL_SALAS}`;
  progresso.style.width = `${(salaAtual / TOTAL_SALAS) * 100}%`;
}

function iniciarJogo() {
  salaAtual = 0;
  vidas = VIDAS_INICIAIS;
  estrelas = 0;
  acertos = 0;
  mostrarTela(telaJogo);
  carregarPergunta();
}

function carregarPergunta() {
  if (vidas <= 0 || salaAtual >= TOTAL_SALAS) {
    finalizarJogo();
    return;
  }

  respondida = false;
  perguntaAtual = gerarPergunta();
  categoria.textContent = perguntaAtual.tema;
  perguntaElemento.textContent = perguntaAtual.texto;
  mensagemMago.textContent = salaAtual === 0
    ? "A primeira porta está trancada. Resolva a conta para abri-la!"
    : "Muito bem! Mais uma sala espera por você. Vamos nessa!";
  retorno.textContent = "";
  retorno.className = "retorno";
  botaoContinuar.classList.add("escondido");
  opcoesElemento.innerHTML = "";

  perguntaAtual.opcoes.forEach((opcao) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "opcao";
    botao.textContent = opcao;
    botao.setAttribute("aria-label", `Responder ${opcao}`);
    botao.addEventListener("click", () => verificarResposta(opcao, botao));
    opcoesElemento.appendChild(botao);
  });

  atualizarEstatisticas();
}

function verificarResposta(escolha, botaoEscolhido) {
  if (respondida) return;
  respondida = true;

  const botoes = [...opcoesElemento.querySelectorAll("button")];
  botoes.forEach((botao) => {
    botao.disabled = true;
    if (Number(botao.textContent) === perguntaAtual.resposta) {
      botao.classList.add("correta");
    }
  });

  if (escolha === perguntaAtual.resposta) {
    acertos++;
    estrelas += 10;
    retorno.textContent = "✨ Isso aí! Resposta correta. Você ganhou 10 estrelas!";
    retorno.classList.add("bom");
    mensagemMago.textContent = "Mandou bem, aprendiz! A magia da matemática está funcionando.";
  } else {
    vidas--;
    botaoEscolhido.classList.add("errada");
    retorno.textContent = `Quase! A resposta correta é ${perguntaAtual.resposta}. Tente novamente na próxima sala!`;
    retorno.classList.add("ruim");
    mensagemMago.textContent = "Não desanime! Errar faz parte de aprender.";
  }

  salaAtual++;
  atualizarEstatisticas();
  progresso.style.width = `${(salaAtual / TOTAL_SALAS) * 100}%`;
  botaoContinuar.textContent = (vidas <= 0 || salaAtual >= TOTAL_SALAS)
    ? "Ver resultado 🏆"
    : "Próxima sala ➜";
  botaoContinuar.classList.remove("escondido");
}

function finalizarJogo() {
  mostrarTela(telaFinal);
  document.querySelector("#resultado-pontos").textContent = estrelas;
  document.querySelector("#resultado-acertos").textContent = `${acertos}/${salaAtual}`;

  const venceu = vidas > 0 && salaAtual >= TOTAL_SALAS;
  document.querySelector("#icone-final").textContent = venceu ? "🏆" : "🧙";
  document.querySelector("#titulo-final").textContent = venceu ? "Calabouço conquistado!" : "A aventura continua!";
  document.querySelector("#mensagem-final").textContent = venceu
    ? "Você atravessou todas as salas e ajudou o Mago Nino!"
    : "Suas vidas acabaram, mas você pode tentar outra vez e aprender ainda mais.";
  document.querySelector("#dica-final").textContent = acertos >= 8
    ? "🌟 Mandou muito bem! Continue praticando para virar um mestre dos números."
    : "💡 Dica do mago: pratique as operações básicas e tente novamente. Cada tentativa ajuda você a aprender!";
}

botaoComecar.addEventListener("click", iniciarJogo);
botaoReiniciar.addEventListener("click", iniciarJogo);
botaoSair.addEventListener("click", () => mostrarTela(telaInicial));
botaoInicioFinal.addEventListener("click", () => mostrarTela(telaInicial));
botaoContinuar.addEventListener("click", () => {
  if (vidas <= 0 || salaAtual >= TOTAL_SALAS) finalizarJogo();
  else carregarPergunta();
});

// Início: a tela inicial é exibida e o jogo só começa após o clique do jogador.
