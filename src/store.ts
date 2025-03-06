import { create } from 'zustand';
import { NotebookState, Chapter, Subchapter } from './types';

// Helper function to generate unique IDs with prefixes
const generateId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

export const useStore = create<NotebookState>((set) => ({
  chapters: [],
  activeChapter: null,
  activeSubchapter: null,
  
  setActiveChapter: (id) => set({ activeChapter: id }),
  setActiveSubchapter: (id) => set({ activeSubchapter: id }),
  
  addChapter: (title) => set((state) => ({
    chapters: [...state.chapters, {
      id: generateId('chapter'),
      title,
      subchapters: []
    }]
  })),
  
  addSubchapter: (chapterId, title) => set((state) => ({
    chapters: state.chapters.map(chapter => 
      chapter.id === chapterId
        ? {
            ...chapter,
            subchapters: [...chapter.subchapters, {
              id: generateId('subchapter'),
              title,
              content: '',
              drawings: []
            }]
          }
        : chapter
    )
  })),
  
  updateContent: (chapterId, subchapterId, content) => set((state) => ({
    chapters: state.chapters.map(chapter =>
      chapter.id === chapterId
        ? {
            ...chapter,
            subchapters: chapter.subchapters.map(subchapter =>
              subchapter.id === subchapterId
                ? { ...subchapter, content }
                : subchapter
            )
          }
        : chapter
    )
  })),
  
  addDrawing: (chapterId, subchapterId, points) => set((state) => ({
    chapters: state.chapters.map(chapter =>
      chapter.id === chapterId
        ? {
            ...chapter,
            subchapters: chapter.subchapters.map(subchapter =>
              subchapter.id === subchapterId
                ? {
                    ...subchapter,
                    drawings: [...subchapter.drawings, {
                      id: generateId('drawing'),
                      points
                    }]
                  }
                : subchapter
            )
          }
        : chapter
    )
  })),

  editChapter: (id, title) => set((state) => ({
    chapters: state.chapters.map(chapter =>
      chapter.id === id
        ? { ...chapter, title }
        : chapter
    )
  })),

  deleteChapter: (id) => set((state) => ({
    chapters: state.chapters.filter(chapter => chapter.id !== id),
    activeChapter: state.activeChapter === id ? null : state.activeChapter,
    activeSubchapter: state.chapters.find(c => c.id === id)?.subchapters.some(s => s.id === state.activeSubchapter)
      ? null
      : state.activeSubchapter
  })),

  editSubchapter: (chapterId, subchapterId, title) => set((state) => ({
    chapters: state.chapters.map(chapter =>
      chapter.id === chapterId
        ? {
            ...chapter,
            subchapters: chapter.subchapters.map(subchapter =>
              subchapter.id === subchapterId
                ? { ...subchapter, title }
                : subchapter
            )
          }
        : chapter
    )
  })),

  deleteSubchapter: (chapterId, subchapterId) => set((state) => ({
    chapters: state.chapters.map(chapter =>
      chapter.id === chapterId
        ? {
            ...chapter,
            subchapters: chapter.subchapters.filter(subchapter => subchapter.id !== subchapterId)
          }
        : chapter
    ),
    activeSubchapter: state.activeSubchapter === subchapterId ? null : state.activeSubchapter
  }))
}));