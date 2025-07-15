import { Geist, Geist_Mono } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'
import { ModeToggle } from '@/lib/components/Themebtn'
import Link from 'next/link'
import { getServerSession } from "next-auth"
import { options } from './api/auth/[...nextauth]/options'
import { Providers } from './providers'
import AuthButton from './components/AuthButton'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Go Quiz - Test Your Knowledge',
  description: 'Take interactive quizzes and challenge your friends on Go Quiz',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(options);

  // Database sync code would go here if needed
  // Example:
  // if (session?.user) {
  //   // Check if user already exists in DB
  //   const existing = await prismadb.user.findUnique({
  //     where: { email: session.user.email }
  //   });
  //
  //   if (!existing && session.user.email) {
  //     // If the user doesn't exist, create a new entry in the DB
  //     await prismadb.user.create({
  //       data: {
  //         email: session.user.email,
  //         name: session.user.name || "Unnamed",
  //       },
  //     });
  //   }
  // }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "#F2F2F2" }}
      >
        <Providers>
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white border-b shadow-sm" style={{ borderColor: "rgba(110, 112, 115, 0.1)" }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Left side: Logo and navigation */}
                <div className="flex items-center gap-6">
                  {/* Logo */}
                  <Link href="/" className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "#D97904" }}
                    >
                      <span className="text-white font-bold">Q</span>
                    </div>
                    <h1
                      className="text-xl font-bold hidden sm:block"
                      style={{ color: "#3C3E40" }}
                    >
                      Go Quiz
                    </h1>
                  </Link>

                  {/* Navigation Links */}
                  <nav className="hidden sm:flex items-center gap-6">
                    <Link
                      href="/"
                      className="text-sm font-medium transition-colors hover:font-semibold"
                      style={{ color: "#6E7073" }}
                    >
                      Home
                    </Link>
                    <Link
                      href="/leaderboard"
                      className="text-sm font-medium transition-colors hover:font-semibold"
                      style={{ color: "#6E7073" }}
                    >
                      Leaderboard
                    </Link>
                    <Link
                      href="/about"
                      className="text-sm font-medium transition-colors hover:font-semibold"
                      style={{ color: "#6E7073" }}
                    >
                      About
                    </Link>
                  </nav>
                </div>

                {/* Right side: User controls */}
                <div className="flex items-center gap-4">
                  {/* <ModeToggle /> */}

                  {!session && (
                    <div className="flex items-center gap-2">
                      <Link href="/api/auth/signin">
                        <button
                          className="text-sm font-medium px-4 py-2 rounded-lg transition-all"
                          style={{ color: "#6E7073" }}
                        >
                          Sign in
                        </button>
                      </Link>

                      {/* <Link href="/auth/signin"> */}
                      {/*   <button */}
                      {/*     className="text-sm font-medium px-4 py-2 rounded-lg transition-all text-white" */}
                      {/*     style={{ backgroundColor: "#D97904" }} */}
                      {/*   > */}
                      {/*     Sign up */}
                      {/*   </button> */}
                      {/* </Link> */}
                    </div>
                  )}

                  {session?.user && (
                    <div className="flex items-center gap-3">
                      <span
                        className="text-sm font-medium hidden sm:block"
                        style={{ color: "#6E7073" }}
                      >
                        {session.user.name || 'User'}
                      </span>
                      <AuthButton />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Mobile Navigation - Visible on small screens */}
          <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg" style={{ borderColor: "rgba(110, 112, 115, 0.1)" }}>
            <div className="flex justify-around items-center h-14">
              <Link
                href="/"
                className="flex flex-col items-center justify-center w-full h-full"
                style={{ color: "#6E7073" }}
              >
                <span className="text-xs">Home</span>
              </Link>
              <Link
                href="/leaderboard"
                className="flex flex-col items-center justify-center w-full h-full"
                style={{ color: "#6E7073" }}
              >
                <span className="text-xs">Leaderboard</span>
              </Link>
              <Link
                href="/about"
                className="flex flex-col items-center justify-center w-full h-full"
                style={{ color: "#6E7073" }}
              >
                <span className="text-xs">About</span>
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <main className="pb-20 sm:pb-0">
            {children}
          </main>

          {/* Footer */}
          <footer className="py-6 border-t mt-12 hidden sm:block" style={{ borderColor: "rgba(110, 112, 115, 0.1)" }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="flex items-center gap-2 mb-4 sm:mb-0">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#D97904" }}
                  >
                    <span className="text-white text-xs font-bold">Q</span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: "#6E7073" }}>
                    Go Quiz © 2025
                  </span>
                </div>

                <div className="flex items-center gap-6">
                  <Link href="/terms" className="text-xs" style={{ color: "#6E7073" }}>
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className="text-xs" style={{ color: "#6E7073" }}>
                    Privacy Policy
                  </Link>
                  <Link href="/contact" className="text-xs" style={{ color: "#6E7073" }}>
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
