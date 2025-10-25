import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

function generateApiKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let key = "sk_live_";
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

function generateMockMetrics() {
  return {
    accuracy: 0.85 + Math.random() * 0.1,
    precision: 0.82 + Math.random() * 0.1,
    recall: 0.79 + Math.random() * 0.1,
  };
}

export async function startTraining(modelId: string) {
  setTimeout(async () => {
    try {
      const modelRef = doc(db, "models", modelId);
      
      await updateDoc(modelRef, {
        status: "completed",
        completedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        apiEndpoint: `https://api.buildml.com/v1/models/${modelId}`,
        apiKey: generateApiKey(),
        metrics: generateMockMetrics(),
      });
    } catch (error) {
      console.error("Error updating model:", error);
      const modelRef = doc(db, "models", modelId);
      await updateDoc(modelRef, {
        status: "failed",
        updatedAt: Timestamp.now(),
        errorMessage: "Training failed due to an unexpected error",
      });
    }
  }, 10000);
}
