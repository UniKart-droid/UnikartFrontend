import React from 'react'
import { motion } from 'framer-motion' 
import TeacherViewNotes from './TeacherViewNotice'

const TeacherTab = () => {
  return (
    
    <motion.div
      initial={{ opacity: 0, x: -10 }} 
      animate={{ opacity: 1, x: 0 }}    
      exit={{ opacity: 0, x: 10 }}      
      transition={{ duration: 0.4, ease: "easeInOut" }} 
    >
      <TeacherViewNotes/>
    </motion.div>
  )
}

export default TeacherTab