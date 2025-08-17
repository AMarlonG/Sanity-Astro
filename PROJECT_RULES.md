# Project Rules: Keep It Simple

This is a small Norwegian events website. These rules prevent over-engineering.

## What This Project IS
- Simple Astro frontend displaying events, artists, venues
- Sanity CMS for content management
- Basic event filtering with HTMX
- Visual Editing for content preview
- Norwegian localization

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
- Upgrade dependencies just to have "latest versions"
- Add testing infrastructure unless genuinely needed
- Add monitoring/analytics unless specifically required
- Apply TypeScript strict settings that break existing code
- Change Node.js versions if current one works

## Decision Framework
Before making ANY change, ask:
1. **Is this solving an actual problem users are experiencing?**
2. **Is this specifically needed for this Norwegian events website?**
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
- **Keep dependencies stable** - only update for security fixes or specific features needed
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
- **Follow Norwegian naming** for content types and fields where applicable
- **Use proper Norwegian date formatting** in displays
- **Keep content schemas simple** - avoid complex relationships unless needed

### Visual Editing Requirements
- **Requires preview mode cookie** to be set (`sanity-preview-mode=true`)
- **Needs both servers running** on correct ports
- **Environment variables must be set**: `SANITY_API_READ_TOKEN` and `PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true`

## File Organization

### What's Handled by Subagents
- **Sanity schema best practices** → See `studio/.cursor/rules/sanity-opinionated.mdc`
- **TypeScript configurations** → Handled by individual workspace configs
- **Code style and patterns** → Handled by ESLint and Prettier configs

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
5. **Adding enterprise tooling** → This is a small events website

---
*This file exists because we learned the hard way that over-engineering breaks working systems.*