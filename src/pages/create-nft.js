import { ethers } from "ethers";
import { useState } from "react";
import { useRouter } from "next/router";
import { create as ipfsHttpClient } from "ipfs-http-client"
import Web3Modal from "web3modal"

const projectId = "2TCoDRv717m6oLD3XNsdTo9433j";
const projectSecret = "d5169fab1fb39c9edbde84d274262792";
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const client = ipfsHttpClient({
    url: "https://ipfs.infura.io:5001/api/v0",
    headers: {
        authorization
    },
});

import {
    marketplaceAddress
  } from '../../config'
  import NftMarketPlace from "../../artifacts/contracts/NftMarketPlace.sol/NftMarketPlace.json"


export default function CreateItem() {
    const [fileUrl, setFileUrl] = useState(null)
    const [formInput, updateFormInput] = useState({name: '', price: '', description: ''})
    const router = useRouter()

    async function onChange(e) {
        /* Upload image to ipfs */
        const file = e.target.files[0]

        try {
            const added = await client.add(
                file
            )
            const url = `https://ipfs.io/ipfs/${added.path}`
            console.log(url)
            setFileUrl(url)
        }
        catch(error) {
            console.log("Error uploading file: ", error)
        }
    }

    async function uploadToIpfs() {
        const { name, description, price } = formInput
        if(!name || !description || !price || !fileUrl) return

        let data = {
            name,
            description, 
            image: fileUrl
        }
        data = JSON.stringify(data)

        try {
            const added = await client.add(data)
            const url = `https://ipfs.infura.io/ipfs/${added.path}`
            console.log(url)
            return url
        }
        catch(error) {
            console.log('Error uploading file: ', error)
        }
    }

    async function listNftForSale() {
        const url = await uploadToIpfs()

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(marketplaceAddress, NftMarketPlace.abi, signer)

        let listingPrice = await contract.getListingPrice()
        listingPrice.toString()
        const price = ethers.utils.parseUnits(formInput.price, 'ether')
        const transaction = await contract.createToken(url, price, {'value': listingPrice})
        await transaction.wait()

        router.push('/')
    }

    return (
        <div className="flex justify-center">
            <div className="w-1/2 flex flex-col pb-12">
                <input 
                placeholder="Asset Name"
                className="mt-8 border rounded p-4"
                style={{ color: '#000' }}
                onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
                />
                <textarea
                placeholder="Asset Description"
                className="mt-2 border rounded p-4"
                style={{ color: '#000' }}
                onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
                />
                <input
                placeholder="Asset Price in Eth"
                className="mt-2 border rounded p-4"
                style={{ color: '#000' }}
                onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
                />
                <input
                type="file"
                name="Asset"
                className="my-4"
                onChange={onChange}
                />
                {
                fileUrl && (
                    <img className="rounded mt-4" width="350" src={fileUrl} />
                )
                }
                <button onClick={listNftForSale} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
                Create NFT
                </button>
            </div>
        </div>
    )

}