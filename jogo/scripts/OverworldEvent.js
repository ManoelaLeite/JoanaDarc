class OverworldEvent {
    constructor({ map, event }) {
        this.map = map;
        this.event = event;
    }

    stand(resolve) {
        const who = this.map.gameObjects[this.event.who];
        if (!who) {
            console.error(`Objeto de jogo não encontrado: ${this.event.who}`);
            resolve();
            return;
        }

        who.startBehavior(
            { map: this.map },
            {
                type: "stand",
                direction: this.event.direction,
                time: this.event.time,
            }
        );

        const completeHandler = (e) => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonStandComplete", completeHandler);
                
                resolve();
            }
        };
        document.addEventListener("PersonStandComplete", completeHandler);
    }

    walk(resolve) {
        
        const who = this.map.gameObjects[this.event.who];
        
        if (!who) {
            console.error(`Objeto de jogo não encontrado: ${this.event.who}`);
            resolve();
            return;
        }

        
        who.startBehavior(
            { map: this.map },
            {
                type: "walk",
                direction: this.event.direction,
            }
        );

        const completeHandler = (e) => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve();
            }
        };
        document.addEventListener("PersonWalkingComplete", completeHandler);
    }
        
    textMessage(resolve) { 

        if(this.event.faceHeroina){
            const obj = this.map.gameObjects[this.event.faceHero];
            obj.direction = utils.oppositeDirection(this.map.gameObjects["heroina"]);
        }
        
        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve()
        })
        
       
        message.init( document.querySelector(".jogo") )
    }

    changeMap(resolve){

        const sceneTransition = new SceneTransition();
        BattleSystem.reset()
        sceneTransition.init( document.querySelector(".jogo"), () => {
            this.map.overworld.startMap(window.OverworldMaps[this.event.map])
            resolve();
            

            sceneTransition.fadeOut();
        });
        
    }

    fim(resolve){
        const sceneTransition = new SceneTransition();
        BattleSystem.reset()
        sceneTransition.init( document.querySelector(".jogo"), () => {
            window.location.href = "../final.html"
            resolve();

            sceneTransition.fadeOut();
        });

    }

    init() {
        
       
        return new Promise((resolve) => {
                this[this.event.type](resolve);
           
        });
    }
}