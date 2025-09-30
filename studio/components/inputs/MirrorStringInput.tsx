import React, { useCallback } from 'react'
import { StringInputProps, useFormValue } from 'sanity'
import { TextInput, Stack, Text } from '@sanity/ui'

export function createMirrorStringInput(sourceField: string) {
  return function MirrorStringInput(props: StringInputProps) {
    const { onChange, value } = props
    const sourceValue = useFormValue([sourceField]) as string

    // If field is empty and we have a source value, mirror it
    const displayValue = value !== undefined ? value : (sourceValue || '')
    const isUsingMirror = value === undefined && sourceValue

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value
      onChange(newValue)
    }, [onChange])

    return (
      <Stack space={2}>
        <TextInput
          {...props}
          value={displayValue}
          onChange={handleChange}
          placeholder={sourceValue ? `Følger norsk: "${sourceValue}"` : props.placeholder}
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