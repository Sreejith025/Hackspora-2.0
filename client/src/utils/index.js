// Utility and helper functions
// Joins class names, ignoring falsy values. Mirrors the shadcn `cn` helper
// using basic concatenation; sufficient for this project's needs without
// pulling in `clsx` / `tailwind-merge`.
export function cn(...inputs) {
 return inputs
 .flat()
 .filter((c) => typeof c === 'string' && c.length > 0)
 .join(' ');
}
