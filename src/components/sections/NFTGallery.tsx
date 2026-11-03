import type { FC } from "react";
import { FiExternalLink } from "react-icons/fi";
import { nftCollections, nfts } from "../../data/nfts";
import { NFTCard } from "../ui/NFTCard";
import { Section } from "../ui/Section";

export const NFTGallery: FC = () => {
  return (
    <Section
      id="nft-gallery"
      title="NFT Collection"
      sectionStyle={{
        contentVisibility: "auto",
        containIntrinsicSize: "auto 1400px",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {nfts.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>

      <div className="mt-16">
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="text-3xl font-bold" style={{ color: "#0d61ff" }}>
            ꜩ
          </span>
          <h3 className="text-2xl font-bold text-text-primary text-center">
            Explore Full Collections
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nftCollections.map((collection) => (
            <a
              key={collection.id}
              href={collection.collectionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-black/70 border border-purple-500/20 rounded-lg overflow-hidden hover:border-purple-500/50 transition-colors duration-300"
              style={{
                boxShadow: "0 0 20px rgba(168, 85, 247, 0.15)",
              }}
            >
              <div className="relative aspect-square overflow-hidden bg-background">
                <img
                  src={collection.coverImage}
                  alt={collection.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-lg font-semibold text-text-primary group-hover:text-purple-400 transition-colors duration-300">
                    {collection.name}
                  </h4>
                  <FiExternalLink
                    className="text-purple-400 shrink-0"
                    size={20}
                  />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
};
