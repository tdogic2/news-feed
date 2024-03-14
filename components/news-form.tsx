"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { getNews } from "@/actions/news";
import { useNews } from "@/store/use-news";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const newsFormSchema = z.object({
  search: z.string().optional(),
  dateRange: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .optional(),
  sortBy: z.enum(["relevancy", "popularity", "publishedAt"]).optional(),
});

const defaultValues = {
  search: "",
};

export default function NewsForm() {
  const [isPending, startTransition] = useTransition();
  const { addArticles } = useNews();

  const newsForm = useForm<z.infer<typeof newsFormSchema>>({
    resolver: zodResolver(newsFormSchema),
    defaultValues,
  });

  function onSubmit(data: z.infer<typeof newsFormSchema>) {
    startTransition(() => {
      getNews(data).then((response) => {
        if ("error" in response) {
          toast.error(response.error);
          addArticles([]);
        } else {
          addArticles(response.data);
        }
      });
    });
  }

  return (
    <Form {...newsForm}>
      <form
        className="space-y-2 w-full md:w-2/3 lg:w-1/2 xl:w-1/3"
        onSubmit={newsForm.handleSubmit(onSubmit)}
      >
        <FormField
          control={newsForm.control}
          name="search"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Search</FormLabel>
              <FormControl>
                <Input placeholder="Search by keywords..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={newsForm.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Date range</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value?.from ? (
                      field.value?.to ? (
                        <>
                          {format(field.value.from, "LLL dd, y")} -{" "}
                          {format(field.value.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(field.value.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={field.value?.from}
                    selected={field.value}
                    onSelect={field.onChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />
        <FormField
          control={newsForm.control}
          name="sortBy"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Sort by</FormLabel>
              <Select
                name={field.name}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="gap-x-2">
                    <SelectValue placeholder="Choose a sorting method..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="relevancy">Relevancy</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="publishedAt">Published at</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {isPending ? <LoadingButton /> : <Button type="submit">Submit</Button>}
      </form>
    </Form>
  );
}
