import { z } from "zod";

export const emailSchema = z.string().trim().min(3).max(254).email();

export type EmailInput = z.infer<typeof emailSchema>;
