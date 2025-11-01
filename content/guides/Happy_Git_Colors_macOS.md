# 🌈 Happy Git Colors on macOS

A quick and readable guide to make Git colorful, helpful, and friendly
on a new Mac.

------------------------------------------------------------------------

## 🧩 1. Install or Update Git

Most Macs come with Apple's old Git. Install the latest Homebrew
version:

``` bash
brew install git
```

Check what you're using:

``` bash
git --version
which git
```

You want to see something like `/opt/homebrew/bin/git` --- not
`/usr/bin/git`.\
If it's wrong, fix your PATH:

``` bash
echo 'export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"' >> ~/.zshrc
exec zsh -l
```

------------------------------------------------------------------------

## 🎨 2. Enable Color in Git

Open your global Git config:

``` bash
git config --global --edit
```

Or manually edit `~/.gitconfig`. Add the following:

``` ini
[color]
    ui = auto

[color "branch"]
    current = magenta bold
    local = yellow
    remote = cyan
    upstream = blue bold
    plain = white

[color "diff"]
    meta = yellow bold
    frag = magenta bold
    old = red bold
    new = green bold
    commit = yellow bold
    whitespace = red reverse

[color "status"]
    added = green bold
    changed = yellow
    untracked = red bold
    branch = magenta bold

[color "interactive"]
    prompt = yellow
    header = magenta
    help = cyan
    error = red

[color "grep"]
    match = yellow bold
    filename = cyan
    linenumber = magenta
```

------------------------------------------------------------------------

## ⚙️ 3. Fix Missing Colors in `less`

By default, `less` can strip color codes. Fix it with:

``` bash
git config --global core.pager "less -FRX"
```

This ensures Git passes colors through properly.

------------------------------------------------------------------------

## 🧪 4. Test Your Setup

Go inside any Git repo and run:

``` bash
# Should show green/yellow/cyan
git status

# Should show red/green diffs
git diff

# Should show pretty colored graph
git log --oneline --decorate --graph --color
```

------------------------------------------------------------------------

## 💡 5. Add Color-Friendly Aliases

Optional, but super useful:

``` bash
git config --global alias.lg "log --graph --oneline --decorate --color"
git config --global alias.st "status -sb"
```

Now you can use `git lg` for quick colorful logs.

------------------------------------------------------------------------

## 🧯 6. Troubleshooting

If something still looks plain:

-   Make sure you're **inside a repo** (`git status` should work).

-   Verify terminal type:

    ``` bash
    echo $TERM
    ```

    It should say `xterm-256color`.

-   Use a theme that supports ANSI colors (like **Pro**, **Homebrew**,
    or **Tango** in Terminal).

-   If piping Git output, force color manually:

    ``` bash
    git -c color.ui=always diff | less -R
    ```

------------------------------------------------------------------------

## ✅ 7. Where to Find `.gitconfig`

-   Global file: `~/.gitconfig`
-   System-wide file (less used): `/opt/homebrew/etc/gitconfig`
-   Local (per repo): `.git/config` in the project root

You can open your global file anytime with:

``` bash
git config --global --edit
```

------------------------------------------------------------------------

✨ Enjoy your **happy Git colors** --- life's too short for gray diffs!
