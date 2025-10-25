import { Timestamp } from "firebase/firestore";

export type ModelStatus = "training" | "completed" | "failed";

export type DataSourceType = "csv" | "s3";

export interface DataSource {
  type: DataSourceType;
  fileName?: string;
  fileSize?: number;
  bucketUrl?: string;
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
}

export interface Model {
  id: string;
  userId: string;
  name: string;
  problemDescription: string;
  dataSource: DataSource;
  status: ModelStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;
  apiEndpoint?: string;
  apiKey?: string;
  metrics?: ModelMetrics;
  errorMessage?: string;
  inputSchema?: Record<string, any>;
  outputSchema?: Record<string, any>;
}
