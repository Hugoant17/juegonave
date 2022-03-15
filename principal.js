var juego=new Phaser.Game(370,550,Phaser.CANVAS,'area_juego');

var fondoJuego;
var nave;
var cursores;
var tiempoBala=0;
var botonDisparo;
var enemigos;
var sonido;
var explosion;

var estadoPrincipal={
    preload: function (){
        juego.load.image('fondo','img/space.png');
        juego.load.image('personaje','img/nave2.png');
        juego.load.image('laser','img/laser.png');
        juego.load.image('enemigo','img/enemigo.png');
        
        juego.load.bitmapFont('letra', 'assets/fonts/bitmapFonts/nokia.png', 'assets/fonts/bitmapFonts/nokia.xml');
        
        this.load.audio('sonido','materiales/disparo.mp3');
        this.load.audio('explosion','materiales/explo.mp3');
    },
    create: function(){
        fondoJuego=juego.add.tileSprite(0,0,370,550,'fondo');
        nave=juego.add.sprite(juego.width/2,500,'personaje');
        nave.anchor.setTo(0.5);

        cursores=juego.input.keyboard.createCursorKeys();
        botonDisparo=juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        balas=juego.add.group();
        balas.enableBody=true;
        balas.physicsBodyType=Phaser.Physics.ARCADE;
        balas.createMultiple(20,'laser');
        balas.setAll('anchor.x',0.5);
        balas.setAll('anchor.y',1);
        balas.setAll('outOfBoundsKill',true);
        balas.setAll('checkWorldBounds',true);


        enemigos=juego.add.group();
        enemigos.enableBody=true;
        enemigos.physicsBodyType=Phaser.Physics.ARCADE;

        //Crear enemigos y mostrarlos en panatalla

        for(var y=0; y<6; y++){
            for(var x = 0; x < 7; x++){
                var enemigo = enemigos.create(x*40, y*20, 'enemigo');
                enemigo.anchor.setTo(0.5);
            }
        }
        enemigos.x=50;
        enemigos.y=30;

        

        var animacion = juego.add.tween(enemigos).to({x:100},1000,Phaser.Easing.Linear.None,true,0,1000,true);

        //nombre
        bmpText = juego.add.bitmapText(10,10,'letra','Hugo Antonio Zevallos Manay',10);
        bmpText.inputEnabled = true;
        bmpText.input.enableDrag();

        this.sonido = this.sound.add('sonido');
        this.explosion = this.sound.add('explosion');

    },
    update: function(){
        if(cursores.right.isDown){
            nave.position.x+=3;
        }else if(cursores.left.isDown){
            nave.position.x-=3;
        }

        var bala;

        if(botonDisparo.isDown){
            this.sonido.play();
            if(juego.time.now>tiempoBala){
                bala=balas.getFirstExists(false);
            }
            if (bala){
                bala.reset(nave.x, nave.y);
                bala.body.velocity.y=-300;
                tiempoBala=juego.time.now +100;
            }
        }

       juego.physics.arcade.overlap(balas,enemigos,colision,null,this);

    }
};

function colision(bala,enemigo){
    this.explosion.play();
    bala.kill();
    enemigo.kill();
}


juego.state.add('principal',estadoPrincipal);
juego.state.start('principal');