import React from 'react'

const FormGroup = ({label,placeholder}) => {
  return (
     <div className="form-group">
            <label htmlFor={label}>{label}</label>
            <input type="text" name={label} id={label} placeholder={placeholder} />
          </div>
  )
}

export default FormGroup
