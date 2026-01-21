'use client'

import { useTheme } from "next-themes"
import { useThemeStore } from "@/store/useTheme"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Moon, Sun, Type } from "lucide-react"

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()
    // const { primaryColor, setPrimaryColor, fontFamily, setFontFamily } = useThemeStore() 
    // Commented out until we wire up the ThemeProviderWrapper properly. 
    // Implementing standard Dark/Light mode first as requested.

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">App Settings</h1>
                <p className="text-muted-foreground">Customize your learning experience.</p>
            </div>

            <div className="grid gap-6">
                {/* Visual Theme */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sun className="h-5 w-5" />
                            Appearance
                        </CardTitle>
                        <CardDescription>
                            Toggle between Light and Dark modes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Dark Mode</Label>
                                <p className="text-sm text-muted-foreground">
                                    Easier on the eyes at night.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            >
                                {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Color Customization (Mock UI for now, logic requires global layout wrapper) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="h-4 w-4 rounded-full bg-primary" />
                            Accent Color
                        </CardTitle>
                        <CardDescription>
                            Choose your preferred button and highlight color.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup defaultValue="blue" className="grid grid-cols-4 gap-4">
                            <div>
                                <RadioGroupItem value="blue" id="blue" className="peer sr-only" />
                                <Label
                                    htmlFor="blue"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <div className="h-6 w-6 rounded-full bg-blue-500 mb-2" />
                                    Default
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="violet" id="violet" className="peer sr-only" />
                                <Label
                                    htmlFor="violet"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <div className="h-6 w-6 rounded-full bg-violet-500 mb-2" />
                                    Violet
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="orange" id="orange" className="peer sr-only" />
                                <Label
                                    htmlFor="orange"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <div className="h-6 w-6 rounded-full bg-orange-500 mb-2" />
                                    Orange
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="green" id="green" className="peer sr-only" />
                                <Label
                                    htmlFor="green"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                >
                                    <div className="h-6 w-6 rounded-full bg-green-500 mb-2" />
                                    Green
                                </Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

                {/* Font Style */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Type className="h-5 w-5" />
                            Typography
                        </CardTitle>
                        <CardDescription>
                            Select the font style that suits you best.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup defaultValue="sans" className="grid grid-cols-3 gap-4">
                            <div>
                                <RadioGroupItem value="sans" id="font-sans" className="peer sr-only" />
                                <Label
                                    htmlFor="font-sans"
                                    className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent peer-data-[state=checked]:border-primary font-sans"
                                >
                                    <span className="text-xl">Ag</span>
                                    <span className="text-xs text-muted-foreground mt-1">Modern</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="serif" id="font-serif" className="peer sr-only" />
                                <Label
                                    htmlFor="font-serif"
                                    className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent peer-data-[state=checked]:border-primary font-serif"
                                >
                                    <span className="text-xl">Ag</span>
                                    <span className="text-xs text-muted-foreground mt-1">Classic</span>
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="mono" id="font-mono" className="peer sr-only" />
                                <Label
                                    htmlFor="font-mono"
                                    className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent peer-data-[state=checked]:border-primary font-mono"
                                >
                                    <span className="text-xl">Ag</span>
                                    <span className="text-xs text-muted-foreground mt-1">Mono</span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
