import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI!,
  model: "gemini-1.5-flash",
  temperature: 1,
  maxOutputTokens: 1000,
});

console.log(process.env.NEXT_PUBLIC_GEMINI!);
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.NEXT_PUBLIC_GEMINI!,
  modelName: "models/embedding-001",
});
let chat_history: any[] = [];
export async function pResponse(question: string) {
  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: supabaseClient,
    tableName: "documents",
    queryName: "match_documents",
  });
  const retriever = vectorStore.asRetriever({ k: 6, searchType: "similarity" });

  const contextualizeQSystemPrompt = `
Analyze the chat history and the user's latest input to generate contextually relevant movie and TV show recommendations. Follow this process:

Extract key preferences from the chat history, including:

Explicit preferences (e.g., favorite genres)
Implicit preferences (e.g., themes, styles, or eras they respond positively to)
Any evolution in tastes over time


If critical information is missing or outdated, ask the user ONE specific, targeted question to clarify their current preferences.
Based on all available information, generate 5 diverse recommendations that:

Span different genres or styles (unless user has a strong specific preference)
Include both recent releases and classics that match their interests
Reflect a mix of safe choices and slightly adventurous options


For each recommendation, provide:

Title, year, and primary genre
A concise explanation (max 20 words) of why it matches the user's tastes, linking to specific preferences
A confidence level (High/Medium/Low) in this recommendation


Present the recommendations in order from highest to lowest confidence.
After presenting the recommendations, ask if these align with their interests or if they'd like to refine the suggestions.

If there's insufficient context to make informed recommendations, instead ask the user 2-3 specific questions about their current movie/TV preferences, focusing on genres, themes, and recent favorites.
Ensure all responses are standalone and can be understood without reference to the chat history. Maintain a conversational tone throughout the interaction.`;
  const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
    ["system", contextualizeQSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{question}"],
  ]);
  const contextualizeQChain = contextualizeQPrompt
    .pipe(llm)
    .pipe(new StringOutputParser());
  await contextualizeQChain.invoke({
    chat_history: chat_history,
    question: question,
  });
  const tvRecommendationSystemPrompt = `You are an elite movie and TV show recommendation expert with encyclopedic knowledge of global cinema and television. Analyze the following context, which includes the user's preferences, past interactions, and specific queries:
{context}
`;
  const qaPrompt = ChatPromptTemplate.fromMessages([
    ["system", tvRecommendationSystemPrompt],
    new MessagesPlaceholder("chat_history"),
    ["human", "{question}"],
  ]);

  const contextualizedQuestion = (input: Record<string, unknown>) => {
    if ("chat_history" in input) {
      return contextualizeQChain;
    }
    return input.question;
  };
  const ragChain = RunnableSequence.from([
    RunnablePassthrough.assign({
      context: (input: Record<string, unknown>) => {
        if ("chat_history" in input) {
          const chain: any = contextualizedQuestion(input);
          return chain.pipe(retriever).pipe(formatDocumentsAsString);
        }
        return "";
      },
    }),
    qaPrompt,
    llm,
  ]);

  const result = await ragChain.invoke({ question, chat_history });
  chat_history.push(new HumanMessage(question));
  chat_history.push(new AIMessage(result));
  console.log(chat_history);
  return result.content;
}
