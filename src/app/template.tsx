// A template (unlike a layout) re-mounts on every navigation with a fresh key,
// so this entrance animation replays each time a new page loads in.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out motion-reduce:animate-none">
      {children}
    </div>
  );
}
