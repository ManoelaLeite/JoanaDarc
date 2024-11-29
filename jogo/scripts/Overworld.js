class Overworld{
    constructor(config){
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d"); //ctx == Context == Contexto, conteúdo do Canvas
        this.map = null;
    }
   

    startGameLoop(){
        const step = () => {

            //Limpar o Canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);


            //Estabilizar a camera em relação da mana Joanna
            const cameraPerson = this.map.gameObjects.heroina;

            //Atualiza tdos os objetos
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map,    
                })
            });

            //Desenhar camada de baixo
            this.map.drawLowerImage(this.ctx, cameraPerson);

            //Desenhar os objetos do jogo
            Object.values(this.map.gameObjects).sort((a,b) => {
                return a.y - b.y;
            }).forEach(object => {
               
                object.sprite.draw(this.ctx, cameraPerson)
            })

            //Desenhar camada de cima
            this.map.drawUpperImage(this.ctx, cameraPerson);

            requestAnimationFrame(() => {
                step();
            }) 
        }
        step();
    }

    bindActionInput() {
        new KeyPressListener("Enter", () => {
            //tem alguem para conversar?
            this.map.checkForActionCutscene();
        })

        new KeyPressListener("KeyF", () => {
            //tem alguem para bater?
            this.map.checkForHitAction();
        })
    };

    
    bindHeroPositionCheck(){
        document.addEventListener("PersonWalkingComplete", e => {
            if (e.detail.whoId === "heroina"){
            //A posição da mana Joana mudou. será que tem cutscine????
            this.map.checkForFootstepCutscene();
            this.map.checkDamage()
            
            } 
        })
    };

    startMap(mapConfig){
        
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();   
    }

    init () {
        this.startMap(window.OverworldMaps.Sonho);
        

        const hudContainer = document.getElementById("hud-container");
        BattleSystem.initHud(hudContainer);

        this.bindActionInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();
        
        this.startGameLoop();

         this.map.startCutscene([
            {who: "heroina", type: "stand", direction: "left", time: 300},
            {type: "textMessage", text: "Joana d'Arc: ???"},
            {type: "textMessage", text: "Joana d'Arc: Onde eu estou???"},
            {type: "textMessage", text: "Joana d'Arc: Que lugar é esse?"},
            {who: "heroina", type: "stand", direction: "right", time: 500},
            {type: "textMessage", text: "Joana d'Arc: !!"},
            {type: "textMessage", text: "Joana d'Arc: Isso é um..?"},
            {type: "textMessage", text: "Precione AWSD ou as setas + espaço para se mover"},

         ])

    }
}