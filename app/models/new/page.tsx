"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc, Timestamp, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CheckCircle2 } from "lucide-react";
import { DataSourceType } from "@/lib/types";
import { startTraining } from "@/lib/services/training";

type Step = 1 | 2 | "training" | "success";

function CreateModelContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [modelId, setModelId] = useState<string | null>(null);

  const [problemDescription, setProblemDescription] = useState("");
  const [modelName, setModelName] = useState("");
  const [nameManuallyEdited, setNameManuallyEdited] = useState(false);

  const [dataSourceType, setDataSourceType] = useState<DataSourceType>("csv");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [s3BucketUrl, setS3BucketUrl] = useState("");
  const [s3Region, setS3Region] = useState("us-east-1");
  const [s3AccessKeyId, setS3AccessKeyId] = useState("");
  const [s3SecretAccessKey, setS3SecretAccessKey] = useState("");

  useEffect(() => {
    if (!nameManuallyEdited && problemDescription) {
      const words = problemDescription.trim().split(/\s+/).slice(0, 4);
      const generatedName = words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
      setModelName(generatedName);
    }
  }, [problemDescription, nameManuallyEdited]);

  const handleStep1Continue = () => {
    if (problemDescription.trim()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      const dataSource = dataSourceType === "csv" 
        ? {
            type: "csv" as const,
            fileName: csvFile?.name,
            fileSize: csvFile?.size,
          }
        : {
            type: "s3" as const,
            bucketUrl: s3BucketUrl,
            region: s3Region,
            accessKeyId: s3AccessKeyId,
            secretAccessKey: s3SecretAccessKey,
          };

      const docRef = await addDoc(collection(db, "models"), {
        userId: user.uid,
        name: modelName || "Untitled Model",
        problemDescription,
        dataSource,
        status: "training",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      setModelId(docRef.id);
      setStep("training");
      
      startTraining(docRef.id);
    } catch (error) {
      console.error("Error creating model:", error);
    }
  };

  useEffect(() => {
    if (modelId && step === "training") {
      const unsubscribe = onSnapshot(doc(db, "models", modelId), (doc) => {
        const data = doc.data();
        if (data?.status === "completed") {
          setStep("success");
        } else if (data?.status === "failed") {
          console.error("Training failed:", data?.errorMessage);
        }
      });
      return () => unsubscribe();
    }
  }, [modelId, step]);

  useEffect(() => {
    if (step === "success" && modelId) {
      const timer = setTimeout(() => {
        router.push(`/models/${modelId}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, modelId, router]);

  if (step === "training") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
          </div>
          <div className="absolute inset-0 rounded-full bg-purple-400 opacity-20 animate-ping"></div>
        </div>
        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Training Your Model
        </h2>
        <p className="text-lg text-muted-foreground text-center max-w-md leading-relaxed">
          This usually takes about 10 seconds. We&apos;re analyzing your data, engineering features, and training the best model for your use case.
        </p>
        <div className="mt-8 flex gap-2">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-scale-in">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold mb-3 text-green-700">Model Ready!</h2>
        <p className="text-lg text-muted-foreground text-center max-w-md mb-8">
          Your model has been trained and deployed successfully.
        </p>
        <div className="flex gap-4">
          <Button 
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            View Dashboard
          </Button>
          <Button variant="outline" onClick={() => router.push(`/models/${modelId}`)} className="border-2">
            View Model Details →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Model</h1>
        <p className="text-muted-foreground">Follow the steps to create your custom ML model</p>
      </div>
      
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            1
          </div>
          <div className={`h-1 w-16 ${step >= 2 ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
            2
          </div>
        </div>
      </div>

      {step === 1 && (
        <Card className="border-2 shadow-lg animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">Step 1: Problem Definition</CardTitle>
            <CardDescription className="text-base">Describe what you want your model to predict</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="problem" className="text-sm font-semibold">
                What do you want to predict? <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="problem"
                rows={5}
                placeholder="E.g., I want to identify which company emails are fraudulent"
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                required
                className="border-2 resize-none"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="name" className="text-sm font-semibold">Model Name</Label>
              <Input
                id="name"
                placeholder="Auto-generated from description"
                value={modelName}
                onChange={(e) => {
                  setModelName(e.target.value);
                  setNameManuallyEdited(true);
                }}
                className="border-2"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <span className="inline-block w-1 h-1 rounded-full bg-purple-600"></span>
                You can edit this or leave it as auto-generated
              </p>
            </div>
            <Button
              onClick={handleStep1Continue}
              disabled={!problemDescription.trim()}
              className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Continue to Data Source →
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="border-2 shadow-lg animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl">Step 2: Data Source</CardTitle>
            <CardDescription className="text-base">Connect your data for training</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={dataSourceType} onValueChange={(value) => setDataSourceType(value as DataSourceType)}>
              <Card className={`cursor-pointer transition-all border-2 ${dataSourceType === 'csv' ? 'border-purple-500 bg-purple-50' : 'hover:border-purple-200'}`}>
                <CardHeader className="flex flex-row items-center space-y-0 p-4">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="flex-1 ml-3 cursor-pointer">
                    <div className="font-semibold text-base">Upload CSV</div>
                    <div className="text-sm text-muted-foreground">Upload a CSV file from your computer</div>
                  </Label>
                </CardHeader>
              </Card>
              <Card className={`cursor-pointer transition-all border-2 ${dataSourceType === 's3' ? 'border-purple-500 bg-purple-50' : 'hover:border-purple-200'}`}>
                <CardHeader className="flex flex-row items-center space-y-0 p-4">
                  <RadioGroupItem value="s3" id="s3" />
                  <Label htmlFor="s3" className="flex-1 ml-3 cursor-pointer">
                    <div className="font-semibold text-base">Connect to S3</div>
                    <div className="text-sm text-muted-foreground">Connect to an AWS S3 bucket</div>
                  </Label>
                </CardHeader>
              </Card>
            </RadioGroup>

            {dataSourceType === "csv" && (
              <div className="space-y-3 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                <Label htmlFor="file" className="text-sm font-semibold">
                  CSV File <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="file"
                  type="file"
                  accept=".csv"
                  onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                  className="border-2 bg-white"
                />
              </div>
            )}

            {dataSourceType === "s3" && (
              <div className="space-y-4 p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="bucketUrl" className="text-sm font-semibold">
                    S3 Bucket URL <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="bucketUrl"
                    placeholder="s3://my-bucket/path/to/data"
                    value={s3BucketUrl}
                    onChange={(e) => setS3BucketUrl(e.target.value)}
                    className="border-2 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region" className="text-sm font-semibold">AWS Region</Label>
                  <Input
                    id="region"
                    placeholder="us-east-1"
                    value={s3Region}
                    onChange={(e) => setS3Region(e.target.value)}
                    className="border-2 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accessKeyId" className="text-sm font-semibold">
                    Access Key ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="accessKeyId"
                    placeholder="AKIA..."
                    value={s3AccessKeyId}
                    onChange={(e) => setS3AccessKeyId(e.target.value)}
                    className="border-2 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secretAccessKey" className="text-sm font-semibold">
                    Secret Access Key <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="secretAccessKey"
                    type="password"
                    value={s3SecretAccessKey}
                    onChange={(e) => setS3SecretAccessKey(e.target.value)}
                    className="border-2 bg-white"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11 border-2">
                ← Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  dataSourceType === "csv" ? !csvFile : !s3BucketUrl || !s3AccessKeyId || !s3SecretAccessKey
                }
                className="flex-1 h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Create Model →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function CreateModelPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <CreateModelContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
