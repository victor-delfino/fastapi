import './Footer.css';

export const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>📦 Sistema de Produtos</h3>
          <p>Gerencie seus produtos de forma simples e eficiente</p>
        </div>

        <div className="footer-section">
          <h4>Links Rápidos</h4>
          <ul>
            <li><a href="#produtos">Produtos</a></li>
            <li><a href="#adicionar">Adicionar Produto</a></li>
            <li><a href="#perfil">Meu Perfil</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Suporte</h4>
          <ul>
            <li><a href="#ajuda">Central de Ajuda</a></li>
            <li><a href="#contato">Contato</a></li>
            <li><a href="#docs">Documentação</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Conecte-se</h4>
          <div className="social-links">
            <a href="#github" title="GitHub">💻</a>
            <a href="#linkedin" title="LinkedIn">🔗</a>
            <a href="#twitter" title="Twitter">🐦</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Sistema de Produtos. Todos os direitos reservados.</p>
        <p className="tech-stack">
          Desenvolvido com ⚡ FastAPI + ⚛️ React + 💙 TypeScript
        </p>
      </div>
    </footer>
  );
};
