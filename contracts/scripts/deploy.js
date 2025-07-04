// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const EduChain = await hre.ethers.getContractFactory("EduChain");
  const eduChain = await EduChain.deploy();
  await eduChain.waitForDeployment(); // 👈 Correct for ethers v6
  console.log("EduChain deployed to:", eduChain.target); // ethers v6 uses `target` instead of `address`
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
