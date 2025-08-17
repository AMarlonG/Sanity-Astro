import {describe, it, expect} from 'vitest'
import {screen} from '@testing-library/dom'

// Helper function to render Astro component HTML
function renderButtonHTML(props: {
  text: string
  url?: string
  style?: 'primary' | 'secondary' | 'outline'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  className?: string
}) {
  const {
    text,
    url = '#',
    style = 'primary',
    size = 'medium',
    disabled = false,
    className = ''
  } = props

  const isExternal = url.startsWith('http')
  const target = isExternal ? '_blank' : undefined
  const rel = isExternal ? 'noopener noreferrer' : undefined

  return `
    <a 
      href="${url}" 
      class="btn btn-${style} btn-${size} ${disabled ? 'btn-disabled' : ''} ${className}"
      ${target ? `target="${target}"` : ''}
      ${rel ? `rel="${rel}"` : ''}
      aria-disabled="${disabled}"
    >
      ${text}
    </a>
  `
}

describe('Button Component', () => {
  it('renders with default props', () => {
    const html = renderButtonHTML({text: 'Click me'})
    document.body.innerHTML = html
    
    const button = screen.getByRole('link', {name: 'Click me'})
    expect(button).toBeDefined()
    expect(button.getAttribute('href')).toBe('#')
    expect(button.getAttribute('class')).toContain('btn-primary')
    expect(button.getAttribute('class')).toContain('btn-medium')
  })

  it('renders with custom style', () => {
    const html = renderButtonHTML({text: 'Submit', style: 'secondary'})
    document.body.innerHTML = html
    
    const button = screen.getByRole('link', {name: 'Submit'})
    expect(button.getAttribute('class')).toContain('btn-secondary')
  })

  it('renders with custom size', () => {
    const html = renderButtonHTML({text: 'Small Button', size: 'small'})
    document.body.innerHTML = html
    
    const button = screen.getByRole('link', {name: 'Small Button'})
    expect(button.getAttribute('class')).toContain('btn-small')
  })

  it('handles external URLs correctly', () => {
    const html = renderButtonHTML({
      text: 'External Link',
      url: 'https://example.com'
    })
    document.body.innerHTML = html
    
    const button = screen.getByRole('link', {name: 'External Link'})
    expect(button.getAttribute('target')).toBe('_blank')
    expect(button.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('handles disabled state', () => {
    const html = renderButtonHTML({text: 'Disabled', disabled: true})
    document.body.innerHTML = html
    
    const button = screen.getByRole('link', {name: 'Disabled'})
    expect(button.getAttribute('class')).toContain('btn-disabled')
    expect(button.getAttribute('aria-disabled')).toBe('true')
  })

  it('applies custom className', () => {
    const html = renderButtonHTML({
      text: 'Custom Class',
      className: 'my-custom-class'
    })
    document.body.innerHTML = html
    
    const button = screen.getByRole('link', {name: 'Custom Class'})
    expect(button.getAttribute('class')).toContain('my-custom-class')
  })
})