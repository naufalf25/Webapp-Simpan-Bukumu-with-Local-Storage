const books = [];
const RENDER_EVENT = 'render-finishbook';
const search = [];

document.addEventListener('DOMContentLoaded', function () {
    const finishSubmit = document.getElementById('finished-submit');
    const unfinsihSubmit = document.getElementById('unfinished-submit');
    const searchSubmit = document.getElementById('searchSubmit');

    if (isStorageExist()) {
        loadDataFromStorage();
    }

    finishSubmit.addEventListener('click', function(event) {
        event.preventDefault();
        addFinishedBook();

        document.getElementById('book-title').value = null;
        document.getElementById('writer-name').value = null;
        document.getElementById('year').value = null;
    });

    unfinsihSubmit.addEventListener('click', function(event) {
        event.preventDefault();
        addUnfinishedBook();

        document.getElementById('book-title').value = null;
        document.getElementById('writer-name').value = null;
        document.getElementById('year').value = null;
    });

    searchSubmit.addEventListener('click', function(event) {
        event.preventDefault();
        addSearchResult();
    });
});

function addFinishedBook() {
    const bookTitle = document.getElementById('book-title').value;
    const writeName = document.getElementById('writer-name').value;
    const yearBook = document.getElementById('year').value;

    if (bookTitle < 1 && writeName < 1 && yearBook < 1) {
        alert('Lengkapilah form terlebih dahulu!');
    } else {
        const generatedID = generateId();
        const finishedObject = generateBookObject(generatedID, bookTitle, writeName, yearBook, true);
        books.push(finishedObject);
        
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}

function addUnfinishedBook() {
    const bookTitle = document.getElementById('book-title').value;
    const writeName = document.getElementById('writer-name').value;
    const yearBook = document.getElementById('year').value;

    if (bookTitle < 1 && writeName < 1 && yearBook < 1) {
        alert('Lengkapilah form terlebih dahulu!');
    } else {
        const generatedID = generateId();
        const unfinishedObject = generateBookObject(generatedID, bookTitle, writeName, yearBook, false);
        books.push(unfinishedObject);
        
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function() {
    const unfinishedBookList = document.getElementById('books');
    unfinishedBookList.innerHTML = '';

    const finishedBookList = document.getElementById('finished-books');
    finishedBookList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            unfinishedBookList.append(bookElement);
        } else {
            finishedBookList.append(bookElement);
        }
    }
});

function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = 'Penulis: ' + bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = 'Tahun: ' + bookObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('buku');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('article');
    container.classList.add('item-buku');
    container.append(textContainer);
    container.setAttribute('id', 'book-${bookObject.id}');

    if (!bookObject.isCompleted) {
        const unfinishedButton = document.createElement('button');
        unfinishedButton.classList.add('green');
        unfinishedButton.innerText = 'Tandai Telah Selesai Dibaca'

        unfinishedButton.addEventListener('click', function() {
            moveBookToFinished(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus Buku';

        trashButton.addEventListener('click', function() {
            removeBookFromList(bookObject.id);
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('action');
        actionButton.append(unfinishedButton, trashButton);

        container.append(actionButton);
    } else {
        const finishedButton = document.createElement('button');
        finishedButton.classList.add('green');
        finishedButton.innerText = 'Tandai Belum Selesai Dibaca'

        finishedButton.addEventListener('click', function() {
            moveBookToUnfinished(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus Buku';

        trashButton.addEventListener('click', function() {
            removeBookFromList(bookObject.id);
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('action');
        actionButton.append(finishedButton, trashButton);

        container.append(actionButton);
    }

    return container;
}

function moveBookToUnfinished(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function moveBookToFinished(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function removeBookFromList(bookId) {
    if (confirm('Anda yakin ingin menghapus buku ini ?') == true) {
        const bookTarget = findBookIndex(bookId);

        if (bookTarget === -1) return;

        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
    } else {
        return null;
    }
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function addSearchResult() {
    search.pop();
    const searchBookTitle = document.getElementById('bookTitleSearch');
    
    if (searchBookTitle.value.length >= 1) {
        const resultTitle = document.getElementById('resultTitle');
        resultTitle.removeAttribute('hidden');

        const searchTitle = searchBookTitle.value;
        const bookSearch = generateTitle(searchTitle);
        search.push(bookSearch);

        searchResult(searchTitle);
        document.getElementById('bookTitleSearch').value = null;
    } else {
        alert('Isilah kolom pencarian terlebih dahulu!');
    }
}

function generateTitle(title) {
    return {title};
}

function searchResult(searchItem) {
    const resultElement = document.getElementById('searchResult');

    const result = books.filter(function(currentElement) {
        if (!currentElement.title === searchItem) {
            alert('Maaf judul yang Anda cari tidak ditemukan');
            return null;
        } else {
            return currentElement.title === searchItem;
        }
    });
    
    for (const resultItem of result) {
        const resultedElement = makeResult(resultItem);
        if (resultElement.childNodes.length > 0) {
            resultElement.innerHTML = '';
        }
        resultElement.append(resultedElement);
    }
}

function makeResult(resultObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = resultObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = 'Penulis: ' + resultObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = 'Tahun: ' + resultObject.year;

    const textContainer = document.createElement('div');
    textContainer.classList.add('buku');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('article');
    container.classList.add('item-buku');
    container.append(textContainer);
    container.setAttribute('id', 'result-${resultObject.id}');

    if (!resultObject.isCompleted) {
        const unfinishedButton = document.createElement('button');
        unfinishedButton.classList.add('green');
        unfinishedButton.innerText = 'Tandai Telah Selesai Dibaca'

        unfinishedButton.addEventListener('click', function() {
            moveBookToFinished(resultObject.id);
            emptyElement();
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus Buku';

        trashButton.addEventListener('click', function() {
            removeBookFromList(resultObject.id);
            emptyElement();
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('action');
        actionButton.append(unfinishedButton, trashButton);

        container.append(actionButton);
    } else {
        const finishedButton = document.createElement('button');
        finishedButton.classList.add('green');
        finishedButton.innerText = 'Tandai Belum Selesai Dibaca'

        finishedButton.addEventListener('click', function() {
            moveBookToUnfinished(resultObject.id);
            emptyElement();
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus Buku';

        trashButton.addEventListener('click', function() {
            removeBookFromList(resultObject.id);
            emptyElement();
        });

        const actionButton = document.createElement('div');
        actionButton.classList.add('action');
        actionButton.append(finishedButton, trashButton);

        container.append(actionButton);
    }

    return container;
}

function emptyElement() {
    const resultElement = document.getElementById('searchResult');
    resultElement.innerHTML = '';
}

const SAVED_EVENT = 'saved_book';
const STORAGE_KEY = 'BOOK_APPS';

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const buku of data) {
            books.push(buku);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}