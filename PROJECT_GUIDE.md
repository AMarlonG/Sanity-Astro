# Project Guide: Keep It Simple

This is a small festival website with bilingual support (Norwegian/English). These guidelines prevent over-engineering.

## 1. Philosophy & Identity

### What This Project IS
- Simple Astro frontend displaying events, artists, venues
- Sanity CMS for content management
- Basic event filtering with HTMX
- Visual Editing for content preview
- Bilingual support (Norwegian/English)

### What This Project IS NOT
- An enterprise application
- A high-traffic platform
- A complex system requiring extensive tooling

### Rules for Changes

#### ✅ DO
- Fix actual bugs that affect users
- Add features specifically requested for this use case
- Keep dependencies stable and compatible
- Maintain simplicity

#### ❌ DON'T
- Add "best practices" from enterprise projects
- Upgrade to major new versions without clear benefit or security need
- Add testing infrastructure unless genuinely needed
- Add monitoring/analytics unless specifically required
- Apply TypeScript strict settings that break existing code
- Change Node.js versions if current one works
- Use emojis in code, UI, or content (only use when explicitly requested by user)

### Decision Framework

Before making ANY change, ask:
1. **Is this solving an actual problem users are experiencing?**
2. **Is this specifically needed for this festival website?**
3. **Will this add unnecessary complexity?**
4. **Is the current solution already working fine?**

If the answer to #4 is "yes", then probably don't change it.

### Remember
- Working code > "better" code
- Simple solutions > complex solutions
- Stability > theoretical improvements
- User needs > developer preferences

### Common Pitfalls to Avoid

1. **Changing working Node.js versions** → Use 20.19.0
2. **Removing Norwegian locale** without replacement → Keep `nbNOLocale()`
3. **Breaking Visual Editing** by changing stega config → Test preview after changes
4. **Over-optimizing dependencies** → Keep what works
5. **Adding enterprise tooling** → This is a small festival website

---

## 2. Core Technologies

### 2.1 Sanity CMS

#### Schema Design

**Basic Conventions:**
- ALWAYS use `defineType`, `defineField`, and `defineArrayMember` helper functions
- ALWAYS write schema types to their own files and export a named `const` that matches the filename
- ONLY use a `name` attribute in fields unless the `title` needs to be something other than a title-case version of the `name`
- INCLUDE brief, useful `description` values if the intention of a field is not obvious
- INCLUDE `rule.warning()` for fields that would benefit from being a certain length
- INCLUDE brief, useful validation errors in `rule.required().error('<Message>')`

**Field Type Guidelines:**
- ANY `string` field type with an `options.list` array with fewer than 5 options must use `options.layout: "radio"`
- ANY `image` field must include `options.hotspot: true`
- AVOID `boolean` fields, write a `string` field with an `options.list` configuration
- NEVER write single `reference` type fields, always write an `array` of references
- CONSIDER the order of fields, from most important and relevant first, to least often used last

**Decorating Schema Types:**

Every `document` and `object` schema type should:
- Have an `icon` property from `@sanity/icons`
- Have a customized `preview` property that shows rich contextual details about the document
- Use `groups` when the schema type has more than a few fields to collate related fields
- Use `fieldsets` with `options: {columns: 2}` if related fields could be grouped visually together

**Example:**
```ts
// ./studio/schemaTypes/lessonType.ts
import {defineField, defineType} from 'sanity'

export const lessonType = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [{type: 'reference', to: {type: 'category'}}],
    }),
  ],
})
```

#### Content Modeling

- Unless explicitly modeling web pages or app views, create content models for what things are, not what they look like in a front-end
- For example, consider the `status` of an element instead of its `color`
- Any schema type that benefits from being reused should be registered as its own custom schema type (no anonymous reusable types)

#### GROQ Queries

**Conventions:**
- ALWAYS use SCREAMING_SNAKE_CASE for variable names (e.g., `POSTS_QUERY`)
- ALWAYS write queries to their own variables, never as a parameter in a function
- ALWAYS import the `defineQuery` function to wrap query strings from the `groq` or `next-sanity` package
- ALWAYS write every required attribute in a projection when writing a query
- ALWAYS put each segment of a filter, and each attribute on its own line
- ALWAYS use parameters for variables in a query
- NEVER insert dynamic values using string interpolation

**Example:**
```ts
import {defineQuery} from 'groq'

export const POST_QUERY = defineQuery(`*[
  _type == "post"
  && slug.current == $slug
][0]{
  _id,
  title,
  image,
  author->{
    _id,
    name
  }
}`)
```

#### TypeScript Generation

**For the Studio:**
- ALWAYS re-run schema extraction after making schema file changes: `npx sanity@latest schema extract`

**For Monorepos (studio + frontend):**
- ALWAYS extract the schema to the frontend folder: `npx sanity@latest schema extract --path=../frontend/sanity/extract.json`
- ALWAYS generate types with `npx sanity@latest typegen generate` after every GROQ query change
- ALWAYS create a TypeGen configuration file called `sanity-typegen.json` at the root of the frontend codebase

#### Visual Editing

**Requirements:**
- Requires both servers running: Studio (port 3333) + Frontend (port 4321)
- Requires preview mode cookie to be set: `sanity-preview-mode=true`
- Environment variables must be set: `SANITY_API_READ_TOKEN` and `PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true`

**API Configuration:**
- Use `apiVersion: "2025-01-01"` in Sanity configuration for latest features
- Set `useCdn: false` in development for real-time content updates
- Keep `studioUrl: 'http://localhost:3333'` for Visual Editing

**Content Structure:**
- Support bilingual content with Norwegian as default and English as optional
- Use proper date formatting for both languages in displays
- Keep content schemas simple - avoid complex relationships unless needed

### 2.2 Astro Framework

#### Architecture
- Use SSG (Static Site Generation) for content pages
- Use SSR (Server-Side Rendering) for dynamic features requiring real-time data
- Components use TypeScript in `<script>` sections
- API routes written in TypeScript (`/pages/api/*.ts`)
- Client-side scripts written in vanilla JavaScript (`/scripts/*.js`)

#### Component Patterns
- Keep components simple and focused on single responsibilities
- Use Astro components for static/server-rendered content
- Use React only when truly needed for complex client-side interactivity
- Prefer HTMX over React for most interactivity needs

#### Routing
- Use `[slug].astro` for dynamic routes
- Keep route structure flat - avoid deep nesting
- Bilingual routes: `/program` (Norwegian), `/en/program` (English)
- Use `trailingSlash: 'never'` for clean URLs

#### Performance
- Enable prefetch for key navigation paths
- Keep client JavaScript minimal
- Leverage Astro's built-in optimizations (automatic image optimization, etc.)
- Use `prefetch: { prefetchAll: false, defaultStrategy: 'viewport' }`

#### Integration
- Sanity content fetched via `createDataService()` utility
- HTMX integration via `astro-htmx` package
- React integration available but use sparingly

### 2.3 HTMX for Interactivity

#### When to Use HTMX
- Event filtering with server-rendered results
- Form submissions with validation feedback
- Partial page updates without full page reload
- Progressive enhancement over static HTML
- Simple CRUD operations

#### When NOT to Use HTMX
- Complex client-side state management
- Real-time features requiring WebSockets
- Heavy data manipulation that should happen in the browser
- Features requiring instant feedback without network latency

#### Patterns

**Basic HTMX Attributes:**
- `hx-get="/api/endpoint"` - Fetch content via GET request
- `hx-vals='{"key": "value"}'` - Pass parameters to the request
- `hx-target="#element-id"` - Specify where content should load
- `hx-push-url="true"` - Update browser URL when content loads
- `hx-swap="innerHTML"` - Control how content is swapped in

**Event Filtering Example:**
```html
<a href="/program?date=2024-01-01"
   hx-get="/api/filter-program"
   hx-vals='{"date": "2024-01-01", "venue": ""}'
   hx-target="#program-list"
   hx-push-url="true"
   data-filter-type="date"
   data-filter-value="2024-01-01">
  Filter by Date
</a>
```

#### Integration with JavaScript

- Use vanilla JavaScript to handle HTMX events for coordination
- Listen to `htmx:afterSettle` for post-swap actions
- Listen to `htmx:historyRestore` for browser back/forward handling
- Keep HTMX attributes in HTML, logic in separate `.js` files
- Example: Filter button state synchronization via event listeners

### 2.4 JavaScript (Client-Side)

#### Purpose
- DOM manipulation and event handling
- HTMX event listeners and state coordination
- Progressive enhancement features
- Browser-side state synchronization with URL parameters

#### Best Practices
- Keep scripts small and focused (single responsibility principle)
- Use ES6 modules with named exports
- Document public functions with JSDoc comments
- Store client scripts in `/src/scripts/` directory
- Scripts are NOT type-checked (`"checkJs": false`) - keep logic simple and testable
- Use event delegation for dynamic content added by HTMX

#### Code Structure
```javascript
/**
 * Brief description of what this module does
 */

/**
 * Public function with JSDoc
 * @param {string} param - Description
 * @returns {void}
 */
export function initializeSomeFeature(param) {
  // Implementation
}
```

#### Patterns
- Export initialization functions that set up event listeners
- Avoid global variables - use module scope
- Keep compatible with modern browsers (no transpilation needed)
- Example: `syncFilterButtonStatesWithUrl.js` for filter state management

### 2.5 TypeScript

#### Where Used
- Sanity Studio (schemas, configuration, plugins)
- Astro component `<script>` sections
- API routes and endpoints (`/pages/api/*.ts`)
- Utility libraries and data services
- Type definitions (`.d.ts` files)

#### Configuration
- Strict mode enabled (`"strict": true`)
- Allows JavaScript imports (`"allowJs": true`, but `"checkJs": false`)
- Don't apply overly strict settings that break existing code
- Use `extends: "astro/tsconfigs/strict"` for Astro-specific configs

#### Type Patterns
- Prefer `interface` for object shapes
- Use `type` for unions, intersections, and mapped types
- Generate Sanity types automatically rather than writing manually
- Share types between studio and frontend via `../studio/schemaTypes/shared/types.ts`

#### Philosophy
- Type safety WITHOUT over-engineering
- Working code > perfect types
- Add types when they prevent bugs, not just for purity
- If strict typing breaks working code, adjust strictness rather than code

---

## 3. Environment & Setup

### Node.js Version Management
- **Use Node.js v20.19.0** - This is the proven compatible version
- **Never upgrade Node.js** without testing both studio and frontend first
- If Node.js upgrade is necessary, test incrementally (20.x → 21.x → 22.x)

### Dependency Management
- **Use `npm install --legacy-peer-deps`** for dependency conflicts
- **Update for security and stability** - prioritize security patches and minor updates from trusted sources
- **Sanity Studio updates** - keep reasonably current to get security fixes and bug improvements
- **Avoid major version jumps** - update incrementally (4.4 → 4.5 → 4.6, not 4.4 → 5.0)
- **Test after any dependency changes** - both studio and frontend must work

### Server Management
- **Always run both servers**: Studio (3333) + Frontend (4321) for Visual Editing
- **Use `npm run dev`** from root to start both servers simultaneously
- **Check both endpoints** respond before testing Visual Editing

### Environment Variables

**Required for Visual Editing:**
- `SANITY_API_READ_TOKEN` - API token with read permissions
- `PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true` - Enables Visual Editing features

**Sanity Configuration:**
- Project ID: `i952bgb1`
- Dataset: `production`
- Studio URL: `http://localhost:3333`
- Frontend URL: `http://localhost:4321`

---

## 4. Development Workflow

### File Editing Workflow
- **Always read a file before editing it** to understand the current code and how changes will alter it
- **Never attempt to edit based on assumptions** about file content from memory or previous sessions
- **Understand the context** before making changes to ensure proper integration

### Web Research Methodology
- **Always search chronologically starting with the current year first, then work backwards** through previous years (last year, the year before, etc.)
- **Rationale**: Technology evolves rapidly - recent solutions often supersede older approaches with better performance, support, or maintainability
- **Note**: This same methodology is defined in all specialized agent files (`.claude/agents/`)

### Bilingual Content Handling
- **Norwegian as default language** - Primary content in Norwegian
- **English as optional** - English translations optional but encouraged
- **URL structure**: `/path` (Norwegian), `/en/path` (English)
- **Language detection**: Automatically detect from URL path for content queries
- **Date formatting**: Use appropriate locale for each language in displays

---

## 5. Git Workflow

### Branch Strategy: Two-Branch Model

**Permanent Branches:**
- `main` - Production branch (deploys to live URL)
- `staging` - Testing/preview branch (deploys to test URL)

**Temporary Branches (Your Workspace):**
- `feature/*` - New features (e.g., `feature/ticket-sales`)
- `fix/*` - Bug fixes (e.g., `fix/date-formatting`)
- `chore/*` - Maintenance tasks (e.g., `chore/update-deps`)

**⚠️ IMPORTANT: Where You Work**
- ❌ **NEVER work directly in `main`** - Production only, merge via PR
- ❌ **NEVER work directly in `staging`** - Testing only, merge via PR
- ✅ **ALWAYS work in feature branches** - Create from staging, merge back to staging

### Standard Workflow

```bash
# 1. Create feature branch FROM staging
git checkout staging
git pull origin staging
git checkout -b feature/new-feature

# 2. Develop and commit (as many times as needed)
git add .
git commit -m "Add new feature"
# Work more, commit more...

# 3. Push when ready
git push origin feature/new-feature

# 4. Open PR: feature/new-feature → staging
# - Test on staging URL
# - Review changes
# - Merge to staging

# 5. When ready for production
# Open PR: staging → main
# - Final review
# - Merge to main (deploys to production)

# 6. Clean up
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

### Branch Management Rules
- **Always create feature branches from staging** (not from main)
- **Always merge feature branches to staging first** (never directly to main)
- **Delete feature branches immediately after merge** - keep repository clean
- **Keep staging in sync with main** when starting new work
- **Update your feature branch from staging** if it gets behind during development

### How Often to Commit/Push/PR

**Commit (Very Often - Local Only):**
- After completing each small piece of work
- After fixing a bug
- Before trying something risky (easy to undo)
- Frequency: 5-20+ times per day is normal
- Command: `git add . && git commit -m "Description"`

**Push (When Ready for Backup):**
- End of work session (end of day, lunch break)
- When you've hit a milestone
- When you want work backed up to GitHub
- Frequency: 1-3 times per day
- Command: `git push origin feature/branch-name`

**PR + Merge (When Feature Complete):**
- End of day if feature is done
- When ready for staging/production testing
- Frequency: 1-2 times per day, or every few days

### Commit & Push Guidelines (for AI Assistants)
- Suggest pushing changes proactively after completing logical milestones
- Make meaningful commit messages that explain what was accomplished
- Push when it makes sense based on user's workflow

---

## 6. AI Assistant Guidelines

### Post-Context Compression Checklist

**IMPORTANT: After any context compression, automatically review this checklist before continuing work:**

✅ **Project Philosophy**: This is a simple festival website - avoid over-engineering
✅ **File Editing**: Always read files before editing them (never work from memory)
✅ **Documentation**: NEVER create .md or README files unless explicitly requested
✅ **Git Workflow**: Proactively suggest pushing after major changes/milestones
✅ **Agent Usage**: Use specialized agents when appropriate, follow tool usage patterns
✅ **Agent Rules**: Read relevant files in `.claude/agents/` for specific agent guidance
✅ **MCP Usage**: Use MCP servers when they provide value over CLI
✅ **Dependencies**: Keep stable, use Node.js 20.19.0, npm --legacy-peer-deps
✅ **Simplicity First**: Working code > "better" code, simple > complex
✅ **Visual Editing**: Maintain compatibility, test after changes
✅ **Bilingual Support**: Norwegian default, English optional
✅ **No Emojis**: Never use emojis unless explicitly requested by user

**Context Compression Risk**: Technical details survive compression better than behavioral rules.
**Solution**: Always re-read this section after compression to restore proper working patterns.

### When to Use Each Agent

**mdn-web-standards-expert** → HTML semantics, JavaScript patterns, Web APIs, web standards
- Use when: Validating HTML structure, implementing Web APIs, ensuring JavaScript best practices
- Perfect for: Semantic markup, progressive enhancement, browser API usage, UX/DX optimization
- Primary source: MDN (developer.mozilla.org)
- Remember: Web standards and simplicity over framework complexity

**css-specialist** → CSS layouts, typography, color systems, and DX-friendly patterns
- Use when: Creating layouts, typography systems, color/contrast, styling Astro components
- Perfect for: Intrinsic design, fluid typography, accessible color systems, CSS architecture
- Remember: Prioritize simple, working CSS over cutting-edge features

**astro-framework-expert** → Astro-specific features, routing, components, SSG/SSR
- Use when: Astro build issues, component problems, routing questions
- Remember: Prefer stable Astro features over experimental ones

**htmx-astro-expert** → Dynamic interactions, form submissions, event filtering
- Use when: Adding interactivity without complex JavaScript
- Perfect for: Event filtering, form enhancements, partial page updates

**sanity-studio-expert** → Sanity schemas, GROQ queries, Studio configuration
- Use when: Content modeling, query optimization, Studio customization
- Remember: Keep schemas simple unless complexity is genuinely needed

**sanity-astro-integration** → Data flow between Sanity and Astro, Visual Editing
- Use when: Connecting Sanity content to Astro pages, preview functionality
- Focus: Maintaining Visual Editing compatibility

**typescript-elegance-expert** → TypeScript improvements, code refactoring
- Use when: Code needs to be more readable or maintainable
- Remember: Working code > elegant code - only refactor if there's a real problem

### Agent Selection Priority
1. **Is the current solution working?** → If yes, probably don't change it
2. **Is this solving a user problem?** → If no, reconsider the change
3. **Will this add complexity?** → If yes, find a simpler solution
4. **Which agent aligns with keeping things simple?** → Choose that one

### MCP Server Usage

**Tool Hierarchy (Important):**
1. **MCP servers FIRST** - Always use available MCP servers as primary source
2. **WebFetch/WebSearch as fallback** - Only when MCP not available or doesn't cover the need
3. **CLI commands last** - Only when neither MCP nor WebFetch solve the problem

**Available MCP Servers:**
- **Astro Docs MCP** - Search Astro documentation, get framework info and examples
- **GitHub MCP** - Search repositories, manage issues/PRs, handle GitHub operations
- **IDE MCP** - Get language diagnostics from VS Code

**Principle**: Use MCP when it provides actual value - not "because we can"

---

## 7. Quick Reference

**Project Settings:**
- Project ID: `i952bgb1`
- Dataset: `production`
- Node.js: `v20.19.0`

**Server Ports:**
- Studio: `http://localhost:3333`
- Frontend: `http://localhost:4321`

**Key Commands:**
```bash
# Start all servers
npm run dev

# Start individual servers
npm run dev:shared
npm run dev:frontend
npm run dev:studio

# Sanity operations
npx sanity@latest schema extract
npx sanity@latest typegen generate
```

**Documentation:**
- Claude MCP: https://docs.claude.com/en/docs/claude-code/mcp
- Astro Docs: https://docs.astro.build
- Sanity Docs: https://www.sanity.io/docs
- HTMX Docs: https://htmx.org

---

*This guide exists because we learned the hard way that over-engineering breaks working systems.*
