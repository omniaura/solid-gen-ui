# NPM Publishing Setup Guide

This guide walks you through the one-time setup needed to enable automated, signed npm releases for solid-gen-ui.

## What's Been Set Up

✅ **GitHub Actions workflows** (`.github/workflows/`)
- `ci.yml` - Runs tests on PRs
- `publish.yml` - Automated releases on `main` branch pushes

✅ **Semantic Release config** (`.releaserc.json`)
- Automatic versioning based on conventional commits
- Changelog generation
- GitHub releases
- Multi-package publishing with provenance

✅ **Package.json updates**
- Added semantic-release dependencies

## Package Names (All Available! ✅)

The following package names are available on npm:
- `@solid-gen-ui/core`
- `@solid-gen-ui/solid`
- `@solid-gen-ui/schema-zod`
- `@solid-gen-ui/adapter-tanstack`

## One-Time Setup Steps

### 1. Create npm Organization

**If `@solid-gen-ui` org doesn't exist:**

1. Go to https://www.npmjs.com/org/create
2. Create organization: `solid-gen-ui`
3. Choose "Unlimited public packages" (free)

**If org already exists:**
- Skip to step 2

### 2. Configure npm Granular Access Token (for CI)

**Why:** We need a token for the GitHub Action to authenticate with npm.

1. Go to https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Click "Generate New Token" → "Granular Access Token"
3. Configure:
   - **Token name:** `solid-gen-ui-github-actions`
   - **Expiration:** 1 year (or "No expiration" if you trust your security)
   - **Packages and scopes:**
     - Select: "Read and write"
     - Organizations: `@solid-gen-ui`
   - **IP allowances:** Leave empty (GitHub Actions IPs change)

4. Click "Generate Token" and **COPY THE TOKEN** (you won't see it again!)

### 3. Add npm Token to GitHub Secrets

1. Go to https://github.com/omniaura/solid-gen-ui/settings/secrets/actions
2. Click "New repository secret"
3. Configure:
   - **Name:** `NPM_TOKEN`
   - **Secret:** Paste the token from step 2
4. Click "Add secret"

### 4. Enable npm Provenance (Signed Releases)

**For each package**, you need to configure npm to accept provenance from GitHub Actions:

1. Go to https://www.npmjs.com/settings/solid-gen-ui/packages
2. After first publish, for each package:
   - Click package name
   - Go to "Settings" tab
   - Under "Provenance", verify GitHub Actions is listed as trusted publisher

**Note:** Provenance is configured automatically on first publish via the `--provenance` flag. No manual setup needed!

### 5. Update GitHub Actions Workflow to Use npm Token

The current workflow uses OIDC (id-token: write), which is great for security but requires additional npm setup. Let's use the simpler token-based auth:

**Update `.github/workflows/publish.yml`:**

```yaml
- run: pnpm -r publish --provenance --access public --no-git-checks
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Actually, I'll update this for you now...

## How Automated Releases Work

Once setup is complete, releases happen automatically:

1. **You commit using conventional commits:**
   ```bash
   git commit -m "feat: add new component"  # → Minor version bump (0.1.0 → 0.2.0)
   git commit -m "fix: resolve bug"         # → Patch version bump (0.1.0 → 0.1.1)
   git commit -m "feat!: breaking change"   # → Major version bump (0.1.0 → 1.0.0)
   ```

2. **Push to main:**
   ```bash
   git push origin main
   ```

3. **GitHub Actions automatically:**
   - Analyzes commits since last release
   - Determines new version number
   - Updates all package.json files
   - Builds all packages
   - Publishes to npm with provenance signatures
   - Creates GitHub release with changelog
   - Commits version bumps back to repo

## Conventional Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature (minor bump)
- `fix:` - Bug fix (patch bump)
- `perf:` - Performance improvement (patch bump)
- `docs:` - Documentation only (no release)
- `style:` - Code style changes (no release)
- `refactor:` - Code refactoring (no release)
- `test:` - Test updates (no release)
- `chore:` - Maintenance tasks (no release)

**Breaking changes:**
- Add `!` after type: `feat!:` or `fix!:`
- OR add `BREAKING CHANGE:` in footer
- Result: Major version bump

**Examples:**
```bash
git commit -m "feat(core): add streaming support"
git commit -m "fix(solid): resolve hydration bug"
git commit -m "feat(core)!: change API signature"
```

## Testing the Setup

### Dry Run (Recommended First)

Test semantic-release locally without publishing:

```bash
pnpm install
bunx semantic-release --dry-run
```

This will show you what version would be released and what changes would be made.

### First Real Release

1. Make a small commit to trigger a release:
   ```bash
   git commit --allow-empty -m "feat: initial release"
   git push origin main
   ```

2. Watch GitHub Actions:
   - Go to https://github.com/omniaura/solid-gen-ui/actions
   - Click on the running workflow
   - Verify all steps pass

3. Check results:
   - **npm:** https://www.npmjs.com/package/@solid-gen-ui/core
   - **GitHub Releases:** https://github.com/omniaura/solid-gen-ui/releases
   - **CHANGELOG.md** updated in repo

## Troubleshooting

### "402 Payment Required" Error

**Problem:** Trying to publish scoped package without access.

**Solution:** Ensure you created the `@solid-gen-ui` org on npm (Step 1).

### "403 Forbidden" Error

**Problem:** npm token doesn't have permission.

**Solution:**
- Regenerate token with "Read and write" access for `@solid-gen-ui` org
- Update `NPM_TOKEN` secret in GitHub

### "This package requires your npm user to be granted publish access"

**Problem:** You're not a member of the `@solid-gen-ui` org.

**Solution:**
- Add your npm username to the org at https://www.npmjs.com/settings/solid-gen-ui/members

### No Release Created

**Problem:** Commits don't follow conventional format.

**Solution:**
- Ensure commits use `feat:`, `fix:`, etc.
- Check semantic-release dry run: `bunx semantic-release --dry-run`

## Verifying Signed Releases

After publishing, verify provenance signatures:

```bash
npm audit signatures
```

Or check on npm package page:
- Go to https://www.npmjs.com/package/@solid-gen-ui/core
- Look for "Provenance" badge
- Click to see GitHub Actions attestation

## Manual Publishing (Emergency Only)

If GitHub Actions is down, you can publish manually:

```bash
# 1. Update versions
pnpm version minor --no-git-tag-version --workspace-concurrency=1

# 2. Build
pnpm run build

# 3. Publish (you'll need to be logged in: npm login)
pnpm -r publish --provenance --access public

# 4. Create git tag
git add .
git commit -m "chore(release): x.y.z"
git tag vx.y.z
git push && git push --tags
```

## Security Best Practices

✅ **Use granular access tokens** (not classic tokens)
✅ **Enable 2FA on npm account**
✅ **Provenance signatures** verify builds came from GitHub Actions
✅ **Never commit npm tokens** to git
✅ **Rotate tokens annually**

## Next Steps After Setup

1. ✅ Complete one-time setup steps above
2. ✅ Test with dry run
3. ✅ Make first release
4. ✅ Verify packages on npm
5. ✅ Add npm badges to README
6. 🎉 Enjoy automated releases!

## Support

- **Semantic Release Docs:** https://semantic-release.gitbook.io/
- **npm Provenance:** https://docs.npmjs.com/generating-provenance-statements
- **Conventional Commits:** https://www.conventionalcommits.org/
