import './globals.css';

export const metadata = {
  title: "Robert's Facebook",
  description: 'A better Facebook clone!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
