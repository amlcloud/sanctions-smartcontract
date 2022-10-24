const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ethereum", () => {
    
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  const name = "Sanctions";
  const symbol = "Flea";
  let artToken;
  let coinToken;
  let contractSanction;
  let signer;
  let user1;
  let _assetId = 0, _priceInWei = ethers.utils.parseEther("1"), _expiresAt = 1663360679;

  const metaData = {
    name: "testNFT",
    collection: "test",
    property: "property"  
  }

  describe("ArtToken", () => {
    
    before(async () => {
      const _artToken = await ethers.getContractFactory("ArtToken");
      artToken = await (await _artToken.deploy(name, symbol)).deployed();
      [signer, user1] = await ethers.getSigners();
    });

    it("Deploy", async () => {
      expect(artToken.address).to.not.equal(ZERO_ADDRESS);
    });

    it("Create NFT", async () => {
      const tx = await (await artToken.create("ipfs", JSON.stringify(metaData))).wait();
      expect(await tx.status).to.equal(1);

      const tx1 = await (await artToken.connect(signer).create("ipfs", JSON.stringify(metaData))).wait();
      expect(await tx1.status).to.equal(1);
    });

    it("should get name of ERC721 NFT", async () => {
      expect(await artToken.name()).to.equal(name);
    });

    it("should get symbol of ERC721 NFT", async () => {
      expect(await artToken.symbol()).to.equal(symbol);
    });

    it("should get token uri ", async () => {
      expect(await artToken.tokenURI(0)).to.equal("ipfs");
    });

    it("should not get token uri ", async () => {
      await expect(artToken.tokenURI(100)).to.be.reverted;
    });

    it("should get token metaData ", async () => {
      expect(await artToken.tokenMetaData(0)).to.equal(JSON.stringify(metaData));
    });

  });

  describe("Make Mockup ERC20 Token", () => {

    before(async () => {  
      const _coinToken = await ethers.getContractFactory("ERC20Mock");
      coinToken = await (await _coinToken.deploy()).deployed();
    })

    it("Deploy", async () => {
      expect(coinToken.address).to.not.equal(ZERO_ADDRESS);
    });

    it("Mint ERC20Token", async () => {
      const tx = await (await coinToken.mint(user1.address, ethers.utils.parseEther("10000"))).wait();
      expect(await tx.status).to.equal(1);
      const tx1 = await (await coinToken.mint(signer.address, ethers.utils.parseEther("10000"))).wait();
      expect(await tx1.status).to.equal(1);
    });

    it("Check Balance ERC20 of signer and user", async () => {
      expect(await coinToken.balanceOf(signer.address)).to.equal(ethers.utils.parseEther("10000"));
      expect(await coinToken.balanceOf(user1.address)).to.equal(ethers.utils.parseEther("10000"));
    });

  });

  describe("contractSanction Contract", () => {

    before(async () => {  
      const _contractSanction = await ethers.getContractFactory("contractSanction");
      contractSanction = await (await _contractSanction.deploy(coinToken.address)).deployed();
    });

    it("Deploy", async () => {
      expect(contractSanction.address).to.not.equal(ZERO_ADDRESS);
    });

    it("should success when owner call setPaused(true) and pause is false", async () => {
      const tx = await (await contractSanction.setPaused(true)).wait();
      expect(await tx.status).to.equal(1);
    });

    it("should success when owner call setPaused(false) and pause is true", async () => {
      const tx = await (await contractSanction.setPaused(false)).wait();
      expect(await tx.status).to.equal(1);
    });

    it("should revert when owner call setPaused(false) and pause is false", async () => {
      await expect(contractSanction.setPaused(false)).to.be.reverted;
    });

    it("should revert when user call setPaused", async () => {
      await expect(contractSanction.connect(user1).setPaused(false)).to.be.reverted;
    });
    
    it("should success when call createOrder with valid NFTAddress, assetID, price, expiresAt ", async () => {
      await artToken.approve(contractSanction.address, _assetId);
      const tx = await (await contractSanction.createOrder(artToken.address, _assetId, _priceInWei, _expiresAt)).wait();
      expect(await tx.status).to.equal(1);
    });

    // let _assetId = 0, _priceInWei = 1000000, _expiresAt = 1663360679;
    it("should revert when call createOrder with invalid NFTAddress, assetID, price, expiresAt ", async () => {
      await expect(contractSanction.createOrder(artToken.address, 3, _priceInWei, _expiresAt)).to.be.reverted;
    });

    it("should success when call cancelOrder with valid NFTAddress, assetID", async () => {
      const tx = await (await contractSanction.cancelOrder(artToken.address, _assetId)).wait();
      expect(await tx.status).to.equal(1);
      await artToken.approve(contractSanction.address, _assetId);
      const tx1 = await (await contractSanction.createOrder(artToken.address, _assetId, _priceInWei, _expiresAt)).wait();
      expect(await tx1.status).to.equal(1);
    });

    it("should success when call updateOrder with valid NFTAddress, assetID", async () => {
      const tx = await (await contractSanction.updateOrder(artToken.address, _assetId, 100000, _expiresAt)).wait();
      expect(await tx.status).to.equal(1);
    });

    it("should success when call Buy with valid NFTAddress, assetID, price", async () => {
      await coinToken.connect(signer).approve(contractSanction.address, _priceInWei);
      const tx = await (await contractSanction.connect(signer).Buy(artToken.address, _assetId, _priceInWei)).wait();
      expect(await tx.status).to.equal(1);

      await artToken.connect(signer).approve(contractSanction.address, 0);
      const tx1 = await (await contractSanction.connect(signer).createOrder(artToken.address, 0, _priceInWei, _expiresAt)).wait();
      expect(await tx1.status).to.equal(1);
    });

    it("should success when call safeExecuteOrder with valid NFTAddress, assetID, price", async () => {
      await coinToken.connect(user1).approve(contractSanction.address, _priceInWei);
      const tx = await (await contractSanction.connect(user1).safeExecuteOrder(artToken.address, _assetId, _priceInWei)).wait();
      expect(await tx.status).to.equal(1);

      await artToken.connect(signer).approve(contractSanction.address, 1);
      const tx1 = await (await contractSanction.connect(signer).createOrder(artToken.address, 1, _priceInWei, _expiresAt)).wait();
      expect(await tx1.status).to.equal(1);
    });

    it("should success when call PlaceBid with valid NFTAddress, assetID, price", async () => {
      await coinToken.connect(user1).approve(contractSanction.address, _priceInWei);
      const tx = await (await contractSanction.connect(user1).PlaceBid(artToken.address, 1, _priceInWei, 1663310679)).wait();
      expect(await tx.status).to.equal(1);
    });

    it("should success when call cancelBid with valid NFTAddress, assetID", async () => {
      const tx = await (await contractSanction.connect(user1).cancelBid(artToken.address, 1)).wait();
      expect(await tx.status).to.equal(1);
    });

    it("should success when call acceptBid with valid NFTAddress, assetID, price", async () => {
      await coinToken.connect(user1).approve(contractSanction.address, _priceInWei);
      const tx = await (await contractSanction.connect(user1).PlaceBid(artToken.address, 1, _priceInWei, 1663310679)).wait();

      const tx1 = await (await contractSanction.connect(signer).acceptBid(artToken.address, 1, _priceInWei)).wait();
      expect(await tx1.status).to.equal(1);
    });

  });
});
