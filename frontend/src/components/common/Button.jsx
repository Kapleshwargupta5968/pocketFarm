const Button = ({ children, loading, fullWidth, type="submit" }) => {
  return (
    <>
      <button
        type={type}
        disabled={loading}
        className={`btn-primary ${fullWidth ? "w-full" : ""}`}
      >
        {loading ? "loadng..." : children}
      </button>
    </>
  );
};

export default Button;
