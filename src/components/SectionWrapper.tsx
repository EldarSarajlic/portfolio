import SectionDivider from "./SectionDivider";

export default function SectionWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <SectionDivider />
      {children}
      <SectionDivider />
    </div>
  );
}
