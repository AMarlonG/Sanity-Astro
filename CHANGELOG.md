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
