import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import './App.css'
import {asset} from './assets/asset'

function useReveal(threshold = 0.35) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => setShow(entry.isIntersecting),
      { threshold }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, show };
}

function Header() {
  const linkBase =
    "text-[#f19d47] visited:text-[#f19d47] hover:text-[#e98a2f] focus:text-[#e98a2f] active:text-[#e98a2f] " +
    "no-underline decoration-transparent transition-colors duration-300 focus:outline-none";

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#f19d47]/30">
      <div className="w-screen px-12 xl:px-24 h-20 flex items-center">
        <a href="/" className="shrink-0">
          <img src={asset.logo} alt="PROYA 로고" className="h-10 w-auto object-contain" />
        </a>
        <nav className="absolute left-1/2 -translate-x-1/2">
          <ul className="flex items-center gap-12 text-lg font-semibold tracking-wide">
            <li><a href="#home" className={linkBase}>홈</a></li>
            <li><a href="#about" className={linkBase}>소개</a></li>
            <li><a href="#contact" className={linkBase}>문의</a></li>
          </ul>
        </nav>
        <div className="ml-auto w-10" />
      </div>
    </header>
  );
}

function CarouselFull() {
  const slides = [
    { img: "/img1.jpg", titleKo: "PROYA 5X 비타민C 스킨케어 세트", desc: "피부 톤을 균일하게 밝혀주고, 탄력과 생기를 채워주는 비타민C 케어 세트. 한 세트로 완성하는 투명하고 건강한 광채 피부" },
    { img: "/img2.jpg", titleKo: "PROYA 5X 비타민C 클렌저", desc: "부드럽고 풍성한 거품이 노폐물을 깨끗하게 제거하고, 피부 본연의 생기를 되찾아 줍니다,   맑고 환한 피부의 첫 단계." },
    { img: "/img3.jpg", titleKo: "PROYA 5X 비타민C 세럼", desc: "고농축 비타민C 복합체가 피부 깊숙이 흡수되어 피부 톤을 맑게 하고 탄력을 채워 줍니다. 환하고 빛나는 피부로." },
    { img: "/img4.jpg", titleKo: "PROYA 5X 비타민C 크림", desc: "부드럽게 녹아드는 텍스처가 수분과 영양을 채워 피부를 촉촉하고 탄력 있게 유지시켜 줍니다. 건강한 광채의 완성." },
    { img: "/img5.jpg", titleKo: "PROYA 5X 비타민C 미스트토너", desc: "세안 후 또는 메이크업 위에도 산뜻하게! 수분과 영양을 즉시 공급하며 피부를 진정시켜 줍니다. 언제 어디서나 빛나는 수분 광채." },
    { img: "/img6.jpg", titleKo: "PROYA 5X 비타민C 아이크림", desc: "가벼운 제형이 눈가에 빠르게 흡수되어 다크서클과 미세한 주름을 완화합니다. 밝고 생기 있는 눈가 케어." },
  ];

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animate, setAnimate] = useState(false);         
  const AUTOPLAY_MS = 5500;                               
  const ENTER_DELAY_MS = 180;                              
  const REARM_DELAY_MS = 60;                               

  useEffect(() => {
    const t = setTimeout(() => setAnimate(true), ENTER_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      reanimateTo((index + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, index, slides.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") reanimateTo((index + 1) % slides.length);
      if (e.key === "ArrowLeft") reanimateTo((index - 1 + slides.length) % slides.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, slides.length]);

  const reanimateTo = (next) => {
    setAnimate(false);                     
    setTimeout(() => {
      setIndex(next);                       
      setTimeout(() => setAnimate(true), REARM_DELAY_MS); 
    }, REARM_DELAY_MS);
  };

  return (
    <section id="home" className="relative h-screen w-screen overflow-hidden">
      <div
        className="h-full w-full"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((s, i) => {
          const offset = (i - index + slides.length) % slides.length;
          return (
            <div
              key={s.img}
              className="absolute inset-0 transition-transform duration-700 ease-out will-change-transform"
              style={{ transform: `translateX(${offset * 100}%)` }}
            >
              <img src={s.img} alt={s.titleKo} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/15 pointer-events-none" />
            </div>
          );
        })}
      </div>
      <div className="absolute left-6 md:left-10 bottom-10 md:bottom-14 max-w-[90vw] md:max-w-2xl">
        <h3
          key={slides[index].titleKo}
          className={
            "text-2xl md:text-4xl font-bold tracking-tight text-black " +
            "transition-all duration-[1100ms] ease-out " +
            (animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10")
          }
        >
          {slides[index].titleKo}
        </h3>
        <p
          key={slides[index].desc}
          className={
            "mt-2 text-sm md:text-xl text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] " +
            "transition-all duration-[1000ms] ease-out delay-200 " +
            (animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6")
          }
        >
          {slides[index].desc}
        </p>
      </div>
      <button
        aria-label="이전"
        onClick={() => reanimateTo((index - 1 + slides.length) % slides.length)}
        className="absolute left-6 top-1/2 -translate-y-1/2 grid place-items-center rounded-full bg-white/80 hover:bg-[#f19d47]/90 hover:text-white text-[#f19d47] shadow-lg size-12 text-2xl"
      >
        ‹
      </button>
      <button
        aria-label="다음"
        onClick={() => reanimateTo((index + 1) % slides.length)}
        className="absolute right-6 top-1/2 -translate-y-1/2 grid place-items-center rounded-full bg-white/80 hover:bg-[#f19d47]/90 hover:text-white text-[#f19d47] shadow-lg size-12 text-2xl"
      >
        ›
      </button>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => reanimateTo(i)}
            className={`h-3 w-3 rounded-full transition ${i === index ? "bg-[#f19d47]" : "bg-white/70 hover:bg-[#f19d47]/60"}`}
            aria-label={`${i + 1}번 슬라이드로 이동`}
          />
        ))}
      </div>
    </section>
  );
}

function BestSellerReveal() {
  const { ref, show } = useReveal(0.3);
  return (
    <section ref={ref} className="py-28 bg-white">
      <div className="w-screen px-12 xl:px-24 text-center">
        <h2 className={`text-[clamp(40px,5vw,70px)] font-bold tracking-tight text-[#f19d47] transform transition-all duration-700 ease-out
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          베스트셀러
        </h2>
        <p className={`mt-6 text-4xl text-slate-600 transform transition-all duration-700 ease-out delay-150
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          지금 가장 사랑받는 PROYA의 대표 제품을 만나보세요.
        </p>
      </div>
    </section>
  );
}

function AboutReveal() {
  const { ref, show } = useReveal(0.25);
  return (
    <section id="about" ref={ref} className="py-24 bg-[#fff7f2]">
      <div className="w-screen px-12 xl:px-24 text-center md:text-left">
        <h3 className={`text-3xl font-semibold mb-4 text-[#f19d47] transform transition-all duration-700 ease-out
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          PROYA 소개
        </h3>
        <p className={`text-[#f19d47]/90 text-lg leading-relaxed max-w-4xl transform transition-all duration-700 ease-out delay-150
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          PROYA는 5X 비타민 C 포뮬러로 피부 본연의 투명함과 생기를 되찾아주는 스킨케어 브랜드입니다.
          매일의 루틴 속에서 자연스럽게 빛나는 피부를 선사합니다.
        </p>
      </div>
    </section>
  );
}

function ContactReveal() {
  const { ref, show } = useReveal(0.25);
  return (
    <section id="contact" ref={ref} className="py-24 bg-[#f19d47]/5">
      <div className="w-screen px-12 xl:px-24 text-center md:text-left">
        <h3 className={`text-3xl font-semibold mb-4 text-[#f19d47] transform transition-all duration-700 ease-out
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          문의하기
        </h3>
        <p className={`text-[#f19d47]/90 text-lg transform transition-all duration-700 ease-out delay-150
          ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          인스타그램: proya_kr
        </p>
      </div>
    </section>
  );
}

function SplitTwoImages() {
  return (
    <section className="bg-white p-0 m-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-none">
        {/* Left side */}
        <div className="relative h-[70vh] w-full">
          <img
            src="/left.jpg"
            alt="왼쪽 이미지"
            className="absolute inset-0 w-full h-full object-cover block"
          />
        </div>

        {/* Right side */}
        <div className="relative h-[70vh] w-full">
          <img
            src="/right.jpg"
            alt="오른쪽 이미지"
            className="absolute inset-0 w-full h-full object-cover block"
          />
        </div>
      </div>
    </section>
  );
}


export default function App(){
   useLayoutEffect(() => {
    try {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
    } catch (_) {}
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    const onPageShow = (e) => {
      if (e.persisted) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    };
    window.addEventListener("pageshow", onPageShow);
     const onBeforeUnload = () => window.scrollTo(0, 0);
    window.addEventListener("beforeunload", onBeforeUnload);
        return () => {
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, []);

  return (<div className="min-h-screen bg-white text-[#f19d47] font-sans">
    <Header/>
    <main>
    <CarouselFull/>
    <BestSellerReveal/>
    <SplitTwoImages/>
    <AboutReveal/>
    <ContactReveal/>
    </main>
    <footer className="border-t border-[#f19d47]/30 py-10 bg-white text-center">
        <p className="text-sm text-[#f19d47]/80">
          © {new Date().getFullYear()} PROYA. 모든 권리 보유.
        </p>
      </footer>
  </div>)
}

