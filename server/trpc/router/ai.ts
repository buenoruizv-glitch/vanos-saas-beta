import { z } from "zod";
import { empresaProcedure, router } from "../trpc";

export const aiRouter = router({
  /** Placeholder: conecta Gemini cuando configures GOOGLE_AI_API_KEY */
  suggest: empresaProcedure
    .input(z.object({ prompt: z.string().min(1) }))
    .mutation(async () => {
      return {
        reply:
          "Asistente IA: configura GOOGLE_AI_API_KEY y amplía esta ruta para usar @google/generative-ai.",
      };
    }),
});
