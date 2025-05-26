# Financial Assistance Application

A comprehensive multi-step form wizard for financial assistance applications with AI-powered writing assistance, internationalization (English/Arabic), and accessibility features.

## Features

### Core Functionality

- **3-Step Form Wizard**: Personal Information → Family & Financial Info → Situation Descriptions
- **Progress Tracking**: Visual progress bar with step indicators
- **Local Storage**: Automatic form data persistence
- **Form Validation**: Real-time validation with error messages
- **Responsive Design**: Mobile, tablet, and desktop optimized

### AI Integration

- **GROKAI GPT Integration**: AI-powered writing assistance for situation descriptions
- **Smart Suggestions**: Context-aware text generation for financial hardship descriptions
- **Interactive Modal**: Accept, edit, or discard AI suggestions
- **Error Handling**: Graceful handling of API failures and timeouts

### Internationalization

- **Bilingual Support**: English and Arabic languages
- **RTL Support**: Right-to-left text direction for Arabic
- **Cultural Adaptation**: Localized form fields and validation messages
- **Language Persistence**: Remembers user's language preference

### Accessibility

- **ARIA Labels**: Proper accessibility labels and roles
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Semantic HTML and proper labeling
- **Focus Management**: Clear focus indicators and logical tab order

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Form Handling**: Custom form management with validation
- **AI Integration**: GROKAI grok-3
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- GROKAI API Key

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd financial-assistance-app
   \`\`

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd financial-assistance-app
   \`\`\`

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

1. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

Add your GROKAI API key to `.env.local`:
\`\`\`
GROK_API_KEY=your_grokai_api_key_here
\`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable       | Description                                  | Required |
| -------------- | -------------------------------------------- | -------- |
| `GROK_API_KEY` | Your GROK API key for AI assistance features | Yes      |

## Project Structure

\`\`\`
├── app/
│ ├── api/
│ │ ├── ai-assistance/
│ │ │ └── route.ts # GROK API integration
│ │ └── submit-application/
│ │ └── route.ts # Form submission endpoint
│ ├── globals.css # Global styles
│ ├── layout.tsx # Root layout
│ └── page.tsx # Main application page
├── components/
│ ├── steps/
│ │ ├── personal-information.tsx
│ │ ├── family-financial.tsx
│ │ └── situation-descriptions.tsx
│ ├── ai-suggestion-modal.tsx # AI suggestion popup
│ ├── form-wizard.tsx # Main form component
│ ├── language-switcher.tsx # Language toggle
│ └── progress-bar.tsx # Progress indicator
├── contexts/
│ ├── form-context.tsx # Form state management
│ └── language-context.tsx # Internationalization
├── hooks/
│ └── use-ai-assistance.tsx # AI integration hook
└── README.md
\`\`\`

## Form Steps

### Step 1: Personal Information

- Full Name
- National ID
- Date of Birth
- Gender
- Address (Street, City, State, Country)
- Phone Number
- Email Address

### Step 2: Family & Financial Information

- Marital Status
- Number of Dependents
- Employment Status
- Monthly Income
- Housing Status

### Step 3: Situation Descriptions (with AI Assistance)

- Current Financial Situation
- Employment Circumstances
- Reason for Applying

## AI Assistance Features

The application integrates with GROK grok-3 to help users write compelling descriptions for their financial assistance applications.

### How it works:

1. Click "Help Me Write" button next to any textarea in Step 3
2. AI generates a contextual suggestion based on the field type
3. Review the suggestion in a modal popup
4. Accept, edit, or discard the suggestion

### Supported Languages:

- English: Professional, empathetic writing assistance
- Arabic: Culturally appropriate and linguistically accurate suggestions

## Internationalization

The application supports English and Arabic with full RTL (Right-to-Left) support for Arabic text.

### Features:

- Dynamic language switching
- RTL layout adaptation
- Localized form labels and validation messages
- Cultural adaptation of form fields
- Language preference persistence

## Accessibility Features

- **Semantic HTML**: Proper use of form elements and labels
- **ARIA Labels**: Comprehensive accessibility attributes
- **Keyboard Navigation**: Full keyboard support with logical tab order
- **Focus Management**: Clear visual focus indicators
- **Screen Reader Support**: Optimized for assistive technologies
- **Color Contrast**: WCAG compliant color schemes

## API Endpoints

### POST /api/ai-assistance

Generates AI-powered text suggestions for form fields.

**Request Body:**
\`\`\`json
{
"prompt": "string",
"currentValue": "string (optional)",
"language": "en | ar"
}
\`\`\`

**Response:**
\`\`\`json
{
"suggestion": "string"
}
\`\`\`

### POST /api/submit-application

Submits the completed application form.

**Request Body:**
\`\`\`json
{
"personalInfo": { ... },
"familyFinancialInfo": { ... },
"situationDescriptions": { ... }
}
\`\`\`

**Response:**
\`\`\`json
{
"success": true,
"applicationId": "string",
"message": "string"
}
\`\`\`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler

### Code Quality

The project follows these standards:

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Semantic commit messages

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Architecture Decisions

### State Management

- **React Context**: Chosen for its simplicity and built-in React integration
- **Local Storage**: Automatic persistence without external dependencies
- **Form Validation**: Custom validation logic for better control

### AI Integration

- **GROKAI grok-3**: Balanced cost and quality for text generation
- **Error Handling**: Graceful degradation when AI services are unavailable
- **User Control**: Users can accept, edit, or discard AI suggestions

### Internationalization

- **Custom Implementation**: Lightweight solution without external dependencies
- **RTL Support**: Native CSS direction support for Arabic
- **Context-based**: Efficient re-rendering only when language changes

## Future Improvements

### Technical Enhancements

- [ ] Add form field validation with Zod
- [ ] Implement file upload for supporting documents
- [ ] Add unit and integration tests
- [ ] Implement caching for AI suggestions
- [ ] Add analytics and monitoring

### User Experience

- [ ] Add form auto-save indicators
- [ ] Implement draft recovery after browser crashes
- [ ] Add progress estimation for form completion
- [ ] Include accessibility audit and improvements
- [ ] Add more languages (French, Spanish, etc.)

### AI Features

- [ ] Context-aware suggestions based on previous fields
- [ ] Multiple suggestion options
- [ ] Suggestion quality rating
- [ ] Custom prompts for different assistance types

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or support, please contact [your-email@example.com](mailto:your-email@example.com).
