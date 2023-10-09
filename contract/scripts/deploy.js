const main = async () => {
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  const transactions = await Transactions.deploy();
  await transactions.deployed();
  console.log("Transactions deploy to: ", transactions.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();

//0x095C237212519bb7ed76D44f066b9ce39a7Ae0d4 address deployed to
