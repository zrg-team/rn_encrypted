import React from 'react';
import { useTranslation } from 'react-i18next';
import DefaultPage from '../common/hocs/DefaultPage';
import '../styles/MainPage.css';

const MainPage = () => {
  const { t } = useTranslation();

  return (
    <DefaultPage containerStyle={{ backgroundColor: '#F5F5F5' }}>
      <header className="main-header">
        <h1>{t('login_page.login_form_title')}</h1>
        <h2>{t('login_page.login_form_subtitle')}</h2>
      </header>
      <main className="main-content">
        <p>{t('card.default_content')}</p>
      </main>
      <footer className="main-footer">
        <span>{t('footer.default_text')}</span>
      </footer>
    </DefaultPage>
  );
};

export default MainPage;