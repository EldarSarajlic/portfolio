import { useState } from "react";

type Props = {
  src: string;
  fallback: string;
  name: string;
  className?: string;
};

export default function OrgLogo({ src, fallback, name, className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={`relative grid place-items-center w-28 h-28 md:w-36 md:h-36 shrink-0 ${className}`}
      aria-label={`${name} logo`}
    >
      {!failed ? (
        <img
          src={src}
          alt={`${name} logo`}
          width="144"
          height="144"
          loading="lazy"
          onError={() => setFailed(true)}
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <span className="font-display text-mint-400 text-2xl font-bold tracking-tight">
          {fallback}
        </span>
      )}
    </div>
  );
}
