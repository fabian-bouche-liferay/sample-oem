import ballerina/http;
import ballerina/log;

type Book record {
    string externalReferenceCode;
    string title;
    string author;
};

type LiferayResponseEntity record {
    Book[] items;
    int totalCount;
};

map<Book> booksMap = {
    "book1": {externalReferenceCode: "book1", title: "The Great Gatsby", author: "F. Scott Fitzgerald"},
    "book2": {externalReferenceCode: "book2", title: "1984", author: "George Orwell"},
    "book3": {externalReferenceCode: "book3", title: "To Kill a Mockingbird", author: "Harper Lee"},
    "book4": {externalReferenceCode: "book4", title: "The Catcher in the Rye", author: "J.D. Salinger"},
    "book5": {externalReferenceCode: "book5", title: "Moby-Dick", author: "Herman Melville"},
    "book6": {externalReferenceCode: "book6", title: "War and Peace", author: "Leo Tolstoy"},
    "book7": {externalReferenceCode: "book7", title: "Hamlet", author: "William Shakespeare"},
    "book8": {externalReferenceCode: "book8", title: "Pride and Prejudice", author: "Jane Austen"},
    "book9": {externalReferenceCode: "book9", title: "The Hobbit", author: "J.R.R. Tolkien"},
    "book10": {externalReferenceCode: "book10", title: "1984", author: "George Orwell"},
    "book11": {externalReferenceCode: "book11", title: "The Divine Comedy", author: "Dante Alighieri"},
    "book12": {externalReferenceCode: "book12", title: "The Brothers Karamazov", author: "Fyodor Dostoevsky"},
    "book13": {externalReferenceCode: "book13", title: "Madame Bovary", author: "Gustave Flaubert"},
    "book14": {externalReferenceCode: "book14", title: "The Adventures of Huckleberry Finn", author: "Mark Twain"},
    "book15": {externalReferenceCode: "book15", title: "The Odyssey", author: "Homer"},
    "book16": {externalReferenceCode: "book16", title: "The Illiad", author: "Homer"},
    "book17": {externalReferenceCode: "book17", title: "Crime and Punishment", author: "Fyodor Dostoevsky"},
    "book18": {externalReferenceCode: "book18", title: "Jane Eyre", author: "Charlotte Bronte"},
    "book19": {externalReferenceCode: "book19", title: "The Tale of Genji", author: "Murasaki Shikibu"},
    "book20": {externalReferenceCode: "book20", title: "Don Quixote", author: "Miguel de Cervantes"},
    "book21": {externalReferenceCode: "book21", title: "Moby Dick", author: "Herman Melville"},
    "book22": {externalReferenceCode: "book22", title: "One Hundred Years of Solitude", author: "Gabriel Garcia Marquez"},
    "book23": {externalReferenceCode: "book23", title: "The Alchemist", author: "Paulo Coelho"},
    "book24": {externalReferenceCode: "book24", title: "Lolita", author: "Vladimir Nabokov"},
    "book25": {externalReferenceCode: "book25", title: "The Lord of the Rings", author: "J.R.R. Tolkien"},
    "book26": {externalReferenceCode: "book26", title: "The Great Gatsby", author: "F. Scott Fitzgerald"},
    "book27": {externalReferenceCode: "book27", title: "Wuthering Heights", author: "Emily Bronte"},
    "book28": {externalReferenceCode: "book28", title: "The Grapes of Wrath", author: "John Steinbeck"},
    "book29": {externalReferenceCode: "book29", title: "Brave New World", author: "Aldous Huxley"},
    "book30": {externalReferenceCode: "book30", title: "The Catcher in the Rye", author: "J.D. Salinger"},
    "book31": {externalReferenceCode: "book31", title: "Animal Farm", author: "George Orwell"}
};


service / on new http:Listener(9090) {
    resource function get book/[string objectDefinitionExternalReferenceCode](http:Request request, int page, int pageSize) returns LiferayResponseEntity|error? {
        log:printInfo("Received " + request.rawPath);
        
        Book[] booksArray = [];
        
        foreach string id in booksMap.keys() {
            booksArray.push(<Book>booksMap[id]);
        }

        int itemOffset = int:min((page - 1) * pageSize, booksArray.length());
        int itemLimit = int:min(itemOffset + pageSize, booksArray.length());

        Book[] paginatedBooks = booksArray.slice(itemOffset, itemLimit);
        
        LiferayResponseEntity responseEntity = {
            items: paginatedBooks,
            totalCount: booksArray.length()
        };
        return responseEntity;
    }

    resource function get book/[string objectDefinitionExternalReferenceCode]/[string externalReferenceCode](http:Request request) returns Book|error? {
        return booksMap[externalReferenceCode];
    }
}