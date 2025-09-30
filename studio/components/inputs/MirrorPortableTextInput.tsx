import React, { useCallback, useMemo } from 'react'
import { ArrayInputProps, useFormValue } from 'sanity'
import { Stack, Text, Button } from '@sanity/ui'

export function createMirrorPortableTextInput(sourceField: string) {
  return function MirrorPortableTextInput(props: ArrayInputProps) {
    const { onChange, value, renderDefault } = props
    const sourceValue = useFormValue([sourceField]) as any[]

    const isEmpty = !value || value.length === 0
    const hasSource = sourceValue && sourceValue.length > 0
    const isUsingMirror = isEmpty && hasSource

    const handleCopyFromSource = useCallback(() => {
      if (hasSource) {
        // Deep clone the source content to avoid reference issues
        const clonedContent = JSON.parse(JSON.stringify(sourceValue))
        // Pass the cloned array directly - no set() wrapper needed
        onChange(clonedContent)
      }
    }, [sourceValue, onChange, hasSource])

    // Show hint if field is empty but source has content
    const hintContent = useMemo(() => {
      if (!isUsingMirror) return null

      const previewText = sourceValue
        ?.map(block => {
          if (block._type === 'block' && block.children) {
            return block.children.map(child => child.text).join('')
          }
          return `[${block._type || 'komponent'}]`
        })
        .join(' ')
        .substring(0, 100)

      return (
        <Stack space={3} padding={3} style={{ border: '1px dashed #e5e7eb', borderRadius: '4px', backgroundColor: '#f9fafb' }}>
          <Text size={1} muted>
            💡 <strong>Norsk innhold tilgjengelig:</strong> "{previewText}..."
          </Text>
          <Button
            mode="ghost"
            tone="primary"
            fontSize={1}
            padding={2}
            onClick={handleCopyFromSource}
            text="📋 Kopier fra norsk"
          />
        </Stack>
      )
    }, [isUsingMirror, sourceValue, handleCopyFromSource])

    return (
      <Stack space={3}>
        {hintContent}
        {renderDefault(props)}
      </Stack>
    )
  }
}