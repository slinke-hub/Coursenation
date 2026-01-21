import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-24 text-foreground">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-4">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-green-400 bg-clip-text text-transparent">
          Coursenation
        </h1>
        <p className="text-xl text-muted-foreground">Gamified Language Learning Platform</p>
      </div>

      <div className="mt-12 flex gap-4">
        <Link href="/student">
          <Button size="lg" className="text-lg">Start Learning</Button>
        </Link>
        <Link href="/teacher">
          <Button variant="outline" size="lg">Teacher Portal</Button>
        </Link>
        <Link href="/admin">
          <Button variant="ghost" size="lg">Admin</Button>
        </Link>
      </div>
    </main>
  )
}
