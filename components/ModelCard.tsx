"use client";

import { useState } from "react";
import { Model } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { Loader2, Copy, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

interface ModelCardProps {
  model: Model;
}

export function ModelCard({ model }: ModelCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const createdDate = model.createdAt?.toDate?.()?.toLocaleDateString() || "N/A";

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-purple-200 bg-white"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-xl font-bold">{model.name}</CardTitle>
          <StatusBadge status={model.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {model.problemDescription}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>Created {createdDate}</span>
          {isExpanded && <span className="text-purple-600 font-medium">Click to collapse</span>}
          {!isExpanded && <span className="text-purple-600 font-medium">Click to expand</span>}
        </div>

        {isExpanded && (
          <div className="pt-4 border-t border-purple-100 space-y-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            {model.status === "training" && (
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600 flex-shrink-0" />
                <span className="text-blue-900">Training in progress... This usually takes about 10 seconds.</span>
              </div>
            )}

            {model.status === "completed" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">API Endpoint</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={model.apiEndpoint || ""}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm border-2 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 font-mono"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(model.apiEndpoint || "", "endpoint")}
                      className="border-2"
                    >
                      {copiedField === "endpoint" ? "✓" : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">API Key</label>
                  <div className="flex gap-2">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={model.apiKey || ""}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm border-2 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 font-mono"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="border-2"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(model.apiKey || "", "key")}
                      className="border-2"
                    >
                      {copiedField === "key" ? "✓" : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {model.metrics && (
                  <div className="grid grid-cols-3 gap-3 pt-2">
                    <div className="text-center p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
                      <div className="text-2xl font-bold text-green-700">
                        {(model.metrics.accuracy * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs font-medium text-green-600">Accuracy</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
                      <div className="text-2xl font-bold text-blue-700">
                        {(model.metrics.precision * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs font-medium text-blue-600">Precision</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
                      <div className="text-2xl font-bold text-purple-700">
                        {(model.metrics.recall * 100).toFixed(1)}%
                      </div>
                      <div className="text-xs font-medium text-purple-600">Recall</div>
                    </div>
                  </div>
                )}

                <Link href={`/models/${model.id}`}>
                  <Button variant="outline" className="w-full border-2 hover:bg-purple-50 hover:border-purple-300">
                    View Full Details →
                  </Button>
                </Link>
              </>
            )}

            {model.status === "failed" && (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-sm text-red-900 font-medium">
                  {model.errorMessage || "Training failed"}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 border-2">
                    Retry Training
                  </Button>
                  <Button variant="destructive">Delete</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
