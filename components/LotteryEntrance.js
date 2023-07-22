import { useWeb3Contract } from "react-moralis"
import { abi, contractAddesses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    console.log(parseInt(chainIdHex))
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddesses ? contractAddesses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWimmer, setRecentWinner] = useState("0")
    const dispatch = useNotification()
    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })
    const { runContractFunction: getNumPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })
    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNotification(tx)
    }
    const handleNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }
    async function updateUi() {
        await setNumPlayers((await getNumPlayers()).toString())
        await setEntranceFee((await getEntranceFee()).toString())
        await setRecentWinner((await getRecentWinner()).toString())
        console.log(entranceFee)
    }
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi()
        }
    }, [isWeb3Enabled])
    return (
        <div>
            <div>Hi from Lottery Entrance</div>
            {raffleAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hovering-blue-700 text-white font-bold py-3 px-3 rounded ml-auto"
                        onClick={async () => {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                    >
                        Enter Raffle
                    </button>
                    <div>
                        Entrance Fee:{ethers.utils.formatEther(entranceFee)}
                        Number of Players : {numPlayers}
                        Recent Winner:{recentWimmer}
                    </div>
                </div>
            ) : (
                <div>No Raffle Address found</div>
            )}
        </div>
    )
}
