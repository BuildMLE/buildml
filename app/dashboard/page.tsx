"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { Model } from "@/lib/types";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ModelCard } from "@/components/ModelCard";
import { Plus } from "lucide-react";
import Link from "next/link";

function DashboardContent() {
  const { user } = useAuth();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const modelsQuery = query(
      collection(db, "models"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(
      modelsQuery,
      (snapshot) => {
        const modelsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Model[];
        
        // Sort on client side instead of using orderBy (which requires an index)
        modelsData.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || 0;
          const bTime = b.createdAt?.toMillis?.() || 0;
          return bTime - aTime;
        });
        
        setModels(modelsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching models:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center">
            <svg className="h-16 w-16 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-3 text-red-600">Error Loading Models</h2>
          <p className="text-lg text-muted-foreground max-w-md mb-4">
            {error}
          </p>
          <details className="text-sm text-left bg-red-50 p-4 rounded-lg border-2 border-red-200 max-w-2xl">
            <summary className="cursor-pointer font-semibold text-red-700 mb-2">How to fix this</summary>
            <div className="space-y-2 text-red-900">
              <p>1. Make sure you've created a Firebase project and enabled Firestore</p>
              <p>2. Add your Firebase credentials to .env.local file</p>
              <p>3. If you see an index error, click the link in the browser console to create the index</p>
              <p>4. Make sure Firestore security rules allow authenticated users to read their own models</p>
            </div>
          </details>
        </div>
        <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          Retry
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your models...</p>
        </div>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
            <Plus className="h-16 w-16 text-purple-600" />
          </div>
          <h2 className="text-3xl font-bold mb-3">No models yet</h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Create your first custom ML model in minutes. Just describe your problem and connect your data.
          </p>
        </div>
        <Link href="/models/new">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg">
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Model
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Your Models</h1>
          <p className="text-muted-foreground">
            {models.length} {models.length === 1 ? 'model' : 'models'} total
          </p>
        </div>
        <Link href="/models/new">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-md">
            <Plus className="h-4 w-4 mr-2" />
            Create New Model
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((model) => (
          <ModelCard key={model.id} model={model} />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
