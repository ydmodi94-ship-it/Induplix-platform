import { z } from "zod";
import { industryOptions, serviceOptions } from "./content";

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(100, "Name must be under 100 characters."),
  company: z.string().trim().min(1, "Please enter your company name.").max(150, "Company must be under 150 characters."),
  email: z.string().trim().min(1, "Please enter your work email.").email("Please enter a valid email address.").max(255),
  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long.")
    .refine((v) => v === "" || /^[+\d][\d\s-]{6,19}$/.test(v), "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  industry: z.enum(industryOptions, { errorMap: () => ({ message: "Please select an industry." }) }),
  service: z.enum(serviceOptions, { errorMap: () => ({ message: "Please choose a service of interest." }) }),
  challenge: z
    .string()
    .trim()
    .min(20, "Please describe the challenge in at least 20 characters.")
    .max(2000, "Please keep it under 2000 characters."),
});

export type ContactInput = z.infer<typeof contactSchema>;
