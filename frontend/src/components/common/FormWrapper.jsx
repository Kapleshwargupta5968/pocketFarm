import { motion } from 'framer-motion';

const FormWrapper = ({title, children, onSubmit}) => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-hidden">
        <motion.div
           initial={{ opacity: 0, y: 40, x: 0 }}
           animate={{ opacity: 1, y: 0, x: 0 }}
           transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <form action="" className="card w-96" onSubmit={onSubmit}>
              <h2 className="text-xl font-bold mb-4">{title}</h2>
              {children}
          </form>
        </motion.div>
      </div>
    </>
  )
};

export default FormWrapper
