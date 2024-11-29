const utils ={
    withGrid(n){
        return n * 16;
    },

    asGridCoord(x,y){
        x= x*16;
        y= y*16;
        return `${x},${y}`;
    },
    
    nextPositionSpace(initialX, initialY, direction){
        let x = initialX;
        let y = initialY;

        const size = 16;

        if (direction === "left"){
            x -= size;
        } else if (direction === "right"){
            x += size;
        }  else if (direction === "up"){
            y -= size;
        }  else if (direction === "down"){
            y += size;
        }
        return {x,y};

    },

    nextPosition(initialX, initialY, direction){
        let x = initialX;
        let y = initialY;

        const size = 16;

        if (direction === "left"){
            x -= size;
        } else if (direction === "right"){
            x += size;
        }  else if (direction === "up"){
            y -= size;
        }  else if (direction === "down"){
            y += size;
        }
        return {x,y};

    },


    nextPositionHit(initialX, initialY, direction){
        let x = initialX;
        let y = initialY;

        const size = 64;

        if (direction === "left"){
            x -= size;
        } else if (direction === "right"){
            x += size;
        }  else if (direction === "up"){
            y -= size;
        }  else if (direction === "down"){
            y += size;
        }
        return {x,y};

    },

    nextPositionDamage(initialX, initialY, direction){
        let x = initialX;
        let y = initialY;

        const size = 32;

        if (direction === "left"){
            x -= size;
        } else if (direction === "right"){
            x += size;
        }  else if (direction === "up"){
            y -= size;
        }  else if (direction === "down"){
            y += size;
        }
        return {x,y};

    },


oppositeDirection(direction){
    if (direction === "left") {return "right"};
    if (direction === "right") {return "left"};
},

    emitEvent(name, detail){
        const event = new CustomEvent(name, {
            detail
            });
         document.dispatchEvent(event);
    }




}