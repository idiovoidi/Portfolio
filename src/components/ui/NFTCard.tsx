import type React from "react";
import { FaEthereum } from "react-icons/fa";
import { RiNftLine } from "react-icons/ri";
import type { NFT } from "../../data/nfts";
import { useTilt } from "../../hooks/useTilt";

export interface NFTCardProps {
  nft: NFT;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft }) => {
  const getBlockchainIcon = () => {
    switch (nft.blockchain.toLowerCase()) {
      case "tezos":
        return (
          <span className="text-lg font-bold" style={{ color: "#0d61ff" }}>
            ꜩ
          </span>
        );
      case "ethereum":
        return <FaEthereum className="text-accent-primary" size={20} />;
      default:
        return <RiNftLine className="text-accent-primary" size={20} />;
    }
  };

  // 3D Tilt effect
  const {
    ref: tiltRef,
    tiltStyle,
    glareStyle,
  } = useTilt({
    maxTilt: 10,
    perspective: 1000,
    scale: 1.05,
    speed: 400,
    glare: true,
    maxGlare: 0.3,
  });

  return (
    <div
      ref={tiltRef}
      style={{
        ...tiltStyle,
        transformStyle: "preserve-3d",
      }}
    >
      <a
        href={nft.marketplaceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block bg-black/70 border border-purple-500/20 rounded-lg overflow-hidden hover:border-purple-500/50 transition-colors duration-300 cursor-pointer"
      >
        {/* Glare Effect Overlay */}
        {glareStyle && <div style={glareStyle} />}
        {/* NFT Image */}
        <div className="relative aspect-square overflow-hidden bg-background">
          <img
            src={nft.image}
            alt={nft.title}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 pointer-events-none">
            <span className="text-purple-400 font-medium">View NFT</span>
          </div>

          {/* Blockchain Badge */}
          <div className="absolute top-3 right-3 bg-background/90 px-3 py-1.5 rounded-full flex items-center gap-2 border border-accent-primary/30">
            {getBlockchainIcon()}
            <span className="text-xs font-medium text-text-primary">
              {nft.blockchain}
            </span>
          </div>
        </div>

        {/* NFT Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-text-primary mb-1 group-hover:text-purple-400 transition-colors duration-300">
            {nft.title}
          </h3>

          <p className="text-sm text-text-secondary mb-3">{nft.collection}</p>

          {nft.description && (
            <p className="text-sm text-text-secondary line-clamp-2">
              {nft.description}
            </p>
          )}
        </div>

        {/* Glow Effect on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
        </div>
      </a>
    </div>
  );
};

export { NFTCard };
export default NFTCard;
