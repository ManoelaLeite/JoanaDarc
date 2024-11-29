class Sprite {
    constructor(config) {
        // Carregar imagem
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        };
        this.cargo = config.cargo || "npc";

        // Configuração baseada no id do gameObject
        this.setupById(config.gameObject.id);

        // Referencia o objeto do jogo
        this.gameObject = config.gameObject;

        // Animação inicial
        this.currentAnimation = config.currentAnimation || "idle-right";
        this.currentAnimationFrame = 0;
        this.animationFrameProgress = this.animationFrameLimit;
    }

    setupById(id) {
        // Configurações específicas para cada tipo de objeto
        const configurations = {
            heroina: {
                frameWidth: 92,
                frameHeight: 160,
                animations: {     
            //Parados
            "idle-right":  [[0,0], [0.9,0], [1.9,0], [3,0],],
            "idle-left":  [ [7,0], [5.9,0], [5,0], [4,0] ],
            
            //Andando 
            "walk-right": [ [0,1.1], [1,1.1], [2,1.1], [2.85,1.1]],
            "walk-left": [ [7, 1.1], [6,1.1], [5,1.1], [4,1.1]],

            //Agachar e pular
            "squat-right": [ [2.8, 4.3]],//mudar posicão y em tdos daq
            "squat-left": [[4.2,4.3] ],
            "jump-right": [ [0,2.1], [0.9,2.1], [1.9,2.1], [3,2.1]],
            "jump-left": [[7.1,2.1], [6.1,2.1], [5.1,2.1], [4,2.1]],

            //ataque, dano e upgrade 
            "attack-right": [[0.2, 3.28], [1.5, 3.28], [2.8, 3.28], ],
            "attack-left": [[6.8,3.28], [5.5,3.28], [4.2,3.28], ],
            "damage-right": [[0.1, 4.3]],
            "damage-left": [[6.9, 4.3]],
            "upgrade": [[1.5,4.3]],
            
                },
            },
            anjo: {
                frameWidth: 400,
                frameHeight: 400,
                animations: {
                    "idle-right": [[0, 0], [1.1, 0], [0, 0.9], [1.1, 0.9],],
                },
            },

                Samos:{
                    frameWidth: 92,
                    frameHeight: 160,
                    animations: {     
                //Parados
                "idle-right":  [ [5.8, 1.1], [6.85,1.1], ],
            
                //Andando 
                "walk-left": [ [5.8, 1.1], [6.85,1.1] ],
                },
            },


            Aphonsos:{
                frameWidth: 92,
                frameHeight: 160,
                animations: {     
                    //Parados
                    "idle-right":  [[2.13,1.1], [3.13,1.1], ],
        
                    //Andando 
                    "walk-right": [ [0,1.1], [1,1.1], [2,1.1], [2.85,1.1]],
                },
            },

            Rei:{
                frameWidth: 92,
                frameHeight: 160,
                animations: {     
                    //Parados
                    "idle-right":  [[7,0], [5.9,0], [5,0], [4,0] ],
                },
            },

            inimigos: {
                    frameWidth: 92,
                    frameHeight: 160,
                    animations: {     
                //Parados
                "idle-right":  [[0,0], [0.9,0], [1.9,0], [3,0],],
                "idle-left":  [ [7,0], [5.9,0], [5,0], [4,0] ],
                
                //Andando 
                "walk-right": [ [0,1.1], [1,1.1], [2,1.1], [2.85,1.1]],
                "walk-left": [ [7, 1.1], [6,1.1], [5,1.1], [4,1.1]],
    
                "damage-right": [[0.1, 3.2]],
                "damage-left": [[6.88, 3.2]],

                "dye-left":[[5.5, 3.2], [4,3.25]],
                "dye-right":[[1.5, 3.2], [3, 3.25]],

                "died-left":[[10,10]],
                "died-right": [[10,10]],
                    },
            },

            // Configuração padrão para IDs desconhecidos
            default: {
                frameWidth: 92,
                frameHeight: 160,
                animations: {
                    //Parados
                "idle-right":  [[0,0], [0.9,0], [1.9,0], [3,0],],
                "idle-left":  [ [7,0], [5.9,0], [5,0], [4,0] ],
            
                //Andando 
                "walk-right": [ [0,1.1], [1,1.1], [2,1.1], [2.85,1.1]],
                "walk-left": [ [7, 1.1], [6,1.1], [5,1.1], [4,1.1]],
                },
            },
        };
    
        // configurações específicas ou fallback para "default"
        const config = configurations[id] || configurations["default"];
        this.frameWidth = config.frameWidth;
        this.frameHeight = config.frameHeight;
        this.animations = config.animations;
        this.animationFrameLimit = config.animationFrameLimit || 8;
    }
    
    get frame() {
         return this.animations[this.currentAnimation][this.currentAnimationFrame]
    }

    setAnimation(key) {
        if (this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgres() {
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;

        if (this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }
    }

    draw(ctx, cameraPerson) {
        const x = this.gameObject.x - 8 + utils.withGrid(27) - cameraPerson.x;
        const y = this.gameObject.y - 8 + utils.withGrid(21.5) - cameraPerson.y;

        const [frameX, frameY] = this.frame;

        this.isLoaded &&
            ctx.drawImage(
                this.image,
                frameX * this.frameWidth, 
                frameY * this.frameHeight,
                this.frameWidth,
                this.frameHeight,
                x,
                y,
                this.frameWidth,
                this.frameHeight
            );
        this.updateAnimationProgres();
    }
}
