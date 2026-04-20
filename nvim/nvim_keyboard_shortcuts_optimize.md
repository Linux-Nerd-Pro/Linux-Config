# 🚀 My Personal Neovim Configuration

A lightweight, high-performance Neovim setup tailored for **Python** and **JavaScript** development.

## ⌨️ Ultimate Command Center

| Category | Shortcut | Action / Description |
| :--- | :--- | :--- |
| **The Essentials** | `Space` | **Leader Key** (The prefix for your custom shortcuts). |
| |
| | `:w` / `:q` | **Save** / **Quit** the current file. |
| |
| | `u` / `Ctrl + r` | **Undo** / **Redo** (Hold Ctrl for Redo). |
| |
| | `Space + h` | **Clear Highlights**: Remove yellow search coloring. |
| |
| | `Ctrl + w` then `q` | **Close window**: Closes terminal or split screen. |
| |
| **Movement** | `0` / `^` | Jump to **Start** of line / **First text** character. |
| |
| | `$` | Jump to **End** of line. |
| |
| | `gg` / `G` | Jump to **Top** of file / **Bottom** of file. |
| |
| **Visual Mode** | `v` | **Visual**: Highlight character by character. |
| |
| | `V` (Shift+v) | **Visual Line**: Highlight entire lines at once. |
| |
| | `y` / `d` | **Yank (Copy)** or **Delete (Cut)** the highlighted block. |
| |
| **File & Search** | `Ctrl + n` | **Toggle Sidebar**: Opens/closes the file explorer (NvimTree). |
| |
| | `Space + ff` | **Find Files**: Search for a file by name. |
| |
| | `Space + fg` | **Find Grep**: Search for text inside all files. |
| |
| | `Space + fb` | **Find Buffers**: Switch between open files. |
| |
| | `Tab` / `Shift + Tab`| **Next / Previous** open file. |
| |
| **Run Code** | **`F5`** | **Run Python**: Auto-saves and runs in terminal split. |
| |
| | **`F6`** | **Run JavaScript**: Auto-saves and runs in terminal split. |
| |
| **LSP (Smart)** | `Space + rn` | **Rename Variable**: Changes name everywhere in file. |
| |
| | `Space + ca` | **Code Actions**: Quick-fix for errors (lightbulb). |
| |
| | `gd` | **Go to Definition**: Jump to where code was created. |
| |
| | `K` | **Hover Docs**: Show info about code under cursor. |
| |
| **Copy & Cut** | `yy` / `dd` | **Copy** (Yank) line / **Cut** (Delete) line. |
| |
| | `p` / `P` | **Paste** after cursor / **Paste** before cursor. |
| |
| | `ggyG` | **Copy Entire File**. |
| |
| | `ggdG` | **Cut Entire File**. |
| |
| **Sidebar (File)** | `r` / `a` / `d` | **Rename** / **Add** / **Delete** (Hover over file in sidebar). |
| |

---

## 💡 Workflow Pro-Tips

* **Terminal Navigation:** After running code with **F5/F6**, press **`Ctrl + w` then `w`** to move your cursor back to your code without closing the result window.
* **The "Project" Rule:** If **`Space + rn`** (Rename) doesn't work, ensure you have a `pyrightconfig.json` (Python) or `.git` folder in your project directory so the LSP identifies the root.
* **Smart Start:** Use **`I`** (Shift + i) to jump to the start of a line and start typing immediately, or **`A`** (Shift + a) to do the same at the end of a line.
* **Visual Selection:** If you want to delete 5 specific lines, press **`V`**, move down 5 lines, then press **`d`**.

---

## 🛠️ Installation Requirements
To ensure the "Smart" features work, make sure these are installed on your system:
* **Language Servers:** `pip install pyright` (Python) and `npm install -g typescript typescript-language-server` (JS).
* **System Clipboard:** Ensure `xclip` or `wl-copy` is installed if you want to copy-paste outside of Neovim.
