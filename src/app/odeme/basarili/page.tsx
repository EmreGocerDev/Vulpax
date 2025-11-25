export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-green-500/30 p-8 rounded-lg max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Ödeme Başarılı!</h1>
        <p className="text-zinc-400 mb-8">
          Ödemeniz başarıyla alındı. Siparişiniz işleme konulmuştur.
        </p>
        <a href="/" className="primary-button inline-block">
          ANA SAYFAYA DÖN
        </a>
      </div>
    </div>
  );
}
