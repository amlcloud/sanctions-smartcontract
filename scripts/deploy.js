const { ethers } = require("hardhat");

async function main() {

  const _sanctions = await ethers.getContractFactory("SanctionsContract");
  const sanctions = await _sanctions.deploy("0x9e396f24664cea9941F5b909193fa1D3488713E7");

  console.log("Sanctions Smart Contract deployed to:", sanctions.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
