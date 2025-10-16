import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

// Import all components that can be used in content blocks
import Title from '../components/Title.astro';
import PortableText from '../components/PortableText.astro';
import Heading from '../components/Heading.astro';
import Image from '../components/Image.astro';
import Video from '../components/Video.astro';
import Button from '../components/Button.astro';
import Link from '../components/Link.astro';
import Quote from '../components/Quote.astro';
import Accordion from '../components/Accordion.astro';
import ContentScrollContainer from '../components/ContentScrollContainer.astro';
import ArtistScrollContainer from '../components/ArtistScrollContainer.astro';
import EventScrollContainer from '../components/EventScrollContainer.astro';
import Countdown from '../components/Countdown.astro';
import ColumnLayout from '../components/ColumnLayout.astro';
import Spacer from '../components/Spacer.astro';

// Component registry mapping Sanity block types to Astro components
export const componentRegistry: Record<string, AstroComponentFactory> = {
  title: Title,
  portableTextBlock: PortableText,
  headingComponent: Heading,
  imageComponent: Image,
  videoComponent: Video,
  buttonComponent: Button,
  linkComponent: Link,
  quoteComponent: Quote,
  accordionComponent: Accordion,
  contentScrollContainer: ContentScrollContainer,
  artistScrollContainer: ArtistScrollContainer,
  eventScrollContainer: EventScrollContainer,
  countdownComponent: Countdown,
  columnLayout: ColumnLayout,
  spacer: Spacer,
} as const;

// Get all registered component types
export const registeredTypes = Object.keys(componentRegistry);

// Check if a component type is registered
export function isRegisteredComponent(type: string): type is keyof typeof componentRegistry {
  return type in componentRegistry;
}

// Get component by type with fallback
export function getComponent(type: string): AstroComponentFactory | null {
  return componentRegistry[type] || null;
}

// Type for content blocks
export interface ContentBlock {
  _type: string;
  _key?: string;
  _id?: string;
  [key: string]: any;
}