type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function ShinyText({ children, className = "" }: Props) {
  return (
    <span
      className={`bg-clip-text text-transparent animate-shine ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.5) 100%)",
        backgroundSize: "200% auto",
      }}
    >
      {children}
    </span>
  );
}
