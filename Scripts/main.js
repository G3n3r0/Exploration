window.onload = function() {
    var paper = new Raphael(document.getElementById("svgCont"), 640, 480);
    paper.canvas.id="svgCanvas";
    
    window.rsrc = {
        grass: "Graphics/grass04.png"
    };
    window.tileDims = {
        width: 64,
        height: 64
    };
    window.playDims = {
        width: 48,
        height: 54
    };
    
    function Character(x, y, width, height, imgSrc, name) {
        this.x = x;
        this.y = y;
        this.name = name;
        //console.log(imgSrc);
        //this.img = paper.image(imgSrc,x,y,32,36);
        this.imgSrc = imgSrc;
        this.img = null;
        this.width = width;
        this.height = height;
        this.spd = 3;
        this.draw = function() {
            if(this.img) {
                this.img.remove();
            }
            //console.log(this.imgSrc);
            this.img = paper.image(this.imgSrc, this.x, this.y, this.width, this.height);
            //this.img.node.title;
        };
    }
    
    function Player(x, y, imgSrc, name) {
        Character.call(this, x, y, window.playDims.width, window.playDims.height, imgSrc, name);
    }
    Player.prototype = new Character();
    Player.prototype.update = function(u,d,l,r) {
        //console.log(u,d,l,r);
        var ud = 0;
        var lr = 0;
        if(window.mode=="homestead") {
            if(u && this.y>0) {
                ud -= this.spd;
            }
            if(d && this.y+this.height<paper.height) {
                ud += this.spd;
            }
            if(l && this.x>0) {
                lr -= this.spd;
            }
            if(r && this.x+this.width<paper.width) {
                lr += this.spd;
            }
        }
        this.x += lr;
        this.y += ud;
        
        //console.log(this.img.node);
        
        /*this.img.node.x = this.x;
        this.img.node.y = this.y;*/
        this.img.node.setAttribute("x", this.x);
        this.img.node.setAttribute("y", this.y);
    };
    
    var u,d,l,r = false;
    document.onkeydown = function(e) {
        console.log(e.which);
        if(e.which===38) {
            u = true;
        } else if(e.which===40) {
            d = true;
        } else if(e.which===39) {
            r = true;
        } else if(e.which===37) {
            l = true;
        }
    };
    document.onkeyup = function(e) {
        if(e.which===38) {
            u = false;
        } else if(e.which===40) {
            d = false;
        } else if(e.which===39) {
            r = false;
        } else if(e.which===37) {
            l = false;
        }
    };
    
    function tick() {
        window.player.update(u,d,l,r);
    }
    
    function homestead(material) {
        window.mode = "homestead";
        var imgSrc = window.rsrc[material];
        for(var i=0;i<paper.width/window.tileDims.width;i++) {
            for(var j=0;j<paper.height/window.tileDims.height;j++) {
                paper.image(imgSrc,i*window.tileDims.width,j*window.tileDims.height, window.tileDims.width, window.tileDims.height);
            }
        }
    }
    
    function init() {
        homestead("grass");
        window.player = new Player(paper.width/2-window.playDims.width/2, paper.height/2-window.playDims.height/2, "Graphics/test_sprite_1.png", "Bryan Cabreja");
        window.player.draw();
        window.intVal = setInterval(tick, 1000/30);
    }
    init();
};