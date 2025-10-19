# Project Rules: Keep It Simple

This is a small festival website with bilingual support (Norwegian/English). These rules prevent over-engineering.

## What This Project IS
- Simple Astro frontend displaying events, artists, venues
- Sanity CMS for content management
- Basic event filtering with HTMX
- Visual Editing for content preview
- Bilingual support (Norwegian/English)

## What This Project IS NOT
- An enterprise application
- A high-traffic platform
- A complex system requiring extensive tooling

## Rules for Changes

### ✅ DO
- Fix actual bugs that affect users
- Add features specifically requested for this use case
- Keep dependencies stable and compatible
- Maintain simplicity

### ❌ DON'T
- Add "best practices" from enterprise projects
- Upgrade to major new versions without clear benefit or security need
- Add testing infrastructure unless genuinely needed
- Add monitoring/analytics unless specifically required
- Apply TypeScript strict settings that break existing code
- Change Node.js versions if current one works
- Use emojis in code, UI, or content (only use when explicitly requested by user)

## Decision Framework
Before making ANY change, ask:
1. **Is this solving an actual problem users are experiencing?**
2. **Is this specifically needed for this festival website?**
3. **Will this add unnecessary complexity?**
4. **Is the current solution already working fine?**

If the answer to #4 is "yes", then probably don't change it.

## Remember
- Working code > "better" code
- Simple solutions > complex solutions  
- Stability > theoretical improvements
- User needs > developer preferences

## Environment & Dependencies

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

### API Configuration
- **Use `apiVersion: "2025-01-01"`** in Sanity configuration for latest features
- **Set `useCdn: false`** in development for real-time content updates
- **Keep `studioUrl: 'http://localhost:3333'`** for Visual Editing

## Development Workflow

### Server Management
- **Always run both servers**: Studio (3333) + Frontend (4321) for Visual Editing
- **Use `npm run dev`** from root to start both servers simultaneously
- **Check both endpoints** respond before testing Visual Editing

### Content Structure
- **Support bilingual content** with Norwegian as default and English as optional
- **Use proper date formatting** for both languages in displays
- **Keep content schemas simple** - avoid complex relationships unless needed

### Visual Editing Requirements
- **Requires preview mode cookie** to be set (`sanity-preview-mode=true`)
- **Needs both servers running** on correct ports
- **Environment variables must be set**: `SANITY_API_READ_TOKEN` and `PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true`

### MCP Server Usage

#### Generelt om MCP (Model Context Protocol)
**Claude MCP Dokumentasjon:** https://docs.claude.com/en/docs/claude-code/mcp

MCP-servere gir direkte tilgang til verktøy og systemer uten CLI-kommandoer. De reduserer kontekstbytte og gir strukturerte, typede svar som er lettere å jobbe med.

**Når skal MCP brukes:**
- ✅ Når vi trenger å hente/endre data fra eksterne systemer (Sanity)
- ✅ Når vi trenger strukturert informasjon fra dokumentasjon (Astro Docs)
- ✅ Når det forenkler workflow og reduserer Bash-kommandoer
- ❌ Ikke bruk hvis standard verktøy er enklere eller raskere

**Grunnprinsipp:** Bruk MCP når det gir faktisk verdi - ikke "fordi vi kan".

**Verktøy-hierarki (viktig):**
1. **MCP-servere FØRST** - Alltid bruk tilgjengelige MCP-servere som primærkilde
2. **WebFetch/WebSearch som fallback** - Kun når MCP ikke er tilgjengelig eller ikke dekker behovet
3. **CLI-kommandoer sist** - Kun når verken MCP eller WebFetch løser problemet

Dette hierarkiet gjelder for alle agenter og all interaksjon med eksterne systemer.

#### Spesifikke MCP-servere

**Sanity MCP Server**
- Dokumentasjon: https://www.sanity.io/docs/compute-and-ai/mcp-server
- Bruk til: Hente innhold/data (GROQ queries), oppdatere/opprette dokumenter, sjekke schemas og content types, administrere releases og versjoner
- Foretrekk over `npx sanity` CLI-kommandoer for queries og datahenting

**Astro Docs MCP Server**
- Dokumentasjon: https://docs.astro.build/en/guides/build-with-ai/#astro-docs-mcp-server
- Bruk til: Søke i Astro-dokumentasjon, hente informasjon om Astro-funksjoner og API-er, best practices og kodeeksempler

**GitHub MCP Server**
- Dokumentasjon: https://github.com/github/github-mcp-server
- Bruk til: Søke i repositories, lese/opprette issues og pull requests, jobbe med GitHub Actions, administrere branches og commits
- Foretrekk over `gh` CLI-kommandoer for GitHub-operasjoner

**TypeScript MCP Server (kommende)**
- Dokumentasjon: (TBD)

**HTMX MCP Server (kommende)**
- Dokumentasjon: (TBD)

### File Editing Workflow
- **Always read a file before editing it** to understand the current code and how the changes will alter the code
- **Never attempt to edit based on assumptions** about file content from memory or previous sessions
- **Understand the context** before making changes to ensure proper integration

### Web Research Methodology
- **Always search chronologically starting with the current year first, then work backwards through previous years** (last year, the year before, etc.)
- **Rationale**: Technology evolves rapidly - recent solutions often supersede older approaches with better performance, support, or maintainability
- **Note**: This same methodology is defined in all specialized agent files (`.claude/agents/`)

### Post-Context Compression Checklist
**IMPORTANT: After any context compression, automatically review this checklist before continuing work:**

✅ **Project Philosophy**: This is a simple festival website - avoid over-engineering
✅ **File Editing**: Always read files before editing them (never work from memory)
✅ **Documentation**: NEVER create .md or README files unless explicitly requested
✅ **Git Workflow**: Proactively suggest pushing after major changes/milestones
✅ **Agent Usage**: Use specialized agents when appropriate, follow tool usage patterns
✅ **Agent Rules**: Read relevant files in `.claude/agents/` for specific agent guidance
✅ **MCP Usage**: Use MCP servers (Sanity, Astro Docs) when they provide value over CLI
✅ **Dependencies**: Keep stable, use Node.js 20.19.0, npm --legacy-peer-deps
✅ **Simplicity First**: Working code > "better" code, simple > complex
✅ **Visual Editing**: Maintain compatibility, test after changes
✅ **Bilingual Support**: Norwegian default, English optional
✅ **No Emojis**: Never use emojis unless explicitly requested by user

**Context Compression Risk**: Technical details survive compression better than behavioral rules.
**Solution**: Always re-read this section after compression to restore proper working patterns.

### Git Workflow

**Branch Management:**
- **Update branch from main when starting work on it**:
  ```bash
  git checkout <branch-name>
  git merge main  # Get latest changes from main
  ```
- **Update again if you need changes from main** during development
- **Update before merging back to main** to resolve conflicts in the branch first
- **Don't automatically update all branches** - only update when actively working on them

**Commit & Push Guidelines:**
- **Suggest pushing changes proactively** after completing logical milestones:
  - ✅ After adding new features or functionality
  - ✅ After completing implementation phases
  - ✅ After significant bug fixes or updates
  - ✅ After schema changes or major refactoring
- **Don't wait for explicit push requests** - suggest it when it makes sense
- **Make meaningful commit messages** that explain what was accomplished
- **Push frequently** rather than accumulating large changesets

## File Organization

### What's Handled by Claude Agents

**When to Use Each Agent:**

- **css-intrinsic-expert** → CSS layout issues, responsive design, styling Astro components
  - Use when: Creating layouts, fixing responsive issues, implementing visual designs
  - Remember: Prioritize simple, working CSS over cutting-edge features

- **astro-framework-expert** → Astro-specific features, routing, components, SSG/SSR
  - Use when: Astro build issues, component problems, routing questions
  - Remember: Prefer stable Astro features over experimental ones

- **htmx-astro-expert** → Dynamic interactions, form submissions, event filtering
  - Use when: Adding interactivity without complex JavaScript
  - Perfect for: Event filtering, form enhancements, partial page updates

- **sanity-studio-expert** → Sanity schemas, GROQ queries, Studio configuration
  - Use when: Content modeling, query optimization, Studio customization
  - Remember: Keep schemas simple unless complexity is genuinely needed

- **sanity-astro-integration** → Data flow between Sanity and Astro, Visual Editing
  - Use when: Connecting Sanity content to Astro pages, preview functionality
  - Focus: Maintaining Visual Editing compatibility

- **typescript-elegance-expert** → TypeScript improvements, code refactoring
  - Use when: Code needs to be more readable or maintainable
  - Remember: Working code > elegant code - only refactor if there's a real problem

**Agent Selection Priority:**
1. **Is the current solution working?** → If yes, probably don't change it
2. **Is this solving a user problem?** → If no, reconsider the change
3. **Will this add complexity?** → If yes, find a simpler solution
4. **Which agent aligns with keeping things simple?** → Choose that one

### What Goes in This File
- **Project-specific decisions** and constraints
- **Environment setup** and dependency management
- **Integration rules** between Astro and Sanity
- **Deployment and workflow** guidelines

## Common Pitfalls to Avoid

1. **Changing working Node.js versions** → Use 20.19.0
2. **Removing Norwegian locale** without replacement → Keep `nbNOLocale()` 
3. **Breaking Visual Editing** by changing stega config → Test preview after changes
4. **Over-optimizing dependencies** → Keep what works
5. **Adding enterprise tooling** → This is a small festival website

---
*This file exists because we learned the hard way that over-engineering breaks working systems.*