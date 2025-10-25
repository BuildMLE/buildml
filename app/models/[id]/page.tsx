"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Model } from "@/lib/types";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { Copy, Eye, EyeOff } from "lucide-react";

function ModelDetailsContent() {
  const params = useParams();
  const router = useRouter();
  const modelId = params.id as string;
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchModel = async () => {
      try {
        const docRef = doc(db, "models", modelId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setModel({ id: docSnap.id, ...docSnap.data() } as Model);
        } else {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching model:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [modelId, router]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!model) {
    return <div>Model not found</div>;
  }

  const createdDate = model.createdAt?.toDate?.()?.toLocaleDateString() || "N/A";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{model.name}</h1>
          <div className="flex items-center gap-4">
            <StatusBadge status={model.status} />
            <span className="text-sm text-muted-foreground">Created: {createdDate}</span>
          </div>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problem Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{model.problemDescription}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Source</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <span className="font-semibold">Type:</span>{" "}
            <span className="text-muted-foreground uppercase">{model.dataSource.type}</span>
          </div>
          {model.dataSource.type === "csv" ? (
            <>
              {model.dataSource.fileName && (
                <div>
                  <span className="font-semibold">File Name:</span>{" "}
                  <span className="text-muted-foreground">{model.dataSource.fileName}</span>
                </div>
              )}
              {model.dataSource.fileSize && (
                <div>
                  <span className="font-semibold">File Size:</span>{" "}
                  <span className="text-muted-foreground">
                    {(model.dataSource.fileSize / 1024).toFixed(2)} KB
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              {model.dataSource.bucketUrl && (
                <div>
                  <span className="font-semibold">Bucket URL:</span>{" "}
                  <span className="text-muted-foreground">{model.dataSource.bucketUrl}</span>
                </div>
              )}
              {model.dataSource.region && (
                <div>
                  <span className="font-semibold">Region:</span>{" "}
                  <span className="text-muted-foreground">{model.dataSource.region}</span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {model.status === "completed" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>API Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">API Endpoint</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={model.apiEndpoint || ""}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(model.apiEndpoint || "", "endpoint")}
                  >
                    {copiedField === "endpoint" ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">API Key</label>
                <div className="flex gap-2">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={model.apiKey || ""}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCopy(model.apiKey || "", "key")}
                  >
                    {copiedField === "key" ? "Copied!" : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Code Examples</h4>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Python</div>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`import requests

response = requests.post(
    "${model.apiEndpoint}",
    headers={"Authorization": f"Bearer ${model.apiKey}"},
    json={"data": "your input data"}
)
print(response.json())`}
                    </pre>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">JavaScript</div>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`const response = await fetch("${model.apiEndpoint}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${model.apiKey}",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ data: "your input data" })
});
const result = await response.json();`}
                    </pre>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">cURL</div>
                    <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
{`curl -X POST ${model.apiEndpoint} \\
  -H "Authorization: Bearer ${model.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"data": "your input data"}'`}
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {model.metrics && (
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      {(model.metrics.accuracy * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                    <div className="mt-2 w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${model.metrics.accuracy * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      {(model.metrics.precision * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Precision</div>
                    <div className="mt-2 w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${model.metrics.precision * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      {(model.metrics.recall * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Recall</div>
                    <div className="mt-2 w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${model.metrics.recall * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Test Your Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter input data to test your model"
                rows={4}
              />
              <Button disabled>Predict</Button>
              <p className="text-sm text-muted-foreground">
                Testing interface coming soon
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default function ModelDetailsPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <ModelDetailsContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
