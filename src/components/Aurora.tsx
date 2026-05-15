export default function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] sm:w-[1100px] sm:h-[700px] bg-mint-500/20 blur-[60px] sm:blur-[120px] rounded-full [will-change:transform]" />
      <div className="absolute top-1/3 -left-40 w-[250px] h-[250px] sm:w-[500px] sm:h-[500px] bg-mint-400/10 blur-[50px] sm:blur-[100px] rounded-full [will-change:transform]" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-ink-700/40 blur-[50px] sm:blur-[120px] rounded-full [will-change:transform]" />
    </div>
  );
}
