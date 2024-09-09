import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PaystackButton, usePaystackPayment } from "react-paystack";
import { Icons } from "@/components/ui/icons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const MAX_DONATION_IN_NAIRA = 10000; // Define your max donation amount
const DONATION_IN_NAIRA = 100; // Define your donation conversion rate

const donationSchema = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  donationEmail: z.string().email({ message: "Invalid email address." }),
  message: z.string().optional(),
  amount: z.number().min(100, { message: "Minimum donation is 100 Naira." }),
  selectedPreset: z.number().optional(),
  selectedDonation: z.string().optional(),
  privateMessage: z.boolean().optional(),
});

export default function DonationForm() {
  const form = useForm<z.infer<typeof donationSchema>>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      name: "",
      donationEmail: "",
      message: "",
      amount: 0,
      selectedPreset: undefined,
      selectedDonation: "",
      privateMessage: false,
    },
  });

  const [quantity, setQuantity] = useState(0);
  const [quantityError, setQuantityError] = useState<string | null>(null);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (value > MAX_DONATION_IN_NAIRA) {
      setQuantityError(`Maximum donation amount is ${MAX_DONATION_IN_NAIRA}`);
    } else {
      setQuantityError(null);
    }
    setQuantity(value);
    form.setValue("amount", value);
  };

  const publicKey = process.env.PAYSTACK_PUBLIC_KEY!; // replace with your own public key
  const initializePayment = usePaystackPayment({ publicKey });

  const onSubmit = (values: z.infer<typeof donationSchema>) => {
    const amount = values.amount * (DONATION_IN_NAIRA / 100) * 100; // convert to kobo
    const email = values.donationEmail; // replace with customer's email

    const config = {
      reference: new Date().getTime().toString(),
      email,
      amount,
      publicKey,
      onSuccess: () => console.log("Success"),
      onClose: () => console.log("Closed"),
    };

    initializePayment(config);
  };

  const presets = [100, 500, 1000, 5000, 10000];
  const selectedPreset = form.watch("selectedPreset");
  const selectedDonation = form.watch("selectedDonation");

  // try {
  //   const response = await fetch("/api/checkout", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ name, email, message, amount: quantity }),
  //   });

  //   const data = await response.json();
  //   console.log(data);

  //   if (!data.ok) {
  //     setError(data.error);
  //     return;
  //   }
  //   const url = data.url;
  //   router.push(url);
  // } catch (error) {
  //   console.error(error);
  // }

  return (
    <div className="max-w-6xl mx-auto bg-gray-50 shadow-lg rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 p-6">
          <div className="relative">
            <Image
              src="/placeholder.png"
              width={24}
              height={24}
              alt="Cover"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button className="absolute top-2 right-2" variant="outline">
              Edit page
            </Button>
          </div>
          <div className="flex items-center mt-4">
            <Avatar className="mr-4">
              <AvatarImage src="/placeholder.png" />
              <AvatarFallback>HL</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">User</h2>
              <p className="text-muted-foreground">Name</p>
            </div>
            <Badge variant="secondary" className="ml-auto">
              143 supporters
            </Badge>
          </div>
          <p className="mt-4 text-muted-foreground">
            Howdy fellow coder. If you&apos;re here looking for something
            intresting you&apos;re in luck.. Got a whole lot of this going on
            inside if you buy me a coffee or just make a nice donation.
          </p>
          <div className="flex items-center mt-4 space-x-2">
            <Icons.GlobeIcon className="h-6 w-6" />
            <Icons.TwitterIcon className="h-6 w-6" />
            <Icons.InstagramIcon className="h-6 w-6" />
            <Icons.LinkedinIcon className="h-6 w-6" />
          </div>
          <div className="flex items-center mt-4 space-x-4">
            <Button variant="ghost">New post</Button>
            <Button variant="ghost">Add photo</Button>
            <Button variant="ghost">Enter Youtube or Vimeo link</Button>
          </div>
          <Input
            placeholder="Paste Youtube or Vimeo link here..."
            className="mt-4"
          />
        </div>
        <div className="w-full md:w-2/5  p-6 bg-gray-200 border-l">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="donationEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (Donation)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter a message" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="privateMessage"
                render={({ field }) => (
                  <FormItem className="flex items-center mt-4 space-x-2">
                    <FormControl>
                      <Checkbox id="private-message" {...field} />
                    </FormControl>
                    <FormLabel htmlFor="private-message" className="text-sm">
                      Private message
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="flex items-center space-x-2 mt-4">
                <Icons.CoffeeIcon className="h-6 w-6" />
                <div className="flex items-center space-x-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset}
                      onClick={() => form.setValue("selectedPreset", preset)}
                      className={`inline-flex items-center justify-center rounded-full border border-input bg-white text-black px-3 py-1 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${
                        selectedPreset === preset
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <h1>
                  Or you can specify an amount (max: {MAX_DONATION_IN_NAIRA}):
                </h1>
                <Input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min={100}
                  max={MAX_DONATION_IN_NAIRA}
                  required
                />
                {quantityError && (
                  <span className="text-red-500">{quantityError}</span>
                )}
              </div>

              <div className="flex mt-4 space-x-2">
                <Button
                  variant="outline"
                  className={`flex-1 ${
                    selectedDonation === "one-time"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-black"
                  }`}
                  onClick={() => form.setValue("selectedDonation", "one-time")}
                >
                  One-time
                </Button>
                <Button
                  variant="default"
                  className={`flex-1 ${
                    selectedDonation === "monthly"
                      ? "bg-gray-800 text-white"
                      : "bg-white text-black"
                  }`}
                  onClick={() => form.setValue("selectedDonation", "monthly")}
                >
                  Monthly
                </Button>
              </div>

              <Button type="submit" className="mt-4">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
