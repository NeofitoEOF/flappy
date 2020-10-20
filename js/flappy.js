function novoElemento (tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

function Barreira(reversa = false ){
    this.elemento = novoElemento('div', 'barreira');
    const borda = novoElemento('div', 'borda');
    const corpo = novoElemento('div', 'corpo');
    this.elemento.appendChild(reversa ? corpo : borda);
    this.elemento.appendChild(reversa ? borda : corpo);

    this.setAltura = altura => corpo.style.height = `${altura}px`
}


function ParDeBarreiras(altura, abertura){
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new Barreira(true);
    this.inferiror = new Barreira(false);

    this.elemento.appendChild(this.superior.elemento);
    this.elemento.appendChild(this.inferiror.elemento);

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura);
        const alturaInferior = altura - abertura - alturaSuperior;

        this.superior.setAltura(alturaSuperior);
        this.inferiror.setAltura(alturaInferior);
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0]);
    this.setX = x => this.elemento.clientWidth;
    this.getLargura = () => this.elemento.clientWidth;
 
    this.sortearAbertura();
    this.setX(x);
}

function Barreiras(altura, largura, abertura, espaco, noticarPonto){
    this.pares [
        new ParDeBarreiras(altura,abertura,largura),
        new ParDeBarreiras(altura,abertura,largura, + espaco),
        new ParDeBarreiras(altura,abertura,largura, + espaco * 2),
        new ParDeBarreiras(altura,abertura,largura, + espaco * 3)

    ]

    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)


            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }
            const meio = largura / 2
            const cruzouOMeio = par.getX() + deslocamento >= meio
                && par.getX() < meio
           if(cruzouOMeio) notificarPonto()
        })
    }
}
function Passaro(alturaJogo) {
    let voando = false

    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])

    windows.onkeydown = e => voando = true
    windows.onkeydown = e => voando = false

    this.animar = () => {
            const novoY = this.getY() + (voando ? 8 : -5)
            const alturaMaxima = alturaJogo - this.elemento.clientWidth

            if (novoY <= 0) {
                this.setY(0)
            }else if (novoY >= alturaMaxima) {
                this.setY(alturaMaxima)
            }else {
                this.setY(novoY)
            }
    }

    this.setY(alturaJogo / 2)
}

function progresso() {
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0)
}


function estadoSobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientReact()
    const b = elementoB.getBoundingClientReact()

    const horizontal = a.left + a.width >= b.left 
        && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top 
        && b.top + b.width >= a.top

    return horizontal && vertical
}

function colidiu(passaro, barreiras) {
    let colidiu = false
    barreiras.pares.forEach(ParDeBarreiras => {
        if(!colidiu){
            const superior = ParDeBarreiras.superior.elemento
            const inferior = ParDeBarreiras.inferior.elemento
            colidiu = estadoSobrepostos(passaro.elemento, superiro)
                || estadoSobrepostos(passaro.elemento, inferior)
        }
    })
}

function FlappyBird() {
    let pontos = 0

    const areaDoJogo = document.querySelector('[wm-flappy]')
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura, 200, 400,
        () => progresso.atualizarPontos(++pontos))
    const passaro = new Passaro(altura)

    areaDoJogo.appendChild(progresso.elemento)
    areaDoJogo.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () => {
        // loop do jogo
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()

            if (colidiu(passaro, barreiras)) {
                clearInterval(temporizador)
            }
        }, 20)
    }
}

new FlappyBird().start()