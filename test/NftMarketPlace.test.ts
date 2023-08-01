const hre = require("hardhat");
const ethers = require("ethers")

describe("nftMarketPlace", () => {
    it("Should create and execute market sales", async () => {

        const NftMarketPlace = await hre.ethers.getContractFactory("NftMarketPlace")
        const nftMarketPlace = await NftMarketPlace.deploy()
        
        let listingPrice = await nftMarketPlace.getListingPrice();
        listingPrice = listingPrice.toString();

        const auctionPrice = hre.ethers.utils.parseUnits('1', 'ether');

        await nftMarketPlace.createToken("https://tokenlocation.com", auctionPrice, {'value': listingPrice});
        await nftMarketPlace.createToken("https://tokenlocation2.com", auctionPrice, {'value': listingPrice});

        const [_, buyerAddress] = await hre.ethers.getSigners();

        await nftMarketPlace.connect(buyerAddress).createMarketSale(1, {'value': auctionPrice});
        await nftMarketPlace.connect(buyerAddress).resellToken(1, auctionPrice, {'value': listingPrice});

        let items = await nftMarketPlace.fetchMarketItems();
        items = await Promise.all(items.map(async (i) => {
            const tokenUri = await nftMarketPlace.tokenURI(i.tokenId);
            let item = {
                price: i.price.toString(),
                tokenId: i.tokenId.toString(),
                seller: i.seller,
                owner: i.owner,
                tokenUri
            }
            return item
        }))
        console.log("items: ", items)
    })
})