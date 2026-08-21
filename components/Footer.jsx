export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-black/30 backdrop-blur-md">
      <div className="mx-auto w-full max-w-6xl px-4 py-4">
        <div className="flex flex-col gap-3 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold tracking-tight text-white">MentorBridge</div>
          <div className="text-center">© {new Date().getFullYear()} MentorBridge</div>
          <div className="flex items-center justify-center gap-4 sm:justify-end">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="underline-offset-4 hover:underline"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
