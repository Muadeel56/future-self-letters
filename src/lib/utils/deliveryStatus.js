/**
 * Get delivery status text and color
 */
export function getDeliveryStatus(letter) {
  if (letter.isDelivered && letter.emailStatus === 'sent') {
    return {
      text: 'Delivered',
      color: 'green',
      icon: '✓'
    }
  }
  
  if (letter.emailStatus === 'failed') {
    return {
      text: 'Delivery Failed',
      color: 'red',
      icon: '✗'
    }
  }
  
  if (letter.emailStatus === 'pending' || !letter.emailStatus) {
    const deliveryDate = new Date(letter.deliveryDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (deliveryDate < today) {
      return {
        text: 'Pending Delivery',
        color: 'yellow',
        icon: '⏳'
      }
    }
    
    return {
      text: 'Scheduled',
      color: 'blue',
      icon: '📅'
    }
  }
  
  return {
    text: 'Unknown',
    color: 'gray',
    icon: '?'
  }
}

/**
 * Calculate days until delivery
 */
export function getDaysUntilDelivery(deliveryDate) {
  const delivery = new Date(deliveryDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  delivery.setHours(0, 0, 0, 0)
  
  const diffTime = delivery - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays
}

/**
 * Format delivery date
 */
export function formatDeliveryDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

