"use client";
import { pResponse } from "@/lib/rag";
import { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eraser, CornerDownLeft, Loader2 } from "lucide-react";

// Assuming this component exists

interface Message {
  text: string;
  role: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formSchema = z.object({
    chat: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      chat: "",
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const userMessage: Message = {
      text: values.chat,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    form.reset();

    try {
      const response: any = await pResponse(values.chat);

      const modelMessage: Message = {
        text: response,
        role: "model",
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-[calc(100dvh)]">
      <div className="flex h-full flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 px-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <span
                  className={`flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="py-4 rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
          >
            <FormField
              control={form.control}
              name="chat"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      id="message"
                      placeholder="Type your message here..."
                      className="min-h-12 resize-none border-0 p-3 shadow-none focus-within:ring-0 focus-visible:ring-0"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-center p-3 pt-0">
              <Button
                type="submit"
                size="sm"
                className="ml-auto gap-1.5"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <span>Relax i got you</span>
                  </div>
                ) : (
                  "Send Message"
                )}
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
