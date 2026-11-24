(function(){
  const C={ink:"#241d36",skin:"#d99a72",skinLight:"#efb895",hair:"#241b22",blue:"#244d89",blueLight:"#3976bd",gold:"#f5c654",white:"#fff0da",red:"#ad3552",boot:"#493128"};
  function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(x,y,w,h)}
  function poly(c,pts,color){c.fillStyle=color;c.beginPath();c.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)c.lineTo(pts[i][0],pts[i][1]);c.closePath();c.fill()}
  function texture(scene,key,w,h,draw){let t=scene.textures.createCanvas(key,w,h);let c=t.getContext();c.imageSmoothingEnabled=false;draw(c);t.refresh();}
  function andres(c,pose){
    const step=pose==="walk1"?2:pose==="walk2"?-2:0;
    // cape and boots
    poly(c,[[8,15],[3,18],[2,34],[7,39],[12,28],[12,17]],C.red);
    rect(c,8,38+step,7,7,C.ink);rect(c,8,43+step,9,4,C.boot);
    rect(c,19,38-step,7,7,C.ink);rect(c,18,43-step,10,4,C.boot);
    // arms and tunic
    rect(c,7,21,5,12,C.skin);rect(c,22,21,5,12,C.skin);
    rect(c,7,29,5,5,C.boot);rect(c,22,29,5,5,C.boot);
    rect(c,9,18,15,20,C.blue);rect(c,7,20,19,4,C.blueLight);
    rect(c,9,32,15,3,C.gold);rect(c,14,33,5,2,"#9b642d");
    rect(c,12,21,9,3,C.gold);rect(c,14,25,5,4,C.red);
    // neck, face
    rect(c,14,14,6,5,C.skin);rect(c,10,5,13,14,C.skinLight);
    rect(c,10,12,2,4,C.skin);rect(c,22,12,2,4,C.skin);
    // curly hair
    rect(c,9,4,14,4,C.hair);rect(c,7,7,4,5,C.hair);rect(c,20,6,5,5,C.hair);
    rect(c,11,2,4,4,C.hair);rect(c,16,1,4,5,C.hair);rect(c,21,3,3,4,C.hair);
    // brows, eyes and beard
    rect(c,12,10,4,1,"#38252a");rect(c,18,10,4,1,"#38252a");
    rect(c,13,11,2,2,"#201c2b");rect(c,19,11,2,2,"#201c2b");rect(c,16,13,2,2,"#b9775a");
    rect(c,12,16,10,3,"#38252a");rect(c,13,15,2,2,"#38252a");rect(c,19,15,2,2,"#38252a");
    if(pose==="attack"){rect(c,25,22,5,3,C.gold);rect(c,28,18,2,11,"#dce9ff");}
    if(pose==="jump"||pose==="fall"){rect(c,8,37,8,5,C.ink);rect(c,18,37,8,5,C.ink);if(pose==="fall")rect(c,4,25,4,7,C.red);}
    if(pose==="hurt"){rect(c,8,12,4,3,"#38252a");rect(c,18,12,4,3,"#38252a");rect(c,8,22,4,9,C.gold);}
    if(pose==="victory"){rect(c,22,5,5,12,C.gold);rect(c,23,1,4,5,"#fff0a3");}
  }
  function vannesa(c,pose){
    const step=pose==="walk1"?2:pose==="walk2"?-2:0;
    // long hair behind her shoulders
    rect(c,7,7,5,23,"#3a202b");rect(c,21,7,5,23,"#3a202b");
    rect(c,8,16,4,16,"#512b39");rect(c,21,16,4,16,"#512b39");
    // dress and arms
    poly(c,[[10,19],[22,19],[28,41],[4,41]],C.blue);
    poly(c,[[13,19],[19,19],[22,38],[10,38]],C.white);
    rect(c,8,22,4,10,C.skinLight);rect(c,22,22,4,10,C.skinLight);
    rect(c,8,29,4,4,C.white);rect(c,22,29,4,4,C.white);
    poly(c,[[7,40],[25,40],[27,44],[5,44]],"#17375f");
    rect(c,7,39+step,7,5,"#e9c8a5");rect(c,19,39-step,7,5,"#e9c8a5");
    rect(c,8,42+step,7,3,C.gold);rect(c,19,42-step,7,3,C.gold);
    // bodice, belt, neckline
    rect(c,12,19,8,12,"#f8e7d0");poly(c,[[12,19],[16,22],[20,19],[20,27],[12,27]],C.blueLight);
    rect(c,11,29,10,2,C.gold);rect(c,14,29,4,3,C.gold);
    // face
    rect(c,10,5,13,14,C.skinLight);rect(c,8,11,3,5,C.skinLight);rect(c,22,11,3,5,C.skinLight);
    // center-part dark brown hair
    rect(c,8,4,16,5,"#2a1e25");rect(c,7,7,4,10,"#2a1e25");rect(c,21,7,4,10,"#2a1e25");
    rect(c,10,3,5,3,"#432735");rect(c,17,3,5,3,"#432735");rect(c,15,3,1,5,"#e0a27d");
    rect(c,12,10,4,1,"#37222a");rect(c,18,10,4,1,"#37222a");
    rect(c,13,11,2,2,"#241c28");rect(c,19,11,2,2,"#241c28");
    rect(c,16,14,2,2,"#c77e65");rect(c,14,17,6,1,"#aa5967");
    // golden tiara
    poly(c,[[10,6],[11,1],[14,5],[16,0],[19,5],[22,2],[23,7]],C.gold);rect(c,11,6,12,2,C.gold);rect(c,15,3,2,2,"#ffefff");
    if(pose==="attack"){rect(c,25,20,5,5,"#e58cff");rect(c,27,18,3,3,"#fff0b8");}
    if(pose==="jump"||pose==="fall"){rect(c,5,35,4,5,"#e58cff");rect(c,25,35,4,5,"#e58cff");}
    if(pose==="hurt"){rect(c,10,12,4,2,"#37222a");rect(c,18,12,4,2,"#37222a");rect(c,24,26,5,5,"#e58cff");}
    if(pose==="victory"){rect(c,24,13,4,12,"#e4a0ff");rect(c,23,9,6,5,C.gold);}
    if(pose==="cast"){rect(c,24,22,8,8,"#e58cff");rect(c,26,20,4,4,"#fff0b8");}
  }
  function create(scene){
    ["idle","walk1","walk2","jump","fall","attack","hurt","victory","cast"].forEach(p=>{
      texture(scene,"andres_"+p,32,48,c=>andres(c,p));
      texture(scene,"vannesa_"+p,32,48,c=>vannesa(c,p));
    });
    texture(scene,"platform",32,24,c=>{rect(c,0,0,32,24,"#6b4938");rect(c,0,0,32,5,"#d5a66a");rect(c,1,6,30,2,"#986b45");rect(c,4,11,10,2,"#81583d");rect(c,19,17,9,2,"#81583d");rect(c,0,22,32,2,"#49352e");});
    texture(scene,"ground",32,32,c=>{rect(c,0,0,32,32,"#4a3d3a");rect(c,0,0,32,6,"#4d9860");rect(c,0,5,32,3,"#8acb72");rect(c,3,13,8,3,"#5f5144");rect(c,18,21,11,3,"#5c4a40");rect(c,13,9,3,2,"#796354");});
    texture(scene,"coin",16,16,c=>{rect(c,5,0,6,2,"#fff0a3");rect(c,2,2,12,12,"#ffbe32");rect(c,4,4,8,8,"#f8df76");rect(c,6,5,2,6,"#fff6bd");rect(c,3,14,10,2,"#cd8428");});
    texture(scene,"heart",18,16,c=>{rect(c,2,2,5,5,"#ff6f9c");rect(c,11,2,5,5,"#ff6f9c");rect(c,0,5,18,5,"#ff6f9c");rect(c,3,10,12,3,"#e34d81");rect(c,6,13,6,2,"#e34d81");rect(c,4,3,3,3,"#ffd5e3");});
    texture(scene,"star",20,20,c=>{poly(c,[[10,0],[13,7],[20,8],[15,13],[16,20],[10,16],[4,20],[5,13],[0,8],[7,7]],"#fff0a0");rect(c,9,4,2,9,"#ffbf39");});
    texture(scene,"magic",18,18,c=>{poly(c,[[9,0],[12,6],[18,9],[12,12],[9,18],[6,12],[0,9],[6,6]],"#e4a0ff");rect(c,8,3,2,10,"#fff4ff");});
    texture(scene,"hazard",16,16,c=>{rect(c,5,0,6,5,"#ffdf78");rect(c,2,5,12,7,"#ff744d");rect(c,5,12,6,4,"#c83c4f");});
    texture(scene,"enemy",32,30,c=>{rect(c,5,11,22,15,"#6f4f9a");rect(c,2,16,28,9,"#8b68b6");rect(c,7,7,7,8,"#8b68b6");rect(c,19,7,7,8,"#8b68b6");rect(c,9,16,4,5,"#fff0d5");rect(c,20,16,4,5,"#fff0d5");rect(c,10,18,2,3,"#282035");rect(c,21,18,2,3,"#282035");rect(c,11,26,4,3,"#30283c");rect(c,19,26,4,3,"#30283c");});
    texture(scene,"boss",64,68,c=>{poly(c,[[8,26],[3,54],[12,64],[52,64],[61,54],[56,26],[47,17],[17,17]],"#382b52");rect(c,14,24,36,34,"#725071");rect(c,10,17,44,15,"#533b66");rect(c,19,10,26,21,"#e0a17b");rect(c,17,6,30,8,"#2a1d2e");rect(c,13,11,8,13,"#2a1d2e");rect(c,43,11,8,13,"#2a1d2e");rect(c,21,19,6,4,"#ff506e");rect(c,37,19,6,4,"#ff506e");rect(c,27,28,10,4,"#342039");poly(c,[[15,12],[17,0],[27,10],[34,0],[43,12]],"#efbd50");rect(c,27,5,8,7,"#ffecab");rect(c,24,37,16,5,"#bd4161");rect(c,27,46,10,8,"#bd4161");});
    texture(scene,"boss_bell",64,68,c=>{poly(c,[[10,22],[4,54],[14,66],[50,66],[60,54],[54,22]],"#625545");rect(c,13,25,38,30,"#887253");rect(c,9,18,46,12,"#aa8a5e");poly(c,[[20,17],[23,3],[31,14],[41,2],[45,18]],"#e3bd68");rect(c,25,24,14,17,"#e7c66e");rect(c,29,28,6,9,"#fff0b0");rect(c,6,32,8,20,"#6d634c");rect(c,50,32,8,20,"#6d634c");rect(c,17,57,10,9,"#544536");rect(c,38,57,10,9,"#544536");});
    texture(scene,"boss_firefly_queen",64,68,c=>{poly(c,[[25,27],[3,10],[7,39],[25,49]],"#8e62af");poly(c,[[39,27],[61,10],[57,39],[39,49]],"#d17cc2");poly(c,[[28,17],[32,2],[36,17]],"#f3d77c");rect(c,21,20,22,34,"#704d8d");rect(c,24,10,16,18,"#e2a1c6");rect(c,26,18,5,4,"#fff0bd");rect(c,35,18,5,4,"#fff0bd");rect(c,27,30,12,4,"#34253f");rect(c,15,50,34,8,"#d58bd2");rect(c,25,58,6,8,"#614171");rect(c,35,58,6,8,"#614171");});
    texture(scene,"boss_leviathan",64,68,c=>{poly(c,[[4,42],[12,20],[31,13],[50,20],[60,39],[49,56],[18,58]],"#2f778d");poly(c,[[7,27],[0,8],[19,21]],"#67c4ce");poly(c,[[49,24],[63,6],[56,35]],"#79d8d9");poly(c,[[18,20],[27,2],[32,20]],"#a0eff0");rect(c,17,24,31,23,"#57aebc");rect(c,22,29,7,5,"#fff5d3");rect(c,38,29,7,5,"#fff5d3");rect(c,24,31,3,3,"#18334c");rect(c,40,31,3,3,"#18334c");poly(c,[[22,45],[32,62],[40,45]],"#d1fcf2");rect(c,25,54,14,6,"#22566b");});
    texture(scene,"boss_aurora_watcher",64,68,c=>{poly(c,[[32,0],[45,19],[58,7],[54,34],[62,54],[45,66],[18,66],[2,52],[10,30],[6,11],[21,20]],"#607b9f");poly(c,[[32,2],[38,17],[32,28],[26,17]],"#c5efff");rect(c,14,25,36,28,"#8caec6");rect(c,20,29,8,5,"#fff7d9");rect(c,37,29,8,5,"#fff7d9");rect(c,22,31,4,3,"#35516f");rect(c,39,31,4,3,"#35516f");poly(c,[[17,52],[31,63],[47,52],[42,66],[22,66]],"#d9f5ff");rect(c,28,41,8,4,"#42607b");});
    texture(scene,"boss_tuner",64,68,c=>{poly(c,[[18,18],[46,18],[59,65],[5,65]],"#282238");rect(c,15,21,34,30,"#514060");rect(c,19,7,26,22,"#1f1b31");poly(c,[[19,9],[13,0],[27,6],[34,0],[47,9]],"#a66d9b");rect(c,23,18,6,5,"#ff6b9e");rect(c,37,18,6,5,"#ff6b9e");rect(c,27,29,10,3,"#1c172b");rect(c,28,34,8,9,"#bf7eaf");rect(c,47,7,4,34,"#d5b978");rect(c,43,5,12,4,"#f0deaa");rect(c,49,41,6,8,"#f0deaa");rect(c,16,54,32,7,"#72517f");});
    texture(scene,"checkpoint",30,52,c=>{rect(c,13,9,4,40,"#72503b");rect(c,4,8,23,16,"#d6a24f");rect(c,7,11,17,10,"#fff0ca");rect(c,12,13,7,6,"#d75f88");rect(c,13,4,4,7,"#f4d16d");});
    texture(scene,"door",42,64,c=>{rect(c,4,10,34,54,"#49345b");rect(c,8,15,26,49,"#c68a50");rect(c,12,20,18,44,"#302748");rect(c,15,24,12,35,"#a65c94");rect(c,18,37,6,6,"#fff0a5");rect(c,2,8,38,5,"#f7d277");});
    texture(scene,"block",32,32,c=>{rect(c,0,0,32,32,"#9b7046");rect(c,3,3,26,26,"#d4a45c");rect(c,6,6,20,20,"#9b7046");rect(c,8,8,16,16,"#d4a45c");rect(c,14,5,3,22,"#6b4938");});
    texture(scene,"plaque",36,34,c=>{rect(c,4,0,28,25,"#8d613f");rect(c,7,3,22,19,"#e0b96e");rect(c,2,24,32,5,"#694531");rect(c,15,24,5,10,"#694531");rect(c,13,8,10,8,"#a34b70");});

    texture(scene,"platform_crumble",32,24,c=>{rect(c,0,0,32,24,"#765b52");rect(c,0,0,32,5,"#d6b5a0");rect(c,3,7,9,3,"#b47b67");rect(c,19,8,10,3,"#b47b67");rect(c,12,12,3,8,"#392d3d");rect(c,23,15,2,6,"#392d3d");});
    texture(scene,"moving_platform",32,24,c=>{rect(c,0,2,32,20,"#3f627e");rect(c,0,0,32,5,"#b8e9ff");rect(c,4,8,24,3,"#83bdd8");rect(c,8,15,16,3,"#29455f");});
    texture(scene,"spike",32,22,c=>{rect(c,0,17,32,5,"#5b3942");for(let x=0;x<32;x+=8)poly(c,[[x,17],[x+4,1],[x+8,17]],"#e9d7d0");rect(c,0,17,32,2,"#ff9a82");});
    texture(scene,"fire",26,28,c=>{poly(c,[[13,0],[20,11],[24,18],[19,27],[7,27],[2,18],[7,10]],"#d74642");poly(c,[[13,7],[18,17],[14,24],[8,19]],"#ffcb66");rect(c,10,17,5,7,"#fff1ad");});
    texture(scene,"thorn",32,24,c=>{rect(c,0,18,32,6,"#31583f");for(let x=0;x<32;x+=8)poly(c,[[x,19],[x+4,4],[x+8,19]],"#83b95e");rect(c,2,18,28,3,"#d1ad70");});
    texture(scene,"ice",30,28,c=>{poly(c,[[15,0],[27,24],[16,28],[3,24]],"#b8edff");poly(c,[[15,4],[21,22],[15,25],[9,22]],"#6bb7e0");rect(c,13,8,3,11,"#effcff");});
    texture(scene,"gem",22,24,c=>{poly(c,[[11,0],[21,8],[17,21],[5,21],[1,8]],"#f5a8ff");poly(c,[[11,3],[17,9],[14,18],[8,18],[5,9]],"#d46eff");rect(c,9,6,3,9,"#fff0ff");});
    texture(scene,"fireball",20,20,c=>{poly(c,[[10,0],[17,6],[20,13],[13,20],[5,18],[0,11],[5,5]],"#ff694d");poly(c,[[10,4],[14,10],[11,16],[6,12]],"#ffe18a");});
    texture(scene,"enemy_slime",34,30,c=>{rect(c,6,11,22,15,"#70b86a");rect(c,3,16,28,10,"#8bdc75");rect(c,9,9,7,5,"#8bdc75");rect(c,20,9,7,5,"#8bdc75");rect(c,10,17,4,5,"#fff4dc");rect(c,21,17,4,5,"#fff4dc");rect(c,11,18,2,3,"#22263a");rect(c,22,18,2,3,"#22263a");});
    texture(scene,"enemy_moth",36,30,c=>{poly(c,[[17,13],[2,2],[5,21],[15,25]],"#ab83d0");poly(c,[[19,13],[34,2],[31,21],[21,25]],"#d7a6e7");rect(c,13,10,10,16,"#6e4b99");rect(c,14,6,8,8,"#cf9bdc");rect(c,15,14,2,3,"#fff2db");rect(c,20,14,2,3,"#fff2db");});
    texture(scene,"enemy_ice",34,32,c=>{poly(c,[[17,0],[31,15],[25,29],[9,29],[3,15]],"#7fd7ec");rect(c,8,12,18,13,"#b9efff");rect(c,11,14,4,5,"#fff");rect(c,21,14,4,5,"#fff");rect(c,12,16,2,3,"#36577b");rect(c,22,16,2,3,"#36577b");});
    texture(scene,"enemy_shadow",34,34,c=>{poly(c,[[17,1],[30,12],[27,30],[7,30],[4,12]],"#493459");rect(c,8,11,18,15,"#7d4b82");rect(c,10,15,5,3,"#ff557d");rect(c,20,15,5,3,"#ff557d");rect(c,13,23,9,3,"#22182f");});
    texture(scene,"enemy_guard",36,36,c=>{rect(c,6,8,24,24,"#5e536c");rect(c,9,4,18,8,"#ba8e64");rect(c,8,14,20,12,"#3e5268");rect(c,11,15,5,5,"#f7d27a");rect(c,20,15,5,5,"#f7d27a");rect(c,13,27,10,4,"#32293e");});
    // Atmospheric decorative sprites used in the authored worlds.
    texture(scene,"lantern",20,40,c=>{rect(c,8,0,4,10,"#684f43");rect(c,3,9,14,24,"#e5b75f");rect(c,6,12,8,17,"#fff0b0");rect(c,1,31,18,4,"#6b4938");rect(c,8,35,4,5,"#6b4938");});
    texture(scene,"resonator",32,48,c=>{
      // Ancient hanging bell with a luminous clapper: the signature object of Auralia.
      rect(c,13,0,6,4,"#c78e43");rect(c,8,4,16,4,"#f0ca73");
      poly(c,[[8,8],[24,8],[27,27],[23,35],[9,35],[5,27]],"#b77b38");
      poly(c,[[11,10],[21,10],[23,26],[20,31],[12,31],[9,26]],"#f0c36a");
      rect(c,14,9,4,18,"#fff0b4");rect(c,7,26,18,5,"#8f5b32");
      rect(c,14,31,4,7,"#6e4735");rect(c,11,37,10,4,"#f4d176");
      rect(c,14,42,4,4,"#fff4cc");
    });
    texture(scene,"resonance_wave",48,48,c=>{
      c.strokeStyle="#ffe5a0";c.lineWidth=3;c.beginPath();c.arc(24,24,8,Math.PI*1.2,Math.PI*1.8);c.stroke();
      c.beginPath();c.arc(24,24,16,Math.PI*1.2,Math.PI*1.8);c.stroke();
      c.beginPath();c.arc(24,24,23,Math.PI*1.2,Math.PI*1.8);c.stroke();
    });
  }
  window.LOVE_GAME_ART={create};
})();
