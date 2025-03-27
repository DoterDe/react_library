import React, { createContext, useContext, useReducer, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const LibraryContext = createContext();

const libraryReducer = (state, action) => {
  switch (action.type) {
    case "ADD_BOOK":
      return [...state, { ...action.payload, id: uuidv4(), isAvailable: true }];
    case "REMOVE_BOOK":
      return state.filter((book) => book.id !== action.payload);
    case "EDIT_BOOK":
      return state.map((book) =>
        book.id === action.payload.id ? { ...book, ...action.payload.data } : book
      );
    case "TOGGLE_AVAILABILITY":
      return state.map((book) =>
        book.id === action.payload
          ? { ...book, isAvailable: !book.isAvailable }
          : book
      );
    default:
      return state;
  }
};

export const LibraryProvider = ({ children }) => {
  const [books, dispatch] = useReducer(libraryReducer, []);
  return (
    <LibraryContext.Provider value={{ books, dispatch }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => useContext(LibraryContext);

const Library = () => {
  const { books, dispatch } = useLibrary();
  const [search, setSearch] = useState("");
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    genre: "",
    year: "",
    pages: "",
  });

  const addBook = () => {
    if (newBook.title && newBook.author) {
      dispatch({ type: "ADD_BOOK", payload: newBook });
      setNewBook({ title: "", author: "", genre: "", year: "", pages: "" });
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.genre.toLowerCase().includes(search.toLowerCase()) ||
      book.pages.toString().includes(search)
  );

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Библиотека</h1>
      <input
        type="text"
        placeholder="Поиск книг..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <div className="mb-4">
        <input
          type="text"
          placeholder="Название"  
          value={newBook.title}
          onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          className="p-2 border rounded mr-2"
        />
        <input
          type="text"
          placeholder="Автор"
          value={newBook.author}
          onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
          className="p-2 border rounded mr-2"
        />
        <button onClick={addBook} className="bg-blue-500 text-white p-2 rounded">
          Добавить
        </button>
      </div>
      <h2 className="text-xl font-semibold">Доступные книги</h2>
      {filteredBooks.filter((b) => b.isAvailable).map((book) => (
        <div key={book.id} className="border p-2 rounded mb-2 flex justify-between">
          <span>{book.title} - {book.author}</span>
          <div>
            <button
              onClick={() => dispatch({ type: "TOGGLE_AVAILABILITY", payload: book.id })}
              className="bg-green-500 text-white px-2 py-1 rounded mr-2"
            >
              Взять
            </button>
            <button
              onClick={() => dispatch({ type: "REMOVE_BOOK", payload: book.id })}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Удалить
            </button>
          </div>
        </div>
      ))}
      <h2 className="text-xl font-semibold mt-4">Выданные книги</h2>
      {books.filter((b) => !b.isAvailable).map((book) => (
        <div key={book.id} className="border p-2 rounded mb-2 flex justify-between">
          <span>{book.title} - {book.author}</span>
          <button
            onClick={() => dispatch({ type: "TOGGLE_AVAILABILITY", payload: book.id })}
            className="bg-yellow-500 text-white px-2 py-1 rounded"
          >
            Вернуть
          </button>
        </div>
      ))}
    </div>
  );
};

const App = () => (
  <LibraryProvider>
    <Library />
  </LibraryProvider>
);

export default App;
