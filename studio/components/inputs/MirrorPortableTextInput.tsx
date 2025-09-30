import React, { useCallback, useMemo } from 'react'
import { ArrayInputProps, useFormValue, PatchEvent, set } from 'sanity'
import { Stack, Text, Button } from '@sanity/ui'

export function createMirrorPortableTextInput(sourceField: string) {
  return function MirrorPortableTextInput(props: ArrayInputProps) {
    const { onChange, value, renderDefault } = props
    const sourceValue = useFormValue([sourceField]) as any[]

    const isEmpty = !value || value.length === 0
    const hasSource = sourceValue && sourceValue.length > 0
    const isUsingMirror = isEmpty && hasSource
    const canCopy = hasSource // Always show copy button if source has content

    const handleCopyFromSource = useCallback(() => {
      if (hasSource) {
        // Deep clone the source content to avoid reference issues
        const clonedContent = JSON.parse(JSON.stringify(sourceValue))
        // Use PatchEvent with proper set operation
        onChange(
          PatchEvent.from([
            set(clonedContent)
          ])
        )
      }
    }, [sourceValue, onChange, hasSource])

    // Show copy button if source has content
    const copyButton = useMemo(() => {
      if (!canCopy) return null

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
        <Stack space={2} padding={2} style={{ border: '1px solid #e5e7eb', borderRadius: '4px', backgroundColor: isEmpty ? '#f9fafb' : '#fff' }}>
          <Text size={1} muted>
            {isEmpty ? (
              <>💡 <strong>Norsk innhold tilgjengelig:</strong> "{previewText}..."</>
            ) : (
              <>🔄 <strong>Oppdater fra norsk:</strong> "{previewText}..."</>
            )}
          </Text>
          <Button
            mode="ghost"
            tone="primary"
            fontSize={1}
            padding={2}
            onClick={handleCopyFromSource}
            text={isEmpty ? "📋 Kopier fra norsk" : "🔄 Oppdater fra norsk"}
          />
        </Stack>
      )
    }, [canCopy, isEmpty, sourceValue, handleCopyFromSource])

    return (
      <Stack space={3}>
        {copyButton}
        {renderDefault(props)}
      </Stack>
    )
  }
}