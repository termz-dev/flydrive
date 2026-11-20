import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Licensed photography (Pexels licence: free commercial use). Sources and production originals are
 * listed in design/DESIGN_HANDOFF.md §5. Object positions come from the design and keep faces in frame.
 * `team` shows models, not Flydrive staff: never caption it as the team.
 */
export const PHOTOS = {
  driverAtWheel: {
    src: "/images/driver-at-wheel.jpg",
    alt: "A professional driver in a grey suit at the wheel of a car",
    position: "60% 40%",
  },
  chauffeurDoor: {
    src: "/images/chauffeur-door.jpg",
    alt: "A chauffeur beside a black saloon, ready to open the door for a passenger",
    position: "50% 50%",
  },
  driverWindow: {
    src: "/images/driver-window.jpg",
    alt: "A driver in a dark suit at the wheel of a black saloon",
    position: "65% 40%",
  },
  womanDriver: {
    src: "/images/woman-driver.jpg",
    alt: "A smiling woman driving, hands on the steering wheel",
    position: "18% 40%",
  },
  family: {
    src: "/images/family.jpg",
    alt: "A smiling family in colourful Nigerian outfits walking hand in hand",
    position: "50% 30%",
  },
  happyDriver: {
    src: "/images/happy-driver.jpg",
    alt: "A smiling driver in a grey suit beside a black car",
    position: "75% 30%",
  },
  chauffeurSuv: {
    src: "/images/chauffeur-suv.jpg",
    alt: "A chauffeur in a dark suit standing beside a black SUV",
    position: "62% 50%",
  },
  traveller: {
    src: "/images/traveller.jpg",
    alt: "A traveller in a long coat walking through an airport with a suitcase",
    position: "50% 40%",
  },
  olderDriver: {
    src: "/images/older-driver.jpg",
    alt: "An experienced driver smiling at the wheel",
    position: "50% 30%",
  },
  team: {
    src: "/images/team.jpg",
    alt: "Three colleagues celebrating with a high five in an office",
    position: "50% 35%",
  },
} as const;

export type PhotoName = keyof typeof PHOTOS;

export function Photo({
  name,
  sizes,
  priority = false,
  className = "",
  children,
}: {
  name: PhotoName;
  sizes: string;
  priority?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const p = PHOTOS[name];
  return (
    <div className={`photo ${className}`.trim()}>
      <Image
        src={p.src}
        alt={p.alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectPosition: p.position }}
      />
      {children}
    </div>
  );
}
