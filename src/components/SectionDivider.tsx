export default function SectionDivider() {
  return (
    <div
      className="h-px w-full"
      style={{
        background:
          "radial-gradient(ellipse 50% 100% at 50% 50%, rgba(61,210,165,0.8), rgba(94,227,179,0.3) 40%, rgba(255,255,255,0.07) 70%)",
        boxShadow: "0 0 16px 5px rgba(61,210,165,0.18)",
      }}
    />
  );
}
