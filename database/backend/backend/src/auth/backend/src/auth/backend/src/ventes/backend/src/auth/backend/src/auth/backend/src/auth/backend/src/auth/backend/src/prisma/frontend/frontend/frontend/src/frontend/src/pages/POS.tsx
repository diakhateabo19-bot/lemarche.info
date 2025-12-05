import { useState, useEffect } from 'react';
import axios from 'axios';

export default function POS() {
  const [code, setCode] = useState('');
  const [panier, setPanier] = useState<any[]>([]);
  const [ventesDuJour, setVentesDuJour] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Charger les ventes du jour au démarrage
  useEffect(() => {
    loadVentesDuJour();
  }, []);

  const loadVentesDuJour = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/ventes/mes-ventes-du-jour', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVentesDuJour(res.data);
    } catch (err) {
      console.log('Pas encore de ventes aujourd’hui');
    }
  };

  const ajouterProduit = async () => {
    if (!code) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3001/produits/code/${code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPanier([...panier, { ...res.data, quantite: 1 }]);
      setCode('');
    } catch (err) {
      alert('Produit non trouvé');
    }
  };

  const validerVente = async () => {
    if (panier.length === 0) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/ventes', {
        details: panier.map(p => ({ produitId: p.id, quantite: p.quantite })),
        modePaiement: 'CASH',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Vente enregistrée ! Ticket généré');
      setPanier([]);
      loadVentesDuJour();
    } catch (err) {
      alert('Erreur lors de la vente');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">POS - {user.nom}</h1>

        {/* Scanner */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <input
            type="text"
            placeholder="Scanner code-barres ou taper..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && ajouterProduit()}
            className="w-full text-2xl p-4 border-2 border-green-600 rounded-lg text-center"
            autoFocus
          />
        </div>

        {/* Panier */}
        <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
          <h2 className="bg-green-600 text-white p-4 text-xl">Panier</h2>
          {panier.length === 0 ? (
            <p className="p-8 text-center text-gray-500">Aucun produit</p>
          ) : (
            <div className="p-4">
              {panier.map((item, i) => (
                <div key={i} className="flex justify-between py-2 border-b">
                  <span>{item.nom}</span>
                  <span>{item.prix} FCFA</span>
                </div>
              ))}
              <div className="text-2xl font-bold text-right mt-4">
                Total : {panier.reduce((a, b) => a + b.prix, 0)} FCFA
              </div>
              <button
                onClick={validerVente}
                className="w-full mt-4 bg-green-600 text-white py-6 text-2xl rounded-lg hover:bg-green-700"
              >
                Valider la vente
              </button>
            </div>
          )}
        </div>

        {/* Ventes du jour */}
        <div className="bg-white rounded-xl shadow">
          <h2 className="bg-blue-600 text-white p-4 text-xl">Ventes du jour</h2>
          {ventesDuJour.length === 0 ? (
            <p className="p-8 text-center text-gray-500">Aucune vente aujourd’hui</p>
          ) : (
            <div className="p-4 space-y-2">
              {ventesDuJour.map((v: any) => (
                <div key={v.id} className="flex justify-between py-2 border-b">
                  <span>{new Date(v.dateHeure).toLocaleTimeString('fr-FR')}</span>
                  <span className="font-bold">{v.montantTotal} FCFA</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
