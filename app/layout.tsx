import './globals.css';

export const metadata = {
    title: 'TallyInsight Dashboard',
    description: 'Dashboard for Tally Prime data',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <script src="https://cdn.tailwindcss.com"></script>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </head>
            <body className="bg-slate-50 text-slate-900 antialiased">
                <div id="root">{children}</div>
            </body>
        </html>
    );
}
