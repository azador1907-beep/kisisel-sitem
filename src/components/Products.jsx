import { useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function Products() {
  const flipBook = useRef(null);
  
  const images = [
    "katalog.png", "katalog1.png", "katalog2.png", "katalog3.png", 
    "katalog5.png", "katalog6.png", "katalog7.png", "katalog8.png", 
    "katalog9.png", "katalog10.png", "katalog11.png", "katalog12.png", 
    "katalog13.png", "katalog14.png"
  ];

  return (
    <section className="py-20 bg-slate-100 min-h-screen flex flex-col items-center">
      <h2 className="text-4xl font-black text-slate-800 mb-12">Ürün Kataloğumuz</h2>
      
      {/* Kitap ve butonları kapsayan alan */}
      <div className="relative flex items-center gap-8">
        
        {/* Sol Buton */}
        <button 
          onClick={() => flipBook.current.pageFlip().flipPrev()}
          className="p-4 bg-black text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg"
        >
          <ChevronLeft size={40} />
        </button>

        {/* Kitap */}
        <div className="shadow-2xl">
          <HTMLFlipBook 
            width={400} 
            height={550} 
            ref={flipBook}
            showCover={true}
          >
            {images.map((img, index) => (
              <div key={index} className="bg-white">
                <img src={`/${img}`} alt={`Sayfa ${index}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </HTMLFlipBook>
        </div>

        {/* Sağ Buton */}
        <button 
          onClick={() => flipBook.current.pageFlip().flipNext()}
          className="p-4 bg-black text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg"
        >
          <ChevronRight size={40} />
        </button>
      </div>

      <a href="/katalog.pdf" download className="mt-12 text-slate-600 font-semibold underline">
        Kataloğu PDF Olarak İndir
      </a>
    </section>
  )
}

export default Products