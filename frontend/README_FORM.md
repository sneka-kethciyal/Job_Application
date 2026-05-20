# Speech-to-Text Application Form

A modern, responsive React + Vite application that enables users to fill out a form using speech-to-text technology. All form fields support voice input with manual typing as a fallback.

## Features

✨ **Speech-to-Text Input**
- Web Speech API integration for all form fields
- Real-time speech recognition with confirmation prompts
- Automatic retry logic (max 3 retries per field)
- Fallback to manual typing after speech failures

📋 **Comprehensive Form Fields**
- Personal Details (First Name, Last Name, DOB)
- Academic Details (10th & 12th Marks)
- Undergraduate Details (UG CGPA, Project Details)
- Optional Postgraduate Section (appears conditionally)
- Resume Upload (PDF only)
- Self Introduction & Technical Details

🎨 **Modern UI/UX**
- Clean, card-based layout
- Responsive design (mobile, tablet, desktop)
- Dark mode support with CSS variables
- Smooth animations and transitions
- Professional color scheme with gradients
- Attractive microphone button with listening indicator

✅ **Form Validation**
- Required field validation
- Number validation for marks and CGPA
- PDF-only resume upload
- Character limits for text areas
- Comprehensive error messages

🌙 **Dark Mode Support**
- Toggle dark/light theme
- CSS variables for easy customization
- System preference detection

📱 **Responsive Design**
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface
- Proper spacing and typography

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── SpeechInput.jsx           # Reusable speech input for short fields
│   │   ├── TextAreaSpeechInput.jsx   # Reusable speech input for long text
│   │   ├── ResumeUpload.jsx          # PDF resume upload component
│   │   └── FormSection.jsx           # Form section wrapper
│   │
│   ├── pages/
│   │   └── ApplicationForm.jsx       # Main form page with all fields
│   │
│   ├── styles/
│   │   ├── App.css                   # App-wide styles & theme variables
│   │   ├── Form.css                  # Form layout and styling
│   │   └── SpeechInput.css           # Speech input components styling
│   │
│   ├── App.jsx                       # Main app component with dark mode toggle
│   ├── main.jsx                      # React entry point
│   └── index.css                     # Global base styles
│
├── public/                           # Static assets
├── index.html                        # HTML template
├── package.json                      # Dependencies
├── vite.config.js                    # Vite configuration
└── eslint.config.js                  # ESLint configuration
```

## Installation

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will start at `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Technology Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Web Speech API** - Speech recognition
- **CSS3** - Styling with CSS variables and animations
- **JavaScript ES6+** - Modern JavaScript

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome  | ✅ Full | Full Web Speech API support |
| Edge    | ✅ Full | Full Web Speech API support |
| Firefox | ⚠️ Limited | Speech API support varies |
| Safari  | ✅ Partial | Works with webkit prefix |
| Mobile  | ✅ Yes | Works on iOS 14.5+ and Android |

## How to Use

1. **Fill the Form:**
   - Click the microphone button (🎤) next to any field
   - Speak your answer clearly
   - The app will recognize and display what it heard

2. **Confirmation:**
   - Review the recognized text
   - Click "Yes" to confirm or "Retry" to try again
   - Maximum 3 retries allowed

3. **Manual Input:**
   - If speech fails after 3 retries, type manually
   - Speech button will be disabled for that field

4. **Conditional Sections:**
   - PG section appears only if you select "Yes" for "Do you have PG?"

5. **Resume Upload:**
   - Click the upload box or select file
   - Only PDF files are accepted

6. **Submit:**
   - Fill all required fields (marked with *)
   - Click "Submit Application"
   - Success notification confirms submission

## Customization

### Change Color Theme
Edit the CSS variables in `src/styles/App.css`:
```css
:root {
  --primary-color: #3b82f6;      /* Change primary blue */
  --secondary-color: #8b5cf6;    /* Change secondary purple */
  --success-color: #10b981;      /* Change success green */
  /* ... other colors ... */
}
```

### Adjust Retry Limit
Edit `SpeechInput.jsx` and `TextAreaSpeechInput.jsx`:
```javascript
if (newRetryCount >= 3) {  // Change 3 to desired number
  setSpeechDisabled(true);
}
```

### Change Language
Modify the language code in components:
```javascript
recognitionRef.current.lang = 'en-US';  // Change to other language codes
```

## Browser Permissions

The application will request microphone permission when first using speech recognition. Users must grant permission for the feature to work.

## Performance Tips

1. Clear browser cache if experiencing issues
2. Use HTTPS in production (Web Speech API may require it)
3. Test microphone permissions in browser settings
4. Use modern browsers for best experience

## Troubleshooting

### Speech Recognition Not Working
- Check browser support (Chrome/Edge recommended)
- Grant microphone permission
- Ensure you're using HTTPS in production
- Check browser console for errors

### Resume Upload Issues
- Only PDF files are supported
- Check file size (ensure it's reasonable)
- Verify file is not corrupted

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Hard refresh the page (Ctrl+Shift+R)
- Check browser DevTools for CSS errors

## Features Roadmap

- [ ] Multi-language support
- [ ] Record and playback audio
- [ ] Form auto-save to localStorage
- [ ] Export form data as PDF
- [ ] Text-to-speech for form instructions
- [ ] Field-wise progress indicator
- [ ] Signature capture

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify microphone permissions
3. Test with a modern browser (Chrome/Edge)
4. Check browser compatibility for Web Speech API

---

Built with ❤️ using React + Vite
