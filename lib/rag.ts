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

  const contextualizeQSystemPrompt = `Given the chat history and the latest user input, which may reference previous context or preferences, generate a standalone list of 5 TV show recommendations that align with the user's tastes. Ensure the recommendations can be understood without the chat history. Do NOT provide an in-depth analysis, but briefly explain why each show is a good match. If no relevant context is found in the chat history, prompt the user for more details.`;
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
  const tvRecommendationSystemPrompt = `You are a TV show recommendation expert.
Use the following pieces of context, which may include the user's preferences, past interactions, and specific queries, to recommend TV shows.


{context}`;
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
