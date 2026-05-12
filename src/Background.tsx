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
  rotation: number;
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
  country: string
) => {
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
    width * 0.9,
    height * 0.04,
    Math.max(width, height) * 0.64,
    "rgba(34, 15, 255, 0.72)"
  );
  fillRadial(
    context,
    width,
    height,
    width * 0.04,
    height * 0.94,
    Math.max(width, height) * 0.62,
    "rgba(255, 0, 116, 0.55)"
  );
  fillRadial(
    context,
    width,
    height,
    width * 0.72,
    height * 0.4,
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
  layer: HeartLayer
) => {
  const height = layer.width * (image.height / image.width);

  context.save();
  context.translate(layer.x, layer.y);
  context.rotate(layer.rotation);
  context.globalAlpha = layer.alpha;
  context.filter = layer.blur > 0 ? `blur(${layer.blur}px)` : "none";
  context.drawImage(image, -layer.width / 2, -height / 2, layer.width, height);
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
        rotation: -0.02,
      },
      {
        x: width * -0.06,
        y: height * 0.04,
        width: sceneSize * 0.62,
        alpha: 0.78,
        blur: 0,
        rotation: -0.5,
      },
      {
        x: width * 0.23,
        y: height * 0.58,
        width: width * 0.3,
        alpha: 0.58,
        blur: 6,
        rotation: -0.05,
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
      rotation: -0.52,
    },
    {
      x: width * 1.03,
      y: height * 0.57,
      width: sceneSize * 0.52,
      alpha: 0.94,
      blur: 0,
      rotation: -0.02,
    },
    {
      x: width * 0.12,
      y: height * 0.6,
      width: width * 0.12,
      alpha: 0.62,
      blur: 7,
      rotation: -0.08,
    },
    {
      x: width * 0.75,
      y: height * 0.15,
      width: width * 0.12,
      alpha: 0.5,
      blur: 8,
      rotation: 0.05,
    },
    {
      x: width * 0.63,
      y: height * 0.78,
      width: width * 0.07,
      alpha: 0.55,
      blur: 5,
      rotation: 0.12,
    },
  ];
};

const drawScene = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  images: SceneImages,
  country: string
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

  drawBase(context, width, height, country);
  getHeartLayers(width, height).forEach((layer) =>
    drawHeartLayer(context, images.heart, layer)
  );
};

const HeartBackground = ({ country = "AT" }: HeartBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<SceneImages | null>(null);
  const countryRef = useRef(country);

  useEffect(() => {
    countryRef.current = country;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (canvas && context && imagesRef.current) {
      drawScene(canvas, context, imagesRef.current, countryRef.current);
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

    const render = () => {
      if (!imagesRef.current) {
        return;
      }

      drawScene(canvas, context, imagesRef.current, countryRef.current);
    };

    const scheduleRender = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    };

    loadHeartBitmap().then((heart) => {
      if (disposed) {
        heart.close();
        return;
      }

      imagesRef.current = { heart };
      render();
      window.addEventListener("resize", scheduleRender);
      window.visualViewport?.addEventListener("resize", scheduleRender);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      imagesRef.current?.heart.close();
      window.removeEventListener("resize", scheduleRender);
      window.visualViewport?.removeEventListener("resize", scheduleRender);
    };
  }, []);

  return <canvas className="stage-canvas" ref={canvasRef} aria-hidden="true" />;
};

export default HeartBackground;
