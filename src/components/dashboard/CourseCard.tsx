import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Image from "next/image"

interface CourseCardProps {
    title: string
    description: string
    progress: number
    image?: string
}

export function CourseCard({ title, description, progress, image }: CourseCardProps) {
    return (
        <Card className="overflow-hidden border-border bg-card transition-all hover:border-primary/50 h-full flex flex-col">
            <div className="aspect-video bg-muted relative group">
                {image ? (
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                        <span className="text-4xl">📚</span>
                    </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors z-10">
                    <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            </CardHeader>
            <CardFooter className="flex-col gap-2 items-start">
                <div className="w-full flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <Button className="w-full mt-2" variant={progress > 0 ? "secondary" : "default"}>
                    {progress > 0 ? "Continue" : "Start Learning"}
                </Button>
            </CardFooter>
        </Card>
    )
}
