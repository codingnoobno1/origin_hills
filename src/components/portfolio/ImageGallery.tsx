import React from "react";

export const ImageGallery: React.FC = () => {
  const photos = [
    {
      url: "https://images.unsplash.com/photo-1563822249548-9a72b6353cd1?q=80&w=1974&auto=format&fit=crop",
      title: "Silver Needle Buds Drying",
      category: "Harvest",
    },
    {
      url: "https://images.unsplash.com/photo-1594631252845-29fc4586d52c?q=80&w=1974&auto=format&fit=crop",
      title: "Steeping in Gaiwan Vessel",
      category: "Ritual",
    },
    {
      url: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?q=80&w=2070&auto=format&fit=crop",
      title: "Fresh Dew Dry Green Leaves",
      category: "Botanicals",
    },
    {
      url: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1974&auto=format&fit=crop",
      title: "Porous Clay Teapot steeping",
      category: "Vessels",
    },
  ];

  return (
    <section className="py-24 bg-ivory border-t border-gold/15">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-gold mb-3 block">
            VISUAL Manifest
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-forest font-light tracking-wide">
            Sensory Textures
          </h2>
          <div className="w-10 h-px bg-gold/50 mx-auto my-4" />
        </div>

        {/* Mosaic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative aspect-[3/4] overflow-hidden bg-forest/5 group border border-gold/10"
            >
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105"
                loading="lazy"
              />
              {/* Subtle hover details */}
              <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-750 flex flex-col justify-end p-6">
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-gold mb-1">
                  {photo.category}
                </span>
                <h4 className="text-sm font-serif text-ivory tracking-wide font-light">
                  {photo.title}
                </h4>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
