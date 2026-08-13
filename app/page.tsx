"use client";

import { useEffect, useRef, useState } from "react";

type Weather = "clear" | "drizzle" | "rain" | "monsoon" | "fog" | "wind";
type Panel = "playlist" | "weather" | "ambience" | null;

const tracks = [
  { id:"night-changes",title:"Night Changes",artist:"One Direction",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/One%20Direction%20-%20Night%20Changes.mp3",format:"mp3",duration:0,artwork:"/cafe-cinematic-clean.png" },
  { id:"perfect",title:"Perfect",artist:"Ed Sheeran",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Ed%20Sheeran%20-%20Perfect%20%28Official%20Music%20Video%29.mp3",format:"mp3",duration:0,artwork:"/cafe-cinematic-clean.png" },
  { id:"dekha-hi-nahi",title:"Dekha Hi Nahi",artist:"Osho Jain",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Osho%20Jain%20-%20Dekha%20Hi%20Nahi.mp3",format:"mp3",duration:0,artwork:"/cafe-cinematic-clean.png" },
  { id:"ganga-ke-kinare",title:"Ganga Ke Kinare",artist:"Bunny Sagar",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Ganga%20Ke%20Kinare%20Bunny%20Sagar%20Kripa%20Record.mp3",format:"mp3",duration:0,artwork:"/cafe-cinematic-clean.png" },
  { id:"suniyan-suniyan",title:"Suniyan Suniyan",artist:"Juss × MixSingh",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/SUNIYAN%20SUNIYAN%20%28Official%20Video%29%20Juss%20x%20MixSingh.mp3",format:"mp3",duration:0,artwork:"/cafe-cinematic-clean.png" },
  { id:"teri-yaad",title:"Teri Yaad",artist:"Aditya Rikhari",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Aditya%20Rikhari%20%E2%80%93%20TERI%20YAAD%20%28Video%29.mp3",format:"mp3",duration:0,artwork:"/cafe-cinematic-clean.png" },
  { id:"aaoge-tum-kabhi",title:"Aaoge Tum Kabhi",artist:"The Local Train",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/The%20Local%20Train%20-%20Aaoge%20Tum%20Kabhi%20%28Official%29.mp3",format:"mp3",duration:0,artwork:"/cafe-cinematic-clean.png" },
  { id:"jo-tum-mere-ho",title:"Jo Tum Mere Ho",artist:"Anuv Jain",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Anuv%20Jain%20-%20Jo%20Tum%20Mere%20Ho.mp3",format:"mp3",duration:0,artwork:"/cafe-cinematic-clean.png" },
  { id:"arz-kiya-hai",title:"Arz Kiya Hai",artist:"Anuv Jain",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Anuv%20Jain%20-%20Arz%20Kiya%20Hai%20_%20Coke%20Studio%20Bharat.mp4",format:"mp4",duration:0,artwork:"/cafe-cinematic-clean.png" },
  { id:"taare",title:"Taare",artist:"Farak",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Farak%20-%20Taare%20Official%20Music%20Video.mp3",format:"mp3",duration:0,artwork:"/cafe-cinematic-clean.png" },
  { id:"sun-sajna",title:"Sun Sajna",artist:"Tanishk Bagchi",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/SUN%20SAJNA%20%28Official%20Video%29_%20TANISHK%20BAGCHI%20_%20LATEST%20HINDI%20SONG%20_%20BHUSHAN%20KUMAR%20%5BMpVGLuw3WyU%5D.mp3",format:"mp3",duration:0,artwork:"/cafe-cinematic-clean.png" },
  { id:"finding-her",title:"Finding Her",artist:"Kushagra",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Kushagra%20-%20Finding%20Her%20%28Lyrics%29.mp3",format:"mp3",duration:0,artwork:"/cafe-cinematic-clean.png" },
  { id:"khat",title:"Khat",artist:"Navjot Ahuja",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Navjot%20Ahuja%20-%20Khat%20%28Lyrics%29%20Tere%20liye%20mandir%20jaaun%20Tere%20naam%20ka%20dia%20jalaaun.mp3",format:"mp3",duration:0,artwork:"/cafe-cinematic-clean.png" },
  { id:"kasoor",title:"Kasoor (Acoustic)",artist:"Prateek Kuhad",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Kasoor%20%28Acoustic%29%20-%20Prateek%20Kuhad%20_%20Official%20Lyric%20Video%20%F0%9F%8C%BB%E2%9C%A8%20%5BiOIF74Hk80A%5D.mp3",format:"mp3",duration:0,artwork:"/cafe-cinematic-clean.png" },
  { id:"husn",title:"Husn",artist:"Anuv Jain",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Anuv%20Jain%20-%20HUSN%20%28Official%20Video%29.mp3",format:"mp3",duration:0,artwork:"https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e020d3449f333a83a25feb423f8" },
  { id:"banjaare-barsaat",title:"Banjaare Barsaat × Spider-Man",artist:"Brand New Day Edition",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Banjaare%20Barsaat%20x%20Spider-Man%20%28Brand%20New%20Day%20Edition%29.mp3",format:"mp3",duration:0,artwork:"/cafe-cinematic-clean.png" },
  { id:"aankhon-se-batana",title:"Aankhon Se Batana",artist:"Dikshant",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Aankhon%20Se%20Batana%20%E2%80%93%20Dikshant%20Viral%20Song%20Official%20Video.mp3",format:"mp3",duration:0,artwork:"https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0216fc8a384ed52ccb50d3b782" },
  { id:"musu-musu",title:"Musu Musu",artist:"Shaan",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Musu%20Musu%20Full%20Video%20-%20Pyaar%20Mein%20Kabhi%20Kabhi%20Dino%20Morea%2CRinke%20Shaan%20Vishal%20Dadlani.mp3",format:"mp3",duration:0,artwork:"https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e024d130aa779f503c703ea1591" },
  { id:"kaahe-mose",title:"Kaahe Mose",artist:"Garvit–Priyansh",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Kaahe%20Mose%20%28Music%20Video%29_%20Garvit-Priyansh%20_%20Eshaan%20Duggal%20_%20Kashish%20Panchpuri%20_%20Kahe%20Mose%20Nain%20%5Bzx_3gmcskZo%5D.mp3",format:"mp3",duration:0,artwork:"https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e021f2c1b67a525cb5b6ccbb7fd" },
  { id:"nazra",title:"Nazra",artist:"KNOJIA",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Nazra%20%E2%80%93%20KNOJIA%20Official%20Music%20Video%202025.mp3",format:"mp3",duration:0,artwork:"https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e021040f1b7865ba47ce5688103" },
  { id:"chaap-tilak",title:"Chaap Tilak",artist:"Abida Parveen & Rahat Fateh Ali Khan",src:"https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Coke%20Studio%20Season%207_%20Chaap%20Tilak_%20Abida%20Parveen%20%26%20Rahat%20Fateh%20Ali%20Khan%20%5B7SDrjwtfKMk%5D.mp3",format:"mp3",duration:0,artwork:"https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025108a8e8bbaaea01e384535a" },
];

const weatherOptions: { key: Weather; label: string; note: string }[] = [
  { key: "clear", label: "Clear night", note: "stars over the valley" },
  { key: "drizzle", label: "Drizzle", note: "barely-there rain" },
  { key: "rain", label: "Baarish", note: "wet stone & chai" },
  { key: "monsoon", label: "Monsoon", note: "the mountains disappear" },
  { key: "fog", label: "Cold & foggy", note: "bonfire burns warmer" },
  { key: "wind", label: "Windy night", note: "deodars breathe" },
];

const initialMix = { Bonfire: 45, River: 28, Wind: 12, Rain: 42, Forest: 18 };

const loveLines = [
  "Some silences sound better with you in them.", "I stopped looking for the way back.", "You make ordinary nights worth remembering.", "The world softens when you arrive.", "I would recognize your quiet anywhere.", "Somewhere between hello and stay, I found home.", "You are the pause I never want to end.", "Even the rain feels warmer near you.", "I like who the night lets us become.", "No map ever led me somewhere this gentle.", "You feel like a light left on for me.", "The long way is shorter with you.", "I could stay in this almost forever.", "Your name makes the dark less dark.", "Nothing happened. Everything changed.", "I found my favorite place in your presence.", "If this is a dream, let the rain keep falling.", "Some people arrive like remembered songs.", "You make distance forget itself.", "I hope we are never in a hurry again.", "The fire knows we are staying.", "Meet me where the night forgets the time.", "I would choose this quiet, every time.", "You turn waiting into somewhere beautiful.", "There are a thousand stars. I noticed you.", "The cold never reaches the seat beside you.", "You are my favorite kind of familiar.", "This feels less like finding and more like returning.", "I want more evenings that ask nothing of us.", "You make the world feel briefly complete.", "We could be nowhere, and I would still stay.", "A little rain. A little music. You.", "Your quiet is the one I understand.", "I forgot what I was running from.", "The night kept our secret.", "Everything feels closer after midnight.", "I would save this seat in every lifetime.", "You arrived, and the room remembered warmth.", "There is no rush where we are going.", "Some feelings do not need brighter light.", "The safest place was never a place.", "You feel like a story I already know by heart.", "Let the rest of the world keep moving.", "I would miss you even in a room full of you.", "We found a corner the world forgot.", "Stay until the song forgets how to end.", "I like the way time loses us here.", "Maybe home is just being understood quietly.", "The night is kinder when it is ours.", "I did not know peace could have a voice.", "You make leaving feel unnecessary.", "The horizon can wait. I have this.", "Nothing outside this moment needs us.", "I would find you in any weather.", "You are the warmth the fire is trying to become.", "Perhaps we were always on our way here.", "Thodi der aur?"
];

const cafeVideo = "https://7nlovhkqx2zbld4k.public.blob.vercel-storage.com/Video%20-%20tst";

function SeamlessBackgroundVideo() {
  const videos = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];
  const [activeVideo, setActiveVideo] = useState(0);
  const fading = useRef(false);

  const crossfade = async (from: number) => {
    if (fading.current || from !== activeVideo) return;
    const next = from === 0 ? 1 : 0;
    const outgoing = videos[from].current;
    const incoming = videos[next].current;
    if (!outgoing || !incoming) return;
    fading.current = true;
    incoming.currentTime = 0;
    try { await incoming.play(); } catch { outgoing.currentTime = 0; fading.current = false; return; }
    setActiveVideo(next);
    window.setTimeout(() => {
      outgoing.pause();
      outgoing.currentTime = 0;
      fading.current = false;
    }, 1100);
  };

  const watchEnding = (index: number) => {
    const video = videos[index].current;
    if (video && video.duration && video.duration - video.currentTime < 1.15) void crossfade(index);
  };

  return <div className="scene-photo" aria-hidden="true">
    {[0, 1].map((index) => <video
      key={index}
      ref={videos[index]}
      className={activeVideo === index ? "active" : ""}
      autoPlay={index === 0}
      muted
      playsInline
      preload={index === 0 ? "auto" : "metadata"}
      poster="/cafe-cinematic-clean.png"
      onTimeUpdate={() => watchEnding(index)}
      onEnded={() => void crossfade(index)}
    ><source src={cafeVideo} type="video/mp4" /></video>)}
  </div>;
}

function WeatherCanvas({ weather }: { weather: Weather }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frame = 0;
    let width = 0;
    let height = 0;
    let last = performance.now();
    const intensity = weather === "monsoon" ? 1 : weather === "rain" ? .58 : weather === "drizzle" ? .24 : 0;
    const wind = weather === "wind" ? .72 : weather === "monsoon" ? .38 : .13;
    type Drop = { x:number; y:number; z:number; speed:number; length:number };
    type Leaf = { x:number; y:number; size:number; speed:number; phase:number; opacity:number };
    type Ripple = { x:number; y:number; age:number; life:number };
    let drops: Drop[] = [];
    let leaves: Leaf[] = [];
    let ripples: Ripple[] = [];
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 1.7);
      width = innerWidth; height = innerHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      drops = Array.from({ length: Math.round(width * intensity * .12) }, () => ({ x:Math.random()*width, y:Math.random()*height, z:.2+Math.random()*.8, speed:520+Math.random()*680, length:5+Math.random()*22 }));
      leaves = Array.from({ length: Math.round(2 + wind * 8) }, () => ({ x:Math.random()*width, y:Math.random()*height*.72, size:3+Math.random()*6, speed:12+Math.random()*22, phase:Math.random()*6, opacity:.1+Math.random()*.2 }));
    };
    const draw = (now:number) => {
      const dt = Math.min((now-last)/1000, .04); last = now;
      context.clearRect(0,0,width,height);
      for (const d of drops) {
        const drift = (16 + wind * 50) * d.z;
        context.beginPath(); context.moveTo(d.x,d.y); context.lineTo(d.x-drift*.07,d.y-d.length*d.z);
        context.strokeStyle=`rgba(190,216,224,${.08+d.z*.23})`; context.lineWidth=.35+d.z*.75; context.stroke();
        d.y += d.speed*d.z*dt; d.x += drift*dt;
        if(d.y>height+20){ if(d.z>.66 && Math.random()<.32) ripples.push({x:d.x,y:height*(.69+Math.random()*.22),age:0,life:.7+Math.random()*.45}); d.y=-30;d.x=Math.random()*width; }
      }
      ripples = ripples.filter(r=>r.age<r.life);
      for(const r of ripples){ r.age+=dt; const p=r.age/r.life; context.beginPath();context.ellipse(r.x,r.y,2+p*12,1+p*4,0,0,Math.PI*2);context.strokeStyle=`rgba(180,205,211,${(1-p)*.18})`;context.lineWidth=.6;context.stroke(); }
      for(const l of leaves){ l.phase+=dt*(1+wind);l.x+=l.speed*(.35+wind)*dt;l.y+=Math.sin(l.phase)*8*dt+wind*2*dt;context.save();context.translate(l.x,l.y);context.rotate(l.phase*.65);context.fillStyle=`rgba(90,111,76,${l.opacity})`;context.beginPath();context.ellipse(0,0,l.size,l.size*.38,0,0,Math.PI*2);context.fill();context.restore();if(l.x>width+20){l.x=-20;l.y=Math.random()*height*.66;} }
      frame=requestAnimationFrame(draw);
    };
    resize(); addEventListener("resize",resize); frame=requestAnimationFrame(draw);
    return()=>{cancelAnimationFrame(frame);removeEventListener("resize",resize)};
  },[weather]);
  return <canvas ref={ref} className="weather-canvas" aria-hidden="true" />;
}

function useNatureAudio(entered:boolean, weather:Weather, mix:Record<string,number>) {
  const audio = useRef<{ctx:AudioContext; gains:GainNode[]} | null>(null);
  useEffect(()=>{
    if(!entered || audio.current) return;
    const AudioCtx = window.AudioContext || (window as typeof window & {webkitAudioContext:typeof AudioContext}).webkitAudioContext;
    const ctx = new AudioCtx();
    const makeNoise=(seconds:number, color:"rain"|"river"|"wind"|"fire", level:number)=>{
      const buffer=ctx.createBuffer(1,ctx.sampleRate*seconds,ctx.sampleRate);const data=buffer.getChannelData(0);let brown=0;
      for(let i=0;i<data.length;i++){const white=Math.random()*2-1;brown=(brown+.02*white)/1.02;data[i]=color==="fire"?(Math.random()<.002?white*.9:brown*.08):color==="river"?brown*2.2:white*.35;}
      const source=ctx.createBufferSource();source.buffer=buffer;source.loop=true;
      const filter=ctx.createBiquadFilter();filter.type=color==="wind"?"bandpass":color==="fire"?"lowpass":"highpass";filter.frequency.value=color==="wind"?420:color==="fire"?1100:color==="river"?620:2400;filter.Q.value=color==="wind"?.7:.25;
      const gain=ctx.createGain();gain.gain.value=level;source.connect(filter).connect(gain).connect(ctx.destination);source.start();return gain;
    };
    audio.current={ctx,gains:[makeNoise(5,"fire",.012),makeNoise(7,"river",.018),makeNoise(6,"wind",.004),makeNoise(5,"rain",.012)]};
    return()=>{ctx.close();audio.current=null};
  },[entered]);
  useEffect(()=>{
    if(!audio.current)return;const {ctx,gains}=audio.current;const rainFactor=weather==="monsoon"?1.45:weather==="rain"?1:weather==="drizzle"?.38:0;
    const targets=[mix.Bonfire*.00028,mix.River*.00042,mix.Wind*.00022*(weather==="wind"?2.2:1),mix.Rain*.00038*rainFactor];
    gains.forEach((g,i)=>g.gain.linearRampToValueAtTime(targets[i],ctx.currentTime+2.2));
  },[weather,mix]);
}

function Icon({ name }: { name: "play" | "pause" | "next" | "prev" | "heart" | "close" | "volume" }) {
  const paths = {
    play: <path d="M9 6l10 6-10 6V6z" fill="currentColor" />,
    pause: <><path d="M8 6h3v12H8zM14 6h3v12h-3z" fill="currentColor" /></>,
    next: <><path d="M7 6l8 6-8 6V6z" fill="currentColor" /><path d="M16 6h2v12h-2z" fill="currentColor" /></>,
    prev: <><path d="M17 6l-8 6 8 6V6z" fill="currentColor" /><path d="M6 6h2v12H6z" fill="currentColor" /></>,
    heart: <path d="M12 20s-7-4.3-7-9a4 4 0 017-2.6A4 4 0 0119 11c0 4.7-7 9-7 9z" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    close: <path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    volume: <><path d="M5 10v4h3l4 4V6L8 10H5z" fill="currentColor" /><path d="M15 9a4 4 0 010 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

function VinylPlayer({ artwork, title, isPlaying }: { artwork: string; title: string; isPlaying: boolean }) {
  const disc = useRef<HTMLDivElement>(null);
  const motion = useRef<Animation | null>(null);
  const ramp = useRef<number | null>(null);
  useEffect(() => {
    if (!disc.current) return;
    motion.current = disc.current.animate([{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }], { duration: 10500, iterations: Infinity });
    motion.current.pause();
    return () => { motion.current?.cancel(); if (ramp.current) cancelAnimationFrame(ramp.current); };
  }, []);
  useEffect(() => {
    const animation = motion.current;
    if (!animation) return;
    if (ramp.current) cancelAnimationFrame(ramp.current);
    if (isPlaying) {
      animation.playbackRate = Math.max(animation.playbackRate, .18); animation.play();
      const accelerate = () => { if (!motion.current || !isPlaying) return; motion.current.playbackRate = Math.min(1, motion.current.playbackRate + .045); if (motion.current.playbackRate < 1) ramp.current = requestAnimationFrame(accelerate); };
      ramp.current = requestAnimationFrame(accelerate);
    } else {
      const decelerate = () => { if (!motion.current) return; motion.current.playbackRate = Math.max(0, motion.current.playbackRate - .035); if (motion.current.playbackRate > 0) ramp.current = requestAnimationFrame(decelerate); else motion.current.pause(); };
      ramp.current = requestAnimationFrame(decelerate);
    }
  }, [isPlaying]);
  return <div className={`turntable ${isPlaying ? "is-playing" : "is-paused"}`}>
    <div ref={disc} className="vinyl-disc"><div className="vinyl-label" style={{ backgroundImage: `url(${artwork})` }}><span className="sr-only">{title} record</span></div></div>
    <div className="tonearm" aria-hidden="true"><i className="tonearm-pivot" /><i className="tonearm-rail" /><i className="tonearm-head" /></div>
  </div>;
}

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [weather, setWeather] = useState<Weather>("rain");
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(.82);
  const [liked, setLiked] = useState(false);
  const [toast, setToast] = useState("");
  const [mix, setMix] = useState(initialMix);
  const [quote, setQuote] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = tracks[track];
  useNatureAudio(entered, weather, mix);

  useEffect(() => {
    const stored = localStorage.getItem("you-feel-like-home-preferences");
    if (stored) {
      try {
        const saved = JSON.parse(stored);
        if (saved.weather) setWeather(saved.weather);
        if (saved.mix) setMix(saved.mix);
        if (saved.returning) setToast("Your table’s still here.");
      } catch { /* a quiet reset is better than a broken night */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("you-feel-like-home-preferences", JSON.stringify({ weather, mix, returning: entered }));
  }, [weather, mix, entered]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load(); setElapsed(0); setDuration(0); setProgress(0);
    if (playing) void audio.play().catch(() => setPlaying(false));
  }, [track]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) void audio.play().catch(() => setPlaying(false)); else audio.pause();
  }, [playing]);

  useEffect(() => {
    if (!entered) return;
    const id = setInterval(() => setQuote((q) => (q + 1) % loveLines.length), 11000);
    return () => clearInterval(id);
  }, [entered]);

  const notify = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2800);
  };

  const chooseWeather = (key: Weather) => {
    setWeather(key);
    setPanel(null);
    const copy: Record<Weather, string> = { clear: "The sky opened up.", drizzle: "Just a little drizzle.", rain: "Baarish aa gayi.", monsoon: "The valley slipped into cloud.", fog: "It’s colder tonight.", wind: "The deodars are restless." };
    notify(copy[key]);
  };

  const changeTrack = (delta: number) => {
    setTrack((previous) => (previous + delta + tracks.length) % tracks.length);
    setProgress(0);
    document.documentElement.animate([{ filter: "brightness(1)" }, { filter: "brightness(1.09)" }, { filter: "brightness(1)" }], { duration: 900 });
  };

  const chooseTrack = (index: number) => { setTrack(index); setPlaying(true); setPanel(null); };
  const seek = (value: number) => { const audio = audioRef.current; if (!audio || !duration) return; audio.currentTime = value / 100 * duration; };
  const formatTime = (seconds: number) => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2,"0")}` : "0:00";

  const share = async () => {
    const text = `I saved you a seat beyond the last road. 🌙 ${current.title} is playing while it’s ${weather === "rain" ? "raining" : weather}.`;
    try {
      if (navigator.share) await navigator.share({ title: "You feel like home.", text, url: location.href });
      else { await navigator.clipboard.writeText(`${text} ${location.href}`); notify("A seat has been saved."); }
    } catch { /* share was dismissed */ }
  };

  return (
    <main className={`cafe weather-${weather} ${entered ? "is-entered" : "is-arriving"}`}>
      <div className="scene" role="img" aria-label="A hidden open-air café above a mountain stream in an endless night">
        <SeamlessBackgroundVideo />
        <div className="clouds" /><div className="fog fog-a" /><div className="fog fog-b" />
        <div className="river-shimmer" />
        <button className="fire" aria-label="Warm the bonfire" onClick={() => { notify("That’s better."); document.querySelector(".fire")?.classList.add("stoked"); setTimeout(() => document.querySelector(".fire")?.classList.remove("stoked"), 2500); }}><span className="heat" /><span className="ember e1" /><span className="ember e2" /></button>
        <button className="free-chair" onClick={() => notify("This one’s free.")} aria-label="An empty chair"><span>This one’s free.</span></button>
        <WeatherCanvas weather={weather} />
        <div className="wet-sheen" /><div className="grain" /><div className="vignette" />
      </div>

      <section className="entry" aria-hidden={entered}>
        <p className="eyebrow">Somewhere beyond the last road</p>
        <h1>The night found us.<br /><em>The fire kept us here.</em></h1>
        <p className="entry-note">It’s cold outside. Come in.</p>
        <button className="enter-button" onClick={() => { setEntered(true); setPlaying(true); notify("Take your time."); }}>Enter café <span>→</span></button>
        <small>Sound begins only when you enter</small>
      </section>

      <header className="topbar">
        <button className="brand" onClick={() => notify("You feel like home.")} aria-label="You feel like home"><span>Y</span>YOU FEEL LIKE HOME.<small>Somewhere after dark</small></button>
        <nav aria-label="Café controls">
          <button onClick={() => setPanel(panel === "playlist" ? null : "playlist")}>Playing in the café</button>
          <button onClick={() => setPanel(panel === "weather" ? null : "weather")}><span className="weather-dot" /> Mausam</button>
          <button onClick={() => setPanel(panel === "ambience" ? null : "ambience")}>Ambience</button>
          <button onClick={share}>Save a seat <span className="arrow">↗</span></button>
        </nav>
      </header>

      <aside className={`drawer ${panel ? "open" : ""}`} aria-hidden={!panel}>
        <div className="drawer-head">
          <div><p>{panel === "playlist" ? "Beyond the last road" : panel === "weather" ? "Choose your night" : "Nature, nearby"}</p><h2>{panel === "playlist" ? "Playing by the fire" : panel === "weather" ? "Mausam" : "Ambience"}</h2></div>
          <button className="icon-button" onClick={() => setPanel(null)} aria-label="Close panel"><Icon name="close" /></button>
        </div>
        {panel === "playlist" && <div className="track-list">{tracks.map((item, i) => <button key={item.id} className={i === track ? "active" : ""} onClick={() => chooseTrack(i)}><span className="track-no">{i === track && playing ? <b className="wave">▮▮▮</b> : String(i + 1).padStart(2, "0")}</span><span><strong>{item.title}</strong><small>{item.artist}</small></span><time>{item.format.toUpperCase()}</time></button>)}</div>}
        {panel === "weather" && <div className="weather-list"><div className="mode-switch"><button className="selected">Choose my mood</button><button onClick={() => notify("Live weather is coming soon.")}>Live Mausam</button></div>{weatherOptions.map((item) => <button key={item.key} className={weather === item.key ? "active" : ""} onClick={() => chooseWeather(item.key)}><span className={`weather-symbol ${item.key}`} /><span><strong>{item.label}</strong><small>{item.note}</small></span>{weather === item.key && <i>Now</i>}</button>)}</div>}
        {panel === "ambience" && <div className="mixer">{Object.entries(mix).map(([name, value]) => <label key={name}><span><strong>{name}</strong><small>{value === 0 ? "off" : `${value}%`}</small></span><input aria-label={`${name} ambience level`} type="range" min="0" max="100" value={value} onChange={(e) => setMix({ ...mix, [name]: Number(e.target.value) })} /></label>)}<p>Music stays in front. The night stays close.</p></div>}
      </aside>
      {panel && <button className="scrim" aria-label="Close panel" onClick={() => setPanel(null)} />}

      <section className="player" aria-label="Now playing">
        <audio ref={audioRef} preload="metadata" onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onTimeUpdate={(event) => { const audio=event.currentTarget; setElapsed(audio.currentTime); setProgress(audio.duration ? audio.currentTime/audio.duration*100 : 0); }} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>changeTrack(1)} onError={()=>notify("This track could not be loaded.")}><source src={current.src} type={current.format === "mp4" ? "video/mp4" : "audio/mpeg"} /></audio>
        <VinylPlayer artwork={current.artwork} title={current.title} isPlaying={playing} />
        <div className="song"><small>Now playing · {current.mood}</small><strong>{current.title}</strong><span>{current.artist}</span></div>
        <div className="transport">
          <button className={liked ? "liked" : ""} aria-label="Like this song" onClick={() => setLiked(!liked)}><Icon name="heart" /></button>
          <button aria-label="Previous song" onClick={() => changeTrack(-1)}><Icon name="prev" /></button>
          <button className="play" aria-label={playing ? "Pause music" : "Play music"} onClick={() => setPlaying(!playing)}><Icon name={playing ? "pause" : "play"} /></button>
          <button aria-label="Next song" onClick={() => changeTrack(1)}><Icon name="next" /></button>
          <label className="volume-control" aria-label="Music volume"><Icon name="volume" /><input type="range" min="0" max="1" step=".01" value={volume} onChange={(event)=>setVolume(Number(event.target.value))} /></label>
        </div>
        <div className="timeline"><time>{formatTime(elapsed)}</time><input aria-label="Song position" type="range" min="0" max="100" value={progress} onChange={(e) => seek(Number(e.target.value))} /><time>{formatTime(duration)}</time></div>
      </section>
      <div className="love-line" aria-live="polite" key={quote}>{loveLines[quote]}</div>
      <div className={`toast ${toast ? "show" : ""}`} role="status">{toast}</div>
      <div className="location"><span>11:47 PM</span><i /> Past the last light, somewhere quiet</div>
    </main>
  );
}
