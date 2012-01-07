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
        house: "Graphics/heal-sky-1_transp.png",
        landPort: "Graphics/watercolor_map_australia_shadow.png",
        dirt: "Graphics/dirt_0.png"
    };
    var groundMats = ["grass", "dirt"];
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
    /*window.houseDims = {
        width: 64,
        height: 77
    };*/
    window.houseDims = {
        width: 64,
        height: 64
    };
    window.landPortDims = {
        width: 64,
        height: 64
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
        this.setContact = function(func) {
            this.oncontact = func;
            return this;
        };
    }
    function House(x,y, imgSrc, name) {
        Building.call(this, x, y, window.houseDims.width, window.houseDims.height, imgSrc, name);
    }
    House.prototype = new Building();
    /*House.prototype.setContact = function(func) {
        this.oncontact = func;
        return this;
    };*/
    /*House.prototype.oncontact = function() {
        alert("Kaboom!");
    };*/
    function LandPort(x, y, imgSrc, name) {
        Building.call(this, x, y, window.landPortDims.width, window.landPortDims.height, imgSrc, name);
    }
    LandPort.prototype = new Building();
    /*LandPort.prototype.setContact = function(func) {
        this.oncontact = func;
        return this;
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
        } else if(window.mode=="land") {
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
            
            if(this.y<0) {
                window.clearInterval(window.intVal);
                //this.y = paper.height-this.height-6;
                var p = window.player;
                this.img.animate({y: paper.height-this.height-6}, 500, null, function() {
                    console.log(this,p);
                    p.y = paper.height-p.height-6;
                    genRoom(0);
                    window.intVal = setInterval(tick, 1000/30);
                });
                for(var i=0;i<window.tiles.length;i++) {
                    //window.tiles[i].animate({y: paper.height}, 500, null, genRoom);
                    window.tiles[i].animate({y: paper.height}, 500);
                }
                //genRoom(0);
                //ud = 0;
            } else if(this.y>paper.height) {
                this.y = 6;
                genRoom(0);
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
        if(e.which===38 || e.which===87) {
            u = true;
        } else if(e.which===40 || e.which===83) {
            d = true;
        } else if(e.which===39 || e.which===68) {
            r = true;
        } else if(e.which===37 || e.which===65) {
            l = true;
        } else if(e.which===16) {
            window.player.spd = 9;
        }
    };
    document.onkeyup = function(e) {
        if(e.which===38 || e.which===87) {
            u = false;
        } else if(e.which===40 || e.which===83) {
            d = false;
        } else if(e.which===39 || e.which===68) {
            r = false;
        } else if(e.which===37 || e.which===65) {
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
        window.buildings.push(new LandPort(75, 75, window.rsrc.landPort, "Land Port").setContact(function() {
            land();
        }).draw());
    }
    function genRoom(numEnems) {
        var mat = groundMats[Math.floor(Math.random()*groundMats.length)];
        var matURL = window.rsrc[mat];
        for(var i=0;i<paper.width/window.tileDims.width;i++) {
            for(var j=0;j<paper.height/window.tileDims.height;j++) {
                //var m = paper.image(matURL,i*window.tileDims.width,j*window.tileDims.height, window.tileDims.width, window.tileDims.height);
                var m = paper.image(matURL,i*window.tileDims.width,0, window.tileDims.width, window.tileDims.height);
                m.animate({y: window.tileDims.height*j}, 500);
                window.tiles.push(m);
            }
        }
        window.player.img.toFront();
    }
    function land() {
        window.mode = "land";
        //window.tiles = [];
        for(var i=0;i<window.tiles.length;i++) {
            window.tiles[i].remove();
        }
        for(var j=0;j<window.buildings.length;j++) {
            window.buildings[j].img.remove();
        }
        window.tiles = [];
        window.buildings = [];
        genRoom(1);
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
        //land();
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
        //rain();
        //snow();
    }
    init();
};