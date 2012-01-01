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
    
    function Character(x, y, imgSrc, name) {
        this.x = x;
        this.y = y;
        this.name = name;
        console.log(imgSrc);
        //this.img = paper.image(imgSrc,x,y,32,36);
        this.imgSrc = imgSrc;
        this.img = null;
        this.width = 32;
        this.height = 36;
        this.spd = 3;
        this.draw = function() {
            if(this.img) {
                this.img.remove();
            }
            console.log(this.imgSrc);
            this.img = paper.image(this.imgSrc, this.x, this.y, 32, 36);
            this.img.node.title;
        };
    }
    
    function Player(x, y, imgSrc, name) {
        Character.call(this, x, y, imgSrc, name);
    }
    Player.prototype = new Character();
    Player.prototype.update = function(u,d,l,r) {
        var ud = 0;
        var lr = 0;
        if(u) {
            ud -= this.spd;
        }
        if(d) {
            ud += this.spd;
        }
        if(l) {
            lr -= this.spd;
        }
        if(r) {
            lr += this.spd;
        }
        this.x += lr;
        this.y += ud;
        
        this.img.node.x = this.x;
        this.img.node.y = this.y;
    };
    
    function tick() {
    }
    
    function homestead(material) {
        var imgSrc = window.rsrc[material];
        for(var i=0;i<paper.width/window.tileDims.width;i++) {
            for(var j=0;j<paper.height/window.tileDims.height;j++) {
                paper.image(imgSrc,i*window.tileDims.width,j*window.tileDims.height, window.tileDims.width, window.tileDims.height);
            }
        }
    }
    
    function init() {
        window.intVal = setInterval(tick, 1000/30);
        homestead("grass");
        window.player = new Player(50, 50, "Graphics/test_sprite_1.png", "Bryan Cabreja");
        window.player.draw();
    }
    init();
};