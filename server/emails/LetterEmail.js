import React from 'react'
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from '@react-email/components'

export default function LetterEmail({ userName, letterTitle, letterContent, createdAt, deliveryDate }) {
  return React.createElement(Html, null,
    React.createElement(Head),
    React.createElement(Body, { style: main },
      React.createElement(Container, { style: container },
        React.createElement(Heading, { style: heading },
          '💌 You have a letter from your past self!'
        ),
        React.createElement(Text, { style: paragraph },
          `Hello ${userName || 'there'},`
        ),
        React.createElement(Text, { style: paragraph },
          `You wrote this letter to yourself on ${new Date(createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}.`
        ),
        React.createElement(Text, { style: paragraph },
          `It was scheduled for delivery on ${new Date(deliveryDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}.`
        ),
        React.createElement(Hr, { style: hr }),
        React.createElement(Section, { style: letterSection },
          letterTitle && React.createElement(Heading, { style: letterTitleStyle }, letterTitle),
          React.createElement(Text, { style: letterContentStyle }, letterContent)
        ),
        React.createElement(Hr, { style: hr }),
        React.createElement(Text, { style: footer },
          'Thank you for using Future Self Letters!'
        )
      )
    )
  )
}

const main = {
  backgroundColor: '#f3f4f6',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '20px',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
}

const heading = {
  color: '#7c3aed',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center',
  margin: '0 0 20px',
  padding: '0',
}

const paragraph = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
  padding: '0',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
  borderWidth: '1px',
  borderStyle: 'solid',
}

const letterSection = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  margin: '20px 0',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
}

const letterTitleStyle = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px',
  padding: '0',
}

const letterContentStyle = {
  color: '#4b5563',
  fontSize: '16px',
  lineHeight: '24px',
  whiteSpace: 'pre-wrap',
  padding: '0',
  margin: '0',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  textAlign: 'center',
  margin: '32px 0 0',
  padding: '0',
}

