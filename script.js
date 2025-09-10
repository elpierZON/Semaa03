var juego =new Phaser.Game(370,900,Phaser.Canvas,'bloque_juego');
var fondojuego;
var personaje;
var teclaDerecha;
var teclaIzquierda;
var enemigos;
var balas;
var tiempoBala=0;
var botonDisparo;
var musicaFondo;
var puntaje = 0;
var textoPuntaje;

var estadoPrincipal={

    preload:function(){
        juego.load.image('fondo','img/bg.png');
        juego.load.image('animacion','img/aliado2.png',10,10);
        juego.load.image('enemigo','img/enemigo.png',24,24);
        juego.load.image('laser','img/laser.png');
        juego.load.audio('sonidoLaser', 'laser.mp3');
        juego.load.audio('musicaFondo', 'song.mp3');
    },
    create: function(){
        juego.physics.startSystem(Phaser.Physics.ARCADE);
        
        fondojuego = juego.add.tileSprite(0,0,370,900,'fondo');
        personaje = juego.add.sprite(80,600,'animacion');
        personaje.animations.add('movimiento',[0,1,2,3,4],10,true);
        teclaDerecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        teclaIzquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);

        //enemigos=juego.add.sprite(200,150,'enemigo');
        botonDisparo=juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        
        balas = juego.add.group();
        balas.enableBody=true;
        balas.physicsBodyType=Phaser.Physics.ARCADE;
        balas.createMultiple(20,'laser');
        balas.setAll('anchor.x',0.5);
        balas.setAll('anchor.y',0.5);
        balas.setAll('outOfBoundsKill',true);
        balas.setAll('checkWorldBounds',true);

        sonidoLaser = juego.add.audio('sonidoLaser');
        
        musicaFondo = juego.add.audio('musicaFondo');
        musicaFondo.loop = true;
        musicaFondo.volume = 0.3;
        musicaFondo.play();

        // Crear texto del puntaje
        textoPuntaje = juego.add.text(15, 15, 'Puntaje: 0', {
            fontSize: '28px',
            fill: '#ffff00',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });
        textoPuntaje.fixedToCamera = true;


        
        enemigos=juego.add.group();
        enemigos.enableBody = true;
        enemigos.physicsBodyType = Phaser.Physics.ARCADE;
        for(var y=0; y<3; y++){
            for(var x=0; x<3;x++){
                var enemig=enemigos.create(x*100,y*100,'enemigo');
                enemig.anchor.setTo(0.5);
                enemig.scale.setTo(0.2, 0.2); // Reducir el tamaño a 30% del original            
            }
        }
        enemigos.x = 40;
        enemigos.y = 190;
        var animacion = juego.add.tween(enemigos).to(
            {x:140},
            1000,Phaser.Easing.Linear.None,true,0,1000,true
        );


    },
    update: function(){
        fondojuego.tilePosition.x-=1;
        
        // Mantener el score visible en pantalla
        textoPuntaje.bringToTop();
        
        if(teclaDerecha.isDown){
            personaje.x++;
            personaje.animations.play('movimiento');
        }else if(teclaIzquierda.isDown){
            personaje.x--;
            personaje.animations.play('movimiento');
        }
        var bala;
        if(botonDisparo.isDown && juego.time.now > tiempoBala){
            bala=balas.getFirstExists(false);
            if(bala){
                bala.reset(personaje.x + personaje.width/2, personaje.y);
                bala.body.velocity.y=-300;
                tiempoBala=juego.time.now+100;
                sonidoLaser.play();
            }
        }
        juego.physics.arcade.overlap(balas,enemigos,colision,null,this);
        
        // Verificar si no quedan enemigos
        if(enemigos.countLiving() === 0){
            musicaFondo.stop();
            alert("¡GANASTE! Puntaje Final: " + puntaje);
            window.location.reload();
        }
    }

};

function colision(bala,enemigo){
    bala.kill();
    enemigo.kill();
    
    // Sumar 10 puntos por cada enemigo eliminado
    puntaje += 10;
    textoPuntaje.text = 'Puntaje: ' + puntaje;
}

juego.state.add('principal',estadoPrincipal);
juego.state.start('principal');