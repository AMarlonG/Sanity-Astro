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
