import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import './Home.css';
import logo from '../assets/images/cameroon-flag.png';
import issuerIcon from '../assets/images/user-icon.svg';
import walletIcon from '../assets/images/wallet-icon.svg';
import verifierIcon from '../assets/images/checkmark-icon.svg';

export default function Home() {
  const navigate = useNavigate();

  // Simple check for authenticated user
  const isAuthenticated = () => {
    const user = supabase.auth.getUser();
    return user && user.id;
  };

  const handleCardClick = async (role) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      if (role === 'issuer') navigate('/issuer');
      else if (role === 'wallet') navigate('/wallet');
      else if (role === 'verifier') navigate('/verifier');
    } else {
      navigate('/auth', { state: { intendedRole: role } });
    }
  };

  return (
    <div className="ecm-home-root">
      {/* Hero Section */}
      <section className="ecm-hero">
        <div className="ecm-hero-content">
          <div className="ecm-brand">
            <img src={logo} alt="Cameroon Logo" className="ecm-logo" />
            <h1 className="ecm-brand-name">EduChain CM</h1>
          </div>
          <h2 className="ecm-hero-headline">Reimagining Trust in Academic Credentials</h2>
          <p className="ecm-hero-subheadline">
            EduChain CM allows institutions to issue secure, verifiable academic certificates on the blockchain.
          </p>
          <div className="ecm-card-row">
            <button className="ecm-card" onClick={() => handleCardClick('issuer')}>
              <img src={issuerIcon} alt="Issuer Icon" className="ecm-card-icon" />
              <div className="ecm-card-title">Issuer</div>
              <div className="ecm-card-desc">Issue digital certificates with cryptographic security.</div>
            </button>
            <button className="ecm-card" onClick={() => handleCardClick('wallet')}>
              <img src={walletIcon} alt="Wallet Icon" className="ecm-card-icon" />
              <div className="ecm-card-title">Wallet</div>
              <div className="ecm-card-desc">Securely manage and share your academic credentials.</div>
            </button>
            <button className="ecm-card" onClick={() => handleCardClick('verifier')}>
              <img src={verifierIcon} alt="Verifier Icon" className="ecm-card-icon" />
              <div className="ecm-card-title">Verifier</div>
              <div className="ecm-card-desc">Verify degrees and academic history instantly.</div>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ecm-footer">
        <div className="ecm-footer-content">
          <div className="ecm-footer-brand">EduChain CM</div>
          <p className="ecm-footer-desc">Blockchain-based academic verification system for Cameroonian institutions.</p>
          <div className="ecm-footer-links">
            <a href="#about" className="ecm-footer-link">About</a>
            <a href="#contact" className="ecm-footer-link">Contact</a>
            <a href="#terms" className="ecm-footer-link">Terms</a>
          </div>
          <div className="ecm-footer-copyright">
            © {new Date().getFullYear()} EduChain CM. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
