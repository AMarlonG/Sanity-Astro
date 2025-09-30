import React, { useCallback } from 'react'
import { TextInputProps, useFormValue } from 'sanity'
import { TextArea, Stack, Text } from '@sanity/ui'

export function createMirrorTextInput(sourceField: string) {
  return function MirrorTextInput(props: TextInputProps) {
    const { onChange, value } = props
    const sourceValue = useFormValue([sourceField]) as string

    // If field is empty and we have a source value, mirror it
    const displayValue = value || sourceValue || ''
    const isUsingMirror = !value && sourceValue

    const handleChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = event.target.value
      onChange(newValue || undefined)
    }, [onChange])

    return (
      <Stack space={2}>
        <TextArea
          {...props}
          value={displayValue}
          onChange={handleChange}
          placeholder={sourceValue ? `Følger norsk: "${sourceValue.substring(0, 50)}${sourceValue.length > 50 ? '...' : ''}"` : props.placeholder}
          style={{
            fontStyle: isUsingMirror ? 'italic' : 'normal',
            color: isUsingMirror ? '#6b7280' : 'inherit'
          }}
        />
        {isUsingMirror && (
          <Text size={1} muted>
            💡 Følger norsk innhold - begynn å skrive for å overstyre
          </Text>
        )}
      </Stack>
    )
  }
}