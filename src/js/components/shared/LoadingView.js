import React from 'react'
import LoadIndicator from './LoadiIndicator'

export default function LoadingView({message = 'One moment please...'}) {
  return (
    <div className="loading-screen">
      <div className="loading-view">
        <div className="loading-view-container">
          <div className="mb-3">{message}</div>
          <LoadIndicator/>
        </div>
      </div>
    </div>
  )
}