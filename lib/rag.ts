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

  const contextualizeQSystemPrompt = `Certainly. Let's analyze and improve this prompt for contextualizing questions in a movie/TV show recommendation system.
Task: Improve a system prompt for contextualizing user queries and generating movie/TV show recommendations based on chat history.
Alternative approaches:

Enhance context utilization and recommendation diversity
Incorporate user preference extraction and query refinement
Add a scoring system for relevance and confidence
Include a clarification and feedback loop

Let's create prompts for each approach:

Enhance context utilization and recommendation diversity:

Prompt: Analyze the chat history and the user's latest input to understand their evolving preferences for movies and TV shows. Generate a diverse list of 3 recommendations that align with the user's tastes, ensuring:

Each recommendation is from a different genre or style unless the user has shown a strong preference for a specific type.
The list includes both recent releases and classics that match the user's interests.
Recommendations are based on various factors such as plot themes, directorial styles, actor preferences, and mood preferences extracted from the chat history.

For each recommendation, provide a concise one-sentence explanation of why it's a good match. If the chat history lacks sufficient context, ask the user a specific question to gather more information about their current preferences.

Incorporate user preference extraction and query refinement:

Prompt: Examine the chat history and the user's latest input to extract key preferences and create a refined query. Follow these steps:

Identify explicit preferences (e.g., favorite genres) and implicit preferences (e.g., themes or styles they respond positively to) from the chat history.
Determine any changes or evolution in the user's tastes over time.
Combine these insights with the latest user input to create a refined, specific query.
Based on this refined query, generate 5 tailored movie or TV show recommendations.
For each recommendation, provide a brief explanation (max 15 words) linking it to the user's extracted preferences.

If the chat history doesn't provide enough context to create a refined query, ask the user a targeted question to fill in the most critical missing information.

Add a scoring system for relevance and confidence:

Prompt: Analyze the chat history and the user's latest input to generate movie and TV show recommendations. Implement the following scoring system:

Assign each potential recommendation a relevance score (1-10) based on how well it matches the user's expressed preferences and interests.
Assign a confidence score (1-10) based on the amount and quality of information available in the chat history that supports this recommendation.
Calculate a total score by multiplying relevance and confidence.
Select the top 5 recommendations based on total score.

For each selected recommendation, provide:

Title and basic info (year, primary genre)
A one-sentence explanation of its relevance to the user's tastes
The calculated relevance and confidence scores

If the highest confidence score is below 5, instead of giving recommendations, ask the user a specific question to gather more information about their preferences.

Include a clarification and feedback loop:

Prompt: Examine the chat history and the user's latest input to generate contextually relevant movie and TV show recommendations. Follow this process:

Identify key preferences and interests from the chat history.
If critical information is missing, ask the user one specific, targeted question to clarify their current preferences.
Based on all available information, generate 5 diverse recommendations.
For each recommendation, provide:

Title and year
A brief (max 20 words) explanation of why it matches the user's tastes
A confidence level (High/Medium/Low) in this recommendation


After presenting the recommendations, ask the user if these align with their interests or if they'd like to refine the suggestions further.

If there's insufficient context in the chat history to make informed recommendations, instead of providing recommendations, ask the user 2-3 specific questions about their current movie/TV preferences.
Evaluation:

Offers good diversity but may lack specificity in user preference matching
Provides a systematic approach to understanding user preferences but might be too complex for a single prompt
Introduces an interesting scoring system but could be overly numerical for a conversational AI
Balances recommendation generation with user interaction, allowing for refinement

Best Prompt:
The fourth approach, "Include a clarification and feedback loop," seems to offer the best balance of context utilization, user interaction, and flexibility. Here's an improved version of the original prompt, incorporating elements from all approaches:
Analyze the chat history and the user's latest input to generate contextually relevant movie and TV show recommendations. Follow this process:

Extract key preferences from the chat history, including:

Explicit preferences (e.g., favorite genres, actors, directors)
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
