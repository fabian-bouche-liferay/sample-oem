/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import express from 'express';

const booksMap = new Map([

    ["book1" , {externalReferenceCode: "book1", title: "The Great Gatsby", author: "F. Scott Fitzgerald"}],
    ["book2" , {externalReferenceCode: "book2", title: "1984", author: "George Orwell"}],
    ["book3" , {externalReferenceCode: "book3", title: "To Kill a Mockingbird", author: "Harper Lee"}],
    ["book4" , {externalReferenceCode: "book4", title: "The Catcher in the Rye", author: "J.D. Salinger"}],
    ["book5" , {externalReferenceCode: "book5", title: "Moby-Dick", author: "Herman Melville"}],
    ["book6" , {externalReferenceCode: "book6", title: "War and Peace", author: "Leo Tolstoy"}],
    ["book7" , {externalReferenceCode: "book7", title: "Hamlet", author: "William Shakespeare"}],
    ["book8" , {externalReferenceCode: "book8", title: "Pride and Prejudice", author: "Jane Austen"}],
    ["book9" , {externalReferenceCode: "book9", title: "The Hobbit", author: "J.R.R. Tolkien"}],
    ["book10", {externalReferenceCode: "book10", title: "1984", author: "George Orwell"}],
    ["book11", {externalReferenceCode: "book11", title: "The Divine Comedy", author: "Dante Alighieri"}],
    ["book12", {externalReferenceCode: "book12", title: "The Brothers Karamazov", author: "Fyodor Dostoevsky"}],
    ["book13", {externalReferenceCode: "book13", title: "Madame Bovary", author: "Gustave Flaubert"}],
    ["book14", {externalReferenceCode: "book14", title: "The Adventures of Huckleberry Finn", author: "Mark Twain"}],
    ["book15", {externalReferenceCode: "book15", title: "The Odyssey", author: "Homer"}],
    ["book16", {externalReferenceCode: "book16", title: "The Illiad", author: "Homer"}],
    ["book17", {externalReferenceCode: "book17", title: "Crime and Punishment", author: "Fyodor Dostoevsky"}],
    ["book18", {externalReferenceCode: "book18", title: "Jane Eyre", author: "Charlotte Bronte"}],
    ["book19", {externalReferenceCode: "book19", title: "The Tale of Genji", author: "Murasaki Shikibu"}],
    ["book20", {externalReferenceCode: "book20", title: "Don Quixote", author: "Miguel de Cervantes"}],
    ["book21", {externalReferenceCode: "book21", title: "Moby Dick", author: "Herman Melville"}],
    ["book22", {externalReferenceCode: "book22", title: "One Hundred Years of Solitude", author: "Gabriel Garcia Marquez"}],
    ["book23", {externalReferenceCode: "book23", title: "The Alchemist", author: "Paulo Coelho"}],
    ["book24", {externalReferenceCode: "book24", title: "Lolita", author: "Vladimir Nabokov"}],
    ["book25", {externalReferenceCode: "book25", title: "The Lord of the Rings", author: "J.R.R. Tolkien"}],
    ["book26", {externalReferenceCode: "book26", title: "The Great Gatsby", author: "F. Scott Fitzgerald"}],
    ["book27", {externalReferenceCode: "book27", title: "Wuthering Heights", author: "Emily Bronte"}],
    ["book28", {externalReferenceCode: "book28", title: "The Grapes of Wrath", author: "John Steinbeck"}],
    ["book29", {externalReferenceCode: "book29", title: "Brave New World", author: "Aldous Huxley"}],
    ["book30", {externalReferenceCode: "book30", title: "The Catcher in the Rye", author: "J.D. Salinger"}],
    ["book31", {externalReferenceCode: "book31", title: "Animal Farm", author: "George Orwell"}]

]);


const getSampleBooks = async (pageIndex, limit) => {

    const startIndex = limit * pageIndex;

    let allBooks = Array.from(booksMap.values());

    let books;
    
    if(startIndex > allBooks.length) {
        console.log("Case 1");
        books = [];
    } else {
        const endIndex = Math.min(limit * (pageIndex + 1), allBooks.length);
        console.log("Case 2 " + startIndex + " " + endIndex);
        books = allBooks.slice(startIndex, endIndex);
        console.log(books);
    }

    return new Promise((resolve) => {
        setTimeout(() => resolve(books), 20);
    });

}

const getSampleBook = async (erc) => {

    return new Promise((resolve) => {
        setTimeout(() => resolve(booksMap.get(erc)), 10);
    });

}

const router = express.Router();

router.get('/',async(req,res)=>{
    res.send('READY');
});

router.get('/:objectDefinitionExternalReferenceCode',async(req, res)=>{
    const { companyId, languageId, scopeKey, userId, page, pageSize} = req.query;

    let result = await getSampleBooks(page - 1, pageSize);
    let resultPage = {
        items: result,
        page: page,
        totalCount: Array.from(booksMap.values()).length,
        pageSize: pageSize
    }
    res.status(200).json(resultPage);
});

router.get('/:objectDefinitionExternalReferenceCode/:externalReferenceCode',async(req, res)=>{
    const { companyId, languageId, scopeKey, userId, page, pageSize } = req.query;

    let externalReferenceCode = req.params.externalReferenceCode;
    let postData = await getSampleBook(externalReferenceCode);
    res.status(200).json(postData);
});

export default router;