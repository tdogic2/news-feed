"use server";

import { BASE_URL } from "@/config";
import { handleError } from "@/lib/utils";
import { ArticleType } from "@/store/use-news";

type RequestDataType = {
  search?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  sortBy?: "relevancy" | "popularity" | "publishedAt";
};

type ResponseDataType =
  | {
      status: "ok";
      totalResults: number;
      articles: ArticleType[];
    }
  | {
      status: "error";
      code: string;
      message: string;
    };

export async function getNews(requestData: RequestDataType) {
  try {
    const { search, dateRange, sortBy } = requestData;

    const response = await fetch(
      `${BASE_URL}?q=${search}&from=${dateRange?.from.toISOString()}&to=${dateRange?.to.toISOString()}&sortBy=${sortBy}&apiKey=${
        process.env.NEWS_API_KEY
      }`
    );

    const responseData = (await response.json()) as ResponseDataType;

    if (responseData.status === "error") throw new Error(responseData.message);

    const articles = responseData.articles;

    return { data: articles };
  } catch (error) {
    return handleError(error, "GET_NEWS");
  }
}
