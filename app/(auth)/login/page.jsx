'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// ════════════════════════════════════════════════════════════════════════════════
// 1. DATA CONSTANTS
// ════════════════════════════════════════════════════════════════════════════════
const QUOTES = [
  { txt: `"Got into <b>TU Munich</b> with a DAAD scholarship. My mentor had done exactly what I wanted."`, name: "Karan Mehta", meta: "MS CS · TU Munich · 2024", img: "https://randomuser.me/api/portraits/men/22.jpg" },
  { txt: `"Booked 3 sessions before applying. Got into <b>University of Toronto</b> with full funding."`, name: "Priya Nair", meta: "MS AI · U of Toronto · 2024", img: "https://randomuser.me/api/portraits/women/33.jpg" },
  { txt: `"My mentor decoded the entire <b>UK visa process</b> in one session. Bristol accepted me 3 weeks later."`, name: "Arjun Singh", meta: "MS Finance · Bristol · 2025", img: "https://randomuser.me/api/portraits/men/55.jpg" },
  { txt: `"As a mentor, guiding 12 students into <b>German universities</b> last year was incredibly rewarding."`, name: "Siddharth Jain", meta: "Handler · RWTH Aachen · 2023", img: "https://randomuser.me/api/portraits/men/41.jpg" },
];

const TICKERS = [
  'NETWORK ONLINE · 15 HANDLERS ACTIVE',
  '1,240+ STUDENTS PLACED GLOBALLY',
  'DAAD SCHOLARSHIP WINDOW OPEN',
  'TU MUNICH · RWTH AACHEN · ACTIVE NODES',
];

const CONTINENTS = [
  { color: 'rgba(0,245,255,.06)', outline: 'rgba(0,245,255,.14)', pts: [[-168,71],[-140,70],[-125,68],[-95,70],[-85,67],[-78,64],[-62,60],[-58,47],[-66,44],[-70,42],[-74,40],[-80,32],[-82,29],[-88,30],[-90,29],[-97,26],[-100,22],[-105,20],[-108,24],[-112,29],[-117,32],[-118,34],[-124,37],[-124,40],[-124,46],[-124,49],[-130,54],[-140,60],[-148,59],[-152,58],[-158,56],[-160,55],[-163,55],[-168,57],[-168,71]] },
  { color: 'rgba(0,245,255,.04)', outline: 'rgba(0,245,255,.1)', pts: [[-44,83],[-26,83],[-18,76],[-22,70],[-26,65],[-38,63],[-44,65],[-52,67],[-54,70],[-52,76],[-44,83]] },
  { color: 'rgba(0,229,168,.06)', outline: 'rgba(0,229,168,.14)', pts: [[-80,10],[-77,8],[-62,10],[-60,5],[-52,4],[-50,0],[-48,-2],[-50,-8],[-38,-12],[-38,-18],[-42,-22],[-44,-24],[-48,-28],[-52,-32],[-56,-38],[-60,-40],[-62,-46],[-65,-52],[-68,-54],[-70,-50],[-72,-46],[-72,-42],[-74,-38],[-72,-32],[-72,-28],[-70,-18],[-76,-14],[-80,-8],[-80,10]] },
  { color: 'rgba(0,245,255,.07)', outline: 'rgba(0,245,255,.18)', pts: [[-10,36],[-8,38],[0,39],[2,43],[7,44],[12,44],[15,41],[18,40],[22,38],[26,38],[28,36],[32,37],[36,37],[38,40],[36,46],[30,46],[24,48],[20,48],[18,50],[22,54],[24,58],[28,60],[28,65],[25,68],[20,68],[16,68],[12,65],[8,58],[4,54],[0,50],[-2,50],[-6,48],[-8,44],[-10,42],[-10,36]] },
  { color: 'rgba(255,179,71,.05)', outline: 'rgba(255,179,71,.12)', pts: [[-6,36],[6,37],[12,37],[18,36],[24,36],[32,30],[36,22],[42,12],[44,8],[44,2],[42,-2],[40,-8],[38,-16],[36,-22],[34,-26],[30,-32],[26,-34],[20,-36],[18,-34],[16,-30],[12,-24],[8,-18],[6,-12],[4,-4],[2,4],[0,6],[-2,6],[-8,5],[-14,8],[-16,12],[-14,16],[-12,22],[-8,28],[-6,32],[-6,36]] },
  { color: 'rgba(167,139,250,.05)', outline: 'rgba(167,139,250,.12)', pts: [[26,70],[40,70],[60,72],[80,72],[100,70],[120,68],[140,64],[140,50],[136,46],[132,40],[128,36],[126,34],[122,30],[120,24],[116,20],[112,18],[104,10],[100,4],[100,0],[104,-4],[108,-6],[110,-2],[115,4],[118,10],[120,20],[120,26],[124,28],[130,32],[132,34],[136,36],[138,36],[140,38],[140,42],[138,44],[136,46],[140,50],[140,56],[136,56],[130,54],[120,50],[112,48],[104,50],[96,54],[88,58],[80,62],[72,64],[60,66],[50,66],[44,68],[36,68],[26,70]] },
  { color: 'rgba(251,113,133,.06)', outline: 'rgba(251,113,133,.14)', pts: [[114,-22],[116,-20],[122,-18],[128,-14],[132,-12],[136,-12],[140,-14],[144,-16],[146,-18],[148,-20],[152,-24],[152,-28],[150,-32],[152,-36],[148,-38],[146,-38],[144,-38],[140,-36],[136,-36],[132,-34],[128,-32],[124,-28],[122,-24],[114,-22]] },
];

const UNI_NODES = [
  { lon:11.6,  lat:48.1,  c:'#00F5FF', s:4.5, lbl:'🇩🇪', hub:false },
  { lon:13.4,  lat:52.5,  c:'#00F5FF', s:3.5, hub:false },
  { lon:6.1,   lat:50.8,  c:'#00F5FF', s:3.5, hub:false },
  { lon:8.4,   lat:49.0,  c:'#00F5FF', s:3,   hub:false },
  { lon:-71.1, lat:42.4,  c:'#FFB347', s:4.5, lbl:'🇺🇸', hub:false },
  { lon:-122.2,lat:37.4,  c:'#FFB347', s:4.5, hub:false },
  { lon:-71.1, lat:42.4,  c:'#FFB347', s:3.5, hub:false },
  { lon:-74.0, lat:40.7,  c:'#FFB347', s:3.5, hub:false },
  { lon:-96.8, lat:33.0,  c:'#FFB347', s:3,   hub:false },
  { lon:-1.3,  lat:51.8,  c:'#00E5A8', s:4,   lbl:'🇬🇧', hub:false },
  { lon:0.1,   lat:52.2,  c:'#00E5A8', s:4,   hub:false },
  { lon:-0.1,  lat:51.5,  c:'#00E5A8', s:3.5, hub:false },
  { lon:-79.4, lat:43.7,  c:'#A78BFA', s:4,   lbl:'🇨🇦', hub:false },
  { lon:-123.3,lat:49.3,  c:'#A78BFA', s:3.5, hub:false },
  { lon:144.9, lat:-37.8, c:'#FB7185', s:4,   lbl:'🇦🇺', hub:false },
  { lon:151.2, lat:-33.9, c:'#FB7185', s:3.5, hub:false },
  { lon:-6.3,  lat:53.3,  c:'#4ADE80', s:3.5, lbl:'🇮🇪', hub:false },
  { lon:8.5,   lat:47.4,  c:'#F472B6', s:3.5, lbl:'🇨🇭', hub:false },
  { lon:103.8, lat:1.3,   c:'#FB923C', s:3.5, lbl:'🇸🇬', hub:false },
  { lon:139.7, lat:35.7,  c:'#E879F9', s:3.5, lbl:'🇯🇵', hub:false },
  { lon:77.2,  lat:28.6,  c:'#FF8C42', s:7,   lbl:'🇮🇳', hub:true  },
];
const HUB_NODE = UNI_NODES.find(n => n.hub);

// ════════════════════════════════════════════════════════════════════════════════
// 2. CSS STYLES — unchanged from original
// ════════════════════════════════════════════════════════════════════════════════
const styles = `
  .clearance-root {
    --bg:#030508; --bg1:#060912; --bg2:#0A0F1E;
    --b0:rgba(0,245,255,.07); --b1:rgba(0,245,255,.16);
    --c:#00F5FF; --t:#00E5A8; --a:#FFB347; --r:#FF4D6D; --v:#A78BFA;
    --t1:#C8D8F0; --t2:#5A7090; --t3:#2A3A55;
    --ff-h:'Rajdhani',sans-serif; --ff-b:'DM Sans',sans-serif; --ff-m:'JetBrains Mono',monospace;
    --ac:#00F5FF; --ac2:#00E5A8;
    background: var(--bg); font-family: var(--ff-b); color: var(--t1);
    -webkit-font-smoothing: antialiased; display: flex; overflow: hidden; height: 100vh; width: 100vw;
  }
  .clearance-root * { box-sizing: border-box; }
  .clearance-root ::-webkit-scrollbar { width: 4px; }
  .clearance-root ::-webkit-scrollbar-thumb { background: rgba(0,245,255,.12); border-radius: 4px; }

  .left {
    width: 52%; flex-shrink: 0; position: relative; overflow: hidden;
    background: linear-gradient(145deg,#030508 0%,#060C18 55%,#08111F 100%);
    border-right: 1px solid var(--b0); display: flex; flex-direction: column; height: 100vh;
  }
  .l-hex { position: absolute; inset: 0; opacity: .03; pointer-events: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='104'%3E%3Cpolygon points='30,2 58,17 58,47 30,62 2,47 2,17' fill='none' stroke='%2300F5FF' stroke-width='0.6'/%3E%3Cpolygon points='30,52 58,67 58,97 30,112 2,97 2,67' fill='none' stroke='%2300F5FF' stroke-width='0.6'/%3E%3C/svg%3E"); }
  .l-glow-a { position:absolute;width:500px;height:500px;border-radius:50%;top:-80px;left:-100px;pointer-events:none;background:radial-gradient(circle,rgba(0,245,255,.045) 0%,transparent 70%); }
  .l-glow-b { position:absolute;width:400px;height:400px;border-radius:50%;bottom:-60px;right:-80px;pointer-events:none;background:radial-gradient(circle,rgba(0,229,168,.035) 0%,transparent 70%); }
  .l-scan { position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.04) 2px,rgba(0,0,0,.04) 4px);animation:scanMove 14s linear infinite; }
  @keyframes scanMove{to{background-position:0 400px}}
  .l-sweep { position:absolute;left:0;right:0;height:2px;pointer-events:none;background:linear-gradient(90deg,transparent,var(--ac),transparent);opacity:.14;animation:sweep 10s ease-in-out infinite; }
  @keyframes sweep{0%{top:-2px;opacity:0}5%{opacity:.18}95%{opacity:.18}100%{top:100%;opacity:0}}

  .l-logo { padding:26px 36px 0;position:relative;z-index:2;display:flex;align-items:center;gap:10px; }
  .l-logo-mark { width:34px;height:34px;border-radius:8px;overflow:hidden;display:flex;align-items:center;justify-content:center;animation:logoGlow 3s ease-in-out infinite; }
  .l-logo-mark img { width:100%;height:100%;object-fit:contain; }
  @keyframes logoGlow{0%,100%{box-shadow:0 0 10px rgba(0,245,255,.2)}50%{box-shadow:0 0 24px rgba(0,245,255,.5)}}
  .l-logo-text { font-family:var(--ff-h);font-size:19px;font-weight:700;letter-spacing:.06em;color:#fff; }
  .l-logo-text span { color:var(--ac);transition:color .4s; }

  .l-ticker {
    position:absolute;top:78px;right:24px;z-index:5;
    background:rgba(6,9,18,.9);backdrop-filter:blur(12px);
    border:1px solid rgba(0,229,168,.22);border-radius:10px;
    padding:7px 13px;display:flex;align-items:center;gap:7px;
    font-family:var(--ff-m);font-size:10px;color:var(--t);letter-spacing:.1em;
    max-width:260px;animation:fadeUp .5s .8s ease both;
  }
  .tick-dot { width:6px;height:6px;border-radius:50%;background:var(--t);box-shadow:0 0 7px var(--t);animation:dp 1.5s infinite; }
  @keyframes dp{0%,100%{box-shadow:0 0 4px var(--t)}50%{box-shadow:0 0 12px var(--t)}}

  .l-map { flex:1;position:relative;z-index:2;padding:0 24px;display:flex;align-items:center;justify-content:center;min-height:0; }
  #worldCanvas { display:block;width:100%;height:100%; }

  .l-stats { padding:0 36px 18px;position:relative;z-index:2;display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px; }
  .l-stat { background:rgba(255,255,255,.025);border:1px solid var(--b0);border-radius:11px;padding:11px 13px;transition:border-color .3s;animation:fadeUp .5s ease both; }
  .l-stat:hover { border-color:var(--b1); }
  .ls-val { font-family:var(--ff-h);font-size:21px;font-weight:700;line-height:1;margin-bottom:3px; }
  .ls-lbl { font-family:var(--ff-m);font-size:8px;color:var(--t3);letter-spacing:.12em;text-transform:uppercase; }

  .l-quote { padding:0 36px 24px;position:relative;z-index:2; }
  .lq-inner { background:rgba(255,255,255,.02);border:1px solid var(--b0);border-radius:12px;padding:14px 16px;border-left:3px solid var(--ac);transition:border-left-color .4s, opacity .3s, transform .3s; }
  .lq-text { font-size:12px;color:var(--t2);line-height:1.65;margin-bottom:10px;font-style:italic; }
  .lq-text b { color:var(--ac);font-style:normal;font-weight:500;transition:color .4s; }
  .lq-author { display:flex;align-items:center;gap:9px; }
  .lq-av { width:28px;height:28px;border-radius:50%;border:1.5px solid var(--b1);overflow:hidden;flex-shrink:0; }
  .lq-av img { width:100%;height:100%;object-fit:cover; }
  .lq-name { font-family:var(--ff-h);font-size:13px;font-weight:600;color:#fff; }
  .lq-meta { font-family:var(--ff-m);font-size:9px;color:var(--t3);letter-spacing:.06em; }
  .lq-dots { display:flex;gap:5px;margin-top:10px;justify-content:flex-end; }
  .lq-dot { width:5px;height:5px;border-radius:50%;background:var(--t3);cursor:pointer;transition:background .3s; }
  .lq-dot.on { background:var(--ac);box-shadow:0 0 5px var(--ac); }

  .right { flex: 1; height: 100vh; overflow-y: auto; overflow-x: hidden; display: flex; align-items: flex-start; justify-content: center; padding: 40px 48px 60px; position: relative; background: var(--bg); }
  .right::before { content:'';position:fixed;top:0;right:0;width:48%;height:100%;background:radial-gradient(ellipse 80% 60% at 80% 20%,rgba(0,245,255,.03),transparent 60%);pointer-events:none;z-index:0; }

  .form-card { width:100%;max-width:420px;position:relative;z-index:1;animation:fadeUp .45s ease both; }

  .tabs { display:flex;gap:0;margin-bottom:26px;background:var(--bg2);border:1px solid var(--b0);border-radius:12px;padding:4px; }
  .tab { flex:1;padding:9px;border:none;background:transparent;cursor:pointer;font-family:var(--ff-m);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--t2);border-radius:9px;transition:all .22s; }
  .tab.on { background:var(--ac);color:#030508;font-weight:600;box-shadow:0 0 16px rgba(0,245,255,.22); }

  .form-title { font-family:var(--ff-h);font-size:clamp(26px,3vw,38px);font-weight:700;letter-spacing:.04em;color:#fff;line-height:1.1;margin-bottom:6px; }
  .form-title .hi { color:var(--ac);transition:color .4s; }
  .form-sub { font-size:13px;color:var(--t2);line-height:1.6;margin-bottom:22px; }

  .alert { background:rgba(255,77,109,.08);border:1px solid rgba(255,77,109,.28);border-radius:10px;padding:10px 14px;margin-bottom:14px;font-family:var(--ff-m);font-size:10.5px;color:var(--r);letter-spacing:.04em;display:none;align-items:center;gap:8px; }
  .alert.show { display:flex; }
  .alert.ok { background:rgba(0,229,168,.08);border-color:rgba(0,229,168,.28);color:var(--t); }

  .role-sel { display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px; }
  .rc { background:var(--bg2);border:1px solid var(--b0);border-radius:12px;padding:16px 12px;cursor:pointer;transition:all .25s;text-align:center;position:relative;overflow:hidden; }
  .rc:hover { border-color:var(--b1); }
  .rc.on { border-color:var(--ac);background:rgba(0,245,255,.06);box-shadow:0 0 18px rgba(0,245,255,.08); }
  .clearance-root.mentor-mode .rc.on { border-color:var(--a);background:rgba(255,179,71,.06);box-shadow:0 0 18px rgba(255,179,71,.08); }
  .rc-ico { font-size:26px;display:block;margin-bottom:8px; }
  .rc-name { font-family:var(--ff-h);font-size:15px;font-weight:700;color:#fff;letter-spacing:.04em;margin-bottom:3px; }
  .rc-desc { font-family:var(--ff-m);font-size:9px;color:var(--t3);letter-spacing:.06em; }
  .rc-sel { position:absolute;top:7px;right:7px;font-family:var(--ff-m);font-size:8px;letter-spacing:.1em;padding:2px 7px;border-radius:20px;border:1px solid var(--ac);background:rgba(0,245,255,.1);color:var(--ac);opacity:0;transition:opacity .25s; }
  .rc.on .rc-sel { opacity:1; }
  .clearance-root.mentor-mode .rc.on .rc-sel { border-color:var(--a);background:rgba(255,179,71,.1);color:var(--a); }

  .field { margin-bottom:15px; }
  .fl { font-family:var(--ff-m);font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--t3);margin-bottom:7px;display:flex;align-items:center;gap:5px; }
  .fl .req { color:var(--r);font-size:10px; }
  .iw { position:relative; }
  .i-ico { position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--t3);pointer-events:none;z-index:1;transition:color .2s; }
  .fi { width:100%;background:var(--bg2);border:1px solid var(--b0);border-radius:10px;padding:12px 14px 12px 42px;outline:none;font-family:var(--ff-m);font-size:12px;color:var(--t1);transition:all .22s;letter-spacing:.04em; }
  .fi::placeholder { color:var(--t3); }
  .fi:focus { border-color:var(--ac);background:rgba(0,245,255,.035);box-shadow:0 0 0 3px rgba(0,245,255,.06); }
  .clearance-root.mentor-mode .fi:focus { border-color:var(--a);background:rgba(255,179,71,.035);box-shadow:0 0 0 3px rgba(255,179,71,.06); }
  .fi:focus ~ .scan-line { opacity:1;animation:scanField .45s ease; }
  .scan-line { position:absolute;bottom:0;left:0;right:0;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,var(--ac),transparent);opacity:0;pointer-events:none; }
  .clearance-root.mentor-mode .scan-line { background:linear-gradient(90deg,transparent,var(--a),transparent); }
  @keyframes scanField{0%{left:100%;right:0}100%{left:0;right:0}}

  .pw-tog { position:absolute;right:12px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:14px;color:var(--t3);background:none;border:none;padding:4px;z-index:1;transition:color .18s; }
  .pw-tog:hover { color:var(--t2); }
  .pw-bars { display:flex;gap:4px;margin-top:7px; }
  .pb { flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.06);transition:background .3s; }
  .pb.w { background:var(--r); } .pb.f { background:var(--a); } .pb.g { background:var(--t); } .pb.s { background:var(--c); }
  .pw-lbl { font-family:var(--ff-m);font-size:9px;color:var(--t3);margin-top:5px;letter-spacing:.08em; }

  .frow { display:grid;grid-template-columns:1fr 1fr;gap:12px; }

  .chk-wrap { display:flex;align-items:center;gap:8px;cursor:pointer;margin-bottom:18px; }
  .chk-wrap input { width:15px;height:15px;accent-color:var(--ac);cursor:pointer; }
  .chk-lbl { font-family:var(--ff-m);font-size:10px;color:var(--t2);letter-spacing:.04em; }

  .submit { width:100%;padding:14px;border-radius:11px;cursor:pointer;font-family:var(--ff-m);font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;transition:all .25s;border:1px solid var(--ac);display:flex;align-items:center;justify-content:center;gap:10px;background:linear-gradient(135deg,var(--ac) 0%,var(--ac2) 100%);color:#030508;box-shadow:0 0 24px rgba(0,245,255,.22);position:relative;overflow:hidden; }
  .clearance-root.mentor-mode .submit { background:linear-gradient(135deg,var(--a) 0%,#E8963A 100%);border-color:var(--a);box-shadow:0 0 24px rgba(255,179,71,.22); }
  .submit::before { content:'';position:absolute;top:-50%;left:-60%;width:40%;height:200%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.15),transparent);transform:skewX(-20deg);transition:left .55s; }
  .submit:hover::before { left:120%; }
  .submit:hover { box-shadow:0 0 36px rgba(0,245,255,.42);transform:translateY(-1px); }
  .clearance-root.mentor-mode .submit:hover { box-shadow:0 0 36px rgba(255,179,71,.42); }
  .submit:active { transform:translateY(0); }
  .submit.loading { background:rgba(255,255,255,.04);color:var(--t2);box-shadow:none;border-color:var(--b0);cursor:wait; }
  .submit.done { background:linear-gradient(135deg,var(--t),#00B884);border-color:var(--t);box-shadow:0 0 30px rgba(0,229,168,.4); color:#030508; }
  .bio-scan { position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(0,245,255,.12),transparent);transform:translateX(-100%);display:none; }
  .submit.loading .bio-scan { display:block;animation:bioScan .9s ease-in-out infinite; }
  @keyframes bioScan{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}
  .spin-ico { width:16px;height:16px;border:2px solid rgba(3,5,8,.3);border-top-color:#030508;border-radius:50%;animation:spin .8s linear infinite;display:none; }
  .submit.loading .spin-ico { display:block; }
  @keyframes spin{to{transform:rotate(360deg)}}

  .switch-link { text-align:center;margin-top:20px;font-family:var(--ff-m);font-size:10.5px;color:var(--t3);letter-spacing:.06em; }
  .switch-link button { color:var(--ac);cursor:pointer;transition:opacity .18s;background:none;border:none;font-family:inherit;font-size:inherit;letter-spacing:inherit;padding:0; }
  .switch-link button:hover { opacity:.7; }

  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}

  @media(max-width:880px){
    .clearance-root { flex-direction:column; overflow:auto; }
    .left { width:100%;height:auto;min-height:360px;border-right:none;border-bottom:1px solid var(--b0); }
    .right { height:auto;overflow-y:visible;padding:28px 24px 60px; }
    .l-stats,.l-quote,.l-logo { padding-left:20px;padding-right:20px; }
    .l-map { height:220px;flex:none; }
  }
`;

export default function ClearancePage() {
  const router = useRouter();

  const [mode, setMode] = useState('login');
  const [loginRole, setLoginRole] = useState('student');
  const [signupRole, setSignupRole] = useState('student');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [signupFn, setSignupFn] = useState('');
  const [signupLn, setSignupLn] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPw, setSignupPw] = useState('');
  const [signupUni, setSignupUni] = useState('');
  const [terms, setTerms] = useState(false);

  const [showLoginPw, setShowLoginPw] = useState(false);
  const [showSignupPw, setShowSignupPw] = useState(false);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginShake, setLoginShake] = useState(false);

  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupShake, setSignupShake] = useState(false);

  const [qIdx, setQIdx] = useState(0);
  const [quoteFade, setQuoteFade] = useState(false);
  const [tIdx, setTIdx] = useState(0);
  const [tickerFade, setTickerFade] = useState(false);
  const canvasRef = useRef(null);

  const activeRole = mode === 'login' ? loginRole : signupRole;

  const getPwScore = (v) => {
    if (!v) return 0;
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    return s;
  };
  const pwScore = getPwScore(signupPw);
  const pwLabels = ['WEAK — VULNERABLE', 'FAIR — MINIMAL SECURITY', 'GOOD — SECURE', 'STRONG — ENCRYPTED'];
  const pbCls = ['w', 'f', 'g', 's'];

  useEffect(() => {
    const qInterval = setInterval(() => {
      setQuoteFade(true);
      setTimeout(() => { setQIdx(prev => (prev + 1) % QUOTES.length); setQuoteFade(false); }, 300);
    }, 5000);
    const tInterval = setInterval(() => {
      setTickerFade(true);
      setTimeout(() => { setTIdx(prev => (prev + 1) % TICKERS.length); setTickerFade(false); }, 300);
    }, 4000);
    return () => { clearInterval(qInterval); clearInterval(tInterval); };
  }, []);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let frame = 0;
    let animationId;
    let CW, CH;

    const resize = () => {
      const parent = cvs.parentElement;
      cvs.width = parent.offsetWidth;
      cvs.height = parent.offsetHeight;
      CW = cvs.width; CH = cvs.height;
    };
    window.addEventListener('resize', resize);
    resize();

    const mercator = (lon, lat) => {
      const x = (lon + 180) / 360;
      const latR = lat * Math.PI / 180;
      const y = (1 - Math.log(Math.tan(latR) + 1 / Math.cos(latR)) / Math.PI) / 2;
      return [x, y];
    };
    const mp = (lon, lat) => { const [x, y] = mercator(lon, lat); return [x * CW, y * CH]; };

    const drawMap = () => {
      frame++;
      ctx.clearRect(0, 0, CW, CH);

      CONTINENTS.forEach(cont => {
        ctx.beginPath();
        cont.pts.forEach(([lon, lat], i) => { const [x, y] = mp(lon, lat); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
        ctx.closePath();
        ctx.fillStyle = cont.color;
        ctx.fill();
        ctx.strokeStyle = cont.outline;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      });

      const [hx, hy] = mp(HUB_NODE.lon, HUB_NODE.lat);
      UNI_NODES.filter(n => !n.hub).forEach((n, i) => {
        const [nx, ny] = mp(n.lon, n.lat);
        const mx = (hx + nx) / 2 - (ny - hy) * 0.18;
        const my = (hy + ny) / 2 - (nx - hx) * 0.05;
        const grad = ctx.createLinearGradient(hx, hy, nx, ny);
        grad.addColorStop(0, n.c + '00');
        grad.addColorStop(0.5, n.c + '28');
        grad.addColorStop(1, n.c + '00');
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.quadraticCurveTo(mx, my, nx, ny);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 9]);
        ctx.lineDashOffset = -(frame * 0.35 + i * 5);
        ctx.stroke();
        ctx.setLineDash([]);

        const t = ((frame * 0.007 + i * 0.072) % 1);
        const px = (1 - t) * (1 - t) * hx + 2 * (1 - t) * t * mx + t * t * nx;
        const py = (1 - t) * (1 - t) * hy + 2 * (1 - t) * t * my + t * t * ny;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = n.c + 'BB';
        ctx.fill();
      });

      UNI_NODES.forEach((n, i) => {
        const [nx, ny] = mp(n.lon, n.lat);
        const pulse = 1 + Math.sin(frame * 0.055 + i * 0.7) * 0.28;
        const halo = ctx.createRadialGradient(nx, ny, 0, nx, ny, (n.hub ? 20 : 9) * pulse);
        halo.addColorStop(0, n.c + (n.hub ? '55' : '44'));
        halo.addColorStop(1, n.c + '00');
        ctx.beginPath();
        ctx.arc(nx, ny, (n.hub ? 20 : 9) * pulse, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();
        if (n.hub) {
          ctx.beginPath();
          ctx.arc(nx, ny, 14 * pulse, 0, Math.PI * 2);
          ctx.strokeStyle = n.c + '30';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(nx, ny, n.s, 0, Math.PI * 2);
        ctx.fillStyle = n.c;
        ctx.shadowColor = n.c;
        ctx.shadowBlur = n.hub ? 14 : 6;
        ctx.fill();
        ctx.shadowBlur = 0;
        if (n.lbl) {
          ctx.font = `${n.hub ? 11 : 9}px serif`;
          ctx.textAlign = 'center';
          ctx.fillStyle = n.c;
          ctx.fillText(n.lbl, nx, ny - (n.hub ? 16 : 11));
        }
      });

      ctx.font = 'bold 8px "JetBrains Mono", monospace';
      ctx.fillStyle = '#FF8C42';
      ctx.textAlign = 'center';
      const [hxx, hyy] = mp(HUB_NODE.lon, HUB_NODE.lat);
      ctx.fillText('HUB · NEW DELHI', hxx, hyy + 17);

      animationId = requestAnimationFrame(drawMap);
    };
    drawMap();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationId); };
  }, []);

  // ── FIX 1: handleLogin now calls real API ──────────────────────────────────
  const handleLogin = async () => {
    setLoginError('');

    if (!loginEmail || !loginPw) {
      setLoginError('Email and password are required.');
      return;
    }

    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPw, role: loginRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoggingIn(false);
        setLoginError(data.error || 'Invalid credentials. Check email & password.');
        setLoginShake(true);
        setTimeout(() => setLoginShake(false), 400);
        return;
      }

      setLoginSuccess(true);

      // 👉 THE CRITICAL FIX: Save to browser & fire the flare gun
      if (data.user) {
        localStorage.setItem('mentorBridgeUser', JSON.stringify(data.user));
        window.dispatchEvent(new Event("auth-change"));
      }

      const destination = data.redirectTo || (loginRole === 'mentor' ? '/dashboard/mentor' : '/dashboard/student');
      setTimeout(() => {
        router.push(destination);
      }, 800);

    } catch (err) {
      setIsLoggingIn(false);
      setLoginError('Network error. Please try again.');
      setLoginShake(true);
      setTimeout(() => setLoginShake(false), 400);
    }
  };

  // ── FIX 3: handleSignup now calls real API ─────────────────────────────────
  const handleSignup = async () => {
    setSignupError('');

    if (!signupFn || !signupLn || !signupEmail || !signupPw) {
      setSignupError('All fields are required.');
      return;
    }
    if (signupPw.length < 8) {
      setSignupError('Password must be at least 8 characters.');
      return;
    }
    if (!terms) {
      setSignupError('You must accept the terms to continue.');
      return;
    }
    if (signupRole === 'mentor' && !signupUni.trim()) {
      setSignupError('Please enter your university and program.');
      return;
    }

    setIsSigningUp(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: signupFn,
          lastName: signupLn,
          email: signupEmail,
          password: signupPw,
          role: signupRole,
          university: signupUni || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsSigningUp(false);
        setSignupError(data.error || 'Signup failed. Please try again.');
        setSignupShake(true);
        setTimeout(() => setSignupShake(false), 400);
        return;
      }

      setSignupSuccess(true);

      // 👉 THE CRITICAL FIX: Save to browser & fire the flare gun
      if (data.user) {
        localStorage.setItem('mentorBridgeUser', JSON.stringify(data.user));
        window.dispatchEvent(new Event("auth-change"));
      }

      const destination = data.redirectTo || (signupRole === 'mentor' ? '/dashboard/mentor' : '/dashboard/student');
      setTimeout(() => {
        router.push(destination);
      }, 800);

    } catch (err) {
      setIsSigningUp(false);
      setSignupError('Network error. Please try again.');
      setSignupShake(true);
      setTimeout(() => setSignupShake(false), 400);
    }
  };

  return (
    <div className={`clearance-root ${activeRole === 'mentor' ? 'mentor-mode' : ''}`}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* ── LEFT PANEL ── */}
      <div className="left">
        <div className="l-hex" />
        <div className="l-glow-a" />
        <div className="l-glow-b" />
        <div className="l-scan" />
        <div className="l-sweep" />

        <div className="l-logo">
          {/* ── FIX 4: Real logo image instead of emoji ── */}
          <div className="l-logo-mark">
            <img src="/logo.png" alt="MentorBridge" onError={e => { e.target.style.display='none'; e.target.parentNode.innerHTML='🧭'; }} />
          </div>
          <div className="l-logo-text">Mentor<span>Bridge</span></div>
        </div>

        <div className="l-ticker">
          <div className="tick-dot" />
          <span style={{ transition: 'opacity 0.3s', opacity: tickerFade ? 0 : 1 }}>
            {TICKERS[tIdx]}
          </span>
        </div>

        <div className="l-map">
          <canvas id="worldCanvas" ref={canvasRef}></canvas>
        </div>

        <div className="l-stats">
          <div className="l-stat" style={{ animationDelay: '.05s' }}>
            <div className="ls-val" style={{ color: 'var(--c)' }}>1,240+</div>
            <div className="ls-lbl">Students Placed</div>
          </div>
          <div className="l-stat" style={{ animationDelay: '.1s' }}>
            <div className="ls-val" style={{ color: 'var(--t)' }}>15</div>
            <div className="ls-lbl">Active Handlers</div>
          </div>
          <div className="l-stat" style={{ animationDelay: '.15s' }}>
            <div className="ls-val" style={{ color: 'var(--a)' }}>13</div>
            <div className="ls-lbl">Countries</div>
          </div>
        </div>

        <div className="l-quote">
          <div className="lq-inner" style={{ transition: 'all 0.3s', opacity: quoteFade ? 0 : 1, transform: quoteFade ? 'translateY(6px)' : 'translateY(0)' }}>
            <div className="lq-text" dangerouslySetInnerHTML={{ __html: QUOTES[qIdx].txt }} />
            <div className="lq-author">
              <div className="lq-av"><img src={QUOTES[qIdx].img} alt="" /></div>
              <div>
                <div className="lq-name">{QUOTES[qIdx].name}</div>
                <div className="lq-meta">{QUOTES[qIdx].meta}</div>
              </div>
            </div>
            <div className="lq-dots">
              {QUOTES.map((_, i) => (
                <div key={i} className={`lq-dot ${i === qIdx ? 'on' : ''}`} onClick={() => setQIdx(i)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="right">
        <div className="form-card">

          <div className="tabs">
            <button className={`tab ${mode === 'login' ? 'on' : ''}`} onClick={() => { setMode('login'); setLoginError(''); }}>AUTHENTICATE</button>
            <button className={`tab ${mode === 'signup' ? 'on' : ''}`} onClick={() => { setMode('signup'); setSignupError(''); }}>ACCESS REQUEST</button>
          </div>

          {/* LOGIN VIEW */}
          {mode === 'login' && (
            <div>
              <div className="form-title">WELCOME<br /><span className="hi">BACK.</span></div>
              <div className="form-sub">Select your role and enter your credentials<br />to access the operative network.</div>

              <div className={`alert ${loginError ? 'show' : ''}`}><span>⚠</span><span>{loginError}</span></div>

              <div className="role-sel">
                <div className={`rc ${loginRole === 'student' ? 'on' : ''}`} onClick={() => setLoginRole('student')}>
                  <span className="rc-ico">🎓</span>
                  <div className="rc-name">STUDENT</div>
                  <div className="rc-desc">OPERATIVE</div>
                  <div className="rc-sel">● SELECTED</div>
                </div>
                <div className={`rc mentor ${loginRole === 'mentor' ? 'on' : ''}`} onClick={() => setLoginRole('mentor')}>
                  <span className="rc-ico">🧠</span>
                  <div className="rc-name">MENTOR</div>
                  <div className="rc-desc">HANDLER</div>
                  <div className="rc-sel">● SELECTED</div>
                </div>
              </div>

              <div className="field" style={{ animation: 'fadeUp .4s .05s ease both' }}>
                <div className="fl">EMAIL <span className="req">*</span></div>
                <div className="iw">
                  <span className="i-ico">✉</span>
                  <input className="fi" type="email" placeholder="operative@domain.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                  <div className="scan-line" />
                </div>
              </div>

              <div className="field" style={{ animation: 'fadeUp .4s .1s ease both' }}>
                <div className="fl">PASSWORD <span className="req">*</span></div>
                <div className="iw">
                  <span className="i-ico">🔒</span>
                  <input className="fi" type={showLoginPw ? 'text' : 'password'} placeholder="••••••••••••" style={{ paddingRight: 44 }} value={loginPw} onChange={e => setLoginPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                  <button type="button" className="pw-tog" tabIndex="-1" onClick={() => setShowLoginPw(!showLoginPw)}>{showLoginPw ? '🙈' : '👁'}</button>
                  <div className="scan-line" />
                </div>
              </div>

              <label className="chk-wrap" style={{ animation: 'fadeUp .4s .15s ease both' }}>
                <input type="checkbox" />
                <span className="chk-lbl">KEEP ME AUTHENTICATED</span>
              </label>

              <button
                className={`submit ${isLoggingIn ? 'loading' : ''} ${loginSuccess ? 'done' : ''}`}
                onClick={handleLogin}
                disabled={isLoggingIn || loginSuccess}
                style={{ animation: loginShake ? 'shake .4s ease' : 'fadeUp .4s .2s ease both' }}
              >
                <div className="bio-scan" />
                <div className="spin-ico" />
                <span style={{ display: isLoggingIn ? 'none' : 'block' }}>
                  {loginSuccess ? '✓ IDENTITY CONFIRMED' : '⚡ AUTHENTICATE'}
                </span>
              </button>

              <div className="switch-link" style={{ animation: 'fadeUp .4s .25s ease both' }}>
                NO ACCESS YET? <button onClick={() => setMode('signup')}>REQUEST CLEARANCE →</button>
              </div>
            </div>
          )}

          {/* SIGNUP VIEW */}
          {mode === 'signup' && (
            <div>
              <div className="form-title">REQUEST<br /><span className="hi">CLEARANCE.</span></div>
              <div className="form-sub">Choose your role and create<br />your operative profile.</div>

              <div className={`alert ${signupError ? 'show' : ''}`}><span>⚠</span><span>{signupError}</span></div>

              <div className="role-sel">
                <div className={`rc ${signupRole === 'student' ? 'on' : ''}`} onClick={() => setSignupRole('student')}>
                  <span className="rc-ico">🎓</span>
                  <div className="rc-name">STUDENT</div>
                  <div className="rc-desc">OPERATIVE</div>
                  <div className="rc-sel">● SELECTED</div>
                </div>
                <div className={`rc mentor ${signupRole === 'mentor' ? 'on' : ''}`} onClick={() => setSignupRole('mentor')}>
                  <span className="rc-ico">🧠</span>
                  <div className="rc-name">MENTOR</div>
                  <div className="rc-desc">HANDLER</div>
                  <div className="rc-sel">● SELECTED</div>
                </div>
              </div>

              <div className="frow" style={{ animation: 'fadeUp .4s .05s ease both' }}>
                <div className="field">
                  <div className="fl">FIRST NAME <span className="req">*</span></div>
                  <div className="iw">
                    <span className="i-ico">◈</span>
                    <input className="fi" type="text" placeholder="Aarav" value={signupFn} onChange={e => setSignupFn(e.target.value)} />
                    <div className="scan-line" />
                  </div>
                </div>
                <div className="field">
                  <div className="fl">LAST NAME <span className="req">*</span></div>
                  <div className="iw">
                    <span className="i-ico">◈</span>
                    <input className="fi" type="text" placeholder="Mehta" value={signupLn} onChange={e => setSignupLn(e.target.value)} />
                    <div className="scan-line" />
                  </div>
                </div>
              </div>

              <div className="field" style={{ animation: 'fadeUp .4s .1s ease both' }}>
                <div className="fl">EMAIL <span className="req">*</span></div>
                <div className="iw">
                  <span className="i-ico">✉</span>
                  <input className="fi" type="email" placeholder="your@email.com" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} />
                  <div className="scan-line" />
                </div>
              </div>

              <div className="field" style={{ animation: 'fadeUp .4s .15s ease both' }}>
                <div className="fl">CREATE PASSWORD <span className="req">*</span></div>
                <div className="iw">
                  <span className="i-ico">🔒</span>
                  <input className="fi" type={showSignupPw ? 'text' : 'password'} placeholder="Min 8 characters" style={{ paddingRight: 44 }} value={signupPw} onChange={e => setSignupPw(e.target.value)} />
                  <button type="button" className="pw-tog" tabIndex="-1" onClick={() => setShowSignupPw(!showSignupPw)}>{showSignupPw ? '🙈' : '👁'}</button>
                  <div className="scan-line" />
                </div>
                <div className="pw-bars">
                  {[1, 2, 3, 4].map(num => (
                    <div key={num} className={`pb ${pwScore >= num ? pbCls[pwScore - 1] : ''}`} />
                  ))}
                </div>
                <div className="pw-lbl">SIGNAL STRENGTH {pwScore > 0 ? '— ' + pwLabels[pwScore - 1] : '—'}</div>
              </div>

              {signupRole === 'mentor' && (
                <div className="field" style={{ animation: 'fadeUp .3s ease both' }}>
                  <div className="fl">YOUR UNIVERSITY <span className="req">*</span></div>
                  <div className="iw">
                    <span className="i-ico">🎓</span>
                    <input className="fi" type="text" placeholder="e.g. TU Munich — MS Computer Science" value={signupUni} onChange={e => setSignupUni(e.target.value)} />
                    <div className="scan-line" />
                  </div>
                </div>
              )}

              <label className="chk-wrap" style={{ animation: 'fadeUp .4s .2s ease both' }}>
                <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} />
                <span className="chk-lbl">I ACCEPT THE TERMS & OPERATIVE PROTOCOL</span>
              </label>

              <button
                className={`submit ${isSigningUp ? 'loading' : ''} ${signupSuccess ? 'done' : ''}`}
                onClick={handleSignup}
                disabled={isSigningUp || signupSuccess}
                style={{ animation: signupShake ? 'shake .4s ease' : 'fadeUp .4s .25s ease both' }}
              >
                <div className="bio-scan" />
                <div className="spin-ico" />
                <span style={{ display: isSigningUp ? 'none' : 'block' }}>
                  {signupSuccess ? '✓ CLEARANCE GRANTED' : signupRole === 'mentor' ? '⚡ REGISTER AS HANDLER' : '⚡ INITIATE CLEARANCE'}
                </span>
              </button>

              <div className="switch-link" style={{ animation: 'fadeUp .4s .3s ease both' }}>
                ALREADY HAVE ACCESS? <button onClick={() => setMode('login')}>AUTHENTICATE →</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}