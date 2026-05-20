/**
 * ApplicationForm.jsx
 *
 * Complete job-application form with:
 *   • Text input for every field
 *   • Voice input (SpeechRecognition + MediaRecorder) for every field
 *   • Resume PDF upload
 *   • FormData construction  →  POST /submit-application (Flask)
 *
 * State pattern per voice-capable field:
 *   const [<field>Text,  set<Field>Text]  = useState('')   // text value
 *   const [<field>Audio, set<Field>Audio] = useState(null) // File | null
 */

import { useState } from 'react';

import SpeechInput from '../components/SpeechInput';
import TextAreaSpeechInput from '../components/TextAreaSpeechInput';
import ResumeUpload from '../components/ResumeUpload';
import FormSection from '../components/FormSection';
import { submitApplication } from '../services/api';
import '../styles/Form.css';
import '../styles/SpeechInput.css';
import {
  logout,
  isSessionValid
} from '../services/auth'

import { useEffect } from 'react'
const ApplicationForm = () => {


  const VOICE_FIELDS_VISIBLE = false
  // ─────────────────────────────────────────────────────────────
  // TEXT state — one per form field
  // ─────────────────────────────────────────────────────────────
  const [firstNameText,        setFirstNameText]        = useState('');
  const [lastNameText,         setLastNameText]          = useState('');
  const [dobText,              setDobText]               = useState('');

  const [tenthMarkText,        setTenthMarkText]         = useState('');
  const [twelfthMarkText,      setTwelfthMarkText]       = useState('');

  const [ugCgpaText,           setUgCgpaText]            = useState('');
  const [ugProjectNameText,    setUgProjectNameText]     = useState('');
  const [ugProjectDomainText,  setUgProjectDomainText]   = useState('');
  const [ugProjectAboutText,   setUgProjectAboutText]    = useState('');

  const [hasPG,                setHasPG]                 = useState('No');
  const [pgCgpaText,           setPgCgpaText]            = useState('');
  const [pgProjectNameText,    setPgProjectNameText]     = useState('');
  const [pgProjectDomainText,  setPgProjectDomainText]   = useState('');
  const [pgProjectAboutText,   setPgProjectAboutText]    = useState('');

  const [aboutYourselfText,    setAboutYourselfText]     = useState('');
  const [comfortableTechText,  setComfortableTechText]   = useState('');

  const [resumeFile,           setResumeFile]            = useState(null);

  // ─────────────────────────────────────────────────────────────
  // AUDIO state — one per voice-capable field (File | null)
  // ─────────────────────────────────────────────────────────────
  const [firstNameAudio,        setFirstNameAudio]        = useState(null);
  const [lastNameAudio,         setLastNameAudio]          = useState(null);
  const [dobAudio,              setDobAudio]               = useState(null);

  const [tenthMarkAudio,        setTenthMarkAudio]         = useState(null);
  const [twelfthMarkAudio,      setTwelfthMarkAudio]       = useState(null);

  const [ugCgpaAudio,           setUgCgpaAudio]            = useState(null);
  const [ugProjectNameAudio,    setUgProjectNameAudio]     = useState(null);
  const [ugProjectDomainAudio,  setUgProjectDomainAudio]   = useState(null);
  const [ugProjectAboutAudio,   setUgProjectAboutAudio]    = useState(null);

  const [pgCgpaAudio,           setPgCgpaAudio]            = useState(null);
  const [pgProjectNameAudio,    setPgProjectNameAudio]     = useState(null);
  const [pgProjectDomainAudio,  setPgProjectDomainAudio]   = useState(null);
  const [pgProjectAboutAudio,   setPgProjectAboutAudio]    = useState(null);

  const [aboutYourselfAudio,    setAboutYourselfAudio]     = useState(null);
  const [comfortableTechAudio,  setComfortableTechAudio]   = useState(null);

  // ─────────────────────────────────────────────────────────────
  // UI state
  // ─────────────────────────────────────────────────────────────
  const [showPG,       setShowPG]       = useState(false);
  const [errors,       setErrors]       = useState({});
  const [submitting,   setSubmitting]   = useState(false);
  const [submitted,    setSubmitted]    = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType,    setToastType]    = useState('');  // 'success' | 'error'
const [jobCode, setJobCode] = useState('');
  // ─────────────────────────────────────────────────────────────
  // PG toggle
  // ─────────────────────────────────────────────────────────────
  const handlePGChange = (value) => {
    setHasPG(value);
    setShowPG(value === 'Yes');
    if (value === 'No') {
      setPgCgpaText('');        setPgCgpaAudio(null);
      setPgProjectNameText(''); setPgProjectNameAudio(null);
      setPgProjectDomainText('');setPgProjectDomainAudio(null);
      setPgProjectAboutText('');setPgProjectAboutAudio(null);
    }
  };
  

  // ─────────────────────────────────────────────────────────────
  // Toast helper
  // ─────────────────────────────────────────────────────────────
  const showToast = (message, type = 'error') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => { setToastMessage(''); setToastType(''); }, 4000);
  };
//
useEffect(() => {

  const checkSession = () => {

    const valid =
      isSessionValid()

    if (!valid) {

      logout()
    }
  }

  checkSession()

  const interval =
    setInterval(checkSession, 2000)

  return () =>
    clearInterval(interval)

}, [])
//
  // ─────────────────────────────────────────────────────────────
  // Validation
  // ─────────────────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};

    if (!firstNameText.trim())       newErrors.firstNameText       = 'First Name is required';
    if (!lastNameText.trim())        newErrors.lastNameText        = 'Last Name is required';
    if (!dobText.trim())             newErrors.dobText             = 'Date of Birth is required';
    if (!tenthMarkText.trim())       newErrors.tenthMarkText       = '10th Marks is required';
    if (!twelfthMarkText.trim())     newErrors.twelfthMarkText     = '12th Marks is required';
    if (!ugCgpaText.trim())          newErrors.ugCgpaText          = 'UG CGPA is required';
    if (!ugProjectNameText.trim())   newErrors.ugProjectNameText   = 'UG Project Name is required';
    if (!ugProjectDomainText.trim()) newErrors.ugProjectDomainText = 'UG Project Domain is required';
    if (!ugProjectAboutText.trim())  newErrors.ugProjectAboutText  = 'About UG Project is required';
    if (!aboutYourselfText.trim())   newErrors.aboutYourselfText   = 'Self Introduction is required';
    if (!comfortableTechText.trim()) newErrors.comfortableTechText = 'Technology details are required';
    if (!resumeFile)                 newErrors.resumeFile          = 'Resume is required';
    if (!jobCode.trim()) {
  newErrors.jobCode = 'Job Code is required';
}
    if (showPG && hasPG === 'Yes') {
      if (!pgCgpaText.trim())          newErrors.pgCgpaText          = 'PG CGPA is required';
      if (!pgProjectNameText.trim())   newErrors.pgProjectNameText   = 'PG Project Name is required';
      if (!pgProjectDomainText.trim()) newErrors.pgProjectDomainText = 'PG Project Domain is required';
      if (!pgProjectAboutText.trim())  newErrors.pgProjectAboutText  = 'About PG Project is required';
    }

    // Numeric checks
    ['tenthMarkText', 'twelfthMarkText', 'ugCgpaText', 'pgCgpaText'].forEach((key) => {
      const val = { tenthMarkText, twelfthMarkText, ugCgpaText, pgCgpaText }[key];
      if (val && isNaN(val)) newErrors[key] = 'Please enter a valid number';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─────────────────────────────────────────────────────────────
  // Reset all state
  // ─────────────────────────────────────────────────────────────
  const resetForm = () => {
    setFirstNameText('');        setFirstNameAudio(null);
    setLastNameText('');         setLastNameAudio(null);
    setDobText('');              setDobAudio(null);
    setTenthMarkText('');        setTenthMarkAudio(null);
    setTwelfthMarkText('');      setTwelfthMarkAudio(null);
    setUgCgpaText('');           setUgCgpaAudio(null);
    setUgProjectNameText('');    setUgProjectNameAudio(null);
    setUgProjectDomainText('');  setUgProjectDomainAudio(null);
    setUgProjectAboutText('');   setUgProjectAboutAudio(null);
    setHasPG('No');
    setPgCgpaText('');           setPgCgpaAudio(null);
    setPgProjectNameText('');    setPgProjectNameAudio(null);
    setPgProjectDomainText('');  setPgProjectDomainAudio(null);
    setPgProjectAboutText('');   setPgProjectAboutAudio(null);
    setAboutYourselfText('');    setAboutYourselfAudio(null);
    setComfortableTechText('');  setComfortableTechAudio(null);
    setResumeFile(null);
    setJobCode('');
    setShowPG(false);
    setErrors({});
  };

  // ─────────────────────────────────────────────────────────────
  // Submit handler — builds FormData and sends to Flask
  // ─────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fill all required fields correctly', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();

      // ── Text fields ────────────────────────────────────────
      formData.append('first_name',             firstNameText);
      formData.append('last_name',              lastNameText);
      formData.append('dob',                    dobText);

      formData.append('tenth_mark',             tenthMarkText);
      formData.append('twelfth_mark',           twelfthMarkText);
      formData.append('job_code', jobCode);
      formData.append('ug_cgpa',                ugCgpaText);
      formData.append('ug_project_name',        ugProjectNameText);
      formData.append('ug_project_domain',      ugProjectDomainText);
      formData.append('ug_project_about',       ugProjectAboutText);

      formData.append('has_pg',                 hasPG);
      formData.append('pg_cgpa',                pgCgpaText);
      formData.append('pg_project_name',        pgProjectNameText);
      formData.append('pg_project_domain',      pgProjectDomainText);
      formData.append('pg_project_about',       pgProjectAboutText);

      formData.append('about_yourself',         aboutYourselfText);
      formData.append('comfortable_technology', comfortableTechText);
const currentDate = new Date().toISOString()

formData.append('created_at', currentDate)
formData.append('updated_at', currentDate)
      // ── Resume PDF ─────────────────────────────────────────
      formData.append('resume', resumeFile);

      // ── Audio files (only if voice was used) ───────────────
      if (firstNameAudio)       formData.append('first_name_audio',             firstNameAudio);
      if (lastNameAudio)        formData.append('last_name_audio',              lastNameAudio);
      if (dobAudio)             formData.append('dob_audio',                    dobAudio);

      if (tenthMarkAudio)       formData.append('tenth_mark_audio',             tenthMarkAudio);
      if (twelfthMarkAudio)     formData.append('twelfth_mark_audio',           twelfthMarkAudio);

      if (ugCgpaAudio)          formData.append('ug_cgpa_audio',                ugCgpaAudio);
      if (ugProjectNameAudio)   formData.append('ug_project_name_audio',        ugProjectNameAudio);
      if (ugProjectDomainAudio) formData.append('ug_project_domain_audio',      ugProjectDomainAudio);
      if (ugProjectAboutAudio)  formData.append('ug_project_about_audio',       ugProjectAboutAudio);

      if (pgCgpaAudio)          formData.append('pg_cgpa_audio',                pgCgpaAudio);
      if (pgProjectNameAudio)   formData.append('pg_project_name_audio',        pgProjectNameAudio);
      if (pgProjectDomainAudio) formData.append('pg_project_domain_audio',      pgProjectDomainAudio);
      if (pgProjectAboutAudio)  formData.append('pg_project_about_audio',       pgProjectAboutAudio);

      if (aboutYourselfAudio)   formData.append('about_yourself_audio',         aboutYourselfAudio);
      if (comfortableTechAudio) formData.append('comfortable_technology_audio', comfortableTechAudio);

      // ── Send to Flask API ──────────────────────────────────
      const response = await submitApplication(formData);

      if (response.success) {
        setSubmitted(true);
        showToast('✅ Application submitted successfully!', 'success');
        setTimeout(() => { resetForm(); setSubmitted(false); }, 3000);
      } else {
        showToast(`❌ ${response.message}`, 'error');
      }
    } catch (error) {
      console.error('Submission error:', error);

      if (error.response) {
        // Server responded with non-2xx
        showToast(`❌ Server error: ${error.response.data?.message || error.response.statusText}`, 'error');
      } else if (error.request) {
        // No response — likely CORS or server down
        showToast('❌ Cannot reach the server. Is the Flask backend running on port 5000?', 'error');
      } else {
        showToast(`❌ Error: ${error.message}`, 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="application-form-container">
      
      <header className="form-header">
        <h1>Application Form</h1>
        <p>Speak or type your answers to fill this form</p>
      </header>

      <form onSubmit={handleSubmit} className="application-form">

        {/* ── Personal Details ──────────────────────────────── */}
        <FormSection title="Personal Details" subtitle="Basic information about you">
          <div className="form-grid form-grid-2">
            <SpeechInput
              label="First Name"
              value={firstNameText}
              onChange={setFirstNameText}
              onAudioCapture={setFirstNameAudio}
              placeholder="Enter your first name"
              required
              question="What is your first name?"
              hideVoice={true}
            />
            {errors.firstNameText && <span className="field-error">{errors.firstNameText}</span>}

            <SpeechInput
              label="Last Name"
              value={lastNameText}
              onChange={setLastNameText}
              onAudioCapture={setLastNameAudio}
              placeholder="Enter your last name"
              required
              question="What is your last name?"
              hideVoice={true}
            />
            {errors.lastNameText && <span className="field-error">{errors.lastNameText}</span>}
          </div>

          <div className="form-grid form-grid-1">
            <SpeechInput
              label="Date of Birth"
              value={dobText}
              onChange={setDobText}
              onAudioCapture={setDobAudio}
              placeholder="E.g., 15-07-2000"
              required
              type="date"
              question="What is your date of birth?"
              hideVoice={true}
            />
            {errors.dobText && <span className="field-error">{errors.dobText}</span>}
          </div>
        </FormSection>

        {/* ── Academic Details ──────────────────────────────── */}
        <FormSection title="Academic Details" subtitle="Your 10th and 12th marks">
          <div className="form-grid form-grid-2">
            <SpeechInput
              label="10th Mark / Percentage"
              value={tenthMarkText}
              onChange={setTenthMarkText}
              onAudioCapture={setTenthMarkAudio}
              placeholder="E.g., 85.5"
              required
              type="number"
              question="What are your 10th grade marks or percentage?"
              hideVoice={true}
            />
            {errors.tenthMarkText && <span className="field-error">{errors.tenthMarkText}</span>}

            <SpeechInput
              label="12th Mark / Percentage"
              value={twelfthMarkText}
              onChange={setTwelfthMarkText}
              onAudioCapture={setTwelfthMarkAudio}
              placeholder="E.g., 90.0"
              required
              type="number"
              question="What are your 12th grade marks or percentage?"
            hideVoice={true}
            />
            {errors.twelfthMarkText && <span className="field-error">{errors.twelfthMarkText}</span>}
          </div>
        </FormSection>

        {/* ── UG Details ────────────────────────────────────── */}
        <FormSection title="Undergraduate (UG) Details" subtitle="Your university education details">
          <div className="form-grid form-grid-2">
            <SpeechInput
              label="UG CGPA"
              value={ugCgpaText}
              onChange={setUgCgpaText}
              onAudioCapture={setUgCgpaAudio}
              placeholder="E.g., 8.5"
              required
              type="number"
              question="What is your undergraduate CGPA?"
              hideVoice={true}
            />
            {errors.ugCgpaText && <span className="field-error">{errors.ugCgpaText}</span>}

            <SpeechInput
              label="UG Project Name"
              value={ugProjectNameText}
              onChange={setUgProjectNameText}
              onAudioCapture={setUgProjectNameAudio}
              placeholder="Enter your project name"
              required
              hideVoice={true}
              question="What is the name of your undergraduate project?"
            />
            {errors.ugProjectNameText && <span className="field-error">{errors.ugProjectNameText}</span>}
          </div>

          <div className="form-grid form-grid-1">
            <SpeechInput
              label="UG Project Domain"
              value={ugProjectDomainText}
              onChange={setUgProjectDomainText}
              onAudioCapture={setUgProjectDomainAudio}
              placeholder="E.g., Machine Learning, Web Development"
              required
              question="What is the domain of your undergraduate project?"
              hideVoice={true}
            />
            {errors.ugProjectDomainText && <span className="field-error">{errors.ugProjectDomainText}</span>}
          </div>

          <div className="form-grid form-grid-1">
            <TextAreaSpeechInput
              label="About UG Project"
              value={ugProjectAboutText}
              onChange={setUgProjectAboutText}
              onAudioCapture={setUgProjectAboutAudio}
              placeholder="Describe your project (minimum 2 lines)"
              required
              minLines={2}
              maxLength={500}
              rows={4}
              question="Please tell me about your undergraduate project. What does it do and why is it important?"
              hideVoice={true}
            />
            {errors.ugProjectAboutText && <span className="field-error">{errors.ugProjectAboutText}</span>}
          </div>
        </FormSection>

        {/* ── PG Question ───────────────────────────────────── */}
        <FormSection title="Postgraduate (PG) Education" subtitle="Do you have postgraduate qualifications?">
          <div className="pg-question">
            <label className="pg-label">Do you have PG?</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="hasPG"
                  value="Yes"
                  checked={hasPG === 'Yes'}
                  onChange={(e) => handlePGChange(e.target.value)}
                />
                <span>Yes</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="hasPG"
                  value="No"
                  checked={hasPG === 'No'}
                  onChange={(e) => handlePGChange(e.target.value)}
                />
                <span>No</span>
              </label>
            </div>
          </div>
        </FormSection>

        {/* ── PG Details (conditional) ──────────────────────── */}
        {showPG && (
          <FormSection title="PG Details" subtitle="Your postgraduate education details">
            <div className="form-grid form-grid-2">
              <SpeechInput
                label="PG CGPA"
                value={pgCgpaText}
                onChange={setPgCgpaText}
                onAudioCapture={setPgCgpaAudio}
                placeholder="E.g., 8.2"
                required
                type="number"
                question="What is your postgraduate CGPA?"
                hideVoice={true}
              />
              {errors.pgCgpaText && <span className="field-error">{errors.pgCgpaText}</span>}

              <SpeechInput
                label="PG Project Name"
                value={pgProjectNameText}
                onChange={setPgProjectNameText}
                onAudioCapture={setPgProjectNameAudio}
                placeholder="Enter your project name"
                required
                hideVoice={true}
              
                question="What is the name of your postgraduate project?"
              />
              {errors.pgProjectNameText && <span className="field-error">{errors.pgProjectNameText}</span>}
            </div>

            <div className="form-grid form-grid-1">
              <SpeechInput
                label="PG Project Domain"
                value={pgProjectDomainText}
                onChange={setPgProjectDomainText}
                onAudioCapture={setPgProjectDomainAudio}
                placeholder="E.g., AI, Data Science"
                required
                hideVoice={true}
                question="What is the domain of your postgraduate project?"
              />
              {errors.pgProjectDomainText && <span className="field-error">{errors.pgProjectDomainText}</span>}
            </div>

            <div className="form-grid form-grid-1">
              <TextAreaSpeechInput
                label="About PG Project"
                value={pgProjectAboutText}
                onChange={setPgProjectAboutText}
                onAudioCapture={setPgProjectAboutAudio}
                placeholder="Describe your project (minimum 2 lines)"
                required
                minLines={2}
                maxLength={500}
                rows={4}
                question="Please tell me about your postgraduate project. What does it do and what are its key features?"
                hideVoice={true}
              />
              {errors.pgProjectAboutText && <span className="field-error">{errors.pgProjectAboutText}</span>}
            </div>
          </FormSection>
        )}

        {/* ── Job Code ─────────────────────────────────── */}
<FormSection
  title="Job Code"
  subtitle="Select the job role you are applying for"
>
  <div className="form-grid form-grid-1">

    <div className="speech-input-container">

      <label className="speech-label">
        Job Code
        <span className="required-asterisk">*</span>
      </label>

      <select
        value={jobCode}
        onChange={(e) => setJobCode(e.target.value)}
        className="speech-input"
        required
      >

        <option value="">
          Select Job Code
        </option>

        <option value="SE001">
          SE001 - Software Engineer 1
        </option>

        <option value="SE002">
          SE002 - Software Engineer 2
        </option>

        <option value="SE003">
          SE003 - Software Engineer 3
        </option>

        

      </select>

      {errors.jobCode && (
        <span className="field-error">
          {errors.jobCode}
        </span>
      )}

    </div>

  </div>
</FormSection>

        {/* ── Resume Upload ─────────────────────────────────── */}
        <FormSection title="Resume" subtitle="Upload your resume">
          <ResumeUpload
            value={resumeFile}
            onChange={setResumeFile}
            required
          />
          {errors.resumeFile && <span className="field-error">{errors.resumeFile}</span>}
        </FormSection>

<TextAreaSpeechInput

  label="Tell me about yourself"

  value={aboutYourselfText}

  onChange={setAboutYourselfText}

  onAudioCapture={setAboutYourselfAudio}

  required

  rows={6}

  question="
Tell me about yourself.
Please speak for about two minutes.
Explain your background,
skills,
projects,
and career goals.
"

  voiceOnly={true}

  hideVoice={false}
/>

        {/* ── Technical Details ─────────────────────────────── */}
        <FormSection title="Technical Details" subtitle="Technology expertise">
          <div className="form-grid form-grid-1">
            <TextAreaSpeechInput
              label="Explain about the technology you are most comfortable with"
              value={comfortableTechText}
              onChange={setComfortableTechText}
              onAudioCapture={setComfortableTechAudio}
              placeholder="Describe your technical expertise and favourite technologies..."
              required
              maxLength={1000}
              rows={5}
              question="Explain the technology you are most comfortable with. If you are from a non-computer science background, you can talk about any technology you prefer."
              hideVoice={true}
            />
            {errors.comfortableTechText && <span className="field-error">{errors.comfortableTechText}</span>}
          </div>
        </FormSection>

        {/* ── Global error list ─────────────────────────────── */}
        {Object.keys(errors).length > 0 && (
          <div className="form-errors">
            <h3>Please fix the following errors:</h3>
            <ul>
              {Object.entries(errors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Submit button ─────────────────────────────────── */}
       <div className="form-actions">

  {/* LEFT SIDE - SUBMIT */}
  <button
    type="submit"
    className={`btn-submit ${submitted ? 'success' : ''}`}
    disabled={submitting || submitted}
  >
    {submitting
      ? '⏳ Submitting…'
      : submitted
      ? '✓ Submitted!'
      : 'Submit Application'}
  </button>

  {/* RIGHT SIDE - LOGOUT */}
  <button
    type="button"
    className="btn-logout"
   onClick={() => {
  logout()
  window.location.href = '/home'
}}
  >
    Logout
  </button>

</div>
      </form>

      {/* ── Toast notification ───────────────────────────────── */}
      {toastMessage && (
        <div className={`toast ${toastType}`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default ApplicationForm;
