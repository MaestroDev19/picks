"use client"

import type { CoreMessage } from "ai"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Film, Tv, Clock, Search, Award, User, Shuffle, LayoutGrid, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

// Movie genres commonly used
const MOVIE_GENRES = [
  "Action",
  "Adventure", 
  "Animation",
  "Comedy",
  "Crime",
  "Documentary", 
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "War",
  "Western",
]

// Define form schema with Zod
const formSchema = z.object({
  step1: z.object({
    favoriteGenres: z.array(z.string()).min(1, {
      message: "Please select at least one genre.",
    }),
    favoriteActorsDirectors: z.string().min(1, {
      message: "Please share some favorite actors or directors.",
    }),
    favoriteShows: z.string().min(1, {
      message: "Please list some of your favorite shows or movies.",
    }),
  }),
  step2: z.object({
    watchingStyle: z.enum(["binge", "weekly", "mixed"], {
      required_error: "Please select your watching style.",
    }),
    contentPreference: z.enum(["movies", "tvshows", "both"], {
      required_error: "Please select your content preference.", 
    }),
  }),
  step3: z.object({
    pacingPreference: z.string().optional(),
    visualPreference: z.string().optional(),
    dealBreakers: z.string().optional(),
    discoveryMethod: z.enum(["algorithms", "reviews", "social", "mixed"], {
      required_error: "Please select how you discover new content.",
    }),
  }),
})

export function PersonaForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [persona, setPersona] = useState<string | null>(null)
  const [messages, setMessages] = useState<CoreMessage[]>([])

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      step1: {
        favoriteGenres: [],
        favoriteActorsDirectors: "",
        favoriteShows: "",
      },
      step2: {
        watchingStyle: undefined,
        contentPreference: undefined,
      },
      step3: {
        pacingPreference: "",
        visualPreference: "",
        dealBreakers: "",
        discoveryMethod: undefined,
      },
    },
  })

  const nextStep = async () => {
    const stepFields = {
      1: ["step1.favoriteGenres", "step1.favoriteActorsDirectors", "step1.favoriteShows"],
      2: ["step2.watchingStyle", "step2.contentPreference"],
      3: ["step3.pacingPreference", "step3.visualPreference", "step3.dealBreakers", "step3.discoveryMethod"],
    }

    const currentFields = stepFields[currentStep as keyof typeof stepFields]
    const isValid = await form.trigger(currentFields as Array<keyof z.infer<typeof formSchema>>)

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setPersona(null)

    try {
      // Combine all steps' data
      const formData = {
        ...values.step1,
        ...values.step2,
        ...values.step3,
      }

      // Format the form data into a message for the API
      const message = `
        Here are my viewing preferences:
        
        Favorite Genres: ${formData.favoriteGenres.join(", ")}
        Favorite Actors/Directors: ${formData.favoriteActorsDirectors}
        Favorite Shows/Movies: ${formData.favoriteShows}
        Watching Style: ${formData.watchingStyle}
        Content Preference: ${formData.contentPreference}
        Pacing Preference: ${formData.pacingPreference || "Not specified"}
        Visual Preference: ${formData.visualPreference || "Not specified"}
        Deal Breakers: ${formData.dealBreakers || "Not specified"}
        How I Discover Content: ${formData.discoveryMethod}
      `

      const userMessage: CoreMessage = { role: "user", content: message }
      setMessages((currentMessages) => [...currentMessages, userMessage])

      const response = await fetch("/api/persona", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate persona")
      }

      const data = await response.json()

      if (data.messages && data.messages.length > 0) {
        const newMessages = data.messages.filter(
          (msg: CoreMessage) =>
            !messages.some((existingMsg) => existingMsg.role === msg.role && existingMsg.content === msg.content),
        )

        setMessages((currentMessages) => [...currentMessages, ...newMessages])

        const assistantMessage = [...newMessages].reverse().find((msg: CoreMessage) => msg.role === "assistant")

        if (assistantMessage) {
          setPersona(
            typeof assistantMessage.content === "string"
              ? assistantMessage.content
              : assistantMessage.content
                  .filter((part: any) => part.type === "text")
                  .map((part: any) => part.text)
                  .join("\n"),
          )
        }
      }
    } catch (error) {
      console.error("Error generating persona:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Award className="h-5 w-5" />
      case 2:
        return <Clock className="h-5 w-5" />
      case 3:
        return <Search className="h-5 w-5" />
      default:
        return null
    }
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Your Favorites"
      case 2:
        return "Viewing Habits"
      case 3:
        return "Preferences & Discovery"
      default:
        return ""
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <FormField
              control={form.control}
              name="step1.favoriteGenres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favorite Genres</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {MOVIE_GENRES.map((genre) => (
                          <button
                            key={genre}
                            type="button"
                            onClick={() => {
                              const isSelected = field.value.includes(genre);
                              const newValue = isSelected
                                ? field.value.filter((g) => g !== genre)
                                : [...field.value, genre];
                              field.onChange(newValue);
                            }}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                              "border border-gray-700 bg-secondary",
                              field.value.includes(genre)
                                ? "bg-primary text-primary-foreground border-primary"
                                : "hover:border-gray-500 text-gray-300",
                              "text-xs sm:text-sm"
                            )}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                      
                      <FormDescription className="mt-2 text-sm">
                        Select the genres you enjoy watching the most.
                      </FormDescription>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="step1.favoriteActorsDirectors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favorite Actors/Directors</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tom Hanks, Christopher Nolan, Meryl Streep, etc."
                      className="resize-none min-h-[80px] text-sm sm:text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-sm">List actors and directors whose work you enjoy.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="step1.favoriteShows"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favorite Shows/Movies</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Breaking Bad, The Godfather, Stranger Things, etc."
                      className="resize-none min-h-[80px] text-sm sm:text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-sm">List some of your all-time favorite shows and movies.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )

      case 2:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="step2.watchingStyle"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Watching Style</FormLabel>
                  <div className="grid grid-cols-1 gap-3">
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-lg border-2 border-border cursor-pointer transition-all",
                        field.value === "binge" ? "border-primary bg-primary/10" : "hover:border-primary/50",
                      )}
                      onClick={() => field.onChange("binge")}
                    >
                      <Clock className="h-6 w-6 sm:h-8 sm:w-8 mb-2 text-primary" />
                      <span className="font-medium text-sm sm:text-base">Binge Watcher</span>
                      <span className="text-xs sm:text-sm text-muted-foreground mt-1 text-center">
                        I watch multiple episodes in one sitting
                      </span>
                    </div>
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-lg border-2 border-border cursor-pointer transition-all",
                        field.value === "weekly" ? "border-primary bg-primary/10" : "hover:border-primary/50",
                      )}
                      onClick={() => field.onChange("weekly")}
                    >
                      <Calendar className="h-6 w-6 sm:h-8 sm:w-8 mb-2 text-primary" />
                      <span className="font-medium text-sm sm:text-base">Weekly Episodes</span>
                      <span className="text-xs sm:text-sm text-muted-foreground mt-1 text-center">
                        I prefer to watch episodes as they release
                      </span>
                    </div>
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-lg border-2 border-border cursor-pointer transition-all",
                        field.value === "mixed" ? "border-primary bg-primary/10" : "hover:border-primary/50",
                      )}
                      onClick={() => field.onChange("mixed")}
                    >
                      <Shuffle className="h-6 w-6 sm:h-8 sm:w-8 mb-2 text-primary" />
                      <span className="font-medium text-sm sm:text-base">Mix of Both</span>
                      <span className="text-xs sm:text-sm text-muted-foreground mt-1 text-center">It depends on the show and my mood</span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="step2.contentPreference"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Content Preference</FormLabel>
                  <div className="grid grid-cols-1 gap-3">
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-lg border-2 border-border cursor-pointer transition-all",
                        field.value === "movies" ? "border-primary bg-primary/10" : "hover:border-primary/50",
                      )}
                      onClick={() => field.onChange("movies")}
                    >
                      <Film className="h-6 w-6 sm:h-8 sm:w-8 mb-2 text-primary" />
                      <span className="font-medium text-sm sm:text-base">Movies</span>
                      <span className="text-xs sm:text-sm text-muted-foreground mt-1 text-center">I prefer watching films</span>
                    </div>
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-lg border-2 border-border cursor-pointer transition-all",
                        field.value === "tvshows" ? "border-primary bg-primary/10" : "hover:border-primary/50",
                      )}
                      onClick={() => field.onChange("tvshows")}
                    >
                      <Tv className="h-6 w-6 sm:h-8 sm:w-8 mb-2 text-primary" />
                      <span className="font-medium text-sm sm:text-base">TV Shows</span>
                      <span className="text-xs sm:text-sm text-muted-foreground mt-1 text-center">I prefer watching series</span>
                    </div>
                    <div
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-lg border-2 border-border cursor-pointer transition-all",
                        field.value === "both" ? "border-primary bg-primary/10" : "hover:border-primary/50",
                      )}
                      onClick={() => field.onChange("both")}
                    >
                      <LayoutGrid className="h-6 w-6 sm:h-8 sm:w-8 mb-2 text-primary" />
                      <span className="font-medium text-sm sm:text-base">Both Equally</span>
                      <span className="text-xs sm:text-sm text-muted-foreground mt-1 text-center">I enjoy both movies and TV shows</span>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )

      case 3:
        return (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="step3.pacingPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pacing Preference (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Fast-paced action, slow character development, etc." 
                        {...field}
                        className="text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormDescription className="text-sm">Describe your preferred pacing in content.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="step3.visualPreference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visual Preference (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Colorful, dark and gritty, realistic, etc." 
                        {...field}
                        className="text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormDescription className="text-sm">Describe your preferred visual style.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="step3.dealBreakers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deal Breakers (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Excessive violence, poor dialogue, etc."
                      className="resize-none min-h-[80px] text-sm sm:text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-sm">What elements make you stop watching?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="step3.discoveryMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How You Discover Content</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-sm sm:text-base">
                        <SelectValue placeholder="Select discovery method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="algorithms">Streaming Recommendations</SelectItem>
                      <SelectItem value="reviews">Reviews & Critics</SelectItem>
                      <SelectItem value="social">Social Media & Friends</SelectItem>
                      <SelectItem value="mixed">Mix of Methods</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-sm">How do you typically find new shows and movies?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto px-4 sm:px-6 pt-10">
      <Card className="border-primary/20 bg-card shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/20">
                <User className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Create Your Watch Persona</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full transition-all text-sm sm:text-base",
                    currentStep === step
                      ? "bg-primary text-primary-foreground"
                      : currentStep > step
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {step}
                </div>
              ))}
            </div>
          </div>
          <CardDescription className="text-sm sm:text-base">
            Tell us about your viewing preferences to get personalized recommendations.
          </CardDescription>
          <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            {getStepIcon(currentStep)}
            <h3 className="text-base sm:text-lg font-medium">{getStepTitle(currentStep)}</h3>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStep()}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          {currentStep > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep} className="text-sm sm:text-base">
              Previous
            </Button>
          ) : (
            <div></div> // Empty div to maintain spacing
          )}

          {currentStep < 3 ? (
            <Button type="button" onClick={nextStep} className="ml-auto text-sm sm:text-base">
              Next
            </Button>
          ) : (
            <Button 
              type="submit" 
              onClick={form.handleSubmit(onSubmit)} 
              disabled={isLoading} 
              className="ml-auto text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Persona...
                </>
              ) : (
                "Generate My Watch Persona"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      {persona && (
        <Card className="border-primary/20 bg-card shadow-lg overflow-hidden">
          <CardHeader className="bg-primary/10 border-b border-primary/20">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/20">
                <User className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg sm:text-xl">Your Watch Persona</CardTitle>
            </div>
            <CardDescription className="text-sm sm:text-base">
              Based on your preferences, here's your personalized viewing profile
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose dark:prose-invert max-w-none text-sm sm:text-base">
              <div dangerouslySetInnerHTML={{ __html: persona?.replace(/\n/g, "<br/>") || "" }} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
