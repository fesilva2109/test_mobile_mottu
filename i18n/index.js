import { I18n } from 'i18n-js';
import pt from './pt.json';
import es from './es.json';

const i18n = new I18n({
  pt,
  es,
});

i18n.enableFallback = true;
i18n.defaultLocale = 'pt';

export default i18n;
