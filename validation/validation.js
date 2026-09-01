const { z } = require("zod");

const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(5,"Password must be length 5")
  }),

  params: z.object({}),
  query: z.object({})
});

module.exports = {
  createUserSchema
};