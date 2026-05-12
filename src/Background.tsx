import { useEffect, useRef } from "react";
import "./Background.css";

type HeartBackgroundProps = {
  country?: string;
};

type SceneImages = {
  heart: ImageBitmap;
};

type HeartLayer = {
  x: number;
  y: number;
  width: number;
  alpha: number;
  blur: number;
  driftX: number;
  driftY: number;
  parallax: number;
  phase: number;
  pulse: number;
  rotation: number;
  rotateDrift: number;
  speed: number;
};

type PointerState = {
  active: boolean;
  influence: number;
  targetX: number;
  targetY: number;
  x: number;
  y: number;
};

const brandBase = `${import.meta.env.BASE_URL}brand/`;
const heartSource = {
  x: 1600,
  y: 484,
  width: 1156,
  height: 1192,
};

const countryGlow: Record<string, string> = {
  AT: "rgba(255, 18, 72, 0.28)",
  CH: "rgba(255, 18, 72, 0.24)",
  DE: "rgba(245, 215, 123, 0.22)",
  ES: "rgba(255, 214, 49, 0.22)",
  FR: "rgba(36, 98, 255, 0.22)",
  GB: "rgba(40, 116, 255, 0.22)",
  IT: "rgba(15, 210, 120, 0.18)",
  SE: "rgba(55, 159, 255, 0.24)",
  UA: "rgba(55, 159, 255, 0.24)",
};

const createPointerState = (): PointerState => ({
  active: false,
  influence: 0,
  targetX: 0.5,
  targetY: 0.5,
  x: 0.5,
  y: 0.5,
});

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const smoothPointer = (pointer: PointerState, enableMotion: boolean) => {
  if (!enableMotion) {
    pointer.influence = 0;
    pointer.targetX = 0.5;
    pointer.targetY = 0.5;
    pointer.x = 0.5;
    pointer.y = 0.5;
    return;
  }

  const positionEase = pointer.active ? 0.11 : 0.075;
  const targetInfluence = pointer.active ? 1 : 0;

  pointer.x += (pointer.targetX - pointer.x) * positionEase;
  pointer.y += (pointer.targetY - pointer.y) * positionEase;
  pointer.influence += (targetInfluence - pointer.influence) * 0.08;
};

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load ${src}`));
    image.src = src;
  });

const loadHeartBitmap = async (): Promise<ImageBitmap> => {
  const image = await loadImage(`${brandBase}eurovision-70-layered-heart.png`);

  return createImageBitmap(
    image,
    heartSource.x,
    heartSource.y,
    heartSource.width,
    heartSource.height
  );
};

const fillRadial = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  x: number,
  y: number,
  radius: number,
  color: string
) => {
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.42, color.replace(/[\d.]+\)$/, "0.11)"));
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
};

const drawBase = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  country: string,
  pointer: PointerState,
  time: number,
  enableMotion: boolean
) => {
  const drift = enableMotion ? Math.sin(time * 0.00018) : 0;
  const pointerX = pointer.influence * (pointer.x - 0.5);
  const pointerY = pointer.influence * (pointer.y - 0.5);
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#000b45");
  gradient.addColorStop(0.38, "#00072f");
  gradient.addColorStop(0.72, "#02043a");
  gradient.addColorStop(1, "#150050");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  fillRadial(
    context,
    width,
    height,
    width * (0.9 + pointerX * 0.018),
    height * (0.04 + pointerY * 0.014),
    Math.max(width, height) * 0.64,
    "rgba(34, 15, 255, 0.72)"
  );
  fillRadial(
    context,
    width,
    height,
    width * (0.04 + drift * 0.018),
    height * (0.94 + pointerY * 0.012),
    Math.max(width, height) * 0.62,
    "rgba(255, 0, 116, 0.55)"
  );
  fillRadial(
    context,
    width,
    height,
    width * (0.72 + pointerX * 0.04),
    height * (0.4 + pointerY * 0.035),
    Math.max(width, height) * 0.36,
    countryGlow[country] ?? "rgba(255, 18, 104, 0.18)"
  );

  const vignette = context.createRadialGradient(
    width * 0.5,
    height * 0.47,
    Math.min(width, height) * 0.1,
    width * 0.5,
    height * 0.47,
    Math.max(width, height) * 0.78
  );
  vignette.addColorStop(0, "rgba(0, 0, 0, 0)");
  vignette.addColorStop(0.74, "rgba(0, 0, 20, 0.2)");
  vignette.addColorStop(1, "rgba(0, 0, 14, 0.55)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, width, height);
};

const drawHeartLayer = (
  context: CanvasRenderingContext2D,
  image: ImageBitmap,
  layer: HeartLayer,
  pointer: PointerState,
  time: number,
  enableMotion: boolean
) => {
  const t = time * 0.001 * layer.speed + layer.phase;
  const pointerX = enableMotion ? pointer.influence * (pointer.x - 0.5) : 0;
  const pointerY = enableMotion ? pointer.influence * (pointer.y - 0.5) : 0;
  const floatX = enableMotion ? Math.sin(t) * layer.driftX : 0;
  const floatY = enableMotion ? Math.cos(t * 0.84) * layer.driftY : 0;
  const scale = enableMotion ? 1 + Math.sin(t * 0.62) * layer.pulse : 1;
  const drawWidth = layer.width * scale;
  const height = drawWidth * (image.height / image.width);
  const x = layer.x + floatX + pointerX * layer.parallax;
  const y = layer.y + floatY + pointerY * layer.parallax * 0.72;
  const rotation =
    layer.rotation +
    (enableMotion ? Math.sin(t * 0.52) * layer.rotateDrift : 0) +
    pointerX * layer.rotateDrift * 0.45;
  const alpha =
    layer.alpha * (enableMotion ? 0.95 + Math.sin(t * 0.66) * 0.05 : 1);

  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  context.globalAlpha = alpha;
  context.filter = layer.blur > 0 ? `blur(${layer.blur}px)` : "none";
  context.drawImage(image, -drawWidth / 2, -height / 2, drawWidth, height);
  context.restore();
};

const getHeartLayers = (width: number, height: number): HeartLayer[] => {
  const sceneSize = Math.max(width, height);
  const isCompact = width < 760;

  if (isCompact) {
    return [
      {
        x: width * 1.02,
        y: height * 0.72,
        width: sceneSize * 0.62,
        alpha: 0.9,
        blur: 0,
        driftX: sceneSize * 0.012,
        driftY: sceneSize * 0.018,
        parallax: sceneSize * -0.02,
        phase: 0.4,
        pulse: 0.012,
        rotation: -0.02,
        rotateDrift: 0.018,
        speed: 0.28,
      },
      {
        x: width * -0.06,
        y: height * 0.04,
        width: sceneSize * 0.62,
        alpha: 0.78,
        blur: 0,
        driftX: sceneSize * 0.01,
        driftY: sceneSize * 0.012,
        parallax: sceneSize * 0.014,
        phase: 2.3,
        pulse: 0.009,
        rotation: -0.5,
        rotateDrift: 0.012,
        speed: 0.22,
      },
      {
        x: width * 0.23,
        y: height * 0.58,
        width: width * 0.3,
        alpha: 0.58,
        blur: 6,
        driftX: width * 0.05,
        driftY: height * 0.035,
        parallax: width * 0.026,
        phase: 4.4,
        pulse: 0.022,
        rotation: -0.05,
        rotateDrift: 0.04,
        speed: 0.38,
      },
    ];
  }

  return [
    {
      x: width * -0.05,
      y: height * 0.02,
      width: sceneSize * 0.5,
      alpha: 0.88,
      blur: 0,
      driftX: sceneSize * 0.015,
      driftY: sceneSize * 0.012,
      parallax: sceneSize * 0.02,
      phase: 1.2,
      pulse: 0.01,
      rotation: -0.52,
      rotateDrift: 0.014,
      speed: 0.2,
    },
    {
      x: width * 1.03,
      y: height * 0.57,
      width: sceneSize * 0.52,
      alpha: 0.94,
      blur: 0,
      driftX: sceneSize * 0.012,
      driftY: sceneSize * 0.018,
      parallax: sceneSize * -0.024,
      phase: 2.9,
      pulse: 0.012,
      rotation: -0.02,
      rotateDrift: 0.018,
      speed: 0.24,
    },
    {
      x: width * 0.12,
      y: height * 0.6,
      width: width * 0.12,
      alpha: 0.62,
      blur: 7,
      driftX: width * 0.035,
      driftY: height * 0.04,
      parallax: width * 0.028,
      phase: 0.2,
      pulse: 0.028,
      rotation: -0.08,
      rotateDrift: 0.04,
      speed: 0.42,
    },
    {
      x: width * 0.75,
      y: height * 0.15,
      width: width * 0.12,
      alpha: 0.5,
      blur: 8,
      driftX: width * 0.025,
      driftY: height * 0.034,
      parallax: width * -0.024,
      phase: 3.4,
      pulse: 0.025,
      rotation: 0.05,
      rotateDrift: 0.035,
      speed: 0.35,
    },
    {
      x: width * 0.63,
      y: height * 0.78,
      width: width * 0.07,
      alpha: 0.55,
      blur: 5,
      driftX: width * 0.02,
      driftY: height * 0.032,
      parallax: width * 0.02,
      phase: 5.1,
      pulse: 0.032,
      rotation: 0.12,
      rotateDrift: 0.05,
      speed: 0.5,
    },
  ];
};

const drawScene = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  images: SceneImages,
  country: string,
  pointer: PointerState,
  time = performance.now(),
  enableMotion = true
) => {
  const bounds = canvas.getBoundingClientRect();
  const width = Math.max(1, Math.round(bounds.width));
  const height = Math.max(1, Math.round(bounds.height));
  const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
  const canvasWidth = Math.round(width * dpr);
  const canvasHeight = Math.round(height * dpr);

  if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";

  drawBase(context, width, height, country, pointer, time, enableMotion);
  getHeartLayers(width, height).forEach((layer) =>
    drawHeartLayer(context, images.heart, layer, pointer, time, enableMotion)
  );
};

const HeartBackground = ({ country = "AT" }: HeartBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<SceneImages | null>(null);
  const countryRef = useRef(country);
  const pointerRef = useRef<PointerState>(createPointerState());
  const motionEnabledRef = useRef(true);

  useEffect(() => {
    countryRef.current = country;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (canvas && context && imagesRef.current) {
      drawScene(
        canvas,
        context,
        imagesRef.current,
        countryRef.current,
        pointerRef.current,
        performance.now(),
        motionEnabledRef.current
      );
    }
  }, [country]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return undefined;
    }

    let disposed = false;
    let frame = 0;
    let lastFrameTime = 0;
    const targetFrameMs = 1000 / 36;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    motionEnabledRef.current = !motionQuery.matches;

    const render = (time = performance.now()) => {
      if (!imagesRef.current) {
        return;
      }

      smoothPointer(pointerRef.current, motionEnabledRef.current);
      drawScene(
        canvas,
        context,
        imagesRef.current,
        countryRef.current,
        pointerRef.current,
        time,
        motionEnabledRef.current
      );
    };

    const animate = (time: number) => {
      if (disposed) {
        return;
      }

      if (
        document.visibilityState === "visible" &&
        time - lastFrameTime > targetFrameMs
      ) {
        lastFrameTime = time;
        render(time);
      }

      frame = requestAnimationFrame(animate);
    };

    const scheduleRender = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame((time) => {
        lastFrameTime = time;
        render(time);
        if (motionEnabledRef.current) {
          frame = requestAnimationFrame(animate);
        }
      });
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current.active = true;
      pointerRef.current.targetX = clamp01(event.clientX / window.innerWidth);
      pointerRef.current.targetY = clamp01(event.clientY / window.innerHeight);
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.targetX = 0.5;
      pointerRef.current.targetY = 0.5;
    };

    const handleMotionPreference = () => {
      motionEnabledRef.current = !motionQuery.matches;
      scheduleRender();
    };

    loadHeartBitmap().then((heart) => {
      if (disposed) {
        heart.close();
        return;
      }

      imagesRef.current = { heart };
      render();
      window.addEventListener("resize", scheduleRender);
      window.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });
      window.addEventListener("pointerleave", handlePointerLeave);
      window.visualViewport?.addEventListener("resize", scheduleRender);
      motionQuery.addEventListener("change", handleMotionPreference);
      if (motionEnabledRef.current) {
        frame = requestAnimationFrame(animate);
      }
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      imagesRef.current?.heart.close();
      window.removeEventListener("resize", scheduleRender);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.visualViewport?.removeEventListener("resize", scheduleRender);
      motionQuery.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return <canvas className="stage-canvas" ref={canvasRef} aria-hidden="true" />;
};

export default HeartBackground;
