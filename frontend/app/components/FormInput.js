export default function FormInput({ label, type = "text", name, value, onChange, required = false, options = [], disabled = false }) {
  if (type === "select") {
    return (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select {label}</option>
          {options.map((option, index) => {
            const optionValue = option.value || option;
            const optionLabel = option.label || option;
            return (
              <option key={index} value={typeof optionValue === 'string' ? optionValue.trim() : optionValue}>
                {typeof optionLabel === 'string' ? optionLabel.trim() : optionLabel}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  if (type === "textarea") {
    return (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          rows="4"
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
