class KeyPressListener {
    constructor(keyCode, callback){
        let keySafe = true;
        this.keydownFunction = function(event) {
            if (event.code === keyCode){
                if(keySafe){
                    keySafe = false;
                    callback();
                }
            }
        };
        this.keyupFuncion = function(event) {
            if (event.code === keyCode) {
                keySafe = true;
            }
        };


        document.addEventListener("keydown", this.keydownFunction);
        document.addEventListener("keyup", this.keyupFuncion);
    }

    unbind(){
        document.removeEventListener("keydown", this.keydownFunction);
        document.removeEventListener("keyup", this.keyupFuncion);
    } 
}