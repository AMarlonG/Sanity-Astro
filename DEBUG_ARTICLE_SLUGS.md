# Article Slug Debugging Guide

## Problem Statement
Getting 404 errors when accessing article pages by slug.

## Investigation Summary

### ✅ What's Working Correctly

1. **Sanity Data Structure**
   - Articles have proper `slug_no` and `slug_en` fields
   - Test article exists with slug: `joseph-haydn-arets-komponist`
   - No legacy `slug` field (this is expected and correct)

2. **GROQ Queries**
   - Query pattern works correctly: `$slug in [slug_no.current, slug_en.current, slug.current]`
   - Successfully retrieves article data
   - Verified with direct Sanity client test

3. **Route Configuration**
   - Route file: `/frontend/src/pages/artikler/[slug].astro`
   - No routing conflicts
   - Correct URL pattern: `/artikler/{slug}`

### 🔍 Debug Logging Added

Added comprehensive console logging to these files:
- `/frontend/src/pages/artikler/[slug].astro`
- `/frontend/src/lib/sanity/dataService.ts`

### 📋 Debugging Steps

1. **Restart Dev Server**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Access Correct URL**
   - Norwegian: `http://localhost:4321/artikler/joseph-haydn-arets-komponist`
   - English: `http://localhost:4321/en/articles/joseph-haydn-composer-focus`

3. **Check Console Output**
   Look for these log messages:
   ```
   [Article Route] Requested slug: joseph-haydn-arets-komponist
   [DataService] Getting article by slug: joseph-haydn-arets-komponist language: no
   [DataService] Executing GROQ query: { query: ..., params: ... }
   [DataService] Article query result: Found
   [Article Route] Article found: { id: ..., title: ..., slug_no: ..., slug_en: ... }
   ```

4. **Check for These Issues**

   #### Issue: Cache has stale data
   **Symptom**: Logs show "Returning cached result" but article is null
   **Solution**:
   ```bash
   # Restart dev server to clear in-memory cache
   # Or clear cache via browser dev tools
   ```

   #### Issue: Wrong URL being accessed
   **Symptom**: Getting 404 without seeing `[Article Route]` logs
   **Solution**:
   ```
   Make sure you're accessing:
   ✅ /artikler/joseph-haydn-arets-komponist
   ❌ NOT: /joseph-haydn-arets-komponist
   ❌ NOT: /article/joseph-haydn-arets-komponist
   ```

   #### Issue: Article has draft status
   **Symptom**: Logs show "Article not found"
   **Solution**: Check article's `publishingStatus` field in Sanity Studio

   #### Issue: Language detection problem
   **Symptom**: Logs show wrong language being detected
   **Solution**: Check `createDataService(Astro.request)` and language detection logic

### 🧪 Manual Test Query

You can test the query directly in Sanity Studio's Vision tool:

```groq
*[_type == "article" && $slug in [slug_no.current, slug_en.current, slug.current]][0]{
  _id,
  title_no,
  title_en,
  slug_no,
  slug_en,
  slug,
  "computed_slug": coalesce(slug_no.current, slug_en.current, slug.current),
  publishingStatus
}
```

With parameter: `slug = "joseph-haydn-arets-komponist"`

### 📊 Test Data Confirmed

Article data in Sanity:
```json
{
  "_id": "fe24356e-3766-4538-b400-8709361ed498",
  "title_no": "Joseph Haydn: Årets komponist",
  "title_en": "Joseph Haydn: Composer focus",
  "slug_no": {
    "_type": "slug",
    "current": "joseph-haydn-arets-komponist"
  },
  "slug_en": {
    "_type": "slug",
    "current": "joseph-haydn-composer-focus"
  },
  "slug": null,
  "computed_slug": "joseph-haydn-arets-komponist"
}
```

### 🎯 Expected Behavior

When accessing `/artikler/joseph-haydn-arets-komponist`, you should see:
1. Console logs showing slug request
2. Console logs showing successful query
3. Article page rendered with title "Joseph Haydn: Årets komponist"

### 🐛 If Still Getting 404

Please check console logs and report:
1. What logs appear (copy all `[Article Route]` and `[DataService]` logs)
2. What URL you're accessing (exact URL from browser)
3. What error appears in browser console
4. What the Network tab shows (status code, response)

This will help pinpoint the exact issue.
