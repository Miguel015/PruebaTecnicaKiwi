import React from 'react'

export default function ArrowIcon({ size = 14, className = '', color = 'currentColor' }){
  // vector.svg path converted to an inline component
  return (
    <svg width={size} height={(size * 8) / 11} viewBox="0 0 11 8" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
      <path d="M6.82914 0.170857L10.1289 3.47068C10.3568 3.69847 10.3568 4.06784 10.1289 4.29563L6.82914 7.59549C6.60135 7.82328 6.23198 7.82328 6.00419 7.59549C5.77634 7.3677 5.77634 6.99833 6.00419 6.77054L8.30818 4.46649H0.583333C0.26117 4.46649 0 4.20533 0 3.88316C0 3.56098 0.26117 3.29982 0.583333 3.29982H8.30818L6.00419 0.995813C5.77634 0.768004 5.77634 0.39866 6.00419 0.170857C6.23198 -0.0569523 6.60135 -0.0569523 6.82914 0.170857Z" fill={color} />
    </svg>
  )
}
