"use client";

import { useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement>;

export default function LogoImg({ src, alt, ...rest }: Props) {
  const [broken, setBroken] = useState(false);

  const fallback =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44'>
         <rect width='100%' height='100%' fill='white'/>
         <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
               font-family='Arial' font-size='10' fill='#999'>Logo</text>
       </svg>`
    );

  return (
    <img
      src={broken ? fallback : (src as string)}
      alt={alt}
      onError={() => setBroken(true)}
      {...rest}
    />
  );
}
