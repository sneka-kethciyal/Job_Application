function FormSection({ title, children, subtitle = null }) {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <h2 className="form-section-title">{title}</h2>
        {subtitle && <p className="form-section-subtitle">{subtitle}</p>}
      </div>
      <div className="form-section-content">
        {children}
      </div>
    </div>
  );
}

export default FormSection;