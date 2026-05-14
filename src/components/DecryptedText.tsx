import { useEffect, useState } from "react";

type Props = {
  text: string;
  className?: string;
  speed?: number;
  iterations?: number;
};

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&?";

function rand() {
  return CHARSET[Math.floor(Math.random() * CHARSET.length)];
}

export default function DecryptedText({
  text,
  className = "",
  speed = 38,
  iterations = 14,
}: Props) {
  const [display, setDisplay] = useState(() =>
    text
      .split("")
      .map((c) => (c === " " ? " " : rand()))
      .join("")
  );

  useEffect(() => {
    const target = text.split("");
    const resolved = new Array(target.length).fill(false);
    let tick = 0;

    const interval = window.setInterval(() => {
      tick += 1;
      let resolvedThisTick = 0;
      const next = target.map((char, i) => {
        if (char === " ") {
          resolved[i] = true;
          return " ";
        }
        if (resolved[i]) return char;
        const idealResolveTick = Math.floor((i / target.length) * iterations) + 2;
        if (tick >= idealResolveTick && resolvedThisTick < 2) {
          resolved[i] = true;
          resolvedThisTick += 1;
          return char;
        }
        return rand();
      });
      setDisplay(next.join(""));
      if (resolved.every(Boolean)) window.clearInterval(interval);
    }, speed);

    return () => window.clearInterval(interval);
  }, [text, iterations, speed]);

  return (
    <span className={className} aria-label={text}>
      {display}
    </span>
  );
}
