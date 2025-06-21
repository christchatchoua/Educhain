import { Link } from 'react-router-dom';
import './Home.css';
import logo from '../assets/images/cameroon-flag.png';
import issuerIcon from '../assets/images/user-icon.svg';
import walletIcon from '../assets/images/wallet-icon.svg';
import verifierIcon from '../assets/images/checkmark-icon.svg';

export default function Home() {
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
            <Link to="/issuer" className="ecm-card">
              <img src={issuerIcon} alt="Issuer Icon" className="ecm-card-icon" />
              <div className="ecm-card-title">Issuer</div>
              <div className="ecm-card-desc">Issue digital certificates with cryptographic security.</div>
            </Link>
            <Link to="/wallet" className="ecm-card">
              <img src={walletIcon} alt="Wallet Icon" className="ecm-card-icon" />
              <div className="ecm-card-title">Wallet</div>
              <div className="ecm-card-desc">Securely manage and share your academic credentials.</div>
            </Link>
            <Link to="/verifier" className="ecm-card">
              <img src={verifierIcon} alt="Verifier Icon" className="ecm-card-icon" />
              <div className="ecm-card-title">Verifier</div>
              <div className="ecm-card-desc">Verify degrees and academic history instantly.</div>
            </Link>
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
