function Book(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

function UI(){}

UI.prototype.addBookToList = function(book){
    const list = document.getElementById('book-list');
    // create tr element
    const row = document.createElement('tr');
    // insert cols
    row.innerHTML=`
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
    `;

    list.appendChild(row);
}

UI.prototype.showAlert = function(message, className){
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    //add text
    div.appendChild(document.createTextNode(message));
    //get parent
    const container = document.querySelector('.container');
    //get form
    const form = document.getElementById('book-form');
    //insert alert
    container.insertBefore(div, form);

    //timeout after 3 seconds
    setTimeout(function(){
        document.querySelector('.alert').remove();
    }, 3000);
}

UI.prototype.deleteBook = function(target){
    if(target.className === 'delete'){
        target.parentElement.parentElement.remove();
        
        const ui = new UI();
        ui.showAlert('Book Removed!', 'success');

    }
}

UI.prototype.clearFields = function(){
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("isbn").value = "";
}

class Store{
    static addBook(book){
        const books = Store.getBook();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));

    }

    static getBook(){
        let books;

        if(localStorage.getItem('books') === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static displayBook(){
        const books = Store.getBook();

        books.forEach(function(book){
            const ui = new UI();

            ui.addBookToList(book);
        })

    }

    static deleteBook(isbn){

    const books = Store.getBook();

    books.forEach(function(book, index){
        if(book.isbn === isbn){
            books.splice(index, 1);
        }
    });

    localStorage.setItem('books', JSON.stringify(books));


    }
}

document.addEventListener('DOMContentLoaded', Store.displayBook());

document.getElementById('book-form').addEventListener('submit', function(e){

    const title = document.getElementById("title").value,
          author = document.getElementById("author").value,
          isbn = document.getElementById("isbn").value;

    // Instantiate book
    const book = new Book(title, author, isbn);

    // Instantiate UI
    const ui = new UI();


    if(title === '' || author === '' || isbn === ''){
        ui.showAlert('Please fill in all the fields', 'error');
    }
    else{
         // Add book to list
        ui.addBookToList(book);

        Store.addBook(book);

        ui.clearFields();  

        ui.showAlert('Book Added!', 'success');
    }
   
    e.preventDefault();
});

//event listener for delete

document.getElementById('book-list').addEventListener('click', function(e){

    const ui = new UI();

    ui.deleteBook(e.target);

    Store.deleteBook(e.target.parentElement.previousElementSibling.textContent);

    e.preventDefault();
});