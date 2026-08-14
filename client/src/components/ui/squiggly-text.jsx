import { useId, useMemo } from 'react';
import { motion, useTime, useTransform } from 'framer-motion';
import { cn } from '../../utils';

/**
 * SquigglyText – animates a text node with a wobbly SVG turbulence filter.
 *
 * Number of displacement frames to cycle through. Higher = smoother wobble,
 * more SVG filters in the DOM.
 * @default 5
 */
export function SquigglyText({
 children,
 className,
 style,
 steps = 5,
 stepDuration = 80,
 scale = [6, 8],
 baseFrequency = 0.02,
 numOctaves = 3,
 as = 'span',
}) {
 const reactId = useId();
 // useId can produce ":" / "_" which aren't valid in CSS url(#…) refs.
 const safeId = reactId.replace(/[:_]/g, '');
 const filterId = (i) => `squiggly-${safeId}-${i}`;

 const filters = useMemo(
 () => Array.from({ length: steps }, (_, i) => `url(#${filterId(i)})`),
 // eslint-disable-next-line react-hooks/exhaustive-deps
 [steps, safeId],
 );

 const time = useTime();
 const filter = useTransform(
 time,
 (t) => filters[Math.floor(t / stepDuration) % filters.length],
 );

 const scaleAt = (i) =>
 Array.isArray(scale) ? scale[i % scale.length] : scale;

 const Wrapper = as === 'div' ? motion.div : motion.span;

 return (
 <Wrapper
 style={{ filter, ...style }}
 className={cn('inline-block', className)}
 >
 <svg
 aria-hidden
 className="pointer-events-none absolute h-0 w-0 overflow-hidden"
 xmlns="http://www.w3.org/2000/svg"
 >
 <defs>
 {Array.from({ length: steps }).map((_, i) => (
 <filter id={filterId(i)} key={i}>
 <feTurbulence
 baseFrequency={baseFrequency}
 numOctaves={numOctaves}
 result="noise"
 seed={i}
 />
 <feDisplacementMap
 in="SourceGraphic"
 in2="noise"
 scale={scaleAt(i)}
 />
 </filter>
 ))}
 </defs>
 </svg>
 {children}
 </Wrapper>
 );
}
