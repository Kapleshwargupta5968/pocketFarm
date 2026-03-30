const FormWrapper = ({title, children, onSubmit}) => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form action="" className="card w-96" onSubmit={onSubmit}>
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            {children}
        </form>
      </div>
    </>
  )
};

export default FormWrapper
