import { Problem } from "../models/problems.js";
import problems from "./problems.js";

export const seedDatabase = async () => {
    try {
      await Problem.deleteMany({});
      console.log("🧹 Old problems removed");
  
      const cleanedProblems = problems.map((problem) => {
        const { likes, dislikes, ...rest } = problem;
        return rest;
      });
  
      const inserted = await Problem.insertMany(cleanedProblems);
      console.log(`🌱 Seeded ${inserted.length} problems to the database`);
    } catch (error) {
      console.error("❌ Error seeding problems:", error);
    }
  };
  