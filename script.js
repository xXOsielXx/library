const bodyElement = document.querySelector("body");
const audioPlayer = document.querySelector("#audioPlayer");
let currentBook = null;
let index = null;

bodyElement.addEventListener("click", e => {
	// Sound buttons
	const soundClick = e.target.closest(".sound-click");

	if (soundClick) {
		audioPlayer.src = "./assets/sounds/click.wav";
		audioPlayer.play();
	}
	
	// Books
	const bookActive = e.target.closest(".book_active");
	const modal = e.target.closest(".modal");

	if (!bookActive && !modal && currentBook) {
		currentBook.classList.remove("book_active");
		currentBook.querySelector(".read-pages-book-input").tabIndex = -1;
		currentBook.querySelector(".remove-book-btn").tabIndex = -1;
	}

	const book = e.target.closest(".book");

	if (book) {
		index = book.dataset.index;
		console.log(index)
		const switchElement = e.target.closest(".switch");

		if (!switchElement && !bookActive) {
			audioPlayer.src = "./assets/sounds/drag-book.wav";
			audioPlayer.play();
			book.classList.add("book_active");
			currentBook = book;
			currentBook.querySelector(".read-pages-book-input").tabIndex = 0;
			currentBook.querySelector(".remove-book-btn").tabIndex = 0;
		}
		else if (e.target.classList.contains("read")) {
			audioPlayer.src = "./assets/sounds/toggle-switch.wav";
			audioPlayer.play();

			Library[index].read = e.target.checked;
			updateInfoPanel();
		}
	}

	const removeBookBtn = e.target.closest(".remove-book-btn");

	if (removeBookBtn) {
		audioPlayer.src = "./assets/sounds/click-trash.wav";
		audioPlayer.play();

		const removeBookModal = document.querySelector("#removeBookModal");
		removeBookModal.showModal();
	}
	else if (removeBookModal) {
		const closeRemoveBookModalBtn = e.target.closest("#closeRemoveBookModalBtn");
		const removeBookAccept = e.target.closest("#removeBookAccept");
		const removeBookCancell = e.target.closest("#removeBookCancell");

		if (closeRemoveBookModalBtn) {
			removeBookModal.close();
		}
		else if (removeBookAccept) {
			currentBook.remove();
			Library.splice(index, 1);
			bookIndex -= 1;
			updateInfoPanel();

			const books = document.querySelectorAll(".book");
			books.forEach(book => {
				if (book.dataset.index > 0) {
					book.dataset.index = book.dataset.index - 1;
				}
			})

			removeBookModal.close();
		}
		else if (removeBookCancell) {
			removeBookModal.close();
		}
	}
});

const booksList = document.querySelector("#booksList");

booksList.addEventListener("input", e => {
	const readPagesBookInput = e.target.closest(".read-pages-book-input");

	if (readPagesBookInput) {
		const index = Book.dataset.index;

		if (!e.target.validity.valid) {
			if (e.target.value > Library[index].pages) {
				e.target.value = Library[index].pages
			}
			else if (e.target.value < 0) {
				e.target.value = 0
			}
		}

		Library[index].readPages = Number(e.target.value);
		
		updateInfoPanel();
	}
})

booksList.addEventListener("keydown", e => {
	if (e.target.classList.contains("book") && 
	(e.key == " " || e.key == "Enter")) {
		const book = e.target;
		
		if (!book.classList.contains("book_active")) {
			if (currentBook) {
				currentBook.classList.remove("book_active");
				currentBook.querySelector(".read-pages-book-input").tabIndex = -1;
				currentBook.querySelector(".remove-book-btn").tabIndex = -1;
			}

			currentBook = book;
			book.classList.add("book_active");

			audioPlayer.src = "./assets/sounds/drag-book.wav";
			audioPlayer.play();

			book.querySelector(".read-pages-book-input").tabIndex = 0;
			book.querySelector(".remove-book-btn").tabIndex = 0;
		}
		else {
			book.classList.remove("book_active");
			currentBook = null;

			audioPlayer.src = "./assets/sounds/drag-book.wav";
			audioPlayer.play();

			book.querySelector(".read-pages-book-input").tabIndex = -1;
			book.querySelector(".remove-book-btn").tabIndex = -1;
		}
	}
})

const panelBtn = document.querySelector("#panelBtn");

panelBtn.addEventListener("click", e => {
	const infoPanel = document.querySelector("#infoPanel");
	panelBtn.classList.toggle("header__panel-btn_active")
	infoPanel.classList.toggle("info-panel_visible")
});

const addBookBtn = document.querySelector("#addBookBtn");
const addBookModal = document.querySelector("#addBookModal");

addBookBtn.addEventListener("click", () => {
	setTimeout(() => {
		addBookModal.showModal();
	}, 100)
});

const closeAddBookModalBtn = document.querySelector("#closeAddBookModalBtn");
closeAddBookModalBtn.addEventListener("click", () => {
	addBookModal.close();
})

const Library = [];

function Book(title, author, img, pages, readPages, read) {
	title == "" ? this.title = "UNKNOWN" : this.title = title;
	author == "" ? this.author = "UNKNOWN" : this.author = author;
	this.img = img;
	this.pages = Number(pages);
	this.readPages = Number(readPages);
	this.read = read;
};

const bookTitle = document.querySelector("#book-title");
const bookAuthor = document.querySelector("#book-author");
const bookImg = document.querySelector("#book-img");
const bookPages = document.querySelector("#book-pages");
const bookReadPages = document.querySelector("#book-read-pages");
const bookRead = document.querySelector("#book-read");

function addBookToLibrary() {
	const book = new Book(bookTitle.value, bookAuthor.value, bookImg.value, bookPages.value, bookReadPages.value, bookRead.checked);
	Library.push(book);
};

let bookIndex = 0;
function displayBooks() {
	for (bookIndex; bookIndex < Library.length; bookIndex++) {
		let book = Library[bookIndex];
		const bookElement = document.createElement("li");
		bookElement.classList.add("book");
		bookElement.tabIndex = 0;
		bookElement.dataset.index = bookIndex;
		bookElement.innerHTML = `
			<div class="book__container" tabindex="-1">
				<div class="book__img-wrapper">
					<img class="book__img" src="${book.img ? book.img : "./assets/images/new-book.jpeg"}" alt="Book Image">
				</div>
				<div class="book__info">
					<p class="book__read-status">
						<span>Read:</span> 
						<label class="switch">
							<input type="checkbox" class="read" ${book.read ? "checked" : ""} tabindex="0">
							<span class="slider round"></span>
						</label>
					</p>
					<table class="book__info-table">
						<h3>${book.title}</h3>
						<tbody>
							<tr>
								<td>Author: </td>
								<td>${book.author}</td>
							</tr>
							<tr>
								<td>Pages: </td>
								<td>${book.pages}</td>
							</tr>
							<tr>
								<td>Read pages: </td>
								<td>
									<input type="number" class="read-pages-book-input" min="0" max="${book.pages}" value="${book.readPages}" tabindex="-1"></input>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<button class="remove-book-btn" tabindex="-1">
					<i class="icon-trash"></i>
				</button>
			</div>
		`

		booksList.appendChild(bookElement);
	}
};

function checkForReadBooks() {
	let readBooks = 0;
	Library.forEach(book => {
		if (book.read) {
			readBooks++;
		}
	})
	return readBooks;
}

function checkForPages() {
	let pages = 0;
	Library.forEach(book => {
		pages += book.pages;
	})
	return pages;
}

function checkForReadPages() {
	let readPages = 0;
	Library.forEach(book => {
		readPages += book.readPages;
	})
	return readPages;
}

function updateInfoPanel() {
	const infoBooks = document.querySelector("#infoBooks td:last-child");
	infoBooks.textContent = Library.length;

	const infoReadBooks = document.querySelector("#infoReadBooks td:last-child");
	infoReadBooks.textContent = checkForReadBooks().toString();

	const infoPages = document.querySelector("#infoPages td:last-child");
	infoPages.textContent = checkForPages().toString();

	const infoReadPages = document.querySelector("#infoReadPages td:last-child");
	infoReadPages.textContent = checkForReadPages().toString();
}

addBookForm.addEventListener("input", () => {
	bookReadPages.max = bookPages.value;
})

function validateForm() {
  	if (bookTitle.validity.valid && bookAuthor.validity.valid && bookImg.validity.valid && bookPages.validity.valid && bookReadPages.validity.valid) {
		return true;
	} else {
		return false;
	}
}
  
const addBookSubmit = document.querySelector("#addBookSubmit");
addBookSubmit.addEventListener("click", () => {
	if (validateForm()) {
		addBookToLibrary();
		displayBooks();
		updateInfoPanel();
		addBookModal.close(() => {
			addBookForm.reset();
		});
	}
});