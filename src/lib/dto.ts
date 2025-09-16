// import { z } from "zod";

// export const RegisterDTO = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
//   fullName: z.string().min(1).optional(),
//   role: z.enum(["admin", "operator", "customer"]).optional(),
// });
// export type RegisterDTO = z.infer<typeof RegisterDTO>;

// export const LoginDTO = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
// });
// export type LoginDTO = z.infer<typeof LoginDTO>;
import { z } from "zod";

export const RegisterDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1).optional(),
});
// type RegisterDTO = z.infer<typeof RegisterDTO>; // keep if you use the type

export const LoginDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
