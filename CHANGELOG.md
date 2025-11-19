# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Sanity TypeGen workflow for automatic TypeScript type generation from schemas
- Shared schema utilities: `previewHelpers.ts` and `publishingFields.ts` for DRY code
- Comprehensive PROJECT_GUIDE.md covering philosophy, architecture, and workflows
- Detailed project structure documentation in README

### Changed
- **Studio Schema Refactoring**: Consolidated 310+ lines of duplicate code across document schemas
  - Standardized all schemas to use consistent 'publishing' group naming
  - Created shared `getPublishingStatusText()` and `getLanguageStatus()` helper functions
  - Unified publishing field definitions across all document types (artist, article, page, event, homepage)
  - Improved maintainability with single source of truth for preview and publishing logic
- **Git tracking cleanup**: Stopped tracking generated Sanity types (extract.json, sanity.types.ts)
  - Follows industry best practice of not tracking generated files
  - Reduces repo size by 220KB, prevents merge conflicts
  - Run `npm run typegen` after pulling schema changes or cloning
  - Added .editorconfig for cross-editor formatting standards (2-space indent, LF line endings, UTF-8)
  - Cleaned up .gitignore: removed unused patterns (Turbo, Next.js), added TypeScript build info
  - Documented git tracking best practices in PROJECT_GUIDE.md (what/why we track files)
  - Updated README with first-time setup instructions for regenerating types
- **Documentation philosophy overhaul**: Rewrote project philosophy to prioritize professionalism
  - Lead with "Production-Ready & Simple" instead of just "Keep It Simple"
  - Established security, quality, and testing as non-negotiable standards
  - Clarified that "simple" means focused/maintainable, NOT amateur/shortcuts
  - Updated TypeScript philosophy to require fixing type errors properly
- Optimized HTMX setup and cleaned up redundant frontend files
- Moved shared date utility into frontend workspace
- Updated favicon to match menu colors
- Refined menu dropdown styling for visual consistency

### Removed
- Unused shared workspace (consolidated into frontend)
- Unused test-setup.ts files
- Redundant code in schema preview functions

### Fixed
- **Video component complete fix** (YouTube, Vimeo, and external video embeds now work)
  - **GROQ query**: Completed VIDEO_COMPONENT projection in `queryBuilder.ts` (lines 52-74)
    - Was incomplete (only `...` placeholder) preventing all video data from being fetched
    - Now fetches all 12 required fields: videoType, video asset, YouTube/Vimeo/external URLs, aspectRatio, title, description, and playback settings
    - Enables videos to work across all content areas (pages, events, articles, accordions, layouts)
    - Matches pattern used by working IMAGE_COMPONENT query
  - **CSP blocking**: Fixed middleware.ts frame-src directive blocking YouTube and Vimeo embeds
    - Development CSP (line 23): Added `https://www.youtube.com`, `https://www.youtube-nocookie.com`, and `https://player.vimeo.com` to frame-src
    - Production CSP (line 37): Changed from `frame-src 'none'` to allow same video platforms
    - Root cause: Middleware runs after Vite config and overwrites CSP headers with `.set()`
    - Symptom was "Dette innholdet er blokkert" (This content is blocked) error in iframes
  - **Layout overflow**: Fixed Video.astro margin causing figure tags to overflow scroll containers
    - Added `:global(.scroll-item) .video-component { margin: 0; }` to reset margin in scroll contexts
    - Regular pages keep `margin: 2rem 0` for proper spacing
  - **Configuration cleanup**: Removed redundant CSP from astro.config.mjs vite.server (lines 62-66)
    - Middleware CSP takes precedence, so Vite config CSP was being ignored
- GROQ slug matching syntax to resolve 404 errors
- Publishing status field validation (changed from `componentValidation.title` to `Rule.required()`)

---

## Version History Guidelines

When creating releases:
- Use semantic versioning (MAJOR.MINOR.PATCH)
- Move items from [Unreleased] to a new version section
- Add release date in YYYY-MM-DD format
- Link version numbers to GitHub release pages or tags

Example:
```markdown
## [1.0.0] - 2024-01-15
### Added
- Initial release with bilingual festival website
```
