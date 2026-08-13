export default function TiltCard({ children, className = '', highlight = false }) {
 return (
 <div
 className={`relative rounded-2xl bg-slate-900 border transition-colors duration-200 overflow-hidden ${
 highlight
 ? 'border-cyan-500'
 : 'border-slate-800 hover:border-cyan-500'
 } ${className}`}
 >
 {children}
 </div>
 );
}
