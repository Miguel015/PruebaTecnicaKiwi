import React from 'react'

export default function BackButton({ onClick }){
  return (
    <button type="button" className="back-btn" onClick={onClick} aria-label="volver">
      <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M0.29289 7.36396C-0.09763 6.97346 -0.09763 6.34026 0.29289 5.94976L5.94977 0.292897C6.34027 -0.0976325 6.97347 -0.0976325 7.36397 0.292897C7.75447 0.683417 7.75447 1.31659 7.36397 1.70711L2.41417 6.65686L7.36397 11.6066C7.75447 11.9972 7.75447 12.6303 7.36397 13.0209C6.97347 13.4114 6.34027 13.4114 5.94977 13.0209L0.29289 7.36396Z" fill="currentColor" />
      </svg>
    </button>
  )
}
