//Reciprocal: 1/n
window.onload = function() {
    function E(a, b) {
        //console.log(a.x, a.y, b.x, b.y);
        return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        );
    }
    
    var paper = new Raphael(document.getElementById("svgCont"), 640, 480);
    paper.canvas.id="svgCanvas";
    var g1 = document.createElement("g");
    g1.id = "snowG";
    paper.canvas.appendChild(g1);
    
    window.buildings = [];
    window.tiles = [];
    
    window.rsrc = {
        grass: "Graphics/grass04.png",
        house: "Graphics/Wood Block_smallified.png"
    };
    window.tileDims = {
        width: 64,
        height: 64
    };
    /*window.playDims = {
        width: 48,
        height: 54
    };
    window.playDims = {
        width: 32,
        height: 48
    };*/
    window.playDims = {
        width: 32,
        height: 42
    };
    window.houseDims = {
        width: 64,
        height: 77
    };
    
    function Building(x, y, width, height, imgSrc, name) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.imgSrc = imgSrc;
        this.name = name;
        this.oncontact = function() {};
        
        this.draw = function() {
            if(this.img) {
                this.img.remove();
            }
            //console.log(this.imgSrc);
            this.img = paper.image(this.imgSrc, this.x, this.y, this.width, this.height);
            //this.img.node.title;
            return this;
        };
    }
    function House(x,y, imgSrc, name) {
        Building.call(this, x, y, window.houseDims.width, window.houseDims.height, imgSrc, name);
    }
    House.prototype = new Building();
    House.prototype.setContact = function(func) {
        this.oncontact = func;
        return this;
    };
    /*House.prototype.oncontact = function() {
        alert("Kaboom!");
    };*/
    
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
        this.health = 100;
        this.damageMult = 1;
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
        } else if(e.which===16) {
            window.player.spd = 9;
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
        } else if(e.which===16) {
            window.player.spd = 3;
        }
    };
    
    function tick() {
        window.player.update(u,d,l,r);
        for(var i=0;i<window.buildings.length;i++) {
            if(E(window.player, window.buildings[i])) {
                //alert("Bam");
                window.buildings[i].oncontact();
            }
        }
    }
    
    function homestead(material) {
        window.mode = "homestead";
        var imgSrc = window.rsrc[material];
        //paper.canvas.innerHTML += "<g id='tileG'>";
        for(var i=0;i<paper.width/window.tileDims.width;i++) {
            for(var j=0;j<paper.height/window.tileDims.height;j++) {
                window.tiles.push(paper.image(imgSrc,i*window.tileDims.width,j*window.tileDims.height, window.tileDims.width, window.tileDims.height));
            }
        }
        //paper.canvas.innerHTML += "</g>";
        //window.house = new House(10, 10, window.rsrc.house, "House");
        //house.draw();
        window.buildings.push(new House(10, 10, window.rsrc.house, "House").setContact(function() {
            //alert("Boom");
            window.player.health = 100;
        }).draw());
    }
    
    function rain() {
        window.weatherImage = paper.image("Graphics/sea_rain.gif",0,0,640,480).attr("opacity", "0.5");
    }
    function snow() {
        //http://wonderworlds.org/images/snow/snow-falling-pale-animated.gif
        window.weatherImage = paper.image("http:\/\/wonderworlds.org/images/snow/snow-falling-pale-animated.gif",0,0,640,480).attr("opacity", "0.5");
    }
    
    function init() {
        homestead("grass");
        /*var img = new Image();
        img.onload = function() {
            window.player = new Player(paper.width/2-window.playDims.width/2, paper.height/2-window.playDims.height/2, threed(this), "Bryan Cabreja");
            window.player.draw();
            window.intVal = setInterval(tick, 1000/30);
        };
        img.src = "Graphics/littledude_on_own.png";*/
        window.player = new Player(paper.width/2-window.playDims.width/2, paper.height/2-window.playDims.height/2, "Graphics/Character Boy_smallified.png", "Bryan Cabreja");
        window.player.draw();
        window.intVal = setInterval(tick, 1000/30);
        //window.weatherImage = paper.image("Graphics/sea_rain.gif",0,0,640,480).attr("opacity", "0.5");
        //initSnow("snowG",0,0,640,480);
        rain();
        //snow();
    }
    init();
};