import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

function About() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Başlık */}
        <h2 className="text-4xl font-black text-slate-800 mb-10 text-center">Hakkımızda</h2>
        
        {/* Görseller */}
        <PhotoProvider>
          <div className="grid grid-cols-2 gap-4 mb-10">
            <PhotoView src="/asansorkapi.png">
              <img src="/asansorkapi.png" alt="Asansör Kapısı" className="rounded-2xl shadow-lg w-full h-64 object-cover cursor-pointer hover:scale-105 transition-transform" />
            </PhotoView>
            <PhotoView src="/asansorkapi1.png">
              <img src="/asansorkapi1.png" alt="Asansör Kapısı Detay" className="rounded-2xl shadow-lg w-full h-64 object-cover cursor-pointer hover:scale-105 transition-transform" />
            </PhotoView>
          </div>
        </PhotoProvider>

        {/* Metin İçeriği */}
        <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
          <p>
            <strong className="text-blue-600">Has Door</strong>, Şanlıurfa merkezli, asansör kapı sistemleri üretimi alanında faaliyet gösteren yenilikçi bir imalat firmasıdır. 
            Kalite, güvenlik ve dayanıklılığı temel prensip edinerek; konut, ticari yapı ve endüstriyel projeler için modern asansör kapı çözümleri üretmektedir.
          </p>
          
          <p>
            Üretim süreçlerimizde ileri teknolojiyi, mühendislik bakış açısını ve titiz işçiliği bir araya getirerek ulusal ve uluslararası kalite standartlarına uygun ürünler geliştiriyoruz. 
            Her ürünümüz; uzun ömürlü kullanım, yüksek performans ve estetik tasarım anlayışıyla üretilmektedir.
          </p>

          <p>
            Müşteri memnuniyetini ön planda tutan hizmet anlayışımız sayesinde, proje ihtiyaçlarına özel çözümler sunuyor; 
            üretimden teslimata kadar tüm süreçlerde güvenilir bir iş ortağı olmayı hedefliyoruz.
          </p>

          {/* Vizyon ve Misyon Kutusu */}
          <div className="bg-slate-50 p-8 rounded-3xl border-l-4 border-blue-600 mt-10">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Vizyon & Misyon</h3>
            <p className="mb-4">
              <strong>Vizyonumuz:</strong> Türkiye'de asansör kapı sistemleri sektörünün öncü markalarından biri olmak ve kaliteli üretim anlayışımızı uluslararası pazarlara taşımaktır.
            </p>
            <p>
              <strong>Misyonumuz:</strong> Güvenli, dayanıklı ve yenilikçi ürünlerle müşterilerimize uzun yıllar değer katmaktır.
            </p>
          </div>

          <p className="mt-8 italic text-center font-medium text-slate-700">
            Has Door olarak her zaman kaliteyi, güveni ve sürdürülebilir üretimi ön planda tutarak geleceğin yapılarına değer katmaya devam ediyoruz.
          </p>
        </div>
      </div>
    </section>
  )
}

export default About