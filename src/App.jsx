import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronLeft, ChevronRight, ArrowRight, Loader, Camera, Upload, PenLine, Home, MapPin, Plus, X, Info } from "lucide-react";

var T={bg:"#F7F5F0",card:"#FFF",surface:"#F0EDE6",gold:"#B8864E",goldL:"#F0E2CC",goldD:"#8A6234",dark:"#1A1814",muted:"#7A756C",light:"#ADA89F",border:"rgba(0,0,0,0.09)",green:"#3A8A5A",shadow:"0 2px 12px rgba(0,0,0,0.08)"};
var FD="'Cormorant Garamond',Georgia,serif";var FB="'DM Sans','Helvetica Neue',sans-serif";var FM="'JetBrains Mono',monospace";
function fmt(n){return new Intl.NumberFormat("ru-RU").format(Math.round(n));}

/* ── CITIES ── */
var CITIES=[
  {id:"spb",name:"Санкт-Петербург",fo:"СЗФО",k:1.00},
  {id:"msk",name:"Москва",fo:"ЦФО",k:1.45},
  {id:"ekb",name:"Екатеринбург",fo:"УФО",k:0.80},
  {id:"krd",name:"Краснодар",fo:"ЮФО",k:0.80},
  {id:"nsk",name:"Новосибирск",fo:"СФО",k:0.80},
  {id:"kzn",name:"Казань",fo:"ПФО",k:0.80},
  {id:"vlad",name:"Владивосток",fo:"ДФО",k:0.80},
  {id:"stav",name:"Ставрополь",fo:"СКФО",k:0.80},
];
var CONDS=[
  {id:"bare",icon:"🧱",label:"Черновая (новостройка)",desc:"Нет штукатурки и стяжки",mult:1.25},
  {id:"rough",icon:"🔨",label:"Черновая готова",desc:"Штукатурка и стяжка выполнены",mult:1.00},
  {id:"pre",icon:"🪟",label:"Предчистовая",desc:"Шпаклёвка готова, только финиш",mult:0.82},
  {id:"old",icon:"🏚️",label:"Вторичка / б/у",desc:"Демонтаж + полный ремонт",mult:1.15},
];
var CLASSES=[
  {id:"eco",label:"Эконом",desc:"Практично и надёжно",bg:"linear-gradient(135deg,#4A6070,#3A5060)",pop:false},
  {id:"mid",label:"Комфорт",desc:"Современный стиль и качество",bg:"linear-gradient(135deg,#C0904A,#A07030)",pop:true},
  {id:"prem",label:"Премиум",desc:"Дизайнерский уровень",bg:"linear-gradient(135deg,#4A3870,#302050)",pop:false},
];

/* ── PRICES (Прораб НЕВА СПб 2026) ── */
var W={
  demo_wall:280, demo_tile:314, demo_floor:120,
  mach_plaster:1040, plaster_mesh:240, beacons:300, betonkontakt:120,
  grout_1:105, grout_2:210, grout_bc:120, antifungal:240,
  spackle_2:600, spackle_fine:1050, sand:273, grind:340,
  waterproof_wall:630, waterproof_floor:630,
  paint_wall:600, wallpaper:552, decor_plaster:3300,
  tile_wall_30x60:3750, tile_wall_60x60:4200, grout_tile:300,
  slope_plaster:1140,
  self_level:660, self_level2:882,
  lam_underlay:120, laminate:600,
  qv_lock:690, qv_glue:990,
  parquet:960,
  tile_floor_60x60:4500, tile_floor_30x60:4050,
  plinth_wood:300,
  sill:1860,
  ceil_paint:900, ceil_spackle:750, ceil_grout:120,
  ceil_gkl:2344, ceil_plinth:300,
  stretch_work:950, stretch_mat:850,
  cable_lay:210, chasing_22:900, chasing_24:1500, chase_fill:300,
  subbox_conc:1050, subbox_gkl:350,
  socket:450, switch_el:450, distrib_box:1860,
  breaker:1800, panel_install:9300,
  spot:630, chandelier:2250,
  warm_floor_mat:3300, warm_floor_thermo:1800,
  fan_install:1860,
  plumb_point_gvs:5400, plumb_point_hvs:5400,
  drain_pipe:9000, chasing_plumb:9000,
  bathtub:6300, shower_cabin:12450, shower_stand:4500,
  sink:4500, sink_mixer:1500, mirror:2070,
  toilet_install:4500, install_instal:10500, install_box:9300,
  towel_rack:6300, bath_mixer:2400,
  collector:4500,
  sealing:500,
  screed_cps:600, demo_plinth:80, demo_ceil:120, demo_door:2500, demo_bath:3500, demo_toilet:2500, demo_sink:2200, demo_towel_rack:1800, demo_plumb_pipe:8500, demo_kitchen:4500,
  door_install:7600, door_lining:2000, door_lock:1650,
};

/* ── MATERIAL PRICES BY CLASS ── */
var MAT={
  eco:{lam:800,qv:1100,tile_f:1200,parq:2500,paper:320,paint_w:150,tile_w:1500,door:10000,sill_m:2500},
  mid:{lam:1800,qv:2100,tile_f:2500,parq:5000,paper:600,paint_w:300,tile_w:3000,door:15000,sill_m:3500},
  prem:{lam:3500,qv:4000,tile_f:5000,parq:10000,paper:1200,paint_w:550,tile_w:6000,door:35000,sill_m:6000},
};

/* ── BRAND SUGGESTIONS BY CLASS ── */
var BRANDS={
  eco:{lam:"Kronotex, Kronospan",qv:"Vinilam, Alpine Floor",tile:"Kerama Marazzi (базовая)",paint:"Ярославль, Parade",door:"Velldoris, Profil Doors"},
  mid:{lam:"Egger, Quick-Step",qv:"SPC Doma, Finefloor",tile:"Kerama Marazzi, Eletto",paint:"Tikkurila Harmony, Dulux",door:"Двери Регионов, Sofia"},
  prem:{lam:"Haro, Meister",qv:"Arbiton, Wineo",tile:"Italon, Estima, Cersanit Premium",paint:"Tikkurila Optiva, Caparol",door:"Океан, Torex, Velldoris Elite"},
};

/* ── CALC ENGINE ── */
function calcRoom(room,cond,cls,cityK,wallMat,floorMat,ceilMat,doorMat,elecPct,bathroomCfg,isPanelRoom,plumbPct){
  var a=parseFloat(room.area)||10;
  var sw=Math.max(2,Math.round(Math.sqrt(a*1.4)*10)/10);
  var sh=Math.max(2,Math.round(a/sw*10)/10);
  var perim=Math.round((sw+sh)*2*10)/10;
  var wallArea=Math.round(perim*2.7*10)/10; // высота потолка 2,7м
  var name=room.name||"";

  /* ── Тип помещения ── */
  var isWet    =/санузел|ванн|туалет/i.test(name);
  var isKit    =/кухн/i.test(name);
  var isCor    =/коридор|прихожая/i.test(name);
  var isBalc   =/балкон|лоджия/i.test(name);
  var isStore  =/кладовк|гардероб/i.test(name);

  var isEco=cls==="eco";var isPrem=cls==="prem";
  var cm={bare:1.25,rough:1.0,pre:0.82,old:1.15}[cond]||1.0;
  var qm={eco:0.70,mid:1.0,prem:1.55}[cls]||1.0;
  var k=cityK||1.0;var mp=MAT[cls]||MAT.mid;
  var brands=BRANDS[cls]||BRANDS["mid"];

  /* ── Конфиг санузла ── */
  var bc=bathroomCfg||{};
  var bathBathing  =bc.bathing||"bath";
  var bathWarmFloor=bc.warmFloor===true;
  var bathWater    =bc.waterproof!==undefined?bc.waterproof:!isEco;
  var bathWash     =bc.washingMachine||false;
  var bathTowel    =bc.towelRack!==undefined?bc.towelRack:!isEco;
  var bathToilet   =bc.toiletType||(isEco?"floor":"install");
  var bathFilter   =bc.hasFilter||false;
  var bathPipeCover=bc.pipeCover||false;
  var bathShower   =bc.showerType||"tray";
  var bathPipe     =bc.plumbingType||"sequential";
  var tileWallSz   =bc.tileWallSize||"30×60";
  var tileFloorSz  =bc.tileFloorSize||"60×60";

  var works=[];var mats=[];var wN=1;var mN=1;
  function LW(s,n,q,u,p){var pr=p||500;works.push({no:wN++,sec:s,name:n,qty:Math.round(q*10)/10,unit:u,price:Math.round(pr*cm*qm*k),sum:Math.round(q*pr*cm*qm*k)});}
  function LM(s,n,q,u,p){var pr=p||300;mats.push({no:mN++,sec:s,name:n,qty:Math.round(q*10)/10,unit:u,price:Math.round(pr),sum:Math.round(q*pr)});}

  /* ══════════════════════════════════════════
     БАЛКОН / ЛОДЖИЯ — особая логика
  ══════════════════════════════════════════ */
  if(isBalc){
    if(cond==="old")LW("Демонтаж","Демонтаж старой отделки балкона",wallArea,"м²",W.demo_wall);
    // Потолок: ПВХ-вагонка или покраска фасадной краской
    var bCeil=ceilMat||"ПВХ вагонка";
    if(bCeil==="Покраска"){LW("Потолок","Покраска потолка балкона (влагостойкая)",a,"м²",W.ceil_paint);LM("Потолок","Краска фасадная влагостойкая",a,"м²",290);}
    else{LW("Потолок","Монтаж потолочной ПВХ-вагонки",a,"м²",1900);LM("Потолок","ПВХ вагонка потолочная",a,"м²",420);LM("Потолок","Профиль + крепёж",perim,"п.м.",80);}
    // Стены балкона — 3 стороны (4-я = остекление)
    var bWA=Math.round(wallArea*0.75*10)/10;
    var bWf=wallMat||"Покраска";
    LW("Стены","Грунтовка стен балкона (влагостойкая)",bWA,"м²",W.grout_1);LM("Стены","Грунтовка фасадная",bWA,"м²",55);
    if(bWf==="Плитка/керамогранит"){LW("Стены","Облицовка стен балкона плиткой",bWA,"м²",W.tile_wall_30x60);LM("Стены","Плитка влагостойкая для балкона",bWA*1.1,"м²",mp.tile_w||1500);LM("Стены","Клей Ceresit CM-17",Math.ceil(bWA*0.5),"меш.",680);}
    else if(bWf==="Обои"||bWf==="Покраска"){LW("Стены","Покраска стен балкона влагостойкой",bWA,"м²",W.paint_wall);LM("Стены","Краска фасадная/влагостойкая",bWA,"м²",360);}
    else{LW("Стены","Монтаж ПВХ/вагонки на стены балкона",bWA,"м²",1700);LM("Стены","ПВХ вагонка / деревянная рейка",bWA,"м²",450);LM("Стены","Каркас + крепёж",bWA,"м²",180);}
    // Пол: антискользящая плитка или SPC
    var bFf=floorMat||"Плитка/керамогранит";
    LW("Пол","Грунтовка пола балкона",a,"м²",W.grout_1);LM("Пол","Грунтовка",a,"м²",42);
    if(bFf==="Ламинат"||bFf==="Кварцвинил"||bFf==="Кварцвинил SPC (премиум)"){LW("Пол","Настил влагостойкого SPC (балкон)",a,"м²",W.qv_lock);LM("Пол","Кварцвинил SPC влагостойкий",a*1.05,"м²",mp.qv||1100);}
    else{LW("Пол","Укладка антискользящей плитки R10 (балкон)",a,"м²",W.tile_floor_30x60);LM("Пол","Плитка антискользящая R10 30×30",a*1.1,"м²",mp.tile_f||1200);LM("Пол","Клей CM-17",Math.ceil(a*0.5),"меш.",650);LW("Пол","Расшивка + затирка (балкон)",a,"м²",W.grout_tile*2);LM("Пол","Затирка",Math.ceil(a/10),"кг",280);}
    // Утепление пола (обязательно для балкона)
    LW("Утепление","Монтаж PIR-утеплителя пола (балкон)",a,"м²",1300);LM("Утепление","Утеплитель PIR 50мм",a,"м²",680);
    // Электрика балкона: 1-2 розетки IP44, без щитка!
    LW("Электрика","Прокладка кабеля + штробы (балкон)",Math.round(a*0.8+3),"п.м.",W.cable_lay);LM("Электрика","Кабель ВВГнг 3×2,5",Math.round(a*0.8)+5,"п.м.",65);
    LW("Электрика","Монтаж 2 розеток IP44 (балкон)",2,"шт.",W.socket);LM("Электрика","Розетки влагозащищённые IP44",2,"шт.",780);
    LW("Электрика","Монтаж светильника IP44 (балкон)",1,"шт.",W.spot);LM("Электрика","Светильник потолочный IP44",1,"шт.",1900);
    var wT=works.reduce(function(s,l){return s+l.sum;},0);var mT=mats.reduce(function(s,l){return s+l.sum;},0);
    return{works:works,materials:mats,workTotal:wT,matTotal:mT,total:wT+mT,area:a,name:room.name};
  }

  /* ══════════════════════════════════════════
     КЛАДОВКА / ГАРДЕРОБНАЯ
  ══════════════════════════════════════════ */
  if(isStore){
    if(cond==="old")LW("Демонтаж","Демонтаж старой отделки",wallArea,"м²",W.demo_wall);
    LW("Потолок","Грунтовка + шпаклёвка + покраска потолка",a,"м²",W.ceil_grout+W.ceil_spackle+W.ceil_paint);LM("Потолок","Шпаклёвка + краска белая",a,"м²",260);
    LW("Стены","Грунтовка + шпаклёвка + покраска стен",wallArea,"м²",W.grout_2+W.spackle_2+W.paint_wall);LM("Стены","Шпаклёвка + краска",wallArea,"м²",120);
    var stFf=floorMat||(isEco?"Линолеум":"Кварцвинил");
    LW("Пол","Грунтовка пола",a,"м²",W.grout_1);LM("Пол","Грунтовка",a,"м²",42);
    if(stFf==="Линолеум"||stFf==="Линолеум (эконом)"){LW("Пол","Настил линолеума",a,"м²",400);LM("Пол","Линолеум",a*1.07,"м²",mp.linoleum||350);}
    else{LW("Пол","Настил кварцвинила",a,"м²",W.qv_lock);LM("Пол","Кварцвинил SPC",a*1.05,"м²",mp.qv||1100);}
    LW("Пол","Монтаж плинтуса",perim,"п.м.",W.plinth_wood);LM("Пол","Плинтус ПВХ",perim,"п.м.",80);
    LW("Двери","Монтаж двери кладовки",1,"компл.",W.door_install);LM("Двери","Дверь экошпон (кладовка)",1,"шт.",mp.door||10000);
    LW("Электрика","Монтаж выключателя + светильника",1,"компл.",W.socket+W.spot);LM("Электрика","Выключатель + лампа",1,"компл.",1500);LW("Электрика","Прокладка кабеля",5,"п.м.",W.cable_lay);LM("Электрика","Провод ВВГнг 3×1,5",6,"п.м.",42);
    var wT=works.reduce(function(s,l){return s+l.sum;},0);var mT=mats.reduce(function(s,l){return s+l.sum;},0);
    return{works:works,materials:mats,workTotal:wT,matTotal:mT,total:wT+mT,area:a,name:room.name};
  }

  /* ══════════════════════════════════════════
     СТАНДАРТНЫЕ ПОМЕЩЕНИЯ
  ══════════════════════════════════════════ */
  // ДЕМОНТАЖ — детальный для вторичного жилья
  if(cond==="old"){
    LW("Демонтаж","Демонтаж плинтусов",perim,"п.м.",W.demo_plinth||80);
    LW("Демонтаж","Демонтаж напольного покрытия (ламинат/линолеум/паркет/плитка)",a,"м²",W.demo_floor);
    if(isWet){
      LW("Демонтаж","Демонтаж плитки пола санузла",a,"м²",W.demo_tile);
      LW("Демонтаж","Демонтаж плитки стен санузла",wallArea,"м²",W.demo_tile);
      LW("Демонтаж","Демонтаж ванны / душевого поддона",1,"шт.",W.demo_bath||3500);
      LW("Демонтаж","Демонтаж унитаза",1,"шт.",W.demo_toilet||2500);
      LW("Демонтаж","Демонтаж раковины с тумбой",1,"шт.",W.demo_sink||2200);
      LW("Демонтаж","Демонтаж полотенцесушителя",1,"шт.",W.demo_towel_rack||1800);
      LW("Демонтаж","Демонтаж старых труб и сантехнической арматуры",1,"компл.",W.demo_plumb_pipe||8500);
    }else{
      LW("Демонтаж","Снятие обоев / удаление краски / штукатурки",wallArea,"м²",W.demo_wall);
      LW("Демонтаж","Демонтаж потолочного покрытия (побелка/краска/натяжной)",a,"м²",W.demo_ceil||120);
      if(!isCor)LW("Демонтаж","Демонтаж дверного блока с коробкой и наличниками",1,"шт.",W.demo_door||2500);
      if(isKit)LW("Демонтаж","Демонтаж кухонных шкафов / старого фартука",1,"компл.",W.demo_kitchen||4500);
    }
  }

  // ПОТОЛОК
  var ceil=ceilMat||(isWet?"Покраска":"Натяжные");
  if(isWet){
    // В санузле: влагостойкий потолок
    if(ceil==="Натяжные"||ceil==="Натяжные (Premium PVC)"){LW("Потолок","Монтаж натяжного потолка (влагостойкий)",a,"м²",W.stretch_work);LM("Потолок","Полотно натяжного потолка влагостойкое",a,"м²",W.stretch_mat);}
    else{LW("Потолок","Монтаж влагостойкого ГКЛ-потолка",a,"м²",W.ceil_gkl);LM("Потолок","ГКЛ влагостойкий 12,5мм",a,"м²",530);LM("Потолок","Профиль CD/UD",a,"м²",200);LW("Потолок","Грунтовка + покраска влагостойкая",a,"м²",W.ceil_grout+W.ceil_paint);LM("Потолок","Краска влагостойкая",a,"м²",250);}
    LW("Потолок","Монтаж точечных светильников IP44 (4 шт.)",4,"шт.",W.spot);
  }else if(ceil==="Натяжные"||ceil==="Натяжные (Premium PVC)"){
    LW("Потолок","Монтаж натяжного потолка (работа)",a,"м²",W.stretch_work);LM("Потолок","Полотно натяжного потолка",a,"м²",W.stretch_mat);
    LW("Потолок","Монтаж потолочного плинтуса ПУ",perim,"п.м.",W.ceil_plinth);LM("Потолок","Плинтус потолочный полиуретан",perim,"п.м.",180);
    LW("Потолок","Монтаж люстры",1,"шт.",W.chandelier);
  }else if(ceil==="Покраска"){
    if(cond==="pre"){
      LW("Потолок","Грунтовка потолка под покраску",a,"м²",W.ceil_grout);
      LW("Потолок","Покраска потолка в 2 слоя",a,"м²",W.ceil_paint);LM("Потолок","Краска потолочная Tikkurila/Dulux",a,"м²",180);
    }else{
      LW("Потолок","Грунтовка потолка (2 цикла)",a,"м²",W.ceil_grout*2);LW("Потолок","Шпаклёвка потолка в 2 слоя",a,"м²",W.ceil_spackle);LM("Потолок","Шпаклёвка финишная",a,"м²",80);
      LW("Потолок","Покраска потолка в 2 слоя",a,"м²",W.ceil_paint);LM("Потолок","Краска потолочная Tikkurila/Dulux",a,"м²",180);
    }
    LW("Потолок","Монтаж потолочного плинтуса",perim,"п.м.",W.ceil_plinth);LM("Потолок","Плинтус потолочный ПВХ",perim,"п.м.",120);
    LW("Потолок","Монтаж люстры",1,"шт.",W.chandelier);
  }else if(ceil==="Гипсокартон"||ceil==="Гипсокартон (2 уровня)"){
    LW("Потолок","Монтаж ГКЛ-потолка (каркас + листы)",a,"м²",W.ceil_gkl);LM("Потолок","Листы ГКЛ 12мм",a,"м²",420);LM("Потолок","Профиль CD/UD, крепёж",a,"м²",200);
    LW("Потолок","Шпаклёвка + покраска потолка ГКЛ",a,"м²",W.ceil_spackle+W.ceil_paint);LM("Потолок","Краска + шпаклёвка",a,"м²",260);
    LW("Потолок","Монтаж потолочного плинтуса",perim,"п.м.",W.ceil_plinth);
    LW("Потолок","Монтаж точечных светильников (4 шт.)",4,"шт.",W.spot);
  }else{
    LW("Потолок","Монтаж натяжного потолка",a,"м²",W.stretch_work);LM("Потолок","Полотно натяжного потолка",a,"м²",W.stretch_mat);
    LW("Потолок","Монтаж плинтуса потолочного",perim,"п.м.",W.ceil_plinth);LW("Потолок","Монтаж люстры",1,"шт.",W.chandelier);
  }

  // ЧЕРНОВАЯ ПОДГОТОВКА СТЕН — по состоянию объекта
  // bare/old: нужна штукатурка | rough: только шпаклёвка | pre: только грунтовка
  if(!isWet){
    if(cond==="bare"||cond==="old"){
      LW("Стены","Бетоноконтакт / грунтовка глубокого проникновения",wallArea,"м²",W.betonkontakt);LM("Стены","Бетоноконтакт Кнауф 5кг",Math.ceil(wallArea/10),"уп.",620);
      LW("Стены","Монтаж маяков (провешивание)",perim,"п.м.",W.beacons);
      LW("Стены","Штукатурная сетка 5×5мм (армирование)",wallArea,"м²",W.plaster_mesh);LM("Стены","Сетка штукатурная стеклотканевая",wallArea,"м²",30);
      LW("Стены","Машинная штукатурка гипсовая (Кнауф МП-75)",wallArea,"м²",W.mach_plaster);LM("Стены","Штукатурка Кнауф Ротбанд 30кг",Math.ceil(wallArea*0.15),"меш.",620);
    }
  }

  // ОТДЕЛКА СТЕН
  var wf=wallMat||"Покраска";
  if(isWet){
    /* ── Санузел ── */
    LW("Стены","Грунтовка антигрибковая (2 цикла)",wallArea,"м²",W.grout_2);LM("Стены","Грунтовка антигрибковая",wallArea,"м²",48);
    if(bathWater){LW("Стены","Гидроизоляция стен обмазочная (2 слоя)",wallArea*0.7,"м²",W.waterproof_wall);LM("Стены","Гидроизоляция Ceresit CR-65 / Litokol",Math.ceil(wallArea*0.7/3),"уп.",1900);}
    var twPr=tileWallSz==="60×120"?W.tile_wall_60x60*1.2:tileWallSz==="20×60"?W.tile_wall_30x60*0.9:W.tile_wall_30x60;
    LW("Стены","Облицовка стен керамогранитом "+tileWallSz,wallArea,"м²",twPr);LM("Стены","Керамогранит стеновой "+tileWallSz+" ("+brands.tile+")",wallArea*1.1,"м²",mp.tile_w||1500);
    LM("Стены","Клей плиточный Ceresit CM-17 Plus",Math.ceil(wallArea*0.55),"меш.",720);
    LW("Стены","Расшивка и затирка швов",wallArea,"м²",W.grout_tile*2);LM("Стены","Затирка Ceresit CE-40 Aquastatic",Math.ceil(wallArea/10),"кг",420);
  }else if(isKit){
    /* ── Кухня: фартук плиткой + остальные стены ── */
    var kitW=Math.round(Math.sqrt(a)*10)/10;
    var fartukA=Math.round(kitW*0.7*10)/10; // фартук ~70см высоты
    var mainWA=Math.max(0,wallArea-fartukA);
    LW("Стены","Грунтовка стен кухни (2 цикла)",wallArea,"м²",W.grout_2);LM("Стены","Грунтовка влагостойкая",wallArea,"м²",42);
    LW("Стены","Шпаклёвка стен (кроме зоны фартука)",mainWA,"м²",W.spackle_2);LM("Стены","Шпаклёвка Knauf HP",mainWA*0.5,"кг",80);LW("Стены","Шлифовка стен",mainWA,"м²",W.grind);
    if(wf==="Плитка/керамогранит"){
      // Вся стена плиткой
      LW("Стены","Облицовка стен кухни плиткой 60×60",wallArea,"м²",W.tile_wall_60x60);LM("Стены","Керамогранит стеновой 60×60 "+brands.tile,wallArea*1.1,"м²",mp.tile_w||1500);LM("Стены","Клей CM-17",Math.ceil(wallArea*0.5),"меш.",680);LW("Стены","Расшивка + затирка",wallArea,"м²",W.grout_tile*2);LM("Стены","Затирка CE-33",Math.ceil(wallArea/10),"кг",380);
    }else{
      // Фартук — плитка
      LW("Стены","Облицовка кухонного фартука плиткой 30×60",fartukA,"м²",W.tile_wall_30x60);LM("Стены","Плитка фартук 30×60 "+brands.tile,fartukA*1.1,"м²",mp.tile_w||1500);LM("Стены","Клей CM-17 (фартук)",Math.ceil(fartukA*0.5),"меш.",680);LW("Стены","Затирка фартука",fartukA,"м²",W.grout_tile*2);LM("Стены","Затирка (фартук)",Math.ceil(fartukA/8),"кг",380);
      // Остальные стены
      if(wf==="Обои"){LW("Стены","Поклейка обоев (кухня)",mainWA,"м²",W.wallpaper);LM("Стены","Обои влагостойкие "+brands.lam,Math.ceil(mainWA/10),"рул.",(mp.paper||320)*10);LM("Стены","Клей",Math.ceil(mainWA/30),"уп.",380);}
      else{LW("Стены","Покраска стен кухни (кроме фартука)",mainWA,"м²",W.paint_wall);LM("Стены","Краска влагостойкая "+brands.paint,mainWA/6,"ведро",(mp.paint_w||150)*6);}
    }
    LW("Стены","Штукатурка откосов окна",3,"п.м.",W.slope_plaster);
  }else{
    /* ── Жилые + коридор ── */
    if(cond==="pre"){
      LW("Стены","Грунтовка стен под финишную отделку",wallArea,"м²",W.grout_1);LM("Стены","Грунтовка Caparol Tiefgrund / Кнауф",wallArea,"м²",42);
    }else{
      LW("Стены","Грунтовка стен (2 цикла)",wallArea,"м²",W.grout_2);LM("Стены","Грунтовка Caparol / Кнауф",wallArea,"м²",42);
      LW("Стены","Шпаклёвка стен в 2 слоя",wallArea,"м²",W.spackle_2);LM("Стены","Шпаклёвка Knauf Fugen HP",wallArea*0.5,"кг",80);
      LW("Стены","Шлифовка стен",wallArea,"м²",W.grind);
    }
    if(wf==="Покраска"){LW("Стены","Покраска стен в 2 слоя",wallArea,"м²",W.paint_wall);LM("Стены","Краска интерьерная "+brands.paint,wallArea/6,"ведро",(mp.paint_w||150)*6);}
    else if(wf==="Обои"){LW("Стены","Поклейка обоев флизелиновых",wallArea,"м²",W.wallpaper);LM("Стены","Обои флизелиновые "+brands.lam,Math.ceil(wallArea/10),"рул.",(mp.paper||320)*10);LM("Стены","Клей для флизелина",Math.ceil(wallArea/30),"уп.",380);}
    else if(wf==="Плитка/керамогранит"){LW("Стены","Облицовка стен 60×60",wallArea,"м²",W.tile_wall_60x60);LM("Стены","Керамогранит стеновой 60×60 "+brands.tile,wallArea*1.1,"м²",mp.tile_w||1500);LM("Стены","Клей CM-17",Math.ceil(wallArea*0.5),"меш.",680);LW("Стены","Расшивка + затирка",wallArea,"м²",W.grout_tile*2);LM("Стены","Затирка CE-33",Math.ceil(wallArea/10),"кг",380);}
    else{LW("Стены","Нанесение декоративной штукатурки",wallArea,"м²",W.decor_plaster);LM("Стены","Декоративная штукатурка",wallArea,"м²",650);}
    if(!isCor)LW("Стены","Штукатурка откосов окна",3,"п.м.",W.slope_plaster);
  }

  // ПОЛЫ — стяжка только если нужна
  if((cond==="bare"||cond==="old")&&!isWet){
    LW("Пол","Стяжка ЦПС 50мм (подготовка основания)",a,"м²",W.screed_cps||600);LM("Пол","Смесь ЦПС М200 (50мм) — цемент + песок",Math.ceil(a*0.12),"меш.",360);
  }
  LW("Пол","Грунтовка пола",a,"м²",W.grout_1);LM("Пол","Грунтовка для пола",a,"м²",42);
  var ff=floorMat||(isWet?"Плитка":"Кварцвинил");
  if(isWet){
    if(!isEco){LW("Пол","Наливной пол-выравниватель (1 см)",a,"м²",W.self_level);LM("Пол","Наливной пол Ceresit CN-76",a*0.5,"кг",120);}
    if(bathWater){LW("Пол","Гидроизоляция пола (2 слоя)",a,"м²",W.waterproof_floor);LM("Пол","Гидроизоляция Litokol / Mapei",a*0.9,"кг",295);}
    var tfPr=tileFloorSz==="120×120"?W.tile_floor_60x60*1.3:W.tile_floor_60x60;
    LW("Пол","Укладка керамогранита пол "+tileFloorSz,a,"м²",tfPr);LM("Пол","Керамогранит напольный "+tileFloorSz+" "+brands.tile,a*1.1,"м²",mp.tile_f||1200);LM("Пол","Клей Ceresit CM-11 Plus",Math.ceil(a*0.55),"меш.",650);
    LW("Пол","Расшивка + затирка пола",a,"м²",W.grout_tile*2);LM("Пол","Затирка CE-40 Aquastatic",Math.ceil(a/10),"кг",420);
  }else if(ff==="Линолеум"||ff==="Линолеум (эконом)"){
    LW("Пол","Настил линолеума",a,"м²",400);LM("Пол","Линолеум 3,5мм",a*1.07,"м²",mp.linoleum||350);
    LW("Пол","Монтаж плинтуса ПВХ",perim,"п.м.",W.plinth_wood);LM("Пол","Плинтус ПВХ белый",perim,"п.м.",80);
  }else if(ff==="Ламинат"){
    LW("Пол","Настил подложки 3мм",a,"м²",W.lam_underlay);LM("Пол","Подложка пенополистирол",a,"м²",90);
    LW("Пол","Настил ламината",a,"м²",W.laminate);LM("Пол","Ламинат 33кл. "+brands.lam,a*1.1,"м²",mp.lam||800);
    LW("Пол","Монтаж плинтуса МДФ",perim,"п.м.",W.plinth_wood);LM("Пол","Плинтус МДФ с кабель-каналом",perim,"п.м.",180);
  }else if(ff==="Кварцвинил"||ff==="Кварцвинил SPC (премиум)"){
    LW("Пол","Наливной пол под SPC (1 см)",a,"м²",W.self_level);LM("Пол","Наливной пол Bergauf",a*0.5,"кг",120);
    LW("Пол","Настил кварцвинила SPC замок",a,"м²",W.qv_lock);LM("Пол","Кварцвинил SPC 5мм "+brands.qv,a*1.05,"м²",mp.qv||1100);
    LW("Пол","Монтаж плинтуса МДФ",perim,"п.м.",W.plinth_wood);LM("Пол","Плинтус МДФ",perim,"п.м.",180);
  }else if(ff==="Паркет/доска"||ff==="Паркет/доска (массив)"){
    LW("Пол","Настил паркетной доски",a,"м²",W.parquet);LM("Пол","Паркетная доска "+brands.lam,a*1.05,"м²",mp.parq||2500);
    LW("Пол","Монтаж плинтуса деревянного",perim,"п.м.",W.plinth_wood);LM("Пол","Плинтус деревянный",perim,"п.м.",280);
  }else{
    // Плитка / керамогранит
    LW("Пол","Наливной пол (1 см)",a,"м²",W.self_level);LM("Пол","Наливной пол Ceresit",a*0.5,"кг",120);
    LW("Пол","Укладка керамогранита 60×60",a,"м²",W.tile_floor_60x60);LM("Пол","Керамогранит напольный 60×60",a*1.1,"м²",mp.tile_f||1200);LM("Пол","Клей CM-11",Math.ceil(a*0.5),"меш.",620);
    LW("Пол","Расшивка + затирка",a,"м²",W.grout_tile*2);LM("Пол","Затирка",Math.ceil(a/10),"кг",380);
  }

  // ДВЕРИ (не для коридора — там входная дверь, не для санузлов — там конкретный монтаж)
  if(!isCor){
    var dm=doorMat||"Экошпон";
    LW("Двери","Монтаж межкомнатной двери",1,"компл.",W.door_install);LW("Двери","Монтаж доборов + наличников",1,"компл.",W.door_lining);
    if(!isEco)LW("Двери","Врезка замка + монтаж петель",1,"компл.",W.door_lock);
    if(dm==="Массив"||dm==="Массив (дуб/ясень)")  LM("Двери","Дверь массив дуб/ясень",1,"шт.",(mp.door||10000)+22000);
    else if(dm==="Скрытые"||dm==="Скрытые в стену")LM("Двери","Дверь скрытая в стену",1,"шт.",(mp.door||10000)+38000);
    else if(dm==="Эмаль"||dm==="Эмаль RAL")        LM("Двери","Дверь эмаль",1,"шт.",(mp.door||10000)+6000);
    else if(dm==="Стеклянные")                      LM("Двери","Дверь стеклянная триплекс",1,"шт.",(mp.door||10000)+16000);
    else                                            LM("Двери","Дверь экошпон",1,"шт.",mp.door||10000);
  }

  // ПОДОКОННИКИ — только для комнат с окнами (не коридор, не санузел)
  if(!isWet&&!isCor){
    LW("Окна","Монтаж подоконника ПВХ 400мм",1,"шт.",W.sill);LM("Окна","Подоконник ПВХ 400мм",1,"шт.",mp.sill_m||2500);
  }

  // ЭЛЕКТРИКА
  var elecBase=elecPct!=null?elecPct:100;
  if(elecBase>0){
    // Кол-во розеток по проценту разводки
    var baseSC=isKit?8:isWet?5:isCor?4:6;
    var scMap={20:2,40:4,60:6,80:8};
    var scActual=elecBase===100?baseSC:scMap[elecBase]||Math.max(1,Math.round(baseSC*(elecBase/100)));
    var cableLen=Math.max(3,Math.round(scActual*3+4));

    LW("Электрика","Устройство штроб (2×2 см)",cableLen,"п.м.",W.chasing_22);
    LM("Электрика","Провод ВВГнг-LS 3×2,5 ГОСТ",cableLen+3,"п.м.",65);
    LW("Электрика","Прокладка кабеля в штробе",cableLen,"п.м.",W.cable_lay);
    LW("Электрика","Заделка штроб",cableLen,"п.м.",W.chase_fill);
    LW("Электрика","Монтаж подрозетников",scActual,"шт.",W.subbox_conc);
    LM("Электрика","Подрозетники Schneider/Legrand",scActual,"шт.",55);
    LW("Электрика","Монтаж розеток и выключателей",scActual,"шт.",W.socket);
    LM("Электрика","Розетки/выключатели Legrand/ABB",scActual,"шт.",650);
    LW("Электрика","Монтаж распред. коробки",1,"шт.",W.distrib_box);
    LM("Электрика","Распред. коробка IP40",1,"шт.",350);

    /* ════════════════════════════════════════════════════
       ГЛАВНЫЙ ЩИТОК — СТРОГО только в коридоре/прихожей
       УСЛОВИЕ: isPanelRoom=true И (elecBase>=60 ИЛИ полная разводка)
       В ЛЮБЫХ других помещениях — ЗАПРЕЩЕНО, не считается
    ════════════════════════════════════════════════════ */
    if(isPanelRoom && elecBase>=60){
      if(isPrem){
        // Премиум: полноценный щит 25 автоматов + 4 УЗО + УЗИП
        var breakerCnt=25;
        LW("Электрика","Монтаж главного электрощита (Премиум)",1,"шт.",W.panel_install*1.4);
        LM("Электрика","Щиток встраиваемый ABB 36 модулей",1,"шт.",9800);
        LW("Электрика","Монтаж автоматов ("+breakerCnt+" шт.)",breakerCnt,"шт.",W.breaker);
        LM("Электрика","Автоматы ABB S201/Schneider iC60 16–32А",breakerCnt,"шт.",620);
        LW("Электрика","Монтаж УЗО (4 шт.)",4,"шт.",W.breaker*2);
        LM("Электрика","УЗО ABB 40А/30мА (4 шт.)",4,"шт.",4200);
        LW("Электрика","Монтаж УЗИП (молниезащита) 3P",1,"шт.",3500);
        LM("Электрика","УЗИП Schneider PKF-B+C 3P",1,"шт.",8500);
        LW("Электрика","Ввод питания NYM 5×10 от стояка",8,"п.м.",W.cable_lay*2);
        LM("Электрика","Кабель NYM 5×10мм² (ввод)",9,"п.м.",490);
        LM("Электрика","Шина заземления PE, нулевая шина N",2,"шт.",680);
        LM("Электрика","DIN-рейка, гребёнка, монтажные материалы",1,"компл.",2800);
      }else if(isEco){
        // Эконом: минимальный щит 10 автоматов + 1 УЗО
        LW("Электрика","Монтаж электрощита",1,"шт.",W.panel_install);
        LM("Электрика","Щиток навесной IEK 16 модулей",1,"шт.",3200);
        LW("Электрика","Монтаж автоматов (10 шт.)",10,"шт.",W.breaker);
        LM("Электрика","Автоматы IEK 16–25А",10,"шт.",280);
        LW("Электрика","Монтаж УЗО (1 шт.)",1,"шт.",W.breaker*2);
        LM("Электрика","УЗО EKF 40А/30мА",1,"шт.",2100);
        LW("Электрика","Ввод питания NYM 5×10",5,"п.м.",W.cable_lay*2);
        LM("Электрика","Кабель NYM 5×10мм²",6,"п.м.",490);
      }else{
        // Комфорт: щит 10-16 автоматов + 2 УЗО
        var brkCnt=elecBase===100?16:10;
        LW("Электрика","Монтаж главного электрощита",1,"шт.",W.panel_install);
        LM("Электрика","Щиток встраиваемый ABB 24 модуля",1,"шт.",5800);
        LW("Электрика","Монтаж автоматов ("+brkCnt+" шт.)",brkCnt,"шт.",W.breaker);
        LM("Электрика","Автоматы ABB/Schneider 16-32А",brkCnt,"шт.",420);
        LW("Электрика","Монтаж УЗО (2 шт.)",2,"шт.",W.breaker*2);
        LM("Электрика","УЗО 40А/30мА Schneider",2,"шт.",3300);
        LW("Электрика","Ввод питания NYM 5×10",6,"п.м.",W.cable_lay*2);
        LM("Электрика","Кабель NYM 5×10мм²",7,"п.м.",490);
        LM("Электрика","DIN-рейка, шины, крепёж",1,"компл.",1800);
      }
    }
    /* Конец щитка. В любом другом помещении (кухня, спальня, санузел, балкон)
       щиток и автоматы не добавляются — это жёсткий запрет. */

    // Тёплый пол в санузле (управляется терморегулятором, отдельная группа от щита)
    if(isWet&&bathWarmFloor){
      LW("Электрика","Укладка кабельного мата тёплого пола",1,"компл.",W.warm_floor_mat);
      LM("Электрика","Кабельный мат Devi/Thermo "+Math.ceil(a)+"м²",1,"компл.",Math.ceil(a)*1850);
      LW("Электрика","Монтаж терморегулятора тёплого пола",1,"шт.",W.warm_floor_thermo);
      LM("Электрика","Терморегулятор Thermorex TX-230 / Caleo",1,"шт.",3500);
    }

    // Освещение (только если не посчитано в типе потолка)
    var ceilHasLight=isWet
      ||(ceil==="Гипсокартон"||ceil==="Гипсокартон (2 уровня)")
      ||(ceil==="Натяжные"||ceil==="Натяжные (Premium PVC)");
    if(!ceilHasLight){
      LW("Электрика","Монтаж люстры / потолочного плафона",1,"компл.",W.chandelier);
    }

    // КОНДИЦИОНЕР — стоимость по средней цене города (cityK)
    if(bathroomCfg&&bathroomCfg.hasAircon&&!isWet&&!isCor&&!isBalc){
      // Средние рыночные цены на сплит-систему + монтаж
      var acBtu=Math.ceil(a/10)*9; // BTU ≈ 9BTU на 10м²
      var acModelPrice=isPrem?75000:isEco?32000:52000; // стоимость системы
      var acInstBase=8500; // базовая стоимость монтажа
      var acInstTotal=Math.round(acInstBase*k); // с коэф. города
      LW("Кондиционер","Монтаж внутреннего блока кондиционера",1,"шт.",acInstTotal);
      LW("Кондиционер","Монтаж наружного блока (фасад/балкон)",1,"шт.",Math.round(3500*k));
      LW("Кондиционер","Прокладка фреонового трубопровода",6,"п.м.",Math.round(1100*k));
      LW("Кондиционер","Вакуумирование и заправка фреоном R32",1,"компл.",Math.round(2800*k));
      LM("Кондиционер","Сплит-система "+Math.round(acBtu/1000)+"кВт (инвертор, Mitsubishi/Daikin/Haier)",1,"шт.",acModelPrice);
      LM("Кондиционер","Медная трубка 1/4\"+3/8\" в теплоизоляции",6,"п.м.",920);
      LM("Кондиционер","Кабель ПВС 3×2,5 (питание компрессора)",7,"п.м.",140);
      LM("Кондиционер","Кабель UTP управление",6,"п.м.",55);
      LM("Кондиционер","Дренажная трубка + хомуты",4,"п.м.",180);
      LM("Кондиционер","Крепёж блоков (кронштейны, анкера)",1,"компл.",1600);
    }
  }

  // САНТЕХНИКА — САНУЗЕЛ
  var doPlumb=(plumbPct===undefined||plumbPct===null)?1:plumbPct;
  if(isWet&&doPlumb>0){
    var gvs=0,hvs=0,drains=0;
    if(bathBathing==="bath"||bathBathing==="shower"){gvs++;hvs++;drains++;}
    gvs++;hvs++;drains++; // раковина: ГВС+ХВС+слив
    hvs++;drains++;        // унитаз: ХВС+слив
    if(bathWash){hvs++;drains++;} // стиральная: ХВС+слив
    if(bathTowel){gvs++;hvs++;}   // полотенцесушитель: ГВС+ХВС
    var totalPts=gvs+hvs;

    if(bathPipe==="collector"){
      // ═══ КОЛЛЕКТОРНАЯ РАЗВОДКА REHAU ═══
      var rehauLen=totalPts*5+4; // ~5м на каждую точку
      LW("Сантехника","Монтаж коллектора Rehau ("+totalPts+" выходов)",1,"шт.",12500);
      LM("Сантехника","Коллектор Rehau 1/2\" "+totalPts+"вых.",1,"шт.",totalPts*2300);
      LM("Сантехника","Труба Rehau RAUTITAN PE-X 16×2,2",rehauLen,"п.м.",195);
      LM("Сантехника","Зажимные фитинги Rehau 16мм",totalPts*2,"шт.",330);
      LM("Сантехника","Шкаф коллекторный скрытой установки",1,"шт.",6800);
      LW("Сантехника","Прокладка PE-X труб (без стыков в стенах)",rehauLen,"п.м.",W.cable_lay);
    }else{
      // ═══ ПОСЛЕДОВАТЕЛЬНАЯ РАЗВОДКА PPR ═══
      var pipeLen=Math.max(6,Math.round(totalPts*2.5));
      LW("Сантехника","Разводка ГВС PPR ("+gvs+" точки)",gvs,"точка",W.plumb_point_gvs);
      LW("Сантехника","Разводка ХВС PPR ("+hvs+" точки)",hvs,"точка",W.plumb_point_hvs);
      LM("Сантехника","Труба PPR PN20 d20",pipeLen,"п.м.",285);
      LM("Сантехника","Труба PPR PN25 d25 (стояки)",4,"п.м.",385);
      LM("Сантехника","Фитинги PPR (тройники, муфты, уголки)",1,"компл.",2900);
      LW("Сантехника","Сварка PPR труб",pipeLen,"шов",185);
    }

    // Канализация ПВХ — всегда одинаковая (независимо от типа водоснабжения)
    LW("Сантехника","Монтаж канализации ПВХ ("+drains+" сливов)",drains,"точка",W.drain_pipe/3);
    LM("Сантехника","Труба ПВХ d110 (лежак)",Math.ceil(drains*1.5),"п.м.",695);
    LM("Сантехника","Труба ПВХ d50 (отводы)",Math.ceil(drains*2),"п.м.",345);
    LM("Сантехника","Фановый колпак + арматура ПВХ",1,"компл.",2300);
    LM("Сантехника","Ревизионный люк (скрытой установки)",1,"шт.",3600);

    // Унитаз
    if(bathToilet==="install"){
      LW("Сантехника","Монтаж инсталляции",1,"шт.",W.install_instal);LM("Сантехника","Инсталляция Geberit 4в1 / Grohe Rapid SL",1,"шт.",27000);
      LW("Сантехника","Монтаж короба под инсталляцию (ГКЛ влаг.)",1,"компл.",W.install_box);LM("Стены","ГКЛ влагостойкий + профиль (короб)",1,"компл.",4200);
      LW("Сантехника","Установка унитаза подвесного",1,"шт.",W.toilet_install);LM("Сантехника","Унитаз подвесной Geberit/Roca/Villeroy",1,"шт.",15000);
    }else if(bathToilet!=="none"){
      LW("Сантехника","Установка унитаза напольного",1,"шт.",W.toilet_install);LM("Сантехника","Унитаз напольный Cersanit/Roca",1,"шт.",8500);
    }

    // Купание
    if(bathBathing==="bath"){
      LW("Сантехника","Монтаж акриловой ванны 170×70",1,"шт.",W.bathtub);LM("Сантехника","Ванна акриловая Ravak/Jacob Delafon 170×70",1,"шт.",29500);
      LW("Сантехника","Монтаж смесителя ванны со стойкой душа",1,"шт.",W.bath_mixer);LM("Сантехника","Смеситель ванны Hansgrohe/Grohe",1,"шт.",14800);
      LW("Сантехника","Герметизация примыкания ванны",4,"п.м.",W.sealing);LM("Сантехника","Герметик Ceresit CS-25 + лента",1,"компл.",550);
    }else if(bathBathing==="shower"){
      if(bathShower==="stone"){LW("Сантехника","Монтаж поддона из камня",1,"шт.",W.shower_stand+4000);LM("Сантехника","Поддон из натурального камня/мрамора",1,"шт.",49000);}
      else if(bathShower==="poured"){LW("Сантехника","Заливная душевая (стяжка+линейный трап)",1,"компл.",W.shower_stand+6000);LM("Сантехника","Трап Alcaplast + гидроизоляция заливной",1,"компл.",20000);}
      else{LW("Сантехника","Монтаж душевой стойки + поддона",1,"шт.",W.shower_stand);LM("Сантехника","Душевая стойка Grohe/Hansgrohe",1,"шт.",18000);}
    }

    LW("Сантехника","Установка раковины подвесной",1,"шт.",W.sink);LM("Сантехника","Раковина подвесная Cersanit/Roca",1,"шт.",8200);
    LW("Сантехника","Установка смесителя раковины",1,"шт.",W.sink_mixer);LM("Сантехника","Смеситель раковины Hansgrohe/Grohe",1,"шт.",8800);
    LW("Сантехника","Монтаж зеркала с LED",1,"шт.",W.mirror);LM("Сантехника","Зеркало с LED-подсветкой",1,"шт.",8800);

    if(bathTowel){LW("Сантехника","Монтаж полотенцесушителя водяного",1,"шт.",W.towel_rack);LM("Сантехника","Полотенцесушитель Margaroli / Talis",1,"шт.",10800);}
    if(bathWash){LW("Сантехника","Подключение стиральной машины",1,"шт.",2900);LM("Сантехника","Шаровые краны + шланги",1,"компл.",1950);}
    if(bathFilter){LW("Сантехника","Монтаж фильтрации воды (3 ступени)",1,"компл.",5800);LM("Сантехника","Фильтр BWT / Atlas Filtri",1,"компл.",8100);}
    if(bathPipeCover){LW("Сантехника","Зашивка труб коробом ГКЛ влагостойкий",Math.ceil(totalPts*0.8),"п.м.",2500);LM("Сантехника","ГКЛ влагостойкий + профиль (короб труб)",1,"компл.",3600);}

    // Вентиляция санузла: только осевой вентилятор в вентшахту (не система вентиляции!)
    LW("Электрика","Монтаж осевого вентилятора в вентшахту",1,"шт.",1800);
    LM("Электрика","Вентилятор Vents 100 ВТН (таймер+влажность)",1,"шт.",2800);
    LM("Электрика","Решётка вентиляционная 100мм",1,"шт.",320);
  }

  // САНТЕХНИКА — КУХНЯ
  if(isKit){
    LW("Сантехника","Подводка ГВС+ХВС под мойку (2 точки)",2,"точка",W.plumb_point_gvs);
    LM("Сантехника","Труба PPR PN20 d20 (кухня)",5,"п.м.",285);LM("Сантехника","Фитинги PPR кухня",1,"компл.",1250);
    LW("Сантехника","Монтаж канализации мойки d50",1,"точка",1900);
    LM("Сантехника","Труба ПВХ d50 кухня",2,"п.м.",345);LM("Сантехника","Сифон под мойку",1,"шт.",690);LM("Сантехника","Гибкая подводка 1/2\" (2 шт.)",2,"шт.",325);
  }

  var wT=works.reduce(function(s,l){return s+l.sum;},0);var mT=mats.reduce(function(s,l){return s+l.sum;},0);
  return{works:works,materials:mats,workTotal:wT,matTotal:mT,total:wT+mT,area:a,name:room.name};
}

function calcEstimate(rooms,cond,cls,cityK,roomMats,elecPct,bathroomCfgOrMap,roomAircons,excludeSections){
  // roomAircons: optional map {roomId: true/false} for per-room AC
  // excludeSections: optional array секций для исключения (напр. ["Потолок","Двери"])
  var exclude=excludeSections||[];
  var panelRoomId=null;
  for(var i=0;i<rooms.length;i++){if(/коридор|прихожая/i.test(rooms[i].name)){panelRoomId=rooms[i].id;break;}}
  if(!panelRoomId&&rooms.length>0)panelRoomId=rooms[0].id;
  var isCfgMap=bathroomCfgOrMap&&!bathroomCfgOrMap.bathing&&typeof bathroomCfgOrMap==="object"&&Object.keys(bathroomCfgOrMap).some(function(k){return/^\d+$/.test(String(k));});
  var roomResults=rooms.map(function(r){
    var rm=roomMats&&roomMats[r.id]?roomMats[r.id]:{};
    var bc=isCfgMap?(bathroomCfgOrMap[r.id]||bathroomCfgOrMap["default"]||{}):(bathroomCfgOrMap||{});
    var hasAC=roomAircons&&roomAircons[r.id]?true:false;
    var mergedBc=hasAC?Object.assign({},bc,{hasAircon:true}):bc;
    var res=calcRoom(r,cond,cls,cityK,rm.wall,rm.floor,rm.ceil,rm.door,elecPct,mergedBc,r.id===panelRoomId,plumbPct);
    // Фильтрация исключённых секций
    if(exclude.length){
      res.works=res.works.filter(function(w){return exclude.indexOf(w.sec)===-1;});
      res.materials=res.materials.filter(function(m){return exclude.indexOf(m.sec)===-1;});
      res.workTotal=res.works.reduce(function(s,w){return s+w.sum;},0);
      res.matTotal=res.materials.reduce(function(s,m){return s+m.sum;},0);
      res.total=res.workTotal+res.matTotal;
    }
    return res;
  });
  var wT=roomResults.reduce(function(s,r){return s+r.workTotal;},0);
  var mT=roomResults.reduce(function(s,r){return s+r.matTotal;},0);
  return{rooms:roomResults,workTotal:wT,matTotal:mT,total:wT+mT};
}

function pack(rooms,x,y,w,h,horiz){
  if(!rooms||!rooms.length)return[];
  if(rooms.length===1)return[{id:rooms[0].id,name:rooms[0].name,area:rooms[0].area,px:x,py:y,pw:w,ph:h}];
  var tot=rooms.reduce(function(s,r){return s+(parseFloat(r.area)||10);},0);
  var cum=0;var sp=0;
  for(var i=0;i<rooms.length;i++){cum+=(parseFloat(rooms[i].area)||10);if(cum>=tot/2){sp=i+1;break;}}
  if(!sp||sp>=rooms.length)sp=1;
  var g1=rooms.slice(0,sp);var g2=rooms.slice(sp);
  var r1=g1.reduce(function(s,r){return s+(parseFloat(r.area)||10);},0)/tot;
  if(horiz){var sw=Math.round(w*r1);return pack(g1,x,y,sw,h,false).concat(pack(g2,x+sw,y,w-sw,h,false));}
  var sh=Math.round(h*r1);return pack(g1,x,y,w,sh,true).concat(pack(g2,x,y+sh,w,h-sh,true));
}

function FloorPlanSVG(props){
  var rooms=props.rooms||[];var selectedRoom=props.selectedRoom;var onRoomClick=props.onRoomClick;var wallColors=props.wallColors||{};
  if(!rooms.length)return null;
  var totalArea=rooms.reduce(function(s,r){return s+(parseFloat(r.area)||0);},0);
  var PAD=22;var IW=252;var IH=Math.min(200,Math.max(100,Math.round(Math.sqrt(totalArea)*24)));
  var W2=IW+PAD*2;var H2=IH+PAD*2;
  var sorted=rooms.slice().sort(function(a,b){return(parseFloat(b.area)||0)-(parseFloat(a.area)||0);});
  var packed=pack(sorted,0,0,IW,IH,true);
  return (
    <svg viewBox={"0 0 "+W2+" "+H2} style={{display:"block",width:"100%",height:"auto"}}>
      <rect width={W2} height={H2} fill="#F2F0EB" rx={3}/>
      <rect x={PAD-3} y={PAD-3} width={IW+6} height={IH+6} fill="none" stroke="#1A1814" strokeWidth={3} rx={1}/>
      {packed.map(function(r){
        var rx=r.px+PAD;var ry=r.py+PAD;var hex=wallColors[r.id]||null;var isSel=selectedRoom===r.id;var small=r.pw<58||r.ph<36;
        return (
          <g key={r.id} onClick={function(){onRoomClick&&onRoomClick(r.id);}} style={{cursor:onRoomClick?"pointer":"default"}}>
            <rect x={rx+1} y={ry+1} width={r.pw-2} height={r.ph-2} fill={hex||"#F0EDE6"} stroke={isSel?T.gold:"#1A1814"} strokeWidth={isSel?2.5:1.5} rx={1}/>
            {isSel&&<rect x={rx-2} y={ry-2} width={r.pw+4} height={r.ph+4} fill="none" stroke={T.gold} strokeWidth={1} opacity={0.4} rx={2}/>}
            <text x={rx+r.pw/2} y={ry+r.ph/2-(small?0:6)} textAnchor="middle" dominantBaseline="middle" fontSize={small?7:9} fontFamily={FB} fontWeight="600" fill={isSel?T.goldD:"#1A1814"}>{r.name}</text>
            {!small&&<text x={rx+r.pw/2} y={ry+r.ph/2+7} textAnchor="middle" dominantBaseline="middle" fontSize={6} fontFamily={FM} fill="#7A756C">{r.area}м²</text>}
          </g>
        );
      })}
      <text x={W2-4} y={H2-4} textAnchor="end" fontSize={6} fontFamily={FM} fill="#ADA89F">М 1:50</text>
    </svg>
  );
}

/* ── PHONE FRAME ── */
function Phone(props){
  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"100vh",background:T.bg,fontFamily:FB}}>
      <style>{"@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}::-webkit-scrollbar{display:none;}button{transition:opacity 0.12s;}button:active{opacity:0.75;}"}</style>
      {props.step>0&&<div style={{padding:"4px 28px 0",flexShrink:0}}>
        <div style={{height:2,background:T.surface,borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:((props.step/props.total)*100)+"%",background:"linear-gradient(90deg,"+T.gold+",#D4A97A)",transition:"width 0.4s"}}/>
        </div>
      </div>}
      <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column",position:"relative",animation:"fadeIn 0.2s ease"}}>
        {props.children}
        {props.contact!==false&&<ContactForm compact={props.contactCompact} raised={props.contactRaised}/>}
      </div>
    </div>
  );
}

function Hdr(props){
  return (
    <div style={{padding:"8px 22px 0",flexShrink:0}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
        {props.onBack?<button onClick={props.onBack} style={{width:34,height:34,borderRadius:11,background:T.surface,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><ChevronLeft size={17} color={T.dark}/></button>:<div style={{width:34}}/>}
        {props.total>0&&<span style={{fontFamily:FM,fontSize:11,color:T.muted}}>{props.step+1} / {props.total}</span>}
        <div style={{width:34}}/>
      </div>
      <h1 style={{fontFamily:FD,fontSize:24,fontWeight:600,color:T.dark,margin:"0 0 3px",lineHeight:1.2}}>{props.title}</h1>
      {props.sub&&<p style={{fontFamily:FB,fontSize:12,color:T.muted,margin:"0 0 10px",lineHeight:1.5}}>{props.sub}</p>}
    </div>
  );
}
function Scroll(props){return <div style={{flex:1,overflowY:"auto",padding:"0 22px",WebkitOverflowScrolling:"touch",scrollbarWidth:"none"}}>{props.children}</div>;}
function Btn(props){
  return (
    <div style={{padding:"10px 22px",flexShrink:0}}>
      <button onClick={props.disabled?undefined:props.onPress} style={{width:"100%",padding:"15px",borderRadius:16,border:"none",background:props.disabled?T.surface:"linear-gradient(135deg,"+T.gold+",#D4A97A)",color:props.disabled?T.light:"#fff",fontFamily:FB,fontSize:14,fontWeight:600,cursor:props.disabled?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:props.disabled?"none":"0 4px 20px rgba(184,134,78,0.3)"}}>
        {props.label}{!props.disabled&&<ArrowRight size={16}/>}
      </button>
    </div>
  );
}

/* ── SCREEN: WELCOME ── */
function ScreenWelcome(props){
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{background:"linear-gradient(160deg,#1A1814,#2A2016)",padding:"30px 26px 22px",flexShrink:0}}>
        <div style={{fontFamily:FM,fontSize:10,color:T.gold,letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>М-Ремонт · Смета.Про</div>
        <div style={{fontFamily:FD,fontSize:30,fontWeight:700,color:"#fff",lineHeight:1.2,marginBottom:12}}>Смета ремонта за 3 минуты</div>
        <div style={{fontFamily:FB,fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.7}}>Детальный расчёт работ и материалов с актуальными ценами для вашего города.</div>
      </div>
      <Scroll>
        <div style={{marginTop:16,marginBottom:10}}>
          <div style={{fontFamily:FM,fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Что вы получите</div>
          {[
            {icon:"📋",title:"Смета за 3 минуты",desc:"Детальный перечень работ и материалов. Две отдельные таблицы: работы и материалы. Формат как у строительной компании."},
            {icon:"🏙️",title:"Цены вашего города",desc:"Актуальные рыночные цены 2026 года для вашего региона."},
            {icon:"🛒",title:"Список материалов с брендами",desc:"Конкретные марки под ваш класс ремонта: Эконом / Комфорт / Премиум с ценами сетевых магазинов."},
            {icon:"🏠",title:"Ремонт под ключ с гарантией",desc:"Профессиональный расчёт + дизайн-проект в подарок при заказе ремонта."},
          ].map(function(item){
            return (
              <div key={item.icon} style={{display:"flex",gap:12,padding:"11px 0",borderBottom:"1px solid "+T.border}}>
                <div style={{width:38,height:38,borderRadius:11,background:T.goldL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{item.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:FB,fontSize:13,fontWeight:600,color:T.dark,marginBottom:2}}>{item.title}</div>
                  <div style={{fontFamily:FB,fontSize:11,color:T.muted,lineHeight:1.5}}>{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{paddingBottom:4}}/>
        {/* ── Главная акцентная кнопка: начать расчёт ── */}
        <button onClick={props.onNext} style={{display:"block",width:"100%",padding:"17px 18px",borderRadius:18,background:"#fff",border:"2.5px solid "+T.gold,cursor:"pointer",marginBottom:14,boxShadow:"0 6px 26px rgba(184,134,78,0.28)",textAlign:"center"}}>
          <div style={{fontFamily:FD,fontSize:21,fontWeight:700,color:T.goldD,marginBottom:3,letterSpacing:-0.3}}>📐 Начать расчёт сметы</div>
          <div style={{fontFamily:FB,fontSize:11,color:T.muted}}>Бесплатно · результат за 3 минуты</div>
        </button>
        {/* ── Большая CTA-кнопка на главной ── */}
        <a href="https://m1-remont.ru" target="_blank" rel="noopener noreferrer"
           style={{display:"block",textDecoration:"none",marginBottom:14}}>
          <div style={{borderRadius:18,overflow:"hidden",boxShadow:"0 4px 20px rgba(184,134,78,0.32)"}}>
            <div style={{background:"linear-gradient(135deg,#1A1410,#2C1E0C)",padding:"14px 16px 10px"}}>
              <div style={{fontFamily:FD,fontSize:16,fontWeight:700,color:"#F0E2CC",marginBottom:5,lineHeight:1.2}}>
                🏠 Заказать ремонт под ключ
              </div>
              <div style={{fontFamily:FB,fontSize:10,color:"rgba(255,255,255,0.58)",lineHeight:1.55}}>
                Если дизайн-проект сформировался некорректно — не расстраивайтесь. При заказе ремонта мы сделаем профессиональный дизайн-проект <span style={{color:"#D4A060",fontWeight:700}}>бесплатно</span>.
              </div>
            </div>
            <div style={{background:"linear-gradient(90deg,#B8864E,#D4A060)",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontFamily:FB,fontSize:12,fontWeight:700,color:"#fff"}}>Перейти на сайт →</span>
              <span style={{fontSize:16}}>🎁</span>
            </div>
          </div>
        </a>
      </Scroll>
      <Btn label="Начать расчёт смет" onPress={props.onNext}/>
    </div>
  );
}


/* ══ ContactForm — плавающая кнопка + форма заявки на ремонт ══
   Отправка на m-remont1@bk.ru через FormSubmit (без бэкенда) +
   резервный mailto. Открывается по кнопке слева снизу.            */
function ContactForm(props){
  var compact=!!(props&&props.compact);   // меньший, ненавязчивый вид (экраны выбора материалов)
  var raised =!!(props&&props.raised);    // поднять над нижней CTA-кнопкой, чтобы не перекрывать
  // Низ кнопки: над CTA (raised) либо у самого края рамки. Высота CTA ≈ 68px + зазор.
  var btnBottom=raised?76:18;
  var s0=useState(false);var open=s0[0];var setOpen=s0[1];
  var s1=useState("");var name=s1[0];var setName=s1[1];
  var s2=useState("");var cityF=s2[0];var setCityF=s2[1];
  var s3=useState("");var contact=s3[0];var setContact=s3[1];
  var s4=useState("");var task=s4[0];var setTask=s4[1];
  var s5=useState("idle");var sendState=s5[0];var setSendState=s5[1];

  function submit(){
    if(!name||!contact){setSendState("error");return;}
    setSendState("sending");
    // Основной способ — FormSubmit.co (бесплатный релей на почту, без регистрации после первого подтверждения)
    var payload={
      _subject:"Заявка на ремонт из приложения Смета",
      "Имя":name,
      "Город":cityF||"—",
      "Контакт":contact,
      "Что хочет сделать":task||"—",
      _template:"table"
    };
    fetch("https://formsubmit.co/ajax/m-remont1@bk.ru",{
      method:"POST",
      headers:{"Content-Type":"application/json","Accept":"application/json"},
      body:JSON.stringify(payload)
    })
    .then(function(r){return r.json();})
    .then(function(){
      setSendState("ok");
      setTimeout(function(){setOpen(false);setSendState("idle");setName("");setCityF("");setContact("");setTask("");},2500);
    })
    .catch(function(){
      // Резерв — mailto (откроет почтовый клиент пользователя)
      var body="Имя: "+name+"%0AГород: "+(cityF||"—")+"%0AКонтакт: "+contact+"%0AЗадача: "+(task||"—");
      window.location.href="mailto:m-remont1@bk.ru?subject="+encodeURIComponent("Заявка на ремонт")+"&body="+body;
      setSendState("ok");
      setTimeout(function(){setOpen(false);setSendState("idle");},2500);
    });
  }

  var inputStyle={width:"100%",padding:"11px 13px",border:"1.5px solid "+T.border,borderRadius:11,fontFamily:FB,fontSize:13,color:T.dark,background:T.card,outline:"none",marginBottom:9,boxSizing:"border-box"};

  return(
    <div>
      {/* Плавающая кнопка заявки.
         compact=true  → крошечный кружок-конвертик (все экраны, кроме самих смет).
         compact=false → полная кнопка «✉️ Оставить заявку» (экраны смет).
         raised        → поднята над нижней CTA, чтобы ничего не перекрывать. */}
      {!open&&<button onClick={function(){setOpen(true);}} aria-label="Оставить заявку" title="Оставить заявку" style={{
        position:"absolute",right:compact?12:16,bottom:btnBottom,zIndex:200,
        display:"flex",alignItems:"center",justifyContent:"center",gap:compact?0:7,
        padding:compact?0:"11px 16px",
        width:compact?34:"auto",height:compact?34:"auto",
        background:"linear-gradient(135deg,#B8864E,#D4A060)",border:"none",
        borderRadius:compact?"50%":30,cursor:"pointer",
        boxShadow:compact?"0 2px 8px rgba(184,134,78,0.32)":"0 4px 18px rgba(184,134,78,0.5)",
        opacity:compact?0.9:1,
        transition:"bottom 0.32s cubic-bezier(0.4,0,0.2,1),opacity 0.2s ease"}}>
        <span style={{fontSize:compact?14:16,lineHeight:1}}>✉️</span>
        {!compact&&<span style={{fontFamily:FB,fontSize:12,fontWeight:700,color:"#fff",whiteSpace:"nowrap"}}>Оставить заявку</span>}
      </button>}

      {/* Модал формы */}
      {open&&<div style={{position:"absolute",inset:0,zIndex:300,display:"flex",flexDirection:"column",justifyContent:"flex-end",background:"rgba(0,0,0,0.55)"}} onClick={function(){setOpen(false);}}>
        <div onClick={function(e){e.stopPropagation();}} style={{background:T.bg||"#fff",borderRadius:"22px 22px 0 0",padding:"20px 18px 24px",boxShadow:"0 -8px 32px rgba(0,0,0,0.3)"}}>
          <div style={{width:40,height:4,background:T.border,borderRadius:3,margin:"0 auto 16px"}}/>
          <div style={{fontFamily:FD,fontSize:19,fontWeight:700,color:T.dark,marginBottom:4}}>Заявка на ремонт</div>
          <div style={{fontFamily:FB,fontSize:11,color:T.muted,marginBottom:16,lineHeight:1.5}}>Оставьте контакты — наш специалист свяжется с вами и бесплатно составит дизайн-проект.</div>

          {sendState==="ok"?(
            <div style={{textAlign:"center",padding:"30px 0"}}>
              <div style={{fontSize:46,marginBottom:12}}>✅</div>
              <div style={{fontFamily:FD,fontSize:17,fontWeight:700,color:T.dark,marginBottom:6}}>Заявка отправлена!</div>
              <div style={{fontFamily:FB,fontSize:12,color:T.muted}}>Мы свяжемся с вами в ближайшее время.</div>
            </div>
          ):(
            <div>
              <input value={name} onChange={function(e){setName(e.target.value);}} placeholder="Ваше имя *" style={inputStyle}/>
              <input value={cityF} onChange={function(e){setCityF(e.target.value);}} placeholder="Город" style={inputStyle}/>
              <input value={contact} onChange={function(e){setContact(e.target.value);}} placeholder="Телефон или e-mail *" style={inputStyle}/>
              <textarea value={task} onChange={function(e){setTask(e.target.value);}} placeholder="Что хотите сделать? (ремонт, дизайн-проект...)" rows={3} style={Object.assign({},inputStyle,{resize:"none",fontFamily:FB})}/>
              {sendState==="error"&&<div style={{fontFamily:FB,fontSize:11,color:"#C0392B",marginBottom:8}}>Заполните имя и контакт</div>}
              <button onClick={submit} disabled={sendState==="sending"} style={{width:"100%",padding:"13px",background:sendState==="sending"?"#A0988C":"linear-gradient(135deg,#B8864E,#D4A060)",border:"none",borderRadius:13,cursor:sendState==="sending"?"wait":"pointer",fontFamily:FB,fontSize:14,fontWeight:700,color:"#fff",boxShadow:"0 3px 12px rgba(184,134,78,0.4)"}}>
                {sendState==="sending"?"Отправка...":"Отправить заявку"}
              </button>
              <button onClick={function(){setOpen(false);}} style={{width:"100%",padding:"10px",background:"none",border:"none",cursor:"pointer",fontFamily:FB,fontSize:12,color:T.muted,marginTop:6}}>Отмена</button>
            </div>
          )}
        </div>
      </div>}
    </div>
  );
}

/* ══ PromoCard — акцентная рамка-ссылка под плашками стоимости ══
   Используется в ScreenEstimate (смета без дизайн-проекта).          */
function PromoCard(){
  return(
    <a href="https://m1-remont.ru" target="_blank" rel="noopener noreferrer"
       style={{display:"flex",alignItems:"center",gap:12,marginTop:8,padding:"12px 14px",
               background:"linear-gradient(135deg,#1A1410 0%,#2C1E0C 60%,#341E06 100%)",
               borderRadius:14,border:"1.5px solid rgba(184,134,78,0.55)",
               textDecoration:"none",boxShadow:"0 3px 14px rgba(184,134,78,0.22)"}}>
      <div style={{width:38,height:38,borderRadius:11,flexShrink:0,
                   background:"linear-gradient(135deg,#B8864E,#D4A060)",
                   display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🏠</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:FD,fontSize:13,fontWeight:700,color:"#F0E2CC",marginBottom:2,lineHeight:1.2}}>
          Заказать ремонт<br/>по минимальным расценкам
        </div>
        <div style={{fontFamily:FM,fontSize:9,color:"rgba(255,255,255,0.50)"}}>Нажмите, чтобы перейти на сайт</div>
      </div>
      <div style={{flexShrink:0,background:"linear-gradient(135deg,#B8864E,#D4A060)",
                   borderRadius:9,padding:"6px 10px",display:"flex",alignItems:"center",gap:4}}>
        <span style={{fontFamily:FM,fontSize:9,fontWeight:700,color:"#fff"}}>Перейти</span>
        <ArrowRight size={12} color="#fff"/>
      </div>
    </a>
  );
}


/* ══ PromoCardDesign — для ветки дизайн-проекта ══ */
function PromoCardDesign(){
  return(
    <a href="https://m1-remont.ru" target="_blank" rel="noopener noreferrer"
       style={{display:"flex",alignItems:"center",gap:12,marginTop:8,padding:"12px 14px",
               background:"linear-gradient(135deg,#1A1410 0%,#2C1E0C 60%,#341E06 100%)",
               borderRadius:14,border:"1.5px solid rgba(184,134,78,0.55)",
               textDecoration:"none",boxShadow:"0 3px 14px rgba(184,134,78,0.22)"}}>
      <div style={{width:38,height:38,borderRadius:11,flexShrink:0,
                   background:"linear-gradient(135deg,#B8864E,#D4A060)",
                   display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📐</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontFamily:FD,fontSize:13,fontWeight:700,color:"#F0E2CC",marginBottom:2,lineHeight:1.2}}>
          Индивидуальный дизайн-проект<br/>в подарок
        </div>
        <div style={{fontFamily:FM,fontSize:9,color:"rgba(255,255,255,0.50)"}}>Нажмите, чтобы перейти на сайт</div>
      </div>
      <div style={{flexShrink:0,background:"linear-gradient(135deg,#B8864E,#D4A060)",
                   borderRadius:9,padding:"6px 10px",display:"flex",alignItems:"center",gap:4}}>
        <span style={{fontFamily:FM,fontSize:9,fontWeight:700,color:"#fff"}}>Перейти</span>
        <ArrowRight size={12} color="#fff"/>
      </div>
    </a>
  );
}

/* ══ PromoCardFull — большой финальный CTA в конце прокрутки ══ */
function PromoCardFull(){
  return(
    <a href="https://m1-remont.ru" target="_blank" rel="noopener noreferrer"
       style={{display:"block",textDecoration:"none",borderRadius:20,overflow:"hidden",
               boxShadow:"0 6px 28px rgba(184,134,78,0.38)",margin:"12px 0 20px"}}>
      <div style={{background:"linear-gradient(145deg,#1A1410,#2C1E0C,#381E06)",
                   padding:"22px 20px 16px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",left:-30,bottom:-30,width:130,height:130,borderRadius:"50%",
                     background:"rgba(184,134,78,0.08)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",right:-20,top:-20,width:90,height:90,borderRadius:"50%",
                     background:"rgba(184,134,78,0.06)",pointerEvents:"none"}}/>
        <div style={{fontSize:36,marginBottom:10}}>🏠</div>
        <div style={{fontFamily:FD,fontSize:20,fontWeight:700,color:"#F0E2CC",lineHeight:1.2,marginBottom:8}}>
          Доверьте ремонт профессионалам
        </div>
        {/* 3 буллита */}
        <div style={{display:"flex",flexDirection:"column",gap:6,textAlign:"left",
                     background:"rgba(255,255,255,0.05)",borderRadius:12,padding:"12px 14px",marginBottom:12}}>
          {[
            {icon:"📐",text:"Дизайн-проект квартиры — бесплатно"},
            {icon:"📋",text:"Детальная смета по вашим параметрам"},
            {icon:"✅",text:"Гарантия качества и сроков"},
          ].map(function(b){return(
            <div key={b.icon} style={{display:"flex",alignItems:"center",gap:10,
                                      fontFamily:FB,fontSize:11,color:"rgba(255,255,255,0.80)"}}>
              <span style={{fontSize:15,flexShrink:0}}>{b.icon}</span>{b.text}
            </div>
          );})}
        </div>
        <div style={{fontFamily:FB,fontSize:11,color:"rgba(255,255,255,0.45)"}}>
          Нажмите чтобы перейти на сайт
        </div>
      </div>
      <div style={{background:"linear-gradient(90deg,#B8864E,#D4A060)",padding:"14px 20px",
                   display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
        <span style={{fontFamily:FB,fontSize:14,fontWeight:700,color:"#fff",letterSpacing:0.3}}>
          Заказать ремонт под ключ
        </span>
        <span style={{fontSize:18}}>→</span>
      </div>
    </a>
  );
}

/* ── SCREEN: CITY ── */
function ScreenCity(props){
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <Hdr title="Выберите город" sub="По одному городу на федеральный округ" step={0} total={0}/>
      <Scroll>
        {CITIES.map(function(c){
          return (
            <button key={c.id} onClick={function(){props.onSelect(c);}} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 14px",background:T.card,borderRadius:14,border:"1.5px solid "+T.border,cursor:"pointer",marginBottom:8,width:"100%",boxShadow:T.shadow}}>
              <div style={{width:38,height:38,borderRadius:10,background:T.goldL,display:"flex",alignItems:"center",justifyContent:"center"}}><MapPin size={16} color={T.gold}/></div>
              <div style={{flex:1,textAlign:"left"}}>
                <div style={{fontFamily:FB,fontSize:14,fontWeight:500,color:T.dark}}>{c.name}</div>
                <div style={{fontFamily:FM,fontSize:9,color:T.muted}}>{c.fo}</div>
              </div>
              <ArrowRight size={13} color={T.light}/>
            </button>
          );
        })}
        <div style={{paddingBottom:16}}/>
      </Scroll>
    </div>
  );
}

/* ── SCREEN: CHOOSE PATH ── */
function ScreenChoose(props){
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <Hdr title={props.city.name} sub="Выберите тип услуги" onBack={props.onBack} step={0} total={0}/>
      <Scroll>
        <button onClick={props.onShort} style={{display:"block",width:"100%",borderRadius:22,overflow:"hidden",border:"none",cursor:"pointer",marginBottom:16,padding:0,textAlign:"left",boxShadow:"0 8px 32px rgba(42,80,140,0.22)"}}>
          <div style={{background:"linear-gradient(145deg,#1A2E4A 0%,#2A4878 60%,#1E3A68 100%)",padding:"22px 22px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{background:"rgba(255,255,255,0.12)",borderRadius:8,padding:"4px 9px",display:"inline-flex",alignItems:"center",gap:5}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:"#5BC8FF",boxShadow:"0 0 6px #5BC8FF"}}/>
                <span style={{fontFamily:FM,fontSize:9,color:"#A0CFFF",letterSpacing:1}}>ЗА 3 МИНУТЫ</span>
              </div>
            </div>
            <div style={{fontFamily:FD,fontSize:26,fontWeight:700,color:"#FFFFFF",marginBottom:8,lineHeight:1.1}}>📋 Смета<br/>без проекта</div>
            <div style={{fontFamily:FB,fontSize:12,color:"rgba(255,255,255,0.72)",lineHeight:1.65}}>Укажите помещения, состояние и класс — получите детальную смету работ и материалов с брендами.</div>
          </div>
          <div style={{background:"linear-gradient(90deg,#152640,#1E3A68)",padding:"11px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{display:"flex",gap:12}}>
              <span style={{fontFamily:FM,fontSize:9,color:"#5B9BE0",display:"flex",alignItems:"center",gap:4}}>⚡ 4 шага</span>
              <span style={{fontFamily:FM,fontSize:9,color:"#5B9BE0",display:"flex",alignItems:"center",gap:4}}>📊 Таблицы работ и материалов</span>
            </div>
            <ArrowRight size={15} color="#5B9BE0"/>
          </div>
        </button>
        <button onClick={props.onDesign} style={{display:"block",width:"100%",borderRadius:22,overflow:"hidden",border:"none",cursor:"pointer",marginBottom:16,padding:0,textAlign:"left",boxShadow:"0 8px 32px rgba(90,140,60,0.22)"}}>
          <div style={{background:"linear-gradient(145deg,#1A3020 0%,#2A5030 60%,#1A3A20 100%)",padding:"22px 22px 16px"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{background:"rgba(255,255,255,0.12)",borderRadius:8,padding:"4px 9px",display:"inline-flex",alignItems:"center",gap:5}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:"#7AE87A",boxShadow:"0 0 6px #7AE87A"}}/>
                <span style={{fontFamily:FM,fontSize:9,color:"#A0E8A0",letterSpacing:1}}>ЗА 7 МИНУТ</span>
              </div>
            </div>
            <div style={{fontFamily:FD,fontSize:26,fontWeight:700,color:"#F0E2CC",marginBottom:8,lineHeight:1.1}}>🎨 Ремонт с<br/>дизайн-проектом</div>
            <div style={{fontFamily:FB,fontSize:12,color:"rgba(255,255,255,0.72)",lineHeight:1.65}}>Интерактивный план — выберите отделку каждой комнаты. Полная документация + смета.</div>
          </div>
          <div style={{background:"linear-gradient(90deg,#162818,#1E4028)",padding:"11px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{display:"flex",gap:12}}>
              <span style={{fontFamily:FM,fontSize:9,color:T.gold,display:"flex",alignItems:"center",gap:4}}>🏠 Интерактивный план</span>
              <span style={{fontFamily:FM,fontSize:9,color:T.gold,display:"flex",alignItems:"center",gap:4}}>📋 Материалы и смета</span>
            </div>
            <ArrowRight size={15} color={T.gold}/>
          </div>
        </button>
        <div style={{padding:"10px 12px",background:T.surface,borderRadius:12,border:"1px solid "+T.border,marginBottom:12}}>
          <div style={{fontFamily:FB,fontSize:11,color:T.muted,lineHeight:1.7}}>💡 Смета всегда содержит <b>Таблицу 1 — Работы</b> и <b>Таблицу 2 — Материалы</b> с указанием брендов.</div>
        </div>
        <a href="https://m1-remont.ru" target="_blank" rel="noopener noreferrer"
           style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",
                   background:"linear-gradient(135deg,#1A1410,#2C1E0C)",
                   borderRadius:12,border:"1px solid rgba(184,134,78,0.38)",
                   textDecoration:"none",marginBottom:16,boxShadow:"0 2px 8px rgba(184,134,78,0.15)"}}>
          <span style={{fontSize:15}}>📐</span>
          <span style={{fontFamily:FB,fontSize:11,fontWeight:700,color:"#F0E2CC",flex:1}}>Индивидуальный дизайн-проект</span>
          <span style={{fontFamily:FM,fontSize:9,color:"rgba(255,255,255,0.50)"}}>Перейти на сайт</span>
          <ArrowRight size={13} color="#D4A060"/>
        </a>
        <div style={{height:4}}/>
      </Scroll>
    </div>
  );
}

/* ── SCREEN: UPLOAD ── */
function ScreenUpload(props){
  var s0=useState(null);var mode=s0[0];var setMode=s0[1];
  var s1=useState([{id:1,name:"Кухня",area:"12"},{id:2,name:"Спальня",area:"18"},{id:3,name:"Гостиная",area:"25"},{id:4,name:"Санузел",area:"6"},{id:5,name:"Коридор",area:"8"}]);var rooms=s1[0];var setRooms=s1[1];
  var s2=useState("");var nm=s2[0];var setNm=s2[1];
  var s3=useState("");var ar=s3[0];var setAr=s3[1];
  var s4=useState(null);var err=s4[0];var setErr=s4[1];
  var s5=useState(null);var imgSrc=s5[0];var setImgSrc=s5[1];
  var tot=rooms.reduce(function(s,r){return s+(parseFloat(r.area)||0);},0);
  function addRoom(){if(!nm||!ar)return;setRooms(rooms.concat([{id:Date.now(),name:nm,area:ar}]));setNm("");setAr("");}
  function handleFile(file){
    if(!file)return;setMode("loading");setErr(null);

    var rd=new FileReader();
    rd.onload=function(e){
      var dataUrl=e.target.result;
      setImgSrc(dataUrl);

      // ── ШАГ 1: Сжимаем фото до макс. 800px (было 4K+ → 8MB, стало ~80KB) ──
      var img=new Image();
      img.onload=function(){
        var MAX=800;
        var scale=Math.min(1, MAX/Math.max(img.width,img.height));
        var cw=Math.round(img.width*scale);
        var ch=Math.round(img.height*scale);
        var canvas=document.createElement("canvas");
        canvas.width=cw; canvas.height=ch;
        var ctx2=canvas.getContext("2d");
        ctx2.drawImage(img,0,0,cw,ch);
        // JPEG quality 0.82 — баланс качество/скорость
        var compressed=canvas.toDataURL("image/jpeg",0.82);
        var b64=compressed.split(",")[1];
        var mt="image/jpeg";

        // ── ШАГ 2: Промпт больше не нужен — AI-логика переехала на сервер ──

        // ── ШАГ 3: AbortController — таймаут 30 сек ──
        // ВАЖНО: теперь отправляем на СВОЙ сервер /api/recognize-plan
        // Ключ AI-Gateway живёт на сервере, в браузер не попадает!
        var abort=new AbortController();
        var timer=setTimeout(function(){abort.abort();},30000);

        fetch("/api/recognize-plan",{
          method:"POST",
          signal:abort.signal,
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            imageBase64:b64  // просто отправляем base64 на сервер
          })
        })
        .then(function(res){clearTimeout(timer);return res.json();})
        .then(function(d){
          // d.ok = true если распознавание прошло успешно
          if(!d.ok){
            throw new Error(d.error||"Ошибка распознавания плана");
          }
          // Достаём распознанные комнаты, полигон и стены
          var rec=(d.rooms)||[];
          var aptPoly=(d.apt)||null;
          var wallSegs=(d.walls)||[];
          if(rec&&rec.length){
            // Если не распознаны типовые комнаты — добавляем фолбэки
            var hasKit=rec.some(function(r){return /кухн/i.test(r.name);});
            var hasCor=rec.some(function(r){return /коридор|прихожая/i.test(r.name);});
            var hasBath=rec.some(function(r){return /санузел|ванн|туалет/i.test(r.name);});
            if(!hasKit)rec.push({name:"Кухня",area:10,cx:0.2,cy:0.5});
            if(!hasCor)rec.push({name:"Коридор",area:6,cx:0.5,cy:0.5});
            if(!hasBath)rec.push({name:"Санузел совмещённый",area:4,cx:0.7,cy:0.3});
            var planGeo={aptPoly:aptPoly,wallSegs:wallSegs};
            setRooms(rec.map(function(r,i){
              return{id:Date.now()+i,name:r.name,area:String(r.area||10),
                bounds:r.bounds||null,cx:r.cx||null,cy:r.cy||null,
                windows:r.windows||[],doors:r.doors||[]};
            }));
            if(props.onPlanGeo)props.onPlanGeo(planGeo);
            setMode("manual");
          }else{
            throw new Error("Не распознаны комнаты");
          }
        })
        .catch(function(e){
          clearTimeout(timer);
          var msg=e.name==="AbortError"
            ?"Таймаут 30 сек — попробуйте фото с лучшим контрастом."
            :"Ошибка: "+e.message;
          setErr(msg+". Введите вручную.");
          setMode("manual");
        });
      };
      img.onerror=function(){
        setErr("Не удалось прочитать изображение.");setMode("manual");
      };
      img.src=dataUrl;
    };
    rd.onerror=function(){setErr("Ошибка чтения файла.");setMode("manual");};
    rd.readAsDataURL(file);
  }
  var step=props.step||0;var total=props.total||4;
  if(!mode)return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <Hdr title="Загрузите план" sub="ИИ распознает комнаты и площади" onBack={props.onBack} step={step} total={total}/>
      <Scroll>
        <div style={{marginBottom:10,borderRadius:18,overflow:"hidden",position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,padding:"16px",background:"linear-gradient(135deg,#1A1814,#2A2520)",pointerEvents:"none",borderRadius:18}}>
            <div style={{width:46,height:46,borderRadius:13,background:"rgba(184,134,78,0.25)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Camera size={22} color={T.gold}/></div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}><span style={{fontFamily:FB,fontSize:14,fontWeight:500,color:"#fff"}}>Сфотографировать план</span><span style={{fontFamily:FM,fontSize:9,background:T.gold,color:"#fff",padding:"2px 7px",borderRadius:5}}>ИИ</span></div>
              <div style={{fontFamily:FB,fontSize:11,color:"rgba(255,255,255,0.5)"}}>Камера телефона</div>
            </div>
          </div>
          <input type="file" accept="image/*" capture="environment" onChange={function(e){var f=e.target.files&&e.target.files[0];if(f)handleFile(f);e.target.value="";}} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",opacity:0,cursor:"pointer"}}/>
        </div>
        <div style={{marginBottom:10,borderRadius:18,overflow:"hidden",position:"relative"}}>
          <div style={{display:"flex",alignItems:"center",gap:14,padding:"16px",background:T.card,border:"1.5px solid "+T.border,pointerEvents:"none",borderRadius:18,boxShadow:T.shadow}}>
            <div style={{width:46,height:46,borderRadius:13,background:T.goldL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Upload size={20} color={T.gold}/></div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}><span style={{fontFamily:FB,fontSize:14,fontWeight:500,color:T.dark}}>Загрузить из галереи</span><span style={{fontFamily:FM,fontSize:9,background:T.gold,color:"#fff",padding:"2px 7px",borderRadius:5}}>ИИ</span></div>
              <div style={{fontFamily:FB,fontSize:11,color:T.muted}}>Любой формат фото</div>
            </div>
          </div>
          <input type="file" accept="image/*" onChange={function(e){var f=e.target.files&&e.target.files[0];if(f)handleFile(f);e.target.value="";}} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",opacity:0,cursor:"pointer"}}/>
        </div>
        <button onClick={function(){setMode("manual");}} style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"15px",background:T.surface,borderRadius:18,border:"1.5px solid "+T.border,cursor:"pointer",marginBottom:12}}>
          <div style={{width:46,height:46,borderRadius:13,background:T.surface,border:"1px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><PenLine size={20} color={T.muted}/></div>
          <div style={{textAlign:"left"}}><div style={{fontFamily:FB,fontSize:14,fontWeight:500,color:T.dark,marginBottom:2}}>Ввести вручную</div><div style={{fontFamily:FB,fontSize:11,color:T.muted}}>Указать площади помещений</div></div>
        </button>
      </Scroll>
    </div>
  );
  if(mode==="loading")return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <Hdr title="Распознавание плана" step={step} total={total}/>
      <Scroll><div style={{textAlign:"center",padding:"30px 16px"}}>
        {imgSrc&&<img src={imgSrc} style={{width:"100%",maxHeight:180,objectFit:"contain",borderRadius:12,marginBottom:20,border:"2px solid "+T.border}}/>}
        {/* Анимированный прогресс */}
        <div style={{width:"100%",height:4,background:T.border,borderRadius:4,marginBottom:20,overflow:"hidden"}}>
          <div style={{height:"100%",background:"linear-gradient(90deg,"+T.gold+",#C8A870)",borderRadius:4,animation:"progress-slide 2s ease-in-out infinite",width:"60%"}}/>
        </div>
        <style>{`@keyframes progress-slide{0%{transform:translateX(-100%)}100%{transform:translateX(260%)}}`}</style>
        <div style={{fontFamily:FB,fontSize:15,fontWeight:600,color:T.dark,marginBottom:8}}>Анализирую план...</div>
        <div style={{fontFamily:FB,fontSize:12,color:T.muted,marginBottom:20,lineHeight:1.5}}>
          Сжимаю изображение и отправляю в Claude AI.<br/>
          Обычно занимает <b style={{color:T.goldD}}>5–15 секунд</b>.
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:6,textAlign:"left",background:T.surface,borderRadius:14,padding:"12px 14px",border:"1px solid "+T.border}}>
          {[
            {t:"Сжатие фото до 800px",done:true},
            {t:"Отправка в Claude AI Haiku",done:true},
            {t:"Распознавание контуров и помещений",done:false},
            {t:"Построение чертежа",done:false},
          ].map(function(s,i){return(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,fontFamily:FB,fontSize:11,color:s.done?T.goldD:T.muted}}>
              <span style={{fontSize:12}}>{s.done?"✓":"○"}</span>
              {s.t}
            </div>
          );})}
        </div>
      </div></Scroll>
    </div>
  );
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <Hdr title="Помещения" sub={err?"Введите вручную":"Проверьте данные"} onBack={function(){setMode(null);setErr(null);}} step={step} total={total}/>
      <Scroll>
        {err&&<div style={{padding:"9px 12px",background:"#FEF0F0",borderRadius:12,border:"1px solid #F0B0B0",marginBottom:10,fontFamily:FB,fontSize:11,color:"#C03030"}}>{err}</div>}
        {!err&&imgSrc&&<div style={{padding:"7px 10px",background:T.goldL,borderRadius:10,marginBottom:10,fontFamily:FB,fontSize:11,color:T.goldD}}>✅ Распознано · скорректируйте площади</div>}
        <div style={{fontFamily:FB,fontSize:12,color:T.muted,marginBottom:8}}>Итого: {fmt(tot)} м²</div>
        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
          {rooms.map(function(r){
            return(
              <div key={r.id} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",background:T.card,borderRadius:12,border:"1px solid "+T.border}}>
                <Home size={12} color={T.muted}/><span style={{flex:1,fontFamily:FB,fontSize:13,color:T.dark}}>{r.name}</span>
                <input defaultValue={r.area} onBlur={function(e){var val=e.target.value;setRooms(rooms.map(function(x){return x.id===r.id?{id:x.id,name:x.name,area:val}:x;}));}} style={{width:46,fontFamily:FM,fontSize:12,color:T.dark,border:"1px solid "+T.border,borderRadius:7,padding:"3px 5px",background:T.surface,textAlign:"center"}}/>
                <span style={{fontFamily:FM,fontSize:10,color:T.muted}}>м²</span>
                <button onClick={function(){setRooms(rooms.filter(function(x){return x.id!==r.id;}));}} style={{background:"none",border:"none",padding:2,cursor:"pointer",color:T.light}}><X size={12}/></button>
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:7,marginBottom:16}}>
          <input value={nm} onChange={function(e){setNm(e.target.value);}} placeholder="Название" style={{flex:2,padding:"9px 11px",border:"1.5px solid "+T.border,borderRadius:11,fontFamily:FB,fontSize:12,color:T.dark,background:T.card,outline:"none"}}/>
          <input value={ar} onChange={function(e){setAr(e.target.value);}} placeholder="м²" type="number" style={{flex:1,padding:"9px 11px",border:"1.5px solid "+T.border,borderRadius:11,fontFamily:FB,fontSize:12,color:T.dark,background:T.card,outline:"none"}}/>
          <button onClick={addRoom} style={{width:40,height:40,borderRadius:11,background:T.goldL,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:T.gold,flexShrink:0}}><Plus size={16}/></button>
        </div>
      </Scroll>
      <Btn label="Готово" onPress={function(){props.onNext(rooms,imgSrc);}} disabled={!rooms.length}/>
    </div>
  );
}

/* ── SCREEN: COND + CLASS ── */
function ScreenCondClass(props){
  var s0=useState(null);var cond=s0[0];var setCond=s0[1];
  var s1=useState(null);var cls=s1[0];var setCls=s1[1];
  var s2=useState("cond");var tab=s2[0];var setTab=s2[1];
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <Hdr title="Параметры ремонта" onBack={props.onBack} step={props.step||1} total={props.total||4}/>
      <div style={{display:"flex",margin:"0 22px 12px",background:T.surface,borderRadius:12,padding:3,flexShrink:0,gap:3}}>
        <button onClick={function(){setTab("cond");}} style={{flex:1,padding:"9px",borderRadius:9,border:"none",background:tab==="cond"?T.card:"transparent",fontFamily:FB,fontSize:12,fontWeight:600,color:tab==="cond"?T.dark:T.muted,cursor:"pointer",boxShadow:tab==="cond"?T.shadow:"none"}}>{cond?"✓ ":""}Состояние</button>
        <button onClick={function(){setTab("cls");}} style={{flex:1,padding:"9px",borderRadius:9,border:"none",background:tab==="cls"?T.card:"transparent",fontFamily:FB,fontSize:12,fontWeight:600,color:tab==="cls"?T.dark:T.muted,cursor:"pointer",boxShadow:tab==="cls"?T.shadow:"none"}}>{cls?"✓ ":""}Класс ремонта</button>
      </div>
      <Scroll>
        {tab==="cond"&&<div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10,paddingBottom:16}}>
            {CONDS.map(function(c){
              var isSel=cond===c.id;
              return(
                <button key={c.id} onClick={function(){setCond(c.id);setTab("cls");}} style={{padding:"16px 12px",background:isSel?T.goldL:T.card,borderRadius:16,border:"2px solid "+(isSel?T.gold:T.border),cursor:"pointer",textAlign:"left",boxShadow:T.shadow}}>
                  <div style={{fontSize:26,marginBottom:8}}>{c.icon}</div>
                  <div style={{fontFamily:FB,fontSize:13,fontWeight:700,color:isSel?T.goldD:T.dark,marginBottom:4}}>{c.label}</div>
                  <div style={{fontFamily:FB,fontSize:11,color:T.muted,lineHeight:1.4}}>{c.desc}</div>
                  {isSel&&<div style={{marginTop:8,display:"inline-flex",alignItems:"center",gap:3,background:T.gold,borderRadius:7,padding:"2px 8px"}}><Check size={9} color="#fff"/><span style={{fontFamily:FM,fontSize:8,color:"#fff"}}>Выбрано</span></div>}
                </button>
              );
            })}
          </div>
        </div>}
        {tab==="cls"&&<div style={{paddingBottom:16}}>
          {CLASSES.map(function(c){
            var isSel=cls===c.id;
            return(
              <button key={c.id} onClick={function(){setCls(c.id);if(cond)setTimeout(function(){props.onNext(cond,c.id);},250);}} style={{display:"block",width:"100%",borderRadius:18,overflow:"hidden",border:"3px solid "+(isSel?"#fff":"transparent"),cursor:"pointer",marginBottom:12,padding:0,boxShadow:isSel?"0 0 0 2px "+T.gold+",0 8px 24px rgba(0,0,0,0.18)":"0 4px 12px rgba(0,0,0,0.10)"}}>
                <div style={{background:c.bg,padding:"18px 20px 14px",position:"relative",textAlign:"left"}}>
                  {c.pop&&!isSel&&<div style={{position:"absolute",top:10,right:14,background:"rgba(255,255,255,0.95)",color:T.goldD,fontFamily:FM,fontSize:8,padding:"3px 8px",borderRadius:6,letterSpacing:0.5}}>ПОПУЛЯРНЫЙ</div>}
                  {isSel&&<div style={{position:"absolute",top:10,right:14,background:T.gold,borderRadius:"50%",width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center"}}><Check size={13} color="#fff"/></div>}
                  <div style={{fontFamily:FD,fontSize:32,fontWeight:700,color:"#fff",letterSpacing:-0.5,marginBottom:4}}>{c.label}</div>
                  <div style={{fontFamily:FB,fontSize:12,color:"rgba(255,255,255,0.65)"}}>{c.desc}</div>
                </div>
              </button>
            );
          })}
        </div>}
      </Scroll>
      <Btn label={!cond?"Выберите состояние":!cls?"Выберите класс ремонта":"Продолжить"} onPress={function(){props.onNext(cond,cls);}} disabled={!cond||!cls}/>
    </div>
  );
}

/* ── SCREEN: MATERIALS (multiple per category + per-room config) ── */
var ALL_WALLS=["Покраска","Обои","Декор. штукатурка","Плитка/керамогранит","Микроцемент"];
var ALL_FLOORS=["Кварцвинил","Ламинат","Паркет/доска","Плитка/керамогранит","Наливной"];
var ALL_CEILS=["Натяжные","Покраска","Гипсокартон"];
var ALL_DOORS=["Экошпон","Массив","Эмаль","Скрытые"];

function BathToggle(props){
  var val=props.value;var onChange=props.onChange;var label=props.label;var emoji=props.emoji;
  return(
    <button onClick={function(){onChange(!val);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"11px 13px",borderRadius:12,background:val?T.goldL:T.card,border:"1.5px solid "+(val?T.gold:T.border),cursor:"pointer",marginBottom:8,textAlign:"left"}}>
      <div style={{width:34,height:34,borderRadius:9,background:val?T.gold:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{emoji}</div>
      <div style={{flex:1,fontFamily:FB,fontSize:12,fontWeight:500,color:val?T.goldD:T.dark}}>{label}</div>
      <div style={{width:24,height:24,borderRadius:6,background:val?T.gold:"rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center"}}>{val&&<Check size={13} color="#fff"/>}</div>
    </button>
  );
}

function BathRadio(props){
  var options=props.options;var value=props.value;var onChange=props.onChange;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:8}}>
      {options.map(function(opt){
        var isSel=value===opt.id;
        return(
          <button key={opt.id} onClick={function(){onChange(opt.id);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 13px",borderRadius:12,background:isSel?T.goldL:T.card,border:"1.5px solid "+(isSel?T.gold:T.border),cursor:"pointer",textAlign:"left"}}>
            <div style={{width:30,height:30,borderRadius:8,background:isSel?T.gold:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{opt.emoji}</div>
            <div style={{flex:1}}>
              <div style={{fontFamily:FB,fontSize:12,fontWeight:500,color:isSel?T.goldD:T.dark}}>{opt.label}</div>
              {opt.desc&&<div style={{fontFamily:FB,fontSize:10,color:T.muted}}>{opt.desc}</div>}
            </div>
            {isSel&&<Check size={13} color={T.gold}/>}
          </button>
        );
      })}
    </div>
  );
}

function ScreenMaterials(props){
  var cls=props.cls||"mid";var rooms=props.rooms||[];
  var isPrem=cls==="prem";var isEco=cls==="eco";
  // Detect special rooms
  var hasBalcony=rooms.some(function(r){return /балкон|лоджия/i.test(r.name);});
  var bathRooms=rooms.filter(function(r){return /санузел|ванн|туалет/i.test(r.name);});
  var numBaths=Math.max(1,bathRooms.length);
  var st=useState("rooms");var matTab=st[0];var setMatTab=st[1];
  var wallItems=["Покраска","Обои","Декор. штукатурка","Плитка/керамогранит","Микроцемент"];
  if(isPrem)wallItems=["Декор. штукатурка","Плитка/керамогранит","Микроцемент","Венецианская штукатурка"];
  if(isEco)wallItems=["Покраска","Обои","Плитка/керамогранит"];
  var floorItems=["Кварцвинил","Ламинат","Паркет/доска","Плитка/керамогранит"];
  if(isPrem)floorItems=["Кварцвинил SPC (премиум)","Паркет/доска (массив)","Плитка/керамогранит","Наливной/эпоксидный"];
  if(isEco)floorItems=["Линолеум","Ламинат","Кварцвинил","Плитка/керамогранит"];
  var ceilItems=["Натяжные","Покраска","Гипсокартон"];
  if(isPrem)ceilItems=["Натяжные (Premium PVC)","Гипсокартон (2 уровня)","Реечный потолок"];
  var doorItems=["Экошпон","Массив","Эмаль","Скрытые"];
  if(isPrem)doorItems=["Массив (дуб/ясень)","Скрытые в стену","Стеклянные","Эмаль RAL"];
  if(isEco)doorItems=["Экошпон","Эмаль"];
  var plumbItems=["Без сантехники","Последовательная разводка","Коллекторная разводка"];
  if(isEco)plumbItems=["Без сантехники","Последовательная разводка"];

  var MATS=[
    {cat:"Стены",key:"wall",items:wallItems,multi:true,emoji:"🖌️"},
    {cat:"Полы",key:"floor",items:floorItems,multi:true,emoji:"🪵"},
    {cat:"Потолок",key:"ceil",items:ceilItems,multi:true,emoji:"⬆️"},
    {cat:"Двери",key:"door",items:doorItems,multi:false,emoji:"🚪"},
    {cat:"Электрика",key:"elec",items:["Без электрики","С нуля (полная разводка)","Добавление к существующей"],multi:false,emoji:"⚡"},
    {cat:"Сантехника",key:"plumb",items:plumbItems,multi:false,emoji:"💧"},
  ];
  var s0=useState(function(){
    return{wall:isEco?["Покраска"]:isPrem?["Декор. штукатурка"]:[],floor:isEco?["Линолеум"]:isPrem?["Паркет/доска (массив)"]:[],"ceil":isEco?["Натяжные"]:isPrem?["Натяжные (Premium PVC)"]:[],door:isEco?"Экошпон":isPrem?"Массив (дуб/ясень)":"",elec:"",plumb:isEco?"Последовательная разводка":isPrem?"Коллекторная разводка":""};
  });
  var sel=s0[0];var setSel=s0[1];
  var defaultBath={bathing:"bath",warmFloor:false,waterproof:!isEco,washingMachine:false,towelRack:!isEco,toiletType:isEco?"floor":"install",hasFilter:false,pipeCover:false,showerType:"tray",plumbingType:"sequential"};
  var bs=useState(Array.from({length:numBaths},function(){return Object.assign({},defaultBath);}));
  var bathConfigs=bs[0];var setBathConfigs=bs[1];
  var activeBathIdx=useState(0)[0];
  function setBathField(bathIdx,k,v){var arr=bathConfigs.slice();arr[bathIdx]=Object.assign({},arr[bathIdx]);arr[bathIdx][k]=v;setBathConfigs(arr);}
  // balcony config
  var blcS=useState({wall:"Покраска",floor:"Плитка/керамогранит",ceil:"ПВХ вагонка"});
  var balcCfg=blcS[0];var setBalcCfg=blcS[1];
  var s1=useState(null);var openInfo=s1[0];var setOpenInfo=s1[1];
  var s2=useState(100);var elecPct=s2[0];var setElecPct=s2[1];
  var showElecPct=sel.elec==="Добавление к существующей";
  // Кондиционеры — выбор по комнатам
  var acS=useState({});var selAircons=acS[0];var setSelAircons=acS[1];
  function toggleAC(roomId){var n=Object.assign({},selAircons);n[roomId]=!n[roomId];setSelAircons(n);}
  function toggleMulti(key,item){var arr=(sel[key]||[]).slice();var idx=arr.indexOf(item);if(idx>=0)arr.splice(idx,1);else arr.push(item);var n=Object.assign({},sel);n[key]=arr;setSel(n);}
  function setSingle(key,item){var n=Object.assign({},sel);n[key]=item;setSel(n);}
  var req=["wall","floor","ceil"];var done=req.every(function(k){var v=sel[k];return Array.isArray(v)?v.length>0:!!v;});
  var plumbInfo=[
    {id:"Последовательная разводка",name:"Последовательная (тройниковая)",detail:"Одна труба от стояка, тройниковая разводка PPR PN20. Дешевле, но при одновременном использовании нескольких точек падает давление."},
    {id:"Коллекторная разводка",name:"Коллекторная (лучевая) — Rehau",detail:"Коллектор у стояка, к каждой точке — отдельная труба Rehau PE-X без стыков в стенах. Равномерный напор. Рекомендуется при 2+ санузлах."},
  ];
  var bath=bathConfigs[0]||defaultBath;
  var pvGvs=1+(bath.bathing!=="none"?1:0)+(bath.washingMachine?1:0)+(bath.towelRack?1:0);
  var pvHvs=1+(bath.bathing!=="none"?1:0)+1+(bath.washingMachine?1:0)+(bath.towelRack?1:0);

  // Tabs: always Комнаты + Санузел(ы) + Балкон if present
  var TABS=[{id:"rooms",label:"🏠 Комнаты"}];
  for(var bi=0;bi<numBaths;bi++)TABS.push({id:"bath"+bi,label:numBaths>1?"🛁 Санузел "+(bi+1):"🛁 Санузел"});
  if(hasBalcony)TABS.push({id:"balcony",label:"🏗️ Балкон"});

  var btnLabel=matTab==="rooms"?(done?"Далее: "+TABS[1].label+" →":"Выберите стены, полы и потолок"):
               TABS[TABS.length-1].id===matTab?"Готово →":"Далее →";

  function handleNext(){
    var nextTabIdx=TABS.findIndex(function(t){return t.id===matTab;})+1;
    if(nextTabIdx<TABS.length){setMatTab(TABS[nextTabIdx].id);}
    else{
      var ep=sel.elec==="Без электрики"?0:sel.elec==="С нуля (полная разводка)"?100:elecPct;
      var pp=sel.plumb==="Без сантехники"?0:1;
      var s2=Object.assign({},sel);
      s2.bathroom=numBaths===1?bathConfigs[0]:bathConfigs;
      s2.balcony=balcCfg;
      s2.aircons=selAircons; // per-room AC flags
      props.onNext(s2,ep,pp);
    }
  }

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <Hdr title="Материалы" sub={isPrem?"Премиум — лучшие материалы":isEco?"Эконом — оптимальное качество":"Выберите отделку для расчёта сметы"} onBack={props.onBack} step={props.step||2} total={props.total||4}/>
      {isPrem&&<div style={{margin:"0 22px 8px",padding:"7px 12px",background:"linear-gradient(135deg,#4A3870,#302050)",borderRadius:12,flexShrink:0}}>
        <div style={{fontFamily:FM,fontSize:9,color:"#C0A8FF",letterSpacing:1}}>ПРЕМИУМ · АВТОМАТИЧЕСКИ ВЫБРАНЫ ЛУЧШИЕ МАТЕРИАЛЫ</div>
      </div>}
      {isEco&&<div style={{margin:"0 22px 8px",padding:"7px 12px",background:T.surface,borderRadius:12,border:"1px solid "+T.border,flexShrink:0}}>
        <div style={{fontFamily:FM,fontSize:9,color:T.muted,letterSpacing:1}}>ЭКОНОМ · ПРАКТИЧНЫЕ МАТЕРИАЛЫ</div>
      </div>}
      {/* Tab switcher */}
      <div style={{display:"flex",margin:"0 22px 10px",background:T.surface,borderRadius:12,padding:3,gap:2,flexShrink:0,overflowX:"auto",scrollbarWidth:"none"}}>
        {TABS.map(function(t){var isA=matTab===t.id;return(
          <button key={t.id} onClick={function(){setMatTab(t.id);}} style={{flex:1,minWidth:70,padding:"8px 4px",borderRadius:9,border:"none",background:isA?T.card:"transparent",fontFamily:FB,fontSize:10,fontWeight:600,color:isA?T.dark:T.muted,cursor:"pointer",boxShadow:isA?T.shadow:"none",whiteSpace:"nowrap"}}>{t.label}</button>
        );})}
      </div>
      <Scroll>
        {matTab==="rooms"&&MATS.map(function(m){
          var curVal=sel[m.key];
          var displayVal="";
          if(m.multi&&Array.isArray(curVal)&&curVal.length>0)displayVal=curVal.join(", ");
          else if(!m.multi&&curVal)displayVal=curVal;
          return(
            <div key={m.cat} style={{marginBottom:18}}>
              <div style={{fontFamily:FM,fontSize:10,color:T.muted,marginBottom:8,display:"flex",alignItems:"center",gap:6,textTransform:"uppercase",letterSpacing:0.5}}>
                {m.emoji} {m.cat}
                {m.multi&&<span style={{fontFamily:FM,fontSize:8,background:T.surface,borderRadius:5,padding:"1px 5px",color:T.light,textTransform:"none"}}>мульти</span>}
                {displayVal&&<span style={{fontFamily:FM,fontSize:9,color:T.green,textTransform:"none",fontWeight:600}}>✓ {displayVal.length>25?displayVal.substring(0,25)+"...":displayVal}</span>}
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {m.items.map(function(it){
                  var isSel=m.multi?(Array.isArray(curVal)&&curVal.indexOf(it)>=0):curVal===it;
                  return(
                    <button key={it} onClick={function(){if(m.multi)toggleMulti(m.key,it);else setSingle(m.key,it);}} style={{padding:"8px 12px",borderRadius:10,background:isSel?T.goldL:T.card,border:"1.5px solid "+(isSel?T.gold:T.border),cursor:"pointer",fontFamily:FB,fontSize:12,color:isSel?T.goldD:T.dark,display:"flex",alignItems:"center",gap:4}}>
                      {isSel&&<Check size={10} color={T.gold}/>}{it}
                    </button>
                  );
                })}
              </div>
              {m.key==="elec"&&showElecPct&&<div style={{marginTop:10,background:T.card,borderRadius:12,padding:"11px 13px",border:"1px solid "+T.border}}>
                <div style={{fontFamily:FM,fontSize:10,color:T.muted,marginBottom:8}}>ОБЪЁМ: <b style={{color:T.goldD}}>{elecPct}%</b></div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {[{v:20,l:"20%"},{v:40,l:"40%"},{v:60,l:"60%"},{v:80,l:"80%"}].map(function(p){var iP=elecPct===p.v;return(
                    <button key={p.v} onClick={function(){setElecPct(p.v);}} style={{flex:1,padding:"10px 4px",borderRadius:9,border:"2px solid "+(iP?T.gold:T.border),background:iP?"linear-gradient(135deg,"+T.gold+",#D4A97A)":T.surface,cursor:"pointer",textAlign:"center"}}>
                      <div style={{fontFamily:FM,fontSize:14,fontWeight:600,color:iP?"#fff":T.muted}}>{p.l}</div>
                    </button>
                  );})}
                </div>
              </div>}
              {m.key==="plumb"&&<div style={{marginTop:8}}>
                <button onClick={function(){setOpenInfo(openInfo==="plumb"?null:"plumb");}} style={{background:"none",border:"none",fontFamily:FB,fontSize:11,color:T.gold,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>ℹ️ Что выбрать? {openInfo==="plumb"?"▴":"▾"}</button>
                {openInfo==="plumb"&&<div style={{background:T.goldL,borderRadius:12,padding:"11px 13px",marginTop:6,border:"1px solid "+T.gold+"40"}}>
                  {plumbInfo.map(function(p){return(<div key={p.id} style={{marginBottom:8}}><div style={{fontFamily:FB,fontSize:12,fontWeight:600,color:T.goldD,marginBottom:2}}>{p.name}</div><div style={{fontFamily:FB,fontSize:11,color:T.dark,lineHeight:1.6}}>{p.detail}</div></div>);})}
                  <button onClick={function(){setOpenInfo(null);}} style={{background:"none",border:"none",fontFamily:FM,fontSize:10,color:T.gold,cursor:"pointer"}}>Скрыть ▴</button>
                </div>}
              </div>}
            </div>
          );
        })}

        {matTab==="rooms"&&<div style={{marginBottom:18}}>
          <div style={{fontFamily:FM,fontSize:10,color:T.muted,marginBottom:8,display:"flex",alignItems:"center",gap:6,textTransform:"uppercase",letterSpacing:0.5}}>
            ❄️ Кондиционеры
            <span style={{fontFamily:FM,fontSize:8,background:T.surface,borderRadius:5,padding:"1px 5px",color:T.light,textTransform:"none"}}>на выбор</span>
          </div>
          <div style={{padding:"9px 12px",background:T.goldL,borderRadius:11,marginBottom:8,border:"1px solid "+T.gold+"40"}}>
            <div style={{fontFamily:FB,fontSize:10,color:T.goldD,lineHeight:1.5}}>Выберите комнаты, в которые нужен кондиционер. Система, монтаж и материалы войдут в смету.</div>
          </div>
          {rooms.filter(function(r){return !/санузел|ванн|туалет|коридор|прихожая|кладовк|балкон/i.test(r.name);}).map(function(r){
            var isOn=selAircons[r.id]||false;
            return(
              <button key={r.id} onClick={function(){toggleAC(r.id);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 13px",borderRadius:11,background:isOn?T.goldL:T.card,border:"1.5px solid "+(isOn?T.gold:T.border),marginBottom:6,cursor:"pointer",textAlign:"left"}}>
                <div style={{width:30,height:30,borderRadius:9,background:isOn?"#E8F4FC":"#EEE",border:"1px solid rgba(0,0,0,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>❄️</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:FB,fontSize:12,fontWeight:500,color:isOn?T.goldD:T.dark}}>{r.name}</div>
                  <div style={{fontFamily:FM,fontSize:9,color:T.muted}}>{r.area}м² · {isEco?"~33 000 ₽":isPrem?"~78 000 ₽":"~55 000 ₽"} вместе с монтажом</div>
                </div>
                {isOn?<Check size={14} color={T.gold}/>:<span style={{fontFamily:FM,fontSize:20,color:T.border,lineHeight:1}}>+</span>}
              </button>
            );
          })}
          {Object.values(selAircons).filter(Boolean).length===0&&<div style={{fontFamily:FB,fontSize:10,color:T.light,textAlign:"center",padding:"8px 0"}}>Нажмите на комнату чтобы добавить кондиционер</div>}
        </div>}
        {(function(){
          for(var bi=0;bi<numBaths;bi++){
            if(matTab==="bath"+bi){
              var bCfg=bathConfigs[bi]||defaultBath;
              var bathLabel=numBaths>1?"Санузел "+(bi+1):"Санузел";
              var bIdx=bi;
              return(<div>
                <div style={{padding:"10px 12px",background:"linear-gradient(135deg,#1A3A5A,#1A2A3A)",borderRadius:14,marginBottom:12}}>
                  <div style={{fontFamily:FM,fontSize:9,color:"#5BC8FF",letterSpacing:1,marginBottom:3}}>{bathLabel.toUpperCase()} — ТОЧКИ ВОДЫ</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                    <div><div style={{fontFamily:FM,fontSize:8,color:"rgba(255,255,255,0.4)"}}>ГВС</div><div style={{fontFamily:FM,fontSize:14,fontWeight:700,color:"#FF8070"}}>{1+(bCfg.bathing!=="none"?1:0)+(bCfg.towelRack?1:0)} т.</div></div>
                    <div><div style={{fontFamily:FM,fontSize:8,color:"rgba(255,255,255,0.4)"}}>ХВС</div><div style={{fontFamily:FM,fontSize:14,fontWeight:700,color:"#70B0FF"}}>{1+(bCfg.bathing!=="none"?1:0)+1+(bCfg.washingMachine?1:0)+(bCfg.towelRack?1:0)} т.</div></div>
                  </div>
                </div>
                <div style={{fontFamily:FM,fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>🛁 Купание</div>
                <BathRadio value={bCfg.bathing} onChange={function(v){setBathField(bIdx,"bathing",v);}} options={[{id:"bath",emoji:"🛁",label:"Ванная",desc:"Ванна 170×70"},{id:"shower",emoji:"🚿",label:"Душевая",desc:"Поддон / стойка"},{id:"none",emoji:"❌",label:"Без купания",desc:"Только умывальник"}]}/>
                {bCfg.bathing==="shower"&&<div style={{marginBottom:8}}>
                  <div style={{fontFamily:FM,fontSize:9,color:T.muted,marginBottom:6}}>🚿 Тип душевой</div>
                  <BathRadio value={bCfg.showerType||"tray"} onChange={function(v){setBathField(bIdx,"showerType",v);}} options={[{id:"tray",emoji:"🪣",label:"Поддон акрил/сталь",desc:""},{id:"stone",emoji:"🪨",label:"Поддон камень",desc:""},{id:"poured",emoji:"🏗️",label:"Заливная + трап",desc:""}]}/>
                </div>}
                <div style={{fontFamily:FM,fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8,marginTop:4}}>🚽 Унитаз</div>
                <BathRadio value={bCfg.toiletType} onChange={function(v){setBathField(bIdx,"toiletType",v);}} options={[{id:"install",emoji:"🏗️",label:"Инсталляция",desc:"Geberit/Grohe"},{id:"floor",emoji:"🪑",label:"Напольный",desc:"Стандартный монтаж"},{id:"none",emoji:"❌",label:"Уже установлен",desc:""}]}/>
                <div style={{fontFamily:FM,fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8,marginTop:4}}>💧 Разводка</div>
                <BathRadio value={bCfg.plumbingType||"sequential"} onChange={function(v){setBathField(bIdx,"plumbingType",v);}} options={[{id:"sequential",emoji:"〰️",label:"Последовательная PPR",desc:"Экономично"},{id:"collector",emoji:"⭐",label:"Коллекторная Rehau",desc:"PE-X без стыков в стенах"}]}/>
                <div style={{fontFamily:FM,fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8,marginTop:4}}>⚙️ Доп. оборудование</div>
                <BathToggle emoji="🌡️" label="Тёплый пол (кабельный мат)" value={bCfg.warmFloor} onChange={function(v){setBathField(bIdx,"warmFloor",v);}}/>
                <BathToggle emoji="💧" label="Гидроизоляция обмазочная" value={bCfg.waterproof!==undefined?bCfg.waterproof:!isEco} onChange={function(v){setBathField(bIdx,"waterproof",v);}}/>
                <BathToggle emoji="👕" label="Стиральная машина" value={bCfg.washingMachine||false} onChange={function(v){setBathField(bIdx,"washingMachine",v);}}/>
                <BathToggle emoji="🔥" label="Полотенцесушитель водяной" value={bCfg.towelRack!==undefined?bCfg.towelRack:!isEco} onChange={function(v){setBathField(bIdx,"towelRack",v);}}/>
                <BathToggle emoji="🧹" label="Система фильтрации воды" value={bCfg.hasFilter||false} onChange={function(v){setBathField(bIdx,"hasFilter",v);}}/>
                <BathToggle emoji="📦" label="Зашивка труб коробом ГКЛ" value={bCfg.pipeCover||false} onChange={function(v){setBathField(bIdx,"pipeCover",v);}}/>
                <div style={{height:12}}/>
              </div>);
            }
          }
          return null;
        })()}

        {/* Балкон */}
        {matTab==="balcony"&&hasBalcony&&<div>
          <div style={{padding:"10px 12px",background:"linear-gradient(135deg,#1A3820,#1A2E18)",borderRadius:14,marginBottom:12}}>
            <div style={{fontFamily:FM,fontSize:9,color:"#80E880",letterSpacing:1,marginBottom:2}}>БАЛКОН / ЛОДЖИЯ — ОСОБЫЕ МАТЕРИАЛЫ</div>
            <div style={{fontFamily:FB,fontSize:11,color:"rgba(255,255,255,0.6)",lineHeight:1.5}}>Влагостойкие + антискользящие материалы. Обои и ламинат не подходят для открытого балкона.</div>
          </div>
          <div style={{fontFamily:FM,fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>🖌️ Стены</div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12}}>
            {["Покраска","Плитка/керамогранит","ПВХ вагонка","Деревянная рейка"].map(function(it){var isSel=balcCfg.wall===it;return(<button key={it} onClick={function(){setBalcCfg(Object.assign({},balcCfg,{wall:it}));}} style={{padding:"8px 12px",borderRadius:10,background:isSel?T.goldL:T.card,border:"1.5px solid "+(isSel?T.gold:T.border),cursor:"pointer",fontFamily:FB,fontSize:12,color:isSel?T.goldD:T.dark,display:"flex",alignItems:"center",gap:4}}>{isSel&&<Check size={10} color={T.gold}/>}{it}</button>);})}
          </div>
          <div style={{fontFamily:FM,fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>🪵 Пол</div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12}}>
            {["Плитка/керамогранит","Кварцвинил","Деревянный декинг"].map(function(it){var isSel=balcCfg.floor===it;return(<button key={it} onClick={function(){setBalcCfg(Object.assign({},balcCfg,{floor:it}));}} style={{padding:"8px 12px",borderRadius:10,background:isSel?T.goldL:T.card,border:"1.5px solid "+(isSel?T.gold:T.border),cursor:"pointer",fontFamily:FB,fontSize:12,color:isSel?T.goldD:T.dark,display:"flex",alignItems:"center",gap:4}}>{isSel&&<Check size={10} color={T.gold}/>}{it}</button>);})}
          </div>
          <div style={{fontFamily:FM,fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>⬆️ Потолок</div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12}}>
            {["ПВХ вагонка","Покраска","Деревянная вагонка"].map(function(it){var isSel=balcCfg.ceil===it;return(<button key={it} onClick={function(){setBalcCfg(Object.assign({},balcCfg,{ceil:it}));}} style={{padding:"8px 12px",borderRadius:10,background:isSel?T.goldL:T.card,border:"1.5px solid "+(isSel?T.gold:T.border),cursor:"pointer",fontFamily:FB,fontSize:12,color:isSel?T.goldD:T.dark,display:"flex",alignItems:"center",gap:4}}>{isSel&&<Check size={10} color={T.gold}/>}{it}</button>);})}
          </div>
          <div style={{padding:"9px 12px",background:T.surface,borderRadius:10,border:"1px solid "+T.border}}>
            <div style={{fontFamily:FB,fontSize:11,color:T.muted,lineHeight:1.6}}>💡 Электрика балкона: 2 розетки IP44 + 1 светильник IP44. Щиток на балконе не ставится.</div>
          </div>
          <div style={{height:12}}/>
        </div>}

        <div style={{paddingBottom:12}}/>
      </Scroll>
      <Btn label={btnLabel} onPress={handleNext} disabled={matTab==="rooms"&&!done}/>
    </div>
  );
}

function ScreenRoomMats(props){
  var rooms=props.rooms||[];var sel=props.sel||{};
  var wallOpts=sel.wall&&sel.wall.length>0?sel.wall:["Покраска"];
  var floorOpts=sel.floor&&sel.floor.length>0?sel.floor:["Кварцвинил"];
  var ceilOpts=sel.ceil&&sel.ceil.length>0?sel.ceil:["Натяжные"];
  var doorOpts=sel.door?[sel.door]:["Экошпон"];
  var initMap=function(){var m={};rooms.forEach(function(r){m[r.id]={wall:wallOpts[0],floor:floorOpts[0],ceil:ceilOpts[0],door:doorOpts[0]};});return m;};
  var s0=useState(initMap());var roomMats=s0[0];var setRoomMats=s0[1];
  var s1=useState(rooms[0]&&rooms[0].id||null);var selRoom=s1[0];var setSelRoom=s1[1];
  function setMat(roomId,key,val){var n=Object.assign({},roomMats);n[roomId]=Object.assign({},n[roomId]);n[roomId][key]=val;setRoomMats(n);}
  var activeRoom=rooms.filter(function(r){return r.id===selRoom;})[0];var activeRM=selRoom?roomMats[selRoom]:{};
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <Hdr title="Материалы по комнатам" sub="Выберите отделку для каждой комнаты" onBack={props.onBack} step={props.step||3} total={props.total||5}/>
      <Scroll>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
          {rooms.map(function(r){
            var isSel=selRoom===r.id;
            return(
              <button key={r.id} onClick={function(){setSelRoom(r.id);}} style={{padding:"7px 12px",borderRadius:10,background:isSel?T.dark:T.card,border:"1.5px solid "+(isSel?T.dark:T.border),cursor:"pointer",fontFamily:FB,fontSize:12,color:isSel?"#fff":T.dark}}>
                {r.name}
              </button>
            );
          })}
        </div>
        {activeRoom&&<div>
          <div style={{fontFamily:FD,fontSize:17,fontWeight:600,color:T.dark,marginBottom:12}}>{activeRoom.name} · {activeRoom.area} м²</div>
          {wallOpts.length>1&&<div style={{marginBottom:12}}>
            <div style={{fontFamily:FM,fontSize:9,color:T.muted,marginBottom:7,textTransform:"uppercase"}}>🖌️ Стены</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {wallOpts.map(function(it){var isSel=activeRM.wall===it;return(<button key={it} onClick={function(){setMat(selRoom,"wall",it);}} style={{padding:"7px 11px",borderRadius:9,background:isSel?T.goldL:T.card,border:"1.5px solid "+(isSel?T.gold:T.border),cursor:"pointer",fontFamily:FB,fontSize:11,color:isSel?T.goldD:T.dark,display:"flex",alignItems:"center",gap:4}}>{isSel&&<Check size={9} color={T.gold}/>}{it}</button>);})}</div>
          </div>}
          {floorOpts.length>1&&<div style={{marginBottom:12}}>
            <div style={{fontFamily:FM,fontSize:9,color:T.muted,marginBottom:7,textTransform:"uppercase"}}>🪵 Пол</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {floorOpts.map(function(it){var isSel=activeRM.floor===it;return(<button key={it} onClick={function(){setMat(selRoom,"floor",it);}} style={{padding:"7px 11px",borderRadius:9,background:isSel?T.goldL:T.card,border:"1.5px solid "+(isSel?T.gold:T.border),cursor:"pointer",fontFamily:FB,fontSize:11,color:isSel?T.goldD:T.dark,display:"flex",alignItems:"center",gap:4}}>{isSel&&<Check size={9} color={T.gold}/>}{it}</button>);})}</div>
          </div>}
          {ceilOpts.length>1&&<div style={{marginBottom:12}}>
            <div style={{fontFamily:FM,fontSize:9,color:T.muted,marginBottom:7,textTransform:"uppercase"}}>⬆️ Потолок</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {ceilOpts.map(function(it){var isSel=activeRM.ceil===it;return(<button key={it} onClick={function(){setMat(selRoom,"ceil",it);}} style={{padding:"7px 11px",borderRadius:9,background:isSel?T.goldL:T.card,border:"1.5px solid "+(isSel?T.gold:T.border),cursor:"pointer",fontFamily:FB,fontSize:11,color:isSel?T.goldD:T.dark,display:"flex",alignItems:"center",gap:4}}>{isSel&&<Check size={9} color={T.gold}/>}{it}</button>);})}</div>
          </div>}
        </div>}
        <div style={{paddingBottom:16}}/>
      </Scroll>
      <Btn label="Рассчитать смету" onPress={function(){props.onNext(roomMats);}}/>
    </div>
  );
}

/* ── ESTIMATE TABLE ── */
function EstimateTable(props){
  var result=props.result;var cityName=props.cityName||"";
  function buildRows(rooms,type){
    var rows=[];var no=1;
    rooms.forEach(function(r){
      var items=type==="works"?r.works:r.materials;
      if(!items.length)return;
      rows.push({isHeader:true,name:r.name,area:r.area,subtotal:type==="works"?r.workTotal:r.matTotal});
      items.forEach(function(item){rows.push(Object.assign({},item,{no:no++,isHeader:false}));});
    });
    return rows;
  }
  var wRows=buildRows(result.rooms,"works");var mRows=buildRows(result.rooms,"materials");
  function TRows(props2){
    return props2.rows.map(function(item,i){
      if(item.isHeader)return(
        <div key={i} style={{padding:"5px 8px",borderTop:"1px solid "+T.border,background:"#F0EDE680",display:"flex",justifyContent:"space-between"}}>
          <span style={{fontFamily:FD,fontSize:12,fontWeight:600,color:T.dark}}>{item.name} <span style={{fontFamily:FM,fontSize:9,color:T.muted}}>({item.area}м²)</span></span>
          <span style={{fontFamily:FM,fontSize:10,color:props2.color}}>{fmt(item.subtotal)} ₽</span>
        </div>
      );
      return(
        <div key={i} style={{display:"grid",gridTemplateColumns:"22px 1fr 32px 36px 48px 54px",gap:3,padding:"4px 8px",background:i%2?T.card:T.surface+"50",alignItems:"start"}}>
          <span style={{fontFamily:FM,fontSize:8,color:T.light}}>{item.no}</span>
          <span style={{fontFamily:FB,fontSize:10,color:T.dark,lineHeight:1.35}}>{item.name}</span>
          <span style={{fontFamily:FM,fontSize:8,color:T.muted,textAlign:"right"}}>{item.unit}</span>
          <span style={{fontFamily:FM,fontSize:8,color:T.muted,textAlign:"right"}}>{item.qty}</span>
          <span style={{fontFamily:FM,fontSize:8,color:T.muted,textAlign:"right"}}>{fmt(item.price)}</span>
          <span style={{fontFamily:FM,fontSize:9,color:props2.color,fontWeight:500,textAlign:"right"}}>{fmt(item.sum)}</span>
        </div>
      );
    });
  }
  // Якоря для прокрутки
  function scrollTo(id){
    var el=document.getElementById(id);
    if(el)el.scrollIntoView({behavior:"smooth",block:"start"});
  }
  return(
    <div style={{paddingBottom:20}}>
      {/* Единая тёмная рамка — итог + работы/материалы как кнопки-якоря */}
      <div style={{background:"#1A1814",borderRadius:16,padding:"16px",marginBottom:14}}>
        <div style={{fontFamily:FM,fontSize:9,color:"#666",marginBottom:2}}>{cityName} · Смета на ремонтные работы</div>
        <div style={{fontFamily:FD,fontSize:26,fontWeight:600,color:"#fff",marginBottom:10}}>{fmt(result.total)} ₽</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          <button onClick={function(){scrollTo("est-works");}} style={{background:"rgba(255,255,255,0.07)",borderRadius:10,padding:"9px 11px",border:"none",cursor:"pointer",textAlign:"left"}}>
            <div style={{fontFamily:FM,fontSize:9,color:"#666",marginBottom:3}}>Работы</div>
            <div style={{fontFamily:FM,fontSize:13,color:T.gold,fontWeight:600}}>{fmt(result.workTotal)} ₽</div>
          </button>
          <button onClick={function(){scrollTo("est-mats");}} style={{background:"rgba(255,255,255,0.07)",borderRadius:10,padding:"9px 11px",border:"none",cursor:"pointer",textAlign:"left"}}>
            <div style={{fontFamily:FM,fontSize:9,color:"#666",marginBottom:3}}>Материалы</div>
            <div style={{fontFamily:FM,fontSize:13,color:T.gold,fontWeight:600}}>{fmt(result.matTotal)} ₽</div>
          </button>
        </div>
      </div>
      {/* Якорь таблицы работ */}
      <div id="est-works"/>
      <div style={{fontFamily:FM,fontSize:9,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>⚒️ Таблица 1 — Ремонтные работы</div>
      <div style={{marginBottom:14,border:"1px solid "+T.border,borderRadius:10,overflow:"hidden"}}>
        <div style={{background:"#2A3A5A",padding:"7px 10px",display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:FD,fontSize:14,fontWeight:600,color:"#fff"}}>Стоимость работ</span><span style={{fontFamily:FM,fontSize:11,color:"#A0C0E0"}}>{fmt(result.workTotal)} ₽</span></div>
        <div style={{display:"grid",gridTemplateColumns:"22px 1fr 32px 36px 48px 54px",gap:3,padding:"4px 8px",background:T.surface,borderBottom:"1px solid "+T.border}}>
          {["№","Наименование работ","Ед.","Кол.","Цена","Сумма"].map(function(h,i){return <span key={i} style={{fontFamily:FM,fontSize:7,color:T.muted,textAlign:i>1?"right":"left"}}>{h}</span>;})}
        </div>
        <TRows rows={wRows} color="#2A3A5A"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 54px",gap:4,padding:"6px 8px",background:"#EBF0F8",borderTop:"2px solid #2A3A5A"}}>
          <span style={{fontFamily:FB,fontSize:11,fontWeight:700,color:T.dark}}>ИТОГО работы</span>
          <span style={{fontFamily:FM,fontSize:11,fontWeight:700,color:"#2A3A5A",textAlign:"right"}}>{fmt(result.workTotal)} ₽</span>
        </div>
      </div>
      <div id="est-mats"/>
      <div style={{fontFamily:FM,fontSize:9,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>📦 Таблица 2 — Материалы</div>
      <div style={{marginBottom:14,border:"1px solid "+T.border,borderRadius:10,overflow:"hidden"}}>
        <div style={{background:"#3A5A2A",padding:"7px 10px",display:"flex",justifyContent:"space-between"}}><span style={{fontFamily:FD,fontSize:14,fontWeight:600,color:"#fff"}}>Стоимость материалов</span><span style={{fontFamily:FM,fontSize:11,color:"#A0D0A0"}}>{fmt(result.matTotal)} ₽</span></div>
        <div style={{display:"grid",gridTemplateColumns:"22px 1fr 32px 36px 48px 54px",gap:3,padding:"4px 8px",background:T.surface,borderBottom:"1px solid "+T.border}}>
          {["№","Наименование материала","Ед.","Кол.","Цена","Сумма"].map(function(h,i){return <span key={i} style={{fontFamily:FM,fontSize:7,color:T.muted,textAlign:i>1?"right":"left"}}>{h}</span>;})}
        </div>
        <TRows rows={mRows} color="#3A5A2A"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 54px",gap:4,padding:"6px 8px",background:"#EBF5EB",borderTop:"2px solid #3A5A2A"}}>
          <span style={{fontFamily:FB,fontSize:11,fontWeight:700,color:T.dark}}>ИТОГО материалы</span>
          <span style={{fontFamily:FM,fontSize:11,fontWeight:700,color:"#3A5A2A",textAlign:"right"}}>{fmt(result.matTotal)} ₽</span>
        </div>
      </div>
      <div style={{padding:"13px 15px",background:"#1A1814",borderRadius:14,marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontFamily:FD,fontSize:15,fontWeight:600,color:"#fff"}}>ИТОГО ПО СМЕТЕ</span>
          <span style={{fontFamily:FM,fontSize:15,fontWeight:700,color:T.gold}}>{fmt(result.total)} ₽</span>
        </div>
        <div style={{fontFamily:FB,fontSize:10,color:"rgba(255,255,255,0.4)",lineHeight:1.5,marginBottom:8}}>Итоговая сумма составляет {fmt(result.total)} рублей 00 копеек</div>
        <div style={{borderTop:"1px solid rgba(255,255,255,0.1)",paddingTop:8,display:"flex",justifyContent:"space-between"}}>
          <span style={{fontFamily:FB,fontSize:10,color:"rgba(255,255,255,0.3)"}}>Заказчик ___________</span>
          <span style={{fontFamily:FB,fontSize:10,color:"rgba(255,255,255,0.3)"}}>Подрядчик / М-Ремонт</span>
        </div>
      </div>
    </div>
  );
}

/* ── PDF EXPORT ── */
function exportPDF(result,cityName){
  var rows=[];
  result.rooms.forEach(function(r){
    r.works.forEach(function(item){rows.push({sec:item.sec,name:item.name,qty:item.qty,unit:item.unit,price:item.price,sum:item.sum,type:"work"});});
  });
  result.rooms.forEach(function(r){
    r.materials.forEach(function(item){rows.push({sec:item.sec,name:item.name,qty:item.qty,unit:item.unit,price:item.price,sum:item.sum,type:"mat"});});
  });
  var css="body{font-family:'Arial',sans-serif;font-size:10px;color:#111;margin:20px;}h1{font-size:18px;margin-bottom:4px;}h2{font-size:13px;color:#2A3A5A;border-bottom:2px solid #2A3A5A;padding-bottom:4px;margin:16px 0 6px;}table{width:100%;border-collapse:collapse;margin-bottom:10px;}th{background:#2A3A5A;color:#fff;padding:5px 7px;text-align:left;font-size:9px;}tr:nth-child(even){background:#F5F5F5;}td{padding:4px 7px;border-bottom:1px solid #eee;}.mat th{background:#3A5A2A;}.total{background:#1A1814;color:#fff;padding:10px 14px;border-radius:8px;margin-top:12px;display:flex;justify-content:space-between;}.tnum{text-align:right;}";
  var wHtml="<h2>⚒️ Таблица 1 — Ремонтные работы</h2><table><thead><tr><th>№</th><th>Наименование работ</th><th>Ед.</th><th class=tnum>Кол.</th><th class=tnum>Цена, ₽</th><th class=tnum>Сумма, ₽</th></tr></thead><tbody>";
  var wn=0;result.rooms.forEach(function(r){if(!r.works.length)return;wHtml+="<tr><td colspan=6 style='background:#EBF0F8;font-weight:bold;'>"+r.name+" ("+r.area+" м²) — "+fmt(r.workTotal)+" ₽</td></tr>";r.works.forEach(function(w){wHtml+="<tr><td>"+(++wn)+"</td><td>"+w.name+"</td><td>"+w.unit+"</td><td class=tnum>"+w.qty+"</td><td class=tnum>"+fmt(w.price)+"</td><td class=tnum>"+fmt(w.sum)+"</td></tr>";});});wHtml+="</tbody></table>";
  var mHtml="<h2 class=mat>📦 Таблица 2 — Материалы</h2><table class=mat><thead><tr><th>№</th><th>Наименование материала</th><th>Ед.</th><th class=tnum>Кол.</th><th class=tnum>Цена, ₽</th><th class=tnum>Сумма, ₽</th></tr></thead><tbody>";
  var mn=0;result.rooms.forEach(function(r){if(!r.materials.length)return;mHtml+="<tr><td colspan=6 style='background:#EBF5EB;font-weight:bold;'>"+r.name+" ("+r.area+" м²) — "+fmt(r.matTotal)+" ₽</td></tr>";r.materials.forEach(function(m){mHtml+="<tr><td>"+(++mn)+"</td><td>"+m.name+"</td><td>"+m.unit+"</td><td class=tnum>"+m.qty+"</td><td class=tnum>"+fmt(m.price)+"</td><td class=tnum>"+fmt(m.sum)+"</td></tr>";});});mHtml+="</tbody></table>";
  var html="<!DOCTYPE html><html><head><meta charset='utf-8'><title>Смета</title><style>"+css+"</style></head><body>"
    +"<h1>Смета на ремонт · "+cityName+"</h1>"
    +"<div style='font-size:11px;color:#666;margin-bottom:14px;'>Сформировано: "+new Date().toLocaleDateString("ru-RU")+"</div>"
    +wHtml+mHtml
    +"<div style='display:flex;gap:16px;margin-top:14px;'>"
    +"<div style='flex:1;background:#EBF0F8;border-radius:8px;padding:10px 14px;'><div style='font-size:9px;color:#555;margin-bottom:3px;'>ИТОГО РАБОТЫ</div><div style='font-size:16px;font-weight:700;color:#2A3A5A;'>"+fmt(result.workTotal)+" ₽</div></div>"
    +"<div style='flex:1;background:#EBF5EB;border-radius:8px;padding:10px 14px;'><div style='font-size:9px;color:#555;margin-bottom:3px;'>ИТОГО МАТЕРИАЛЫ</div><div style='font-size:16px;font-weight:700;color:#3A5A2A;'>"+fmt(result.matTotal)+" ₽</div></div>"
    +"<div style='flex:1;background:#1A1814;border-radius:8px;padding:10px 14px;'><div style='font-size:9px;color:rgba(255,255,255,0.5);margin-bottom:3px;'>ИТОГО ПО СМЕТЕ</div><div style='font-size:16px;font-weight:700;color:#B8864E;'>"+fmt(result.total)+" ₽</div></div>"
    +"</div>"
    +"<div style='margin-top:24px;font-size:9px;color:#aaa;border-top:1px solid #eee;padding-top:8px;display:flex;justify-content:space-between;'><span>Заказчик: _______________</span><span>Подрядчик / М-Ремонт: _______________</span></div>"
    +"<div style='margin-top:20px;background:linear-gradient(135deg,#1A1410,#2C1E0C);border-radius:12px;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;border:1.5px solid rgba(184,134,78,0.5);'>"
    +"<div><div style='font-size:13px;font-weight:700;color:#F0E2CC;margin-bottom:3px;'>🏠 Заказать ремонт по минимальным расценкам</div>"
    +"<div style='font-size:10px;color:rgba(255,255,255,0.55);'>Дизайн-проект квартиры — бесплатно при заказе ремонта</div></div>"
    +"<a href='https://m1-remont.ru' style='background:linear-gradient(135deg,#B8864E,#D4A060);color:#fff;font-size:11px;font-weight:700;padding:8px 16px;border-radius:8px;text-decoration:none;white-space:nowrap;display:inline-block;margin-left:14px;'>Заказать ремонт →</a>"
    +"</div>"
    +"</body></html>";
  var win=window.open("","_blank");if(win){win.document.write(html);win.document.close();setTimeout(function(){win.print();},400);}
}

function ScreenEstimate(props){
  var s0=useState("calc");var status=s0[0];var setStatus=s0[1];
  var s1=useState(null);var result=s1[0];var setResult=s1[1];
  // Задача 4: исключённые разделы сметы
  var s2=useState([]);var excluded=s2[0];var setExcluded=s2[1];
  var city=props.city||CITIES[0];

  // Все разделы, которые можно исключить
  var ALL_SECTIONS=["Потолок","Пол","Двери","Сантехника","Электрика","Окна"];

  function recalc(exclSections){
    try{
      var wallDefault=(props.sel&&props.sel.wall&&props.sel.wall[0])||"Покраска";
      var floorDefault=(props.sel&&props.sel.floor&&props.sel.floor[0])||"Кварцвинил";
      var ceilDefault=(props.sel&&props.sel.ceil&&props.sel.ceil[0])||"Натяжные";
      var doorDefault=(props.sel&&props.sel.door)||"Экошпон";
      var fallbackMats={};
      (props.rooms||[]).forEach(function(r){
        fallbackMats[r.id]={wall:wallDefault,floor:floorDefault,ceil:ceilDefault,door:doorDefault};
      });
      var rm=props.roomMats||fallbackMats;
      var bc=props.bathCfg||props.bathroomCfg||(props.sel&&props.sel.bathroom)||{};
      var ep=props.elecPct!=null?props.elecPct:100;var plumbPct=props.plumbPct!==undefined?props.plumbPct:1;
      var aircons=props.sel&&props.sel.aircons||{};
      var r=calcEstimate(props.rooms||[],props.cond||"rough",props.cls||"mid",city.k,rm,ep,bc,aircons,exclSections||[]);
      setResult(r);
    }catch(e){
      console.error("calcEstimate error:",e);
      var errRooms=(props.rooms||[]).map(function(r){return{name:r.name,area:parseFloat(r.area)||10,works:[{no:1,sec:"Ошибка",name:"Ошибка расчёта: "+e.message,qty:1,unit:"",price:0,sum:0}],materials:[],workTotal:0,matTotal:0,total:0};});
      setResult({rooms:errRooms,workTotal:0,matTotal:0,total:0,hasError:true,errorMsg:e.message});
    }
  }

  function toggleSection(sec){
    var next=excluded.indexOf(sec)===-1?excluded.concat([sec]):excluded.filter(function(s){return s!==sec;});
    setExcluded(next);
    recalc(next);
  }

  useEffect(function(){
    var tid=setTimeout(function(){
      recalc([]);
      setStatus("done");
    },200);
    return function(){clearTimeout(tid);};
  },[]);
  if(status==="calc")return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <Hdr title="Считаем смету..." step={props.step||3} total={props.total||4}/>
      <Scroll><div style={{textAlign:"center",padding:"50px 0"}}>
        <Loader size={36} color={T.gold} style={{animation:"spin 1s linear infinite",marginBottom:14}}/>
        <div style={{fontFamily:FD,fontSize:18,color:T.dark,marginBottom:5}}>Формируем смету...</div>
        <div style={{fontFamily:FB,fontSize:12,color:T.muted}}>Работы + материалы по каждой комнате</div>
      </div></Scroll>
    </div>
  );
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",position:"relative"}}>
      <div style={{padding:"8px 22px 8px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <button onClick={props.onBack} style={{width:32,height:32,borderRadius:10,background:T.surface,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><ChevronLeft size={16} color={T.dark}/></button>
          <div style={{flex:1}}>
            <div style={{fontFamily:FD,fontSize:18,fontWeight:600,color:T.dark}}>Смета готова</div>
            <div style={{fontFamily:FM,fontSize:10,color:T.muted}}>{city.name} · {props.cls&&CLASSES.filter(function(c){return c.id===props.cls;})[0]&&CLASSES.filter(function(c){return c.id===props.cls;})[0].label}</div>
          </div>
          {result&&<div style={{display:"flex",gap:6,flexShrink:0}}>
            {/* Кнопка PDF */}
            <button onClick={function(){exportPDF(result,city.name);}} style={{display:"flex",alignItems:"center",gap:5,padding:"8px 11px",background:"linear-gradient(135deg,#C0392B,#A93226)",borderRadius:12,border:"none",cursor:"pointer",boxShadow:"0 3px 12px rgba(192,57,43,0.35)"}}>
              <span style={{fontFamily:FM,fontSize:9,color:"#fff",letterSpacing:0.5}}>📄 PDF</span>
            </button>
            {/* кнопка «Сохранить» — ведёт на сайт, красная */}
            <a href="https://m1-remont.ru" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:5,padding:"8px 11px",background:"linear-gradient(135deg,#C0392B,#A93226)",borderRadius:12,textDecoration:"none",boxShadow:"0 3px 12px rgba(192,57,43,0.35)"}}>
              <span style={{fontFamily:FM,fontSize:9,color:"#fff",letterSpacing:0.5}}>💾 Сохранить</span>
            </a>
          </div>}
        </div>
        {/* Задача 4: чипы исключения разделов */}
        {result&&<div style={{marginBottom:8}}>
          <div style={{fontFamily:FM,fontSize:8,color:T.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>Разделы сметы — нажмите, чтобы исключить</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {ALL_SECTIONS.map(function(sec){
              var off=excluded.indexOf(sec)!==-1;
              return(
                <button key={sec} onClick={function(){toggleSection(sec);}} style={{
                  fontFamily:FB,fontSize:10,padding:"5px 10px",borderRadius:9,cursor:"pointer",
                  border:"1px solid "+(off?"#D0CCC4":T.gold),
                  background:off?"#EEEAE4":T.goldL,
                  color:off?"#A09888":T.goldD,
                  textDecoration:off?"line-through":"none",
                  fontWeight:off?400:600
                }}>
                  {off?"✕ ":"✓ "}{sec}
                </button>
              );
            })}
          </div>
        </div>}
        {result&&<PromoCard/>}
      </div>
      <Scroll>
        {result&&<EstimateTable result={result} cityName={city.name}/>}
        {result&&<PromoCardFull/>}
      </Scroll>
      {/* Форма заявки теперь глобальна — рендерится в Phone, видна на всех экранах */}
    </div>
  );
}

/* ── SCREEN: DESIGN PLAN (full room configurator) ── */

var MAT_OPTIONS = {
  walls:[
    {id:"paint",emoji:"🪣",name:"Покраска",desc:"Латексная / матовая / полуглянец",colors:["#F5F2EC","#E8D9C4","#C4D4C0","#C0CDD8","#D4CEC8","#9A9694","#D4BBA8","#5A5550","#F0E8D8","#D0C0A8","#B8C8B8","#A8B8C8"]},
    {id:"wallpaper",emoji:"📋",name:"Обои",desc:"Флизелин / виниловые / тканевые",colors:["#E8D4C0","#D4C8B8","#C8D8D0","#D8CCE0","#E0D8C8","#C8D4E0","#D8C8C0","#E8E0D0","#D0C8B8","#C8D0C8","#D8D0C0","#C0C8D0"]},
    {id:"tile_wall",emoji:"⬜",name:"Плитка / керамогранит",desc:"30×60, 60×60, 120×60 см (для мокрых зон и акцентов)",colors:["#F0EDEA","#E8E4E0","#D8D4D0","#C8C4C0","#B8B4B0","#A8A4A0","#E0DCDA","#D4D0CC","#C8C4C0","#BCBAB6","#3A5A8A","#5A3A8A"]},
    {id:"microcement",emoji:"🏗️",name:"Микроцемент",desc:"Бесшовное покрытие, 3 слоя",colors:["#C8C4C0","#B8B4B0","#A8A4A0","#989490","#888480","#787470","#686460","#D8D4D0","#C0BCB8","#B0ACA8","#A09C98","#908C88"]},
    {id:"decor_plaster",emoji:"🪨",name:"Декор. штукатурка",desc:"Венецианская / травертин / короед",colors:["#EDE8E0","#E4DDD0","#DDD5C4","#D5CDB8","#CDBFAA","#BEB098","#F5F0E8","#EBE4DA","#E0D8CC","#D8CFBF","#CFC6B0","#C5BBA0"]},
    {id:"mouldings",emoji:"🏛️",name:"Молдинги / рамки",desc:"Лепнина / гипс / полиуретан",colors:["#FFFFFF","#FAFAF8","#F5F3F0","#F0EDE8","#EDE8E0","#E8E3DA","#E5DFD5","#F8F6F2","#F2EFE9","#ECEAE4","#E8E5DC","#E0DDD4"],
      extraKey:"moulding_count",extraLabel:"Количество рамок",extraOptions:[1,2,4,6,10,16]},
    {id:"wood_panels",emoji:"🪵",name:"Панели дерево/PU",desc:"Реечные / объёмные / шпонированные",colors:["#D4B896","#C4A882","#B89870","#A88860","#987850","#8B6B4A","#DFC8A8","#CEB898","#BDA888","#AC9878","#9B8868","#8A7858"],
      extraKey:"panel_pct",extraLabel:"% покрытия стены",extraOptions:[5,10,20,30,40,50,70]},
  ],
  floors:[
    {id:"laminate",emoji:"🪵",name:"Ламинат",desc:"33 класс, AC5. 8–12 мм",colors:["#D4B896","#C4A882","#B89870","#A88860","#987850","#8B6B4A","#E0C8A8","#D0B898","#C0A888","#B09878","#A08868","#907858"]},
    {id:"quartz_vinyl",emoji:"🔲",name:"Кварцвинил SPC",desc:"5 мм, класс 34. Водостойкий",colors:["#D4C4B0","#C4B4A0","#B4A490","#A49480","#948470","#847460","#D8C8B4","#C8B8A4","#B8A894","#A89884","#988874","#887864"]},
    {id:"parquet",emoji:"🌳",name:"Паркет / доска",desc:"15–22 мм. Дуб, ясень, бук",colors:["#C8A870","#B89860","#A88850","#987840","#886840","#784E28","#D4B47A","#C4A46A","#B4945A","#A4844A","#947440","#846430"]},
    {id:"tile",emoji:"⬜",name:"Плитка / керамогранит",desc:"60×60, 80×80, 120×60 см",colors:["#F0EDEA","#E8E4E0","#D8D4D0","#C8C4C0","#B8B4B0","#A8A4A0","#E0DCDA","#D4D0CC","#C8C4C0","#BCBAB6","#B0ACAA","#A4A09E"]},
    {id:"polished",emoji:"✨",name:"Наливной / шлифованный",desc:"Эпоксидный / бетонный",colors:["#D8D4D0","#C8C4C0","#B8B4B0","#A8A4A0","#989490","#888480","#E0DCDA","#D0CCCA","#C0BCBA","#B0ACAA","#A0A09E","#909090"]},
    {id:"carpet",emoji:"🟫",name:"Ковролин",desc:"Петельный / разрезной ворс",colors:["#C8B8A8","#B8A898","#A89888","#988878","#887868","#C4B4A0","#B4A490","#A49480","#948470","#847460","#746450","#645440"]},
  ],
  ceilings:[
    {id:"stretch",emoji:"✨",name:"Натяжной потолок",desc:"Плёнка / тканевый. Матовый, глянец",colors:["#FFFFFF","#FAFAF8","#F8F6F4","#F5F3F0","#F2F0EC","#EDE8E2"]},
    {id:"paint_c",emoji:"🪣",name:"Покраска потолка",desc:"Латексная в 2 слоя + грунтовка",colors:["#FFFFFF","#FAFAF8","#F8F6F4","#F5F3F0","#F0EDE8","#E8E4DC"]},
    {id:"gkl",emoji:"🏗️",name:"Гипсокартон",desc:"1 или 2 уровня. ГКЛ 12 мм",colors:["#FFFFFF","#FAFAF8","#F5F3F0","#F0EDE8","#EDE8E0","#E8E3DA"]},
    {id:"reiki",emoji:"▬",name:"Реечный потолок",desc:"Алюминиевые / деревянные рейки",colors:["#E0D8D0","#D0C8C0","#C0B8B0","#B0A8A0","#908880","#807870","#DCC8A8","#CCA890","#BC9878","#AC8860","#9C7850","#8C6840"]},
    {id:"armstrong",emoji:"▦",name:"Потолок Армстронг",desc:"Плиты 600×600. Офисный стиль",colors:["#FFFFFF","#F5F5F5","#F0F0F0","#E8E8E8","#E0E0E0","#D8D8D8"]},
  ],
  doors:[
    {id:"eco",emoji:"🚪",name:"Экошпон",desc:"Плёнка ПВХ на MDF. Бюджет",colors:["#F8F8F8","#FAEEE0","#E8D4C0","#D0BCA0","#B8A080","#8B6B4A"]},
    {id:"massiv",emoji:"🌲",name:"Массив дерева",desc:"Дуб / сосна / ясень",colors:["#C8A870","#B89860","#A88850","#987840","#886830","#786020"]},
    {id:"enamel",emoji:"🟤",name:"Эмаль RAL",desc:"Любой цвет по каталогу RAL",colors:["#FFFFFF","#F5F5F5","#1A1A1A","#2A3A5A","#3A5A2A","#8A3A2A","#5A3A8A","#C0C0C0"]},
    {id:"hidden",emoji:"🚫",name:"Скрытые двери",desc:"В уровень стены. Без коробки",colors:["#F5F2EC","#E8D9C4","#C4D4C0","#C0CDD8","#D4CEC8","#9A9694"]},
    {id:"glass",emoji:"🪟",name:"Стеклянные",desc:"Триплекс / матовое / прозрачное",colors:["#C8E8F8","#D8EEF8","#E0F0F8","#A8D8F0","#B8E0F4","#C8E8F8"]},
  ],
  lighting:[
    {id:"chandelier",emoji:"🔆",name:"Люстра",desc:"Центральная, классика / модерн"},
    {id:"spots",emoji:"⭕",name:"Точечные споты",desc:"В натяжном потолке, IP44"},
    {id:"track",emoji:"🎯",name:"Трековая система",desc:"Направленный свет, гибкая"},
    {id:"led_strip",emoji:"💡",name:"LED-лента",desc:"Подсветка по периметру / ниши"},
    {id:"pendant",emoji:"⬇️",name:"Подвесные",desc:"Над столом, над кроватью"},
    {id:"sconces",emoji:"🕯️",name:"Бра",desc:"Настенные светильники"},
    {id:"floor_lamp",emoji:"🔦",name:"Торшер",desc:"Акцентный свет в углу"},
  ],
  plinth:[
    {id:"mdf_simple",emoji:"▬",name:"МДФ простой",desc:"40–80 мм, окрашенный"},
    {id:"mdf_cable",emoji:"▬",name:"МДФ с кабель-каналом",desc:"60–80 мм, под провода"},
    {id:"shadow",emoji:"〰️",name:"Теневой плинтус",desc:"Без видимого плинтуса, щель"},
    {id:"wood",emoji:"🪵",name:"Деревянный",desc:"Дуб, сосна, МДФ шпон"},
    {id:"aluminum",emoji:"⚡",name:"Алюминиевый",desc:"Скрытый LED-плинтус"},
    {id:"pvc",emoji:"▬",name:"ПВХ белый",desc:"60 мм, классика"},
  ],
};

var ROOM_TYPE_DEFAULTS={
  "Кухня":["walls","floors","ceilings","doors","lighting","plinth"],
  "Спальня":["walls","floors","ceilings","doors","lighting","plinth"],
  "Гостиная":["walls","floors","ceilings","doors","lighting","plinth"],
  "Санузел":["walls","floors","ceilings","lighting"],
  "Ванная":["walls","floors","ceilings","lighting"],
  "Коридор":["walls","floors","ceilings","doors","lighting","plinth"],
  "Балкон":["walls","floors","ceilings"],
};

var MAT_LABELS={"walls":"Стены","floors":"Полы","ceilings":"Потолок","doors":"Двери","lighting":"Освещение","plinth":"Плинтус"};
var MAT_ICONS={"walls":"🖌️","floors":"🪵","ceilings":"⬆️","doors":"🚪","lighting":"💡","plinth":"▬"};

function RoomMiniPlan(props){
  var rooms=props.rooms||[];var selected=props.selected;var onSelect=props.onSelect;var roomColors=props.roomColors||{};
  var totalArea=rooms.reduce(function(s,r){return s+(parseFloat(r.area)||0);},0);
  if(!totalArea)return null;
  var PAD=18;var IW=230;var IH=Math.min(170,Math.max(90,Math.round(Math.sqrt(totalArea)*22)));
  var W2=IW+PAD*2;var H2=IH+PAD*2;
  var sorted=rooms.slice().sort(function(a,b){return(parseFloat(b.area)||0)-(parseFloat(a.area)||0);});
  var packed=pack(sorted,0,0,IW,IH,true);
  return (
    <svg viewBox={"0 0 "+W2+" "+H2} style={{display:"block",width:"100%",height:"auto"}}>
      <rect width={W2} height={H2} fill="#F2F0EB" rx={3}/>
      <rect x={PAD-3} y={PAD-3} width={IW+6} height={IH+6} fill="none" stroke="#1A1814" strokeWidth={2.5} rx={1}/>
      {packed.map(function(r){
        var rx=r.px+PAD;var ry=r.py+PAD;var isSel=selected===r.id;
        var wallColor=roomColors[r.id]&&roomColors[r.id].walls&&roomColors[r.id].walls.color;
        var floorColor=roomColors[r.id]&&roomColors[r.id].floors&&roomColors[r.id].floors.color;
        var small=r.pw<55||r.ph<35;
        var hasConfig=roomColors[r.id]&&(roomColors[r.id].walls||roomColors[r.id].floors);
        return (
          <g key={r.id} onClick={function(){onSelect(r.id===selected?null:r.id);}} style={{cursor:"pointer"}}>
            <rect x={rx+1} y={ry+1} width={r.pw-2} height={r.ph-2} fill={wallColor||"#F0EDE6"} stroke={isSel?"#B8864E":"#1A1814"} strokeWidth={isSel?2.5:1.5} rx={1}/>
            {floorColor&&<rect x={rx+2} y={ry+r.ph*0.72} width={r.pw-4} height={r.ph*0.25} fill={floorColor} opacity={0.6} rx={1}/>}
            {isSel&&<rect x={rx-2} y={ry-2} width={r.pw+4} height={r.ph+4} fill="none" stroke="#B8864E" strokeWidth={1.5} opacity={0.5} rx={2}/>}
            <text x={rx+r.pw/2} y={ry+r.ph/2-(small?0:6)} textAnchor="middle" dominantBaseline="middle" fontSize={small?7:9} fontFamily={FB} fontWeight="600" fill={isSel?"#8A6234":"#1A1814"}>{r.name}</text>
            {!small&&<text x={rx+r.pw/2} y={ry+r.ph/2+7} textAnchor="middle" dominantBaseline="middle" fontSize={6} fontFamily={FM} fill="#7A756C">{r.area}м²</text>}
            {hasConfig&&<circle cx={rx+r.pw-8} cy={ry+8} r={6} fill="#3A8A5A"/>}
            {hasConfig&&<text x={rx+r.pw-8} y={ry+8} textAnchor="middle" dominantBaseline="middle" fontSize={8} fill="#fff">✓</text>}
          </g>
        );
      })}
    </svg>
  );
}

function MatColorPicker(props){
  var colors=props.colors||[];var selected=props.selected;var onSelect=props.onSelect;
  return (
    <div style={{display:"flex",gap:7,flexWrap:"wrap",marginTop:8}}>
      {colors.map(function(hex){
        var isSel=selected===hex;
        return(
          <button key={hex} onClick={function(){onSelect(isSel?null:hex);}} style={{width:30,height:30,borderRadius:8,background:hex,border:"2.5px solid "+(isSel?"#B8864E":"rgba(0,0,0,0.1)"),cursor:"pointer",boxShadow:isSel?"0 0 0 1px #B8864E":"none",flexShrink:0}}/>
        );
      })}
    </div>
  );
}

function RoomConfigPanel(props){
  var room=props.room;var config=props.config||{};var onUpdate=props.onUpdate;var onClose=props.onClose;var onDone=props.onDone;
  var lastColors=props.lastColors||{};
  var s0=useState("walls");var activeTab=s0[0];var setActiveTab=s0[1];
  var bs=useState(config.bathroomCfg||{bathing:"bath",warmFloor:false,waterproof:true,washingMachine:false,towelRack:true,toiletType:"install",hasFilter:false,pipeCover:false,showerType:"tray",plumbingType:"sequential"});
  var bathCfg=bs[0];var setBathCfg=bs[1];
  function setBathCfgField(k,v){var n=Object.assign({},bathCfg);n[k]=v;setBathCfg(n);var nc=Object.assign({},config);nc.bathroomCfg=n;onUpdate(nc);}
  if(!room)return null;
  var isWetRoom=/санузел|ванн|туалет/i.test(room.name);
  var baseTabs=ROOM_TYPE_DEFAULTS[room.name]||["walls","floors","ceilings","doors","lighting","plinth"];
  var tabs=isWetRoom?baseTabs.concat(["bathroom"]):baseTabs;
  var tabIdx=tabs.indexOf(activeTab);
  var isLastTab=tabIdx===tabs.length-1;

  function advanceTab(){
    if(!isLastTab){setActiveTab(tabs[tabIdx+1]);}
    else if(onDone){onDone();}
    else{onClose();}
  }

  function setMat(catKey,optId,color){
    var n=Object.assign({},config);
    if(catKey==="walls"){
      // walls = array of {id, color, pct}
      var arr=Array.isArray(n.walls)?n.walls.slice():(n.walls&&n.walls.id?[n.walls]:[]);
      var existIdx=-1;for(var wi=0;wi<arr.length;wi++){if(arr[wi].id===optId){existIdx=wi;break;}}
      if(existIdx>=0){arr.splice(existIdx,1);}else{arr.push({id:optId,color:color||null,pct:0});}
      if(arr.length>0){var share=Math.round(100/arr.length);arr.forEach(function(w,i){w.pct=i===arr.length-1?100-share*(arr.length-1):share;});}
      n.walls=arr;
    }else{
      n[catKey]={id:optId,color:color||null};
    }
    onUpdate(n);
  }
  function setColor(catKey,optId,color){
    var n=Object.assign({},config);
    if(catKey==="walls"){
      var arr=Array.isArray(n.walls)?n.walls.slice():(n.walls&&n.walls.id?[n.walls]:[]);
      for(var wi=0;wi<arr.length;wi++){if(arr[wi].id===optId){arr[wi]=Object.assign({},arr[wi],{color:color});break;}}
      n.walls=arr;
    }else{
      var existing=n[catKey]||{};n[catKey]=Object.assign({},existing,{color:color});
    }
    onUpdate(n);
  }
  function setWallPct(optId,pct){
    var n=Object.assign({},config);
    var arr=Array.isArray(n.walls)?n.walls.slice():(n.walls&&n.walls.id?[n.walls]:[]);
    for(var wi=0;wi<arr.length;wi++){if(arr[wi].id===optId){arr[wi]=Object.assign({},arr[wi],{pct:pct});break;}}
    n.walls=arr;onUpdate(n);
  }
  function toggleAircon(){var n=Object.assign({},config);n.hasAircon=!config.hasAircon;onUpdate(n);}
  function setLighting(optId){
    var n=Object.assign({},config);
    var arr=(n.lighting&&n.lighting.items)||[];
    var found=false;
    for(var i=0;i<arr.length;i++){if(arr[i]===optId){arr.splice(i,1);found=true;break;}}
    if(!found)arr.push(optId);
    n.lighting={items:arr};
    onUpdate(n);
  }
  var donePct=Math.round((Object.keys(config).filter(function(k){return k!=="bathroomCfg";}).length/baseTabs.length)*100);
  var tabLabel=isLastTab?(onDone?"Готово ✓":"Закрыть"):"Далее →";
  var MAT_LABELS_EXT=Object.assign({},MAT_LABELS,{bathroom:"🛁 Санузел"});
  var MAT_ICONS_EXT=Object.assign({},MAT_ICONS,{bathroom:"🛁"});
  return (
    <div style={{background:T.card,borderRadius:"22px 22px 0 0",boxShadow:"0 -6px 40px rgba(0,0,0,0.18)",display:"flex",flexDirection:"column",maxHeight:"62%",flexShrink:0}}>
      <div style={{display:"flex",justifyContent:"center",padding:"10px 0 4px"}}>
        <div style={{width:38,height:4,borderRadius:2,background:T.border}}/>
      </div>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"0 18px 6px",flexShrink:0}}>
        <div style={{flex:1}}>
          <div style={{fontFamily:FD,fontSize:17,fontWeight:600,color:T.dark}}>{room.name}</div>
          <div style={{fontFamily:FM,fontSize:9,color:T.muted}}>{room.area}м² · шаг {tabIdx+1} из {tabs.length}: {activeTab==="bathroom"?"Санузел":MAT_LABELS[activeTab]||activeTab}</div>
        </div>
        {donePct>0&&<div style={{width:32,height:32,borderRadius:"50%",background:T.goldL,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <span style={{fontFamily:FM,fontSize:9,fontWeight:600,color:T.goldD}}>{donePct}%</span>
        </div>}
        <button onClick={onClose} style={{width:26,height:26,borderRadius:"50%",border:"none",background:T.surface,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}><X size={12} color={T.muted}/></button>
      </div>
      {/* Progress bar */}
      <div style={{height:2,background:T.surface,margin:"0 18px 6px",borderRadius:1,flexShrink:0}}>
        <div style={{height:"100%",width:((tabIdx+1)/tabs.length*100)+"%",background:"linear-gradient(90deg,"+T.gold+",#D4A97A)",transition:"width 0.3s",borderRadius:1}}/>
      </div>
      {/* Category tabs */}
      <div style={{display:"flex",gap:4,padding:"0 18px 8px",overflowX:"auto",scrollbarWidth:"none",flexShrink:0}}>
        {tabs.map(function(tab){
          var isActive=activeTab===tab;var isDone=!!(config[tab]&&(config[tab].id||config[tab].items))||(tab==="bathroom"&&config.bathroomCfg);
          return(
            <button key={tab} onClick={function(){setActiveTab(tab);}} style={{padding:"6px 10px",borderRadius:10,border:"1.5px solid "+(isActive?T.gold:T.border),background:isActive?T.goldL:T.surface,fontFamily:FB,fontSize:10,color:isActive?T.goldD:T.muted,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,display:"flex",alignItems:"center",gap:4}}>
              {tab==="bathroom"?"🛁":MAT_ICONS[tab]} {tab==="bathroom"?"Санузел":MAT_LABELS[tab]}
              {isDone&&<span style={{width:5,height:5,borderRadius:"50%",background:T.green,flexShrink:0}}/>}
            </button>
          );
        })}
      </div>
      {/* Content */}
      <div style={{flex:1,overflowY:"auto",padding:"0 18px 14px",scrollbarWidth:"none"}}>

        {activeTab==="bathroom"&&isWetRoom&&<div>
          {/* Материалы стен санузла */}
          <div style={{marginBottom:12,padding:"10px 12px",background:T.surface,borderRadius:12,border:"1px solid "+T.border}}>
            <div style={{fontFamily:FM,fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>🖌️ Стены санузла</div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:6}}>
              {[{id:"tile",label:"Плитка / керамогранит"},{id:"paint",label:"Покраска"},{id:"microcement",label:"Микроцемент"}].map(function(opt){
                var isSel=(bathCfg.wallMat||"tile")===opt.id;
                return(<button key={opt.id} onClick={function(){setBathCfgField("wallMat",opt.id);}} style={{padding:"7px 12px",borderRadius:9,background:isSel?T.goldL:T.card,border:"1.5px solid "+(isSel?T.gold:T.border),cursor:"pointer",fontFamily:FB,fontSize:11,color:isSel?T.goldD:T.dark,display:"flex",alignItems:"center",gap:4}}>{isSel&&<Check size={9} color={T.gold}/>}{opt.label}</button>);
              })}
            </div>
            {(bathCfg.wallMat==="tile"||!bathCfg.wallMat)&&<div>
              <div style={{fontFamily:FM,fontSize:8,color:T.light,marginBottom:5}}>Формат плитки стен</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {["20×60","30×60","60×60","60×120","80×80"].map(function(sz){
                  var isSel=(bathCfg.tileWallSize||"30×60")===sz;
                  return(<button key={sz} onClick={function(){setBathCfgField("tileWallSize",sz);}} style={{padding:"5px 9px",borderRadius:7,background:isSel?T.gold:T.card,border:"1px solid "+(isSel?T.gold:T.border),cursor:"pointer",fontFamily:FM,fontSize:10,color:isSel?"#fff":T.dark,fontWeight:isSel?600:400}}>{sz}</button>);
                })}
              </div>
            </div>}
          </div>
          {/* Материалы пола санузла */}
          <div style={{marginBottom:12,padding:"10px 12px",background:T.surface,borderRadius:12,border:"1px solid "+T.border}}>
            <div style={{fontFamily:FM,fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>🪵 Пол санузла</div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:6}}>
              {[{id:"tile",label:"Плитка / керамогранит"},{id:"microcement",label:"Микроцемент / наливной"}].map(function(opt){
                var isSel=(bathCfg.floorMat||"tile")===opt.id;
                return(<button key={opt.id} onClick={function(){setBathCfgField("floorMat",opt.id);}} style={{padding:"7px 12px",borderRadius:9,background:isSel?T.goldL:T.card,border:"1.5px solid "+(isSel?T.gold:T.border),cursor:"pointer",fontFamily:FB,fontSize:11,color:isSel?T.goldD:T.dark,display:"flex",alignItems:"center",gap:4}}>{isSel&&<Check size={9} color={T.gold}/>}{opt.label}</button>);
              })}
            </div>
            {(bathCfg.floorMat==="tile"||!bathCfg.floorMat)&&<div>
              <div style={{fontFamily:FM,fontSize:8,color:T.light,marginBottom:5}}>Формат плитки пола</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                {["30×30","60×60","60×120","80×80","120×120"].map(function(sz){
                  var isSel=(bathCfg.tileFloorSize||"60×60")===sz;
                  return(<button key={sz} onClick={function(){setBathCfgField("tileFloorSize",sz);}} style={{padding:"5px 9px",borderRadius:7,background:isSel?T.gold:T.card,border:"1px solid "+(isSel?T.gold:T.border),cursor:"pointer",fontFamily:FM,fontSize:10,color:isSel?"#fff":T.dark,fontWeight:isSel?600:400}}>{sz}</button>);
                })}
              </div>
            </div>}
          </div>
          <div style={{fontFamily:FM,fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>🛁 Купание</div>
          <BathRadio value={bathCfg.bathing} onChange={function(v){setBathCfgField("bathing",v);}} options={[
            {id:"bath",emoji:"🛁",label:"Ванная",desc:"Акриловая ванна 170×70"},
            {id:"shower",emoji:"🚿",label:"Душевая",desc:"Поддон / стойка"},
            {id:"none",emoji:"❌",label:"Без купания",desc:"Только умывальник"},
          ]}/>
          {bathCfg.bathing==="shower"&&<div style={{marginBottom:8}}>
            <div style={{fontFamily:FM,fontSize:9,color:T.muted,marginBottom:6}}>🚿 Тип душевой</div>
            <BathRadio value={bathCfg.showerType||"tray"} onChange={function(v){setBathCfgField("showerType",v);}} options={[
              {id:"tray",emoji:"🪣",label:"Поддон стандарт",desc:"Акрил / сталь"},
              {id:"stone",emoji:"🪨",label:"Поддон камень",desc:"Натуральный камень"},
              {id:"poured",emoji:"🏗️",label:"Заливная",desc:"Стяжка + линейный трап"},
            ]}/>
          </div>}
          <div style={{fontFamily:FM,fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8,marginTop:4}}>🚽 Унитаз</div>
          <BathRadio value={bathCfg.toiletType} onChange={function(v){setBathCfgField("toiletType",v);}} options={[
            {id:"install",emoji:"🏗️",label:"Инсталляция",desc:"Geberit / Grohe"},
            {id:"floor",emoji:"🪑",label:"Напольный",desc:"Стандартная установка"},
            {id:"none",emoji:"❌",label:"Уже установлен",desc:""},
          ]}/>
          <div style={{fontFamily:FM,fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8,marginTop:4}}>💧 Разводка</div>
          <BathRadio value={bathCfg.plumbingType||"sequential"} onChange={function(v){setBathCfgField("plumbingType",v);}} options={[
            {id:"sequential",emoji:"〰️",label:"Последовательная",desc:"PPR — экономично"},
            {id:"collector",emoji:"⭐",label:"Коллекторная",desc:"Rehau — надёжно"},
          ]}/>
          <div style={{fontFamily:FM,fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8,marginTop:4}}>⚙️ Доп. оборудование</div>
          <BathToggle emoji="🌡️" label="Тёплый пол" value={bathCfg.warmFloor} onChange={function(v){setBathCfgField("warmFloor",v);}}/>
          <BathToggle emoji="💧" label="Гидроизоляция" value={bathCfg.waterproof!==undefined?bathCfg.waterproof:true} onChange={function(v){setBathCfgField("waterproof",v);}}/>
          <BathToggle emoji="👕" label="Стиральная машина" value={bathCfg.washingMachine} onChange={function(v){setBathCfgField("washingMachine",v);}}/>
          <BathToggle emoji="🔥" label="Полотенцесушитель" value={bathCfg.towelRack!==undefined?bathCfg.towelRack:true} onChange={function(v){setBathCfgField("towelRack",v);}}/>
          <BathToggle emoji="🧹" label="Фильтры воды" value={bathCfg.hasFilter||false} onChange={function(v){setBathCfgField("hasFilter",v);}}/>
          <BathToggle emoji="📦" label="Зашивка труб коробом" value={bathCfg.pipeCover||false} onChange={function(v){setBathCfgField("pipeCover",v);}}/>
        </div>}

        {activeTab==="lighting"&&<div>
          <div style={{fontFamily:FM,fontSize:9,color:T.muted,marginBottom:8}}>Можно выбрать несколько вариантов</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {MAT_OPTIONS.lighting.map(function(opt){
              var selItems=(config.lighting&&config.lighting.items)||[];
              var isSel=selItems.indexOf(opt.id)>=0;
              return(
                <button key={opt.id} onClick={function(){setLighting(opt.id);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:12,background:isSel?"#1A1814":T.card,border:"1.5px solid "+(isSel?"#1A1814":T.border),cursor:"pointer",textAlign:"left"}}>
                  <div style={{width:36,height:36,borderRadius:10,background:isSel?"rgba(255,255,255,0.12)":T.goldL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{opt.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:FB,fontSize:12,fontWeight:500,color:isSel?"#fff":T.dark}}>{opt.name}</div>
                    <div style={{fontFamily:FB,fontSize:10,color:isSel?"rgba(255,255,255,0.5)":T.muted}}>{opt.desc}</div>
                  </div>
                  {isSel&&<Check size={13} color={T.gold}/>}
                </button>
              );
            })}
          </div>
        </div>}

        {activeTab==="plinth"&&<div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {MAT_OPTIONS.plinth.map(function(opt){
              var isSel=config.plinth&&config.plinth.id===opt.id;
              return(
                <button key={opt.id} onClick={function(){setMat("plinth",opt.id,null);}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:12,background:isSel?T.goldL:T.card,border:"1.5px solid "+(isSel?T.gold:T.border),cursor:"pointer",textAlign:"left"}}>
                  <div style={{width:36,height:36,borderRadius:10,background:isSel?T.gold:"#E8E4E0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{opt.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontFamily:FB,fontSize:12,fontWeight:500,color:isSel?T.goldD:T.dark}}>{opt.name}</div>
                    <div style={{fontFamily:FB,fontSize:10,color:T.muted}}>{opt.desc}</div>
                  </div>
                  {isSel&&<Check size={13} color={T.gold}/>}
                </button>
              );
            })}
          </div>
        </div>}

        {(activeTab==="walls"||activeTab==="floors"||activeTab==="ceilings"||activeTab==="doors")&&<div>
          {activeTab==="walls"&&<div style={{padding:"7px 10px",background:"#EEF4FA",borderRadius:10,marginBottom:10,fontFamily:FB,fontSize:10,color:"#4A6080"}}>
            💡 Можно выбрать несколько материалов стен — нажмите каждый нужный. Задайте % доли для каждого.
          </div>}
          {MAT_OPTIONS[activeTab].map(function(opt){
            var wallArr=activeTab==="walls"?(Array.isArray(config.walls)?config.walls:(config.walls&&config.walls.id?[config.walls]:[])):[];
            var wallEntry=activeTab==="walls"?wallArr.find(function(w){return w.id===opt.id;}):null;
            var isSel=activeTab==="walls"?!!wallEntry:(config[activeTab]&&config[activeTab].id===opt.id);
            var curColor=activeTab==="walls"?(wallEntry&&wallEntry.color||null):(config[activeTab]&&config[activeTab].color||null);
            var curPct=wallEntry?wallEntry.pct:0;
            return(
              <div key={opt.id} style={{marginBottom:isSel?14:8}}>
                <button onClick={function(){setMat(activeTab,opt.id,isSel?curColor:(opt.colors&&opt.colors[0])||null);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 12px",borderRadius:isSel?"12px 12px 0 0":12,background:isSel?T.goldL:T.card,border:"1.5px solid "+(isSel?T.gold:T.border),cursor:"pointer",textAlign:"left"}}>
                  <div style={{width:36,height:36,borderRadius:9,background:"#E0DCD8",border:"1px solid rgba(0,0,0,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0,overflow:"hidden"}}>
                    {isSel?<Check size={14} color={T.goldD}/>:opt.emoji}
                  </div>
                  <div style={{flex:1,textAlign:"left"}}>
                    <div style={{fontFamily:FB,fontSize:12,fontWeight:500,color:isSel?T.goldD:T.dark}}>{opt.name}</div>
                    <div style={{fontFamily:FB,fontSize:10,color:T.muted}}>{opt.desc}{activeTab==="walls"&&isSel?" · "+curPct+"%":""}</div>
                  </div>
                  {isSel&&<Check size={13} color={T.gold}/>}
                </button>
                {isSel&&<div style={{border:"1.5px solid "+T.gold,borderTop:"none",borderRadius:"0 0 12px 12px",padding:"10px 12px",background:T.goldL+"40"}}>
                  {activeTab==="walls"&&wallArr.length>1&&<div style={{marginBottom:8}}>
                    <div style={{fontFamily:FM,fontSize:8,color:T.muted,marginBottom:5,textTransform:"uppercase",letterSpacing:0.5}}>Доля материала: {curPct}% стен</div>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                      {[10,20,30,40,50,60,70,80].map(function(p){return(
                        <button key={p} onClick={function(){setWallPct(opt.id,p);}} style={{padding:"4px 8px",borderRadius:7,background:curPct===p?T.gold:T.card,border:"1px solid "+(curPct===p?T.gold:T.border),cursor:"pointer",fontFamily:FM,fontSize:10,color:curPct===p?"#fff":T.dark,fontWeight:600}}>{p}%</button>
                      );})}
                    </div>
                  </div>}
                  {/* Выбор цвета убран — только материалы */}
                  {opt.extraKey&&<div style={{marginTop:10}}>
                    <div style={{fontFamily:FM,fontSize:8,color:T.muted,marginBottom:6,textTransform:"uppercase",letterSpacing:0.5}}>{opt.extraLabel}</div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {opt.extraOptions.map(function(ev){
                        var curEv=config[activeTab]&&config[activeTab][opt.extraKey];var isEv=curEv===ev;
                        return(<button key={ev} onClick={function(){var n=Object.assign({},config);n[activeTab]=Object.assign({},n[activeTab]||{});n[activeTab][opt.extraKey]=ev;onUpdate(n);}} style={{padding:"6px 10px",borderRadius:8,border:"1.5px solid "+(isEv?T.gold:T.border),background:isEv?T.gold:"transparent",color:isEv?"#fff":T.dark,fontFamily:FM,fontSize:11,fontWeight:600,cursor:"pointer"}}>{ev}{opt.extraKey==="panel_pct"?"%":""}</button>);
                      })}
                    </div>
                  </div>}
                </div>}
              </div>
            );
          })}
        </div>}
      </div>
      {/* ── Кондиционер — опция для жилых комнат ── */}
      {!isWetRoom&&activeTab!=="bathroom"&&<div style={{padding:"6px 18px 0",flexShrink:0}}>
        <button onClick={toggleAircon} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 12px",borderRadius:11,background:config.hasAircon?T.goldL:T.surface,border:"1.5px solid "+(config.hasAircon?T.gold:T.border),cursor:"pointer",textAlign:"left"}}>
          <span style={{fontSize:18}}>❄️</span>
          <div style={{flex:1}}>
            <div style={{fontFamily:FB,fontSize:12,fontWeight:500,color:config.hasAircon?T.goldD:T.dark}}>Кондиционер</div>
            <div style={{fontFamily:FM,fontSize:9,color:T.muted}}>Монтаж внутр. блока + трубопровод</div>
          </div>
          {config.hasAircon&&<Check size={13} color={T.gold}/>}
        </button>
      </div>}
      {/* ── Кнопка "Продолжить" — всегда снизу ── */}
      <div style={{padding:"8px 18px 14px",flexShrink:0,borderTop:"1px solid "+T.border}}>
        <button onClick={advanceTab} style={{
          width:"100%",padding:"13px",borderRadius:14,
          background:isLastTab?"linear-gradient(135deg,"+T.gold+",#D4A97A)":"linear-gradient(135deg,#1A2838,#2A3848)",
          border:"none",cursor:"pointer",
          fontFamily:FM,fontSize:13,fontWeight:600,
          color:"#fff",
          display:"flex",alignItems:"center",justifyContent:"center",gap:8,
          boxShadow:isLastTab?"0 4px 16px rgba(184,134,78,0.4)":"0 3px 12px rgba(0,0,0,0.2)"
        }}>
          {isLastTab
            ?<>✓ Готово — предложить смету</>
            :<>Продолжить → {tabs[tabIdx+1]==="bathroom"?"Санузел":MAT_LABELS[tabs[tabIdx+1]]||tabs[tabIdx+1]}</>
          }
        </button>
      </div>
    </div>
  );
}

function ScreenDesignPlan(props){
  var rooms=props.rooms||[];
  var sr=useState(null);var selectedRoom=sr[0];var setSelectedRoom=sr[1];
  var rc=useState({});var roomConfigs=rc[0];var setRoomConfigs=rc[1];
  var vi=useState("list");var view=vi[0];var setView=vi[1];
  // roomHistory: stack of room ids visited, for forward/back navigation
  var rh=useState([]);var roomHistory=rh[0];var setRoomHistory=rh[1];
  var rhi=useState(-1);var histIdx=rhi[0];var setHistIdx=rhi[1];
  var lc=useState({walls:null,floors:null,ceilings:null});var lastColors=lc[0];var setLastColors=lc[1];
  var cp=useState(false);var showCopyPrompt=cp[0];var setShowCopyPrompt=cp[1];
  var cr=useState([]);var copyTargets=cr[0];var setCopyTargets=cr[1];

  function updateRC(roomId,config){
    var n=Object.assign({},roomConfigs);n[roomId]=config;
    var nc=Object.assign({},lastColors);
    if(config.walls&&config.walls.color)nc.walls=config.walls.color;
    if(config.floors&&config.floors.color)nc.floors=config.floors.color;
    if(config.ceilings&&config.ceilings.color)nc.ceilings=config.ceilings.color;
    setLastColors(nc);setRoomConfigs(n);
  }
  function getRoomColors(){var c={};Object.keys(roomConfigs).forEach(function(rid){c[rid]=roomConfigs[rid];});return c;}

  // Navigate to a room, pushing history so we can go back/forward
  function navigateTo(roomId){
    if(roomId===null){setSelectedRoom(null);return;}
    var newHist=roomHistory.slice(0,histIdx+1);newHist.push(roomId);
    setRoomHistory(newHist);setHistIdx(newHist.length-1);setSelectedRoom(roomId);
  }
  function goBack(){
    if(histIdx<=0){setSelectedRoom(null);setHistIdx(-1);return;}
    var prev=roomHistory[histIdx-1];setHistIdx(histIdx-1);setSelectedRoom(prev);
  }
  function goForward(){
    if(histIdx>=roomHistory.length-1)return;
    var next=roomHistory[histIdx+1];setHistIdx(histIdx+1);setSelectedRoom(next);
  }
  var canGoBack=histIdx>0;var canGoForward=histIdx<roomHistory.length-1;

  // After finishing a room — offer to copy to others
  function handleRoomDone(finishedRoomId){
    var unfilledRooms=rooms.filter(function(r){return r.id!==finishedRoomId&&(!roomConfigs[r.id]||Object.keys(roomConfigs[r.id]).length<2);});
    var cfg=roomConfigs[finishedRoomId]||{};
    if(unfilledRooms.length>0){
      // Pre-suggest same-type rooms
      var finishedName=rooms.filter(function(r){return r.id===finishedRoomId;})[0]&&rooms.filter(function(r){return r.id===finishedRoomId;})[0].name||"";
      var suggested=unfilledRooms.filter(function(r){
        // suggest bedrooms for bedroom, living for living, etc.
        var similar=/спальн/i.test(finishedName)&&/спальн/i.test(r.name);
        return similar;
      }).map(function(r){return r.id;});
      setCopyTargets(suggested.length>0?suggested:[]);
      setShowCopyPrompt(true);
    }else{
      // All rooms done → go back to list
      setSelectedRoom(null);
    }
  }

  function applyCopyAndContinue(){
    var srcCfg=selectedRoom?roomConfigs[selectedRoom]||{}:{};
    var n=Object.assign({},roomConfigs);
    copyTargets.forEach(function(rid){n[rid]=Object.assign({},n[rid]||{},srcCfg);});
    setRoomConfigs(n);
    setShowCopyPrompt(false);
    // Go to next unfilled room
    var nextUnfilled=rooms.find(function(r){return !copyTargets.includes(r.id)&&r.id!==selectedRoom&&(!n[r.id]||Object.keys(n[r.id]).length<2);});
    if(nextUnfilled){setSelectedRoom(nextUnfilled.id);}else{setSelectedRoom(null);}
  }

  function skipCopyAndContinue(){
    setShowCopyPrompt(false);
    var n=roomConfigs;
    var nextUnfilled=rooms.find(function(r){return r.id!==selectedRoom&&(!n[r.id]||Object.keys(n[r.id]).length<2);});
    if(nextUnfilled){setSelectedRoom(nextUnfilled.id);}else{setSelectedRoom(null);}
  }

  var activeRoomObj=rooms.find(function(r){return r.id===selectedRoom;})||null;
  var activeConfig=selectedRoom?roomConfigs[selectedRoom]||{}:{};
  var doneCount=rooms.filter(function(r){return roomConfigs[r.id]&&Object.keys(roomConfigs[r.id]).length>=2;}).length;
  var pct=rooms.length>0?Math.round((doneCount/rooms.length)*100):0;

  function handleNext(){
    var filled=Object.assign({},roomConfigs);
    var firstFilled=Object.values(filled).find(function(c){return c&&Object.keys(c).length>=2;})||{walls:{id:"paint",color:"#F5F2EC"},floors:{id:"quartz_vinyl",color:"#D4C4B0"},ceilings:{id:"stretch",color:"#FFFFFF"},doors:{id:"eco",color:"#F8F8F8"}};
    rooms.forEach(function(r){if(!filled[r.id]||Object.keys(filled[r.id]).length<2)filled[r.id]=Object.assign({},firstFilled);});
    props.onNext(filled);
  }

  // Copy-to-rooms overlay
  if(showCopyPrompt&&selectedRoom){
    var srcCfgForCopy=roomConfigs[selectedRoom]||{};
    var unfilledForCopy=rooms.filter(function(r){return r.id!==selectedRoom&&(!roomConfigs[r.id]||Object.keys(roomConfigs[r.id]).length<2);});
    var wallN=srcCfgForCopy.walls&&MAT_OPTIONS.walls.find(function(o){return o.id===srcCfgForCopy.walls.id;});
    var floorN=srcCfgForCopy.floors&&MAT_OPTIONS.floors.find(function(o){return o.id===srcCfgForCopy.floors.id;});
    var srcDesc=[wallN&&wallN.name,floorN&&floorN.name].filter(Boolean).join(" + ");
    return(
      <div style={{display:"flex",flexDirection:"column",height:"100%",background:T.bg}}>
        <div style={{padding:"20px 22px 0",flexShrink:0}}>
          <div style={{fontFamily:FD,fontSize:22,fontWeight:600,color:T.dark,marginBottom:4}}>Применить к другим?</div>
          <div style={{fontFamily:FB,fontSize:12,color:T.muted,marginBottom:6,lineHeight:1.6}}>Вы выбрали: <b style={{color:T.goldD}}>{srcDesc||"материалы"}</b>. Применить к другим помещениям?</div>
        </div>
        <Scroll>
          {unfilledForCopy.map(function(r){
            var isSel=copyTargets.indexOf(r.id)>=0;
            return(
              <button key={r.id} onClick={function(){var arr=copyTargets.slice();var idx=arr.indexOf(r.id);if(idx>=0)arr.splice(idx,1);else arr.push(r.id);setCopyTargets(arr);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"12px 14px",borderRadius:13,background:isSel?T.goldL:T.card,border:"2px solid "+(isSel?T.gold:T.border),marginBottom:7,cursor:"pointer",textAlign:"left"}}>
                <div style={{width:24,height:24,borderRadius:7,border:"2px solid "+(isSel?T.gold:T.border),background:isSel?T.gold:T.card,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {isSel&&<Check size={12} color="#fff"/>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:FB,fontSize:13,fontWeight:500,color:T.dark}}>{r.name}</div>
                  <div style={{fontFamily:FM,fontSize:9,color:T.muted}}>{r.area} м²</div>
                </div>
              </button>
            );
          })}
          <div style={{height:12}}/>
        </Scroll>
        <div style={{padding:"0 22px 16px",flexShrink:0,display:"flex",flexDirection:"column",gap:8}}>
          {copyTargets.length>0&&<Btn label={"Применить к "+copyTargets.length+" помещ. и продолжить"} onPress={applyCopyAndContinue}/>}
          <button onClick={skipCopyAndContinue} style={{padding:"12px",borderRadius:14,background:T.surface,border:"none",fontFamily:FM,fontSize:12,color:T.muted,cursor:"pointer"}}>
            {rooms.find(function(r){return r.id!==selectedRoom&&(!roomConfigs[r.id]||Object.keys(roomConfigs[r.id]).length<2);})?"Пропустить → следующее помещение":"Вернуться к списку"}
          </button>
        </div>
      </div>
    );
  }

  var listView=(
    <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
      <div style={{padding:"0 16px 4px",flexShrink:0}}>
        <div style={{borderRadius:14,overflow:"hidden",border:"2px solid "+T.border,background:"#F2F0EB"}}>
          <RoomMiniPlan rooms={rooms} selected={null} onSelect={navigateTo} roomColors={getRoomColors()}/>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"4px 16px 0",scrollbarWidth:"none"}}>
        {rooms.map(function(r){
          var cfg=roomConfigs[r.id]||{};var cnt=Object.keys(cfg).length;var done2=cnt>=2;
          var wallColor=cfg.walls&&cfg.walls.color||null;
          var wallItems=Array.isArray(cfg.walls)?cfg.walls:(cfg.walls?[cfg.walls]:[]);
          var floorItem=cfg.floors&&MAT_OPTIONS.floors.find(function(o){return o.id===cfg.floors.id;});
          var wallNames=wallItems.map(function(w){var o=MAT_OPTIONS.walls.find(function(x){return x.id===w.id;});return o?o.name:"";}).filter(Boolean).join("+");
          var floorName=floorItem?floorItem.name:"";
          return(
            <button key={r.id} onClick={function(){navigateTo(r.id);}} style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"11px 13px",borderRadius:13,background:T.card,border:"1.5px solid "+(done2?T.gold+"60":T.border),marginBottom:7,cursor:"pointer",textAlign:"left",boxShadow:T.shadow}}>
              <div style={{width:30,height:30,borderRadius:9,background:wallColor||T.surface,border:"1px solid rgba(0,0,0,0.1)",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {done2?<Check size={12} color={T.green}/>:<span style={{fontFamily:FM,fontSize:9,color:T.light}}>+</span>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontFamily:FB,fontSize:13,fontWeight:500,color:T.dark}}>{r.name} <span style={{fontFamily:FM,fontSize:9,color:T.muted}}>{r.area}м²</span></div>
                <div style={{fontFamily:FB,fontSize:10,color:cnt>0?T.muted:T.light,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cnt>0?([wallNames,floorName].filter(Boolean).join(" · ")||cnt+" настроено"):"Нажмите для настройки"}</div>
              </div>
              <ChevronRight size={14} color={T.light}/>
            </button>
          );
        })}
        {doneCount<rooms.length&&doneCount>0&&<div style={{padding:"10px 13px",background:T.goldL,borderRadius:11,marginBottom:8,border:"1px solid "+T.gold+"50"}}>
          <div style={{fontFamily:FB,fontSize:11,color:T.goldD,lineHeight:1.5}}>💡 Ещё {rooms.length-doneCount} помещ. не настроено — нажмите «Продолжить»</div>
        </div>}
        <div style={{height:8}}/>
      </div>
      <div style={{padding:"0 16px 12px",flexShrink:0,display:"flex",flexDirection:"column",gap:7}}>
        {rooms.length-doneCount>0&&doneCount>0&&<button onClick={function(){var next=rooms.find(function(r){return !roomConfigs[r.id]||Object.keys(roomConfigs[r.id]).length<2;});if(next)navigateTo(next.id);}} style={{padding:"11px",borderRadius:13,background:T.surface,border:"1.5px solid "+T.border,fontFamily:FM,fontSize:12,color:T.dark,cursor:"pointer",fontWeight:600}}>
          Продолжить → незаполненные ({rooms.length-doneCount})
        </button>}
        <Btn label={doneCount>0?"Рассчитать смету →":"Настройте хотя бы 1 комнату"} onPress={handleNext} disabled={doneCount===0}/>
      </div>
    </div>
  );

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <div style={{padding:"8px 16px 0",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
          {/* Back button */}
          <button onClick={function(){if(selectedRoom){goBack();if(histIdx<=0)setSelectedRoom(null);}else{props.onBack();}}} style={{width:32,height:32,borderRadius:10,background:T.surface,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
            <ChevronLeft size={16} color={T.dark}/>
          </button>
          <div style={{flex:1}}>
            <div style={{fontFamily:FD,fontSize:18,fontWeight:600,color:T.dark}}>{selectedRoom?(activeRoomObj&&activeRoomObj.name)||"Комната":"Дизайн-проект"}</div>
            <div style={{fontFamily:FM,fontSize:9,color:T.muted}}>{selectedRoom?"← ← сохраняет изменения":doneCount+"/"+rooms.length+" настроено"}</div>
          </div>
          {/* Forward button — only when inside a room and history allows */}
          {selectedRoom&&canGoForward&&<button onClick={goForward} style={{width:32,height:32,borderRadius:10,background:T.surface,border:"1.5px solid "+T.border,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
            <ChevronRight size={16} color={T.dark}/>
          </button>}
          {!selectedRoom&&<div style={{display:"flex",background:T.surface,borderRadius:9,padding:3,gap:2}}>
            <button onClick={function(){setView("plan");}} style={{padding:"5px 8px",borderRadius:7,border:"none",background:view==="plan"?T.card:"transparent",fontFamily:FM,fontSize:9,color:view==="plan"?T.dark:T.muted,cursor:"pointer"}}>🗺</button>
            <button onClick={function(){setView("list");}} style={{padding:"5px 8px",borderRadius:7,border:"none",background:view==="list"?T.card:"transparent",fontFamily:FM,fontSize:9,color:view==="list"?T.dark:T.muted,cursor:"pointer"}}>☰</button>
          </div>}
        </div>
        <div style={{height:3,background:T.surface,borderRadius:2,overflow:"hidden",marginBottom:4}}>
          <div style={{height:"100%",width:pct+"%",background:"linear-gradient(90deg,"+T.gold+",#D4A97A)",transition:"width 0.4s",borderRadius:2}}/>
        </div>
      </div>
      {selectedRoom
        ?<div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
            <div style={{padding:"0 16px 4px",flexShrink:0}}>
              <div style={{borderRadius:12,overflow:"hidden",border:"2px solid "+T.gold,background:"#F2F0EB"}}>
                <RoomMiniPlan rooms={rooms} selected={selectedRoom} onSelect={function(id){navigateTo(id===selectedRoom?null:id);}} roomColors={getRoomColors()}/>
              </div>
            </div>
            <RoomConfigPanel room={activeRoomObj} config={activeConfig} lastColors={lastColors}
              onUpdate={function(cfg){updateRC(selectedRoom,cfg);}}
              onClose={function(){navigateTo(null);}}
              onDone={function(){handleRoomDone(selectedRoom);}}/>
          </div>
        :(view==="plan"
          ?<div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
              <div style={{padding:"0 16px 4px",flexShrink:0}}>
                <div style={{borderRadius:14,overflow:"hidden",border:"2px solid "+T.border,background:"#F2F0EB"}}>
                  <RoomMiniPlan rooms={rooms} selected={null} onSelect={navigateTo} roomColors={getRoomColors()}/>
                </div>
                <div style={{fontFamily:FB,fontSize:10,color:T.muted,textAlign:"center",marginTop:4}}>👆 Нажмите на комнату</div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"4px 16px",scrollbarWidth:"none"}}>
                {rooms.map(function(r,i){
                  var cfg=roomConfigs[r.id]||{};var parts=[];
                  if(cfg.walls){var w=MAT_OPTIONS.walls.find(function(o){return o.id===(Array.isArray(cfg.walls)?cfg.walls[0]&&cfg.walls[0].id:cfg.walls.id);});parts.push(w?w.name:"");}
                  if(cfg.floors){var f=MAT_OPTIONS.floors.find(function(o){return o.id===cfg.floors.id;});parts.push(f?f.name:"");}
                  return(<div key={r.id} style={{padding:"7px 10px",background:i%2?T.card:T.surface,borderRadius:8,marginBottom:3,fontFamily:FB,fontSize:11,color:T.dark,lineHeight:1.4}}><b>{r.name}</b>: {parts.filter(Boolean).join(" · ")||"не настроена"}</div>);
                })}
              </div>
              <Btn label={doneCount>0?"Рассчитать смету →":"Настройте хотя бы 1 комнату"} onPress={handleNext} disabled={doneCount===0}/>
            </div>
          :listView)
      }
    </div>
  );
}


/* ── SCREEN: DESIGN ESTIMATE ── */
function ScreenDesignEstimate(props){
  var s0=useState("calc");var status=s0[0];var setStatus=s0[1];
  var s1=useState(null);var result=s1[0];var setResult=s1[1];
  /* ── v13: состояние дизайн-проекта ── */
  var s9=useState(null);var dpHtml=s9[0];var setDpHtml=s9[1];
  var s10=useState(false);var dpLoading=s10[0];var setDpLoading=s10[1];
  var city=props.city||CITIES[0];var rooms=props.rooms||[];var cls=props.cls||"mid";var cfg=props.designCfg||{};
  function matIdToString(catKey,id){
    var opts=MAT_OPTIONS[catKey]||[];for(var i=0;i<opts.length;i++){if(opts[i].id===id)return opts[i].name;}return id||"";
  }
  useEffect(function(){
    var tid=setTimeout(function(){
      try{
        var roomMatsMap={};
        var allWalls=[],allFloors=[],allCeils=[],allDoors=[];
        rooms.forEach(function(r){
          var rc2=cfg[r.id]||{};
          var wId=Array.isArray(rc2.walls)?(rc2.walls[0]&&rc2.walls[0].id):rc2.walls&&rc2.walls.id;
          if(wId)allWalls.push(wId);
          if(rc2.floors&&rc2.floors.id)allFloors.push(rc2.floors.id);
          if(rc2.ceilings&&rc2.ceilings.id)allCeils.push(rc2.ceilings.id);
          if(rc2.doors&&rc2.doors.id)allDoors.push(rc2.doors.id);
        });
        var fallW=allWalls[0]||"paint";var fallF=allFloors[0]||"quartz_vinyl";var fallC=allCeils[0]||"stretch";var fallD=allDoors[0]||"eco";
        var sharedBath=null;
        var roomAircons={};
        rooms.forEach(function(r){
          var rc2=cfg[r.id]||{};
          if(rc2.bathroomCfg)sharedBath=rc2.bathroomCfg;
          // AC flag stored directly on room config
          if(rc2.hasAircon)roomAircons[r.id]=true;
          // Wall: support single object or array
          var wallId=Array.isArray(rc2.walls)?(rc2.walls[0]&&rc2.walls[0].id):rc2.walls&&rc2.walls.id;
          roomMatsMap[r.id]={
            wall:matIdToString("walls",wallId)||matIdToString("walls",fallW)||"Покраска",
            floor:matIdToString("floors",rc2.floors&&rc2.floors.id)||matIdToString("floors",fallF)||"Кварцвинил",
            ceil:matIdToString("ceilings",rc2.ceilings&&rc2.ceilings.id)||matIdToString("ceilings",fallC)||"Натяжные",
            door:matIdToString("doors",rc2.doors&&rc2.doors.id)||matIdToString("doors",fallD)||"Экошпон",
          };
        });
        var r=calcEstimate(rooms,props.cond||"rough",cls,city.k,roomMatsMap,100,sharedBath,roomAircons);
        setResult(r);
      }catch(err){
        console.error("designEstimate error:",err);
        setResult({rooms:rooms.map(function(r){return{name:r.name,area:parseFloat(r.area)||10,works:[],materials:[],workTotal:0,matTotal:0,total:0};}),workTotal:0,matTotal:0,total:0,hasError:true,errorMsg:err.message});
      }
      setStatus("done");
    },200);
    return function(){clearTimeout(tid);};
  },[]);
  if(status==="calc")return(
    <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
      <Hdr title="Считаем смету..." step={2} total={3}/>
      <Scroll><div style={{textAlign:"center",padding:"50px 0"}}>
        <Loader size={36} color={T.gold} style={{animation:"spin 1s linear infinite",marginBottom:14}}/>
        <div style={{fontFamily:FD,fontSize:18,color:T.dark,marginBottom:5}}>Формируем дизайн-смету...</div>
        <div style={{fontFamily:FB,fontSize:12,color:T.muted}}>Работы и материалы по вашему проекту</div>
      </div></Scroll>
    </div>
  );
  return(
    <div style={{display:"flex",flexDirection:"column",height:"100%",position:"relative"}}>
      <div style={{padding:"8px 22px 8px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <button onClick={props.onBack} style={{width:32,height:32,borderRadius:10,background:T.surface,border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}><ChevronLeft size={16} color={T.dark}/></button>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontFamily:FD,fontSize:18,fontWeight:600,color:T.dark,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Смета дизайн-проекта</div>
            <div style={{fontFamily:FM,fontSize:10,color:T.muted,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{city.name} · {cls&&CLASSES.filter(function(c){return c.id===cls;})[0]&&CLASSES.filter(function(c){return c.id===cls;})[0].label}</div>
          </div>
        </div>
        {/* ── Панель действий: отдельная строка, чтобы три кнопки не сжимали заголовок ── */}
        {result&&<div style={{display:"flex",gap:6,marginBottom:8}}>
          {/* Смета в PDF — поведение НЕ изменилось */}
          <button onClick={function(){exportPDF(result,city.name);}} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"9px 6px",background:"linear-gradient(135deg,#C0392B,#A93226)",borderRadius:12,border:"none",cursor:"pointer",boxShadow:"0 3px 12px rgba(192,57,43,0.30)"}}>
            <span style={{fontFamily:FM,fontSize:9.5,color:"#fff",letterSpacing:0.3,whiteSpace:"nowrap"}}>📄 Смета</span>
          </button>
          {/* НОВОЕ: красная «Сохранить» — открывает сайт в новой вкладке */}
          <a href="https://m1-remont.ru" target="_blank" rel="noopener noreferrer" style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"9px 6px",background:"linear-gradient(135deg,#C0392B,#A93226)",borderRadius:12,textDecoration:"none",boxShadow:"0 3px 12px rgba(192,57,43,0.30)"}}>
            <span style={{fontFamily:FM,fontSize:9.5,color:"#fff",letterSpacing:0.3,whiteSpace:"nowrap"}}>💾 Сохранить</span>
          </a>
          {/* КНОПКА дизайн-проекта — открывает inline-модал */}
          <button onClick={function(){
            if(dpLoading)return;
            setDpLoading(true);
            setTimeout(function(){
              try{
                var clsObj=cls&&CLASSES.filter(function(c){return c.id===cls;})[0];
                var condObj=CONDS.filter(function(c){return c.id===(props.cond||"rough");})[0];
                var out=generateDesignProjectHTML({
                  rooms:rooms,
                  designCfg:cfg,
                  cityName:city.name,
                  className:clsObj?clsObj.label:"—",
                  cond:props.cond||"rough",
                  condLabel:condObj?condObj.label:"—",
                  result:result,
                  planImg:props.planImg||null,
                  planGeo:props.planGeo||null
                });
                if(out&&out.ok){
                  setDpHtml(out.html);
                } else {
                  alert("Ошибка генерации: "+(out&&out.error||"неизвестная"));
                }
              }catch(e){
                console.error(e);
                alert("Ошибка: "+e.message);
              }
              setDpLoading(false);
            },50);
          }} style={{flex:1.3,display:"flex",alignItems:"center",justifyContent:"center",gap:5,padding:"9px 6px",background:dpLoading?"#5A5550":"linear-gradient(135deg,"+T.gold+",#8A6234)",borderRadius:12,border:"none",cursor:dpLoading?"wait":"pointer",boxShadow:"0 3px 12px rgba(184,134,78,0.4)",transition:"background 0.2s"}}>
            <span style={{fontFamily:FM,fontSize:9.5,color:"#fff",letterSpacing:0.3,whiteSpace:"nowrap"}}>{dpLoading?"⏳ Генерация...":"📐 Дизайн-проект"}</span>
          </button>
        </div>}
        {result&&<PromoCardDesign/>}
      </div>
      <Scroll>
        {result&&<EstimateTable result={result} cityName={city.name}/>}
        {result&&<PromoCardFull/>}
      </Scroll>
      {/* Форма заявки теперь глобальна — рендерится в Phone, видна на всех экранах */}

      {/* ══ МОДАЛ ДИЗАЙН-ПРОЕКТА — в формате телефона ══ */}
      {dpHtml&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:9999,
                             display:"flex",flexDirection:"column",alignItems:"center",
                             justifyContent:"center",background:"rgba(0,0,0,0.88)"}}>
        {/* Шапка над телефоном */}
        <div style={{display:"flex",alignItems:"center",gap:8,width:"100%",maxWidth:430,
                     padding:"8px 12px",marginBottom:6}}>
          <div style={{fontFamily:FD,fontSize:14,fontWeight:600,color:T.gold,flex:1}}>
            📐 Дизайн-проект
          </div>
          <button onClick={function(){
            try{
              var blob=new Blob([dpHtml],{type:"text/html;charset=utf-8"});
              var url=URL.createObjectURL(blob);
              var a=document.createElement("a");
              a.href=url;a.download="design-project.html";
              document.body.appendChild(a);a.click();
              setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(url);},500);
            }catch(e){alert("Ошибка: "+e.message);}
          }} style={{padding:"5px 10px",background:"rgba(255,255,255,0.10)",border:"1px solid rgba(255,255,255,0.18)",borderRadius:8,cursor:"pointer",color:"#fff",fontFamily:FM,fontSize:9}}>
            ⬇️ HTML
          </button>
          <button onClick={function(){
            var fr=document.getElementById("dp-iframe");
            if(fr&&fr.contentWindow){fr.contentWindow.focus();fr.contentWindow.print();}
          }} style={{padding:"5px 10px",background:"linear-gradient(135deg,"+T.gold+",#8A6234)",border:"none",borderRadius:8,cursor:"pointer",color:"#fff",fontFamily:FM,fontSize:9}}>
            🖨️ PDF
          </button>
          <button onClick={function(){setDpHtml(null);}} style={{width:30,height:30,borderRadius:8,
            background:"rgba(255,255,255,0.10)",border:"1px solid rgba(255,255,255,0.18)",
            cursor:"pointer",color:"rgba(255,255,255,0.8)",fontSize:16,display:"flex",
            alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        {/* Телефонная рамка */}
        <div style={{width:"100%",maxWidth:430,height:"calc(100vh - 90px)",
                     background:"#1A1814",borderRadius:40,overflow:"hidden",
                     border:"6px solid #2A2420",
                     boxShadow:"0 0 0 2px #3A3028, 0 24px 60px rgba(0,0,0,0.7)"}}>
          {/* Нотч */}
          <div style={{height:28,background:"#141210",display:"flex",alignItems:"center",
                       justifyContent:"center",flexShrink:0}}>
            <div style={{width:80,height:8,background:"#2A2420",borderRadius:4}}/>
          </div>
          {/* iframe — прокручиваемый контент */}
          <iframe id="dp-iframe" srcDoc={dpHtml}
            style={{width:"100%",height:"calc(100% - 28px)",border:"none",background:"#fff",display:"block"}}
            title="Дизайн-проект"/>
        </div>
      </div>}
    </div>
  );
}



/* ══════════════════════════════════════════════════════════════
   DESIGN PROJECT GENERATOR — встроено напрямую (v11 merged)
   ══════════════════════════════════════════════════════════════ */

// fmt reuses the existing function from the main app
const escape = (s) => String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const today = () => new Date().toLocaleDateString("ru-RU");

/* Безопасный поиск в массиве опций по id (с фолбэком на пустой объект) */
function findOpt(options, id) {
  if (!Array.isArray(options)) return {};
  for (let i = 0; i < options.length; i++) if (options[i].id === id) return options[i];
  return {};
}

/* Тип помещения — детектится по названию (повторяет логику calcRoom) */
function roomKind(name) {
  const n = String(name || "").toLowerCase();
  if (/санузел|ванн|туалет/.test(n)) return "bath";
  if (/кухн.*гостин|гостин.*кухн/.test(n)) return "kitchenLiving";
  if (/кухн/.test(n)) return "kitchen";
  if (/гостин/.test(n)) return "living";
  if (/спальн/.test(n)) return "bedroom";
  if (/детск/.test(n)) return "child";
  if (/коридор|прихожая/.test(n)) return "hall";
  if (/балкон|лоджия|зимн/.test(n)) return "balcony";
  if (/кладов|гардероб/.test(n)) return "storage";
  if (/кабинет/.test(n)) return "office";
  return "room";
}

const KIND_LABEL = {
  bath: "Санузел", kitchen: "Кухня", living: "Гостиная",
  kitchenLiving: "Кухня-гостиная", bedroom: "Спальня", child: "Детская",
  hall: "Прихожая", balcony: "Лоджия", storage: "Кладовая",
  office: "Кабинет", room: "Помещение",
};

/* ── ГЕОМЕТРИЯ ───────────────────────────────────────────────────────────
   Один и тот же контур квартиры используется на всех листах планов.
   Алгоритм: bin-packing rectangles по площадям + общая толстая обводка.
   ─────────────────────────────────────────────────────────────────────── */

function packRooms(rooms, x, y, w, h, horizontal) {
  if (!rooms.length) return [];
  if (rooms.length === 1) {
    return [{ ...rooms[0], px: x, py: y, pw: w, ph: h }];
  }
  const total = rooms.reduce((s, r) => s + (parseFloat(r.area) || 10), 0);
  // Разбиваем массив на две группы примерно по сумме площадей
  let cum = 0, split = 0;
  for (let i = 0; i < rooms.length; i++) {
    cum += parseFloat(rooms[i].area) || 10;
    if (cum >= total / 2) { split = i + 1; break; }
  }
  if (!split || split >= rooms.length) split = 1;
  const g1 = rooms.slice(0, split);
  const g2 = rooms.slice(split);
  const ratio = g1.reduce((s, r) => s + (parseFloat(r.area) || 10), 0) / total;
  if (horizontal) {
    const sw = Math.round(w * ratio);
    return packRooms(g1, x, y, sw, h, false).concat(packRooms(g2, x + sw, y, w - sw, h, false));
  }
  const sh = Math.round(h * ratio);
  return packRooms(g1, x, y, w, sh, true).concat(packRooms(g2, x, y + sh, w, h - sh, true));
}

/* Возвращает геометрию для рендера: viewBox, padded rooms, общие размеры */
/* buildGeometryFromBounds — точное расположение комнат из AI bounds ── */
function buildGeometryFromBounds(rooms) {
  const PAD = 50;
  const PLAN_W = 740, PLAN_H = 500;
  // Находим общий bbox всех bounds, чтобы нормировать координаты
  let minX = 1, minY = 1, maxX = 0, maxY = 0;
  rooms.forEach((r) => {
    if (!r.bounds) return;
    const { x, y, w, h } = r.bounds;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x + w > maxX) maxX = x + w;
    if (y + h > maxY) maxY = y + h;
  });
  if (maxX <= minX) maxX = minX + 1;
  if (maxY <= minY) maxY = minY + 1;
  const rangeX = maxX - minX;
  const rangeY = maxY - minY;

  const packed = rooms.map((r) => {
    const b = r.bounds || { x: minX, y: minY, w: rangeX / rooms.length, h: rangeY };
    // Нормируем в диапазон PLAN_W × PLAN_H
    const nx = (b.x - minX) / rangeX;
    const ny = (b.y - minY) / rangeY;
    const nw = b.w / rangeX;
    const nh = b.h / rangeY;
    const px = PAD + nx * PLAN_W;
    const py = PAD + ny * PLAN_H;
    const pw = Math.max(36, nw * PLAN_W);
    const ph = Math.max(28, nh * PLAN_H);
    return {
      ...r,
      px, py, pw, ph,
      cx: px + pw / 2,
      cy: py + ph / 2,
      kind: roomKind(r.name),
    };
  });

  const w = PLAN_W + PAD * 2;
  const h = PLAN_H + PAD * 2;
  return { PAD, W: w, H: h, rooms: packed, fromBounds: true };
}

/* ── buildGeometryFromPolygon ────────────────────────────────────────────
   Режим ТОЧНОЙ ГЕОМЕТРИИ: использует полигон квартиры и сегменты стен
   из AI-ответа. Пропорции сохраняются 1:1 к оригинальному изображению.
   ──────────────────────────────────────────────────────────────────────── */
function buildGeometryFromPolygon(rooms, planGeo, imgAspect) {
  const PAD = 50;

  // Определяем bbox всего полигона квартиры
  const apt = (planGeo && planGeo.aptPoly) || [];
  let minX = 0, minY = 0, maxX = 1, maxY = 1;
  if (apt.length >= 3) {
    minX = Math.min(...apt.map(p => p.x));
    minY = Math.min(...apt.map(p => p.y));
    maxX = Math.max(...apt.map(p => p.x));
    maxY = Math.max(...apt.map(p => p.y));
  }
  const rangeX = Math.max(0.01, maxX - minX);
  const rangeY = Math.max(0.01, maxY - minY);

  // КРИТИЧЕСКИ ВАЖНО: соотношение сторон SVG = соотношению сторон bbox квартиры
  // Это гарантирует пропорции 1:1 без искажений
  const aspect = rangeX / rangeY;            // ширина/высота bbox на фото
  const PLAN_W = 740;
  const PLAN_H = Math.round(PLAN_W / aspect); // SVG высота = SVG_W / aspect

  // Нормировщик координат: нормализованные (0..1 всего фото) → SVG px
  const toSvgX = (nx) => PAD + ((nx - minX) / rangeX) * PLAN_W;
  const toSvgY = (ny) => PAD + ((ny - minY) / rangeY) * PLAN_H;

  // Полигон квартиры в SVG-координатах
  const aptSvgPoly = apt.map(p => ({ x: toSvgX(p.x), y: toSvgY(p.y) }));

  // Сегменты стен в SVG-координатах
  const wallSegs = ((planGeo && planGeo.wallSegs) || []).map(s => ({
    x1: toSvgX(s.x1), y1: toSvgY(s.y1),
    x2: toSvgX(s.x2), y2: toSvgY(s.y2),
  }));

  // Помещения: используем cx/cy для позиции метки
  // Для bbox каждой комнаты строим приблизительный прямоугольник
  // вокруг центра (пропорционально площади) — только для мебели и отделки
  const totalArea = rooms.reduce((s, r) => s + (parseFloat(r.area) || 0), 0);
  const svgTotalArea = PLAN_W * PLAN_H;

  const mappedRooms = rooms.map((r) => {
    const area = parseFloat(r.area) || 10;
    const ratio = area / (totalArea || 1);
    const approxArea = svgTotalArea * ratio;
    const halfW = Math.sqrt(approxArea * 1.4) / 2;
    const halfH = Math.sqrt(approxArea / 1.4) / 2;

    // Центр комнаты
    const svgCx = r.cx != null ? toSvgX(r.cx) : PAD + PLAN_W / 2;
    const svgCy = r.cy != null ? toSvgY(r.cy) : PAD + PLAN_H / 2;

    // Приближённый bbox для размещения мебели
    const px = Math.max(PAD, svgCx - halfW);
    const py = Math.max(PAD, svgCy - halfH);
    const pw = Math.min(halfW * 2, PAD + PLAN_W - px);
    const ph = Math.min(halfH * 2, PAD + PLAN_H - py);

    // Окна: сегменты → SVG
    const windows = (r.windows || []).map(w => ({
      ...w,
      sx1: w.x1 != null ? toSvgX(w.x1) : null,
      sy1: w.y1 != null ? toSvgY(w.y1) : null,
      sx2: w.x2 != null ? toSvgX(w.x2) : null,
      sy2: w.y2 != null ? toSvgY(w.y2) : null,
    }));

    // Двери: сегменты → SVG
    const doors = (r.doors || []).map(d => ({
      ...d,
      sx1: d.x1 != null ? toSvgX(d.x1) : null,
      sy1: d.y1 != null ? toSvgY(d.y1) : null,
      sx2: d.x2 != null ? toSvgX(d.x2) : null,
      sy2: d.y2 != null ? toSvgY(d.y2) : null,
    }));

    return {
      ...r,
      px, py, pw, ph,
      cx: svgCx, cy: svgCy,
      kind: roomKind(r.name),
      windows, doors,
    };
  });

  return {
    PAD,
    W: PLAN_W + PAD * 2,
    H: PLAN_H + PAD * 2,
    rooms: mappedRooms,
    aptSvgPoly,
    wallSegs,
    fromPolygon: true,
    toSvgX, toSvgY,
  };
}

/* buildGeometry — выбирает алгоритм в зависимости от наличия геометрии ── */
function buildGeometry(rooms, planGeo) {
  // Режим 1: есть полигон квартиры от AI → точная геометрия
  if (planGeo && planGeo.aptPoly && planGeo.aptPoly.length >= 3) {
    return buildGeometryFromPolygon(rooms, planGeo);
  }
  // Режим 2: есть bounds-прямоугольники → улучшенная геометрия
  const hasBounds = rooms.some((r) => r.bounds && typeof r.bounds.x === "number");
  if (hasBounds) return buildGeometryFromBounds(rooms);
  // Режим 3: только площади → bin-packing
  const PAD = 40;
  const PLAN_W = 760, PLAN_H = 520;
  const sorted = rooms.slice().sort((a, b) => (parseFloat(b.area) || 0) - (parseFloat(a.area) || 0));
  const packed = packRooms(sorted, 0, 0, PLAN_W, PLAN_H, true)
    .map((r) => ({
      ...r,
      px: r.px + PAD,
      py: r.py + PAD,
      cx: r.px + PAD + r.pw / 2,
      cy: r.py + PAD + r.ph / 2,
      kind: roomKind(r.name),
    }));
  return { PAD, W: PLAN_W + PAD * 2, H: PLAN_H + PAD * 2, rooms: packed };
}

/* ── ОБЩИЕ ЭЛЕМЕНТЫ ЧЕРТЕЖЕЙ ─────────────────────────────────────────── */

/* ── svgWalls ────────────────────────────────────────────────────────────
   Два режима:
   • POLYGON (fromPolygon=true) — рисует точный полигон квартиры из AI
     + все перегородки как отрезки → 1:1 к фото, никакой автокоррекции.
   • BOUNDS / PACK — прямоугольная аппроксимация (запасной вариант).
   ──────────────────────────────────────────────────────────────────────── */
function svgWalls(geo) {
  const TW  = 7;   // несущая стена
  const ITW = 2;   // внутренняя перегородка

  // ─── РЕЖИМ POLYGON ────────────────────────────────────────────────────
  if (geo.fromPolygon && geo.aptSvgPoly && geo.aptSvgPoly.length >= 3) {
    const poly = geo.aptSvgPoly;
    const polyPts = poly.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

    // ClipPath = полигон квартиры (внутри = белое пространство помещений)
    let s = `<defs>
      <pattern id="wall-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="5" stroke="#8A8580" stroke-width="1.6"/>
      </pattern>
      <clipPath id="apt-clip-outer">
        <polygon points="${polyPts}"/>
      </clipPath>
      <clipPath id="apt-clip-inner">
        <polygon points="${polyPts}" transform="scale(1,1)" />
      </clipPath>
    </defs>`;

    // 1. Штриховка внутри полигона (зона стен = полигон минус комнаты)
    //    Рисуем полигон штриховкой — поверх него белые «пузыри» комнат.
    s += `<polygon points="${polyPts}"
            fill="url(#wall-hatch)" stroke="#1A1814" stroke-width="${TW}"
            stroke-linejoin="miter" stroke-linecap="square"/>`;

    // 2. Белое пространство каждой комнаты (по приближённому bbox)
    //    — «прорубает» штриховку, создавая визуальные помещения
    geo.rooms.forEach(r => {
      s += `<rect x="${r.px.toFixed(1)}" y="${r.py.toFixed(1)}"
              width="${r.pw.toFixed(1)}" height="${r.ph.toFixed(1)}"
              fill="#FAFAF7" stroke="none"/>`;
    });

    // 3. Внутренние перегородки — точно из AI (без snap, без коррекции)
    (geo.wallSegs || []).forEach(seg => {
      s += `<line x1="${seg.x1.toFixed(1)}" y1="${seg.y1.toFixed(1)}"
              x2="${seg.x2.toFixed(1)}" y2="${seg.y2.toFixed(1)}"
              stroke="#1A1814" stroke-width="${ITW}" stroke-linecap="square"/>`;
    });

    // 4. Внешний контур поверх — жирная несущая стена
    s += `<polygon points="${polyPts}"
            fill="none" stroke="#1A1814" stroke-width="${TW}"
            stroke-linejoin="miter"/>`;

    return s;
  }

  // ─── РЕЖИМ BOUNDS / PACK (запасной) ──────────────────────────────────
  const rooms = geo.rooms;
  let clipRects = rooms.map(r =>
    `<rect x="${r.px - TW}" y="${r.py - TW}" width="${r.pw + TW*2}" height="${r.ph + TW*2}"/>`
  ).join("");
  let s = `<defs>
    <pattern id="wall-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="5" stroke="#8A8580" stroke-width="1.6"/>
    </pattern>
    <clipPath id="apt-clip">${clipRects}</clipPath>
  </defs>`;
  s += `<rect x="0" y="0" width="${geo.W}" height="${geo.H}"
          fill="url(#wall-hatch)" clip-path="url(#apt-clip)"/>`;
  rooms.forEach(room => {
    s += `<rect x="${room.px}" y="${room.py}" width="${room.pw}" height="${room.ph}"
            fill="#FAFAF7" stroke="#1A1814" stroke-width="${ITW}"/>`;
  });
  rooms.forEach(r => {
    const neighbors = rooms.filter(o => o !== r);
    const eps = 4;
    [{x1:r.px,y1:r.py,x2:r.px+r.pw,y2:r.py,dir:'top'},
     {x1:r.px,y1:r.py+r.ph,x2:r.px+r.pw,y2:r.py+r.ph,dir:'bottom'},
     {x1:r.px,y1:r.py,x2:r.px,y2:r.py+r.ph,dir:'left'},
     {x1:r.px+r.pw,y1:r.py,x2:r.px+r.pw,y2:r.py+r.ph,dir:'right'}
    ].forEach(w => {
      const shared = neighbors.some(o => {
        if(w.dir==='top')    return Math.abs(o.py+o.ph-r.py)<eps && o.px<r.px+r.pw && o.px+o.pw>r.px;
        if(w.dir==='bottom') return Math.abs(o.py-(r.py+r.ph))<eps && o.px<r.px+r.pw && o.px+o.pw>r.px;
        if(w.dir==='left')   return Math.abs(o.px+o.pw-r.px)<eps && o.py<r.py+r.ph && o.py+o.ph>r.py;
        if(w.dir==='right')  return Math.abs(o.px-(r.px+r.pw))<eps && o.py<r.py+r.ph && o.py+o.ph>r.py;
        return false;
      });
      const lw=shared?ITW:TW, sw=shared?"#5A5048":"#1A1814";
      s+=`<line x1="${w.x1}" y1="${w.y1}" x2="${w.x2}" y2="${w.y2}"
            stroke="${sw}" stroke-width="${lw}" stroke-linecap="square"/>`;
    });
  });
  return s;
}

/* svgWindows — символы окон ГОСТ. В polygon-режиме — точные координаты. */
function svgWindows(geo) {
  let s = "";
  geo.rooms.forEach((room) => {
    const wins = Array.isArray(room.windows) ? room.windows : [];

    // Polygon-режим: окна как сегменты с точными координатами
    if (geo.fromPolygon) {
      wins.forEach(win => {
        if (win.sx1 == null) return;
        const len = Math.hypot(win.sx2-win.sx1, win.sy2-win.sy1);
        if (len < 1) return;
        // Прорыв в стене (белая линия)
        s += `<line x1="${win.sx1.toFixed(1)}" y1="${win.sy1.toFixed(1)}"
                x2="${win.sx2.toFixed(1)}" y2="${win.sy2.toFixed(1)}"
                stroke="#FAFAF7" stroke-width="7"/>`;
        // Остекление (3 параллельных линии ГОСТ)
        const dx = (win.sx2-win.sx1)/len, dy = (win.sy2-win.sy1)/len;
        const nx = -dy*2.5, ny = dx*2.5; // нормаль
        [-1,0,1].forEach(t => {
          s += `<line x1="${(win.sx1+nx*t).toFixed(1)}" y1="${(win.sy1+ny*t).toFixed(1)}"
                  x2="${(win.sx2+nx*t).toFixed(1)}" y2="${(win.sy2+ny*t).toFixed(1)}"
                  stroke="#2A5080" stroke-width="${t===0?1.2:0.7}" opacity="0.8"/>`;
        });
      });
      return; // в polygon-режиме не добавляем дефолтные окна
    }

    if (!wins.length) {
      // Для жилых комнат без явных окон — ставим окно по умолчанию
      // на внешнюю стену (определяем по минимальному bbox)
      const kind = room.kind;
      if (kind==="bath"||kind==="hall"||kind==="storage"||kind==="balcony") return;
      // Берём верхнюю или левую стену как "внешнюю" по умолчанию
      wins.push({wall: room.py < (geo.H/2) ? "top" : "bottom", pos: 0.5});
    }
    wins.forEach((win) => {
      const WW = Math.min(36, room.pw * 0.35); // ширина окна
      let wx, wy, isH;
      if (win.wall === "top") {
        wx = room.px + (room.pw * (win.pos||0.5)) - WW/2;
        wy = room.py;
        isH = true;
        // Просвет в стене
        s += `<line x1="${wx}" y1="${wy}" x2="${wx+WW}" y2="${wy}" stroke="#FAFAF7" stroke-width="6"/>`;
        // 3 параллельные линии (стекло)
        [0.15,0.5,0.85].forEach(t =>
          s += `<line x1="${wx}" y1="${wy}" x2="${wx+WW}" y2="${wy}" stroke="#2A5080" stroke-width="1.2" opacity="${0.5+t*0.5}" transform="translate(0,${(t-0.5)*5})"/>`
        );
        s += `<rect x="${wx}" y="${wy-3}" width="${WW}" height="6" fill="#D0E4F0" opacity="0.6" stroke="#2A5080" stroke-width="0.7"/>`;
      } else if (win.wall === "bottom") {
        wx = room.px + (room.pw * (win.pos||0.5)) - WW/2;
        wy = room.py + room.ph;
        s += `<line x1="${wx}" y1="${wy}" x2="${wx+WW}" y2="${wy}" stroke="#FAFAF7" stroke-width="6"/>`;
        s += `<rect x="${wx}" y="${wy-3}" width="${WW}" height="6" fill="#D0E4F0" opacity="0.6" stroke="#2A5080" stroke-width="0.7"/>`;
      } else if (win.wall === "left") {
        const WH = Math.min(30, room.ph * 0.3);
        wy = room.py + (room.ph * (win.pos||0.5)) - WH/2;
        wx = room.px;
        s += `<line x1="${wx}" y1="${wy}" x2="${wx}" y2="${wy+WH}" stroke="#FAFAF7" stroke-width="6"/>`;
        s += `<rect x="${wx-3}" y="${wy}" width="6" height="${WH}" fill="#D0E4F0" opacity="0.6" stroke="#2A5080" stroke-width="0.7"/>`;
      } else if (win.wall === "right") {
        const WH = Math.min(30, room.ph * 0.3);
        wy = room.py + (room.ph * (win.pos||0.5)) - WH/2;
        wx = room.px + room.pw;
        s += `<line x1="${wx}" y1="${wy}" x2="${wx}" y2="${wy+WH}" stroke="#FAFAF7" stroke-width="6"/>`;
        s += `<rect x="${wx-3}" y="${wy}" width="6" height="${WH}" fill="#D0E4F0" opacity="0.6" stroke="#2A5080" stroke-width="0.7"/>`;
      }
    });
  });
  return s;
}

/* svgDoors — дверные проёмы. В polygon-режиме — точные координаты. */
function svgDoors(geo) {
  // ── Polygon-режим: двери из AI как сегменты с дугой открывания ──
  if (geo.fromPolygon) {
    let s = "";
    geo.rooms.forEach(room => {
      (room.doors || []).forEach(door => {
        if (door.sx1 == null) return;
        const len = Math.hypot(door.sx2-door.sx1, door.sy2-door.sy1);
        if (len < 1) return;
        // Прорыв в стене
        s += `<line x1="${door.sx1.toFixed(1)}" y1="${door.sy1.toFixed(1)}"
                x2="${door.sx2.toFixed(1)}" y2="${door.sy2.toFixed(1)}"
                stroke="#FAFAF7" stroke-width="6"/>`;
        // Дуга открывания от sx1 к sx2 радиусом = len
        const swing = door.swing === "out" ? 0 : 1;
        s += `<path d="M ${door.sx1.toFixed(1)} ${door.sy1.toFixed(1)} A ${len.toFixed(1)} ${len.toFixed(1)} 0 0 ${swing} ${door.sx2.toFixed(1)} ${door.sy2.toFixed(1)}"
                fill="rgba(200,215,240,0.25)" stroke="#2A3A6A" stroke-width="0.9"/>`;
        // Тонкая линия самой двери
        s += `<line x1="${door.sx1.toFixed(1)}" y1="${door.sy1.toFixed(1)}"
                x2="${door.sx2.toFixed(1)}" y2="${door.sy2.toFixed(1)}"
                stroke="#2A3A6A" stroke-width="1.2"/>`;
      });
    });
    return s;
  }
  // ── Bounds/Pack-режим: аппроксимация ──
  return geo.rooms.map((room) => {
    if (room.kind === "balcony" || room.kind === "storage") return "";
    const horiz = room.pw > room.ph;
    const DW = Math.min(28, horiz ? room.pw * 0.25 : room.ph * 0.25);
    if (horiz) {
      const dx = room.px + room.pw * 0.25, dy = room.py + room.ph;
      return `<line x1="${dx}" y1="${dy}" x2="${dx+DW}" y2="${dy}" stroke="#FAFAF7" stroke-width="5"/>
        <path d="M ${dx} ${dy} L ${dx} ${dy-DW} A ${DW} ${DW} 0 0 1 ${dx+DW} ${dy}"
              fill="rgba(200,210,230,0.3)" stroke="#2A3A6A" stroke-width="0.8"/>`;
    } else {
      const dx = room.px + room.pw, dy = room.py + room.ph * 0.25;
      return `<line x1="${dx}" y1="${dy}" x2="${dx}" y2="${dy+DW}" stroke="#FAFAF7" stroke-width="5"/>
        <path d="M ${dx} ${dy} L ${dx-DW} ${dy} A ${DW} ${DW} 0 0 1 ${dx} ${dy+DW}"
              fill="rgba(200,210,230,0.3)" stroke="#2A3A6A" stroke-width="0.8"/>`;
    }
  }).join("");
}

/* Подпись каждой комнаты — название + площадь */
function svgRoomLabels(geo, opts) {
  const showArea = opts && opts.showArea !== false;
  return geo.rooms.map((r) => `
    <g>
      <text x="${r.cx}" y="${r.cy - 8}" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="13" font-weight="600" fill="#1A1814">
        ${escape(r.name)}
      </text>
      ${showArea ? `<text x="${r.cx}" y="${r.cy + 8}" text-anchor="middle"
            font-family="Arial, sans-serif" font-size="11" fill="#5A554E">
        S = ${(parseFloat(r.area) || 0).toFixed(2)} м²
      </text>` : ""}
    </g>
  `).join("");
}

/* Размерные линии — внешние габариты квартиры (упрощённо, по bbox) */
function svgDimensions(geo) {
  // Линейные размеры по верхней и левой стороне (как на обмерном плане)
  const x1 = geo.PAD, x2 = geo.W - geo.PAD;
  const y1 = geo.PAD, y2 = geo.H - geo.PAD;
  // Условный пересчёт пикселей в мм (предположим, общая площадь -> диагональ)
  const totalArea = geo.rooms.reduce((s, r) => s + (parseFloat(r.area) || 0), 0);
  // Грубая оценка реальных габаритов из суммарной площади
  const realW = Math.round(Math.sqrt(totalArea * 1.4) * 1000);
  const realH = Math.round((totalArea / (realW / 1000)) * 1000);
  return `
    <g font-family="Arial, sans-serif" font-size="10" fill="#1A1814">
      <line x1="${x1}" y1="${y1 - 18}" x2="${x2}" y2="${y1 - 18}" stroke="#1A1814" stroke-width="0.5"/>
      <line x1="${x1}" y1="${y1 - 22}" x2="${x1}" y2="${y1 - 14}" stroke="#1A1814" stroke-width="0.5"/>
      <line x1="${x2}" y1="${y1 - 22}" x2="${x2}" y2="${y1 - 14}" stroke="#1A1814" stroke-width="0.5"/>
      <text x="${(x1 + x2) / 2}" y="${y1 - 22}" text-anchor="middle">${fmt(realW)}</text>

      <line x1="${x1 - 18}" y1="${y1}" x2="${x1 - 18}" y2="${y2}" stroke="#1A1814" stroke-width="0.5"/>
      <line x1="${x1 - 22}" y1="${y1}" x2="${x1 - 14}" y2="${y1}" stroke="#1A1814" stroke-width="0.5"/>
      <line x1="${x1 - 22}" y1="${y2}" x2="${x1 - 14}" y2="${y2}" stroke="#1A1814" stroke-width="0.5"/>
      <text x="${x1 - 26}" y="${(y1 + y2) / 2}" text-anchor="middle" transform="rotate(-90 ${x1 - 26} ${(y1 + y2) / 2})">${fmt(realH)}</text>
    </g>
  `;
}

/* ── РАССТАНОВКА МЕБЕЛИ ──────────────────────────────────────────────────
   Для каждого помещения возвращает массив элементов мебели c
   координатами относительно прямоугольника комнаты.
   Логика: мебель «прижимается» к подходящим стенам в зависимости от типа.
   ─────────────────────────────────────────────────────────────────────── */

function layoutFurniture(room, opts) {
  const { px, py, pw, ph, kind } = room;
  const items = [];
  const horizontalRoom = pw >= ph;

  const add = (type, label, x, y, w, h, fill) => {
    items.push({ type, label, x: px + x, y: py + y, w, h, fill: fill || "#E8E2D6" });
  };

  switch (kind) {
    case "bedroom":
    case "child": {
      // Кровать у длинной стены, противоположной двери (т.е. у верхней)
      const bw = horizontalRoom ? Math.min(pw * 0.45, 200) : Math.min(pw * 0.65, 200);
      const bh = horizontalRoom ? Math.min(ph * 0.65, 140) : Math.min(ph * 0.45, 140);
      const bx = (pw - bw) / 2;
      const by = 12;
      add("bed", "Кровать 200×160", bx, by, bw, bh, "#D8CBB6");
      // Тумбы по бокам
      add("nightstand", "", bx - 24, by + 6, 22, 22, "#C8B89E");
      add("nightstand", "", bx + bw + 2, by + 6, 22, 22, "#C8B89E");
      // Шкаф у стены с дверью (нижняя)
      const wbW = Math.min(pw - 40, 220);
      add("wardrobe", "Шкаф", (pw - wbW) / 2, ph - 38, wbW, 28, "#B8A88A");
      // Туалетный столик
      if (pw > 200) add("dresser", "Стол", 8, ph * 0.45, 60, 30, "#C8B89E");
      break;
    }
    case "living": {
      // Диван у длинной стены, ТВ напротив
      const sofaW = horizontalRoom ? pw * 0.55 : ph * 0.55;
      const sofaH = 35;
      if (horizontalRoom) {
        add("sofa", "Диван", (pw - sofaW) / 2, ph - sofaH - 12, sofaW, sofaH, "#C8B8A8");
        add("tv", "ТВ", (pw - 80) / 2, 8, 80, 14, "#1A1814");
        add("coffee", "Столик", (pw - 60) / 2, ph * 0.5 - 18, 60, 36, "#A89878");
      } else {
        add("sofa", "Диван", pw - sofaH - 12, (ph - sofaW) / 2, sofaH, sofaW, "#C8B8A8");
        add("tv", "ТВ", 8, (ph - 80) / 2, 14, 80, "#1A1814");
      }
      break;
    }
    case "kitchen":
    case "kitchenLiving": {
      // Кухонный гарнитур по самой длинной стене (низ),
      // плюс холодильник в углу. В случае «кухни-гостиной» — диван и стол.
      const gW = pw - 24;
      add("kitchen", "Гарнитур", 12, 12, gW, 32, "#D8CFC2");
      add("fridge", "Хол.", 12, 12, 36, 32, "#A8A39A");
      add("stove", "Плита", 12 + gW * 0.45, 12, 60, 32, "#1A1814");
      add("sink", "Мойка", 12 + gW * 0.7, 12, 50, 32, "#9CA0A6");
      if (kind === "kitchenLiving") {
        // Обеденный стол по центру
        const tw = Math.min(80, pw * 0.25);
        add("table", "Стол", (pw - tw) / 2, ph * 0.4, tw, tw, "#C8B89E");
        // Диван в дальней части
        add("sofa", "Диван", (pw - pw * 0.4) / 2, ph - 45, pw * 0.4, 30, "#C8B8A8");
        add("tv", "ТВ", (pw - 70) / 2, 56, 70, 12, "#1A1814");
      } else {
        const tw = Math.min(70, pw * 0.4);
        add("table", "Стол", (pw - tw) / 2, (ph - tw) / 2 + 12, tw, tw, "#C8B89E");
      }
      break;
    }
    case "bath": {
      // Ванна/душ — у дальней стены; унитаз — рядом с инсталляцией; раковина — у входа
      const cfg = opts && opts.bathroomCfg || {};
      const isBath = (cfg.bathing || "bath") === "bath";
      if (isBath) {
        add("bath", "Ванна", 8, 8, Math.min(pw - 16, 110), 52, "#E8E8EC");
      } else {
        add("shower", "Душ", 8, 8, 60, 60, "#D8DCE2");
      }
      add("toilet", "Унитаз", pw - 38, 8, 30, 42, "#F2F2F2");
      add("sink", "Раковина", pw - 70, ph - 36, 56, 28, "#F2F2F2");
      if (cfg.washingMachine) add("washer", "СМ", 8, ph - 50, 50, 42, "#D0D0D0");
      break;
    }
    case "hall": {
      // Шкаф у самой длинной глухой стены
      if (horizontalRoom) {
        add("wardrobe", "Шкаф", 12, 8, pw - 24, 28, "#B8A88A");
        add("bench", "Банкетка", (pw - 50) / 2, ph - 24, 50, 16, "#C8B89E");
      } else {
        add("wardrobe", "Шкаф", 8, 12, 28, ph - 24, "#B8A88A");
        add("bench", "Банкетка", pw - 24, (ph - 50) / 2, 16, 50, "#C8B89E");
      }
      break;
    }
    case "balcony": {
      // Кресло + столик
      add("chair", "Кресло", 12, ph - 32, 32, 22, "#C8B89E");
      add("table", "", 50, ph - 28, 18, 18, "#A89878");
      break;
    }
    case "office": {
      add("desk", "Стол", 8, 8, pw - 16, 26, "#C8B89E");
      add("chair", "", (pw - 22) / 2, 36, 22, 22, "#7A756C");
      add("wardrobe", "Шкаф", pw - 26, ph - 60, 18, 50, "#B8A88A");
      break;
    }
    case "storage": {
      add("wardrobe", "Стеллаж", 6, 6, pw - 12, ph - 12, "#B8A88A");
      break;
    }
    default: {
      // Универсальный заполнитель — пустая комната
      break;
    }
  }
  return items;
}

function svgFurniture(geo, designCfg) {
  let s = "";
  geo.rooms.forEach((room) => {
    const rc = (designCfg && designCfg[room.id]) || {};
    const items = layoutFurniture(room, { bathroomCfg: rc.bathroomCfg });
    items.forEach((it) => {
      s += `<rect x="${it.x}" y="${it.y}" width="${it.w}" height="${it.h}"
              fill="${it.fill}" stroke="#5A554E" stroke-width="0.6" rx="2"/>`;
      if (it.label && it.w > 28 && it.h > 14) {
        s += `<text x="${it.x + it.w / 2}" y="${it.y + it.h / 2 + 3}"
              text-anchor="middle" font-family="Arial" font-size="8" fill="#3A352E">
              ${escape(it.label)}</text>`;
      }
    });
  });
  return s;
}

/* ── ОБЁРТКА ЛИСТА (рамка/штамп OTDL-стиля) ──────────────────────────── */

function sheetWrap(opts) {
  const { sheetNo, totalSheets, title, content, scale = "1:50", projectName = "ПОЛНЫЙ ДИЗАЙН-ПРОЕКТ КВАРТИРЫ", extraCss = "" } = opts;
  return `
    <section class="sheet">
      ${extraCss ? `<style>${extraCss}</style>` : ""}
      <div class="sheet-content">
        <div class="sheet-title">${escape(title)}</div>
        ${content}
      </div>
      <div class="sheet-stamp">
        <div class="stamp-row"><div class="stamp-cell stamp-label">Заказчик</div><div class="stamp-cell stamp-val"></div><div class="stamp-cell stamp-label" rowspan="2">${escape(projectName)}</div><div class="stamp-cell stamp-meta">Масштаб</div><div class="stamp-cell stamp-meta">Стадия</div><div class="stamp-cell stamp-meta">Лист</div><div class="stamp-cell stamp-meta">Листов</div></div>
        <div class="stamp-row"><div class="stamp-cell stamp-label">Дизайнер</div><div class="stamp-cell stamp-val"></div><div class="stamp-cell stamp-sub">${escape(title)}</div><div class="stamp-cell stamp-meta-v">${escape(scale)}</div><div class="stamp-cell stamp-meta-v">РП</div><div class="stamp-cell stamp-meta-v">${sheetNo}</div><div class="stamp-cell stamp-meta-v">${totalSheets}</div></div>
        <div class="stamp-brand">М-Ремонт</div>
      </div>
    </section>
  `;
}

/* ── ЛИСТЫ ─────────────────────────────────────────────────────────────── */

/* Титульный лист */
function renderCover(ctx) {
  return `
    <section class="sheet sheet-cover">
      <div class="cover-inner">
        <div class="cover-brand">М-Ремонт</div>
        <div class="cover-title">ДИЗАЙН-ПРОЕКТ<br/>КВАРТИРЫ</div>
        <div class="cover-meta">
          <div><span>Город:</span> ${escape(ctx.cityName || "—")}</div>
          <div><span>Класс ремонта:</span> ${escape(ctx.className || "—")}</div>
          <div><span>Площадь:</span> ${(ctx.totalArea || 0).toFixed(2)} м²</div>
          <div><span>Помещений:</span> ${ctx.rooms.length}</div>
          <div><span>Дата:</span> ${today()}</div>
        </div>
        <!-- Крупная CTA-кнопка на титульном листе -->
        <a href="https://m1-remont.ru" target="_blank" rel="noopener noreferrer" class="cover-cta">
          <div class="cover-cta-title">🎁 Дизайн-проект — бесплатно!</div>
          <div class="cover-cta-text">
            Этот предварительный проект сформирован автоматически и может быть
            неполным или неточным по техническим причинам.<br/><br/>
            <b>При заказе ремонта мы разработаем для вас ПОЛНЫЙ дизайн-проект совершенно бесплатно:</b>
            точные чертежи, 3D-визуализации в скандинавском стиле, подбор материалов и мебели,
            расстановку с учётом эргономики.<br/><br/>
            Оставьте заявку — и наш дизайнер свяжется с вами.
          </div>
          <div class="cover-cta-btn">Получить дизайн-проект бесплатно →</div>
        </a>
        <div class="cover-foot">Документ сформирован автоматически. Перед началом работ согласуйте все размеры по месту.</div>
      </div>
    </section>
  `;
}

/* Лист «Оглавление» — собирается из реально сгенерированных листов */
function renderTOC(ctx) {
  const items = ctx.toc;
  // Делим на две колонки для читаемости (как в OTDL)
  const mid = Math.ceil(items.length / 2);
  const col1 = items.slice(0, mid);
  const col2 = items.slice(mid);
  const colHtml = (arr) => `
    <table class="toc-table">
      <thead><tr><th>Наименование</th><th>Лист</th></tr></thead>
      <tbody>
        ${arr.map((t) => `<tr><td>${escape(t.title.toUpperCase())}</td><td>${String(t.sheetNo).padStart(2, "0")}</td></tr>`).join("")}
      </tbody>
    </table>
  `;
  const content = `
    <div class="toc-grid">
      <div>${colHtml(col1)}</div>
      <div>${colHtml(col2)}</div>
    </div>
  `;
  return sheetWrap({ sheetNo: 1, totalSheets: ctx.totalSheets, title: "СОСТАВ ПРОЕКТА", content, scale: "—" });
}

/* ── ТЕКСТУРЫ ПОЛОВ ─────────────────────────────────────────────────────
   buildFloorPatterns — SVG defs + fill-функция для каждого типа покрытия
   ─────────────────────────────────────────────────────────────────────── */
function buildFloorPatterns(geo, designCfg) {
  const defs = [];
  const patternMap = {};

  (geo.rooms || []).forEach((room) => {
    const rc = (designCfg || {})[room.id] || {};
    const floor  = rc.floors || {};
    const floorId = floor.id || "quartz_vinyl";
    const color   = floor.color || "#D4C4B0";
    const pid = ("fp_" + String(room.id) + "_" + floorId).replace(/[^a-z0-9_]/gi, "_");
    patternMap[room.id] = { pid, color };
    const lineC = "rgba(0,0,0,0.18)";

    if (floorId === "laminate") {
      defs.push(`<pattern id="${pid}" width="60" height="14" patternUnits="userSpaceOnUse">
        <rect width="60" height="14" fill="${color}"/>
        <line x1="0" y1="0"  x2="60" y2="0"  stroke="${lineC}" stroke-width="0.7"/>
        <line x1="0" y1="14" x2="60" y2="14" stroke="${lineC}" stroke-width="0.7"/>
        <line x1="30" y1="0" x2="30" y2="14" stroke="${lineC}" stroke-width="0.4"/>
      </pattern>`);
    } else if (floorId === "parquet") {
      defs.push(`<pattern id="${pid}" width="28" height="28" patternUnits="userSpaceOnUse">
        <rect width="28" height="28" fill="${color}"/>
        <rect x="1" y="1" width="12" height="6" fill="${color}" stroke="${lineC}" stroke-width="0.5"/>
        <rect x="15" y="8" width="12" height="6" fill="${color}" stroke="${lineC}" stroke-width="0.5"/>
        <rect x="1" y="15" width="12" height="6" fill="${color}" stroke="${lineC}" stroke-width="0.5"/>
        <rect x="15" y="22" width="12" height="6" fill="${color}" stroke="${lineC}" stroke-width="0.5"/>
      </pattern>`);
    } else if (floorId === "tile" || floorId === "tile_floor") {
      defs.push(`<pattern id="${pid}" width="20" height="20" patternUnits="userSpaceOnUse">
        <rect width="20" height="20" fill="${color}"/>
        <rect x="0.5" y="0.5" width="19" height="19" fill="${color}" stroke="${lineC}" stroke-width="1"/>
      </pattern>`);
    } else if (floorId === "polished") {
      defs.push(`<linearGradient id="${pid}_g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stop-color="white" stop-opacity="0.35"/>
        <stop offset="50%"  stop-color="white" stop-opacity="0"/>
        <stop offset="100%" stop-color="white" stop-opacity="0.2"/>
      </linearGradient>
      <pattern id="${pid}" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect width="40" height="40" fill="${color}"/>
        <rect width="40" height="40" fill="url(#${pid}_g)"/>
      </pattern>`);
    } else if (floorId === "carpet") {
      defs.push(`<pattern id="${pid}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
        <rect width="6" height="6" fill="${color}"/>
        <line x1="0" y1="3" x2="6" y2="3" stroke="${lineC}" stroke-width="0.5"/>
        <line x1="3" y1="0" x2="3" y2="6" stroke="${lineC}" stroke-width="0.5"/>
      </pattern>`);
    } else {
      // quartz_vinyl / default — прямоугольные плашки
      defs.push(`<pattern id="${pid}" width="40" height="20" patternUnits="userSpaceOnUse">
        <rect width="40" height="20" fill="${color}"/>
        <line x1="0"  y1="0"  x2="40" y2="0"  stroke="${lineC}" stroke-width="0.5"/>
        <line x1="0"  y1="20" x2="40" y2="20" stroke="${lineC}" stroke-width="0.5"/>
        <line x1="20" y1="0"  x2="20" y2="20" stroke="${lineC}" stroke-width="0.4"/>
      </pattern>`);
    }
  });

  return {
    defs: defs.join(""),
    fill: (roomId) => {
      const info = patternMap[roomId];
      return info ? ("url(#" + info.pid + ")") : "#D4C4B0";
    },
  };
}

/* ── ПЛАН: ОБМЕРНЫЙ ──────────────────────────────────────────────────── */
function renderMeasurementPlan(ctx, sheetNo) {
  const geo = ctx.geometry;
  // Если есть оригинальный план — показываем его полупрозрачным под чертежом
  // Подложка оригинального фото: показываем с opacity 0.20
  // preserveAspectRatio="none" чтобы фото тянулось точно в bbox SVG
  const bgImg = ctx.planImg
    ? `<image href="${escape(ctx.planImg)}" x="0" y="0" width="${geo.W}" height="${geo.H}" opacity="0.18" preserveAspectRatio="xMidYMid meet"/>`
    : "";
  // Метка соответствия
  const matchBadge = (ctx.planImg && geo.fromPolygon)
    ? `<rect x="${geo.W-130}" y="4" width="126" height="18" rx="4" fill="#1A4A1A" opacity="0.85"/>
       <text x="${geo.W-67}" y="16" text-anchor="middle" font-family="Arial" font-size="9" fill="#90E890">✓ геометрия из фото</text>`
    : "";
  // Размерные аннотации внутри каждой комнаты
  const dimLabels = geo.rooms.map(r => {
    const totalArea = ctx.rooms.reduce((s,rm)=>s+(parseFloat(rm.area)||0),0);
    const scaleW = Math.sqrt(totalArea / (geo.W / geo.H));
    const realW = (r.pw / (geo.W - geo.PAD*2) * Math.sqrt(totalArea * 1.4)).toFixed(2);
    const realH = (r.ph / (geo.H - geo.PAD*2) * Math.sqrt(totalArea / 1.4)).toFixed(2);
    if (r.pw < 60 || r.ph < 40) return "";
    return `
      <text x="${r.cx}" y="${r.cy+22}" text-anchor="middle"
            font-family="Arial,sans-serif" font-size="8.5" fill="#4A4540" font-style="italic">
        ${realW} × ${realH} м
      </text>`;
  }).join("");
  const content = `
    <div class="plan-with-side">
      <svg class="plan-svg" viewBox="0 0 ${geo.W} ${geo.H}">
        ${bgImg}
        ${svgWalls(geo)}
        ${svgWindows(geo)}
        ${svgDoors(geo)}
        ${svgDimensions(geo)}
        ${svgRoomLabels(geo, { showArea: true })}
        ${dimLabels}
        ${matchBadge}
      </svg>
      <div class="plan-side">
        <div class="legend-title">Экспликация помещений</div>
        <table class="exp-table">
          <thead><tr><th>№</th><th>Наименование</th><th>S, м²</th></tr></thead>
          <tbody>
            ${ctx.rooms.map((r, i) => `<tr><td>${i + 1}</td><td>${escape(r.name)}</td><td>${(parseFloat(r.area) || 0).toFixed(2)}</td></tr>`).join("")}
            <tr class="exp-total"><td colspan="2">Итого</td><td>${ctx.totalArea.toFixed(2)}</td></tr>
          </tbody>
        </table>
        <div class="legend-notes">
          <b>Примечания:</b>
          <ol>
            <li>Размеры даны с округлением до 5 мм.</li>
            <li>Перед началом работ выполнить контрольный замер по месту.</li>
            <li>За отметку ±0.000 принят уровень чистого пола.</li>
          </ol>
        </div>
      </div>
    </div>
  `;
  return sheetWrap({ sheetNo, totalSheets: ctx.totalSheets, title: "ОБМЕРНЫЙ ПЛАН", content });
}

/* ── ПЛАН: ПЛАНИРОВОЧНОЕ РЕШЕНИЕ ─────────────────────────────────────── */
function renderFurniturePlan(ctx, sheetNo) {
  const geo = ctx.geometry;
  const fp = buildFloorPatterns(geo, ctx.designCfg);
  const floorFills = geo.rooms.map(r =>
    `<rect x="${r.px}" y="${r.py}" width="${r.pw}" height="${r.ph}" fill="${fp.fill(r.id)}" opacity="0.7"/>`
  ).join("");
  const content = `
    <div class="plan-with-side">
      <svg class="plan-svg" viewBox="0 0 ${geo.W} ${geo.H}">
        <defs>${fp.defs}</defs>
        ${svgWalls(geo)}
        ${floorFills}
        ${svgWindows(geo)}
        ${svgDoors(geo)}
        ${svgFurniture(geo, ctx.designCfg)}
        ${svgRoomLabels(geo, { showArea: false })}
      </svg>
      <div class="plan-side">
        <div class="legend-title">Условные обозначения</div>
        <table class="legend-list">
          <tr><td><span class="lg-swatch" style="background:#D8CBB6"></span></td><td>Кровать / спальное место</td></tr>
          <tr><td><span class="lg-swatch" style="background:#C8B8A8"></span></td><td>Мягкая мебель (диван, кресло)</td></tr>
          <tr><td><span class="lg-swatch" style="background:#D8CFC2"></span></td><td>Кухонный гарнитур</td></tr>
          <tr><td><span class="lg-swatch" style="background:#B8A88A"></span></td><td>Корпусная мебель (шкафы)</td></tr>
          <tr><td><span class="lg-swatch" style="background:#E8E8EC"></span></td><td>Сантехника</td></tr>
        </table>
        <div class="legend-notes" style="margin-top:14px">
          <b>Расстановка мебели</b> сформирована автоматически
          с учётом эргономических принципов и характеристик
          каждого помещения. Финальная расстановка согласовывается
          с дизайнером.
        </div>
      </div>
    </div>
  `;
  return sheetWrap({ sheetNo, totalSheets: ctx.totalSheets, title: "ПЛАНИРОВОЧНОЕ РЕШЕНИЕ С РАССТАНОВКОЙ МЕБЕЛИ", content });
}

/* ── ПЛАН: ДЕМОНТАЖ ──────────────────────────────────────────────────── */
function renderDemoPlan(ctx, sheetNo) {
  const geo = ctx.geometry;
  // Помечаем красным «зоны демонтажа» в зависимости от cond
  const showDemo = ctx.cond === "old" || ctx.cond === "bare";
  const content = `
    <div class="plan-with-side">
      <svg class="plan-svg" viewBox="0 0 ${geo.W} ${geo.H}">
        ${svgWalls(geo)}
        ${svgWindows(geo)}
        ${svgDoors(geo)}
        ${showDemo ? geo.rooms.map((r) => `
          <line x1="${r.px}" y1="${r.py + r.ph / 2}" x2="${r.px + r.pw}" y2="${r.py + r.ph / 2}"
                stroke="#D02828" stroke-width="2" stroke-dasharray="5 3" opacity="0.6"/>
        `).join("") : ""}
        ${svgRoomLabels(geo, { showArea: false })}
      </svg>
      <div class="plan-side">
        <div class="legend-title">Условные обозначения</div>
        <table class="legend-list">
          <tr><td><span class="lg-line lg-solid"></span></td><td>Существующие стены (сохраняются)</td></tr>
          <tr><td><span class="lg-line lg-dashed-red"></span></td><td>Демонтируемые элементы</td></tr>
        </table>
        <div class="legend-notes">
          <b>Состояние объекта:</b> ${escape(ctx.condLabel)}.<br/>
          ${showDemo
      ? "Требуется демонтаж существующих покрытий и/или перегородок. Все демонтажные работы вести с защитой пыли."
      : "Демонтаж не требуется. Поверхности готовы к чистовой отделке."}
        </div>
      </div>
    </div>
  `;
  return sheetWrap({ sheetNo, totalSheets: ctx.totalSheets, title: "ПЛАН ДЕМОНТАЖА КОНСТРУКЦИЙ", content });
}

/* ── ПЛАН: МОНТАЖ ────────────────────────────────────────────────────── */
function renderMountPlan(ctx, sheetNo) {
  const geo = ctx.geometry;
  const content = `
    <div class="plan-with-side">
      <svg class="plan-svg" viewBox="0 0 ${geo.W} ${geo.H}">
        ${svgWalls(geo)}
        ${svgWindows(geo)}
        ${svgDoors(geo)}
        ${svgRoomLabels(geo, { showArea: true })}
      </svg>
      <div class="plan-side">
        <div class="legend-title">Условные обозначения</div>
        <table class="legend-list">
          <tr><td><span class="lg-line lg-solid"></span></td><td>Существующие конструкции</td></tr>
          <tr><td><span class="lg-line lg-green"></span></td><td>Возводимые перегородки 80–100 мм</td></tr>
        </table>
        <div class="legend-notes">
          <b>Комментарии:</b>
          <ol>
            <li>Размеры даны чистовые (с учётом штукатурного слоя).</li>
            <li>Внутренние углы выдержать строго 90°.</li>
            <li>Перед заказом дверей сделать контрольные замеры.</li>
          </ol>
        </div>
      </div>
    </div>
  `;
  return sheetWrap({ sheetNo, totalSheets: ctx.totalSheets, title: "ПЛАН МОНТАЖА КОНСТРУКЦИЙ", content });
}

/* ── ПЛАН: РОЗЕТКИ И ЭЛЕКТРОВЫВОДЫ ───────────────────────────────────── */
function renderElectricPlan(ctx, sheetNo) {
  const geo = ctx.geometry;
  // Считаем количество розеток для легенды на основе типа комнаты
  let socketCnt = 0, switchCnt = 0;
  let elecMarkers = "";
  geo.rooms.forEach((r) => {
    const cnt = { bath: 3, kitchen: 8, kitchenLiving: 12, living: 6, bedroom: 6, child: 5, hall: 3, balcony: 1, storage: 1, office: 5, room: 4 }[r.kind] || 4;
    socketCnt += cnt;
    switchCnt += r.kind === "bath" ? 1 : 2;
    // Расставляем точки розеток в углах комнаты
    for (let i = 0; i < cnt; i++) {
      const angle = (i / cnt) * 2 * Math.PI;
      const radius = Math.min(r.pw, r.ph) / 2 - 12;
      const x = r.cx + Math.cos(angle) * radius;
      const y = r.cy + Math.sin(angle) * radius;
      elecMarkers += `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="#F0B040" stroke="#1A1814" stroke-width="0.5"/>`;
    }
  });
  const content = `
    <div class="plan-with-side">
      <svg class="plan-svg" viewBox="0 0 ${geo.W} ${geo.H}">
        ${svgWalls(geo)}
        ${svgDoors(geo)}
        ${elecMarkers}
        ${svgRoomLabels(geo, { showArea: false })}
      </svg>
      <div class="plan-side">
        <div class="legend-title">Условные обозначения</div>
        <table class="legend-list">
          <tr><td><span class="lg-swatch" style="background:#F0B040"></span></td><td>Розетка 220В</td></tr>
          <tr><td><span class="lg-swatch" style="background:#5A8AC8"></span></td><td>Слаботочная (TV, RJ45)</td></tr>
          <tr><td><span class="lg-swatch" style="background:#4A8A4A"></span></td><td>Выключатель</td></tr>
        </table>
        <div class="legend-notes">
          <b>Спецификация:</b><br/>
          Розеток 220В — ${socketCnt} шт.<br/>
          Выключателей — ${switchCnt} шт.<br/>
          Все размеры от уровня чистого пола.<br/>
          Высота розеток: 300 мм (если не указано иное).
        </div>
      </div>
    </div>
  `;
  return sheetWrap({ sheetNo, totalSheets: ctx.totalSheets, title: "ПЛАН РАСПОЛОЖЕНИЯ РОЗЕТОК И ЭЛЕКТРОВЫВОДОВ", content });
}

/* ── ПЛАН: ОСВЕЩЕНИЕ ─────────────────────────────────────────────────── */
function renderLightingPlan(ctx, sheetNo) {
  const geo = ctx.geometry;
  const cfg = ctx.designCfg || {};
  let lightMarkers = "";
  let spotCnt = 0, chandCnt = 0, trackCnt = 0, ledCnt = 0;

  geo.rooms.forEach((r) => {
    const rc = cfg[r.id] || {};
    const ltItems = (rc.lighting && rc.lighting.items) || [];
    const hasSpots    = ltItems.includes("spots")    || ltItems.includes("track");
    const hasChand    = ltItems.includes("chandelier") || ltItems.includes("pendant");
    const hasLed      = ltItems.includes("led_strip");

    // Если выбраны споты — рисуем сетку спотов
    if (hasSpots || r.pw > 100) {
      const margin = 22;
      const cols = Math.max(2, Math.round(r.pw / 75));
      const rows = Math.max(2, Math.round(r.ph / 75));
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = r.px + margin + (r.pw - margin*2) * (cols>1 ? i/(cols-1) : 0.5);
          const y = r.py + margin + (r.ph - margin*2) * (rows>1 ? j/(rows-1) : 0.5);
          lightMarkers += `<circle cx="${x}" cy="${y}" r="3.5" fill="#FFEEA0" stroke="#B8864E" stroke-width="0.8"/>`;
          lightMarkers += `<line x1="${x-3}" y1="${y}" x2="${x+3}" y2="${y}" stroke="#B8864E" stroke-width="0.5"/>`;
          lightMarkers += `<line x1="${x}" y1="${y-3}" x2="${x}" y2="${y+3}" stroke="#B8864E" stroke-width="0.5"/>`;
          spotCnt++;
        }
      }
    }

    // Центральная люстра/подвес
    if (hasChand || !hasSpots) {
      lightMarkers += `<circle cx="${r.cx}" cy="${r.cy}" r="7" fill="#FFF6CC" stroke="#B8864E" stroke-width="1.2"/>`;
      lightMarkers += `<circle cx="${r.cx}" cy="${r.cy}" r="3" fill="#FFD700" stroke="#8A6234" stroke-width="0.8"/>`;
      lightMarkers += `<text x="${r.cx}" y="${r.cy+3}" text-anchor="middle" font-size="7" font-family="Arial" fill="#8A6234">☀</text>`;
      chandCnt++;
    }

    // LED-лента по периметру
    if (hasLed) {
      const pad = 6;
      lightMarkers += `<rect x="${r.px+pad}" y="${r.py+pad}" width="${r.pw-pad*2}" height="${r.ph-pad*2}"
                          fill="none" stroke="#FFD700" stroke-width="1.5" stroke-dasharray="4 2" opacity="0.7"/>`;
      ledCnt++;
    }
  });
  const content = `
    <div class="plan-with-side">
      <svg class="plan-svg" viewBox="0 0 ${geo.W} ${geo.H}">
        ${svgWalls(geo)}
        ${svgDoors(geo)}
        ${lightMarkers}
        ${svgRoomLabels(geo, { showArea: false })}
      </svg>
      <div class="plan-side">
        <div class="legend-title">Условные обозначения</div>
        <table class="legend-list">
          <tr><td><span class="lg-light"></span></td><td>Центральный светильник</td></tr>
          <tr><td><span class="lg-spot"></span></td><td>Точечный встр. светильник</td></tr>
        </table>
        <div class="legend-notes">
          <b>Спецификация:</b><br/>
          Центральных светильников: ${chandCnt}<br/>
          Точечных спотов: ${spotCnt}<br/>
          В санузле — IP44, цветовая температура 3000–4000 К.
        </div>
      </div>
    </div>
  `;
  return sheetWrap({ sheetNo, totalSheets: ctx.totalSheets, title: "ПЛАН РАСПОЛОЖЕНИЯ ОСВЕЩЕНИЯ", content });
}

/* ── ПЛАН: САНТЕХНИКА ────────────────────────────────────────────────── */
function renderPlumbingPlan(ctx, sheetNo) {
  const geo = ctx.geometry;
  let markers = "";

  // ── Автоопределение стояка: санузел + кухня максимально близко к углу ──
  // Стояк обычно находится в углу мокрых зон, ближайшем к наружной стене.
  const wetRooms = geo.rooms.filter(r => r.kind==="bath"||r.kind==="kitchen"||r.kind==="kitchenLiving");
  // Ищем угол с наибольшей концентрацией мокрых зон (левый/правый верхний угол)
  let stoyakX = geo.PAD + 40, stoyakY = geo.PAD + 40; // default top-left
  if (wetRooms.length > 0) {
    const wr = wetRooms[0];
    // Стояк у ближайшего к центру угла мокрой зоны
    stoyakX = wr.px + (wr.cx > geo.W/2 ? wr.pw - 20 : 20);
    stoyakY = wr.py + (wr.cy > geo.H/2 ? wr.ph - 20 : 20);
  }
  // Рисуем стояк
  markers += `<circle cx="${stoyakX}" cy="${stoyakY}" r="8" fill="#1A1814" stroke="#B8864E" stroke-width="1.5"/>`;
  markers += `<text x="${stoyakX}" y="${stoyakY+3}" text-anchor="middle" font-size="7" fill="#B8864E" font-weight="700">С</text>`;
  markers += `<text x="${stoyakX}" y="${stoyakY+16}" text-anchor="middle" font-size="7" fill="#1A1814">Стояк</text>`;

  geo.rooms.forEach((r) => {
    if (r.kind !== "bath" && r.kind !== "kitchen" && r.kind !== "kitchenLiving") return;
    const rc = (ctx.designCfg || {})[r.id] || {};
    const bc = rc.bathroomCfg || {};

    // Точки подключения размещаем у стены, ближайшей к стояку
    const nearLeft = (stoyakX - r.px) < (r.px + r.pw - stoyakX);
    const startX = nearLeft ? r.px + 10 : r.px + r.pw - 50;

    // ГВС/ХВС/Канализация
    const pts = [
      { dx: 0,  c: "#D02828", label: "ГВС" },
      { dx: 16, c: "#2860D0", label: "ХВС" },
      { dx: 32, c: "#28A048", label: "К"   },
    ];
    pts.forEach((p) => {
      const px2 = startX + p.dx;
      const py2 = r.py + 12;
      // Линия от стояка к точке
      markers += `<line x1="${stoyakX}" y1="${stoyakY}" x2="${px2}" y2="${py2}"
                    stroke="${p.c}" stroke-width="0.8" stroke-dasharray="4 3" opacity="0.5"/>`;
      markers += `<circle cx="${px2}" cy="${py2}" r="5" fill="${p.c}" stroke="#1A1814" stroke-width="0.6"/>`;
      markers += `<text x="${px2}" y="${py2+2}" text-anchor="middle" font-size="5.5" fill="#fff" font-weight="700">${p.label[0]}</text>`;
    });

    // Сантехнические приборы
    if (r.kind==="bath") {
      const bathing = bc.bathing || "bath";
      const nearY = (stoyakY - r.py) < (r.py + r.ph - stoyakY);
      const fixY = nearY ? r.py + r.ph - 28 : r.py + 12;
      if (bathing==="bath") {
        markers += `<rect x="${r.px+4}" y="${fixY}" width="${Math.min(r.pw-8,80)}" height="24" rx="3"
                      fill="#EEF4FC" stroke="#2A5080" stroke-width="0.8" opacity="0.9"/>`;
        markers += `<text x="${r.px+4+Math.min(r.pw-8,80)/2}" y="${fixY+13}" text-anchor="middle" font-size="7" fill="#2A5080">Ванна</text>`;
      } else {
        markers += `<rect x="${r.px+4}" y="${fixY}" width="${Math.min(r.pw-8,40)}" height="40" rx="3"
                      fill="#EEF4FC" stroke="#2A5080" stroke-width="0.8" opacity="0.9"/>`;
        markers += `<text x="${r.px+4+Math.min(r.pw-8,40)/2}" y="${fixY+20}" text-anchor="middle" font-size="7" fill="#2A5080">Душ</text>`;
      }
      // Унитаз
      markers += `<ellipse cx="${r.px+r.pw-18}" cy="${r.py+20}" rx="10" ry="14"
                    fill="#F5F5F5" stroke="#2A5080" stroke-width="0.8" opacity="0.9"/>`;
      // Раковина
      markers += `<rect x="${r.px+r.pw-35}" y="${r.py+r.ph-22}" width="28" height="18" rx="4"
                    fill="#F5F5F5" stroke="#2A5080" stroke-width="0.8" opacity="0.9"/>`;
    }
    if (r.kind==="kitchen"||r.kind==="kitchenLiving") {
      // Мойка у ближайшей к стояку стены
      const mx = nearLeft ? r.px+4 : r.px+r.pw-40;
      markers += `<rect x="${mx}" y="${r.py+8}" width="36" height="24" rx="3"
                    fill="#EEF4FC" stroke="#2A5080" stroke-width="0.8" opacity="0.9"/>`;
      markers += `<text x="${mx+18}" y="${r.py+20}" text-anchor="middle" font-size="7" fill="#2A5080">Мойка</text>`;
    }
  });
  const content = `
    <div class="plan-with-side">
      <svg class="plan-svg" viewBox="0 0 ${geo.W} ${geo.H}">
        ${svgWalls(geo)}
        ${svgDoors(geo)}
        ${svgFurniture(geo, ctx.designCfg)}
        ${markers}
        ${svgRoomLabels(geo, { showArea: false })}
      </svg>
      <div class="plan-side">
        <div class="legend-title">Условные обозначения</div>
        <table class="legend-list">
          <tr><td><span class="lg-swatch" style="background:#D02828"></span></td><td>Вывод ГВС</td></tr>
          <tr><td><span class="lg-swatch" style="background:#2860D0"></span></td><td>Вывод ХВС</td></tr>
          <tr><td><span class="lg-swatch" style="background:#4A8A4A"></span></td><td>Вывод канализации</td></tr>
        </table>
        <div class="legend-notes">
          <b>Примечания:</b>
          <ol>
            <li>Уклон канализационных труб 50 мм: 3 см/п.м.</li>
            <li>Уклон труб 100 мм: 2 см/п.м.</li>
            <li>Установить ревизионные люки для обслуживания стояков.</li>
          </ol>
        </div>
      </div>
    </div>
  `;
  return sheetWrap({ sheetNo, totalSheets: ctx.totalSheets, title: "ПЛАН ПРИВЯЗКИ САНТЕХНИЧЕСКОГО ОБОРУДОВАНИЯ", content });
}

/* ── ПЛАН: НАПОЛЬНЫЕ ПОКРЫТИЯ ────────────────────────────────────────── */
function renderFloorPlan(ctx, sheetNo) {
  const geo = ctx.geometry;
  const cfg = ctx.designCfg || {};
  const fp = buildFloorPatterns(geo, cfg);
  // Текстурная заливка пола с паттерном
  let floors = "";
  geo.rooms.forEach((r) => {
    floors += `<rect x="${r.px}" y="${r.py}" width="${r.pw}" height="${r.ph}" fill="${fp.fill(r.id)}" opacity="0.85"/>`;
  });
  // Считаем итоговые площади по типам покрытия
  const byType = {};
  ctx.rooms.forEach((r) => {
    const rc = cfg[r.id] || {};
    const name = (rc.floors && rc.floors.name) || "Не задано";
    byType[name] = (byType[name] || 0) + (parseFloat(r.area) || 0);
  });
  const content = `
    <div class="plan-with-side">
      <svg class="plan-svg" viewBox="0 0 ${geo.W} ${geo.H}">
        <defs>${fp.defs}</defs>
        ${svgWalls(geo)}
        ${floors}
        ${svgWindows(geo)}
        ${svgDoors(geo)}
        ${svgRoomLabels(geo, { showArea: true })}
      </svg>
      <div class="plan-side">
        <div class="legend-title">Экспликация напольных покрытий</div>
        <table class="exp-table">
          <thead><tr><th>Тип</th><th>S, м²</th></tr></thead>
          <tbody>
            ${Object.keys(byType).map((k) => `<tr><td>${escape(k)}</td><td>${byType[k].toFixed(2)}</td></tr>`).join("")}
          </tbody>
        </table>
        <div class="legend-notes">
          При заказе учесть запас 5–10%.<br/>
          Швы в дверных проёмах центровать под полотном двери.
        </div>
      </div>
    </div>
  `;
  return sheetWrap({ sheetNo, totalSheets: ctx.totalSheets, title: "ПЛАН НАПОЛЬНЫХ ПОКРЫТИЙ", content });
}

/* ── ПЛАН: ПОТОЛКИ ───────────────────────────────────────────────────── */
function renderCeilingPlan(ctx, sheetNo) {
  const geo = ctx.geometry;
  const cfg = ctx.designCfg || {};
  const byType = {};
  ctx.rooms.forEach((r) => {
    const rc = cfg[r.id] || {};
    const name = (rc.ceilings && rc.ceilings.name) || "Не задано";
    byType[name] = (byType[name] || 0) + (parseFloat(r.area) || 0);
  });
  // Потолки: натяжной — пунктирный контур, ГКЛ — сплошной, краска — ничего
  let ceilDecor = "";
  geo.rooms.forEach(r => {
    const rc = (ctx.designCfg||{})[r.id]||{};
    const ceilId = rc.ceilings && rc.ceilings.id;
    const pad = 6;
    if (ceilId==="stretch") {
      ceilDecor += `<rect x="${r.px+pad}" y="${r.py+pad}" width="${r.pw-pad*2}" height="${r.ph-pad*2}"
                     fill="none" stroke="#4A6080" stroke-width="1" stroke-dasharray="5 3" opacity="0.7"/>`;
    } else if (ceilId==="gkl") {
      ceilDecor += `<rect x="${r.px+pad}" y="${r.py+pad}" width="${r.pw-pad*2}" height="${r.ph-pad*2}"
                     fill="none" stroke="#4A4A4A" stroke-width="1.2" opacity="0.5"/>`;
      ceilDecor += `<line x1="${r.px+pad}" y1="${r.cy}" x2="${r.px+r.pw-pad}" y2="${r.cy}"
                     stroke="#4A4A4A" stroke-width="0.5" stroke-dasharray="3 3" opacity="0.4"/>`;
    } else if (ceilId==="reiki") {
      const cnt = Math.round(r.pw/12);
      for(let i=0;i<=cnt;i++) {
        const rx2 = r.px+pad + i*(r.pw-pad*2)/cnt;
        ceilDecor += `<line x1="${rx2}" y1="${r.py+pad}" x2="${rx2}" y2="${r.py+r.ph-pad}"
                       stroke="#6A5840" stroke-width="0.8" opacity="0.6"/>`;
      }
    }
  });
  const content = `
    <div class="plan-with-side">
      <svg class="plan-svg" viewBox="0 0 ${geo.W} ${geo.H}">
        ${svgWalls(geo)}
        ${ceilDecor}
        ${svgDoors(geo)}
        ${geo.rooms.map((r) => `
          <text x="${r.cx}" y="${r.cy - 12}" text-anchor="middle" font-family="Arial" font-size="9" fill="#1A1814">${escape(r.name)}</text>
          <text x="${r.cx}" y="${r.cy + 4}" text-anchor="middle" font-family="Arial" font-size="11" font-weight="700" fill="#8A6234">h = 2 700 мм</text>
        `).join("")}
      </svg>
      <div class="plan-side">
        <div class="legend-title">Спецификация отделки потолков</div>
        <table class="exp-table">
          <thead><tr><th>Тип</th><th>S, м²</th></tr></thead>
          <tbody>
            ${Object.keys(byType).map((k) => `<tr><td>${escape(k)}</td><td>${byType[k].toFixed(2)}</td></tr>`).join("")}
          </tbody>
        </table>
        <div class="legend-notes">
          Предусмотреть закладные под все светильники
          (см. план освещения).
        </div>
      </div>
    </div>
  `;
  return sheetWrap({ sheetNo, totalSheets: ctx.totalSheets, title: "ПЛАН ПОТОЛКОВ", content });
}

/* ── ПЛАН: ОТДЕЛКА СТЕН ──────────────────────────────────────────────── */
function renderWallFinishPlan(ctx, sheetNo) {
  const geo = ctx.geometry;
  const cfg = ctx.designCfg || {};
  let walls = "";
  geo.rooms.forEach((r) => {
    const rc = cfg[r.id] || {};
    const ws = Array.isArray(rc.walls) ? rc.walls : (rc.walls ? [rc.walls] : []);
    const main = ws[0];
    if (main && main.color) {
      walls += `<rect x="${r.px}" y="${r.py}" width="${r.pw}" height="${r.ph}" fill="${main.color}" opacity="0.5"/>`;
    }
  });
  // Свод по типам отделки
  const byType = {};
  ctx.rooms.forEach((r) => {
    const rc = cfg[r.id] || {};
    const ws = Array.isArray(rc.walls) ? rc.walls : (rc.walls ? [rc.walls] : []);
    ws.forEach((w) => {
      const name = w.name || "Не задано";
      const perim = (() => {
        const a = parseFloat(r.area) || 10;
        const sw = Math.max(2, Math.sqrt(a * 1.4));
        const sh = a / sw;
        return (sw + sh) * 2 * 2.7;
      })();
      byType[name] = (byType[name] || 0) + perim * (w.pct ? w.pct / 100 : 1);
    });
  });
  // Показываем декоративные элементы стен (молдинги, панели)
  let wallDecor = "";
  geo.rooms.forEach((r) => {
    const rc = (ctx.designCfg || {})[r.id] || {};
    const ws = Array.isArray(rc.walls) ? rc.walls : (rc.walls ? [rc.walls] : []);
    ws.forEach(w => {
      if (w.id==="mouldings") {
        const pad=6;
        wallDecor += `<rect x="${r.px+pad}" y="${r.py+pad}" width="${r.pw-pad*2}" height="${r.ph-pad*2}"
                        fill="none" stroke="#C8B090" stroke-width="2" rx="2" stroke-dasharray="6 3"/>`;
      }
      if (w.id==="wood_panels") {
        const pct = (w.panel_pct||30)/100;
        wallDecor += `<rect x="${r.px}" y="${r.py+r.ph*(1-pct)}" width="${r.pw}" height="${r.ph*pct}"
                        fill="${w.color||'#B89870'}" opacity="0.35"/>`;
        // Рейки
        const cnt = Math.round(r.pw/16);
        for(let i=0;i<cnt;i++) {
          const rx2 = r.px + i*(r.pw/cnt);
          wallDecor += `<line x1="${rx2}" y1="${r.py+r.ph*(1-pct)}" x2="${rx2}" y2="${r.py+r.ph}"
                          stroke="${w.color||'#B89870'}" stroke-width="0.8" opacity="0.7"/>`;
        }
      }
    });
  });
  const content = `
    <div class="plan-with-side">
      <svg class="plan-svg" viewBox="0 0 ${geo.W} ${geo.H}">
        ${svgWalls(geo)}
        ${walls}
        ${wallDecor}
        ${svgWindows(geo)}
        ${svgDoors(geo)}
        ${svgRoomLabels(geo, { showArea: false })}
      </svg>
      <div class="plan-side">
        <div class="legend-title">Спецификация отделки стен</div>
        <table class="exp-table">
          <thead><tr><th>Тип покрытия</th><th>S, м²</th></tr></thead>
          <tbody>
            ${Object.keys(byType).map((k) => `<tr><td>${escape(k)}</td><td>${byType[k].toFixed(2)}</td></tr>`).join("")}
          </tbody>
        </table>
        <div class="legend-notes">
          Указанное количество соответствует точной площади покрытия
          (при заказе учесть запас 5–10%).
        </div>
      </div>
    </div>
  `;
  return sheetWrap({ sheetNo, totalSheets: ctx.totalSheets, title: "ПЛАН ОТДЕЛКИ СТЕН", content });
}

/* ── ПОКОМНАТНЫЕ ЛИСТЫ: визуализация изометрии ───────────────────────── */
function renderRoomVisualization(ctx, room, sheetNo) {
  const rc = (ctx.designCfg || {})[room.id] || {};
  const wallColor = (Array.isArray(rc.walls) ? (rc.walls[0] && rc.walls[0].color) : rc.walls && rc.walls.color) || "#E8E3D5";
  const floorColor = rc.floors && rc.floors.color || "#C8B89E";
  const ceilColor = rc.ceilings && rc.ceilings.color || "#F8F6F2";
  const wallName = (Array.isArray(rc.walls) ? (rc.walls[0] && rc.walls[0].name) : rc.walls && rc.walls.name) || "—";
  const floorName = (rc.floors && rc.floors.name) || "—";
  const ceilName = (rc.ceilings && rc.ceilings.name) || "—";

  // Простая изометрия комнаты для визуализации
  const iso = `
    <svg viewBox="0 0 800 480" class="iso-svg">
      <!-- Пол -->
      <polygon points="100,400 700,400 600,460 200,460" fill="${floorColor}" stroke="#5A554E" stroke-width="1"/>
      <!-- Левая стена -->
      <polygon points="100,400 100,80 200,40 200,460" fill="${wallColor}" stroke="#5A554E" stroke-width="1"/>
      <!-- Задняя стена -->
      <polygon points="200,40 600,40 700,80 100,80" style="display:none"/>
      <polygon points="200,40 600,40 600,400 200,400" fill="${wallColor}" stroke="#5A554E" stroke-width="1" opacity="0.85"/>
      <!-- Правая стена -->
      <polygon points="600,400 600,40 700,80 700,400" fill="${wallColor}" stroke="#5A554E" stroke-width="1" opacity="0.7"/>
      <!-- Потолок -->
      <polygon points="100,80 200,40 600,40 700,80" fill="${ceilColor}" stroke="#5A554E" stroke-width="1" opacity="0.6"/>
      <!-- Окно -->
      <rect x="380" y="120" width="120" height="160" fill="#D6E4F0" stroke="#5A554E" stroke-width="1.5"/>
      <line x1="440" y1="120" x2="440" y2="280" stroke="#5A554E"/>
      <line x1="380" y1="200" x2="500" y2="200" stroke="#5A554E"/>
      <!-- Дверь (если применимо) -->
      ${room.kind !== "bath" ? '<rect x="250" y="180" width="60" height="220" fill="#A88860" stroke="#5A554E" stroke-width="1"/>' : ""}
      <!-- Освещение -->
      <circle cx="400" cy="70" r="14" fill="#FFE899" stroke="#5A554E" stroke-width="1"/>
      <line x1="400" y1="40" x2="400" y2="62" stroke="#5A554E"/>
    </svg>
  `;
  const content = `
    <div class="vis-grid">
      <div class="vis-image">
        ${iso}
        <div class="vis-stamp">Эскизная визуализация · сгенерирована автоматически</div>
      </div>
      <div class="vis-side">
        <h3>${escape(room.name)}</h3>
        <table class="vis-spec">
          <tr><td>Площадь</td><td>${(parseFloat(room.area) || 0).toFixed(2)} м²</td></tr>
          <tr><td>Стены</td><td><span class="vis-swatch" style="background:${wallColor}"></span>${escape(wallName)}</td></tr>
          <tr><td>Пол</td><td><span class="vis-swatch" style="background:${floorColor}"></span>${escape(floorName)}</td></tr>
          <tr><td>Потолок</td><td><span class="vis-swatch" style="background:${ceilColor}"></span>${escape(ceilName)}</td></tr>
        </table>
        <div class="legend-notes" style="margin-top:14px">
          <b>Примечание:</b> данная изометрия отражает выбранную
          цветовую палитру. Фотореалистичная 3D-визуализация
          выполняется дизайнером отдельно.
        </div>
      </div>
    </div>
  `;
  return sheetWrap({ sheetNo, totalSheets: ctx.totalSheets, title: `ВИЗУАЛИЗАЦИЯ · ${room.name.toUpperCase()}`, content, scale: "—" });
}

/* ── ВЕДОМОСТИ ─────────────────────────────────────────────────────────── */

/* Ведомость отделки стен (как в OTDL — таблица: помещение | покрытие | кол-во) */
function renderWallSheet(ctx, sheetNo) {
  const cfg = ctx.designCfg || {};
  const rows = [];
  ctx.rooms.forEach((r) => {
    const rc = cfg[r.id] || {};
    const ws = Array.isArray(rc.walls) ? rc.walls : (rc.walls ? [rc.walls] : []);
    const a = parseFloat(r.area) || 10;
    const sw = Math.max(2, Math.sqrt(a * 1.4));
    const sh = a / sw;
    const perim = (sw + sh) * 2 * 2.7;
    ws.forEach((w) => {
      rows.push({
        room: r.name,
        name: w.name || "—",
        color: w.color || "#E8E3D5",
        qty: (perim * (w.pct ? w.pct / 100 : 1)).toFixed(2),
      });
    });
    if (!ws.length) rows.push({ room: r.name, name: "Не задано", color: "#F0EDE6", qty: perim.toFixed(2) });
  });
  const content = `
    <div class="sheet-fulltable">
      <table class="big-table">
        <thead><tr><th>Помещение</th><th>Цвет</th><th>Наименование</th><th>Кол-во, м²</th></tr></thead>
        <tbody>
          ${rows.map((r) => `<tr>
            <td>${escape(r.room)}</td>
            <td><span class="vis-swatch" style="background:${r.color};border:1px solid #5A554E"></span></td>
            <td>${escape(r.name)}</td>
            <td>${r.qty}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
  return sheetWrap({ sheetNo, totalSheets: ctx.totalSheets, title: "ВЕДОМОСТЬ ОТДЕЛКИ СТЕН", content, scale: "—" });
}

/* Ведомость напольных покрытий */
function renderFloorSheet(ctx, sheetNo) {
  const cfg = ctx.designCfg || {};
  const rows = ctx.rooms.map((r) => {
    const rc = cfg[r.id] || {};
    return {
      room: r.name,
      name: (rc.floors && rc.floors.name) || "Не задано",
      color: (rc.floors && rc.floors.color) || "#C8B89E",
      qty: (parseFloat(r.area) || 0).toFixed(2),
    };
  });
  const content = `
    <div class="sheet-fulltable">
      <table class="big-table">
        <thead><tr><th>Помещение</th><th>Цвет</th><th>Наименование</th><th>S, м²</th></tr></thead>
        <tbody>
          ${rows.map((r) => `<tr>
            <td>${escape(r.room)}</td>
            <td><span class="vis-swatch" style="background:${r.color};border:1px solid #5A554E"></span></td>
            <td>${escape(r.name)}</td>
            <td>${r.qty}</td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
  return sheetWrap({ sheetNo, totalSheets: ctx.totalSheets, title: "ВЕДОМОСТЬ НАПОЛЬНЫХ ПОКРЫТИЙ", content, scale: "—" });
}

/* Ведомость материалов из сметы (если передан result) */
function renderEstimateMaterials(ctx, sheetNo) {
  const result = ctx.result;
  if (!result || !result.rooms) return "";
  const allMats = [];
  result.rooms.forEach((r) => {
    (r.materials || []).forEach((m) => allMats.push({ room: r.name, ...m }));
  });
  if (!allMats.length) return "";
  // Группировка по секциям
  const sections = {};
  allMats.forEach((m) => {
    if (!sections[m.sec]) sections[m.sec] = [];
    sections[m.sec].push(m);
  });
  const content = `
    <div class="sheet-fulltable">
      <table class="big-table">
        <thead><tr><th>№</th><th>Раздел</th><th>Наименование</th><th>Ед.</th><th>Кол.</th><th>Цена, ₽</th><th>Сумма, ₽</th></tr></thead>
        <tbody>
          ${Object.keys(sections).map((sec, si) => {
    return `
              <tr class="sec-row"><td colspan="7">${escape(sec)}</td></tr>
              ${sections[sec].map((m, i) => `<tr>
                <td>${i + 1}</td>
                <td>${escape(m.sec)}</td>
                <td>${escape(m.name)}</td>
                <td>${escape(m.unit)}</td>
                <td>${m.qty}</td>
                <td>${fmt(m.price)}</td>
                <td>${fmt(m.sum)}</td>
              </tr>`).join("")}
            `;
  }).join("")}
        </tbody>
        <tfoot>
          <tr class="total-row"><td colspan="6">ИТОГО МАТЕРИАЛЫ</td><td>${fmt(result.matTotal)} ₽</td></tr>
        </tfoot>
      </table>
    </div>
  `;
  return sheetWrap({ sheetNo, totalSheets: ctx.totalSheets, title: "СПЕЦИФИКАЦИЯ МАТЕРИАЛОВ", content, scale: "—" });
}

/* ── CSS ──────────────────────────────────────────────────────────────── */

const CSS = `
@page { size: A4 portrait; margin: 0; }
* { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
html, body { margin: 0; padding: 0; font-family: Arial, 'Helvetica Neue', sans-serif; color: #1A1814; background: #F5F3EF; }

/* ── Масштабирование листов под ширину телефона ──
   Точное значение --dp-scale задаётся скриптом после загрузки,
   что гарантирует корректную прокрутку без артефактов. */
@media screen {
  html, body { width: 100%; overflow-x: hidden; }
  .sheets-container { padding: 6px; }
  .sheet-wrap {
    width: 100%;
    overflow: hidden;
    margin-bottom: 10px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.12);
  }
  .sheet {
    transform: scale(var(--dp-scale, 0.45));
    transform-origin: top left;
    margin: 0 !important;
    box-shadow: none !important;
  }
}
@media print {
  .sheets-container { padding: 0; }
  .sheet-wrap { width: auto; margin: 0; box-shadow: none; }
  .sheet { transform: none !important; }
}

.sheet {
  width: 210mm; min-height: 297mm;
  padding: 12mm 14mm 18mm 14mm;
  position: relative;
  page-break-after: always;
  background: #FFFFFF;
  overflow: hidden;
  margin: 0 auto 6mm;
  box-shadow: 0 2px 16px rgba(0,0,0,0.10);
}
.sheet:last-child { page-break-after: auto; }

.sheet-title {
  font-size: 22px; font-weight: 600; letter-spacing: 0.5px;
  border-bottom: 1.5px solid #1A1814;
  padding-bottom: 6px; margin-bottom: 16px;
  text-align: right; text-transform: uppercase;
}

.sheet-content { min-height: calc(297mm - 60mm); }

/* ── ТИТУЛЬНЫЙ ── */
.sheet-cover { background: linear-gradient(160deg,#1A2840,#0F1A30); color: #fff; }
.sheet-cover .cover-inner {
  width: 100%; height: 100%;
  display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 20mm;
}
.cover-brand { font-size: 16px; letter-spacing: 4px; opacity: 0.7; margin-bottom: 14mm; }
.cover-title { font-size: 38px; font-weight: 700; line-height: 1.1; text-align: center; margin-bottom: 14mm; }
.cover-meta { font-size: 13px; line-height: 2.0; opacity: 0.85; }
.cover-meta span { opacity: 0.6; margin-right: 8px; }
.cover-foot { position: absolute; bottom: 12mm; left: 0; right: 0; text-align: center; font-size: 10px; opacity: 0.5; }
.cover-cta { display: block; text-decoration: none; margin-top: 14mm; width: 100%;
  background: linear-gradient(135deg,#2C1E0C,#3A2810); border-radius: 14px;
  border: 2px solid #B8864E; padding: 16px 18px; box-shadow: 0 4px 20px rgba(184,134,78,0.4); }
.cover-cta-title { font-size: 15px; font-weight: 700; color: #F0D8A8; margin-bottom: 8px; }
.cover-cta-text { font-size: 11px; line-height: 1.6; color: rgba(255,255,255,0.78); margin-bottom: 12px; }
.cover-cta-text b { color: #E0B870; }
.cover-cta-btn { background: linear-gradient(90deg,#B8864E,#D4A060); color: #fff;
  font-size: 13px; font-weight: 700; text-align: center; padding: 11px;
  border-radius: 9px; letter-spacing: 0.3px; }

/* ── ШТАМП ── */
.sheet-stamp {
  position: absolute; bottom: 8mm; right: 18mm;
  display: grid; grid-template-columns: 40mm 35mm 56mm 14mm 14mm 14mm 14mm;
  grid-template-rows: 9mm 9mm;
  border: 1px solid #1A1814; font-size: 9px;
}
.stamp-cell { padding: 2mm 3mm; border-right: 1px solid #5A554E; border-bottom: 1px solid #5A554E; display: flex; align-items: center; }
.stamp-cell:last-child { border-right: none; }
.stamp-label { background: #F0EDE6; font-weight: 600; }
.stamp-sub { background: #F8F5EE; font-size: 8px; }
.stamp-meta { background: #F0EDE6; font-size: 8px; justify-content: center; }
.stamp-meta-v { justify-content: center; font-weight: 600; }
.stamp-brand { position: absolute; bottom: -7mm; right: 0; font-size: 9px; font-weight: 700; letter-spacing: 2px; color: #8A6234; }

/* ── ОГЛАВЛЕНИЕ ── */
.toc-grid { display: grid; grid-template-columns: 1fr; gap: 0; }
.toc-table { width: 100%; border-collapse: collapse; font-size: 11px; }
.toc-table th { background: transparent; text-align: left; padding: 4mm 2mm; border-bottom: 1.5px solid #1A1814; font-weight: 600; text-transform: uppercase; font-size: 10px; }
.toc-table th:last-child { text-align: right; }
.toc-table td { padding: 2.5mm 2mm; border-bottom: 1px solid #D6D1C5; }
.toc-table td:last-child { text-align: right; font-family: 'Courier New', monospace; font-weight: 600; }

/* ── ПЛАН + БОКОВАЯ ПАНЕЛЬ ── */
.plan-with-side { display: grid; grid-template-columns: 1fr 60mm; gap: 6mm; min-height: 200mm; }
.plan-svg { width: 100%; height: auto; max-height: 160mm; display: block; }
.plan-side { padding: 4mm; }
.legend-title { font-size: 11px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #1A1814; padding-bottom: 2mm; margin-bottom: 3mm; letter-spacing: 0.5px; }
.legend-list { width: 100%; font-size: 10px; border-collapse: collapse; }
.legend-list td { padding: 1.5mm 1mm; border-bottom: 1px solid #E5E0D6; vertical-align: middle; }
.legend-list td:first-child { width: 18mm; }
.lg-swatch { display: inline-block; width: 14px; height: 14px; border-radius: 2px; vertical-align: middle; border: 1px solid #5A554E; }
.lg-line { display: inline-block; width: 24px; height: 0; vertical-align: middle; }
.lg-solid { border-top: 2.5px solid #1A1814; }
.lg-dashed-red { border-top: 2px dashed #D02828; }
.lg-green { border-top: 2px solid #4A8A4A; }
.lg-light { display: inline-block; width: 14px; height: 14px; background: #FFF6CC; border-radius: 50%; border: 1px solid #1A1814; vertical-align: middle; }
.lg-spot { display: inline-block; width: 8px; height: 8px; background: #FFE899; border-radius: 50%; border: 0.5px solid #1A1814; vertical-align: middle; }

.legend-notes { font-size: 9.5px; line-height: 1.5; margin-top: 8mm; color: #3A352E; }
.legend-notes ol { padding-left: 4mm; margin: 2mm 0; }
.legend-notes li { margin-bottom: 1mm; }

/* ── ТАБЛИЦЫ ЭКСПЛИКАЦИИ ── */
.exp-table { width: 100%; border-collapse: collapse; font-size: 10px; margin-bottom: 4mm; }
.exp-table th, .exp-table td { padding: 1.5mm 2mm; border-bottom: 1px solid #D6D1C5; text-align: left; }
.exp-table th { background: #F0EDE6; font-weight: 600; font-size: 9px; text-transform: uppercase; }
.exp-table td:last-child, .exp-table th:last-child { text-align: right; font-family: 'Courier New', monospace; }
.exp-total { background: #F8F5EE; font-weight: 700; }

/* ── ВИЗУАЛИЗАЦИЯ ── */
.vis-grid { display: grid; grid-template-columns: 1fr 80mm; gap: 8mm; height: 100%; }
.vis-image { position: relative; background: #F8F5EE; border-radius: 4px; padding: 4mm; }
.vis-image .iso-svg { width: 100%; height: 100%; max-height: 200mm; }
.vis-stamp { position: absolute; bottom: 6mm; left: 50%; transform: translateX(-50%); font-size: 9px; color: #8A6234; background: rgba(255,255,255,0.85); padding: 1.5mm 4mm; border-radius: 2px; }
.vis-side h3 { font-size: 18px; margin: 0 0 4mm; }
.vis-spec { width: 100%; border-collapse: collapse; font-size: 10.5px; }
.vis-spec td { padding: 2mm 2mm; border-bottom: 1px solid #E5E0D6; }
.vis-spec td:first-child { color: #7A756C; width: 24mm; }
.vis-swatch { display: inline-block; width: 14px; height: 14px; border-radius: 2px; vertical-align: middle; margin-right: 5px; border: 1px solid rgba(0,0,0,0.15); }

/* ── БОЛЬШИЕ ТАБЛИЦЫ ── */
.sheet-fulltable { height: 100%; overflow: hidden; }
.big-table { width: 100%; border-collapse: collapse; font-size: 10px; }
.big-table th { background: #1A1814; color: #fff; padding: 2.5mm 3mm; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
.big-table td { padding: 1.8mm 3mm; border-bottom: 1px solid #E5E0D6; vertical-align: middle; }
.big-table tr:nth-child(even) { background: #FAFAF7; }
.sec-row td { background: #F0EDE6 !important; font-weight: 700; font-size: 11px; padding: 3mm; text-transform: uppercase; }
.total-row td { background: #1A1814 !important; color: #B8864E; font-weight: 700; font-size: 12px; padding: 4mm 3mm; }
`;

/* ── СБОРКА КОНТЕКСТА И ОГЛАВЛЕНИЯ ───────────────────────────────────── */

function buildContext(input) {
  const rooms = (input.rooms || []).map((r, i) => ({
    ...r,
    id: r.id != null ? r.id : `r${i}`,
  }));
  const totalArea = rooms.reduce((s, r) => s + (parseFloat(r.area) || 0), 0);
  const geometry = buildGeometry(rooms, input.planGeo || null);

  // Сопоставление packed-rooms с input-rooms по id (важно для дальнейшей работы)
  geometry.rooms.forEach((pr) => {
    const original = rooms.find((rr) => rr.id === pr.id);
    if (original) pr.area = original.area;
  });

  return {
    rooms,
    geometry,
    totalArea,
    cityName: input.cityName || "—",
    className: input.className || "Комфорт",
    cond: input.cond,
    condLabel: input.condLabel || "—",
    designCfg: input.designCfg || {},
    result: input.result || null,
    planImg: input.planImg || null,
    planGeo: input.planGeo || null,
  };
}

/* Решает, какие листы включать в проект (зависит от наличия данных) */
/* ── renderAIVisualization ─────────────────────────────────────────────
   Генерирует лист визуализации со СКАНДИНАВСКИМ МИНИМАЛИЗМОМ через
   Pollinations.ai (бесплатный API без ключа).
   Для каждой комнаты — отдельная карточка с AI-изображением.
   ─────────────────────────────────────────────────────────────────────── */
function buildPollinationsUrl(room, designCfg) {
  const rc = (designCfg || {})[room.id] || {};
  const floorName  = (rc.floors  && rc.floors.name)  || "светлый дубовый паркет";
  const wallColor  = (rc.walls && rc.walls[0] && rc.walls[0].color) ? "цвет стен "+rc.walls[0].color : "белые стены";
  const ceilName   = (rc.ceilings && rc.ceilings.name) || "белый потолок";
  const kind = room.kind || "room";
  const roomLabels = {
    bedroom:"спальня",living:"гостиная",kitchen:"кухня",
    kitchenLiving:"кухня-гостиная",bath:"ванная комната",
    hall:"прихожая",child:"детская",office:"кабинет",balcony:"лоджия",room:"комната"
  };
  const roomRu = roomLabels[kind] || "комната";
  // Промпт на английском для лучшего качества
  const prompt = [
    "scandinavian minimalist interior design",
    roomRu + " apartment",
    "light oak floor",
    "white walls",
    "natural linen textiles",
    "clean lines",
    "minimal furniture",
    "large windows",
    "soft natural light",
    "cozy hygge atmosphere",
    "architectural visualization",
    "photorealistic",
    "8k quality",
    "wide angle view"
  ].join(", ");
  const encoded = encodeURIComponent(prompt);
  // Pollinations.ai — полностью бесплатный, без ключа
  return `https://image.pollinations.ai/prompt/${encoded}?width=840&height=560&nologo=true&model=flux&seed=${Math.abs(room.id.toString().split('').reduce((a,c)=>a+c.charCodeAt(0),0))}`;
}

function renderAIVisualization(ctx, sheetNo) {
  const rooms = ctx.rooms.filter(r => r.kind !== "balcony" && r.kind !== "storage");
  // Берём первые 4 комнаты максимум
  const displayRooms = rooms.slice(0, 4);

  const vizCards = displayRooms.map(room => {
    const imgUrl = buildPollinationsUrl(room, ctx.designCfg);
    const rc = (ctx.designCfg || {})[room.id] || {};
    const floorName = (rc.floors && rc.floors.name) || "не задано";
    const wallLabel = (rc.walls && rc.walls[0] && rc.walls[0].name) || "не задано";
    const ceilLabel = (rc.ceilings && rc.ceilings.name) || "не задано";
    return `
      <div class="viz-card">
        <div class="viz-img-wrap">
          <img src="${imgUrl}" alt="Визуализация: ${escape(room.name)}"
               onerror="this.parentElement.innerHTML='<div class=viz-fallback>⏳ Загрузка<br/>изображения...</div>'"
               loading="lazy"/>
        </div>
        <div class="viz-meta">
          <div class="viz-room-title">${escape(room.name)}</div>
          <div class="viz-specs">
            <span>🪵 Пол: ${escape(floorName)}</span>
            <span>🖌 Стены: ${escape(wallLabel)}</span>
            <span>☁️ Потолок: ${escape(ceilLabel)}</span>
            <span>📐 ${(parseFloat(room.area)||0).toFixed(1)} м²</span>
          </div>
        </div>
      </div>`;
  }).join("");

  const content = `
    <div class="viz-header">
      <div class="viz-style-badge">✦ Скандинавский минимализм</div>
      <div class="viz-subtitle">AI-визуализация интерьера · Pollinations.ai · автоматическая генерация</div>
    </div>
    <div class="viz-grid">${vizCards}</div>
    <div class="viz-footer">
      Визуализация сгенерирована на основе выбранных материалов и плана квартиры.
      Финальный вид может отличаться в зависимости от освещения и пропорций помещений.
    </div>`;

  // CSS только для этого листа
  const vizCss = `
    .viz-header{text-align:center;margin-bottom:18mm;}
    .viz-style-badge{display:inline-block;background:linear-gradient(135deg,#1A1410,#2C1E0C);
      color:#D4A060;font-family:Arial,sans-serif;font-size:15px;font-weight:700;
      padding:7px 22px;border-radius:20px;border:1.5px solid rgba(212,160,96,0.5);
      letter-spacing:1px;margin-bottom:8px;}
    .viz-subtitle{font-family:Arial;font-size:10px;color:#8A8480;letter-spacing:0.3px;}
    .viz-grid{display:grid;grid-template-columns:1fr 1fr;gap:10mm;margin-bottom:12mm;}
    .viz-card{border-radius:10px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.12);
              background:#FAFAF7;border:1px solid #E5E0D8;}
    .viz-img-wrap{height:100mm;overflow:hidden;background:#F0EDE8;}
    .viz-img-wrap img{width:100%;height:100%;object-fit:cover;display:block;}
    .viz-fallback{height:100%;display:flex;align-items:center;justify-content:center;
                  font-family:Arial;font-size:13px;color:#B0A898;text-align:center;
                  background:linear-gradient(135deg,#F8F5F0,#F0ECE6);}
    .viz-meta{padding:8px 12px 10px;}
    .viz-room-title{font-family:Arial;font-size:14px;font-weight:700;color:#1A1814;margin-bottom:5px;}
    .viz-specs{display:flex;flex-wrap:wrap;gap:5px;}
    .viz-specs span{font-family:Arial;font-size:9px;color:#7A756C;background:#F0EDE8;
                    padding:2px 7px;border-radius:10px;}
    .viz-footer{text-align:center;font-family:Arial;font-size:9px;color:#A0998E;
                border-top:1px solid #E5E0D8;padding-top:8px;}
  `;

  return sheetWrap({
    sheetNo, totalSheets: ctx.totalSheets,
    title: "ВИЗУАЛИЗАЦИЯ ИНТЕРЬЕРА · СКАНДИНАВСКИЙ СТИЛЬ",
    content,
    scale: "—",
    extraCss: vizCss
  });
}

function buildToc(ctx) {
  const list = [];
  const add = (title, render) => list.push({ title, render });

  // ТОЛЬКО 7 ЛИСТОВ по заданию
  add("Состав проекта", null);
  add("Обмерный план", (sn) => renderMeasurementPlan(ctx, sn));
  add("План сантехники", (sn) => renderPlumbingPlan(ctx, sn));
  add("Электрика (розетки и выключатели)", (sn) => renderElectricPlan(ctx, sn));
  add("Освещение", (sn) => renderLightingPlan(ctx, sn));
  add("Напольные покрытия", (sn) => renderFloorPlan(ctx, sn));
  add("План потолков", (sn) => renderCeilingPlan(ctx, sn));
  // Визуализация — отдельный лист с AI-рендером (Pollinations.ai)
  add("Визуализация интерьера", (sn) => renderAIVisualization(ctx, sn));

  // Простановка номеров
  let sn = 1;
  list.forEach((it) => { it.sheetNo = sn++; });
  return list;
}

/* ── ПУБЛИЧНАЯ ТОЧКА ВХОДА ────────────────────────────────────────────── */

/* ── generateDesignProjectHTML ───────────────────────────────────────────
   Возвращает { ok, html, sheets } — без window.open.
   Отображение и печать — на стороне React-компонента (iframe-модал).
   ─────────────────────────────────────────────────────────────────────── */
function generateDesignProjectHTML(input) {
  try {
    const ctx = buildContext(input);
    const toc = buildToc(ctx);
    ctx.toc = toc;
    ctx.totalSheets = toc.length;

    let body = "";
    body += renderCover(ctx);
    body += renderTOC(ctx);

    for (let i = 1; i < toc.length; i++) {
      const item = toc[i];
      if (typeof item.render === "function") {
        const html = item.render(item.sheetNo);
        if (html) body += html;
      }
    }

    // Оборачиваем каждый <section class="sheet"...> в <div class="sheet-wrap">
    // — обёртка получает корректную высоту от JS-скрипта, что чинит прокрутку.
    body = body.replace(/<section class="sheet/g, '<div class="sheet-wrap"><section class="sheet')
               .replace(/<\/section>/g, '</section></div>');

    // Кнопка печати встроена прямо в документ (работает из iframe)
    const printBtn = `<div id="dp-print-toolbar" style="position:fixed;top:0;left:0;right:0;z-index:99999;background:#1A1814;padding:9px 12px;display:flex;gap:8px;align-items:center;print-color-adjust:exact;">
  <span style="color:#B8864E;font-family:Arial;font-size:12px;font-weight:700;flex:1;">📐 Дизайн-проект</span>
  <a href="https://m1-remont.ru" target="_blank" style="padding:7px 12px;background:linear-gradient(135deg,#C0392B,#A93226);color:#fff;border-radius:8px;font-size:11px;font-family:Arial;font-weight:700;text-decoration:none;">💾 Сохранить</a>
  <button onclick="window.print()" style="padding:7px 12px;background:linear-gradient(135deg,#B8864E,#8A6234);color:#fff;border:none;border-radius:8px;font-size:11px;cursor:pointer;font-family:Arial;font-weight:700;">🖨️ PDF</button>
</div>
<style>@media print{#dp-print-toolbar{display:none!important;}}</style>
<div style="height:44px"></div>`;

    // JS-скрипт: точно масштабирует каждый лист под ширину экрана
    // и задаёт обёртке правильную высоту, чтобы прокрутка работала.
    const scaleScript = `<script>
(function(){
  function fit(){
    var pad=12;                              // отступ слева+справа
    var avail=document.documentElement.clientWidth - pad;
    var sheetPx=794;                         // 210mm @96dpi
    var scale=Math.min(1, avail/sheetPx);
    document.documentElement.style.setProperty('--dp-scale', scale);
    // Каждой обёртке задаём высоту = реальная высота листа * scale
    var wraps=document.querySelectorAll('.sheet-wrap');
    for(var i=0;i<wraps.length;i++){
      var sh=wraps[i].querySelector('.sheet');
      if(sh){
        // offsetHeight — настоящая высота ДО transform
        wraps[i].style.height=(sh.offsetHeight*scale)+'px';
      }
    }
  }
  // Запускаем после полной загрузки (картинки виз-ии могут менять высоту)
  if(document.readyState==='complete')fit();
  else window.addEventListener('load',fit);
  window.addEventListener('resize',fit);
  // Доп. прогон через 1.5с — на случай поздней загрузки изображений
  setTimeout(fit,1500);
  setTimeout(fit,4000);
})();
<\/script>`;

    const fullHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"/>
  <title>Дизайн-проект · ${escape(ctx.cityName)}</title>
  <style>${CSS}</style>
</head>
<body>${printBtn}<div class="sheets-container">${body}</div>${scaleScript}</body>
</html>`;

    return { ok: true, html: fullHtml, sheets: toc.length + 1 };
  } catch (e) {
    console.error("generateDesignProjectHTML error:", e);
    return { ok: false, html: "", error: e.message || "Неизвестная ошибка" };
  }
}
// Алиас для обратной совместимости
function generateDesignProjectPDF(input) { return generateDesignProjectHTML(input); }


/* ── MAIN APP ── */
export default function App(){
  var s0=useState("welcome");var screen=s0[0];var setScreen=s0[1];
  var s1=useState(null);var city=s1[0];var setCity=s1[1];
  var s2=useState([]);var rooms=s2[0];var setRooms=s2[1];
  var s3=useState(null);var cond=s3[0];var setCond=s3[1];
  var s4=useState(null);var cls=s4[0];var setCls=s4[1];
  var s5=useState({wall:[],floor:[],ceil:[],door:"",elec:"",plumb:"",bathroom:{}});var sel=s5[0];var setSel=s5[1];
  var s6=useState(100);var elecPct=s6[0];var setElecPct=s6[1];var s6p=useState(1);var plumbPct=s6p[0];var setPlumbPct=s6p[1];
  var s7=useState(null);var roomMats=s7[0];var setRoomMats=s7[1];
  var s8=useState({});var designCfg=s8[0];var setDesignCfg=s8[1];
  var s9=useState(null);var planImg=s9[0];var setPlanImg=s9[1];
  var s10b=useState(null);var planGeo=s10b[0];var setPlanGeo=s10b[1];
  useEffect(function(){
    var l=document.createElement("link");l.rel="stylesheet";
    l.href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(l);
  },[]);
  function go(s){setScreen(s);}
  var needRoomMats=(sel.wall&&sel.wall.length>1)||(sel.floor&&sel.floor.length>1)||(sel.ceil&&sel.ceil.length>1);
  if(screen==="welcome")return(<Phone contactCompact={true} contactRaised={true} step={0} total={0}><ScreenWelcome onNext={function(){go("city");}}/></Phone>);
  if(screen==="city")return(<Phone contactCompact={true} step={0} total={0}><ScreenCity onSelect={function(c){setCity(c);go("choose");}}/></Phone>);
  if(screen==="choose")return(<Phone contactCompact={true} step={0} total={0}><ScreenChoose city={city||CITIES[0]} onBack={function(){go("city");}} onShort={function(){go("s_upload");}} onDesign={function(){go("d_upload");}}/></Phone>);
  if(screen==="s_upload")return(<Phone contactCompact={true} contactRaised={true} step={1} total={4}><ScreenUpload onBack={function(){go("choose");}} onNext={function(r){setRooms(r);go("s_cond");}} step={0} total={4}/></Phone>);
  if(screen==="s_cond")return(<Phone contactCompact={true} contactRaised={true} step={2} total={4}><ScreenCondClass onBack={function(){go("s_upload");}} onNext={function(c,cl){setCond(c);setCls(cl);go("s_mats");}} step={1} total={4}/></Phone>);
  if(screen==="s_mats")return(<Phone contactRaised={true} contactCompact={true} step={3} total={4}><ScreenMaterials cls={cls} rooms={rooms} onBack={function(){go("s_cond");}} onNext={function(s,ep,pp){setSel(s);setElecPct(ep);setPlumbPct(pp!==undefined?pp:1);if((s.wall&&s.wall.length>1)||(s.floor&&s.floor.length>1)||(s.ceil&&s.ceil.length>1)){go("s_roomcfg");}else{go("s_estimate");} }} step={2} total={4}/></Phone>);
  if(screen==="s_roomcfg")return(<Phone contactRaised={true} contactCompact={true} step={3} total={5}><ScreenRoomMats rooms={rooms} sel={sel} onBack={function(){go("s_mats");}} onNext={function(rm){setRoomMats(rm);go("s_estimate");}} step={3} total={5}/></Phone>);
  if(screen==="s_estimate")return(<Phone step={4} total={4}><ScreenEstimate city={city} rooms={rooms} cond={cond} cls={cls} sel={sel} elecPct={elecPct} plumbPct={plumbPct} roomMats={roomMats} bathroomCfg={sel.bathroom||{}} onBack={function(){go(needRoomMats?"s_roomcfg":"s_mats");}} step={3} total={4}/></Phone>);
  if(screen==="d_upload")return(<Phone contactCompact={true} contactRaised={true} step={1} total={3}><ScreenUpload onBack={function(){go("choose");}} onNext={function(r,img){setRooms(r);if(img)setPlanImg(img);go("d_cond");}} onPlanGeo={function(g){setPlanGeo(g);}} step={0} total={3}/></Phone>);
  if(screen==="d_cond")return(<Phone contactCompact={true} contactRaised={true} step={2} total={3}><ScreenCondClass onBack={function(){go("d_upload");}} onNext={function(c,cl){setCond(c);setCls(cl);go("d_plan");}} step={1} total={3}/></Phone>);
  if(screen==="d_plan")return(<Phone contactRaised={true} contactCompact={true} step={2} total={3}><ScreenDesignPlan rooms={rooms} onBack={function(){go("d_cond");}} onNext={function(cfg){setDesignCfg(cfg);go("d_estimate");}}/></Phone>);
  if(screen==="d_estimate")return(<Phone step={3} total={3}><ScreenDesignEstimate city={city} rooms={rooms} cond={cond} cls={cls} designCfg={designCfg} planImg={planImg} planGeo={planGeo} onBack={function(){go("d_plan");}} step={2} total={3}/></Phone>);
  return null;
}
