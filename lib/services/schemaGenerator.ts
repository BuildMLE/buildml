export interface SchemaSet {
  input: Record<string, any>;
  output: Record<string, any>;
}

interface SchemaPattern {
  keywords: string[];
  priority: number;
  generator: () => SchemaSet;
}

const createSchema = (properties: Record<string, { type: string; description: string; items?: any; minimum?: number; maximum?: number }>, required: string[] = []) => ({
  type: "object",
  properties: Object.entries(properties).reduce((acc, [key, value]) => {
    acc[key] = { type: value.type, description: value.description };
    if (value.items) acc[key].items = value.items;
    if (value.minimum !== undefined) acc[key].minimum = value.minimum;
    if (value.maximum !== undefined) acc[key].maximum = value.maximum;
    return acc;
  }, {} as Record<string, any>),
  required
});

const schemaPatterns: SchemaPattern[] = [
  {
    keywords: ['fraud', 'fraudulent', 'scam', 'spam', 'phishing', 'fake'],
    priority: 10,
    generator: () => ({
      input: createSchema({
        text_content: { type: 'string', description: 'The text content to analyze' },
        sender_email: { type: 'string', description: 'Email address of the sender' },
        subject: { type: 'string', description: 'Email or message subject' },
        metadata: { type: 'object', description: 'Additional contextual information' }
      }, ['text_content']),
      output: createSchema({
        is_fraudulent: { type: 'boolean', description: 'Whether the content is fraudulent' },
        confidence: { type: 'number', description: 'Confidence score between 0 and 1', minimum: 0, maximum: 1 },
        risk_factors: { type: 'array', description: 'List of identified risk factors', items: { type: 'string' } },
        severity: { type: 'string', description: 'Risk level: low, medium, high' }
      }, ['is_fraudulent', 'confidence'])
    })
  },
  
  {
    keywords: ['churn', 'retention', 'attrition', 'cancel', 'unsubscribe'],
    priority: 10,
    generator: () => ({
      input: createSchema({
        customer_id: { type: 'string', description: 'Unique customer identifier' },
        days_active: { type: 'integer', description: 'Number of days as customer', minimum: 0 },
        engagement_score: { type: 'number', description: 'Engagement metric', minimum: 0, maximum: 100 },
        last_activity_days: { type: 'integer', description: 'Days since last activity', minimum: 0 },
        support_tickets: { type: 'integer', description: 'Number of support tickets filed', minimum: 0 }
      }, ['customer_id', 'days_active']),
      output: createSchema({
        will_churn: { type: 'boolean', description: 'Predicted churn likelihood' },
        churn_probability: { type: 'number', description: 'Probability between 0 and 1', minimum: 0, maximum: 1 },
        churn_date_estimate: { type: 'string', description: 'Estimated date of churn (ISO 8601)' },
        retention_factors: { type: 'array', description: 'Factors affecting retention', items: { type: 'string' } }
      }, ['will_churn', 'churn_probability'])
    })
  },
  
  {
    keywords: ['sentiment', 'emotion', 'feeling', 'opinion', 'review'],
    priority: 9,
    generator: () => ({
      input: createSchema({
        text: { type: 'string', description: 'Text to analyze for sentiment' },
        language: { type: 'string', description: 'Language code (e.g., en, es)' },
        context: { type: 'string', description: 'Additional context about the text' }
      }, ['text']),
      output: createSchema({
        sentiment: { type: 'string', description: 'Sentiment classification: positive, negative, or neutral' },
        score: { type: 'number', description: 'Sentiment score between -1 and 1', minimum: -1, maximum: 1 },
        confidence: { type: 'number', description: 'Confidence in prediction', minimum: 0, maximum: 1 },
        emotions: { type: 'object', description: 'Breakdown of detected emotions' }
      }, ['sentiment', 'score'])
    })
  },
  
  {
    keywords: ['classify', 'classification', 'categorize', 'category', 'label', 'tag'],
    priority: 8,
    generator: () => ({
      input: createSchema({
        text: { type: 'string', description: 'Text to classify' },
        features: { type: 'object', description: 'Additional features for classification' },
        metadata: { type: 'object', description: 'Contextual metadata' }
      }, ['text']),
      output: createSchema({
        category: { type: 'string', description: 'Predicted category' },
        confidence: { type: 'number', description: 'Confidence score', minimum: 0, maximum: 1 },
        all_categories: { type: 'array', description: 'All possible categories with scores', items: { type: 'object' } },
        reasoning: { type: 'string', description: 'Explanation of classification' }
      }, ['category', 'confidence'])
    })
  },
  
  {
    keywords: ['price', 'pricing', 'cost', 'estimate', 'valuation', 'worth'],
    priority: 9,
    generator: () => ({
      input: createSchema({
        features: { type: 'object', description: 'Relevant features (size, location, etc.)' },
        category: { type: 'string', description: 'Item category' },
        condition: { type: 'string', description: 'Item condition' },
        market_data: { type: 'object', description: 'Current market conditions' }
      }, ['features', 'category']),
      output: createSchema({
        predicted_price: { type: 'number', description: 'Estimated price', minimum: 0 },
        price_range_min: { type: 'number', description: 'Minimum price estimate', minimum: 0 },
        price_range_max: { type: 'number', description: 'Maximum price estimate', minimum: 0 },
        confidence_interval: { type: 'number', description: 'Confidence level', minimum: 0, maximum: 1 }
      }, ['predicted_price'])
    })
  },
  
  {
    keywords: ['recommend', 'recommendation', 'suggest', 'personalize'],
    priority: 8,
    generator: () => ({
      input: createSchema({
        user_id: { type: 'string', description: 'User identifier' },
        user_preferences: { type: 'object', description: 'User preferences and history' },
        context: { type: 'object', description: 'Current context (time, location, etc.)' },
        num_recommendations: { type: 'integer', description: 'Number of recommendations', minimum: 1 }
      }, ['user_id']),
      output: createSchema({
        recommendations: { type: 'array', description: 'List of recommended items', items: { type: 'object' } },
        scores: { type: 'array', description: 'Relevance scores for each item', items: { type: 'number' } },
        reasoning: { type: 'object', description: 'Explanation for recommendations' },
        diversity_score: { type: 'number', description: 'Recommendation diversity', minimum: 0, maximum: 1 }
      }, ['recommendations'])
    })
  },
  
  {
    keywords: ['anomaly', 'outlier', 'abnormal', 'unusual', 'detect'],
    priority: 8,
    generator: () => ({
      input: createSchema({
        metrics: { type: 'object', description: 'Metrics to analyze' },
        timestamp: { type: 'string', description: 'ISO 8601 timestamp' },
        context: { type: 'object', description: 'Contextual information' },
        baseline: { type: 'object', description: 'Normal behavior baseline' }
      }, ['metrics', 'timestamp']),
      output: createSchema({
        is_anomaly: { type: 'boolean', description: 'Whether anomaly detected' },
        anomaly_score: { type: 'number', description: 'Anomaly severity', minimum: 0, maximum: 1 },
        anomaly_type: { type: 'string', description: 'Type of anomaly detected' },
        affected_metrics: { type: 'array', description: 'Metrics showing anomalies', items: { type: 'string' } }
      }, ['is_anomaly', 'anomaly_score'])
    })
  },
  
  {
    keywords: ['image', 'photo', 'picture', 'visual', 'recognize'],
    priority: 7,
    generator: () => ({
      input: createSchema({
        image_url: { type: 'string', description: 'URL to the image' },
        image_base64: { type: 'string', description: 'Base64 encoded image' },
        max_labels: { type: 'integer', description: 'Maximum number of labels to return', minimum: 1 }
      }, ['image_url']),
      output: createSchema({
        labels: { type: 'array', description: 'Detected labels/objects', items: { type: 'string' } },
        confidence_scores: { type: 'array', description: 'Confidence for each label', items: { type: 'number' } },
        bounding_boxes: { type: 'array', description: 'Coordinates of detected objects', items: { type: 'object' } },
        metadata: { type: 'object', description: 'Additional image information' }
      }, ['labels'])
    })
  },
  
  {
    keywords: ['summarize', 'summary', 'extract', 'abstract', 'tldr'],
    priority: 7,
    generator: () => ({
      input: createSchema({
        text: { type: 'string', description: 'Text to summarize' },
        max_length: { type: 'integer', description: 'Maximum summary length in characters', minimum: 1 },
        style: { type: 'string', description: 'Summary style (brief, detailed)' },
        key_points: { type: 'boolean', description: 'Whether to extract key points' }
      }, ['text']),
      output: createSchema({
        summary: { type: 'string', description: 'Generated summary' },
        key_points: { type: 'array', description: 'Main points extracted', items: { type: 'string' } },
        length_ratio: { type: 'number', description: 'Compression ratio', minimum: 0, maximum: 1 },
        important_entities: { type: 'array', description: 'Key entities mentioned', items: { type: 'string' } }
      }, ['summary'])
    })
  },
  
  {
    keywords: ['predict', 'forecast', 'estimate'],
    priority: 5,
    generator: () => ({
      input: createSchema({
        features: { type: 'object', description: 'Input features for prediction' },
        timestamp: { type: 'string', description: 'Reference timestamp (ISO 8601)' },
        historical_data: { type: 'array', description: 'Historical data points', items: { type: 'object' } }
      }, ['features']),
      output: createSchema({
        prediction: { type: 'number', description: 'Predicted value' },
        confidence_interval: { type: 'object', description: 'Upper and lower bounds' },
        trend: { type: 'string', description: 'Predicted trend direction' },
        factors: { type: 'array', description: 'Contributing factors', items: { type: 'string' } }
      }, ['prediction'])
    })
  }
];

export function generateSchemas(problemDescription: string): SchemaSet {
  if (!problemDescription || problemDescription.trim().length === 0) {
    return getDefaultSchema();
  }

  const lowerDescription = problemDescription.toLowerCase();
  
  let bestMatch: SchemaPattern | null = null;
  let highestPriority = -1;

  for (const pattern of schemaPatterns) {
    const matchCount = pattern.keywords.filter(keyword => 
      lowerDescription.includes(keyword)
    ).length;

    if (matchCount > 0) {
      const effectivePriority = pattern.priority * matchCount;
      if (effectivePriority > highestPriority) {
        highestPriority = effectivePriority;
        bestMatch = pattern;
      }
    }
  }

  if (bestMatch) {
    return bestMatch.generator();
  }

  return getDefaultSchema();
}

function getDefaultSchema(): SchemaSet {
  return {
    input: createSchema({
      data: { type: 'object', description: 'Your input data' },
      features: { type: 'object', description: 'Relevant features' },
      metadata: { type: 'object', description: 'Additional metadata' }
    }, ['data']),
    output: createSchema({
      prediction: { type: 'string', description: 'The model prediction' },
      confidence: { type: 'number', description: 'Confidence score', minimum: 0, maximum: 1 },
      metadata: { type: 'object', description: 'Additional information' }
    }, ['prediction'])
  };
}

export function validateSchema(schemaString: string): { valid: boolean; error?: string; parsed?: Record<string, any> } {
  if (!schemaString || schemaString.trim().length === 0) {
    return { valid: true, parsed: {} };
  }

  try {
    const parsed = JSON.parse(schemaString);
    
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {
        valid: false,
        error: 'Schema must be a JSON object, not an array or primitive value'
      };
    }

    return { valid: true, parsed };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON syntax'
    };
  }
}

export function formatSchema(schemaObject: Record<string, any>): string {
  return JSON.stringify(schemaObject, null, 2);
}

export function schemaToString(schema: Record<string, any> | undefined): string {
  if (!schema || Object.keys(schema).length === 0) {
    return '';
  }
  return formatSchema(schema);
}
