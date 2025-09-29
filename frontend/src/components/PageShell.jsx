export default function PageShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}