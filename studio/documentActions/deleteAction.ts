import {TrashIcon} from '@sanity/icons'
import {DocumentActionDescription, DocumentActionProps} from 'sanity'

export function DeleteAction(props: DocumentActionProps): DocumentActionDescription {
  const {id, type, onComplete} = props

  return {
    label: 'Slett',
    icon: TrashIcon,
    tone: 'critical',
    onHandle: () => {
      const confirmed = window.confirm(
        `Er du sikker på at du vil slette "${props.draft?.title || props.published?.title || 'dette dokumentet'}"?`
      )
      
      if (confirmed) {
        // Delete the document
        props.onDelete()
        onComplete()
      }
    },
  }
}

// Quick delete action without confirmation for fast cleanup
export function QuickDeleteAction(props: DocumentActionProps): DocumentActionDescription {
  const {onComplete} = props

  return {
    label: 'Slett raskt',
    icon: TrashIcon,
    tone: 'critical',
    shortcut: ['Ctrl', 'Alt', 'Delete'],
    onHandle: () => {
      props.onDelete()
      onComplete()
    },
  }
}