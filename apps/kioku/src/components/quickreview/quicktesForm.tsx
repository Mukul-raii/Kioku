import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { createQuickTest } from "@/app/actions/quick-test";
import { quickTestSchema } from "@repo/types";
import { useState } from "react";

export default function QuickTestForm({open,onChange,setQuickTest}) {
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useForm<z.infer<typeof quickTestSchema>>({
    resolver: zodResolver(quickTestSchema),
    defaultValues: {
      category: "",
      topic: "",
    },
  });

  const onQuickTestSubmit = async (values: z.infer<typeof quickTestSchema>) => {
    try {
      setIsSubmitting(true);
      console.log("Creating quick test with:", values);

      const result = await createQuickTest(values);
      if (result.success) {
        console.log("Test created successfully:", result);
        setQuickTest()
        onChange(false);
        form.reset();
      }
    } catch (error) {
      console.error("Error creating quick test:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={() =>onChange(false)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Quick Test</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onQuickTestSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter topic" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      className="z-[9999]"
                      position="popper"
                      side="bottom"
                      align="start"
                    >
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Mode</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select test mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      className="z-[9999]"
                      position="popper"
                      side="bottom"
                      align="start"
                    >
                      <SelectItem value="MCQs">Multiple Choice</SelectItem>
                      <SelectItem value="long_answer">Long Answer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsQuickTest(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Test"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
