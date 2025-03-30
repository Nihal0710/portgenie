# AI Cover Letter Generator

The AI Cover Letter Generator is a powerful tool that helps users create personalized and professional cover letters tailored to specific job applications. This feature leverages the Gemini API to generate compelling cover letters based on job details and personal information.

## Features

- **Job-Specific Generation**: Create cover letters customized for specific job postings
- **Tone Customization**: Select from multiple writing tones (professional, conversational, etc.)
- **Length Control**: Adjust the level of detail in your cover letter
- **Export Options**: Copy to clipboard or download as a text file
- **User-Friendly Interface**: Simple form with clear sections for information input

## Setup Instructions

1. **API Key Configuration**

   Ensure your Google API key is set in the environment variables:

   ```
   GOOGLE_API_KEY=your_google_api_key
   ```

   You can obtain an API key from the [Google AI Studio](https://ai.google.dev/).

2. **Access**

   Navigate to the Cover Letter Generator section from the dashboard sidebar or card menu.

## How It Works

1. **Input Job Details**: Enter the job title, company name, and job description/requirements
2. **Add Personal Information**: Optionally, include relevant experience and skills
3. **Customize Settings**: Select the tone and length of your cover letter
4. **Generate**: Click the "Generate Cover Letter" button to create your cover letter
5. **Review and Export**: View the generated cover letter, make any desired edits, and export via copy or download

## Technical Implementation

- **Frontend**: React components with tabs, forms, and result display
- **Backend**: API route that communicates with the Gemini API
- **State Management**: React useState hooks for managing application state
- **Export Options**: Clipboard API and file download functionality

## Best Practices

- **Be Specific**: Provide detailed job descriptions for better results
- **Include Key Skills**: List relevant skills to highlight your qualifications
- **Review Before Sending**: Always read and edit the generated letter for accuracy
- **Customize Per Application**: Generate a new letter for each job application

## Limitations

- Generated cover letters should be reviewed and personalized before use
- The quality of the output depends on the detail provided in the inputs
- Some industry-specific terminology may need manual adjustment 