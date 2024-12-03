// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BookDatabase{
    
    struct Book{
        string title;
        uint16 year;
    }

    address private immutable owner;

    uint256 public count;

    constructor(){
        owner = msg.sender;
    }

    uint32 private nextId = 0;
    mapping (uint32=> Book) public books;

    function addBook(Book memory newBook) public {
        nextId++;
        books[nextId] = newBook;
        count++;
    }

    function compare(string memory str1, string memory str2) private pure returns (bool) {
        bytes memory arrA = bytes(str1);
        bytes memory arrB = bytes(str2);
        return arrA.length == arrB.length && keccak256(arrA) == keccak256(arrB);
    }


    function editBook(uint32 id, Book memory newBook) public {
        Book memory oldVersion = books[id];

        if(!compare(oldVersion.title, newBook.title) && !compare(newBook.title, "")){
            books[id].title = newBook.title;
        }

        if(oldVersion.year != newBook.year && newBook.year > 0){
            books[id].year = newBook.year;
        }

    }

    function removeBook(uint32 id) public restricted{
        if(books[id].year > 0){
            delete books[id];
            count--;
        }
        
    }

    modifier restricted(){
        require(msg.sender == owner, "You don't have permission for it.");
        _;
    }

}