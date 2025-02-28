import React, { useState, useRef, useEffect } from 'react';
import { Folder, File, Download, PenTool, Type, Save, Plus, Trash2, Menu } from 'lucide-react';

const DigitalNotebook = () => {
  // State for managing the notebook structure
  const [notebook, setNotebook] = useState({
    title: 'My Notebook',
    chapters: [
      {
        id: 'chapter-1',
        title: 'Chapter 1',
        subchapters: [
          {
            id: 'subchapter-1-1',
            title: 'Subchapter 1.1',
            notes: [{ id: 'note-1-1-1', content: 'Welcome to your digital notebook!', type: 'text' }]
          }
        ]
      }
    ]
  });
  
  // State for managing the currently active sections
  const [activeChapter, setActiveChapter] = useState('chapter-1');
  const [activeSubchapter, setActiveSubchapter] = useState('subchapter-1-1');
  const [activeNote, setActiveNote] = useState('note-1-1-1');
  
  // State for managing editing mode
  const [editMode, setEditMode] = useState('text'); // 'text' or 'drawing'
  const [noteContent, setNoteContent] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // Canvas refs and state
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasContext, setCanvasContext] = useState(null);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  
  // Initialize or update note content when active note changes
  useEffect(() => {
    const chapter = notebook.chapters.find(c => c.id === activeChapter);
    if (!chapter) return;
    
    const subchapter = chapter.subchapters.find(s => s.id === activeSubchapter);
    if (!subchapter) return;
    
    const note = subchapter.notes.find(n => n.id === activeNote);
    if (!note) return;
    
    setNoteContent(note.content || '');
    
    // Setup canvas if in drawing mode
    if (editMode === 'drawing' && note.type === 'drawing') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        setCanvasContext(ctx);
        
        // Load saved drawing if it exists
        if (note.content) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          };
          img.src = note.content;
        }
      }
    }
  }, [activeChapter, activeSubchapter, activeNote, notebook, editMode]);
  
  // Add a new chapter
  const addChapter = () => {
    const newChapterId = `chapter-${notebook.chapters.length + 1}`;
    const newSubchapterId = `subchapter-${notebook.chapters.length + 1}-1`;
    const newNoteId = `note-${notebook.chapters.length + 1}-1-1`;
    
    setNotebook(prev => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        {
          id: newChapterId,
          title: `Chapter ${notebook.chapters.length + 1}`,
          subchapters: [
            {
              id: newSubchapterId,
              title: `Subchapter ${notebook.chapters.length + 1}.1`,
              notes: [{ id: newNoteId, content: '', type: 'text' }]
            }
          ]
        }
      ]
    }));
    
    setActiveChapter(newChapterId);
    setActiveSubchapter(newSubchapterId);
    setActiveNote(newNoteId);
  };
  
  // Add a new subchapter to the active chapter
  const addSubchapter = () => {
    setNotebook(prev => {
      const chapterIndex = prev.chapters.findIndex(c => c.id === activeChapter);
      if (chapterIndex === -1) return prev;
      
      const chapter = prev.chapters[chapterIndex];
      const newSubchapterId = `subchapter-${chapterIndex + 1}-${chapter.subchapters.length + 1}`;
      const newNoteId = `note-${chapterIndex + 1}-${chapter.subchapters.length + 1}-1`;
      
      const updatedChapters = [...prev.chapters];
      updatedChapters[chapterIndex] = {
        ...chapter,
        subchapters: [
          ...chapter.subchapters,
          {
            id: newSubchapterId,
            title: `Subchapter ${chapterIndex + 1}.${chapter.subchapters.length + 1}`,
            notes: [{ id: newNoteId, content: '', type: 'text' }]
          }
        ]
      };
      
      return {
        ...prev,
        chapters: updatedChapters
      };
    });
    
    // Set the new subchapter as active
    const chapterIndex = notebook.chapters.findIndex(c => c.id === activeChapter);
    if (chapterIndex !== -1) {
      const chapter = notebook.chapters[chapterIndex];
      const newSubchapterId = `subchapter-${chapterIndex + 1}-${chapter.subchapters.length + 1}`;
      const newNoteId = `note-${chapterIndex + 1}-${chapter.subchapters.length + 1}-1`;
      
      setActiveSubchapter(newSubchapterId);
      setActiveNote(newNoteId);
    }
  };
  
  // Add a new note to the active subchapter
  const addNote = (type = 'text') => {
    setNotebook(prev => {
      const chapterIndex = prev.chapters.findIndex(c => c.id === activeChapter);
      if (chapterIndex === -1) return prev;
      
      const chapter = prev.chapters[chapterIndex];
      const subchapterIndex = chapter.subchapters.findIndex(s => s.id === activeSubchapter);
      if (subchapterIndex === -1) return prev;
      
      const subchapter = chapter.subchapters[subchapterIndex];
      const newNoteId = `note-${chapterIndex + 1}-${subchapterIndex + 1}-${subchapter.notes.length + 1}`;
      
      const updatedChapters = [...prev.chapters];
      updatedChapters[chapterIndex].subchapters[subchapterIndex] = {
        ...subchapter,
        notes: [
          ...subchapter.notes,
          { id: newNoteId, content: '', type }
        ]
      };
      
      return {
        ...prev,
        chapters: updatedChapters
      };
    });
    
    // Set the new note as active
    const chapterIndex = notebook.chapters.findIndex(c => c.id === activeChapter);
    if (chapterIndex !== -1) {
      const chapter = notebook.chapters[chapterIndex];
      const subchapterIndex = chapter.subchapters.findIndex(s => s.id === activeSubchapter);
      if (subchapterIndex !== -1) {
        const subchapter = chapter.subchapters[subchapterIndex];
        const newNoteId = `note-${chapterIndex + 1}-${subchapterIndex + 1}-${subchapter.notes.length + 1}`;
        
        setActiveNote(newNoteId);
        setEditMode(type);
      }
    }
  };
  
  // Handle note content change
  const handleNoteChange = (e) => {
    const content = e.target.value;
    setNoteContent(content);
    
    saveCurrentNote(content);
  };
  
  // Save the current note
  const saveCurrentNote = (content = noteContent) => {
    setNotebook(prev => {
      const chapterIndex = prev.chapters.findIndex(c => c.id === activeChapter);
      if (chapterIndex === -1) return prev;
      
      const chapter = prev.chapters[chapterIndex];
      const subchapterIndex = chapter.subchapters.findIndex(s => s.id === activeSubchapter);
      if (subchapterIndex === -1) return prev;
      
      const subchapter = chapter.subchapters[subchapterIndex];
      const noteIndex = subchapter.notes.findIndex(n => n.id === activeNote);
      if (noteIndex === -1) return prev;
      
      const updatedChapters = [...prev.chapters];
      updatedChapters[chapterIndex].subchapters[subchapterIndex].notes[noteIndex] = {
        ...subchapter.notes[noteIndex],
        content
      };
      
      return {
        ...prev,
        chapters: updatedChapters
      };
    });
  };
  
  // Handle canvas drawing functions
  const startDrawing = (e) => {
    if (!canvasContext) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    canvasContext.beginPath();
    canvasContext.moveTo(x, y);
    setLastPosition({ x, y });
    setIsDrawing(true);
  };
  
  const draw = (e) => {
    if (!isDrawing || !canvasContext) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    canvasContext.lineWidth = 2;
    canvasContext.lineCap = 'round';
    canvasContext.strokeStyle = '#000';
    
    canvasContext.lineTo(x, y);
    canvasContext.stroke();
    
    setLastPosition({ x, y });
  };
  
  const endDrawing = () => {
    if (!isDrawing || !canvasContext) return;
    
    canvasContext.closePath();
    setIsDrawing(false);
    
    // Save the drawing as a data URL
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL();
      saveCurrentNote(dataUrl);
    }
  };
  
  // Export notebook as PDF
  const exportToPDF = () => {
    alert('Exporting to PDF functionality would be implemented here.');
    // In a real implementation, this would create a PDF from the notebook content
  };
  
  // Rename an item
  const renameItem = (type, id, newTitle) => {
    setNotebook(prev => {
      if (type === 'notebook') {
        return { ...prev, title: newTitle };
      } else if (type === 'chapter') {
        const updatedChapters = prev.chapters.map(chapter => 
          chapter.id === id ? { ...chapter, title: newTitle } : chapter
        );
        return { ...prev, chapters: updatedChapters };
      } else if (type === 'subchapter') {
        const updatedChapters = prev.chapters.map(chapter => {
          const updatedSubchapters = chapter.subchapters.map(subchapter => 
            subchapter.id === id ? { ...subchapter, title: newTitle } : subchapter
          );
          return { ...chapter, subchapters: updatedSubchapters };
        });
        return { ...prev, chapters: updatedChapters };
      }
      return prev;
    });
  };
  
  // Delete an item
  const deleteItem = (type, id) => {
    if (type === 'chapter') {
      setNotebook(prev => ({
        ...prev,
        chapters: prev.chapters.filter(chapter => chapter.id !== id)
      }));
      
      // Set the first chapter as active if the active chapter was deleted
      if (activeChapter === id && notebook.chapters.length > 1) {
        const firstChapter = notebook.chapters.find(c => c.id !== id);
        if (firstChapter) {
          setActiveChapter(firstChapter.id);
          const firstSubchapter = firstChapter.subchapters[0];
          if (firstSubchapter) {
            setActiveSubchapter(firstSubchapter.id);
            const firstNote = firstSubchapter.notes[0];
            if (firstNote) {
              setActiveNote(firstNote.id);
            }
          }
        }
      }
    } else if (type === 'subchapter') {
      setNotebook(prev => {
        const updatedChapters = prev.chapters.map(chapter => ({
          ...chapter,
          subchapters: chapter.subchapters.filter(subchapter => subchapter.id !== id)
        }));
        return { ...prev, chapters: updatedChapters };
      });
      
      // Set the first subchapter as active if the active subchapter was deleted
      const chapter = notebook.chapters.find(c => c.id === activeChapter);
      if (chapter && activeSubchapter === id && chapter.subchapters.length > 1) {
        const firstSubchapter = chapter.subchapters.find(s => s.id !== id);
        if (firstSubchapter) {
          setActiveSubchapter(firstSubchapter.id);
          const firstNote = firstSubchapter.notes[0];
          if (firstNote) {
            setActiveNote(firstNote.id);
          }
        }
      }
    } else if (type === 'note') {
      setNotebook(prev => {
        const updatedChapters = prev.chapters.map(chapter => ({
          ...chapter,
          subchapters: chapter.subchapters.map(subchapter => ({
            ...subchapter,
            notes: subchapter.notes.filter(note => note.id !== id)
          }))
        }));
        return { ...prev, chapters: updatedChapters };
      });
      
      // Set the first note as active if the active note was deleted
      const chapter = notebook.chapters.find(c => c.id === activeChapter);
      if (chapter) {
        const subchapter = chapter.subchapters.find(s => s.id === activeSubchapter);
        if (subchapter && activeNote === id && subchapter.notes.length > 1) {
          const firstNote = subchapter.notes.find(n => n.id !== id);
          if (firstNote) {
            setActiveNote(firstNote.id);
          }
        }
      }
    }
  };
  
  // Get the active note
  const getActiveNote = () => {
    const chapter = notebook.chapters.find(c => c.id === activeChapter);
    if (!chapter) return null;
    
    const subchapter = chapter.subchapters.find(s => s.id === activeSubchapter);
    if (!subchapter) return null;
    
    return subchapter.notes.find(n => n.id === activeNote) || null;
  };
  
  const activeNoteObj = getActiveNote();
  
  // Render the mind map
  const renderMindMap = () => {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-auto">
        <h3 className="text-lg font-semibold mb-4 text-center">Mind Map</h3>
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <div className="bg-blue-500 text-white p-2 rounded-lg mb-2 font-medium">
              {notebook.title}
            </div>
            <div className="w-1 h-4 bg-gray-300"></div>
            <div className="flex flex-wrap justify-center gap-8 mt-2">
              {notebook.chapters.map((chapter) => (
                <div key={chapter.id} className="flex flex-col items-center max-w-xs">
                  <div 
                    className={`p-2 rounded-lg mb-2 font-medium cursor-pointer ${
                      activeChapter === chapter.id ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'
                    }`}
                    onClick={() => setActiveChapter(chapter.id)}
                  >
                    {chapter.title}
                  </div>
                  <div className="w-1 h-4 bg-gray-300"></div>
                  <div className="flex flex-wrap justify-center gap-4 mt-2">
                    {chapter.subchapters.map((subchapter) => (
                      <div key={subchapter.id} className="flex flex-col items-center">
                        <div 
                          className={`p-2 rounded-lg mb-2 text-sm cursor-pointer ${
                            activeSubchapter === subchapter.id ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-800'
                          }`}
                          onClick={() => {
                            setActiveChapter(chapter.id);
                            setActiveSubchapter(subchapter.id);
                            if (subchapter.notes.length > 0) {
                              setActiveNote(subchapter.notes[0].id);
                            }
                          }}
                        >
                          {subchapter.title}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div className={`border-r border-gray-200 ${isSidebarOpen ? 'w-64' : 'w-12'} transition-all duration-300 bg-gray-50 flex flex-col`}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {isSidebarOpen ? (
            <h2 className="font-bold text-lg">{notebook.title}</h2>
          ) : null}
          <button 
            className="p-1 rounded hover:bg-gray-200"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
          >
            <Menu size={18} />
          </button>
        </div>
        
        {isSidebarOpen && (
          <div className="overflow-y-auto flex-grow">
            <div className="p-2">
              <button 
                className="w-full flex items-center gap-2 p-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 mb-2"
                onClick={addChapter}
              >
                <Plus size={16} />
                New Chapter
              </button>
            </div>
            
            <div>
              {notebook.chapters.map((chapter) => (
                <div key={chapter.id} className="mb-2">
                  <div 
                    className={`flex items-center gap-2 p-2 cursor-pointer ${
                      activeChapter === chapter.id ? 'bg-blue-50' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveChapter(chapter.id)}
                  >
                    <Folder size={16} className="text-blue-500" />
                    <span className="flex-grow truncate">{chapter.title}</span>
                    <button 
                      className="p-1 rounded hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        const newTitle = prompt('Enter new chapter name:', chapter.title);
                        if (newTitle) renameItem('chapter', chapter.id, newTitle);
                      }}
                    >
                      <Type size={14} />
                    </button>
                    <button 
                      className="p-1 rounded hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this chapter?')) {
                          deleteItem('chapter', chapter.id);
                        }
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  {/* Subchapters */}
                  {activeChapter === chapter.id && (
                    <div className="ml-6">
                      <button 
                        className="w-full flex items-center gap-2 p-2 bg-green-50 text-green-800 rounded hover:bg-green-100 mb-1 mt-1"
                        onClick={addSubchapter}
                      >
                        <Plus size={14} />
                        New Subchapter
                      </button>
                      
                      {chapter.subchapters.map((subchapter) => (
                        <div key={subchapter.id}>
                          <div 
                            className={`flex items-center gap-2 p-2 cursor-pointer ${
                              activeSubchapter === subchapter.id ? 'bg-green-50' : 'hover:bg-gray-100'
                            }`}
                            onClick={() => {
                              setActiveSubchapter(subchapter.id);
                              if (subchapter.notes.length > 0) {
                                setActiveNote(subchapter.notes[0].id);
                              }
                            }}
                          >
                            <File size={14} className="text-green-500" />
                            <span className="flex-grow truncate">{subchapter.title}</span>
                            <button 
                              className="p-1 rounded hover:bg-gray-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                const newTitle = prompt('Enter new subchapter name:', subchapter.title);
                                if (newTitle) renameItem('subchapter', subchapter.id, newTitle);
                              }}
                            >
                              <Type size={12} />
                            </button>
                            <button 
                              className="p-1 rounded hover:bg-gray-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Delete this subchapter?')) {
                                  deleteItem('subchapter', subchapter.id);
                                }
                              }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          
                          {/* Notes */}
                          {activeSubchapter === subchapter.id && (
                            <div className="ml-4">
                              {subchapter.notes.map((note) => (
                                <div 
                                  key={note.id}
                                  className={`flex items-center gap-2 p-1 pl-2 text-sm cursor-pointer ${
                                    activeNote === note.id ? 'bg-gray-200' : 'hover:bg-gray-100'
                                  }`}
                                  onClick={() => {
                                    setActiveNote(note.id);
                                    setEditMode(note.type);
                                  }}
                                >
                                  {note.type === 'text' ? (
                                    <Type size={12} className="text-gray-500" />
                                  ) : (
                                    <PenTool size={12} className="text-purple-500" />
                                  )}
                                  <span className="flex-grow truncate">
                                    {note.content ? `Note ${subchapter.notes.indexOf(note) + 1}` : 'Empty note'}
                                  </span>
                                  <button 
                                    className="p-1 rounded hover:bg-gray-300"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (confirm('Delete this note?')) {
                                        deleteItem('note', note.id);
                                      }
                                    }}
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                </div>
                              ))}
                              
                              <div className="flex gap-1 mt-1">
                                <button 
                                  className="flex-1 flex items-center justify-center gap-1 p-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                                  onClick={() => addNote('text')}
                                >
                                  <Type size={12} />
                                  <span className="text-xs">Text</span>
                                </button>
                                <button 
                                  className="flex-1 flex items-center justify-center gap-1 p-1 bg-purple-50 text-purple-800 rounded hover:bg-purple-100"
                                  onClick={() => addNote('drawing')}
                                >
                                  <PenTool size={12} />
                                  <span className="text-xs">Draw</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {isSidebarOpen && (
          <div className="p-2 border-t border-gray-200">
            <button 
              className="w-full flex items-center justify-center gap-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={exportToPDF}
            >
              <Download size={16} />
              Export as PDF
            </button>
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="flex-grow flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm">
          <div className="flex items-center">
            <h1 className="font-bold text-xl">{notebook.title}</h1>
            <span className="mx-2 text-gray-400">›</span>
            {activeChapter && (
              <span className="font-medium">
                {notebook.chapters.find(c => c.id === activeChapter)?.title}
              </span>
            )}
            {activeSubchapter && (
              <>
                <span className="mx-2 text-gray-400">›</span>
                <span>
                  {notebook.chapters.find(c => c.id === activeChapter)?.subchapters.find(s => s.id === activeSubchapter)?.title}
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              className={`p-2 rounded ${editMode === 'text' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
              onClick={() => {
                if (activeNoteObj && activeNoteObj.type !== 'text') {
                  addNote('text');
                } else {
                  setEditMode('text');
                }
              }}
            >
              <Type size={18} />
            </button>
            <button 
              className={`p-2 rounded ${editMode === 'drawing' ? 'bg-purple-100 text-purple-800' : 'hover:bg-gray-100'}`}
              onClick={() => {
                if (activeNoteObj && activeNoteObj.type !== 'drawing') {
                  addNote('drawing');
                } else {
                  setEditMode('drawing');
                }
              }}
            >
              <PenTool size={18} />
            </button>
            <button 
              className="p-2 rounded hover:bg-gray-100"
              onClick={() => saveCurrentNote()}
            >
              <Save size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex-grow overflow-auto flex flex-col">
          {/* Note editor */}
          <div className="flex-grow p-4">
            {activeNoteObj ? (
              <>
                {editMode === 'text' && activeNoteObj.type === 'text' ? (
                  <textarea
                    className="w-full h-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    value={noteContent}
                    onChange={handleNoteChange}
                    placeholder="Type your notes here..."
                  />
                ) : editMode === 'drawing' && activeNoteObj.type === 'drawing' ? (
                  <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <canvas
                      ref={canvasRef}
                      width={800}
                      height={600}
                      className="w-full h-full cursor-crosshair"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={endDrawing}
                      onMouseLeave={endDrawing}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      This note is a {activeNoteObj.type} note. 
                      Click the {activeNoteObj.type === 'text' ? <Type size={16} className="inline" /> : <PenTool size={16} className="inline" />} 
                      button above to edit it.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No note selected.</p>
              </div>
            )}
          </div>
          
          {/* Mind map */}
          <div className="p-4 border-t border-gray-200">
            {renderMindMap()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalNotebook;