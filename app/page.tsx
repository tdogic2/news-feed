"use client";

import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import { ChevronsDown, ChevronsUp } from "lucide-react";

import { useNews } from "@/store/use-news";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NewsForm from "@/components/news-form";

export default function Home() {
  const { articles } = useNews();
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);

  return (
    <div className="min-h-screen flex flex-col w-full">
      <header className="border-b p-8 gap-y-4 flex flex-col items-center justify-center">
        {isNavbarExpanded && <NewsForm />}
        <div role="button">
          {isNavbarExpanded ? (
            <ChevronsUp
              className="animate-pulse"
              onClick={() => setIsNavbarExpanded(false)}
            />
          ) : (
            <ChevronsDown
              className="animate-pulse"
              onClick={() => setIsNavbarExpanded(true)}
            />
          )}
        </div>
      </header>
      <main className="flex-1 p-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {articles && articles.length > 0 ? (
          articles.map((article, index) => (
            <Card
              key={`article-${index}`}
              className="break-words flex flex-col hover:scale-[1.02]"
            >
              <CardHeader className="border-b gap-y-4">
                <CardTitle>
                  <span className="text-muted-foreground">Title:</span>{" "}
                  {article.title}
                </CardTitle>
                <CardDescription>
                  Author:{" "}
                  <span className="text-foreground">
                    {article.author || "Not provided"}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-y-4 border-b pt-6">
                <p>
                  <span className="text-muted-foreground">Description:</span>{" "}
                  {article.description}
                </p>
                <p>
                  <span className="text-muted-foreground">Source:</span>{" "}
                  {article.source.name}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col gap-y-2 items-start pt-6">
                <Link
                  className="text-primary underline-offset-4 hover:underline inline-block max-w-full break-all"
                  href={article.url}
                  target="_blank"
                >
                  {article.url}
                </Link>
                <p>{format(article.publishedAt, "PPP")}</p>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="flex h-full w-full items-center justify-center col-span-full">
            <p className="text-sm font-semibold tracking-wider">
              No news articles found.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
