const { ethers } = require("hardhat");

async function main() {

  const _contractSanction = await ethers.getContractFactory("contractSanction");
  const contractSanction = await _contractSanction.deploy('0x6aE511444eeEDF1778397b255e3785De994ba9D1');

  console.log("Smart Contract deployed to:", contractSanction.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
