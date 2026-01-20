'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Volume2, RotateCw } from 'lucide-react'

interface FlashcardProps {
    id: string
    front: string
    back: string
    audioUrl?: string
    onNext: (difficulty: 'easy' | 'good' | 'hard') => void
}

export function Flashcard({ front, back, onNext }: FlashcardProps) {
    const [isFlipped, setIsFlipped] = useState(false)

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto perspective-1000">

            {/* 
        Container with perspective is needed for 3D flip.
        framer-motion handles the rotation.
      */}
            <div className="relative w-full h-80 cursor-pointer group" onClick={handleFlip}>
                <motion.div
                    className="w-full h-full relative preserve-3d transition-all duration-500"
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* FRONT */}
                    <Card className="absolute inset-0 w-full h-full backface-hidden flex items-center justify-center p-6 border-2 border-primary/20 hover:border-primary/50 bg-card">
                        <CardContent className="flex flex-col items-center gap-4">
                            <span className="text-4xl font-bold text-center">{front}</span>
                            <p className="text-sm text-muted-foreground uppercase tracking-widest">Tap to flip</p>
                        </CardContent>
                    </Card>

                    {/* BACK */}
                    <Card
                        className="absolute inset-0 w-full h-full backface-hidden flex items-center justify-center p-6 bg-primary/10 border-2 border-primary"
                        style={{ transform: "rotateY(180deg)" }}
                    >
                        <CardContent className="flex flex-col items-center gap-4">
                            <span className="text-3xl font-medium text-center">{back}</span>
                            <Button size="icon" variant="ghost" className="rounded-full" onClick={(e) => { e.stopPropagation(); alert('Audio placeholder') }}>
                                <Volume2 className="h-6 w-6" />
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* CONTROLS (Only visible when flipped) */}
            <div className={cn("flex gap-4 transition-opacity duration-300", isFlipped ? "opacity-100" : "opacity-0 pointer-events-none")}>
                <Button variant="destructive" className="w-24" onClick={() => { setIsFlipped(false); onNext('hard') }}>Hard</Button>
                <Button className="w-24 bg-yellow-500 hover:bg-yellow-600 text-white" onClick={() => { setIsFlipped(false); onNext('good') }}>Good</Button>
                <Button className="w-24 bg-green-500 hover:bg-green-600 text-white" onClick={() => { setIsFlipped(false); onNext('easy') }}>Easy</Button>
            </div>
        </div>
    )
}
