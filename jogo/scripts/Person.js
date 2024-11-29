class Person extends GameObject {
    constructor(config) {
        super(config);
        this.movingProgressRemaining = 0;

        this.isPlayerControlled = config.isPlayerControlled || false; 
        this.isJumping = false; 
        this.jumpVelocity = 0; // Velocidade do pulo
        this.gravity = 0.5; // Força da gravidade
        this.jumpStrength = 10; // Força inicial do pulo
        this.groundLevel = this.y;
        this.lastDirection = "right";
        this.walking = false;
        this.isStanding = true

        this.isCrouching = false;

        this.isAttacking = false;
        this.attackCooldown = false; // Para impedir spam de ataques
        this.isTakingDamage = false;
        this.isDead= false;

        this.directionUpdate = {
            "up": null,
            "down": ["y", 10],
            "left": ["x", -4],
            "right": ["x", 4],
        };
    }

    update(state) {
        if (!state.map.isCutscenePlaying && this.isPlayerControlled && !this.isTakingDamage &&!this.isDead) {
            // Inicia o pulo
            if (state.arrow === "up" && !this.isJumping && !this.isCrouching && !this.isAttacking) {
                this.isJumping = true;
                this.jumpVelocity = this.jumpStrength;
            }

            // Inicia ataque
            if (state.arrow === "fight" && !this.isAttacking && !this.attackCooldown) {
                this.isAttacking = true;
                this.walking = false
                this.attack();
            }

            // Agacha
            if (state.arrow === "down" && !this.isJumping) {
                this.isCrouching = true;
                this.y = this.groundLevel + 10; // Ajusta altura
            } else if (!this.isJumping) {
                this.isCrouching = false;
                this.y = this.groundLevel; // Retorna ao chão
            }

            // Movimento horizontal
            if (
                this.movingProgressRemaining === 0 && 
                !this.isJumping && 
                !this.isCrouching && 
                !this.isAttacking &&
                state.arrow && state.arrow !== "up" && state.arrow !== "down"
            ) {
                this.startBehavior(state, {
                    type: "walk",
                    direction: state.arrow,
                });
                this.lastDirection = this.direction;
            }

            if(!state.arrow){
                this.walking = false
                this.isStanding= true
            }
        }

        // Atualizar física e posições
        if (this.isJumping) {
            this.applyJumpPhysics();
        }
        if (this.movingProgressRemaining > 0) {
            this.walking = true
            this.isStanding=false
            this.updatePosition(state);
        }

        // Atualiza o sprite e estado
        this.updateSprite();
    }

    startBehavior(state, behavior) {
        this.direction = behavior.direction;

        if (behavior.type === "walk" ) {
            // Verifica barreiras
            if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
                return;
            }
            //Pronto para andar
            this.movingProgressRemaining = 8;
            this.walking = true;
            this.isStanding = false;
            this.updateSprite();
        }

        
        if (behavior.type === "stand") {
            this.walking = false;
            this.isStanding = true;
            this.updateSprite();
            setTimeout(() => {
            utils.emitEvent("PersonStandComplete", {
                whoId: this.id
            })
            this.isStanding = false;
        }, behavior.time)
      }
    }

    attack() {
        this.updateSprite();
        // Impede ataques consecutivos imediatos
        this.attackCooldown = true;
        setTimeout(() => {
            this.isAttacking = false;
            this.attackCooldown = false;
        }, 500); // Define o tempo de cooldown do ataque
    }

    applyJumpPhysics() {
        this.y -= this.jumpVelocity;
        this.jumpVelocity -= this.gravity;

        if (this.y >= this.groundLevel) {
            this.y = this.groundLevel;
            this.isJumping = false;
            this.jumpVelocity = 0;
        }
    }

    updatePosition(state) {
        if(!this.isTakingDamage &&!this.isDead){
        if (this.isJumping && this.walking) {
            // Movimento horizontal durante o pulo
            const [property, change] = this.directionUpdate[this.direction];
            if (property && !state.map.isSpaceTaken(this.x, this.y, this.direction)) {
                this[property] += change;
            }
        } else if (!this.isAttacking) {
            const [property, change] = this.directionUpdate[this.direction];
            if (property) {
                this[property] += change;
                this.movingProgressRemaining -= 1;
            }
        }
        }

        if (this.movingProgressRemaining === 0) {
            utils.emitEvent("PersonWalkingComplete", {
                whoId: this.id,
            });
            
        }
    }

    updateCondition(condicion, dir) {
        this.direction = dir;

        if(condicion === "hit"){
           this.isTakingDamage = true;

        } else {
            setTimeout(() => {
                this.isTakingDamage = false;
            },20)
        }
        if(condicion === "dead"){
            this.isDead = true;
            // this.sprite.setAnimation("died-" + this.direction);
         } 
         this.updateSprite()

    }

    updateSprite() {
        if(this.isTakingDamage){
            this.sprite.setAnimation("damage-" + this.direction);
        }else if(this.isDead){
            this.sprite.setAnimation("died-" + this.direction);
        }else  if (this.isJumping) {
            this.sprite.setAnimation("jump-" + this.lastDirection);
        } else if (this.isCrouching) {
            this.sprite.setAnimation("squat-" + this.lastDirection);
        } else if (this.isAttacking) {
            this.sprite.setAnimation("attack-" + this.lastDirection);
        } else if (this.walking) {
            this.sprite.setAnimation("walk-" + this.direction);
        } else if (this.isStanding){
            this.sprite.setAnimation("idle-" + this.direction);
        } 
        
    }
}
