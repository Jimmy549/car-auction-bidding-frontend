import type { Metadata } from "next";
import "../styles/globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Navigation } from "@/components/navigation";
import { ReduxProvider } from "@/components/redux-provider";
import { SocketProvider } from "@/components/socket-provider";
import { AuthInitializer } from "@/components/auth-initializer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Auction App",
  description: "Created by Jimmy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="max-w-360 mx-auto" suppressHydrationWarning={true}>
        <ReduxProvider>
          <AuthInitializer>
            <SocketProvider>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              <div className="flex flex-col">
                <Header />
                <Navigation />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </SocketProvider>
          </AuthInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}
