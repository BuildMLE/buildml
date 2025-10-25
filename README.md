# BuildML

Build Custom ML Models in Minutes, Not Months

BuildML helps Machine Learning Engineers create lightweight, custom models tailored to specific business needs automatically.

## Features

- **Lightning Fast**: Go from problem description to deployed model in under an hour
- **Purpose-Built**: Create models tailored to your exact use case
- **Production-Ready API**: Get instant API endpoints for your models
- **Automated Excellence**: AI agents handle data analysis, feature engineering, and model selection

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Firebase project (create one at [firebase.google.com](https://firebase.google.com))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd BuildML
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project (or select an existing one)
   - Enable Email/Password authentication:
     - Go to Authentication > Sign-in method
     - Enable Email/Password
   - Create a Firestore database:
     - Go to Firestore Database
     - Create database in production mode
   - Get your Firebase config:
     - Go to Project Settings > General
     - Scroll to "Your apps" and click the web icon (</>)
     - Copy the config values

4. Configure environment variables:
   - Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   - Fill in your Firebase credentials in `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. Set up Firestore Security Rules:
   - Go to Firestore Database > Rules
   - Add the following rules:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /models/{modelId} {
         allow read, write, create: if request.auth != null && request.auth.uid == resource.data.userId;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
       }
     }
   }
   ```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Sign Up**: Create a new account at `/signup`
2. **Create a Model**: 
   - Describe what you want to predict
   - Connect your data source (CSV or S3)
   - Wait ~10 seconds for training
3. **Get API Access**: Copy your API endpoint and key
4. **Integrate**: Use the provided code examples to integrate with your app

## Project Structure

```
BuildML/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── models/            # Model-related pages
│   │   ├── new/          # Create model flow
│   │   └── [id]/         # Model details page
│   ├── signin/           # Sign in page
│   ├── signup/           # Sign up page
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── auth/             # Auth-related components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Other components
├── contexts/             # React contexts
│   └── AuthContext.tsx   # Authentication context
├── lib/                  # Utility functions
│   ├── firebase.ts       # Firebase configuration
│   ├── types.ts          # TypeScript types
│   ├── utils.ts          # Utility functions
│   └── services/         # Service layer
│       └── training.ts   # Mock training service
└── ...
```

## Mock Training Service

The app currently uses a mock training service that simulates ML model training. After creating a model, it waits 10 seconds and then marks it as completed with randomly generated performance metrics.

To replace with a real API:
1. Open `lib/services/training.ts`
2. Replace the mock implementation with actual API calls
3. The service should update the model document in Firestore with the training results

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel project settings
5. Deploy

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
