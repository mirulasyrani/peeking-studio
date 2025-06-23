// src/components/GalleryCard.tsx
import { Link } from 'react-router-dom';

interface GalleryCardProps {
  name: string;
  folder: string;
  preview: string;
}

export default function GalleryCard({ name, folder, preview }: GalleryCardProps) {
  return (
    <Link
      to={`/gallery/${folder}`}
      className="block group shadow-lg rounded-xl overflow-hidden bg-white hover:shadow-xl transition"
    >
      <div className="relative w-full h-80 overflow-hidden">
        <img
          src={preview}
          alt={name}
          className="w-full h-full object-cover brightness-75 group-hover:scale-105 transition-transform duration-500"
        />
        <div
          className="absolute bottom-0 left-0 w-full px-4 py-3 text-white text-xl text-center font-newsreader tracking-wide bg-black/40
          translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out"
        >
          {name}
        </div>
      </div>
    </Link>
  );
}
