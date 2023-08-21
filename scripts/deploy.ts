import { ethers } from "hardhat";

async function main() {
  const calcFee = await ethers.deployContract("CalcFeeLibrary");

  await calcFee.waitForDeployment();

  console.log(`deployed to ${calcFee.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
