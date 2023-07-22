import { ConnectButton } from "web3uikit"
export default function Header() {
    return (
        <div className="p-5 flex flex-row border-b-2">
            <h1 className="py-4 px-4 fonr-blog text-3xl">
                Decentralised Lottery
                <ConnectButton moralisAuth={false} />
            </h1>
        </div>
    )
}
