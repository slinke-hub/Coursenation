'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Timer, Trophy, Frown, CheckCircle, XCircle } from 'lucide-react'
import { Progress } from "@/components/ui/progress"
import { awardXP } from "@/actions/gamification"

const QUESTIONS = [
    { id: 1, question: "Gato", options: ["Dog", "Cat", "Bird", "Fish"], answer: "Cat" },
    { id: 2, question: "Hola", options: ["Hello", "Good", "Bye", "Thanks"], answer: "Hello" },
    { id: 3, question: "Biblioteca", options: ["Store", "School", "Library", "Pharmacy"], answer: "Library" },
    { id: 4, question: "Azul", options: ["Red", "Green", "Blue", "Yellow"], answer: "Blue" },
    { id: 5, question: "Gracias", options: ["Please", "Sorry", "Welcome", "Thank you"], answer: "Thank you" },
]

export function QuizGame() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [lives, setLives] = useState(3)
    const [score, setScore] = useState(0)
    const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing')
    const [timeLeft, setTimeLeft] = useState(15)
    const [selectedOption, setSelectedOption] = useState<string | null>(null)
    const [isWrongAnimation, setIsWrongAnimation] = useState(false)

    const currentQ = QUESTIONS[currentIndex]

    // Timer Effect
    useEffect(() => {
        if (gameState !== 'playing') return

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    handleWrongAnswer()
                    return 15
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [gameState, currentIndex, lives]) // Dependencies ensure timer resets/pauses correctly

    const handleWrongAnswer = () => {
        setIsWrongAnimation(true)
        setTimeout(() => setIsWrongAnimation(false), 500)

        if (lives > 1) {
            setLives(l => l - 1)
            setTimeLeft(15) // Reset timer on wrong answer? or keep flowing? Let's reset for fairness
        } else {
            setLives(0)
            setGameState('lost')
        }
    }

    const handleOptionClick = (option: string) => {
        if (selectedOption) return // Prevent double clicks
        setSelectedOption(option)

        if (option === currentQ.answer) {
            // Correct
            setTimeout(() => {
                if (currentIndex < QUESTIONS.length - 1) {
                    setScore(s => s + 10)
                    setCurrentIndex(prev => prev + 1)
                    setTimeLeft(15)
                    setSelectedOption(null)
                } else {
                    setScore(s => s + 10)
                    handleWin()
                }
            }, 600) // Slight delay to show green color
        } else {
            // Incorrect
            setTimeout(() => {
                handleWrongAnswer()
                setSelectedOption(null)
            }, 600)
        }
    }

    const handleWin = async () => {
        setGameState('won')
        await awardXP(100)
    }

    if (gameState === 'lost') {
        return (
            <Card className="max-w-md mx-auto text-center p-8 space-y-6">
                <div className="flex justify-center">
                    <Frown className="h-20 w-20 text-destructive" />
                </div>
                <h2 className="text-3xl font-bold text-destructive">Game Over!</h2>
                <p className="text-muted-foreground">You ran out of lives. Don't give up!</p>
                <Button size="lg" onClick={() => window.location.reload()}>Try Again</Button>
            </Card>
        )
    }

    if (gameState === 'won') {
        return (
            <Card className="max-w-md mx-auto text-center p-8 space-y-6 animate-in zoom-in">
                <div className="flex justify-center">
                    <Trophy className="h-20 w-20 text-yellow-500 animate-bounce" />
                </div>
                <h2 className="text-3xl font-bold text-primary">You Won!</h2>
                <p className="text-xl">Score: {score}</p>
                <p className="text-muted-foreground">You earned <span className="text-primary font-bold">100 XP</span></p>
                <Button size="lg" onClick={() => window.location.reload()}>Play Again</Button>
            </Card>
        )
    }

    return (
        <div className="max-w-lg mx-auto space-y-6">
            {/* HUD */}
            <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-1 text-red-500">
                    {[...Array(3)].map((_, i) => (
                        <Heart key={i} className={`h-6 w-6 ${i < lives ? "fill-current" : "opacity-20"}`} />
                    ))}
                </div>
                <div className="flex items-center gap-2 font-mono text-xl font-bold">
                    <Timer className="h-5 w-5" />
                    <span className={timeLeft < 5 ? "text-red-500 animate-pulse" : ""}>{timeLeft}s</span>
                </div>
                <div className="font-bold text-lg">
                    Score: {score}
                </div>
            </div>

            {/* Progress */}
            <Progress value={((currentIndex) / QUESTIONS.length) * 100} className="h-2" />

            {/* Game Area */}
            <motion.div
                animate={isWrongAnimation ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
            >
                <Card className="border-2 border-primary/10 overflow-hidden">
                    <CardContent className="p-8 text-center space-y-8">
                        <h3 className="text-4xl font-bold">{currentQ.question}</h3>

                        <div className="grid grid-cols-2 gap-4">
                            {currentQ.options.map((option) => {
                                let variant = "outline"
                                let icon = null

                                if (selectedOption === option) {
                                    if (option === currentQ.answer) {
                                        variant = "default" // It will imply custom green in style below for clarity if needed, but Shadcn default is black/white. Let's rely on classes.
                                        icon = <CheckCircle className="ml-2 h-4 w-4" />
                                    } else {
                                        variant = "destructive"
                                        icon = <XCircle className="ml-2 h-4 w-4" />
                                    }
                                }

                                return (
                                    <Button
                                        key={option}
                                        variant={variant as any}
                                        className={`h-16 text-lg relative ${selectedOption === option && option === currentQ.answer ? 'bg-green-600 hover:bg-green-700 text-white border-transparent' : ''}`}
                                        onClick={() => handleOptionClick(option)}
                                        disabled={selectedOption !== null}
                                    >
                                        {option}
                                        {icon && <span className="absolute right-4">{icon}</span>}
                                    </Button>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
