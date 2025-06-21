import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="ecm-home-root">
      <section className="ecm-hero">
        <div className="ecm-hero-content">
          <h1 className="ecm-hero-headline">Reimagining Trust in Academic Credentials</h1>
          <p className="ecm-hero-subheadline">EduChain CM lets institutions issue secure, verifiable digital degrees on the blockchain.</p>
          <div className="ecm-card-row">
            <Link to="/issuer" className="ecm-card">
              <div className="ecm-card-title">Issuer</div>
              <div className="ecm-card-desc">For institutions to issue digital certificates</div>
            </Link>
            <Link to="/wallet" className="ecm-card">
              <div className="ecm-card-title">Wallet</div>
              <div className="ecm-card-desc">For students to manage and share credentials</div>
            </Link>
            <Link to="/verifier" className="ecm-card">
              <div className="ecm-card-title">Verifier</div>
              <div className="ecm-card-desc">For employers to verify academic credentials</div>
            </Link>
          </div>
        </div>
      </section>
      <footer className="ecm-footer">
        <div>EduChain CM — Powered by trust, secured by blockchain.</div>
        <div className="ecm-footer-copyright">© {new Date().getFullYear()} EduChain CM</div>
      </footer>
    </div>
  );
} 