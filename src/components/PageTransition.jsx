import { motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, backgroundColor: '#000' },
  animate: { opacity: 1, backgroundColor: '#0d0a05', transition: { duration: 0.6, ease: 'easeOut' } },
  exit:    { opacity: 0, backgroundColor: '#000', transition: { duration: 0.4, ease: 'easeIn' } }
}

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  )
}
