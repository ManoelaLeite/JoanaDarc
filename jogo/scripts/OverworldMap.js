class OverworldMap {
    constructor(config) {
      this.overworld = null;
      this.gameObjects = config.gameObjects;
      this.cutsceneSpaces = config.cutsceneSpaces || {};
      this.walls = config.walls || {};
      this.mapa = config.mapa || "Defalt"
      
  
      this.lowerImage = new Image();
      this.lowerImage.src = config.lowerSrc;
  
      this.upperImage = new Image();
      this.upperImage.src = config.upperSrc;

      this.isCutscenePlaying = false;
    }
  
    drawLowerImage(ctx, cameraPerson) {
        ctx.drawImage(
            this.lowerImage,  
            utils.withGrid(27) - cameraPerson.x, 
            utils.withGrid(21.5) - cameraPerson.y
            
        )
    }
    
  
    drawUpperImage(ctx, cameraPerson) {
      ctx.drawImage(
        this.upperImage, 
        utils.withGrid(27) - cameraPerson.x, 
        utils.withGrid(21.5) - cameraPerson.y
        )
    } 
 
    isSpaceTaken(currentX, currentY, direction){
        const {x,y} = utils.nextPositionSpace(currentX, currentY, direction);
        
        if(this.walls[`${x},${y}`] && this.walls[`${x},${y}`][0]){
            return true;
        } else{
        return this.walls[`${x},${y}`] || false;
        }
        
    }

    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {

            let object = this.gameObjects[key];
            object.id = key;
      
            //Todo: determine if this object should actually mount
            object.mount(this);
      
        })
    }

    checkForHitAction(){
        const heroina = this.gameObjects["heroina"];
        let obj;
        const MaxCoords = utils.nextPositionHit(heroina.x, heroina.y,heroina.direction);
        const MinCoords = utils.nextPosition(heroina.x, heroina.y,heroina.direction);

        const match = Object.values(this.gameObjects).find(object => {

               if (object !== heroina){
                if (BattleSystem.verifyOBJ(object, MaxCoords, MinCoords) && BattleSystem.verifyId(object)){
                    obj = object
                    return true;
                } else {
                    return false
                }
               }else{
                return false
               }
            
        });
        
        if(!this.isCutscenePlaying){
          if (match){
            BattleSystem.hit(heroina, obj, heroina.id);

          } else {
           Sound.efeitoSonoro("Audios/woosh.wav")
          }
        }
        
    }


    checkForActionCutscene(){
        const heroina = this.gameObjects["heroina"];
        
        const nextCoords = utils.nextPosition(heroina.x, heroina.y,heroina.direction);
        
        const match = Object.values(this.gameObjects).find(object => {
        
            return `${object.x}` === `${nextCoords.x}`;
            
        });
        if(!this.isCutscenePlaying && match && match.talking.length){
            this.startCutscene(match.talking[0].events)
        }
    }
    
    checkForFootstepCutscene() {
        const heroina = this.gameObjects["heroina"];


        const match = this.cutsceneSpaces[`${heroina.x},${heroina.y}`];
        
        Sound.caminhar(this.mapa)
        this.checkDamage()
        if (!this.isCutscenePlaying && match) {
            this.startCutscene(match[0].events);
        }
    }

    checkDamage() {
        const heroina = this.gameObjects["heroina"];
        let obj = null;
    
        const MaxCoords = utils.nextPositionDamage(heroina.x, heroina.y, heroina.direction);
        const MinCoords = utils.nextPosition(heroina.x, heroina.y, heroina.direction);
    

    
        const dano = Object.values(this.gameObjects).find(object => {
            if (object !== heroina){
                if (BattleSystem.verifyOBJ(object, MaxCoords, MinCoords) && BattleSystem.verifyId(object)){
                    obj = object
                    return true;
                } else {
                    return false
                }
               }else{
                return false
               }
        });
    
        if (dano) {
            obj = dano;
            
            if (!this.isCutscenePlaying) {
                BattleSystem.hit(heroina, obj, obj.id);
    
               
                setTimeout(() => {
                    this.checkDamage();
                }, 20);
            }
        }
    }
    
    
    async startCutscene(events){
        this.isCutscenePlaying = true;

        //começar loop dos eventos async
        //esperar cada um

        for (let i=0; i<events.length; i++){
            
            const eventHandler = new OverworldEvent({
                event: events[i],
                map:this,
            })
            await eventHandler.init();
        }
        
        this.isCutscenePlaying = false;

        //Resetar NPC pra eles voltarem ao comportamento padrão
        Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))


    }
    
  }



window.OverworldMaps = {
//Escrever nomes dos possíveis mapas, qualquer coisa muda dps
    
    Sonho: {
        mapa: "Sonho",
        lowerSrc: "imgs/Fundo/sonhoMap.png",
        upperSrc: "imgs/Fundo/Nada.png",
        gameObjects: { 

            heroina: new Person({
                id: "heroina",
                isPlayerControlled: true,
                x: utils.withGrid(17),
                y: utils.withGrid(21),
            }),
            anjo: new Person({
                id: "anjo",
                
                x: utils.withGrid(36),
                y: utils.withGrid(10),
                src: "imgs/Personagens/anjo.png",
             }),
        },

        walls:{
                [utils.asGridCoord(16, 21)]: true,
             
                [utils.asGridCoord(36, 21)]: true,
        

            },

        cutsceneSpaces:{
            [utils.asGridCoord(35, 21)]: [
                {
                    events:[
                        {who: "heroina", type: "stand", direction: "right", time: 20},
                        {type: "textMessage", text: "Anjo: Joana, filha de Deus, escuta-me. Tu foste escolhida para uma missão divina."},
                        {type: "textMessage", text: "Joana d'Arc: Escolhida? Mas por quê? "},
                        {type: "textMessage", text: "Anjo: A França está perdida, afundada na guerra e no desespero. És tu quem levará esperança ao teu povo. "},
                        {type: "textMessage", text: "Joana d'Arc: Eu... liderar um exército? Não sou guerreira, não sou nobre. Como posso fazer isso? "},
                        {type: "textMessage", text: "Anjo: Não será pela força de tuas mãos, mas pela força de tua fé. Deus estará contigo em cada passo."}, 
                        {type: "textMessage", text: "Anjo: Procure Carlos, o Delfim. Convence-o de tua missão e guia o exército para libertar Orleans."},
                        {type: "textMessage", text: "Joana d'Arc: Se essa é a vontade de Deus, obedecerei."},
                        {type: "changeMap", map: "Casa"},
                        {who: "heroina", type: "stand", direction: "right", time: 500},
                        {type: "textMessage", text: "Preciso ir até o castelo..."},
                    ]    
                }
            ], 

        },
            
            
    },

    Casa: {
        mapa: "Casa",
        lowerSrc: "imgs/Fundo/casamap.png",
        upperSrc: "imgs/Fundo/Nada.png",
        gameObjects: { 
            heroina: new Person({
                id: "heroina",
                isPlayerControlled: true,
                x: utils.withGrid(17),
                y: utils.withGrid(21),
            }),
        },

        walls:{
            [utils.asGridCoord(16, 21)]: true,
         
            [utils.asGridCoord(36, 21)]: true,
    

        },

        cutsceneSpaces:{
            [utils.asGridCoord(35, 21)]: [
                {
                    events:[
                        {type: "changeMap", map: "Castelo"},
                    ]    
                }
            ],
        }
    },

    Castelo: {
        mapa: "Castelo",
        lowerSrc: "imgs/Fundo/outsideCastle.png",
        upperSrc: "imgs/Fundo/Nada.png",
        gameObjects: { 

            Guarda1: new Person({ //alterar o nominho tbm kkkk
                id: "Samos",
                x: utils.withGrid(21),
                y: utils.withGrid(23),
                //Alterar pro npc dps
                src: "imgs/Personagens/Diversos.png",
            
            }),

            Guarda2: new Person({ //alterar o nominho tbm kkkk
                id: "Aphonsos",
                x: utils.withGrid(27),
                y: utils.withGrid(23),
                //Alterar pro npc dps
                src: "imgs/Personagens/Diversos.png",

        //         talking: [{
        //             events:[
        //                {type: "textMessage", text: "Joana d'Arc: Eae seu guarda"},
        //                {type: "textMessage", text: "Aphonsos: ..."},
        //                {type: "textMessage", text: "Joana d'Arc: Seu guarda?"},
        //                {type: "textMessage", text: "Aphonsos: ZzZzZzZz..."},
        //                {type: "textMessage", text: "Joana d'Arc: ;-;"},
        //             ]
        //         },
        //    // adicionar mais eventos se ele for falar coisas diferentes em determinadas situações
        //     ]

            }),
            
            heroina: new Person({
                id: "heroina",
                isPlayerControlled: true,
                x: utils.withGrid(17),
                y: utils.withGrid(23),
            }),
        },

            walls:{
                [utils.asGridCoord(16, 21)]: true,
                [utils.asGridCoord(16, 23)]: true,
             
                [utils.asGridCoord(40, 21)]: true,
                [utils.asGridCoord(40, 23)]: true,
        

            },

        
        cutsceneSpaces:{
            [utils.asGridCoord(19,23)]: [
                {
                    events:[
                        {who: "heroina", type: "stand", direction: "right", time: 20},
                        {type: "textMessage", text: "Pare aí, camponesa. Este não é lugar para o seu tipo."},
                        {type: "textMessage", text: "Joana d'Arc: Eu vim por ordem divina. Tenho uma mensagem para o Delfim, enviada por nosso Senhor."},
                        {type: "textMessage", text: "Antoine: 'Mensagem divina'? E eu sou o Papa. Volte para casa antes que se arrependa de estar aqui."},
                        {type: "textMessage", text: "Joana d'Arc: Vocês podem rir de mim, mas sabem no fundo que a França está à beira do abismo."},
                        {type: "textMessage", text: "Joana d'Arc: E sabem também que ele precisa de ajuda. Eu não estou aqui por mim, mas pelo povo e pela vontade de Deus. "},
                        {type: "textMessage", text: "Antoine: Hum, não sei não. O que você acha, Aphonsos? "},
                        {type: "textMessage", text: "Aphonsos: . . ."},
                        {type: "textMessage", text: "Antoine: Aphonsos? "},
                        {type: "textMessage", text: "Aphonsos: ZzZzZzZzZzZzZzZzZ..."},
                        {type: "textMessage", text: "Antoine: Urgh, esquece. Como sabemos que você não é uma espiã, garota? "},
                        {type: "textMessage", text: "Joana d'Arc: Eu sou Joana, filha de camponeses de Domrémy.  Não tenho riquezas, só trago minha fé."},
                        {type: "textMessage", text: "Joana d'Arc: O Delfim deve me ouvir, pois o que eu trago pode salvar não só ele, mas toda a França."},
                        {type: "textMessage", text: "Antoine: Entre, mas se tudo isso for uma farsa, será sua cabeça que pagará. "},
                        {who:"Guarda1", type: "walk", direction: "left"},
                        {who:"Guarda1", type: "walk", direction: "left"},
                        {who:"heroina", type: "walk", direction: "right"},
                        {who: "heroina", type: "stand", direction: "right", time: 50},
                        {type: "changeMap", map: "salaTrono"},
                    ]    
                }
            ], 
        }
    },

    salaTrono: {
        mapa: "salaTrono",
        lowerSrc: "imgs/Fundo/insideMap.png",
        upperSrc: "imgs/Fundo/Nada.png",
        gameObjects: { 
            heroina: new Person({
                id: "heroina",
                isPlayerControlled: true,
                x: utils.withGrid(17),
                y: utils.withGrid(21),
            }),
            rei: new Person({
                id: "Rei",
                x: utils.withGrid(50),
                y: utils.withGrid(21),
                //Alterar pro npc dps
                src: "imgs/Personagens/Diversos.png",

            })
        },

        walls:{
            [utils.asGridCoord(16, 21)]: true,
         
            [utils.asGridCoord(38, 21)]: true,
    

        },

        cutsceneSpaces:{
            [utils.asGridCoord(37, 21)]: [
                {
                    events:[
                        {who: "heroina", type: "stand", direction: "right", time: 100},
                        {type: "textMessage", text: "Carlos:  Então você é a jovem que diz ser enviada por Deus. O que quer de mim?"},
                        {type: "textMessage", text: "Joana d'Arc: Eu fui chamada para salvar a França, e você, Senhor, é o único que pode dar o passo que a nação precisa. "},
                        {type: "textMessage", text: "Carlos: Salvar a França? Quem é você para ousar falar de tais coisas?"},
                        {type: "textMessage", text: "Joana d'Arc: Eu sou apenas uma serva de Deus. Mas Deus escolheu você, Senhor."},
                        {type: "textMessage", text: "Joana d'Arc: Você foi ungido para reinar, e é por isso que deve ser coroado."},
                        {type: "textMessage", text: "Carlos: E como você pretende fazer isso? A França está dividida, e nossos inimigos são fortes."},
                        {type: "textMessage", text: "Carlos: Não temos poder para mudar o curso da guerra. "},
                        {type: "textMessage", text: "Joana d'Arc: Deus já nos deu a vitória, mas precisamos agir. Eu irei a Orleans, e com a graça divina, a cidade será libertada."},
                        {type: "textMessage", text: "Joana d'Arc:  Depois, o caminho estará aberto para sua coroação."},
                        {type: "textMessage", text: "Carlos: E por que devemos confiar em você, uma jovem sem experiência militar, sem título?"},
                        {type: "textMessage", text: "Joana d'Arc:  Eu não sou militar, mas o exército de Deus me guiará. Se você acreditar, a França será salva. Mas se duvidar, perderemos tudo."},
                        {type: "textMessage", text: "Carlos: Muito bem, Joana. Eu vou acreditar em você... por agora. Mas prove que sua fé é real, e você terá meu apoio. "},
                        {type: "textMessage", text: "Carlos: Não falharei, Senhor. Deus está conosco"},
                        {type: "changeMap", map: "fase1"},
                        {type: "textMessage", text: "Precione a tecla F para bater"},
                    ]    
                }
            ], 

        },
    },

    fase1: {
        mapa: "fase1",
        lowerSrc: "imgs/Fundo/fase1map.png",
        upperSrc: "imgs/Fundo/Nada.png",
        gameObjects: { 
           
            // guarda1: new Person({
            //     id: "inimigos",
            //     x: utils.withGrid(29),
            //     y: utils.withGrid(21),
            //     src: "imgs/Personagens/inimigoA.png",
            // }),

            guarda2: new Person({
                id: "inimigos",
                x: utils.withGrid(58),
                y: utils.withGrid(21),
                src: "imgs/Personagens/inimigoA.png",
            }),

            guarda3: new Person({
                id: "inimigos",
                x: utils.withGrid(29),
                y: utils.withGrid(21),
                src: "imgs/Personagens/inimigoA.png",
            }),
            

            guarda4: new Person({
                id: "inimigos",
                x: utils.withGrid(86),
                y: utils.withGrid(21),
                src: "imgs/Personagens/inimigoA.png",
            }),

            heroina: new Person({
                id: "heroina",
                isPlayerControlled: true,
                x: utils.withGrid(17),
                y: utils.withGrid(21),
            }),
        },

        walls:{
            [utils.asGridCoord(16,5, 21)]: true,
            [utils.asGridCoord(16, 21)]: true,
            [utils.asGridCoord(17.5, 21)]: true,
            [utils.asGridCoord(17, 21)]: true,
         
            [utils.asGridCoord(98, 21)]: true,
            [utils.asGridCoord(98.5, 21)]: true,
            [utils.asGridCoord(99, 21)]: true,

    

        },

        cutsceneSpaces:{
            [utils.asGridCoord(97, 21)]: [
                {
                    events:[
                        {type: "changeMap", map: "fase2"},
                    ]    
                }
            ], 
            [utils.asGridCoord(97.5, 21)]: [
                {
                    events:[
                        {type: "changeMap", map: "fase2"},
                    ]    
                }
            ], 
            [utils.asGridCoord(98, 21)]: [
                {
                    events:[
                        {type: "changeMap", map: "fase2"},
                    ]    
                }
            ], 
        },
    },

    fase2: {
        mapa: "fase2",
        lowerSrc: "imgs/Fundo/fase2map.png",
        upperSrc: "imgs/Fundo/Nada.png",
        gameObjects: { 
            heroina: new Person({
                id: "heroina",
                isPlayerControlled: true,
                x: utils.withGrid(17),
                y: utils.withGrid(21),
            }),
           guarda1: new Person({
                id: "inimigos",
                x: utils.withGrid(32),
                y: utils.withGrid(21),
                src: "imgs/Personagens/inimigoA.png",
            }),

            guarda2: new Person({
                id: "inimigos",
                x: utils.withGrid(54),
                y: utils.withGrid(21),
                src: "imgs/Personagens/inimigoA.png",
            }),

            guarda3: new Person({
                id: "inimigos",
                x:  utils.withGrid(76),
                y:  utils.withGrid(21),
                src: "imgs/Personagens/inimigoA.png",
            }),

            guarda4: new Person({
                id: "inimigos",
                x: utils.withGrid(98),
                y: utils.withGrid(21),
                src: "imgs/Personagens/inimigoA.png",
            }),

            guarda5: new Person({
                id: "inimigos",
                x: utils.withGrid(120),
                y: utils.withGrid(21),
                src: "imgs/Personagens/inimigoA.png"
            }),

            guarda6: new Person({
                id: "inimigos",
                x: utils.withGrid(142),
                y: utils.withGrid(21),
                src: "imgs/Personagens/inimigoA.png"
            }),

            
        },

        walls:{
            [utils.asGridCoord(16, 21)]: true,
            [utils.asGridCoord(17.5, 21)]: true,
            [utils.asGridCoord(17, 21)]: true,
         
            [utils.asGridCoord(158, 21)]: true,
            [utils.asGridCoord(158.5, 21)]: true,
            [utils.asGridCoord(159, 21)]: true,
    

        },

         cutsceneSpaces:{
             [utils.asGridCoord(157, 21)]: [
                {
                    events:[
                         {type: "changeMap", map: "fase3"},
                     ]    
                 }
             ], 
             [utils.asGridCoord(157.5, 21)]: [
                {
                    events:[
                         {type: "changeMap", map: "fase3"},
                     ]    
                 }
             ], 
             [utils.asGridCoord(158, 21)]: [
                {
                    events:[
                         {type: "changeMap", map: "fase3"},
                     ]    
                 }
             ], 

         },
    },

    fase3: {
        mapa: "fase3",
        lowerSrc: "imgs/Fundo/fase3map.png",
        upperSrc: "imgs/Fundo/Nada.png",
        gameObjects: { 
            heroina: new Person({
                id: "heroina",
                isPlayerControlled: true,
                x: utils.withGrid(17),
                y: utils.withGrid(21),
            }),
            
            guarda1: new Person({
                id: "inimigos",
                x: utils.withGrid(34),
                y: utils.withGrid(21),
                src: "imgs/Personagens/inimigoA.png",
            }),

            guarda2: new Person({
                id: "inimigos",
                x: utils.withGrid(57),
                y: utils.withGrid(21),
                src: "imgs/Personagens/inimigoA.png"
            }),

            guarda3: new Person({
                id: "inimigos",
                x: utils.withGrid(80),
                y: utils.withGrid(21),
                src: "imgs/Personagens/inimigoA.png"
            }),

            guarda4: new Person({
                id: "inimigos",
                x: utils.withGrid(103),
                y: utils.withGrid(21),
                src: "imgs/Personagens/inimigoA.png",
            }),

            guarda5: new Person({
                id: "inimigos",
                x: utils.withGrid(126),
                y: utils.withGrid(21),
                src: "imgs/Personagens/inimigoA.png"
            }),

            guarda6: new Person({
                id: "inimigos",
                x: utils.withGrid(149),
                y: utils.withGrid(21),
                src: "imgs/Personagens/inimigoA.png"
            }),

            guarda7: new Person({
                id: "inimigos",
                x: utils.withGrid(172),
                y: utils.withGrid(21),
                src: "imgs/Personagens/inimigoA.png",
            }),

            guarda8: new Person({
                id: "inimigos",
                x: utils.withGrid(195),
                y: utils.withGrid(21),
                src: "imgs/Personagens/inimigoA.png"
            }),

        },

        walls:{
            [utils.asGridCoord(16, 21)]: true,
            [utils.asGridCoord(17.5, 21)]: true,
            [utils.asGridCoord(17, 21)]: true,
         
            [utils.asGridCoord(218, 21)]: true,
            [utils.asGridCoord(218.5, 21)]: true,
            [utils.asGridCoord(219, 21)]: true,
    

        },

         cutsceneSpaces:{
             [utils.asGridCoord(217, 21)]: [
                {
                    events:[
                        {type:"fim"}
                     ]    
                 }
             ], 
             [utils.asGridCoord(217.5, 21)]: [
                {
                    events:[
                        {type:"fim"}
                     ]    
                 }
             ],
             [utils.asGridCoord(218, 21)]: [
                {
                    events:[
                        {type:"fim"}
                     ]    
                 }
             ],

         },


    },
}