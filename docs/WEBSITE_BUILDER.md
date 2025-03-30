# AI Website Builder

The AI Website Builder is a powerful feature that allows users to generate custom websites with a live preview functionality. This tool leverages the Gemini API to create HTML, CSS, and JavaScript code based on user preferences and descriptions.

## Features

- **Website Generation**: Create custom websites by describing what you want
- **Live Preview**: See your website in real-time as you make changes
- **Code Editor**: Edit HTML, CSS, and JavaScript directly
- **Download**: Save your website as an HTML file
- **Customization Options**: Choose website type, color scheme, and complexity

## Setup Instructions

1. **API Key Configuration**

   Add your Google API key to the environment variables:

   ```
   GOOGLE_API_KEY=your_google_api_key
   ```

   You can obtain an API key from the [Google AI Studio](https://ai.google.dev/).

2. **Install Dependencies**

   Ensure you have the required dependencies installed:

   ```bash
   npm install @google/generative-ai
   ```

3. **Usage**

   Navigate to the Website Builder section from the dashboard to start creating websites.

## How It Works

1. **User Input**: Users provide a description of their desired website, select a website type, color scheme, and complexity level.

2. **AI Generation**: The system sends these preferences to the Gemini API, which generates HTML, CSS, and JavaScript code.

3. **Live Preview**: The generated code is immediately displayed in a live preview iframe.

4. **Customization**: Users can edit the code directly if needed and see changes reflected in real-time.

5. **Download**: The final website can be downloaded as a standalone HTML file that contains embedded CSS and JavaScript.

## Technical Implementation

- **Frontend**: React components with Tabs, Cards, and form elements
- **Backend**: API route that communicates with the Gemini API
- **State Management**: React useState hooks for managing application state
- **Preview**: Real-time preview using iframe with srcDoc attribute

## Limitations

- The generated websites are standalone HTML files and don't include backend functionality
- Complex interactive features might require additional manual coding
- The API has token limits that may restrict extremely complex website generation 