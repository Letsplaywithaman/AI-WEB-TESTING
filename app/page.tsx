"use client";

import { useEffect, useRef, useState } from "react";

type Weather = "clear" | "drizzle" | "rain" | "monsoon" | "fog" | "wind";
type Panel = "playlist" | "weather" | "ambience" | null;

const tracks = [
  { title: "Iktara", artist: "Kavita Seth", duration: "4:13", mood: "Mussoorie After Midnight" },
  { title: "Shaam", artist: "Amit Trivedi, Nikhil D'Souza", duration: "4:44", mood: "Long Drive, No Driving" },
  { title: "Kasoor", artist: "Prateek Kuhad", duration: "3:18", mood: "Hindi Indie Nights" },
  { title: "Aahista", artist: "Arijit Singh, Jonita Gandhi", duration: "5:20", mood: "2 AM Thoughts" },
  { title: "Kho Gaye Hum Kahan", artist: "Jasleen Royal, Prateek Kuhad", duration: "3:33", mood: "Khamoshi" },
  { title: "Tu Kisi Rail Si", artist: "Swanand Kirkire", duration: "3:50", mood: "Bonfire Sessions" },
  { title: "Sweet Disposition", artist: "The Temper Trap", duration: "3:51", mood: "English After Midnight" },
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

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [weather, setWeather] = useState<Weather>("rain");
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);
  const [progress, setProgress] = useState(34);
  const [liked, setLiked] = useState(false);
  const [toast, setToast] = useState("");
  const [mix, setMix] = useState(initialMix);
  const [spotifyOpen, setSpotifyOpen] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = tracks[track];
  useNatureAudio(entered, weather, mix);

  useEffect(() => {
    const stored = localStorage.getItem("raat-preferences");
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
    localStorage.setItem("raat-preferences", JSON.stringify({ weather, mix, returning: entered }));
  }, [weather, mix, entered]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setProgress((p) => p >= 100 ? 0 : p + 0.08), 1000);
    return () => clearInterval(id);
  }, [playing]);

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
    setTrack((track + delta + tracks.length) % tracks.length);
    setProgress(0);
    document.documentElement.animate([{ filter: "brightness(1)" }, { filter: "brightness(1.09)" }, { filter: "brightness(1)" }], { duration: 900 });
  };

  const share = async () => {
    const text = `I saved you a seat somewhere in Mussoorie. 🌙 ${current.title} is playing while it’s ${weather === "rain" ? "raining" : weather}.`;
    try {
      if (navigator.share) await navigator.share({ title: "Raat — Mussoorie", text, url: location.href });
      else { await navigator.clipboard.writeText(`${text} ${location.href}`); notify("A seat has been saved."); }
    } catch { /* share was dismissed */ }
  };

  return (
    <main className={`cafe weather-${weather} ${entered ? "is-entered" : "is-arriving"}`}>
      <div className="scene" role="img" aria-label="A hidden open-air café above a mountain stream in Mussoorie at night">
        <div className="scene-photo" />
        <div className="clouds" /><div className="fog fog-a" /><div className="fog fog-b" />
        <div className="river-shimmer" />
        <div className="light-string light-string-a">{Array.from({ length: 10 }, (_, i) => <i key={i} />)}</div>
        <button className="fire" aria-label="Warm the bonfire" onClick={() => { notify("That’s better."); document.querySelector(".fire")?.classList.add("stoked"); setTimeout(() => document.querySelector(".fire")?.classList.remove("stoked"), 2500); }}><span className="heat" /><span className="ember e1" /><span className="ember e2" /></button>
        <button className="free-chair" onClick={() => notify("This one’s free.")} aria-label="An empty chair"><span>This one’s free.</span></button>
        <WeatherCanvas weather={weather} />
        <div className="wet-sheen" /><div className="grain" /><div className="vignette" />
      </div>

      <section className="entry" aria-hidden={entered}>
        <p className="eyebrow">30.4598° N · 78.0644° E</p>
        <h1>Somewhere in Mussoorie,<br /><em>the café is still open.</em></h1>
        <p className="entry-note">It’s cold outside. Come in.</p>
        <button className="enter-button" onClick={() => { setEntered(true); setPlaying(true); notify("Take your time."); }}>Enter café <span>→</span></button>
        <small>Sound begins only when you enter</small>
      </section>

      <header className="topbar">
        <button className="brand" onClick={() => notify("Kahin Mussoorie mein.")} aria-label="Raat home"><span>R</span>RAAT<small>Mussoorie · after dark</small></button>
        <nav aria-label="Café controls">
          <button onClick={() => setPanel(panel === "playlist" ? null : "playlist")}>Playing in the café</button>
          <button onClick={() => setPanel(panel === "weather" ? null : "weather")}><span className="weather-dot" /> Mausam</button>
          <button onClick={() => setPanel(panel === "ambience" ? null : "ambience")}>Ambience</button>
          <button onClick={share}>Save a seat <span className="arrow">↗</span></button>
        </nav>
      </header>

      <aside className={`drawer ${panel ? "open" : ""}`} aria-hidden={!panel}>
        <div className="drawer-head">
          <div><p>{panel === "playlist" ? "Mussoorie after midnight" : panel === "weather" ? "Choose your night" : "Nature, nearby"}</p><h2>{panel === "playlist" ? "Playing in the café" : panel === "weather" ? "Mausam" : "Ambience"}</h2></div>
          <button className="icon-button" onClick={() => setPanel(null)} aria-label="Close panel"><Icon name="close" /></button>
        </div>
        {panel === "playlist" && <div className="track-list">{tracks.map((item, i) => <button key={item.title} className={i === track ? "active" : ""} onClick={() => { setTrack(i); setProgress(0); setPlaying(true); }}><span className="track-no">{i === track && playing ? <b className="wave">▮▮▮</b> : String(i + 1).padStart(2, "0")}</span><span><strong>{item.title}</strong><small>{item.artist}</small></span><time>{item.duration}</time></button>)}</div>}
        {panel === "weather" && <div className="weather-list"><div className="mode-switch"><button className="selected">Choose my mood</button><button onClick={() => notify("Live weather is coming soon.")}>Live Mausam</button></div>{weatherOptions.map((item) => <button key={item.key} className={weather === item.key ? "active" : ""} onClick={() => chooseWeather(item.key)}><span className={`weather-symbol ${item.key}`} /><span><strong>{item.label}</strong><small>{item.note}</small></span>{weather === item.key && <i>Now</i>}</button>)}</div>}
        {panel === "ambience" && <div className="mixer">{Object.entries(mix).map(([name, value]) => <label key={name}><span><strong>{name}</strong><small>{value === 0 ? "off" : `${value}%`}</small></span><input aria-label={`${name} ambience level`} type="range" min="0" max="100" value={value} onChange={(e) => setMix({ ...mix, [name]: Number(e.target.value) })} /></label>)}<p>Music stays in front. The mountain stays close.</p></div>}
      </aside>
      {panel && <button className="scrim" aria-label="Close panel" onClick={() => setPanel(null)} />}

      <section className="player" aria-label="Now playing">
        <div className="art"><span>रात</span><i /></div>
        <div className="song"><small>Now playing · {current.mood}</small><strong>{current.title}</strong><span>{current.artist}</span></div>
        <div className="transport">
          <button className={liked ? "liked" : ""} aria-label="Like this song" onClick={() => setLiked(!liked)}><Icon name="heart" /></button>
          <button aria-label="Previous song" onClick={() => changeTrack(-1)}><Icon name="prev" /></button>
          <button className="play" aria-label="Open Spotify player" onClick={() => { setSpotifyOpen(true); setPlaying(true); notify("Press play in Spotify — the café will stay open."); }}><Icon name={playing ? "pause" : "play"} /></button>
          <button aria-label="Next song" onClick={() => changeTrack(1)}><Icon name="next" /></button>
          <button aria-label="Volume"><Icon name="volume" /></button>
        </div>
        <div className="timeline"><time>{`${Math.floor(progress * 2.53 / 60)}:${String(Math.floor(progress * 2.53 % 60)).padStart(2, "0")}`}</time><input aria-label="Song position" type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(Number(e.target.value))} /><time>{current.duration}</time></div>
      </section>
      <section className={`spotify-dock ${spotifyOpen ? "open" : ""}`} aria-label="Spotify music player">
        <button className="spotify-close" onClick={()=>setSpotifyOpen(false)} aria-label="Close Spotify player"><Icon name="close" /></button>
        <iframe title="Mussoorie After Midnight on Spotify" src="https://open.spotify.com/embed/playlist/37i9dQZF1EIXllVxxOqk5P?utm_source=generator&theme=0" width="100%" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
      </section>
      <div className={`toast ${toast ? "show" : ""}`} role="status">{toast}</div>
      <div className="location"><span>11:47 PM</span><i /> Landour road, somewhere uphill</div>
    </main>
  );
}
