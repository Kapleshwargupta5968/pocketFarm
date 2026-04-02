const Input = ({
    label,
    type="text",
    placeholder,
    register,
    name,
    rules,
    error,
    autoComplete
}) => {
  return (
    <>
      <div className="mb-3">
        {label && <label className="block mb-1.5 text-sm font-semibold text-slate-700">{label}</label>}
        <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...register(name, rules)}
        className="input-field"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>
    </>
  )
}

export default Input
