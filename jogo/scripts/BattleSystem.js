window.addEventListener("load", () => {
    const hudContainer = document.getElementById("hud-container");
    BattleSystem.initHud(hudContainer);
});

const BattleSystem = {
    jogadorhp: 250,
    jogadorMaxHp: 250,
    jogadorHud: null,
    inimigos: [
        { id: "guarda1", hp: 60, maxHp: 60,},
        { id: "guarda2", hp: 70, maxHp: 70,},
        { id: "guarda3", hp: 90, maxHp: 90,},
        { id: "guarda4", hp: 60, maxHp: 60,},
        { id: "guarda5", hp: 70, maxHp: 70,},
        { id: "guarda6", hp: 90, maxHp: 90,},
        { id: "guarda7", hp: 60, maxHp: 60,},
        { id: "guarda8", hp: 70, maxHp: 70,},
    ], 

    initHud(container) {
        
        container.innerHTML = "";
    
        
        this.jogadorHud = new hp({
            hp: this.jogadorhp,
            maxHp: this.jogadorMaxHp,
        });
        this.jogadorHud.init(container);
    },

    verifyOBJ(obj, min, max){
        if (obj.x <= max.x && obj.x >= min.x){
            return true
        } else if (obj.x >= max.x && obj.x <= min.x){
            return true
        } else {
            return false
        }
    },
 
    verifyId(inimigo){
        if(this.inimigos.find(e => e.id === inimigo.id)){
        const guardas = this.inimigos.find(e => e.id === inimigo.id);
        if (guardas.hp <= 0){
            return false
        } else {
            return true
        }
        } else {
            return false
        }
    },

    reset(){
        for (i=0; i < 8; i++){
            let guardas = this.inimigos[i]
            guardas.hp = guardas.maxHp
        }
    },

    hit(player, enemy, who) {
        const jogador = player;
        const inimigo = enemy;
        const Attacking = who;
        let direction;
        // console.log(inimigo.id)

        if (this.jogadorhp <= 0) return;

        // Encontre o inimigo na lista
        const inimigohp = this.inimigos.find(e => e.id === enemy.id);
        if (!inimigohp || inimigohp.hp <= 0) return;

        if (Attacking === jogador.id) {
            // Dano no inimigo
            inimigohp.hp -= 20;

            if (inimigo.direction === jogador.direction) {
                direction = inimigo.direction === "right" ? "left" : "right";
                inimigo.direction = direction;
            } else {
                direction = inimigo.direction;
            }

            inimigo.x += direction === "left" ? 64 : -64;

            Sound.efeitoSonoro("Audios/hit_inimigo.wav")
            setTimeout(() => inimigo.updateCondition("hit", direction), 30);
            setTimeout(() => inimigo.updateCondition("alive", direction), 300);


        } else if (Attacking === inimigo.id) {
            // Dano no jogador
            this.jogadorhp -= 25;
            this.jogadorHud.update({ hp: this.jogadorhp }); // Atualizar HUD do jogador

            if (inimigo.direction === jogador.direction) {
                direction = jogador.direction === "right" ? "left" : "right";
                jogador.direction = direction;
            } else {
                direction = jogador.direction;
            }

            jogador.x += direction === "left" ? 64 : -64;

            Sound.efeitoSonoro("Audios/hit_heroina.wav")
            setTimeout(() => jogador.updateCondition("hit", direction), 30);
            setTimeout(() => jogador.updateCondition("alive", direction), 300);

        }

        // Verificar condições de derrota
        if (inimigohp.hp <= 0) this.dye(inimigo, direction);
        if (this.jogadorhp <= 0) this.dye(jogador, direction);
    },

    dye(died, dir) {
        if (died.id !== "heroina") {
            died.updateCondition("dead", dir);
            return;
        }
        window.location.href = "../gameover.html"
    }

};
 