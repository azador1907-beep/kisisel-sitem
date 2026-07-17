function Contact() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-black text-slate-800 mb-12 text-center">İletişim</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          {/* İletişim Bilgileri */}
          <div className="bg-white p-10 rounded-3xl shadow-lg border border-slate-100">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Has Door Asansör İletişim</h3>
            <div className="space-y-4 text-slate-600">
              <p><strong>Adres:</strong> Kadıkendi Mah. 8515 Cad. No: 2 B Eyyübiye/ŞANLIURFA</p>
              <p><strong>Telefon 1:</strong> +90 544 389 01 85</p>
              <p><strong>Telefon 2:</strong> +90 542 409 36 17</p>
              <p className="text-sm mt-4 text-slate-400">Vergi Dairesi: Şehitlik V. D. | Sicil No: 32913</p>
            </div>
            
            {/* Güncellenmiş Form */}
            <form action="https://formspree.io/f/mnjepbzy" method="POST" className="mt-8 grid gap-4">
              <input type="text" name="name" placeholder="Adınız Soyadınız" className="p-3 border rounded-xl w-full" required />
              <input type="email" name="email" placeholder="E-posta Adresiniz" className="p-3 border rounded-xl w-full" required />
              <textarea name="message" placeholder="Mesajınız" rows="4" className="p-3 border rounded-xl w-full" required></textarea>
              <button type="submit" className="bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">Mesajı Gönder</button>
            </form>
          </div>

          {/* Google Harita */}
          <div className="h-full rounded-3xl overflow-hidden shadow-lg min-h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3161.464670603848!2d38.749008976192174!3d37.15858067219503!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4073f47c94511855%3A0x6b00000000000000!2sKad%C4%B1kendi%2C%208515.%20Cd.%20No%3A2%2C%2063200%20Eyy%C3%BCbiye%2F%C5%9Eanl%C4%B1urfa!5e0!3m2!1str!2str!4v1690000000000!5m2!1str!2str"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Has Door Lokasyon"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact