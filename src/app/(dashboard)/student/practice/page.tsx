'use client'

import { useState } from 'react'
import { Flashcard } from '@/components/learning/Flashcard'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { awardXP } from '@/actions/gamification'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuizGame } from "@/components/learning/QuizGame"

// Mock Data - In real app, fetch from Supabase
const mockCards = [
    { id: '1', front: 'Hola', back: 'Hello' },
    { id: '2', front: 'Gato', back: 'Cat' },
    { id: '3', front: 'Biblioteca', back: 'Library' },
    { id: '4', front: 'Cerveza', back: 'Beer' },
    { id: '5', front: 'Gracias', back: 'Thank you' },
]

export default function PracticePage() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [completed, setCompleted] = useState(false)
    const router = useRouter()

    const currentCard = mockCards[currentIndex]
    const progress = ((currentIndex) / mockCards.length) * 100

    const handleNext = async (difficulty: 'easy' | 'good' | 'hard') => {
        // Here we would send data to backend to update spaced repetition algorithm (SM-2)
        console.log(`User marked card ${currentCard.id} as ${difficulty}`)

        if (currentIndex < mockCards.length - 1) {
            setCurrentIndex(prev => prev + 1)
        } else {
            await awardXP(50) // Bonus for finishing
            setCompleted(true)
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 py-8">
            <div className="flex items-center gap-4">
                <Link href="/student">
                    <Button variant="ghost" size="icon"><ArrowLeft /></Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">Practice Arena</h1>
                </div>
            </div>

            <Tabs defaultValue="flashcards" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                    <TabsTrigger value="quiz">Speed Quiz</TabsTrigger>
                </TabsList>

                <TabsContent value="flashcards" className="mt-6 space-y-8">
                    {completed ? (
                        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center animate-in zoom-in duration-500">
                            <h1 className="text-4xl font-bold text-primary">Session Complete!</h1>
                            <p className="text-xl text-muted-foreground">You earned <span className="text-primary font-bold">50 XP</span></p>
                            <Button onClick={() => window.location.reload()}>Practice Again</Button>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between mb-2 text-sm text-muted-foreground">
                                <span>Progress</span>
                                <span>{currentIndex + 1} / {mockCards.length}</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <div className="mt-12">
                                <Flashcard
                                    key={currentCard.id}
                                    {...currentCard}
                                    onNext={handleNext}
                                />
                            </div>
                        </>
                    )}
                </TabsContent>

                <TabsContent value="quiz" className="mt-6">
                    <QuizGame />
                </TabsContent>
            </Tabs>
        </div>
    )
}
