import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircle2, Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  useGetAbout,
  useSubmitContact,
} from "@/features/portfolio/api/portfolio.api";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const { data: profile } = useGetAbout();
  const submitMutation = useSubmitContact();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      // subject: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    submitMutation.mutate(
      values,
      {
        onSuccess: () => {
          setIsSuccess(true);
          form.reset();
          toast.success("Message sent! Thanks for reaching out. I'll get back to you soon.");
          setTimeout(() => setIsSuccess(false), 5000);
        },
        onError: (err: any) => {
          const statusCode = err.response?.data?.statusCode;
          const errorMessage = err.response?.data?.error;

          if (statusCode === 429) {
            toast.error(errorMessage || "Too many requests. Please try again later.");
            return;
          }

          toast.error(
            errorMessage ||
            err.response?.data?.message ||
            "Something went wrong. Please try again."
          );
        },
      },
    );
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center flex flex-col items-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
            <span className="text-primary mr-2">07.</span> What's Next?
          </h2>
          <div className="w-20 h-1 bg-primary rounded"></div>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 space-y-8"
          >
            <div>
              <h3 className="text-4xl font-bold mb-6">Get In Touch</h3>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Although I'm not currently looking for any new opportunities, my
                inbox is always open. Whether you have a question or just want
                to say hi, I'll try my best to get back to you!
              </p>
            </div>

            {profile && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-mono">
                      Email
                    </div>
                    <a
                      href={`mailto:${profile.email || import.meta.env.VITE_ENGINEER_EMAIL || "engineer@example.com"}`}
                      className="hover:text-primary transition-colors font-mono"
                    >
                      {profile.email || import.meta.env.VITE_ENGINEER_EMAIL || "engineer@example.com"}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-mono">
                      Location
                    </div>
                    <div className="text-lg font-medium">
                      {profile.location || "Bengaluru, India"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="md:col-span-3 bg-card border border-border rounded-2xl p-8 shadow-xl"
          >
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h4 className="text-2xl font-bold">Message Sent!</h4>
                <p className="text-muted-foreground">
                  Thank you for reaching out. I will get back to you as soon as
                  possible.
                </p>
                <Button
                  onClick={() => setIsSuccess(false)}
                  variant="outline"
                  className="mt-4"
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="name" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                            Name
                          </Label>
                          <FormControl>
                            <Input
                              id="name"
                              placeholder="John Doe"
                              {...field}
                              className="bg-muted/50 border-border h-12 focus-visible:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <Label htmlFor="email" className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                            Email
                          </Label>
                          <FormControl>
                            <Input
                              id="email"
                              placeholder="john@example.com"
                              {...field}
                              className="bg-muted/50 border-border h-12 focus-visible:ring-primary"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <Label
                          htmlFor="message"
                          className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
                        >
                          Message
                        </Label>

                        <FormControl>
                          <Textarea
                            id="message"
                            placeholder="Hello, I'd like to talk about..."
                            className="bg-muted/50 border-border min-h-[150px] resize-none focus-visible:ring-primary"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-14 text-lg font-bold group"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? "Sending..." : "Send Message"}
                    <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </Form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
