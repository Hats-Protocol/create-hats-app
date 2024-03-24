export default function ChainIdLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      {children}
    </div>
  );
}
