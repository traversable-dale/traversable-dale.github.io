# Git Ignore & File Tracking Guide

A quick reference for managing `.gitignore`, viewing tracked files, and handling large assets in Git.

## Common .gitignore Issues

### Issue 1: File Named Incorrectly

**Problem:** Your gitignore file is named `.gitignore.txt` instead of `.gitignore`, so Git doesn't recognize it.

**Solution:**
```bash
mv .gitignore.txt .gitignore
```

**Note:** The file must be named exactly `.gitignore` with no extension. Mac Finder and some text editors may add `.txt` automatically.

### Issue 2: .gitignore File Missing

**Problem:** You're in a Git repository but there's no `.gitignore` file at all.

**Solution:**
```bash
# Create a new .gitignore file
echo "assets/" > .gitignore

# Verify it was created
cat .gitignore

# Add and commit it so it's shared with your team
git add .gitignore
git commit -m "Add .gitignore to exclude assets folder"
```

### Issue 3: Wrong Directory

**Problem:** You created `.gitignore` in the wrong Git repository or directory.

**Solution:** Make sure you're in the root of the correct repository:
```bash
# Check which repo you're in
pwd
git remote -v

# Navigate to the correct repo if needed
cd /path/to/correct/repo
```

## Setting Up .gitignore

### Location
The `.gitignore` file should be in the root of your Git repository (same directory as the `.git` folder).

### Basic Syntax
```
# Ignore entire folder
assets/

# Ignore specific file type
*.log

# Ignore specific file
config.env
```

**Tip:** You only need one line to ignore an entire directory and all its contents. For example, `assets/` ignores everything in that folder - no need for `assets/*`, `assets/subfolder/*`, etc.

## Removing Already-Tracked Files

### Problem
`.gitignore` only prevents *new* files from being tracked. If files were already tracked before you added them to `.gitignore`, they'll still be tracked.

### Solution
Remove the files from Git's tracking (but keep them on your disk):

```bash
# Remove a specific folder
git rm -r --cached assets/

# Remove a specific file
git rm --cached file.txt

# Commit the change
git commit -m "Remove assets from Git tracking"
```

The `--cached` flag is crucial - it removes files from Git's index but keeps them on your filesystem.

## Viewing Tracked Files

### List all tracked files
```bash
git ls-files
```

### List tracked files with more detail
```bash
git ls-tree -r HEAD --name-only
```

### List tracked files with their status
```bash
git ls-files -t
```

### Count tracked files
```bash
git ls-files | wc -l
```

### Search for specific tracked files
```bash
git ls-files | grep "pattern"
```

### Page through tracked files
```bash
git ls-files | less
```

## Troubleshooting .gitignore

If `.gitignore` isn't working, check for:

1. **Wrong filename:** Must be `.gitignore` (not `.gitignore.txt`)
2. **Wrong location:** Must be in repository root
3. **Trailing spaces:** Make sure there are no spaces after entries
4. **Files already tracked:** Use `git rm --cached` to untrack them first
5. **Encoding issues:** Recreate the file if needed:
   ```bash
   echo "assets/" > .gitignore
   ```

## Quick Reference

```bash
# Check gitignore file exists and location
ls -la .gitignore

# View gitignore contents
cat .gitignore

# Check Git status
git status

# List all tracked files
git ls-files

# Remove folder from tracking (keep files locally)
git rm -r --cached folder/

# Commit the removal
git commit -m "Update tracked files"
```

## Useful .gitignore Patterns

```
# Dependencies
node_modules/
vendor/

# Environment variables
.env
.env.local

# Build outputs
dist/
build/
*.min.js

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp

# Logs
*.log
logs/

# Media/Assets (if large)
assets/
uploads/
```

---

**Pro Tip:** You can find `.gitignore` templates for different languages and frameworks at [gitignore.io](https://www.toptal.com/developers/gitignore) or [GitHub's gitignore repository](https://github.com/github/gitignore).

## Tracking Large Assets with Git LFS

### What is Git LFS?

**Git LFS (Large File Storage)** is a Git extension that handles large files (audio, video, images, datasets) more efficiently. Instead of storing large binary files directly in your Git repository, LFS stores them separately and keeps only small pointer files in Git. This keeps your repo fast and clone times short.

### When to Use Git LFS

**Use LFS for:**
- Audio files (`.mp3`, `.wav`, `.flac`)
- Video files (`.mp4`, `.mov`, `.avi`)
- Large images (`.psd`, `.ai`, high-res photos)
- 3D models and game assets
- Datasets and databases
- Any file over ~5MB that changes frequently

**Don't use LFS for:**
- Small text files or code
- Files that don't change often
- Files you don't need in version control (use `.gitignore` instead)

### Setting Up Git LFS from Scratch

**1. Install Git LFS:**
```bash
# macOS
brew install git-lfs

# Windows
# Download from https://git-lfs.github.com/

# Linux (Debian/Ubuntu)
sudo apt-get install git-lfs
```

**2. Initialize Git LFS in your repository:**
```bash
cd your-repo
git lfs install
```

**3. Track file types with LFS:**
```bash
# Track specific file extensions
git lfs track "*.mp3"
git lfs track "*.wav"
git lfs track "*.psd"
git lfs track "*.mp4"

# Track all files in a folder
git lfs track "assets/audio/**"
```

This creates a `.gitattributes` file that tells Git which files to handle with LFS.

**4. Verify `.gitattributes` was created:**
```bash
cat .gitattributes
```

Should show something like:
```
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.wav filter=lfs diff=lfs merge=lfs -text
```

**5. Add and commit the `.gitattributes` file:**
```bash
git add .gitattributes
git commit -m "Configure Git LFS for audio files"
```

**6. Now add your large files:**
```bash
git add assets/
git commit -m "Add audio assets via Git LFS"
git push
```

### Important Notes About .gitattributes

- The file must be named exactly `.gitattributes` (no `.txt` extension!)
- It should be in the root of your repository
- It needs to be committed before adding the large files
- **Conflict with .gitignore:** If a folder is in `.gitignore`, it won't be tracked even if it's in `.gitattributes`. Choose one approach or the other.

### Checking What's Tracked by LFS

```bash
# See which files are tracked by LFS
git lfs ls-files

# See LFS tracking patterns
git lfs track
```

### Migrating Existing Files to LFS

If you already committed large files and want to move them to LFS:

```bash
# Track the file type
git lfs track "*.mp3"

# Migrate existing files in history
git lfs migrate import --include="*.mp3"

# Push the changes
git push --force
```

**Warning:** This rewrites Git history, so coordinate with your team first!

### Removing LFS (If You Change Your Mind)

```bash
# Untrack all LFS patterns
git lfs untrack "*.mp3"

# Remove .gitattributes entries
# (Edit .gitattributes manually or delete it)

# Uninstall LFS from the repo
git lfs uninstall
```

Then use `.gitignore` to ignore the large files instead.

### Git LFS vs .gitignore: Decision Guide

| Scenario | Use This |
|----------|----------|
| Large files needed in repo, team needs them | **Git LFS** |
| Large files are build outputs or temporary | **`.gitignore`** |
| Files are user-specific (API keys, local config) | **`.gitignore`** |
| Files are too large even for LFS (>2GB) | **`.gitignore`** + external storage |
| Team doesn't have LFS set up | **`.gitignore`** for now |

### Example: Audio Project Setup

**With Git LFS (team needs the audio files):**
```bash
git lfs install
git lfs track "*.mp3"
git lfs track "*.wav"
git add .gitattributes
git commit -m "Configure Git LFS"
git add assets/
git commit -m "Add audio assets"
```

**Without Git LFS (ignore audio files):**
```bash
echo "assets/" > .gitignore
git add .gitignore
git commit -m "Ignore assets folder"
# Store audio files in Dropbox, Google Drive, or AWS S3 instead
```

---

**Additional Resources:**
- [Git LFS Official Documentation](https://git-lfs.github.com/)
- [GitHub's guide to Git LFS](https://docs.github.com/en/repositories/working-with-files/managing-large-files)
