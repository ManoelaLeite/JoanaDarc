class GameObject {
    constructor(config) {
        this.isMounted = false;
        this.id = config.id || null; 
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "right";

        this.sprite = new Sprite({
            gameObject: this,
            id: this.id, 
            src: config.src || "imgs/Personagens/heroina/heroina.png",
        });

        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;

        this.talking = config.talking || [];
       
    }
    
    mount(map) {
        this.isMounted = true;

        // Dar um delay antes de iniciar os comportamentos dos NPCs
        setTimeout(() => {
            this.doBehaviorEvent(map);
        }, 10);
    }

    update() {
        // Implementar lógica de atualização, se necessário
    }

    async doBehaviorEvent(map) {
        // Se estiver na cutscene ou não houver comportamento, te aquiete
        if (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding) {
            return;
        }

        // Configurar o evento com informações importantes
        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.id;

        // Criar uma instância do evento fora do próximo eventConfig
        const eventHandler = new OverworldEvent({ map, event: eventConfig });
        await eventHandler.init(); 


        // Loop
        this.behaviorLoopIndex += 1;
        if (this.behaviorLoopIndex === this.behaviorLoop.length) {
            this.behaviorLoopIndex = 0;
        } 

        //hahahah again
        this.doBehaviorEvent(map);
    }
}
