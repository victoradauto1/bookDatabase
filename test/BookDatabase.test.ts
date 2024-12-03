import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre from "hardhat";
  
  describe("BookDatabase tests", function () {

    async function deployFixture() {
  
      // Contracts are deployed using the first signer/account by default
      const [owner, otherAccount] = await hre.ethers.getSigners();
  
      const BookDatabase = await hre.ethers.getContractFactory("BookDatabase");
      const bookDatabase = await BookDatabase.deploy();
  
      return { bookDatabase, owner, otherAccount };
    }
  
    it("Should Count = 0", async function () {
      const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);
      const count = await bookDatabase.count();
      expect(count).to.equal(0);
    });

    it("Should Add Book", async function () {
        const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);
        await bookDatabase.addBook({title: "new Book", year: 2024});
        const count = await bookDatabase.count();
        expect(count).to.equal(1);
      });

      it("Should Edit Book", async function () {
        const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);
        await bookDatabase.addBook({title: "new Book", year: 2024});
        await bookDatabase.editBook(1,{title: "new Book 2", year:2023});

        const book = await bookDatabase.books(1);
        expect(book.title).to.equal("new Book 2");
      });

      it("Should Remove Book", async function () {
        const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);
        await bookDatabase.addBook({title: "new Book", year: 2024});
        await bookDatabase.removeBook(1);

        const count = await bookDatabase.count();
        expect(count).to.equal(0);
      });

      it("Should NOT Remove Book", async function () {
        const { bookDatabase, owner, otherAccount } = await loadFixture(deployFixture);
        const instance =  bookDatabase.connect(otherAccount);
        await expect(instance.removeBook(1)).to.be.revertedWith("You don't have permission for it.");
      });
  });
  