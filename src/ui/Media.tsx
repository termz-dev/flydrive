import Image from "next/image";
import { CityScene, RoadScene } from "./SceneArt";

/**
 * Image slots. Set a path (relative to /public) to replace an illustration with a real photo.
 * Only use photos Flydrive owns or has licensed, with consent from anyone pictured.
 */
export const MEDIA: Record<"hero" | "packages" | "why", { src: string | null; alt: string }> = {
  hero: { src: null, alt: "A professional driver on the road at golden hour" },
  packages: { src: null, alt: "Lagos skyline across the water" },
  why: { src: null, alt: "Evening traffic over a bridge in Lagos" },
};

export function Media({
  slot,
  priority = false,
  sizes = "100vw",
}: {
  slot: keyof typeof MEDIA;
  priority?: boolean;
  sizes?: string;
}) {
  const { src, alt } = MEDIA[slot];
  if (src) return <Image src={src} alt={alt} fill priority={priority} sizes={sizes} />;
  return slot === "hero" ? <RoadScene /> : <CityScene />;
}
