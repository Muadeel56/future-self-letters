import { useEffect, useRef } from 'react'

function ConfirmationDialog({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false
}) {
  const dialogRef = useRef(null)
  const confirmButtonRef = useRef(null)
  const previousActiveElement = useRef(null)

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen) return

    // Store the previously focused element
    previousActiveElement.current = document.activeElement

    // Focus the confirm button when dialog opens
    if (confirmButtonRef.current) {
      confirmButtonRef.current.focus()
    }

    // Handle Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onCancel()
      }
    }

    // Handle Enter key on dialog (confirm action)
    const handleEnter = (e) => {
      if (e.key === 'Enter' && !isLoading && e.target === confirmButtonRef.current) {
        onConfirm()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleEnter)

    // Focus trap: prevent focus from leaving the dialog
    const handleTab = (e) => {
      if (!dialogRef.current) return

      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTab)

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleEnter)
      document.removeEventListener('keydown', handleTab)

      // Restore focus to previous element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen, onCancel, onConfirm, isLoading])

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onCancel()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
    >
      <div
        ref={dialogRef}
        className="bg-slate-800 rounded-xl p-6 max-w-md w-full border border-white/10 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h3 id="dialog-title" className="text-xl font-bold text-white mb-4">
          {title}
        </h3>

        {/* Message */}
        <p id="dialog-message" className="text-purple-200 mb-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-white/5 border border-white/20 text-white rounded-lg hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationDialog

