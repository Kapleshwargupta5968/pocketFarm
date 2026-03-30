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
        {label && <label className="block mb-1 font-medium">{label}</label>}
        <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...register(name, rules)}
        className="border p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus-ring-green-500"
        />
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>
    </>
  )
}

export default Input
