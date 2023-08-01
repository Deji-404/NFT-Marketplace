const hre = require("hardhat")
const fs = require('fs');
require("@nomiclabs/hardhat-etherscan"); 

async function main() {
    const chainId = hre.network.config.chainId;

    const NftMarketPlace = await hre.ethers.getContractFactory("NftMarketPlace")
    const nftMarketPlace = await NftMarketPlace.deploy()

    const args = []

    await nftMarketPlace.deployed();
    console.log("nftMarketplace deployed to:", nftMarketPlace.address);

    fs.writeFileSync('./config.js', `
        export const marketplaceAddress = "${nftMarketPlace.address}"
    `)

    console.log(`Waiting for blocks confirmations...`);
    await nftMarketPlace.deployTransaction.wait(6);
    console.log(`Confirmed!`);

    // * only verify on testnets or mainnets.
    if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
        await verify(nftMarketPlace.address, args);
    }

}

const verify = async (contractAddress, args) => {
    console.log("Verifying contract...");
    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!");
        } else {
            console.log(e);
        }
    }
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});