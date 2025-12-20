export default function GridBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Neon glow effects - matching the design */}
      <div 
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rotate-45 blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(255 50% 50% / 0.4), transparent 70%)'
        }}
      />
      <div 
        className="absolute top-20 right-0 w-[500px] h-[800px] -rotate-12 blur-3xl opacity-25"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(222 50% 50% / 0.3), transparent 70%)'
        }}
      />
      <div 
        className="absolute -bottom-40 -right-40 w-[700px] h-[700px] rotate-12 blur-3xl opacity-30"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(255 60% 40% / 0.4), transparent 70%)'
        }}
      />
      <div 
        className="absolute bottom-0 left-1/4 w-[600px] h-[600px] -rotate-45 blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(222 60% 40% / 0.4), transparent 70%)'
        }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] blur-3xl opacity-15"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(240 50% 50% / 0.3), transparent 60%)'
        }}
      />
    </div>
  );
}
