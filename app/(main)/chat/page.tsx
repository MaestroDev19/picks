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
    <div className="bg-card text-card-foreground pt-5 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex w-max max-w-[100%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ${
                message.role === "model"
                  ? "bg-muted"
                  : "ml-auto bg-primary text-primary-foreground"
              }`}
            >
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="py-4 px-4">
        <Form {...form}>
          <form
            className="flex flex-col w-full items-center space-y-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="relative w-full">
              <FormField
                control={form.control}
                name="chat"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        id="message"
                        autoComplete="off"
                        rows={1}
                        className="pr-24 resize-none overflow-y-auto min-h-[40px] max-h-[120px] focus:outline-none focus:ring-0 border bg-muted"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="absolute right-2 bottom-1 flex space-x-2">
                <Button
                  type="submit"
                  size="icon"
                  variant={"ghost"}
                  className="h-8 w-8"
                  disabled={isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
