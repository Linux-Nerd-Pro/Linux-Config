-- Set leader key to Space
vim.g.mapleader = " "
vim.g.maplocalleader = " "

-- bootstrap lazy.nvim
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git", "clone", "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git", lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({
  -- UI
  { "nvim-lualine/lualine.nvim" },
  { "nvim-tree/nvim-web-devicons" },
  { "nvim-tree/nvim-tree.lua" },
  { "nvim-telescope/telescope.nvim", dependencies = {"nvim-lua/plenary.nvim"} },

  -- Syntax & code
  { "nvim-treesitter/nvim-treesitter", build = ":TSUpdate" },
  { "neovim/nvim-lspconfig" },
  { "hrsh7th/nvim-cmp" },
  { "hrsh7th/cmp-nvim-lsp" },
  { "L3MON4D3/LuaSnip" },

  -- Git
  { "lewis6991/gitsigns.nvim" },
  { "tpope/vim-fugitive" },

  -- Utils
  { "windwp/nvim-autopairs" },
  { "numToStr/Comment.nvim" },

  -- Theme
  { "catppuccin/nvim", name = "catppuccin" },
})

-- general settings
vim.o.number = true
vim.o.relativenumber = true
vim.o.termguicolors = true
vim.o.expandtab = true
vim.o.shiftwidth = 2
vim.o.tabstop = 2
vim.cmd.colorscheme "catppuccin"

-- lualine
require("lualine").setup()

-- nvim-tree
require("nvim-tree").setup({
  view = { width = 30, side = "left" },
  renderer = { icons = { show = { git = true, folder = true, file = true } } },
  filters = { dotfiles = false },
})
vim.keymap.set("n", "<C-n>", ":NvimTreeToggle<CR>")

-- telescope keymaps
vim.keymap.set("n", "<leader>ff", "<cmd>Telescope find_files<cr>")
vim.keymap.set("n", "<leader>fg", "<cmd>Telescope live_grep<cr>")
vim.keymap.set("n", "<leader>fb", "<cmd>Telescope buffers<cr>")

-- treesitter
require("nvim-treesitter.configs").setup {
  ensure_installed = {"lua","bash","python","html","css","javascript"},
  highlight = { enable = true }
}

-- gitsigns
require("gitsigns").setup()

-- autopairs
require("nvim-autopairs").setup()

-- comment.nvim
require("Comment").setup()

-- nvim-cmp setup
local cmp = require'cmp'
local luasnip = require'luasnip'

cmp.setup({
  snippet = { expand = function(args) luasnip.lsp_expand(args.body) end },
  mapping = {
    ['<C-Space>'] = cmp.mapping.complete(),
    ['<CR>'] = cmp.mapping.confirm({ select = true }),
    ['<Tab>'] = cmp.mapping.select_next_item({ behavior = cmp.SelectBehavior.Insert }),
    ['<S-Tab>'] = cmp.mapping.select_prev_item({ behavior = cmp.SelectBehavior.Insert }),
  },
  sources = cmp.config.sources({
    { name = 'nvim_lsp' },
    { name = 'luasnip' },
  }, {
    { name = 'buffer' },
  }),
})

-- ============================
-- LSP Setup with warning suppression
-- ============================
local lspconfig = require("lspconfig")

-- Suppress warnings temporarily
local old_notify = vim.notify
vim.notify = function(...) end  -- disable notification

-- Helper to suppress deprecation warning temporarily
local function safe_setup(server_name, opts)
  if lspconfig[server_name] then
    local old_notify = vim.notify
    vim.notify = function() end  -- disable notification
    lspconfig[server_name].setup(opts)
    vim.notify = old_notify      -- restore notify
  end
end

-- Python (pyright)
safe_setup("pyright", {
  on_attach = function(client, bufnr)
    local opts = { noremap=true, silent=true, buffer=bufnr }
    vim.keymap.set("n", "gd", vim.lsp.buf.definition, opts)
    vim.keymap.set("n", "K", vim.lsp.buf.hover, opts)
    vim.keymap.set("n", "<leader>rn", vim.lsp.buf.rename, opts)
    vim.keymap.set("n", "<leader>ca", vim.lsp.buf.code_action, opts)
    vim.api.nvim_buf_set_option(bufnr, 'omnifunc', 'v:lua.vim.lsp.omnifunc')
  end,
})

-- JavaScript / TypeScript (ts_ls)
safe_setup("ts_ls", {
  on_attach = function(client, bufnr)
    local opts = { noremap=true, silent=true, buffer=bufnr }
    vim.keymap.set("n", "gd", vim.lsp.buf.definition, opts)
    vim.keymap.set("n", "K", vim.lsp.buf.hover, opts)
    vim.keymap.set("n", "<leader>rn", vim.lsp.buf.rename, opts)
    vim.keymap.set("n", "<leader>ca", vim.lsp.buf.code_action, opts)
    vim.api.nvim_buf_set_option(bufnr, 'omnifunc', 'v:lua.vim.lsp.omnifunc')
  end,
})

-- Run Python & JS from Neovim
vim.keymap.set("n", "<F5>", ":split | terminal python3 %<CR>", { silent = true })
vim.keymap.set("n", "<F6>", ":split | terminal node %<CR>", { silent = true })

-- Optional: Auto-open NvimTree like VS Code
--vim.api.nvim_create_autocmd("VimEnter", {
--  callback = function()
--    require("nvim-tree.api").tree.open()
--  end,
--})

-- Restore notifications
vim.notify = old_notify
