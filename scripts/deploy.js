const { ethers } = require("hardhat");

async function main() {

  const _artToken = await ethers.getContractFactory("ArtToken");
  const artToken = await _artToken.deploy("Sanctions","Flea");

  console.log("Art ERC721 Smart Contract deployed to:", artToken.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
