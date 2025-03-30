# AI Image Generator

The AI Image Generator is a powerful tool that allows users to create high-quality images using Google's Gemini 2.0 model. This feature leverages cutting-edge AI technology to transform text prompts into visual content for portfolios, projects, and other professional needs.

## Features

- **Text-to-Image Generation**: Create images from detailed text descriptions
- **High-Quality Output**: Generate professional-grade images suitable for portfolios and projects
- **User-Friendly Interface**: Simple prompt input with sample suggestions
- **Download Options**: Easily save generated images for use in other applications
- **Sample Prompts**: Pre-written prompt examples to help get started

## Setup Instructions

1. **Python Requirements**

   The image generator requires Python and the Google Generative AI Python SDK. Install the necessary dependencies:

   ```bash
   pip install google-generativeai pillow
   ```

2. **API Key Configuration**

   Ensure your Google API key is set in the environment variables:

   ```
   GOOGLE_API_KEY=your_google_api_key
   ```

   This key needs to have access to the Gemini 2.0 image generation capabilities.

3. **File Storage**

   The system will automatically create a `public/generated-images` directory to store generated images.

## How It Works

1. **Enter a Prompt**: Describe the image you want to generate in detail
2. **Generate Image**: The system sends your prompt to Google's Gemini 2.0 model
3. **View Result**: The generated image is displayed in the interface
4. **Download**: Save the image for use in your portfolio or other applications

## Technical Implementation

- **Backend**: Python script using Google's Generative AI SDK
- **Integration**: Node.js child process to execute Python from Next.js API routes
- **Frontend**: React components with tabs for create and result views
- **Storage**: Local filesystem storage in the public directory

## Best Practices

- **Be Specific**: Provide detailed descriptions for better results
- **Mention Style**: Include specific style words like "professional", "minimalist", etc.
- **Include Colors**: Specify color schemes for more targeted results
- **Describe Purpose**: Mention how the image will be used (e.g., header, logo, etc.)
- **Iterate**: Try different prompts if the initial results aren't what you expected

## Limitations

- Image generation may take 15-30 seconds depending on server load
- Generated images reflect the capabilities and limitations of the Gemini 2.0 model
- The quality and accuracy of results depend on the specificity and clarity of the prompt 