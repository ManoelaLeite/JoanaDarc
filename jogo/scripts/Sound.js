const Sound = {
    sound: null,

    init() {
        this.sound = document.getElementById("musica");
            this.sound.muted = false;
            this.sound.autoplay = true; 
            this.sound.load(); 
            this.sound.play().catch((error) => {
                console.log("Autoplay bloqueado pelo navegador:", error);
            });
            setTimeout(() =>{
                this.tocarMusica()
            },15000)

    },

    tocarMusica() {
            this.sound.play();
            setTimeout(() =>{
                this.tocarMusica()
            },10000)
    },

    caminhar(map){
        if (map === "Sonho" || map === "Casa" || map === "Castelo" || map === "fase1"){
            this.efeitoSonoro("Audios/passo_grama.mp3")
        } else if (map === "salaTrono" || map === "fase2" || map === "fase3"){
            this.efeitoSonoro("Audios/passo_pedra.mp3")
        }
    },

    efeitoSonoro(efeitoCaminho) {
        if (efeitoCaminho) {
            const efeito = new Audio(efeitoCaminho); 
            efeito.play().catch((error) => {
                console.error("Erro ao tocar o efeito sonoro:", error);
            });
        } else {
            console.error("Caminho do efeito sonoro não fornecido.");
        }
    },
};


window.addEventListener("load", () => {
    Sound.init();
});
