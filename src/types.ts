export interface Chapter {
  id: string;
  title: string;
  subchapters: Subchapter[];
}

export interface Subchapter {
  id: string;
  title: string;
  content: string;
  drawings: Drawing[];
}

export interface Drawing {
  id: string;
  points: number[][];
}

export interface NotebookState {
  chapters: Chapter[];
  activeChapter: string | null;
  activeSubchapter: string | null;
  setActiveChapter: (id: string | null) => void;
  setActiveSubchapter: (id: string | null) => void;
  addChapter: (title: string) => void;
  addSubchapter: (chapterId: string, title: string) => void;
  updateContent: (chapterId: string, subchapterId: string, content: string) => void;
  addDrawing: (chapterId: string, subchapterId: string, points: number[][]) => void;
  editChapter: (id: string, title: string) => void;
  deleteChapter: (id: string) => void;
  editSubchapter: (chapterId: string, subchapterId: string, title: string) => void;
  deleteSubchapter: (chapterId: string, subchapterId: string) => void;
}