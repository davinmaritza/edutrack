'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { 
  Heading1, 
  Heading2, 
  List, 
  CheckSquare, 
  AlignLeft, 
  Info, 
  Trash2, 
  Plus, 
  ChevronUp, 
  ChevronDown, 
  FileText, 
  CheckCircle, 
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export type BlockType = 'paragraph' | 'h1' | 'h2' | 'bullet' | 'todo' | 'callout'

export interface EditorBlock {
  id: string
  type: BlockType
  content: string
  checked?: boolean
}

interface BlockEditorProps {
  documentId: string
  initialTitle: string
  initialContent: string
  onTitleChange?: (newTitle: string) => void
  onSaveStatusChange?: (status: 'saved' | 'saving' | 'error') => void
}

// Auto-resizing textarea component for stable React typing/caret focus
function AutoResizeTextarea({
  value,
  onChange,
  placeholder,
  className,
  onKeyDown,
  onFocus,
  inputRef
}: {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  className?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onFocus?: () => void
  inputRef?: (el: HTMLTextAreaElement | null) => void
}) {
  const localRef = useRef<HTMLTextAreaElement | null>(null)

  const adjustHeight = () => {
    const el = localRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [value])

  return (
    <textarea
      ref={(el) => {
        localRef.current = el
        if (inputRef) inputRef(el)
      }}
      value={value}
      onChange={(e) => {
        onChange(e.target.value)
        adjustHeight()
      }}
      placeholder={placeholder}
      className={`w-full bg-transparent resize-none border-none outline-none focus:ring-0 p-0 text-sm leading-relaxed text-[var(--foreground)] placeholder-zinc-400 dark:placeholder-zinc-600 ${className}`}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      rows={1}
    />
  )
}

export function BlockEditor({
  documentId,
  initialTitle,
  initialContent,
  onTitleChange,
  onSaveStatusChange
}: BlockEditorProps) {
  const [title, setTitle] = useState(initialTitle)
  const [blocks, setBlocks] = useState<EditorBlock[]>([])
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(null)
  const [showSlashMenu, setShowSlashMenu] = useState<boolean>(false)
  const [slashQuery, setSlashQuery] = useState<string>('')
  const [slashMenuPosition, setSlashMenuPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const blockRefs = useRef<{ [key: string]: HTMLTextAreaElement | HTMLInputElement | null }>({})

  // Initialize blocks
  useEffect(() => {
    try {
      if (initialContent) {
        const parsed = JSON.parse(initialContent)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBlocks(parsed)
          return
        }
      }
    } catch (e) {
      console.error("Error parsing block content", e)
    }
    
    // Default block if empty
    setBlocks([
      { id: 'b-default', type: 'paragraph', content: '' }
    ])
  }, [initialContent, documentId])

  // Trigger autosave
  const triggerAutosave = useCallback((currentTitle: string, currentBlocks: EditorBlock[]) => {
    setSaveStatus('saving')
    onSaveStatusChange?.('saving')

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/documents/${documentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: currentTitle,
            content: currentBlocks
          })
        })

        if (res.ok) {
          setSaveStatus('saved')
          onSaveStatusChange?.('saved')
        } else {
          setSaveStatus('error')
          onSaveStatusChange?.('error')
        }
      } catch (err) {
        setSaveStatus('error')
        onSaveStatusChange?.('error')
      }
    }, 1200) // Debounce for 1.2 seconds
  }, [documentId, onSaveStatusChange])

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
    onTitleChange?.(newTitle)
    triggerAutosave(newTitle, blocks)
  }

  const handleBlockChange = (index: number, content: string) => {
    const updated = [...blocks]
    
    // Markdown Shortcuts
    let newType: BlockType | null = null
    let cleanContent = content

    if (content.startsWith('# ')) {
      newType = 'h1'
      cleanContent = content.substring(2)
    } else if (content.startsWith('## ')) {
      newType = 'h2'
      cleanContent = content.substring(3)
    } else if (content.startsWith('- ') || content.startsWith('* ')) {
      newType = 'bullet'
      cleanContent = content.substring(2)
    } else if (content.startsWith('[] ')) {
      newType = 'todo'
      cleanContent = content.substring(3)
    } else if (content.startsWith('/callout ')) {
      newType = 'callout'
      cleanContent = content.substring(9)
    }

    updated[index].content = cleanContent
    if (newType) {
      updated[index].type = newType
      if (newType === 'todo') {
        updated[index].checked = updated[index].checked ?? false
      }
    }

    // Slash menu popover detection
    const slashIdx = content.lastIndexOf('/')
    if (slashIdx !== -1 && slashIdx === content.length - 1) {
      setShowSlashMenu(true)
      setSlashQuery('')
      const element = blockRefs.current[updated[index].id]
      if (element) {
        const rect = element.getBoundingClientRect()
        setSlashMenuPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX
        })
      }
    } else if (showSlashMenu) {
      if (slashIdx === -1) {
        setShowSlashMenu(false)
      } else {
        setSlashQuery(content.substring(slashIdx + 1))
      }
    }

    setBlocks(updated)
    triggerAutosave(title, updated)
  }

  const handleTodoToggle = (index: number) => {
    const updated = [...blocks]
    updated[index].checked = !updated[index].checked
    setBlocks(updated)
    triggerAutosave(title, updated)
  }

  const changeBlockType = (index: number, type: BlockType) => {
    const updated = [...blocks]
    
    // Clean up content from slash query character
    let content = updated[index].content
    const slashIdx = content.lastIndexOf('/')
    if (slashIdx !== -1) {
      content = content.substring(0, slashIdx)
    }

    updated[index].type = type
    updated[index].content = content
    if (type === 'todo') {
      updated[index].checked = false
    }

    setBlocks(updated)
    setShowSlashMenu(false)
    triggerAutosave(title, updated)

    // Re-focus the block after type change
    setTimeout(() => {
      blockRefs.current[updated[index].id]?.focus()
    }, 50)
  }

  const addBlock = (index: number, type: BlockType = 'paragraph') => {
    const updated = [...blocks]
    const newId = `b-${Math.random().toString(36).substr(2, 9)}`
    updated.splice(index + 1, 0, {
      id: newId,
      type,
      content: '',
      checked: type === 'todo' ? false : undefined
    })
    setBlocks(updated)
    setActiveBlockIndex(index + 1)
    triggerAutosave(title, updated)

    // Focus new block
    setTimeout(() => {
      blockRefs.current[newId]?.focus()
    }, 50)
  }

  const removeBlock = (index: number) => {
    if (blocks.length === 1) {
      const updated = [{ ...blocks[0], content: '', type: 'paragraph' as BlockType }]
      setBlocks(updated)
      triggerAutosave(title, updated)
      return
    }

    const updated = blocks.filter((_, i) => i !== index)
    setBlocks(updated)
    
    const focusIndex = Math.max(0, index - 1)
    setActiveBlockIndex(focusIndex)
    triggerAutosave(title, updated)

    setTimeout(() => {
      const prevId = blocks[focusIndex]?.id
      if (prevId) {
        blockRefs.current[prevId]?.focus()
      }
    }, 50)
  }

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === blocks.length - 1) return

    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const updated = [...blocks]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp

    setBlocks(updated)
    setActiveBlockIndex(targetIndex)
    triggerAutosave(title, updated)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addBlock(index, 'paragraph')
    } else if (e.key === 'Backspace' && blocks[index].content === '') {
      e.preventDefault()
      removeBlock(index)
    } else if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault()
      const prevId = blocks[index - 1].id
      blockRefs.current[prevId]?.focus()
      setActiveBlockIndex(index - 1)
    } else if (e.key === 'ArrowDown' && index < blocks.length - 1) {
      e.preventDefault()
      const nextId = blocks[index + 1].id
      blockRefs.current[nextId]?.focus()
      setActiveBlockIndex(index + 1)
    } else if (e.key === 'Escape') {
      setShowSlashMenu(false)
    }
  }

  const slashMenuOptions = [
    { type: 'paragraph', label: 'Teks Biasa', icon: AlignLeft, desc: 'Teks paragraf standar' },
    { type: 'h1', label: 'Judul Utama', icon: Heading1, desc: 'Ukuran judul besar (H1)' },
    { type: 'h2', label: 'Sub-judul', icon: Heading2, desc: 'Ukuran sub-judul (H2)' },
    { type: 'bullet', label: 'Daftar Bullet', icon: List, desc: 'Daftar poin tak berurutan' },
    { type: 'todo', label: 'Tugas / To-do', icon: CheckSquare, desc: 'Daftar dengan kotak centang' },
    { type: 'callout', label: 'Callout Info', icon: Info, desc: 'Kotak sorotan informasi penting' },
  ] as const

  const filteredOptions = slashMenuOptions.filter(opt => 
    opt.label.toLowerCase().includes(slashQuery.toLowerCase()) ||
    opt.type.includes(slashQuery.toLowerCase())
  )

  return (
    <div className="w-full space-y-6">
      {/* Editor Header Status */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)]">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-[#5483B3]" />
              <span>Menyimpan otomatis...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
              <span>Semua perubahan disimpan</span>
            </>
          )}
          {saveStatus === 'error' && (
            <span className="text-red-500">Gagal menyimpan otomatis</span>
          )}
        </div>
        <div className="text-[10px] bg-[var(--muted)] px-2.5 py-1 rounded-md text-[var(--muted-foreground)] font-bold uppercase tracking-wider">
          MODE EDITOR KEGIATAN
        </div>
      </div>

      {/* Editor Title Input */}
      <div className="relative">
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Tulis judul catatan..."
          className="w-full bg-transparent text-3xl font-extrabold tracking-tight border-none focus:outline-none focus:ring-0 text-[var(--foreground)] placeholder-zinc-300 dark:placeholder-zinc-700 py-1"
        />
      </div>

      {/* Editor Blocks */}
      <div className="space-y-3 min-h-[250px] relative">
        {blocks.map((block, index) => {
          return (
            <div 
              key={block.id} 
              className="group flex items-start gap-2 relative rounded-xl py-1.5 px-2.5 hover:bg-[var(--muted)]/20 transition-all"
              onMouseEnter={() => setActiveBlockIndex(index)}
            >
              {/* Left Action Drag-and-Drop / Button Handles */}
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-0.5 bg-[var(--card)]/90 backdrop-blur border border-[var(--border)] p-0.5 rounded-lg shadow-sm z-10">
                <button
                  type="button"
                  onClick={() => moveBlock(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-[var(--muted-foreground)] hover:text-[#5483B3] hover:bg-[var(--muted)] rounded disabled:opacity-30"
                  title="Pindahkan ke atas"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveBlock(index, 'down')}
                  disabled={index === blocks.length - 1}
                  className="p-1 text-[var(--muted-foreground)] hover:text-[#5483B3] hover:bg-[var(--muted)] rounded disabled:opacity-30"
                  title="Pindahkan ke bawah"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => addBlock(index)}
                  className="p-1 text-[var(--muted-foreground)] hover:text-green-500 hover:bg-[var(--muted)] rounded"
                  title="Tambah baris"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => removeBlock(index)}
                  className="p-1 text-[var(--muted-foreground)] hover:text-red-500 hover:bg-[var(--muted)] rounded"
                  title="Hapus baris"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              {/* Block Input Content */}
              <div className="flex-1 min-w-0 flex items-start gap-3">
                {block.type === 'todo' && (
                  <input
                    type="checkbox"
                    checked={block.checked || false}
                    onChange={() => handleTodoToggle(index)}
                    className="mt-1 h-4 w-4 rounded border-[var(--border)] text-[#5483B3] focus:ring-[#5483B3] cursor-pointer"
                  />
                )}
                {block.type === 'bullet' && (
                  <div className="mt-2.5 h-1.5 w-1.5 rounded-full bg-[#5483B3] flex-shrink-0" />
                )}

                <div className="flex-1">
                  {block.type === 'h1' ? (
                    <AutoResizeTextarea
                      inputRef={(el) => { blockRefs.current[block.id] = el }}
                      value={block.content}
                      onChange={(val) => handleBlockChange(index, val)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      placeholder="Judul Utama"
                      className="text-2xl font-bold tracking-tight text-[var(--foreground)]"
                    />
                  ) : block.type === 'h2' ? (
                    <AutoResizeTextarea
                      inputRef={(el) => { blockRefs.current[block.id] = el }}
                      value={block.content}
                      onChange={(val) => handleBlockChange(index, val)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      placeholder="Sub-judul"
                      className="text-xl font-semibold tracking-tight text-[var(--foreground)]"
                    />
                  ) : block.type === 'callout' ? (
                    <div className="flex gap-3 bg-[#5483B3]/5 dark:bg-[#5483B3]/10 border border-[#5483B3]/20 p-3 rounded-xl">
                      <Info className="h-5 w-5 text-[#5483B3] mt-0.5 flex-shrink-0" />
                      <AutoResizeTextarea
                        inputRef={(el) => { blockRefs.current[block.id] = el }}
                        value={block.content}
                        onChange={(val) => handleBlockChange(index, val)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        placeholder="Sorotan info penting..."
                        className="text-sm font-medium leading-relaxed text-[var(--foreground)]"
                      />
                    </div>
                  ) : (
                    <AutoResizeTextarea
                      inputRef={(el) => { blockRefs.current[block.id] = el }}
                      value={block.content}
                      onChange={(val) => handleBlockChange(index, val)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      placeholder="Ketik '/' untuk menu, '##' untuk sub-judul..."
                      className={`text-sm leading-relaxed text-[var(--foreground)] ${
                        block.type === 'todo' && block.checked ? 'line-through text-[var(--muted-foreground)]' : ''
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Slash Command Dropdown Popover */}
        {showSlashMenu && (
          <div 
            className="absolute bg-[var(--card)] border border-[var(--border)] rounded-xl shadow-2xl p-2 w-72 max-h-72 overflow-y-auto z-50 flex flex-col divide-y divide-[var(--border)] animate-in fade-in slide-in-from-top-3 duration-200"
            style={{ 
              top: slashMenuPosition.top - 120,
              left: slashMenuPosition.left 
            }}
          >
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted-foreground)]">
              Tipe Blok Dokumen
            </div>
            <div className="py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2.5 text-xs text-[var(--muted-foreground)]">Pilihan tidak ditemukan</div>
              ) : (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => changeBlockType(activeBlockIndex ?? 0, opt.type as BlockType)}
                    className="w-full text-left px-3 py-2 hover:bg-[var(--muted)] flex items-center gap-3 transition-colors rounded-lg group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-[#5483B3]/10 text-[#5483B3] flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                      {(() => { const Icon = opt.icon; return <Icon className="h-4.5 w-4.5" />; })()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[var(--foreground)]">{opt.label}</div>
                      <div className="text-[10px] text-[var(--muted-foreground)] leading-tight">{opt.desc}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Helper Footer Tips */}
      <div className="bg-[var(--muted)]/40 p-4 rounded-xl text-xs font-medium text-[var(--muted-foreground)] space-y-1">
        <p className="font-bold text-[#5483B3]">💡 Pintasan Pintar Editor:</p>
        <p>• Ketik <code className="bg-[var(--border)] px-1 rounded"># </code> untuk Judul Utama (H1)</p>
        <p>• Ketik <code className="bg-[var(--border)] px-1 rounded">## </code> untuk Sub-judul (H2)</p>
        <p>• Ketik <code className="bg-[var(--border)] px-1 rounded">- </code> untuk Daftar Poin (Bullet)</p>
        <p>• Ketik <code className="bg-[var(--border)] px-1 rounded">[] </code> untuk Checklist (To-do)</p>
        <p>• Ketik <code className="bg-[var(--border)] px-1 rounded">/ </code> di mana saja untuk memunculkan Pilihan Blok secara interaktif.</p>
      </div>
    </div>
  )
}
