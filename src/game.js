(() => {
  "use strict";
  if(!window.Phaser){const msg=document.createElement("div");msg.style.cssText="position:fixed;inset:0;display:grid;place-items:center;background:#101629;color:#fff;font:20px system-ui;padding:32px;text-align:center";msg.textContent="No se pudo cargar Phaser 3. Comprueba tu conexión a internet y vuelve a cargar la página.";document.body.appendChild(msg);return}
  const W=960, H=540, FLOOR=476, TOTAL=15;
  const CFG=window.LOVE_GAME_CONFIG||{};
  const DATA=window.LOVE_GAME_DATA;
  const TOUCH={left:false,right:false,jump:false,action:false,run:false,resonance:false};
  window.LOVE_GAME_TOUCH=TOUCH;
  const safeGet=(k,fallback)=>{try{const v=localStorage.getItem(k);return v===null?fallback:v}catch(_){return fallback}};
  const safeSet=(k,v)=>{try{localStorage.setItem(k,String(v))}catch(_){}};
  const readSave=()=>{try{const raw=safeGet("kol_save_v2","");if(raw){const v=JSON.parse(raw);if(v&&typeof v==="object")return v}}catch(_){}return null};
  const getProgress=()=>{const v=readSave();return {level:Math.max(0,Math.min(TOTAL-1,Number(v?.level??safeGet("kol_level","0"))||0)),role:v?.role||safeGet("kol_role","ANDRES"),score:Number(v?.score??safeGet("kol_score","0"))||0,coins:Number(v?.coins)||0,hearts:Number(v?.hearts)||0,fragments:Number(v?.fragments)||0,lives:Math.max(1,Math.min(3,Number(v?.lives)||3))}};
  const saveProgress=(data={})=>{const old=readSave()||{};const next={version:2,level:data.level??old.level??0,role:data.role??old.role??safeGet("kol_role","ANDRES"),score:data.score??old.score??0,coins:data.coins??old.coins??0,hearts:data.hearts??old.hearts??0,fragments:data.fragments??old.fragments??0,lives:data.lives??old.lives??3,checkpoint:data.checkpoint??old.checkpoint??100,bestScore:Math.max(Number(old.bestScore)||0,Number(data.bestScore)||0,Number(data.score)||0),music:safeGet("kol_music","1"),sfx:safeGet("kol_sfx","1"),updatedAt:new Date().toISOString()};safeSet("kol_save_v2",JSON.stringify(next));safeSet("kol_level",next.level);safeSet("kol_role",next.role);safeSet("kol_score",next.score);return next};
  const audio={ctx:null,music:safeGet("kol_music","1")==="1",sfx:safeGet("kol_sfx","1")==="1",musicVolume:Math.max(0,Math.min(1,Number(safeGet("kol_music_volume","0.65"))||0)),sfxVolume:Math.max(0,Math.min(1,Number(safeGet("kol_sfx_volume","0.8"))||0))};
  function playTone(freq=440,duration=.08,type="square",volume=.035,channel="sfx"){
    if(channel==="music"?!audio.music:!audio.sfx)return;
    try{
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
      audio.ctx=audio.ctx||new AC();if(audio.ctx.state==="suspended")audio.ctx.resume();
      const o=audio.ctx.createOscillator(),g=audio.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.ctx.currentTime);
      volume*=channel==="music"?audio.musicVolume:audio.sfxVolume;g.gain.setValueAtTime(Math.max(.0001,volume),audio.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.ctx.currentTime+duration);
      o.connect(g);g.connect(audio.ctx.destination);o.start();o.stop(audio.ctx.currentTime+duration);
    }catch(_){}
  }
  function startMusic(scene,worldIndex){
    audio.music=safeGet("kol_music","1")==="1";if(!audio.music)return;
    const melodies=[[392,494,587,494,440,523,659,523],[330,392,494,392,349,440,523,440],[392,440,523,659,587,523,440,392],[294,370,440,370,262,330,392,330],[440,523,659,784,659,587,523,440]];
    const seq=melodies[worldIndex%melodies.length];let n=0;
    scene.time.addEvent({delay:340,loop:true,callback:()=>{if(audio.music){playTone(seq[n%seq.length],.19,"triangle",.018,"music");n++}}});
  }
  function button(scene,x,y,label,callback,opts={}){
    const width=opts.width||240,height=opts.height||48;
    const bg=scene.add.rectangle(x,y,width,height,opts.fill||0x193d72,1).setStrokeStyle(3,opts.stroke||0xf1c76c);
    const shine=scene.add.rectangle(x,y-height/2+5,width-12,3,0xffffff,.20);
    const text=scene.add.text(x,y,label,{fontFamily:"Georgia,serif",fontSize:opts.fontSize||"19px",fontStyle:"bold",color:opts.color||"#fff1cd",align:"center"}).setOrigin(.5);
    const hit=scene.add.rectangle(x,y,width,height,0xffffff,0).setInteractive({useHandCursor:true});
    hit.on("pointerover",()=>{bg.setFillStyle(0x315e95);text.setScale(1.04)});
    hit.on("pointerout",()=>{bg.setFillStyle(opts.fill||0x193d72);text.setScale(1)});
    hit.on("pointerdown",callback);
    return [bg,shine,text,hit];
  }
  function addStarField(scene,count=55){
    for(let i=0;i<count;i++){
      const x=Phaser.Math.Between(0,W),y=Phaser.Math.Between(0,H),r=Phaser.Math.Between(1,3);
      const s=scene.add.circle(x,y,r,0xffeab1,Phaser.Math.FloatBetween(.15,.65));
      scene.tweens.add({targets:s,alpha:.08,duration:Phaser.Math.Between(650,1900),yoyo:true,repeat:-1,delay:Phaser.Math.Between(0,700)});
    }
  }
  function makeBackdrop(scene,worldIndex,menu=false){
    const world=DATA.worlds[worldIndex%5];scene.cameras.main.setBackgroundColor(world.sky);
    const g=scene.add.graphics();g.fillStyle(world.far,1);
    for(let x=-100;x<W+300;x+=250){const peak=Phaser.Math.Between(130,230);g.fillTriangle(x,H*.78,x+125,peak,x+260,H*.78)}
    g.fillStyle(world.near,1);for(let x=-80;x<W+200;x+=190){const peak=Phaser.Math.Between(285,370);g.fillTriangle(x,H*.88,x+95,peak,x+195,H*.88)}
    g.fillStyle(world.ground,1);g.fillRect(0,H*.84,W,H*.16);
    for(let x=10;x<W;x+=Phaser.Math.Between(70,120)){
      g.fillStyle(world.accent,.7);g.fillCircle(x,H*.82,Phaser.Math.Between(3,6));g.fillStyle(world.ground,1);g.fillRect(x-1,H*.82,2,14);
    }
    if(menu){
      const cloud=scene.add.graphics();cloud.fillStyle(0xffffff,.38);
      [[120,100],[160,94],[200,104],[700,125],[740,116],[780,126]].forEach(([x,y])=>cloud.fillCircle(x,y,22));
      cloud.fillStyle(0xfff1bf,.10);cloud.fillCircle(800,95,62);
    }
  }
  function charTexture(role,pose){return (role==="VANNESA"?"vannesa_":"andres_")+pose}
  function roleLabel(role){return role==="VANNESA"?"VANNESA":"ANDRÉS"}
  function showToast(scene,message){
    const box=scene.add.rectangle(W/2,112,Math.min(700,Math.max(290,message.length*10)),48,0x10172b,.88).setScrollFactor(0).setDepth(100);
    const t=scene.add.text(W/2,112,message,{fontSize:"17px",color:"#fff1cf",fontStyle:"bold",align:"center",wordWrap:{width:660}}).setOrigin(.5).setScrollFactor(0).setDepth(101);
    scene.time.delayedCall(1900,()=>{box.destroy();t.destroy()});
  }

  class Boot extends Phaser.Scene{
    constructor(){super("Boot")}
    preload(){this.load.image("titleCover","assets/concept/title-screen-concept.webp");this.load.image("valleyPanorama","assets/worlds/valle-de-las-campanas.webp")}
    create(){window.LOVE_GAME_ART.create(this);this.scene.start("Title")}
  }
  class Title extends Phaser.Scene{
    constructor(){super("Title")}
    create(){
      startMusic(this,0);
      if(this.textures.exists("titleCover")){this.add.image(W/2,H/2,"titleCover").setDisplaySize(W,H).setDepth(0)}
      else{
        makeBackdrop(this,0,true);addStarField(this,52);
        this.add.text(W/2,65,CFG.title||"THE KINGDOM OF LOVE",{fontFamily:"Georgia,serif",fontSize:"43px",fontStyle:"bold",color:"#fff0c4",stroke:"#573b32",strokeThickness:7}).setOrigin(.5);
        this.add.text(W/2,115,CFG.subtitle||"ANDRÉS & VANNESA",{fontFamily:"Georgia,serif",fontSize:"22px",fontStyle:"bold",color:"#ffdb83"}).setOrigin(.5);
      }
      const progress=getProgress();
      const actions=[
        {x:810,y:314,w:270,h:44,run:()=>this.scene.start("Select",{level:0,score:0,lives:3})},
        {x:810,y:359,w:260,h:40,run:()=>this.scene.start("Select",{level:progress.level,score:progress.score,lives:progress.lives,coins:progress.coins,hearts:progress.hearts,fragments:progress.fragments,continue:true})},
        {x:810,y:395,w:270,h:40,run:()=>this.scene.start("Select",{level:progress.level,score:progress.score,lives:progress.lives,coins:progress.coins,hearts:progress.hearts,fragments:progress.fragments,continue:true})},
        {x:810,y:431,w:260,h:40,run:()=>this.scene.start("Options")},
        {x:810,y:471,w:260,h:40,run:()=>this.scene.start("Credits")}
      ];
      actions.forEach(a=>{const hit=this.add.rectangle(a.x,a.y,a.w,a.h,0xffffff,0).setDepth(5).setInteractive({useHandCursor:true});hit.on("pointerover",()=>hit.setFillStyle(0xffffff,.10));hit.on("pointerout",()=>hit.setFillStyle(0xffffff,0));hit.on("pointerdown",a.run)});
      const newGame=()=>this.scene.start("Select",{level:0,score:0,lives:3});
      this.input.keyboard.once("keydown-ENTER",newGame);
      this.input.keyboard.on("keydown-C",()=>this.scene.start("Select",{level:progress.level,score:progress.score,lives:progress.lives,coins:progress.coins,hearts:progress.hearts,continue:true}));
    }
  }
  class Select extends Phaser.Scene{
    constructor(){super("Select")}
    init(data){this.startData=data||{level:0,score:0,lives:3}}
    create(){
      makeBackdrop(this,1,false);addStarField(this,25);
      this.add.text(W/2,56,"ELIGE A TU PROTAGONISTA",{fontFamily:"Georgia,serif",fontSize:"34px",fontStyle:"bold",color:"#fff0c4",stroke:"#47334f",strokeThickness:5}).setOrigin(.5);
      this.add.text(W/2,98,"Ambos pueden vivir la aventura completa, pero cada uno tiene habilidades propias.",{fontSize:"15px",color:"#fff"}).setOrigin(.5);
      // Andrés card
      this.add.rectangle(285,285,330,310,0x162e50,.86).setStrokeStyle(3,0xe8c16b);
      this.add.image(285,235,"andres_idle").setScale(3.15);
      this.add.text(285,345,"ANDRÉS",{fontFamily:"Georgia,serif",fontSize:"27px",fontStyle:"bold",color:"#ffdc83"}).setOrigin(.5);
      this.add.text(285,385,"ESPADA · FUERZA · ROMPE BLOQUES\nAtaque cercano poderoso.",{fontSize:"15px",color:"#f7f1df",align:"center",lineSpacing:7}).setOrigin(.5);
      button(this,285,465,"JUGAR COMO ANDRÉS",()=>this.begin("ANDRES"),{width:270,fill:0x8e4d55,fontSize:"16px"});
      // Vannesa card
      this.add.rectangle(675,285,330,310,0x332746,.88).setStrokeStyle(3,0xf0bad2);
      this.add.image(675,235,"vannesa_idle").setScale(3.15);
      this.add.text(675,345,"VANNESA",{fontFamily:"Georgia,serif",fontSize:"27px",fontStyle:"bold",color:"#ffc4df"}).setOrigin(.5);
      this.add.text(675,385,"MAGIA · AGILIDAD · DOBLE SALTO\nProyectiles mágicos a distancia.",{fontSize:"15px",color:"#f7f1df",align:"center",lineSpacing:7}).setOrigin(.5);
      button(this,675,465,"JUGAR COMO VANNESA",()=>this.begin("VANNESA"),{width:280,fill:0x774c91,fontSize:"16px"});
      button(this,W/2,520,"VOLVER",()=>this.scene.start("Title"),{width:150,height:34,fontSize:"14px",fill:0x263653});
    }
    begin(role){const level=this.startData.level||0;const fragments=this.startData.fragments||0;if(level===0&&!this.startData.continue){for(let i=0;i<TOTAL;i++)safeSet("kol_checkpoint_"+i,100);saveProgress({level:0,role,score:0,coins:0,hearts:0,fragments:0,lives:3,checkpoint:100})}else saveProgress({level,role,score:this.startData.score||0,coins:this.startData.coins||0,hearts:this.startData.hearts||0,fragments,lives:this.startData.lives??3});const next={level,role,score:this.startData.score||0,lives:this.startData.lives??3,coins:this.startData.coins||0,hearts:this.startData.hearts||0,fragments};if(level===0&&!this.startData.continue)this.scene.start("Prologue",next);else this.scene.start("Play",next)}
  }
  class Prologue extends Phaser.Scene{
    constructor(){super("Prologue")}
    init(data){this.d=data||{};this.page=0}
    create(){
      this.cameras.main.setBackgroundColor(0x17243d);
      const bg=this.add.graphics();bg.fillGradientStyle(0x17243d,0x17243d,0x4d5976,0x263a4b,1);bg.fillRect(0,0,W,H);
      const moon=this.add.circle(760,128,88,0xf3dca2,.12);this.tweens.add({targets:moon,scale:1.12,alpha:.05,duration:2200,yoyo:true,repeat:-1});
      for(let i=0;i<50;i++){const x=Phaser.Math.Between(0,W),y=Phaser.Math.Between(0,H);const p=this.add.circle(x,y,Phaser.Math.Between(1,3),0xffe8b5,.45);this.tweens.add({targets:p,alpha:.08,duration:900+Math.random()*1500,yoyo:true,repeat:-1})}
      this.add.text(W/2,66,"PRÓLOGO · AURALIA",{fontFamily:"Georgia,serif",fontSize:"18px",fontStyle:"bold",color:"#eacb83",letterSpacing:4}).setOrigin(.5);
      const tower=this.add.image(W/2,225,"resonator").setScale(4.6);this.tweens.add({targets:tower,angle:{from:-2,to:2},duration:1800,yoyo:true,repeat:-1});
      this.add.text(W/2,330,"LA CAMPANA DEL ALBA",{fontFamily:"Georgia,serif",fontSize:"31px",fontStyle:"bold",color:"#fff0c8",stroke:"#2d2037",strokeThickness:5}).setOrigin(.5);
      this.storyText=this.add.text(W/2,390,"",{fontSize:"18px",color:"#f7edda",align:"center",wordWrap:{width:760},lineSpacing:8}).setOrigin(.5);
      this.pageText=this.add.text(W/2,452,"",{fontSize:"12px",color:"#e2c98c"}).setOrigin(.5);
      button(this,735,505,"SIGUIENTE",()=>this.nextPage(),{width:190,height:42,fontSize:"15px"});
      button(this,225,505,"SALTAR INTRO",()=>this.startGame(),{width:190,height:42,fontSize:"14px",fill:0x34435f});
      this.pages=[
        "En Auralia, cinco regiones vivían en armonía gracias a la Campana del Alba. Cada nota mantenía despiertos los ríos, los bosques, las mareas y las auroras.",
        "Una noche, el Afinador del Silencio quebró su cristal en cinco fragmentos. El sonido desapareció y los caminos del reino comenzaron a separarse.",
        `${roleLabel(this.d.role)} escuchó un eco entre las ruinas. Andrés y Vannesa emprendieron rutas distintas, pero una misma resonancia comenzó a guiarlos.`,
        "Tu viaje comienza en el Valle de las Campanas. Encuentra los resonadores, recupera las cinco notas y descubre por qué dos caminos pueden formar una sola canción."
      ];
      this.renderPage();this.input.keyboard.on("keydown-ENTER",()=>this.nextPage());
    }
    renderPage(){this.storyText.setText(this.pages[this.page]);this.pageText.setText(`✦ ${this.page+1} / ${this.pages.length} ✦`);}
    nextPage(){if(this.page<this.pages.length-1){this.page++;this.renderPage()}else this.startGame()}
    startGame(){this.scene.start("Play",this.d)}
  }

  class Options extends Phaser.Scene{
    constructor(){super("Options")}
    create(){
      makeBackdrop(this,0,false);addStarField(this,28);
      this.add.text(W/2,72,"OPCIONES",{fontFamily:"Georgia,serif",fontSize:"38px",color:"#ffdf91"}).setOrigin(.5);
      const music=safeGet("kol_music","1")==="1",sfx=safeGet("kol_sfx","1")==="1";
      this.musicText=this.add.text(W/2,155,"MÚSICA: "+(music?"ACTIVADA":"DESACTIVADA"),{fontSize:"20px",fontStyle:"bold",color:"#fff"}).setOrigin(.5).setInteractive();
      this.sfxText=this.add.text(W/2,220,"EFECTOS: "+(sfx?"ACTIVADOS":"DESACTIVADOS"),{fontSize:"20px",fontStyle:"bold",color:"#fff"}).setOrigin(.5).setInteractive();
      this.musicText.on("pointerdown",()=>{const next=safeGet("kol_music","1")==="1"?"0":"1";safeSet("kol_music",next);audio.music=next==="1";this.musicText.setText("MÚSICA: "+(next==="1"?"ACTIVADA":"DESACTIVADA"))});
      this.sfxText.on("pointerdown",()=>{const next=safeGet("kol_sfx","1")==="1"?"0":"1";safeSet("kol_sfx",next);audio.sfx=next==="1";this.sfxText.setText("EFECTOS: "+(next==="1"?"ACTIVADOS":"DESACTIVADOS"))});
      this.musicVolumeText=this.add.text(W/2,282,"VOLUMEN DE MÚSICA: "+Math.round(audio.musicVolume*100)+"%",{fontSize:"17px",color:"#ffe8b1"}).setOrigin(.5);
      button(this,W/2-155,325,"−",()=>this.adjustVolume("music",-.1),{width:58,height:38,fontSize:"22px"});
      button(this,W/2+155,325,"+",()=>this.adjustVolume("music",.1),{width:58,height:38,fontSize:"22px"});
      this.sfxVolumeText=this.add.text(W/2,365,"VOLUMEN DE EFECTOS: "+Math.round(audio.sfxVolume*100)+"%",{fontSize:"17px",color:"#ffe8b1"}).setOrigin(.5);
      button(this,W/2-155,407,"−",()=>this.adjustVolume("sfx",-.1),{width:58,height:38,fontSize:"22px"});
      button(this,W/2+155,407,"+",()=>this.adjustVolume("sfx",.1),{width:58,height:38,fontSize:"22px"});
      button(this,W/2,480,"VOLVER",()=>this.scene.start("Title"),{width:210});
      this.add.text(W/2,523,"Teclado: flechas / A-D · Espacio: saltar · F: habilidad · Shift: correr · Esc: pausa",{fontSize:"12px",color:"#d8d8e9"}).setOrigin(.5);
    }
    adjustVolume(channel,delta){
      const key=channel==="music"?"musicVolume":"sfxVolume";audio[key]=Math.max(0,Math.min(1,Math.round((audio[key]+delta)*10)/10));
      safeSet(channel==="music"?"kol_music_volume":"kol_sfx_volume",audio[key]);
      const label=channel==="music"?this.musicVolumeText:this.sfxVolumeText;
      label.setText((channel==="music"?"VOLUMEN DE MÚSICA: ":"VOLUMEN DE EFECTOS: ")+Math.round(audio[key]*100)+"%");
      playTone(channel==="music"?660:440,.08,"sine",.05,channel);
    }
  }
  class Credits extends Phaser.Scene{
    constructor(){super("Credits")}
    create(){makeBackdrop(this,4,false);addStarField(this,35);this.add.text(W/2,105,"CRÉDITOS",{fontFamily:"Georgia,serif",fontSize:"38px",color:"#ffdf91"}).setOrigin(.5);
      this.add.image(410,260,"andres_idle").setScale(2.4);this.add.image(550,260,"vannesa_idle").setScale(2.4);
      this.add.text(W/2,360,CFG.credits||"Creado con cariño para Andrés y Vannesa.",{fontSize:"20px",color:"#fff",align:"center",wordWrap:{width:700}}).setOrigin(.5);
      button(this,W/2,455,"VOLVER",()=>this.scene.start("Title"),{width:210});
    }
  }

  class Play extends Phaser.Scene{
    constructor(){super("Play")}
    init(data){this.levelIndex=Phaser.Math.Clamp(Number(data.level)||0,0,TOTAL-1);this.role=data.role||safeGet("kol_role","ANDRES");this.score=Number(data.score)||0;this.lives=data.lives===0?0:(Number(data.lives)||3);this.coinsCount=Number(data.coins)||0;this.heartsCount=Number(data.hearts)||0;this.fragmentsCount=Number(data.fragments??getProgress().fragments)||0;this.resonanceCount=0;this.checkpointX=100;this.invulnerable=0;this.actionCooldown=0;this.bossHitCooldown=0;this.finished=false;this.paused=false}
    create(){
      Object.keys(TOUCH).forEach(k=>TOUCH[k]=false);
      const level=DATA.levels[this.levelIndex],world=DATA.worlds[level.world];this.level=level;this.world=world;this.levelLength=level.length;
      this.physics.world.setBounds(0,0,this.levelLength,H);this.cameras.main.setBounds(0,0,this.levelLength,H);this.cameras.main.setBackgroundColor(world.sky);
      this.drawWorld();this.buildPlatforms();this.buildPlayer();this.buildCollectibles();this.buildResonators();this.buildEnemies();this.buildExit();this.buildHud();this.bindInput();this.startAmbience();
      if(level.boss)this.createBoss();
      this.cameras.main.startFollow(this.player,true,.10,.10);
      this.physics.world.resume();
      showToast(this,`${world.name} · NIVEL ${level.stage+1} — ${level.story||world.intro}`);
    }
    drawWorld(){
      if(this.level.world===0&&this.textures.exists("valleyPanorama")){
        this.add.tileSprite(0,0,this.levelLength,H,"valleyPanorama").setOrigin(0,0).setTileScale(.58,.58).setScrollFactor(.12).setAlpha(.92).setDepth(-5);
      }
      const g=this.add.graphics();g.fillStyle(this.world.far,1);
      for(let x=-100;x<this.levelLength+400;x+=320){const peak=138+(Math.abs(Math.floor(x/320))%3)*34;g.fillTriangle(x,405,x+160,peak,x+330,405)}
      g.setScrollFactor(.20);
      const m=this.add.graphics();m.fillStyle(this.world.near,1);
      for(let x=-100;x<this.levelLength+300;x+=220){const peak=270+(Math.abs(Math.floor(x/220))%3)*35;m.fillTriangle(x,445,x+110,peak,x+230,445)}
      m.setScrollFactor(.42);
      const clouds=this.add.graphics();clouds.fillStyle(0xffffff,.24);
      for(let x=60;x<this.levelLength;x+=390){clouds.fillCircle(x,85,22);clouds.fillCircle(x+33,78,29);clouds.fillCircle(x+70,88,21)}clouds.setScrollFactor(.12);
      // World-specific silhouettes create a distinct identity for every kingdom.
      const scenery=this.add.graphics();
      if(this.world.theme==="meadow"){
        for(let x=170;x<this.levelLength;x+=520){scenery.fillStyle(0x315b48,1);scenery.fillRect(x,330,20,110);scenery.fillStyle(0x4b8c59,1);scenery.fillCircle(x+10,318,48);scenery.fillCircle(x-18,337,30);scenery.fillCircle(x+35,340,31)}
      }else if(this.world.theme==="forest"){
        for(let x=140;x<this.levelLength;x+=390){scenery.fillStyle(0x204b3d,1);scenery.fillRect(x,260,24,185);scenery.fillStyle(0x27634c,1);scenery.fillCircle(x+12,250,75);scenery.fillCircle(x-25,282,45);scenery.fillCircle(x+50,290,48)}
      }else if(this.world.theme==="sea"){
        for(let x=170;x<this.levelLength;x+=360){scenery.fillStyle(0x8de1e5,.25);scenery.fillRect(x,315,10,125);scenery.fillStyle(0x317f9c,.70);scenery.fillRect(x-22,305,54,12);scenery.fillStyle(0xb5f4ef,.42);scenery.fillTriangle(x-28,306,x+5,260,x+38,306);scenery.fillStyle(0x153c58,.8);scenery.fillRect(x-35,430,72,9)}
      }else if(this.world.theme==="winter"){
        for(let x=170;x<this.levelLength;x+=360){scenery.fillStyle(0xd8f2ff,.34);scenery.fillTriangle(x,430,x+58,220,x+120,430);scenery.fillStyle(0x80b9dd,.34);scenery.fillTriangle(x+40,430,x+92,275,x+145,430);scenery.fillStyle(0xeaf5ff,.5);scenery.fillTriangle(x+42,280,x+58,220,x+75,280)}
      }else if(this.world.theme==="eclipse"){
        for(let x=160;x<this.levelLength;x+=430){scenery.fillStyle(0x241f39,.8);scenery.fillRect(x,255,54,190);scenery.fillTriangle(x-8,258,x+27,190,x+62,258);scenery.fillStyle(0xf6c783,.25);scenery.fillRect(x+20,300,8,26);scenery.fillStyle(0x9a5d9a,.38);scenery.fillCircle(x+27,250,12)}
      }else{
        for(let x=160;x<this.levelLength;x+=430){scenery.fillStyle(0x342846,.9);scenery.fillRect(x,285,70,160);scenery.fillTriangle(x-5,286,x+35,205,x+75,286);scenery.fillStyle(0xf3cb78,.32);scenery.fillRect(x+29,318,12,38);scenery.fillStyle(0x35283e,1);scenery.fillRect(x+25,315,20,6)}
      }
      // Stone bell towers and hanging chimes give Auralia a visual motif across the journey.
      for(let x=420;x<this.levelLength;x+=690){
        scenery.fillStyle(0x4a4e60,.72);scenery.fillRect(x,330,28,108);scenery.fillTriangle(x-8,332,x+14,290,x+36,332);scenery.fillStyle(this.world.accent,.82);scenery.fillRect(x+8,311,12,18);scenery.fillStyle(0x2f2c3d,.8);scenery.fillCircle(x+14,322,6);scenery.fillStyle(0xffe7a2,.85);scenery.fillRect(x+12,316,4,12);
      }
      scenery.setScrollFactor(.55);
      const decor=this.add.graphics();decor.fillStyle(this.world.accent,.42);
      for(let x=120;x<this.levelLength;x+=300){decor.fillCircle(x,449,5);decor.fillCircle(x+13,445,4);decor.fillRect(x+5,449,2,12)}
      decor.setDepth(2);
      // Gentle ambient glints; kept deliberately sparse for low-end devices.
      this.ambientTimer=this.time.addEvent({delay:1050,loop:true,callback:()=>{
        if(!this.sys.isActive()||this.finished)return;
        const cx=this.cameras.main.scrollX+Phaser.Math.Between(40,W-40),cy=Phaser.Math.Between(90,390);
        const spark=this.add.image(cx,cy,"magic").setScale(.45).setAlpha(.0).setDepth(4);
        this.tweens.add({targets:spark,alpha:.55,y:cy-16,duration:850,yoyo:true,onComplete:()=>spark.destroy()});
      }});
    }
    buildPlatforms(){
      this.platforms=this.physics.add.staticGroup();
      const floor=this.platforms.create(this.levelLength/2,FLOOR+20,"ground");floor.setDisplaySize(this.levelLength,70).refreshBody();floor.setAlpha(0);
      this.floorArt=this.add.tileSprite(0,FLOOR-15,this.levelLength,70,"ground").setOrigin(0,0).setTint(this.world.ground).setDepth(1);
      const layout=this.level;
      layout.platforms.forEach(([x,y,w])=>{const p=this.platforms.create(x,y,"platform");p.setDisplaySize(w,24).setTint(this.world.platform).refreshBody();p.setDepth(3)});
      if(layout.bossArena){const [a,b]=layout.bossArena;for(let i=0;i<5;i++){const x=a+70+i*95;const p=this.platforms.create(x,390-(i%2)*42,"platform");p.setDisplaySize(82,22).setTint(this.world.platform).refreshBody();p.setDepth(3)}}
      this.movingPlatforms=this.physics.add.group({allowGravity:false,immovable:true});
      layout.moving.forEach(([x,y,w,min,max,speed])=>{const p=this.movingPlatforms.create(x,y,"moving_platform");p.setDisplaySize(w,22);p.setImmovable(true);p.body.setAllowGravity(false);p.setVelocityX(speed);p.setData("minX",min);p.setData("maxX",max);p.setData("travelSpeed",speed);p.setDepth(4)});
      this.crumblePlatforms=this.physics.add.group({allowGravity:false,immovable:true});
      layout.crumbles.forEach(([x,y,w])=>{const p=this.crumblePlatforms.create(x,y,"platform_crumble");p.setDisplaySize(w,22);p.setImmovable(true);p.body.setAllowGravity(false);p.setData("homeX",x);p.setData("homeY",y);p.setData("crumbling",false);p.setDepth(4)});
      this.breakables=this.physics.add.staticGroup();
      layout.breakables.forEach(([x,y])=>{const b=this.breakables.create(x,y,"block");b.setDepth(4).refreshBody()});
      this.traps=this.physics.add.staticGroup();
      layout.traps.forEach(([x,kind,y,w])=>{const key=kind==="fire"?"fire":kind==="ice"?"ice":kind==="thorn"?"thorn":"spike";const trap=this.traps.create(x,y,key);trap.setDisplaySize(w,kind==="fire"?30:22).refreshBody();trap.setDepth(5);trap.setData("kind",kind)});
    }
    activateCrumble(platform){
      if(!platform?.active||platform.getData("crumbling"))return;
      platform.setData("crumbling",true);platform.setTint(0xffb0a0);playTone(170,.07,"square",.02);
      this.time.delayedCall(520,()=>{if(!platform.active)return;const x=platform.getData("homeX"),y=platform.getData("homeY");platform.disableBody(true,true);
        this.time.delayedCall(3000,()=>{if(!this.sys.isActive())return;platform.enableBody(false,x,y,true,true);platform.setData("crumbling",false);platform.clearTint()});
      });
    }
    buildCollectibles(){
      this.coins=this.physics.add.group({allowGravity:false,immovable:true});
      this.level.coinTracks.forEach(([x,y,n,dx,curve])=>{for(let j=0;j<n;j++){const yy=y+(curve?Math.sin((j/(Math.max(1,n-1)))*Math.PI)*curve:0);const c=this.coins.create(x+j*dx,yy,"coin");c.body.setAllowGravity(false);c.body.setCircle(7);this.tweens.add({targets:c,angle:360,duration:1350,repeat:-1})}});
      this.hearts=this.physics.add.group({allowGravity:false,immovable:true});
      this.level.hearts.forEach(([x,y])=>{const h=this.hearts.create(x,y,"heart");h.body.setAllowGravity(false);this.tweens.add({targets:h,y:y-7,duration:850,yoyo:true,repeat:-1,ease:"Sine.inOut"})});
      this.stars=this.physics.add.group({allowGravity:false,immovable:true});
      const st=this.stars.create(this.level.star[0],this.level.star[1],"star");st.body.setAllowGravity(false);this.tweens.add({targets:st,angle:360,duration:2400,repeat:-1});
      this.secrets=this.physics.add.group({allowGravity:false,immovable:true});
      const gem=this.secrets.create(this.level.secret[0],this.level.secret[1],"gem");gem.body.setAllowGravity(false);this.tweens.add({targets:gem,alpha:.35,duration:700,yoyo:true,repeat:-1});
      this.checkpoints=this.physics.add.staticGroup();this.level.checkpoints.forEach(x=>this.checkpoints.create(x,FLOOR-25,"checkpoint"));
      this.physics.add.overlap(this.player,this.coins,(_,c)=>{if(!c.active)return;c.destroy();this.coinsCount++;this.score+=50;playTone(790,.055,"square",.03);this.updateHud();saveProgress({level:this.levelIndex,role:this.role,score:this.score,coins:this.coinsCount,hearts:this.heartsCount,fragments:this.fragmentsCount,lives:this.lives,checkpoint:this.checkpointX})});
      this.physics.add.overlap(this.player,this.hearts,(_,h)=>{if(!h.active)return;h.destroy();this.heartsCount++;this.score+=150;this.updateHud();showToast(this,"UN CORAZÓN MÁS PARA EL VIAJE ♥");playTone(660,.18,"sine",.04);saveProgress({level:this.levelIndex,role:this.role,score:this.score,coins:this.coinsCount,hearts:this.heartsCount,fragments:this.fragmentsCount,lives:this.lives,checkpoint:this.checkpointX})});
      this.physics.add.overlap(this.player,this.stars,(_,s)=>{if(!s.active)return;s.destroy();this.powerUntil=this.time.now+7500;this.player.setTint(0xffdf87);this.score+=500;this.updateHud();showToast(this,"¡BENDICIÓN DE LOS DOS REINOS!");playTone(880,.22,"triangle",.05)});
      this.physics.add.overlap(this.player,this.secrets,(_,g)=>{if(!g.active)return;g.destroy();this.score+=350;this.updateHud();this.showMemory();this.floatText(g.x,g.y-22,"RECUERDO SECRETO +350")});
      this.physics.add.overlap(this.player,this.checkpoints,(_,point)=>{if(point.x>this.checkpointX){this.checkpointX=point.x;safeSet("kol_checkpoint_"+this.levelIndex,this.checkpointX);saveProgress({level:this.levelIndex,role:this.role,score:this.score,coins:this.coinsCount,hearts:this.heartsCount,fragments:this.fragmentsCount,lives:this.lives,checkpoint:this.checkpointX});showToast(this,"PUNTO DE CONTROL ACTIVADO");playTone(520,.1)}});
    }
    buildResonators(){
      this.resonators=this.physics.add.group({allowGravity:false,immovable:true});
      (this.level.resonators||[]).forEach(([x,y],index)=>{
        const bell=this.resonators.create(x,y,"resonator");bell.body.setAllowGravity(false);bell.body.setSize(22,38).setOffset(5,4);bell.setDepth(9);bell.setData("index",index);
        this.tweens.add({targets:bell,angle:{from:-4,to:4},duration:1150,yoyo:true,repeat:-1,ease:"Sine.inOut"});
        const glow=this.add.circle(x,y,27,this.world.accent,.10).setDepth(7);
        this.tweens.add({targets:glow,scale:1.5,alpha:.02,duration:1250,yoyo:true,repeat:-1});
      });
      if(this.resonators.countActive()>0){
        this.resonatorHint=this.add.text(0,0,"E · RESONAR",{fontSize:"11px",fontStyle:"bold",color:"#fff0bd",stroke:"#342743",strokeThickness:3}).setOrigin(.5).setDepth(12);
        this.resonatorHint.setVisible(false);
      }
    }
    ringResonance(){
      if(this.time.now<(this.resonanceCooldown||0))return;
      const bell=this.resonators?.getChildren().find(node=>node.active);
      if(!bell){showToast(this,"EL ECO YA HA DESPERTADO ESTE CAMINO.");return}
      const distance=Phaser.Math.Distance.Between(this.player.x,this.player.y,bell.x,bell.y);
      if(distance>138){showToast(this,"ACÉRCATE AL RESONADOR PARA ESCUCHAR SU ECO.");return}
      this.resonanceCooldown=this.time.now+1000;bell.destroy();this.resonanceCount++;this.score+=250;
      const echoRole=this.role==="VANNESA"?"ANDRES":"VANNESA";
      const echo=this.add.image(this.player.x-this.facing*42,this.player.y,charTexture(echoRole,"victory")).setAlpha(.78).setTint(this.world.accent).setFlipX(this.facing<0).setDepth(11);
      this.tweens.add({targets:echo,x:this.player.x+this.facing*96,y:this.player.y-16,alpha:0,duration:720,ease:"Sine.out",onComplete:()=>echo.destroy()});
      const pulse=this.add.circle(bell.x,bell.y,18,this.world.accent,.35).setDepth(20);
      this.tweens.add({targets:pulse,scale:9,alpha:0,duration:620,onComplete:()=>pulse.destroy()});
      for(let i=0;i<3;i++){
        const ring=this.add.circle(bell.x,bell.y,28+i*12,this.world.accent,0).setStrokeStyle(3,this.world.accent,.7).setDepth(19);
        this.tweens.add({targets:ring,scale:3.2,alpha:0,duration:680+i*90,delay:i*75,onComplete:()=>ring.destroy()});
      }
      // The bell reveals a short, climbable echo-bridge. Both protagonists can use it.
      const bridge=this.level.boss
        ?[{x:bell.x-150,y:390,w:88},{x:bell.x-40,y:348,w:88},{x:bell.x+70,y:390,w:88}]
        :[{x:bell.x+112,y:390,w:92},{x:bell.x+230,y:350,w:92},{x:bell.x+348,y:390,w:92}];
      bridge.forEach((p,i)=>{if(p.x<this.levelLength-90){const step=this.platforms.create(p.x,p.y,"moving_platform");step.setDisplaySize(p.w,18).setTint(this.world.accent).refreshBody();step.setDepth(6);this.tweens.add({targets:step,y:p.y-5,duration:800+i*100,yoyo:true,repeat:-1,ease:"Sine.inOut",onUpdate:()=>step.refreshBody()})}});
      this.enemies?.children.iterate(enemy=>{if(enemy?.active&&Phaser.Math.Distance.Between(enemy.x,enemy.y,bell.x,bell.y)<245){enemy.setVelocityX(0);enemy.setTint(this.world.accent);this.time.delayedCall(950,()=>{if(enemy.active){enemy.clearTint();enemy.setVelocityX((enemy.x<this.player.x?-1:1)*(enemy.getData("baseSpeed")||65))}})}});
      if(this.boss?.active&&Phaser.Math.Distance.Between(this.boss.x,this.boss.y,bell.x,bell.y)<270)this.damageBoss(1);
      this.floatText(bell.x,bell.y-48,"RESONANCIA · +250");showToast(this,`EL ECO DE ${roleLabel(echoRole)} RESPONDE. UN PUENTE APARECE.`);playTone(392,.22,"sine",.045);this.time.delayedCall(100,()=>playTone(587,.28,"sine",.045));this.time.delayedCall(205,()=>playTone(784,.38,"sine",.045));this.updateHud();
      saveProgress({level:this.levelIndex,role:this.role,score:this.score,coins:this.coinsCount,hearts:this.heartsCount,fragments:this.fragmentsCount,lives:this.lives,checkpoint:this.checkpointX});
    }
    buildEnemies(){
      this.enemies=this.physics.add.group();
      this.level.enemies.forEach(([x,kind,min,max,speed])=>{
        const key="enemy_"+kind;const e=this.enemies.create(x,kind==="moth"?FLOOR-125:FLOOR-23,this.textures.exists(key)?key:"enemy");
        e.setCollideWorldBounds(true);e.setBounce(0,0);e.setVelocityX(speed*(Math.random()<.5?-1:1));e.setData("kind",kind);e.setData("minX",min);e.setData("maxX",max);e.setData("baseY",e.y);e.setData("baseSpeed",speed);e.setData("hp",kind==="guard"?2:1);e.setDepth(8);
        if(kind==="moth"){e.body.setAllowGravity(false);e.body.setSize(25,18).setOffset(5,7)}else{e.body.setSize(25,22).setOffset(4,7)}
      });
      this.physics.add.collider(this.enemies,this.platforms);
      this.physics.add.overlap(this.projectiles,this.enemies,(shot,e)=>{if(!shot.active||!e.active)return;shot.destroy();this.killEnemy(e)});
      this.physics.add.overlap(this.player,this.enemies,(p,e)=>this.enemyContact(p,e),undefined,this);
    }
    buildPlayer(){
      const savedCp=Number(safeGet("kol_checkpoint_"+this.levelIndex,"100"))||100;this.checkpointX=Math.max(100,Math.min(this.levelLength-200,savedCp));
      this.player=this.physics.add.sprite(this.checkpointX,FLOOR-38,charTexture(this.role,"idle"));this.player.setScale(1.2);this.player.setCollideWorldBounds(true);this.player.setDepth(10);this.player.setDragX(this.level.world===2?360:1100);this.player.setMaxVelocity(310,650);this.player.body.setSize(21,39).setOffset(5,7);
      this.maxJumps=this.role==="VANNESA"?2:1;this.jumpCount=0;this.facing=1;this.lastTouchJump=false;this.lastTouchAction=false;this.wasGrounded=false;
      this.physics.add.collider(this.player,this.platforms);
      this.physics.add.collider(this.player,this.breakables);
      this.physics.add.collider(this.player,this.movingPlatforms);
      this.physics.add.collider(this.player,this.crumblePlatforms,(player,platform)=>this.activateCrumble(platform),null,this);
      if(this.traps)this.physics.add.overlap(this.player,this.traps,()=>this.hurt(),undefined,this);
      this.projectiles=this.physics.add.group({allowGravity:false});
      this.physics.add.collider(this.projectiles,this.platforms,shot=>shot.destroy());
      this.hazards=this.physics.add.group({allowGravity:false});
      this.physics.add.overlap(this.player,this.hazards,()=>this.hurt(),undefined,this);
    }
    buildExit(){
      this.exit=this.physics.add.staticSprite(this.levelLength-85,FLOOR-34,"door");this.exit.setDepth(3);this.physics.add.overlap(this.player,this.exit,()=>this.tryExit());
    }
    buildHud(){
      const bg=this.add.rectangle(W/2,27,W,54,0x101629,.88).setScrollFactor(0).setDepth(40);
      this.hudName=this.add.text(18,8,`${roleLabel(this.role)}  ·  ${this.world.name}`,{fontSize:"14px",fontStyle:"bold",color:"#ffe8b1"}).setScrollFactor(0).setDepth(41);
      this.hudStats=this.add.text(18,30,"",{fontSize:"13px",color:"#fff"}).setScrollFactor(0).setDepth(41);
      this.progressBg=this.add.rectangle(W-220,41,150,7,0x241b38,1).setOrigin(0,.5).setScrollFactor(0).setDepth(41);
      this.progressFill=this.add.rectangle(W-220,41,2,5,0xffd16e,1).setOrigin(0,.5).setScrollFactor(0).setDepth(42);
      this.pauseLabel=this.add.text(W-72,10,"Ⅱ PAUSA",{fontSize:"15px",fontStyle:"bold",color:"#ffe2a0"}).setScrollFactor(0).setDepth(42).setInteractive();this.pauseLabel.on("pointerdown",()=>this.togglePause());
      if(this.level.boss){this.bossHud=this.add.text(W/2,66,"",{fontSize:"15px",fontStyle:"bold",color:"#ffb2c2",stroke:"#24152e",strokeThickness:3}).setOrigin(.5).setScrollFactor(0).setDepth(42)}
      this.updateHud();
      if(this.levelIndex===0)this.add.text(W/2,H-18,"MOVER: A/D o ← →   SALTAR: ESPACIO   HABILIDAD: F   RESONANCIA: E   PAUSA: ESC",{fontSize:"11px",color:"#fff1cf",stroke:"#1b1830",strokeThickness:3}).setOrigin(.5).setScrollFactor(0).setDepth(42);
    }
    bindInput(){
      this.cursors=this.input.keyboard.createCursorKeys();
      this.keys=this.input.keyboard.addKeys({a:Phaser.Input.Keyboard.KeyCodes.A,d:Phaser.Input.Keyboard.KeyCodes.D,w:Phaser.Input.Keyboard.KeyCodes.W,space:Phaser.Input.Keyboard.KeyCodes.SPACE,shift:Phaser.Input.Keyboard.KeyCodes.SHIFT,action:Phaser.Input.Keyboard.KeyCodes.F,attack:Phaser.Input.Keyboard.KeyCodes.X,resonance:Phaser.Input.Keyboard.KeyCodes.E});
      this.input.keyboard.on("keydown-ESC",()=>this.togglePause());
    }
    startAmbience(){startMusic(this,this.level.world);}
    updateHud(){if(this.hudStats)this.hudStats.setText(`♥ ${this.lives}   ✦ ${this.score}   ◉ ${this.coinsCount}   ♡ ${this.heartsCount}   ♫ ${this.fragmentsCount}/5   NIVEL ${this.levelIndex+1}/15`);if(this.progressFill)this.progressFill.width=Math.max(2,146*Math.min(1,this.player?this.player.x/this.levelLength:0));if(this.player&&Number.isFinite(this.levelIndex))saveProgress({level:this.levelIndex,role:this.role,score:this.score,coins:this.coinsCount,hearts:this.heartsCount,fragments:this.fragmentsCount,lives:this.lives,checkpoint:this.checkpointX})}
    showMemory(){
      if(this.memorySeen)return;this.memorySeen=true;
      const memories=Array.isArray(CFG.secretMemories)?CFG.secretMemories.filter(v=>typeof v==="string"&&v.trim()):[];
      const msg=memories.length?memories[this.levelIndex%memories.length]:"Un pequeño secreto de este reino: escribe aquí un recuerdo de ustedes en src/config.js.";
      showToast(this,msg.slice(0,100));
    }
    enemyContact(player,enemy){
      if(!enemy.active||this.invulnerable>0)return;
      if(player.body.velocity.y>120&&player.y<enemy.y-5){this.killEnemy(enemy);player.setVelocityY(-300)}else this.hurt();
    }
    killEnemy(enemy){if(!enemy||!enemy.active)return;const hp=(enemy.getData("hp")||1)-1;if(hp>0){enemy.setData("hp",hp);enemy.setTint(0xffd16e);enemy.setVelocityX(-enemy.body.velocity.x*1.35);this.time.delayedCall(180,()=>{if(enemy.active)enemy.clearTint()});playTone(190,.06,"square",.03);return}const x=enemy.x,y=enemy.y;enemy.destroy();this.score+=150;this.updateHud();this.floatText(x,y-20,"+150");playTone(250,.07,"square",.035)}
    createBoss(){
      const arena=this.level.bossArena||[this.levelLength-650,this.levelLength-40];
      this.bossBounds={min:arena[0]+70,max:arena[1]-80};
      const bossKeys=["boss_bell","boss_firefly_queen","boss_leviathan","boss_aurora_watcher","boss_tuner"];
      const bossKey=bossKeys[this.level.world]&&this.textures.exists(bossKeys[this.level.world])?bossKeys[this.level.world]:"boss";
      this.boss=this.physics.add.sprite(this.bossBounds.max-80,FLOOR-58,bossKey);this.boss.setScale(1.4);this.boss.setTint(this.world.foe);this.boss.setImmovable(true);this.boss.body.setAllowGravity(false);this.boss.setCollideWorldBounds(true);this.boss.setVelocityX(-95);this.boss.setDepth(9);
      this.boss.body.setSize(46,55).setOffset(9,8);
      this.bossHp=6+this.level.world*2;this.bossMaxHp=this.bossHp;this.bossPhase=1;this.bossAttackCount=0;this.bossDefeated=false;
      this.physics.add.overlap(this.player,this.boss,()=>{
        if(this.player.body.velocity.y>100&&this.player.y<this.boss.y-20){this.damageBoss(1);this.player.setVelocityY(-330)}else if(this.invulnerable<=0)this.hurt();
      });
      this.physics.add.overlap(this.projectiles,this.boss,shot=>{shot.destroy();this.damageBoss(1)});
      this.bossTimer=this.time.addEvent({delay:1500,loop:true,callback:()=>this.bossAttack()});
      const bossTitle=this.level.world===4?(CFG.villainName||this.world.boss):this.world.boss;
      this.bossName=this.add.text(W/2,88,bossTitle,{fontSize:"13px",color:"#fff1d0",fontStyle:"bold"}).setOrigin(.5).setScrollFactor(0).setDepth(42);
      this.bossBarBg=this.add.rectangle(W/2,112,260,10,0x21182c,.95).setScrollFactor(0).setDepth(42);
      this.bossBar=this.add.rectangle(W/2-128,112,256,6,0xff647e,1).setOrigin(0,.5).setScrollFactor(0).setDepth(43);
      this.updateBossHud();showToast(this,"¡DESAFÍO FINAL! OBSERVA SUS PATRONES.");
    }
    updateBossHud(){if(this.bossBar)this.bossBar.width=256*Math.max(0,this.bossHp/this.bossMaxHp);if(this.bossHud)this.bossHud.setText("JEFE · FASE "+this.bossPhase+" · "+Math.max(0,this.bossHp)+" / "+this.bossMaxHp)}
    bossAttack(){
      if(!this.boss?.active||this.finished||this.paused)return;
      this.bossAttackCount++;const direction=this.player.x<this.boss.x?-1:1;
      const spawn=(vx,vy=0,delay=0)=>this.time.delayedCall(delay,()=>{
        if(!this.boss?.active||this.finished)return;
        const key=this.level.world===2?"ice":this.level.world===3||this.level.world===4?"fireball":"hazard";
        const h=this.hazards.create(this.boss.x-18,this.boss.y+8,key);h.body.setAllowGravity(false);h.setVelocity(vx,vy);h.setTint(this.world.accent);h.setDepth(7);
        this.time.delayedCall(4200,()=>{if(h.active)h.destroy()});
      });
      const pattern=this.bossAttackCount%3;
      if(this.bossPhase===1||pattern===1){spawn(direction*220,-15)}
      else if(this.bossPhase===2||pattern===2){spawn(direction*220,-55);spawn(direction*250,0,130);spawn(direction*220,55,260)}
      else{
        // Final phase: a marked ground sweep followed by a fast aimed shot.
        const targetX=Phaser.Math.Clamp(this.player.x,this.bossBounds.min,this.bossBounds.max);
        const warning=this.add.rectangle(targetX,FLOOR-7,82,8,0xff625f,.65).setDepth(7);
        this.tweens.add({targets:warning,alpha:0,duration:480,onComplete:()=>warning.destroy()});
        this.time.delayedCall(500,()=>{if(!this.sys.isActive()||this.finished)return;for(let i=-1;i<=1;i++)spawn(i*210+direction*90,0,i*0+0)});
        spawn(direction*310,-25,650);
      }
      const speed=this.bossPhase===3?155:this.bossPhase===2?120:90;
      this.boss.setVelocityX(direction*-speed);
    }
    damageBoss(amount){
      if(!this.boss?.active||this.time.now<this.bossHitCooldown||this.bossDefeated)return;
      this.bossHitCooldown=this.time.now+280;this.bossHp-=amount;this.boss.setTint(0xffffff);this.time.delayedCall(100,()=>{if(this.boss?.active)this.boss.setTint(this.world.foe)});
      const ratio=this.bossHp/this.bossMaxHp;
      if(ratio<=.30&&this.bossPhase<3){this.bossPhase=3;this.bossTimer.delay=860;showToast(this,"¡FASE FINAL! ¡NO TE RINDAS!")}
      else if(ratio<=.65&&this.bossPhase<2){this.bossPhase=2;this.bossTimer.delay=1120;showToast(this,"EL GUARDIÁN CAMBIA SU ESTRATEGIA")}
      this.updateBossHud();this.score+=100;this.updateHud();playTone(180,.11,"sawtooth",.045);
      if(this.bossHp<=0){this.bossDefeated=true;this.bossTimer?.remove(false);this.boss.destroy();if(this.bossBar)this.bossBar.destroy();if(this.bossBarBg)this.bossBarBg.destroy();this.score+=1000;this.fragmentsCount=Math.max(this.fragmentsCount,this.level.world+1);this.updateHud();showToast(this,`FRAGMENTO ${this.fragmentsCount}/5 RECUPERADO · LA CAMPANA RECUERDA`);playTone(740,.3,"triangle",.05);saveProgress({level:this.levelIndex,role:this.role,score:this.score,coins:this.coinsCount,hearts:this.heartsCount,fragments:this.fragmentsCount,lives:this.lives,checkpoint:this.checkpointX})}
    }
    performAction(){
      if(this.time.now<this.actionCooldown)return;this.actionCooldown=this.time.now+(this.role==="VANNESA"?480:390);
      if(this.role==="VANNESA"){
        this.attackUntil=this.time.now+210;const p=this.projectiles.create(this.player.x+this.facing*24,this.player.y-2,"magic");p.body.setAllowGravity(false);p.setVelocityX(this.facing*390);p.setTint(0xffc4ff);p.setDepth(8);this.time.delayedCall(1800,()=>{if(p.active)p.destroy()});playTone(620,.09,"sine",.045);
      }else{
        this.attackUntil=this.time.now+240;this.player.setTexture(charTexture(this.role,"attack"));
        const center=this.player.x+this.facing*42;
        this.enemies.children.iterate(e=>{if(e?.active&&Math.abs(e.x-center)<62&&Math.abs(e.y-this.player.y)<58)this.killEnemy(e)});
        if(this.boss?.active&&Math.abs(this.boss.x-center)<90&&Math.abs(this.boss.y-this.player.y)<90)this.damageBoss(1);
        this.breakables.children.iterate(b=>{if(b?.active&&Math.abs(b.x-center)<64&&Math.abs(b.y-this.player.y)<70){const x=b.x,y=b.y;b.destroy();this.score+=100;this.updateHud();this.floatText(x,y-15,"¡SECRETO!")}});
        playTone(145,.10,"sawtooth",.05);
      }
    }
    hurt(){
      if(this.invulnerable>0||this.finished)return;if(this.powerUntil&&this.time.now<this.powerUntil){showToast(this,"EL ESCUDO DEL AMOR TE PROTEGE");return}this.lives--;this.invulnerable=1400;this.player.setTint(0xff7777);this.player.setVelocity(-this.facing*170,-240);this.updateHud();saveProgress({level:this.levelIndex,role:this.role,score:this.score,coins:this.coinsCount,hearts:this.heartsCount,fragments:this.fragmentsCount,lives:this.lives,checkpoint:this.checkpointX});playTone(105,.22,"sawtooth",.05);
      this.time.delayedCall(430,()=>{if(this.player?.active)this.player.clearTint()});
      if(this.lives<=0){this.time.delayedCall(450,()=>this.scene.start("GameOver",{level:this.levelIndex,role:this.role,score:this.score,coins:this.coinsCount,hearts:this.heartsCount,fragments:this.fragmentsCount}));}
    }
    floatText(x,y,message){const t=this.add.text(x,y,message,{fontSize:"17px",fontStyle:"bold",color:"#fff2af",stroke:"#38243f",strokeThickness:4}).setOrigin(.5).setDepth(30);this.tweens.add({targets:t,y:y-40,alpha:0,duration:850,onComplete:()=>t.destroy()})}
    tryExit(){
      if(this.finished)return;
      if(this.level.boss&&!this.bossDefeated){if(this.time.now>(this.exitHintTime||0)){showToast(this,"EL PORTAL ESTÁ SELLADO. DERROTA AL JEFE.");this.exitHintTime=this.time.now+1800}return}
      this.completeLevel();
    }
    completeLevel(){
      if(this.finished)return;this.finished=true;const next=this.levelIndex+1;saveProgress({level:Math.min(next,TOTAL-1),role:this.role,score:this.score,coins:this.coinsCount,hearts:this.heartsCount,fragments:this.fragmentsCount,lives:this.lives,checkpoint:100});
      safeSet("kol_checkpoint_"+this.levelIndex,100);if(next<TOTAL)safeSet("kol_checkpoint_"+next,100);
      if(next<TOTAL)this.scene.start("Intermission",{level:this.levelIndex,next,role:this.role,score:this.score,lives:this.lives,coins:this.coinsCount,hearts:this.heartsCount,fragments:this.fragmentsCount});
      else this.scene.start("Finale",{score:this.score,hearts:this.heartsCount,role:this.role,fragments:this.fragmentsCount});
    }
    togglePause(){
      if(this.paused){this.physics.world.resume();this.pausePanel?.destroy(true);this.pausePanel=null;this.paused=false;return}
      this.paused=true;this.physics.world.pause();
      this.pausePanel=this.add.container(0,0).setScrollFactor(0).setDepth(120);
      const shade=this.add.rectangle(W/2,H/2,W,H,0x0b1020,.9);const title=this.add.text(W/2,145,"PAUSA",{fontFamily:"Georgia,serif",fontSize:"42px",color:"#ffdc8b"}).setOrigin(.5);
      this.pausePanel.add([shade,title]);
      button(this,W/2,225,"CONTINUAR",()=>this.togglePause(),{width:250}).forEach(o=>this.pausePanel.add(o));
      button(this,W/2,290,"CAMBIAR PROTAGONISTA",()=>this.scene.start("Select",{level:this.levelIndex,score:this.score,lives:this.lives,coins:this.coinsCount,hearts:this.heartsCount,fragments:this.fragmentsCount,continue:true}),{width:300,fill:0x754b83,fontSize:"16px"}).forEach(o=>this.pausePanel.add(o));
      button(this,W/2,355,"VOLVER AL MENÚ",()=>this.scene.start("Title"),{width:250,fill:0x263d62,fontSize:"16px"}).forEach(o=>this.pausePanel.add(o));
    }
    update(time,delta){
      if(this.paused||!this.player?.active||this.finished)return;
      const left=this.cursors.left.isDown||this.keys.a.isDown||TOUCH.left;
      const right=this.cursors.right.isDown||this.keys.d.isDown||TOUCH.right;
      const jumpKey=Phaser.Input.Keyboard.JustDown(this.keys.space)||Phaser.Input.Keyboard.JustDown(this.cursors.up)||Phaser.Input.Keyboard.JustDown(this.keys.w);
      const jumpTouch=TOUCH.jump&&!this.lastTouchJump;this.lastTouchJump=TOUCH.jump;
      const jumpHeld=this.keys.space.isDown||this.cursors.up.isDown||this.keys.w.isDown||TOUCH.jump;
      const actionKey=Phaser.Input.Keyboard.JustDown(this.keys.action)||Phaser.Input.Keyboard.JustDown(this.keys.attack);
      const actionTouch=TOUCH.action&&!this.lastTouchAction;this.lastTouchAction=TOUCH.action;
      const resonanceKey=Phaser.Input.Keyboard.JustDown(this.keys.resonance);
      const resonanceTouch=TOUCH.resonance&&!this.lastTouchResonance;this.lastTouchResonance=TOUCH.resonance;
      const run=this.keys.shift.isDown||TOUCH.run;const speed=run?275:185;
      if(left){this.player.setVelocityX(-speed);this.facing=-1;this.player.setFlipX(true)}else if(right){this.player.setVelocityX(speed);this.facing=1;this.player.setFlipX(false)}else if(this.level.world===2){this.player.setVelocityX(this.player.body.velocity.x*Math.pow(.965,delta/16.666))}else this.player.setVelocityX(0);
      const grounded=this.player.body.blocked.down||this.player.body.touching.down;
      if(grounded)this.jumpCount=0;
      if((jumpKey||jumpTouch)&&this.jumpCount<this.maxJumps){this.player.setVelocityY(this.jumpCount===0?-418:-365);this.jumpCount++;this.jumpStartedAt=time;this.jumpHeldFrames=0;playTone(420,.07,"square",.025)}
      if(jumpHeld&&this.player.body.velocity.y<0&&this.jumpStartedAt&&time-this.jumpStartedAt<170){this.player.setVelocityY(Math.max(-470,this.player.body.velocity.y-18));this.jumpHeldFrames=(this.jumpHeldFrames||0)+1}
      if(!jumpHeld)this.jumpStartedAt=0;
      if(actionKey||actionTouch)this.performAction();
      if(resonanceKey||resonanceTouch)this.ringResonance();
      const nearbyBell=this.resonators?.getChildren().find(node=>node.active&&Phaser.Math.Distance.Between(this.player.x,this.player.y,node.x,node.y)<155);
      if(this.resonatorHint){this.resonatorHint.setPosition(this.player.x,this.player.y-52).setVisible(!!nearbyBell);}
      if(this.player.x>this.levelLength-100)this.player.x=this.levelLength-100;
      // Conveyors are updated explicitly so moving platforms stay bounded and deterministic.
      this.movingPlatforms?.children.iterate(p=>{if(!p?.active)return;const min=p.getData("minX"),max=p.getData("maxX"),v=Math.abs(p.getData("travelSpeed")||60);if(p.x<=min)p.setVelocityX(v);else if(p.x>=max)p.setVelocityX(-v)});
      this.enemies.children.iterate(e=>{
        if(!e?.active)return;const kind=e.getData("kind"),min=e.getData("minX"),max=e.getData("maxX"),base=e.getData("baseSpeed")||75;
        if(kind==="moth"){e.y=e.getData("baseY")+Math.sin(time/310+e.x/90)*24}
        if(kind==="shade"&&Math.abs(e.x-this.player.x)<250)e.setVelocityX(Math.sign(this.player.x-e.x)*base*1.35);
        if(kind==="guard"&&Math.abs(e.x-this.player.x)<180)e.setVelocityX(Math.sign(this.player.x-e.x)*base*1.15);
        if(e.x<min)e.setVelocityX(Math.abs(e.body.velocity.x));if(e.x>max)e.setVelocityX(-Math.abs(e.body.velocity.x));
      });
      if(this.boss?.active){if(this.boss.x<this.bossBounds.min)this.boss.setVelocityX(Math.abs(this.boss.body.velocity.x));if(this.boss.x>this.bossBounds.max)this.boss.setVelocityX(-Math.abs(this.boss.body.velocity.x))}
      if(this.invulnerable>0){this.invulnerable-=delta;if(Math.floor(time/90)%2===0)this.player.setAlpha(.55);else this.player.setAlpha(1)}else this.player.setAlpha(1);
      if(this.powerUntil&&time>this.powerUntil){this.player.clearTint();this.powerUntil=0}
      if(this.player.y>H+100){this.lives--;this.updateHud();saveProgress({level:this.levelIndex,role:this.role,score:this.score,coins:this.coinsCount,hearts:this.heartsCount,fragments:this.fragmentsCount,lives:this.lives,checkpoint:this.checkpointX});if(this.lives<=0)this.scene.start("GameOver",{level:this.levelIndex,role:this.role,score:this.score,coins:this.coinsCount,hearts:this.heartsCount,fragments:this.fragmentsCount});else{this.player.setPosition(this.checkpointX,FLOOR-38);this.player.setVelocity(0,0);this.invulnerable=1200}}
      const groundedNow=this.player.body.blocked.down||this.player.body.touching.down;
      let pose="idle";
      if(this.invulnerable>0)pose="hurt";else if(time<(this.attackUntil||0))pose=this.role==="VANNESA"?"cast":"attack";else if(!groundedNow)pose=this.player.body.velocity.y<0?"jump":"fall";else if(Math.abs(this.player.body.velocity.x)>20)pose=(Math.floor(time/(run?85:135))%2===0?"walk1":"walk2");
      if(time>(this.lastPoseTime||0)+70){const key=charTexture(this.role,pose);if(this.player.texture.key!==key)this.player.setTexture(key);this.lastPoseTime=time}
      if(this.progressFill)this.progressFill.width=Math.max(2,146*Math.min(1,this.player.x/this.levelLength));
    }
  }

  class Intermission extends Phaser.Scene{
    constructor(){super("Intermission")}
    init(data){this.d=data}
    create(){const d=this.d,level=DATA.levels[d.level],world=DATA.worlds[level.world];makeBackdrop(this,level.world,false);addStarField(this,32);
      this.add.text(W/2,105,"¡CAPÍTULO COMPLETADO!",{fontFamily:"Georgia,serif",fontSize:"36px",color:"#fff0be",stroke:"#46334b",strokeThickness:4}).setOrigin(.5);
      this.add.text(W/2,180,world.name+"\n"+world.short+" · NIVEL "+(level.stage+1),{fontSize:"22px",color:"#fff",align:"center",lineSpacing:8}).setOrigin(.5);
      this.add.text(W/2,245,level.story||world.intro,{fontSize:"16px",color:"#f7e9ce",align:"center",wordWrap:{width:700}}).setOrigin(.5);
      this.add.image(420,320,d.role==="VANNESA"?"vannesa_idle":"andres_idle").setScale(2.3);this.add.image(525,320,d.role==="VANNESA"?"andres_idle":"vannesa_idle").setScale(2.3);
      this.add.text(W/2,405,`Puntos: ${d.score}    Vidas: ${d.lives}    Monedas: ${d.coins}    Corazones: ${d.hearts}    Fragmentos: ${d.fragments||0}/5`,{fontSize:"18px",color:"#fff1ce"}).setOrigin(.5);
      button(this,340,475,"SIGUIENTE NIVEL",()=>this.scene.start("Play",{level:d.next,role:d.role,score:d.score,lives:d.lives,coins:d.coins,hearts:d.hearts,fragments:d.fragments}),{width:260});
      button(this,650,475,"CAMBIAR PROTAGONISTA",()=>this.scene.start("Select",{level:d.next,score:d.score,lives:d.lives,coins:d.coins,hearts:d.hearts,fragments:d.fragments}),{width:240,fill:0x754b83,fontSize:"16px"});
    }
  }
  class GameOver extends Phaser.Scene{
    constructor(){super("GameOver")}
    init(data){this.d=data||{}}
    create(){
      makeBackdrop(this,3,false);this.add.rectangle(W/2,H/2,W,H,0x111629,.76);
      this.add.text(W/2,145,"EL CAMINO NO TERMINA AQUÍ",{fontFamily:"Georgia,serif",fontSize:"31px",color:"#ffdc8b"}).setOrigin(.5);
      this.add.text(W/2,220,`Puntuación: ${this.d.score||0}`,{fontSize:"22px",color:"#fff"}).setOrigin(.5);
      button(this,W/2,315,"REINTENTAR NIVEL",()=>this.scene.start("Play",{level:this.d.level,role:this.d.role,score:this.d.score,lives:3,coins:this.d.coins||0,hearts:this.d.hearts||0,fragments:this.d.fragments||0}),{width:270});
      button(this,W/2,385,"CAMBIAR PROTAGONISTA",()=>this.scene.start("Select",{level:this.d.level,score:this.d.score,lives:3,coins:this.d.coins||0,hearts:this.d.hearts||0,continue:true}),{width:300,fill:0x754b83,fontSize:"16px"});
      button(this,W/2,455,"MENÚ PRINCIPAL",()=>this.scene.start("Title"),{width:240,fill:0x263d62,fontSize:"16px"});
    }
  }
  class Finale extends Phaser.Scene{
    constructor(){super("Finale")}
    init(data){this.d=data||{}}
    create(){
      makeBackdrop(this,4,false);addStarField(this,80);
      const glow=this.add.circle(W/2,220,130,0xffd783,.10);this.tweens.add({targets:glow,scale:1.18,alpha:.04,duration:1700,yoyo:true,repeat:-1});
      this.add.text(W/2,54,"EL REENCUENTRO",{fontFamily:"Georgia,serif",fontSize:"33px",color:"#ffdf93",stroke:"#39283f",strokeThickness:4}).setOrigin(.5);
      const a=this.add.image(420,200,"andres_victory").setScale(2.8),v=this.add.image(530,200,"vannesa_victory").setScale(2.8);
      this.tweens.add({targets:[a,v],y:"-=8",duration:900,yoyo:true,repeat:-1});
      this.add.text(W/2,295,`${CFG.heroName||"ANDRÉS"}  ♥  ${CFG.princessName||"VANNESA"}`,{fontFamily:"Georgia,serif",fontSize:"30px",fontStyle:"bold",color:"#fff0ca"}).setOrigin(.5);
      this.add.text(W/2,318,"DOS PROTAGONISTAS. UNA AVENTURA COMPARTIDA.",{fontSize:"12px",fontStyle:"bold",color:"#f6dca0",letterSpacing:2}).setOrigin(.5);
      this.add.text(W/2,352,CFG.dedication||"Dos caminos, dos héroes y un mismo destino.",{fontSize:"17px",color:"#fff",align:"center",wordWrap:{width:760}}).setOrigin(.5);
      const card=this.add.rectangle(W/2,433,780,112,0x14172d,.88).setStrokeStyle(2,0xe5bd72);
      this.add.text(W/2,381,`UNA CARTA PARA ${CFG.princessName||"VANNESA"}`,{fontSize:"15px",fontStyle:"bold",color:"#ffdc8b"}).setOrigin(.5);
      this.add.text(W/2,422,CFG.finalLetter||"Mi amor: esta aventura es nuestra. Gracias por ser parte de mi historia.",{fontSize:"14px",color:"#fff5e0",align:"center",wordWrap:{width:720},lineSpacing:4}).setOrigin(.5);
      this.add.text(W/2,478,"PUNTUACIÓN FINAL: "+(this.d.score||0),{fontSize:"13px",color:"#f4d79a"}).setOrigin(.5);
      button(this,245,510,"JUGAR DE NUEVO",()=>{saveProgress({level:0,role:"ANDRES",score:0,coins:0,hearts:0,fragments:0,lives:3,checkpoint:100});for(let i=0;i<TOTAL;i++)safeSet("kol_checkpoint_"+i,100);this.scene.start("Select",{level:0,score:0,lives:3})},{width:220,height:40,fontSize:"15px"});
      button(this,715,510,"MENÚ PRINCIPAL",()=>this.scene.start("Title"),{width:220,height:40,fontSize:"15px",fill:0x263d62});
      [523,659,784,659,587,698,880].forEach((f,i)=>this.time.delayedCall(i*260,()=>playTone(f,.24,"sine",.035,"music")));
      saveProgress({level:0,role:this.d.role||"ANDRES",score:0,coins:0,hearts:0,lives:3,checkpoint:100});
    }
  }

  const game=new Phaser.Game({
    type:Phaser.AUTO,parent:"game",width:W,height:H,backgroundColor:"#11182b",pixelArt:true,roundPixels:true,
    scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},
    physics:{default:"arcade",arcade:{gravity:{y:980},debug:false}},
    input:{activePointers:3},scene:[Boot,Title,Select,Prologue,Options,Credits,Play,Intermission,GameOver,Finale]
  });

  const releaseAllTouch=()=>Object.keys(TOUCH).forEach(key=>TOUCH[key]=false);
  document.querySelectorAll("#touch-controls button").forEach(buttonEl=>{
    const name=buttonEl.dataset.control;if(!(name in TOUCH))return;
    const down=e=>{e.preventDefault();TOUCH[name]=true;try{buttonEl.setPointerCapture(e.pointerId)}catch(_){}};
    const up=e=>{if(e)e.preventDefault();TOUCH[name]=false};
    buttonEl.addEventListener("pointerdown",down,{passive:false});
    buttonEl.addEventListener("pointerup",up,{passive:false});
    buttonEl.addEventListener("pointercancel",up,{passive:false});
    buttonEl.addEventListener("lostpointercapture",up,{passive:false});
  });
  window.addEventListener("blur",releaseAllTouch);
  document.addEventListener("visibilitychange",()=>{if(document.hidden)releaseAllTouch()});
})();
